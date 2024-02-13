---
title: Decentralized applications (dApps)
authors: Benjamin Pilia, Tim McMackin
last_update:
  date: 30 January 2024
---

One of the main features of blockchains is _decentralization_: each transaction is verified by multiple nodes and its validation process does not rely on a single trusted third party.
Decentralized applications (dApps or Dapps) take advantage of these features to create applications that are independent, transparent, and trustless.

In general, dApps have these parts:

- **Frontend**: An off-chain component that can act as a user interface to simplify interaction with the on-chain component, run off-chain processing, and get information from sources that are not available to the on-chain component
- **Middleware**: Optionally, an [indexer](./developing/information/indexers) to interpret the backend information and provide it in a more convenient format for the front-end component
- **Backend**: An on-chain component that consists of one or more [smart contracts](./smart-contracts)

The off-chain component can be nearly any kind of program, including a web application, mobile or desktop app, or command-line interface.
It relies on wallets and tools to interact with the smart contracts on behalf of a user's Tezos account.

![Fundamental diagram of dApps, showing the frontend, indexer, and backend](/img/dApps/dapp-overview.png)
<!-- Source https://lucid.app/lucidchart/8caf9ef1-11e4-454a-bbb6-ef4852515959/edit?page=0_0# -->

Some of these tools that allow an off-chain component to interact with smart contracts include:

- [Taquito](./dApps/taquito), an SDK for JavaScript/TypeScript applications
- The [Tezos SDK for Unity](./unity), a toolkit for the [Unity](https://unity.com/) game development platform
- [Taqueria](https://taqueria.io/), a development platform for dApps

The next pages in this section illustrate dApps with [examples](./dApps/samples), detail the main steps when developing dApps such as [Connecting to wallets](./dApps/wallets) and [Sending transactions](./dApps/sending-transactions), and introduce some [best practices](./dApps/best-practices)

## Tutorials

These tutorials cover dApps of different complexities:

- For a simple dApp, see [Build a simple web application](./tutorials/build-your-first-app)
- For a dApp that mints NFTs, see [Mint NFTs from a web app](./tutorials/create-an-nft/nft-web-app)
- For a large dApp that allows users to buy and sell NFTs, see [Build an NFT marketplace](./tutorials/build-an-nft-marketplace)
