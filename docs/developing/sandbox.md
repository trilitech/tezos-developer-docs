---
title: Using a local sandbox
authors: 'Mathias Hiron, Nomadic Labs, Tim McMackin, TriliTech'
lastUpdated: 18th October 2023
---

Local sandboxes allow you to test your work without sending any transactions to Tezos mainnet or testnets.

The **sandboxed mode** of `octez-client` makes it possible to test your contracts or other projects while interacting with actual nodes, but without using a public test network or creating your own private network. In sandboxed mode, `octez-client` can create one or more local nodes for this.

This is convenient if you want to run all your tests locally but in a mode where blocks are actually created through the consensus mechanism. In particular, if your contracts or tests must stay confidential until you decide to put them into production.

In this mode, you can't use public services such as public block explorers or indexers. You may however install your own.

One of the fastest ways to run a sandbox network is to use Docker. The [Flextesa](https://tezos.gitlab.io/flextesa/) Docker image allows you to set up a sandbox quickly with the protocol of your choice and pre-funded accounts.

Find out more in the [documentation of the sandboxed mode](https://tezos.gitlab.io/user/sandbox.html).

## Further reading

- [Mockup mode](https://tezos.gitlab.io/user/mockup.html)
- [Sandboxed mode](https://tezos.gitlab.io/user/sandbox.html)
