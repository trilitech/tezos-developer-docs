---
title: DeFi tokens 
id: defi-tokens
---

# Ctez and Wrapped Tokens

In this document we cover two tokens that are instrumental for DeFi on Tezos: ctez and wrapped tokens. In future guides we will expand on the uses of these tokens, and cover other token types and components of DeFi. 


## Ctez in a Nutshell

Ctez is a synthetic XTZ that accumulates rewards from delegating XTZ. Literally: 1 ctez can be worth 1 XTZ today, and a year from now it will be worth 1.06 XTZ or more.

In this post, we explain how the ctez exchange rate is formed, when it is rational to aquire ctez, and when it's sensible to release in your own oven.

DEX pools and DeFi project contracts accumulate large amounts of XTZ. Therefore, a question arises: who bakes these XTZs? If the project delegates them, then to whom exactly? What is a user to do if they want to use DeFi but don’t want to delegate to a particular baker?

These problems are solved by ctez. Users issue ctez against XTZ using their own ovens, and choose to whom to delegate their funds.

The ctez not only represents the value of XTZ but also the accumulated reward from baking. For example, 1 ctez may be worth 1 XTZ today, after one year it will be 1.06 XTZ, and after two years it will be 1.12 XTZ. In reality, the exchange rate is not regulated through pegging to collateral. Instead, it uses the mechanism of ctez supply and demand regulation.

## How ctez Works

The ctez exchange rate mechanism consists of two parts:

*   ctez issuance ovens;
*   AMM for the pairing of ctez and XTZ

Users release ctez against XTZ collateral. To do this, they create contract ovens, make deposits, and release the ctez. When a user creates an oven, they choose a baker to whom they delegate the deposited XTZ. The baker deposits the rewards into the same ovens.

Along with the ovens, a separate AMM pool for exchanging ctez for XTZ and back works. In addition to the direct exchange function, it acts as an oracle: the rate of this pool affects the value of the drift, i.e. the rate of change of the target price:

*   ctez in AMM is worth less than the target price. The drift increases, and if it is above zero, the target price increases faster or decreases less.
*   ctez is worth more than the target price. The drift decreases and the target price increases more slowly or even decreases.

The value of the drift is recalculated each time AMM is called. It changes slowly, no faster than 1% per day. This solution protects the ctez from machinations through [oracle contract manipulation](https://medium.com/bandprotocol/why-defi-needs-real-oracles-beyond-dex-9c80cf192883).

The target price, i.e. the value of the ctez in XTZ, is required to calculate the collateral percentage of the oven and the conditions of liquidation. An oven can become subject to liquidation if the value of the ctez issued exceeds 93.33% of the deposit in XTZ.

In total, every swap on ctez/XTZ AMM launch a chain of events which lead to ctez supply adjustment.

![](/developers/docs/images/ctez-diagram.png)

Suppose Alice has deposited 100 XTZ in the oven and released 90 ctez at the target price of 1.0. The security percentage is 90%. If the target price rises to 1.05, the collateral percentage is 94.5% and the oven will be subject to liquidation. Bob will deposit the ctez in it and take the XTZ.

As a result, AMM, drift, and target price allow ctez to regulate supply and demand. There are several basic scenarios:

*   Users prefer to issue ctez: that’s excess supply. The AMM rate falls below the target price, the drift rises, and the target price follows. If the value of the drift exceeds the reward from baking, users buyback ctez to redeem or liquidate ovens, and the rate rises to the target price.
*   Users prefer to buy ctez: that’s excess demand. AMM rate rises above the target price, drift decreases, and the target price follows suit. It becomes profitable to take advantage of the mint-sell-mint loop: release ctez, sell them for XTZ, release more ctez, sell them, and so on several times. The rate decreases to the target price.
*   Users have found the balance between buying and releasing ctez: that’s equilibrium. The value of the drift equals the profit from the delegation, and the value of the ctez represents XTZ and the accumulated rewards.

In a word, ctez cannot and should not maintain the pegging to XTZ. Its value fluctuates smoothly through drift, target price changes, and liquidations.

## How to create ctez

Go to [ctez.app](https://ctez.app/) and check out the drift value.

![](/developers/docs/images/ctez6.png)

If the drift value is lower than the yield from delegating, you can try to create an oven and benefit from mint-sell-mint. To do this, click on the Create Oven button in the menu on the left.

If it is above 6 percent, it is advantageous to accumulate ctez. Its price will go up: oven owners will have to buy back and redeem ctez to avoid liquidation.

![](/developers/docs/images/ctez1.png)

Enter the address of the baker to whom the oven delegates XTZ, and specify how many XTZ you want to put into the oven. Click Whitelist if you want only the specified addresses to be able to contribute additional XTZ to your oven. Then click Create Oven and confirm the transaction in your wallet.

![](/developers/docs/images/ctez2.png)

Wait a minute until the transaction is included in the block and click on My Ovens on the left-hand side of the menu.

![](/developers/docs/images/ctez3.png)

Click on the oven you mean to open. It will pop open its data, such as the collateralization level, the amount of deposited XTZ, and the amount of issued ctez.

![](/developers/docs/images/ctez4.png)

Press Mint to issue ctez. Enter the amount and confirm the transaction in the wallet. After a few minutes, check your wallet: ctez should appear there.

![](/developers/docs/images/ctez5.png)


If they didn’t, add the tokens manually to the ctez contract address: ([KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4](https://tzkt.io/KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4/operations/)).

That’s it, you can now use ctez while receiving rewards for baking. Put them into the [Plenty farm](https://www.plentydefi.com/farms) or exchange them for another asset on [Quipuswap](https://quipuswap.com/swap/KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0).

To return the collateralized XTZ, buy the respective amount of ctez and redeem it in your farm interface.

{% callout type="note" %}
The above guide on ctez was created by Tezos Ukraine and can be found [here](https://tezos.org.ua/en/blog/guide-to-ctez).
{% /callout %}



# Wrapped XTZ
Let's consider the following facts:

- Tez (XTZ) is the native currency built on the Tezos blockchain.

- When a dApp (decentralized application) is built from the Tezos Blockchain, it usually either implements its own form of token or needs to work with existing tokens, both are based on the FA standards.

- The _FA1.2_ and _FA2_ standards define how tokens are transferred and how to keep a consistent record of those token transfers in the Tezos network. FA standards were developed after the release of the XTZ.

Now here is the issue: **XTZ doesn't conform to its own FA standards**.

Indeed, XTZ is the proto-token of the Tezos Blockchain, i.e., it was built before the FA standards existed. This makes XTZ not compliant with the FA standards used by most Dapps, e.g., DEXs, NFT marketplaces, etc.

![](/developers/docs/images/non-compliant.svg)
FIGURE 1: XTZ can't interact with FA tokens

One solution consists in _wrapping_ XTZ into an FA-compliant token called _wXTZ_. Wrapping XTZ allows you to trade them directly with alt tokens. You need wXTZ to trade XTZ for other FA tokens on decentralized platforms like _Dexter_ and _Quipuswap_. Because decentralized platforms running on Tezos use smart contracts to facilitate trades, directly between users, every user needs to have the same standardized format for the tokens they trade. This ensures tokens don't get lost.

![](/developers/docs/images/wrap.svg)
FIGURE 2: Wrapping XTZ and unwrapping wXTZ

When you "wrap" XTZ, you aren't really wrapping so much as trading XTZ for an equal token called wXTZ via a smart contract. If you want to get plain XTZ back you need to "unwrap" it, i.e., trade it back for XTZ.

In practice, when wrapping, your XTZ are stored in a smart contract, and an equal amount of wXTZ is minted by the contract and transferred to you. When unwrapping, your wXTZ are burned (a.k.a. destroyed), and some XTZ are released and sent back to you.  

![](/developers/docs/images/compliant.svg)
FIGURE 3: wXTZ can interact with other FA tokens

## Properties of wXTZ

wXTZ has been developed by [Stove Labs](https://github.com/stove-labs)

- **Liquid**: wXTZ are liquid and may be used as a standard developer building block (FA1.2) for Tezos DeFi and to participate in DeFi systems on Tezos.

- **Collaterized**: Each wXTZ token is collateralized with 1 Tez (XTZ).

- **Rewards**: Locked XTZ generates staking rewards from baking.

- **Secure**: The suite of wXTZ contracts is audited by [Trail of Bits](https://www.trailofbits.com/) and managed by StakerDAO.

- **Fees**: Interacting with wXTZ has no fee from StakerDAO during the launch phase (contracts interaction requires only the standard network fees on the Tezos network). Changes to the fee structure will be managed by the _StakerDAO_ governance process.

- **Non-custodial**: XTZ locked in the smart contract to mint wXTZ are only redeemable by the user himself. No one can move or touch these tokens until the user burns its wXTZ and gets his or her XTZ back.

Please refer to their [medium article](https://medium.com/stakerdao/the-wrapped-tezos-wxtz-beta-guide-6917fa70116e) to learn more about wXTZ and get started.

## Other wrapped assets

wXTZ is not the only wrapped asset on Tezos, one may want to interact with Ethereum or Bitcoin from a Tezos Smart contract. A wrapped asset can bridge an asset from a different native public blockchain network to the one in which it is wrapping itself.

[StableTech](https://stable.tech/) has created [Wrapped ETH (ETHtz)](https://decrypt.co/51860/wrapped-eth-comes-to-tezos-as-it-takes-on-ethereum-defi-market) which is an FA1.2 token with a price pegged to ETH. ETHtz can be used on Tezos for exchanges or DeFi service while taking advantage of Tezos's much lower fees than Ethereum.

[Wrapped Bitcoin (tzBTC)](https://tzbtc.io/) is another wrapped asset on Tezos pegged to BTC. tzBTC is also implemented using the FA1.2 asset standard on Tezos.

This way, one can use the consensus mechanism and the specific infrastructure of Tezos to use assets or information stored with both Tezos and Ethereum.

## Conclusion

Wrapped assets not only improve the functionality and usability of the asset it wraps, it also opens up a wide array of higher-level financial services that wouldn't be available otherwise.

On Tezos, we've seen the addition of [Wrapped XTZ (wXTZ)](https://medium.com/stakerdao/the-wrapped-tezos-wxtz-beta-guide-6917fa70116e), [Wrapped Bitcoin (tzBTC)](https://tzbtc.io/), [Wrapped ETH (ETHtz)](https://decrypt.co/51860/wrapped-eth-comes-to-tezos-as-it-takes-on-ethereum-defi-market) and the addition of ERC-20 from [Plenty Defi](https://analytics.plentydefi.com/) wrapped assets (among which, WBTC, USDC, WETH, BUSD, DAI, USDT, LINK, MATIC, agEUR).

{% callout type="note" %}
See more:
- [Wrapped XTZ Guide](https://medium.com/stakerdao/the-wrapped-tezos-wxtz-beta-guide-6917fa70116e)
- [tzBTC](https://tzbtc.io/)
{% /callout %}

