---
title: Quickstart
authors: Tim McMackin
last_update:
  date: 28 December 2023
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

To work with the SDK, ensure that you have a Tezos-compatible wallet configured for the Ghostnet testnet on your mobile device.
For instructions, see [Installing and funding a wallet](../developing/wallet-setup).

If you want to publish the project to WebGL, follow the steps in [Enabling WebGL support](#enabling-webgl-support).

## Enabling WebGL support

The Unity SDK provides a WebGL template that you can use to publish Unity projects to run in a web browser.
Follow these steps to set up the Tezos SDK to work with WebGL:

1. In the Unity Editor, go to the Project panel and find the `TezosSDK` folder.
1. From the `WebGLFrontend/output` folder, copy the `StreamingAssets` and `WebGLTemplates` folders into the `Assets` folder of your project.

1. Select the AirGap template to use in the WebGL build:

   1. Click **Edit > Project Settings**.
   1. Go to the **Player** tab.
   1. On the Player tab, go to the **WebGL settings** tab.
   1. Under **Resolution and Presentation**, select the AirGap WebGL template.

1. To enable copy and paste in the WebGL build, double-click `WebGLCopyAndPaste.unitypackage`, which is in the `WebGLFrontend/output` folder of the SDK, to install it.

   This package automatically enables copy and paste on selectable text fields, such as the account address field in the WalletConnection tutorial scene.

## Connecting to wallets

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

1. Copy the `TezosAuthenticator` and `TezosManager` prefabs to your scene.
These prefabs provide prerequisites to use Tezos in a scene and help connect to accounts.
For more information about them, see [Prefabs](./prefabs).

   The `TezosAuthenticator` prefab automatically adds features that connect to users' wallets.
   If you copy these prefabs into your scene and run it, it shows a QR code or connection buttons that Tezos wallet applications can scan to connect with the application.
   Whether it shows the QR code or buttons depends on whether the project is running in standalone, mobile, or WebGL mode.

1. Add features to your project to use the connected account.
For example, the `Tutorials/Common/Scripts/WalletInfoUI.cs` file responds to the `WalletConnected` event, which runs when the user approves the connection in their wallet application.
You can use this event to get the address of the connected account, as in this code:

   ```csharp
   private void Start()
   {
       addressText.text = NOT_CONNECTED_TEXT;

       // Subscribe to events;
       TezosManager.Instance.EventManager.WalletConnected += OnWalletConnected;
       TezosManager.Instance.EventManager.WalletDisconnected += OnWalletDisconnected;
   }

   private void OnWalletConnected(WalletInfo walletInfo)
   {
       // We can get the address from the wallet
       addressText.text = TezosManager.Instance.Wallet.GetActiveAddress();
       // Or from the event data
       addressText.text = walletInfo.Address;
   }

   private void OnWalletDisconnected(WalletInfo walletInfo)
   {
       addressText.text = NOT_CONNECTED_TEXT;
   }
   ```

   You can use this address as a user's account ID because Tezos account addresses are unique.

1. To respond to other events, add listeners for the events that the SDK provides.
You can see these events and their return values in the [EventManager object](./reference/EventManager).

Note that if you stop the project while your wallet is connected and restart the project later, the project remembers the wallet's connection status by using the data saved at [Application.persistentDataPath](https://docs.unity3d.com/ScriptReference/Application-persistentDataPath.html).
The SDK uses the [Beacon](https://docs.walletbeacon.io/) SDK to connect to wallets.

## Deploying contracts

Contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

The ContractAndMinting tutorial scene shows how to deploy a contract from a Unity project.

The SDK provides a built-in contract that you can use instead of writing your own.
This contract manages different kinds of tokens.

To deploy the built-in contract, call the [`TokenContract.Deploy()`](./reference/TokenContract#deploy) method and pass a callback function:

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
The SDK stores the address of the contract as [`TokenContract.address`](./reference/TokenContract).

## Creating tokens

To create a token type, call the contract's `mint` entrypoint and pass these parameters:

- A callback function to run when the token is created
- The metadata for the token, which includes a name and description, URIs to preview media or thumbnails, and how many decimal places the token can be broken into
- The destination account that owns the new tokens, which can be a user account, this smart contract, or any other smart contract
- The number of tokens to create

For example, this code creates a token type with a quantity of 100:

```csharp
// Get the address of the connected wallet
var initialOwner = TezosManager
    .Instance
    .Wallet
    .GetActiveAddress();


// To preview the IPFS-hosted image:
// https://ipfs.io/ipfs/QmX4t8ikQgjvLdqTtL51v6iVun9tNE7y7Txiw4piGQVNgK
const string imageAddress = "ipfs://QmX4t8ikQgjvLdqTtL51v6iVun9tNE7y7Txiw4piGQVNgK";

// Prepare metadata
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

// Call the "mint" entrypoint of the contract
TezosManager
    .Instance
    .Tezos
    .TokenContract
    .Mint(
        completedCallback: OnTokenMinted,
        tokenMetadata: tokenMetadata,
        destination: initialOwner,
        amount: 100);

// This callback is triggered after the contract call successfully completes and the resulting transaction is recorded on the blockchain.
private void OnTokenMinted(TokenBalance tokenBalance)
{
    Debug.Log($"Successfully minted token with Token ID {tokenBalance.TokenId}");
}
```

For a complete example of creating tokens, see the file `Tutorials/ContractAndMinting/Scripts/MintToken.cs` and the ContractAndMinting tutorial scene.

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
    var walletAddress = TezosManager.Instance.Wallet.GetActiveAddress();
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

## Uploading files to IPFS

The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system.
Blockchain developers use it to store data such as token images and metadata.

The SDK provides tools to upload to IPFS by using the [Pinata](https://pinata.cloud/) API, but you can set up IPFS upload in other ways.

To use the SDK, see the code in the `Tutorials/IPFSUpload/Scripts/UploadImageButton.cs` file, which handles uploading files in the IPFSUpload scene.
It has a UI upload button that triggers this method, which uses the built-in Pinata uploader to upload the file and get the URL for it:

```csharp
public void HandleUploadClick()
{
    if (string.IsNullOrEmpty(TezosManager.PinataApiKey))
    {
        Logger.LogError("Can not proceed without Pinata API key.");
        return;
    }

    var uploader = UploaderFactory.GetPinataUploader(TezosManager.PinataApiKey);

    var uploadCoroutine = uploader.UploadFile(ipfsUrl =>
    {
        Logger.LogDebug($"File uploaded, url is {ipfsUrl}");
    });

    StartCoroutine(uploadCoroutine);
}
```

This code assumes that you have set your Pinata API key on the `TezosManager` prefab.

For a complete example, see the IPFSUpload scene.

## Signing messages

You can also use the connection to the user's wallet to prompt them to sign messages.
Signing a message proves that it came from a specific user's wallet because the wallet encrypts the message with the user's account's key.

For example, this code prompts the user to sign the message "This message came from my account."
Then, the callback verifies that the signature is valid and that it came from the user's account:

```csharp
string payload = "This message came from my account.";

private void Start()
{
    // Subscribe to the wallet event
    TezosManager.Instance.EventManager.PayloadSigned += OnPayloadSigned;

    TezosManager.Instance.Wallet.RequestSignPayload(SignPayloadType.micheline, payload);
}

private void OnPayloadSigned(SignResult obj)
{
    // Result is true if the message is signed correctly
    // And that it came from the currently-connected wallet
    var result = TezosManager.Instance.Wallet.VerifySignedPayload(SignPayloadType.micheline, payload);

    Debug.Log($"Payload verification response: {result}");
}
```

## Changing the RPC node

As described in [The RPC protocol](../architecture/rpc), Tezos clients including the Unity SDK send transactions to RPC nodes.
By default, the SDK sends requests to a public RPC node that uses the Ghostnet test network, where you can test transactions without spending real tez.
For more information about test networks, see [Using sandboxes and testnets](../developing/testnets).

If you need to change the RPC node that the SDK uses, such as if the default node is overloaded or if you are ready to send transactions to Mainnet, you can change the RPC node by setting the values of the `TezosConfig.RpcBaseUrl` and `TezosConfig.Network` properties, as in this code:

```csharp
TezosConfig.Instance.RpcBaseUrl = "https://mainnet.smartpy.io";
TezosConfig.Instance.Network = NetworkType.mainnet;
```

For more examples of how to work with the SDK, see the scenes in the `TezosSDK/Examples` folder, which are described in [Tutorial scenes](./scenes).
