---
title: Testing on sandboxes and testnets
authors: 'Mathias Hiron, Nomadic Labs, Tim McMackin, TriliTech'
last_update:
  date: 1 February 2024
---

:::note
The current testnets and a description of what each is used for are listed at https://teztnets.com/.
:::

If you are a smart contract developer, testing contracts is a big part of your work. More time is spent testing contracts than writing them. You will often need to test new versions of your contracts and run many tests starting from their deployment to calling every entrypoint in all kinds of ways.

After you have tested contracts locally as described in [Testing locally](./testing), you can deploy them to test networks to test them in a realistic environment.

## Testing with public test networks

If you want to test your development in conditions that are close to those of Tezos Mainnet, you can use one of several public test networks.

These networks behave like Mainnet with a few differences:

- You can use faucets to obtain tez for free on these networks, so you don't need to (and can't) spend actual tez.
- They use different constants than Mainnet, such as reduced block times and shorter cycles for faster testing and reduced windows for inserting rejections in rollups.
- Tools like public block explorers or indexers may or may not be available, depending on the network.
- They either use a modified version of the amendment process or don't use it at all.
- In some cases, you must use specific versions of tools such as the Octez client to work with them.

Depending on your needs, you can pick between the types of networks listed below. The different test networks provide different foresight into the changes brought by upcoming protocol amendments — from a week to 6 months, under the current policy of [rolling protocol proposal publication](https://research-development.nomadic-labs.com/regular-scheduling-for-our-tezos-proposals.html).

Regardless of the type of network, if you intend to do intense testing, you can run your own nodes on these networks to avoid availability issues and limitations.

## Types of test networks

Type | Longevity | Target users | Examples
--- | --- | --- | ---
[Permanent test networks](#permanent-test-networks) | Permanent | dApp developers and bakers | Ghostnet
[Protocol test networks](#protocol-test-networks) | During the protocol amendment process | Protocol developers | Nairobinet, Oxfordnet
[Periodic test networks](#periodic-test-networks) | Week or day | Protocol developers and bakers | Weeklynet, Dailynet

### Permanent test networks

Permanent test networks are networks that are meant to run indefinitely. Just like Mainnet, they migrate to new versions of the protocol when proposals are adopted.

At the moment, the main such network is Ghostnet. It follows the currently active protocol on Mainnet and upgrades to the next protocol during the Adoption period on Mainnet, which is after the last round of voting but before the new version activates on Mainnet. The objective is to provide a rehearsal event for Mainnet migration.

For developers, using a permanent network like Ghostnet is convenient compared to other public networks because they can keep contracts running for a long time without having to set things up on a new network when the previous one gets shut down. Services such as indexers, explorers, or public nodes also tend to run more reliably on Ghostnet than on non-permanent networks.

Bakers often run tests on a permanent network because they are the closest environment to Mainnet. Ghostnet, in particular, can be used as a staging environment for testing new setups or new versions of software such as new Octez releases.

On the other hand, as transactions and blocks keep accumulating over time, synchronizing with this network can take some time, and the context size gets bigger. This means testing a restart and resynchronization can be time and resource-consuming.

Because the protocol on Ghostnet migrates to the newly adopted amendment a few days before Mainnet does, it can serve as a rehearsal for the actual migration on Mainnet. Both bakers and developers can check that they are ready for the migration and that nothing in their configuration breaks when it happens.

### Protocol test networks

Protocol test networks are networks that are created for a specific version of the protocol.

When an amendment is proposed, a corresponding network is created. This network gets joined by more bakers as the proposal is selected and moves through the different periods of the self-amendment process. If the protocol passes the 3 votes of the amendment, joining a test protocol early gives you about 2.5 months to test all the changes that will be made to Mainnet. If the protocol is not adopted is discarded or sometimes remains active until a different protocol is adopted.

This means there is usually one or two such running networks: one for the current version of the protocol running on Mainnet, and possibly one for the proposed protocol that is going through the amendment process, if there is one.

Whether you are a developer or a baker, testing on the network for a new proposal before it gets activated enables you to check that all your software, smart contracts, dApps, and other tools work well with this new proposal.

It also enables you to test any new features of this proposal. Trying the features can help you form your own opinion about this proposal and discuss it with the community before voting on it.

When the protocol is activated, the corresponding protocol test network can be a good network for a baker to run tests with the current version of the protocol, because these networks are lightweight to bootstrap and have reduced context sizes.

On the other hand, these networks may be less convenient for smart contract or dApp developers to use, because they have a limited life span and tend to be less supported by services like indexers and other tools.

### Periodic test networks

Periodic test networks allow developers to test new features that are under development before those features become part of a proposal or reach Tezos Mainnet.
These networks are based on Alpha development versions of the Tezos economic protocol and the Octez suite.

The two periodic protocols currently are Weeklynet and Dailynet.
They are named this way because they are reset weekly and daily, respectively.

Weeklynet is a network that restarts every Wednesday, with the latest Docker build as a reference. It is the place to test upcoming new features. It is also a network to use if you are a big baker or a BaaS provider and you want to test tailored infrastructure.

Dailynet is a network that restarts every day, with the latest Docker build as a reference. This network is mainly used by protocol developers.

### Working with periodic test networks

To work with the periodic test networks, you must use exactly the same version of the Octez suite as the network.
For this reason, wallets typically don't work with these networks.
For example, you can look up information about Weeklynet at https://teztnets.com/weeklynet-about.
This page shows the URL of a Weeklynet RPC endpoint to use and instructions for connecting to the network in different ways.

There are two main ways to use periodic test networks:

- Run the Docker image with the correct version of the Octez suite
- Build the Octez suite from the specific Git commit that is listed on the test network page

In either case, you must connect the Octez suite to the test network RPC endpoint.
For example, if the Weeklynet endpoint on https://teztnets.com/weeklynet-about is `https://rpc.weeklynet-2024-01-17.teztnets.com`, you can connect the Octez client by running this command:

```bash
octez-client -E https://rpc.weeklynet-2024-01-17.teztnets.com config init
```

Then you can create a local wallet by running `octez-client gen keys my_account` and fund it with the network faucet.

For convenience, teztnets.com provides information about the test networks at https://teztnets.com/teztnets.json.
You can use the data from this file to set up your environment, such as setting environment variables.

For example, to get information about Weeklynet, install the `curl` and `jq` programs and run this command:

```bash
curl https://teztnets.com/teztnets.json | jq '.[] | select(.human_name == "Weeklynet")'
```

You can use the response to set environment variables like the RPC endpoint, as in this code:

```bash
curl https://teztnets.xyz/teztnets.json | jq '.[] | select(.human_name == "Weeklynet")' > weeklynet.json
export WEEKLYNET_ENDPOINT=$(jq -r .rpc_url weeklynet.json)
export WEEKLYNET_COMMIT=$(jq -r .git_ref weeklynet.json)
export DOCKER_IMAGE=$(jq -r .docker_build weeklynet.json)
```

Here are some other tips for using the Docker images for periodic test networks:

- The Docker images for each instance of the periodic test networks are listed on the information page for the network.
For example, Weeklynet information is here: https://teztnets.com/weeklynet-about
- The Docker images are based on Alpine Linux, which uses the `apk` package manager.
For example, to install the `curl` program, run `sudo apk add curl`.
- The shell interpreter path is `/bin/sh`, not `/usr/bin/bash` as on many Linux distributions.

## Public nodes and faucets

To connect to existing public nodes for these networks, or to get some testnet-only tez on these from a faucet, check [https://teztnets.com](https://teztnets.com/).

Other sources of public nodes include:

- [Community RPC Nodes](https://tezostaquito.io/docs/rpc_nodes) listed by ECAD Labs.
- [SmartPy nodes](https://smartpy.io/nodes).

## Testing with your own private network

In some special cases, you may want to run your own private network for your testing. This could be true if you are developing tools that you want to keep confidential until you put them into production, and if the sandboxed mode is not sufficient for your situation.

See the [Private blockchain](https://opentezos.com/private) section on OpenTezos to learn how to set up your own network.

## Further reading

- [Test networks by Nomadic Labs](https://tezos.gitlab.io/introduction/test_networks.html)
- Medium post: [Introducing Ghostnet](https://medium.com/the-aleph/introducing-ghostnet-1bf39976e61f)
