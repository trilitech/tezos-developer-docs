---
title: Accounts
authors: "Tim McMackin"
last_update:
  date: 18 October 2023
---

Tezos uses two types of accounts:

- Classic accounts (also known as _implicit accounts_) with an address, storing tez (ꜩ).
These accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."
Any wallet application or the Octez command-line tool can create implicit accounts.

- Smart contract accounts (also known as _originated accounts_) with an address, storing code and tez (ꜩ).
Originated accounts have addresses that start with "KT1."
Creating an originated account is part of the process of deploying a smart contract; see [Smart contracts](../smart-contracts).
