---
title: Connecting accounts
authors: Tim McMackin
last_update:
  date: 11 December 2023
---

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users still confirm or reject all transactions in their wallet application, so you must handle both of these use cases.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

For an example of connecting to wallets, see the WalletConnection tutorial scene.

## Best practices

When working with wallets, be sure to follow the advice in [Best practices and avoiding flaws](../dApps/best-practices) for wallet connections.
For example, don't force the user to connect their wallet as soon as the application loads.
Instead, let them see the application first.
Also, provide a prominent disconnect button to allow users to disconnect one account and connect a different one.

## The `TezosAuthenticator` prefab

The `TezosAuthenticator` prefab provides the tools that you need to connect to user's Tezos wallets in a Unity project.
You can copy the `TezosAuthenticator` and `TezosManager` prefabs to your scene, and the `TezosAuthenticator` prefab automatically adds features that connect to users' wallets.

## Connection methods

This table shows the ways that the SDK can connect to wallets and which platforms they are appropriate for:

Connection method | Description | Web platform (WebGL) | Mobile apps | Standalone applications
--- | --- | --- | --- | ---
QR code | Users scan a QR code with a wallet app | Yes | No | Yes
Deep link | The application opens the user's wallet app directly | Yes | Yes | No
Social wallets | The application opens the user's Kukai web-based wallet | Yes | No | No

Regardless of the connection method, the Tezos SDK for Unity runs the `AccountConnected` or `AccountConnectionFailed` event, as appropriate.
For more information about events, see the [Unity SDK MessageReceiver object](./reference/MessageReceiver).

<!-- TODO info about handshakes? -->
<!-- TODO info about persistent Beacon connections; do developers need to know where to store them? Do they put them in a database or something? -->

### QR code connections

This method generates a QR code that a user scans with their wallet application:

1. The Unity application calls the [`Wallet.Connect()`](./reference/Wallet#connect) method with the `walletProvider` parameter set to `WalletProviderType.beacon` to send a connection request to a wallet application via the [TZIP-10 protocol](https://gitlab.com/tezos/tzip/-/tree/master/proposals/tzip-10).
1. The wallet returns a handshake that includes pairing information for the wallet, which triggers the `HandshakeReceived` event.
1. From the handshake information, the SDK generates a QR code.
The `TezosAuthenticator` prefab handles the QR code generation with the `TezosSDK.View.QRCodeView` class.
1. The user scans the QR code with their wallet app and approves the connection.
1. The SDK receives the connection approval, which triggers the `OnAccountConnected` event and includes information about the connected account.

### Deep link connections

Deep link connections open the user's wallet app directly, which can be a mobile app or a browser extension.
This method relies on the Beacon SDK to interact with wallet apps:

1. The Unity WebGL application calls the [`Wallet.Connect()`](./reference/Wallet#connect) method with the `walletProvider` parameter set to `WalletProviderType.beacon`.
The Beacon SDK detects that it is running in a web application and opens a popup window with the wallets that Beacon can connect to:

   <img src="/img/dApps/unity-connecting-beacon-popup.png" alt="Beacon popup window with wallet types including Temple and Umami" style={{width: 300}} />

1. The [Beacon](https://walletbeacon.io/) SDK handles the process of connecting to the wallet.
1. The SDK receives the connection approval, which triggers the `OnAccountConnected` event and includes information about the connected account.

### Social connections

Social wallets exist as accounts managed by web apps such as [Kukai](https://kukai.app/).
WebGL applications can connect to social wallets like this:

1. The Unity WebGL application calls [`Wallet.Connect()`](./reference/Wallet#connect) with the `walletProvider` parameter set to `WalletProviderType.kukai`.

<!-- TODO this doesn't work for me -->

## Disconnecting

It's important to provide a disconnect button so the user can disconnect when they are finished with the application or if they want to connect with a different account.
To disconnect the active wallet, call the [`Wallet.Disconnect()`](./reference/Wallet#disconnect) method.
