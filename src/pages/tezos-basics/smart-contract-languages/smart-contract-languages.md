---
id: smart-contracts
title: Smart contracts
authors: Thomas Zoughebi, Aymeric Bethencourt, and Maxime Fernandez
---

# Tutorials on smart contract languages LIGO, SmartPy & Archetype

To directly jump into writing a smart contract in one of the high-level languages available for Tezos, see the documentation on their respective sites. 

- **LIGO:** [Docs](https://ligolang.org/docs/intro/introduction?lang=jsligo) and [Tutorials](https://ligolang.org/docs/tutorials/getting-started?lang=jsligo)

- **SmartPy:** [Manual](https://smartpy.dev/docs/manual/introduction/overview) and [Guides](https://smartpy.dev/docs/guides/).

- **Archetype:** [Docs](https://archetype-lang.org/docs/introduction/)

You can also see the lessons for each on OpenTezos for [LIGO](https://opentezos.com/ligo), [SmartPy](https://opentezos.com/smartpy) and [Archetype](https://opentezos.com/archetype).


# Introduction to smart contracts 
A smart contract is a piece of code stored on the *blockchain*. It contains a set of instructions and rules to trigger them. Once deployed, it becomes immutable, but a user can trigger the execution of the code without modifying it. 

A smart contract is composed of mostly three elements that are maintained by nodes in the state of the blockchain:

- Their balance: a contract is a kind of account, and can receive and send Tez
- Their storage: data that is dedicated to and can be read and written by the contract
- Their code: it is composed of a set of entry-points, a kind of function that can be called either from outside of the chain, or from other contracts.

The code of smart contracts is expressed in Michelson, a Turing-complete stack-based language that includes common features as well as some very specific blockchain related features:

-It doesn’t have variables, but can manipulate data directly on a stack, through a set of stack manipulation instructions. For example the ADD instruction consumes two elements from the top of the stack, and puts their sum on top of the stack.
- It is strongly typed, with basic types such as integers, amounts of tez, strings, account addresses, as well as pairs, lists, key-value stores (big-maps), or pieces of code (lambdas).
- -It has limited access to data, and can only read data from its own storage, data passed as parameters during calls to its entry points, and a few special values such as the balance of the contract, the amount of tez sent to it during a call, and the creation time of the current block. It can also access a table of constants.

When someone calls a smart contract, all the contract can do can be summarized as:

- Performing some computations.
- Updating the value of its own storage.
- Generating a list of operations. These operations will be performed once the contract's own execution is over. This can include transferring funds to other accounts, calling other contracts, or even originating new contracts, but not much more.

One key property of the execution of smart contracts on Tezos, designed to reduce the risk of bugs, is that if any part of the execution of a contract itself, or in the call of any other contract it calls, generates an error, then everything is canceled, and the result is as if the initial call to the contract had never been done. The idea is that either everything goes as intended, or nothing happens at all, reducing the risk of unintended situations.


## Overview of Smart Contracts on Tezos

As in Ethereum, Tezos uses 2 types of accounts:
1. Classic accounts with a primary address, to store tez (ꜩ)
2. Smart contract accounts with an address, storing code and tez (ꜩ)

In Tezos vocabulary, "*contracts*" refers to both types in general. Actually each *contract* has a "**_manager_**". Precisely, a classic account has an "**_owner_**". If a contract has the "*spendable*" property, the manager is the entity allowed to spend funds from it.

Smart contracts can achieve different kinds of operations with coins and *other smart contracts*. They're comparable to snack vending machines. 
- Each machine has a contract saying "*Give me cryptocurrency, then I give you a food item or drink*" (promises)
- Each machine can have a different smart contract for various food or drink items (see that as asset types)
- There could be another smart contract gathering the cryptocurrency total for the company (from previous smart contracts)

Each machine doesn't operate until enough currency is delivered (*Gas*). Note that the quantities of foods or drinks changes while their *types* can't (ever).

Of course, smart contracts go beyond this metaphor. Thanks to *transparency* and *immutability*, they allow an **agreement** to be secured between two or more parties. 

For example, it is common to create financial instruments like various *tokens* (usually worth a fraction of the blockchain's *coin*) with different usability and characteristics inside a multiple smart contracts system. Other more or less complex projects can propose *lending*, *stablecoins*, or *crowdfundings*.

In most cases, smart contracts remove *intermediates* and drastically reduce costs compared to classic paper contracts and their validations.

Notice that a smart contract can only run and interact with the blockchain it's stored on. It can't interact with the outside world. That's where *decentralized applications* or "_Dapps_" come in because they provide interfaces for the outside world.


## Lifecycle of a Tezos smart contract
A smart contract can only be deployed once but can be called many times. The Tezos smart contract lifecycle steps are two:

1. Deployment
2. Interactions through calls

### Deployment of a Tezos smart contract
The deployment of a Tezos smart contract is called "**origination**".

When a smart contract is deployed, an **address** and a corresponding *persistent space* called "**storage**" are allocated to this smart contract. The smart contract address is like its *identity* and *where* it lives on the ledger. Its storage is its *usable space*.

Once deployed, anyone or *anything* can call the smart contract (e.g. other contracts) with an *operation* (in Tezos vocabulary, *transactions* are a sub-type of *operations*; see more about them in the [*Operations*](/tezos-basics/operations) chapter) sent to its address with arguments. This call triggers the execution of the set of pre-defined instructions (promises).

The origination of a Tezos smart contract must define:
* A complex **Parameter Type** in the low-level *Michelson* language  
  List or tuple of each parameter type (see more below with high-level languages)
* **Storage Type**
* **Set of instructions** in the low-level *Michelson* language

![](/images/tezos_smart_contract_content.svg)
*FIGURE 1: Content of a Tezos smart contract*

The CLI command "`octez-client originate`" can be used to deploy a Tezos smart contract. Arguments are the following:
- Name of the smart contract
- Michelson script containing: 
    - Parameter Type
    - Storage Type
    - Set of instructions
- Initial storage value
- Amount of tez sent to the smart contract
- An optional address of a delegate

The command returns the newly deployed contract's address.

### Code of a Tezos smart contract
The code of a smart contract is composed of Michelson instructions. Calls to the smart contract execute these instructions.

The execution of instructions results in a new storage "**state**". The instructions define how to produce this new state. The instructions may also lead to other operations, including originations of other smart contracts, and of course, transactions.

You can find the full description of the Michelson language in the [Michelson module](/michelson).

### Storage of a Tezos smart contract
During the origination, the process must specify the storage **initial state** (and type).

### Call of a Tezos smart contract
A smart contract can be called by a classic account whose address starts with "**tz**" or by a smart contract's account whose address begins with "**KT1**". The operation or transaction specifies *arguments*, that are ordered types. In the below example, we increase or decrease a value in the storage:

![](/images/invoke_smart_contract_wo_entrypoint.svg)
*FIGURE 2: Call of a smart contract triggering its code and modifying its storage's state*

One can use the Command Line Interface (CLI) provided by Tezos to interact with a node and make calls. The "`octez-client`" application allows anyone to deploy and call Tezos smart contracts.

It is also possible to send requests to a node through RPC (Remote Procedure Call) via HTTP.

## Michelson vs high-level languages for Tezos smart contracts implementations
Michelson is a low-level stack-based language. Therefore its adoption is quite limited because most developers won't take the time to learn it. Several Michelson *compilers* have been developed to avoid this friction and led to several high-level languages, listed above, created that are closer to developers habits.

Depending on the high-level language used, a smart contract deployment also defines its *entrypoints* using the complex **Parameter Type**. These are special functions used to dispatch invocations of the smart contract. Each entrypoint is in charge of triggering an instruction. Below is the same example as before, abstracting the complex Parameter Type:

![](/images/invoke_smart_contract.svg)
*FIGURE 3: Call of a smart contract triggering its entrypoints, code, and modifying its storage's state*

Each type and position of a parameter in the list (or tupple) allows you to define an entrypoint (a function). For instance, in our example, there are two parameters, hence two types. Both types are integers (to increase or decrease a value). Because the type is the same, its position (left, right, or index number) determines which entrypoint is correct.  
It could be:
- Left type: "Increment" entrypoint
- Right type: "Decrement" entrypoint

Below is another illustration of this process:

![](/images/tezos_smart_contract_deploy_invoke.svg)
*FIGURE 4: Deployment and call of a Tezos smart contract with high-level languages*
