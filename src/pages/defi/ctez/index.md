---
title: Ctez
id: ctez
lastUpdated: 27th June 2023
---

Ctez is a synthetic XTZ that accumulates rewards from delegating XTZ. Literally: 1 ctez can be worth 1 XTZ today, and a year from now it will be worth 1.06 XTZ or more.

Here we explain how the ctez exchange rate is formed, when it is rational to acquire ctez, and when it's sensible to release your own "oven".

DEX pools and DeFi project contracts accumulate large amounts of XTZ. Therefore, a question arises: who bakes these XTZs? If the project delegates them, then to whom exactly? What is a user to do if they want to use DeFi but don’t want to delegate to a particular baker?

These problems are solved by ctez. Users issue ctez against XTZ using their own ovens and choose to whom to delegate their funds.

The ctez not only represents the value of XTZ but also the accumulated reward from baking. For example, 1 ctez may be worth 1 XTZ today, after one year it will be 1.06 XTZ, and after two years it will be 1.12 XTZ. In reality, the exchange rate is not regulated through pegging to collateral. Instead, it uses the mechanism of ctez supply and demand regulation.

## How ctez Works

The ctez exchange rate mechanism consists of two parts:

*   ctez issuance ovens;
*   AMM for the pairing of ctez and XTZ

Users release ctez against XTZ collateral. To do this, they create contract ovens, make deposits, and release the ctez. When a user creates an oven, they choose a baker to whom they delegate the deposited XTZ. The baker deposits the rewards into the same ovens.

Along with the ovens, a separate AMM pool for exchanging ctez for XTZ and back works. In addition to the direct exchange function, it acts as an oracle: the rate of this pool affects the value of the drift, i.e. the rate of change of the target price:

*   ctez in the AMM is worth less than the target price. The drift increases, and if it is above zero, the target price increases faster or decreases less.
*   ctez is worth more than the target price. The drift decreases and the target price increases more slowly or even decreases.

The value of the drift is recalculated each time the AMM is called. It changes slowly, no faster than 1% per day. This solution protects the ctez from machinations through [oracle contract manipulation](https://medium.com/bandprotocol/why-defi-needs-real-oracles-beyond-dex-9c80cf192883).

The target price, i.e. the value of the ctez in XTZ, is required to calculate the collateral percentage of the oven and the conditions of liquidation. An oven can become subject to liquidation if the value of the ctez issued exceeds 93.33% of the deposit in XTZ.

In total, every swap on the ctez/XTZ AMM creates a chain of events that leads to ctez supply adjustment.

![](/images/ctez-diagram.png)

Suppose Alice has deposited 100 XTZ in the oven and released 90 ctez at the target price of 1.0. The security percentage is 90%. If the target price rises to 1.05, the collateral percentage is 94.5% and the oven will be subject to liquidation. Bob will deposit the ctez into it and withdraw the XTZ.

As a result, AMM, drift, and target price allow ctez to regulate supply and demand. There are several basic scenarios:

*   Users prefer to issue ctez i.e. there's excess supply. The AMM rate falls below the target price, the drift rises, and the target price follows. If the value of the drift exceeds the reward from baking, users buy back ctez to redeem or liquidate ovens, and the rate rises to the target price.
*   Users prefer to buy ctez i.e. there's excess demand. AMM rate rises above the target price, drift decreases, and the target price follows suit. It becomes profitable to take advantage of the mint-sell-mint loop: release ctez, sell them for XTZ, release more ctez, sell them, and so on several times. The rate decreases to the target price.
*   Users find the balance between buying and releasing ctez--there's equilibrium. The value of the drift equals the benefits from the delegation, and the value of the ctez represents XTZ and the accumulated rewards.

To summarize, ctez cannot (and should not) maintain the pegging to XTZ. Its value fluctuates smoothly through drift, target price changes, and liquidations.

## How to create ctez

Go to [ctez.app](https://ctez.app/) and observe the drift value.

![](/images/ctez6.png)
If the drift value is lower than the yield from delegating, you can try to create an oven and benefit from mint-sell-mint. To do this, click on the Create Oven button in the menu on the left.

If it is above 6 percent, it is advantageous to accumulate ctez. Its price will go up: oven owners will have to buy back and redeem ctez to avoid liquidation.

![](/images/ctez1.png)

Enter the address of the baker to whom the oven delegates XTZ, and specify how many XTZ you want to put into the oven. Click Whitelist if you want only the specified addresses to be able to contribute additional XTZ to your oven. Then click Create Oven and confirm the transaction in your wallet.

![](/images/ctez2.png)

Wait a minute until the transaction is included in the block and click on My Ovens on the left-hand side of the menu.

![](/images/ctez3.png)

Click on the oven you mean to open. It will pop open its data, such as the collateralization level, the amount of deposited XTZ, and the amount of issued ctez.

![](/images/ctez4.png)

Press Mint to issue ctez. Enter the amount and confirm the transaction in the wallet. After a few minutes, check your wallet: ctez should appear there.

![](/images/ctez5.png)


If they didn’t, add the tokens manually to the ctez contract address: ([KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4](https://tzkt.io/KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4/operations/)).

That’s it, you can now use ctez while receiving rewards for baking. Put them into the [Plenty farm](https://www.plentydefi.com/farms) or exchange them for another asset on [Quipuswap](https://quipuswap.com/swap/KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0).

To return the collateralized XTZ, buy the respective amount of ctez and redeem it in your farm interface.

{% callout type="note" %}
The above guide on ctez was created by Tezos Ukraine and can be found [here](https://tezos.org.ua/en/blog/guide-to-ctez).
{% /callout %}
