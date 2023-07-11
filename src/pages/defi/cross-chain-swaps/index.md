---
id: cross-chain-swaps
title: Cross-chain Swaps
slug: /cross-chain-swaps
author: Aymeric Bethencourt
lastUpdated: 26th June 2023
---

## Swap scenarios

Let's consider the following scenario: Alice has 100 XTZ and wants to exchange them for 0.1 BTC from Bob. How does she do it? There are multiple ways:

### Using a centralized exchange

One way is to use a centralized exchange like Binance. This means that you must trust them to store your tokens and process the transaction correctly and securely. But this way relies on a single point of failure that could, potentially, fail at any time. [Binance was hacked in 2019, and 7,000 bitcoins were stolen.](https://www.binance.com/en/blog/336904059293999104/Security-Incident-Recap) Moreover, exchanges usually take a fee for the service they offer. Does a better solution exist? Could we use a DEX instead?

{% figure 
    src="/developers/docs/images/cross-chain-swaps/swap-cex.svg" 
    alt="swap-cex" 
    caption="FIGURE 1: Illustration of non-atomic swap on a centralized exchange" %}
{% /figure %}

### Using a DEX

Using a DEX is a great solution for making trustless token swaps. However, they only work within the same blockchain network. For example, _Plenty_ and _Quipuswap_ only work on Tezos and only with FA1.2 or FA2 tokens. So that wouldn't work if you want to exchange XTZ against BTC! One way would be to use wrapped assets like in [this chapter](defi/wrapped-assets) and exchange wrapped XTZ (wXTZ) against wrapped BTC (tzBTC) on a Tezos DEX. However, this increases the difficulty of the process, as you must wrap and unwrap the tokens, which requires a third party for BTC. Additionally, you have to trust that the smart contract that allows you to unwrap your tzBTC for actual BTC is secured. So, does a fully trustless solution exist?

{% figure 
    src="/developers/docs/images/cross-chain-swaps/swap-dex.svg" 
    alt="swap-dex" 
    caption="FIGURE 2: Illustration of non-atomic swap on a decentralized exchange" %}
{% /figure %}

### Cross chain swaps

A _cross-chain swap_ (also referred to as an _Atomic Swap_) refers to the exchange of two different cryptocurrencies, on two different blockchains in a peer-to-peer fashion, i.e., without using a third party. This is possible thanks to a code-locking mechanism known as **Hash Time Locked Contracts (HTLCs)** codable into blockchain transactions. For this, Alice and Bob have to proceed as follows:

- Alice must deposit her XTZ into an HTLC smart contract which acts like a safe and locks the funds. When this safe is created, Alice also generates a key to access it.

- Alice shares a cryptographic hash of this key with Bob. Note that Bob can't access the XTZ yet because he only has the key's hash and not the key itself.

- Bob uses the hash provided by Alice to create another HTLC smart contract, in which he deposits his BTC ([Bitcoin is indeed capable of running basic smart contracts](/blockchain-basics/smart-contracts) such as HTLC).

- To claim the BTC, Alice is required to use that same key, and by doing so, she reveals it to Bob (thanks to a particular function called _hashlock_ from HTLC).

- This means that as soon as Alice claims the BTC, Bob can claim the XTZ and the swap is complete.

The term **atomic** relates to the fact that these transactions either happen entirely or not at all. If any of the parties give up or fails to do what they are supposed to, the contract is cancelled, and the funds are automatically returned to their owners.

{% figure 
    src="/developers/docs/images/cross-chain-swaps/atomic-swap.svg" 
    alt="atomic-swap" 
    caption="FIGURE 3: Illustration of an atomic swap" %}
{% /figure %}

Alice's HTLC will time out and refund the funds to Alice automatically if Bob never sends the funds.

{% figure 
    src="/developers/docs/images/cross-chain-swaps/atomic-swap-fail.svg" 
    alt="atomic-swap-fail" 
    caption="FIGURE 4: Illustration of a failed atomic swap (Bob did not send the funds)" %}
{% /figure %}

## Hash Time Lock Contracts

_Hash Timelock Contracts_ (HTLC) are one of the critical components that makes atomic swaps possible. As the name suggests, they are based on two essential functions:

- a hashlock, which prevents funds from being spent unless a piece of data is revealed (Alice's key in the previous example)
  
- a timelock, which ensures the contract can only be executed within a predefined timeframe

Consequently, the need for trust between the individuals is removed as the use of HTLCs creates a specific set of rules that prevent the atomic swaps from only executing partially.

To learn more about HTLCs, you can read [this article](https://medium.com/blockchainio/what-are-atomic-swaps-bc1d034634c9).

## Cross-chain swaps on Tezos

- [Plenty Bridge](https://www.plentydefi.com/bridge)

- [Atomex](https://atomex.me/) is the first implementation of atomic swap cross-chain DEX with Tezos and FA 1.2 tokens (tzBTC, kUSD, etc.), open-source and granted by Tezos Foundation
  
{% callout type="note" title="References" %}
- https://liquality.io/blog/atomic-swaps-explained/
- https://academy.binance.com/en/articles/atomic-swaps-explained
{% /callout %}
