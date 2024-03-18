---
title: The RPC interface
authors: "Tim McMackin"
last_update:
  date: 6 February 2023
---

The Tezos RPC (Remote Procedure Call) interface is a specification for a REST API that clients use to interact with Tezos nodes and nodes use to communicate with each other.
Clients use this interface to submit transactions and get information about the state of the blockchain, such as account balances and contract storage.
Tezos nodes act as servers and accept HTTP requests from clients and other nodes via this interface.

Tezos RPC uses JSON to send and receive data, but it does not adhere to the JSON-RPC specification.

Different parts of the software provide different RPC endpoints:

- For RPC endpoints for the shell, see [Shell RPCs - Reference](https://tezos.gitlab.io/shell/rpc.html#rpc-index-shell) in the Octez documentation.
- For RPC endpoints for the active version of the protocol, see https://tezos.gitlab.io/active/rpc.html.

## Public and private RPC nodes

All Tezos nodes run RPC servers, but the RPC interface is subject to an access policy.
By default, RPC servers are private and do not accept all requests from every client.

When you work with a Tezos client, such as the Octez command-line client or the Taquito SDK, you select a public RPC node to send transactions to, or you can use a private RPC node that you have access to.

If you're using a testnet, you can get a list of public RPC nodes for that network at https://teztnets.com.

Other sources of public nodes include:

- [Community RPC Nodes](https://tezostaquito.io/docs/rpc_nodes) listed by ECAD Labs.
- [SmartPy nodes](https://smartpy.io/nodes)
- [RPC nodes](https://tezostaquito.io/docs/rpc_nodes) in the Taquito documentation
