---
title: Taquito dApp SDK for TypeScript
authors: Claude Barde
lastUpdated: 10th July 2023
---

## Introduction

Interacting with the Tezos blockchain can be done using the Tezos CLI. However, it is not suitable for dapps since it needs to be integrated into web interfaces.

Fortunately, the Tezos ecosystem offers libraries in several languages that enable developers to build efficient Dapps. _Taquito_ is one of these: it is a Typescript library developed and maintained by _ECAD Labs_. This library offers developers all of the everyday interactions with the blockchain: retrieving information about a Tezos network, sending a transaction, contract origination and interactions such as calling an entrypoint and fetching the storage, delegation, fetching metadata, etc.

A lot of wallets in the Tezos ecosystem also use the _Taquito_ library to function.

A full reference is available [here](https://tezostaquito.io/docs/quick_start).

## Installation

The _Taquito_ library is made of several modules:

- [@taquito/taquito](https://www.npmjs.com/package/@taquito/taquito): High-level functionalities that build upon the other packages in the Tezos Typescript Library Suite.
- [@taquito/ledger-signer](https://www.npmjs.com/package/@taquito/ledger-signer): Provides ledger signing functionality.
- [@taquito/rpc](https://www.npmjs.com/package/@taquito/rpc): Provides low-level methods and types to interact with an RPC node.
- [@taquito/utils](https://www.npmjs.com/package/@taquito/utils): Provides utility methods to verify Tezos-specific data and convert data types.
- [@taquito/michelson-encoder](https://www.npmjs.com/package/@taquito/michelson-encoder): Provides a JavaScript abstraction based on a Tezos Smart contracts code, parameters and storage.
- [@taquito/michel-codec](https://www.npmjs.com/package/@taquito/michel-codec): Michelson parser/validator/formatter.
- [@taquito/local-forging](https://www.npmjs.com/package/@taquito/local-forging): Provides local forging functionality.
- [@taquito/signer](https://www.npmjs.com/package/@taquito/signer): Provides signing functionality.
- [@taquito/beacon-wallet](https://www.npmjs.com/package/@taquito/beacon-wallet): Provides a wrapper for the Beacon SDK.
- [@taquito/http-utils](https://www.npmjs.com/package/@taquito/http-utils): Provides http functionalities for Taquito.
- [@taquito/tzip12](https://www.npmjs.com/package/@taquito/tzip12): Provide TZIP-12 functionalities for Taquito.
- [@taquito/tzip16](https://www.npmjs.com/package/@taquito/tzip16): Provide TZIP-16 functionalities for Taquito.
- [@taquito/remote-signer](https://www.npmjs.com/package/@taquito/remote-signer): Remote signer provider.
- [@taquito/contracts-library](https://www.npmjs.com/package/@taquito/contracts-library): Allows to specify static data related to contracts (i.e., script and entrypoints) avoiding Taquito to fetch them from the network.

The main module is `@taquito/taquito`, it will be used for most actions. The other modules are used by the `@taquito/taquito` methods as complementary features, but can also be used separately.

You can install Taquito from NPM:

```shell
$ npm install @taquito/taquito
```

## Taquito configuration

### General setup

We first need to configure _Taquito_ with an RPC URL (to communicate with a Tezos node).

To do that we use the `TezosToolkit`: it is the "facade class that surfaces all of the libraries capability and allows its configuration". When instantiated, it requires an RPC URL.

Here, we will use the _Ghostnet_ RPC URL offered for free by ECAD Labs at [https://ghostnet.ecadinfra.com](https://ghostnet.ecadinfra.com).

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
```

### Wallet setup

First, download the `@taquito/beacon-wallet` package from NPM:

```
npm install @taquito/beacon-wallet
```

Next, import the `BeaconWallet` class and create a new instance by passing an object with the different options required by the Beacon SDK.
After creating the instance of the wallet, you can request permission from the user to connect their wallet before passing the wallet instance to the wallet provider in the TezosToolkit provided by Taquito:

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet, NetworkType } from '@taquito/beacon-wallet'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://tezostaquito.io/img/favicon.svg',
  preferredNetwork: 'ghostnet',
  eventHandlers: {
    PERMISSION_REQUEST_SUCCESS: {
      handler: async (data) => {
        console.log('permission data:', data)
      },
    },
  },
}
const wallet = new BeaconWallet(options)
await wallet.requestPermissions({
  network: { type: NetworkType.GHOSTNET },
})
Tezos.setWalletProvider(wallet)
```

## Getting data from the Tezos blockchain

Taquito provides methods to get different types of data from the Tezos blockchain, for example, the balance of an implicit account, the storage of a contract or token metadata.

> Note: querying data from the blockchain doesn't create a new transaction.

### Getting the balance of an account

Taquito allows developers to get the current balance in tez of an implicit account. The `getBalance` method is available on the instance of the TezosToolkit and requires a parameter of type `string` that represents the address of the account.

The returned value is of type `BigNumber`:

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import type { BigNumber } from 'bignumber.js'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
const wallet = new BeaconWallet(OPTIONS)
await wallet.requestPermissions({ network: { type: NetworkType.GHOSTNET } })
Tezos.setWalletProvider(wallet)
// gets the user's address
const userAddress = await wallet.getPKH()
// gets their balance
const balance: BigNumber = await Tezos.tz.getBalance(userAddress)
```

### Getting the storage of a contract

One of the distinctive features of the Tezos blockchain is having the storage of smart contracts publicly available.

Taquito provides an easy way to get the storage of any contract and exposes it as a JavaScript value:

```typescript
import { TezosToolkit } from '@taquito/taquito'
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// creates the contract abstraction required to get the storage
const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
// returns the storage of the contract
const storage = await contract.storage()
```

### Getting token metadata

Taquito also provides a library to get token metadata, which can be very useful when you build a dapp that handles NFTs.
Without Taquito, you would have to fetch the location of the metadata from the contract, understand where the metadata is stored, fetch it and parse it. Taquito does all of that for you:

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { Tzip12Module, tzip12 } from '@taquito/tzip12'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
Tezos.addExtension(new Tzip12Module())

const contract = await Tezos.contract.at(CONTRACT_ADDRESS, tzip12)
const tokenMetadata = await contract.tzip12().getTokenMetadata(TOKEN_ID)
```

## Interacting with the Tezos blockchain

Taquito lets you interact with the Tezos blockchain in multiple ways, for example, by sending tez, originating new contracts, interacting with existing contracts or reading events emitted by a contract. Most of these interactions start with an instance of the `TezosToolkit`.

### Sending tez

After creating an instance of the `TezosToolkit`, you can use the Contract API (for backend apps) or the Wallet API (for frontend apps) to access the `transfer` method and pass an object as a parameter with a `to` property for the recipient of the transfer and an `amount` property for the amount to be sent:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
const op = await Tezos.contract.transfer({ to: ADDRESS, amount: 1 })
await op.confirmation()
```

### Originating a contract

The origination of a new contract is also possible through the Contract API or the Wallet API with the `originate` method. It takes an object as a parameter with a `code` property for the Michelson code of the contract and a `storage` property for the initial storage of the contract:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
const initialStorage = {
    counter: 1,
    admin: "tz1Me1MGhK7taay748h4gPnX2cXvbgL6xsYL
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

One of the main features of your dapp is probably smart contract interactions.

After creating the contract abstraction for the contract you want to interact with, you can call one of the entrypoints available as a method on the `methods` property. The entrypoint method takes a parameter of the type expected by the contract and returns a contract call that can be executed by calling the `send` method:

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
const op = await contract.methods.mint(3).send()
await op.confirmation()
```

### Reading smart contract events

Contract events is a way for contracts to deliver event-like information to third-party (off-chain) applications. It can be emitted by using the `EMIT` instruction in Michelson.

Taquito provides a simple way for users to subscribe to certain events on the blockchain via the `PollingSubscribeProvider`.

```typescript
import { TezosToolkit, PollingSubscribeProvider } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

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

### One single TezosToolkit instance

You should make sure that you only have one instance of the `TezosToolkit` at all times in your app to avoid using the wrong one, which can have negative financial consequences for your users.
Even if your app requires a change in the network or Tezos node, it is better to create a new instance of the `TezosToolkit` and stop using the previous one to prevent unexpected behaviours.

### Contract API vs Wallet API

The Contract API is better suited for backend applications that don't require the manual signing of transactions, while the Wallet API is better suited for frontend applications that will interact with the users' wallets.
The use of one or the other should be consistent within the same app to prevent unexpected behaviours.

### `methods` vs `methodsObject`

The `methodsObject` property is better used in cases when the parameter for a contract call is a complex pair.
You can use `methods` to pass single parameters or simple pairs.

### Catching transaction errors

It is important to wrap contract calls and other transactions sent from the app inside a `try... catch` in order to handle transaction failures. Transactions fail more often than you think and you must handle it to provide visual feedback to your users and prevent unwanted behaviours like users clicking a button again even if the transaction already failed before.

:::note More information
You can find more information about Taquito on the official website: [Taquito](https://tezostaquito.io/docs/quick_start)
