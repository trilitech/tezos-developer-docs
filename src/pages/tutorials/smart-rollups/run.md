---
id: run
title: "Part 5: Running the rollup node"
lastUpdated: 25th October 2023
---

Now that the smart rollup is originated on layer 1, anyone can run a smart rollup node for it.
Smart rollup nodes are similar to baking nodes, but they run the smart rollup kernel instead of baking Tezos blocks.
In these steps, you start a smart rollup node, but note that anyone can run a node based on your kernel, including people who want to verify the rollup's behavior.

1. Copy the contents of the `preimages` folder to a folder that the rollup node can access by running these commands:

   ```bash
   mkdir -p ~/.tezos-rollup-node/wasm_2_0_0

   cp preimages/* ~/.tezos-rollup-node/wasm_2_0_0/
   ```

1. In the second terminal window, in the Docker container, start the rollup node:

   ```bash
   octez-smart-rollup-node-alpha run operator for "test_smart_rollup" \
       with operators "bootstrap2" --data-dir ~/.tezos-rollup-node/ \
       --log-kernel-debug --log-kernel-debug-file hello_kernel.debug
   ```

Now the node is running and writing to the log file `hello_kernel.debug`.
Leave this command running in the terminal window just like you left the first terminal window running the Tezos sandbox.

In the next section, you send messages to the rollup like you did in debug mode.
