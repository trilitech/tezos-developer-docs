---
id: smart-rollups
title: Introduction
lastUpdated: 11th October 2023
---
This tutorial covers how to deploy a smart rollup in a Tezos sandbox.
To run this tutorial, you should have a basic understanding of how Tezos works and the ability to use the command-line terminal on your computer.

In this tutorial, you will learn:

- What a smart rollup is and how they help scale Tezos
- How information passes between Tezos and smart rollups
- How to respond to messages from Tezos in a smart rollup

{% comment %}
It would be good to add:
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
TODO Should this intro discuss the reveal data channel?
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

{% comment %}
TODO Could we install some of the tools in the docker container instead of making them install them locally?
{% /comment %}

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

   After you run these commands, run `$CC --version` to verify that you have version 11 or greater installed.

   Also, ensure that your version of Clang `wasm32` target with by running the command `$CC -print-targets | grep wasm32` and verifying that the results include `wasm32`.

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
1. It declares the `hello_kernel` function, which is the main function for the kernel.
It runs each time the kernel receives messages from layer 1, prints a logging message each time it is called, and runs the `handle_message` function on each message.

You don't need to access the other files in the application directly, but here are descriptions of them:

- `src/lib.rs`: The Rust code for the kernel
- `Cargo.toml`: The dependencies for the build process
- `rustup-toolchain.toml`: The required Rust version
- `sandbox_node.sh`: A script that sets up a Tezos sandbox for testing the rollup

The tutorial repository also includes two files that represent example message inboxes in layer 1 blocks:

- `empty_input.json`: An empty rollup message inbox
- `two_inputs.json`: A rollup message inbox with two messages

When you're ready, move to the next section to begin setting up the application.
