---
title: "Step 1: Run an Octez node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 27 August 2024
---

To use the Octez suite with Ghostnet, you need a recent build of the Octez binaries.
You can build the Octez suite from the source code or install prebuilt binaries as described at https://tezos.gitlab.io/introduction/howtoget.html.

:::note

If you already have an Octez node and baker running with a delegated account, you can skip to [Step 3: Run an Octez DAL node](./run-dal-node).

:::

The first step is to configure a Tezos node with the `octez-node` program:

1. Install the Octez suite of programs, including `octez-client`, `octez-node`, and `octez-dal-node` as described in [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html) in the Octez documentation.
If you build from source, you can use the `latest_branch` branch to work with Ghostnet.

1. Initialize the Octez node for Ghostnet, such as in this example:

   ```bash
   octez-node config init --network ghostnet
   ```

1. Speed up the process of initializing the node by loading a snapshot:

   1. Download a rolling snapshot of Ghostnet from https://snapshot.tzinit.org based on the instructions on that site.
   For example, the command to download the snapshot from the EU servers might look like this:

      ```bash
      wget -O snapshot_file https://snapshots.eu.tzinit.org/ghostnet/rolling
      ```

   1. Load the snapshot in the node by running this command:

      ```bash
      octez-node snapshot import snapshot_file
      ```

1. Start the node:

   ```
   octez-node run --rpc-addr 127.0.0.1:8732 --log-output="$HOME/octez-node.log"
   ```

1. Ensure that the node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Run a persistent baking node](https://opentezos.com/node-baking/baking/persistent-baker/) on opentezos.com.

1. Optional: When the node has bootstrapped and caught up with the current head block, you can delete the snapshot file to save space.

At first launch, the node generates a fresh identity file used to identify itself on the network.
Then it bootstraps the chain, which takes a variable amount of time depending on how many blocks need to be loaded.

In the meantime, you can continue the baking infrastructure while the node is bootstrapping.
Continue to [Step 2: Set up a baker account](./prepare-account).
