---
title: Tezos SDK for Unity
authors: Tim McMackin
last_update:
  date: 11 December 2023
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

   1. If you want to publish the project to WebGL, follow the steps in [Enabling WebGL support](#enabling-webgl-support).

## Enabling WebGL support

The WebGL platform allows you to publish Unity projects to run in a web browser.
Follow these steps to set up the Tezos SDK to work with WebGL:

1. In the Unity Editor, go to the Project panel and find the Tezos SDK for Unity.
1. From the `WebGLFrontend/output` folder, copy the `StreamingAssets` and `WebGLTemplates` folders into the `Assets` folder of your project.

   Unity creates WebGL template folders for your project.
   Each template is contained as a subfolder within the `WebGLTemplates` folder.
   Each template subfolder contains an `index.html` file along with any other resources the page needs, such as images or stylesheets.

1. Select the template to use in the WebGL build:

   1. Click **Edit > Project Settings**.
   1. Go to the **Player** tab.
   1. On the Player tab, go to the **WebGL settings** tab.
   1. Under **Resolution and Presentation**, select the WebGL template to use.

1. To enable copy and paste in the WebGL build, double-click the `WebGLCopyAndPaste.unitypackage` package, which is in the `TezosSDK/WebGLFrontend/output` folder of the SDK, to install it.

   This package includes the script `WebGLCopyAndPaste.cs` alongside with `StreamingAssets` and `WebGLTemplates` folders inside your project Assets directory.
   It automatically enables copy and paste on selectable text fields, such as the account address field in the _WalletConnection example scene.

## Example scenes

The SDK includes example scenes that demonstrate how to use the SDK.
To open the scenes, install the SDK and in the Project panel, expand **TezosSDK > Examples**.
For information about each scene, see [Example scenes](./unity/scenes).

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
