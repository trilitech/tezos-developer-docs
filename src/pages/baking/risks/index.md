---
id: baking_risks
title: Risks
authors: Nomadic Labs
lastUpdated: 27th June 2023
---

In this section, we will discuss how bakers may be subject to certain penalties, or risks incurred due to their activity.

{% callout type="note" title="Caveat" %}
This section is not intended to be exhaustive.
{% /callout %}

## Actions prejudicial to the network

The following actions result in the punitive seizure of the security deposit:

- **Double baking**: A dishonest baker may try to bake two blocks at the same block height in the chain.
In case of double baking, 640 Tez are forfeited from the total deposit.

- **Double (pre)endorsement**: A dishonest endorser could attempt to (pre)endorse two blocks at the same block
height in the chain. In case of double (pre)endorsement, half of the total deposit is forfeited.

- **Seed slash**: A baker is asked to provide random seeds to feed into the baker selection algorithm. To
avoid the algorithm being deterministic, the seeds are given in a hashed form. The baker has to
deliver in the following cycle the seeds corresponding to the hashes sent. If they do not do so, they do
not earn a reward but may still get back the associated deposit.

The protocol allows a window of five cycles during which an **accuser** may demonstrate evidence of double
baking or double endorsement (several times if necessary). The dishonest baker will then lose the security
deposit(s) placed for the fake operation up to the latest point in the cycle (which may be costly, especially if the baker has done a lot of baking/endorsing over the relevant period).

## Security deposits and penalties

To discourage double baking/endorsing a security deposit is required.

The security deposit remains in the account but is locked up for a period of five cycles
(around two weeks). The corresponding Tez are always taken into account when calculating slots, but they
cannot be spent or used as a new security deposit until they have been released again.

All security deposits are frozen when rights for a cycle are being drawn. On mainnet, rights for a cycle are
determined 5 cycles in advance, and a delegate has a specific deposit associated to each cycle. **We only
retain one deposit:** the highest deposit of all cycles in a timeframe of 7 cycles, so that we are always able
to punish proportionally to the capacity to harm in this timeframe. If a validator double signs, that is, double bakes or double (pre)endorses (the latter implies voting for two different proposals at the same round), the frozen deposit is slashed. The slashed amount for double baking is `DOUBLE_BAKING_PUNISHMENT = 640` Tez. The slashed amount for double (pre)endorsing is a fixed percentage
`RATIO_OF_FROZEN_DEPOSITS_SLASHED_PER_DOUBLE_ENDORSEMENT = 1/2` of the frozen
deposit.

##### Bakers are advised to hold at least 10% of the total number of Tez used for baking purposes 

By default, the required deposits are automatically determined to maximize the active stake. **However, no extra
baking/endorsements slots will be assigned to a delegator who has not enough security deposit.**

When a double baking/endorsement is observed, an accusing baker may provide evidence in a block for a
period of five cycles starting from the fake operation. As a reward for the accuser, half the culpable baker's
deposit goes to the accuser. The other half of the deposit is destroyed.

## Attacks

The attacks potentially targeting a baker include:

- **DoS (denial of service attack)**: Suppose Bob knows that Alice is about to bake a block with priority 0.
He may decide to launch a DoS attack to prevent Alice from publishing her block correctly, thus
damaging Alice's reputation. If the attack is sustained, and if Bob appears toward the top of the list of
potential bakers (especially if he has priority 1), then he may also be able to steal Alice's block.

- **Theft or loss of a private key**: Holding the private key is the only way to gain access to the associated
Tez and to sign various operations. Thus it is vital to keep the private key safe and secure (e.g. in a
hardware wallet).

## Over-delegation

A security deposit is required to bake and endorse properly. This amount remains locked up over a
timeframe of seven cycles. In addition, a baker cannot spend Tez that have been delegated to them or use
them as security deposits.

A baker is said to be over-delegated when they do not have sufficient funds themselves relative to their
stake. However, they do not miss the acquired slots because of a lack of security deposit and thus will not slow down the chain anymore.

The over-delegated baker will not maximize its staking power, since more Tez are delegated compared to
what it should own (at least 10% of the total staking balance).

To keep a portion of its balance spendable, a baker can set a deposit limit:

```bash
octez-client set deposit limit for <delegate> to <deposit_limit>
```

And unset this limit with the command:

```bash
octez-client unset deposit limit for <delegate>
```

## Inactivity

A baker who refuses or is unable to bake or endorse for five cycles will be treated as inactive by the chain,
and can no longer be picked as a baker/endorser.

The inactive baker must wait for seven cycles after reactivating their account, before they can bake again.

This mechanism is designed to ensure that a baker who is no longer active, does not slow down the chain.


## Conclusion

Being a baker doesn't come without risks but by following the proper procedures one can be confident in baking properly and reaping the rewards of doing so, in addition to being a valuable actor in the Tezos network.
