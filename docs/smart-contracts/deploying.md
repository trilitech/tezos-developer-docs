---
title: Deploying smart contracts
authors: 'Yuxin Li'
last_update:
  date: 6 November 2023
---
## Introduction
In Tezos, deploying a smart contract is often referred to as “origination”. This process essentially creates a new account that holds the smart contract's script. Contracts originated in this manner have addresses that start with `KT1` (known as originated accounts), which distinguishes them from the implicit accounts with addresses beginning with `tz1`, `tz2`, or `tz3`.

## Prerequisites
- Compile your contract and its initial storage
- Set up an wallet account on Tezos with some tez to pay the fees
- Ensure that you have obtained the [Tezos client](../developing/octez-client/installing)

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
- `AMOUNT_TEZ` is the quantity of Tez being transferred to the newly deployed contract. If a contract balance reaches 0 then it is deactivated.
- `FROM_USER` account from which the Tez are taken (and transferred to the new contract).
- `INITIAL_STORAGE` is a Michelson expression. The --init parameter is used to specify the initial state of the storage.
- `GAZ_FEE` is a specified maximal fee the user is willing to pay for this operation (using the --burn-cap parameter).

### Deploying via online IDE
As for deploying through your online IDE, if you are using Ligo or SmartPy programming languages, you can simply deploy your smart contracts through their respective online IDEs.
- [SmartPy online IDE](https://smartpy.io/)
- [Ligo online IDE](https://ligolang.org/?lang=jsligo)

## Interacting with the contract
Once you have successfully originated the smart contract and it is included in a baked block, there are two ways to interact with it: through command lines or through a block explorer.

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
- `0.05`: Maximum amount of Tez you're willing to pay in fees.

:::note
Always ensure that you check the documentation specific to the smart contract you are interacting with, as the expected arguments (`--arg`) and the name of the entrypoint (`--entrypoint`) can vary widely depending on the contract's design and purpose.
:::

### Interacting via blockchain explorers

A blockchain explorer is an efficient and user-friendly tool that enables you to interact with deployed contracts. In the Tezos ecosystem, there are two main blockchain explorers:

- [Better Call Dev](https://better-call.dev/)
- [TzKT](https://tzkt.io/)

To interact with a contract, simply copy its address into one of these blockchain explorers. Below is the user interface for interacting with a contract through Better Call Dev:

![UI for Better Call Dev](/img/tutorials/better-call.png)


