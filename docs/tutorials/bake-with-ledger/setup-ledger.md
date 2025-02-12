---
title: "Set up your ledger"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

## Disable PIN lock

The Tezos baking application allows you to bake securely without interruption. However, you will need to disable auto PIN lock feature in the Ledger to avoid getting locked out of the Ledger. Otherwise the Ledger device will lock itself and baking app will not work.

:::note Warning

Disabling the automatic lock on your Ledger device poses a risk that if any other app except baking-app is left open on your device, someone could get access to your funds by using that Ledger if left unattended.
The Tezos baking application is extremely secure and it only allows you to sign baking-related transactions and requires a PIN code to exit the application. However, remember to **reactivate the automatic lock on your Ledger device if you stop using the Tezos baking application on this device**.

:::

Go to the settings of your Ledger device and search for the automatic PIN lock option, then deactivate it.
 - For **NanoS, NanoS+ and NanoX** devices: Go to `Settings` > `Security` > `PIN lock`, then select `No PIN lock` (`Off` for **NanoS**).
 - For **Stax and Flex** devices: Go to `Settings` > `Lock screen` > `Auto-lock`, then disable `Auto-lock`.

## Charging & Battery Saver Considerations

Since your baker runs continuously, it is **strongly recommended to keep your Ledger device constantly powered** to prevent it from running out of battery.

On **NanoX, Stax, and Flex** devices, a battery saver setting allows your Ledger to automatically power off after a period of inactivity to preserve battery life. However, since the Baking app requires the device to remain active at all times, it is **highly recommended to disable this option**.
 - For **NanoX** devices: Go to `Settings` > `General` > `Battery Saver`, then select `Never power off`.
 - For **Stax and Flex** devices: Go to `Settings` > `Battery` > `Auto Power-Off`, then disable `Auto Power-Off`.

## Screen saver

In order to preserve the performance and integrity of your Ledger device, it is **strongly recommended** to activate the screen saver of your Ledger device. Go to the settings of your Ledger device and look for the screen saver option, then activate it for a value that suits you.
 - For **NanoS, NanoS+ and NanoX** devices: Go to `Settings` > `Security` > `Screen saver`.
 - For **Stax and Flex** devices there is no screen saver as of writing this article (Jan 25).

## HWM option

:::note Warning

HWM (High Watermark) protection exists in the Ledger `Tezos Baking` application to avoid double-baking, double-attesting or double-preattesting at the level. The HWM is stored in NVRAM (Non-volatile Random Access Memory), after every signature, by the `Tezos Baking` application (that is on each pre-attestation, attestation, but also while signing blocks).

The NVRAM on Ledger has limited read/write lifetime, thus frequent updates of NVRAM leads to NVRAM burn. To resolve this, an **optional** setting called HWM (ENABLE/DISABLE) is added to the Ledger `Tezos Baking` application (since v 2.4.7). When disabled, it allows storing HWM on RAM instead of NVRAM during the signature of operations. This increases the speed/performance of the Ledger `Tezos Baking` application and extends the lifetime of Ledger devices. The last HWM value on the Ledger’s RAM is written to NVRAM at the time of exiting the Ledger `Tezos Baking` application for persistent storage.
In case of an abrupt interruption of the Ledger `Tezos Baking` application, e.g. caused by an abrupt power off of the Ledger device, the current HWM value may not be updated to the device’s NVRAM. Thus, it’s important to reset the value of the HWM on the Ledger device to the highest HWM value signed by the baker, before resuming baking. (See [Setup the Ledger high watermark (HWM)](/tutorials/bake-with-ledger/run-baker#setup-the-ledger-high-watermark-hwm) to setup the HWM)

:::

For additional protection from double-baking, this tutorial demonstrates the use of an external signer (`octez-signer`), which keeps track of HWM and prevents double baking. It's recommended to use this external signer when you disable the HWM feature on your Ledger device.
