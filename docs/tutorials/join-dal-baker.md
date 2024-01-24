# How to join the Tezos DAL as a baker, in 5 steps

Tezos' [Data-Availability Layer](https://tezos.gitlab.io/shell/dal.html) (DAL for short), is an experimental feature which is, at the time of writing, not available on Tezos Mainnet but planned to be proposed in a protocol amendment in the near future.

The DAL is a key component for the scalability of Tezos. In a nutshell, the DAL is about increasing the data bandwidth available for Tezos Smart Rollups thanks to a new parallel P2P network on which rollups could connect to fetch inputs without compromising their security.

In order for the DAL to be as secure as the Tezos Layer 1 itself, bakers need to play a very important role in it. Currently, bakers on the L1 network are not only responsible for producing blocks but also for attesting that blocks are published on the L1 network. They are rewarded for this contribution through protocol incentives. Similarly, the role of bakers in the DAL would be to attest the publication of data on the DAL's P2P network. They would in turn be rewarded for this through (potentially different) protocol incentives.

Given that setting up a new P2P network with several hundred active participants may take some time, the first proposed version of the DAL for Tezos Mainnet will not provide any participation incentives. This will let plenty of time for bakers to join the DAL network without risking any reward loss, ensuring a smooth transition.

This incentive-free version of the DAL is already available on the Weeklynet test network. In this tutorial you will learn how to join Weeklynet as a baker and attest the publication of data on the DAL network.

:::warning
This tutorial uses a very simple setup running all required daemons on the same machine. In a production environment, we advise against running a DAL attester node under the same IP address than a baker's node because the DAL node may leak the IP address and ease DOS attacks on the baker. See also [the DAL documentation page on baking](https://tezos.gitlab.io/shell/dal_bakers.html).
:::

:::warning
The UX of the DAL components will be subject to changes with the feedback from the testers following this tutorial, so this tutorial will be updated accordingly. Feel free to file issues if it's not up-to-date.
:::

- [Step 1: get a Weeklynet-compatible Octez version](./join-dal-baker/get-octez)
- [Step 2: run an Octez node on Weeklynet](./join-dal-baker/run-node)
- [Step 3: setting up a baker account on Weeklynet](./join-dal-baker/prepare-account)
- [Step 4: run an Octez DAL node on Weeklynet](./join-dal-baker/run-dal-node)
- [Step 5: run an Octez baking daemon on Weeklynet](./join-dal-baker/run-baker)
- [Conclusion](./join-dal-baker/conclusion)