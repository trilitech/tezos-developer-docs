---
title: "Part 5: Running and interacting with the rollup node"
lastUpdated: 25th October 2023
---

Now that the smart rollup is originated on layer 1, anyone can run a smart rollup node for it.
Smart rollup nodes are similar to baking nodes, but they run the smart rollup kernel instead of baking Tezos blocks.
In these steps, you start a smart rollup node, but note that anyone can run a node based on your kernel, including people who want to verify the rollup's behavior.

## Running a smart rollup node

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

## Interacting with the rollup node

Now you can add messages to the inbox and see the rollup node receive and respond to them.

1. Open a third terminal window and enter the Docker container again:

   ```bash
   docker exec -it octez-container /bin/sh
   ```

1. In the container, go to the `hello_world_kernel` folder.

1. Print the contents of the log file:

   ```bash
   tail -f hello_kernel.debug
   ```

   Now, each time a block is baked, the smart rollup node prints the contents of the messages in the smart rollup inbox, as in this example:

   ```
   # Hello, kernel!
   # Got message: Internal(StartOfLevel)
   # Got message: Internal(InfoPerLevel(InfoPerLevel { predecessor_timestamp: 2023-06-07T15:31:09Z, predecessor: BlockHash("BLQucC2rFyNhoeW4tuh1zS1g6H6ukzs2DQDUYArWNALGr6g2Jdq") }))
   # Got message: Internal(EndOfLevel)
   ```

1. Stop the command by pressing Ctrl + C.

1. Run this command to watch for external messages to the rollup:

   ```bash
   tail -f hello_kernel.debug | grep External
   ```

   No output appears at first because the rollup has not received any messages aside from the internal messages that indicate the beginning and end of the inbox.

   Leave this command running.

1. Open a fourth terminal window, enter the Docker container with the command `docker exec -it octez-container /bin/sh`, and go to the `hello_world_kernel` folder.

1. In this fourth terminal window, run this command to simulate adding a message to the smart rollup inbox:

   ```bash
   octez-client send smart rollup message '[ "test" ]' from "bootstrap3"
   ```

1. Go back to the third terminal window.

   This window shows the message that you sent in the fourth window, which it received in binary format, with the numbers representing the letters in "test."

   ```
   Got message: External([116, 101, 115, 116])
   ```

Now you can send messages to this rollup via Tezos layer 1 and act on them in the rollup code.

## Next steps

<!--
Commenting this out because there's not enough info for a tutorial user to do this without further information; consider adding this because it would be good to be able to send messages (that is, call contracts) from the rollup, and I don't know how you'd do that in the sandbox.

Currently, your rollup and kernel are running in sandbox mode.
If you want to explore further, you can try deploying the rollup to a testnet as you do in the [Deploy a smart contract](../deploy-your-first-smart-contract/) tutorial.
The workflow for deploying to a testnet is similar to the workflow that you used to deploy to the sandbox:

1. Configure the network to use the testnet
1. Run a node (needs to synchronize with the network — can make use of [snapshots](https://tezos.gitlab.io/user/snapshots.html))
1. Create or import an account and fun it by a faucet
1. Originate the rollup to the testnet
1. Start the rollup node
1. Check the log file
-->

To continue your work with smart rollups, you can you can explore examples from the [kernel gallery](https://gitlab.com/tezos/kernel-gallery/-/tree/main/) or create your own.

## References

- [Smart rollup documentation](https://tezos.gitlab.io/alpha/smart_rollups.html)
- [Smart rollup kernel SDK](https://gitlab.com/tezos/tezos/-/tree/master/src/kernel_sdk)
- [Smart rollup kernel examples](https://gitlab.com/tezos/kernel-gallery/-/tree/main/)
- [Tezos smart rollups resources](https://airtable.com/shrvwpb63rhHMiDg9/tbl2GNV1AZL4dkGgq)
- [Tezos testnets](https://teztnets.xyz/)
- [Originating the installer kernel](https://tezos.stackexchange.com/questions/4784/how-to-originating-a-smart-rollup-with-an-installer-kernel/5794#5794)
- [Docker documentation](https://docs.docker.com/get-started/)
