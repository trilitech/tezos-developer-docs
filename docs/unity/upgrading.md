---
title: Upgrading the Unity SDK
sidebar_label: Upgrading
authors: Tim McMackin
last_update:
  date: 25 November 2024
---

Version 4.0.0 of the Unity SDK includes breaking changes from the previous version.

## Changed methods

These methods have changed in version 4.0.0:

### Connecting to wallets

Unity applications no longer use the `TezosSDK.Tezos.Wallet.WalletProvider` object to connect to wallets.
See [Connecting accounts](/unity/connecting-accounts).

### Getting wallet information

Unity applications no longer use the `TezosSDK.Tezos.Wallet.WalletProvider` object to get information about the connected wallet.

Instead, use these methods:

- `TezosAPI.GetConnectionAddress()`: Returns the address of the currently connected account
-  `TezosAPI.GetBalance()`: Returns the balance of the connected account in tez (for Tezos connections) or XTZ (for Etherlink connections)
- `TezosAPI.GetWalletConnectionData()` or `TezosAPI.GetSocialLoginData()`: Returns information about the connected wallet

### Signing messages

The way that the SDK handles signing messages has changed.
For an example, see [Signing messages](/unity/quickstart#signing-messages).

## Contracts

Version 3 included a built-in FA2 token contract and convenience methods for using it.
This contract and the convenience methods are not provided in version 4, so you must deploy your own contract and call it directly, without the convenience methods.
The `TezosSDK.Tezos.API.Models.TokenContract` object is no longer available.

The contract itself is still supported, so if you have a copy of the contract deployed, you can continue to use it.

If you need an FA2 contract to manage tokens, templates are available in the [SmartPy](https://smartpy.io/ide) and [LIGO online IDE](https://ide.ligolang.org/).

### Deploying contracts

The `TokenContract.Deploy()` method and the `TokenContract.address` variable are not available in version 4.0.0.

In most cases, you deploy a contract from another client and use that contract through the Unity SDK.
See [Deploying smart contracts](/smart-contracts/deploying).

However, if you want to deploy a contract from the Unity SDK, you can use the `TezosAPI.DeployContract` method.

### Calling contracts

Version 4.0.0 of the SDK does not include the `TezosManager.Instance.Tezos.TokenContract.Mint()` method or the `TezosManager.Instance.Tezos.TokenContract.Transfer()` method.

To call contracts with the SDK, see [Calling contracts with the Unity SDK](/unity/calling-contracts).

### Managing tokens

The SDK no longer includes convenience methods for getting token balances or transferring tokens.
To work with tokens, see [Managing tokens](/unity/managing-tokens).

## Changing the RPC node

It's easier to change the RPC node in version 4.0.0 because you can edit the TezosConfig scriptable object directly at `Assets/Tezos/Resources/TezosConfig.asset` and set the RPC URL in the **Rpc Url Format** field.
See [Changing the RPC node](/unity/quickstart#changing-the-rpc-node).
