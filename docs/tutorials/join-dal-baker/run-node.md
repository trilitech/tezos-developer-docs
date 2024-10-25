---
title: "Step 1: Run an Octez node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 21 October 2024
---

The first thing you need to run a baker and a DAL node is a Tezos layer 1 node, which is an instance of the `octez-node` program and part of the Octez suite of programs.

## Installing Octez

The version of Octez to use depends on the Tezos network that you are using.

- For Mainnet or Ghostnet, install the most recent release of Octez, including `octez-client`, `octez-node`, `octez-dal-node`, and the baker for the current protocol:

   - On MacOS, run these commands:

      ```bash
      brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
      brew install tezos-client tezos-node tezos-dal-node tezos-baker-PsParisC
      ```

   - On Linux and Windows WSL, download and install the built binaries from the [Octez release page](https://gitlab.com/tezos/tezos/-/releases), as in this example for Ubuntu:

      ```bash
      wget -O octez-binaries-20.3-linux-x86_64.tar.gz https://gitlab.com/tezos/tezos/-/package_files/150896058/download
      tar xf octez-binaries-20.3-linux-x86_64.tar.gz
      sudo cp octez-x86_64/octez* /usr/local/bin/
      ```

- For Weeklynet, look up the necessary version of Octez at https://teztnets.com/weeklynet-about and install it with the instructions there.

For more installation options, see [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html) in the Octez documentation.

## Running the layer 1 node

1. Initialize the Octez node for the network.
For example, to initialize it for Ghostnet, run this command:

   ```bash
   octez-node config init --network ghostnet
   ```

   By default, the node stores its data in the folder `$HOME/.tezos-node`.

1. Download a rolling snapshot of the network from https://snapshot.tzinit.org based on the instructions on that site.
For example, the command to download a Ghostnet snapshot from the EU servers might look like this:

   ```bash
   wget -O snapshot_file https://snapshots.eu.tzinit.org/ghostnet/rolling
   ```

1. Load the snapshot in the node by running this command:

   ```bash
   octez-node snapshot import snapshot_file
   ```

1. Install the Zcash parameters as described [Install Zcash Parameters](https://tezos.gitlab.io/introduction/howtoget.html#setup-zcash-params) in the Octez documentation.

1. Start the node:

   ```
   octez-node run --rpc-addr 127.0.0.1:8732 --log-output="$HOME/octez-node.log"
   ```

   At first launch, the node generates a fresh identity file used to identify itself on the network.
   Then it bootstraps the chain, which takes a variable amount of time depending on how many blocks need to be loaded.
   You don't need to wait for the node to bootstrap now.

1. Ensure that the node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Run a persistent baking node](https://opentezos.com/node-baking/baking/persistent-baker/) on opentezos.com.

1. Optional: When the node has bootstrapped and caught up with the current head block, you can delete the snapshot file to save space.

In the meantime, you can continue the baking infrastructure while the node is bootstrapping.
Continue to [Step 2: Set up a baker account](/tutorials/join-dal-baker/prepare-account).
