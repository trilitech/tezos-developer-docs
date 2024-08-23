---
title: "Part 1: Setting up an environment"
authors: 'Tim McMackin'
last_update:
  date: 14 February 2024
---

Because Weeklynet requires a specific version of the Octez suite, you can't use most wallet applications and installations of the Octez suite with it.
Instead, you must set up an environment with a specific version of the Octez suite and use it to create and fund an account.

:::note Weeklynet resets every week
Weeklynet is reset every Wednesday, which deletes all accounts, smart contracts, and Smart Rollups.
Therefore, you must recreate your environment and account and redeploy your smart Contracts and Smart Rollups after the network resets.
:::

## Set up a Weeklynet environment and account

The easiest way to use Weeklynet is to use the Docker image that is generated each time Weeklynet is reset and recreated.
As another option, you can build the specific version of the Octez suite locally.
For instructions, see the Weeklynet page at https://teztnets.com/weeklynet-about.

To set up an environment and account in a Docker container, follow these steps:

1. From the [Weeklynet](https://teztnets.com/weeklynet-about) page, find the Docker command to create a container from the correct Docker image, as in this example:

   ```bash
   docker run -it --entrypoint=/bin/sh tezos/tezos:master_7f3bfc90_20240116181914
   ```

   The image tag in this command changes each time the network is reset.

   :::tip
   If you're not used to working inside Docker containers, you can map a folder on your computer to a folder in the container to create a [Docker volume](https://docs.docker.com/storage/volumes/).
   This way, you can edit files on your computer and the changes will appear on the files inside the container.
   For example, to start a container and map the current folder to the `/home/tezos` folder in the container, run this command:

   ```bash
   docker run -it --entrypoint=/bin/sh -v .:/home/tezos tezos/tezos:master_7f3bfc90_20240116181914
   ```

   You can map a folder like this only when you create a container; you cannot add it later.
   :::

1. Copy the URL of the public RPC endpoint for Weeklynet, such as `https://rpc.weeklynet-2024-01-17.teztnets.com`.
This endpoint also changes each time the network is reset.

1. For convenience, you may want to set this endpoint as the value of the `ENDPOINT` environment variable.
The parts of the Octez suite don't use this environment variable directly, but you can save time by using this variable in commands.

1. In the container, initialize the Octez client with that endpoint, such as this example:

   ```bash
   octez-client -E https://rpc.weeklynet-2024-01-17.teztnets.com config init
   ```

   or:

   ```bash
   octez-client -E $ENDPOINT config init
   ```

1. Optional: Hide the network warning message by running this command:

   ```bash
   export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=y
   ```

   This command suppresses the message that your instance of the Octez client is not using Mainnet.

1. Create an account with the command `octez-client gen keys $MY_ACCOUNT`, where `$MY_ACCOUNT` is an alias for your account.

1. Get the public key hash of the new account by running the command `octez-client show address $MY_ACCOUNT`.

1. From the [Weeklynet](https://teztnets.com/weeklynet-about) page, open the Weeklynet faucet and send some tez to the account.
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
For example, it may prompt you to run `source "$HOME/.cargo/env"` to configure your current terminal window to run Rust.

1. Add WASM as a compilation target for Rust by running this command:

   ```bash
   rustup target add wasm32-unknown-unknown
   ```

   You can see other ways of installing Rust at https://www.rust-lang.org.

## Install Clang

Clang and LLVM are required for compilation to WebAssembly.
Version 11 or later of Clang is required.

If you are using the Tezos Docker container, run these commands:

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
