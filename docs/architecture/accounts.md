---
title: Accounts and addresses
authors: "Tim McMackin"
last_update:
  date: 16 April 2024
---

## Accounts

Tezos uses these types of accounts:

- User accounts (sometimes known as _implicit accounts_) store tez (ꜩ) and tickets.
Any wallet application or the Octez command-line tool can create user accounts.

- Smart contract accounts (sometimes known as _originated accounts_) store immutable code, mutable storage, tez (ꜩ), and tickets.
See [Smart contracts](/smart-contracts).

### Revealing accounts

User accounts are _unrevealed_ until they make a transaction.
They can store tez and tickets, but some services such as indexers may not see them.

To reveal an account, send any transaction from it, such as calling a smart contract or sending tez to any account, including itself.

## Addresses

- User accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."

- Smart contracts have addresses that start with "KT1."

- Smart Rollups have addresses, but are not accounts because they cannot store tez.
Their addresses start with "SR1".
They have a tree of commitments attached to them.
See [Smart Optimistic Rollups](/architecture/smart-rollups).
