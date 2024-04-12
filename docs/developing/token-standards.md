---
title: Token standards
authors: "Tim McMackin"
last_update:
  date: 2 April 2024
---

While you can create tokens that behave in any way that you want them to behave, it's best to create tokens that follow a standard.
Token standards in a blockchain ecosystem are important for many reasons, including:

- They enforce best practices that improve the safety of the code that the tokens depend on
- They provide an interface that makes it easier for applications to work with them, such as a consistent way of transferring tokens from one account to another

When a project issues a new token that is compatible with a standard, existing decentralized exchanges, tools, wallets, applications, and block explorers can work with it and display it appropriately.
For example, block explorers can detect a standard-compliant contract and automatically show the tokens in the contract.
Also, the Octez client has dedicated commands for working with FA1.2 tokens, including transferring them and checking account balances.

A token standard is an interface and set of rules that smart contracts must follow to be compatible with the standard.
In Tezos, smart contracts define how tokens behave, such as how to transfer them between accounts, so it's the smart contract that actually follows the standard, but people often refer to tokens that are compatible with a certain standard.

Tezos provides two standards for tokens.
The standard that you use for your tokens depends on the kind of tokens that you want to create.
These standards are named with the prefix FA, which stands for _financial application_.

- [FA1.2](./tokens/FA1.2) tokens are fungible tokens
- [FA2](./tokens/FA2) tokens can be multiple types of tokens, including fungible and non-fungible tokens, and a single smart contract that follows this standard can create multiple types of tokens

You can use templates for smart contracts adhering to these standards, instead of writing your own contract from scratch:

- For SmartPy templates, see [Tokens](https://smartpy.io/guides/tokens/) in the SmartPy documentation.
- For LIGO templates, see the [`@ligo/fa`](https://packages.ligolang.org/package/@ligo/fa) package.
- For Archetype templates, see [Templates](https://archetype-lang.org/docs/templates/overview/) in the Archetype documentation.