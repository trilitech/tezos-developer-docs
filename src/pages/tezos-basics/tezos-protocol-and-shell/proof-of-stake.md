---
title: Proof-of-stake
---

# Overview

`The consensus algorithm <consensus>`{.interpreted-text role="doc"} in
Tezos is based on the *proof-of-stake* mechanism. Proof-of-stake means
that participants in the consensus algorithm are chosen in function of
their stake (the amount of tokens a participant has). The same mechanism
is used in the Tezos `governance <voting>`{.interpreted-text
role="doc"}.

If one does not have enough stake to participate on its own or does not
want to set up the needed infrastructure, (s)he can use `delegation
<delegating_coins>`{.interpreted-text role="ref"}. Therefore, in Tezos,
it is the `delegates<Delegate>`{.interpreted-text role="ref"} that may
participate in consensus. However, at each level, not all delegates
necessarily participate, and their participation weight may differ. The
selection of the delegates\' participation rights at a level is done by
running a PRNG (pseudo-random number generator). The PRNG\'s
`seeds <random_seed_mumbai>`{.interpreted-text role="ref"} are obtained
from random data that are regularly produced and stored on the
blockchain. Thus, the procedure is deterministic in that delegates\'
rights are uniquely determined from the seed; and it is random, in that
its seed (and hence its results) cannot be predicted too much in
advance.

# Delegation

A *delegate* is any
`implicit account <Implicit account>`{.interpreted-text role="ref"}
registered as such by emitting a delegate registration operation. Note
that `tz4` accounts cannot be registered as delegate.

Any `account <Account>`{.interpreted-text role="ref"} (implicit or
originated) can specify a delegate through a delegation operation. Any
account can change or revoke its delegate at any time. However, the
change only becomes effective after `PRESERVED_CYCLES + 2`
`cycles <Cycle>`{.interpreted-text role="ref"}. The value
`PRESERVED_CYCLES` is a
`protocol constant <protocol_constants_mumbai>`{.interpreted-text
role="ref"}.

A delegate participates in consensus and in governance with a weight
proportional with their delegated stake, which includes the balances of
all the accounts that delegate to it, and also the balance of the
delegate itself. To participate in consensus or in governance, a
delegate needs to have at least a minimal stake, which is given by the
`MINIMAL_STAKE` `protocol constant
<protocol_constants_mumbai>`{.interpreted-text role="ref"}.

Delegates place security deposits that may be forfeited in case they do
not follow (some particular rules of) the protocol. Security deposits
are deduced from the delegates\' own balance.

## Active and passive delegates

::: {#active_delegate_mumbai}
A delegate can be marked as either active or passive. A passive delegate
cannot participate in the consensus algorithm.
:::

A delegate is marked as active at its registration.

A delegate becomes passive at the end of cycle `n` when it has failed to
participate in the consensus algorithm in the past
`PRESERVED_CYCLES + 1` cycles. That is, in cycles `n`, `n-1`, `n-2`,
\..., `n - PRESERVED_CYCLES`.

# Delegates\' rights selection

Tezos being proof-of-stake, the delegates\' rights are selected at
random based on their stake. In what follows we detail the selection
mechanism used in Tezos.

## Random seed {#random_seed_mumbai}

To each cycle is associated a random number called the seed. This seed
is used within its cycle to generate pseudo-random values in the
protocol, in particular for selecting delegates to participate in
consensus.

For more information on randomness generation, see
`randomness-generation<randomness_generation>`{.interpreted-text
role="doc"}.

## Stake snapshots {#snapshots_mumbai}

Before turning to the rights selection mechanism, we first introduce a
new terminology, *stake snapshot*, to denote the stake distribution for
a given block, as stored in the `context<context>`{.interpreted-text
role="ref"}. Stake snapshots are taken (and stored) every
`BLOCKS_PER_STAKE_SNAPSHOT` levels. More precisely, a snapshot is taken
at a level if and only if its cycle position modulo
`BLOCKS_PER_STAKE_SNAPSHOT` is `BLOCKS_PER_STAKE_SNAPSHOT - 1`.
Therefore, at the end of a cycle there are
`BLOCKS_PER_CYCLE / BLOCKS_PER_STAKE_SNAPSHOT` stored snapshots.

At the end of cycle `n-1-PRESERVED_CYCLES`, the snapshot for cycle `n`
is randomly selected from the snapshots stored in cycle
`n-1-PRESERVED_CYCLES`. The selection is done through a very simple PRNG
having as seed the `random seed<random_seed_mumbai>`{.interpreted-text
role="ref"} for cycle `n`.

Only the stake of active delegates with the minimal stake of
`MINIMAL_STAKE` is snapshot.

## Slot selection {#rights_mumbai}

Delegates\' rights to participate are determined using the [alias
method](https://en.wikipedia.org/wiki/Alias_method), more precisely
using [Vose\'s
algorithm](https://web.archive.org/web/20131029203736/http://web.eecs.utk.edu/~vose/Publications/random.pdf)
(see also [this more pedagogic
description](https://www.keithschwarz.com/darts-dice-coins/); the
algorithm is the last one listed there). This algorithm samples from a
discrete probability distribution, which is given by the stakes in a
particular stake snapshot: the probability to sample a particular
delegate is its stake in the snapshot over the total stake in that
snapshot.

Concretely, the delegates\' rights at a given level are expressed in
terms of the (quantity of) *slots* that the delegate owns at that level.
This quantity represents the delegate\'s weight in consensus. We note
that, in the long run (that is, on average over many levels), the number
of slots is proportional to its stake. The owner of a slot is obtained
by sampling using the algorithm mentioned above. More precisely, given a
level and a slot (which is just a non-negative integer), the mentioned
algorithm is invoked to assign a delegate to the given slot. Its input
is the probability distribution given by the `stake
snapshot<snapshots_mumbai>`{.interpreted-text role="ref"} for the cycle
to which the level belongs. And whenever the algorithm needs to draw a
random value, this is obtained using a simple procedure which has as its
initial state: the level, the
`random seed<random_seed_mumbai>`{.interpreted-text role="ref"} for the
cycle to which the level belongs, and the slot.

# Proof-of-stake parameters {#ps_constants_mumbai}

  -----------------------------------------------------------------------
  Parameter name                                   Parameter value
  ------------------------------------------------ ----------------------
  `BLOCKS_PER_CYCLE`                               16384 blocks

  `PRESERVED_CYCLES`                               5 cycles

  `MINIMAL_STAKE`                                  6,000 ꜩ

  `BLOCKS_PER_STAKE_SNAPSHOT`                      1024 blocks
  -----------------------------------------------------------------------

# Further External Resources

The original design of the proof-of-stake mechanism in Tezos can be
found in the [whitepaper](https://tezos.com/whitepaper.pdf).

Another presentation of the Tezos\' proof-of-stake mechanism can be
found in the [Tezos agora wiki
entry](https://wiki.tezosagora.org/learn/baking/proofofstake/consensus).
