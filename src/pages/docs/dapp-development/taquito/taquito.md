# Introduction

Interacting with the Tezos blockchain can be done using to the Tezos CLI. However, it is not suitable for Dapps since it needs to be integrated into web interfaces.

Fortunately, the Tezos ecosystem offers libraries in several languages that enable developers to build efficient Dapps. _Taquito_ is one of these: it is a Typescript library developed and maintained by _ECAD Labs_. This library offers developers all of the everyday interactions with the blockchain: retrieving information about a Tezos network, sending a transaction, contract origination and interactions such as calling an entrypoint and fetching the storage, delegation, fetching metadata, etc.

A lot of wallets in the Tezos ecosystem also use the _Taquito_ library to function.

A full reference is available [here](https://tezostaquito.io/docs/quick_start).

# Installation

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

# Taquito configuration

## General setup

We first need to configure _Taquito_ with an RPC URL (to communicate with a Tezos node).

To do that we use the `TezosToolkit`: it is the "facade class that surfaces all of the libraries capability and allow its configuration". When instantiated, it requires an RPC URL.

Here, we will use the _Ghostnet_ RPC URL offered for free by ECAD Labs at [https://ghostnet.ecadinfra.com](https://ghostnet.ecadinfra.com).

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
```

## Wallet setup

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

# Getting data from the Tezos blockchain

## Getting the balance of an account

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

## Getting the storage of a contract

```typescript
import { TezosToolkit } from '@taquito/taquito'
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
const storage = await contract.storage()
```

## Getting token metadata

```typescript
import { TezosToolkit } from '@taquito/taquito'
import { Tzip12Module, tzip12 } from '@taquito/tzip12'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
Tezos.addExtension(new Tzip12Module())

const contract = await Tezos.contract.at(CONTRACT_ADDRESS, tzip12)
const tokenMetadata = await contract.tzip12().getTokenMetadata(TOKEN_ID)
```

# Interacting with the Tezos blockchain

## Sending tez

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
const op = await Tezos.contract.transfer({ to: ADDRESS, amount: 1 })
await op.confirmation()
```

## Originating a contract

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

## Sending a contract call

```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)
const op = await contract.methods.mint(3).send()
await op.confirmation()
```

## Reading smart contract events

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

# Best practices
