---
title: Unity SDK example scenes
sidebar_label: Example scenes
authors: Tim McMackin
last_update:
  date: 11 December 2023
---

The SDK includes sample scenes that demonstrate how to use the SDK.
To open the scenes, install the SDK and in the Project panel, expand **TezosSDK > Examples**.

Before using any of the scenes, install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes and get some test tez tokens that you can use to pay transaction fees.
For instructions, see [Installing and funding a wallet](../../developing/wallet-setup).

## WalletConnection scene

This scene shows how to connect to a user's wallet and get information about their account.
To open the scene, go to the Project panel, expand **TezosSDK > Examples > WalletConnection**, and double-click `_WalletConnection`.

To try the scene, click the **Play** button and then go to the Simulator tab.
The scene shows that no account is connected and a QR code:

<img src="/img/dApps/unity-walletconnection-scene-unconnected.png" alt="The start of the WalletConnection scene, with no account information" style={{width: 300}} />

To connect, scan the QR code in any Tezos-compatible wallet app.
Mobile wallet apps for Tezos include [Temple](https://templewallet.com/), [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).
Then, approve  the connection in the wallet app.

Then, the scene shows the address of the connected account and its balance, as in the following picture.
At the bottom of the scene there is a logout button that closes the connection.

<img src="/img/dApps/unity-walletconnection-scene-connected.png" alt="The WalletConnection scene with a connected account" style={{width: 300}} />

To see the code that runs the objects in the scene, stop the scene and expand the Canvas object in the Hierarchy panel.
Then, select an object, go to the Inspector panel, and double-click the script component.
For example, to open the code for the object that shows the address of the account, select the AccountAddress object in the Hierarchy panel and double-click `AccountInfoUI` in the Inspector panel.

The `AccountInfoUI` script opens in your IDE.
This script defines a variable named addressText, which is bound to the Unity object.

In the `Start` function, it sets listeners for the Tezos SDK events that happen when accounts connect and disconnect:

```csharp
#region Constants and Fields

private readonly string _notConnectedText = "Not connected";

#endregion

#region Unity Methods

private void Start()
{
    addressText.text = _notConnectedText;

    // Subscribe to events
    TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
    TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
}

#endregion

#region Event Handlers

private void OnAccountConnected(AccountInfo accountInfo)
{
    // We can get the address from the wallet
    addressText.text = TezosManager.Instance.Wallet.GetActiveAddress();
    // Or from the event data
    addressText.text = accountInfo.Address;

    UpdateLayout(); // Update layout to fit the new text
}

private void OnAccountDisconnected(AccountInfo accountInfo)
{
    addressText.text = _notConnectedText;
    UpdateLayout();
}

#endregion
```

For the complete list of listeners, see the file `Assets/TezosSDK/Runtime/Scripts/Beacon/WalletEventManager.cs` in the SDK.
<!-- TODO link to reference section -->

## Contract scene

This scene shows how to deploy a smart contract to Tezos and create tokens with it.

A _smart contract_ is a program stored on the blockchain.
Smart contracts can do many things, but the main thing that game developers use them for is to manage _tokens_, which are assets that are stored on Tezos.
In this case, the smart contract keeps track of tokens, their metadata, and who owns them.

The SDK comes with a sample smart contract that allows a Unity project to create tokens.
You can customize these tokens, give them to users, and treat them like the players' in-game inventories.

To open the scene, go to the Project panel, expand **TezosSDK > Examples > WalletConnection**, and double-click `_WalletConnection`.
Then, click the **Play** button and then go to the Simulator tab.

Like the WalletConnection scene, you must first scan the barcode with a Tezos wallet app and approve the connection in the app.
Then the scene shows the address of the connected account and enables the "Deploy Contract" and "Mint Token" buttons:

<img src="/img/dApps/unity-contract-scene-connected.png" alt="The start of the WalletConnection scene with an account connected" style={{width: 500}} />

When you click "Deploy Contract," your connected wallet prompts you to confirm the transaction and pay the transaction fees.
Because you are connected to the test network, these are worthless testnet tokens and not real currency.
This process can take time because the project has to send the code for the smart contract to your wallet app.

When you confirm the transaction in the wallet app, you must wait for the contract to be deployed on Tezos.
The log in the Console panel shows a message that looks like `Received operation with hash oopFjLYGTbZTEFsTh4p1YPnHR1Up1SNnvE5xk2SRaGH6PZ4ry56`, which is the address of the Tezos operation that deployed the contract.
This process can take a few minutes.

For example, this is what the transaction looks like in the Temple wallet:

<img src="/img/dApps/unity-contract-scene-origination-temple.png" alt="Approving the contract deployment transaction in the wallet app" style={{width: 300}} />

When the contract is deployed, the project updates to show the address of the contract, which starts with `KT1`.
You can get the address by opening the Scene panel, selecting the Address object in the Hierarchy panel, and copying the address from the Inspector panel.
To see information about the deployed contract, copy this address and put it into a block explorer such as [Better Call Dev](https://better-call.dev/).

The block explorer shows information about the contract, including recent transactions, its source code, and the tokens it controls and their owners.
Currently, the block explorer shows only the origination transaction, which deployed the contract:

<img src="/img/dApps/unity-contract-scene-origination.png" alt="The newly originated contract on the block explorer" style={{width: 500}} />

Now you can go back to the Simulation panel in the Unity Editor and click "Mint Token."
The project sends another transaction to your wallet app.
When you approve it, the wallet app sends a transaction to the smart contract to create (mint) a token.
Like the deployment operation, it can take time for the transaction to complete and be confirmed on Tezos.

When the mint transaction is complete, the "Tokens Count" text in the scene updates to show the number of token types that have been minted with this contract.
The mint process creates a random number of tokens with this type.
Your tokens can have a quantity of 1 to make them unique or a larger quantity to represent an amount of something.

You can also see the mint transaction on the block explorer.
Because the contract follows the FA2 standard for tokens, the block explorer also shows the tokens and information about them, as in this picture:

<img src="/img/dApps/unity-contract-scene-token.png" alt="The new token on the block explorer" style={{width: 300}} />

The tokens that this scene creates have randomly generated metadata.
To change the metadata, open the `TezosSDK/Examples/Contract/Scripts/MintToken.cs` file.
The file's `HandleMint` function creates the token by generating random numbers, creating a metadata object for the token, and using the `TokenContract.Mint` function to send the mint transaction to the contract:

```csharp
public void HandleMint()
{
    var rnd = new Random();
    var randomInt = rnd.Next(1, int.MaxValue);
    var randomAmount = rnd.Next(1, 1024);

    var destinationAddress = TezosManager
        .Instance
        .Wallet
        .GetActiveAddress();

    const string imageAddress = "ipfs://QmX4t8ikQgjvLdqTtL51v6iVun9tNE7y7Txiw4piGQVNgK";

    var tokenMetadata = new TokenMetadata
    {
        Name = $"testName_{randomInt}",
        Description = $"testDescription_{randomInt}",
        Symbol = $"TST_{randomInt}",
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
            destination: destinationAddress,
            amount: randomAmount);
}
```

In your projects, you can set the metadata to store information about what the token represents.
For more information about creating tokens with Tezos, see [Tokens](../../architecture/tokens) and the tutorials [Create an NFT](../../tutorials/create-an-nft) and [Build an NFT marketplace](../../tutorials/build-an-nft-marketplace).

## Transfer scene

This scene shows how to transfer tokens between accounts.
To open the scene, go to the Project panel, expand **TezosSDK > Examples > Transfer**, and double-click `_Transfer`.

To try the scene, click the **Play** button and then go to the Simulator tab.
Like the other scenes, it shows a QR code to connect to, but it can reuse the connection from other scenes.

By default, the scene uses the contract that you deployed with the Contract scene.
It also shows the IDs of the tokens that you created with that contract, starting with 0.

To transfer a token, make sure that the scene shows the address of the contract.
Then, fill in the fields and click the Transfer button.
The Simulator panel looks like this:

<img src="/img/dApps/unity-transfer-scene-address.png" alt="The Transfer scene, showing information about the token to transfer" style={{width: 500}} />

After you approve the transaction in your wallet app, the contract transfers the token to the new owner.
You can see the token owners by looking at the contract storage in a block explorer.
For example, in [Better Call Dev](https://better-call.dev/), go to the Storage tab, expand the `ledger` object, and look at the entries.
For example, this entry shows that the account that ends in `2zD` owns 9 of the token with the ID 1:

<img src="/img/dApps/unity-transfer-scene-block-explorer-token-ownership.png" alt="The block explorer's Storage tab, showing the account address and the quantity of a token it owns" style={{width: 500}} />

This ledger of token ownership is stored in a big-map data type, which is serialized on Tezos to save space.

## IPFSUpload scene

This scene shows how to upload files to IPFS with the Pinata API.
To open the scene, go to the Project panel, expand **TezosSDK > Examples > Transfer**, and double-click `_IPFSUpload`.

The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system.
Blockchain developers use it to store data such as token images and metadata.

To use the scene, select the `DontDestroyOnLoad/TezosManager` object and add your Pinata API key, as in this picture:

<img src="/img/dApps/unity-ipfs-scene-api-key.png" alt="Adding the Pinata API key to the TezosManager object" style={{width: 300}} />

Then, click the **Play** button and then go to the Simulator tab.
The scene shows a button that opens a file selection window and uploads that file to IPFS.
