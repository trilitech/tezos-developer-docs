---
id: reward
title: Rewards
authors: Maxime Sallerin
lastUpdated: 27th June 2023
---

To maintain the network, Tezos needs bakers and endorsers. They stake their tokens and use their CPU, memory space and internet connection to create blocks, manage transactions, vote, and secure the network. In exchange for the completion of these tasks, bakers are rewarded with tokens from the transaction fees or tokens created by the network. 

## Inflation

Each new block generates 20 new tez as a reward: 10 tez for the baker and 10 tez for the endorsers.
A new block is created each 15 seconds, which generates 42 Million of tez per year ( {% math inline=true %}\approx {% /math %} 80ꜩ  {% math inline=true %}\times {% /math %} 60 mins  {% math inline=true %}\times {% /math %} 24 hours  {% math inline=true %}\times {% /math %} 365 days). At the launch of Tezos, the network was composed of 763 Millions tez.

Therefore the inflation rate of the tez token for the first year was **5.5%**:
 {% math %}
\frac{42,000,000}{763,000,000}=\frac{42}{763}\approx5.5\%
 {% /math %}

For the second year it was **5.2%**:
 {% math %}
\frac{42}{763 + 42}=\frac{42}{805}\approx5.2\%
 {% /math %}

For the third year it was **5.0%**:
 {% math %}
\frac{42}{805 + 42 }=\frac{42}{847}\approx5.0\%
 {% /math %}

and so on ...

Therefore the inflation rate decreases a bit each year.

> Note that this calculation of the inflation rate is based only on the generation of new tez. The burned tez are ignored in the formula. It is, therefore, an approximation, and in reality, the inflation rate is a bit lower.

## Baking and Endorsing reward

Bakers are crucial because they operate the chain by creating blocks and checking the integrity of the data
they contain. Each baked block leads to the creation of new tez to incentivize the bakers to perform baking
and endorsing operations.


There are up to 10 tez paid in _baking_ rewards, and 10 tez paid in _endorsing_ rewards per block (for a total of 20 Tez per block). Block rewards are split into two parts: a fixed part (5 tez for the payload producer who selects the transactions to be included in the block and the first authorized to propose a block with that payload, and at most 5 tez as a bonus for the block producer who proposes the block. In case of re-
proposal, the payload producer might be different from the block proposer. Otherwise, it should be the
same), and a variable part which is a bonus for the block producer, depending on the number of
endorsements included (beyond the 4,667 endorsements threshold).

Baking rewards (fixed and variable) on each block are paid immediately, whereas endorsements rewards
are paid at the end of each cycle, under the conditions of participating in the consensus (performing
endorsement operations) more than 2/3 of its expected number of slots; and if they reveal their nonces.

Baking and endorsement rewards follow the formulas below:

 {% math %}
\bm{baking\ rewards=5 + e\times 0.002143}
 {% /math %}

where `e ∈[0; 2,333]` = the number of extra endorsements slots beyond the threshold of 4,667.

The baking rewards are 10 tez at most, for a fully endorsed block (not counting the transaction fees).

 {% math %}
\bm{endorsing\ rewards=s \times 0.001428}
 {% /math %}

where `s` = number of endorser’s slots.

An endorser may have several slots among the 7,000 slots available in a given block, depending on its
stake. The more stake a baker has, the more slots it gets per block.

## Delegating reward

When delegating, you can earn a passive income by participating in the Tezos network via delegation. The current annual yield on Tezos is around **6%** minus validators’ fee.

Every time a baker receives some rewards, those rewards are frozen for the next 5 cycles ( {% math inline=true %}\approx {% /math %} 14 days), so the baker cannot spend them. Only after rewards are unfrozen, that the baker can transfer them to someone else. Most bakers wait until rewards are unfrozen to pay it out to delegators, but some do not in order to be more attractive to delegators.

For:

-  {% math inline=true %}Confirmation_{time} \approx \text{20 days} {% /math %}, delegators have to wait around 20 days after delegating before start staking.
-  {% math inline=true %}Frozen_{time} \approx \text{14 days} {% /math %}, bakers' rewards are frozen for 5 cycles.
-  {% math inline=true %}Cycle_{time} \approx \text{3 days} {% /math %}, this is the approximate time between two successive cycles.
-  {% math inline=true %}FirstPayout_{time} {% /math %}: The necessary time to wait before the first payout.

If your baker pays after rewards are unfrozen, you will receive your first reward after:
 {% math %}
\bm{FirstPayout_{time}}= Confirmation_{time} + Frozen_{time} + Cycle_{time} \approx \text{37 days}
 {% /math %}

If your baker pays in advance, you will receive your first reward after:
 {% math %}
\bm{FirstPayout_{time}}= Confirmation_{time} + Cycle_{time} \approx \text{23 days}
 {% /math %}

Rewards for cycle `n` come in the cycle `n + 1` (after  {% math inline=true %}\approx {% /math %} 3 days) so, you will then receive your delegating reward every **3 days**.

There are no direct risks of delegating Tez. The only risk you take is not earning the potential rewards. Carefully choose your baker to ensure the quality of service and reward.

When delegating, your Tez are completely liquid. You are free to move your tokens anytime as there are no freezing periods when delegating to a baker.

## Accusation reward

The accuser monitors the network, detects double-baking or double-endorsing.

If two endorsements are made for the same slot or two blocks baked at the same height, the evidence can be collected by an accuser and included in a block for a period of 5 cycles, including the current cycle.

This accusation forfeits the entirety of the safety deposit of the accused baker and future rewards up to that point in the cycle. Half is burned, half goes to the accuser in the form of a block reward.

{% callout type="note" title="Additional References" %}
- [Proof of Stake in Gitlab docs](https://tezos.gitlab.io/alpha/proof_of_stake.html#rewards)
- [Baking Bad on Staking](https://baking-bad.org/docs/tezos-staking-for-beginners/)
{% /callout %}
