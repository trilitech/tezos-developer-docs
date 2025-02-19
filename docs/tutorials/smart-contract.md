---
title: Deploy a smart contract
authors: Tim McMackin
last_update:
  date: 14 September 2023
dependencies:
  smartpy: 0.20.0
  ligo: 1.9.2
  completium-cli: 1.0.26
---

This tutorial covers deploying a smart contract to Tezos.
It covers how to:

- Connect to a testnet
- Create a wallet
- Get tokens from a faucet
- Code a contract, including:
  - Defining the storage for the contract
  - Defining entrypoints in the contract
  - Writing code to run when the entrypoints are called
- Deploy (or originate) the contract to Tezos and set its starting storage value
- Look up the current state of the contract
- Call the contract

This tutorial has different versions for different programming languages.
You can run the tutorial with the version of the language you are most familiar with or want to learn.
You do not need an experience in these languages to run the tutorial.

- To use SmartPy, a language similar to Python, see [Deploy a smart contract with SmartPy](/tutorials/smart-contract/smartpy)
- To use JsLIGO, a language similar to JavaScript and TypeScript, see [Deploy a smart contract with JsLIGO](/tutorials/smart-contract/jsligo)
- To use CameLIGO, a language similar to OCaml, see [Deploy a smart contract with CameLIGO](/tutorials/smart-contract/cameligo)
- To learn the Archetype language, try [Deploy a smart contract with Archetype](/tutorials/smart-contract/archetype).
