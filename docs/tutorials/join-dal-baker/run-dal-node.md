---
title: "Step 3: Run an Octez DAL node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 19 July 2024
---

The DAL node is responsible for temporarily storing data and providing it to bakers and Smart Rollups.

To start the DAL node, open a new terminal window in the same environment and run this command:

```bash
octez-dal-node run >> "$HOME/octez-dal-node.log" 2>&1
```

This, too, may take some time to launch the first time because it needs to generate a new identity file, this time for the DAL network.

The DAL node connects to the DAL network but it is not yet receiving data.

Now that you have a DAL node running, you can start a baking daemon that uses that DAL node.
Continue to [Step 4: Run an Octez baking daemon](./run-baker).
