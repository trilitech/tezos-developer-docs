---
title: Bakers
authors: "Tim McMackin"
last_update:
  date: 24 January 2025
---

Baking is the process of creating new blocks in the Tezos blockchain.
Bakers are executables running alongside Tezos nodes that cooperate to achieve consensus about the next block to add.
Bakers validate pending operations, package them into a block, sign the block, propose the new block to other nodes, and verify that the blocks that other bakers propose are valid.

Baker executables are run on behalf of user accounts.
By extension, bakers also denote the users running baker daemons on behalf of their user accounts.

For instructions on becoming a baker, see [Run a Tezos node in 5 steps](/tutorials/join-dal-baker).

## The baking process

The baking process includes many steps that Tezos users and developers don't need to think about, but at a basic level, baking a block follows these steps:

1. The protocol selects in advance a list of bakers for each block to create in a _cycle_, which is a certain number of blocks.
1. It also selects a list of bakers to act as validators.
These bakers are responsible for validating the blocks that other bakers create and publishing _attestations_ that the block is valid.
1. The first baker on the list has a certain amount of time (called a round) to create the next block.
It packages pending operations from the mempool into a block, signs it, and distributes it to other nodes.
1. If the first baker doesn't publish a block in time, the next baker on the list has a certain amount of time to bake a block (a new round), and so on until a block is created.
1. The validators verify the block and publish their attestations in future blocks.
1. The next list of bakers create the next block, until the end of the cycle.

Note that:
- The presentation above is somewhat simplified; in reality, validation is done in two phases, called pre-attestation and attestation.
- For any given block and round, only one baker has the right to create the block, and several bakers have the right to (pre-)attest the block.

## Becoming a baker

To become a baker, you must create an account to act as a _delegate_, which is an account that is authorized to bake blocks and attest blocks that other accounts bake, and also to receive delegations (and stake) from other accounts, as explained later.
Delegates temporarily stake tez as a security deposit to ensure that they are acting according to the rules of the protocol.
Deposits can be "unstaked" later, either partially (at any time) or totally (when bakers stop baking).
There is a delay of a certain number of cycles from the moment when the tez are staked until the delegate can begin baking.
Similarly, when tez are unstaked, they are unlocked after a certain number of cycles.
Staked tez may be slashed by the protocol if the baker misbehaves (e.g., proposes or attests two different blocks for the same level).

A delegate participates in consensus in proportion to their _baking power_: the more baking power a delegate has, the more likely it is to be selected to bake or to validate blocks and thus receive the rewards.
The baking power of a delegate is computed from the amounts of tez staked (by its own and by all its stakers) and owned (by its own and by all its delegators), knowing that non-staked tez are weighted one-third as much as staked tez in the sum.

The delegate must have a baking power of at least 6,000 tez to be allowed to bake.

A delegate also participates in [governance](/architecture/governance) in proportion to their _voting power_.
The voting power of a delegate is computed in a similar way to the baking power except that no distinction is made between tez that are staked or not staked.

Bakers must run at least one Tezos node and a baker daemon to go with it.
These daemons must run at all times with a stable power source and internet connection, because periods of inactivity for a baker entail losses of rewards, and eventually being marked as inactive and temporarily excluded from baking.

## Staking with a baker

If you don't have enough tez to become a baker or don't want to run a baking node, you can choose a baker as your delegate, which makes you a _delegator_.
Then you can stake tez with that baker and receive a share of the baker's rewards.

For instructions on staking, see [Staking](/using/staking).

## Delegating to a baker

In older versions of the Tezos protocol, before users could stake with a baker, delegating was the primary way that users earned rewards for their tez.
Users delegated their accounts to a baker and in return the baker could choose to share some of their baking rewards with their delegators.
The rewards to delegators were distributed by the bakers, with no guarantee from the Tezos protocol.

Delegating still works in this way, but currently, it's mostly seen as a preliminary step required for staking.
In return, the Tezos protocol provides stakers with rewards automatically.

## Summary

In summary, here is a comparison between the staking and delegating options above:

&nbsp; | Staking | Delegating
--- | --- | ---
Increase baking power | 100% | 33%
Increase voting power | 100% | 100%
Reward delay | None | 2 cycles (about 6 days)
Reward route | Direct to staker | To baker who manually sends to delegator
Funds availability | Frozen (locked) | Liquid (unlocked)
Unlock delay | 4 cycles (about 10 days) | None
Slashing exposure | Yes | No

## References

To start delegating and staking, use the app at https://stake.tezos.com.

To start baking, use our [tutorial for bakers](/tutorials/join-dal-baker).

For more information about the different options to participate to the Tezos network (baking, staking, or delegating), see [Running Octez](https://octez.tezos.com/docs/introduction/howtorun.html) in the Octez documentation.

To learn more about baking and the related concepts, see [Node and Baking](https://opentezos.com/node-baking/baking/introduction/) on opentezos.com.
