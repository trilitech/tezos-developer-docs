# Step 2: run an Octez node on Weeklynet

Once the Octez node has been configured to join Weeklynet, it's possible to launch it.

```
octez-node run --rpc-addr localhost --log-output="$HOME/octez-node.log"
```

At first launch, the node will generate a fresh identity file used to identify itself on the Weeklynet L1 network, it then bootstraps the chain which means that it downloads and applies all the blocks. This takes a variable amount of time depending on when during the week these instructions are followed but at worse, on a tuesday evening, it takes a few hours. Fortunately, we can continue to set up our Weeklynet baking infrastructure while the node is bootstrapping, all we have to do for this is to use another, already bootstrapped, node as RPC endpoint for `octez-client` when we want to interact with the chain.

A public RPC endpoint URL for Weeklynet is linked from the https://teztnets.com/weeklynet-about page, let's record it in a shell variable:
```
ENDPOINT="<URL of the RPC endpoint linked from https://teztnets.com/weeklynet-about>"
```
