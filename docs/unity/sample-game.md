---
title: Sample game
authors: Tim McMackin
last_update:
  date: 3 June 2024
---

The sample game for the Unity SDK is a single-player third-person shooter with survival elements.
Players receive tokens that represent in-game items and the game tracks and transfers them via the Tezos blockchain.
You can import this game into the Unity Editor and work with it yourself.

The game shows how developers might structure a large-scale dApp by separating different features into different components, as described below in [Architecture](#architecture).
In particular, it handles some Tezos interaction from the Unity game itself, including connecting to the user's wallet and prompting them to sign a payload to authenticate.
The rest of the Tezos interaction happens in the backend application, including distributing tokens that represent in-game objects.
The Unity game also allows users to transfer those tokens to other accounts.

The source code for the Unity frontend application is here: https://github.com/baking-bad/tezos-unity-game.
To open it locally, see [Opening the sample game](#opening-the-sample-game).
To play the game, go to https://game.baking-bad.org.

The source code for the backend application is here: https://github.com/k-karuna/tezos_game_back.

![A screenshot from within the game interface](/img/unity/sample-game-ui.png)

## Architecture

The sample game uses these main components:

- **User wallets** as a source of user identity and authentication.
The user doesn't make any direct transactions from the wallet and pays no tez to the application or in fees.
For more information about Tezos wallets, see [Installing and funding a wallet](../developing/wallet-setup).

- The **Unity WebGL application** is the front end of the application.
It connects to the user wallet, sends the sign request, runs the game interface, and sends requests to the backend.

- The **backend application** hosts a REST API for the Unity application to call.
The Unity application calls it from the `Assets/Scripts/Api/GameApi.cs` file for tasks such as these:

  - Getting the signed payload from the wallet
  - Verifying the signed payload
  - Tracking events such as the beginning and end of a game session
  - Sending tokens to players' accounts

  The backend application is responsible for most of the interaction with the smart contract, including transferring tokens to players.
  It securely manages the private key for the administrator account, which is responsible for minting and transferring tokens.
  This way, the game client itself has no access to the private key.

  For information about the REST API endpoints, see this page: https://game.baking-bad.org/back/swagger/.

- The **backend database** stores persistent information about players, such as the number of games they have played.

- The **smart contract** is a program that runs on the Tezos blockchain to manage tokens that represent in-game items.
It maintains a ledger of tokens and owners and allows the backend's administrator account to transfer them to players.
The sample game uses a custom contract, but you can use the SDK's built-in FA2-compliant contract; see [Managing contracts](./managing-contracts).
You can view and interact with the contract on a block explorer, such as tzkt.io: https://tzkt.io/KT1TSZfPJ5uZW1GjcnXmvt1npAQ2nh5S1FAj/operations.

- The **Interplanetary File System (IPFS)** stores metadata for the tokens, including pictures and descriptions.
Links in the smart contract point to this metadata.

This diagram shows the basic interaction between these components:

![The architecture of the sample game, showing interaction between the user wallet, the Unity WebGL application, the backend, and the smart contract](/img/unity/sample-game-architecture.png)

## Authentication

The game uses the user's Tezos account as a source of authentication.
It prompts the user to connect their Tezos wallet so it can retrieve the user's account address.
For more information about connecting to user wallets, see [Connecting accounts](./connecting-accounts).

When the wallet is connected, the game prompts the user to sign a payload to prove that they have the key for the account.
The process follows these general steps:

1. The user loads the game client and clicks the button to connect.
1. The game client requests an authentication payload from the backend.
1. The backend [generates a random string](https://github.com/k-karuna/tezos_game_back/blob/e6bc9c021b86704ec1ce1b5e3fd799977d05034f/api/views.py#L20) and sends it to the Unity application.
1. The Unity application [sends the string as a signing request payload](https://github.com/baking-bad/tezos-unity-game/blob/7e3fb6454896896f7e0ac77f09d2b5f02e104aa7/Assets/Scripts/Managers/UserDataManager.cs#L108) to the wallet.
1. The user signs the payload in their wallet application.
1. The Unity application [receives the signed payload and sends it to the backend](https://github.com/baking-bad/tezos-unity-game/blob/9b71d3832dac076d74bd822c19b5f93909434190/Assets/Scripts/Managers/UserDataManager.cs#L78).
1. The backend [verifies that the payload is correctly signed](https://github.com/k-karuna/tezos_game_back/blob/e6bc9c021b86704ec1ce1b5e3fd799977d05034f/api/views.py#L50).
1. The game [allows the user to play if validation is successful](https://github.com/baking-bad/tezos-unity-game/blob/9b71d3832dac076d74bd822c19b5f93909434190/Assets/Scripts/Managers/UserDataManager.cs#L80).

Here is a diagram of the process:

![Authentication flow diagram](/img/unity/unity-sample-game-authentication.png)

For more information about signing messages, see [Signing messages](./quickstart#signing-messages) in the Unity SDK quickstart.

## Tokens

The game uses Tezos tokens to represent in-game items, such as weapons, armor, and power-ups.
Because these tokens are compliant with the [FA2](../architecture/tokens/FA2) standard, players can see their tokens in their wallets and in applications such as block explorers.
They could also set up a third-party platform to show and trade their tokens.

The smart contract that manages the tokens has one [token type](https://better-call.dev/mainnet/KT1TSZfPJ5uZW1GjcnXmvt1npAQ2nh5S1FAj/tokens) for each in-game item.
For example, tokens with the ID 1 represent armor:

![Example of a token type](/img/unity/sample-game-token-types.png)

The contract pre-mints a supply of 1000 of each token type so tokens are available when players claim them.
When a player claims a token with the Claim Reward button and solves a captcha, the game client calls the backend, which verifies the captcha and calls the contract's `transfer` entrypoint to send one of that token type to the player's account.
This diagram shows the interaction between the game and the player's wallet:

![A diagram of the interaction between the player's wallet and the components of the application, showing how tokens are read from the wallet information and distributed from the smart contract to the wallet](/img/unity/sample-game-architecture-play.png)

An account can have only one of each token type, which makes the tokens similar to NFTs, but they are not NFTs because any number of accounts can have one of each token.
Therefore, they are technically fungible tokens because tokens of the same type are interchangeable, but the backend sends only one token of each type to each account.

To see the tokens that an account has, you can check the ledger in the contract's storage.
The ledger has entries that are indexed by the account address and the token type.
For example, this ledger entry shows that account `tz1eQQnDbkTpTnu3FXix28xKdaWYRqrsZcZv` has one token of type 16:

![The contract ledger on Better Call Dev, showing one entry](/img/unity/sample-game-ledger-entry.png)

The contract uses standard FA2 entrypoints including `transfer`, plus other custom entrypoints for this implementation.
You can see these entrypoints on block explorers: https://better-call.dev/mainnet/KT1TSZfPJ5uZW1GjcnXmvt1npAQ2nh5S1FAj/interact.

## User data

The game uses the Unity SDK to get player data from the backend and work with it locally.
The [`UserDataManager.cs`](https://github.com/baking-bad/tezos-unity-game/blob/master/Assets/Scripts/Managers/UserDataManager.cs) file manages this player data, which includes:

- The tokens that the account owns
- The player's statistics
- Information about the active game session
- The player's currently equipped equipment
- Pending rewards, which represent in-game items that the user has earned but has not received a token for yet

Some of this information (such as the tokens that the player owns) comes from Tezos and other information (such as the player's statistics) comes from the backend.
Information about the current game session and pending rewards are non-persistent data that are stored by the Unity application.

The `UserDataManager` class responds to [events](./reference/EventManager) such as when the user connects their wallet and then loads information from the backend and from Tezos directly.

## Opening the sample game

Follow these steps to open the sample game in the Unity editor:

1. Clone the sample game repository at https://github.com/baking-bad/tezos-unity-game.

1. In Unity Hub, click **Add > Add project from disk**.

1. Select the repository folder and click **Add Project**.

1. If Unity Hub prompts you to install a specific version of Unity Editor, follow the prompts to install that version.

1. Click the project in Unity Hub to open it in Unity Editor.
