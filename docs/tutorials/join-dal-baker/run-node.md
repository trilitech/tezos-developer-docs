---
title: "Step 2: Run an Octez node on Weeklynet"
authors: Tezos core developers
last_update:
  date: 24 January 2024
---

Now that the Octez node is configured to join Weeklynet, we can launch it and make its RPC available.

1. Optional: If it has been a few days since Weeklynet was restarted on Wednesday morning, you can speed up the bootstrapping process by loading a snapshot:

   1. Download a snapshot of Weeklynet from https://snapshot.tzinit.org based on the instructions on that site.
   For example, the command to download the snapshot may look like this:

      ```bash
      wget -O snapshot_file https://snapshots.eu.tzinit.org/weeklynet/rolling
      ```

   1. Load the snapshot in the node by running this command:

      ```bash
      octez-node snapshot import snapshot_file
      ```

      If you see the error "The chain name contained in the snapshot file is not consistent with the network configured in the targeted data directory," the snapshot is for the previous instance of Weeklynet and no snapshot is available for this week.
      Continue with the next step as usual.

1. Start the node:

   ```
   octez-node run --rpc-addr 127.0.0.1:8732 --log-output="$HOME/octez-node.log"
   ```

At first launch, the node generates a fresh identity file used to identify itself on the Weeklynet L1 network.
Then it bootstraps the chain, which means that it downloads and applies all the blocks that have been created since the origin or since the snapshot was created.
This takes a variable amount of time depending on how many blocks need to be loaded.
At worst, if the network has been running for nearly a week, it can take a few hours.

Fortunately, we can continue to set up our Weeklynet baking infrastructure while the node is bootstrapping.
Continue to [Step 3: Set up a baker account on Weeklynet](./prepare-account).
