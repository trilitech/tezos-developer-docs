---
title: Unity SDK events
sidebar_label: Events
authors: Tim McMackin
last_update:
  date: 8 January 2025
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

Runs when a Tezos operation succeeds or fails and returns an object that includes the hash of the transaction.
This event does not run for Etherlink operations.

## `SigningResulted`

Runs when a user signs a payload and returns the signed payload.

## `PairingRequested`

Runs when the SDK attempts to pair with a Beacon wallet on a non-WebGL platform and returns the pairing information that the application can use to generate a QR code.
In most cases the application should use the Beacon popup window instead of generating the QR code itself.
