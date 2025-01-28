---
title: Deploying smart contracts
authors: 'Yuxin Li'
last_update:
  date: 13 February 2024
dependencies:
  octez: 21.2
  smartpy: 0.20.0
  ligo: 1.9.2
---
## Introduction
In Tezos, deploying a smart contract is often referred to as “origination”. This process essentially creates a new account that holds the smart contract's script. Contracts originated in this manner have addresses that start with `KT1`, which distinguishes them from the user accounts with addresses beginning with `tz1`, `tz2`, or `tz3`.

## Prerequisites
- Compile your contract and its initial storage
- Set up an wallet account on Tezos with some tez to pay the fees

## Deploying a smart contract
Generally, there are two methods for deploying your smart contracts: either using the command line in your terminal or deploying through an online IDE.

### Deploying via terminal
The first one is to deploy through your terminal. Here is the syntax for the Tezos command line to deploy a smart contract:
```bash
octez-client originate contract CONTRACT_NAME transferring AMOUNT_TEZ from FROM_USER \
             running MICHELSON_FILE \
             --init 'INITIAL_STORAGE' --burn-cap GAZ_FEE
```
where:
- `CONTRACT_NAME` is the name given to the contract.
- `MICHELSON_FILE` is the path for the Michelson smart contract code (.tz file).
- `AMOUNT_TEZ` is the quantity of tez being transferred to the newly deployed contract. If a contract balance reaches 0 then it is deactivated.
- `FROM_USER` account from which the tez are taken (and transferred to the new contract).
- `INITIAL_STORAGE` is a Michelson expression. The --init parameter is used to specify the initial state of the storage.
- `GAZ_FEE` is a specified maximal fee the user is willing to pay for this operation (using the --burn-cap parameter).

### Deploying via online IDE
As for deploying through your online IDE, if you are using LIGO or SmartPy programming languages, you can deploy your smart contracts through their respective online IDEs.
- [SmartPy online IDE](https://smartpy.io/)
- [LIGO online IDE](https://ligolang.org/?lang=jsligo)

## Compiling the initial storage value

When you deploy a contract, you initialize its storage.
The initial value of the storage must be a Micheline value, which is the format for variables in Michelson smart contracts.
The high-level languages provide tools to compile the initial values of smart contracts into Micheline values.

### Compiling LIGO storage values

For LIGO smart contracts, you can use the `ligo compile storage` command.
For example, assume that a JsLIGO contract has a storage value that includes a list of integers, a string, and an integer:

```jsligo
type storage = [
  list<int>,
  string,
  int,
];
```

When this contract is compiled to Michelson, the storage line of the contract looks like this:

```michelson
storage (pair (list int) string int) ;
```

To compile an initial value to this format, you can pass a JsLIGO value to the `ligo compile storage` command, as in this example:

```bash
ligo compile storage MyContract.jsligo '[list([1,2,3,4]), "start", 0]'
```

The result is the Micheline value, as in this example:

```michelson
(Pair { 1 ; 2 ; 3 ; 4 } "start" 0)
```

Then you can use this Micheline value as the initial storage value for the contract:

```bash
octez-client originate contract MyContract \
  transferring 0 from my_account \
  running MyContract.tz --init '(Pair { 1 ; 2 ; 3 ; 4 } "start" 0)' \
  --burn-cap 1
```

### Compiling SmartPy storage values

SmartPy lets you set the initial value of the contract storage in the smart contract code in the `__init__` function.
For example, this contract defines three storage variables and sets their initial values:

```python
import smartpy as sp

@sp.module
def main():
    class MyList(sp.Contract):
        def __init__(self):
            self.data.ListOfIntegers = [1,2,3,4]
            self.data.MyString = "hello"
            self.data.MyInteger = 5
```

Now you can compile and deploy the contract via the online IDE with these starting values.

If you want to deploy the contract with the Octez client, add a test to the contract and run the test with the command `python MyContract.py`.
One of the files this command creates ends in `storage.tz` and contains the Micheline value of the initial storage, as in this example:

```
(Pair {1; 2; 3; 4} (Pair 5 "hello"))
```

Then you can use this Micheline value as the initial storage value for the contract:

```bash
octez-client originate contract MyContract \
  transferring 0 from my_account \
  running MyContract.tz --init '(Pair { 1 ; 2 ; 3 ; 4 } "start" 0)' \
  --burn-cap 1
```

## Interacting with the contract
When you have successfully originated the smart contract and it is included in a baked block, there are two ways to interact with it: through command lines or through a block explorer.

### Interacting through command lines
The first method involves interacting with the contract's entry points using command lines.

For example, suppose you have a smart contract with an entrypoint called `update_data`, which takes an integer as an argument to update some data in its storage. Here's how you might invoke this entrypoint:

```bash
octez-client call CONTRACT_NAME from YOUR_ACCOUNT_ADDRESS \
             --arg 'New_Integer_Value' \
             --entrypoint update_data \
             --burn-cap FEE_LIMIT
```
Where:

- `CONTRACT_NAME`: Identifier or the address of the contract that you want to interact with.
- `YOUR_ACCOUNT_ADDRESS` Your own account address that will initiate the transaction.
- `--arg`:  Argument that you're passing to the entrypoint, in this case, an integer value. You need to format this according to the expected input in the contract's Michelson code.
- `--entrypoint`: Method in the smart contract that you're calling.
- `--burn-cap`:  The maximum fee you are willing to spend for this transaction to be included in the blockchain.

Here's an example with hypothetical values filled in:

```bash
octez-client call KT1Vsw5kh4P1Vn... from tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb \
             --arg '42' \
             --entrypoint update_data \
             --burn-cap 0.05
```
Where:

- `KT1Vsw5kh4P1Vn...`: Contract address.
- `tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`: User's account address.
- `'42'`: New integer value you wish to pass to the update_data entrypoint.
- `0.05`: Maximum amount of tez you're willing to pay in fees.

:::note
Always ensure that you check the documentation specific to the smart contract you are interacting with, as the expected arguments (`--arg`) and the name of the entrypoint (`--entrypoint`) can vary widely depending on the contract's design and purpose.
:::

### Interacting via blockchain explorers

A blockchain explorer is an efficient and user-friendly tool that enables you to interact with deployed contracts. In the Tezos ecosystem, there are two main blockchain explorers:

- [Better Call Dev](https://better-call.dev/)
- [TzKT](https://tzkt.io/)

To interact with a contract, copy its address into one of these blockchain explorers. Below is the user interface for interacting with a contract through Better Call Dev:

![UI for Better Call Dev](/img/tutorials/better-call.png)


