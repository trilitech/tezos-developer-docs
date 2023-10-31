---
title: Mint NFTs from a Web app
authors: 'Yuxin'
lastUpdated: 19th October 2023
---

This tutorial shows you how to create a web application that interacts with the Tezos blockchain to mint non-fungible tokens (NFTs). NFTs are unique digital assets that can represent art, collectibles, or virtually any kind of digital content on the blockchain. Specifically, this application will be the user-facing web front end for a smart contract that performs operations such as mint.

You will learn:

- How to create a web application and import JavaScript libraries that access Tezos blockchain
- How to call a smart contract from a web application
- How to connect to a user's wallet
- How to mint NFTs on behalf of a user

## Prerequisites

This tutorial uses [Javascript](https://www.javascript.com/), so it will be easier if you are familiar with JavaScript.

- You do not need any familiarity with any of the libraries in the tutorial, including [Taquito](https://tezostaquito.io/), a JavaScript library that helps developers access Tezos.

Before start creating this dApp, we will need a [wallet](../../dApps/wallets) and some ghostnet tez(ꜩ).

## The smart contract

The backbone of this application is the smart contract deployed on the Tezos blockchain. The contract we'll be using is already deployed and is written in [SmartPy](../../smart-contracts/languages/smartpy). It defines the rules and processes for interactions with the Tezos blockchain, such as minting NFTs. All you need to do is integrate it into your web app.


## The tutorial application

In this tutorial, you build a web application that allows users to mint NFTs via the smart contract.
The interface of the application will look like this:

![Mint UI](/img/tutorials/mint-ui.png "Mint UI")

The application can perform many individual actions, including:

- Connecting and disconnecting users' wallets
- Displaying users' information, including their wallet address and tez balance
- Allowing users to mint NFTs on the Tezos blockchain


The application is based on JavaScript, so it uses several JS and TS-based tools to build and package the application:

- **[Svelte](https://svelte.dev/)** for the JavaScript framework
- **[JavaScript](https://www.javascript.com/)** to make the JavaScript code safer and more expressive
- **[Vite](https://vitejs.dev/)** (pronounced like _veet_) to bundle the application and provide the libraries to the user's browser

Also, to access the user's wallet and run transactions on Tezos, the application uses these libraries:

- **[Taquito](https://tezostaquito.io/)** to interact with the Tezos blockchain
- **[Beacon](https://docs.walletbeacon.io/)** to access users' wallets

You can see the completed tutorial application here: https://github.com/trilitech/tutorial-applications/simple-nft-svelte

When you're ready, move to the next section to begin setting up the application.
