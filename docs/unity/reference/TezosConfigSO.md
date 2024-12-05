---
title: TezosConfig scriptable object
authors: Tim McMackin
last_update:
  date: 6 November 2024
---

The TezosConfig scriptable object sets the RPC node that the SDK sends Tezos transactions to.

To use this object, create an instance of it, put your information in its fields, and then drag this instance of the TezosConfig scriptable object to the Config field of the TezosManager prefab.

<img src="/img/unity/unity-ipfs-scene-config.png" alt="Adding the Pinata API key and the data provider to the TezosConfig object" style={{width: 300}} />

## Properties

- `Script`: The attached script that implements the object
- `Network`: A variable that lets you select which network to use, such as Tezos Mainnet or the Ghostnet testnet
<!-- `Kukai Web Client Address`: TODO -->
- `RPC Url Format`: The URL of the RPC node to use; this value replaces the variable `{network}` with the value of the `Network` field
- `Request Timeout Seconds`: The time in seconds to wait for a response from the indexer
- `Pinata Api Key`: The Pinata JWT (not the API key or secret key) to use to upload files and data to IPFS
- `Data Provider Config`: The instance of the [DataProviderConfig](/unity/reference/DataProviderConfigSO) scriptable object to use

For more information about RPC nodes, see [The RPC interface](/architecture/nodes#the-rpc-interface).
