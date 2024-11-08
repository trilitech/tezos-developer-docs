---
title: Unity SDK events
sidebar_label: Events
authors: Tim McMackin
last_update:
  date: 6 November 2024
---

The Tezos Unity SDK uses events that you can add listeners to.
These events are asynchronous, which means that the order in which events are called is not guaranteed.

For example, this code assigns functions to the `WalletConnected` and `WalletDisconnected` events to run when a Beacon or WalletConnect wallet connects or disconnects:

```csharp
private async void Start()
{

    TezosAPI.WalletConnected += OnWalletConnected;
    TezosAPI.WalletDisconnected += OnWalletDisconnected;

    await TezosAPI.WaitUntilSDKInitialized();
}

private void OnWalletConnected(WalletProviderData walletProviderData)
{
    Debug.Log(walletProviderData.WalletType);
    Debug.Log(walletProviderData.WalletAddress);
    Debug.Log(walletProviderData.PublicKey);
    Debug.Log(walletProviderData.PairingUri);
}

private void OnWalletDisconnected()
{
    Debug.Log("Wallet disconnected.");
}
```

## `WalletConnected`

Runs when a non-social wallet connects and returns an object with the type of wallet (`BEACON` or `WALLETCONNECT`), the address (public key hash) of the connected account, the public key, and the URI used for pairing with the wallet.

## `WalletDisconnected`

Runs when a non-social wallet disconnects.

## `SocialLoggedIn`

Runs when a social wallet connects and returns an object with the type of wallet (always `KUKAI`) and other information about the connection.
<!-- TODO more detail about the SocialProviderData object -->

## `SocialLoggedOut`

Runs when a social wallet disconnects.

## `OperationResulted`

Runs when an operation succeeds or fails and returns an object that includes the hash of the transaction.

## `SigningResulted`

Runs when a user signs a payload and returns the signed payload.

## `PairingRequested`

Runs when the SDK attempts to pair with a wallet and returns the pairing information for the wallet.
