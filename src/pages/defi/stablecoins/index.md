---
id: stablecoins
title: Stablecoins
author: Aymeric Bethencourt
lastUpdated: 27th June 2023
---

A stablecoin is a cryptocurrency whose price is fixed to another asset. Most stablecoins are pegged (fixed) to fiat currencies (currencies issued by the central bank of a sovereign state) like the US Dollar.


![stablecoin](/images/stablecoins/stablecoin.svg)
FIGURE 1: Illustration of a stablecoin volatility compared to his pegged asset (e.g. USD)

Stablecoins have gained traction as they attempt to offer the best of both worlds: the instant processing, security, and privacy of cryptocurrencies, and the volatile free stable valuations of fiat currencies.

## How it works

Stablecoins achieve their price stability via collateralization (backing) or through algorithmic mechanisms of buying and selling the reference asset or its derivatives. There are three types of stablecoins:

### Fiat-Collateralized Stablecoins

#### Principle

Fiat-collateralized stablecoins are backed by centralized entities that guarantee an exchange rate at the same price as the asset (minus potential fees). They mint new stablecoins when they receive fiat and burn stablecoins when they give fiat back. These centralized entities guarantee that you can always exchange 1 stable-USD against 1 USD, and the other way around. These entities are regularly audited to ensure that they always have enough reserves to match the minted tokens. However, these entities are single points of failure, as they are not decentralized.

#### Example

If Alice wants 100 stable-USD, she needs to send 100 USD to the entity's bank account. The entity will, in turn, mint 100 stable-USD and send it to Alice. Note that to exchange with these entities, you will need to pass a [KYC](https://en.wikipedia.org/wiki/Know_your_customer) (Know-Your-Customer) as illustrated in Fig. 2. Alice can then use the stable-USD for any operation, such as sending them to Bob. Bob may then want to exchange the 100 stable-USD against some USD. Bob passes a KYC with the entity and then sends them the 100 stable-USD. The company burns the tokens and sends 100 USD from their bank account to Bob's bank account, usually minus a small convergence fee.

#### Risks

As shown above, these entities must keep as much USD in their bank account as they have minted stable-USD. A malicious company could spend or invest the USD from their bank account and therefor not be able to pay back users in case of a massive exchange of stable-USD to USD. (Note that this problem is similar to the practice of _fractional reserve banking_).

![stablecoin-kyc](/images/stablecoins/stablecoin-kyc.svg)
FIGURE 2: Exchanging stable coins against fiat currencies (or the other way around) is secured by a KYC. Exchanging stable coins between users do not require a KYC (i.e. as long as it stays inside the world of crypto)

### Crypto-Collateralized Stablecoins

Crypto-collateralized stablecoins are stablecoins that are backed by other cryptocurrencies. The stablecoins are minted or burned by automated smart contracts knowns as _Collateralized Debt Position_ (CDP). However, since the reserve cryptocurrency may also prone to be high volatility, such stablecoins are "over-collateralized", meaning a much larger value of tokens is maintained as reserve, compared to the provided stablecoin value. These models are not capital efficient.

#### Example

Alice wants 100 stable-USD. She opens a CDP. Consider that the CDP is backed by XTZ and that the current value of XTZ is 5 USD. The typical minimum CDP collateralization is 150%, meaning that Alice needs to send at least $100 / 5 = 20$ XTZ to the CDP. In practice, Alice must send much more than that, to stay accurate if the price of XTZ slightly moves downward, her collateralization would go below 150%, and her CDP would be liquidated. To keep it safe, Alice would sends 40 XTZ to the CDP, making her collateral worth $200.

Alice can now instruct the CDP to mint and transfer her 100 stable-USD. The CDP locks her XTZ until she repays the 100 stable-USD, thus the term **debt** in CDP.

If XTZ goes up, the value of her collateral increases. She can either withdraw some XTZ from the CDP or mint some more stable-USD, as long as the collateral stays above 150%.

If XTZ go below $150 / 40 = 3.75$ USD, her collateral would go below 150%. If Alice doesn't send more XTZ to the CDP to compensate, before it reaching 150%, her CDP would be liquidated, meaning that the contract is closed, and her XTZ are sold publicly to other traders. Alice still has the 100 stable-USD, but she just lost $150 worth of XTZ.

#### Risks

The greatest threat to a crypto-collateralized stablecoin is a massive crash of the collateral cryptocurrency. When a CDP gets liquidated, other traders must buy the collateral to make up for the debt in stable-USD. They make a nice profit as they usually buy it just below 150% of valuation. Now, if a crypto crashes significantly and so fast that liquidated CDPs' collateral drops below 100% of their debt, then nobody will want to buy them. This would ultimately make CDPs worthless and derail the stable-USD off its peg.

The most popular crypto-collateralized stablecoin is [DAI from MakerDAO](https://makerdao.com/) on Ethereum. Their white paper can be found [here](https://makerdao.com/whitepaper/DaiDec17WP.pdf).

### Non-Collateralized (algorithmic) Stablecoins

Non-collateralized stablecoins don't use any reserve but rely on an algorithm that will automatically burn tokens when supply is high (to increase the price) or mint new tokens when supply is low (to decrease the price). This is similar to what central banks are doing to maintain the valuations of a fiat currency. It can be achieved by implementing a smart contract on a decentralized platform that can run autonomously.

#### Example

For example, assume a stablecoin is priced at \$1. When the price drops to \$0.80, an algorithm recognizes that an imbalance between supply and demand exists and automatically sets a market order to buy, pushing the price back up. If the price goes above \$1, the algorithm sells assets to maintain the price on the predefined level that keeps the peg.

#### Risks

When the price goes below \$1, things get complicated. If the price is below a dollar, the algorithm must reduce supply. A common way for uncollateralized stablecoins to reduce supply is through offering **bonds**.

These bonds are sold on an open market for less than \$1. They are paid for in the stablecoin and promise to return 1 stablecoin at an unspecified time in the future. For example, a buyer pays 0.9 stable-USD for 1 Bond token. This lowers the existing supply and should theoretically bring the price of the stablecoin back to \$1.

The issue here is that buyers need to be confident that the bonds will payout. Bonds are paid out when the supply increases (the stablecoin price goes above \$1). Just as with the shares, the bonds rely on increasing demand for the stablecoin. If demand growth slows or stops, bonds may not be paid out.

This happened with [the crash of the UST](https://blog.chainalysis.com/reports/how-terrausd-collapsed/#:~:text=Summary,of%20both%20LUNA%20and%20UST.) in May 2022, an algorithm stablecoin.


![stablecoin-type](/images/stablecoins/stablecoin-types.svg)
FIGURE 3: Recapitulation of the 3 types of stablecoins.

## Stablecoins on Tezos

### Kolibri (kUSD)

The Kolibri kUSD, created by over [Hover Labs](https://hover.engineering/), is a USD-pegged stablecoin and the ﬁrst crypto-backed stablecoin issued on the Tezos blockchain. It is implemented following the FA1.2 token standard.

It uses CDPs (referred to as an `Oven`) backed by XTZ to collateralize a soft pegged USD-stable value asset, **kUSD** and is available on the mainnet with more than 6.5m **kUSD** in existence (at the time of writing).

You can learn more about Kolibri on the [official website](https://kolibri.finance)).

### USDtez

The USDtez, created and issued by [Stabletez](https://stabletez.com/), is a USD-pegged stablecoin.
It is implemented following the FA1.2 token standard.

USDtz is backed with full FIAT-based solvency and the reserve is audited monthly by [Armanino](https://www.armaninollp.com/). FIAT collateral deposits may include certain other stablecoins.

Anyone can audit USDtz's reserves in real-time, by comparing the minted supply with the collateral wallet.

You can learn more about USDtez on the [official website](https://usdtz.com/index.html).

### Others

- [Euro LUGH - EURL](https://www.lugh.io/): Euro collateralized stablecoin.
- [Tether USDT](https://tzkt.io/KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o/operations/): Dollar collateralized stablecoin.
- [uUSD Youves](https://tzkt.io/KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW/tokens/0/transfers): Dollar synthetic stablecoin.
- [Wrapped USDC](https://tzkt.io/KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY/tokens/2/transfers): Dollar wrapped stablecoin.

## References

{% callout type="note" title="References" %}
A general [introduction on stablecoins](<https://www.investopedia.com/terms/s/stablecoin.asp>)
{% /callout %}
