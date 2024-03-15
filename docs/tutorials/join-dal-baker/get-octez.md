---
title: "Step 1: Get a Weeklynet-compatible Octez version"
authors: Tezos core developers
last_update:
  date: 28 February 2024
---

The Weeklynet test network restarts every Wednesday at 0h UTC, and for most of its lifetime (from level 512) it runs a development version of the Tezos protocol, called Alpha, which is not part of any released version of Octez.
To work with Weeklynet, you must use the exact same version of the Octez suite that Weeklynet is using.

The easiest way to do this is to use the Docker image that is generated each time Weeklynet is reset and recreated.
As another option, you can build the specific version of the Octez suite locally.
For instructions, see the Weeklynet page at https://teztnets.com/weeklynet-about.

To set up an environment and account in a Docker container, follow these steps:

1. From the [Weeklynet](https://teztnets.com/weeklynet-about) page, find the Docker command to create a container from the correct Docker image.
For example, the command to start a Docker image for the Weeklynet launched on January 17 2024 was:

   ```bash
   docker run -it --entrypoint=/bin/sh tezos/tezos:master_7f3bfc90_20240116181914
   ```

   The image tag in this command changes each time the network is reset.

1. In the container, initialize the Octez node with the command on the Weeklynet page, such as this example:

   ```bash
   octez-node config init --network https://teztnets.com/weeklynet-2024-01-17
   ```

   The specific command is on the Weeklynet page at https://teztnets.com/weeklynet-about.

Now you have the Octez node configured to work with Weeklynet.
The next step is to start the Octez node; continue to [Step 2: Run an Octez node on Weeklynet](./run-node).
