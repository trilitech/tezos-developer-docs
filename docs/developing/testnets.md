---
title: Using sandboxes and testnets
authors: 'Mathias Hiron, Nomadic Labs, Tim McMackin, TriliTech'
last_update:
  date: 29 December 2023
---

:::note
The current testnets and a description of what each is used for are listed at https://teztnets.com/.
:::

## Testing without a node

If you are a smart contract developer, testing contracts is a big part of your work. More time is spent testing contracts than writing them. You will often need to test new versions of your contracts and run many tests starting from their deployment to calling every entrypoint in all kinds of ways.

Waiting for the next block every time you inject a new transaction takes a lot of time.

To make testing a lot faster, options are available, depending on the language and tools you are using, that don't use a network or even a single node at all, and skip all the consensus mechanism steps.

- The **Michelson interpreter** is an OCaml function that can be used by tools to simulate a call to any entry point of any smart contract, given an initial value of the storage and parameters. Some programming languages like **LIGO** or **SmartPy** use this as part of their testing frameworks.

- The **mockup mode** of `octez-client` can be used to test contract calls and other features such as some RPC calls, all without running an actual node, saving the time of going through the consensus mechanism and waiting to get blocks created and validated. Tools like **Completium**, built by the team behind the **Archetype** language, use this for their testing framework. Find out more in the [documentation of the mockup mode](https://tezos.gitlab.io/user/mockup.html).

## Testing with public test networks

If you want to test your development in conditions closer to those of Tezos Mainnet, you can use one of several public test networks.

These behave like Mainnet, with a few differences:

- You can use faucets to obtain tez for free on these networks, so you don't need to (and can't) spend actual tez.
- They use different constants than Mainnet, for example, reduced block times and shorter cycles for faster testing, reduced windows for inserting rejections in rollups, etc.
- Tools like public block explorers or indexers may or may not be available, depending on the network.
- They either use a modified version of the amendment process (Ghostnet and Dailynet) or don't use it at all.
- Different test networks run on different versions of the protocol.

Depending on your needs, you may pick between the three types of networks listed below. The different test networks provide different foresight into the changes brought by upcoming protocol amendments -- from a week to 6 months, under the current policy of [rolling protocol proposal publication](https://research-development.nomadic-labs.com/regular-scheduling-for-our-tezos-proposals.html).

In all cases, if you need to do intense testing, we recommend that you run your own nodes on these networks, as public nodes may have availability issues and limitations.

### Permanent test networks

_Permanent test networks_ are networks that are meant to run indefinitely. In particular, they migrate to new versions of the protocol when proposals are adopted.

For the `Ghostnet` permanent network, the governance is controlled by a single entity that manages the network, with a special upgrade mechanism.

At the moment, the main such network is `Ghostnet`. It follows the currently active protocol on `Mainnet`, and upgrades to the next protocol during the Adoption period on `Mainnet`. That is, after the last round of voting and before it activates on `Mainnet`. The objective is to provide a rehearsal event for `Mainnet` migration.

For developers, using a permanent network like `Ghostnet` is convenient compared to other public networks, as it makes it possible to keep contracts running for a long time without having to deal with the trouble of setting things up on a new network when the previous one gets shut down. Services such as indexers, explorers, or public nodes also tend to keep running more reliably on `Ghostnet` than on non-permanent networks.

For bakers, it is also a good idea to run tests on a permanent network, as it is the environment that is the closest to `Mainnet`. `Ghostnet`, in particular, can be used as a _staging_ environment for testing new setups, or new versions of software, for example, new Octez releases.

On the other hand, as transactions and blocks keep accumulating over time, synchronizing with this network can take some time, and the context size gets bigger. This means testing a restart and resynchronization can be time and resource-consuming.

As the protocol on `Ghostnet` migrates to the newly adopted amendment a few days before `Mainnet`, during the Adoption period, it can serve as a _rehearsal_ for the actual migration on `Mainnet`. Both bakers and developers can check that they are ready for the migration and that nothing in their configuration breaks when it happens.

#### Getting tez testnet tokens

In order to get tez tokens to use when testing your application on testnet, you can use a faucet. You
can request some tokens from the [Ghostnet faucet](https://faucet.ghostnet.teztnets.com/)


### Protocol test networks

_Protocol test networks_ are networks that are created specifically for a given version of the protocol.

When an amendment is proposed, a corresponding network is created. This network gets joined by more bakers as the proposal is selected and moves through the different periods of the self-amendment process. If the protocol passes the 3 votes of the amendment, joining a test protocol early gives you about 2.5 months to test all the changes that will be made to Mainnet. If the protocol is not adopted, it usually gets discarded. Otherwise, it remains active until a different protocol is adopted.

This means there is usually one or two such running networks: one for the current version of the protocol running on `Mainnet`, and possibly one for the proposed protocol that is going through the amendment process, if there is one.

Whether you are a developer or a baker, testing on the network for a new proposal before it potentially gets activated enables you to check that all your software, smart contracts, dApps, or other tools work well with this new proposal.

It also enables you to test any new features of this proposal, so that you can prepare to use them. This can also help you form your own opinion about this proposal and discuss it with the community before voting on it.

Once the protocol is activated, the corresponding protocol test network can be a good network for a baker to do some tests, with the current version of the protocol, and doing so on a network that is lightweight to bootstrap, and with reduced context sizes.

On the other hand, it may be less convenient for smart contract or dApps developers to use, as it has a limited life span, and tends to be less supported by services like indexers and other tools.

### Periodic test networks

Periodic test networks target developers, and in particular infrastructure and core developer teams. Their purpose is to test new features as they are being developed and before they are even part of a new proposal.

Periodic testnets are based on `Alpha` development versions of the Tezos Economic Protocol and the Octez suite.

Such networks are a very short life span: new ones are regularly created under similar names as changes are made to the protocol, and the previous ones then quickly disappear.

Testing on such networks is useful for developers that need to test the latest features early and prepare for tools that need to be ready early to support them.

The two periodic protocols currently are `Mondaynet` and `Dailynet`.

`Mondaynet` is a network that restarts every Monday, with the latest Docker build as a reference. It is the place to test upcoming new features. It is also a network to use if you are a big baker or a BaaS provider and you want to test tailored infrastructure.

`Dailynet` is a network that restarts every day, with the latest Docker build as a reference. This is the place mainly recommended for protocol developers.

### Public nodes and faucets

To connect to existing public nodes for these networks, or to get some testnet-only tez on these from a faucet, check [https://teztnets.com](https://teztnets.com/).

Other sources of public nodes include:

- [Community RPC Nodes](https://tezostaquito.io/docs/rpc_nodes) listed by ECAD Labs.
- [SmartPy nodes](https://smartpy.io/nodes).

## Testing with your own private network

In some special cases, you may want to run your own private network for your testing. This could be true if you are developing tools that you want to keep confidential until you put them into production, and if the `sandboxed mode` is not sufficient for your situation.

See the [Private blockchain](https://opentezos.com/private) section on OpenTezos to learn how to set up your own network.

## Further reading

- [Test networks by Nomadic Labs](https://tezos.gitlab.io/introduction/test_networks.html)
- Medium post: [Introducing Ghostnet](https://medium.com/the-aleph/introducing-ghostnet-1bf39976e61f)
