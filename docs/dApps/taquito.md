---
title: Taquito dApp SDK for TypeScript
authors: Claude Barde, Tim McMackin
last_update:
  date: 14 November 2024
---

[Taquito](https://tezostaquito.io) is a TypeScript library that dApp developers can use to get information about Tezos and submit transactions.
Many wallets in the Tezos ecosystem use the Taquito library.

A full reference is available in the [Taquito documentation](https://tezostaquito.io/docs/quick_start).

## Installation

The Taquito library is made of several NPM modules:

- [@taquito/taquito](https://www.npmjs.com/package/@taquito/taquito): High-level functionality that builds on the other packages in the Tezos Typescript Library Suite.
- [@taquito/ledger-signer](https://www.npmjs.com/package/@taquito/ledger-signer): Provides ledger signing functionality.
- [@taquito/rpc](https://www.npmjs.com/package/@taquito/rpc): Provides low-level methods and types to interact with an RPC node.
- [@taquito/utils](https://www.npmjs.com/package/@taquito/utils): Provides utility methods to verify Tezos-specific data and convert data types.
- [@taquito/michelson-encoder](https://www.npmjs.com/package/@taquito/michelson-encoder): Provides a JavaScript abstraction based on a Tezos smart contracts code, parameters and storage.
- [@taquito/michel-codec](https://www.npmjs.com/package/@taquito/michel-codec): Provides a Michelson parser/validator/formatter.
- [@taquito/local-forging](https://www.npmjs.com/package/@taquito/local-forging): Provides local forging functionality.
- [@taquito/signer](https://www.npmjs.com/package/@taquito/signer): Provides signing functionality.
- [@taquito/beacon-wallet](https://www.npmjs.com/package/@taquito/beacon-wallet): Provides a wrapper for the Beacon SDK.
- [@taquito/http-utils](https://www.npmjs.com/package/@taquito/http-utils): Provides HTTP functionality for Taquito.
- [@taquito/tzip12](https://www.npmjs.com/package/@taquito/tzip12): Provides TZIP-12 functionality for Taquito.
- [@taquito/tzip16](https://www.npmjs.com/package/@taquito/tzip16): Provides TZIP-16 functionality for Taquito.
- [@taquito/remote-signer](https://www.npmjs.com/package/@taquito/remote-signer): Remote signer provider.
- [@taquito/contracts-library](https://www.npmjs.com/package/@taquito/contracts-library): Allows you to store static data related to contracts (such as scripts and entrypoints) to prevent Taquito from needing to fetch them from the network.

The main module is `@taquito/taquito`; it is used for most actions.
The other modules are used by the `@taquito/taquito` methods as complementary features, but they can also be used separately.

You can install Taquito from NPM:

```shell
npm install @taquito/taquito
```

## Tutorials

For tutorials that include using Taquito, see:

- [Build a simple web application](tutorials/build-your-first-app)
- [Create a contract and web app that mints NFTs](/tutorials/create-an-nft/nft-taquito)
- [Mint NFTs from a web app](/tutorials/create-an-nft/nft-web-app)

## Taquito configuration

### General setup

Like all Tezos clients, Taquito must be connected to an RPC node.
To connect Taquito to a node, create an instance of the `TezosToolkit` class, which is the façade class that surfaces the library's features, and pass the URL of the node.
For example, this code uses the public Ghostnet node at `https://rpc.ghostnet.teztnets.com`:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
```

### Connecting to wallets

Taquito can connect to Tezos wallets through the Beacon protocol.
Follow these steps to connect to wallets in an application:

1. Install Taquito and the `@taquito/beacon-wallet` and `@airgap/beacon-types` packages from NPM:

   ```
   npm install @taquito/taquito @taquito/beacon-wallet @airgap/beacon-types
   ```

1. Import the `BeaconWallet` class and create a new instance by passing an object with the different options required by the Beacon SDK.
After creating the instance of the wallet, you can request permission from the user to connect their wallet before passing the wallet instance to the wallet provider in the TezosToolkit provided by Taquito:

```typescript
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-types";
import { TezosToolkit } from "@taquito/taquito";

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://tezostaquito.io/img/favicon.svg',
  network: {
    type: NetworkType.GHOSTNET,
  },
}
const wallet = new BeaconWallet(options)
await wallet.requestPermissions()
Tezos.setWalletProvider(wallet)
```

## Getting data from the Tezos blockchain

Taquito provides methods to get different types of data from the Tezos blockchain, for example, the balance of a user account, the storage of a contract, or token metadata.

> Note: querying data from the blockchain doesn't create a new transaction.

### Getting the balance of an account

Taquito allows developers to get the current balance in mutez of a user account. The `getBalance` method is available on the instance of the TezosToolkit and requires a parameter of type `string` that represents the address of the account.

The returned value is of type `BigNumber`:

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import type { BigNumber } from 'bignumber.js'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
const wallet = new BeaconWallet(OPTIONS)
await wallet.requestPermissions()
Tezos.setWalletProvider(wallet)
// gets the user's address
const userAddress = await wallet.getPKH()
// gets their balance
const balance: BigNumber = await Tezos.tz.getBalance(userAddress)
```

### Getting the storage of a contract

Taquito provides an easy way to get the storage of any contract and exposes it as a JavaScript object:

```typescript
import { TezosToolkit } from '@taquito/taquito'
const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
// creates the contract abstraction required to get the storage
const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
// returns the storage of the contract
const storage = await contract.storage()
```

### Getting token metadata

Taquito also provides a library to get token metadata, which can be very useful when you build a dApp that handles NFTs.
Without Taquito, you would have to fetch the location of the metadata from the contract, understand where the metadata is stored, fetch it, and parse it. Taquito does all of that for you, as in this example:

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { Tzip12Module, tzip12 } from '@taquito/tzip12'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
Tezos.addExtension(new Tzip12Module())

const contract = await Tezos.contract.at(CONTRACT_ADDRESS, tzip12)
const tokenMetadata = await contract.tzip12().getTokenMetadata(TOKEN_ID)
```

## Interacting with the Tezos blockchain

Taquito lets you interact with the Tezos blockchain in multiple ways, for example, by sending tez, originating new contracts, interacting with existing contracts or reading events emitted by a contract. Most of these interactions start with an instance of the `TezosToolkit` object.

### Sending tez

After creating an instance of the `TezosToolkit` object, you can use the Contract API (for backend apps) or the Wallet API (for frontend apps) to access the `transfer` method and pass an object as a parameter with a `to` property for the recipient of the transfer and an `amount` property for the amount to be sent:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
const op = await Tezos.contract.transfer({ to: ADDRESS, amount: 1 })
await op.confirmation()
```

### Originating a contract

The origination of a new contract is also possible through the Contract API or the Wallet API with the `originate` method. It takes an object as a parameter with a `code` property for the Michelson code of the contract and a `storage` property for the initial storage of the contract:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')
const initialStorage = {
    counter: 1,
    admin: "tz1Me1MGhK7taay748h4gPnX2cXvbgL6xsYL"
}
const op = await Tezos
    .contract
    .originate({
        code: CONTRACT_CODE,
        storage: initialStorage
    })
await op.confirmation()
const { contractAddress } = op
```

### Sending a contract call

One of the main features of your dApp is probably smart contract interactions.

After creating the contract abstraction for the contract you want to interact with, you can call one of the entrypoints available as a method on the `methods` property. The entrypoint method takes a parameter of the type expected by the contract and returns a contract call that can be executed by calling the `send` method:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')

const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
const op = await contract.methods.mint(3).send()
await op.confirmation()
```

### Reading smart contract events

[Events](/smart-contracts/events) are a way for contracts to deliver event-like information to third-party (off-chain) applications.

Taquito provides a simple way for users to subscribe to certain events on the blockchain via the `PollingSubscribeProvider` object.

```typescript
import { TezosToolkit, PollingSubscribeProvider } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com')

Tezos.setStreamProvider(
  Tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true,
    pollingIntervalMilliseconds: 1500,
  })
)

try {
  const sub = Tezos.stream.subscribeEvent({
    tag: 'tagName',
    address: 'CONTRACT_ADDRESS',
  })

  sub.on('data', console.log)
} catch (e) {
  console.log(e)
}
```

## Best practices

### One single `TezosToolkit` instance

You should make sure that you only have one instance of the `TezosToolkit` object at all times in your app to avoid using the wrong one, which can have negative financial consequences for your users.
Even if your app requires a change in the network or Tezos node, it is better to create a new instance of the `TezosToolkit` and stop using the previous one to prevent unexpected behaviors.

### Contract API vs Wallet API

The Contract API is better suited for backend applications that don't require the manual signing of transactions, while the Wallet API is better suited for frontend applications that will interact with the users' wallets.
The use of one or the other should be consistent within the same app to prevent unexpected behaviors.

### `methods` vs `methodsObject`

The `methodsObject` property is better used in cases when the parameter for a contract call is a complex pair.
You can use `methods` to pass single parameters or simple pairs.

### Catching transaction errors

It is important to wrap contract calls and other transactions sent from the app inside a `try... catch` block to handle transaction failures. You must handle failures to provide visual feedback to your users and prevent unwanted behaviors like users clicking a button again because the UI did not inform them that the previous attempt failed.

:::note More information

For more information, see the [Taquito documentation](https://tezostaquito.io/docs/quick_start).

:::
