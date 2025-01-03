---
title: Wallets
authors: "Tim McMackin"
last_update:
  date: 3 January 2025
---

import PopularWallets from '@site/docs/conrefs/popular-wallets.md';

Wallets are tools that manage accounts on blockchains like Tezos.
[Accounts](/using/user-accounts) hold and use tokens such as tez, the native token of Tezos.
The primary purpose of wallets is to store an account's private key securely and encrypt (or "sign") transactions with that key without exposing the key.

Most wallets can do other tasks, including:

- Showing the token balances that an account holds, such as cryptocurrencies (DeFi tokens) and non-fungible tokens (NFTs)
- Providing information on the value of tokens
- Buying, selling, and exchanging tokens
- Showing the transaction history of an account
- Batching multiple transactions to save on transaction fees

## Tezos wallets

Many wallets are compatible with Tezos.
They are available as standalone programs, as mobile applications, as web browser extensions, as online federated identity accounts, or as pieces of hardware.
Which one you use depends on what platform you want to use your wallet on and what features you want.

<PopularWallets />

To set up MetaMask for Tezos, see [Choosing a wallet](/developing/wallet-setup#choosing-a-wallet).

For a full list of Tezos wallets, see https://tezos.com/learn/store-and-use.
For more information about using wallets with Tezos, see [Installing and funding a wallet](/developing/wallet-setup).

## Setting up a wallet

Each wallet application works differently, but in most cases setting up a wallet follows these general steps:

1. You download and install the wallet application or browser extension.
1. The wallet prompts you to set a password.
1. The wallet generates a Tezos account.
1. The wallet gives you a backup code, usually a series of words, which you can use to restore the account if there is a problem with the wallet or the hardware that runs it.
1. The wallet shows the address of the new account.
Most wallets can generate multiple accounts if you need more than one.

Now you can use the wallet to work with tokens and dApps.

## Transferring tokens

Most wallets allow you to transfer tokens directly in the wallet application.
In most cases, all you need to do is click **Send**, select the token and amount to send, and enter the address of the target account.

For example, this is what a simple transfer of 10 tez looks like in the Temple wallet mobile application:

<img src="/img/using/wallets-temple-transfer.png" alt="Transferring tez in Temple wallet" style={{width: 300}} />

## Connecting a wallet to an application

You can work within the wallet itself to see your tokens and account history.
You can also use it to make transactions, including sending tokens to other accounts.

Another primary use of a wallet is to connect to and use decentralized applications (dApps).
These applications typically provide a web application user interface and use Tezos for background tasks such as user authentication, data storage, and payment processing.
You must connect your wallet to the application, like logging in to a web site, before it can access your account information.
Then, when the application wants to send a transaction to Tezos on your behalf, it sends the transaction to your wallet application for you to approve.
If you approve the transaction, the wallet signs it with your private key and submits it to Tezos.

For an example of a dApp and how you interact with it in your wallet, see [Staking](/using/staking).

After you approve the transaction, you can see it in your wallet's history.

:::warning

Examine transactions thoroughly before approving them.
Malicious dApps may send misleading transactions, and transactions cannot be reversed after you sign them.

:::
