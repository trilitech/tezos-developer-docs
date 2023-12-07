---
title: Quickstart
authors: Tim McMackin
last_update:
  date: 7 December 2023
---

Follow these steps to install the Tezos SDK for Unity in an existing Unity project and start using it.

These instructions cover:

- Installing the SDK into an existing Unity project
- Testing that the SDK works in your project
- Connecting to a user's Tezos wallet
- Creating and managing tokens
- Prompting the user to sign messages

## Installing the SDK

To install the SDK, follow the instructions at https://github.com/trilitech/tezos-unity-sdk.

To work with the SDK, you also need a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes and to configure the wallet for the Ghostnet testnet.
For instructions, see [Installing and funding a wallet](../../developing/wallet-setup).

## Connecting to wallets

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

1. Copy the `MainThreadExecutor`, `TezosAuthenticator`, and `TezosManager` prefabs to your scene.
These prefabs provide prerequisites to use Tezos in a scene.

   The `TezosAuthenticator` prefab automatically adds features that connect to users' wallets.
   If you copy these prefabs into your scene and run it, it shows a QR code that Tezos wallet applications can scan to connect with the application.
   You can access these features through the prefab and change how the project manages its connection to users' wallets.

   The `TezosManager` fields control what users see in their wallet applications before connecting to the project, as shown in this picture of the Inspector panel:

   ![The Inspector panel, showing information about the project](/img/dApps/unity-inspector-tezosmanager.png)

1. Add features to your project to use the connected account.
For example, the `TezosSDK/Examples/Common/Scripts/AccountInfoUI.cs` file responds to the `AccountConnected` event, which runs when the user scans the QR code and approves the connection in their wallet app.
You can use this event to get the address of the connected account, as in this code:

   ```csharp
   private void Start()
   {
       addressText.text = _notConnectedText;

       // Subscribe to events;
       TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
       TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
   }

   private void OnAccountConnected(AccountInfo accountInfo)
   {
       // We can get the address from the wallet
       addressText.text = TezosManager.Instance.Wallet.GetActiveAddress();
       // Or from the event data
       addressText.text = accountInfo.Address;

       UpdateLayout(); // Update layout to fit the new text
   }

   private void OnAccountDisconnected(AccountInfo account_info)
   {
       addressText.text = _notConnectedText;
       UpdateLayout();
   }
   ```

   You can use this address as a user's account ID because Tezos account addresses are unique.

1. To respond to other events, add listeners for the events that the SDK provides.
You can see these events and their return values in the [MessageReceiver object](../../reference/unity/MessageReceiver).

Note that if you stop the project while your wallet is connected and restart the project later, it remembers that your wallet is connected.
The SDK uses the [Beacon](https://docs.walletbeacon.io/) SDK to connect to wallets and remember connections.

## Deploying contracts

Contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

You can create your own smart contracts or use the built-in contract that the SDK provides for managing tokens in Unity projects.
The built-in contract is compatible with the [FA2 token standard](../../architecture/tokens/FA2), which means that you can use a single smart contract to manage any number of types of tokens.

The Contract example scene shows how to deploy a contract from a Unity project.

To deploy the built-in contract, call the `TezosManager.Instance.Tezos.TokenContract.Deploy` method and pass a callback function:

```csharp
public void DeployContract()
{
    TezosManager
        .Instance
        .Tezos
        .TokenContract
        .Deploy(OnContractDeployed);
}

private void OnContractDeployed(string contractAddress)
{
    Debug.Log(contractAddress);
}
```

The project sends the deployment transaction to the connected wallet, which must approve the transaction and pay the related fees.
The SDK stores the address of the contract as `TezosManager.Instance.Tezos.TokenContract.Address`.

## Creating tokens

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

For a complete example of creating tokens, see the file `TezosSDK/Examples/Contract/Scripts/MintToken.cs` and the Contract example scene.

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

For a complete example, see the Transfer example scene.

## Getting token balances

To get the tokens that the connected account owns, call the `TezosManager.Instance.Tezos.API.GetTokensForOwner` method in a coroutine.
This example prints information about the tokens that the account owns to the log:

```csharp
using Beacon.Sdk.Beacon;
using TezosSDK.Beacon;
using TezosSDK.Tezos;
using TezosSDK.Helpers;
using TezosSDK.Tezos.API.Models.Tokens;
using TezosSDK.Tezos.API.Models.Filters;
using System.Linq;

// ...

void Start()
{
    TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
}

private void OnAccountConnected(AccountInfo account_info)
{
    var address = TezosManager.Instance.Wallet.GetActiveAddress();
    var routine = TezosManager.Instance.Tezos.API.GetTokensForOwner(
        callback: onTokenBalances,
        owner: address,
        withMetadata: true,
        maxItems: 10_000,
        orderBy: new TokensForOwnerOrder.ByLastTimeAsc(0)
    );
    StartCoroutine(routine);
}

private void onTokenBalances(IEnumerable<TokenBalance> tokenBalances)
{
    var address = TezosManager.Instance.Wallet.GetActiveAddress();

    List<TokenBalance> tokens = new List<TokenBalance>(tokenBalances);
    // Filter to the tokens in the active contract
    List<TokenBalance> filteredTokens = tokens.Where(tb => tb.TokenContract.Address == TezosManager.Instance.Tezos.TokenContract.Address).ToList();
    if (filteredTokens.Count > 0)
    {
        foreach (var tb in filteredTokens)
        {
            Debug.Log(
                $"{address} has {tb.Balance} tokens on contract {tb.TokenContract.Address}");
            Debug.Log(tb.TokenMetadata);
        }
    }
    else
    {
        Debug.Log($"{address} has no tokens in the active contract");
    }
}
```

## Signing messages

You can also use the connection to the user's wallet to prompt them to sign messages.
Signing a message proves that it came from a specific user's wallet because the wallet encrypts the message with the user's account's key.

For example, this code prompts the user to sign the message "This message came from my account."
Then, the callback verifies that the signature is valid and that it came from the user's account:

```csharp
using Beacon.Sdk.Beacon.Sign;

// ...

string payload = "This message came from my account.";

void Start()
{
    TezosManager.Instance.MessageReceiver.PayloadSigned += OnPayloadSigned;
    TezosManager.Instance.Wallet.RequestSignPayload(SignPayloadType.micheline, payload);
}

private void OnPayloadSigned(SignResult obj)
{
    // result is true if the message is signed correctly
    // and that it came from the currently-connected account
    var result = TezosManager.Instance.Wallet.VerifySignedPayload(SignPayloadType.micheline, payload);
    Debug.Log($"Payload verification response: {result}");
}
```

For more examples of how to work with the SDK, see the scenes in the `TezosSDK/Examples` folder.
