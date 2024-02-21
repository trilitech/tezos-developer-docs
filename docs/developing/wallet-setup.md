---
title: Installing and funding a wallet
authors: Tim McMackin
last_update:
  date: 13 February 2024
---

To work with Tezos, you need a wallet, which is an application that maintains your accounts and signs Tezos transactions on your behalf.
Wallets allow you to interact with dApps without exposing your account's private key.

## Choosing a wallet

Which wallet you install is up to you and whether you want to install a wallet on your computer, in a browser extension, or as a mobile app.

Mobile apps include [Temple](https://templewallet.com/), [Kukai](https://wallet.kukai.app/), and [Umami](https://umamiwallet.com/).

Browser extensions include the [Temple](https://templewallet.com/) browser extension.

Desktop wallets for Tezos include [Kukai](https://wallet.kukai.app/) and [Umami](https://umamiwallet.com/).

Tezos also supports the [MetaMask wallet](https://metamask.io/), but only its browser extension, and only on Mainnet.
Follow these steps to enable Tezos in MetaMask:

1. Install the MetaMask browser extension.
1. Go to https://metamask.tezos.com.
1. Click **Connect with MetaMask**.
1. Approve the installation of the Tezos snap in MetaMask.

Now you can connect to Tezos dApps with MetaMask.
When a web application shows the Beacon window to connect your wallet, you can select MetaMask.
The page sends you to https://metamask.tezos.com to approve and manage the connection.

For more information about using MetaMask with Tezos, see [MetaMask Now Supports Tezos: An Explainer](https://spotlight.tezos.com/metamask-now-supports-tezos-an-explainer/).

## Switching the wallet to a testnet

If you're doing development work, you're probably using a testnet instead of Mainnet.
On testnets, tokens are free so you don't have to spend real currency to work with your applications.

The process for changing the network is different for each wallet type.
These steps are for the Temple wallet:

1. Go to https://teztnets.com/, which lists Tezos testnets.
1. Click **Ghostnet**.
1. Copy one of the public RPC endpoints for Ghostnet, such as `https://rpc.ghostnet.teztnets.com`.
These URLs accept Tezos transactions from wallets and other applications.
1. In the Temple app, open the settings and then click **Default node (RPC)**.
1. Click the plus `+` symbol to add an RPC node.
1. On the Add RPC screen, enter the URL that you copied and give the connection a name, such as "Ghostnet," as shown in this picture:

    <img src="/img/dApps/temple-wallet-new-rpc.png" alt="Entering information for the new RPC node" style={{width: 300}} />
1. Click Add.
1. Make sure that the new RPC node is selected, as in this image:

    <img src="/img/dApps/temple-wallet-selected-rpc.png" alt="The new RPC node selected in the Temple wallet" style={{width: 300}} />

## Funding a wallet

Follow these steps to get testnet tez for the wallet:

1. From your wallet, get the address of your account, which starts with `tz1`.
This is the address that applications use to work with your wallet.

1. Go to the Ghostnet faucet at https://faucet.ghostnet.teztnets.com.

1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of tez to add to your wallet.
20 tez is enough to work with, and you can return to the faucet later if you need more tez.

It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on Mainnet.

![Fund your wallet using the Ghostnet Faucet](/img/tutorials/wallet-funding.png)
