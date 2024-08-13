---
title: "Step 1: Run an Octez node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 12 August 2024
---

To use the Octez suite with Ghostnet, you need a recent build of the Octez binaries based on the master branch of the Octez source code.
One way to do this is to use the Docker image that is generated from this branch.
As another option, you can build the Octez suite from the source code or install prebuilt binaries as described at https://tezos.gitlab.io/introduction/howtoget.html.

## Configure the node

To set up an environment and account in a Docker container, follow these steps:

1. Get the most recent Docker image by running this command:

   ```bash
   docker pull tezos/tezos:master
   ```

1. Start a container from the image:

   ```bash
   docker run -it --name dal-baker --entrypoint /bin/sh tezos/tezos:master
   ```

1. In the container, initialize the Octez node for Ghostnet, such as in this example:

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

At first launch, the node generates a fresh identity file used to identify itself on the network.
Then it bootstraps the chain, which takes a variable amount of time depending on how many blocks need to be loaded.

In the meantime, you can continue the baking infrastructure while the node is bootstrapping.
Continue to [Step 2: Set up a baker account](./prepare-account).
