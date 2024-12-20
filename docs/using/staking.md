---
title: Staking
authors: "Tim McMackin"
last_update:
  date: 20 December 2024
---

Staking is the process of temporarily locking tez on the Tezos platform in exchange for rewards.
Staked tez stays in the staker's account, but they cannot transfer that tez while it is staked.
Stakers can unstake the tez at any time, which makes them spendable again after a delay.
Staking is an important part of running the Tezos protocol and keeping the blockchain secure, so this is why stakers earn rewards proportional to the locked funds.

Two main groups stake on Tezos:

- Bakers must stake 6,000 tez to receive the right to bake blocks and to receive rewards for baking those blocks.
Their staked tez ensures that they bake correctly, because part of their stake is taken ("slashed") if they misbehave.
For more information about staking for baking purposes, see [Baking](/architecture/bakers).

- Any Tezos user can stake any amount of tez with a baker and earn rewards based on how much they stake.
In exchange for staking tez with a baker, users automatically receive a portion of the baker's rewards in proportion to how much they stake.
Users can stake any amount of tez, but there is a limit to how much staked tez a single baker can accept, and bakers must opt in to allow users to stake with them.

Staking has some similarities to the concept of a Smart Rollup bond, but there are important differences; see [Bonds](/architecture/smart-rollups#bonds).

## Staking as a Tezos user

The process of user staking has these main steps:

1. The user selects a baker as a delegate for their account.
As described in [Delegating to a baker](/architecture/bakers#delegating-to-a-baker), delegating tez to a baker puts that tez toward the baker's voting and baking power.
Delegating incurs no risk to the user; the user retains full control of the tez, they can spend it at any time, and they are not punished if the baker misbehaves.

1. The user stakes tez with the baker.
Staking the tez locks it temporarily, but the tez stays in the user's account.
However, if the baker misbehaves, their punishment also affects tez staked with them, so it's important to choose a responsible baker.

1. The user leaves their tez staked for as long as they want.
During this time the rewards are added to their account automatically.

THe process of unstaking has these main steps:

1. When the user wants to stop staking, they decrease the amount that they have staked or unstake all of their staked tez.

1. After a delay of about 10 days, the tez are unfrozen in their account and the user can use that tez as usual.

## How to stake

The easiest way to stake is to use the staking web application at https://stake.tezos.com, which walks you through the process.

:::warning

Make sure that you are staking at the right URL (stake.tezos.com).
As with all decentralized applications, do not trust unknown sites asking you to sign transactions and never give your private seed phrase to anyone.

:::

1. Make sure you have tez tokens in a supported Tezos wallet, such as [Kukai](https://wallet.kukai.app/), [Temple](https://templewallet.com/), [Trust Wallet](https://trustwallet.com/), or [Umami Wallet](https://umamiwallet.com/).

1. Go to https://stake.tezos.com in a web browser.

1. Click **Connect your wallet**, select your wallet, and accept the connection in your wallet app.
The staking app shows your account balance and how much you have staked.

   <img src="/img/using/staking-current-balance.png" alt="The wallet app, showing an account with 100 tez and 0 tez staked" style={{width: 500}} />

1. Click **Select Baker** and select a baker to delegate and stake to.

   To choose a baker, you can look up bakers in a block explorer by their addresses.
   For example, the block explorer tzkt.io has information on bakers at https://tzkt.io/bakers.
   This page shows information about staking and delegating with each baker, including the fees they charge and their capacity.

   Before choosing a baker, look at the fees they charge and ensure that they have enough free space for the amount of tez you intend to stake.
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

## More information

For more information about the staking web application and the process of staking from the Tezos user perspective, see the blog post [How to stake your tez and earn 2x rewards](https://spotlight.tezos.com/how-to-stake/).
