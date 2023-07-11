---
sidebar_position: 3
hide_table_of_contents: true
title: Tezos Improvement Process (TZIP)
hide_title: true
lastUpdated: 10th July 2023
---
## Tezos Improvement Process (TZIP)

As Tezos is a large decentralized project that is constantly evolving, it’s important for its members to have a mechanism of proposing improvements to the ecosystem. 

A Tezos Improvement Proposal \(or TZIP, pronounced "tee-zip"\) is a document that offers ways to improve Tezos via new features, tools, or standards \(e.g. smart contract specifications\).

Specifically, a TZIP is a design document providing information to the Tezos community, describing a feature for Tezos or its processes or environment, and supporting the formal protocol governance process. The TZIP process complements \(but is subsidiary to\) Tezos' formal on-chain governance process.

The TZIP document should contain a concise technical specification and rationale that clearly articulates what the proposal is, how it may be implemented, and why the proposal is an improvement. It should also include an FAQ that documents, compares, and answers alternative options, opinions, and objections.  
  
An explorer for all of the TZIPs, both past and present, can be found [here](https://tzip.tezosagora.org/).

### Key TZIP Standards

#### [**TZIP-7**](https://tzip.tezosagora.org/proposal/tzip-7/): Fungible Asset \(FA1.2\)

TZIP-7, more commonly referred to as FA1.2, introduced an [ERC20](https://eips.ethereum.org/EIPS/eip-20)-like fungible token standard for Tezos. At its core, FA1.2 contains a ledger that maps identities to token balances, provides a standard API for token transfer operations, as well as providing approval to external contracts \(e.g. an auction\) or accounts to transfer a user's tokens.

For those coming from [ERC20](https://eips.ethereum.org/EIPS/eip-20), the FA1.2 interface differs from ERC-20 in that it does not contain `transferfrom`, which has instead been merged into a single transfer entrypoint.   
The FA1.2 specification is described in detail in [TZIP-7](https://gitlab.com/tzip/tzip/blob/master/proposals/tzip-7/tzip-7.md), and several implementations of FA1.2 can be found [here](https://assets.tqtezos.com/docs/token-contracts/fa12/2-fa12-ligo/).



#### [**TZIP-10**](https://tzip.tezosagora.org/proposal/tzip-10/): Wallet Interaction

To enable the adoption of dApps in the Tezos ecosystem, a standard for the communication between these applications and wallets is needed. Tezos app developers shouldn't need to implement yet another wallet just for their use case, and users shouldn't need a multitude of wallets just so they can use a certain service.

TZIP-10 is a Tezos Improvement Proposal that specifies a standard way for dApps to interact with wallets. This standard then enables Tezos users to use their wallet of choice with Tezos dApps. For app developers, by using the TZIP-10 provider, they maximize the reach of their product to all users of TZIP-10 wallets.  
****

#### [**TZIP-12**](https://tzip.tezosagora.org/proposal/tzip-12/): Multi-Asset / NFT \(FA2\)

When implementing a token contract, many different factors must be taken into consideration. The tokens might be fungible or non-fungible, there can be a variety of transfer permission policies used to define how many tokens can be transferred, who can perform a transfer, and who can receive tokens. In addition, a token contract can be designed to support a single token type \(e.g. ERC-20 or ERC-721\) or multiple token types \(e.g. ERC-1155\), which could optimize batch transfers and atomic swaps of the tokens.

TZIP-12, more commonly referred to as FA2, is a standard that was proposed to provide improved expressivity to contract developers to create new types of tokens all while maintaining a common interface standard for wallet integrators and external developers.

A particular FA2 implementation may support either a single token type per contract or multiple tokens per contract, including hybrid implementations where multiple token kinds \(fungible, non-fungible, non-transferable etc\) can coexist \(e.g. in a fractionalized NFT contract\).  
****

#### [**TZIP-16**](https://tzip.tezosagora.org/proposal/tzip-16/): Contract Metadata

Contract metadata provides information that is not directly used for a contract's operation, whether about the contract's code \(e.g. its interface, versioning\) or the off-chain meaning of its contents \(e.g. an artwork corresponding to an NFT\).Tezos smart contracts lacked a standard way to access such important data, fragmenting access to useful information that is needed for a scalable integration experience by wallets, explorers, and applications.

To address this need and ease the integration, discoverability, and querying of Tezos smart contracts, TZIP-016 was proposed. TZIP-016 is a standard for encoding access to smart contract metadata in JSON format either on-chain using tezos-storage or off-chain using IPFS or HTTP\(S\).

TZIP-016 defines:

* A basic structure to find some metadata in a contract's storage.
* A URI scheme to find data: on-chain \(contract storage\) or off-chain \(web-services or IPFS\).
* An extensible JSON format \(JSON-Schema\) to describe the metadata 
* Optional entrypoints to validate metadata information 

#### [**TZIP-17**](https://tzip.tezosagora.org/proposal/tzip-17/): Permit & Meta-transactions

Transacting on the Tezos network requires users to pay gas in Tezos’ native token, tez. But what about those users who don’t have tez and want to complete a transaction on Tezos? Or users who want to avoid paying for individual contract calls \(e.g. [voting in a DAO](https://snapshot.page/)\) that could be batched

[TZIP-17](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-17/tzip-17.md) enables account abstraction: emulating multiple account types using standardized contract calls. This is done through pre-signing: a method to sign and submit Tezos transactions separately.

For instance, a “relayer” can submit a user’s pre-signed \(meta\) transaction and pay the tez fees on their behalf; a process called gas abstraction. This is especially convenient for subsidizing user onboarding, collecting multiple signatures when voting in a DAO, signing in a multisig, or batching transactions.

TZIP-17 enables developers to provide more native experiences for user onboarding and allows users to pay fees using the token \(e.g. a stablecoin\) used in the transaction. The relayer still pays transaction fees in tez at the protocol level and, because Tezos is Proof-of-Stake, these [transaction fees accrue to stakeholders](http://ex.rs/protocol-level-fees/) rather than just a small group of miners.

Ultimately, this brings the experience of using digital assets on Tezos more in line with that of traditional financial transactions and supports the use of Tezos as a settlement layer.  
****

#### [**TZIP-20**](https://tzip.tezosagora.org/proposal/tzip-20/): Off-chain Events

Off-chain events can be used for various purposes, but one of the most obvious use cases is indexing token balances.

However, it's not possible for the indexer to determine which particular balances have changed if the invoked method is not standardized \(e.g. FA2/FA1.2 transfer\), or if there was an initial token distribution at the origination.

The current approach is using custom handlers for known contracts. 

This approach is tied to a specific indexer implementation and is not scalable. Therefore we need a better alternative that is flexible enough to cover the majority of cases, simple enough to implement/integrate with the existing codebase, and not tied to any specific entity nor implementation.

A reasonable approach is to take all the custom logic out of the indexer and enable contract developers to write those pieces of logic. A suggested path is to reuse the TZIP-016 interface and introduce several new Off-chain View kinds for deriving token balance updates \(receipts\).  
****

#### [**TZIP-21**](https://tzip.tezosagora.org/proposal/tzip-21/): Rich Contract Metadata

This proposal is an extension of [TZIP-016](https://tzip.tezosagora.org/proposal/tzip-16/) and describes a metadata schema and standards for contracts and tokens.

This metadata standard aims to:

1. Simplify the creation of rich metadata for tokens and assets
2. Provide a commonly understood interface
3. Conform to existing and emerging standards
4. Allow global and international scope
5. Be extensible
6. Provide interoperability among ecosystem members \(contracts, indexers, wallets, libraries, etc\)

This standard also aims to be rich enough to describe a wide variety of asset and token types, from fungible tokens to semi-fungible tokens to nonfungibles.

#### [**TZIP-22**](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-22/tzip-22.md%20): Vanity Name Resolution Standard

Describes a generic smart contract interface for resolving names to Tezos addresses and vice versa.

Currently, indexers and wallets use nonstandard methods for associating addresses with human-readable names. They include using pre-configured \(in some cases hardcoded\) lists of names and addresses or making use of TZIP-16 metadata.

This presents some problems:

* Pre-configured lists are hard to maintain and prone to breaking.
* TZIP-16 metadata are published as part of a contract they relate to, which means the names are not globally unique nor authorative.
* Names and addresses for other types of use, like personal wallets, cannot be resolved.

This document proposes a name resolution interface that can be used by all products in the ecosystem to provide users with a consistent experience when mapping names and addresses.

\*\*\*\*

