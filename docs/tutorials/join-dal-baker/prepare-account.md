---
title: "Step 3: Set up a baker account on Weeklynet"
authors: Tezos core developers
last_update:
  date: 23 January 2024
---

Our baker needs a user account consisting of a pair of keys and an address.
The simplest way to get an account that works with Weeklynet is to use the Octez client to randomly generate them and associate them to the `my_baker` alias:

```bash
octez-client gen keys my_baker
```

The address of the generated account can be obtained with the following command:

```bash
octez-client show address my_baker
```

Let's record this address in a shell variable, this will be useful for the some commands which cannot get addresses by their octez-client aliases.

```bash
MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
```

At this point, the balance of the `my_baker` account is still empty as can be seen with the following command:

```bash
octez-client get balance for my_baker
```

In order to get some consensus and DAL rights, we need to put some tez in the account. Fortunately, getting free testnet tez is easy thanks to the testnet faucet. To use it, we need to enter the generated address in the Weeklynet faucet linked from https://teztnets.com/weeklynet-about. We need at least 6k tez for running a baker but the more tez we have the more rights we will get and the shorter we will have to wait to produce blocks and attestations. That being said, baking with too much stake prevents us from leaving the network without disturbing or even halting it so to avoid breaking the network for all other testers let's not be too greedy. 50k tez is enough to get enough rights to easily check if our baker behaves as expected while not disturbing the network too much when our baker stops operating.

We can verify that the faucet sent the tez to the account with the  same `get balance` command:

```bash
octez-client get balance for my_baker
```

At this point, the `my_baker` account owns enough stake to bake but has still no consensus or DAL rights because we haven't declared our intention to become a baker to the Tezos protocol. This can be achieved with the following command:

```bash
octez-client register key my_baker as delegate
```

Seven cycles later (about 1h40 on Weeklynet), our baker will start receiving rights. To see for instance its consensus attestation rights in the current cycle, we can use the following RPC call:

```bash
octez-client rpc get /chains/main/blocks/head/helpers/attestation_rights\?delegate="$MY_BAKER"
```

To see the DAL attestation rights of all bakers, we can use the following RPC call:

```bash
octez-client rpc get /chains/main/blocks/head/context/dal/shards
```

This command returns an array of DAL attestation rights. The 2048 shards which are expected to be attested at this level are shared between active bakers proportionally to their stake. Each baker is assigned a slice of shard indices represented in the output of this command by a pair consisting of the first index and the length of the slice. So to check if some rights were assigned to us we can filter the array to our baker by running this command:

```bash
octez-client rpc get /chains/main/blocks/head/context/dal/shards | grep "$MY_BAKER"
```

No rights are assigned to our baker yet.
Continue to [Step 4: Run an Octez DAL node on Weeklynet](./run-dal-node.md).
