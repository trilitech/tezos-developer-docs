---
title: Getting information about the blockchain
authors: Tim McMackin
last_update:
  date: 8 February 2024
---

Developers and dApps can get information about the Tezos blockchain, such as account balances, from these sources:

## The Octez client

The [The Octez client](/developing/octez-client) provides information about accounts, addresses, and many other things.
For example, you can get the balance of an account with this command:

```bash
octez-client get balance for tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx
```

## The RPC interface

The [RPC interface](/architecture/nodes#the-rpc-interface) provides information about the blockchain that nodes use to communicate with each other.
This data is not always in the format that developers and dApps need.
For example, the RPC interface does not provide a way to get information about a specific operation by its hash.

You can get some information about accounts, contracts, and other things from RPC requests.
For example, this RPC request gets the current balance of an account:

```bash
curl -X GET https://rpc.ghostnet.teztnets.com/chains/main/blocks/head/context/contracts/tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx/balance
```

## Indexers

Indexers are off-chain applications that retrieve blockchain data, process it, and store it in a way that makes it easier to search and use.
For example, you can use the [TZKT API](https://api.tzkt.io/) to get the recent operations an account made with this request:

```bash
curl -X GET https://api.ghostnet.tzkt.io/v1/accounts/tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx/operations
```

For more information, see [Indexers](/developing/information/indexers).

## Block explorers

Block explorers use data from indexers to show information in a human-friendly interface.
For example, this link shows information about a contract, including its current storage, entrypoints, and transaction history: https://better-call.dev/ghostnet/KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu/operations

For more information about block explorers, see [Block explorers](/developing/information/block-explorers).
