---
title: Architecture
authors: Tim McMackin
last_update:
  date: 30 October 2024
---

The Tezos blockchain is composed of many Tezos nodes running around the world, complemented by other programs such as bakers and accusers.
These processes collaborate with the overall goal of maintaining the blockchain data in a decentralized manner.

The Tezos nodes are the most important piece in this architecture because they maintain the system and the blockchain data.
Users interact with nodes through many different clients, including command-line clients, wallets, and web applications.
For more information about nodes, see [Nodes](./architecture/nodes).

This diagram shows a high-level view of the Tezos system:

![A high-level view of the Tezos system, including Tezos nodes, the blockchain data itself, an Indexer, and a few examples of clients](/img/architecture/architecture-overview.png)
<!-- https://lucid.app/lucidchart/d778aa2a-ad0a-4324-b235-ed3b35742c58/edit -->

## Tezos networks

When people talk about Tezos, they usually mean the primary Tezos network, which is referred to as Mainnet.
Tezos also has other networks used for testing, referred to as testnets.
Anyone can create new test networks if needed.
For example, before new versions of the Tezos protocol are enabled, users create networks that use that protocol so they can test it.

## The blockchain data

Although people often use the word "blockchain" to mean the entire system, strictly speaking, a Tezos blockchain is a series of blocks of data, each connected to the previous block in the chain, beginning with the genesis block.
The blockchain data is maintained by a network of Tezos nodes.
Nodes reach consensus on the next block before adding it to the chain.

As shown in the diagram, the data inside a Tezos block includes the hash of the previous block in the chain and many operations, such as transactions that transfer tez or call smart contracts.
Blocks also include operations that are necessary for the management of the chain, including nodes' attestations that blocks are valid, called _consensus operations_, and votes on changes to the protocol, called _voting operations_.
For more information on the operations that can be included in blocks, see [Blocks and operations](https://tezos.gitlab.io/alpha/blocks_ops.html) in the Octez documentation.

## Tezos clients and servers

In addition to the functions of the [protocol and shell](./architecture/nodes#protocol-and-shell), a Tezos node also acts as a server to respond to queries and requests from clients.
A client can query the chain’s state and can inject blocks and operations into a node.
Nodes share operations with each other, so the node that includes an operation in a block may not be the node that the client originally sent the operation to.

Tezos uses this client-server architecture for these main reasons:

- It improves security by separating the node, which is exposed to the internet, from the baker, which has access to the client keys.
The node and the baker can be on different computers, which allows the node to manage communication and shields bakers from network attacks.
- It allows bakers to have different implementations.
For example, different bakers may implement different transaction selection strategies.
- It allows clients and other tools to interact with the node and inspect its state.

The node accepts calls from clients through its RPC interface.
It has control over which clients to accept calls from, which calls to accept, or whether to accept RPC calls at all.

Anyone can run a node and select which clients to run and which requests to accept from clients.
Some typical use cases for nodes are:

- A node running by itself, which maintains a copy of the blockchain data and enhances the distribution of the network without actively baking blocks.
Optionally, this node can open its RPC interface to serve different kinds of requests.
- A node along with a baker, an accuser, and a signer can be used to bake new blocks, activity which ensures that the blockchain progresses and yields rewards in tokens.

Here is a summary of the main Tezos clients:

- **Bakers**: The baker is an Octez program that is responsible for creating and proposing new blocks based on the operations proposed by different clients.
For more information, see [Bakers](./architecture/bakers).

- **Accusers**: The accuser is an Octez program that monitors new blocks and looks for problems, such as when bakers try to add more than one block at a time.
When it finds a problem, it submits a denunciation to other nodes to refuse the new blocks and punish the offending node.
For more information, see [Accusers](./architecture/accusers).

- **The Octez client**: The Octez client is a command-line tool that developers can use for many Tezos-related tasks, including:

  - Deploying, calling, testing, and interacting with contracts
  - Deploying and interacting with Smart Rollups
  - Working with accounts
  - Calling RPC endpoints directly
  - Running Sapling transactions
  - Setting up baking operations for testing contracts

  For more information about the Octez client, see [The Octez client](./developing/octez-client).

- **External clients**: Many external clients can add operations to the network of nodes or use nodes to inspect the state of the blockchain, including:

  - Web applications that use SDKs such as Taquito to send and receive information from Tezos
  - Wallet applications

- **Indexers and block explorers**: Indexers are off-chain applications that retrieve blockchain data, process it, and store it in a way that makes it easier to search and use.
They are an important part of block explorers, which are applications that provide data about the blockchain.

## References

For more information about the architecture of Tezos, see:

- [Accounts and addresses](/architecture/accounts)
- [Tokens](/architecture/tokens)
- [Smart Optimistic Rollups](/architecture/smart-rollups)
- [Governance](/architecture/governance)
- [Indexers](/developing/information/indexers)
- [Block explorers](/developing/information/block-explorers)
