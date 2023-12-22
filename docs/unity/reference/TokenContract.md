---
title: Unity SDK TokenContract object
sidebar_label: TokenContract object
authors: Tim McMackin
last_update:
  date: 6 December 2023
---

The Unity SDK class `TezosSDK.Tezos.API.Models.TokenContract`, which is available at runtime as the `TezosManager.Instance.Tezos.TokenContract` object, provides a built-in FA2-compatible smart contract and convenience methods to work with it.

For information about FA2 contracts and tokens, see [FA2 tokens](../../architecture/tokens/FA2).

The Michelson source code of the built-in contract is in the `Resources/Contracts` folder of the SDK.

## Properties

These properties are populated after you deploy the contract with the `Deploy()` method:

- `Address`: The address of the deployed contract
- `TokensCount`: The total number of token types in the contract
- `LastActivityTime`: The timestamp of the last time tokens were minted or transferred

## Entrypoints

The built-in contract has the entrypoints that the FA2 standard requires and a few other entrypoints for the convenience of developers.

- `transfer`: Transfers tokens from a source account to one or more destination accounts.
Its parameters are the address of the source account and a list of destination accounts, each with the token ID and amount to transfer.
For a simpler way to transfer tokens, see the [`Transfer()`](#transfer) method.

- `mint`: Creates a token type and one or more tokens of that type.
Its parameters are the address of the owner of the new tokens, the amount of tokens to create, and the metadata for the token type.
This entrypoint can be called only by the current administrator account.
For a simpler way to create tokens, see the [`Mint()`](#mint) method.

- `balance_of`: Sends information about an owner's token balance to another contract.
Its parameters are a callback contract that accepts a list of token IDs and the amount that the specified account owns.
For a simpler way to get information about token ownership, see the [`API.GetTokensForOwner()`](./API#gettokensforowner) method.

- `update_operators`: Adds or removes operators for the specified token owners and token IDs.
Its parameters are a list of commands to add or remove operators for token owners and IDs.
For information about operators, see [Operators](../../architecture/tokens/FA2#operators).

- `set_administrator`: Changes the account that can mint tokens.
Its parameter is the address of the new administrator account.
This entrypoint can be called only by the current administrator account.

- `set_metadata`: Creates or changes a metadata field in the specified contract's storage.
Its parameters are a key-value pair for the new or updated metadata value.
This metadata is a value in the contract's storage, which is different from the metadata returned by the [`API.GetContractMetadata()`](./API#getcontractmetadata) method.
This entrypoint can be called only by the current administrator account.

- `set_pause`: Sets the value of the `paused` storage field.
When this field is set to true, tokens can be minted but not transferred between accounts.
This entrypoint can be called only by the current administrator account.

<!-- For examples of calling these entrypoints, see [Calling the built-in contract](../managing-contracts#calling-the-built-in-contract). -->
For information about entrypoints, see [entrypoints](../../smart-contracts/entrypoints).

## Methods

### Constructors

The `TokenContract` class constructors are for internal use.
Use the `Deploy()` method instead.

### `Deploy()`

```csharp
void Deploy(Action<string> completedCallback)
```

Deploys (originates) a contract based on the built-in contract, including prompting the connected wallet to pay the origination fees.

The SDK stores the address of the contract with the Unity [PlayerPrefs](https://docs.unity3d.com/ScriptReference/PlayerPrefs.html).

Parameters:

- `completedCallback`: A callback method to run when the contract is deployed, which receives the address of the new contract

Example:

```csharp
public void HandleDeploy()
{
    TezosManager.Instance.Tezos.TokenContract.Deploy(OnContractDeployed);
}

private void OnContractDeployed(string contractAddress)
{
    Debug.Log(contractAddress);
}
```

### `Mint()`

```csharp
void Mint(
    Action<TokenBalance> completedCallback,
    TokenMetadata tokenMetadata,
    string destination,
    int amount)
```

Calls the `Mint` entrypoint of the contract to create a token type and mint tokens.

Parameters:

- `completedCallback`: A callback method to run when the token is minted, which receives a `TokenBalance` object with information about the new token
- `tokenMetadata`: A `TokenMetadata` object with information about the new token
- `destination`: The account that owns the new token, which can be a user account or a smart contract account
- `amount`: The number of tokens of the new type to create

Example:

```csharp
var initialOwner = TezosManager
    .Instance
    .Wallet
    .GetActiveAddress();

const string imageAddress = "ipfs://QmX4t8ikQgjvLdqTtL51v6iVun9tNE7y7Txiw4piGQVNgK";

var tokenMetadata = new TokenMetadata
{
    Name = "My token",
    Description = "Description for my token",
    Symbol = "MYTOKEN",
    Decimals = "0",
    DisplayUri = imageAddress,
    ArtifactUri = imageAddress,
    ThumbnailUri = imageAddress
};

TezosManager
    .Instance
    .Tezos
    .TokenContract
    .Mint(
        completedCallback: OnTokenMinted,
        tokenMetadata: tokenMetadata,
        destination: initialOwner,
        amount: 100);

private void OnTokenMinted(TokenBalance tokenBalance)
{
    Debug.Log($"Successfully minted token with Token ID {tokenBalance.TokenId}");
}
```

### `Transfer()`

```csharp
void Transfer(
    Action<string> completedCallback,
    string destination,
    int tokenId,
    int amount)
```

Transfers tokens from the currently connected account to the destination account.

Parameters:

- `completedCallback`: A callback method to run when the token is minted, which receives the hash of the transfer transaction
- `destination`: The account to send the token to, which can be a user account or a smart contract account
- `tokenId`: The ID of the token to transfer
- `amount`: The number of tokens to transfer

Example:

```csharp
public void HandleTransfer()
{
    TezosManager
        .Instance
        .Tezos
        .TokenContract
        .Transfer(
            completedCallback: TransferCompleted,
            destination: address.text,
            tokenId: int.Parse(id.text),
            amount: int.Parse(amount.text));
}

private void TransferCompleted(string txHash)
{
    Logger.LogDebug($"Transfer complete with transaction hash {txHash}");
}
```
