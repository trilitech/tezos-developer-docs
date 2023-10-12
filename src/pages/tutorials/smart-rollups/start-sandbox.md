---
id: start-sandbox
title: "Part 2: Starting a Tezos sandbox"
lastUpdated: 11th October 2023
---

Follow these steps to set up a Tezos sandbox that you can use to test the smart rollup.
These steps use the Octez command-line client to set up a sandbox in a Docker container:

1. Pull the most recent Tezos Docker image, which contains the most recent version of Octez:

   ```bash
   docker pull tezos/tezos:master
   ```

   You can also install Octez directly on your system, but keeping it in Docker is faster and more convenient for running the tutorial application.

1. Make sure you are in the `hello-world-kernel` folder, at the same level as the `Cargo.toml` and `sandbox_node.sh` files.

1. Run this command to start the Docker image, open a command-line terminal in that image, and mount the `hello-world-kernel` folder in it:

   ```bash
   docker run -it --rm --volume $(pwd):/home/tezos/hello-world-kernel --entrypoint /bin/sh --name octez-container tezos/tezos:master
   ```

   Your command-line prompt changes to indicate that it is now inside the running Docker container.
   This image includes the Octez command-line client and other Tezos tools.
   It also uses the docker `--volume` argument to mount the contents of the `hello-world-kernel` folder in the container so you can use those files within the container.

1. Verify that the container has the necessary tools by running these commands:

   ```bash
   octez-node --version
   octez-smart-rollup-wasm-debugger --version
   octez-smart-rollup-node-alpha --version
   octez-client --version
   ```

   Each of these commands should print a version number.
   The specific version number is not important as long as you retrieved the latest image with the `docker pull tezos/tezos:master` command.

   Don't close this terminal window or exit the Docker terminal session, because Docker will close the container.
   If you accidentally close the container, you can run the `docker run ...` command again to open a new one.

1. Within the container, go to the `hello-world-kernel` folder:

   ```bash
   cd hello-world-kernel
   ```

1. Also inside the container, start the Tezos sandbox by running this command:

   ```bash
   ./sandbox_node.sh
   ```

   This command starts a Tezos testing environment, including a baking node running in sandbox mode and a group of test accounts.
   The console shows repeated messages that show that the node is baking blocks.
   For more information about sandbox mode, see [sandbox mode](https://tezos.gitlab.io/user/sandbox.html).

   If you see an error that says "Unable to connect to the node," you can ignore it because it happens only once while the node is starting.

1. Leave that terminal instance running for the rest of the tutorial.

1. Open a new terminal window.

1. In the new terminal window, enter the Docker container by running this command:

   ```bash
   docker exec -it octez-container /bin/sh
   ```

   Now the second terminal window is running inside the container just like the first one.

1. In the second terminal window, run this command to verify that the sandbox is running with the correct protocol:

   ```bash
   octez-client rpc get /chains/main/blocks/head/metadata | grep protocol
   ```

   The response shows the protocol that the sandbox is running, as in this example:

   ```
   { "protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK",
     "next_protocol": "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK",
   ```

   If you don't see a message that looks like this one, check for errors in the first terminal window.

Now the sandbox is running in the Docker container and you can use it to test the rollup.
