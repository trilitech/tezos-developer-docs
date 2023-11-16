---
title: Connecting to wallets
authors: "Claude Barde, Tim McMackin"
last_update:
  date: 6 November 2023
---

dApps must connect to user wallets to view the tokens in the account and to submit transactions on behalf of the wallet's owner.

The primary tools that dApps use to connect to wallets are:

- Beacon: A JavaScript/TypeScript SDK for connecting to wallets, signing transactions, and sending information about this connection between connected apps

  Beacon supports many Tezos wallets seamlessly, including TZIP-10 and WalletConnect2.0 wallets, so you don't have to write different code for each wallet that you want to support.
  Beacon also implements the [TZIP-10 proposal](https://gitlab.com/tezos/tzip/-/tree/master/proposals/tzip-10), which describes an interaction standard between wallets and dApps.
  By using this standard, a dApp that uses Beacon can send messages over a peer-to-peer communication layer to a wallet, such as allowing a user to connect with an app on one platform, such as by scanning a QR code on a mobile app, and then use the dApp with the connected wallet on another platform, such as a desktop browser.

  Beacon can remember the connections that have been established and the accounts that have connected to the app.
  It also includes default UI elements for connecting wallets and showing the status of a transaction.

  For more information about Beacon, see https://www.walletbeacon.io.

- Taquito: A JavaScript/TypeScript SDK for sending transactions

  Taquito provides a wrapper for Beacon so dApps can interact with wallets and with Tezos with the same code.

  For more information about Taquito, see [Taquito](./taquito).

## Beacon and Taquito

Most of the time, dApps use Beacon and Taquito together for a straightforward way to connect to wallets and submit transactions.
For an example, see the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app).

### Connecting to wallets

That tutorial connects to the wallet using the Taquito `BeaconWallet` object, which is a wrapper around Beacon's wallet functionality, with code like this example:

```javascript
import { BeaconWallet } from "@taquito/beacon-wallet";

const wallet = new BeaconWallet({
  name: "My dApp",
  preferredNetwork: network
});
await wallet.requestPermissions();
const address = await wallet.getPKH();
```

When this code runs, Beacon opens a popup window that guides the user through connecting their wallet.

Then the application can send transactions to Tezos.
See [Part 3: Sending transactions](../tutorials/build-your-first-app/sending-transactions) in the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app).

### Reconnecting to wallets

As with using Beacon on its own, you can detect whether a user has previously connected their wallet and reconnect automatically.
For example, this code checks to see if the user has connected and if so, it automatically reconnects to the wallet:

```javascript
import { BeaconWallet } from "@taquito/beacon-wallet";

const newWallet = new BeaconWallet({
  name: "My dApp",
  preferredNetwork: network
});
const activeAccount = await newWallet.client.getActiveAccount();
if (activeAccount) {
  wallet = newWallet;
  console.log("Reconnected to wallet:", await newWallet.getPKH());
}
```

### Disconnecting wallets

It's good programming practice to allow a user to disconnect their wallet, such as if they want to connect with a different wallet.

To disconnect the active wallet, call the `clearActiveAccount` method, as in this example:

```javascript
wallet.client.clearActiveAccount();
wallet = undefined;
```

## Beacon by itself

You can also use Beacon without Taquito.

### Connecting to wallets

To connect to a wallet with Beacon, import the Beacon package and use the `getDAppClientInstance` function to get an instance of the Beacon `DAppClient` object.
Using this function ensures that you have only one instance of the Beacon client because it returns an instance if one already exists or creates one if it does not.
Creating multiple instances or copies of the Beacon `DAppClient` object can lead to unexpected behavior.

Then, use this object to send a permission request to prompt the user to connect a wallet:

```javascript
import { getDAppClientInstance } from '@airgap/beacon-sdk'

const dAppClient = getDAppClientInstance({ name: 'My dApp' })

try {
  console.log('Requesting permissions...')
  const permissions = await dAppClient.requestPermissions()
  console.log('Got permissions for the wallet with this address:', permissions.address)
} catch (error) {
  console.log('Got error:', error)
}
```

When this code runs, Beacon opens a popup window that guides the user through connecting their wallet.

### Reconnecting to wallets

Beacon can detect users that return to the dApp after connecting previously.
The `getActiveAccount` method returns an address if the user has previously connected a wallet.
You can run this code when the page loads and if it finds a connection, you can skip calling the `requestPermissions` method unless the user wants to connect a different account:

```javascript
import { DAppClient } from '@airgap/beacon-sdk'

const dAppClient = new DAppClient({ name: 'My dApp' })

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

### Disconnecting wallets

It's good programming practice to allow a user to disconnect their wallet, such as if they want to connect with a different wallet.

To disconnect the active wallet, call the `clearActiveAccount` method, as in this example:

```javascript
import { DAppClient } from "@airgap/beacon-sdk";

const dAppClient = new DAppClient({ name: "My dApp" });

[...]

await dAppClient.clearActiveAccount();
```

## Other tools

Some specific wallets provide toolkits to connect dApps to them.
For example, the Temple wallet provides the [@temple-wallet/dapp](https://www.npmjs.com/package/@temple-wallet/dapp) NPM package.
For more information, see https://github.com/madfish-solutions/templewallet-dapp.

## Best practices

### Keep tools up to date

It's important to keep the SDKs that you use to connect to wallets up to date for the best user experience and performance.

### Reuse connected accounts

For the best user experience, use the reconnection feature of Beacon described above to persist user accounts.
The UI can reflect that the user is connected and display the account address.
In this case, you can replace the "Connect" and "Sync" buttons with "Disconnect" and "Unsync" button.

### Connect to multiple RPC nodes

If a high number of users are using your dApp at the same time, the load on the RPC can spike.
Ideally, the server infrastructure should be using a load balancer and caching to handle the load.
If no such infrastructure is available, it is a good idea to provide an array of nodes and randomly select one when the page loads.
In case one of the nodes goes down, a user can connect to a different one by refreshing.

An even better approach is to add a node selection to your dApp, including a way for users to provide their own RPC node.
See the documentation for your platform for information on changing the RPC node.

### Allow users to connect their wallet early

If your dApp is focused around a specific time, such as an NFT drop or a countdown, you can provide a way for users to connect their wallet to the dApp prior to that time.
Connecting early reduces the load on the Beacon peer-to-peer communication layer so users don't experience delays by connecting at the same time when the time arrives.
