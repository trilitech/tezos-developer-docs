---
title: DataProviderConfigSO scriptable object
authors: Tim McMackin
last_update:
  date: 11 January 2024
---

The DataProviderConfigSO scriptable object sets the indexer that the SDK uses to get information about Tezos, such as an account's token balances.
Some Tezos dApps use a custom indexer to provide specific information that they need.

To use this object, create an instance of it, put your information in its fields, and then drag this instance to the Data Provider Config field of the [TezosConfigSO scriptable object](/unity/reference/TezosConfigSO) object, as in this picture:

<img src="/img/unity/unity-ipfs-scene-config.png" alt="Adding the Pinata API key and the data provider to the TezosConfigSO object" style={{width: 300}} />

## Properties

- `Script`: The attached script that implements the object
- `Network`: A variable that lets you select which network to use, such as Tezos Mainnet or the Ghostnet testnet
- `Base Url Format`: The URL of the indexer to use; this value replaces the variable `{network}` with the value of the `Network` field
- `Request Timeout Seconds`: The time in seconds to wait for a response from the indexer
- `Documentation Url`: A link to the API reference for the indexer

For more information about indexers, see [Indexers](/developing/information/indexers).
