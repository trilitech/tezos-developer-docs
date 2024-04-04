---
title: Shell and protocol
authors: Tim McMackin
last_update:
  date: 4 April 2024
---

The software that runs Tezos [nodes](./nodes) is split into two main parts:

- The shell, which handles low-level functions like data storage and peer-to-peer network communication
- The economic protocol that interprets the block operations (e.g., transactions)

The relationship between the shell and the protocol is like the relationship between an operating system and an application.
The operating system stays stable while the application can update itself.
In this way, Tezos can update how it works (its protocol) without requiring nodes to accept major changes to the software that they run (the shell).
For example, nodes can update to a new protocol version without restarting the shell.

## The Tezos self-amending protocol

Unlike many other blockchains, Tezos is self-amending.
Its nodes can update the protocol that controls the possible operations and how they are processed; updates are performed via an online governance process.
These updates allow Tezos to adapt to new technologies and respond to user needs.
For example, protocol upgrades have added new features like Smart Rollups and have reduced the amount of time between blocks.

This protocol is responsible for interpreting the operations in each block.
It also provides the logic that identifies erroneous blocks.

Updates to the protocol can change this logic through a voting process, using dedicated voting operations such as protocol proposals or protocol upvotes.
For information about the voting process, see [Governance](governance).

## The shell

The shell is responsible for the fundamental functions of a distributed software application, including:

- Peer-to-peer communication that lets nodes exchange information
- Storage functionality that lets nodes store blocks, operations, and the current state of the chain
- A synchronization heuristic that starts nodes and keeps them in sync with the network
- A validator that checks that blocks are valid with help from the rules in the economic protocol

In particular, the validator is responsible for resolving the available blocks into a single linear sequence of blocks.
It chooses between the various blocks that baking nodes create, uses the protocol to verify and score them, and selects the tree head with the highest score.
Then it uses that linear chain in all of its work with the protocol, so the protocol is never aware of multiple branches.
