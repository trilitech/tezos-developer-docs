---
id: glossary
title: Glossary
authors: Nomadic Labs
---

## Baking

Creation of new blocks on the Tezos blockchain by participants known as **bakers** , who are given a
reward for each block that they bake. A baker may also be referred to as a **delegate**.

## Block

A set of operations for validation. A block contains, besides operations, information such as the
current block number, information about the previous block, and also the time at which it was validated.

## Cycle

Period of time during which 8,192 blocks are created on the Tezos blockchain. Also used as a unit of
time. It corresponds to roughly 2 days, 20 hours, and 16 minutes (based on 30 seconds per block created if
no baker has missed their baking slots).

## Delegation

Every Tez holder can transfer the baking and voting rights associated with their
Tez to a baker. The holder always retains control of their funds and may change delegate at any time.

## Fitness

Score representing the quality of the chain up to a given block. In the current protocol, the fitness
includes its version (currently 2. Version 0 was used by the initial consensus algorithm Emmy, and version 1 by its later evolutions Emmy+ and Emmy*), the
level of the current block as the third component, the round at which a preendorsement quorum was
observed by the baker, the opposite of predecessor block’s round as the forth component (the predecessor
is given by the tuple (version, level, locked_round, - predecessor_round - 1, round); see <https://tezos.gitlab.io/active/consensus.html#shell-protocol-interaction-revisited> for more details.

## Node

A Tezos node is a peer (a machine) on the peer-to-peer network. It keeps a copy of the current state
and propagates the blocks baked and operations performed to the other peers. A node is not necessarily a
baker, but a baker is always associated with one or more nodes. Nodes are running in one of the following
three modes, with respect to how they keep the chain history:

- In archive mode, they keep the whole history of the chain. As of year-end 2020, an archive node takes
up around 80GB.
- In rolling mode, they keep the minimum data required to operate the chain, with the oldest information
being deleted regularly.
- In full mode (the default mode), they keep all the information in a rolling mode, plus the minimum data
required to reconstitute the entire chain from the genesis block. Thus, the full mode combines elements
of the archive and rolling modes.

## Preendorsement / Endorsement

In addition to creating new blocks, bakers may approve blocks made by
other bakers. They are known as **preendorsements** (1st approval phase) and **endorsements** (2nd
approval phase) of a block.

## Roll

An amount of tez (e.g., 6000ꜩ) serving as a minimal amount for a delegate to have baking and voting rights in a cycle. However since Ithaca and Jakarta amendment, rolls are not used anymore as a unit for baking or voting rights, these are based on the actual, non-approximated stake.

## Round

A period of time (made up of 3 phases) during which a given validator (selected to produce a block)
proposes a block, obtains preendorsements, and then endorsements. If, for certain reasons it fails, we go to
another round, and so on.

## Stake

To have the right to be recognized as a baker in a network, a Tez holder must possess at least one roll,
in their staking balance (own balance + delegated balance). Voting rights are also indexed to the staking
balance.

## Slot

A slot is an opportunity available for a block creation or an endorsement: each cycle has 8,192 baking slots
and 2,097,152 endorsement slots. At the start of each cycle, the protocol assigns a list of bakers to each slot
using a uniform law weighted by staking balance. The first baker on the list is tasked with baking or
endorsing as appropriate. If they don't, the next baker is given the task, etc.
