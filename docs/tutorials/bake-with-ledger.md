---
title: Bake using a Ledger device
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

## What is a Ledger device?

A Ledger device is a physical wallet provided by [Ledger](https://www.ledger.com). Its main purpose is to store the holder's private keys without ever disclosing them.

Ledger devices support many blockchains by installing applications, such as an application to manage Tezos accounts and keys and an application to allow a Tezos baker to use keys on the Ledger.

## Why use a Ledger device to bake?

The baker daemon must have constant access to the baker's private key so that it can sign consensus operations and blocks.
If a malicious entity manages to get access to this private key, it will also gain access to the baker's funds.
Keeping your private key on a Ledger device and only interacting with an application dedicated to baking would prevent any direct access to your private key.

## Setting up your Ledger to launch a baker signing with Ledger

Follow this tutorial before setting up your baker with the tutorial [Run a Tezos node in 5 steps](/tutorials/join-dal-baker). This tutorial will tell you when to switch to that tutorial and what changes to make so the baker you set up will use the accounts on your Ledger device.

In this tutorial, we'll look at:
 - how to install the Tezos baking application on your Ledger device
 - how to configure your Ledger device so that the [Ledger baking application of Tezos](https://github.com/trilitech/ledger-app-tezos-baking) works properly
 - how to use an external signer (`octez-signer`) while running your baker for enhanced protection

## Prerequisites

 - A Ledger device: Nano S, Nano S+, Nano X, Stax or Flex
 - A computer or cloud VM that can run without interruptions, because the baker program must run persistently
 - The latest version of the Octez suite, including the `octez-signer` program

:::note

Note that a PIN input will be required after a power failure. To ensure a truly persistent system, please use a [UPS](https://wikipedia.org/wiki/Uninterruptible_power_supply).

:::
