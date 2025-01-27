---
title: "Part 2: Getting the DAL parameters"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 27 Jan 2025
---

The Data Availability Layer stores information about the available data in layer 1 blocks.
Each block has several byte-vectors called _slots_, each with a maximum size.
DAL users can add information about the available data as a _commitment_ in a slot.
These commitments refer to the data that is stored on the DAL, which stores the data in _pages_ as shown in this diagram:

![Two example blocks with different DAL slots in use in each](/img/architecture/dal-slots-in-blocks.png)
<!-- https://lucid.app/lucidchart/46fa8412-8443-4491-82f6-305aafaf85f2/edit -->

The data is broken into pages to ensure that each piece of data can fit in a single Tezos operation.
This data must fit in a single operation to allow the Smart Rollup refutation game to work, in which every execution step of the Smart Rollup must be provable to layer 1.
For more information about Smart Rollups, see [Smart Rollups](/architecture/smart-rollups).

When clients add data, they must specify which slot to add it to.
Note that because the DAL is permissionless, clients may try to add data to the same slot in the same block.
In this case, the first operation in the block takes precedence, which leaves the baker that creates the block in control of which data makes it into the block.
Other operations that try to add data to the same slot fail.

The number and size of these slots can change.
Different networks can have different DAL parameters.
Future changes to the protocol may allow the DAL to resize dynamically based on usage.

Therefore, clients must get information about the DAL before sending data to it.
Smart contracts can't access the DAL; it is intended for Smart Rollups, so in these steps you set up a simple Smart Rollup to get the current DAL parameters and print them to the log.

## Prerequisites

Before you begin, make sure that you have installed the prerequisites and set up an environment and an account as described in [Part 1: Setting up an environment](/tutorials/build-files-archive-with-dal/set-up-environment).

## Fetching the DAL parameters in a kernel

To get the DAL parameters, you can use built-in functions in the Tezos [Rust SDK](https://crates.io/crates/tezos-smart-rollup).

1. In a folder for your project, create a file named `Cargo.toml` with this code:

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

   If you set up your Docker container with a connected folder on the host machine, you can create this file in the connected folder and it will appear in the Docker container.

   As a reminder, the kernel of a Smart Rollup is a WASM program.
   The `proto-alpha` feature is necessary to get access to the functions specific to the DAL because they are not yet released in the main version of the Smart Rollup toolkit.

   If you need a text editor inside the Docker container, you can run `sudo apk add nano` to install the [Nano text editor](https://www.nano-editor.org/).
   If you set up the container with a volume, you can use any editor on your host machine to edit the file and it appears in the linked folder in the container.

1. Create a file named `src/lib.rs` to be the kernel.

1. In the `src/lib.rs` file, add this code:

   ```rust
   use tezos_smart_rollup::{kernel_entry, prelude::*};

   pub fn entry<R: Runtime>(host: &mut R) {
       let param = host.reveal_dal_parameters();
       debug_msg!(host, "{:?}\n", param);
   }

   kernel_entry!(entry);
   ```

   This function gets the DAL parameters of the currently connected network and prints them to the log.

1. From the folder that contains the `Cargo.toml` file, run this command to build the kernel:

   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

1. Run this command to copy the compiled kernel to the current folder:

   ```bash
   cp target/wasm32-unknown-unknown/release/files_archive.wasm .
   ```

1. Run these commands to get the installer kernel, which is a version of the kernel that contains only enough information to download and install the full kernel:

   ```bash
   cargo install tezos-smart-rollup-installer
   export PATH="${HOME}/.local/bin:${PATH}"
   smart-rollup-installer get-reveal-installer \
       -P _rollup_node/wasm_2_0_0 \
       -u files_archive.wasm \
       -o installer.hex
   ```

   For more information about optimizing the kernel and using installer kernels, see the tutorial [Deploy a Smart Rollup](/tutorials/smart-rollup).

Now the Smart Rollup is ready to deploy.

## Deploying the Smart Rollup and starting a node

Follow these steps to deploy the Smart Rollup to Ghostnet and start a node:

1. Run this command to deploy the Smart Rollup, replacing `my_wallet` with your Octez client account alias:

   ```bash
   octez-client originate smart rollup files_archive from my_wallet \
       of kind wasm_2_0_0 of type unit with kernel "$(cat installer.hex)" \
       --burn-cap 2.0 --force
   ```

   The Octez client assumes that your local node is running at http://127.0.0.1:8732.
   If your node is running at a different host name or port, pass the host name and port of the node to the `--endpoint` argument.
   For example, if the node is running on port 8733, include `--endpoint http://127.0.0.1:8733` in the command.

1. Start the Smart Rollup node with this command:

   ```bash
   octez-smart-rollup-node --endpoint http://127.0.0.1:8732 \
       run observer for files_archive with operators \
       --data-dir ./_rollup_node --log-kernel-debug
   ```

   For simplicity, this command runs the Smart Rollup in observer mode, which does not require a stake of 10,000 tez to publish commitments.

1. Leave the node running in that terminal window and open a new terminal window in the same environment.

1. Run this command to watch the node's log:

   ```bash
   tail -F _rollup_node/kernel.log
   ```

The log prints the current DAL parameters, as in this example:

```
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
```

These parameters are:

- `number_of_slots`: The number of slots in each block
- `slot_size`: The size of each slot in bytes
- `page_size`: The size of each page in bytes
- `attestation_lag`: The number of subsequent blocks in which bakers can attest that the data is available; if enough attestations are available by the time this number of blocks have been created, the data becomes available to Smart Rollups

## Setting up a deployment script

In later parts of this tutorial, you update and redeploy the Smart Rollup multiple times.
To simplify the process, you can use this script:

```bash
#!/bin/sh

alias="${1}"

set -e

cargo build --release --target wasm32-unknown-unknown

rm -rf _rollup_node

cp target/wasm32-unknown-unknown/release/files_archive.wasm .

smart-rollup-installer get-reveal-installer -P _rollup_node/wasm_2_0_0 \
  -u files_archive.wasm -o installer.hex

octez-client originate smart rollup files_archive from "${alias}" of kind wasm_2_0_0 \
  of type unit with kernel "$(cat installer.hex)" --burn-cap 2.0 --force

octez-smart-rollup-node --endpoint http://127.0.0.1:8732  \
  run observer for files_archive with operators --data-dir _rollup_node \
  --dal-node http://localhost:10732 --log-kernel-debug
```

To use it, save it in a file with an `sh` extension, such as `deploy_smart_rollup.sh` and give it executable permission by running `chmod +x deploy_smart_rollup.sh`.
Then you can run it any tme you update the `lib.rs` or `Cargo.toml` files to deploy a new Smart Rollup by passing your account alias, as in this example:

```bash
./deploy_smart_rollup.sh my_wallet
```

If you run this script and see an error that says that the file was not found, update the first line of the script (the shebang) to the path to your shell interpreter.
For example, if you are using the Tezos Docker image, the path is `/bin/sh`, so the first line is `#!/bin/sh`.
Then try the command `./deploy_smart_rollup.sh my_wallet` again.

In the next section, you will get information about the state of slots in the DAL.
See [Part 3: Getting slot information](/tutorials/build-files-archive-with-dal/get-slot-info).
