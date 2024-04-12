---
title: Managing tokens
authors: Tim McMackin
last_update:
  date: 11 January 2024
---

The SDK's built-in contract is compatible with the [FA2 token standard](../developing/tokens/FA2), which means that you can use a single smart contract to manage any number of types of tokens, including:

- Fungible tokens, which are collections of interchangeable tokens with a quantity that you define.
Fungible tokens can be quantifiable commodities like in-game currency, fuel, ammunition, or energy, or they can be identical items with a limited quantity.
- Non-fungible tokens (NFTs), which are unique assets with only one unit.
Games use NFTs for items that are unique and must not be duplicated.

You can create as many tokens and types of tokens as you need in one contract, but each transaction to create or transfer tokens incurs fees.

## Creating (minting) tokens

To create a token type, call the contract's `mint` entrypoint and pass these parameters:

- A callback function to run when the token is created
- The metadata for the token, which includes a name and description, URIs to preview media or thumbnails, and how many decimal places the token can be broken into
- The destination account that owns the new tokens, which can be a user account, this smart contract, or any other smart contract
- The number of tokens to create

For example, this code creates a token type with a quantity of 100:

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

For a complete example of creating tokens, see the file `TezosSDK/Examples/Contract/Scripts/MintToken.cs` and the Contract tutorial scene.

## Transferring tokens

To transfer tokens, call the contract's `Transfer` entrypoint and pass these parameters:

- A callback function to run when the transfer is complete
- The account to transfer the tokens to
- The ID of the token
- The amount of tokens to transfer

This example transfers 12 tokens with the ID 5 to the account in the variable `destinationAccountAddress`.

```csharp
public void HandleTransfer()
{
    TezosManager
        .Instance
        .Tezos
        .TokenContract
        .Transfer(
            completedCallback: TransferCompleted,
            destination: destinationAccountAddress,
            tokenId: 5,
            amount: 12);
}

private void TransferCompleted(string txHash)
{
    Logger.LogDebug($"Transfer complete with transaction hash {txHash}");
}
```

For a complete example, see the Transfer tutorial scene.

## Getting token balances

To get the tokens that the connected account owns, call the [`API.GetTokensForOwner()`](./reference/API#gettokensforowner) method in a coroutine.
This example prints information about the tokens that the account owns to the log:

```csharp
private void Start()
{
    // Subscribe to account connection event
    TezosManager.Instance.EventManager.WalletConnected += OnWalletConnected;
}

private void OnWalletConnected(WalletInfo walletInfo)
{
    // Address of the connected wallet
    var address = walletInfo.Address;

    // Prepare the coroutine to fetch the tokens
    var routine = TezosManager.Instance.Tezos.API.GetTokensForOwner(
        OnTokensFetched, // Callback to be called when the tokens are fetched
        address, true, 10_000, new TokensForOwnerOrder.ByLastTimeAsc(0));

    StartCoroutine(routine);
}

private void OnTokensFetched(IEnumerable<TokenBalance> tokenBalances)
{
    var walletAddress = TezosManager.Instance.Wallet.GetWalletAddress();
    var contractAddress = TezosManager.Instance.Tezos.TokenContract.Address;

    var tokens = new List<TokenBalance>(tokenBalances);

    // Filter the tokens by the current contract address
    var filteredTokens = tokens.Where(tb => tb.TokenContract.Address == contractAddress).ToList();

    if (filteredTokens.Count > 0)
    {
        foreach (var tb in filteredTokens)
        {
            Debug.Log($"{walletAddress} has {tb.Balance} tokens on contract {tb.TokenContract.Address}");
            Debug.Log(tb.TokenMetadata);
        }
    }
    else
    {
        Debug.Log($"{walletAddress} has no tokens in the active contract");
    }
}
```

## Destroying (burning) tokens

The built-in contract does not have a burn entrypoint, so you can't destroy its tokens.
If you want to make tokens unusable, send them to an address that doesn't exist or to an account that you can't use.
For example, you can create an account in a wallet app, send the tokens to it, and delete the private key for the account.

<!-- TODO:
- Is there some way to handle the transaction cost myself so the user doesn't have to approve every time?
- Pre-signing transactions
-->