---
id: first-smart-contract
title: Deploy your First Smart Contract
slug: /first-smart-contract
authors: John Joubert, Sasha Aldrick, Claude Barde
---

## Prerequisites

| Dependency         | Installation instructions                                                                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ligo            | Follow the _Installation_ steps in this [guide](https://ligolang.org/docs/tutorials/getting-started/?lang=cameligo#install-ligo)                                                                                                                                                |

{% callout type="warning" title="Note" %}
Make sure you have **installed** the above CLI tools before getting started.
{% /callout %}

Now that you have installed the [_octez-client_](https://opentezos.com/tezos-basics/cli-and-rpc/#how-to-install-the-octez-client) and [_Ligo_](https://ligolang.org/docs/tutorials/getting-started/?lang=cameligo#install-ligo), we'll go ahead and dive right in.

Ligo is a high-level programming language created by Marigold to write smart contracts for the Tezos blockchain.

It abstracts away the complexity of using Michelson (the smart contract language directly available on-chain) and provides different syntaxes that make it easier to write smart contracts on Tezos.

The 2 syntaxes that are available at the moment are *JsLigo*, a syntax similar to TypeScript, and *CameLigo*, a syntax similar to OCaml. The following article will introduce CameLigo.

## Create a project folder

Now we can go ahead and create a folder somewhere on our local drive with the name of the project. Let's call it `example-smart-contract`.

```bash
mkdir example-smart-contract
```

```bash
cd example-smart-contract
```

## Create a project file

Inside the `example-smart-contract` folder, let's create a file called `increment.mligo` and save it. We'll need this file later.

```bash
touch increment.mligo
```

## Confirm your setup
### Ligo

You can run
```bash
./ligo version
```
or
```bash
ligo version
```
according to your setup to check if Ligo is properly installed. You should see something like:
```
Protocol built-in: lima
0.60.0
```

### Octez-client

We can check that it's correctly installed by running the following command:

```
octez-client
```

And we should see something like this returned:

```
Usage:
  octez-client [global options] command [command options]
  octez-client --help (for global options)
  octez-client [global options] command --help (for command options)
  octez-client --version (for version information)

To browse the documentation:
  octez-client [global options] man (for a list of commands)
  octez-client [global options] man -v 3 (for the full manual)

Global options (must come before the command):
  -d --base-dir <path>: client data directory (absent: TEZOS_CLIENT_DIR env)
  -c --config-file <path>: configuration file
  -t --timings: show RPC request times
  --chain <hash|tag>: chain on which to apply contextual commands (commands dependent on the context associated with the specified chain). Possible tags are 'main' and 'test'.
  -b --block <hash|level|tag>: block on which to apply contextual commands (commands dependent on the context associated with the specified block). Possible tags include 'head' and 'genesis' +/- an optional offset (e.g. "octez-client -b head-1 get timestamp"). Note that block queried must exist in node's storage.
  -w --wait <none|<int>>: how many confirmation blocks are needed before an operation is considered included
  -p --protocol <hash>: use commands of a specific protocol
  -l --log-requests: log all requests to the node
  --better-errors: Error reporting is more detailed. Can be used if a call to an RPC fails or if you don't know the input accepted by the RPC. It may happen that the RPC calls take more time however.
  -A --addr <IP addr|host>: [DEPRECATED: use --endpoint instead] IP address of the node
  -P --port <number>: [DEPRECATED: use --endpoint instead] RPC port of the node
  -S --tls: [DEPRECATED: use --endpoint instead] use TLS to connect to node.
  -m --media-type <json, binary, any or default>: Sets the "media-type" value for the "accept" header for RPC requests to the node. The media accept header indicates to the node which format of data serialisation is supported. Use the value "json" for serialisation to the JSON format.
  -E --endpoint <uri>: HTTP(S) endpoint of the node RPC interface; e.g. 'http://localhost:8732'
  -s --sources <path>: path to JSON file containing sources for --mode light. Example file content: {"min_agreement": 1.0, "uris": ["http://localhost:8732", "https://localhost:8733"]}
  -R --remote-signer <uri>: URI of the remote signer
  -f --password-filename <filename>: path to the password filename
  -M --mode <client|light|mockup|proxy>: how to interact with the node

```

## Switch to a Testnet

Before going further let's make sure we're working on a [Testnet](https://teztnets.xyz).&#x20;

View the available Testnets:

```
https://teztnets.xyz
```

The [Ghostnet](https://teztnets.xyz/ghostnet-about) might be a good choice for this guide (at the time of writing).&#x20;

Copy the _Public RPC endpoint_ which looks something like this:

```
https://rpc.ghostnet.teztnets.xyz
```

Make sure we use this endpoint by running:

```bash
octez-client --endpoint https://rpc.ghostnet.teztnets.xyz config update
```

You should then see something like this returned:

```
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.
```

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

```
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.

Hash: tz1dW9Mk...........H67L
Public Key: edp.............................bjbeDj
```

We'll want to copy the Hash that starts with `tz` to your clipboard:

```
tz1dW9Mk...........H67L
```

## Fund your test wallet&#x20;

Tezos provides a [faucet](https://faucet.ghostnet.teztnets.xyz) to allow you to use the Testnet for free (has no value and can't be used on the Mainnet).

Let's go ahead and fund our wallet through the [Ghostnet Faucet](https://faucet.ghostnet.teztnets.xyz). Paste the hash you copied earlier into the input field for "Or fund any address" and select the amount you'd like to add to your wallet.

![Fund your wallet using the Ghostnet Faucet](/developers/docs/images/wallet-funding.png)

Wait a minute or two and you can then run the following command to check that your wallet has funds in it:

```
 octez-client get balance for local_wallet
```

Which will return something like this:

```
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

```
type storage = int
```

The parameter to update the contract storage is a *variant*, similar to a TypeScript enum:

```
type parameter =
| Increment of int
| Decrement of int
| Reset
```

You can use the different branches of the variant to simulate entrypoints for your contract. In this case, there is an **Increment** entrypoint, a **Decrement** entrypoint, and a **Reset** entrypoint.

Next, you declare a function called `main` that will receive the parameter value and the storage when the contract is called. This function returns a tuple with a list of operations on the left and the new storage on the right:

```
let main (action, store : parameter * storage) : operation list * storage =
```

You can return an empty list of operations from the beginning, then use pattern matching to match the targetted entrypoint:
```
([] : operation list),
 (match action with
 | Increment (n) -> add (store, n)
 | Decrement (n) -> sub (store, n)
 | Reset         -> 0)
```

The **Increment** branch redirects to an `add` function that takes a tuple as a parameter made of the current storage and the value used to increment the storage.

The **Decrement** branch redirects to a `sub` function that takes a tuple as a parameter made of the current storage and the value used to decrement the storage.

The **Reset** branch only returns `0`, the new storage.

The `add` function
```bash
let add (store, inc : storage * int) : storage = store + inc
```
takes a tuple with the current storage on the left and the value to increment it on the right. These 2 values are added and returned as the new storage.

The `sub`function
```bash
let sub (store, dec : storage * int) : storage = store - dec
```
takes a tuple with the current storage on the left and the value to subtract from it on the right. The passed value is subtracted from the current storage and the new storage is returned.

```
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

## Deploy to the Testnet

Run the following command to deploy the smart contract:
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

Now that we've successfully deployed our smart contract, let's test out the three entrypoints that we created: `increment`, `decrement`, and `reset`.

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