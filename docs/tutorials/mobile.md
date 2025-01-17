---
title: Create a mobile game
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 12 December 2023
dependencies:
  taqueria: 0.46.0
  ligo: 1.7.0
  vite: 5.0.8
  taquito: 17.4.0
---

![home](/img/tutorials/mobile-picHOME.png)

Web3 mobile gaming is a new era of decentralized, blockchain-based gaming that promises to revolutionize the industry. It combines gaming with the unique features of blockchain technology, such as secure and transparent transactions, digital asset ownership, and decentralized governance. In Web3 gaming, players can enjoy a wide range of gaming experiences and participate in the creation, management, and monetization of these games through the use of cryptocurrencies, non-fungible tokens (NFTs), and decentralized autonomous organizations (DAOs).

Web3 gaming is still in its early stages, but it has the potential to transform the gaming industry and create new opportunities for gamers and developers alike.
There are two categories of web3 gaming dapp:

- The ones including web3 parts like NFT or fungible tokens but represent generally less than 25% of the application
- The ones which are 100% onchain, like on this tutorial, where all the logic is coded inside the smart contract

You will learn:

- How to import a Ligo smart contract library containing the game logic.
- How to create a mobile app with Ionic.
- How to integrate the taquito library to connect a wallet.
- How to develop the UI and interact with your smart contract.
- How to build and deploy your game to the Android store.

## Prerequisites

This tutorial uses TypeScript, so it will be easier if you are familiar with JavaScript.

1. Make sure that you have installed these tools:

   - [Node.JS and NPM](https://nodejs.org/en/download/): NPM is required to install the web application's dependencies. (currently using v18.15.0 on the solution)
   - [Taqueria](https://taqueria.io/), version 0.46.0 or later: Taqueria is a platform that makes it easier to develop and test dApps.
   - [Docker](https://docs.docker.com/engine/install/): Docker is required to run Taqueria.
   - [jq](https://stedolan.github.io/jq/download/): Some commands use the `jq` program to extract JSON data.
   - [`yarn`](https://yarnpkg.com/): The frontend application uses yarn to build and run (see this article for details about [differences between `npm` and `yarn`](https://www.geeksforgeeks.org/difference-between-npm-and-yarn/)).
   - Any Tezos-compatible wallet that supports Ghostnet, such as [Temple wallet](https://templewallet.com/).

2. Optionally, you can install [`VS Code`](https://code.visualstudio.com/download) to edit your application code in and the [LIGO VS Code extension](https://marketplace.visualstudio.com/items?itemName=ligolang-publish.ligo-vscode) for LIGO editing features such as code highlighting and completion.
   Taqueria also provides a [Taqueria VS Code extension](https://marketplace.visualstudio.com/items?itemName=ecadlabs.taqueria-vscode) that helps visualize your project and run tasks.

## The tutorial game

Shifumi or Rock paper scissors (also known by other orderings of the three items, with "rock" sometimes being called "stone," or as Rochambeau, roshambo, or ro-sham-bo) is a hand game originating from China, usually played between two people, in which each player simultaneously forms one of three shapes with an outstretched hand.

These shapes are "rock" (a closed fist), "paper" (a flat hand), and "scissors" (a fist with the index finger and middle finger extended, forming a V). "Scissors" is identical to the two-fingered V sign (also indicating "victory" or "peace") except that it is pointed horizontally instead of being held upright in the air.

[Wikipedia link](https://en.wikipedia.org/wiki/Rock_paper_scissors)

The application can be downloaded on [the Android store here](https://play.google.com/store/apps/details?id=dev.marigold.shifumi)

The code for the completed application is in this GitHub repository: [solution](https://github.com/marigold-dev/training-dapp-shifumi/tree/main/solution)

When you're ready, move to the next section [Part 1: Create the smart contract](/tutorials/mobile/part-1) to begin setting up the application.
