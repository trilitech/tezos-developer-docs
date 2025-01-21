---
title: "Install the Ledger baking application of Tezos"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

[`Tezos Baking`](https://github.com/trilitech/ledger-app-tezos-baking) is the application developed to bake on Tezos using your Ledger device.
It allows you to sign block and consensus operations while keeping your private keys secure in the Ledger hardware. Some of its additional features are:
 1. HWM tracking to avoid double baking
 2. Restricted signing permission, i.e. it only allows signing baking related operations. You can not approve signing of funds transfer using baking app on Ledger. 

## Download `Ledger Live`

To download the Tezos baking application, you first need to download `Ledger Live`.
[`Ledger Live`](https://www.ledger.com/ledger-live) is the application provided by Ledger to allow you to download the various applications compatible with your Ledger device.

## Download `Tezos Baking`

Once you have downloaded `Ledger Live`, launch it.

The Tezos baking application is only available when developer mode is activated. To activate it, go to settings and, in the `Experimental features` tab, activate `Developer mode`. With developer mode enabled, the Tezos baking application is now accessible.

Click on `My Ledger`. If you have not already done so, connect your Ledger device to the USB port and authorize the secure connection to `Ledger Live` on your Ledger device.

Search for the `Tezos Baking` application and click on `Install`.

![Install the Ledger `Tezos Baking` application from `Ledger Live`](/img/tutorials/bake-with-ledger/install-ledger-tezos-baking-app.gif)

## Download `Tezos Wallet (XTZ)`

To be able to sign the operations needed to set up your baker, you also need the `Tezos Wallet (XTZ)` application.
[`Tezos Wallet (XTZ)`](https://github.com/trilitech/ledger-app-tezos-wallet) is the application developed to sign Tezos operations using your Ledger device.

Find and install the `Tezos Wallet (XTZ)` application.
