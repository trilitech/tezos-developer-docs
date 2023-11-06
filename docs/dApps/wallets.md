---
title: Connecting to wallets
authors: "Claude Barde, Tim McMackin"
last_update:
  date: 23 October 2023
---

dApps must connect to user wallets to view the tokens in the account and to submit transactions on behalf of the wallet's owner.

## Beacon

Beacon is an SDK that allows dApps to connect to wallets and sign transactions.
It implements the [tzip-10 proposal](https://gitlab.com/tezos/tzip/-/tree/master/proposals/tzip-10), which describes an interaction standard between wallets and dApps.
By using this standard, a dApp that uses Beacon can send messages over a peer-to-peer communication layer to a wallet, such as allowing a user to connect with an app on one platform, such as a mobile app, and then use the dApp on another platform, such as a desktop browser.

Beacon can remember the connections that have been established and the accounts that have connected to the app.
It also includes default UI elements for pairing wallets and showing the status of a transaction.

:::note
While you can use Beacon on its own, most of the time applications use Beacon with Taquito.
See [Taquito and Beacon](#taquito-and-beacon) for details for using Beacon with Taquito.
:::

### Connecting to wallets

To connect to a wallet with Beacon, import the Beacon package and create an instance of the `DAppClient` object.
Then, use this object to send a permission request to prompt the user to connect a wallet:

```javascript
import { DAppClient } from '@airgap/beacon-sdk'

const dAppClient = new DAppClient({ name: 'My dApp' })

try {
  console.log('Requesting permissions...')
  const permissions = await dAppClient.requestPermissions()
  console.log('Got permissions for the wallet with this address:', permissions.address)
} catch (error) {
  console.log('Got error:', error)
}
```

When this code runs, Beacon opens a popup window that guides the user through connecting their wallet.

:::note
The `DAppClient` instance should be a singleton. Creating multiple instances or copies can lead to unexpected behavior.
:::

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

For more information about Beacon, see <https://walletbeacon.io/>.

## Taquito and Beacon

Using Taquito and Beacon together is a straightforward way to connect to wallets and submit transactions.
For an example, see the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app).

### Connecting to wallets

That tutorial connects to the wallet using the Taquito `BeaconWallet` object, which is a wrapper around Beacon, with code like this example:

```javascript
import { BeaconWallet } from "@taquito/beacon-wallet";

const wallet = new BeaconWallet({
  name: "My dApp",
  preferredNetwork: network,
});
await wallet.requestPermissions({
  network: { type: network, rpcUrl },
});
const address = await wallet.getPKH();
```

When this code runs, Beacon opens a popup window that guides the user through connecting their wallet.

Then the application can send transactions to Tezos as described in [Sending transactions](./sending-transactions).

### Reconnecting to wallets

As with using Beacon on its own, you can detect whether a user has previously connected their wallet and reconnect automatically.
For example, this code checks to see if the user has connected and if so, it automatically reconnects to the wallet:

```javascript
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

For more information about Taquito, see [Taquito](./taquito).

## Best practices

### Keep tools up to date

It's important to keep the SDKs that you use to connect to wallets up to date for the best user experience and performance.

### Reuse connected accounts

For the best user experience, use the reconnection feature of Beacon described above to persist user accounts.
The UI can reflect that the user is connected and display the account address.
In this case, you can replace the "Connect" and "Sync" buttons with "Disconnect" and "Unsync" button.

### Connect to multiple RPCs

If a high number of users are using your dapp at the same time, the load on the RPC can spike. Ideally, the server infrastructure should be using a load balancer and caching to handle the load. If no such infrastructure is available, it is a good idea to provide an array of nodes and randomly select one on pageload. In case one of the nodes goes down, a user can connect to a different one by refreshing.

An even better approach is to add a node selection to your dapp, including a way for users to provide their own RPC.
See the documentation for your platform for information on changing the RPC.

### Allow users to connect their wallet early

If your dApp is focused around a specific time, such as an NFT drop or a countdown, you can provide a way for users to connect their wallet tot he dApp prior to that time.
Connecting early reduces the load on the Beacon peer-to-peer communication layer so users don't experience delays by connecting at the same time when the time arrives.
