---
title: Unity SDK TokenContract object
sidebar_label: TokenContract object
authors: Tim McMackin
last_update:
  date: 6 December 2023
---

The Unity SDK class `TezosSDK.Tezos.API.Models.TokenContract`, which is available at runtime as the `TezosManager.Instance.Tezos.TokenContract` object, provides a built-in FA2-compatible smart contract and convenience methods to work with it.

For information about FA2 contracts and tokens, see [FA2 tokens](../../architecture/tokens/FA2).

## Properties

These properties are populated after you deploy the contract with the `Deploy()` method:

- `Address`: The address of the deployed contract
- `TokensCount`: The total number of token types in the contract
- `LastActivityTime`: The timestamp of the last time tokens were minted or transferred

## Methods

### Constructors

The `TokenContract` class has constructors, but they are for internal use.
Use the `Deploy()` method instead.

### `Deploy()`

```csharp
void Deploy(Action<string> completedCallback)
```

Deploys (originates) a contract based on the built-in contract, including prompting the connected wallet to pay the origination fees.

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
