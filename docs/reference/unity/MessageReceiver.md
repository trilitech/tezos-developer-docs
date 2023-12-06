---
title: Unity SDK MessageReceiver object
sidebar_label: MessageReceiver object
authors: Tim McMackin
last_update:
  date: 6 December 2023
---

The Unity SDK class `TezosSDK.Beacon.WalletMessageReceiver`, which is available at runtime as the `TezosManager.Instance.MessageReceiver` object, provides events that you can add listeners to.

These events are asynchronous.
For example, if your project makes multiple calls to smart contracts, the `ContractCallCompleted` event runs multiple times, not necessarily in the order that you called the contracts.

## Example

This code adds a listener for the `AccountConnected` and `AccountDisconnected` events:

```csharp
private void Start()
{
    TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
    TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
}

private void OnAccountConnected(AccountInfo accountInfo)
{
    Debug.Log(accountInfo.Address);
}

private void OnAccountDisconnected(AccountInfo accountInfo)
{
    Debug.Log(accountInfo.Address);
    Debug.Log("Account disconnected.");
}
```

## Events

### `public event Action<AccountInfo> AccountConnected`

Runs when an account connects successfully.
Returns a `TezosSDK.Beacon.AccountInfo` object with information that includes the address of the connected account.

### `public event Action<ErrorInfo> AccountConnectionFailed`

Runs when a connection to an account fails.
Returns a `TezosSDK.Beacon.ErrorInfo` object with an error message.

### `public event Action<AccountInfo> AccountDisconnected`

Runs when an account disconnects.
Returns a `TezosSDK.Beacon.AccountInfo` object with information that includes the address of the connected account.

### `public event Action<OperationResult> ContractCallCompleted`

Runs when a call to a smart contract is confirmed on the blockchain.
Returns a `TezosSDK.Beacon.OperationResult` object with the hash of the transaction.

### `public event Action<ErrorInfo> ContractCallFailed`

Runs when a call to a smart contract fails.
Returns a `TezosSDK.Beacon.ErrorInfo` object with an error message.

### `public event Action<OperationResult> ContractCallInjected`

Runs when a call to a smart contract is sent to Tezos but before it has been included in a block and confirmed.
Returns a `TezosSDK.Beacon.OperationResult` object with the hash of the transaction.

### `public event Action<HandshakeData> HandshakeReceived`

Runs when the handshake with a user's wallet application is received.
Returns a `TezosSDK.Beacon.HandshakeData` object with the data that applications need to connect to the wallet.

### `public event Action<PairingDoneData> PairingCompleted`

Runs when the user's wallet is connected to the project but before the user has approved the connection in the wallet app.
Returns a `TezosSDK.Beacon.PairingDoneData` object with details about the pairing, such as the dApp's public key and the timestamp of pairing completion.

### `public event Action<SignResult> PayloadSigned`

Runs when the user signs a payload.
Returns a `TezosSDK.Beacon.PairingDoneData` object with the signed payload.
