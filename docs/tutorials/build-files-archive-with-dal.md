---
title: Implement a file archive with the DAL and a Smart Rollup
authors: 'Tezos Core Developers'
last_update:
  date: 5 February 2024
---

:::note Experimental
The Data Availability Layer is an experimental feature that is not yet available on Tezos Mainnet.
The way the DAL works may change significantly before it is generally available.
:::

The Data Availability Layer (DAL) is a companion peer-to-peer network for the Tezos blockchain, designed to provide additional data bandwidth to Smart Rollups.
It allows users to share large amounts of data in a way that is decentralized and permissionless, because anyone can join the network and post and read data on it.

In this tutorial, you will set up a file archive that stores and retrieves files with the DAL.
You will learn:

- How data is organized and shared with the DAL and the reveal data channel
- How to read data from the DAL in a Smart Rollup
- How to host a DAL node
- How to publish data and files with the DAL

Because the DAL is not yet available on Tezos Mainnet, this tutorial uses the [Weeklynet test network](https://teztnets.com/weeklynet-about), which runs on a newer version of the protocol that includes the DAL.

See these links for more information about the DAL:

- For technical information about how the DAL works, see [Data Availability Layer](https://tezos.gitlab.io/shell/dal.html) in the Octez documentation.
- For more information about the approach for the DAL, see [The Rollup Booster: A Data-Availability Layer for Tezos](https://research-development.nomadic-labs.com/data-availability-layer-tezos.html).

## Prerequisites

This article assumes some familiarity with Smart Rollups.
If you are new to Smart Rollups, see the tutorial [Deploy a Smart Rollup](./smart-rollup).

### Set up a Weeklynet environment and account

Because Weeklynet requires a specific version of the Octez suite, you can't use most wallet applications and installations of the Octez suite with it.
Instead, you must set up an environment with a specific version of the Octez suite and use it to create and fund an account.
Note that Weeklynet is reset every Wednesday, so you must recreate your environment and account after the network resets.

The easiest way to do this is to use the Docker image that is generated each time Weeklynet is reset and recreated.
As another option, you can build the specific version of the Octez suite locally.
For instructions, see the Weeklynet page at https://teztnets.com/weeklynet-about.

To set up an environment and account in a Docker container, follow these steps:

1. From the [Weeklynet](https://teztnets.com/weeklynet-about) page, find the Docker command to create a container from the correct Docker image, as in this example:

   ```bash
   docker run -it --entrypoint=/bin/sh tezos/tezos:master_7f3bfc90_20240116181914
   ```

   The image tag in this command changes each time the network is reset.

1. Copy the URL of the public RPC endpoint for Weeklynet, such as `https://rpc.weeklynet-2024-01-17.teztnets.com`.
This endpoint also changes each time the network is reset.

1. For convenience, you may want to set this endpoint as the value of the `ENDPOINT` environment variable.

1. In the container, initialize the Octez client with that endpoint, such as this example:

   ```bash
   octez-client -E https://rpc.weeklynet-2024-01-17.teztnets.com config init
   ```

1. Create an account with the command `octez-client gen keys $MY_ACCOUNT`, where `$MY_ACCOUNT` is an alias for your account.

1. Get the public key hash of the new account by running the command `octez-client show address $MY_ACCOUNT`.

1. From the [Weeklynet](https://teztnets.com/weeklynet-about) page, open the Weeklynet faucet and send some tez to the account.

Now you can use this account to deploy Smart Rollups.

### Install Rust

To run this tutorial, install Rust by running the following command.
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

### Install Clang

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

## Why the DAL?

The DAL has earned the nickname "Rollup Booster" from its ability to address
the last bottleneck Smart Rollups developers could not overcome without
sacrificing decentralization: block space. Smart Rollups offload
*computation* from layer 1, but the transactions that they process still need to
originate from somewhere.

By default, that "somewhere" is the layer 1 blocks, yet the size of a Tezos
block is limited to around 500KBytes. In this model, while Smart Rollups do not
compete for layer 1 gas anymore, they still compete for block space.

<!-- Is this info about the reveal data channel needed here? -->
Additionally, a Smart Rollup can fetch data from an additional source called the
reveal data channel, which allows them to retrieve arbitrary data.
The reveal channel is a powerful way to share data, because it allows a Smart Rollup
operator to post hashes instead of full data files on layer 1. But it is a
double-edged sword, because nothing enforces the availability of the data in the
first place. [Solutions exist to address this
challenge](https://research-development.nomadic-labs.com/introducing-data-availability-committees.html),
but they are purely off-chain ones, coming with no guarantee from layer 1.

The DAL allows third parties to publish data and have bakers attest that the data is available.
When enough bakers have attested that the data is available, Smart Rollups can retrieve the data without the need for additional trusted third-parties.

## How the DAL works

In this tutorial, you create a file archive application that allows clients to upload data to the DAL.
You also create a Smart Rollup that listens to the DAL and responds to that data.

The DAL works like this:

1. Users post data to a DAL node.
1. The DAL node returns a certificate, which includes two parts:

   - The _commitment_ is like a hash of the data but has the additional ability to identify individual shards of the data and reconstruct the original data from a certain percentage of the shards.
   The number of shards needed depends on how the data is spread across shards, which is controlled by a parameter called the _redundancy factor_.
   - The _proof_ certifies the length of the data to prevent malicious users from overloading the layer with data.

1. Users post the certificate to Tezos layer 1 via the Octez client.
1. When the certificate is confirmed in a block, the DAL splits the data into shards and shares it through the peer-to-peer network.
1. Layer 1 assigns the shards to bakers.
1. Bakers verify that they are able to download the shards that they are assigned to.
1. Bakers attest that the data is available in their usual block attestations to layer 1.

   Each Tezos network has a delay of a certain number of blocks known as the _attestation lag_.
   This number of blocks determines when bakers attest that the data is available and when the data becomes available to Smart Rollups.
   For example, if a certificate is included in level 100 and the attestation lag is 4, bakers must attest that the data is available in level 104, along with their usual attestations that build on level 103.

   If enough shards are attested in that level, the data becomes available to Smart Rollups at the end of layer 104.
   If not enough shards are attested in that level, the certificate is considered bogus and the related data is dropped.

1. The Smart Rollup node monitors the blocks and when it sees attested DAL data, it connects to a DAL node to request the data.
Smart Rollups must store the data if they need it because it is available on the DAL for only a short time.

The overall workflow is summarized in the following figure:

![Overall diagram of the workflow of the Data Availability Layer](/img/architecture/dal-workflow.png)
<!-- https://lucid.app/lucidchart/cc422278-7319-4a2f-858a-a7b72e1ea3a6/edit -->

There are many steps in the DAL process, but the most complicated parts (storing and sharing data) are handled automatically by the various daemons in the Octez suite.

:::note
When you install a Smart Rollup, you provide only the installer kernel on layer 1 and the full kernel via the reveal data channel.
Currently, you cannot send the full kernel data over the Data Availability Layer, so this tutorial relies on the reveal data channel to install the kernel as usual.
:::

When your environment is ready, get started by going to [Part 1: Getting the DAL parameters](./build-files-archive-with-dal/get-dal-params).