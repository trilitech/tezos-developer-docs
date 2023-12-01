---
title: Unity SDK prefabs
sidebar_label: Prefabs
authors: Tim McMackin
last_update:
  date: 1 December 2023
---

The Tezos SDK for Unity provides these prefabs:

## MainThreadExecutor

This prefab provides prerequisites for using the SDK in a scene.

## TezosAuthenticator

This prefab provides code to connect to different kinds of Tezos wallets.

<!-- TODO more info on its objects, or just link to instructions for connecting? -->

## TezosManager

This prefab sets the metadata for the scene, such as the application name that users see in their wallet applications before connecting to the project.
It also creates an instance of the `TezosSDK.Tezos.Tezos` class, which provides access to the SDK objects such as the [Wallet](./Wallet) and [MessageReceiver](./MessageReceiver) objects.
