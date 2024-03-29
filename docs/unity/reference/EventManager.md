---
title: Unity SDK EventManager object
sidebar_label: EventManager object
authors: Tim McMackin
last_update:
  date: 28 December 2023
---

The Unity SDK class `TezosSDK.Beacon.WalletEventManager`, which is available at runtime as the `TezosManager.Instance.EventManager` object, provides events that you can add listeners to.

These events are asynchronous.
For example, if your project makes multiple calls to smart contracts, the `ContractCallCompleted` event runs multiple times, not necessarily in the order that you called the contracts.

## Example

This code adds a listener for the `WalletConnected` and `WalletDisconnected` events:

```csharp
private void Start()
{
    TezosManager.Instance.EventManager.WalletConnected += OnWalletConnected;
    TezosManager.Instance.EventManager.WalletDisconnected += OnWalletDisconnected;
}

private void OnWalletConnected(WalletInfo walletInfo)
{
    Debug.Log(walletInfo.Address);
}

private void OnWalletDisconnected(WalletInfo walletInfo)
{
    Debug.Log(walletInfo.Address);
    Debug.Log("Wallet disconnected.");
}
```

## Events

### `public event Action<WalletInfo> WalletConnected`

Runs when a wallet connects successfully.
Returns a `TezosSDK.Beacon.WalletInfo` object with information that includes the address of the connected account.

### `public event Action<ErrorInfo> WalletConnectionFailed`

Runs when a connection to a wallet fails.
Returns a `TezosSDK.Beacon.ErrorInfo` object with an error message.

### `public event Action<WalletInfo> WalletDisconnected`

Runs when a wallet disconnects successfully.
Returns a `TezosSDK.Beacon.WalletInfo` object with information that includes the address of the connected account.

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

Runs when a handshake with a user's wallet application is received.
Returns a `TezosSDK.Beacon.HandshakeData` object with the data that applications need to connect to the wallet.

### `public event Action<PairingDoneData> PairingCompleted`

Runs when the user's wallet is connected to the project but before the user has approved the connection in the wallet app.
Returns a `TezosSDK.Beacon.PairingDoneData` object with details about the pairing, such as the dApp's public key and the timestamp of pairing completion.

### `public event Action<SignResult> PayloadSigned`

Runs when the user signs a payload.
Returns a `TezosSDK.Beacon.PairingDoneData` object with the signed payload.

### `public event void SDKInitialized`

Runs when the SDK loads.
