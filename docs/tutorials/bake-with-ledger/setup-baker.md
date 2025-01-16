---
title: "Set up your Ledger baking key with `octez-signer`"
authors: Sébastien Palmer
last_update:
  date: 10 January 2025
---

It’s recommended to use a separate machine to run the remote signer. For simplicity, in this tutorial, we assume a setup where the Ledger device is connected to the same machine running the baker binary. On the same machine, the following commands can be used to set up the baking key with `octez-signer`.

## Import a key from your Ledger device to the `octez-signer` context

Let's start by importing a key from your Ledger device for `octez-signer`.
Connect your Ledger device with a USB cable and open the `Tezos Baking` application.
To see the available keys, run:

   ```bash
   octez-signer list connected ledgers
   ```

Output:

   ```console
   ## Ledger `masculine-pig-stupendous-dugong`
   Found a Tezos Baking 2.4.7 (git-description: "v2.4.7-70-g3195b4d2")
   application running on Ledger Nano S Plus at [1-1.4.6:1.0].

   To use keys at BIP32 path m/44'/1729'/0'/0' (default Tezos key path), use one
   of:
     octez-client import secret key ledger_username "ledger://masculine-pig-stupendous-dugong/ed25519/0h/0h"
     octez-client import secret key ledger_username "ledger://masculine-pig-stupendous-dugong/secp256k1/0h/0h"
     octez-client import secret key ledger_username "ledger://masculine-pig-stupendous-dugong/P-256/0h/0h"
     octez-client import secret key ledger_username "ledger://masculine-pig-stupendous-dugong/bip25519/0h/0h"
   ```

Key's URIs are of the form `ledger://<animals>/<curve>[/<path>]` where:
 - `<animals>` is the identifier of the ledger.
 - `<curve>` is the signing curve
 - `<path>` is a BIP32 path anchored at m/44h/1729h. The ledger does not yet support non-hardened paths, so each node of the path must be hardened.

:::note Signing curve

The `secp256k1` and `P-256` signature schemes (resp. `tz2` and `tz3`) have the best signature performance with the `Tezos Baking` application.

:::

Choose one of the URIs shown, modifying the BIP32 path as you like, then import it using `octez-signer`:

   ```bash
   octez-signer import secret key my_ledger_key "ledger://masculine-pig-stupendous-dugong/secp256k1/0h/0h"
   ```

On your Ledger device, you should see a screen sequence similar to:
![Ledger Key Review](/img/tutorials/bake-with-ledger/pkh-review.png)
<!-- https://lucid.app/lucidchart/26df7357-40e6-4c1b-8ffe-0e4b8eebf707/edit?beaconFlowId=D98D3B908C0603CC&invitationId=inv_08b134b7-3e40-4429-af31-101e36489cc3&page=0_0# -->

If the public key hash displayed on your Ledger is equal to the address displayed in the command output, you can approve.

Output:

   ```console
   Please validate (and write down) the public key hash displayed on the Ledger,
   it should be equal
   to `tz...`:
   Tezos address added: tz...
   ```

## Authorise the baking key in the `Tezos Baking` application

For your security, the `Tezos Baking` application only allows one key to be used for signing. So you need to specify which key you want to bake with:

   ```bash
   octez-signer setup ledger to bake for my_ledger_key
   ```

On your Ledger device, you should see a screen sequence similar to:
![Ledger Setup Review](/img/tutorials/bake-with-ledger/setup-review.png)
<!-- https://lucid.app/lucidchart/26df7357-40e6-4c1b-8ffe-0e4b8eebf707/edit?beaconFlowId=D98D3B908C0603CC&invitationId=inv_08b134b7-3e40-4429-af31-101e36489cc3&page=0_0# -->

If the information displayed on your Ledger is similar to the information displayed in the command output, you can approve.

Output:

   ```console
   Setting up the ledger:
   * Main chain ID: 'Unspecified' -> NetXdQprcVkpaWU
   * Main chain High Watermark: 0 (round: 0) -> 0 (round: 0)
   * Test chain High Watermark: 0 (round: 0) -> 0 (round: 0)
   Authorized baking for address: tz...
   Corresponding full public key: ..pk...
   ```

## Link `octez-signer` to `octez-client`

Now that your baking key on `octez-signer` is linked to your Ledger device, `octez-signer` will be in charge of signing using your Ledger device. Let's launch `octez-signer`:

   ```bash
   octez-signer launch socket signer -a localhost
   ```

> The default port is `7732`.

To be able to sign from `octez-client` and from the baker binaries, you have to link your remote signer for `octez-client`.
In a new terminal, run:

   ```bash
   octez-client -R 'tcp://localhost:7732' config update
   ```

This way, the key stored in the context of your `octez-signer` will be accessible by remote from the `octez-client` context.
