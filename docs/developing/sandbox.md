---
title: Using a local sandbox
authors: 'Mathias Hiron, Nomadic Labs, Tim McMackin, TriliTech'
last_update:
  date: 16 April 2024
---

Local sandboxes allow you to test your work without sending any transactions to Tezos Mainnet or testnets.
They run a simulated version of the Tezos protocol locally so you can test contracts, dApps, or other projects while interacting with actual nodes, but without using a public test network or creating your own private network.

Sandboxes can be convenient if you want to run all your tests locally but still need a realistic Tezos environment, such as if you need to interact with nodes and the consensus mechanism.
Testing locally can also keep your work confidential until you decide to put it into production.

However, sandboxes lack some features that [testnets](./testnets) have, such as indexers.
If you want an indexer or your testnet, you must run it yourself.

Here are some options for running local Tezos sandboxes:

## Octez sandboxed and mockup modes

The Octez client sandboxed and mockup modes run a local version of the Tezos network.

- [Sandboxed mode](https://tezos.gitlab.io/user/sandbox.html) runs a local network with one or more nodes.
- [Mockup mode](https://tezos.gitlab.io/user/mockup.html) runs a light version of the network without nodes.

## Flextesa

The [Flextesa](https://tezos.gitlab.io/flextesa/) is a simulated Tezos environment that runs in a container.

The Flextesa image has different scripts that start different versions of the Tezos protocol.
For example, to start a Flextesa sandbox with the Oxford protocol, run this command:

```bash
image=oxheadalpha/flextesa:latest
script=oxfordbox
docker run --rm --name "$script" --detach -p 20000:20000 \
       -e block_time=3 \
       "$image" "$script" start
```

Then you can see the accounts that are available by running this command:

```bash
docker exec $script $script info
```

The Flextesa image comes with the Octez client pre-configured, so you can use it directly from the image.
These commands create an alias for the installation of the Octez client in the image and uses it from the host system:

```bash
alias tcli='docker exec my-sandbox octez-client'
tcli get balance for alice
```

Now you can use the Octez client to deploy contracts and send transactions to the sandbox.

Flextesa allows you to control baking manually, so blocks are only backed when you trigger them.

For more information, see the [Flextesa documentation](https://tezos.gitlab.io/flextesa/).

## Tezbox

[Tezbox](https://github.com/tez-capital/tezbox) is also a simulated Tezos environment that runs in a container.

Tezbox provides different images that mirror versions of the Octez suite.
For example, to run Tezbox with Octez version 19.1 and the Oxford protocol, run this command:

```bash
docker run -d -p 0.0.0.0:8732:8732 --name oxfordbox ghcr.io/tez-capital/tezbox:tezos-v19.1
```

The container runs in the background and provides an RPC node at http://localhost:8732.

Then you can use the sandbox through that RPC node.
For example, you can configure the Octez client to use the sandbox by running this command:

```bash
octez-client -E http://localhost:8732 config update
```

Then you can use your local installation of the Octez client to interact with the sandbox, such as deploying contracts and sending transactions.

Tezbox provides sample accounts in the `/tezbox/context/accounts.json` file.
