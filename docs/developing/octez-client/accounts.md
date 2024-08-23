---
title: Creating accounts
---

You can create or import accounts into the Octez client just like you do so in wallet applications.

Octez keeps a local list of aliases for addresses, including user accounts, smart contracts, and Smart Rollups.
You can list the aliases that the Octez client is aware of by running the command `octez-client list known addresses`.
When you run transactions with Octez, you can use the alias in place of the account address.

## Creating accounts

To create an account, run this command, replacing `local_account` with a local name for the new account:

```bash
octez-client gen keys local_account
```

You can see the address of the account by running this command:

```bash
octez-client show address local_account
```

The account address (technically the hash of the public key) starts with `tz1`, `tz2`, or `tz3`.
You can use this address to send tez to this account, such as from a faucet if you are using a testnet.
See [Testing on sandboxes and testnets](/developing/testnets).

<!-- TODO
## Importing pregenerated accounts

Some testnets provide accounts that anyone can access.
You can use these accounts for tasks such as local tests and automated tests, but be aware that their private keys are publicly available and anyone can use them.

TODO info about Alice and Bob and how to import them -->

## Importing pre-existing accounts

If you already have a Tezos account, you can import your private key to use the account in Octez:

1. Export the private key from your wallet application, being careful not to expose it to anyone.

1. Run this command, replacing `$ALIAS` with a local alias for the account and `$PRIVATE_KEY` with the private key:

   ```bash
   octez-client import secret key $ALIAS unencrypted:$PRIVATE_KEY
   ```

Now you can use the alias in place of the address when you send transactions with Octez.
