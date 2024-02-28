---
title: "Step 3: Set up a baker account on Weeklynet"
authors: Tezos core developers
last_update:
  date: 28 February 2024
---

Our baker needs a user account consisting of a pair of keys and an address.

1. Open a new terminal window in the same environment.
If you are using a Docker container, you can enter the container with the `docker exec` command, as in `docker exec -it my-image /bin/sh`.
To get the name of the Docker container, you run the `docker ps` command.

1. Set your installation of the Octez client to use your node:

   - If you have not used the Octez client yet, run this command to initialize it:

   ```bash
   octez-client -E http://127.0.0.1:8732 config init
   ```

   If you have already initialized the Octez client, run this command to instruct it to query your node:

   ```bash
   octez-client -E http://127.0.0.1:8732 config update
   ```

   For bakers, it's important to set the Octez client to use their node rather than a public node because the baker daemon uses the client configuration and the baker daemon should use the local node.

1. Optional: Hide the network warning message by running this command:

   ```bash
   export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=y
   ```

   This command suppresses the message that your instance of the Octez client is not using Mainnet.

1. Create or import an account in the Octez client.
The simplest way to get an account that works with Weeklynet is to use the Octez client to randomly generate an account.
This command creates an account and associates it with the `my_baker` alias:

   ```bash
   octez-client gen keys my_baker
   ```

   The address of the generated account can be obtained with the following command:

   ```bash
   octez-client show address my_baker
   ```

1. Record this address in a shell variable so you can use it for commands that cannot get addresses by their Octez client aliases:

   ```bash
   MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
   ```

   At this point, the balance of the `my_baker` account is still zero, as you can see by running this command:

   ```bash
   octez-client get balance for my_baker
   ```

1. Get some tez from the Weeklynet faucet.

   In order to get some consensus and DAL rights, we need to put some tez in the account. Fortunately, getting free testnet tez is easy thanks to the testnet faucet. To use it, we need to enter the generated address in the Weeklynet faucet linked from https://teztnets.com/weeklynet-about. We need at least 6k tez for running a baker but the more tez we have the more rights we will get and the shorter we will have to wait to produce blocks and attestations. That being said, baking with too much stake prevents us from leaving the network without disturbing or even halting it so to avoid breaking the network for all other testers let's not be too greedy. 50k tez is enough to get enough rights to easily check if our baker behaves as expected while not disturbing the network too much when our baker stops operating.

1. Verify that the faucet sent the tez to the account with the same `get balance` command:

   ```bash
   octez-client get balance for my_baker
   ```

   At this point, the `my_baker` account owns enough stake to bake but has still no consensus or DAL rights because we haven't declared our intention to become a baker to the Tezos protocol.

1. Register your account as a delegate by running the following command:

   ```bash
   octez-client register key my_baker as delegate
   ```

1. Stake the tez, saving a small amount for transaction fees.
For example, if your account has 50k tez, stake 49990 tez by running this command:

   ```bash
   octez-client stake 49990 for my_baker
   ```

   Seven cycles later (about 1h40 on Weeklynet), our baker will start receiving rights. To see for instance its consensus attestation rights in the current cycle, we can use the following RPC call:

   ```bash
   octez-client rpc get /chains/main/blocks/head/helpers/attestation_rights\?delegate="$MY_BAKER"
   ```

   When your baker has attestation rights, the previous command returns information about them, as in this example:

   ```json
   [ { "level": 9484,
    "delegates":
      [ { "delegate": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE",
          "first_slot": 280, "attestation_power": 58,
          "consensus_key": "tz1Zs6zjxtLxmff51tK2AVgvm4PNmdNhLcHE" } ] } ]
   ```

   To see the DAL attestation rights of all bakers, we can use the following RPC call:

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/dal/shards
   ```

   This command returns an array of DAL attestation rights. The 2048 shards which are expected to be attested at this level are shared between active bakers proportionally to their stake. Each baker is assigned a slice of shard indices represented in the output of this command by a pair consisting of the first index and the length of the slice. So to check if some rights were assigned to us we can filter the array to our baker by running this command:

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/dal/shards | grep "$MY_BAKER"
   ```

When attestation rights are assigned to your baker, continue to [Step 4: Run an Octez DAL node on Weeklynet](./run-dal-node.md).
