---
title: Unity SDK prefabs
sidebar_label: Prefabs
authors: Tim McMackin
last_update:
  date: 11 January 2024
---

The Tezos Unity SDK provides these prefabs:

## TezosManager

This prefab sets the metadata for the scene, such as the application name that users see in their wallet applications before connecting to the project.
It also initializes the Tezos SDK for use in the scene and creates an instance of the `TezosSDK.Tezos.Tezos` class, which provides access to the SDK objects such as the [Wallet](./reference/Wallet) and [EventManager](./reference/EventManager) objects.

Its fields control what users see in their wallet applications before connecting to the project, as shown in this picture of the Inspector panel:

<img src="/img/unity/unity-inspector-tezosmanager.png" alt="The Inspector panel, showing information about the project" style={{width: 300}} />

## TezosAuthenticator

This prefab provides code to connect to different kinds of Tezos wallets.

If you copy this prefab into your scene and run the scene, it shows a QR code or connection buttons that Tezos wallet applications can scan to connect with the application.
Whether it shows the QR code or buttons depends on whether the project is running in standalone, mobile, or WebGL mode.
You can access these features through the prefab and change how the project manages its connection to users' wallets.

The prefab's `LoginPanel` object includes objects that connect to wallets in different ways:

- The `QRCode` object shows a QR code that wallet apps can scan to connect
- The `LoginButtonDeepLink` object shows a button that opens a wallet app on a mobile device or a wallet browser extension in a web browser via the Beacon SDK
- The `SocialLoginButton` object shows a button that opens a social wallet, such as Kukai

For details about how the prefab works, see the file `TezosAuthenticator.cs`.

For an example of the prefab in use, see the [WalletConnection tutorial scene](./scenes#wallet-connection-scene).
