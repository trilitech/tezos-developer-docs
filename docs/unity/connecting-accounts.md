---
title: Connecting accounts
authors: Tim McMackin
last_update:
  date: 8 November 2024
---

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users still confirm or reject all transactions in their wallet application, so you must handle both of these use cases.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

<!-- For an example of connecting to wallets, see the [WalletConnection tutorial scene](/unity/scenes#wallet-connection-scene). -->

For more information about Tezos wallets, see [Installing and funding a wallet](/developing/wallet-setup).

## Best practices

When working with wallets, be sure to follow the advice in [Best practices and avoiding flaws](/dApps/best-practices) for wallet connections.
For example, don't force the user to connect their wallet as soon as the application loads.
Instead, let them see the application first.
Also, provide a prominent disconnect button to allow users to disconnect one account and connect a different one.

## Connection methods

This table shows the ways that the SDK can connect to wallets and which platforms they are appropriate for:

Connection method | Description | Web platform (WebGL) | Mobile apps | Standalone applications
--- | --- | --- | --- | ---
QR code | Users scan a QR code with a wallet app | Yes | No | Yes
Deep link | The application opens the user's wallet app directly | Yes | Yes | No
Social wallets | The application opens the user's Kukai web-based wallet | Yes | No | No

When wallets connect or disconnect, the SDK runs the `WalletConnected` or `WalletDisconnect` events for non-social wallets and the `SocialLoggedIn` and `SocialLoggedOut` events for social wallets.

<!-- TODO info about handshakes? -->
<!-- TODO info about persistent Beacon connections -->

## Wallet types

The SDK supports three types of wallets:

- Tezos wallets that connect through the Beacon protocol, such as Temple
- Tezos social wallets that connect to a federated identity login through [Kukai](https://wallet.kukai.app)
- Ethereum wallets that connect through the WalletConnect protocol

## Connecting to Beacon wallets

Unity applications can connect to Beacon wallets by showing a QR code that the user scans with a wallet app or by opening that app directly through the Beacon protocol.
For an example of this method, see [Quickstart](./quickstart).

This method for connecting follows these general steps:

1. The Unity application calls the `TezosAPI.ConnectWallet()` method and passes the Beacon wallet type:

   ```csharp
   var walletProviderData = new WalletProviderData { WalletType = WalletType.BEACON };
   try
   {
       var result = await TezosAPI.ConnectWallet(walletProviderData);
       _infoText.text = result.WalletAddress;
   }
   catch (WalletConnectionRejected e)
   {
       _infoText.text = "Wallet connection rejected";
       Debug.LogError($"Wallet connection rejected. {e.Message}\n{e.StackTrace}");
   }
   catch (Exception e)
   {
       Debug.LogException(e);
   }
   ```

1. The SDK runs the `OnPairingRequested` event.

1. The Unity application uses the `Tezos.QR.QrCodeGenerator` class to generate the QR code:

   ```csharp
   private void OnPairingRequested(string data)
   {
       _qrCodeGenerator.SetQrCode(data);
   }
   ```

1. In the application, the SDK first tries to connect to a Beacon wallet through a deep link.
It shows a popup window that prompts the user to select a compatible wallet:

   ![The Beacon popup window with a QR code and a list of compatible wallets](/img/unity/unity-connecting-beacon-popup.png)

1. If the device is not capable of deep links to wallet apps, the SDK runs the `PairingRequested` event, which you can use to trigger the `Tezos.QR.QrCodeGenerator` class to generate a QR code and show it on the interface for the user to scan with a wallet app.

1. Regardless of whether it used a deep link or a QR code, the SDK runs the `WalletConnected` event and the `TezosAPI.ConnectWallet()` method returns information about the connected account.

## Connecting to WalletConnect wallets

TODO

## Connecting to social wallets

Social wallets exist as accounts managed by web apps such as [Kukai](https://kukai.app/).

To connect to a social wallet, the Unity WebGL application calls `Wallet.Connect()` with the `walletProvider` parameter set to `WalletProviderType.kukai`.

TODO Get this working and cover the steps

## Disconnecting

It's important to provide a disconnect button so the user can disconnect when they are finished with the application or if they want to connect with a different account.
To disconnect the active wallet, call the `Wallet.Disconnect()` method.
This method triggers the `WalletDisconnected` event and removes the connection from the wallet app and from the
