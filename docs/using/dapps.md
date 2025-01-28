---
title: Using Tezos applications (dApps)
sidebar_label: Applications
authors: "Tim McMackin"
last_update:
  date: 28 January 2025
---

Decentralized applications (dApps) are programs that, at their core, run independently, without any person or group in charge of them.
These applications are:

- **Transparent**, because the core of the application (what developers call the _backend application_) runs on Tezos, and data on Tezos is public, although this data can be very complicated
- **Persistent**, because the backend applications cannot be shut down or blocked
- **Pseudonymous**, because Tezos accounts are not linked to any public information about users and therefore users can use these applications anonymously
- **Secure**, because users are authenticated through the private keys in their wallet applications instead of passwords

## Common types of dApps

dApps can do almost anything that ordinary web applications can do and more.
In particular, Tezos dApps can:

- Use your Tezos account as your authentication to the application and save data that is tied to that account
- Accept tez tokens as payment like you might use a credit card online
- Perform tasks on Tezos on your behalf, like writing data and transferring tokens

Here are some common types of dApps:

- **E-commerce sites** that accept cryptocurrency tokens as payment
- **Decentralized Finance (DeFI)** applications that provide loans and currencies for specific purposes
- **Distributed exchanges (DEXs)** that trade tokens for other tokens
- **Games** that use Tezos as the backend for game logic and tokens to represent game items
- **Art marketplaces** that allow creators to advertise and sell their work as digital tokens

For an example of a Tezos dApp, see [Staking](/using/staking).

## Using dApps safely

Like any other web application, you must interact with dApps with care.
Here are some safety tips:

- Verify that the application is authentic before using it.

  For example, make sure that the URL is correct; instead of clicking a link in an email or on social media, type the address of the application into a web browser manually to ensure that you are not on an impostor site.
  Beware of social engineering tactics that may try to get you to use fraudulent dApps by making promises that are too good to be true or tricking you into giving them your private key or wallet recovery information.
  You can also check user reviews of applications or verify on social media that other users are using the dApp.

- Examine all actions that a dApp takes on your behalf before signing them in your wallet.

  For example, a malicious e-commerce site could offer to sell you something for 10 tez but send a transaction to your wallet for 100 tez.
  If you don't review the transaction in your wallet application carefully and approve it without seeing the mistake, it's unlikely that you can get your tez back.
  You can also view the transaction fees in your wallet before approving the transaction.

- Use a secure wallet and manage your wallet information carefully.

  Consider using a hardware wallet for the best security.
  Whether you use a hardware wallet or software wallet, follow its instructions carefully to ensure that your private key and recovery information are not exposed when you use the wallet.

- Verify transactions after they complete.

  Many wallets show the hash of transactions that dApps create on your behalf.
  You can copy this hash and look it up on a block explorer to see its details.

- Use the correct account with a dApp.

  dApps may not provide a way to change accounts like traditional web applications may allow you to change the email address that you use to log in to the site.
  Therefore, you must be sure to connect to the dApp with the correct account.
