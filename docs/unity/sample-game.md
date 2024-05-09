---
title: Sample game
authors: Tim McMackin
last_update:
  date: 9 May 2024
---

TODO: Intro info

## Architecture

The sample game uses these main components:

- **User wallets** as a source of user identity and authentication.
The user doesn't make any direct transactions from the wallet and pays no tez to the application or in fees.
Instead, the game has the user sign a payload to reveal their address and prove that they have the key for it so the game can use that address as the user's internal ID.

- The **Unity WebGL application** is the front end of the application.
It connects to the user wallet, sends the sign request, runs the game interface, and sends requests to the backend.

- The **backend application** hosts a REST API for the Unity application to call.
The Unity application calls it from the `Assets/Scripts/Api/GameApi.cs` file for tasks such as these:

  - Getting the signed payload from the wallet
  - Verifying the signed payload
  - Tracking events such as the beginning and end of a game session
  - Triggering the backend to mint a token as a player reward

  The backend application is responsible for all interaction with the smart contract, including minting operations.
  It also manages the token metadata and images, which are pinned to IPFS.

- The **smart contract** is an instance of the built-in contract that comes with the Unity SDK.

  As described in [Managing contracts](./managing-contracts), the SDK uses a built-in FA2-compliant contract to manage tokens on behalf of users.
  In the case of the sample game, the contract has a token type that represents each in-game item that a player can own.
  When a player earns an item, it mints a token of that type and sends it to the user's account.
  Your games can user other kinds of tokens, such as NFTs that have only one instance or fungible tokens that a user can own any number of, but in the case of the sample game, a user can own only one of each token.

This diagram shows the basic interaction between these components:

![The architecture of the sample game, showing interaction between the user wallet, the Unity WebGL application, the backend, and the smart contract](/img/unity/sample-game-architecture.png)

## Opening the sample game

Follow these steps to open the sample game in the Unity editor:

1. Clone the sample game repository at https://github.com/baking-bad/tezos-unity-game.

1. In Unity Hub, click **Add > Add project from disk**.

1. Select the repository folder and click **Add Project**.

1. If Unity Hub prompts you to install a specific version of Unity Editor, follow the prompts to install that version.

1. Click the project in Unity Hub to open it in Unity Editor.
