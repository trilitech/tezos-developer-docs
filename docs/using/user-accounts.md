---
title: Accounts
authors: "Tim McMackin"
last_update:
  date: 2 January 2025
---

From the user's perspective, a Tezos account is much like an account that you might have on a web application or computer system.
You can use a Tezos account to do many things, including:

- Store and work with tez, the native currency token of the Tezos system
- Store and work with other [tokens](/architecture/tokens)
- Uniquely identify yourself to online applications
- Send transactions to Tezos, such as sending tokens to another account or calling a [smart contract](/smart-contracts)
- Sign messages to prove that they came from your account

From a technical standpoint, a Tezos account is a tool that allows a user to encrypt transactions in a way that proves that those transactions came from them.
In this way, using a Tezos account is how you prove your identity to the Tezos system and to applications that use Tezos.

This page discusses user accounts.
Other types of Tezos accounts include [smart contracts](/smart-contracts) and [Smart Rollups](/architecture/smart-rollups).
For technical information on user accounts, see [Accounts and addresses](https://tezos.gitlab.io/active/accounts.html) in the Octez documentation.

Tezos users use wallets to manage their accounts; see [Wallets](/using/wallets).

## Account addresses

A Tezos account address uniquely identifies an account.
Most Tezos user account addresses start with `tz1`, as in `tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx`, but they can also start with `tz2`, `tz3`, or `tz4`, depending on the cryptographic method used to create them.
They consist of 26 characters and include only letters and numbers.

:::note

Tezos account addresses are case-sensitive.

:::

Technically, what users refer to as the "account address" is the hash of the public key of the account.

## Public and private keys

Cryptocurrency accounts rely on key pairs like other computer accounts rely on passwords.
The keys secure the account and allow only the account owner to use the account.

Keys come in pairs:

- The account's **private key** allows a user to encrypt, or "sign," messages and transactions.
- The account's **public key** allows Tezos and other users to verify that a message or transaction was signed by the account's private key.

User generally don't deal with these keys directly.
In most cases, their wallet application stores the keys and protects them with a password.

## Account security

:::warning

You must keep your private key secret.

The private key (also known as the secret key) is the only thing that another user needs to impersonate your account on Tezos and send transactions on your behalf.
If another user gets your private key, they can access your account and send its tez and other tokens to another account.
If your wallet provides a recovery phrase, you must keep it secret too, because malicious users can use it to recreate your private key.

:::

To keep their private keys safe, users use [wallets](/using/wallets), which are applications that store private keys and use them to sign transactions on your behalf.

Of course the wallet application may also require a password, and therefore you must also keep this password secret.
Many wallet applications provide a way to recover the account if you lose the wallet application or the device that it is on.
Some wallets provide recovery codes in the form of a series of words, others recreate accounts from private keys, and others have proprietary recovery methods.
You must also keep this recovery information secret.

Malicious users and apps may try to get your private key, wallet password, or recovery information.
For example, spam email and malicious apps may request this information or tell you that you need to "verify it" by entering it.

The only time that you need to give anyone your private key or recovery information is when you set up or restore an account in a legitimate wallet application.
Any other request for this information is most likely a scam.

## Creating accounts

Any wallet application can create, manage, and help you back up Tezos accounts.
See [Wallets](/using/wallets).
