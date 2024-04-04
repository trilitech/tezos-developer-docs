---
title: Nodes
authors: Tim McMackin
last_update:
  date: 4 April 2024
---

A Tezos node has three main roles:

- It validates blocks and operations
- It broadcasts blocks and operations to other nodes and receives them from other nodes over a peer-to-peer network
- It maintains a copy of the blockchain data and its associated state (also known as the ledger), which includes accounts and their balances, among other things

Beside these technical roles, nodes must satisfy two other important requirements:

- Support the governance of the blockchain
- Ensure the extensibility of the blockchain with new clients of different kinds.

In order to meet these requirements, the software that nodes run is structured according to two major principles:

- It is separated into a [shell and a protocol](shell-and-protocol), to support protocol evolution.
- It implements a client/server architecture, to allow composition with many other tools in a safe way.

The Octez suite, which is an implementation of the Tezos node and other executables, instantiates these principles in the [Octez software architecture](https://tezos.gitlab.io/shell/the_big_picture.html).
