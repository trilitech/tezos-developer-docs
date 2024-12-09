---
title: "Step 5: Troubleshooting"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 2 December 2024
---

If after the delay that you calculated in [Step 4: Run an Octez baking daemon](/tutorials/join-dal-baker/run-baker), the baker does not starts inserting consensus (pre-)attestations and DAL attestations, follow these instructions to diagnose and fix the issue.

1. Record the address of your baker account in an environment variable so you can use it for commands that cannot get addresses by their Octez client aliases:

   ```bash
   MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
   ```

1. Run these commands to get the (consensus) attestation rights for the baker in the current cycle:

   1. Get the current cycle by running this command:

      ```bash
      octez-client rpc get /chains/main/blocks/head | jq | grep '"cycle"'
      ```

   1. Use the current cycle as the `<current-cycle>` parameter in this command.
   Beware, this command may take several minutes to finish if the list of rights is long:

      ```bash
      octez-client rpc get "/chains/main/blocks/head/helpers/attestation_rights?delegate=$MY_BAKER&cycle=<current-cycle>"
      ```

   When the baker has attestation rights, the command returns information about them, as in this example:

   ```json
   [ { "level": 9484,
    "delegates":
      [ { "delegate": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE",
          "first_slot": 280, "attestation_power": 58,
          "consensus_key": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE" } ] }
      ...
    ]
   ```

   If the command returns an empty array (`[]`), the baker has no rights in the specified cycle.

   - Check to see if you will receive rights two cycles in the future, using commands similar to those above for the current cycle.
   You can see who will receive rights no farther than two cycles in the future.
   This number of cycles is set by the `consensus_rights_delay` network parameter.

     If this returns a list of future attestation rights for your account, you must wait for that cycle to arrive.

   - Otherwise, make sure that your node and baker are running.

   - Verify that the staked balance of your account is at least 6,000 tez by running the command `octez-client get staked balance for my_baker`.
   If the response is less than 6,000 tez, you have not staked enough.
   Ensure that you are registered as a delegate and stake more tez, retaining a small amount for transaction fees.
   If necessary you can get more from the faucet.

   - Check to see if you are active and re-register as a delegate if necessary:

      1. Run this command to see if your account is marked as inactive:

         ```bash
         octez-client rpc get /chains/main/blocks/head/context/delegates/$MY_BAKER/deactivated
         ```

         Baker accounts are deactivated when the baker is offline for a certain time.

      1. If the value for the `deactivated` field is `true`, re-register as a baker by running this command:

         ```bash
         octez-client register key my_baker as delegate
         ```

      When the next cycle starts, Tezos calculates attestation rights for two cycles in the future and includes your baker.

      You can find when the next cycle will start by running these commands:

        1. Find the last level of the current cycle by running this command:

           ```bash
           octez-client rpc get "/chains/main/blocks/head/helpers/levels_in_current_cycle"
           ```

         1. Pass the last level of the cycle as the `<last-block>` parameter in this command:

            ```bash
            octez-client rpc get "/chains/main/blocks/head/helpers/attestation_rights?level=<last-block>" | grep '"estimated_time"'
            ```

            The response shows the estimated time when the cycle will end.


      You can also find when the next cycle will start by going to a block explorer such as https://ghostnet.tzkt.io.
      For example, this drop-down shows that the next cycle starts in 29 minutes:

        <img src="/img/tutorials/tzkt-next-cycle.png" alt="The TZKT block explorer, showing information about the current cycle" style={{width: 300}} />

1. When your baker receives attestation rights as determined by the `/chains/main/blocks/head/helpers/attestation_rights` RPC call, run this command to get the shards that are assigned to your DAL node for the next block:

   ```bash
   octez-client rpc get "/chains/main/blocks/head/context/dal/shards?delegates=$MY_BAKER"
   ```

   The response includes your account's address and a list of shards, as in this example:

   ```json
   [ { "delegate": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
    "indexes": [ 25, 27, 67, 73, 158, 494 ] } ]
   ```

   These shards are pieces of data that the baker is assigned to attest.

   Note that you have to potentially execute the command above during many block levels in order to find a block where you have some shards assigned.
   Unfortunately, there is currently no simple command line to get all your DAL rights for a whole cycle, for example.

1. Verify the baker's activity on the Explorus block explorer by going to the Consensus Ops page at https://explorus.io/consensus_ops, selecting Ghostnet, and searching for your address.

   For example, this screenshot shows consensus operations that include DAL attestations, indicated by a number in the "DAL attestation bitset" column.

   ![DAL consensus operations, showing DAL consensus operations](/img/tutorials/dal-explorus-consensus-ops.png)

   If there is no DAL attestation, the block explorer shows a document icon with an X in it: ![](/img/tutorials/dal-explorus-no-attestation-icon.png).
   This icon can appear before the bakers complete attestations and then turn into a binary number when they attest.

   If you see the rights, you will see the attestations in the baker's log when scheduled. Now you have a complete DAL baking setup.
   Your baker is attesting to the availability of DAL data and the DAL node is sharing it to Smart Rollups across the network.

If you don't see DAL attestation rights:

   - Verify that your DAL node is connected to the network by following the instructions in [Troubleshooting](https://tezos.gitlab.io/shell/dal_run.html#troubleshooting) in the Octez documentation.

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

For a summary, see [Conclusion](/tutorials/join-dal-baker/conclusion).
