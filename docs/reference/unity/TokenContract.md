---
title: Unity SDK TokenContract object
sidebar_label: TokenContract object
authors: Tim McMackin
last_update:
  date: 29 November 2023
---

Docs for `TezosManager.Instance.Tezos.TokenContract`:

Info about how we provide a built-in FA2 contract and what it can do

## Properties

- Address
- TokensCount
- LastActivityTime

## Methods

### Constructors

```csharp
new TokenContract(string address)
```

Does this create a contract object from a previously-deployed contract?

```csharp
new TokenContract()
```

### `Mint()`

```csharp
void Mint(
    Action<TokenBalance> completedCallback,
    TokenMetadata tokenMetadata,
    string destination,
    int amount)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `Transfer()`

```csharp
void Transfer(
    Action<string> completedCallback,
    string destination,
    int tokenId,
    int amount)
```

Info about what this does, its parameters, and what it returns. Include an example.

### `Deploy()`

```csharp
void Deploy(Action<string> completedCallback)
```

Info about what this does, its parameters, and what it returns. Include an example.
