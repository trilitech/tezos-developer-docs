---
title: Accounts
authors: "Tim McMackin"
last_update:
  date: 6 December 2023
---

Tezos uses two types of accounts:

- Classic accounts (also known as _implicit accounts_) with an address, storing tez (ꜩ).
These accounts have addresses that start with "tz1", "tz2", "tz3" or "tz4."
Any wallet application or the Octez command-line tool can create implicit accounts.

- Smart contract accounts (also known as _originated accounts_) with an address, storing code and tez (ꜩ).
Originated accounts have addresses that start with "KT1."
Creating an originated account is part of the process of deploying a smart contract; see [Smart contracts](../smart-contracts).

## Counters

Implicit accounts have _counters_, which track the number of operations that the account has sent.
The counter for an implicit account is set to the global counter (the total number of transactions that have run on Tezos) when it is revealed.
After that, its counter increments by one for each operation that the account runs.

You can use this counter as a unique value to prevent a transaction from running multiple times.

To get the value of a counter for an implicit account, you can use a block explorer's API, as in this example:

```bash
curl -X GET "https://api.ghostnet.tzkt.io/v1/accounts/tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx/counter"
```
