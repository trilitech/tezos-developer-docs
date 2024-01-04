---
title: Accounts
authors: "Tim McMackin"
last_update:
  date: 29 December 2023
---

Tezos uses these types of accounts:

- Classic accounts (also known as _implicit accounts_) store tez (ꜩ) and tickets.
These accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."
Any wallet application or the Octez command-line tool can create implicit accounts.

- Smart contract accounts (also known as _originated accounts_) store immutable code, mutable storage, tez (ꜩ), and tickets.
Smart contracts have addresses that start with "KT1."
See [Smart contracts](../smart-contracts).

- Smart Rollup accounts are another type of originated account.
Their addresses start with `SR1`.
They have a tree of commitments attached to them.
For more information, see [Smart Rollups](./smart-rollups).
