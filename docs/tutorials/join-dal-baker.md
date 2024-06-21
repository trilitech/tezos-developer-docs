---
title: Join the DAL as a baker, in 5 steps
authors: Tezos core developers
last_update:
  date: 10 June 2024
---

The Tezos data availability layer (DAL) is a key component for the scalability of Tezos.
In a nutshell, the DAL increases the data bandwidth available for Tezos Smart Rollups by providing a peer-to-peer network that they can use to fetch data without compromising security.

Just like layer 1, Tezos bakers ensure the security of the DAL.
Bakers not only produce blocks but also attest that other bakers' blocks are valid and properly published on layer 1.
In the same way, bakers attest that data published to the DAL is available.
In the current implementation of the DAL, bakers do not receive extra incentives for attesting DAL data, but they might in the future.
For now, bakers can join the DAL without risking any reward loss, ensuring a smooth transition.

This incentive-free version of the DAL is currently available on the Weeklynet test network.
In this tutorial you learn how to join Weeklynet as a baker and attest the publication of data on the DAL network.

## Tutorial diagram

In this tutorial, you set up the Octez client and several Octez daemons, including a layer 1 node, a baker, and a DAL baking node.
The following diagram shows these daemons with a blue background:

![A diagram of the DAL architecture, with the daemons that you create in this tutorial highlighted](/img/tutorials/join-dal-baker-overview.png)
<!-- https://lucid.app/lucidchart/b6b076ec-194c-4011-8e20-fa348bb983f3/edit?page=0_0# -->

## References

- For an overview of the DAL, see [Data Availability Layer](../architecture/data-availability-layer).
- For an introduction to how the DAL works, see the tutorial [Implement a file archive with the DAL and a Smart Rollup](./build-files-archive-with-dal).
- For technical information about the DAL, see [Data-Availability Layer](https://tezos.gitlab.io/shell/dal.html) in the Octez documentation.

:::warning
This tutorial uses a very simple setup running all required daemons on the same machine. In a production environment, we advise against running a DAL attester node under the same IP address than a baker's node because the DAL node may leak the IP address and ease DOS attacks on the baker. See also [the DAL documentation page on baking](https://tezos.gitlab.io/shell/dal_bakers.html).
:::

:::warning
The UX of the DAL components will be subject to changes with the feedback from the testers following this tutorial, so this tutorial will be updated accordingly. Feel free to file issues if it's not up-to-date.
:::

- [Step 1: Get a Weeklynet-compatible Octez version](./join-dal-baker/get-octez)
- [Step 2: Run an Octez node on Weeklynet](./join-dal-baker/run-node)
- [Step 3: Set up a baker account on Weeklynet](./join-dal-baker/prepare-account)
- [Step 4: Run an Octez DAL node on Weeklynet](./join-dal-baker/run-dal-node)
- [Step 5: Run an Octez baking daemon on Weeklynet](./join-dal-baker/run-baker)
- [Conclusion](./join-dal-baker/conclusion)
