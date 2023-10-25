---
id: interact
title: "Part 6: Interacting with the rollup"
lastUpdated: 25th October 2023
---

Now that the rollup is running, you can send messages to it manually or via smart contracts and see it respond by writing to the log.

## Sending messages manually

To verify that the rollup is receiving messages, follow these steps to send messages to it:

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

   You may need to search the log for this message because the node is printing information for each block's inbox.

Now you can send messages to this rollup via Tezos layer 1 and act on them in the rollup code.

## Sending messages from a smart contract

Follow these steps to originate a smart contract to the sandbox and use it to send messages to the rollup:

1. Outside the Docker container, install LIGO as described on this page: <https://ligolang.org/docs/intro/installation>.

1. Create a file named `send_message.jsligo` with this code:

   ```ligolang
   type storage = unit;
   type paramType = [ address, string ];
   type returnType = [ list<operation>, storage ]

   @entry
   const sendmessage = (param: paramType, prevStorage: storage) : returnType => {
     let [ rollupAddress, msg ] = param;
     let smartRollup = Tezos.get_contract_with_error(rollupAddress, "Incorrect rollup address");
     return [
       list([Tezos.transaction(msg, 0tez, smartRollup)]),
       prevStorage,
     ];
   }
   ```

   This smart contract contains one endpoint named `sendmessage`.
   It accepts the address of a smart rollup and a message to add to the inbox.

1. Compile the smart contract by running this command:

   ```bash
   ligo compile contract send_message.jsligo > send_message.tz
   ```

1. Inside the Docker container, run this command to originate the smart contract to the sandbox:

   ```bash
   octez-client originate contract send_message \
     transferring 0 from bootstrap5 \
     running file:./send_message.tz \
     --init "Unit" --burn-cap 0.2
   ```

1. Run this command to call the contract's entrypoint and pass a string as a message.
Replace `$SMART_ROLLUP_ADDR` with the address of the smart rollup, which starts with `sr1`.

   ```bash
   octez-client transfer 0 from bootstrap5 \
     to send_message --arg '(Pair "$SMART_ROLLUP_ADDR" "Hello!")'
   ```

   If you forgot the address of the smart rollup, you can print the addresses of smart rollups in the sandbox by running this command:

   ```bash
   octez-client list known smart rollups
   ```

1. In the third terminal window, see the message that the smart rollup received.
It includes the address of the target rollup, the address of the contract that called it, and the message that you sent, as in this example:

   ```bash
   Got message: Internal(Transfer(Transfer {
     payload: MichelsonString("Hello!"),
     sender: ContractKt1Hash("KT1GjAkK9Mm5aocwvRVezTQxA9rvtgRpALKF"),
     source: Ed25519(ContractTz1Hash("tz1ddb9NMYHZi5UzPdzTZMYQQZoMub195zgv")),
     destination: SmartRollupAddress {
       hash: SmartRollupHash("sr1B7eyfnm5vbXuXraCVRtkToSgieTSiVBib") } }))
   ```

Now you can write smart contracts that send messages to smart rollups by adding them to the inbox.

## Next steps

{% comment %}
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
{% /comment %}

To continue your work with smart rollups, you can you can explore examples from the [kernel gallery](https://gitlab.com/tezos/kernel-gallery/-/tree/main/) or create your own.

## References

- [Smart rollup documentation](https://tezos.gitlab.io/alpha/smart_rollups.html)
- [Smart rollup kernel SDK](https://gitlab.com/tezos/tezos/-/tree/master/src/kernel_sdk)
- [Smart rollup kernel examples](https://gitlab.com/tezos/kernel-gallery/-/tree/main/)
- [Tezos smart rollups resources](https://airtable.com/shrvwpb63rhHMiDg9/tbl2GNV1AZL4dkGgq)
- [Tezos testnets](https://teztnets.xyz/)
- [Originating the installer kernel](https://tezos.stackexchange.com/questions/4784/how-to-originating-a-smart-rollup-with-an-installer-kernel/5794#5794)
- [Docker documentation](https://docs.docker.com/get-started/)
