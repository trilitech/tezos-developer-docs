---
title: Managing tokens
authors: Tim McMackin
last_update:
  date: 18 November 2024
---

Tezos supports a variety of types of tokens, including:

- Fungible tokens, which are collections of interchangeable tokens with a quantity that you define.
Fungible tokens can be quantifiable commodities like in-game currency, fuel, ammunition, or energy, or they can be identical items with a limited quantity.
- Non-fungible tokens (NFTs), which are unique assets with only one unit.
Games use NFTs for items that are unique and must not be duplicated.

You can create as many tokens and types of tokens as you need in one contract, but each transaction to create or transfer tokens incurs fees.

For more information about tokens, see [Tokens](/architecture/tokens).

## FA2 tokens

While you can create tokens that behave in any way that you want them to behave, it's best to create tokens that follow a standard.
The Tezos [FA standards](/architecture/tokens#token-standards) enforce a standard format for tokens which allows applications like games, wallets, and block explorers to work with them in a consistent way.
For example, if you create an FA-compatible token and use it in a Unity application, players can look up information about their tokens in block explorers and transfer them with their wallets without interacting with the Unity application.

For this reason, Unity applications should use FA tokens whenever possible.

The most popular and commonly-supported FA standard is [FA2](/architecture/tokens/FA2), so the examples on this page are for working with FA2 tokens.
FA2 tokens can be fungible tokens or non-fungible tokens, which makes the standard flexible enough for most uses of tokens.

## FA2 token contracts

To create and work with FA2 tokens you must deploy an FA2-compatible smart contract.
For examples of FA2 contracts, see [Sample smart contracts](/smart-contracts/samples).
You can also use the tutorial [Create a fungible token with the SmartPy FA2 library](/smart-contracts/samples) to walk through the process of creating, customizing, and deploying an FA2 contract.

:::note

The rest of this page assumes that you are using an FA2 contract.

:::

:::note

You can use block explorers for help formatting the parameters for contract calls.
See [Encoding parameters as JSON strings](/unity/calling-contracts#encoding-parameters-as-json-strings).

:::

## Creating (minting) a new token type

To create a new type of token and mint tokens, pass the metadata for the new token type, the number of tokens to mint, and the initial owner of the new tokens to the FA2 contract's `mint` entrypoint.
The FA2 standard does not require contracts to have a `mint` entrypoint, but most do.
If a contract does not have a `mint` entrypoint, it was created with all of the tokens that it will ever have and therefore no more tokens can be minted.

TODO





## Creating (minting) tokens of an existing type

To mint tokens of an existing type, pass the token ID, the number of tokens to create, and the initial owner of the new tokens to the contract's `mint` entrypoint.
This example mints 5 tokens of the token type with the ID 7:

```csharp
var mintJsonString = "{ \"prim\": \"Pair\", \"args\": [ { \"prim\": \"Pair\", \"args\": [ { \"string\": \"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx\" }, { \"int\": \"5\" } ] }, { \"prim\": \"Pair\", \"args\": [ [], { \"int\": \"7\" } ] } ] }";

var mintTokensRequest = new OperationRequest
{
   Destination = "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
   EntryPoint = "mint",
   Arg = mintJsonString,
   Amount = "0",
};

var response = await TezosAPI.RequestOperation(mintTokensRequest);
```

## Transferring tokens

To transfer tokens, pass the source account, target account, token ID, and quantity to the contract's `transfer` entrypoint.
The account that sends the transfer call must be the owner or operator of the tokens.
For more information about token access control, see [FA2 tokens](/architecture/tokens/FA2).

This example transfers 2 tokens with the ID 7:

```csharp
var transferTokensString = "[ { \"prim\": \"Pair\", \"args\": [ { \"string\": \"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx\" }, [ { \"prim\": \"Pair\", \"args\": [ { \"string\": \"tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD\" }, { \"prim\": \"Pair\", \"args\": [ { \"int\": \"7\" }, { \"int\": \"2\" } ] } ] } ] ] } ]";

var transferTokensRequest = new OperationRequest
{
    Destination = "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
    EntryPoint = "transfer",
    Arg = transferTokensString,
    Amount = "0",
};

var response = await TezosAPI.RequestOperation(transferTokensRequest);
```

## Getting token balances

You can get information about the tokens in a contract by passing the address of the contract and the maximum number of tokens to return to the `TezosAPI.GetTokens()` method.
The response is a list of `TokenData` objects with information about the tokens:

```csharp
var tokenList = await TezosAPI.GetTokens<List<TokenData>>("KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY", 20);
foreach (TokenData token in tokenList)
{
    Debug.Log($"Token ID {token.TokenId} has {token.HoldersCount} owners.");
}
```

## Destroying (burning) tokens

The FA2 standard does not have a standard way of burning tokens.
Some FA2 implementations have a `burn` entrypoint.
In other cases, if you want to make tokens unusable, send them to an address that doesn't exist or to an account that you can't use.
For example, you can create an account in a wallet app, send the tokens to it, and delete the private key for the account.
