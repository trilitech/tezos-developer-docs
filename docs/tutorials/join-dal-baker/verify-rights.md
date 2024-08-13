---
title: "Step 5: Verify attestation rights"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 12 August 2024
---

After the delay that you calculated in [Step 4: Run an Octez baking daemon](./run-baker), the baker starts receiving attestation rights, including the rights to attest that DAL data is available.

Follow these steps to verify that your DAL node is receiving attestation rights:

1. Record the address of your baker account in an environment variable so you can use it for commands that cannot get addresses by their Octez client aliases:

   ```bash
   MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
   ```

1. Run this command to get the attestation rights for the baker in the current cycle:

   ```bash
   octez-client rpc get /chains/main/blocks/head/helpers/attestation_rights?delegate="$MY_BAKER"
   ```

   If the baker has no rights, the command returns an empty array: `[]`.

   When the baker has attestation rights, the command returns information about them, as in this example:

   ```json
   [ { "level": 9484,
    "delegates":
      [ { "delegate": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE",
          "first_slot": 280, "attestation_power": 58,
          "consensus_key": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE" } ] } ]
   ```

   If the command returns an empty array (`[]`), the delay may not be over.

   If the delay has expired and you still haven't received attestation rights, try these troubleshooting steps:

   - Make sure that your node and baker are running.

   - Verify that the staked balance of your account is at least 6,000 tez by running the command `octez-client get staked balance for my_baker`.
   If the response is less than 6,000 tez, you have not staked enough.
   Ensure that you are registered as a delegate and stake more tez, retaining a small amount for transaction fees.
   If necessary you can get more from the faucet.

   - Check to see if you will receive rights two cycles in the future:

      1. Run this command to get the current cycle:

         ```bash
         octez-client rpc get /chains/main/blocks/head | jq | grep '"cycle"'
         ```

      1. Add two to the cycle and run this command to see what rights your account will have in the next cycle.
      For example, if the current cycle is 149, run this command to get its rights in cycle 151:

         ```bash
         octez-client rpc get /chains/main/blocks/head/helpers/baking_rights\?cycle=151\&delegate=$MY_BAKER\&max_round=2
         ```

         If this command returns a list of future attestation rights for your account, the delay has not expired yet and you must wait for that cycle to arrive.

1. When your baker receives attestation rights as determined by the `/chains/main/blocks/head/helpers/attestation_rights` RPC call, run this command to get the shards that are assigned to your DAL node:

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/dal/shards?delegates=$MY_BAKER
   ```

   The response includes your account's address and a list of shards, as in this example:

   ```json
   [ { "delegate": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
    "indexes": [ 25, 27, 67, 73, 158, 494 ] } ]
   ```

   These shards are pieces of data that the baker is assigned to attest.

1. Verify the baker's activity on the Explorus block explorer by going to the Consensus Ops page at https://explorus.io/consensus_ops, selecting Ghostnet, and searching for your address.

   For example, this screenshot shows consensus operations that include DAL attestations, indicated by a binary number in the "DAL attestation bitset" column.
   In this case, the number is 0 because there was no DAL data but the nodes were ready to attest to it.

   ![DAL consensus operations, showing DAL consensus operations](/img/tutorials/dal-explorus-consensus-ops.png)

   If there is no DAL attestation, the block explorer shows a document icon with an X in it: ![](/img/tutorials/dal-explorus-no-attestation-icon.png).
   This icon can appear before the bakers complete attestations and then turn into a binary number when they attest.

Now you have a complete DAL baking setup.
Your baker is attesting to the availability of DAL data and the DAL node is sharing it to Smart Rollups across the network.

## Optional: Unstaking your tez and receiving your baking rewards

If you leave the baker running, you can see rewards accrue by running the command `octez-client get staked balance for my_baker`.
This amount starts at the amount that you originally staked and increases with your baking rewards.

You can unstake your tez and withdraw your stake and any baking rewards with the `octez-client unstake` command.
For example, this command unstakes 6,000 tez:

```bash
octez-client unstake 6000 for my_baker
```

Then run this command to retrieve the tez:

```bash
octez-client finalize unstake for my_baker
```

Then you can do whatever you want with the tez, including sending it back to the faucet for someone else to use.
The Ghostnet faucet's address is `tz1a4GT7THHaGDiTxgXoatDWcZfJ5j29z5RC`, so you can send funds back with this command:

```bash
octez-client transfer 6000 from my_baker to tz1a4GT7THHaGDiTxgXoatDWcZfJ5j29z5RC
```

For a summary of this tutorial, see [Conclusion](./conclusion).
