---
title: Tezos overview
last_update:
  date: 15 August 2024
---

Tezos is an open-source, decentralized blockchain [created in 2014](https://tezos.com/whitepaper.pdf) by Arthur and Kathleen Breitman. It raised awareness and support in 2017 with its crowdfunding and launched the following year. Since its inception, Tezos has gone through multiple iterations of upgrades and development, staying true to its ethos -- "a blockchain designed to evolve".

Tezos has robust applications ranging from NFTs, DeFi, and gaming to enterprise and government use cases.

At its core, Tezos is a worldwide network of computers called _nodes_, which anyone can run.
The nodes all run the _Tezos protocol_, which is software that controls how the nodes communicate and agree on what to do.
The result is a _decentralized_ computing platform that no one person or entity can control.

## What can I do with Tezos?

Developers can imagine Tezos as a computing platform that is spread across many computers worldwide and is therefore transparent, independent, fair, automated, and controlled by its users.
They can do many of the same things with Tezos that they can with any other computing platform, but developers often use decentralized computing for these use cases:

- **Cryptocurrencies**: Users can create digital objects known as _tokens_ to be used as digital currencies and to make it easier to accept online payments.

- **NFTs**: Non-fungible tokens (NFTs) are unique digital items that can represent anything that their creator wants them to represent, including ownership of art and real-world objects, identity-related credentials like licenses and certifications, and digital-only artifacts such as video game items.

- **DeFi**: Decentralized finance (DeFi) allows innovative financial instruments such as automated loans and independent currency transfers.

- **DAOs**: Decentralized autonomous organizations (DAOs) are online-managed organizations where members vote on activities and officers and use tokens to represent membership and voting power.

- **Authentication**: The cryptographic nature of the Tezos blockchain allows users to digitally sign messages and transactions to prove their identity.

- **General decentralized computing**: Decentralized computing allows developers to write programs called _smart contracts_ and be assured that these programs will run as intended without censorship.

## Cutting-edge developments on Tezos

With recent Tezos upgrades heavily focusing on scaling solutions, Tezos has been at the forefront of blockchain research. Up to 1 million transactions per second (TPS) are theoretically possible on Tezos with the advent of [Smart Rollups](/architecture/smart-rollups), which have emerged as a strong scaling solution. With Smart Rollups (also known as optimistic rollups), transactions can be performed more quickly and cheaply and use other VMs that “roll up” their state changes onto Tezos.

[Etherlink](https://www.etherlink.com) is another exciting technology that greatly enlarges the possible applications and versatility of Tezos.
Etherlink builds on Smart Rollups and combines them with the [Data Availability Layer](/architecture/data-availability-layer) to provide an EVM-compatible Layer 2 solution which is truly decentralized, low-latency, and low-cost.

These innovations demonstrate the ongoing dedication of Tezos to foster innovation in the blockchain industry.

## What are some example applications of Tezos?

Here are some of the ways that people use Tezos:

### NFTs on Tezos

The rise of non-fungible tokens (NFTs) has become a core arena of activity and growth in the blockchain space, where new communities are growing around artists, musicians, and other creators with the use of blockchain tokens. NFTs allow collectors and fans to hold a piece of content produced by a creator, providing proof of ownership and secure exchanges on the blockchain.

[Objkt](https://objkt.com/), [FxHash](https://www.fxhash.xyz/), [Teia](https://teia.art/), [DNS.xyz](https://dns.xyz/) are some of the marketplaces for Tezos art and music NFTs.
They provide a platform for creators to mint and sell their work and for users to collect such works.

Tezos is also being used for other NFT-related projects, such as [MoneyTrack](https://moneytrack.io/), which is a payment platform that uses NFTs to control directed payment flows.

### Enterprise and government uses of Tezos

Enterprises and regulatory bodies have been adopting Tezos as well.

Tezos is being used by the French Armies and Gendarmerie's Information Center to [validate judicial expenses](https://cointelegraph.com/news/french-cybercrime-division-uses-smart-contacts-on-tezos-blockchain) incurred during investigations and record them on Tezos.

In recent years, the concept of Central Bank Digital Currencies (CBDCs) has gained traction, with several countries around the world exploring their own CBDC projects. Société Générale carried out a series of successful tests [using Tezos](https://decrypt.co/112127/societe-generales-crypto-division-lands-regulatory-approval-france) to explore the potential of CBDCs. In September 2020, the bank announced that it had completed a pilot program using a custom-built version of the Tezos blockchain to simulate the issuance and circulation of CBDCs. The pilot involved testing the technology's ability to handle transactions, make payments, and settle transactions in a digital environment.

The California DMV is also using Tezos for its project to [put car titles on the blockchain](https://fortune.com/crypto/2023/01/26/california-announces-dmv-run-blockchain-through-partnership-with-tezos/).

[Sword Group](https://www.sword-group.com/2020/09/28/sword-launches-tezos-digisign/) an international technology company, launched DigiSign, an open-source tool built on Tezos that enables users to digitally sign, certify, and verify the authenticity of digital documents.

### Tezos in gaming

Recently, the [Tezos Unity SDK](../unity) promises to make blockchain game development easier and faster. It allows for the addition of web3 features such as allowing players to link their accounts across games, mint, and trade in-game items and currencies, and show off their ranks and accomplishments on public, on-chain leaderboards.

## What makes Tezos different?

Here are some of the features that make Tezos different from other blockchains:

### Tezos can upgrade itself

Tezos has a built-in capability to upgrade itself, which allows the network to evolve without requiring a hard fork. Anyone can propose an upgrade to the protocol and have it adopted by the network without compromising the platform's stability or causing fragmentation. This feature allows Tezos to adapt regularly to new technologies and to address user needs rapidly. For more information, see [Governance](/architecture/governance).

### Everyone can participate in governance

Anyone who holds XTZ — the chain's native token — can propose or vote about changes to how Tezos works, such as changes to gas fees and block times, new features such as Smart Rollups, or even major changes like how the consensus mechanism works.

### Tezos uses proof of stake

The proof-of-stake consensus mechanism eliminates the need for high energy use, making it the "green" choice for blockchains. Instead of competing to achieve consensus as in proof-of-work mechanisms, Tezos nodes (called *bakers*) stake Tezos tokens to earn the right to create blocks and receive rewards. Users who want to participate without running a node themselves can delegate and stake tokens to a baker for a share of the rewards. Bakers and stakers keep control of their tokens in that they can unstake them later; and delegators keep complete control of their tokens.

Users who want to participate without running a node themselves can delegate and stake tokens to a baker for a share of the baker's rewards. Users retain full control of their delegated and staked tokens: delegated tokens remain always liquid, and staked tokens are frozen but remain in the user's account and can be unstaked at any point to make them liquid again after a short delay.
<!-- TODO link to more detailed info about delegating and staking from the non-baker perspective -->

The proof-of-stake model improves scalability and ensures cooperation via incentives. It also increases the cost of 51% attacks and avoids environmentally wasteful proof-of-work. Tezos launched in June 2018 as one of the first major proof-of-stake networks.

For more information about how Tezos handles proof of stake, see https://tezos.gitlab.io/alpha/proof_of_stake.html.
For more information about delegating and staking, see [Bakers](/architecture/bakers).

### Tezos accepts multiple languages

Tezos provides a few different languages for developers to choose from, according to their use case, including versions of Python and JavaScript/TypeScript. For more information, see [Languages](../smart-contracts/languages/).

## Tezos has a robust layer 2 ecosystem

Tezos provides tools that allow high scalability on a layer above the primary Tezos blockchain, known as layer 2. [Smart Rollups](/architecture/smart-rollups) can run large amounts of logic and handle large amounts of data in a separate environment without slowing Tezos itself down. The [Data Availability Layer](/architecture/data-availability-layer) provides high-throughput data to Smart Rollups.

The framework for these layer 2 systems is enshrined in the layer 1 protocol. All layer 2 activity is secured by verifiable commitments and attestations on layer 1.

## How do I get started working with Tezos?

To start using and developing on Tezos, see [Tutorials](../tutorials).

For more details on installing, using, or contributing to the platform, see the Octez documentation at https://tezos.gitlab.io/index.html.

For interactive learning material (including exercises) about Tezos concepts, the underlying technology, application development, and the ecosystem, see https://opentezos.com.

For other sources of information, see [Other resources and technical support](./resources).
