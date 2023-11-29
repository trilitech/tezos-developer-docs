---
title: Unity SDK MessageReceiver object
sidebar_label: MessageReceiver object
authors: Tim McMackin
last_update:
  date: 29 November 2023
---

Docs for `TezosManager.Instance.Tezos.MessageReceiver`:

Events you can subscribe to, when they happen, and what they pass to the listeners.

  - `AccountConnected`: Runs when an account connects
  - `AccountConnectionFailed`: Runs when an attempt to connect to an account fails and provides error information
  - `AccountDisconnected`: Runs when an account disconnects
  - `ContractCallCompleted`: Runs when a call to a smart contract is confirmed on the blockchain and provides the hash of the transaction
  - `ContractCallFailed`: Runs when a call to a smart contract fails and provides error information
  - `ContractCallInjected`: Runs when the SDK sends a transaction to a smart contract but before it is confirmed on the blockchain
  - `HandshakeReceived`: Runs when the handshake with a user's wallet application is received and provides the information necessary to connect the wallet to the dApp
  - `PairingCompleted`: Runs when the user's wallet is connected to the project but before the user has approved the connection in the wallet app
  - `PayloadSigned`: Runs when the user signs a payload and returns the signature information
