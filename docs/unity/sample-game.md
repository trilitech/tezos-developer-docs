---
title: Sample game
authors: Tim McMackin
last_update:
  date: 10 May 2024
---

The sample game for the Unity SDK is a single-player third-person shooter with survival elements.
Players receive tokens that represent in-game objects and the game tracks and transfers them via the Tezos blockchain.
You can import this game into the Unity Editor and work with it yourself.

The game shows how developers might structure a large-scale dApp by separating different features into different components, as described below in [Architecture](#architecture).
In particular, it handles some Tezos interaction from the Unity game itself, including connecting to the user's wallet, prompting them to sign a payload to authenticate.
The rest of the Tezos interaction happens in the backend application, including minting and distributing tokens that represent in-game objects.
The Unity game allows users to transfer those tokens to other accounts.

The source code for the Unity front-end application is here: https://github.com/baking-bad/tezos-unity-game.
To open it locally, see [Opening the sample game](#opening-the-sample-game).
To play the game, go to https://game.baking-bad.org.

The source code for the backend application and smart contract is not available publicly.

![A screenshot from within the game interface](/img/unity/sample-game-ui.png)

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

## Tokens

The game uses Tezos tokens to represent in-game objects, such as weapons, armor, and power-ups.
Because these tokens are compliant with the [FA2](../architecture/tokens/FA2) standard, players can see their tokens in their wallets and in applications such as block explorers.
They could also set up a third-party platform to show and trade their tokens.

The smart contract that manages the tokens has one [token type](https://better-call.dev/mainnet/KT1TSZfPJ5uZW1GjcnXmvt1npAQ2nh5S1FAj/tokens) for each in-game object:

![Some of the token types in the contract](/img/unity/sample-game-token-types.png)

When a player claims a token, the contract mints one of that token type and sends it to the player's account.
An account can have only one of each token type, which makes the tokens similar to NFTs, but they are not NFTs because any number of accounts can have one of each token.
Therefore, they are technically fungible tokens because tokens of the same type are interchangeable, but they have the limitation that an account can have only one of each token type.

To see the tokens that an account has, you can check the ledger in the contract's storage.
The ledger has entries that are indexed by the account address and the token type.
For example, this ledger entry shows that account `tz1eQQnDbkTpTnu3FXix28xKdaWYRqrsZcZv` has one token of type 16:

![The contract ledger on Better Call Dev, showing one entry](/img/unity/sample-game-ledger-entry.png)

The contract uses standard FA2 entrypoints including `transfer`, plus other custom entrypoints for this implementation.
You can see these entrypoints on the **Interact** tab of the block explorer: https://better-call.dev/mainnet/KT1TSZfPJ5uZW1GjcnXmvt1npAQ2nh5S1FAj/interact.

## User data

The game uses the Unity SDK to get player data from the backend and work with it locally.
The [`UserDataManager.cs`](https://github.com/baking-bad/tezos-unity-game/blob/master/Assets/Scripts/Managers/UserDataManager.cs) file manages this player data, which includes:

- The tokens that the account owns
- The player's statistics
- Information about the active game session
- The player's currently equipped equipment
- Pending rewards, which represent in-game items that the user has earned but has not received a token for yet

The `UserDataManager` class responds to [events](./reference/EventManager) such as when the user connects their wallet and then loads information from the backend and from Tezos directly.

## Opening the sample game

Follow these steps to open the sample game in the Unity editor:

1. Clone the sample game repository at https://github.com/baking-bad/tezos-unity-game.

1. In Unity Hub, click **Add > Add project from disk**.

1. Select the repository folder and click **Add Project**.

1. If Unity Hub prompts you to install a specific version of Unity Editor, follow the prompts to install that version.

1. Click the project in Unity Hub to open it in Unity Editor.
