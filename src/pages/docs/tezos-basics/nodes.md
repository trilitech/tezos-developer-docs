---
id: nodes
title: Nodes
authors: Damien ZONDA
---

A blockchain is a peer-to-peer network in which every peer is a node ensuring a set of diverse functions within the distributed software. In this chapter, we will explore the notion of nodes in Tezos, focusing on their role as well as their features and limitations.

## What is a node ?


A node is a machine that stores a copy of the current state of the blockchain and updates it with the information it receives from other nodes (also known as peers). Therefore, a node is connected in a peer-to-peer way to plenty of other ones.

A node systematically communicates the information it receives to nodes it is connected to, in order to, later on, allow them to transmit this information to their own peers. This ensures that every node from the Tezos network stores the same information.

The particularity of public blockchains lies in the fact that anyone can launch a node. The chain is therefore expected to have a large number of nodes, thus reducing the risks associated with the potential failure of an important actor of the network.

Once launched, a node connects itself to other peers (an average of forty) in the network, establishing communication channels and thus allowing the interested parties to exchange information (blocks, operations, etc).

By mid-2020, the Tezos blockchain had more than 1,000 active nodes on the network. In mid-2022, it is [more than 4750 nodes](https://tzkt.io/network).

### Peer-to-peer network

The Tezos network implements a gossip protocol whose main operations are linked to:

- **A read / write scheduling mechanism** allowing to control the bandwidth.
- **An encrypted communication service** to establish a secure connection with other peers.
- **Black, gray, and whitelisting services** to establish or refuse connections requested by certain peers.

## Types of nodes

When launching a Tezos node, several conﬁgurations allow it to synchronize with other peers of the network. Each node type leads to synchronization, but the synchronization speed varies as well as the data availability.

Below are the 3 history modes of a node:

- **Archive mode**: a node in archive mode stores the entire blockchain state. A node launched on the Tezos blockchain in the archive mode will download the entire chain history since the launch of the network. As of early 2021, the entire blockchain takes about 145GB.
- **Full mode** (default mode): a node storing the entire blockchain, without storing the ‘context’ (the blockchain state containing information such as: "Alice's account owns 5") below a certain level called savepoint. It is possible to rebuild an Archive Node from a full snapshot¹.
- **Rolling Mode**: the lightest existing node mode, which stores a fragment of the chain, and removes anything before that fragment (blocks, operations, archived contexts).

It is possible to use a snapshot to speed up node synchronization. Snapshots can be used to initialize full and rolling nodes. It is also possible to switch between the different types of nodes, by respecting [switching rules](https://tezos.gitlab.io/user/history_modes.html?#switching-between-node-s-modes).

<small> [1]: A copy of the blockchain’s state at a given moment in time. </small>

### Node configuration

The different types of nodes previously introduced allow users to choose the most suitable one depending on the amount of information needed. An indexer (tool allowing to monitor blocks creation, transactions,...), for example, will most likely need an archive node, while a user who wants to experiment with basic nodes deployment may simply use a rolling version.

Launching a node in one of the different modes:

```bash
tezos−node run −−history−mode [archive|full|experimental-rolling]
```

Importing a full / rolling snapshot with the corresponding extension (.roll or .full):

```bash
tezos−node import snapshot path/to/snapshot
```

#### Getting snapshots

To get freshly exported snapshots of the Tezos mainnet and testnet, it is possible to rely on public node services:

- [Giganode](https://snapshots-tezos.giganode.io)
- [XTZ-Shots](https://xtz-shots.io/)

## Possible actions with a node

In a blockchain, a node acts as an interface between the user and the peer-to-peer network. The node has two main functions:

- **Information storage**: since a node keeps a real-time copy of the current state of the blockchain, it allows fetching information (by using the octez-client binary) about what is happening in real time. This function, for example, allows feeding indexers, which retrieve information from the nodes and process it to make it more humanly readable.
- **Information transmission**: user-initiated transactions go through the nodes before being included in the blockchain. Nodes are thus an entry point for operations intended to be validated by bakers.

Generally, these functions are complementary. For example, a user might often need to check the contents of the chain to verify that what he is sending is not immediately rejected by a node.

A baker will use a node and therefore both of the aforementioned aspects to operating. Indeed, it will have to read the pending operations provided by the node, then read the context in order to ensure that the operations are applicable before validating them and including them in a block that will be transmitted to the entire network.

## Communicating with a node

As seen in the previous paragraph, communicating with a node allows access to the peer-to-peer network.

Bakers automatically communicate with the nodes they are connected to, but it can be useful for a user to being able to interact directly with his own node, in case he would like to inquire the chain’s status or push operations by himself.

Direct communication with a node happens through the use of Remote Processing Calls (RPC).
It is also possible to use a dedicated user interfaces such as a client, indexer, or wallets. However, in practice, indexers are the most practical tools for a user to access on-chain information.

## Advantages offered by a node

For operational purposes, an entity might want to have control over its own Tezos nodes.

Such control helps to avoid dependency on a third party that could be failing. Firstly, this means independence from a unique node that could be prone to failure, and in addition, it helps to increase the chain resiliency and decentralization by contributing to the peer-to-peer network. The larger is the number of nodes, the more decentralized and robust a blockchain tends to be.

Owning a node means that one can manage his own transactions and ensure that they are broadcast to the entire network.

Becoming a baker on the Tezos blockchain usually involves controlling a node, while providing certain beneﬁts. Indeed, any baker in the network receives rewards in return for his work of validating blocks and securing the network. In particular, a baker can include its own transactions without paying any fees. Added to this, there is the attribution of voting rights relative to the amendments proposed by the chain participants.

## Possible node attacks

A blockchain node can suffer from different types of attacks inherent to all software that are based on a peer-to-peer network. It is usually recommended for a node to secure its communication channels and to store its private keys (if it has any) in a cold wallet ².

### Denial of service

The denial of service attack (or DoS) is a computer attack that makes a service unavailable.

In the case of a Tezos node, this would mean attacking a particular node by sending it very resource-intensive requests. It can make the attacked node unavailable because of a lack of resources required to respond to the said request.

The node must therefore make sure to limit access to these types of requests. As this is a very classical attack on the Internet, the usual preventions can apply to a node infrastructure.

### Sybil attack

This is an attack that consists in creating a large number of identities on the peer-to-peer network with the aim of isolating one or more nodes from the rest of the network and feeding them with wrong information.

In Tezos, this attack consists in generating a large number of nodes, in order to isolate one or more targeted nodes to which the attacker would communicate compromised information (erroneous blocks for example).

To prevent this kind of attack, the Tezos node algorithm allows changing peers regularly and automatically, in order to make sure that the attacker cannot maintain a long enough grip for the chain to be affected.

In addition, creating a node identity costs a certain amount of computing time³. Therefore, generating a node takes a few seconds, but generating enough nodes to split the network would take a long time, even with a powerful machine.

Finally, if attacks are observed on the network, it would be possible to increase the level of work required by peers and regenerate all identities to prevent the attack and to contain it completely if all peers do so.

<small>
[2]: Key storage technique which uses a hardware material not connected to the internet (examples: Ledger and Trezor products).<br />
</small>

<small>
[3]: To create an address, it must be given a certain level of ”work” ranging from 0 to 255. This level corresponds to the number of zeros in front of the hash of its identity. When creating an identity, the program generates different versions until it finds one with a sufficient level. One can then choose to refuse to connect to peers whose identity is lower than a certain value. By default, this value is set to 26.
</small>