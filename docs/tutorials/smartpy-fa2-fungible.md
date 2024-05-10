---
title: Create a fungible token with the SmartPy FA2 library
authors: Tim McMackin
last_update:
  date: 22 April 2024
---

This tutorial shows you how to use SmartPy's FA2 library to create standards-compliant tokens.

In this tutorial you will learn:

- What a fungible token is and how its contract works
- What the FA2 standard is and why token standards are important
- How to use the SmartPy FA2 library to create token contracts
- How to use a local sandbox to test contracts
- How to write custom token behaviors
- How to deploy the contract
- How to interact with tokens directly in wallet apps

## Prerequisites

To run this tutorial, you should have a basic understanding of how Tezos works, what blockchain tokens are, and the ability to use the command-line terminal on your computer.

If you haven't worked with smart contracts before, start with the tutorial https://docs.tezos.com/tutorials/smart-contract.

## What is a fungible token?

Fungible tokens are collections of identical, interchangeable tokens, just like one US dollar or Euro is the same as any other US dollar or Euro.
Any number of different accounts can each have a quantity of a certain fungible token.

By contrast, non-fungible tokens are unique and not interchangeable.
Therefore, only one account can own an NFT at one time.

## What is the FA2 standard?

FA2 is a standard interface for tokens on Tezos.
It supports several different token types, including fungible and non-fungible tokens.

Adhering to the FA2 standard allows developers to create new types of tokens while ensuring that the tokens work with existing wallets and applications.
The FA2 standard leaves enough freedom for developers to define rules for transferring tokens and for how tokens behave.

For more information about FA2 tokens, see [FA2 tokens](../architecture/tokens/FA2).

## What is the SmartPy FA2 library?

The SmartPy FA2 library provides classes and other tools to simplify creating FA2-compliant tokens in the SmartPy language.
You create a contract that inherits from a base class in the library to select a kind of token (fungible, single-asset, or non-fungible).
Then you inherit mixins to customize how the token works.

For more information about the SmartPy FA2 library, see [FA2 lib](https://smartpy.io/guides/FA2-lib/overview) in the SmartPy documentation.

## Tutorial application

In this tutorial, you use the SmartPy FA2 library to create a contract that manages multiple fungible tokens.
You add automated tests to the token, deploy it to a local sandbox, customize it further, and deploy it to a test network.
Finally, you work with the token in your own Tezos wallet.

The completed smart contracts are available here: https://github.com/trilitech/tutorial-applications/tree/main/smartpy_fa2_fungible

When you're ready, move to the next section to start setting up your token.
