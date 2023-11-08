---
title: Creating smart contracts
author: 'Yuxin Li'
lastUpdated: 6th November 2023
---
## Introduction
Creating smart contracts on blockchain making sure faster execution and reduced costs by eliminating the need for intermediaries. This guide provides step-by-step instructions for creating smart contracts on the Tezos blockchain. You can find additional resources on testing and deploying your smart contract in subsequent chapters.

## Choosing your smart contract language
Tezos supports a variety of smart contract languages:

- [Michelson](languages/michelson.mdx):  Tezos' native language, which is stack-based and can be challenging for beginners.
- [SmartPy](languages/smartpy.mdx): A Python-inspired language that compiles into Michelson, suitable for those familiar with Python.
- [LIGO](languages/ligo.md): Offers a statically-typed paradigm, compiling into Michelson, with syntax variations akin to JavaScript.
- [Archetype]((languages/archetype.md)): A domain-specific language with formal specification features for safer smart contracts.

For beginners, we recommand SmartPy or LIGO for their higher-level more abstracted approach.

## Making a strategic choice
Before writing your code, take some time to consider whether your project is suitable for starting with a pre-existing template or if it would be better to start from scratch. Essentially, this depends on the type of contract you are building. For example:
- FA2 contract: it’s better to use a template to start.
- Others: build it from scratch.

## Coding your contract
Before coding, you should clearly outline the purpose of your smart contract, define the problem it addresses, detail the functions it will perform, and specify any external interactions or transactions it will manage.

### Start with online IDE
The online editor is the quickest and easiest way to get started.

For example:
- For smartpy user, we recommend to use the [SmartPy online IDE](https://smartpy.io/)
- For Ligo user, we recommend to use the [Ligo online IDE](https://ligolang.org/?lang=jsligo)

You can start writing your contract by creating a new file in [VSCode](https://code.visualstudio.com/) or your preferred editor.


### Define contract storage.
Contract storage holds the persistent state of your smart contract. It’s important to carefully design your storage since storage is expensive on-chain. You should avoid storing any data that the contract will not use.

- For SmartPy: Use Pythonic classes and types to represent storage. SmartPy provides a straightforward way to map these into Michelson storage requirements.
- For LIGO: Choose the most suitable syntax flavor and use the type definitions to lay out the storage structure.

### Define entrypoints
Entrypoints serve as methods to receive external communication in Tezos contracts. They typically accept two arguments:
- Parameters for the method.
- Contract storage.

Entrypoints also have a predefined signature for the:
- Response
- List of operations
- Updated storage

 
