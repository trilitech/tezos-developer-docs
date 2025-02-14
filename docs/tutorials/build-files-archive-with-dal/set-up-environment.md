---
title: "Part 1: Setting up an environment"
authors: Tim McMackin
last_update:
  date: 10 September 2024
---

These steps cover how to set up a development environment to work with Smart Rollups and the DAL.
To work with these elements, you need the Octez suite, which includes the Octez command-line client for interacting with Tezos and the binaries for the DAL node and Smart Rollup node.
You must use the same version of the Octez suite that the network is using.

The easiest way to use the Octez suite is to use the `tezos/tezos` Docker image.
As another option, you can get the built version of the Octez suite from https://octez.tezos.com/docs/ or build the specific version of the Octez suite locally.

To set up an environment and account in a Docker container, follow these steps:

1. Retrieve the latest version of the `tezos/tezos` Docker image by running this command:

   ```bash
   docker pull tezos/tezos:latest
   ```

1. Start a Docker container from the image:

   ```bash
   docker run -it --entrypoint=/bin/sh tezos/tezos:latest
   ```

   :::tip
   If you're not used to working inside Docker containers, you can map a folder on your computer to a folder in the container to create a [Docker volume](https://docs.docker.com/storage/volumes/).
   This way, you can edit files on your computer and the changes will appear on the files inside the container.
   For example, to start a container and map the current folder to the `/home/tezos` folder in the container, run this command:

   ```bash
   docker run -it --entrypoint=/bin/sh -v .:/home/tezos tezos/tezos:latest
   ```

   You can map a folder like this only when you create a container; you cannot add it later.
   :::

1. In the container, configure the layer 1 node for Ghostnet:

   ```bash
   octez-node config init --network ghostnet
   ```

   If you see an error that says that the node has a pre-existing configuration file, update the existing configuration file by running this command:

   ```bash
   octez-node config update --network ghostnet
   ```

1. Download a snapshot of Ghostnet from https://snapshot.tzinit.org based on the instructions on that site.
For example, the command to download the snapshot may look like this:

   ```bash
   wget -O snapshot_file https://snapshots.eu.tzinit.org/ghostnet/rolling
   ```

1. Load the snapshot in the node by running this command:

   ```bash
   octez-node snapshot import snapshot_file
   ```

1. Run this command to start the node:

   ```bash
   octez-node run --rpc-addr 127.0.0.1:8732
   ```

1. Leave the node running in that terminal window and open a new terminal window in the same environment.
If you are using a Docker container, you can enter the container with the `docker exec` command, as in `docker exec -it my-image /bin/sh`.
To get the name of the Docker container, run the `docker ps` command.

1. In the container, initialize the Octez client to use your node, such as this example:

   ```bash
   octez-client -E http://127.0.0.1:8732 config init
   ```

   This command uses the default port for the node, but you can change it if you are running the node somewhere else.

   If you get an error that says "Failed to acquire the protocol version from the node," the node is not ready yet.
   Wait a few minutes for the node to be ready, run `rm -rf /home/tezos/.tezos-client/config` to remove the configuration file, and try the `config init` command again.

1. Optional: Hide the network warning message by running this command:

   ```bash
   export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=y
   ```

   This command suppresses the message that your instance of the Octez client is not using Mainnet.

1. Create an account with the command `octez-client gen keys my_wallet`, where `my_wallet` is an alias for your account.

1. Get the public key hash of the new account by running the command `octez-client show address my_wallet`.

1. From the [Ghostnet](https://teztnets.com/ghostnet-about) page, open the Ghostnet faucet and send some tez to the account.
50 tez is enough to get started, and you can always go back to the faucet to get more.

Now you can use this account to deploy Smart Rollups.

## Install Rust

To run this tutorial, install Rust in the environment by running the following command.
The application in this tutorial uses Rust because of its support for WebAssembly (WASM), the language that Smart Rollups use to communicate.
Rollups can use any language that has WASM compilation support.

1. Make sure that the `curl` program is installed.
If you are using the Tezos Docker container, run `sudo apk add curl`.

1. Run this command to install Rust:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

1. Follow the instructions in the Rust installation program.
For example, it may prompt you to run `. "$HOME/.cargo/env"` to configure your current terminal window to run Rust.

1. Set the version of Rust to 1.80 by running this command:

   ```bash
   rustup override set 1.80
   ```

1. Add WASM as a compilation target for Rust by running this command:

   ```bash
   rustup target add wasm32-unknown-unknown
   ```

   You can see other ways of installing Rust at https://www.rust-lang.org.

## Install Clang

Clang and LLVM are required for compilation to WebAssembly.
Version 11 or later of Clang is required.

If you are using the `tezos/tezos` Docker image, run these commands:

```bash
sudo apk add clang
export CC=clang
```

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

When your environment is ready, continue to [Part 2: Getting the DAL parameters](/tutorials/build-files-archive-with-dal/get-dal-params).
