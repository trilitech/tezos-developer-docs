---
title: "Part 4: Deploying (originating) the rollup"
last_update:
  date: 1 August 2024
---

Smart Rollups are originated in a way similar to smart contracts.
Instead of running the `octez-client originate contract` command, you run the `octez-client originate smart rollup` command.
This command creates an address for the rollup and stores a small amount of data about it on layer 1.

1. In the Docker container, in the `hello-world-kernel` folder, run this command to start the sandbox:

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

1. In the new terminal window, go to the folder with the Smart Rollup code:

   ```bash
   cd hello-world-kernel
   ```

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

1. Run this command to deploy the installer kernel to the Tezos sandbox:

   ```bash
   octez-client originate smart rollup \
     "test_smart_rollup" from "bootstrap1" \
     of kind wasm_2_0_0 of type bytes \
     with kernel file:hello_world_kernel_installer.hex --burn-cap 3
   ```

   If you need to open a new terminal window within the Docker container, run the command `docker exec -it octez-container /bin/sh`.

   Like the command to originate a smart contract, this command uses the `--burn-cap` argument to allow the transaction to take fees from the account.
   Also like deploying a smart contract, the response in the terminal shows information about the transaction and the address of the originated Smart Rollup, which starts with `sr1`.

Now layer 1 is aware of the rollup and nodes can run the rollup kernel.
