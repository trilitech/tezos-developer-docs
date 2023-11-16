---
title: Protocol and shell
last_update:
  date: 16 November 2023
---

The software that runs Tezos is split into two main parts:

- The shell, which handles low-level functions like data storage and network communication
- The economic protocol that interprets transactions

The relationship between the shell and the protocol is like the relationship between an operating system and an application.
The operating system stays stable while the application can update itself.
In this way, Tezos can update how it works (its protocol) without requiring nodes to accept major changes to the software that they run (the shell).

There are many other parts of a node, such as the tools that bake blocks and RPC layer that allows it to accept requests, but these two parts are the basis for all node functions.

## The Tezos self-amending protocol

Unlike many other blockchains, Tezos is self-amending.
Its nodes can update the protocol that controls how transactions are processed without making major changes to how they run.
The nodes do this by running the protocol on top of a shell that does not change.

This protocol is responsible for interpreting the transactions in each block.
It also has provides the logic that identifies erroneous blocks.

Updates to the protocol can change this logic through the voting process.
For information about the voting process, see [Governance](./governance).

## The shell

The shell is responsible for the fundamental functions of a distributed software application, including:

- Peer-to-peer communication that lets nodes exchange information
- Storage functionality that lets nodes store blocks, operations, and the current state of the chain
- A synchronization heuristic that starts nodes and keeps them in sync with the network
- A validator that checks that blocks are valid based on the rules in the economic protocol

In particular, the validator is responsible for resolving the available blocks into a single linear sequence of blocks.
It chooses between the various blocks that baking nodes create, uses the protocol to verify and score them, and selects the tree head with the highest score.
Then it uses that linear chain in all of its work with the protocol, so the protocol is never aware of multiple branches.

## References

For more information about the shell and the protocol, see these pages in the Octez documentation:

- [Tezos Software Architecture](https://tezos.gitlab.io/shell/the_big_picture.html)
- [The economic protocol](https://tezos.gitlab.io/active/protocol.html)
- [Blocks and operations](https://tezos.gitlab.io/active/blocks_ops.html)
