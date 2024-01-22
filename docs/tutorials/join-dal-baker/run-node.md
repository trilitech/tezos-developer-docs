# Step 2: Run an Octez node on Weeklynet

Once the Octez node has been configured to join Weeklynet, we can launch it and make its RPC available:

```
octez-node run --rpc-addr 127.0.0.1:8732 --log-output="$HOME/octez-node.log"
```

At first launch, the node will generate a fresh identity file used to identify itself on the Weeklynet L1 network, it then bootstraps the chain which means that it downloads and applies all the blocks. This takes a variable amount of time depending on when during the week these instructions are followed but at worse, on a tuesday evening, it takes a few hours. Fortunately, we can continue to set up our Weeklynet baking infrastructure while the node is bootstrapping, all we have to do for this is to use another, already bootstrapped, node as RPC endpoint for `octez-client` when we want to interact with the chain.

A public RPC endpoint URL for Weeklynet is linked from the https://teztnets.com/weeklynet-about page, let's record it in a shell variable:
```
ENDPOINT="<URL of the RPC endpoint linked from https://teztnets.com/weeklynet-about>"
```

For example, for the Weeklynet launched on January 17 2024, the endpoint was:

```
ENDPOINT=https://rpc.weeklynet-2024-01-17.teztnets.com
```
