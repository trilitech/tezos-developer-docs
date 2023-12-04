---
title: Deploy a smart contract with jsLIGO
authors: 'John Joubert, Sasha Aldrick, Claude Barde, Tim McMackin'
last_update:
  date: 4 December 2023
---

This tutorial covers writing and deploying a simple smart contract with the LIGO programming language
Specifically, this tutorial uses the jsLIGO version of LIGO, which has syntax similar to JavaScript, but you don't need any experience with JavaScript or LIGO to do this tutorial.

- If you are more familiar with Python, try [Deploy a smart contract with SmartPy](./smartpy).
- If you are more familiar with OCaml, try [Deploy a smart contract with CameLIGO](./cameligo).
- To learn the Archetype language, try [Deploy a smart contract with Archetype](./archetype).

In this tutorial, you will learn how to:

- Create a wallet
- Get tokens from a faucet
- Code a contract in LIGO, including:
  - Defining the storage for the contract
  - Defining entrypoints in the contract
  - Writing code to run when the entrypoints are called
- Deploy (or originate) the contract to Tezos and set its starting storage value
- Look up the current state of the contract
- Call the contract

## What is a smart contract?

A smart contract is a computer program that is stored on a blockchain and runs on a blockchain.
Because the blockchain is spread across many computer nodes, you don't have to think about where to host the program or worry whether a computer will run it or not.
Responsibility for running the contract is distributed across all of the nodes in the Tezos system, so when you deploy a smart contract, you can be confident that it will be available and unmodified when someone wants to run it.

A smart contract has these parts:

- It has persistent storage, data that the contract can read and write
- It has one or more entrypoints, which are a kind of function that clients can call, like endpoints in an API or functions or methods in many programming languages
- It has a Tezos account and can store tez (technically, the contract is itself a type of Tezos account, but you can think of it as a program with a Tezos account)

## Tutorial contract

The contract that you deploy in this tutorial stores a single integer.
It provides entrypoints that clients can call to change the value of that integer:

- The `increment` endpoint accepts an integer as a parameter and adds that integer to the value in storage
- The `decrement` endpoint accepts an integer as a parameter and subtracts that integer to the value in storage
- The `reset` endpoint takes no parameters and resets the value in storage to 0

After you deploy the contract, you or any other user can call it through Octez or a distributed application (dApp).

## Creating and funding a wallet

To deploy and work with the contract, you need a wallet and some tez tokens.

1. Install a Tezos-compatible wallet.
Which wallet you install is up to you and whether you want to install a wallet on your computer, in a browser extension, or as a mobile app.

   If you don't know which one to choose, try the [Temple](https://templewallet.com/) browser extension, because then you can use it in the same browser that you are using to view the web app.

   Desktop wallets for Tezos include the [Temple](https://templewallet.com/) browser extension, [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).

   Mobile apps include [Temple](https://templewallet.com/), [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).

1. Switch the wallet to use the Ghostnet testnet instead of Tezos Mainnet.
Ghostnet is a network for testing Tezos applications where tokens are free so you don't have to spend real currency to work with your applications.

   For example, for the Temple browser wallet, click **Tezos Mainnet** at the top and then click **Ghostnet Testnet**, as in this picture:

   ![Selecting the Ghostnet testnet in the Temple wallet](/img/tutorials/temple-switch-network.png)

1. From your wallet, get the address of your account, which starts with `tz1`.
This is the address that applications use to work with your wallet.

1. Go to the Ghostnet faucet page at https://faucet.ghostnet.teztnets.xyz.

1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of tez to add to your wallet.
20 tez is enough to work with the tutorial contract, and you can return to the faucet later if you need more tez.

   It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

   You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on Mainnet.

   ![Fund your wallet using the Ghostnet Faucet](/img/tutorials/wallet-funding.png)

Now you have an account and funds that you can use to work with Tezos.

## Creating the contract

The contract that you will create has these basic parts:

- A type that describes the contract's storage, in this case an integer.
The storage can be a primitive type such as an integer, string, or timestamp, or a complex data type that contains multiple values.
For more information on contract data types, see [Data types](../../smart-contracts/data-types).

- Functions called entrypoints that run code when clients call the contract.

- A type that describes the return value of the entrypoints.

Follow these steps to create the code for the contract:

1. Open the `increment.jsligo` file in any text editor.

1. Create a namespace named `Counter` to hold the code for the contract:

   ```ts
   namespace Counter {

   }
   ```

1. Inside the namespace, create a TypeScript type to set the storage type to an integer:

   ```ts
   type storage = int;
   ```

1. Add this code to define the return type for the endpoints.
Tezos entrypoints return two values: a list of other operations to call and the new value of the contract's storage.

   ```ts
   type returnValue = [list<operation>, storage];
   ```

1. Add the code for the increment and decrement entrypoints:

   ```ts
   // Increment entrypoint
   @entry
   const increment = (delta : int, store : storage) : returnValue =>
     [list([]), store + delta];

   // Decrement entrypoint
   @entry
   const decrement = (delta : int, store : storage) : returnValue =>
     [list([]), store - delta];
   ```

   These functions begin with the `@entry` annotation to indicate that they are entrypoints.
   They accept two parameters: the change in the storage value (an integer) and the current value of the storage (in the `storage` type that you created earlier in the code).
   They return a value of the type `returnValue` that you created in the previous step.

   Each function returns an empty list of other operations to call and the new value of the storage.

1. Add this code for the reset entrypoint:

   ```ts
   // Reset entrypoint
   @entry
   const reset = (_p : unit, _s : storage) : returnValue =>
     [list([]), 0];
   ```

   This function is similar to the others, but it does not take the current value of the storage into account.
   It always returns an empty list of operations and 0.

The complete contract code looks like this:

```ts
namespace Counter {
  type storage = int;
  type returnValue = [list<operation>, storage];

  // Increment entrypoint
  @entry
  const increment = (delta : int, store : storage) : returnValue =>
    [list([]), store + delta];

  // Decrement entrypoint
  @entry
  const decrement = (delta : int, store : storage) : returnValue =>
    [list([]), store - delta];

  // Reset entrypoint
  @entry
  const reset = (_p : unit, _s : storage) : returnValue =>
    [list([]), 0];
}
```

## Testing and compiling the contract

Before you can deploy the contract to Tezos, you must compile it to Michelson, the base language of Tezos contracts.

1. Test the contract by passing parameters and the storage value to the LIGO `dry-run` command.
For example, this command sets the storage at 10 and increments it by 32:

   ```bash
   ligo run dry-run increment.jsligo -m Counter "Increment(32)" "10"
   ```

   The terminal should show the response `(LIST_EMPTY(), 42)`.
   This response means that the contract did not call any other contracts, so the list of operations is empty.
   Then it shows the new value of the storage.
   You can test the decrement and reset functions in the same way.

1. Run this command to compile the contract:

   ```bash
   ligo compile contract increment.jsligo -m Counter -o increment.tz
   ```

   If the compilation succeeds, no messages are shown in the terminal.
   If you see error messages, verify that your contract code matches the code in the previous section.

Now you can deploy the contract.

## Deploying (originating) to the testnet

Deploying a contract to the network is called "originating."
Originating the contract requires a small amount of Tezos tokens as a fee.

1. Run the following command to originate the smart contract, changing `$MY_TZ_ADDRESS` to the address or local name of the wallet that you created earlier in the tutorial:

   ```bash
   octez-client originate contract my-counter \
       transferring 0 from $MY_TZ_ADDRESS \
       running increment.tz \
       --init 10 --burn-cap 0.1 --force
   ```

   This command includes these parts:

     - It uses the Octez client `originate contract` command to originate the contract and assigns the local name `my-counter` to the contract
     - It includes 0 tokens from your wallet with the transaction, but the `--burn-cap` argument allows the transaction to take up to 0.1 tez from your wallet for fees.
     - It sets the initial value of the contract storage to 10 with the `--init` argument.

   If the contract deploys successfully, Octez shows the address of the new contract, as in this example:

   ```bash
   New contract KT1Nnk.................UFsJrq originated.
   The operation has only been included 0 blocks ago.
   We recommend to wait more.
   ```

1. Copy the contract address, which starts with `KT1`.

1. Optional: Run the command `octez-client get balance for local_wallet` to get the updated balance of your wallet.

1. Verify that the contract deployed successfully by finding it on a block explorer:

  1. Open a Tezos block explorer such as [TzKT](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

  1. Set the explorer to Ghostnet instead of Mainnet.

  1. Paste the contract address, which starts with `KT1`, into the search field and press Enter.

  1. Go to the Storage tab to see that the initial value of the storage is 10.

## Calling the contract

Now you can call the contract from any Tezos client, including Octez.

To increment the current storage by a certain value, call the `increment` entrypoint, as in this example, again changing `$MY_TZ_ADDRESS` to the address or local name of the wallet that you created earlier in the tutorial:

```bash
octez-client --wait none transfer 0 from $MY_TZ_ADDRESS to my-counter --entrypoint 'increment' --arg '5' --burn-cap 0.1
```

The previous example uses the local name `my-counter`.
You can also specify the contract address.

To decrement the current storage by a certain value, call the `decrement` entrypoint, as in this example:

```bash
octez-client --wait none transfer 0 from $MY_TZ_ADDRESS to my-counter --entrypoint 'decrement' --arg '6' --burn-cap 0.1
```

Finally, to reset the current storage to zero, call the `reset` entrypoint, as in this example:

```bash
octez-client --wait none transfer 0 from $MY_TZ_ADDRESS to my-counter --entrypoint 'reset' --arg 'Unit' --burn-cap 0.1
```

You can go back to the block explorer to verify that the storage of the contract changed.

## Summary

Now the contract is running on the Tezos blockchain.
You or any other user can call it from any source that can send transactions to Tezos, including Octez, dApps, and other contracts.

If you want to continue working with this contract, try creating a dApp to call it from a web application, similar to the dApp that you create in the tutorial [Build your first app on Tezos](../build-your-first-app/).
You can also try adding your own endpoints and originating a new contract, but you cannot update the existing contract after it is deployed.
