---
id: smart-rollups-tutorial
title: Create a smart rollup
lastUpdated: 5th October 2023
---

This tutorial covers how to deploy a smart rollup in a Tezos sandbox.
To run this tutorial, you should have a basic understanding of how Tezos works and the ability to use the command-line terminal on your computer.
If you are new to Tezos, try the tutorial [Deploy a smart contract](../deploy-your-first-smart-contract) first.

In this tutorial, you will learn:

- What a smart rollup is and how they help scale Tezos
- How information passes between Tezos and smart rollups
- How to respond to messages from Tezos in a smart rollup
- How to send messages from a smart rollup to Tezos

## What is a smart rollup?

Smart rollups are processing units that run outside the Tezos network but communicate with Tezos on a regular basis.
These processing units can run arbitrarily large amounts of code without waiting for Tezos baking nodes to run and verify that code.
Smart rollups use Tezos for information and transactions but can run large applications at their own speed, independently of the Tezos baking system.

In this way, smart rollups allow Tezos to scale to support large, complex applications without slowing Tezos itself.
The processing that runs on Tezos itself is referred to as _layer 1_ and the processing that smart rollups run is referred to as _layer 2_.

Smart rollups can run any kind of applications that they want, such as:

- Financial applications that use information and transactions from Tezos
- Gaming applications that manipulate assets and keep them in sync with Tezos
- Applications that run complex logic on NFTs or other types of tokens
- Applications that communicate with other blockchains

Smart rollups stay in sync with Tezos by passing messages to Tezos and receiving messages from Tezos and other rollups.
Each Tezos block contains a global rollups inbox that contains messages from Tezos layer 1 to all rollups.
Anyone can add a message to this inbox and all messages are visible to all rollups.
Rollups receive this inbox, filter it to the messages that they are interested in, and act on them accordingly.

Rollups also have an outbox, which consists of calls to smart contracts on layer 1.
These calls are how rollups send messages back to Tezos.

Rollups maintain consensus by publishing the hash of their state to Tezos, which other nodes can use to verify the rollup.
The specific way that rollups publish their states and maintain consensus is beyond the scope of this tutorial.
For more information about rollups and their consensus mechanism, see [Smart Optimistic Rollups](../../advanced-topics/smart-rollups/).

This diagram shows a smart rollup interacting with layer 1 by receiving a message, running processing based on that message, and sending a transaction to layer 1:

{% html htmlWrapperTag="div" %}

<div style="width: 640px; height: 480px; margin: 10px; position: relative;"><iframe allowfullscreen frameborder="0" style="width:640px; height:480px" src="https://lucid.app/documents/embedded/74fd884e-9c71-409e-b7d3-c3a871a17178" id="KYtBl2woQVuV"></iframe></div>

{% /html %}

## Smart rollup analogy

Businesses talk about _horizontal scaling_ versus _vertical scaling_.
If a business is growing and its employees are being overworked, the business could use vertical scaling to hire more employees or use better tools to improve the productivity of each employee.
Scaling Tezos in this way would mean using more processing power to process each new block, which would increase the cost to run baking nodes.
Also, if the business hires more employees, the amount of communication between employees increases because, for example, they have to make sure that they are working in the same way and not doing duplicate jobs.

By contrast, smart rollups behave like horizontal scaling.
In horizontal scaling, businesses create specialized teams that work on different portions of the workload.
These teams can work independently of other teams and take advantage of efficiencies of being focused on a specific task.
They also need to communicate less with other teams, which speeds up their work.
Smart rollups are like separate horizontally scaled teams, with Tezos layer 1 as the source of communication between teams.

## Prerequisites

To run this tutorial, make sure that the following tools are installed:

- [Docker](https://www.docker.com/)

- Rust

   The application in this tutorial uses Rust because of its support for WebAssembly (WASM), the language that smart rollups use to communicate.
   Rollups can use any language that has WASM compilation support.

   To install Rust via the `rustup` command, run this command:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

   You can see other ways of installing Rust at <https://www.rust-lang.org>.

- Clang and LLVM

   Clang and LLVM are required for compilation to WebAssembly.
   Version 11 or later of Clang is required.
   Here are instructions for installing the appropriate tools on different operating systems:

   **MacOS**

   ```bash
   brew install llvm
   export CC="$(brew --prefix llvm)/bin/clang"
   ```

   **Ubuntu**

   ```bash
   sudo apt-get install clang-11
   export CC=clang-11
   ```

   **Fedora**

   ```bash
   dnf install clang
   export CC=clang
   ```

   **Arch Linux**

   ```bash
   pacman -S clang
   export CC=clang
   ```

   The `export CC` command sets Clang as the default C/C++ compiler.

   After you run these commands, run `CC --version` to verify that you have version 11 or greater installed.

   Also, ensure that your version of Clang `wasm32` target with by running the command `CC -print-targets | grep WebAssembly` and verifying that the results include `wasm32`.

- AR (macOS only)

   To compile to WebAssembly on macOS, you need to use the LLVM archiver.
   If you've used Homebrew to install LLVM, you can configure it to use the archiver by running this command:

   ```bash
   export AR="$(brew --prefix llvm)/bin/llvm-ar"
   ```

- WebAssembly Toolkit

   The the [WebAssembly Toolkit (`wabt`)](https://github.com/WebAssembly/wabt) provides tooling for reducing (or _stripping_) the size of WebAssembly binaries (with the `wasm-strip` command) and conversion utilities between the textual and binary representations of WebAssembly (including the `wat2wasm` and `wasm2wat` commands).

   Most distributions ship a `wabt` package, which you can install with the appropriate command for your operating system:

   **MacOS**

   ```bash
   brew install wabt
   ```

   **Ubuntu**

   ```bash
   sudo apt install wabt
   ```

   **Fedora**

   ```bash
   dnf install wabt
   ```

   **Arch Linux**

   ```bash
   pacman -S wabt
   ```

   To verify that `wabt` is installed, run the command `wasm-strip --version` and verify that the version is at least 1.0.31.
   If not, you can download this version directly and extract its files: <https://github.com/WebAssembly/wabt/releases/tag/1.0.31>.
   Then, whenever you have to use `wasm-strip`, you can use `.<path_to_wabt_1.0.31>/bin/wasm-strip` instead.

## Tutorial application

Despite the number of command-line tools needed, the code for the core of the rollup itself is relatively simple.
This core is called the _kernel_ and is responsible for accepting messages from layer 1 and sending messages to layer 1.
It also updates its state to allow other rollup nodes to verify it.

The code for the tutorial application is here: <https://gitlab.com/trili/hello-world-kernel>.

The code for the kernel is in the `src/lib.rs` file.
It is written in the Rust programming language and looks like this:

```rust
use tezos_smart_rollup::inbox::InboxMessage;
use tezos_smart_rollup::kernel_entry;
use tezos_smart_rollup::michelson::MichelsonBytes;
use tezos_smart_rollup::prelude::*;

kernel_entry!(hello_kernel);

fn handle_message(host: &mut impl Runtime, msg: impl AsRef<[u8]>) {
    if let Some((_, msg)) = InboxMessage::<MichelsonBytes>::parse(msg.as_ref()).ok() {
        debug_msg!(host, "Got message: {:?}\n", msg);
    }
}

pub fn hello_kernel(host: &mut impl Runtime) {
    debug_msg!(host, "Hello, kernel!\n");

    while let Some(msg) = host.read_input().unwrap() {
        handle_message(host, msg);
    }
}
```

This example kernel has these major parts:

1. It imports resources that allow it to access and decode messages from layer 1.
1. It runs the Rust macro `kernel_entry!` to set the main function for the kernel.
1. It declares the `handle_message` function, which accepts, decodes, and processes messages from layer 1.
In this case, the function decodes the message (which is sent as a sequence of bytes) and prints it to the log.
The function could call any other logic that the application needs to run.
1. It declares the `hello_kernel` function, which prints a logging message each time it is called and then runs the `handle_message` function on each message from layer 1.

You don't need to access the other files in the application directly, but here are descriptions of them:

- `src/lib.rs`: The Rust code for the kernel
- `Cargo.toml`: The dependencies for the build process
- `rustup-toolchain.toml`: The required Rust version
- `sandbox_node.sh`: A script that sets up a Tezos sandbox for testing the rollup

The tutorial repository also includes two files that represent example message inboxes in layer 1 blocks:

- `empty_input.json`: An empty rollup message inbox
- `two_inputs.json`: A rollup message inbox with two messages




### 2.5. "Hello, World!" Kernel

To get started, we've prepared a [repository](https://gitlab.com/trili/hello-world-kernel) that helps you get started with kernel development quickly.

You can clone the repository as follows:

```bash!
git clone https://gitlab.com/trili/hello-world-kernel.git
cd hello-world-kernel/
```

Now, ensure that you have the `rust` version (run `cargo --version`) at least `1.66.0` installed. Otherwise, run the following:

```bash!
rustup override set 1.66.0
```

With `rustup`, you have to enable `WASM` as a compilation target using the following:

```bash!
rustup target add wasm32-unknown-unknown
```

You can now immediately build using:

```bash!
cargo build --target wasm32-unknown-unknown
```

After building it, you should be able to inspect the produced artifacts.

```bash!
ls -1 target/wasm32-unknown-unknown/debug
# build
# deps
# examples
# hello_world_kernel.d
# hello_world_kernel.wasm
# incremental
# libhello_world_kernel.d
# libhello_world_kernel.rlib
```

The most important item is `hello_world_kernel.wasm`, which is our readily compiled kernel.

## 3. Getting `Octez`

You need the `Octez` binaries to test locally and deploy a Smart Rollup kernel. `Octez` is distributed in multiple ways. In this tutorial, we strongly encourage using [Docker](https://www.docker.com/).

The [Octez container images](https://hub.docker.com/r/tezos/tezos/) are automatically generated from the [Tezos GitLab repository](https://gitlab.com/tezos/tezos), ensuring that you can always access the latest version of the `Octez` binaries.

To obtain the most recent image from our repository, execute the following command:

```bash!
docker pull tezos/tezos:master
```

Now, you can initiate an interactive (`-it`) session with `Docker` based on that image, which allows access to the kernel files created as part of this tutorial. To achieve this, you must mount the current directory (you must be in the `"Hello, World!" kernel` directory) within the container using the [`--volume`](https://docs.docker.com/storage/bind-mounts/) argument. Run the following command within the `"Hello, World!" kernel` directory:

```bash!
docker run -it --rm --volume $(pwd):/home/tezos/hello-world-kernel --entrypoint /bin/sh --name octez-container tezos/tezos:master
```

The `--rm` option is used so that the container that we created will be killed when we exit the `Docker` session.

In the rest of the tutorial, we will have to do work both inside and outside the `Docker` section(s). For clarity, we will specify where the commands
should be executed. The command above means we are now in `docker session 1`.

At this point, you should observe that the `"Hello, World!" kernel` directory is accessible and contains the kernel files previously created.

`docker session 1`

```bash!
ls -1 hello-world-kernel
# same contents as in the hello-world-kernel repository
```

At this stage, you can verify that the container image includes all the required executables:

`docker session 1`

```bash!
octez-node --version
# 6fb8d651 (2023-06-05 12:05:17 +0000) (0.0+dev)
octez-smart-rollup-wasm-debugger --version
# 6fb8d651 (2023-06-05 12:05:17 +0000) (0.0+dev)
octez-smart-rollup-node-alpha --version
# 6fb8d651 (2023-06-05 12:05:17 +0000) (0.0+dev)
octez-client --version
# 6fb8d651 (2023-06-05 12:05:17 +0000) (0.0+dev)
```

Please note that the version number mentioned may not precisely match the version you have locally, as the container images are periodically updated.

## 4. Processing the Kernel

### 4.1. Debugging the Kernel

Before originating a rollup, it can be helpful to observe the behavior of its kernel. To facilitate this, there is a dedicated `Octez` binary called `octez-smart-rollup-wasm-debugger`.
However, before using it, it is important to understand how the rollup receives its inputs. Each block at every level of the blockchain has a specific section dedicated to the shared and unique **smart rollup inbox**. Consequently, the inputs of a rollup can be seen as a list of inboxes for each level, or more precisely, a list of lists.
Let us start with a trivial inbox, which is stored in the `empty_input.json` file. We can debug the `"Hello, World!" kernel` with:

`docker session 1`

```bash!
cd hello-world-kernel
```

`docker session 1`

```bash!
octez-smart-rollup-wasm-debugger --kernel target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --inputs empty_input.json
```

Now you are in **debugging** mode, which is very well documented and explained in the [documentation](https://tezos.gitlab.io/alpha/smart_rollups.html#testing-your-kernel). Similar to how the rollup awaits internal messages from Layer 1 or external sources, the debugger also waits for inputs.

Once we're in the debugger REPL (read–eval–print loop), you can run the kernel for one level using the `step inbox` command:

`docker session 1`

```bash!
> step inbox
# Loaded 0 inputs at level 0
# Hello, kernel!
# Got message: Internal(StartOfLevel)!
# Got message: Internal(InfoPerLevel(InfoPerLevel { predecessor_timestamp: 1970-01-01T00:00:00Z, predecessor: BlockHash("BKiHLREqU3JkXfzEDYAkmmfX48gBDtYhMrpA98s7Aq4SzbUAB6M") }))!
# Got message: Internal(EndOfLevel)!
# Evaluation took 11000000000 ticks so far
# Status: Waiting for input
# Internal_status: Collect
```

Let us explain what our kernel is supposed to do:

- whenever it receives an input, it prints the `"Hello, kernel!"` message.
- whenever there is a message in the input, it is printed, because of the `handle_message` function.

It is important to understand that the **shared rollup inbox** has at each level at least the following **internal** messages:

- `StartOfLevel` -- marks the beginning of the inbox level and does not have any payload.
- `InfoPerLevel` -- provides the timestamp and block hash of the predecessor of the current Tezos block as payload.
- `EndOfLevel` -- pushed after the application of the operations of the Tezos block and does not have any payload.

You will notice that the behavior aligns with the expectations. You can also experiment with a non-empty input, such as `two_inputs.json`:

`docker session 1`

```bash!
octez-smart-rollup-wasm-debugger --kernel target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --inputs two_inputs.json
```

`docker session 1`

```bash!
> step inbox
# Loaded 2 inputs at level 0
# Hello, kernel!
# Got message: Internal(StartOfLevel)
# Got message: Internal(InfoPerLevel(InfoPerLevel { predecessor_timestamp: 1970-01-01T00:00:00Z, predecessor: BlockHash("BKiHLREqU3JkXfzEDYAkmmfX48gBDtYhMrpA98s7Aq4SzbUAB6M") }))
# Got message: External([26, 84, 104, 105, 115, 32, 109, 101, 115, 115, 97, 103, 101, 32, 105, 115, 32, 102, 111, 114, 32, 109, 101])
# Got message: External([5, 84, 104, 105, 115, 32, 111, 110, 101, 32, 105, 115, 110, 39, 116])
# Got message: Internal(EndOfLevel)
# Evaluation took 11000000000 ticks so far
# Status: Waiting for input
# Internal_status: Collect
```

As expected, the two messages from the input are also displayed as debug messages.
Feel free to explore additional examples from the dedicated [kernel gallery](https://gitlab.com/tezos/kernel-gallery/-/tree/main/) or create your own!

### 4.2. Reducing the Size of the Kernel

The origination process is similar to that of smart contracts. To originate a smart rollup, we have to consider the size of the kernel that will be deployed. The size of the kernel needs to be smaller than the manager operation size limit.

Regrettably, the size of the `.wasm` file is currently too large:

`docker session 1`

```bash!
du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm 
# 17.3M target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
```

To address this, we can use `wasm-strip`, a tool designed to reduce the size of kernels. It accomplishes this by removing unused parts of the `WebAssembly` module (e.g. dead code), which are not required for the execution of the rollups. Open a new terminal session and navigate to the `"Hello, world!" kernel ` directory since you do not have `wasm-strip` in your `Docker` session:

`outside docker session - hello-world-kernel`

```bash!
wasm-strip target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm 

du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
# 532.0K target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
```

The modifications from outside will get propagated to the interactive `Docker` session thanks to the `--volume` command option.

Undoubtedly, this process has effectively reduced the size of the kernel. However, there is still additional work required to ensure compliance with the manager operation size limit.

### 4.3. The Installer Kernel

Instead of using a kernel file for origination in the aforementioned format, an alternative approach is to utilize the **installer** version of the kernel. This **installer kernel** can be **upgraded** to the original version if provided with additional information in the form of **preimages**, which can be provided to the rollup node later on as part of its **reveal data channel**.

There are two ways to communicate with smart rollups:

1. **global inbox** -- allows Layer 1 to transmit information to all rollups. This unique inbox contains two kinds of messages: **external messages** are pushed through a Layer 1 manager operation, while **internal messages** are pushed by Layer 1 smart contracts or the protocol itself (e.g. `StartOfLevel`, `InfoPerLevel`, `EndOfLevel`).
2. **reveal data channel** -- allows the rollup to retrieve data (e.g. **preimages**) coming from data sources external to Layer 1.

The main benefit of the installer kernel is that it is small enough to be used in origination regardless of the kernel that it will be upgraded to.

There is an [installer kernel origination topic](https://tezos.stackexchange.com/questions/4784/how-to-originating-a-smart-rollup-with-an-installer-kernel/5794#5794) for this; please consult it for further clarifications. To generate the **installer kernel**, the `smart-rollup-installer` tool is required:

`outside docker session - hello-world-kernel`

```bash!
cargo install tezos-smart-rollup-installer
```

To create the installer kernel from the initial kernel:

`outside docker session - hello-world-kernel`

```bash!
smart-rollup-installer get-reveal-installer --upgrade-to target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --output hello_world_kernel_installer.hex --preimages-dir preimages/
```

This command creates the following:

- `hello_world_kernel_installer.hex` -- the hexadecimal representation of the installer kernel to be used in the origination.
- `preimages/` -- a directory containing the preimages necessary for upgrading from the installer kernel to the original kernel. These preimages are transmitted to the rollup node that runs the installer kernel with the help of the [**reveal data channel**](https://tezos.gitlab.io/alpha/smart_rollups.html#reveal-data-channel).

Notice the reduced dimensions of the installer kernel:

`outside docker session - hello-world-kernel`

```bash!
du -h hello_world_kernel_installer.hex
# 36.0K hello_world_kernel_installer.hex
```

Because of the size of this installer kernel, you are now ready for deployment.

Note that this shows the size of the `hex` encoded file, which is larger than the actual binary size of the kernel that we originate.

## 5. Deploying the Kernel

### 5.1. Sandboxed Mode

Our goal now is to create a testing environment for originating our rollup with the created kernel. In the `hello-world-kernel` repository, we offer the `sandbox-node.sh` file, which does the following:

- configures the `Octez` node to operate in [**sandbox mode**](https://tezos.gitlab.io/user/sandbox.html).
- activates the `alpha` protocol by using an `activator` account.
- creates five test (bootstrapping) accounts used for manual [**baking**](https://opentezos.com/baking/cli-baker/).
- creates a loop of continuous baking.

Run the file with:

`docker session 1`

```bash!
./sandbox_node.sh
```

Ignore the "Unable to connect to the node" error, as it only comes once because the `octez-client` command was used while the node was not yet bootstrapped. The result should be a permanent loop containing:

`docker session 1`

```bash!
# Injected block at minimal timestamp
```

Leave that process running. Open a new `Docker` session, which works in the same container named `octez-container`:

`outside docker session - hello-world-kernel`

```bash!
docker exec -it octez-container /bin/sh
```

It is very important to remember to open a new terminal session and run the command above whenever we mention a "new `Docker` session" or when you see that the `docker session` counter has increased.

To check that the network has the correctly configured protocol:

`docker session 2`

```bash!
octez-client rpc get /chains/main/blocks/head/metadata | grep protocol

# "protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK",
# "next_protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK"
```

You are now ready for the Smart Rollup origination process.

### 5.2. Smart Rollup Origination

To originate a smart rollup using the `hello_world_kernel_installer` created above:

`docker session 2`

```bash!
octez-client originate smart rollup "test_smart_rollup" from "bootstrap1" of kind wasm_2_0_0 of type bytes with kernel file:hello-world-kernel/hello_world_kernel_installer.hex --burn-cap 3
```

```bash!
# > Node is bootstrapped.
# ...
# Smart rollup sr1B8HjmEaQ1sawZtnPU3YNEkYZavkv54M4z memorized as "test_smart_rollup"
```

In the command above, the `--burn-cap` option specifies the amount of ꜩ you are willing to "burn" (lose) to allocate storage in the global context of the blockchain for each rollup.

To run a rollup node for the rollup using the installer kernel, you need to copy the contents of the preimages directory to `${ROLLUP_NODE_DIR}/wasm_2_0_0/`. You can set `$ROLLUP_NODE_DIR` to `~/.tezos-rollup-node`, for instance:

`docker session 2`

```bash!
mkdir -p ~/.tezos-rollup-node/wasm_2_0_0

cp hello-world-kernel/preimages/* ~/.tezos-rollup-node/wasm_2_0_0/
```

You should now be able to **run** your rollup node:

`docker session 2`

```bash!
octez-smart-rollup-node-alpha run operator for "test_smart_rollup" with operators "bootstrap2" --data-dir ~/.tezos-rollup-node/ --log-kernel-debug --log-kernel-debug-file hello_kernel.debug
```

Leave this running as well, and open another `Docker` session, as already explained, with the `octez-container`.

Each time a block is baked, a new "Hello, kernel!" message should appear in the `hello_kernel.debug` file:

`docker session 3`

```bash!
tail -f hello_kernel.debug 
# Hello, kernel!
# Got message: Internal(StartOfLevel)
# Got message: Internal(InfoPerLevel(InfoPerLevel { predecessor_timestamp: 2023-06-07T15:31:09Z, predecessor: BlockHash("BLQucC2rFyNhoeW4tuh1zS1g6H6ukzs2DQDUYArWNALGr6g2Jdq") }))
# Got message: Internal(EndOfLevel)
# ... (repeats)
```

Finally, you have successfully deployed a very basic yet functional smart rollup.

### 5.3. Sending an Inbox Message to the Smart Rollup

We now want to send an external message into the rollup inbox, which should be read by our kernel and sent as a debug message. First, we will wait for it to appear using:

`docker session 3`

```bash!
tail -f hello_kernel.debug | grep External
```

Open yet another `Docker` session and send an external message into the rollup inbox. You can use the `Octez` client:

`docker session 4`

```bash!
octez-client send smart rollup message '[ "test" ]' from "bootstrap3"
```

Once you send the Smart Rollup message, you will notice that in the debug trace, you get:

`docker session 3`

```bash!
Got message: External([116, 101, 115, 116])
```

`116, 101, 115, 116` represent the bytes of "test".

### 5.4. Test Networks

In the above section, we proposed how to create your `Octez` binaries in **sandbox mode**. Here, we propose a different approach to that, using [test networks](https://teztnets.xyz/). We encourage the reader to try at least one of the following linked tutorials:

- [Ghostnet](https://teztnets.xyz/ghostnet-about) -- uses the protocol that `Mainnet` follows as well.
- [Nairobinet](https://teztnets.xyz/nairobinet-about) -- uses the `Nairobi` protocol.
- [Mondaynet](https://teztnets.xyz/mondaynet-about) -- uses the `alpha` protocol and resets every Monday.

The workflow should be similar to the one presented for the sandbox mode:

- **configure** the network;
- run a node (needs to synchronize with the network -- can make use of [snapshots](https://tezos.gitlab.io/user/snapshots.html));
- create test accounts (which should be funded by the appropriate **Faucet**);
- originate the rollup;
- run the rollup node;
- check the debug file.

## 6. Further References and Documentation

1. [Smart Rollup Documentation](https://tezos.gitlab.io/alpha/smart_rollups.html)
2. [Smart Rollup Kernel SDK Tutorial](https://gitlab.com/tezos/tezos/-/tree/master/src/kernel_sdk)
3. [Smart Rollup Kernel Examples](https://gitlab.com/tezos/kernel-gallery/-/tree/main/)
4. [Ghostnet Indexer](https://ghost.tzstats.com/)
5. [Blockchain Explorer](https://ghostnet.tzkt.io/)
6. [Tezos Smart Rollups Resources](https://airtable.com/shrvwpb63rhHMiDg9/tbl2GNV1AZL4dkGgq)
7. [Tezos Testnets](https://teztnets.xyz/)
8. [Origination of the Installer Kernel](https://tezos.stackexchange.com/questions/4784/how-to-originating-a-smart-rollup-with-an-installer-kernel/5794#5794)
9. [Docker Documentation](https://docs.docker.com/get-started/)
