---
id: wallets-and-beacon-sdk
title: Wallets and Beacon SDK
slug: /wallets-and-beacon-sdk
authors: Claude Barde
lastUpdated: 10th July 2023
---

## Overview of wallets

Wallets are an essential component of using blockchain services. They allow users to see their balances, find the NFTs they own, and interact with the Tezos blockchain and its smart contracts.

### Desktop wallets

- [Temple](https://templewallet.com/) (browser extension)
- [Kukai](https://wallet.kukai.app/) (website)
- [Umami](https://umamiwallet.com/) (app)

### Mobile wallets

- [Naan](https://www.naan.app/)
- [Temple](https://templewallet.com/)
- [Kukai](https://wallet.kukai.app/)
- [Umami](https://umamiwallet.com/)

## Introduction to the Beacon SDK

Beacon is the implementation of the [tzip-10 proposal](https://gitlab.com/tezos/tzip/-/tree/master/proposals/tzip-10), which describes an interaction standard between a wallet and a dapp.

A dapp implementing the Beacon SDK can build up a channel and send messages over a peer-to-peer communication layer to a wallet. This allows for communication for example of a mobile wallet with a desktop application. The requests of the dapp are sent to the wallet, signed, and returned to the application. The Beacon SDK can also communicate to Chrome extensions if compatible ones are installed.

The Beacon SDK handles almost everything for you but is still customizable if needed. It detects whether or not a browser extension is installed, and tracks what connections have been established and the accounts that have been shared with the dapp.

The Beacon SDK also includes default UI elements for pairing wallets and showing the status of a request.

> The Beacon SDK is generally used with Taquito. If you plan to interact with smart contracts, you can check the section about Taquito to see how to use Beacon with Taquito.

## Setting up the Beacon SDK

The Beacon SDK can be installed with NPM:
`npm install --save @airgap/beacon-sdk`

You can then import the Beacon SDK package and create a `DAppClient` instance. This instance will be used throughout your dapp to interact with the user's wallet. Once created, you can send a permission request to prompt the user to connect to his wallet.

```javascript
import { DAppClient } from '@airgap/beacon-sdk'

const dAppClient = new DAppClient({ name: 'Beacon Docs' })

try {
  console.log('Requesting permissions...')
  const permissions = await dAppClient.requestPermissions()
  console.log('Got permissions:', permissions.address)
} catch (error) {
  console.log('Got error:', error)
}
```

> The `DAppClient` instance should be a singleton. Avoid creating multiple instances or copies of it, which could lead to unexpected behaviour.

Now let's check if the SDK is already connected to the dapp. This code should be run after the page is loaded to get the user's address and show it in your UI. If the following code returns an address, there is no need to send another permission request, unless you want to pair a different account.

```javascript
import { DAppClient } from '@airgap/beacon-sdk'

const dAppClient = new DAppClient({ name: 'Beacon Docs' })

// The following code should always be run during pageload if you want to show if the user is connected.
const activeAccount = await dAppClient.getActiveAccount()
if (activeAccount) {
  // User already has account connected, everything is ready
  // You can now do an operation request, sign request, or send another permission request to switch wallet
  console.log('Already connected:', activeAccount.address)
  return activeAccount
} else {
  // The user is not connected. A button should be displayed where the user can connect to his wallet.
  console.log('Not connected!')
}
```

You should also give your users the option to disconnect their wallet, for example, to connect a different one:

```javascript
import { DAppClient } from "@airgap/beacon-sdk";

const dAppClient = new DAppClient({ name: "My dope dapp" });

[...]

await dAppClient.clearActiveAccount();
```

## Interacting with Tezos

### Sending tez

Let's send a simple transaction to the wallet that sends 1 tez to ourselves:

```javascript
const response = await dAppClient.requestOperation({
  operationDetails: [
    {
      kind: TezosOperationType.TRANSACTION,
      destination: myAddress, // Send to ourselves
      amount: '1000000', // Amount in tez
    },
  ],
})
```

### Making a contract call

Let's call an entrypoint called `mint` with a value of `3` and an amount of 0 tez:

```javascript
import { TezosOperationType } from '@airgap/beacon-sdk'

const result = await dAppClient.requestOperation({
  operationDetails: [
    {
      kind: TezosOperationType.TRANSACTION,
      amount: '0',
      destination: CONTRACT_ADDRESS,
      parameters: {
        entrypoint: 'mint',
        value: {
          int: 3,
        },
      },
    },
  ],
})
```

## Best practices

### Make sure the Beacon SDK is up to date

The Beacon SDK receives frequent updates with small bug fixes and performance improvements. We keep breaking changes to a minimum, so updating is usually as easy as increasing the version number.

### Reusing connected accounts

This one is a basic concept of Beacon, but still very important.

Every time a user connects their wallet and shares permission to use an account, that account is persisted on the dapp side. At this point, the UI should reflect that the user is connected and display the address that was shared. The "Connect" or "Sync" button should be replaced by a "Disconnect" or "Unsync" button. Even when the user refreshes, the account is still present and can be retrieved by calling `dAppClient.getActiveAccount()`.

### Connect to multiple RPCs

If a high number of users are using your dapp at the same time, the load on the RPC can spike. Ideally, the server infrastructure should be using a load balancer and caching to handle the load. If no such infrastructure is available, it is a good idea to provide an array of nodes and randomly select one on pageload. In case one of the nodes goes down, a user can connect to a different one by refreshing.

An even better approach is to add a node selection to your dapp, including a way for users to provide their own RPC.

### Allow users to connect their wallet early on

In case your dapp is focussed around a specific time (eg. NFT drop or a countdown of some sort), you should already provide a way for users to pair their wallet with the dapp. This will reduce the load on the Beacon Network once the countdown hits 0.

---

{% callout title="More information"%}
You can find more details about Beacon by visiting [https://docs.walletbeacon.io/](https://docs.walletbeacon.io/)
{% /callout%}
