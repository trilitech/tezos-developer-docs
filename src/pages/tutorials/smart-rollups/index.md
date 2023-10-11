---
id: smart-rollups-tutorial
title: Deploy a smart rollup
lastUpdated: 11th October 2023
---

This tutorial covers how to deploy a smart rollup in a Tezos sandbox.
To run this tutorial, you should have a basic understanding of how Tezos works and the ability to use the command-line terminal on your computer.
If you are new to Tezos, try the tutorial [Deploy a smart contract](../deploy-your-first-smart-contract) first.

In this tutorial, you will learn:

- What a smart rollup is and how they help scale Tezos
- How information passes between Tezos and smart rollups
- How to respond to messages from Tezos in a smart rollup

{% comment %}
- How to send messages from a smart rollup to Tezos
{% /comment %}

## What is a smart rollup?

Smart rollups are processing units that run outside the Tezos network but communicate with Tezos on a regular basis.
These processing units can run arbitrarily large amounts of code without waiting for Tezos baking nodes to run and verify that code.
Smart rollups use Tezos for information and transactions but can run large applications at their own speed, independently of the Tezos baking system.

In this way, smart rollups allow Tezos to scale to support large, complex applications without slowing Tezos itself.
The processing that runs on Tezos itself is referred to as _layer 1_ and the processing that smart rollups run is referred to as _layer 2_.

Rollups also have an outbox, which consists of calls to smart contracts on layer 1.
These calls are how rollups send messages back to Tezos.

Smart rollups can run any kind of applications that they want, such as:

- Financial applications that use information and transactions from Tezos
- Gaming applications that manipulate assets and keep them in sync with Tezos
- Applications that run complex logic on NFTs or other types of tokens
- Applications that communicate with other blockchains

{% comment %}
TODO discuss reveal data channel
{% /comment %}

Rollups maintain consensus by publishing the hash of their state to Tezos, which other nodes can use to verify the rollup's behavior.
The specific way that rollups publish their states and maintain consensus is beyond the scope of this tutorial.
For more information about rollups and their consensus mechanism, see [Smart Optimistic Rollups](../../advanced-topics/smart-rollups/).

This diagram shows a smart rollup interacting with layer 1 by receiving a message, running processing based on that message, and sending a transaction to layer 1:

{% html htmlWrapperTag="div" %}

<div style="width: 640px; height: 480px; margin: 10px; position: relative;"><iframe allowfullscreen frameborder="0" style="width:640px; height:480px" src="https://lucid.app/documents/embedded/74fd884e-9c71-409e-b7d3-c3a871a17178" id="KYtBl2woQVuV"></iframe></div>

{% /html %}

Smart rollups stay in sync with Tezos by passing messages to Tezos and receiving messages from Tezos and other rollups.
Each Tezos block contains a global rollups inbox that contains messages from Tezos layer 1 to all rollups.
Anyone can add a message to this inbox and all messages are visible to all rollups.
Rollups receive this inbox, filter it to the messages that they are interested in, and act on them accordingly.

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

## Part 1: Configure the tutorial application

Follow these steps to get the application code and build it:

1. Clone the repository with the tutorial application:

   ```bash
   git clone https://gitlab.com/trili/hello-world-kernel.git
   cd hello-world-kernel/
   ```

1. Configure Rust to build WebAssembly applications:

   1. Verify that you have Rust version 1.66.0 or later installed by running `cargo --version`.

   1. If you have an earlier version of Rust, use the `rustup` command to use version 1.66.0:

      ```bash
      rustup override set 1.66.0
      ```

   1. Add WASM as a compilation target for Rust by running this command:

      ```bash
      rustup target add wasm32-unknown-unknown
      ```

1. Build the application by running this command:

   ```bash
   cargo build --target wasm32-unknown-unknown
   ```

   If the application builds correctly, the terminal shows a message that looks like "Finished dev [unoptimized + debuginfo] target(s) in 0.44s."
   You can see the compiled application in the `target/wasm32-unknown-unknown/debug` folder.
   In particular, the compiled kernel is in the `hello_world_kernel.wasm` file.

   If you see a message that says "error: package `time v0.3.29` cannot be built because it requires rustc 1.67.0 or newer, while the currently active rustc version is 1.66.0" or "error: package `time-core v0.1.2` cannot be built because it requires rustc 1.67.0 or newer, while the currently active rustc version is 1.66.0," run this command to use an earlier version of the `time` package:

   ```bash
   cargo update -p time@0.3.29 --precise 0.3.23
   ```

   Then, run the `cargo build --target wasm32-unknown-unknown` command again.

## Part 2: Start a Tezos sandbox

Follow these steps to set up a Tezos sandbox that you can use to test sending messages to the smart rollup.
These steps use the Octez command-line client to set up a sandbox in a Docker container:

1. Pull the most recent Tezos Docker image, which contains the most recent version of Octez:

   ```bash
   docker pull tezos/tezos:master
   ```

   You can also install Octez directly on your system, but keeping it in Docker is faster and more convenient for running the tutorial application.

1. Make sure you are in the `hello-world-kernel` folder, at the same level as the `Cargo.toml` and `sandbox_node.sh` files.

1. Run this command to start the Docker image, open a command-line terminal in that image, and mount the `hello-world-kernel` folder in it:

   ```bash
   docker run -it --rm --volume $(pwd):/home/tezos/hello-world-kernel --entrypoint /bin/sh --name octez-container tezos/tezos:master
   ```

   Your command-line prompt changes to indicate that it is now inside the running Docker container.
   This image includes the Octez command-line client and other Tezos tools.
   It also uses the docker `--volume` argument to mount the contents of the `hello-world-kernel` folder in the container so you can use those files within the container.

1. Verify that the container has the necessary tools by running these commands:

   ```bash
   octez-node --version
   octez-smart-rollup-wasm-debugger --version
   octez-smart-rollup-node-alpha --version
   octez-client --version
   ```

   Each of these commands should print a version number.
   The specific version number is not important as long as you retrieved the latest image with the `docker pull tezos/tezos:master` command.

   Don't close this terminal window or exit the Docker terminal session, because Docker will close the container.
   If you accidentally close the container, you can run the `docker run ...` command again to open a new one.

1. Within the container, go to the `hello-world-kernel` folder:

   ```bash
   cd hello-world-kernel
   ```

1. Also inside the container, start the Tezos sandbox by running this command:

   ```bash
   ./sandbox_node.sh
   ```

   This command starts a Tezos testing environment, including a baking node running in sandbox mode and a group of test accounts.
   The console shows repeated messages that show that the node is baking blocks.
   For more information about sandbox mode, see [sandbox mode](https://tezos.gitlab.io/user/sandbox.html).

   If you see an error that says "Unable to connect to the node," you can ignore it because it happens only once while the node is starting.

1. Leave that terminal instance running for the rest of the tutorial.

1. Open a new terminal window.

1. In the new terminal window, enter the Docker container by running this command:

   ```bash
   docker exec -it octez-container /bin/sh
   ```

   Now the second terminal window is running inside the container just like the first one.

1. In the second terminal window, run this command to verify that the sandbox is running with the correct protocol:

   ```bash
   octez-client rpc get /chains/main/blocks/head/metadata | grep protocol
   ```

   The response shows the protocol that the sandbox is running, as in this example:

   ```
   { "protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK",
     "next_protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK",
   ```

   If you don't see a message that looks like this one, check for errors in the first terminal window.

## Part 3: Run the kernel in debug mode

Octez provides a command named `octez-smart-rollup-wasm-debugger` that runs smart rollups in debug mode to make it easier to test and observe them.
Later, you will deploy the rollup to the sandbox, but running it in debug mode first verifies that it built correctly.

1. In the second terminal window inside the Docker container, go to the `hello_world_kernel` folder.

1. Run this command to start the rollup and pass an empty message inbox to it:

   ```bash
   octez-smart-rollup-wasm-debugger --kernel target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --inputs empty_input.json
   ```

   The command prompt changes again to show that you are in debugging mode, which steps through commands.

1. At the debugging prompt, run this command to send the message inbox to the kernel:

   ```bash
   step inbox
   ```

   The response shows the logging information for the kernel, including these parts:

   - The message "Hello, kernel" from the `hello_kernel` function
   - The message "Got message: Internal(StartOfLevel)," which represents the start of the message inbox
   - The message "Got message: Internal(InfoPerLevel(InfoPerLevel ...," which provides the hash of the previous block
   - The message "Got message: Internal(EndOfLevel)," which represents the end of the message inbox

   Now you know that the kernel works.
   In the next section, you optimize and deploy it to the sandbox.

1. Press Ctrl + C to end debugging mode.

## Part 4: Optimize the kernel

The kernel must be efficient with space and processing power because there is a size limit for kernels.
In these steps, you optimize the kernel:

1. Run this command to print the current size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   You can run this command inside or outside of the Docker container.

   The size of the application and its dependencies may be 18MB or more, which is too large to deploy.

1. In a terminal window outside of the Docker container, run the `wasm-strip` command to reduce the size of the kernel:

   ```bash
   wasm-strip target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   This command removes WebAssembly code that is not necessary to run rollups.
   You must run this command outside of the Docker container because it does not have the `wasm-strip` command.

1. Run the `du` command again to see the new size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   The size of the kernel is smaller now.
   Note that the changes that you make to the kernel outside of the Docker container also appear in the container and vice versa because the folder is mounted with the Docker `--volume` argument.

   To optimize the kernel further, you can convert it to an _installer kernel_, which includes only enough information to start the kernel, like an installation program.
   This installer kernel keeps the rest of its logic and data in separate files called _preimages_.

1. Outside of the Docker container, run this command to install the installer kernel tool:

   ```bash
   cargo install tezos-smart-rollup-installer
   ```

1. Outside of the Docker container, run this command to convert the kernel to an installer kernel:

   ```bash
   smart-rollup-installer get-reveal-installer --upgrade-to target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --output hello_world_kernel_installer.hex --preimages-dir preimages/
   ```

   This command creates the following files:

   - `hello_world_kernel_installer.hex`: The hexadecimal representation of the installer kernel
   - `preimages/`: A directory that contains the preimages that allow nodes to restore the installer kernel to the original kernel code

   When a node runs the installer kernel, it retrieves the preimages through the reveal data channel.
   For more information about the reveal data channel, see [reveal data channel](https://tezos.gitlab.io/alpha/smart_rollups.html#reveal-data-channel).

1. Verify the size of the installer kernel by running this command:

   ```bash
   du -h hello_world_kernel_installer.hex
   ```

   Now the kernel is small enough to be deployed on layer 1.
   In fact, when it is deployed, it will be even smaller than the result of this command because the command is checking the hexadecimal representation and the deployed kernel will be in binary.

## Part 5: Deploy (originate) the rollup

Smart rollups are originated in a way similar to smart contracts.
Instead of running the `octez-client originate contract`, you run the `octez-client originate smart rollup` command.
This command creates an address for the rollup and stores a small amount of data about it on layer 1.

1. In the second terminal window, in the Docker container, in the `hello-world-kernel` folder, run this command to deploy the installer kernel to the Tezos sandbox:

   ```bash
   octez-client originate smart rollup "test_smart_rollup" from "bootstrap1" of kind wasm_2_0_0 of type bytes with kernel file:hello_world_kernel_installer.hex --burn-cap 3
   ```

   Like the command to originate a smart contract, this command uses the `--burn-cap` argument to allow the transaction to take fees from the account.
   Also like deploying a smart contract, the response in the terminal shows information about the transaction and the address of the originated smart rollup, which starts with `sr1`.

   If you need to open a new terminal window within the Docker container, run the command `docker exec -it octez-container /bin/sh`.

## Part 6: Run the smart rollup node

Now that the smart rollup kernel is set up on layer 1, anyone can run a smart rollup node based on that kernel.
Smart rollup nodes are similar to baking nodes, but they run the smart rollup code instead of baking Tezos blocks.
In these steps, you start a smart rollup node, but note that anyone can run a node based on your kernel, including people who want to verify the rollup's behavior.

1. Copy the contents of the preimages folder to a folder that the rollup node can access by running these commands:

   ```bash
   mkdir -p ~/.tezos-rollup-node/wasm_2_0_0

   cp preimages/* ~/.tezos-rollup-node/wasm_2_0_0/
   ```

1. In the second terminal window, in the Docker container, start the rollup node:

   ```bash
   octez-smart-rollup-node-alpha run operator for "test_smart_rollup" with operators "bootstrap2" --data-dir ~/.tezos-rollup-node/ --log-kernel-debug --log-kernel-debug-file hello_kernel.debug
   ```

   Now the node is running and writing to the log file `hello_kernel.debug`.
   Leave this command running in the terminal window just like you left the first terminal window running the Tezos sandbox.

1. Open a third terminal window and enter the Docker container again:

   ```bash
   docker exec -it octez-container /bin/sh
   ```

1. In the container, go to the `hello_world_kernel` folder.

1. Print the contents of the log file:

   ```bash
   tail -f hello_kernel.debug
   ```

   Now, each time a block is baked, the smart rollup node prints the contents of the messages in the smart rollup inbox, as in this example:

   ```
   # Hello, kernel!
   # Got message: Internal(StartOfLevel)
   # Got message: Internal(InfoPerLevel(InfoPerLevel { predecessor_timestamp: 2023-06-07T15:31:09Z, predecessor: BlockHash("BLQucC2rFyNhoeW4tuh1zS1g6H6ukzs2DQDUYArWNALGr6g2Jdq") }))
   # Got message: Internal(EndOfLevel)
   ```

1. Stop the command by pressing Ctrl + C.

1. Run this command to watch for external messages to the rollup:

   ```bash
   tail -f hello_kernel.debug | grep External
   ```

   No output appears at first because the rollup has not received any messages aside from the internal messages that indicate the beginning and end of the inbox.

   Leave this command running.

1. Open a fourth terminal window, enter the Docker container with the command `docker exec -it octez-container /bin/sh`, and go to the `hello_world_kernel` folder.

1. In this fourth terminal window, run this command to simulate adding a message to the smart rollup inbox:

   ```bash
   octez-client send smart rollup message '[ "test" ]' from "bootstrap3"
   ```

1. Go back to the third terminal window.

   This window shows the message that you sent in the fourth window, which it received in binary format, with the numbers representing the letters in "test."

   ```
   Got message: External([116, 101, 115, 116])
   ```

Now you can send messages to this rollup via Tezos layer 1 and act on them in the rollup code.

## Next steps

Currently, your rollup and kernel are running in sandbox mode.
If you want to explore further, you can try deploying the rollup to a testnet as you do in the [Deploy a smart contract](../deploy-your-first-smart-contract/) tutorial.
The workflow for deploying to a testnet is similar to the workflow that you used to deploy to the sandbox:

1. Configure the network to use the testnet
1. Run a node (needs to synchronize with the network — can make use of [snapshots](https://tezos.gitlab.io/user/snapshots.html))
1. Create or import an account and fun it by a faucet
1. Originate the rollup to the testnet
1. Start the rollup node
1. Check the log file

You can also explore other smart rollup examples from the dedicated [kernel gallery](https://gitlab.com/tezos/kernel-gallery/-/tree/main/) or create your own.

## References

- [Smart rollup documentation](https://tezos.gitlab.io/alpha/smart_rollups.html)
- [Smart rollup kernel SDK](https://gitlab.com/tezos/tezos/-/tree/master/src/kernel_sdk)
- [Smart rollup kernel examples](https://gitlab.com/tezos/kernel-gallery/-/tree/main/)
- [Tezos smart rollups resources](https://airtable.com/shrvwpb63rhHMiDg9/tbl2GNV1AZL4dkGgq)
- [Tezos testnets](https://teztnets.xyz/)
- [Originating the installer kernel](https://tezos.stackexchange.com/questions/4784/how-to-originating-a-smart-rollup-with-an-installer-kernel/5794#5794)
- [Docker documentation](https://docs.docker.com/get-started/)
