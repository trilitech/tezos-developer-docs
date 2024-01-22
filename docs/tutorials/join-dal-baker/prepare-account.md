# Step 3: Set up a baker account on Weeklynet

Our baker needs an implicit account consisting of a pair of keys and an address. The simplest way to get them is to ask the Octez client to randomly generate them and associate them to the `my_baker` alias:

```
octez-client gen keys my_baker
```

The address of the generated account can be obtained with the following command:

```
octez-client show address my_baker
```

Let's record this address in a shell variable, this will be useful for the some commands which cannot get addresses by their octez-client aliases.

```
MY_BAKER="$(octez-client show address my_baker | head -n 1 | cut -d ' ' -f 2)"
```

At this point, the balance of the `my_baker` account is still empty as can be seen with the following command:

```
octez-client --endpoint "$ENDPOINT" get balance for my_baker
```

In order to get some consensus and DAL rights, we need to put some tez on the account. Fortunately, getting free testnet tez is easy thanks to the testnet faucet. To use it, we need to enter the generated address in the Weeklynet faucet linked from https://teztnets.com/weeklynet-about. We need at least 6k tez for running a baker but the more tez we have the more rights we will get and the shorter we will have to wait to produce blocks and attestations; that being said, baking with too much stake would prevent us from leaving the network without disturbing or even halting it so to avoid breaking the network for all other testers let's not be too greedy. 50k tez should be enough to get enough rights to easily check if our baker behaves as expected while not much disturbing the network when our baker will stop operating.

Once the tez are obtained from the faucet, we can check with the same `get balance` command that they have been received:

```
octez-client --endpoint "$ENDPOINT" get balance for my_baker
```

At this point, the `my_baker` account owns enough stake to bake but has still no consensus nor DAL rights because we haven't declared to the Tezos protocol our intention to become a baker. This can be achieved with the following command:

```
octez-client --endpoint "$ENDPOINT" register key my_baker as delegate
```

Seven cycles later (about 1h40 on Weeklynet), our baker will start receiving rights. To see for instance its consensus attestation rights in the current cycle, we can use the following RPC:

```
octez-client --endpoint "$ENDPOINT" rpc get /chains/main/blocks/head/helpers/attestation_rights\?delegate="$MY_BAKER"
```

To see the DAL attestation rights of all bakers, we can use the following RPC:

```
octez-client --endpoint "$ENDPOINT" rpc get /chains/main/blocks/head/context/dal/shards
```

This command returns an array of DAL attestation rights. The 2048 shards which are expected to be attested at this level are shared between active bakers proportionally to their stake. Each baker is assigned a slice of shard indices represented in the output of this command by a pair consisting of the first index and the length of the slice. So to check if some rights were assigned to us we can filter the array to our baker by running this command:

```
octez-client --endpoint "$ENDPOINT" rpc get /chains/main/blocks/head/context/dal/shards | grep "$MY_BAKER"
```