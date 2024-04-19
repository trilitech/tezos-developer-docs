---
title: "Part 5: Deploying the contract"
authors: Tim McMackin
last_update:
  date: 19 April 2024
---

So far you have tried the token in a local sandbox.
To test it on a live network, you can use the Ghostnet test network.

## Configuring the Octez client for Ghostnet

Follow these steps to set up your installation of the Octez client to work with Ghostnet:

1. Go to https://teztnets.com/ghostnet-about and copy the URL of a public RPC node for Ghostnet, such as https://rpc.ghostnet.teztnets.com.

1. Use that URL to configure the Octez client in this command:

   ```bash
   octez-client -E https://rpc.ghostnet.teztnets.com config update
   ```

1. If you don't have an account on Ghostnet, create or import one with the instructions in [Creating accounts](../../developing/octez-client/accounts).

1. Use the [Ghostnet faucet](https://faucet.ghostnet.teztnets.com/) to get some tez for the account.

## Setting the admin account in the contract

Currently, the admin account in the contract is an automatically-generated account.
Follow these steps to use your account as the admin account instead:

1. Compile the contract with the `python` command as you did in previous steps.

1. Get the address of your account by running this command:

   ```bash
   octez-client list known addresses
   ```

1. Update the `step_003_cont_0_storage.tz` file so your address is the first address listed, which is the admin account.

1. Deploy the contract to Ghostnet by passing your account alias, the compiled contract, and initial storage value to the `originate contract` command.
For example, if your compiled files are in the `fa2_lib_fungible` folder, the command looks like this:

   ```bash
   octez-client originate contract smartpy_fa2_fungible \
       transferring 0 from my_account \
       running fa2_lib_fungible/step_003_cont_0_contract.tz \
       --init "$(cat fa2_lib_fungible/step_003_cont_0_storage.tz)" --burn-cap 3 --force
   ```

1. Copy the address of the contract from the output of the command.
The contract address starts with `KT1`.

1. Look up the contract on the block explorer [Better Call Dev](https://better-call.dev/)

   Note that the block explorer recognizes that the contract is FA2-compliant and shows an FA2 icon at the top of the page.
   The block explorer also shows information about the tokens on the Tokens tab.

1. Mint some tokens and send them to your account from the Interact tab.

TODO more detail and screencaps

## Interact with the token in a wallet

TODO

1.