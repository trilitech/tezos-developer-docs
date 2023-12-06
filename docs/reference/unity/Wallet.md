---
title: Unity SDK Wallet object
sidebar_label: Wallet object
authors: Tim McMackin
last_update:
  date: 6 December 2023
---

The Unity SDK class `TezosSDK.Tezos.Wallet.WalletProvider`, which is available at runtime as `TezosManager.Instance.Wallet`, provides methods to connect to wallets and send transactions from the connected account.

## `Connect()`

```csharp
void Connect(WalletProviderType walletProvider, bool withRedirectToWallet)
```

Sends a request to a user's wallet to connect to the application.

Parameters:

  - `walletProvider`: The type of wallet to connect to, including `WalletProviderType.beacon` for TZIP-7 wallets (most Tezos wallets) and `WalletProviderType.kukai` for Kukai wallets.
  - `withRedirectToWallet`: Whether to open the connected mobile app after connecting to a wallet via another source, such as a desktop app.

This method triggers the `AccountConnected` or `AccountConnectionFailed` events, depending on whether the connection was successful or not.

<!-- TODO
There's a lot more to connections, as described in https://opentezos.com/gaming/unity-sdk/api-documentation/#iwalletproviderconnect.
Need to work out what's relevant here and what should go in a topic on connecting to wallets.
-->

## `Disconnect()`

```csharp
void Disconnect()
```

Disconnects from the currently connected wallet.

This method triggers the `AccountDisconnected` event.

## `GetActiveAddress()`

```csharp
void GetActiveAddress()
```

Returns the address (technically the public key hash) of the currently connected account, or NULL if no wallet is connected.

## `RequestSignPayload()`

```csharp
public void Connect(WalletProviderType walletProvider, bool withRedirectToWallet)
```

Sends a request to the connected wallet to sign a payload string.
Signing a message proves that it came from a specific user's wallet because the wallet encrypts the message with the user's account's key.
You can prompt users to sign messages for several reasons, including:

For example, this code prompts the user to sign the message "This message came from my account."

```csharp
using Beacon.Sdk.Beacon.Sign;

string payload = "This message came from my account.";

TezosManager.Instance.MessageReceiver.PayloadSigned += OnPayloadSigned;
TezosManager.Instance.Wallet.RequestSignPayload(SignPayloadType.micheline, payload);
```

## `VerifySignedPayload()`

```csharp
bool VerifySignedPayload(SignPayloadType signingType, string payload)
```

Returns true if most recent response to `RequestSignPayload` matches the specified payload and is properly signed.

## `CallContract()`

```csharp
void CallContract(
    string contractAddress,
    string entryPoint,
    string input,
    ulong amount = 0);
```

Calls the specified entrypoint of the built-in FA2 contract.

You can use this method as an alternative to calling convenience methods such as `TezosManager.Instance.Tezos.TokenContract.Mint()` directly or as a way to call the contract methods that do not have convenience methods in the `TokenContract` object.
