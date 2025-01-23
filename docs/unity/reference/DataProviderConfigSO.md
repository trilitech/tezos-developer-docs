---
title: DataProviderConfigSO scriptable object
authors: Tim McMackin
last_update:
  date: 21 November 2024
---

The DataProviderConfigSO scriptable object sets the indexer that the SDK uses to get information about Tezos, such as an account's token balances.
In most cases you do not need to edit this object, but in some cases Tezos dApps use a custom indexer to provide specific information that they need.

<img src="/img/unity/unity-data-provider-config.png" alt="Setting the indexer in the DataProviderConfigSO object" style={{width: 300}} />

## Properties

- `Network`: A variable that lets you select which network to use, such as Tezos Mainnet or the Ghostnet testnet
- `Base Url Format`: The URL of the indexer to use; this value replaces the variable `{network}` with the value of the `Network` field
- `Documentation Url`: A link to the API reference for the indexer

For more information about indexers, see [Indexers](/developing/information/indexers).
