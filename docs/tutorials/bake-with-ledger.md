---
title: Bake using a Ledger device
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

## What is a Ledger device?

A Ledger device is a physical wallet provided by [Ledger](https://www.ledger.com). Its main purpose is to store the holder's private keys without ever disclosing them.

Applications can be installed on your Ledger device so that you can take advantage of the many features of the blockchain without any entity having direct access to your private key.

## Why use a Ledger device to bake?

The baker daemon must have constant access to the baker's private key so that it can sign consensus operations and blocks.
If a malicious entity manages to get access to this private key, it will also gain access to the baker's funds.
Keeping your private key on a Ledger device and only interacting with an application dedicated to baking would prevent any direct access to your private key.


In this tutorial, we'll look at:
 - how to install the Tezos baking application on your Ledger device
 - how to configure your Ledger device so that the [Ledger baking application of Tezos](https://github.com/trilitech/ledger-app-tezos-baking) works properly
 - how to use an external signer (`octez-signer`) while running your baker for enhanced protection

## Prerequisites

 - You need Ledger device.
 - Baker program needs to run constantly, so you need a computer / cloud vm which can run without interruptions. 
