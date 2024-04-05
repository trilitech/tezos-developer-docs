---
title: Developing on Tezos
authors: Tim McMackin
last_update:
  date: 18 March 2024
---

Developing dApps on Tezos is not very different from developing other types of computer applications: you set up a development environment, develop the components of the application locally, test them locally, and then test them on a test network before deploying them to production.

## Development tools

### Wallets

Wallets maintain a user's credentials and signs transactions on their behalf.
In most cases, Tezos developers need a wallet to submit transactions to their dApps.
See [Installing and funding a wallet](developing/wallet-setup).

### The Octez client

The Octez client lets you work with accounts and smart contracts from the command line.
For more information, see [The Octez client](developing/octez-client).

## IDEs and extensions

<!-- TODO can we mention the StackBlitz/GitPod Web IDE?
New feature to give developers a more fully featured web IDE with 1 click (similar to what a more experienced dev would have locally)
-->

You can work with Tezos from any IDE, but these IDEs have special features for working with Tezos:

### VSCode

VSCode provides extensions for working with Tezos including these:

- [Taqueria](https://marketplace.visualstudio.com/items?itemName=PinnacleLabs.taqueria)
- [Archetype language](https://marketplace.visualstudio.com/items?itemName=edukera.archetype)
- [Michelson Syntax](https://marketplace.visualstudio.com/items?itemName=baking-bad.michelson)
- [Michelson debugger](https://marketplace.visualstudio.com/items?itemName=serokell-io.michelson-debugger)

VSCode also has extensions for the LIGO language, primarily these extensions offered by ligolang.org:

- [ligo-vscode](https://marketplace.visualstudio.com/items?itemName=ligolang-publish.ligo-vscode)
- [LIGO debugger](https://marketplace.visualstudio.com/items?itemName=ligolang-publish.ligo-debugger-vscode)

### Online IDEs

These online IDEs let you write, test, and deploy smart contracts from your web browser:

- LIGO: https://ide.ligolang.org
- SmartPy: https://smartpy.io/ide

## Development platforms

Taqueria is a development platform for Tezos that helps you work on smart contracts and dApps at the same time and keep them in sync as you work through your development cycle.
See https://taqueria.io/.

## Test environments

To test smart contracts and dApps, you can use these test environments:

- Test networks behave like Tezos Mainnet but have differences that make it easier to test on them, such as faucets that provide free tokens and reduced block times for faster testing.
- Sandbox environments like [Flextesa](https://tezos.gitlab.io/flextesa/) run Tezos nodes locally on your computer in a sandbox mode.
- You can also set up your own private test network.

For more information about test environments, see [Testing on sandboxes and testnets](developing/testnets).

LIGO and SmartPy also have built-in testing capabilities.
