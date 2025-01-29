---
title: Implement a file archive with the DAL and a Smart Rollup
authors: Tezos Core Developers
last_update:
  date: 27 January 2025
dependencies:
  octez: 21.2
  rust: 1.80.0
  tezos-smart-rollup: 0.2.2
---

The Data Availability Layer (DAL) is a companion peer-to-peer network for the Tezos blockchain, designed to provide additional data bandwidth to Smart Rollups.
It allows users to share large amounts of data in a way that is decentralized and permissionless, because anyone can join the network and post and read data on it.

This tutorial uses the Ghostnet test network, but you can use the information in it to work with other test networks or Tezos Mainnet.

In this tutorial, you set up a file archive that stores and retrieves files with the DAL.
You will learn:

- How data is organized and shared with the DAL and the reveal data channel
- How to read data from the DAL in a Smart Rollup
- How to host a DAL node
- How to publish data and files with the DAL

See these links for more information about the DAL:

- For technical information about how the DAL works, see [Data Availability Layer](https://tezos.gitlab.io/shell/dal.html) in the Octez documentation.
- For more information about the approach for the DAL, see [The Rollup Booster: A Data-Availability Layer for Tezos](https://research-development.nomadic-labs.com/data-availability-layer-tezos.html).

## Tutorial applications

In this tutorial, you set up these components:

- The Octez client, which you use to manage a local wallet, deploy a Smart Rollup, and send data to the DAL
- A layer 1 node to provide a connection to Tezos and information about the state of layer 1, including metadata about what data is available on the DAL
- A Data Availability Layer node (not to be confused with a layer 1 node), which stores data temporarily and distributes it to Smart Rollups
- A Smart Rollup that listens for data published to the DAL, retrieves it from the DAL node, and stores it locally
- A Smart Rollup node that runs your Smart Rollup

For simplicity, you do not set up a baker, which is responsible for verifying and attesting that the data is available before Smart Rollups can access it.
For instructions on running a layer 1 node and baker with the DAL, see the tutorial [Join the DAL as a baker, in 5 steps](/tutorials/join-dal-baker).

## Tutorial diagram

Here is a diagram that shows the components that you set up in this tutorial in a light blue background:

![A diagram of the DAL file tutorial, highlighting the Octez client, DAL node, layer 1 node, and Smart Rollup that you create with a light blue background to distinguish them from the existing DAL nodes, layer 1 nodes, and bakers](/img/tutorials/dal-file-tutorial-setup.png)

<!-- https://lucid.app/lucidchart/58f5577e-91b5-4237-89c4-a8cdf81c71ad/edit -->

## Prerequisites

This article assumes some familiarity with Smart Rollups.
If you are new to Smart Rollups, see the tutorial [Deploy a Smart Rollup](/tutorials/smart-rollup).

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
1. The DAL node returns a certificate, which includes two parts:

   - The _commitment_ is like a hash of the data but has the additional ability to identify individual shards of the data and reconstruct the original data from a certain percentage of the shards.
   The number of shards needed depends on how the data is spread across shards, which is controlled by a parameter called the _redundancy factor_.
   - The _proof_ certifies the length of the data to prevent malicious users from overloading the layer with data.

1. Users post the certificate to Tezos layer 1 via the Octez client.
1. When the certificate is confirmed in a block, the DAL splits the data into shards and shares it through the peer-to-peer network.
1. Layer 1 assigns the shards to bakers.
1. Bakers verify that they are able to download the shards that they are assigned to.
1. Bakers attest that the data is available in their usual block attestations to layer 1.

   Each Tezos network has a delay of a certain number of blocks known as the _attestation lag_.
   This number of blocks determines when bakers attest that the data is available and when the data becomes available to Smart Rollups.
   For example, if a certificate is included in level 100 and the attestation lag is 4, bakers must attest that the data is available in level 104, along with their usual attestations that build on level 103.

   If enough shards are attested in that level, the data becomes available to Smart Rollups at the end of layer 104.
   If not enough shards are attested in that level, the certificate is considered bogus, the related data is dropped, and Smart Rollups cannot access it.

1. The Smart Rollup node monitors the blocks and when it sees attested DAL data, it connects to a DAL node to request the data.
Smart Rollups must store the data if they need it because it is available on the DAL for only a short time.

The overall workflow is summarized in the following figure:

![Overall diagram of the workflow of the Data Availability Layer](/img/architecture/dal-workflow.png)
<!-- https://lucid.app/lucidchart/cc422278-7319-4a2f-858a-a7b72e1ea3a6/edit -->

There are many steps in the DAL process, but the most complicated parts (storing and sharing data) are handled automatically by the various daemons in the Octez suite.

:::note
When you install a Smart Rollup, you provide only the installer kernel on layer 1 and the full kernel via the reveal data channel.
Currently, you cannot send the full kernel data over the Data Availability Layer, so this tutorial relies on the reveal data channel to install the kernel as usual.
:::

When you are ready, get started by going to [Part 1: Setting up an environment](/tutorials/build-files-archive-with-dal/set-up-environment).
