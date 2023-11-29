---
title: SDK for Unity reference
---

- Overview page for SDK/API reference for the SDK for Unity.

- Info about different ways of accessing the SDK, like the singleton/instance thing?

The SDK provides these objects:

- [`TezosManager.Instance.Tezos.API`](./unity/API): An object that provides methods to access data from Tezos, such as an account's balance in tez or the metadata for a token.

- [`TezosManager.Instance.DAppMetadata`](./unity/DAppMetadata): Read-only metadata about the project, including the Name, Url, Icon, and Description fields that you set on the TezosManager prefab in the Unity Editor.

- [`TezosManager.Instance.MessageReceiver`](./unity/MessageReceiver): An object that provides events that you can add listeners to. You can see these events and their return values in the WalletEventManager.cs file.

- [`TezosManager.Instance.Tezos.TokenContract`](./unity/TokenContract): An object that provides an FA2 contract and convenience methods to access it. You can use this object to deploy the contract and call the contract's entrypoints to create and transfer tokens.

- [`TezosManager.Instance.Wallet`](./unity/Wallet): An object that provides information about the connected wallet and allows you to send transactions from the user's account.