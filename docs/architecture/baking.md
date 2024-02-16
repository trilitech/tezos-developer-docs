---
title: Baking
authors: "Tim McMackin"
last_update:
  date: 16 February 2024
---

Baking is the process of creating new blocks.
Bakers are nodes that validate pending operations, package them into a block, sign the block, and publish the new block to other nodes.
The protocol rewards bakers with tez for baking blocks and for attesting that other blocks are valid.

## The baking process

The baking process includes many steps that Tezos users and developers don't need to think about, but in general, baking a block follows these basic steps:

1. The protocol selects a list of bakers to create the blocks for a cycle, which is a certain number of blocks.
1. The first baker on the list creates the next block and a list of bakers to validate that block.
1. The first baker on the list has a certain amount of time to create the next block.
They package pending operations into a block, sign it, and distribute it to other bakers.
1. If the first baker doesn't publish a block in time, the next baker on the list has a certain amount of time to bake a block, and so on until a block is created.
1. The validators verify the block and publish their attestations of the block, which are added to future blocks.

## Becoming a baker

To become a baker, you must create an account to act as a _delegate_, which is an account that is authorized to bake blocks and _attest_, or verify, blocks that other accounts bake.
Delegates temporarily stake tez as a security deposit to ensure that they are acting according to the rules of the protocol.
This stake stays locked for a certain number of blocks before the delegate can begin baking.
Similarly, when bakers stop baking, their stake is unlocked after a certain number of blocks.

The delegate must stake at least least 6,000 tez, either from its own account or from tez that delegators delegate to it.
The more tez a delegate has, both from its own account and from delegators, the more likely it is to be selected to bake a block and thus receive the rewards.

Bakers must run at least one Tezos node and a baker daemon to go with it.
These daemons must run at all times with a stable internet connection, because inactive bakers are removed from the network.

## Delegating to a baker

If you don't have enough tez to become a baker or don't want to run a baking node, you can delegate tez to a baker, which makes you a _delegator_.
The delegate doesn't have control over your tez and you can withdraw your tez at any time, but the tez that you delegate counts toward the amount of tez that the delegate has for baking purposes.
Delegators receive a share of the delegate's rewards in proportion to the amount of tez that they delegate.

## References

For more information about baking, see [Node and Baking](https://opentezos.com/node-baking/baking/introduction/) on opentezos.com.
