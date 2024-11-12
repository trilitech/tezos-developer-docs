---
title: Stakers
authors: "Tim McMackin"
last_update:
  date: 12 November 2024
---

If you don't have enough tez to become a baker or don't want to run a baking node, you can delegate and/or stake tez to a baker, which makes you a _delegator_ or _staker_.
Delegators and stakers earn rewards based on how much tez they delegate or stake.
Delegating and staking have different risks, delays, and rewards.

This table compares delegating and staking in Tezos:

&nbsp; | Staking | Delegating
--- | --- | ---
Reward factor | 2x | 1x
Reward delay | None | 2 cycles (about 6 days)
Reward route | Direct to staker | To baker first and then manually to delegator
Funds availability | Frozen (locked) | Liquid (unlocked)
Lockup period | 4 cycles (about 10 days) | None
Slashing exposure | Yes | No

## Delegating

Delegating is allowing the tez in your account to count towards another account's voting and baking power without giving up control over the tez.

Any account (both user accounts and smart contracts) can delegate its tez to another account that is registered as a delegate.
Only user accounts can be delegates.
In most cases, delegates are bakers.

Delegating tez to another account doesn't mean that the other account controls it.
Delegated tez remains liquid, or unlocked, which means that you can use it as usual, without any delay.

Bakers accept delegated tez because delegated tez counts toward their own tez for certain purposes:

- Delegated tez carries voting power; a delegate's voting power is the sum of its own tez plus the tez delegated to it
- Delegated tez carries baking power; 50% of delegated tez counts toward a delegate's baking power

Bakers share rewards with accounts that delegate to them, but unlike staking, this reward sharing is a manual process and is not guaranteed.

Delegating carries no risk to the delegator; the delegate has no control over the tez and the delegator is not punished for anything that the delegate does.

## Staking

Staking is a new option that became available as part of adaptive issuance in the Paris protocol upgrade.
It provides faster and more direct rewards than delegating.

Staking is similar to delegating, but it has these major differences:

- Staked tez is frozen for a certain amount of time, which means that the owner can't spend them immediately
- The protocol automatically rewards stakers with a percentage of the delegate's baking rewards
- Stakers start receiving rewards for staked tez immediately but must wait for a delay of 4 cycles before they can withdraw (unstake) their staked tez to make them liquid again
- Delegating carries risk; if the delegate is punished (slashed), the punishment also affects tez staked with it
- 100% of staked tez counts toward a delegate's baking power

To stake tez, an account starts by delegating its tez to a baker's account as usual.
Then it stakes a certain amount of that same tez to the baker.
An account always delegates all of its tez to its delegate, but it can stake any amount of that tez, which allows the account to earn rewards on some frozen tez while leaving some tez liquid for immediate use.

## Becoming a delegator and staker

To start delegating and staking, use the app at https://stake.tezos.com to first become a delegator and then a staker.

## References

For more information about delegating and staking, see these pages in the Octez documentation:

- [Proof of stake](https://tezos.gitlab.io/alpha/proof_of_stake.html)
- [Delegating your coins](https://tezos.gitlab.io/introduction/howtorun.html#delegating-your-coins)
- [Staking](https://tezos.gitlab.io/alpha/staking.html)
