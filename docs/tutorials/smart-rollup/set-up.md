---
title: "Part 1: Setting up the application"
lastUpdated: 25th October 2023
---

To set up the application for the tutorial, you must configure Rust to build the kernel and start a Docker container that has resources that are needed to debug and deploy it.

## Building the application

Follow these steps to get the application code and build it:

1. Clone the repository with the tutorial application:

   ```bash
   git clone https://gitlab.com/trili/hello-world-kernel.git
   cd hello-world-kernel/
   ```

1. Configure Rust to build WebAssembly applications:

   1. Verify that you have Rust version 1.73.0 or later installed by running `rustc --version`.

   1. If you have an earlier version of Rust, use the `rustup` command to use version 1.73.0:

      ```bash
      rustup override set 1.73.0
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

Now the kernel is compiled into a single file that nodes can run.

## Start the Docker container

Tezos provides a Docker image that contains the Octez client, which allows you to interact with Tezos from the command line.
Later, you will use this image to run a sandbox Tezos environment for testing the rollup.

1. Make sure that Docker desktop is running.

1. Pull the most recent Tezos Docker image, which contains the most recent version of Octez:

   ```bash
   docker pull tezos/tezos:master
   ```

   You can install Octez directly on your system, but keeping it in Docker is faster and more convenient for running the tutorial application.

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

Now the application is built and you have an environment that you can debug it in.
For the rest of the tutorial, you must be aware of whether you are running commands inside or outside of the Docker container.
The container has Octez but not Rust, so you run Rust commands outside of the container and Octez commands inside the container.
