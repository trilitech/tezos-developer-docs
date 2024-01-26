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

The DAL node connects to the DAL network but it is not yet receiving shards.

DAL nodes share shards and information about them over a peer-to-peer pub/sub network built on the Gossipsub protocol.
As layer 1 assigns shards to the bakers, the Gossipsub network manages topics that DAL nodes can subscribe to.
For example, if a user submits data to slot 1, the network has a list of topics: a topic to identify the slot 1 shards assigned to baker A, a topic to identify the slot 1 shards assigned to baker B, and so on for all the bakers that are assigned shards from slot 1.

Then, the baker daemon automatically asks the DAL node to subscribe to the topic that provides the shards that it is assigned to.
You can see the topics that the DAL node is subscribed to by running this RPC call:

```bash
curl http://localhost:10732/p2p/gossipsub/topics
```

If you are using the `tezos/tezos` Docker image, you can install the `curl` program by running the command `sudo apk add curl`.

In the results, each topic contains a shard and the address of the baker that is assigned to it.
Now you can run a baker to verify these shards.
Continue to [Step 5: Run an Octez baking daemon on Weeklynet](./run-baker).
