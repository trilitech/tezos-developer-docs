---
title: Block explorers
last_update:
  date: 31 January 2025
---

A _blockchain explorer_, also known as a _block explorer_, is an app that tracks activity on a blockchain.
They record all transactions made on a network and allow users to search for transactions by the hash of the transaction or the accounts involved in the transaction.

**Blockchain explorers are like search engines for blockchains.**

You can think of a block explorer as a window into the blockchain world, allowing you to observe what's happening in it.

Cryptocurrency users and developers use such a tool to view the status of past or present transactions, look up information about accounts, and see information about tokens.

Some of the most basic information available on blockchain explorers includes (but is not limited to):

* **Block feed**: This allows you to view all the confirmed and pending blocks on the blockchain.
* **Transaction feed**: The transaction feed displays all the most recent and pending transactions.
* **Transaction viewer**: Each transaction can be viewed individually to reveal the public addresses of the sending and receiving parties.
* **Account history**: All past and present transactions of an individual account address.
* **Smart contract status**: Information about smart contracts, including their interface and current balance and information about the tokens they manage.
* **Staking and delegation**: Information about which accounts are staking and delegating to which other accounts and information about the rewards for bakers and stakers.

## Block explorer use cases

Many different kinds of users use block explorers:

* Individual Tezos users who need to check their token balances and staking rewards
* Blockchain engineers who develop and debug new Tezos features
* App developers who need debugging tools and more visibility into the current and past state of their contracts running on testnets and Mainnet
* Bakers and staking services who need reliable data about delegation and earnings history to calculate correct payouts, plan their bond pools, and execute operations
* Auditors and regulators who need a trusted copy of the full on-chain history in a format that's easy to digest for spreadsheets and compliance tools

Different block explorers show data in different ways, so if one block explorer doesn't show information that you need or use the format that you need, try a different one.
For example, some block explorers focus on information about bakers.
Also, [Explorus](https://explorus.io/) has a section on the Data Availability Layer.

## Public block explorers

Here are some commonly used Tezos block explorers:

- [TzStats](https://tzstats.com/)
- [TzKT](https://tzkt.io/)
- [Baking Bad](https://baking-bad.org)
- [Better Call Dev](https://better-call.dev)
- [Explorus](https://explorus.io/)
- [Etherlink Explorer](https://explorer.etherlink.com/)
- [TzFlow](https://tzflow.com/)

If you can't find the information that you need on public block explorers, you can set up an [indexer](/developing/information/indexers) to get the information that you need.

## APIs

Some block explorers provide public APIs that developers can call to get information from.
For example, the [TzKT](https://tzkt.io/) block explorer has documentation for its API at https://api.tzkt.io.
