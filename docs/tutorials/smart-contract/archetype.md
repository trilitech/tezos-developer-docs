---
title: Deploy a smart contract with Archetype
authors: 'Tim McMackin'
lastUpdated: 12th October 2023
---

This tutorial covers writing a smart contract and deploying it to Tezos in the Archetype programming language.
It uses the completium-cli command-line tool, which lets you work with Archetype contracts and Tezos from the command line.

- If you are more familiar with Python, try [Deploy a smart contract with SmartPy](./smartpy).
- If you are more familiar with OCaml, try [Deploy a smart contract with CameLIGO](./cameligo).
- If you are more familiar with JavaScript, try [Deploy a smart contract with jsLIGO](./jsligo).

In this tutorial, you will learn how to:

- Create a wallet
- Get tokens from a faucet
- Code a contract in Archetype, including:
  - Defining the storage for the contract and its initial value
  - Defining entrypoints in the contract
  - Writing code to run when the entrypoints are called
- Deploy (or originate) the contract to Tezos
- Look up the current state of the contract
- Call the contract from the command line

## The Archetype language

Archetype is a high-level language designed specifically for writing Tezos smart contracts.
It has features that help you write smart contracts, including:

- Clear syntax that maps closely with how smart contracts work
- Enhancements that simplify working with storage
- Tools that help you verify conditions before running code, such as ensuring that the caller is authorized to run the entrypoint
- The ability to set up a contract as a state machine, which gives the contract a state and manages transitions between states
- The ability to verify that the contract does what it says it does through the process of formal verification

Like the other languages that Tezos accepts, Archetype code is compiled to Michelson to run on the blockchain.

For more information about Archetype, see https://archetype-lang.org/.

## Tutorial contract

The contract that you deploy in this tutorial stores a single integer.
It provides entrypoints that clients can call to change the value of that integer:

- The `increment` endpoint accepts an integer as a parameter and adds that integer to the value in storage
- The `decrement` endpoint accepts an integer as a parameter and subtracts that integer from the value in storage
- The `reset` endpoint takes no parameters and resets the value in storage to 0

After you deploy the contract, you or any other user can call it through the command line or a distributed application (dApp).

## Prerequisites

To run this tutorial, you need the completium-cli program:

1. Make sure that NPM is installed by running this command in your command-line terminal:

   ```bash
   npm --version
   ```

   If NPM is not installed, install Node.JS on your computer, which includes NPM, from this link: https://nodejs.org/en.

1. Install completium-cli by running this command:

   ```bash
   npm install -g @completium/completium-cli
   ```

   You can verify that completium-cli installed by running this command:

   ```bash
   completium-cli version
   ```

   If you see a message with the version of completium-cli, it is installed correctly.

1. Initialize completium-cli by running this command:

   ```bash
   completium-cli init
   ```

<!--
Eventually we should have the user create a local account and fund it with the faucet, but I can't create a local account due to this issue:
https://github.com/completium/completium-cli/issues/45
-->

## Using a testnet

Before you deploy your contract to the main Tezos network (referred to as *mainnet*), you can deploy it to a testnet.
Testnets are useful for testing Tezos operations because testnets provide tokens for free so you can work with them without spending real tokens.

Tezos testnets are listed on this site: https://teztnets.xyz/.

The [Ghostnet](https://teztnets.xyz/ghostnet-about) testnet is a good choice for testing because it is intended to be long-lived, as opposed to shorter-term testnets that allow people to test new Tezos features.

By default, completium-cli uses Ghostnet, but these steps verify the network:

1. Verify that completium-cli is set to use Ghostnet by running this command:

   ```bash
   completium-cli show endpoint
   ```

   The response shows the RPC endpoint that completium-cli is using, which is its access point to the Tezos network.
   If the response shows `Current network: ghost`, it is using Ghostnet.

1. If completium-cli is not using Ghostnet, switch to Ghostnet by running this command, selecting any endpoint labeled "ghost," and pressing Enter:

   ```bash
   completium-cli switch endpoint
   ```

## Creating a local wallet

Deploying and using a smart contract costs fees, so you need a local wallet and XTZ tokens.
You could use the default accounts that are included in completium-cli, but follow these steps to create your own local wallet on a test network:

1. Run the following command to generate a local wallet, replacing `local_wallet` with a name for your wallet:

   ```bash
   completium-cli generate account as local_wallet
   ```

1. Switch to the account that you created by running this command, selecting the new account, and pressing Enter:

   ```bash
   completium-cli switch account
   ```

1. Get the address for the wallet by running this command:

   ```bash
   completium-cli show account
   ```

   The result shows the address of the account, which begins with "tz1".

   You need the wallet address to send funds to the wallet, to deploy the contract, and to send transactions to the contract.

1. Copy the address for the account, which is labeled as the "public key hash" in the response to the previous command.
The address starts with "tz1".

1. On the testnets page at https://teztnets.xyz/>, click the faucet link for the Ghostnet testnet, which is at <https://faucet.ghostnet.teztnets.xyz.

1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of XTZ to add to your wallet.
1 XTZ is enough for the tutorial.
It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

   You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on mainnet.

   ![Fund your wallet using the Ghostnet Faucet](/img/tutorials/wallet-funding.png)

1. Run this command to check the balance of your wallet:

   ```bash
   completium-cli show account
   ```

If your wallet is set up correctly and the faucet has sent tokens to it, the response includes the balance of your wallet.

## Create the contract

The contract that you will create has these basic parts:

- A variable that represents the contract's storage, in this case an integer.
Contracts can have storage in the form of primitive types such as an integer, string, or timestamp, or a complex data type that contains multiple values.
For more information on contract data types, see [Data types](../../smart-contracts/data-types).

- Internal functions called entrypoints that run code when clients call the contract.

Follow these steps to create the code for the contract:

1. Run this command to create the contract file:

   ```bash
   touch counter.arl
   ```

1. Open the `counter.arl` file in any text editor.

1. At the top of the file, name the contract by putting the name after the `archetype` keyword:

   ```archetype
   archetype Counter
   ```

1. Define the storage for the contract by adding this line:

   ```archetype
   variable value : int = 10
   ```

   This line creates a variable in the contract's storage with the name "value."
   It is an integer type and has the initial value of 10.

   Any variables that you create with the `variable` keyword at the top level of the contract become part of its persistent storage.

1. Add the code for the increment and decrement entrypoints:

   ```archetype
   // Increment entrypoint
   entry increment(delta : int) {
     value += delta
   }

   // Decrement entrypoint
   entry decrement(delta : int) {
     value -= delta
   }
   ```

   These functions begin with the `entry` keyword to indicate that they are entrypoints.
   They accept one parameter: the change in the storage value, which is an integer named `delta`.
   One function adds the parameter to the value of the `value` variable and the other subtracts it.

1. Add this code for the reset entrypoint:

   ```archetype
   // Reset entrypoint
   entry reset() {
     value := 0
   }
   ```

   This function is similar to the others, but it does not take a parameter.
   It always sets the `value` variable to 0.

The complete contract code looks like this:

```archetype
archetype Counter

variable value : int = 0

// Increment entrypoint
entry increment(delta : int) {
  value += delta
}

// Decrement entrypoint
entry decrement(delta : int) {
  value -= delta
}

// Reset entrypoint
entry reset() {
  value := 0
}
```

## Deploying (originating) to the testnet

Deploying a contract to the network is called "originating."
Originating the contract requires a small amount of Tezos tokens as a fee.

1. Run the following command to originate the smart contract:

   ```bash
   completium-cli deploy Counter.arl
   ```

   The command line shows information about the transaction, including the name of the originating account, the target network, and the cost to deploy it.
   By default, it uses the local alias "Counter" to refer to the contract.

1. Press Y to confirm and deploy the contract.

   If you see an error that includes the message `contract.counter_in_the_past`, you waited too long before pressing Y.
   Run the `deploy` command again and promptly press Y to confirm it.

1. Print information about the contract by running this command:

   ```bash
   completium-cli show contract Counter
   ```

   The response shows information about the contract, including its address on Ghostnet, which starts with "KT1".
   You can use this information to look up the contract on a block explorer.

1. Verify that the contract deployed successfully by finding it on a block explorer:

   1. Open a Tezos block explorer such as [TzKT](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

   1. Set the explorer to Ghostnet instead of mainnet.

   1. Paste the contract address, which starts with `KT1`, into the search field and press Enter.

   1. Go to the Storage tab to see that the initial value of the storage is 10.

1. Run this command to see the current value of the contract storage:

   ```bash
   completium-cli show storage Counter
   ```

## Calling the contract

Now you can call the contract from any Tezos client, including completium-cli.

To increment the current storage by a certain value, call the `increment` entrypoint, as in this example:

```bash
completium-cli call Counter --entry increment --arg '{ "int": 5 }'
```

To decrement the storage, call the `decrement` entrypoint, as in this example:

```bash
completium-cli call Counter --entry decrement --arg '{ "int": 2 }'
```

Finally, to reset the current storage to zero, call the `reset` entrypoint, as in this example:

```bash
completium-cli call Counter --entry reset
```

Then, you can verify the updated storage on the block explorer or by running the `completium-cli show storage Counter` command.

## Summary

Now the contract is running on the Tezos blockchain.
You or any other user can call it from any source that can send transactions to Tezos, including command-line clients, dApps, and other contracts.

If you want to continue working with this contract, try creating a dApp to call it from a web application, similar to the dApp that you create in the tutorial [Build your first app on Tezos](../build-your-first-app/).
You can also try adding your own endpoints and originating a new contract, but you cannot update the existing contract after it is deployed.
