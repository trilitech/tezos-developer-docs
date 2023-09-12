---
id: first-smart-contract-ligo
title: Deploy a smart contract with LIGO
authors: 'John Joubert, Sasha Aldrick, Claude Barde, Tim McMackin'
lastUpdated: 12th August 2023
---

This tutorial covers using the Octez command-line client to deploy a smart contract to Tezos.
The tutorial uses the LIGO programming language, which is one of the languages that you can write Tezos smart contracts in, but you don't need any experience with LIGO.

{% callout type="note" title="Want to use SmartPy?" %}
Click [here](/tutorials/originate-your-first-smart-contract/smartpy) to find out how to deploy a smart contract using SmartPy.
{% /callout %}

In this tutorial, you will learn how to:

- Connect the Octez client to a testnet
- Create a wallet
- Get tokens from a faucet
- Code a contract in LIGO, including:
  - Defining the storage for the contract
  - Defining endpoints in the contract
  - Writing code to run when the endpoints are called
- Deploy (or originate) the contract to Tezos and set its starting storage value
- Look up the current state of the contract
- Call the contract from the command line

## Tutorial contract

The contract that you deploy in this tutorial stores a single integer.
It provides these endpoints that users can call to change the value of that integer:

- The `increment` endpoint accepts an integer as a parameter and adds that integer to the value in storage
- The `decrement` endpoint accepts an integer as a parameter and subtracts that integer to the value in storage
- The `reset` endpoint takes no parameters and resets the value in storage to 0

After you deploy the contract, you or any other user can call it through Octez or a distributed application (dApp).

## Prerequisites

To run this tutorial, you need the Octez client and LIGO.

- To install LIGO, see <https://ligolang.org/docs/intro/installation>.
You can verify that LIGO is installed by running this command:

   ```bash
   ligo version
   ```

   If you see a message with the version of LIGO you have installed, LIGO is installed correctly.

- To install the Octez client, follow the instructions to install the `tezos-client` package on your system on this site: <http://tezos.gitlab.io/index.html>.
You need only the `tezos-client` packages, not the other Octez packages such as `tezos-node`.

   You can verify that the Octez client is installed by running this command:

   ```bash
   octez-client --version
   ```

   If you see a message with the version of Octez that you have installed, the Octez client is installed correctly.
   For help on Octez, run `octez-client --help` or see <http://tezos.gitlab.io/index.html>.

LIGO is a high-level programming language created by Marigold to write smart contracts for the Tezos blockchain.

It abstracts away the complexity of using Michelson (the smart contract language directly available on-chain) and provides different syntaxes that make it easier to write smart contracts on Tezos.

LIGO provides two syntaxes: *JsLigo*, a syntax similar to TypeScript, and *CameLigo*, a syntax similar to OCaml.
This tutorial uses CameLigo, but you do not need any experience with OCaml to run it.

## Create a project folder

Follow these steps to create a LIGO project:

1. On the command-line terminal, create a folder for the project and open it.
You can name your project anything you want, such as `example-smart-contract`.

   ```bash
   mkdir example-smart-contract
   cd example-smart-contract
   ```

1. Create a file named `increment.mligo` in the project folder.
This is where the contract code goes.

   ```bash
   touch increment.mligo
   ```

## Switch to a testnet

Before you deploy your contract to the main Tezos network (referred to as *mainnet*), you can deploy it to a testnet.
Testnets are useful for testing Tezos operations because testnets provide tokens for free so you can work with them without spending real tokens.

Tezos testnets are listed on this site: <https://teztnets.xyz/>.

The [Ghostnet](https://teztnets.xyz/ghostnet-about) testnet is a good choice for testing because it is intended to be long-lived, as opposed to shorter-term testnets that allow people to test new Tezos features.

Follow these steps to set your Octez client to use a testnet instead of the main network:

1. On <https://teztnets.xyz/>, click the testnet to use, such as ghostnet.

1. Copy the one of the testnet's public RPC endpoints, such as `https://rpc.ghostnet.teztnets.xyz`.

1. Set your Octez client to use this testnet by running this command on the command line, replacing the testnet RPC URL with the URL that you copied:

   ```bash
   octez-client --endpoint https://rpc.ghostnet.teztnets.xyz config update
   ```

   Octez shows a warning that you are using a testnet instead of mainnet.

1. Verify that you are using a testnet by running this command:

   ```bash
   octez-client config show
   ```

   The response from Octez includes the URL of the testnet.

You should then see something like this returned:

## Create a local wallet

We're now going to create a local wallet to use throughout this guide.

Run the following command to generate a local wallet with _octez-client_, making sure to replace `<my_wallet>` with a name of your choosing:

```bash
octez-client gen keys local_wallet
```

Let's get the address for this wallet because we'll need it later:

```bash
octez-client show address local_wallet
```

Which will return something like this:

``` sh
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.

Hash: tz1dW9Mk...........H67L
Public Key: edp.............................bjbeDj
```

We'll want to copy the Hash that starts with `tz` to your clipboard:

``` sh
tz1dW9Mk...........H67L
```

## Fund your test wallet&#x20;

Tezos provides a [faucet](https://faucet.ghostnet.teztnets.xyz) to allow you to use the Testnet for free (has no value and can't be used on the Mainnet).

Let's go ahead and fund our wallet through the [Ghostnet Faucet](https://faucet.ghostnet.teztnets.xyz). Paste the hash you copied earlier into the input field for "Or fund any address" and select the amount you'd like to add to your wallet.

![Fund your wallet using the Ghostnet Faucet](/images/wallet-funding.png)

Wait a minute or two and you can then run the following command to check that your wallet has funds in it:

``` sh
 octez-client get balance for local_wallet
```

Which will return something like this:

``` sh
100 ꜩ
```

## Use Ligo to create the contract

For this introduction to Ligo, you will write a very simple contract that increments, decrements, or resets a number in its storage.

A contract is made of 3 main parts:
- a parameter type to update the storage
- a storage type to describe how values are stored
- a piece of code that controls the update of the storage

The purpose of a smart contract is to write code that will use the values passed as a parameter to manipulate and update the storage in the intended way.

The contract will store an integer:

``` sh
type storage = int
```

The parameter to update the contract storage is a *variant*, similar to a TypeScript enum:

``` sh
type parameter =
| Increment of int
| Decrement of int
| Reset
```

You can use the different branches of the variant to simulate entrypoints for your contract. In this case, there is an **Increment** entrypoint, a **Decrement** entrypoint, and a **Reset** entrypoint.

Next, you declare a function called `main` that will receive the parameter value and the storage when the contract is called. This function returns a tuple with a list of operations on the left and the new storage on the right:

``` sh
let main (action, store : parameter * storage) : operation list * storage =
```

You can return an empty list of operations from the beginning, then use pattern matching to match the targetted entrypoint:
``` sh
([] : operation list),
 (match action with
 | Increment (n) -> add (store, n)
 | Decrement (n) -> sub (store, n)
 | Reset         -> 0)
```

The **Increment** branch redirects to an `add` function that takes a tuple as a parameter made of the current storage and the value used to increment the storage.

The **Decrement** branch redirects to a `sub` function that takes a tuple as a parameter made of the current storage and the value used to decrement the storage.

The **Reset** branch only returns `0`, the new storage.

The `add` function:

```bash
let add (store, inc : storage * int) : storage = store + inc
```
takes a tuple with the current storage on the left and the value to increment it on the right. These 2 values are added and returned as the new storage.

The `sub` function:

```bash
let sub (store, dec : storage * int) : storage = store - dec
```
takes a tuple with the current storage on the left and the value to subtract from it on the right. The passed value is subtracted from the current storage and the new storage is returned.

``` sh
type storage = int

type parameter =
| Increment of int
| Decrement of int
| Reset

// Increment entrypoint
let add (store, inc : storage * int) : storage = store + inc
// Decrement entrypoint
let sub (store, dec : storage * int) : storage = store - dec

let main (action, store : parameter * storage) : operation list * storage =
 ([] : operation list),    // No operations
 (match action with
 | Increment (n) -> add (store, n)
 | Decrement (n) -> sub (store, n)
 | Reset         -> 0)

```

## Compile the smart contract to Michelson

You can now compile the contract to Michelson directly from the terminal with the following command:

```bash
ligo compile contract increment.mligo -o increment.tz
```

You can also test that the contract works by calling one of its entrypoints with this command:

```bash
ligo run dry-run increment.mligo "Increment(32)" "10"
```

This should return `(LIST_EMPTY(), 42)` if everything is correct.

## Originate to the Testnet

Run the following command to originate the smart contract:
```bash
octez-client originate contract increment \
    transferring 0 from <my_tz_address...> \
    running increment.tz \
    --init 10 --burn-cap 0.1 --force
```

This will originate the contract with an initial storage of `10`.

You should get a confirmation that your smart contract has been originated:

```bash
New contract KT1Nnk.................UFsJrq originated.
The operation has only been included 0 blocks ago.
We recommend to wait more.
```

Make sure you copy the contract address for the next step!

## Confirm that all worked as expected

To interact with the contract and confirm that all went as expected, you can use an Explorer such as: [TzKT](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

Make sure you have switched to [Ghostnet](https://ghostnet.tzkt.io) before you start looking.

Then paste the contract address (starting with KT1) `KT1Nnk.................UFsJrq` into the search field and hit `enter` to find it.

Then navigate to the `Storage` tab to see your initial value of `10`.

## Calling the entrypoints

Now that we've successfully originated our smart contract, let's test out the three entrypoints that we created: `increment`, `decrement`, and `reset`.

#### Increment

To increment the current storage by a certain value, you can call the `increment` entrypoint:

```bash
octez-client --wait none transfer 0 from local_wallet to increment --entrypoint 'increment' --arg '5' --burn-cap 0.1
```

#### Decrement

To decrement the current storage by a certain value, you can call the `decrement` entrypoint:

```bash
octez-client --wait none transfer 0 from local_wallet to increment --entrypoint 'decrement' --arg '6' --burn-cap 0.1
```

#### Reset

Finally, to reset the current storage to zero, you can call the `reset` entrypoint:

```bash
octez-client --wait none transfer 0 from local_wallet to increment --entrypoint 'reset' --arg 'Unit' --burn-cap 0.1
```

## Summary

Now the contract is running on the Tezos blockchain.
You or any other user can call it from any source that can send transactions to Tezos, including Octez, dApps, and other contracts.

If you want to continue working with this contract, try creating a dApp to call it from a web application, similar to the dApp that you create in the tutorial [Build your first app on Tezos](../../build-your-first-app/).
