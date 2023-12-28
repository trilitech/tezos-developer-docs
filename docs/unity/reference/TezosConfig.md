---
title: Unity SDK TezosConfig object
sidebar_label: TezosConfig object
authors: Tim McMackin
last_update:
  date: 20 December 2023
---

The Unity SDK class `TezosSDK.Tezos.TezosConfig`, which is available at runtime as the `TezosConfig.Instance` object, sets the [RPC](../../architecture/rpc) node that the SDK uses to send transactions to Tezos.

## Properties

- `DefaultTimeoutSeconds`: The timeout duration in seconds
- `Network`: The type of network, as a Beacon SDK [`NetworkType`](https://typedocs.walletbeacon.io/enums/networktype.html) enumeration
- `RpcBaseUrl`: The URL of the RPC node to use

## Methods

None.
