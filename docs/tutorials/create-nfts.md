---
title: Create NFTs from a web application
authors: Tim McMackin
last_update:
  date: 7 January 2024
dependencies:
  smartpy: 0.20.0
  taquito: 20.1.2
  svelte: 5.14.4
  vite: 6.0.3
---

This tutorial shows you how to create a web application that interacts with the Tezos blockchain to create (mint) non-fungible tokens (NFTs).
NFTs are unique digital assets that can represent art, collectibles, or virtually any kind of digital content on the blockchain.
Specifically, this application includes a user-facing front end web application and a Tezos smart contract that acts as the backend and manages data about the tokens.

No prior knowledge of NFTs or Tezos is required, but because the tutorial application uses JavaScript, some familiarity with JavaScript makes it easier to understand.

## Learning objectives

In this tutorial, you will learn:

- How to use the [Taquito](https://tezostaquito.io/) JavaScript/TypeScript SDK to access Tezos and user wallets and to send transactions to Tezos
- How to connect to wallets and accounts
- What smart contracts are and how to call them from a web application
- How to mint NFTs on behalf of a user
- How to deploy your own smart contract to manage NFTs
- How to get information about NFTs and their owners from Tezos

## What is a non-fungible token (NFT)?

An NFT is a special type of blockchain token that represents something unique.
Fungible tokens such as XTZ and real-world currencies like dollars and euros are interchangeable; each one is the same as every other.
By contrast, each NFT is unique and not interchangeable.
NFTs can represent ownership over digital or physical assets like virtual collectibles or unique artwork, or anything that you want them to represent.

Like other types of Tezos tokens, a collection of NFTs is managed by a smart contract.
The smart contract defines what information is in each token and how the tokens behave, such as what happens when a user transfers an NFT to another user.
It also keeps a ledger that records which account owns each NFT.

In this tutorial, you create NFTs that comply with the FA2 standard (formally known as the [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard), the current standard for tokens on Tezos.
The FA2 standard creates a framework for how tokens behave on Tezos, including fungible, non-fungible, and other types of tokens.
It provides a standard API to transfer tokens, check token balances, manage operators (addresses that are permitted to transfer tokens on behalf of the token owner), and manage token metadata.

## Tutorial application

The application that you set up in this tutorial has two parts:

- The **smart contract** runs on the Tezos blockchain to manage the NFTs, including creating, transferring, and destroying them
- The **frontend application** runs on a web server and allows the user to connect their wallet, send a request to the smart contract to create an NFT, and to see information about the NFTs that they own

The front end of the application shows buttons that users can click to connect and to mint NFTs:

<img src="/img/tutorials/create-nfts-show-info-ids.png" alt="The application showing the IDs of the owned NFTs" style={{width: 500}} />

The source code of the completed application is available here: https://github.com/trilitech/tutorial-applications/tree/main/create-nfts.

## Prerequisites

To run this tutorial you need Node.JS and NPM installed.
See https://nodejs.org/.
You can verify that they are installed by running these commands:

   ```bash
   node --version
   npm --version
   ```

## Tutorial sections

- [Part 1: Setting up the application](/tutorials/create-nfts/setting-up-app)
- [Part 2: Connecting to wallets](/tutorials/create-nfts/connect-wallet)
- [Part 3: Sending transactions](/tutorials/create-nfts/send-transactions)
- [Part 4: Creating the contract](/tutorials/create-nfts/create-contract)
- [Part 5: Showing token information](/tutorials/create-nfts/show-info)
- [Summary](/tutorials/create-nfts/summary)
