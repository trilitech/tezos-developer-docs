---
title: Tezos SDK for Unity
authors: John Joubert, Tim McMackin
last_update:
  date: 22 November 2023
---

The Tezos SDK for Unity provides tools that let you access user wallets and Tezos in games and other Unity projects.
You can use Tezos via the SDK to:

- Use a player's Tezos account as their account for a game and their wallet as their way of logging in to the game
- Accept payments from players in tez
- Use Tezos to create game assets, store player inventories, and transfer assets between players
- Verify that users own specific game assets and allow them to sell or share them to other players
- Use Tezos smart contracts as backend logic for games

For a walkthrough of setting up and using the SDK in an existing Unity project, see [Quickstart](./unity/quickstart).

## Installing the Tezos SDK for Unity

The SDK requires Unity Editor version 2021.3.23f1 or later.

1. From the SDK's GitHub page at https://github.com/trilitech/tezos-unity-sdk/releases, download the latest release of the SDK, which is a file named `TezosUnitySdk.unitypackage`.
1. In the Unity Editor, click **Assets > Import Package > Custom Package** and import the SDK file.
1. In the Unity Editor, in the Package Manager panel, find the Tezos SDK for Unity and click the **Download** button.
1. Verify that the SDK is installed by opening the Project panel and expanding the **Assets > TezosSDK** folder.
If you see the TezosSDK folder with sub-folders including Editor, Examples, Resources, and Runtime, the SDK is installed correctly.
1. Add the prerequisite SDK components to your scene:

   1. Open a scene in your project or create a scene.
   1. In the Project panel, expand **Assets > TezosSDK > Runtime > Prefabs**.
   1. From the Prefabs folder in the Project panel, drag the MainThreadExecutor prefab to the Hierarchy panel.
   1. In the same way, drag the TezosManager prefab to the Hierarchy panel.
   The TezosManager prefab opens in the Inspector panel.
   1. In the Inspector panel, set the information for your project, including its name and URL.

      This prefab provides prerequisites to use Tezos in a scene.
      Its fields control what users see in their wallet applications before connecting to the project.

## Sample scenes

The SDK includes sample scenes that demonstrate how to use the SDK.
To open the scenes, install the SDK and in the Project panel, expand **TezosSDK > Examples**.

Before using any of the scenes, install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes and get some test tez tokens that you can use to pay transaction fees.
For instructions, see [Installing and funding a wallet](../../developing/wallet-setup).

The sample scenes are in sub-folders:

### WalletConnection scene

This scene shows how to connect to a user's wallet and get information about their account.
To open the scene, go to the Project panel, expand **TezosSDK > Examples > WalletConnection**, and double-click `_WalletConnection`.

To try the scene, click the **Play** button and then go to the Simulator tab.
The scene shows that no account is connected and a QR code:

<img src="/img/dApps/unity-walletconnection-scene-unconnected.png" alt="The start of the WalletConnection scene, with no account information" style={{width: 300}} />

To connect, scan the QR code in any Tezos-compatible wallet app.
Mobile wallet apps for Tezos include [Temple](https://templewallet.com/), [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).
Then, approve  the connection in the wallet app.

Then, the scene shows the address of the connected account and a logout button that closes the connection:

<img src="/img/dApps/unity-walletconnection-scene-connected.png" alt="The WalletConnection scene with a connected account" style={{width: 300}} />

To see the code that runs the objects in the scene, stop the scene and expand the Canvas object in the Hierarchy panel.
Then, select an object, go to the Inspector panel, and double-click the script component.
For example, to open the code for the object that shows the address of the account, select the AccountAddress object in the Hierarchy panel and double-click `AccountInfoUI` in the Inspector panel, as shown in this image:

<img src="/img/dApps/unity-walletconnection-scene-accountinfoui.png" alt="Opening the AccountInfoUI script" style={{width: 600}} />

The `AccountInfoUI` script opens in your IDE.
This script defines a variable named addressText, which is bound to the Unity object.

In the `Start` function, it sets listeners for the Tezos SDK events that happen when accounts connect and disconnect:

```csharp
private void Start()
{
  addressText.text = notConnectedText;
  TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
  TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
}

private void OnAccountDisconnected(AccountInfo account_info)
{
  addressText.text = notConnectedText;
}

private void OnAccountConnected(AccountInfo account_info)
{
  addressText.text = TezosManager.Instance.Wallet.GetActiveAddress();
  // OR
  addressText.text = account_info.Address;
}
```

For the complete list of listeners, see the file `Assets/TezosSDK/Runtime/Scripts/Beacon/WalletEventManager.cs` in the SDK.

### Contract scene

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
For more information about creating tokens with Tezos, see [Tokens](../architecture/tokens) and the tutorials [Create an NFT](../tutorials/create-an-nft) and [Build an NFT marketplace](../tutorials/build-an-nft-marketplace).

### Transfer scene

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

## WebGL Support

* Open Unity Editor.
* Navigate to Project -> Packages and find the Tezos Unity SDK.
* Double-click the package file WebGLSupport.unitypackage. Project->Packages->Tezos-Unity-SDK.
* The Import Unity Package dialog box displays, with all the items in the package pre-checked, ready to install.
* This action creates WebGL template folders in your Project. Each template is a subfolder within the WebGLTemplates
  folder. Each template subfolder contains an index.html file along with any other resources the page needs, such as
  images or stylesheets.

## SDK objects

The SDK provides these objects:

- `TezosManager.Instance.DAppMetadata`: Read-only metadata about the project, including the Name, Url, Icon, and Description fields that you set on the TezosManager prefab in the Unity Editor.

- `TezosManager.Instance.Wallet`: An object that provides information about the connected wallet and allows you to send transactions from the user's account.

- `TezosManager.Instance.MessageReceiver`: An object that provides events that you can add listeners to.
You can see these events and their return values in the `WalletEventManager.cs` file.

- `TezosManager.Instance.Tezos.TokenContract`: An object that provides an FA2 contract and convenience methods to access it.
You can use this object to deploy the contract and call the contract's entrypoints to create and transfer tokens.

- `TezosManager.Instance.Tezos.API`: An object that provides methods to access data from Tezos, such as an account's balance in tez or the metadata for a token.

<!-- TODO: Link to complete reference for these objects -->

## Dependencies

The Tezos SDK utilizes modified versions of the following libraries for communication:

1. **Airgap Beacon SDK**: Interacts with Tezos wallets through the Beacon standard for iOS, Android, and WebGL platforms.
2. **Netezos**: Interacts with Tezos wallets through the Beacon standard for Windows, Linux, and MacOS platforms. Also prepares parameters for smart contract calls and interprets complex data returned by the ReadView method.

## Supported Platforms

The SDK supports Windows, Linux, MacOS, iOS, Android, and WebGL platforms.

:::note More information
For more information you can read detailed [documentation](https://opentezos.com/gaming/unity-sdk/api-documentation/) on OpenTezos.
:::
