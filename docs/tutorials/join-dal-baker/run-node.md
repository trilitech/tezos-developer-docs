---
title: "Step 2: Run an Octez node on Weeklynet"
authors: Tezos core developers
last_update:
  date: 23 January 2024
---

Now that the Octez node is configured to join Weeklynet, we can launch it and make its RPC available:

```
octez-node run --rpc-addr 127.0.0.1:8732 --log-output="$HOME/octez-node.log"
```

At first launch, the node generates a fresh identity file used to identify itself on the Weeklynet L1 network.
Then it bootstraps the chain, which means that it downloads and applies all the blocks.
This takes a variable amount of time depending on how long it has been since the network started.
At worst, if the network has been running for nearly a week, it can take a few hours.

Fortunately, we can continue to set up our Weeklynet baking infrastructure while the node is bootstrapping.
