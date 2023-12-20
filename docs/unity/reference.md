---
title: Unity SDK reference
sidebar_label: Reference
authors: Tim McMackin
last_update:
  date: 20 December 2023
---

The Tezos SDK for Unity provides several objects that your Unity project can use to work with Tezos.
These pages provide reference for the most important of these objects:

- [API object](./reference/API): Provides information about the Tezos blockchain, such as what tokens accounts or contracts control
- [DAppMetadata object](./reference/DAppMetadata): Provides read-only properties that describe the project
- [MessageReceiver object](./reference/MessageReceiver): Provides events that you can add listeners to, such as when users connect their wallets
- [TezosConfig object](./reference/TezosConfig): sets the [RPC](../architecture/rpc) node that the SDK uses to send transactions to Tezos
- [TokenContract object](./reference/TokenContract): Provides a built-in FA2-compatible smart contract and convenience methods to work with it
- [Wallet object](./reference/Wallet): Provides methods to connect to wallets and send transactions from the connected account

The SDK also provides Unity prefabs that are prerequisites for the SDK; see [Prefabs](./prefabs).
