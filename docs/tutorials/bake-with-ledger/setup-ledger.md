---
title: "Setup your ledger"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

## Disable PIN lock

The Tezos baking application allows you to sign without you having to intervene. However, for your security, Ledger applications ensure that your Ledger device is unlocked before signing a transaction. You will therefore need to disable the automatic lock on your Ledger device.

:::note Warning

Disabling the automatic lock on your Ledger device would allow someone with access to your Ledger unlock device to access the funds on your wallet.
The Tezos baking application only allows you to sign baking-related transactions and requires a PIN code to exit the application. The risks are therefore limited with this application. However, remember to **reactivate the automatic lock on your Ledger device if you stop using the Tezos baking application**.

:::

Go to the settings of your Ledger device and search for the automatic PIN lock option, then deactivate it.
 - For Nanos, Nanos+ and Nanox devices, go to `Settings` then `Security` and finally `PIN lock`.
 - For Stax and Flex devices, go to `Settings` then `Lock screen` and then `Auto-lock`.

## Screen saver

In order to preserve the performance and integrity of your Ledger device, it is **strongly recommended** to activate the screen saver of your Ledger device. Go to the settings of your Ledger device and look for the screen saver option, then activate it for a value that suits you.
 - For Nanos, Nanos+ and Nanox devices, go to `Settings` then `Security` and finally `Screen saver`.
 - For Stax and Flex devices, there is no screen saver.

## HWM option

:::note Warning

In the `Tezos Baking` application, in order to avoid signing blocks or operations that could lead to double-baking, double-attesting or double-preattesting, checks are carried out on the blocks and operations whose signature has been requested.
These verifications require a High Watermark (HWM) to be stored in the RAM of your Ledger device. Saving information in RAM can be slow and can therefore slow down the performance of your device during baking.
You can disable this by disabling the `High Watermark` option in the `Settings` section of the `Tezos Baking` application. However, when this option is no longer active, it becomes possible to sign operations that would lead to double-baking, double-attesting or double-preattesting. You are therefore strongly advised not to deactivate this option if your block and operations provider does not also prevent double-baking, double-attesting and double-preattesting.

:::

In this tutorial we will use `octez-signer`, which keeps an HWM and prevents your Ledger device from signing blocks or operations that could lead to double-baking, double-attesting or double-preattesting, so it is possible to disable the option.
