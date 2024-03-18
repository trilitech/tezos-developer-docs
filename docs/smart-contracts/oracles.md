---
title: Oracles
authors: 'Tim McMackin'
last_update:
  date: 9 February 2024
---

Oracles provide data to smart contracts that they wouldn't be able to access otherwise.
Because smart contracts can't access data from outside the blockchain, including calling external APIs, you can use oracles to provide the data.

At a basic level, oracles have two parts:

- The off-chain part provides external data to the on-chain part via ordinary smart contract transactions
- The on-chain part stores the data on the chain and provides it to consumer smart contracts

How the oracle works is up to the designer.
Generally speaking, oracles allow smart contracts to call them for information and charge a fee or subscription in exchange.

An example of an oracle is [Harbinger](https://github.com/tacoinfra/harbinger), which provides information about currency exchange rates.

## Trusting oracles

The difficult part of setting up oracles is ensuring that the data they provide is accurate and authoritative so it can be trusted.
For example, oracles can average multiple sources of data like currency prices to prevent manipulation of the data and ensure that it does not rely on a single source.
They can use encryption to sign data and prove that it it authoritative.
For ways to set up oracles to be trustable, see [Using and trusting oracles](https://opentezos.com/smart-contracts/oracles) on opentezos.com.
