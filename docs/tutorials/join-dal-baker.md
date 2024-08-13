---
title: Join the DAL as a baker in 5 steps
authors: Tezos core developers, Tim McMackin
last_update:
  date: 13 August 2024
---

The Tezos data availability layer (DAL) is a key component for the scalability of Tezos.
In a nutshell, the DAL increases the data bandwidth available for Tezos Smart Rollups by providing a peer-to-peer network that they can use to fetch data without compromising security.

When users and dApps submit data to the DAL, layer 1 nodes attest that it is available and DAL nodes distribute it to Smart Rollup nodes, which can store the data and use it.

Just like layer 1, Tezos bakers ensure the security of the DAL.
Bakers not only produce blocks but also attest that other bakers' blocks are valid and properly published on layer 1.
In the same way, bakers attest that data published to the DAL is available.
In the current implementation of the DAL, bakers do not receive extra incentives for attesting DAL data, but they might in the future.
For now, bakers can join the DAL without risking any reward loss, ensuring a smooth transition.

In this tutorial, you learn how to join Ghostnet as a baker and attest the publication of data on the DAL network on Ghostnet.
The steps for participating on any other network, including Tezos Mainnet, are similar.

:::note Attestation rights delay

This tutorial includes setting up a baker to attest that data is available on the DAL.
Depending on the network, it takes time for bakers to get attestation rights.
The delay on Ghostnet is about 3.5 days, so in this tutorial you do setup work, wait 3.5 days for attestation rights, and verify that your DAL node and baker are working properly.

If you don't want to wait that long, you can use Weeklynet, where the delay is about an hour.
However, to use Weeklynet, you must use a specific version of the Octez suite.
You must also be aware that the network completely resets and moves to a new version of the Octez suite every Wednesday.
For information about using Weeklynet, see [Testing on sandboxes and testnets](../developing/testnets).

:::

## Tutorial diagram

In this tutorial, you set up the Octez client and several Octez daemons, including a layer 1 node, a baker, and a DAL  node.
The following diagram shows these daemons with a blue background:

![A diagram of the DAL architecture, with the daemons that you create in this tutorial highlighted](/img/tutorials/join-dal-baker-overview.png)
<!-- https://lucid.app/lucidchart/b6b076ec-194c-4011-8e20-fa348bb983f3/edit?page=0_0# -->

## Prerequisites

This tutorial requires Docker Desktop.
To install Docker Desktop, see https://www.docker.com.

## References

- For an overview of the DAL, see [Data Availability Layer](../architecture/data-availability-layer).
- For an introduction to how the DAL works, see the tutorial [Implement a file archive with the DAL and a Smart Rollup](./build-files-archive-with-dal).
- For technical information about the DAL, see [Data-Availability Layer](https://tezos.gitlab.io/shell/dal.html) in the Octez documentation.

- [Step 1: Run an Octez node](./join-dal-baker/run-node)
- [Step 2: Set up a baker account](./join-dal-baker/prepare-account)
- [Step 3: Run an Octez DAL node](./join-dal-baker/run-dal-node)
- [Step 4: Run an Octez baking daemon](./join-dal-baker/run-baker)
- [Step 5: Verify attestation rights](./join-dal-baker/verify-rights)
- [Conclusion](./join-dal-baker/conclusion)
