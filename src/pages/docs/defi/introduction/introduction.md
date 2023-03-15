---
id: introduction
disable_pagination: true
title: Introduction
slug: /defi
author: Aymeric Bethencourt
---

## What is _DeFi_?

_DeFi_ is an acronym of **De**centralized and **Fi**nance:

* The word _Finance_ refers to all the traditional financial tools and services that have existed since antiquity, such as buying or selling currencies, transferring, borrowing, lending money, trading, betting, insuring, etc.

* The word _Decentralized_ refers to the structure of blockchain and how each protocol runs on a multitude of servers (or nodes) worldwide, guaranteeing peer-to-peer, quick, synchronized, uncensorable, immutable, and non-retractable transactions. Moreover, these transactions are visible, transparent, and auditable by anyone.

Mixing these two allows the re-creation of financial services previously only available through centralised financial entities such as banks, exchanges, insurance companies, etc.
Although the DeFi movement started by reproducing the existing centralized financial models in a decentralized manner (i.e., smart contracts copied and reproduced the order book model), it soon shifted to the creation of altogether new opportunities that were available thanks to the decentralized nature of the blockchain (i.e., smart contracts creating [_automated market markers_](/defi/dexs)) and thus things previously impossible in traditional finance.

The objective of DeFi is to create added financial value, that is accessible to everyone, decentralized, instantaneous, transparent, and to cut out the middlemen to execute transactions, create and manage savings, trade, and obtain returns on financial assets without the need for a central authority.

DeFi tools and services are often compared to **Money Bricks** [[1]](/defi#references). Instead of creating an isolated software from the ground up (as banks do), DeFi tools and services usually take advantage of the whole ecosystem in place and integrate themselves within them just like bricks would with each-other. For instance, decentralized exchanges (_DEXs_ for short) rely on tokens, stable coins, and oracles, which themselves rely on token standards, smart contracts, and the blockchain consensus. Additionally, we find that DeFi apps built on top of other DeFi apps, e.g., swapping apps, yield farming, lending, insurances, etc., built on top of DEXs.
Like bricks, DeFi applications can layer on top of each other and build the foundation needed to create completely decentralized financial ecosystems — cutting out the middle man (banks, insurance companies, etc.) to reduce the costs and making services more inclusive.

<p align="center">

![money-bricks](money-bricks.svg)
<small className="figure">FIGURE 1: Illustration of DeFi as <i>Money Bricks</i> (in no particular order).</small>

</p>

## DeFi on Tezos

In this module, we are going to learn more about the main areas where DeFi has been revolutionizing finance [[2]](/defi#references) and what solutions have been or are currently being developed on Tezos. Mainly:

[Token Standards](/defi/token-standards): Tokens represent a way of exchanging value, e.g., money, collectables, tokenized assets. A token standard ensures that all the smart contracts implementing it are compatible with the ecosystem (e.g., a wallet compatible with a token standard can work with all the token implementing this standard).<br />**On Tezos**: The latest token standard is [FA2](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) (standing for _Financial Application 2_), and it supports a wide range of token types: fungible, non-fungible, non-transferable, as well as multi-asset contracts.

[Decentralized Exchanges](/defi/dexs): This exchange refers to ones that enable the trading of various digital assets in a peer-to-peer form. This form bypasses the need for an intermediary or a centralized, single party.<br />**On Tezos**: You can trade _tez_ and related _FA2_ supported assets on [Vortex](https://app.vortex.network/), [Youves](https://app.youves.com/), [Spicy](https://spicyswap.xyz), [Quipuswap](https://quipuswap.com/), [Plenty DeFi](https://www.plentydefi.com/) and [Crunchy Network](https://app.crunchy.network/).

[Wrapped Assets](/defi/wrapped-assets): A wrapped asset allows the trading and exchange of an asset between different blockchain network. For instance, you cannot trade native BTC on Tezos. However, it is possible to wrap BTC into an _FA2_ token (such as [tzBTC](https://tzbtc.io/)) that is stable in price with to BTC, and always exchangeable back to a BTC, and fully compatible with all the tools and smart contracts using _FA2_ on the Tezos network.<br />**On Tezos**: We've seen the addition of [Wrapped XTZ (wXTZ)](https://medium.com/stakerdao/the-wrapped-tezos-wxtz-beta-guide-6917fa70116e), [Wrapped Bitcoin (tzBTC)](https://tzbtc.io/), [Wrapped ETH (ETHtz)](https://decrypt.co/51860/wrapped-eth-comes-to-tezos-as-it-takes-on-ethereum-defi-market).

[Cross-Chain Swaps](/defi/cross-chain-swaps): A _cross-chain swap_ (also referred to as an _Atomic Swap_) refers to the action of exchanging tokens from two different blockchains in a peer-to-peer fashion without using a third party. This is possible thanks to the ability of code locking mechanisms known as **Hash Time Locked Contracts (HTLCs)** into blockchain transactions.<br />**On Tezos**: [Plenty Bridge](https://www.plentydefi.com/bridge) enables cross-chain swaps between Ethereum and Tezos.

[On-Chain Oracles](/defi/oracles): By default, a Tezos smart contract cannot receive any data from outside the blockchain. **Oracles**, therefore, offers to receive data from off-chain sources and make it available on-chain. Information such as token price and much more can be obtained. Trust can be guaranteed through the amalgamation of multiple sources.<br />**On Tezos**: [Harbinger oracles](https://medium.com/@Blockscale/introducing-harbinger-a-self-sustaining-price-oracle-for-tezos-7cab5c9971d) provide this service as well as Kaiko. A [Chainlink integration](https://www.coindesk.com/tezos-blockchain-chainlink-oracle-services) is expected in the near future by the SmartPy team.

[Stablecoins](/defi/stablecoins): A **stablecoin** is a cryptocurrency whose price is fixed to another asset. Most stablecoins are pegged (fixed) to fiat currencies (currencies issued by a central bank) like the US Dollar.<br />**On Tezos**: Several stable coins are available, among which [Tether USDT](https://tzkt.io/KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o/operations/), [Kolibri (kUSD)](https://kolibri.finance/), [USDtez](https://usdtz.com/), [uUSD Youves](https://tzkt.io/KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW/tokens/0/transfers), [Wrapped USDC](https://tzkt.io/KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY/tokens/2/transfers).

[Synthetics](/defi/synthetics): Synthetics are contracts between two parties that both bet on an opposite outcome for the value of an asset and make profits or losses on the outcome. The actual asset is not purchased in this contract. This is interesting for assets that have very low liquidity, are hard to transact, or are not available to trade.<br />**On Tezos**: [Youves](https://story.madfish.solutions/youves-the-synthetic-asset-platform-on-tezos/) is a synthetics exchange.

[Lending protocol](/defi/lending): Loans allow you to borrow or lend tokens to someone in exchange for interests.<br />**On Tezos**: [Yupana Finance](https://app.yupana.finance/lending) is a lending/borrowing protocol recently launched on tezos Mainnet.

## References

<small>

[1] [The building blocks of decentralized exchange (DEX) explained](https://medium.com/coinmonks/the-building-blocks-of-decentralized-exchanges-on-defi-explained-5cd6756bd3e9).

[2] <https://wiki.tezosagora.org/learn/uses-of-tezos/defi>

[3] <https://www.latribune.fr/opinions/tribunes/qu-est-ce-que-la-defi-cette-finance-decentralisee-prete-a-changer-les-regles-du-jeu-858938.html>

</small>
