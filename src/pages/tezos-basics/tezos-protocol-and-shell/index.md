---
id: tezos-protocol-and-shell
title: Tezos Protocol and Shell
lastUpdated: 29th June 2023
---

The primary characteristic that makes Tezos unique is its self-amending property. The part that amends itself is called the economic protocol. The rest of the Tezos node is what we call the shell.

## Tezos' Self-Amending Protocol

The protocol is responsible for interpreting the transactions and other administrative operations. It also has the responsibility to detect erroneous blocks.

An important thing to notice is that the protocol always sees only one blockchain, that is, a linear sequence of blocks since the genesis. It does not know that it lives in an open network where nodes can propose alternative heads.

Only the shell knows about the multiple heads. It is responsible for choosing between the various chain proposals that come from the bakers (the programs that create new blocks) of the network. The shell has the responsibility of selecting and downloading alternative chains, feeding them to the protocol, which in turn has the responsibility to check them for errors and give them an absolute score. The shell then simply selects the valid head of the highest absolute score. This part of the shell is called the validator.

The rest of the shell includes the peer-to-peer layer, the disk storage of blocks, the operations to allow the node to transmit the chain data to new nodes, and the versioned state of the ledger. In-between the validator, the peer-to-peer layer, and the storage sits a component called the distributed database, that abstracts the fetching and replication of new chain data to the validator.

Protocols are compiled using a tweaked OCaml compiler that does two things. First, it checks that the protocol’s main module has the right type. A good analogy is to see protocol as plug-ins, and in this case, it means that it respects the common plugin interface. Then, it restricts the typing environment of the protocol’s code so that it only calls authorized modules and functions. Seeing protocols as plug-ins, it means that the code only called primitives from the plug-in API. It is a form of statically enforced sandboxing.

Note that the economic protocol on the chain is subject to an amendment procedure. On-chain operations can be used to switch from one protocol to another. 

Finally, the RPC layer is an important part of the node. It is how the client, third-party applications, and daemons can interact with the node and introspect its state. This component uses the mainstream JSON format and HTTP protocol. It uses the library resto. It is fully interoperable, and auto-descriptive, using JSON schema.

A Tezos node has mainly three roles: it validates blocks and operations, it broadcasts them to (and retrieves them from) other nodes, and it maintains a main chain and its associated state (i.e. the ledger), which
includes accounts and their balances, among other things. Note that, as blocks only specify a predecessor block, exchanged blocks do not necessarily form a chain, but rather a tree.

A Tezos node acts as a server, which responds to queries and requests from clients. Such queries and requests are implemented via RPC calls. A client can query the chain's state and can inject blocks and operations into a
node. One particular client is the `baker daemon`, which is associated to an account. In particular, the baker has access to the account's private key and thus can sign blocks and operations.

The main reason for using such a client-server architecture is safety: to insulate the component that has access to the client keys, i.e. the baker, from the component which is exposed to the internet, i.e. the
node. Indeed, the node and the baker can sit on different computers and the baker does not need to be exposed to the internet. So nodes manage communication and shield bakers from network attacks, and bakers hold
secrets and bake blocks into the blockchain.

Another advantage of this architecture is that bakers can more easily have different implementations, and this is important, for instance because different bakers may want to implement different transaction
selection strategies.

As previously stated, Tezos is a self-amending blockchain. In large part of Tezos can be changed through a so-called amendment procedure.

-   the shell, which comprises the network and storage layer, and embeds
-   the economic protocol component, which is the part that can be
    changed through amendment.

## The function of the economic protocol

The economic protocol provides the rules for checking the validity of the blocks and operations, and for updating the blockchain state accordingly, by applying new valid blocks and operations on the current blockchain state. It defines under which conditions a block is a valid extension of the current blockchain, and defines an ordering on blocks to arbitrate between concurrent extensions.

The rules it uses for recognizing and applying valid blocks can be changed through voting. Thus, the economic protocol represents the amendable part of Tezos. To learn about the voting and amendment process see [Tezos Agora's overview](https://www.tezosagora.org/learn) of Tezos Governance. 

Each Tezos protocol is named after a (usually ancient) city, with the first one named Athens. Each successive name follows the previous alphabetically, continuing to Babylon, Carthage, Delphi, and so on. At the time of writing this article, the network is on the Mumbai protocol, with Nairobi planned for June 2023. There is a protocol upgrade roughly every 3 months. 

## Shell-protocol interaction 

The economic protocol and the shell interact in order to ensure that the blocks being appended to the blockchain are valid. The shell does not accept a branch whose fork point is some number of cycles in the past--anything before is deemed immutable. Also, when receiving a new block the shell determines if the block is valid and its fitness is higher than the current head. 

The protocol provides support for validating blocks which can be modulated by different "validation modes".


## The Shell 

The shell contains everything that is not part of the economic protocol. It includes: 

- The Validator: the component responsible for checking that blocks coming from the network or a baker are valid, w.r.t. the rules defined by the economic protocol.
- The Prevalidator: responsible for determining which operations to propagate for this chain over the peer-to-peer network.
- The Storage Layer: responsible for aggregating blocks (along with their respective ledger state) and operations within blocks (along with their associated metadata).
- Synchronization heuristic: Process to bootstrap a node when first joining the network, and knowing when it's synced with the network. 
- The peer-to-peer layer: this part is in charge of establishing and maintaining network connections with other nodes (via a gossip protocol).
- Protocol Environment: a restricted API that may be used by the Octez code to interact with the protocol, and vice versa.


{% callout type="note" %}
In-depth documentation on the [shell](https://tezos.gitlab.io/shell/the_big_picture.html) and [protocol](https://tezos.gitlab.io/active/protocol.html) and the semantics of [operations and blocks](https://tezos.gitlab.io/active/blocks_ops.html) can be found in Tezos' [technical documentation](https://tezos.gitlab.io/index.html). 
{% /callout %}
