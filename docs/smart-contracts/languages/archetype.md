---
title: Archetype
lastUpdated: 29th June 2023
---

## Introduction
Archetype is an elegant generic-purpose language to develop smart contracts on the Tezos blockchain. It's a DSL \(domain-specific language \) for Tezos that facilitates formal verification and transcodes contracts to SmartPy and LIGO.

It supports all [Michelson](https://tezos.gitlab.io/michelson-reference/) features but also provides exclusive high-level features for a precise and concise source code, that make contracts easier to develop, read and maintain.

## Looking at a simple Archetype contract

Create a file `hello.arl`

```
archetype hello

variable msg : string = "Hello"

entry input(name : string) {
  msg += (length(msg) > 5 ? "," : "") + " " + name
}
```

The contract starts with the `archetype` keyword followed by a contract identifier.

For example:
```
archetype escrow

/* ... */
```

#### Parameters

A contract may have parameters. A parameter value is not in the source code and is provided at deployment (origination) time. For example, the address of the contract owner is typically a contract parameter.

By default, a contract parameter is an element of the contract storage. It is defined by an identifier and a type. The list of parameters follows the contract's identifier between parenthesis and the parameters are separated by commas.

For example:
```
archetype escrow(seller : address, buyer : address)

/* ... */
```

The `seller` and `buyer` [addresses](https://archetype-lang.org/docs/reference/types/#address) then need to be set at deployment time.

## Deploy a contract with Completium:

The Completium CLI is the command line utility to install Archetype compiler and manage contracts (deploy, call).

To install and initialize Completium do:
```
$ npm install -g @completium/completium-cli
$ completium-cli init
```

Then you can deploy the contract with

```
completium-cli deploy hello.arl
```

Call contract's entrypoint `input` with argument "Archetype":

```
completium-cli call hello --entry input --arg '{ "name": "Archetype" }'
```

:::note
The full documentation for Archetype can be found on [archetype-lang.org](https://archetype-lang.org/docs/introduction). Also, see the material on OpenTezos [here](https://opentezos.com/archetype).
:::

#### Further reading:

* [Medium article](https://medium.com/coinmonks/archetype-a-dsl-for-tezos-6f55c92d1035%20)
* [How To Verify a smart contract with Archetype](https://medium.com/coinmonks/verify-a-smart-contract-with-archetype-6e0ea548e2da%20)
