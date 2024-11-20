---
title: What makes Tezos different?
last_update:
  date: 29 November 2024
---

Here are some of the features that make Tezos different from other blockchains:

## Tezos can upgrade itself

Tezos has a built-in capability to upgrade itself, which allows the network to evolve without requiring a hard fork. Anyone can propose an upgrade to the protocol and have it adopted by the network without compromising the platform's stability or causing fragmentation. This feature allows Tezos to adapt regularly to new technologies and to address user needs rapidly. For more information, see [Governance](/architecture/governance).

## Everyone can participate in governance

Anyone who holds XTZ — the chain's native token — can propose changes to how Tezos works, such as changes to gas fees and block times, new features such as Smart Rollups, or even major changes like how the consensus mechanism works.

## Tezos uses proof of stake

The proof-of-stake consensus mechanism eliminates the need for high energy use, making it the "green" choice for blockchains. Instead of competing to achieve consensus as in proof-of-work mechanisms, Tezos nodes (called *bakers*) stake Tezos tokens to earn the right to create blocks and receive rewards. Users who want to participate without running a node themselves can delegate and stake tokens to a baker for a share of the rewards. Bakers and stakers keep control of their tokens in that they can unstake them later; and delegators keep complete control of their tokens.

Tezos' proof-of-stake mechanism improves scalability and encourages cooperation via incentives. It also increases the cost of consensus attacks and avoids environmentally wasteful proof-of-work. Tezos launched in June 2018 as one of the first major proof-of-stake networks.

For more information about how Tezos handles proof of stake, see https://tezos.gitlab.io/alpha/proof_of_stake.html.

## Tezos has a robust layer 2 ecosystem

Tezos provides tools that allow high scalability on a layer above the primary Tezos blockchain, known as layer 2. [Smart Rollups](/architecture/smart-rollups) can run large amounts of logic and handle large amounts of data in a separate environment without slowing Tezos itself down. The [Data Availability Layer](/architecture/data-availability-layer) provides high-throughput data to Smart Rollups.

The framework for these layer 2 systems is enshrined in the layer 1 protocol. All layer 2 activity is secured by verifiable commitments and attestations on layer 1.
