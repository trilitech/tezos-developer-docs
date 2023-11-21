---
title: Quickstart
authors: Tim McMackin
last_update:
  date: 21 November 2023
---

Follow these steps to install the Tezos SDK for Unity in an existing Unity project and start using it.

These instructions cover:

- Installing the SDK into an existing Unity project
- Testing that the SDK works in your project
- Adding objects that connect to a user's Tezos wallet

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

1. Make sure that you have Unity Editor version 2021.3.23f1 or later.

1. Install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes.
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

1. Install the SDK through the Unity asset store:

   1. In the Unity asset store, find the [Tezos SDK for Unity](https://assetstore.unity.com/packages/decentralization/infrastructure/tezos-sdk-for-unity-239001).
   1. Click **Add to My Assets**.
   1. In the Unity Editor, in the Package Manager panel, find the Tezos SDK for Unity and click the **Download** button.
   1. TODO double-check these instructions when the new package is available on the asset store.
   1. Verify that the SDK is installed by opening the Project panel and expanding the **Assets > TezosSDK** folder.

     If you see the TezosSDK folder with sub-folders including Editor, Examples, Resources, and Runtime, the SDK is installed correctly.

1. Verify that the SDK works in your project by running the WalletConnection example scene, which demonstrates how to connect to a Tezos wallet in a Unity project:

   1. In the Unity Editor, in the Project panel, open the **Assets > TezosSDK > Examples** folder and click the **WalletConnection** folder.
   1. In the WalletConnection folder, double-click the _WalletConnection scene to open it in the editor.
   1. Click the **Play** button to run the scene.
   1. Open the Simulator panel, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   The project UI shows the address of the connected account, as in this picture:

      <img src="/img/dApps/unity-wallet-connection-scene-connected.png" alt="The new RPC node selected in the Temple wallet" style={{width: 500}} />

1. Add the prerequisite SDK components to your scene:

   1. Open a scene in your project or create a scene.
   1. In the Project panel, expand **Assets > TezosSDK > Runtime > Prefabs**.
   1. From the Prefabs folder in the Project panel, drag the MainThreadExecutor prefab to the Hierarchy panel.
   1. In the same way, drag the TezosManager prefab to the Hierarchy panel.
   The TezosManager prefab opens in the Inspector panel.
   1. In the Inspector panel, set the information for your project, including its name and URL.

      This prefab provides prerequisites to use Tezos in a scene.
      Its fields control what users see in their wallet applications before connecting to the project.

      ![The Inspector panel, showing information about the project](/img/dApps/unity-inspector-tezosmanager.png)

1. Copy the necessary objects to the scene:

   1. Open the _WalletConnection scene again.
   1. In the Hierarchy panel, expand the Canvas object.
   1. Under Canvas, select the following objects by holding Ctrl or Cmd and clicking them:

      - ConnectedText
      - QRCode
      - LogoutButton
      - MetadataInfo
      - AccountAddress

   1. Right-click the elements and then click **Copy**.
   1. Go back to your scene and paste the objects into the scene's canvas in the Hierarchy panel.
   The Hierarchy panel looks like this:

      ![The Hierarchy panel, showing the Tezos-related objects](/img/dApps/unity-hierarchy-panel-quickstart.png)

   1. If the objects appear outside the border of your scene, reposition them on the canvas.
   1. Save the scene.
   1. Click the **Play** button to run the scene.
   1. Open the Simulator panel, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   Note that the wallet app shows the name of the project that you set on the TezosManager prefab.

   The project shows the address that you used to connect.

TODOs:

- Respond to events using the WalletEventManager from the wallet-event-manager branch
- Deploy contract
- Mint tokens
- Send tez transaction?
- What else to get started?

Now that your project can connect to a user's account, you can use this connection to identify a user's account, because Tezos addresses are unique.
You can also use this connection to send transactions to Tezos on behalf of the user, such as manipulating Tezos tokens as game assets.