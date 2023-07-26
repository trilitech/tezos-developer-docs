---
id: tezos-sdk-for-unity
title: Tezos SDK for Unity
authors: John Joubert
lastUpdated: 5th June 2023
---

The Tezos SDK for Unity offers a comprehensive toolkit designed to facilitate Web3 gaming development. This SDK provides game developers with the necessary tools to:

1. **Connect to a Tezos wallet**: Enable user authentication, transaction signing, on-chain asset access, and cryptocurrency usage for in-game purchases.
2. **Access blockchain data**: Retrieve data from the Tezos blockchain, like in-game asset ownership. Manage asset storage through smart contracts or off-chain views, accessing blockchain-stored data.
3. **Invoke smart contracts**: Generate calls to Tezos smart contracts, allowing user-signed transactions for purchasing features or creating achievement-based in-game assets.
4. **Establish true ownership of in-game assets**: Enable users to own and verify in-game assets' authenticity via the Tezos blockchain, using smart contracts for data validation.

## Get Started

Begin by watching our [Getting Started video](https://youtu.be/0ouzNVxYI9g).

This Getting Started guide covers the following five steps essential for using the Tezos SDK in your Unity game or app development:

1. Installation of the Unity Editor (if not already installed)
2. Installation of the Tezos Integration SDK in the Unity Editor within a new project
3. Obtaining a Tezos-compatible wallet as an app or browser plugin (we'll use the **Temple** wallet for our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game))
4. Creating a wallet account for a test network (`ghostnet`) and acquiring test currency from an appropriate faucet
5. Linking this wallet account with the new Unity project

By following these steps, your Unity app will be connected to the Tezos GhostNet test network via your specific wallet address. This allows you to invoke specific functionality on smart contracts you've created and deployed to GhostNet, as demonstrated in our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game). 

Explore the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project and consult our [API Documentation](https://opentezos.com/gaming/unity-sdk/api-documentation/) to learn more about the exposed methods of our SDK, both for establishing wallet connections and for calling specific smart-contract entrypoints and Tezos data-view functions.

This SDK documentation is designed for users with some familiarity with Unity game development but may have little to no experience with Web3 or Tezos blockchain. If you're well-versed in both domains, you might want to skip "Getting Started" and proceed directly to the [API documentation](https://opentezos.com/gaming/unity-sdk/api-documentation/). Nonetheless, the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) can still be valuable for visualizing potential SDK applications in your own game development.

## Installing the Unity Editor

{% callout title="Note" %}
- Install Unity Editor version 2021.3.13 or above
- Enable iOS Build Support, even if you don't plan to build for iOS
{% /callout %}

The Tezos SDK has been developed and tested primarily in Unity 2021.3.13. If you're using an earlier version, you must install version 2021.3.13 or above. 

Newer Unity versions can coexist with older ones, allowing you to maintain older games built in previous editor versions. Manage different Unity installations through the **Installs** tab of your **Unity Hub**. This tool helps you track installations, projects, and required **modules** for publishing games or dApps to platforms like Windows, iOS, Android, WebGL, and others.

If you're new to Unity, download the [Unity editor for free.](https://unity.com/download) The free "personal" Unity editor offers a comprehensive core feature set for creating 2D and 3D games, apps, and environments, including AR, VR, and Web3 development.

{% callout type="warning" title="Warning" %}
The current SDK version requires iOS Build Support, even if you don't plan to build for iOS. This will be fixed in a future update. In the meantime, enable iOS Build Support in the "Installs" tab of your Unity Hub.
{% /callout %}

## Installing the Tezos SDK for Unity (Latest)

### Install from a Git URL

You can install the UPM package directly from a Git URL. To do this:

1. Open the [Unity Package Manager](https://docs.unity3d.com/Manual/upm-ui.html) window.
2. Click the add **+** button in the status bar.
3. Select **Add package from git URL** from the add menu. A text box and an Add button will appear.
4. Enter the `https://github.com/trilitech/tezos-unity-sdk.git` Git URL in the text box and click Add.
5. You can also install a specific package version using the URL with the specified version:
   - `https://github.com/trilitech/tezos-unity-sdk.git#X.Y.Z`
   - Replace `X.Y.Z` with the version you want to install.
   - Check all available releases [here](https://github.com/trilitech/tezos-unity-sdk/releases).
   - The latest available release version is: [![Last Release](https://img.shields.io/github/v/release/trilitech/tezos-unity-sdk)](https://github.com/trilitech/tezos-unity-sdk/releases/latest)

For more information about supported protocols, see [Git URLs](https://docs.unity3d.com/Manual/upm-git.html).

### Install from NPM

1. Navigate to your project's `Packages` directory.
2. Edit the [project manifest file](https://docs.unity3d.com/Manual/upm-manifestPrj.html) `manifest.json` in a text editor.
3. Ensure `https://registry.npmjs.org/` is part of `scopedRegistries`.
   - Make sure `com.trilitech` is included in `scopes`.
   - Add `com.trilitech.tezos-unity-sdk` to the `dependencies`, specifying the latest version.

   - A minimal example looks like this. Replace `X.Y.Z` with [the latest released version](https://www.npmjs.com/package/com.trilitech.tezos-unity-sdk), which is currently: [![NPM Package](https://img.shields.io/npm/v/com.trilitech.tezos-unity-sdk?color=blue)](https://www.npmjs.com/package/com.trilitech.tezos-unity-sdk)

    ```json
    {
      "scopedRegistries": [
        {
          "name": "npmjs",
          "url": "https://registry.npmjs.org/",
          "scopes": [
            "com.trilitech"
          ]
        }
      ],
      "dependencies": {
        "com.trilitech.tezos-unity-sdk": "X.Y.Z",
        ...
      }
    }
    ```

4. Return to the Unity Editor and wait for it to finish importing the added package.

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

{% callout title="More information"%}
For more information you can read detailed [documentation](https://opentezos.com/gaming/unity-sdk/api-documentation/) on OpenTezos.
{% /callout %}
