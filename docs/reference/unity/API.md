---
title: Unity SDK API object
sidebar_label: API object
authors: Tim McMackin
last_update:
  date: 29 November 2023
---

Docs for `TezosManager.Instance.Tezos.API`:

## Properties

None.

## Methods

### `GetTezosBalance()`

```csharp
IEnumerator GetTezosBalance(Action<ulong> callback, string address);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `ReadView()`

```csharp
IEnumerator ReadView(string contractAddress,
    string entrypoint,
    string input,
    Action<JsonElement> callback);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetTokensForOwner()`

```csharp
IEnumerator GetTokensForOwner(
    Action<IEnumerable<TokenBalance>> callback,
    string owner,
    bool withMetadata,
    long maxItems,
    TokensForOwnerOrder orderBy);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetOwnersForToken()`

```csharp
IEnumerator GetOwnersForToken(
    Action<IEnumerable<TokenBalance>> callback,
    string contractAddress,
    uint tokenId,
    long maxItems,
    OwnersForTokenOrder orderBy);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetOwnersForContract()`

```csharp
IEnumerator GetOwnersForContract(
    Action<IEnumerable<TokenBalance>> callback,
    string contractAddress,
    long maxItems,
    OwnersForContractOrder orderBy);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `IsHolderOfContract()`

```csharp
IEnumerator IsHolderOfContract(
    Action<bool> callback,
    string wallet,
    string contractAddress);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `IsHolderOfToken()`

```csharp
IEnumerator IsHolderOfToken(
    Action<bool> callback,
    string wallet,
    string contractAddress,
    uint tokenId);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetTokenMetadata()`

```csharp
IEnumerator GetTokenMetadata(
    Action<JsonElement> callback,
    string contractAddress,
    uint tokenId);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetContractMetadata()`

```csharp
public IEnumerator GetContractMetadata(
    Action<JsonElement> callback,
    string contractAddress);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetTokensForContract()`

```csharp
IEnumerator GetTokensForContract(
    Action<IEnumerable<Token>> callback,
    string contractAddress,
    bool withMetadata,
    long maxItems,
    TokensForContractOrder orderBy);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetOperationStatus()`

```csharp
IEnumerator GetOperationStatus(
    Action<bool?> callback,
    string operationHash);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetLatestBlockLevel()`

```csharp
IEnumerator GetLatestBlockLevel(
    Action<int> callback);
```

### `GetAccountCounter()`

```csharp
IEnumerator GetAccountCounter(
    Action<int> callback,
    string address);
```

Info about what this does, its parameters, and what it returns. Include an example.

### `GetOriginatedContractsForOwner()`

```csharp
IEnumerator GetOriginatedContractsForOwner(
    Action<IEnumerable<TokenContract>> callback,
    string creator,
    string codeHash,
    long maxItems,
    OriginatedContractsForOwnerOrder orderBy);
```

Info about what this does, its parameters, and what it returns. Include an example.

