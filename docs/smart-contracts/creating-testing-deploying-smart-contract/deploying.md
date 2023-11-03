---
title: Deploying smart contracts
author: 'Yuxin Li'
lastUpdated: 2nd November 2023
---
## Introduction
The last part will introduce how to deploy smart contracts. In Tezos, deploying a smart contract is often referred to as “origination”. This process essentially creates a new account that holds the smart contract's script. Contracts initiated in this manner have addresses that start with `KT1` (known as originated accounts), which distinguishes them from the implicit accounts with addresses beginning with `tz1`, `tz2`, or `tz3`.

## Deploying a Smart Contract
Here is the syntax for the Tezos command line to deploy a smart contract:
```bash
octez-client originate contract CONTRACT_NAME transferring AMOUNT_TEZ from FROM_USER \
             running MICHELSON_FILE \
             --init 'INITIAL_STORAGE' --burn-cap GAZ_FEE
```             
where:
- **CONTRACT_NAME** is the name given to the contract.
- **MICHELSON_FILE** is the path for the Michelson smart contract code (.tz file).
- **AMOUNT_TEZ** is the quantity of Tez being transferred to the newly deployed contract. If a contract balance reaches 0 then it is deactivated.
- **FROM_USER** account from which the Tez are taken (and transferred to the new contract).
- **INITIAL_STORAGE** is a Michelson expression. The --init parameter is used to specify the initial state of the storage.
- **GAZ_FEE** is a specified maximal fee the user is willing to pay for this operation (using the --burn-cap parameter).

:::note
Note that you must replace `<CONTRACT_NAME>` with the address of the deployed contract before running the command.
Obtaining the Tezos Client:
:::

### Obtaining the Tezos Client:
- **GNU/Linux**: the simplest way to get octez-client is through opam using opam install tezos. alternatives are available here
- **MacOsX**: the software is distributed through a brew formula with brew install tezos.

## Interacting with the Devloped Contract

### Invocation
After the smart contract has successfully been originated and included in a baked block, interaction with the contract's entrypoints is possible via command lines.

For example, suppose you have a smart contract with an entrypoint called `update_data`, which takes an integer as an argument to update some data in its storage. Here's how you might invoke this entrypoint:

```bash
octez-client call CONTRACT_NAME from YOUR_ACCOUNT_ADDRESS \
             --arg 'New_Integer_Value' \
             --entrypoint update_data \
             --burn-cap FEE_LIMIT
```
Where:

- **`CONTRACT_NAME`**: Identifier or the address of the contract that you want to interact with.
- **`YOUR_ACCOUNT_ADDRESS`** Your own account address that will initiate the transaction.
- **`--arg`**:  Argument that you're passing to the entrypoint, in this case, an integer value. You need to format this according to the expected input in the contract's Michelson code.
- **`--entrypoint`**: Method in the smart contract that you're calling.
- **`--burn-cap`**:  The maximum fee you are willing to spend for this transaction to be included in the blockchain.

Here's an example with hypothetical values filled in:

```bash
octez-client call KT1Vsw5kh4P1Vn... from tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb \
             --arg '42' \
             --entrypoint update_data \
             --burn-cap 0.05
```
Where:

- **`KT1Vsw5kh4P1Vn...`**: Contract address.
- **`tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`**: User's account address.
- **`'42'`**: New integer value you wish to pass to the update_data entrypoint.
- **`0.05`**: Maximum amount of Tez you're willing to pay in fees.

:::note
Always ensure that you check the documentation specific to the smart contract you are interacting with, as the expected arguments (`--arg`) and the name of the entrypoint (`--entrypoint`) can vary widely depending on the contract's design and purpose.
:::




