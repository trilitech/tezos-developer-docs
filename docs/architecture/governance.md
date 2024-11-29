---
title: Governance and self-amendment
last_update:
  date: 27 February 2024
---

Tezos incorporates a built-in, on-chain mechanism for proposing, selecting, testing, and activating protocol upgrades without the need to hard fork.
This mechanism makes Tezos a self-amending blockchain and allows any user to propose changes to the [economic protocol](/architecture/nodes), which defines the possible blockchain operations and how they are processed.

This self-amendment process is separate from the off-chain and less formal [Tezos Improvement Process](/architecture/governance/improvement-process).

## Amendment periods

The self-amendment process is split into 5 periods, whose scheduling and operation are automatically handled by the protocol, as follows:

1. Proposal period: delegates propose changes to the Tezos protocol by submitting proposals and upvoting protocol amendment proposals.
If a quorum is met, the top-voted proposal moves to the next period.
1. Exploration period: Users vote whether to consider the top-voted proposal
1. Cooldown period: If a proposal is selected in the Exploration period, a Cooldown period starts before the final election is made. The community can continue testing the new protocol proposal and preparing their infrastructure, before the final decision is made.
1. Promotion period: Users make a final vote on whether to apply the proposal
1. Adoption period: Users adapt their code and infrastructure to the proposal, and at the end of the period it is activated automatically

Each period lasts five blockchain cycles (40,960 blocks at 30-second intervals or roughly 14 days, 5 hours), comprising roughly 2 months and 10 days.

Only delegates can vote on proposals.
A delegate's voting power is the amount of tez that it has staked plus the tez that delegators have delegated to it, also called its _staking balance_.

### 1. Proposal period

The Tezos amendment process begins with the Proposal period, during which delegates can submit proposals to change the Tezos protocol.
The delegate submits the proposal by submitting the hash of the source code.

Each delegate can submit up to 20 proposals in a single Proposal period.
A proposal submission also counts as a vote, which is equivalent to the amount of tez in its staking balance at the start of the period.
Other delegates can vote for up to 20 proposals during this period.

At the end of the Proposal period, the network counts the proposal votes and if a quorum is met, the most-upvoted proposal proceeds to the Exploration period.
If no proposals have been submitted or if there is a tie between proposals, no proposal proceeds and a new Proposal period begins.

### 2. Exploration period

In the Exploration period, delegates vote on whether to consider the top-ranked proposal from the previous Proposal period.
Delegates can vote either "Yea", "Nay", or "Pass" on that proposal.
"Pass" means to "not vote" on a proposal.
As in the Proposal period, a delegate's voting power is based on the amount of tez in its staking balance.

At the end of the Exploration period, the network counts the votes.
To pass, the proposal must meet both of these standards:

- Quorum: A quorum of all of the voting power in the system must vote either "Yea", "Nay", or "Pass."
The amount of the quorum changes dynamically based on previous votes, which allows the system to adjust to the amount of delegates that participate in voting.

- Supermajority: The total voting power of the Yea votes must be greater than 80% of the total voting power of the Yea and Nay votes combined.
Pass votes are not counted in this equation.

If the proposal meets both of those standards, it moves to the Cooldown period.
If not, it fails and a new Proposal period starts.

### 3. Cooldown period

The Cooldown period is a delay in the process that gives users time to review and test the new version of the protocol.
The community sets up test networks that use the new version of the protocol.
Users verify that the protocol update works, see how their baking infrastructure works with it, and discuss the proposal.

### 4. Promotion period

At the end of the Cooldown period, the Promotion period begins, which is the last vote.
In this period, users decide whether to adopt the proposal into Mainnet.

The voting requirements are the same as in the Exploration period, including the quorum and supermajority.

If the proposal passes, it moves to the Adoption period.
If it fails, a new Proposal period starts.

### 5. Adoption period

The Adoption period is a delay in the process that gives developers and bakers additional time to adapt their code and infrastructure to the new protocol.
At the end of the Adoption period, Mainnet automatically enables the new protocol and a new Proposal period begins.

## References

- [The Amendment (and Voting) Process](https://tezos.gitlab.io/active/voting.html) in the Octez documentation
- [Amending Tezos](https://medium.com/tezos/amending-tezos-b77949d97e1e) on Medium
