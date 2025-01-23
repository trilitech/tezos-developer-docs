---
title: Staking
authors: "Tim McMackin"
last_update:
  date: 16 January 2025
---

Staking is the process of temporarily locking tez on the Tezos platform in exchange for rewards.
Staked tez stays in the staker's account, but the staker cannot transfer (or spend) that tez.
Stakers can unstake the tez at any time, which makes them spendable again after a delay; see [Staking periods and delays](#staking-periods-and-delays).
Staking is an important part of running the Tezos protocol and keeping the blockchain secure, so this is why stakers earn rewards proportional to the locked funds.

Two main groups stake on Tezos:

- Bakers, the creators of new blocks in Tezos, must stake 6,000 tez to receive the right to "bake" blocks and to receive rewards for baking those blocks.
Their staked tez ensures that they bake correctly, because part of their stake is taken ("slashed") if they misbehave.
For more information about staking for baking purposes, see [Bakers](/architecture/bakers).

- Any Tezos user can stake tez with a baker and earn rewards.
In exchange for staking tez with a baker, users automatically receive a portion of the baker's rewards in proportion to how much they stake.
Users can stake any amount of tez, but there is a limit to how much staked tez a single baker can accept, and bakers must opt in to allow users to stake with them.

:::note How much tez do I receive in return for staking tez?

The amount of tez that you receive for staking tez depends on many factors, including how much you stake and how lucky your baker is.
Due to the mechanism of [adaptive issuance](https://tezos.gitlab.io/active/adaptive_issuance.html), the returns for staking also depend on the ratio of staked tez to total tez in existence, to encourage a balance of staked tez to liquid tez.
You can look up an estimated rate of return on block explorers.

:::

Staking has some similarities to the concept of a Smart Rollup bond, but there are important differences; see [Bonds](/architecture/smart-rollups#bonds).

## Staking as a Tezos user

The process of staking has these main steps for a user:

1. The user selects a baker as a delegate for their account.
As described in [Delegating to a baker](/architecture/bakers#delegating-to-a-baker), delegating tez to a baker puts that tez toward the baker's voting and baking power.
Delegating incurs no risk to the user; the user retains full control of the tez, they can spend it at any time, and they are not punished if the baker misbehaves.

1. The user stakes tez with the baker.
Staking the tez locks them temporarily, but the tez stay in the user's account.
However, if the baker misbehaves, their punishment also affects tez staked with them, so it's important to choose a responsible baker.

1. The user leaves their tez staked for as long as they want.
During this time the rewards are added to their account automatically.

The process of unstaking has these main steps:

1. When the user wants to stop staking, they decrease the amount that they have staked or unstake all of their staked tez.

1. After a delay of about 10 days, the tez are unfrozen in their account and the user can use that tez as usual.

Here are a few other things to know about delegating and staking as a Tezos user:

- A Tezos account can have only one delegate at a time.
For this reason, an account can stake with only one baker at a time.
If you want to change bakers, you can unstake from the current baker, wait for the unstaking delay, and stake with a new baker.

- The baker that you stake with has no control over your tez, but your staked and delegated tez counts toward the baker's voting rights, when it's time to vote on upgrades to Tezos, as described in [Governance and self-amendment](/architecture/governance).

- Before user staking was introduced to Tezos, users delegated their tez to bakers and bakers could choose to reward users for doing so.
You can still delegate without staking, but the primary way users earn rewards now is to both delegate and stake. Just delegating tez incurs less risks but brings only a fraction of the rewards.

:::warning Risks of staking

Your staked tez is subject to the same penalties as the baker's staked tez.
In the rare event that your baker is punished ("slashed") for misbehaving, your tez is also slashed.

:::

## How to stake

The easiest way to stake is to use the staking web application at https://stake.tezos.com, which walks you through the process.
If you don't want to use this application, some wallets have built-in staking functionality that you can use instead.
Similarly, some cryptocurrency exchanges allow you to stake directly from their interfaces.
However, you should evaluate these staking functions carefully because they may have different conditions and rewards than staking directly through the Tezos system and https://stake.tezos.com.

:::warning

Make sure that you are staking at the right URL (https://stake.tezos.com).
As with all decentralized applications, do not trust unknown sites asking you to sign transactions and never give your private seed phrase to anyone.

:::

1. Make sure you have tez tokens in a supported Tezos wallet.
For a list of popular wallets, see [Wallets](/using/wallets).

1. Go to https://stake.tezos.com in a web browser.

1. Click **Connect your wallet**, select your wallet, and accept the connection in your wallet app.
The staking app shows your account balance and how much you have staked.

   <img src="/img/using/staking-current-balance.png" alt="The wallet app, showing an account with 100 tez and 0 tez staked" style={{width: 500}} />

1. Click **Select Baker** and select a baker to delegate and stake to.

   To choose a baker, you can look up bakers in a block explorer by their addresses.
   For example, the block explorer tzkt.io has information on bakers at https://tzkt.io/bakers and tzstats.com has information at https://tzstats.com/bakers.
   Evaluate bakers by comparing information about them, including:

   - The fees they charge (commission) on staked funds
   - Their capacity for additional staked funds (free space)
   - How reliable they are as a baker (how often they bake blocks when they have the opportunity)
   - Whether they have been penalized (slashed)
   - Whether they are public (accepting stake from any user) or private (not accepting stake from other users)
   - Whether they are supported by a corporation or not

   For example, the bakers in this picture all have free space for staking:

   <img alt="The TzKT block explorer, showing bakers with different capacities for staking" src="/img/using/staking-capacity.png" style={{width: 500}} />

1. On the Select Baker page, select the baker.

   The application prompts you to delegate your account to that baker, as in this screenshot:

   <img alt="Delegating to the baker" src="/img/using/staking-delegating.png" style={{width: 500}} />

1. Click **Delegate** and approve the operation in your wallet to delegate to that baker.
It may take a few seconds for the operation to be final.

   Now the web application shows that your account is delegated to the baker, as in this screenshot:

   <img alt="Account information, showing that the account is delegated" src="/img/using/staking-delegated-account.png" style={{width: 500}} />

1. Click **Stake** and confirm the terms of use for the staking application.

1. Specify the amount to stake.

   :::note

   Don't stake all of the tez in the account; you need some liquid tez to pay transaction fees.
   For this transaction, the application deducts the transaction fee from the amount that you stake.
   However, you will need liquid, unstaked tez later to unstake the tez.

   :::

   <img alt="Setting 50 tez to stake" src="/img/using/staking-amount.png" style={{width: 500}} />

1. When you have selected the amount to stake, click **Stake** and approve the operation in your wallet to stake that amount.
This operation may also take a few seconds.

When the staking operation is complete, a confirmation page shows how much you have staked and provides a link to tzkt.io that you can use to see information about your account.
The web application also shows the current status of your account, as in this screenshot:

<img alt="The information page showing the staked amount" src="/img/using/staking-status-complete.png" style={{width: 500}} />

## How to unstake

You can unstake any amount of staked tez at any time, but you must wait for the 10-day delay before you can finalize the unstake operation.

1. Go to https://stake.tezos.com in a web browser and connect your wallet.

1. Click **Unstake**, read the notice about the delay, and click **I Understand**.

1. Select the amount to unstake, up to the total amount that is currently staked, as in this screenshot:

   <img alt="Selecting the amount to unstake" src="/img/using/staking-unstaking-amount.png" style={{width: 500}} />

1. Click **Unstake** and confirm the transaction in your wallet.
When the unstaking operation is complete, a confirmation page shows how much you have unstaked and provides a link to tzkt.io that you can use to see information about your account.

   Then, the application shows the pending unstake request and the cycle in which you can finalize the request, as in this screenshot:

   <img alt="Pending unstake request" src="/img/using/staking-unstaking-pending.png" style={{width: 500}} />

1. Wait until the unstake request is ready to be finalized.
You can see the current cycle and the time to the next cycle on block explorers such as https://tzkt.io.

   When the request is ready to be finalized, the application shows a **Finalize** button next to it:

   <img alt="Ready unstake request" src="/img/using/staking-unstaking-ready.png" style={{width: 500}} />

1. To finalize the unstaking request, click **Finalize**, click **Finalize** again in the pop-up window, and confirm the transaction in your wallet.
The application shows a confirmation message.

Now the application shows your liquid balance and any tez that remain staked.

## Viewing your rewards

The Tezos protocol distributes staking rewards automatically, without requiring any manual action.
To see them, look up your account on a block explorer such as [TzKT](https://tzkt.io).

## Staking periods and delays

The following diagram shows the reason for the unstaking delay.
The diagram shows cycles as a timeline and assumes that the user has already staked tez with a baker at the start of the timeline.

The system calculates rights for bakers two cycles ahead, so at the end of cycle 1, the system calculates rights for a baker in cycle 4 based on the amount staked with that baker as of the end of cycle 1.
The example user in the diagram submits an unstake request in the middle of cycle 2.
When cycle 2 ends, the system calculates rights for bakers in cycle 5, so the baker will have reduced staking rights in cycle 5 depending on how much the user requested to unstake.

The diagram also shows why users must wait to unfreeze their staked tez.
Because the rights in cycles 3 and 4 were computed before the unstake request, the funds being unstaked must still guarantee the honest behavior of the baker during that period.
The diagram shows a baker misbehaving in cycle 4.
Other bakers have the remainder of cycle 4 and all of cycle 5 to denounce the misbehaving baker, which results in that baker being slashed.
Therefore, funds staked with that baker stay frozen until the end of cycle 5 in case they need to be penalized.
Then, the user can finalize their unstake request.

![A diagram of an unstake request and the period that the user must wait to finalize that request](/img/using/staking-periods-diagram.png)

## More information

For more information about the staking web application and the process of staking from the Tezos user perspective, see the blog post [How to stake your tez and earn 2x rewards](https://spotlight.tezos.com/how-to-stake/).
