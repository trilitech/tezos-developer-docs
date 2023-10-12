---
id: deploy
title: "Part 5: Deploying (originating) the rollup"
lastUpdated: 11th October 2023
---

Smart rollups are originated in a way similar to smart contracts.
Instead of running the `octez-client originate contract` command, you run the `octez-client originate smart rollup` command.
This command creates an address for the rollup and stores a small amount of data about it on layer 1.

1. In the second terminal window, in the Docker container, in the `hello-world-kernel` folder, run this command to deploy the installer kernel to the Tezos sandbox:

   ```bash
   octez-client originate smart rollup "test_smart_rollup" from "bootstrap1" of kind wasm_2_0_0 of type bytes with kernel file:hello_world_kernel_installer.hex --burn-cap 3
   ```

   If you need to open a new terminal window within the Docker container, run the command `docker exec -it octez-container /bin/sh`.

Like the command to originate a smart contract, this command uses the `--burn-cap` argument to allow the transaction to take fees from the account.
Also like deploying a smart contract, the response in the terminal shows information about the transaction and the address of the originated smart rollup, which starts with `sr1`.

Now layer 1 is aware of the rollup and nodes can run the rollup kernel.
