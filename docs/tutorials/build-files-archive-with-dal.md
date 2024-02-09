---
title: Implement a file archive with the DAL and a Smart Rollup
authors: 'Tezos Core Developers'
last_update:
  date: 9 February 2024
---

:::note Experimental
The Data Availability Layer is an experimental feature that is not yet available on Tezos Mainnet.
The way the DAL works may change significantly before it is generally available.
:::

The Data Availability Layer (DAL) is a companion peer-to-peer network for the Tezos blockchain, designed to provide additional data bandwidth to Smart Rollups.
It allows users to share large amounts of data in a way that is decentralized and permissionless, because anyone can join the network and post and read data on it.

In this tutorial, you will set up a file archive that stores and retrieves files with the DAL.
You will learn:

- How data is organized and shared with the DAL and the reveal data channel
- How to read data from the DAL in a Smart Rollup
- How to host a DAL node
- How to publish data and files with the DAL

Because the DAL is not yet available on Tezos Mainnet, this tutorial uses the [Weeklynet test network](https://teztnets.com/weeklynet-about), which runs on a newer version of the protocol that includes the DAL.
Weeklynet runs just like other Tezos networks like Mainnet and Ghostnet, with its own nodes, bakers, and accusers, so you don't need to run your own nodes and bakers.

See these links for more information about the DAL:

- For technical information about how the DAL works, see [Data Availability Layer](https://tezos.gitlab.io/shell/dal.html) in the Octez documentation.
- For more information about the approach for the DAL, see [The Rollup Booster: A Data-Availability Layer for Tezos](https://research-development.nomadic-labs.com/data-availability-layer-tezos.html).

## Tutorial applications

In this tutorial, you set up these components:

- The Octez client, which you use to manage a local wallet, deploy a Smart Rollup, and send data to the DAL
- A Data Availability Layer node (not to be confused with a layer 1 node), which stores data temporarily and distributes it to Smart Rollups
- A Smart Rollup that listens for data published to the DAL, retrieves it from the DAL node, and stores it locally

For simplicity, you do not set up a layer 1 node or a baker, which are responsible for verifying that the data is available before Smart Rollups can access it.
Instead, you use the existing nodes and bakers that are running on Weeklynet.

## Prerequisites

This article assumes some familiarity with Smart Rollups.
If you are new to Smart Rollups, see the tutorial [Deploy a Smart Rollup](./smart-rollup).

## Why the DAL?

The DAL has earned the nickname "Rollup Booster" from its ability to address
the last bottleneck Smart Rollups developers could not overcome without
sacrificing decentralization: block space. Smart Rollups offload
*computation* from layer 1, but the transactions that they process still need to
originate from somewhere.

By default, that "somewhere" is the layer 1 blocks, yet the size of a Tezos
block is limited to around 500KBytes. In this model, while Smart Rollups do not
compete for layer 1 gas anymore, they still compete for block space.

The DAL allows third parties to publish data and have bakers attest that the data is available.
When enough bakers have attested that the data is available, Smart Rollups can retrieve the data without the need for additional trusted third-parties.

## How the DAL works

In this tutorial, you create a file archive application that allows clients to upload data to the DAL.
You also create a Smart Rollup that listens to the DAL and responds to that data.

The DAL works like this:

1. Users post data to a DAL node.
1. The DAL node returns a certificate.
This certificate includes a commitment that the data is available and a proof of the data.
1. Users post the certificate to layer 1 via the Octez client, which is much cheaper than posting the complete data.
1. When the certificate is confirmed in a block, layer 1 splits the data into shards and assigns those shards to bakers, who verify that the data is available.
1. Bakers verify that the data is available and attest that the data is available in their usual block attestations to layer 1.
They have a certain number of blocks to do so, known as the _attestation lag_, and if they don't by the end of this period, the certificate is considered bogus and the related data is dropped.
1. Other DAL nodes get the data from the initial DAL node through the peer-to-peer network.
1. The Smart Rollup node monitors the blocks and when it sees attested DAL data, it connects to a DAL node to request the data.
1. The Smart Rollup node stores the data in its durable storage, addressed by its hash.
Smart Rollups must store the data because it is available on the DAL for only a short time.
1. Users who know the hash of the data can download it from the Smart Rollup node.

The overall workflow is summarized in the following figure:

![Overall diagram of the workflow of the Data Availability Layer](/img/architecture/dal-workflow.png)
<!-- https://lucid.app/lucidchart/cc422278-7319-4a2f-858a-a7b72e1ea3a6/edit -->

There are many steps in the DAL process, but the most complicated parts (storing and sharing data) are handled automatically by the various daemons in the Octez suite.

:::note
When you install a Smart Rollup, you provide only the installer kernel on layer 1 and the full kernel via the reveal data channel.
Currently, you cannot send the full kernel data over the Data Availability Layer, so this tutorial relies on the reveal data channel to install the kernel as usual.
:::

When you are ready, get started by going to [Part 1: Setting up an environment](./build-files-archive-with-dal/set-up-environment).
