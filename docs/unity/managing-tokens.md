---
title: Managing tokens
authors: Tim McMackin
last_update:
  date: 19 November 2024
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
FA2 tokens can be fungible tokens or non-fungible tokens, which makes the standard flexible enough for most use cases.

## FA2 token contracts

To create and work with FA2 tokens you must deploy an FA2-compatible smart contract.
For examples of FA2 contracts, see [Sample smart contracts](/smart-contracts/samples).
You can also use the tutorial [Create a fungible token with the SmartPy FA2 library](/smart-contracts/samples) to walk through the process of creating, customizing, and deploying an FA2 contract.

:::note

The rest of this page assumes that you are using FA2 tokens.

:::

:::note

You can use block explorers for help formatting the parameters for contract calls.
See [Encoding parameters as JSON strings](/unity/calling-contracts#encoding-parameters-as-json-strings).

:::

## Creating (minting) tokens

The FA2 standard does not require contracts to have a `mint` entrypoint that creates tokens, but many do.
The `mint` entrypoint may be limited so only certain accounts can call it, or it may have other restrictions.
If a contract does not have a `mint` entrypoint, it was created with all of the tokens that it will ever have and therefore no more tokens can be minted.

A typical FA2 `mint` entrypoint accepts the token ID, the number of tokens to create, and the initial owner of the new tokens.
For example, the contract `KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY` has a `mint` entrypoint that accepts this parameter in JSON format:

```json
"schema:list:object": [
    {
        "to_:address": "address",
        "token:or": {
            "existing:nat": "nat",
            "new:map_flat:string:bytes": {
                "string": "bytes"
            }
        },
        "amount:nat": "nat"
    }
]
```

The equivalent Michelson parameter looks like this:

```michelson
(list %mint (pair (address %to_)
                 (pair (or %token (nat %existing) (map %new string bytes)) (nat %amount))))
```

In this case, the `mint` entrypoint can create tokens of an existing type or create a new type of token.

As described in [Encoding parameters](/unity/calling-contracts#encoding-parameters), you can encode the parameter for the call as a Micheline object via the Netezos library or as a JSON string.

To encode the parameter as a JSON object, you can fill in the fields on the block explorer and generate a JSON file like this example, which mints 10 tokens of type 0:

```csharp
var mintJsonString = "[{\"prim\":\"Pair\",\"args\":[{\"string\":\"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx\"},{\"prim\":\"Pair\",\"args\":[{\"prim\":\"Left\",\"args\":[{\"int\":\"0\"}]},{\"int\":\"10\"}]}]}]";

var mintTokensRequest = new OperationRequest
{
   Destination = "KT1HP6uMwf829cDgwynZJ4rDvjLCZmfYjja1",
   EntryPoint = "mint",
   Arg = mintJsonString,
   Amount = "0",
};

var response = await TezosAPI.RequestOperation(mintTokensRequest);
```

To encode the parameter with the Netezos library, use primitives organized by pairs.
In this example, the parameter uses a Left value in an Or primitive to represent the Micheline field `nat %existing`:

```csharp
// Owner of the new tokens
var to_ = new MichelineString("tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx");
// Number of tokens to mint
var amount = new MichelineInt(10);
var token = new MichelinePrim
{
    Prim = PrimType.Pair, // Existing token type
    Args = new List<IMicheline>
    {
        new MichelinePrim
        {
            Prim = PrimType.Left,
            Args = new List<IMicheline>
            {
                // ID of token type
                new MichelineInt(0),
            }
        },
        amount
    }
};

var parameter = new MichelineArray
{
    new MichelinePrim
    {
        Prim = PrimType.Pair,
        Args = new List<IMicheline>
                {
                    to_,
                    token
                }
    }
}.ToJson();

var mintTokensRequest = new OperationRequest
{
   Destination = "KT1HP6uMwf829cDgwynZJ4rDvjLCZmfYjja1",
   EntryPoint = "mint",
   Arg = parameter,
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

This code runs the same operation, but it uses Netezos types instead of raw JSON:

```csharp
// Source account
var from_ = new MichelineString("tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx");
// Target account
var to_ = new MichelineString("tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD");
// Token ID
var tokenId = new MichelineInt(7);
// Amount
var amount = new MichelineInt(2);

var parameter = new MichelineArray
{
    new MichelinePrim
    {
        Prim = PrimType.Pair,
        Args = new List<IMicheline>
        {
            from_,
            new MichelineArray
            {
                new MichelinePrim
                {
                    Prim = PrimType.Pair,
                    Args = new List<IMicheline>
                    {
                        to_,
                        new MichelinePrim
                        {
                            Prim = PrimType.Pair,
                            Args = new List<IMicheline>
                            {
                                tokenId,
                                amount
                            }
                        }
                    }
                }
            }
        }
    }
}.ToJson();

var transferTokensRequest = new OperationRequest
{
    Destination = "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
    EntryPoint = "transfer",
    Arg = parameter,
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
