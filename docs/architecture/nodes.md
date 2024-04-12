---
title: Nodes
authors: Tim McMackin
last_update:
  date: 12 April 2024
---

A Tezos node has three main roles:

- It validates blocks and operations
- It broadcasts blocks and operations to other nodes and receives them from other nodes over a peer-to-peer network
- It maintains a copy of the blockchain data and its associated state (also known as the ledger), which includes accounts and their balances, among other things

Beside these technical roles, nodes must satisfy two other important requirements:

- Support the governance of the blockchain
- Ensure the extensibility of the blockchain with new clients of different kinds

In order to meet these requirements, the software that nodes run is structured according to two major principles:

- It is separated into a protocol and a shell to make it easier to upgrade.
- It implements a client/server architecture, to allow composition with many other tools in a safe way.

Nodes communicate with clients and with each other through a peer-ro-peer [RPC interface](#the-rpc-interface).

The Octez suite, which is an implementation of the Tezos node and other executables, instantiates these principles in the [Octez software architecture](https://tezos.gitlab.io/shell/the_big_picture.html).

## Protocol and shell

The software that runs Tezos nodes is split into two main parts:

- The protocol, which interprets transactions and other operations in each block (also known as the _economic protocol_)
- The shell, which handles low-level functions like data storage and peer-to-peer network communication

The relationship between the shell and the protocol is like the relationship between an operating system and an application.
The operating system stays stable while the application can update itself.
In this way, Tezos can update how it works (its protocol) without requiring nodes to accept major changes to the software that they run (the shell).
For example, nodes can update to a new protocol version without restarting the shell.

### The protocol

The Tezos protocol is responsible for interpreting the operations in each block.
It also provides the logic that identifies erroneous blocks.

Unlike many other blockchains, Tezos is self-amending.
Its nodes can update the protocol that controls the possible operations and how they are processed; updates are performed via an online governance process.
These updates allow Tezos to adapt to new technologies and respond to user needs.
For example, protocol upgrades have added new features like Smart Rollups and have reduced the amount of time between blocks.

Users propose updates to the protocol through a voting process, using dedicated voting operations such as protocol proposals and protocol upvotes.
For information about the voting process, see [Governance](governance).

### The shell

The shell is responsible for the fundamental functions of a distributed software application, including:

- Peer-to-peer communication that lets nodes exchange information
- Storage functionality that lets nodes store blocks, operations, and the current state of the chain
- A synchronization heuristic that starts nodes and keeps them in sync with the network
- A validator that checks that blocks are valid with help from the rules in the economic protocol

In particular, the validator is responsible for resolving the available blocks into a single linear sequence of blocks.
It chooses between the various blocks that baking nodes create, uses the protocol to verify and score them, and selects the tree head with the highest score.
Then it uses that linear chain in all of its work with the protocol, so the protocol is never aware of multiple branches.

## The RPC interface

The Tezos RPC (Remote Procedure Call) interface is a specification for a REST API that clients use to interact with Tezos nodes and nodes use to communicate with each other.

You may want to know this RPC interface if you are developing tools that need to query the Tezos blockchain or to interact with it, such as wallets, indexers, or Web3 libraries.

Clients use this interface to submit transactions and get information about the state of the blockchain, such as account balances and contract storage.
Tezos nodes act as servers and accept HTTP requests from clients and other nodes via this interface.

Tezos RPC uses JSON to send and receive data, but it does not adhere to the JSON-RPC specification.

All the RPCs served by the Tezos node are described as an OpenAPI specification at [Octez Node RPCs](https://tezos.gitlab.io/api/openapi.html#octez-node) in the Octez documentation.

### Public and private RPC nodes

All Tezos nodes run RPC servers, but the RPC interface is subject to an access policy.
By default, RPC servers are private and do not accept all requests from every client.

When you work with a Tezos client, such as the Octez command-line client or the Taquito SDK, you select a public RPC node to send transactions to, or you can use a private RPC node that you have access to.

If you're using a testnet, you can get a list of public RPC nodes for that network at https://teztnets.com.

Other sources of public nodes include:

- [Community RPC Nodes](https://tezostaquito.io/docs/rpc_nodes) listed by ECAD Labs.
- [SmartPy nodes](https://smartpy.io/nodes)
- [RPC nodes](https://tezostaquito.io/docs/rpc_nodes) in the Taquito documentation
