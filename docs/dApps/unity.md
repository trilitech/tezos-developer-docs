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

1. In the Unity asset store, find the [Tezos SDK for Unity](https://assetstore.unity.com/packages/decentralization/infrastructure/tezos-sdk-for-unity-239001).
1. Click **Add to My Assets**.
1. In the Unity Editor, in the Package Manager panel, find the Tezos SDK for Unity and click the **Download** button.
1. Verify that the SDK is installed by opening the Project panel and expanding the **Assets > TezosSDK** folder.

If you see the TezosSDK folder with sub-folders including Editor, Examples, Resources, and Runtime, the SDK is installed correctly.

## Sample scenes

The SDK includes sample scenes that demonstrate how to use the SDK.
To open the scenes, install the SDK and in the Project panel, expand **TezosSDK > Examples**.

Before using any of the scenes, install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes and get some test tez tokens that you can use to pay transaction fees.
If you don't have a wallet on a mobile device, follow these steps:

   1. Install a Tezos-compatible wallet app on a mobile device.
   Mobile wallet apps for Tezos include [Temple](https://templewallet.com/), [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).
   1. Switch the wallet to use Ghostnet testnet instead of Tezos Mainnet.
   Ghostnet is a network for testing Tezos applications where tokens are free so you don't have to spend real currency to work with your applications.

      The process for changing the network is different for each wallet type.
      These steps are for the Temple wallet:

      1. Go to https://teztnets.xyz/, which lists Tezos testnets.
      1. Click **Ghostnet**.
      1. Copy one of the public RPC endpoints for Ghostnet, such as `https://rpc.ghostnet.teztnets.xyz`.
      These URLs accept Tezos transactions from wallets and other applications.
      1. In the Temple app, open the settings and then click **Default node (RPC)**.
      1. Click the plus `+` symbol to add an RPC node.
      1. On the Add RPC screen, enter the URL that you copied and give the connection a name, such as "Ghostnet," as shown in this picture:

         <img src="/img/dApps/temple-wallet-new-rpc.png" alt="Entering information for the new RPC node" style={{width: 300}} />
      1. Click Add.
      1. Make sure that the new RPC node is selected, as in this image:

         <img src="/img/dApps/temple-wallet-selected-rpc.png" alt="The new RPC node selected in the Temple wallet" style={{width: 300}} />

   1. From your wallet, get the address of your account, which starts with `tz1`.
   This is the address that applications use to work with your wallet.

   1. Get some testnet tez for the wallet:

      1. Go to the Ghostnet faucet at https://faucet.ghostnet.teztnets.xyz.
      This faucet provides tez for free to use on the testnet.
      1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of tez to add to your wallet.
      20 tez is enough to work with, and you can return to the faucet later if you need more tez.

         It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

         You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on Mainnet.

         ![Fund your wallet using the Ghostnet Faucet](/img/tutorials/wallet-funding.png)

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

When the mint transaction is complete, the "Tokens Count" text in the scene updates to show the number of tokens that have been minted with this contract.

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

## WebGL Support

* Open Unity Editor.
* Navigate to Project -> Packages and find the Tezos Unity SDK.
* Double-click the package file WebGLSupport.unitypackage. Project->Packages->Tezos-Unity-SDK.
* The Import Unity Package dialog box displays, with all the items in the package pre-checked, ready to install.
* This action creates WebGL template folders in your Project. Each template is a subfolder within the WebGLTemplates
  folder. Each template subfolder contains an index.html file along with any other resources the page needs, such as
  images or stylesheets.

## API Summary

The [SDK's API](https://opentezos.com/gaming/unity-sdk/api-documentation/) includes seven methods, which, together with the BeaconSDK and Netezos libraries, provide comprehensive access to the Tezos Blockchain for your games:

1. **ConnectWallet**: Handles wallet pairings using QRCode scans, deep links, or injections, depending on the platform. Supports various Tezos wallets such as Kukai, Umami, or Temple.
2. **DisconnectWallet**: Disconnects the app from the user's wallet.
3. **GetActiveWalletAddress**: Retrieves the Tezos address of the currently active wallet account.
4. **ReadBalance**: Returns the tez balance of the current user.
5. **ReadView**: Calls an off-chain view to obtain data from a smart contract and its storage.
6. **CallContract**: Enables calls to any Tezos contract by specifying the entrypoint, input parameters, and tez amount sent to the contract.
7. **RequestSignPayload**: Requests the user to digitally sign data with their wallet.

Additional features and data retrieval options from the Netezos SDK are included in this SDK.

## Dependencies

The Tezos SDK utilizes modified versions of the following libraries for communication:

1. **Airgap Beacon SDK**: Interacts with Tezos wallets through the Beacon standard for iOS, Android, and WebGL platforms.
2. **Netezos**: Interacts with Tezos wallets through the Beacon standard for Windows, Linux, and MacOS platforms. Also prepares parameters for smart contract calls and interprets complex data returned by the ReadView method.

## Supported Platforms

The SDK supports Windows, Linux, MacOS, iOS, Android, and WebGL platforms.

:::note More information
For more information you can read detailed [documentation](https://opentezos.com/gaming/unity-sdk/api-documentation/) on OpenTezos.
:::
