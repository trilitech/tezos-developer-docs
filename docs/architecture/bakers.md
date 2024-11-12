---
title: Bakers
authors: "Tim McMackin"
last_update:
  date: 12 November 2024
---

Baking is the process of creating new blocks in the Tezos blockchain.
Bakers are programs complementary to Tezos nodes that cooperate to achieve consensus about the next block to add.
Bakers validate pending operations, package them into a block, sign the block, propose the new block to other nodes, and verify that the blocks that other bakers propose are valid.

Bakers are run on behalf of user accounts which stake tez to guarantee honest participation and receive rewards for their participation.
The baker has access to the account's private key, which it uses to sign blocks and operations.
By extension, bakers also denote the users running baker on behalf of their user accounts.

## The baking process

The baking process includes many steps that Tezos users and developers don't need to think about, but at a basic level, baking a block follows these steps:

1. The protocol selects in advance a list of bakers for each block to create in a _cycle_, which is a certain number of blocks.
1. It also selects a list of bakers to act as validators.
These bakers are responsible for validating the blocks that other bakers create and publishing _attestations_ that the block is valid.
1. The first baker on the list has a certain amount of time to create the next block.
It packages pending operations into a block, signs it, and distributes it to the validators and other nodes.
1. If the first baker doesn't publish a block in time, the next baker on the list has a certain amount of time to bake a block, and so on until a block is created.
1. The validators verify the block and publish their attestations in future blocks.
1. The next list of bakers create the next block, until the end of the cycle.

## Becoming a baker

To become a baker, you must create an account to act as a _delegate_, which is an account that is authorized to bake blocks and attest blocks that other accounts bake.
Delegates temporarily stake tez as a security deposit to ensure that they are acting according to the rules of the protocol.
This stake stays locked for a certain number of cycles before the delegate can begin baking.
Similarly, when bakers stop baking, their stake is unlocked after a certain number of cycles.

The delegate must stake at least least 6,000 tez, either from its own account or from tez that delegators delegate to it.
The more tez a delegate has, both from its own account and from delegators, the more likely it is to be selected to bake a block and thus receive the rewards.
The amount of tez a baker has for baking purposes is called its _baking power_.

Bakers must run at least one Tezos node and a baker program to go with it.
These baker programs must run at all times with a stable internet connection, because inactive bakers are automatically removed from the network.

If you don't have enough tez to become a baker or don't want to run a baking node, you can delegate and stake tez to a baker, which makes you a _delegator_ and _staker_.
See [Stakers](/architecture/stakers).

## References

For more information about the different options to participate to the Tezos network (baking, staking, or delegating), see [Running Octez](https://tezos.gitlab.io/introduction/howtorun.htm) in the Octez documentation.

For full details about baking, see [Node and Baking](https://opentezos.com/node-baking/baking/introduction/) on opentezos.com.
