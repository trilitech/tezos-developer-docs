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
