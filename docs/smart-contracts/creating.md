---
title: Creating smart contracts
author: 'Yuxin Li'
lastUpdated: 6th November 2023
---

## Introduction
This documentation outlines the fundamental steps you need to create a smart contract on the Tezos blockchain. Subsequent chapters will guide you through testing and deploying your smart contract.

## Creating smart contract

### Choosing a smart contract language
Tezos supports a variety of smart contract languages:

- [Michelson](languages/michelson.mdx):  Tezos' native language, which is stack-based and can be challenging for beginners.
- [SmartPy](languages/smartpy.mdx): A Python-inspired language that compiles into Michelson, suitable for those familiar with Python.
- [LIGO](languages/ligo.md): Offers a statically-typed paradigm, compiling into Michelson, with syntax variations akin to JavaScript.
- [Archetype]((languages/archetype.md)): A domain-specific language with formal specification features for safer smart contracts.

For beginners, we recommand SmartPy or LIGO for their higher-level more abstracted approach.

### Install the language/IDE that you use
To compile and test your contract, the corresponding command-line interface (CLI) must be installed. Once you install the CLI, start writing your contract by creating a new file in your preferred editor.

### Writing the contract
Before you dive into the syntax and intricacies of your chosen language, you should outline what your smart contract is intended to do. Define the problem it solves, the functions it will carry out, and any external interactions or transactions it must handle.

#### Initialize a new file
Initiate a new file with the suitable extension. For instance, a .py extension is required for SmartPy.

#### Define contract storage.
Contract storage holds the persistent state of your smart contract. It’s important to carefully design your storage to efficiently manage the data your contract will maintain.
- For SmartPy: Use Pythonic classes and types to represent storage. SmartPy provides a straightforward way to map these into Michelson storage requirements.
- For LIGO: Choose the most suitable syntax flavor and use the type definitions to lay out the storage structure.

#### Define entrypoints
Entrypoints serve as methods to receive external communication in Tezos contracts. They typically accept two arguments:
- Parameters for the method.
- Contract storage.

Entrypoints also have a predefined signature for the:
- Response
- List of operations
- Updated storage

 
