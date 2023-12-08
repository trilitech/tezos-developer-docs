---
title: Connecting accounts
authors: Tim McMackin
last_update:
  date: 8 December 2023
---

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

The `TezosAuthenticator` prefab provides the tools that you need to connect to user's Tezos wallets in a Unity project.
It connects to wallet apps in two main ways:

- The Unity project shows a QR code that users scan with their wallet app.
This method is appropriate for games running in web browsers or in standalone applications.
- The unity project links the device to open its wallet application directly.
This method is appropriate for games running on mobile devices and for WebGL games running in web browsers.

In either case, the Tezos SDK for Unity runs the `TezosManager.Instance.MessageReceiver.AccountConnected` or `TezosManager.Instance.MessageReceiver.AccountConnectionFailed` event, as appropriate.
For more information about events, see the [Unity SDK MessageReceiver object](../../reference/unity/MessageReceiver).

