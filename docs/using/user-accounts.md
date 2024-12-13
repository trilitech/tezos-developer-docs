---
title: User accounts
authors: "Tim McMackin"
last_update:
  date: 13 December 2024
---

From the user perspective, a Tezos account is just like an account that you might have on a web page or computer system.
From a technical standpoint, a Tezos account is a tool that allows users to encrypt transactions in a way that proves that those transactions came from their accounts.
In this way, using a Tezos account is how you prove your identity to the Tezos system and to applications that use Tezos.

Accounts have three values:

- The **private key**, which allows users to encrypt, or "sign," messages and operations.
Users sign an operation such as a transfer of tez with their private keys.
Then the Tezos system can verify that the operation was signed by the private key of the connected account without needing the private key itself.

- The **public key**, which is a value that allows Tezos and other people to verify that a message came from the account.
users generally don't have to deal with public keys directly.

- The **hash of the public key**, which is commonly referred to as an "account address."
Many Tezos applications use the public key hash instead of the full public key for convenience.
Tezos account addresses usually start with `tz1`, as in `tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx`.

## Account security

You must keep your private key secret.
The private key is the only thing that another user needs to impersonate your account on Tezos and send transactions on your behalf.
If another user gets your private key, they can access your account, send transactions from your account, and send its tez to another account.

To keep their private keys safe, users use [wallets](/using/wallets), which are applications that store private keys and use them to sign transactions on your behalf.

Of course the wallet application may also require a password, and therefore you must also keep this password secret.
Many wallet applications provide a recovery code that you can use to restore the account if you lose the wallet application or the device that it is on and you must also keep this recovery phrase secret.

Malicious users and apps may try to get your private key, wallet password, or recovery phrase.
For example, spam email and malicious apps may request this information or tell you that you need to verify it by entering it.

The only time that you need to give anyone your private key or recovery phrase is when you set up or restore an account in a legitimate wallet application.
Any other request for this information may be a scam.