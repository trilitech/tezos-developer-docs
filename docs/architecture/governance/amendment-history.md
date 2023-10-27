---
id: history-of-amendments
title: History of amendments
authors: 'Thomas Zoughebi, Aymeric Bethencourt, and Maxime Fernandez'
lastUpdated: 30th June 2023
---

As presented in the [Governance on-chain chapter](/tezos-basics/governance-on-chain), the Tezos blockchain is constantly evolving, through new amendments. In this chapter, we will present an overview of past proposals and the reasons for their approval or disapproval.

## [Athens](https://tezos.gitlab.io/protocols/004_Pt24m4xi.html) (Pt24m4xiP)

Athens was autonomously [activated](https://tzstats.com/458753) in May 2019.

*Athens* was the first proposed protocol amendment for Tezos. Two proposals - [Athens A](https://www.tezosagora.org/proposal/Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd) and [Athens B](https://www.tezosagora.org/proposal/Psd1ynUBhMZAeajwcZJAeq5NrxorM6UCU4GJqxZ7Bx2e9vUWB6z) - were proposed by [Nomadic Labs](https://blog.nomadic-labs.com/athens-our-proposals-for-the-first-voted-amendment.html) in February 2019.

Of the two proposals, _Athens A_ sought to increase the gas limit and reduce the required roll size for baking from 10,000 tez to 8,000 tez. _Athens B_ only sought to increase the gas limit. Athens A was voted with a _Super-majority_ and was autonomously [activated](https://twitter.com/tezos/status/1133907926907797504) into the protocol in May 2019.

For a full list of changes, be sure to read this corresponding [blog post](https://blog.nomadic-labs.com/athens-proposals-injected.html) from Nomadic Labs and [reflections](https://medium.com/tqtezos/reflecting-on-athens-the-first-self-amendment-of-tezos-4791ab3b1de1) by Jacob Arluck, and the [reference documentation](https://tezos.gitlab.io/protocols/004_Pt24m4xi.html).

## [Brest A](https://www.tezosagora.org/proposal/PtdRxBHvc91c2ea2evV6wkoqnzW7TadTg9aqS9jAn2GbcPGtumD) (PtdRxBHv)

*Brest A* was the first proposed amendment rejected during the _Exploration Period_. Submitted in June 2019, it received only 0.35% of the votes during the _Proposal Period_. But as it had no competition, the system promoted it. The amendment was then rejected in the _Exploration Period_ with only 0.26% of favourable votes. The 80% _Super-majority_ was not reached, and neither was the minimum _Quorum_ required to validate it.

This proposal would have fixed a security breach linked to the rehashing push during the _Athens_ protocol change. Moreover, it would have facilitated the amendment's invoice tracking. But the invoice for this proposal, 6,000 tez, was much higher than the usual cost.

## [Babylon](https://tezos.gitlab.io/protocols/005_babylon.html) (PsBABY5HQ)

Babylon was autonomously [activated](https://tzstats.com/655361) in October 2019.

The *Babylon* proposal was made of two proposals made in July/August 2019: [Babylon](https://www.tezosagora.org/proposal/PsBABY5nk4JhdEv1N1pZbt6m6ccB9BfNqa23iKZcHBh23jmRS9f) and [Babylon 2](https://www.tezosagora.org/proposal/PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU). After receiving feedback on the first _Babylon_ proposal, the core teams proposed a new tweaked version in the same proposal period.

Notable changes included a new variant of the consensus algorithm (`Emmy+`). There were new Michelson features and accounts rehaul to aid smart contract developers. The accounts rehaul enabled a clearer distinction between "_tz_" and "_KT_" addresses. Furthermore, there was a refinement of the Quorum formula and the addition of the 5% threshold.

For a full list of changes, be sure to read the corresponding blog posts from [Nomadic Labs](https://blog.nomadic-labs.com/babylon-proposal-injected.html), and [Cryptium Labs](https://medium.com/metastatedev/on-babylon2-0-1-58058d9d2106) (Metastate), and the [reference documentation](https://tezos.gitlab.io/protocols/005_babylon.html).

## [Carthage](https://www.tezosagora.org/proposal/PtCarthavAMoXqbjBPVgDCRd5LgT7qqKWUPXnYii3xCaHRBMfHH) (PtCarthav)

*Carthage* was the first proposal to be rejected during the _Proposal Period_. Since the _Babylon_ change, it now took a minimum of 5% approval to move to the _Exploration Period_ and _Carthage_ only obtained 3.5%.

The purpose of this proposal was to increase the gas limit per block and per operation by 30% to improve the accuracy of the existing formula used for calculating baking, endorsing rewards, and to fix various minor issues.

## [Carthage 2.0](https://tezos.gitlab.io/protocols/006_carthage.html) (PsCARTHAG)

*Carthage 2.0* was autonomously [activated](https://tzstats.com/851969) in March 2020.

Notable changes included increasing the gas limit per block and per operation by 30%, improving the accuracy of the formula used to calculate baking and endorsing rewards, as well as several minor improvements to Michelson. The main difference with _Carthage_ was the new and more secure formula to calculate rewards.

For a full list of changes be sure to read the corresponding [changelog](https://tezos.gitlab.io/protocols/006_carthage.html#changelog) and blog posts from [Nomadic Labs](https://blog.nomadic-labs.com/carthage-changelog-and-testnet.html) and [Cryptium Labs](https://medium.com/metastatedev/updating-the-potential-carthage-proposal-and-resetting-the-carthagenet-test-network-f413a792571f) (Metastate).  You may also check the [reference documentation](https://tezos.gitlab.io/protocols/006_carthage.html).

## [Delphi](https://tezos.gitlab.io/protocols/007_delphi.html) (PsDELPH1K)

*Delphi* was autonomously [activated](https://tzstats.com/1212417) in November 2020.

Notable changes included improving the performance of the Michelson interpreter, improving gas costs by adjusting the gas model, reducing storage costs by 4 times, and various minor fixes.

For a full list of changes, be sure to read the corresponding [changelog](https://blog.nomadic-labs.com/delphi-changelog.html#007-delphi-changelog) and blog post from [Nomadic Labs](https://blog.nomadic-labs.com/delphi-official-release.html). You may also check the [reference documentation](https://tezos.gitlab.io/protocols/007_delphi.html).

## [Edo](https://tezos.gitlab.io/protocols/008_edo.html) (PtEdo2Zk)

*Edo* was autonomously [activated](https://tzstats.com/1343489) in February 2021.

Edo added two major features to Tezos smart contracts:

* [*Sapling*](https://z.cash/upgrade/sapling/) and [*BLS12-381*](https://electriccoin.co/blog/new-snark-curve/) to enable privacy-preserving smart contracts

* [*Tickets*](https://medium.com/tqtezos/tickets-on-tezos-part-1-a7cad8cc71cd) for native on-chain permissions and assets issuance.

Among other features, Edo also updated the Tezos amendment process by lowering the period length to 5 cycles and by adding a 5th *Adoption Period*.

For more information check the [reference documentation](https://tezos.gitlab.io/protocols/008_edo.html).

## [Florence](https://tezos.gitlab.io/protocols/009_florence.html) (PsFLorena)

*Florence* was autonomously [activated](https://tzstats.com/1466368) in May 2021.

Florence's notable bug fixes and improvements are the:

* Increasing maximum operation size

* Improved gas consumption for the execution of more complex smart contracts

* Changing inter-contract calls to a [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) ordering, as opposed to [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) ordering

* The elimination of the test chain activation
  
[*Bakings Accounts*](https://midl-dev.medium.com/tezos-in-favor-of-baking-accounts-3886effa370c) was also included in the feature set. However, ongoing testing uncovered some important and previously undocumented breaking changes in the proposal with *Baking Accounts*. Hence, the feature was postponed until a thorough audit of the functionality was completed or an alternative implementation was produced. The version of *Florence* without *Baking Accounts* was considered a [safer choice](https://research-development.nomadic-labs.com/baking-accounts-proposal-contains-unexpected-breaking-changes.html).

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/florence-our-next-protocol-upgrade-proposal.html) and [Tarides](https://tarides.com/blog/2021-03-04-florence-and-beyond-the-future-of-tezos-storage), as well as the [reference documentation](https://tezos.gitlab.io/protocols/009_florence.html).

## [Granada](https://tezos.gitlab.io/protocols/010_granada.html) (PtGRANAD)

*Granada* was autonomously [activated](https://tzstats.com/1589248) in August 2021.

Granada's main changes are:

* Emmy*, a new consensus algorithm with reduced time between blocks (30s), and faster finality.

* Liquidity Baking, increasing the liquidity of tez by minting some at every block into a CPMM (Constant Product Market Making smart contract).

* The reduction of gas consumption of smart contracts by a factor of three to six, through a number of performance improvements.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/granada-the-latest-tezos-upgrade-is-live.html) and the [reference documentation](https://tezos.gitlab.io/protocols/010_granada.html).

## [Hangzhou](https://tezos.gitlab.io/protocols/011_hangzhou.html) (PtHangz2)

*Hanghzou* was autonomously [activated](https://tzstats.com/1916929) in December 2021.

Hangzhou's main changes are:

* [Timelock](https://research-development.nomadic-labs.com/timelock-a-solution-to-minerblock-producer-extractable-value.html) encryption, a feature that helps smart contracts protect against Block Producer Extractable Value

* Views, a new kind of entrypoints that gives easy access to some internal data to other smart contracts.

* Caching of regularly accessed data, to lower the associated gas cost.

* A global table of constants, where constant Michelson expressions can be registered and made available to all contracts.

* Context flattening, an optimized rewrite of the protocol's database internals.

For more information, see the blog post from [Marigold](https://www.marigold.dev/post/hangzhou-the-latest-tezos-upgrade-is-live) and the [reference documentation](https://tezos.gitlab.io/protocols/011_hangzhou.html).

## [Ithaca](https://tezos.gitlab.io/protocols/012_ithaca.html) (Psithaca2)

*Ithaca* was autonomously [activated](https://tzstats.com/2244609) in April 2022.

Along with numerous minor improvements, Ithaca contained two major updates to the protocol:

* Tenderbake, a major update to the Tezos consensus algorithm, that brings fast deterministic finality to the Tezos protocol. It also includes important changes:
    - bakers now receive rewards depending on their current stake instead of the number of rolls they own
    - the minimum number of tokens required to be selected as a validator is reduced from 8,000 tez to 6,000 tez
    - a rework of baking and endorsements rewards
    - a new security deposit mechanism requiring delegates to freeze 10% of their stake in advance, to obtain baking and endorsement rights.
    - an increase in the number of endorsement slots per block from 256 to 7,000

* Precheck of operations: a new set of features that can be used by any Tezos shell, to avoid having to fully execute manager operations before gossiping them through the network

* Adding approximately ten months to the liquidity baking sunset level.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/announcing-tezos-9th-protocol-upgrade-proposal-ithaca.html) and the [reference documentation](https://tezos.gitlab.io/protocols/012_ithaca.html).

## [Jakarta](https://tezos.gitlab.io/protocols/013_jakarta.html) (PtJakart2)

*Jakarta* was autonomously [activated](https://tzstats.com/2490369) in June 2022.

Jakarta's main changes are:

* Transactional optimistic rollups (or TORU), an experimental implementation of optimistic rollups on Tezos. TORU provide a way to enable higher throughput (TPS) of transactions by moving their validation away from the main chain, to 'Layer 2'.

* A new improved design for the integration of Sapling transactions into Smart Contracts. The Sapling protocol uses advanced cryptography to enable the protection of users' privacy and transparency with regard to regulators.

* A redesign and renaming of the Liquidity Baking Escape Hatch mechanism, now called "Liquidity Baking Toggle Vote".

* Various improvements to type safety and performance of the Michelson interpreter, including decreasing gas costs for parsing and unparsing scripts. Furthermore, Michelson now ignores annotations.

* A new mechanism was introduced to explicitly track ownership of tickets in the protocol. This adds extra protection against attempts to forge tickets and facilitates Layer 2 solutions that use tickets to represent assets that can be exchanged with the main chain.

* The voting power of delegates is now defined directly by their stake expressed in mutez, and no more in terms of rolls. The minimal stake required to be assigned voting rights is kept at 6000 tez.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/announcing-jakarta-two.html) and the [reference documentation](https://tezos.gitlab.io/protocols/013_jakarta.html).

## [Kathmandu](https://tezos.gitlab.io/protocols/014_kathmandu.html) (PtKathman)

*Kathmandu* was autonomously [activated](https://tzstats.com/2736129) in September 2022.

Kathmandu's main changes are:

* Pipelined validation of manager operations, increasing throughput, without compromising the network’s safety. This ongoing project reduces the need to fully execute time-expensive operations (like smart contract calls), before they reach a baker, resulting in a faster propagation of new blocks and operations across the network.

* Improved randomness with the integration of Verifiable Delay Functions (VDF) into the protocol’s random seed generation, reinforcing the security of the rights allocation mechanism.

* Event logging in Michelson smart contracts enabling DApps developers to send on-chain custom messages in order to trigger effects in off-chain applications (wallets, explorers, etc.).

* A new operation for increasing paid storage of a smart contract allowing DApps developers to pay the storage fees on behalf of their users.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/announcing-tezos-11th-protocol-upgrade-proposal-kathmandu.html) and the [reference documentation](https://tezos.gitlab.io/protocols/014_kathmandu.html).

## [Lima](https://tezos.gitlab.io/protocols/015_lima.html) (PtLimaPt)

*Lima* was autonomously [activated](https://tzstats.com/2981889) in December 2022.

In addition to improvements to enable higher Layer 1 throughput, the main feature of Lima is:

* Consensus keys: bakers can now create a dedicated key for signing blocks and consensus operations without changing the baker’s public address.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/announcing-tezos-12th-protocol-upgrade-proposal-lima.html) and the [reference documentation](https://tezos.gitlab.io/protocols/015_lima.html).

## [Mumbai](https://tezos.gitlab.io/protocols/016_mumbai.html) (PtMumbai)

*Mumbai* was autonomously [activated](https://tzstats.com/3268609) in March 2023.

Mumbai's main changes are:

* Smart rollups: Tezos enshrined rollups are enabled and provide a powerful scaling solution allowing anyone to deploy decentralized WebAssembly applications with dedicated computational and networking resources.
* Minimal block time reduction from 30s to 15s.
* Ticket transfers between user accounts.

For more information, see the blog post from [Nomadic Labs](https://research-development.nomadic-labs.com/mumbai-announcement.html) and the [reference documentation](https://tezos.gitlab.io/protocols/016_mumbai.html).

## What have we learned so far?

In this chapter, we went through the past proposals' history and how and why they were approved or rejected.

In the next chapter, we will see the details of operations costs and various rewards calculations.
