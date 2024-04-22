---
title: "Part 5: Deploying the contract"
authors: Tim McMackin
last_update:
  date: 22 April 2024
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

Because the token is FA2-compliant, wallet applications can work with it directly.
However, you must add the token contract to your wallet for it to recognize the token.

The process for adding a token contract to a wallet depends on the wallet application.
Here are steps for the Temple wallet:

1. Copy the address of the contract.

1. Open the Temple wallet and sign in.

1. Under the list of tokens, click **Manage assets list**:

   <img src="/img/tutorials/fa2-fungible-in-temple.png" alt="Opening the asset list filter" style={{width: 300}} />

1. From the popup window, click **Manage**:

   <img src="/img/tutorials/fa2-fungible-temple-manage-assets.png" alt="The Manage button in the popup window" style={{width: 300}} />

1. Click **Add Asset**:

   <img src="/img/tutorials/fa2-fungible-temple-add-asset.png" alt="Adding an asset to the tokens list" style={{width: 300}} />

1. In the window that opens add information about the token, including the contract address, the token ID (such as 0 or 1), and the the symbol for the token, such as `TOK0`:

   <img src="/img/tutorials/fa2-fungible-temple-adding-token.png" alt="Adding information about the token" style={{width: 300}} />

1. Click **Add Asset**.

Now the token appears in your wallet just like any other token:

<img src="/img/tutorials/fa2-fungible-temple-assets-list.png" alt="The new token in the Temple wallet" style={{width: 300}} />

From here, you can run transactions on the token, such as sending it to a different account.

## Next steps

