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
This takes a variable amount of time depending on when during the week these instructions are followed but at worst, on a Tuesday evening, it takes a few hours.

Fortunately, we can continue to set up our Weeklynet baking infrastructure while the node is bootstrapping.
We can use another, already bootstrapped, node as the RPC endpoint for the Octez client to interact with the chain.

A public RPC endpoint URL for Weeklynet is listed on the https://teztnets.com/weeklynet-about page.
Let's record it in a shell variable:

```bash
ENDPOINT="<URL of the RPC endpoint linked from https://teztnets.com/weeklynet-about>"
```

For example, for the Weeklynet launched on January 17 2024, the endpoint was:

```bash
ENDPOINT=https://rpc.weeklynet-2024-01-17.teztnets.com
```
