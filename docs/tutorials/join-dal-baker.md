---
title: Join the DAL as a baker, in 5 steps
authors: Tezos core developers, Tim McMackin
last_update:
  date: 19 July 2024
---

The Tezos data availability layer (DAL) is a key component for the scalability of Tezos.
In a nutshell, the DAL increases the data bandwidth available for Tezos Smart Rollups by providing a peer-to-peer network that they can use to fetch data without compromising security.

When users and dApps submit data to the DAL, the DAL nodes attest that it is available and distribute it to Smart Rollup nodes, which can store the data and us it.

Just like layer 1, Tezos bakers ensure the security of the DAL.
Bakers not only produce blocks but also attest that other bakers' blocks are valid and properly published on layer 1.
In the same way, bakers attest that data published to the DAL is available.
In the current implementation of the DAL, bakers do not receive extra incentives for attesting DAL data, but they might in the future.
For now, bakers can join the DAL without risking any reward loss, ensuring a smooth transition.

In this tutorial you learn how to join Weeklynet as a baker and attest the publication of data on the DAL network.
This tutorial uses Weeklynet because you can get a large amount of tez quickly from its faucet, which allows your baker to get attestation rights quickly.
Weeklynet is active in the Tezos protocol and therefore also available on other Tezos networks including Mainnet and Ghostnet.

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
This tutorial uses a very simple setup running all required daemons on the same machine.
In a production environment, we advise against running a DAL attester node under the same IP address than a baker's node because the DAL node may leak the IP address and ease DOS attacks on the baker. See also [the DAL documentation page on baking](https://tezos.gitlab.io/shell/dal_bakers.html).
:::

:::warning
The UX of the DAL components will be subject to changes with the feedback from the testers following this tutorial, so this tutorial will be updated accordingly. Feel free to file issues if it's not up-to-date.
:::

- [Step 1: Get a compatible Octez version](./join-dal-baker/get-octez)
- [Step 2: Run an Octez node](./join-dal-baker/run-node)
- [Step 3: Set up a baker account](./join-dal-baker/prepare-account)
- [Step 4: Run an Octez DAL node](./join-dal-baker/run-dal-node)
- [Step 5: Run an Octez baking daemon](./join-dal-baker/run-baker)
- [Conclusion](./join-dal-baker/conclusion)
