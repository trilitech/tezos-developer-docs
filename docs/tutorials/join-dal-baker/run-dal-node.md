---
title: "Step 4: Run an Octez DAL node on Weeklynet"
authors: Tezos core developers
last_update:
  date: 23 January 2024
---

Start the DAL node by running this command:

```bash
octez-dal-node run >> "$HOME/octez-dal-node.log" 2>&1
```

This, too, may take some time to launch the first time because it needs to generate a new identity file, this time for the DAL network.

When running normally, the logs of the DAL node should contain one line per block applied by the layer 1 node, looking like this:

```
<timestamp>: layer 1 node's block at level <level>, round <round> is final
```

The DAL node we have launched connects to the DAL network but it is not yet subscribed to any Gossipsub topic. We can observe this by requesting the topics it registered to, using the following RPC:

```bash
curl http://localhost:10732/p2p/gossipsub/topics
```

In particular, it won't collect the shards assigned to our baker until it is subscribed to the corresponding topics. Don't worry, the baker daemon will automatically ask the DAL to subscribe to the relevant topics.
