---
id: introduction
title: Introduction
slug: /baking
authors: Maxime Sallerin
lastUpdated: June 2023
---

In this module, we will see how baking works for the Tezos blockchain. More precisely, we will see the different actors involved, from creating new blocks to their validation. We will then see the associated reward system, and how to deploy your own baker. Finally, we will present a list of existing bakers and the criteria to evaluate them.

## What is baking?

To achieve its consensus, Tezos uses Proof of Stake. That is to say that the validators/bakers of the network temporarily lock a part of their tokens (which they cannot use anymore) to obtain the right to create a block. The **creator** of the next block is called the **baker** and is chosen randomly among all the candidates, based on the number of tokens locked. In exchange for his work, the baker receives a **reward** in Tez.

### What is delegating?

If a Tez holder does not have 6,000ꜩ or does not want to set up a computing infrastructure to bake blocks, they may delegate their coins to a baker. Delegating lets coin holders (i.e., **delegators**) "lend" their coins to a baker (i.e., a **delegate**), giving the baker a higher probability of being selected to bake and endorse blocks. In turn, bakers share the additional revenue generated from the delegated tokens with the delegators, in proportion to their participation. Note that this process does not transfer ownership of coins. Hence bakers cannot spend or control the Tez delegated to them, ensuring that bakers cannot appropriate the delegators funds.

With _LPoS_ the number of bakers is unlimited (everyone can participate), and delegation is optional.

In Tezos we call participants in the block validation process **delegates**. Each delegate can:

- act as a baker, creating and signing blocks, and/or
- act as an endorser, approving blocks by issuing an endorsement operation (endorsements visible at the
block level n + 1 relate to the block level n).

Baking and endorsement rights are attributed at random, several cycles in advance. To deter dishonest
behavior (e.g. double baking or double endorsement), **each delegate must place a fixed quantity of Tez
as a security deposit for a limited time** (five cycles), which will be confiscated if they attempt to
compromise the chain.

Prospective bakers must meet the following requirements:

- Server available round the clock and stable internet connection
- At least 8GB of RAM
- SSD disk (preferably with more than 100GB storage)
- At least 6,000ꜩ as a staking balance (own funds + delegated balance)

The more Tez a baker holds in his staking balance, the higher his chances to bake blocks and earn baking rewards.

### Liquid Proof-of-Stake and delegation

On Tezos, baking rights are attributed randomly but proportionally to the staking balance. A Tez holder may:

- become a baker if they possess at least 6,000ꜩ in their own funds or by delegation

- delegate their Tez to a baker, to participate in the consensus

In practice, certain bakers may pass on some of the rewards they receive to the individuals who delegated
their Tez to them. This distribution may encourage others to delegate their Tez, thereby increasing the
delegated balance of these bakers and so their staking balance, i.e. their chance of baking/endorsing.

**Liquid Proof-of-Stake** (LPoS) provides the option for a Tez holder to retain ownership of their funds while
delegating their associated (voting, baking) rights to a baker. This principle differs from the delegated Proof-
of-Stake (DPoS) of other blockchains, in which participants vote for a restricted number of block validators.


{% callout type="note" title="Additional Reference" %}
[Tezos Agora on Baking](https://wiki.tezosagora.org/learn/baking)
{% /callout %}

