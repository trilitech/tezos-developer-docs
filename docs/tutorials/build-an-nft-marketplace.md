---
title: Build an NFT marketplace
authors: 'Benjamin Fuentes (Marigold)'
lastUpdated: 8nd November 2023
---

This tutorial guides you through creating a web application that allows users to buy and sell tokens of different types.
You will use the Taqueria platform to manage smart contracts and a distributed web application (dApp) to handle the backend and frontend of the project.

You will learn:

- What kinds of tokens Tezos supports
- What token standards are
- How to create contracts that are based on existing templates for token standards
- How to store token metadata in distributed storage with IPFS
- How to handle token transfers and other operations
- How to list tokens for sale and accept payments from buyers

## Prerequisites

1. Optional: If you haven't worked with Tezos NFTs before, consider doing the tutorial [Create an NFT](./create-an-nft) first.

1. Set up an account with Pinata if you don't have one already and get an API key and API secret.
   For instructions, see the [Configure IPFS storage](./create-an-nft/nft-taquito#configure-ipfs-storage) section of the tutorial [Create a contract and web app that mints NFTs](./create-an-nft/nft-taquito).

1. Make sure that you have installed these tools:

   - [Node.JS and NPM](https://nodejs.org/en/download/): NPM is required to install the web application's dependencies
   - [Taqueria](https://taqueria.io/), version 0.43.0 or later: Taqueria is a platform that makes it easier to develop and test dApps
   - [Docker](https://docs.docker.com/engine/install/): Docker is required to run Taqueria
   - [jq](https://stedolan.github.io/jq/download/): Some commands use the `jq` program to extract JSON data
   - [`yarn`](https://yarnpkg.com/): The frontend application uses yarn to build and run (see this article for details about [differences between `npm` and `yarn`](https://www.geeksforgeeks.org/difference-between-npm-and-yarn/))
   - Any Tezos-compatible wallet that supports Ghostnet, such as [Temple wallet](https://templewallet.com/)

1. Optionally, you can install [`VS Code`](https://code.visualstudio.com/download) to edit your application code in and the [LIGO VS Code extension](https://marketplace.visualstudio.com/items?itemName=ligolang-publish.ligo-vscode) for LIGO editing features such as code highlighting and completion.
   Taqueria also provides a [Taqueria VS Code extension](https://marketplace.visualstudio.com/items?itemName=ecadlabs.taqueria-vscode) that helps visualize your project and run tasks.

1. Optional: If this is your first time using Taqueria, you may want to run through [this Taqueria training](https://github.com/marigold-dev/training-dapp-1#ghostnet-testnet-wallet).

## What are FA2 tokens?

If you've gone through the tutorials under [Create an NFT](./create-an-nft) you know that NFTs are blockchain tokens that represent unique assets, usually created under the FA2 token standard.
However, the Tezos FA2 token standard allows you to create multiple types of tokens, and even more than one kind of token within the same smart contract.
When you create tokens, it's important to follow one of the token standards because then tools like wallets and block explorers can automatically work with those tokens.
For more information about Tezos token standards, see [Token standards](../developing/token-standards).

In this tutorial, you use the LIGO template for FA2 tokens to create these types of tokens:

| Token template | Number of token types | Number of tokens of each type |
| -------------- | --------------------- | ----------------------------- |
| NFT            | Any number            | 1                             |
| Single-asset   | 1                     | Any number                    |
| Multi-asset    | Any number            | Any number                    |

When you create your own applications, you can choose the token type that is appropriate for your use case.

## What is IPFS?

In most cases, developers don't store token metadata such as image files directly on Tezos.
Instead, they configure decentralized storage for the NFT data and put only the link to that data on Tezos itself.

The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system.
IPFS uses content-addressable storage to uniquely identify each file in a global namespace connecting all computing devices.
In this tutorial, you use [Pinata](https://www.pinata.cloud/)'s free developer plan to store your NFT metadata on IPFS and reference it on Tezos, demonstrating a scalable and cost-effective solution for handling NFT data.

## Tutorial application

This tutorial was originally created by [Marigold](https://www.marigold.dev/), which hosts versions of the tutorial application after each part of the tutorial:

- [Part 1](https://github.com/marigold-dev/training-nft-1)
- [Part 2](https://github.com/marigold-dev/training-nft-2)
- [Part 3](https://github.com/marigold-dev/training-nft-3)
- [Part 4](https://github.com/marigold-dev/training-nft-4)

The completed application at the end of the tutorial is a marketplace where administrator users can list wine bottles for sale by entering information about them and uploading a photo.
The application creates tokens based on this information and the site allows other users to buy the tokens that represent wine bottles.

You can see a running version of this application here: https://demo.winefactory.marigold.dev.

![The complete application, showing wine bottles for sale](/img/tutorials/nftfactory.png)

This application is made up of a smart contract that handles the tokens and a frontend web application that handles the user interface and sends transactions to the backend.
As you work through the tutorial, you will use different smart contracts and upgrade the web application to work with them.

When you're ready, go to [Part 1: Minting tokens](./build-an-nft-marketplace/part-1) to begin.
