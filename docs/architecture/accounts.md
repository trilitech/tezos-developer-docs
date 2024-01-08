---
title: Accounts
authors: "Tim McMackin"
last_update:
  date: 8 January 2024
---

Tezos uses these types of accounts:

- User accounts (sometimes known as _implicit accounts_) store tez (ꜩ) and tickets.
These accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."
Any wallet application or the Octez command-line tool can create user accounts.

- Smart contract accounts (sometimes known as _originated accounts_) store immutable code, mutable storage, tez (ꜩ), and tickets.
Smart contracts have addresses that start with "KT1."
See [Smart contracts](../smart-contracts).

- Smart Rollups also have accounts.
Their addresses start with "SR1".
They have a tree of commitments attached to them.
See [Smart Optimistic Rollups](./smart-rollups).
