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

The proof-of-stake consensus model eliminates the need for high energy use, making it the "green" choice for blockchains. Instead of competing to achieve consensus as in proof-of-work models, Tezos nodes (called *bakers*) stake Tezos tokens to earn the right to create blocks and receive rewards. Tezos's approach to consensus has been described as [Liquid Proof of Stake](https://medium.com/tezos/liquid-proof-of-stake-aec2f7ef1da7).

Users who want to participate without running a node themselves can delegate and stake tokens to a baker for a share of the baker's rewards. Users retain full control of their delegated and staked tokens; delegated tokens remain liquid and staked tokens are frozen for a short time but remain in the user's account and can be made liquid after a short delay.
<!-- TODO link to more detailed info about delegating and staking from the non-baker perspective -->

The proof-of-stake model improves scalability and encourages cooperation via incentives. It also increases the cost of 51% attacks and avoids environmentally wasteful proof-of-work. Tezos launched in June 2018 as one of the first major proof-of-stake networks.

For more information about how Tezos handles proof of stake, see https://tezos.gitlab.io/alpha/proof_of_stake.html.

## Tezos accepts multiple languages

Tezos provides a few different languages for developers to choose from, according to their use case, including versions of Python and JavaScript/TypeScript. For more information, see [Languages](/smart-contracts/languages/).
