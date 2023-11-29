---
title: Unity SDK Wallet object
sidebar_label: Wallet object
authors: Tim McMackin
last_update:
  date: 29 November 2023
---

Docs for `TezosManager.Instance.Tezos.Wallet`:

Info about the Wallet object and what it can do:

## Properties

- EventManager

## Methods

### `OnReady()`

```csharp
void OnReady()
```

Info about what this does, its parameters, and what it returns. Include an example.

### `Connect()`

```csharp
void Connect(WalletProviderType walletProvider, bool withRedirectToWallet = true)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `Disconnect()`

```csharp
void Disconnect()
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetActiveAddress()`

```csharp
string GetActiveAddress()
```

Info about what this does, its parameters, and what it returns. Include an example.

### `RequestSignPayload()`

```csharp
void RequestSignPayload(SignPayloadType signingType, string payload)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `VerifySignedPayload()`

```csharp
bool VerifySignedPayload(SignPayloadType signingType, string payload)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `CallContract()`

```csharp
void CallContract(
    string contractAddress,
    string entryPoint,
    string input,
    ulong amount = 0)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `OriginateContract()`

```csharp
void OriginateContract(
    string script,
    string delegateAddress = null)
```

Info about what this does, its parameters, and what it returns. Include an example.
