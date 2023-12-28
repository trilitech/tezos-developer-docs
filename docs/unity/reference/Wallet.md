---
title: Unity SDK Wallet object
sidebar_label: Wallet object
authors: Tim McMackin
last_update:
  date: 11 December 2023
---

The Unity SDK class `TezosSDK.Tezos.Wallet.WalletProvider`, which is available at runtime as `TezosManager.Instance.Wallet`, provides methods to connect to wallets and send transactions from the connected account.

## Properties

None.

## Methods

### `Connect()`

```csharp
void Connect(WalletProviderType walletProvider, bool withRedirectToWallet)
```

Sends a request to a user's wallet to connect to the application.

Parameters:

  - `walletProvider`: The type of wallet to connect to, including `WalletProviderType.beacon` for TZIP-10 wallets (most Tezos wallets) and `WalletProviderType.kukai` for Kukai wallets.
  - `withRedirectToWallet`: When running on a mobile platform, whether to open the connected mobile app after connecting to a wallet.

This method triggers the `WalletConnected` or `AccountConnectionFailed` events, depending on whether the connection was successful or not.

When the `walletProvider` parameter is set to `WalletProviderType.beacon`, this method automatically picks the correct way to connect to wallets:

- In WebGL applications, it uses the `TezosSDK.Beacon.BeaconConnectorWebGl` class to trigger the browser to connect to a wallet app in a browser plugin.
- In all other applications, it uses the `TezosSDK.Beacon.BeaconConnectorDotNet` class to generate a QR code to connect to a wallet app on a mobile device or use a "deep link" to connect to a wallet on the same mobile device that is running the application.

When the `walletProvider` parameter is set to `WalletProviderType.kukai` in a WebGL application, it triggers the web browser to open the user's Kukai wallet.
This type of connection is appropriate only for WebGL applications.

<!-- TODO
There's a lot more to connections, as described in https://opentezos.com/gaming/unity-sdk/api-documentation/#iwalletproviderconnect.
Need to work out what's relevant here and what should go in a topic on connecting to wallets.

What happens with the redirect param?

Update: Per Berk, there are only these two ways of connecting now.
Update, no, it appears we still have qr code, deep link (beacon), and social (kukai)
Need to verify how the WalletProviderType.kukai works
-->

### `Disconnect()`

```csharp
void Disconnect()
```

Disconnects from the currently connected wallet.

This method triggers the `WalletDisconnected` event.

### `GetActiveAddress()`

```csharp
void GetActiveAddress()
```

Returns the address (public key hash) of the currently connected account, or NULL if no wallet is connected.

### `RequestSignPayload()`

```csharp
public void RequestSignPayload(
  SignPayloadType signingType,
  string payload)
```

Sends a request to the connected wallet to sign a payload string.

Parameters:

  - `signingType`: The type of payload, such as raw, operation or micheline.
  - `payload`: The payload to send to the wallet to sign.

<!-- TODO link to info about more you can do with signing messages -->

Signing a message proves that it came from a specific user's wallet because the wallet encrypts the message with the user's account's key.
For example, this code prompts the user to sign the message "This message came from my account."

```csharp
string payload = "This message came from my account.";

TezosManager.Instance.MessageReceiver.PayloadSigned += OnPayloadSigned;
TezosManager.Instance.Wallet.RequestSignPayload(SignPayloadType.micheline, payload);
```

### `VerifySignedPayload()`

```csharp
bool VerifySignedPayload(SignPayloadType signingType, string payload)
```

Returns true if most recent response to `RequestSignPayload` matches the specified payload and is properly signed.

### `CallContract()`

```csharp
void CallContract(
    string contractAddress,
    string entryPoint,
    string input,
    ulong amount = 0);
```

Calls the specified entrypoint of the specified contract.

This method triggers the `ContractCallInjected` event if the call is successfully sent to Tezos.
Then it triggers `ContractCallCompleted` or `ContractCallFailed` events, depending on whether the call succeeded or failed.

<!-- TODO info about formatting parameters -->

### `OriginateContract()`

```csharp
void OriginateContract(
  string script,
  string delegateAddress);
```

Deploys (originates) the specified contract.

To use this method, you must compile a contract to Michelson in a JSON file.
For an example, see the code of the built-in contract in `Resources/Contracts`.

The optional `delegateAddress` parameter is the address of the account to delegate the contract's tez to.
For more information, see [Delegation](../../smart-contracts/delegation).

This method triggers the `ContractCallInjected` event if the call is successfully sent to Tezos.
Then it triggers `ContractCallCompleted` or `ContractCallFailed` events, depending on whether the origination operation succeeded or failed.
