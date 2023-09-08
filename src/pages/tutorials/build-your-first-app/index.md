---
id: build-your-first-app
title: Build your first app on Tezos
authors: Claude Barde
lastUpdated: 10th July 2023
---

This tutorial shows you how to create a decentralized web application on Tezos that swaps one token for another.
Specifically, this application will be the user-facing web front end for a distributed exchange (DEX) smart contract that performs operations such as swapping tokens.

You will learn:

- How to create a web application and import TypeScript libraries that access Tezos
- How to connect to a user's wallet
- How to send a transaction to a smart contract on behalf of a user

## Prerequisites

This tutorial uses [TypeScript](https://www.typescriptlang.org/), so it will be easier if you are familiar with TypeScript.

You do not need any familiarity with any of the libraries in the tutorial, including [Taquito](https://tezostaquito.io/), a TypeScript library that helps developers access Tezos.

## The Liquidity Baking contract

This tutorial uses a special contract on Tezos called the *Liquidity Baking* (LB) contract.
The LB contract is a decentralized exchange (or DEX) that handles only 3 tokens:

- **XTZ**, the native token of Tezos
- **tzBTC**, a wrapped token that represents Bitcoin on Tezos
- **SIRS**, short for _Sirius_, a token that represents an equal amount of XTZ and tzBTC tokens

Like a physical currency exchange at an airport or train station, the LB contract maintains a *liquidity pool* of the tokens that it exchanges.
Users can deposit XTZ and receive tzBTC from the pool or vice versa.

Tezos automatically deposits XTZ into the contract, but users must provide the tzBTC for the liquidity pool.
Any user can deposit an equal amount of XTZ and tzBTC tokens to the pool, which is called "adding liquidity."
Then, the LB contract provides SIRS tokens as proof of that deposit.
Later, users can return the SIRS and withdraw their XTZ and tzBTC with interest.

## The tutorial application

In this tutorial, you build a web application that allows users to swap tokens via the LB contract and to add and withdraw tokens from its liquidity pool.
The token swap portion of the application looks like this:

![Swap UI](/images/build-your-first-app/swap-ui.png "Swap UI")

The application can perform many individual actions, including:

- Connecting and disconnecting users' wallets
- Displaying users' information, including their XTZ, tzBTC, and SIRS balance
- Displaying different interfaces to swap tokens and add and remove liquidity
- Allowing users to swap XTZ for tzBTC and tzBTC for XTZ
- Allowing users to add liquidity by providing XTZ and tzBTC and receiving SIRS
- Allowing users to remove liquidity by providing SIRS and receiving XTZ and tzBTC

The application is based on JavaScript/TypeScript, so it uses several JS and TS-based tools to build and package the application:

- **[Svelte](https://svelte.dev/)** for the JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** to make the JavaScript code safer and more expressive
- **[Sass](https://sass-lang.com/)** as a CSS preprocessor
- **[Vite](https://vitejs.dev/)** (pronounced like _veet_) to bundle the application and provide the libraries to the user's browser

Also, to access the user's wallet and run transactions on Tezos, the application uses these libraries:

- **[Taquito](https://tezostaquito.io/)** to interact with the Tezos blockchain
- **[Beacon](https://docs.walletbeacon.io/)** to access users' wallets

You can see the completed tutorial application here: https://github.com/claudebarde/tezos-dev-portal-tutorial

When you're ready, move to the next section to begin setting up the application.
