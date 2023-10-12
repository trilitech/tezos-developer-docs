---
id: set-up
title: "Part 1: Setting up the application"
lastUpdated: 11th October 2023
---

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

Now the kernel is compiled into a single file that nodes can run.
