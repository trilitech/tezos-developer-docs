---
title: Creating smart contracts
author: 'Yuxin Li'
last_update:
  date: 6 November 2023
---
## Introduction
 This documentation provides step-by-step instructions for creating smart contracts on Tezos. After creating the contract, you can find the resources on [testing](testing.md) and [deploying](deploying.md).

## Choosing your smart contract language
Tezos supports a variety of smart contract [languages]((languages.md)): Michelson, SmartPy, LIGO, Archetype.

You can select a language based on your familarity with programming paragims, the complexity of the contract you want to deploy, and the specific features you require. Here's a more detailed table for each language:

|                  |                        **Michelson**                       |                      **SmartPy**                      |                                        **LIGO**                                       |                                   **Archetype**                                   |
|:----------------:|:----------------------------------------------------------:|:-----------------------------------------------------:|:-------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|
|  **Complexity**  |                High (stack-based, low-level)               |             Low (Python-like, high-level)             |                         Moderate (various high-level syntaxes)                        |                 Moderate (includes formal specification features)                 |
| **Capabilities** |   Full control over contract, optimal for gas efficiency   | Easy to write, automatically manages stack operations |                        Statically-typed, strong error checking                        |                Specialized for formal verification and correctness                |
|   **Use Cases**  | Optimized contracts, developers with blockchain experience |          Python developers, rapid prototyping         | Developers familiar with static typing, variety of mainstream programming backgrounds | High-security contracts, developers looking for formal proof of contract behavior |

For beginners, we recommand **SmartPy** or **LIGO** for their higher-level more abstracted approach.


## Making a strategic choice
Before writing your code, take some time to consider whether your project is suitable for starting with a pre-existing template or if it would be better to start from scratch. Essentially, this depends on the type of contract you are building. For example:
- FA2 contract: it’s better to use a template to start.
- Others: build it from scratch.

## Coding your contract
Before coding, you should clearly outline the purpose of your smart contract, define the problem it addresses, detail the functions it will perform, and specify any external interactions or transactions it will manage.

### Starting with online IDE
The online editor is the quickest and easiest way to get started.

For example:
- For smartpy user, we recommend to use the [SmartPy online IDE](https://smartpy.io/)
- For Ligo user, we recommend to use the [Ligo online IDE](https://ligolang.org/?lang=jsligo)


### Defining contract storage
Contract storage holds the persistent state of your smart contract. It’s important to carefully design your storage since storage is expensive on-chain. You should avoid storing any data that the contract will not use.

- SmartPy: Use Pythonic classes and types to represent storage. SmartPy provides a straightforward way to map these into Michelson storage requirements.
- LIGO: Choose the most suitable syntax flavor and use the type definitions to lay out the storage structure.

In Tezos, big maps are a storage optimization feature for large sets of data, , especially when handling large datasets that don't need to be fully loaded into memory at once. Big maps are ideal for ledger applications with numerous accounts, as they load data lazily, fetching only necessary parts on demand. In contrast to regular maps, suitable for smaller collections, and lists, which order data, big maps save costs when the dataset is large. 

In SmartPy, you can define a big map using `sp.big_map`, and in LIGO, you use `big_map` keyword for the type declaration.

### Defining entrypoints
Entrypoints serve as methods to receive external communication in Tezos.

- SmartPy: Entrypoints are defined as methods within a Python class that extends `sp.Contract`. They use decorators like `@sp.entry_point` to denote entrypoints
- LIGO: Entrypoints in LIGO are defined as functions that manipulate storage. The `function` keyword is used, and each entrypoint function must be explicitly marked for export in the contract interface

You should clearly define the parameters and storage interaction for both languages.

- Each entrypoint's **parameters** must be well-specified, with types that match the expected inputs. For example, if an entrypoint is supposed to accept an integer and a string, the parameter list should reflect this.
- The contract **storage** is usually passed as an argument to the entrypoints. In SmartPy, the storage is accessed through the self.data attribute inside the entrypoint methods. In LIGO, storage is a parameter of the function, and it's often the last parameter by convention.


 
