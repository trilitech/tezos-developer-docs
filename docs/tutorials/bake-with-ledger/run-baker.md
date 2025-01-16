---
title: "Running a baker signing using a Ledger baking key"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

Now that the Ledger baking key is set up, you can follow the steps of [Run a Tezos node in 5 steps](/tutorials/join-dal-baker). However, some steps will differ.

## Set up a baker account

Complete the [Step 1: Run an Octez node](/tutorials/join-dal-baker/run-node) of the tutorial, and make following changes in [Step 2: Set up a baker account](/tutorials/join-dal-baker/prepare-account).

 - If you **want to use a consensus key**, instead of generating it, use the Ledger key. To do so, import it from the `octez-signer` remote with the following command:

    ```bash
    octez-client import secret key consensus_key remote:tz...
    ```

    > Replace the `tz...` with the public key hash of your Ledger baking key.

    You can then continue to set up your baker account.

    By registering your baker as a delegate with the ledger key as the consensus key, the baker daemon will sign using the Ledger.

 - If you **don't want to use a consensus key**, use your Ledger key directly as a baker. Import it from the `octez-signer` remote with the following command:

    ```bash
    octez-client import secret key my_baker remote:tz...
    ```

    > Replace the `tz...` with the public key hash of your Ledger baking key.

    In that case, to be able to sign the operations required to set up your baker, you need to use the `Tezos Wallet (XTZ)` application.
    Quit the `Tezos Baking` application and open the `Tezos Wallet (XTZ)` application.

## Before running the Octez baking daemon

Complete [Step 3: Run an Octez DAL node](/tutorials/join-dal-baker/run-dal-node). For the [Step 4: Run an Octez baking daemon](/tutorials/join-dal-baker/run-baker), make following changes to setup `octez-signer` and `Tezos Baking` application.

### Setup the Ledger high watermark (HWM)

For security reasons, always reset HWM to the highest possible block value before starting to bake. The highest block can be obtained from [Tzkt](https://www.tzkt.io/blocks?expand=1). Then, use that block value as the level in the following command.

Go back to the `Tezos Baking` application and run:

   ```bash
   octez-signer set ledger high watermark for my_ledger_key to <LEVEL>
   ```

On your Ledger device, you should see a screen sequence similar to:
![Ledger Setup Review](/img/tutorials/bake-with-ledger/set-hwm-review.png)
<!-- https://lucid.app/lucidchart/26df7357-40e6-4c1b-8ffe-0e4b8eebf707/edit?beaconFlowId=D98D3B908C0603CC&invitationId=inv_08b134b7-3e40-4429-af31-101e36489cc3&page=0_0# -->

Check that the HWM is the one you supplied, then you can approve.

Output:

   ```console
   ledger://masculine-pig-stupendous-dugong/secp256k1/0h/0h has now high water mark: 42 (round: 0)
   ```

:::note

Alternatively, the HWM can be set up from the setup command:

   ```bash
   octez-signer setup ledger to bake for my_ledger_key --main-hwm <LEVEL>
   ```

:::

### Set up additional checks for `octez-signer`

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

Everything is ready, you can now finish the tutorial [Run a Tezos node in 5 steps](/tutorials/join-dal-baker). The baking daemon will send the data to be signed to `octez-signer` which will send it to your Ledger device, which will sign them.

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

Now the baking daemon is running and using the Ledger to sign consensus (baking) operations. You can leave the baker running and check on it by looking at the block numbers at the end of the `.tezos-client/NetXnHfVqm9iesp_highwatermarks` file.

