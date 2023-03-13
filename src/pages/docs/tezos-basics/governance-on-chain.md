---
id: governance-on-chain
title: Governance on-chain
authors: Thomas Zoughebi, Aymeric Bethencourt, and Maxime Fernandez
---

Tezos is a self-amending blockchain network that incorporates an on-chain mechanism for proposing, selecting, testing, and activating protocol upgrades *without needing to use hard forks* [[1]](/tezos-basics/governance-on-chain#references).

## What is self-amendment?

Tezos is a blockchain that can improve itself over time by using a formalized process of upgrade to its protocol. In practice, it is similar to the structure of a corporation, where shareholders get to vote on a future direction for the corporation.

Many other blockchains do not have any form of formal governance structure. Consequently, new projects are often decided by a small group and imposed on the whole ecosystem. This process can results in *hard forks*, when participants don't agree with the decisions. This can split the chain into two or more chains that can co-exist and split the community. Self-amendment aims to avoid this scenario, by allowing token holders to vote on the future development of the blockchain.

## Definitions of the main concepts

* **Baking**: The creation of new blocks on the Tezos blockchain by its validator nodes (aka *bakers*), who receive compensation for each new block produced.

* **Delegation**: All holders of the Tez crypto-currency can delegate their baking and voting rights to a baker called a *delegate*, while still maintaining control of their funds.

* **Proposal**: A request for addition, adjustment, or removal of a protocol's feature. In exchange for their work on the proposal, some delegates can put a symbolic self-reward into the new protocol. If their proposal is accepted, they will receive the reward.

* **Voting power**: The stake of a delegate is measured in mutez. Their voting power is equal to the mutez they put at stake directly, as well as the mutez from all the accounts who delegated their balance to them. The stake of each delegate is computed at the beginning of each period.

* **Super majority**: The super-majority is reached for a vote if the cumulated stake of *Yay* ballots is greater than 80% of the cumulated stake of *Yay* and *Nay* ballots. Note that *Pass* ballots do not count towards or against the super-majority.

* **Cycle**: The time equal to the creation of 8,192 blocks on Tezos. At 30 seconds per block, if all bakers produce blocks as expected, that's around 2 days and 20 hours.

## Five periods

The self-amendment process is composed of five periods:

1. **Proposal Period**: delegates propose amendments and select one to continue with.
2. **Exploration Vote Period**: delegates vote whether to continue with the selected proposal.
3. **Cooldown Period**: the community gets some time to test and discuss the proposal.
4. **Promotion Vote Period**: delegates vote on whether to activate this proposal or not.
5. **Adoption Period**: the community gets some time to prepare for the activation.

Each of these five periods lasts five baking cycles (i.e. 40,960 blocks or roughly 14 days), taking almost two months from the proposal to activation.

Should there be any failure in a given period, the whole process will revert to the *Proposal Period* (1.), effectively aborting and restarting the process.

:::info
To follow the amendment process, check the current period, and follow the voting process, go to Tezos Agora [[2]](/tezos-basics/governance-on-chain#references).
:::

### 1. Proposal Period

The Tezos amendment process begins with the *Proposal Period*, during which delegates can submit proposals on-chain. The delegates submit a proposal by submitting the hash of the source code.

In each *Proposal Period*, delegates can submit up to 20 proposals. **A proposal submission also counts as a weighted vote** (proportionally to their staking balance at the beginning of the period).

Delegates can upvote up to 20 proposals.

A submission must receive **a minimum of 5% of approval** to access the next stage (2. *Exploration Vote Period*).

At the end of the *Proposal Period*, the network counts proposal votes, and the most-upvoted submission proceeds to the *Exploration Vote Period* (2.).

If there are no proposal, if there is a tie, or if the most-upovted submission receives less than 5% of approval, then a new *Proposal Period* (1.) begins.

### 2. Exploration Vote Period

Starting from the *Exploration Vote Period* period, there is only one proposal left, the top-ranked proposal form the previous *Proposal Period*.

The community can focus the discussions and tests on this specific proposal. Dedicated test networks are created.

Delegates get to vote either *Yea*, *Nay* or *Pass* on this specific submission.

If the voting participation fails to achieve the *Quorum* or if the 80% *Super-Majority* is not reached, the amendment process restarts from the beginning of the *Proposal Period* (1.). Otherwise, it moves on to the *Cooldown period (3.)*.

The details of how the *Quorum* is computed is explained in the [*Quorum computation*](#quorum-computation) section.

### 3. Cooldown Period

If a proposal is approved in the *Exploration Vote Period* (2.), the *Cooldown Period* begins.

The only purpose of this period is to let some time elapse before the promotion period, to give the community more time to discuss and test the proposal, and for delegates to think about how they will vote at the next period.

### 4. Promotion Vote Period

At the end of the *Cooldown Period* (3.), the *Promotion Vote Period* (4.) begins. The network decides whether to adopt the amendment based on previous off-chain discussions and its behaviour (in 3.). The voting rules are identical to the *Exploration Voting Period* (2.) (settlement in the "*Super-Majority*" and "*Quorum*" sections).

At the end of the *Promotion Vote Period*, the network counts the number of votes. If the participation rate reaches the minimum quorum and a 80% *Super-Majority* of non-passing delegates vote in *Yea*, then the amendment proceeds to the *Adoption period* (5.). If not, then the process reverts to the *Proposal Period* (1.). The minimum vote participation rate is based on past ones.

### 5. Adoption period

*Adoption period* provides some time for ecosystem to get ready for the activation. This inculudes updating the dev tools.

After this phase, the mainnet activation is complete.

This entire process has been completed successfully a number of times. Check the list of activated amendments in the [History of amendments](/tezos-basics/history-of-amendments) chapter.

## Amendment Process Diagram

The diagram below sums up the self-amendment process:

<p align="center">

![governance-mechanism](Governance_mechanism_uml.svg)
<small className="figure">FIGURE 1: Self-amendment process</small>

</p>

## Quorum computation

During both the exploration and promotion periods, delegates can cast a single *Yay*, *Nay*, or *Pass* ballot. A ballot has a weight equal to the delegate’s stake.

For either of these two periods, the process continues to the next period if the vote participation reaches the expected quorum and there is a super-majority of *Yay*.

The *vote participation* is the ratio of all the cumulated stake of cast ballots (including *Pass* ballots) to the total stake.

The quorum is adjusted after each vote, to ensure that the amendment process can continue over time even if some delegates stop participating.

To do that, an exponential moving average [[3]](/tezos-basics/governance-on-chain#references) of the participation, `participation_ema`, is computed, using this formula:

```participation_ema = 80% of previous_participation_ema + 20% of the last vote_participation```.

The value of the expected quorum for the next period is then computed using this formula:

```expected_quorum = 0.2 + (0.7 - 0.2) * participation_ema```

This caps this expected quorum between 20% and 70%, to prevent it from getting unreasonably high or too low.

<p align="center">

![governance-quorum-computation](Governance_quorum_computation.svg)
<small className="figure">FIGURE 2: Quorum computation</small>

</p>

More details can be found in the developer documentation [[5]](/tezos-basics/governance-on-chain#references) and directly in the source code [[6]](/tezos-basics/governance-on-chain#references).

## Voting examples

Let's illustrate this process:

### Example 1

Let us assume the following at the beginning of the *Exploration Period* (2.):

* The delegates accumulate a total stake of 115 281 tez.
* The participation_ema is at 64.2%.
* The expected quorum is therefore 52.1%.
* The total stake of bakers who voted for each option is the following:
  * Yay: 39 594 tez
  * Nay: 0 tez
  * Pass: 27594 tez

The *vote participation* is therefore:

$$
  \text{participation}=\frac{(39594+0+27594)}{115281}=58.28\%
$$

The participation is therefore higher than the expected quorum of 52.1%.

The percentage of Yay is:

$$
  \text{yay\_rate}=\frac{39594}{(39594 + 0)}=100\%
$$

100% is more than 80%, so the *Super Majority* is reached.

For the next period, the new participation_ema will be:

$$
  \text{participation\_ema}=0.8\times64.12\%+0.2\times58.28\%=62.95\%
$$

The new expected quorum will be:

$$
  \text{expected\_quorum}=0.2+(0.7-0.2)\times62.95\%=51.48\%
$$

### Example 2

Let us now assume the following at the beginning of the *Promotion Period* (4.):

* The delegates still accumulate a total stake of 115 096 tez.
* The participation_ema, is at 62.95%.
* The expected quorum is 51.48%.
* The total stake of bakers who vote for each option is the following:
  * Yay: 26 589 tez
  * Nay: 7 423 tez
  * Pass: 28 139 tez

The *vote participation* is therefore:

$$
  \text{participation}=\frac{(26589+7423+28139)}{115096}=54\%
$$

The participation is therefore higher than the quorum of 51.48%.

The percentage of Yay is:

$$
  \text{yay\_rate}=\frac{26589}{(26589 + 7423)}=75.17\%
$$

75.17% is less than 80%, so the *Super Majority* is not reached.

**The proposal is rejected**.

For the next period, the new participation_ema will be:

$$
  \text{participation\_ema}=0.8\times62.95\%+0.2\times51.48\%=60.66\%
$$

The new expected quorum will be:

$$
  \text{expected\_quorum}=0.2+(0.7-0.2)\times60.66\%=50.33\%
$$

## Operations and CLI commands

Delegates can send two operations: "*Proposals*" and "*Ballot*", during the voting periods.

Using `octez-client`, you can use the following command to show the status of a voting period. It displays different informations depending on the current type of period:

```shell
octez-client show voting period
```

### The "*Proposals*" operation

Te *proposals* operation is used both to submit new proposals, or to upvote already submitted proposals.

It is only possible to submit a proposal operation during the *Proposal Period* (1.).

Description:

```text
Proposals : {
  source: Signature.Public_key_hash.t ;
  period: Voting_period_repr.t ;
  proposals: Protocol_hash.t list ; 
}
```

Where:

* `source` is the delegate's public key hash

* `period` is the unique identifier of each voting period

* `proposals` is a non-empty list of maximum 20 protocol hashes.

This operation [[4]](/tezos-basics/governance-on-chain#references) can be submitted more than once but only if the cumulative number of active proposals is less than 20. Each time a delegate duplicates a proposal, a vote is counted with the 20 vote maximum applying.

Using `octez-client` during a **proposal period**, a list of proposals can be submitted with:

```shell
octez-client submit proposals for <delegate> <proposal1> <proposal2> ...
```

### The "*Ballot*" operation

It is only possible to submit a ballot operation during the *Exploration Vote Period* (2.) or the *Promotion Vote Period* (4.), and only once per period.

Description:

```text
Ballot : {
  source: Signature.Public_key_hash.t ;
  period: Voting_period_repr.t ;
  proposal: Protocol_hash.t ;
  ballot: Vote_repr.ballot ; 
}
```

Where:

* `source` is the delegate's public key hash

* `period` is the unique identifier of each voting period

* `proposal` is the selected protocol hash.

* `ballot` is one of the possible ballot response: `Yea`, `Nay`, or `Pass`

Remember that `Pass` means to abstain from voting for or against a proposal but still allowing a delegate to reach the quorum.

Using `octez-client` and during a voting period (being an **Exploration** or a **Promotion** *vote period*), ballots can be submitted only once by a delegate with the following command:

```shell
octez-client submit ballot for <delegate> <proposal> <yay|nay|pass>
```

## What have we learned so far?

In this chapter, we learned how Tezos allows on-chain decentralized governance without hard forks' troubles. To do this, Tezos splits amendments into five different periods that we defined and detailed.

In the next "*History of Amendments*" chapter, we will go over a short history of past proposals, both approved and refused, and look at why.

## References

[1] <https://medium.com/tezos/amending-tezos-b77949d97e1e>

[2] <https://www.tezosagora.org>

[3] <https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average>

[4] <https://tezos.gitlab.io/alpha/voting.html#operations>

[5] <https://tezos.gitlab.io/alpha/voting.html>

[6] <https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/amendment.ml>
