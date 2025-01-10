---
title: "Running a baker signing using a Ledger baking key"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

Now that the Ledger baking key is set up, you can follow the steps of [Run a Tezos node in 5 step](/tutorials/join-dal-baker). However, some steps will differ.

## Set up a baker account

While nothing changes for [Step 1: Run an Octez node](/tutorials/join-dal-baker/run-node), this is not the case for [Step 2: Set up a baker account](/tutorials/join-dal-baker/prepare-account).
For this step, you already have a baker! No need to regenerate it, just import it:

   ```bash
   octez-client import secret key my_baker remote:tz...
   ```

> Replace the `tz...` with the public key hash of your Ledger baking key.

:::note Stake

The `Tezos Baking` application does not allow you to sign some operations, such as the staking operation.
You will therefore need to quit the `Tezos Baking` application and sign using the `Tezos Wallet (XTZ)` application instead.

:::

## Before running the Octez baking daemon

You can follow [Step 3: Run an Octez DAL node](/tutorials/join-dal-baker/run-dal-node) without any extra steps. However, before starting [Step 4: Run an Octez baking daemon](/tutorials/join-dal-baker/run-baker), in order to take advantage of the `octez-signer` checks and those of the `Tezos Baking` application, some steps are important.

### Setup the Ledger high watermark (HWM)

When the baker daemon will be running, the `Tezos Baking` application will prevent double baking, double-attesting and double pre-attesting.

To initialize the checks made, you can set up the HWM maintained by the application with the block level of the chain for which you will have to start to bake.

:::note Warning

This step is not necessary to be able to bake. However, if the HWM is not initialized, the first level encountered in an operation or block to be signed will be used as the initialization level. For this first operation or block, double baking, double-attesting or double pre-attesting will not be detected. It is therefore **strongly recommended** to at least initialize the HWM with the level of the block at the head of the chain.

:::

Go back to the `Tezos Baking` application and run:

   ```bash
   octez-signer set ledger high watermark for my_ledger_key to <LEVEL>
   ```

A validation from your Ledger device will be required.

Output:

   ```console
   ledger://masculine-pig-stupendous-dugong/secp256k1/0h/0h has now high water mark: 42 (round: 0)
   ```

:::note

The HWM can be set up directly from the setup command:

   ```bash
   octez-signer setup ledger to bake for my_ledger_key --main-hwm <LEVEL>
   ```

:::

### Setup additionnal checks for `octez-signer`

`octez-signer` also has the ability to enable various checks. Stop the previously launched `octez-signer` TCP socket and restart it with the following command:

   ```bash
   octez-signer launch socket signer -M 0x11,0x12,0x13 -W -a localhost
   ```

> The `-M 0x11,0x12,0x13` option is used to only request consensus operations and blocks to be signed.

> The `-W` tag is used to activate the HWM check.

:::note Warning

The `-W` tag is required if you have chosen to disable the `High Watermark` option in the `Tezos Baking` application.

:::

## Security verifications

Everything is ready, you can now finish the tutorial [Run a Tezos node in 5 step](/tutorials/join-dal-baker), the baking daemon will send the data to be signed to `octez-signer` which will send it to your Ledger device which will sign them.

Once the baking daemon has started, you can check on your Ledger device that the HWM is evolving in accordance with the blocks signed by your Ledger baking key.

The `octez-signer` also stores the HWM for the blocks it has signed. You can find them in a file named `Net..._highwatermarks` in the `.tezos-client` folder.

> `Net...` being the chain-id of the chain in which you bake.

Open the file and check that the HWMs evolve in accordance with the blocks signed by your Ledger baking key:

   ```bash
   cat .tezos-client/NetXnHfVqm9iesp_highwatermarks
   ```

   ```json
   { "blocks":
       [ { "delegate": "tz...",
           "highwatermark": { "round": 0, "level": 107095 } } ],
     "preattestations":
       [ { "delegate": "tz...",
           "highwatermark": { "round": 0, "level": 107096 } } ],
     "attestations":
       [ { "delegate": "tz...",
           "highwatermark": { "round": 0, "level": 107096 } } ] }
   ```


