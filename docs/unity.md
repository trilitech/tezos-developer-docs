---
title: Tezos SDK for Unity
authors: Tim McMackin
last_update:
  date: 19 December 2023
---

The Tezos SDK for Unity provides tools that let you access user wallets and Tezos in games and other Unity projects.
You can use Tezos via the SDK to:

- Use a player's Tezos account as their account for a game and their wallet as their way of logging in to the game
- Accept payments from players in tez
- Use Tezos to create game assets, store player inventories, and transfer assets between players
- Verify that users own specific game assets and allow them to sell or share them to other players
- Use Tezos smart contracts as backend logic for games

## Installation and use

For a walkthrough of installing and using the SDK in an existing Unity project, see [Quickstart](./unity/quickstart).

## Tutorial scenes

The SDK includes Tutorial scenes that demonstrate how to use the SDK.
To open the scenes, install the SDK and in the Project panel, expand **TezosSDK > Tutorials**.
For information about each scene, see [Tutorial scenes](./unity/scenes).

## SDK objects

The SDK provides these objects:

- [`DAppMetadata`](./unity/reference/DAppMetadata): Read-only metadata about the project, including the Name, Url, Icon, and Description fields that you set on the TezosManager prefab in the Unity Editor.

- [`Wallet`](./unity/reference/Wallet): An object that provides information about the connected wallet and allows you to send transactions from the user's account.

- [`MessageReceiver`](./unity/reference/MessageReceiver): An object that provides events that you can add listeners to.
You can see these events and their return values in the `WalletEventManager.cs` file.

- [`TokenContract`](./unity/reference/TokenContract): An object that provides an FA2 contract and convenience methods to access it.
You can use this object to deploy the contract and call the contract's entrypoints to create and transfer tokens.

- [`API`](./unity/reference/API): An object that provides methods to access data from Tezos, such as an account's balance in tez or the metadata for a token.

## Dependencies

The Tezos SDK utilizes modified versions of the following libraries for communication:

- **Airgap Beacon SDK**: Interacts with Tezos wallets through the Beacon standard for iOS, Android, and WebGL platforms.
- **Netezos**: Interacts with Tezos wallets through the Beacon standard for Windows, Linux, and MacOS platforms. Also prepares parameters for smart contract calls and interprets complex data returned by the ReadView method.

The SDK also uses the [Newtonsoft JSON Unity Package](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html).

## Supported Platforms

The SDK supports Windows, Linux, MacOS, iOS, Android, and WebGL platforms.
