---
id: networks
title: What about networks?
authors: Maxime Sallerin and Thomas Zoughebi
---

In this chapter, we will see how Tezos is multi-network. We will learn what the "*main network*" and the "*test networks*" are and finally, we will discover how to configure our node on a chosen network.

## Mainnet

The Tezos network is the current incarnation of the Tezos blockchain. The Tezos network has been live and open since June 30th 2018, when the genesis block was created, and the tez were allocated to the donors of the July 2017 ICO.

## Multinetwork Node

Tezos is run on several networks, such as the **Mainnet** (the *main* network) and various **testnets** (test networks). Some users may also want to run their own networks for various reasons. Networks differ in multiple ways:

- they start **from their own genesis block**
- they have **different names** so that nodes know not to talk to other networks
- they may run (or have run) **different protocols**
- protocols may run with **different constants** (for instance, test networks move faster)
- they have **different bootstrap peers** (nodes that the new nodes connect to initially)
- they may have had user-activated upgrades or user-activated protocol **overrides** to change the protocol *without going through the voting process*.

By default, the multinetwork node connects to **Mainnet**. To connect to other networks, you can either use one of the **Built-In Networks** or configure the node to connect to [Custom Networks](https://tezos.gitlab.io/user/multinetwork.html#custom-networks).

## Built-In Networks

### Test Networks

Mainnet is the main Tezos network, and as such, it *is not appropriate for testing*. Other networks are available for this. Test networks usually run with different constants *to speed up the chain*.

To fund any addresses, go to [teztnets.xyz](https://teztnets.xyz/) and select the faucet according to your testnet.

The last two built-in networks to be used as a test network are:

- [Lima](https://teztnets.xyz/limanet-about)
- [Ghostnet](https://teztnets.xyz/ghostnet-about)

Check our [Test networks](../../tezos-basics/test_networks/test_networks.md) section to learn more about it.

### Network configuration

The simplest way to select the network to connect to is to use the `--network` option when you initialize your node configuration. For instance, to run on Limanet:

```shell
./octez-node config init --data-dir /tezos-limanet --network limanet
./octez-node identity generate --data-dir /tezos-limanet
./octez-node run --data-dir /tezos-limanet
```

> Once initialized, the node remembers its network settings on subsequent runs and reconnects to the same network every time you run it. If you specify a different network when running the node again, it will refuse to start. In order to switch to a different network, you need to either reinitialize it with a different data directory using the --data-dir option or remove everything from the existing data directory, which defaults to ~/.octez-node (and also initialize again).

The `--network option` is **not** case-sensitive and can be used with the following built-in networks:

- mainnet (this is the default)
- limanet
- kathmandunet
- ghostnet
- sandbox

If you did not initialize your node configuration or if your configuration file doesn't contain a "network" field, the node assumes you want to run **Mainnet**. You can use the `--network` option with `octez-node run` to make sure your node runs on the expected network. For instance, to make sure that it runs on **Limanet**:

```shell
./octez-node run --data-dir ~/tezos-limanet --network limanet
```

This command will fail with an error if the configured network is **not** *Limanet*. The node also displays the chain name (such as `TEZOS_MAINNET`) when it starts.

## References

- [1] https://tezos.gitlab.io/user/multinetwork.html#multinetwork
- [2] https://tezos.gitlab.io/introduction/test_networks.html
