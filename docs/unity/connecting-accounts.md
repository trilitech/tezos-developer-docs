---
title: Connecting accounts
authors: Tim McMackin
last_update:
  date: 11 December 2023
---

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

The `TezosAuthenticator` prefab provides the tools that you need to connect to user's Tezos wallets in a Unity project.

This table shows the ways that the SDK can connect to wallets and which platforms they are appropriate for:

Connection method | Description | Web platform (WebGL) | Mobile apps | Standalone applications
--- | --- | --- | --- | ---
QR code | Users scan a QR code with a wallet app | Yes | No | Yes
Deep link | The application opens the user's wallet app directly | Yes | Yes | No
Social wallets (Kukai) | The application opens the user's Kukai web-based wallet | Yes | No | No

Regardless of the connection method, the Tezos SDK for Unity runs the `AccountConnected` or `AccountConnectionFailed` event, as appropriate.
For more information about events, see the [Unity SDK MessageReceiver object](../../reference/unity/MessageReceiver).

<!-- TODO info about handshakes? -->
<!-- TODO info about persistent Beacon connections; do developers need to know where to store them? Do they put them in a database or something? -->

## QR code connections

This method generates a QR code that a user scans with their wallet application:

1. The Unity application calls [`Wallet.Connect()`](../../reference/unity/Wallet#connect) in Beacon mode to send a connection request to a wallet application via the [TZIP-10 protocol](https://gitlab.com/tezos/tzip/-/tree/master/proposals/tzip-10).
1. The wallet returns a handshake that includes pairing information for the wallet, which triggers the `HandshakeReceived` event.
1. From the handshake information, the SDK generates a QR code.
The `TezosAuthenticator` prefab handles the QR code generation with the `TezosSDK.View.QRCodeView` class.
1. The user scans the QR code with their wallet app and approves the connection.
1. The SDK receives the connection approval, which triggers the `OnAccountConnected` event and includes information about the connected account.

## Deep link connections

## Social connections
