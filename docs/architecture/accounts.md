---
title: Accounts and addresses
authors: "Tim McMackin"
last_update:
  date: 10 January 2024
---

## Accounts

Tezos uses these types of accounts:

- User accounts (sometimes known as _implicit accounts_) store tez (ꜩ) and tickets.
Any wallet application or the Octez command-line tool can create user accounts.

- Smart contract accounts (sometimes known as _originated accounts_) store immutable code, mutable storage, tez (ꜩ), and tickets.
See [Smart contracts](../smart-contracts).

## Addresses

- User accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."

- Smart contracts have addresses that start with "KT1."

- Smart Rollups have addresses, but are not accounts because they cannot store tez.
Their addresses start with "SR1".
They have a tree of commitments attached to them.
See [Smart Optimistic Rollups](./smart-rollups).
