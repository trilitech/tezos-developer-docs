---
id: introduction
title: Introduction
authors: Damien ZONDA
---

The first step to creating a Dapp is to deploy a smart contract on the Tezos network, whether for testing or real-life use. There are several ways to do this, such as using the Tezos CLI.

However, during development, the smart contracts and the associated storage are likely to change: new field, field removal, structure change. For each change, a new deployment must be done.

Thus, the way that the contract is deployed will change accordingly, especially the initial storage. A minimal change in the storage definition can make the next deployments tiresome when using the Tezos CLI, especially if changes are made several times.

In this sub-module, we will show how to deploy a smart-contract using different tools :

1. Taquito : a TypeScript library suite for development on the Tezos blockchain
2. Truffle : a development environment, testing framework and asset pipeline for blockchains (not recommended)
3. Chinstrap : Chinstrap makes developers' lives easier by providing support for multiple contract compilations, tests, and origination on public and private Tezos networks.

