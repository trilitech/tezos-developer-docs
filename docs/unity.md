---
title: Tezos Unity SDK
authors: Tim McMackin
last_update:
  date: 4 November 2024
---

The Tezos Unity SDK provides tools that let you access user wallets and Tezos in games and other Unity projects.
You can use Tezos via the SDK to:

- Use a player's Tezos account as their account for a game and their wallet as their way of logging in to the game
- Accept payments from players in tez
- Use Tezos to create game assets, store player inventories, and transfer assets between players
- Verify that users own specific game assets and allow them to sell or share them to other players
- Use Tezos smart contracts as backend logic for games

## Installation and use

For a walkthrough of installing and using the SDK in an existing Unity project, see [Quickstart](/unity/quickstart).

## Upgrading from version 3

Version 4.0 has breaking changes.
To upgrade, see [Upgrading the Unity SDK](/unity/upgrading).

## Tutorial scenes

The SDK includes tutorial scenes that demonstrate how to use the SDK.
For information about setting up and using the scenes, see [Tutorial scenes](/unity/scenes).

## Sample game

For information about a complete sample game that you can load locally and explore, see [Sample game](/unity/sample-game).

## SDK objects

The SDK provides objects that you can use to interact with user wallets and with Tezos.
See [Unity SDK reference](/unity/reference).

## Dependencies

The Tezos SDK uses modified versions of the following libraries for communication:

- **Airgap Beacon SDK**: Interacts with Tezos wallets through the Beacon standard for iOS, Android, and WebGL platforms.
- **Netezos**: Interacts with Tezos wallets through the Beacon standard for Windows, Linux, and MacOS platforms. Also prepares parameters for smart contract calls and interprets complex data returned by the ReadView method.

The SDK also uses the [Newtonsoft JSON Unity Package](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html).

## Supported Platforms

The SDK supports Windows, Linux, MacOS, iOS, Android, and WebGL platforms.
