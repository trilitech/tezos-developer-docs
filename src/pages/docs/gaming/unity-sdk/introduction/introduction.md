---
id: introduction
disable_pagination: true
title: Introduction
slug: /gaming/unity-sdk/
author: Mathias Hiron
---

## Tezos SDK for Unity

The Tezos SDK for Unity invites developers to discover the future of Web3 gaming with a complete kit that empowers game developers with the ability to:

**Connect to a Tezos wallet** – Using the wallet-pairing feature of the SDK, you can allow users to authenticate using their Tezos blockchain credentials. Users can securely authenticate themselves in a game, sign blockchain transactions, gain access to all on-chain assets, and use cryptocurrency to purchase services, features, or in-game assets.

**Utilize data on the blockchain**  – The SDK enables game developers to capture data on the Tezos blockchain, such as checking which features of the game or in-game assets the user owns. Importantly, users can manage the storage of their assets via smart contracts or call off-chain views, creating access to any data stored in the blockchain.

**Call smart contracts** – Games will be able to generate calls to Tezos smart contracts, to be signed by the user– opening the limitless possibilities of smart contracts on Tezos. From simple transactions such as purchasing extra features using cryptocurrency, to generating in-game assets based on achievements, this feature will allow users to trade on public marketplaces, transfer in-game assets, or participate in multi-game challenges.

**True ownership of in-game assets** – Through the SDK, users will be able to own and easily verify the authenticity of the in-game assets via the Tezos blockchain. Signing data through smart contracts enables games to prompt users to verify the authenticity of data signed by other users. 

The Tezos SDK supports Desktop, Android, iOS and browsers. Beyond allowing game developers to interact with the Tezos blockchain, this SDK is a helpful resource for developing any Tezos decentralized application (dApp).

## API summary

The SDK's API consists in 7 methods that along with the associated BeaconSDK and Netezos libraries, give you access to all the potential of the Tezos Blockchain for your games.

[**ConnectWallet**](/gaming/unity-sdk/api-documentation#connectwallet)

This method handles all instances of wallet pairings, using QRCode scan, a deeplink or injection depending on the platform you are on. It uses the Beacon wallet integration standard, so that it can uses different Tezos wallets such as Kukai, Umami or Temple.


[**DisconnectWallet**](/gaming/unity-sdk/api-documentation#disconnectwallet)

This method disconnects the app from the user’s wallet.

[**GetActiveWalletAddress**](/gaming/unity-sdk/api-documentation#getactivewalletaddress)

This method returns the Tezos address of the current active wallet account.

[**ReadBalance**](/gaming/unity-sdk/api-documentation#readbalance)

This method simply returns the tez balance of the current user.

[**ReadView**](/gaming/unity-sdk/api-documentation#readview)

This method is used to call an off-chain view to obtain data from any smart contract and its storage.

[**CallContract**](/gaming/unity-sdk/api-documentation#callcontract)

With this method, you can call any contract on Tezos, specifying the entry point, the input parameters and the amount of Tez sent to the contract.

[**RequestSignPayload**](/gaming/unity-sdk/api-documentation#requestsignpayload)

This method can be used to request the user to digitally sign any data with their wallet.

Verifying signatures, as well as fetching other types of data from the blockchain can be done through a number of features from the Netezos SDK that is included in this SDK.

## Dependencies

To communicate with Tezos, this SDK is using and includes modified versions of the following libraries:

[**Airgap Beacon SDK**](https://www.walletbeacon.io/)

This SDK is used to interact with Tezos wallets through the Beacon standard, for the iOS, Android and WebGL platforms.


[**Netezos**](https://netezos.dev/)

This SDK is used to interact with Tezos wallets through the Beacon standard, for the Windows, Linux and MacOs platforms.

It is also used to prepare parameters for calls to smart contracts or interpret complex data returned by the ReadView method.

## Supported platforms

This SDK works on the following platforms: Windows, Linux, MacOs, iOS, Android, WebGL.
