---
title: Creating Smart Contracts
author: 'Yuxin Li'
lastUpdated: 2nd November 2023
---

## Introduction
This documentation outlines the fundamental steps involved in creating a smart contract on the Tezos blockchain. Subsequent chapters will guide you through testing and deploying your smart contract.

## Creating smart contract

### Choosing a Smart Contract Language
Tezos supports a variety of smart contract languages:

- [Michelson](../languages/michelson.mdx):  Tezos' native language, which is stack-based and can be challenging for beginners.
- [SmartPy](../languages/smartpy.mdx): A Python-inspired language that compiles into Michelson, suitable for those familiar with Python.
- [LIGO](../languages/ligo.md): Offers a statically-typed paradigm, compiling into Michelson, with syntax variations akin to JavaScript.
- [Archetype]((../languages/archetype.md)): A domain-specific language with formal specification features for safer smart contracts.

For beginners, SmartPy or LIGO are often recommended due to their higher-level more abstracted approach.

### Install the language/IDE that you use
To compile and test your contract, the corresponding command-line interface (CLI) must be installed. Once installed, begin writing your contract by initializing a new file in your preferred editor.

### Writing the Contract
Before you dive into the syntax and intricacies of your chosen language, you should outline what your smart contract is intended to do. Define the problem it solves, the functions it will carry out, and any external interactions or transactions it must handle.

#### Initialize a new file
Initiate a new file with the suitable extension. For instance, a .py extension is required for SmartPy.

#### Define contract storage.
Contract storage is where the persistent state of your smart contract is kept. It’s important to carefully design your storage to efficiently manage the data your contract will maintain.
- For SmartPy: Use Pythonic classes and types to represent storage. SmartPy provides a straightforward way to map these into Michelson storage requirements.
- For LIGO: Choose the most suitable syntax flavor and use the type definitions to lay out the storage structure.

#### Define entrypoints
Entrypoints act as the method for receiving external communication in Tezos contracts. They typically accept two arguments:
- Parameters for the method.
- Contract storage.

Entrypoints also have a predefined signature for the:
- Response
- List of operations
- Updated storage

In the following section, we will explore how to test the smart contract.
 
