---
title: "Step 5: Run an Octez baking daemon"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 19 July 2024
---

To run a baking daemon that connects to the DAL, start it as usual and pass the URL to your DAL node to it:

1. In a new terminal window, run this command:

   ```bash
   octez-baker-alpha run with local node "$HOME/.tezos-node" my_baker --liquidity-baking-toggle-vote on --adaptive-issuance-vote on --dal-node http://127.0.0.1:10732 >> "$HOME/octez-baker.log" 2>&1
   ```

1. Verify that the baker is subscribed to the DAL by opening another terminal window and running this RPC call:

   ```bash
   curl http://localhost:10732/p2p/gossipsub/topics
   ```

   This call returns all of the topics that the baker is subscribed to in the format `{"slot_index":<index>,"pkh":"<ADDRESS OF OUR BAKER>"}` where `index` varies between `0` included and the number of slot indexes (`32` on Weeklynet) excluded.

   You can also look at the baker logs to see if it manages to inject the expected operations. At each level, the baker is expected to:

      - Receive a block proposal (log message: "received new proposal ... at level ..., round ...")
      - Inject a preattestation for it (log message: "injected preattestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
      - Receive a block (log message: "received new head ... at level ..., round ...")
      - Inject a consensus attestation for it (log message: "injected attestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
      - Attach a DAL attestation to it, indicating which of the shards assigned to the baker have been seen on the DAL network (log message: "ready to attach DAL attestation for level ..., round ..., with bitset ... for my_baker (&lt;address&gt;) to attest slots published at level ...")

1. (Optional) Launch an accuser daemon by opening a new terminal window and running this command:

   ```bash
   octez-accuser-alpha run >> "$HOME/octez-accuser.log" 2>&1
   ```

   The accuser monitors the behavior of the other bakers and denounces them to the Tezos protocol if they double-sign any block or consensus operation.

## Receiving attestation rights

Now that the account has staked enough tez and the baking daemon is running, the account will soon receive attestation rights.
The delay is a number of cycles determined by the value of the `consensus_rights_delay` constant plus two cycles.

To get the current value of this constant, query the `constants` RPC endpoint on your node, as in this example:

```bash
octez-client rpc get /chains/main/blocks/head/context/constants | jq | grep consensus_rights_delay
```

To run this command you may need to install the `jq` program.
If you are using the `tezos/tezos` Docker image, you can install it by running the command `sudo apk add jq`.

A cycle is a number of blocks; the `blocks_per_cycle` constant determines how many blocks are in a cycle.
The `minimal_block_delay` constant determines the time between blocks in seconds.
Therefore, you can calculate the approximate time in seconds that it takes a baker to receive attestation rights with this formula:

```
(consensus_rights_delay + 2) * blocks_per_cycle * minimal_block_delay
```

For example, if `consensus_rights_delay` is 2, `blocks_per_cycle` is 160, and `minimal_block_delay` is 5, a new baker receives attestation rights after a delay of 3200 seconds, or about 53 minutes.
The exact time depends on what time in the current cycle the account staked its tez.
The amount of tez that the account stakes determines how often it is called on to make attestations, not how quickly it receives rights.

Follow these steps to verify that your DAL node is receiving attestation rights:

1. Record the address of your baker account in an environment variable so you can use it for commands that cannot get addresses by their Octez client aliases:

   ```bash
   MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
   ```

1. Run this command to get the consensus attestation rights for your baker in the current cycle:

   ```bash
   octez-client rpc get /chains/main/blocks/head/helpers/attestation_rights?delegate="$MY_BAKER"
   ```

   When your baker has attestation rights, the command returns information about them, as in this example:

   ```json
   [ { "level": 9484,
    "delegates":
      [ { "delegate": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE",
          "first_slot": 280, "attestation_power": 58,
          "consensus_key": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE" } ] } ]
   ```

1. If the command returns an empty array (`[]`), make sure the baker daemon and nodes are running and wait for the delay to be over.

1. When your baker receives attestation rights as determined by the `/chains/main/blocks/head/helpers/attestation_rights` RPC call, run this command to get the shards that are assigned to your DAL node:

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/dal/shards?delegates=$MY_BAKER
   ```

   The response includes your account's address and a list of shards, as in this example:

   ```json
   [ { "delegate": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
    "indexes": [ 25, 27, 67, 73, 158, 494 ] } ]
   ```

1. Verify that your DAL node is subscribed to the correct Gossipsub network topics by running this command:

   ```bash
   curl http://localhost:10732/p2p/gossipsub/topics
   ```

   If you are using the `tezos/tezos` Docker image, you can install the `curl` program by running the command `sudo apk add curl`.

   DAL nodes share shards and information about them over a peer-to-peer pub/sub network built on the Gossipsub protocol.
   As layer 1 assigns shards to the bakers, the Gossipsub network manages topics that DAL nodes can subscribe to.
   For example, if a user submits data to slot 1, the network has a list of topics: a topic to identify the slot 1 shards assigned to baker A, a topic to identify the slot 1 shards assigned to baker B, and so on for all the bakers that are assigned shards from slot 1.

   Then, the baker daemon automatically asks the DAL node to subscribe to the topics that provide the shards that it is assigned to.

   In the results, each topic contains a shard and the address of the baker that is assigned to it.
   Your DAL node and baker are listening to these topics and attesting to the data in them.

Now you have a complete DAL baking setup.
Your baker is attesting to the availability of DAL data and the DAL node is sharing it to Smart Rollups across the network.

For a summary of this tutorial, see [Conclusion](./conclusion).
