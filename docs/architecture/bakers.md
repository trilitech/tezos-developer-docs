---
title: Bakers
authors: "Tim McMackin"
last_update:
  date: 13 January 2025
---

Baking is the process of creating new blocks in the Tezos blockchain.
Bakers are executables running alongside Tezos nodes that cooperate to achieve consensus about the next block to add.
Bakers validate pending operations, package them into a block, sign the block, propose the new block to other nodes, and verify that the blocks that other bakers propose are valid.

Baker executables are run on behalf of user accounts.
By extension, bakers also denote the users running baker daemons on behalf of their user accounts.

## The baking process

The baking process includes many steps that Tezos users and developers don't need to think about, but at a basic level, baking a block follows these steps:

1. The protocol selects in advance a list of bakers for each block to create in a _cycle_, which is a certain number of blocks.
1. It also selects a list of bakers to act as validators.
These bakers are responsible for validating the blocks that other bakers create and publishing _attestations_ that the block is valid.
1. The first baker on the list has a certain amount of time (called a round) to create the next block.
It packages pending operations into a block, signs it, and distributes it to other nodes.
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

Bakers must run at least one Tezos node and a baker service to go with it.
These services must run at all times with a stable power source and internet connection, because periods of inactivity for a baker entail losses of rewards, and eventually being marked as inactive and temporarily excluded from baking.

## Delegating to a baker

If you don't have enough tez to become a baker or don't want to run a baking node, you can choose a baker as your delegate, which makes you a _delegator_.
The delegate doesn't have control over your tez and you can spend your tez at any time or withdraw your delegation, but one-third of the tez that you delegate counts toward the baking power of the delegate.
Similarly, delegated tez increase the voting power of your baker: a delegate's voting power is the sum of its own tez plus all of the tez delegated to it.

In exchange, delegates may share some part of their rewards with you, in proportion to the amount of available tez in your account (technically, the minimal balance during each cycle).
Check your delegate's conditions for distributing rewards.

Delegating incurs no risk for the delegator: the delegate has no control over the tez and the delegator is not punished if the delegate misbehaves.

## Staking with a baker

If you want to get a bigger share of your delegate's rewards, you can temporarily stake any amount of tez from your account with your baker, provided your baker accepts staking.
All the tez you stake don't leave your account: they are frozen in your account,
but contribute to the baker's security deposit, and are locked under the same conditions as the baker's own staked tez. Hence, they are slashed if the baker misbehaves.
In exchange of agreeing to temporarily lock these tez and sharing the risks with your delegate, you get a bigger share of the delegate's rewards.
Staking rewards accrue automatically, and are allocated by the protocol: stakers earn rewards whenever their bakers do, and don't have to wait for the baker to distribute them (unlike delegation rewards).

Later on, you may choose to unstake part or all of the staked tez, that will be unlocked after a certain delay.

To stake tez, you start by delegating to a baker's account (which should accepts staking and not be "overstaked"), then you stake a certain amount of your tez to the baker.
Thus, you can earn staking rewards on some frozen tez while leaving some delegated tez liquid for immediate use.

Since you may have only one delegate, you can only stake with one baker at a time.

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

For more information about the different options to participate to the Tezos network (baking, staking, or delegating), see [Running Octez](https://tezos.gitlab.io/introduction/howtorun.html) in the Octez documentation.

For full details about baking, see [Node and Baking](https://opentezos.com/node-baking/baking/introduction/) on opentezos.com.
