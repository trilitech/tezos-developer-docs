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
It provides a single endpoint that users can call to change the value of that integer

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

1. On <https://teztnets.xyz/>, click the testnet to use, such as Ghostnet.

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

Deploying and using a smart contract costs fees, so you need a local wallet and XTZ tokens.
The Octez client can manage a local wallet for you, and you can get XTZ tokens on testnets from faucets.

1. Run the following command to generate a local wallet, replacing `local_wallet` with a name for your wallet:

   ```bash
   octez-client gen keys local_wallet
   ```

1. Get the address for the wallet by running this command, again replacing `local_wallet` with the name of your local wallet.

   ```bash
   octez-client show address local_wallet
   ```

   The Octez client prints a warning that you are using a testnet and the address of the new wallet in the `hash` field.
   The wallet address begins with `tz1`, `tz2`, or `tz3`, as in this example:

   ```bash
   Warning:

                    This is NOT the Tezos Mainnet.

              Do NOT use your fundraiser keys on this network.

   Hash: tz1dW9Mk...........H67L
   Public Key: edp.............................bjbeDj
   ```

   You need the wallet address to send funds to the wallet, to deploy the contract, and to send transactions to the contract.

1. On the testnets page at <https://teztnets.xyz/>, click the faucet link for the testnet you are using.
For example, the Ghostnet faucet is at <https://faucet.ghostnet.teztnets.xyz>.

1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of XTZ to add to your wallet.
It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

   You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on mainnet.

   ![Fund your wallet using the Ghostnet Faucet](/images/wallet-funding.png)

1. Run this command to check the balance of your wallet:

   ```bash
   octez-client get balance for local_wallet
   ```

If your wallet is set up correctly and the faucet has sent tokens to it, the Octez client prints the balance of your wallet, as in this example:

```
100 ꜩ
```

## Create the contract

The contract that you will create has these basic parts:

- A type that describes the contract's storage, in this case an integer.
The storage can be a primitive type such as an integer, string, or timestamp, or a complex data type that contains multiple values.
For more information on contract data types, see [Smart contract concepts](../../../smart-contracts/smart-contracts-concepts/).

- A single entrypoint named `main` that clients can call.
Contracts can have any number of endpoints, but for simplicity, this contract uses only one endpoint.

- A definition for the parameter that determines whether the contract increments, decrements, or resets the storage.

- Internal functions that describe what to do when clients call the contract.

Follow these steps to create the code for the contract:

1. Open the `increment.mligo` file in any text editor.

1. Add this line of code to set the storage type to an integer:

   ```ocaml
   type storage = int
   ```

1. Add this code to create the parameter that tells the contract what to do:

   ```ocaml
   type parameter =
   | Increment of int
   | Decrement of int
   | Reset
   ```

   This parameter is an OCaml type called a *variant*, similar to an enumeration in many other languages, but with some other features.

   The contract uses different branches of this variant to simulate entrypoints for the contract contract.
   In this case, you can imagine that there is an **Increment** entrypoint, a **Decrement** entrypoint, and a **Reset** entrypoint, even though technically the contract will have only one endpoint, named `main`.

1. Add this code to create the `main` endpoint:

   ```ocaml
   let main (action, store : parameter * storage) : operation list * storage =
    ([] : operation list),    // No operations
    (match action with
    | Increment (n) -> add (store, n)
    | Decrement (n) -> sub (store, n)
    | Reset         -> 0)
   ```

   This endpoint accepts the increment, decrement, or reset parameter and refers to it as the `action` variable.
   It also accepts the current value of the storage as the `store` variable.
   Then it uses the OCaml `match` command to map the `action` variable to the new value of the storage:

    - If the parameter is "Reset," the new value of the storage is 0.
    - If the parameter is "Increment" or "Decrement," the function passes the integer that the client sent to the `add` or `sub` functions, which you create in the next step.

1. Add these functions to increment or decrement the storage:

   ```ocaml
   // Increment entrypoint
   let add (store, inc : storage * int) : storage = store + inc
   // Decrement entrypoint
   let sub (store, dec : storage * int) : storage = store - dec
   ```

   These functions receive a tuple as a parameter, which includes the current value of the storage in the `store` variable and the value that the client passed in the `inc` or `dec` variables.
   Then they set the new value of the storage based on those parameters.

The complete contract code looks like this:

```ocaml
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

## Test and compile the contract

Before you can deploy the contract to Tezos, you must compile it to Michelson, the base language of Tezos contracts.

1. Test the contract by passing parameters and the storage value to the LIGO `dry-run` command.
For example, this command sets the storage at 10 and increments it by 32:

   ```bash
   ligo run dry-run increment.mligo "Increment(32)" "10"
   ```

   The terminal should show the response `(LIST_EMPTY(), 42)`.
   This response means that the contract did not call any other contracts, so the list of operations is empty.
   Then it shows the new value of the storage.
   You can test the decrement and reset functions in the same way.

1. Run this command to compile the contract:

   ```bash
   ligo compile contract increment.mligo -o increment.tz
   ```

   If the compilation succeeds, no messages are shown in the terminal.
   If you see error messages, verify that your contract code matches the code in the previous section.

Now you can deploy the contract.

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
