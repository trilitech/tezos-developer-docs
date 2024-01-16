---
title: Implementing a File Archive with the DAL and a Smart Rollup
authors: 'Tezos Core Developers'
last_update:
  date: 16 January 2024
---

The data availability layer (DAL) is a companion peer-to-peer network for the Tezos blockchain, designed to provide additional bandwidth to Smart Rollups.
It allows users to share large amounts of data in a way that is decentralized and permissionless, because anyone can join the network and post and read data on it.
For more information about the DAL, see [The Rollup Booster: A Data-Availability Layer for Tezos](https://research-development.nomadic-labs.com/data-availability-layer-tezos.html)

In this tutorial, you will learn:

- How data is organized and shared with the DAL and the reveal data channel
- How to read data from the DAL in a Smart Rollup
- How to host a DAL node
- How to publish data and files with the DAL

Because the DAL is not yet available on Tezos Mainnet, this tutorial uses the [Weeklynet test network](https://teztnets.xyz/weeklynet-about), which runs on a newer version of the protocol that includes the DAL.i

## Prerequisites

This article assumes some familiarity with Smart Rollups.
If you are new to Smart Rollups, see the tutorial [Deploy a Smart Rollup](./smart-rollup).

## Why the DAL?

The DAL has earned the nickname “Rollup Booster,” from its ability to address
the last bottleneck Smart Rollups developers could not overcome without
sacrificing decentralization: block space. See, Smart Rollups offload
*computation* from Layer 1, but the transactions they process still need to
originate from somewhere.

By default, that “somewhere” is the Layer 1’s blocks, yet the size of a Tezos’
block is limited to around 500KBytes. In this model, while Smart Rollups do not
compete for Layer 1 gas anymore, they still compete for block space and this
does not scale very well, does it?

Additionally, a Smart Rollup can fetch data from an additional source called the
“reveal channel,” which allows to retreive arbitrary data from its Blake2B hash.
The reveal channel is a pretty powerful primitive, as it allows Smart Rollups
operator to post hashes instead of full blown data onto the Layer 1. But it is a
double-edge sword, because nothing enforces the availability of the data in the
first place. [Solutions exist to address this
challenge](https://research-development.nomadic-labs.com/introducing-data-availability-committees.html),
but they are purely off-chain ones, coming with no guarantee from Layer 1.

Enters the DAL. Without entering too much into the details, the DAL is here for
third-parties to publish data, and the bakers attest they did. Once attested,
said data can be retreived by the Smart Rollup, without the need for
additional trusted third-parties.

## The Big Picture

Before diving into the code, we will first take a moment to understand how our
file archive will work. It can be broken down into 6 steps:

1. Users can post their file directly to the DAL, through a DAL node (they can
   use one set-up by third-parties, or start their own). They get some kind of
   certificate back (comprising a “commitment” and a “proof”).
2. They post this certificate to Layer 1 with an Octez client. The operation is
   way cheaper than effectively posting the file directly.
3. Following the creation of a block containing the certificate, a subset of
   Tezos’ bakers tries to download the file from the DAL, and if they succeed
   they attest it with a dedicated operation. They have a certain number of
   blocks to do so, and if they don’t by the end of this period, the certificate
   is considered bogus and the related data is dropped.
4. In parallel, new Tezos blocks are produced. Each time, our file archive
   Smart Rollup get some execution time (as all Smart Rollups do). Everytime this
   happens, our file archive Smart Rollup will try to fetch the latest
   attested data published on the DAL.
5. When that happens, the rollup node connects to a DAL node, to request the
   file. The DAL node being connected to the DAL network has already downloaded
   the file when it was published.
6. Once it has got access to the file, the Smart Rollup stores it in its durable
   storage addressed by its hash. Since the rollup node exposes a RPC to read
   the contents of its durable storage, it means users who know the hash of a
   file will be able to download it.

The overall workflow is summarized in the following figure.

![The Big Picture of our file archive](/img/tutorials/dal-tutorial.png)

This can feel a bit overwhelming, and to some extend it is. But what is
interesting here is that the difficult part (that is, steps 3 and 5) are
performed automatically by the various daemons provided in Octez.

## Implementing the Kernel

Thanks to the [Rust SDK](https://crates.io/crates/tezos-smart-rollup),
implementing a Smart Rollup kernel is fairly accessible.

We start with the following `Cargo.toml` file.


```toml
[package]
name = "files_archive"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
tezos-smart-rollup = { version = "0.2.2", features = [ "proto-alpha" ] }
```

As a reminder, the kernel of a Smart Rollup is a WASM program. You need to
install the `wasm32-unknown-unknown` target with rustup by running the command `rustup target add wasm32-unknown-unknown`. The `proto-alpha`
feature is necessary to get access to the functions specific to the DAL.

Since the file archive kernel is simple enough, we will put all its code in the
file `src/lib.rs`.

### Task 1. Fetching the DAL Parameters

Up until this point, we kept the discussion at a fairly high level of
abstraction. It is now time to be a bit more precise about how the DAL works.

For every Tezos block, the DAL allocates several byte-vectors called *slots*.
The size of a slot and the number of slots available for each Layer 1 block are
parameters of the network. It is possible for a kernel to get access to these
parameters using the `reveal_dal_parameters` function implemented in the
`tezos-smart-rollup-host`.

This function will return a value of the following type.

```rust
pub struct RollupDalParameters {
    pub number_of_slots: u64,
    pub attestation_lag: u64,
    pub slot_size: u64,
    pub page_size: u64,
}
```

In addition of `number_of_slots` and `slot_size`, the two
remaining fields also deserve our attention.

- From the perspective of the Smart Rollup, a slot is divided into _pages_, and
  a kernel can only fetch one page at a time. This is because, depending on the
  size of a slot, it might not be possible to fit it in a Tezos operation. Since
  every execution step of a Smart Rollup needs to be provable to the Layer 1 in
  order for the refutation game to work, breaking down a slot into smaller
  pieces (pages, in this case) is necessary.
- To attest that a slot has been published, bakers have some time which is expressed as a number of blocks. This number is `attestation_lag`.

Let’s revisit the Big Picture with this additional knowledge, in order to refine
it. Step 1 does not change: users keep posting data to DAL nodes, and get back
“certificates” they can forward to Layer 1. However, when they do (that is, step
2), they have to specify which slot they want to “fill” with their data, using
its index (from $0$ to $\mathrm{number\_of\_slots} - 1$). Since the DAL is a
permissionless network, any user can try to fill any slot. If two users compete
to use the same slot in the same Tezos block, the first operation of the block
wins the slot (leaving the baker creating the block the ultimate judge in the
matter).

So, to summarize:

- A slot for and index $I$ is published at a Tezos level $L$.
- Bakers responsible for attesting the slot $I$ have $\mathrm{attestation\_lag}$ blocks
  to do so.
- After $\mathrm{attestation\_lag}$ block, either the slot is indexed (if enough
  bakers have published the expected operation) or it is dropped and will never
  be accessible to Smart Rollups.
- Every attested slots can be retreived by a kernel.

As of January, 2024, Weeklynet’s DAL has 32 slots of 65KBytes usable per Tezos
block. You do not have to take my word for it, though. We can deploy a kernel on
Weeklynet to make sure of it.

Add this contents to `src/lib.rs`.

```rust
use tezos_smart_rollup::{kernel_entry, prelude::*};

pub fn entry<R: Runtime>(host: &mut R) {
    let param = host.reveal_dal_parameters();
    debug_msg!(host, "{:?}\n", param);
}

kernel_entry!(entry);
```

Next, build the rollup using Cargo.

```bash
cargo build --release --target wasm32-unknown-unknown
cp target/wasm32-unknown-unknown/release/files_archive.wasm .
```

:::note The Smart Rollup does not support the DAL
As of today, the Smart Rollup Installer does not support DAL as a
Data-Availability solution. This means we will need to rely on the reveal
channel to initialize our Smart Rollup correctly (which is not ideal for a
decentralized file archive).
:::

We will use `_rollup_node/` as the data directory for our rollup node.

```bash
cargo install tezos-smart-rollup-installer
export PATH="${HOME}/.local/bin:${PATH}"
smart-rollup-installer get-reveal-installer \
    -P _rollup_node/wasm_2_0_0 \
    -u files_archive.wasm \
    -o installer.hex
```

To deploy it, we need an implicit account of Weeklynet with enough tez.
Fortunately, you can use [a faucet for getting tez for free on
Weeklynet](https://teztnets.xyz/weeklynet-about) (but keep in mind that the
network is reset every Wednesday, so if you try to test this tutorial after a
reset you will need to request new tez).

:::warning Before interacting with Weeklynet
When interacting with Weeklynet, be sure to use the proper version of Octez,
as explained
[here](https://teztnets.xyz/weeklynet-about#join-the-weeklynet-network).
This article assumes your `PATH` has been updated accordingly.

Similarly, we assume the `ENDPOINT` environment variable has been set to the
public endpoint provided by the Teztnets infrastructure.
:::

Assuming `alice` is a valid alias for a provisioned implicit account,
originating our rollup is as simple as:

```bash
octez-client --endpoint ${ENDPOINT} \
    originate smart rollup files_archive from alice \
    of kind wasm_2_0_0 of type unit with kernel "$(cat installer.hex)" \
    --burn-cap 2.0 --force
```

And starting a rollup node in observer mode for this rollup can be done with
the following command.

```bash
octez-smart-rollup-node --endpoint ${ENDPOINT} \
    run observer for files_archive with operators \
    --data-dir ./_rollup_node --log-kernel-debug
```

To check that everything works as expected, we can have a look at the logs
generated by the kernel every block.

```bash
tail -F _rollup_node/kernel.log
```

```
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
```

We will deploy several (if not many) Smart Rollups in the course of this article.
As such, I suggest you save the following script at the root of your working
directory. It will come handy.

```bash
#!/usr/bin/bash

alias="${1}"

set -e

cargo build --release --target wasm32-unknown-unknown

rm -rf _rollup_node

cp target/wasm32-unknown-unknown/release/files_archive.wasm .

smart-rollup-installer get-reveal-installer -P _rollup_node/wasm_2_0_0 \
  -u files_archive.wasm -o installer.hex

octez-client --endpoint ${ENDPOINT} \
  originate smart rollup files_archive from "${alias}" of kind wasm_2_0_0 \
  of type unit with kernel "$(cat installer.hex)" --burn-cap 2.0 --force

octez-smart-rollup-node --endpoint ${ENDPOINT} \
  run observer for files_archive with operators --data-dir _rollup_node \
  --dal-node http://localhost:10732 --log-kernel-debug
```

### Task 2. Fetching Slots from the DAL

DAL is enabled on Weeklynet (otherwise, the `reveal_dal_parameters`
function would not have worked). Some slots (typically the ones at index 0, 30, and 31)
are used for running regression tests, as witnessed by Explorus’ [dedicated
page](https://beta.explorus.io/dal) to see the state (absent, published,
attested).

Doesn’t that make you curious?

We can modify our kernel to try to fetch the slot at index 0 for every Tezos
block. This requires to setup a DAL node of our own, but fortunately, it is
relatively straightforward. But we do need to understand what we are doing for
it to work.

In essence, the DAL relies on sharding to scale. Not every participant of the
network needs to download every data published there. On the contrary,
participants subscribe to certain slots indexes, and they will never have to
fetch data coming from slots they are not subscribed to. The same goes for
bakers by the way: they are assigned a subset of slots (whose size depends on
their stake) by the protocol.

Anyway, it means that when we start a DAL node, we decide to which slots index
they are subscribed to with the `--producer-profiles` command line argument. In
our case, we will first subscribe to the slot index 0.

```bash
octez-dal-node run --endpoint ${ENDPOINT} \
    --producer-profiles=0 --data-dir _dal_node
```

With a running DAL node, we can come back to our kernel.

What we want to do here is to try to fetch the first page of the slot 0 for
every new Tezos block. The change in `src/lib.rs` is reasonable.

```diff
-use tezos_smart_rollup::{kernel_entry, prelude::*};
+use tezos_smart_rollup::{host::RuntimeError, kernel_entry, prelude::*};
+use tezos_smart_rollup_host::dal_parameters::RollupDalParameters;
+
+pub fn run<R: Runtime>(
+    host: &mut R,
+    param: &RollupDalParameters,
+    index: u8,
+) -> Result<(), RuntimeError> {
+    let sol = host.read_input()?.unwrap();
+
+    let target_level = sol.level as usize - param.attestation_lag as usize;
+
+    let mut buffer = vec![0u8; param.page_size as usize];
+
+    let bytes_read = host.reveal_dal_page(target_level as i32, index, 0, &mut buffer)?;
+
+    if 0 < bytes_read {
+        debug_msg!(
+            host,
+            "Attested slot at index {} for level {}: {:?}\n",
+            index,
+            target_level,
+            &buffer.as_slice()[0..10]
+        );
+    } else {
+        debug_msg!(
+            host,
+            "No attested slot at index {} for level {}\n",
+            index,
+            target_level
+        );
+    }
+
+    Ok(())
+}

 pub fn entry<R: Runtime>(host: &mut R) {
     let param = host.reveal_dal_parameters();
     debug_msg!(host, "{:?}\n", param);
+
+    match run(host, &param, 0) {
+        Ok(()) => debug_msg!(host, "See you in the next level\n"),
+        Err(_) => debug_msg!(host, "Something went wrong for some reasons"),
+    }
 }

 kernel_entry!(entry);
```

The key change is the addition of the function `run`. We define this
function in order to be able to use the `?` operator of Rust by using
function returning the `Result` type and returning a `Result`
ourselves.

The `run` function proceeds as follows.

1. First, we use the DAL parameters to know the first level where a slot might
   be available (that is, $\mathrm{attestation\_lag}$ blocks in the past). To
   know the current Tezos level, we read the first message of the shared inbox
   (which always exists).
2. We allocate a `Vec<u8>` buffer of $\mathrm{page\_size}$ bytes.
3. We try to fill this buffer with the `read_dal_page` function provided
   by the SDK.
4. We check the value returned by the function, which is the number of bytes
   read. $0$ would mean the slot is not attested. Otherwise, it is necessarily
   $\mathrm{page\_size}$ in our case (since it is the size of the buffer).

Passing the DAL parameters as an argument for our function requires to import
the type, which is not correctly exported by the `tezos-smart-rollup` crate as
of version 0.2.0. This means we need to modify `Cargo.toml` to have direct
access to `tezos-smart-rollup-host`.

```diff
 [dependencies]
 tezos-smart-rollup = { version = "0.2.2", features = [ "proto-alpha" ] }
+tezos-smart-rollup-host = { version = "0.2.2", features = [ "proto-alpha" ] }
```

Repeating the commands to originate and run our Smart Rollup, we get the
following result after a while.

```
...
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
No attested slot at index 0 for level 56875
See you in the next level
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
Attested slot at index 0 for level 56876: [16, 0, 0, 2, 89, 87, 0, 0, 0, 0]
See you in the next level
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
No attested slot at index 0 for level 56877
See you in the next level
...
```

But at first, you are likely to be confused by the logs of the kernel. For the
first 4 Tezos blocks produced after the origination of the Smart Rollup, the
kernel will report that no slot has been attested for the targeted level, _even
if Explorus states the opposite_. This is because, as of January, 2024, a Smart
Rollup cannot fetch the content of a slot published before it is originated.
This is why you have to wait for 4 blocks before seeing slot page contents being
logged.

### Task 3. Publishing on the DAL

Fetching slots produced by the Tezos core developers in order to verify that the
DAL works as expected on Weeklynet is one thing, but we will not stop there.
The next task for us is to publish data of our own, and to verify our kernel is
indeed able to fetch it.

We will use the slot index 10 for this experiment.

:::note Planning ahead
Before trying to run the code yourself, have a look at Explorus and choose a
slot that is not currently being used.
:::

Kill your DAL node, and restart it with a new `--producer-profiles` argument.

```bash
octez-dal-node run --endpoint https://rpc.weeklynet-2024-01-03.teztnets.com \
    --producer-profiles=10 --data-dir _dal_node
```

Then, modify your kernel to read the contents of the 10th slot.

```diff
-    let bytes_read = host.reveal_dal_page(target_level as i32, 0, 0, &mut buffer)?;
+    let bytes_read = host.reveal_dal_page(target_level as i32, 10, 0, &mut buffer)?;
```

Recompile the kernel, and deploy it to Weeklynet. This time, it should not be
able to fetch the content of any slot, because no one is producing them.

#### Hello, World!

The DAL node exposes a RPC just for that: `POST /slots`, whose body is the
contents of the slot. Assuming you did not change the RPC server address,
then publishing a “Hello, world” to the DAL is as simple as:

```bash
curl localhost:10732/slot --data '"Hello, world!"' -H 'Content-Type: application/json'
```

This will return the certificate we mention at the beginning of this article.

```
{
  "commitment": "sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ",
  "commitment_proof":"8229c63b8e858d9a96321c80a204756020dd13243621c11bec61f182a23714cf6e0985675fff45f1164657ad0c7b9418"
}
```

:::warning Use the correct encoding
As hinted by the `Content-Type` header passed to `curl`, it is important that
argument given with `--data` is a valid JSON string.
:::

To post this certificate, takes the `commitment` and `commitment_proof` value
and execute the following `octez-client` command:

```bash
commitment="sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ"
proof="8229c63b8e858d9a96321c80a204756020dd13243621c11bec61f182a23714cf6e0985675fff45f1164657ad0c7b9418"
octez-client --endpoint ${ENDPOINT} \
    publish dal commitment "${commitment}" from alice for slot 10 \
    with proof "${proof}"
```

After four blocks, you should see something like that appear in your kernel
logs.

```
RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
Attested slot at index 10 for level 57293: [72, 101, 108, 108, 111, 44, 32, 119, 111, 114]
See you in the next level
```

Checking that these bytes are indeed the first ten characters of the string
`Hello, World!` is left for the readers.

#### Arbitrary Files

The DAL node is not limited to receiving JSON for publishing slots. It is also
possible to send raw bytes with the `application/octet-stream` Content-Type.
In this case, the data needs to be prefixed by its size. It is a bit annoying,
because this information is already contained in the HTML request sent to the
node, but for now this is the world we are living in.


```bash
#!/usr/bin/bash

path="${1}"
alias="${2}"
index="${3}"

target="$(mktemp)"
echo "storing temporary file at ${target}"
file_size="$(cat "${path}" | wc -c)"
slot_size_bin="$(printf "%08x" "${file_size}")"
slot_contents="$(cat ${path} | xxd -p)"

echo -n "${slot_size_bin}${slot_contents}" | xxd -p -r > "${target}"

certificate="$(curl localhost:10732/slot --data-binary "@${target}" -H 'Content-Type: application/octet-stream')"

echo "${certificate}"

commitment="$(echo -n ${certificate} | jq '.commitment' -r)"
proof="$(echo -n ${certificate} | jq '.commitment_proof' -r)"

octez-client --endpoint ${ENDPOINT} \
    publish dal commitment "${commitment}" from "${alias}" \
    for slot "${index}" with proof "${proof}"

rm "${target}"
```

The script expects three arguments: the file to post, the implicit account to
use to post on the Layer 1 and the slot index to use. This scripts, as the rest
of this article, assumes `PATH` and `ENDPOINT` are correctly set. Again, by
inspecting the logs of your kernel, you should be able to check that the file
you wanted to publish is indeed the one fetched by the Smart Rollup.

### Task 4. Fetching and Storing the Full Slot

There is only one thing left in order to complete our file archive. We can do
that by modifying the `run` function as follows.


```rust
pub fn run<R: Runtime>(
    host: &mut R,
    param: &RollupDalParameters,
    index: u8,
) -> Result<(), RuntimeError> {
    // Reading one message from the shared inbox is always safe,
    // because the shared inbox contains at least 3 messages per
    // Tezos block.
    let sol = host.read_input()?.unwrap();

    let target_level = sol.level as usize - param.attestation_lag as usize;

    let mut buffer = vec![0u8; param.slot_size as usize];

    let bytes_read = host.reveal_dal_page(target_level as i32, index, 0, &mut buffer)?;

    if bytes_read == 0 {
        debug_msg!(
            host,
            "No attested slot at index {} for level {}\n",
            index,
            target_level
        );

        return Ok(());
    }

    debug_msg!(
        host,
        "Attested slot at index {} for level {}\n",
        index,
        target_level
    );

    let num_pages = param.slot_size / param.page_size;

    for page_index in 1..num_pages {
        let _result = host.reveal_dal_page(
            target_level as i32,
            index,
            page_index.try_into().unwrap(),
            &mut buffer[page_index as usize * (param.page_size as usize)
                ..(page_index as usize + 1) * (param.page_size as usize)],
        );
    }

    let hash = blake2b::digest(&buffer, 32).unwrap();
    let key = hex::encode(hash);
    let path = OwnedPath::try_from(format!("/{}", key)).unwrap();

    debug_msg!(host, "Saving slot under `{}'\n", path);

    let () = host.store_write_all(&path, &buffer)?;

    Ok(())
}
```

There is a bit to unpack here.

1. First, we allocate a buffer of the size of a slot, not a size of the page.
2. Second, we try to fetch the contents of the first page. If 0 bytes are
   written by `reveal_dal_page`, then we know the targeted slot has not been
   attested for this block, and we have nothing left to do.
3. Otherwise, we read as many page as necessary to get the full slot.
4. Once it’s done, we store said slot in the durable storage, using the Blake2B
   hash (encoded in hexadecimal) as its key.

We use two additional dependencies for this: `tezos_crypto_rs` for hashing, and
`hex` for encoding.

```diff
+use tezos_crypto_rs::blake2b;
+use tezos_smart_rollup::storage::path::OwnedPath;
 use tezos_smart_rollup::{host::RuntimeError, kernel_entry, prelude::*};
 use tezos_smart_rollup_host::dal_parameters::RollupDalParameters;
```

```diff
 [dependencies]
 tezos-smart-rollup = { version = "0.2.2", features = [ "proto-alpha" ] }
 tezos-smart-rollup-host = { version = "0.2.2", features = [ "proto-alpha" ] }
+tezos_crypto_rs = { version = "0.5.2", default-features = false }
+hex = "0.4.3"
```

:::note
Adding `default-features = false` for `tezos_crypto_rs` is necessary for the
crate to be compatible with Smart Rollups.
:::

Deploy your Smart Rollup again, publish a file, wait for enough levels, and you
should see a line of log giving you the hash used to register the slot.

Assuming you have set the `hash` variable accordingly, then you can check the
file indeed exists (and later use `hexdump -C` to inspect its contents.

```bash
curl "http://localhost:8932/global/block/head/durable/wasm_2_0_0/value?key=/${hash}" \
    -H 'Content-Type: application/octet-stream' \
    -o slot.bin
```

:::note Why `diff` won’t work
You cannot use `diff` to ensure the file you originally published and the one
you downloaded from the rollup node are equal. Indeed, they are not: since
the size of a slot is fixed, the DAL node pads the value it receives from
`POST /slot`. in order to ensure it has the correct size.
:::

## Conclusion

Our file archive is now completed. At least, the features we wanted to
implement are there: a Smart Rollup storing in its durable storage the slots
attested at a given index.

From there, the sky’s the limit. More features could be implemented, like
having the files publishers pay for the storage they are using in Layer 2 (by
allowing them to deposit tez to the Smart Rollup, and sign the files they
publish). We could also build a frontend to visualize the files published in
our archive. Or, we could deal with the fact that for now, it is not possible
for a consumer of the file to know it’s original size (we could fix that by
modifying the script we use to publish a file to prefix it with its size).

