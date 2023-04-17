---
id: taquito
disable_pagination: true
title: Taquito
authors: Benjamin Pilia
---

Interacting with the Tezos blockchain can be done using to the Tezos CLI. However, it is not suitable for Dapps since it needs to be integrated into web interfaces.

Fortunately, the Tezos ecosystem offers libraries in several languages that enable developers to build efficient Dapps. _Taquito_ is one of these: it is a Typescript library developed and maintained by _ECAD Labs_. This library offers developers all of the everyday interactions with the blockchain: retrieving information about a Tezos network, sending a transaction, contract origination and interactions such as calling an entrypoint and fetching the storage, delegation, fetching metadata, etc.

All these wallets: ([AirGap](https://airgap.it/), [Galleon](https://cryptonomic.tech/galleon.html), [Kukai](https://wallet.kukai.app/), [Spire](https://spirewallet.com/), [Temple](https://templewallet.com/download/) ) use the _Taquito_ librairy to function.

A full reference is available [here](https://tezostaquito.io/docs/quick_start).

In this chapter we will use _Taquito_ to interact with the deployed _Raffle_ smart contract.

## Installation

The _Taquito_ library is made of several modules:
- [@taquito/taquito](https://www.npmjs.com/package/@taquito/taquito): High-level functionalities that build upon the other packages in the Tezos Typescript Library Suite.
- [@taquito/ledger-signer](https://www.npmjs.com/package/@taquito/ledger-signer): Provides ledger signing functionality.
- [@taquito/rpc](https://www.npmjs.com/package/@taquito/rpc): Provides low-level methods and types to invoke RPC calls from a Nomadic Tezos RPC node.
- [@taquito/utils](https://www.npmjs.com/package/@taquito/utils): Converts Michelson data and types into convenient JS/TS objects.
- [@taquito/michelson-encoder](https://www.npmjs.com/package/@taquito/michelson-encoder): Provides a JavaScript abstraction based on a Tezos Smart contracts code, parameters and storage.
- [@taquito/michel-codec](https://www.npmjs.com/package/@taquito/michel-codec): Michelson parser/validator/formatter.
- [@taquito/local-forging](https://www.npmjs.com/package/@taquito/local-forging): Provide local forging functionality.
- [@taquito/signer](https://www.npmjs.com/package/@taquito/signer): Provide signing functionality.
- [@taquito/beacon-wallet](https://www.npmjs.com/package/@taquito/beacon-wallet): Provide Beacon wallet.
- [@taquito/http-utils](https://www.npmjs.com/package/@taquito/http-utils): Provide http functionalities for Taquito.
- [@taquito/tzip12](https://www.npmjs.com/package/@taquito/tzip12): Provide TZIP-012 functionalities for Taquito.
- [@taquito/tzip16](https://www.npmjs.com/package/@taquito/tzip16): Provide TZIP-016 functionalities for Taquito.
- [@taquito/tezbridge-signer](https://www.npmjs.com/package/@taquito/tezbridge-signer): Tezbridge signer provider.
- [@taquito/remote-signer](https://www.npmjs.com/package/@taquito/remote-signer): Remote signer provider.
- [@taquito/tezbridge-wallet](https://www.npmjs.com/package/@taquito/tezbridge-wallet): Tezbridge wallet provider.
- [@taquito/contracts-library](https://www.npmjs.com/package/@taquito/contracts-library): Can be used as an extension on the TezosToolkit to provide contracts data.


The main module is `@taquito/taquito`, it will be used for most actions. The other modules are used by the `@taquito/taquito` methods as complementary features.

Let's initialize a Typescript project and install taquito:

``` shell
$ mkdir taquito-poc
$ mkdir taquito-poc/src
$ touch taquito-poc/src/app.ts taquito-poc/main.ts
$ cd taquito-poc
$ npx tsc --init --resolveJsonModule
$ yarn add typescript @taquito/taquito
```

The `main.ts` file will import an `App` class from `src/app.ts` and run its `main` function:
``` typescript
// main.ts
import { App } from './src/app';

new App().main();
```

Let's create the `App` class with a `main` method. We import the `TezosToolkit` class to check if `@taquito/taquito` is indeed installed:

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';

export class App {
    public async main() { }
}
```

Let's run it with:

``` shell
$ npx ts-node main.ts
```

If _Taquito_ is correctly installed, this should not raise any exception.

## Taquito configuration

We first need to configure _Taquito_ with an RPC URL (to communicate with a Tezos node).

To do that we use the `TezosToolkit`: it is the "facade class that surfaces all of the libraries capability and allow its configuration". When created, it accepts an RPC URL.

Here, we will use the _Ghostnet_ RPC URL offered for free by Marigold at [https://ghostnet.tezos.marigold.dev](https://ghostnet.tezos.marigold.dev/).

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';

export class App {
    private tezos: TezosToolkit;

    constructor(rpcUrl: string) {
        this.tezos = new TezosToolkit(rpcUrl);
    }

    public async main() { }
}
```

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://ghostnet.tezos.marigold.dev/";

new App(RPC_URL).main();
```

## Interactions without an account

_Taquito_ is already ready for some actions: it can retrieve all the information about the Tezos network, the accounts, the smart contracts.

For instance, let's retrieve the balance of an account, with the `getBalance` method:
``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';

export class App {
    private tezos: TezosToolkit;

    constructor(rpcUrl: string) {
        this.tezos = new TezosToolkit(rpcUrl);
    }

    public getBalance(address: string) : void {
        this.tezos.rpc
            .getBalance(address)
            .then(balance => console.log(balance))
            .catch(e => console.log('Address not found'));
    }

    public async main() { }
}
```

Every interaction with the Tezos network through _Taquito_  is handled via a Javascript `Promise`.

Let's call this method for the address: `tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD`

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://ghostnet.tezos.marigold.dev/";
const ACCOUNT_TO_CHECK = "tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD";

new App(RPC_URL).getBalance(ACCOUNT_TO_CHECK);
```

Let's run it:
``` shell
$ npx ts-node main.ts
BigNumber { s: 1, e: 11, c: [ 196185258822 ] }
```

### Contract data

We can also retrieve the metadata and storage of a contract.

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';

export class App {
    private tezos: TezosToolkit;

    constructor(rpcUrl: string) {
        this.tezos = new TezosToolkit(rpcUrl);
    }

    public getBalance(address: string) : void {
        this.tezos.rpc
            .getBalance(address)
            .then(balance => console.log(balance))
            .catch(e => console.log('Address not found'));
    }

    public getContractEntrypoints(address: string) {
        this.tezos.contract
            .at(address)
            .then((c) => {
                let methods = c.parameterSchema.ExtractSignatures();
                console.log(JSON.stringify(methods, null, 2));
            })
            .catch((error) => console.log(`Error: ${error}`));
    }

    public async main() { }
}
```

Let's run it for the simple `Counter` contract on _Hangzhounet_.

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://hangzhounet.smartpy.io";
const ACCOUNT_TO_CHECK = "tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD";
const COUNTER_CONTRACT = "KT1Q1pSzQFARaDgsmGs9f6vUUFSRx2zNXBKc";

new App(RPC_URL).getContractEntrypoints(COUNTER_CONTRACT);
```

The output is:

``` shell
npx ts-node main.ts
[
  [
    "accept_challenge",
    "string"
  ],
  [
    "add_admin",
    "address"
  ],
  [
    "add_collection",
    "address"
  ],
  [
    …
```

## Interactions with an account

_Taquito_ can also sign and send transactions, but it needs a private key to do that. You will need
a private key (see the [“Generate a new account”](https://opentezos.com/private/using-blockchain/#generate-new-account) section) with some
tez from the faucet (see the [“Test Networks”](https://opentezos.com/deploy-a-node/networks/#test-networks) section). We are also going to use the `@taquito/signer` module:

```shell
$ yarn install @taquito/signer
```

### Sending a transaction

Let's send some Tez to another address.

Transactions can be sent with `this.tezos.contract.transfer`. It returns a `Promise<TransactionOperation>`.

A `TransactionOperation` contains the information about this transaction. It also has a `confirmation` method. This method can wait for several confirmations on demand.

Let's create a `sendTz` method that sends an `amount` of Tez to the recipient `address`.

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

export class App {
    private tezos: TezosToolkit;
    private rpcUrl: string;

    constructor(rpcUrl: string) {
        this.rpcUrl = rpcUrl
        this.tezos = new TezosToolkit(rpcUrl);
        this.tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'))
    }

    public sendTz(address: string, amount: number) {
        console.log(`Transfering ${amount} ꜩ to ${address}...`);

        this.tezos.contract.transfer({ to: address, amount: amount })
            .then(op => {
                console.log(`Waiting for ${op.hash} to be confirmed...`);
                return op.confirmation(1).then(() => op.hash);
            })
            .then(hash => console.log(`${hash}`))
            .catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    }
}
```

Let's call it from our `main.ts` file:

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://hangzhounet.smartpy.io";
const ACCOUNT_TO_CHECK = "tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD";
const COUNTER_CONTRACT = "KT1Q1pSzQFARaDgsmGs9f6vUUFSRx2zNXBKc";
const RECIPIENT = "tz1dDc5HrFbjsAuydBwotTa2nzuRkePSRDZg";
const AMOUNT = 10;

new App(RPC_URL).sendTz(RECIPIENT, AMOUNT);
```

Let's run it from the console:

``` shell
$ npx ts-node main.ts
Transfering 10 ꜩ to tz1dDc5HrFbjsAuydBwotTa2nzuRkePSRDZg...
Waiting for oohhG6GmrH2j1xARjnZ2Q3WFGYR3zPRzDzsAaFYb1TwdmJjyqV2 to be confirmed...
oohhG6GmrH2j1xARjnZ2Q3WFGYR3zPRzDzsAaFYb1TwdmJjyqV2
```

We can now check the transaction on an explorer ([TzStats](https://hangzhou.tzstats.com/oohhG6GmrH2j1xARjnZ2Q3WFGYR3zPRzDzsAaFYb1TwdmJjyqV2) or [TzKT](https://hangzhou2net.tzkt.io/oohhG6GmrH2j1xARjnZ2Q3WFGYR3zPRzDzsAaFYb1TwdmJjyqV2)).

### Making a contract call

_Taquito_ can call smart contracts as well. We will use the _Counter_ contract. If you need to know what are the available entrypoints, you can use the `getContractEntrypoints` defined in the [Contract data subsection](#contract-data).

Let's call the `increment` entrypoint. It takes a single _int_ as input.

To do so, we need:
1. to get the contract with `this.tezos.contract.at(contract)`. It returns a `Promise<ContractAbstraction<ContractProvider>>`.
2. get the entrypoints. For this `ContractAbstraction<ContractProvider>` has a `methods` property contraining the entrypoints `increment` and `decrement`.
3. get the increment entrypoint with `methods.increment(2)` to increment the counter by `2`.
4. send the contract call and inspect the transaction with `contract.methods.increment(i).send()`.
5. wait for a chosen number of confirmations, let's say `3`.

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

export class App {
    private tezos: TezosToolkit;
    private rpcUrl: string;

    constructor(rpcUrl: string) {
        this.tezos = new TezosToolkit(rpcUrl);
        this.tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'));
    }

    public increment(increment: number, contract: string) {
        this.tezos.contract
            .at(contract) // step 1
            .then((contract) => {
                console.log(`Incrementing storage value by ${increment}...`);
                return contract.methods.increment(increment).send(); // steps 2, 3 and 4
            })
            .then((op) => {
                console.log(`Awaiting for ${op.hash} to be confirmed...`);
                return op.confirmation(3).then(() => op.hash); // step 5
            })
            .then((hash) => console.log(`Operation injected: https://hangzhounet.smartpy.io/${hash}`))
            .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    }
}
```

Let's call it from our `main.ts` file:

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://hangzhounet.smartpy.io";
const ACCOUNT_TO_CHECK = "tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD";
const COUNTER_CONTRACT = "KT1Q1pSzQFARaDgsmGs9f6vUUFSRx2zNXBKc";
const RECIPIENT = "tz1dDc5HrFbjsAuydBwotTa2nzuRkePSRDZg";
const AMOUNT = 10;
const INCREMENT = 5;

new App(RPC_URL).increment(INCREMENT, COUNTER_CONTRACT);
```

The `send()` function can take an object with fields as an input, such as `amount` (which defines an amount sent with the contract call), `storageLimit`, etc.

### Sending several transactions

Let's consider this Dapp:

``` typescript
// src/app.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

export class App {
    private tezos: TezosToolkit;
    private rpcUrl: string;

    constructor(rpcUrl: string) {
        this.rpcUrl = rpcUrl
        this.tezos = new TezosToolkit(rpcUrl);
        this.tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'))
    }

    public increment(increment: number, contract: string) {
        this.tezos.contract
            .at(contract) // step 1
            .then((contract) => {
                console.log(`Incrementing storage value by ${increment}...`);
                return contract.methods.increment(increment).send(); // steps 2, 3 and 4
            })
            .then((op) => {
                console.log(`Awaiting for ${op.hash} to be confirmed...`);
                return op.confirmation(3).then(() => op.hash); // step 5
            })
            .then((hash) => console.log(`Operation injected: https://florence.tzstats.com/${hash}`))
            .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    }

    public sendTz(address: string, amount: number) {
        console.log(`Transfering ${amount} ꜩ to ${address}...`);
        this.tezos.contract.transfer({ to: address, amount: amount })
            .then(op => {
                console.log(`Waiting for ${op.hash} to be confirmed...`);
                return op.confirmation(1).then(() => op.hash);
            })
            .then(hash => console.log(`${hash}`))
            .catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    }
}
```

This is basically a concatenation of the _Counter_ example and the _Transfer_ example. Now, let's consider a use-case where we need to send these two transactions at the same time (and maybe additional contract calls, originations or transfer transactions). One could be tempted to make those calls one after the other like this:

``` typescript
// main.ts
import { App } from './src/app';

const RPC_URL = "https://hangzhounet.smartpy.io";
const ACCOUNT_TO_CHECK = "tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD";
const COUNTER_CONTRACT = "KT1Q1pSzQFARaDgsmGs9f6vUUFSRx2zNXBKc";
const RECIPIENT = "tz1dDc5HrFbjsAuydBwotTa2nzuRkePSRDZg";
const AMOUNT = 10;
const INCREMENT = 5;

const app : App = new App(RPC_URL);
app.increment(INCREMENT, COUNTER_CONTRACT);
app.sendTz(RECIPIENT, AMOUNT);
```

We basically make a contract call then try to send some funds to an address. Here is the output:

``` shell
$ npx ts-node main.ts
Transfering 10 ꜩ to tz1dDc5HrFbjsAuydBwotTa2nzuRkePSRDZg...
Incrementing storage value by 5...
Waiting for ooEQVNe3SVJkG6TW8WvLbpFDrdtsau6ys7eb2g4nUTbVBUjdQYi to be confirmed...
Error: {
  "status": 500,
  "statusText": "Internal Server Error",
  "body": "[{\"kind\":\"temporary\",\"id\":\"failure\",\"msg\":\"Error while applying operation ooSRhMW4TgVbBa7XvMS18wa3X5CPsm4XSXZ1nKtb9KxdTL4HcQS:\\nError:\\n  Counter 3615454 already used for contract tz1Xqa5LRU5tayDcZEFr7Sw2GjrbDBY3HtHH (expected 3615455)\\n\"}]\n",
  "url": "https://hangzhounet.smartpy.io/injection/operation",
  "name": "HttpResponse"
}
ooEQVNe3SVJkG6TW8WvLbpFDrdtsau6ys7eb2g4nUTbVBUjdQYi
```

The meaningful part is `Counter 3615454 already used for contract tz1YgDUQV2eXm8pUWNz3S5aWP86iFzNp4jnD`. Each transaction in our Dapp is performed asynchronously: the application makes the contract call to the `increment` entrypoint, but did not wait for the confirmation to made the transfer transaction. The contract call transaction was still in the mempool when the transfer transaction was sent. Thus, it failed.

However, _Taquito_ offers a `batch` method, which enables Dapps to send several transactions at once.

To do so, we need to:
1. retrieve the contract that we want to call,
2. call the batch method,
3. use `withTransfer` and/or `withContractCall`,
4. send the transactions batch,
5. wait for their confirmation.

Here is an example:

``` typescript
public async sendInBatch(contractAddress: string, recipientAddress : string) {
    const contract = await this.tezos.contract.at(contractAddress) //step 1

    const batch = this.tezos.contract.batch() // step 2
        .withTransfer({ to: recipientAddress, amount: 10 }) // step 3
        .withTransfer({ to: recipientAddress, amount: 100 }) // step 3
        .withTransfer({ to: recipientAddress, amount: 1000 }) // step 3
        .withContractCall(contract.methods.increment(10)) // step 3

    const batchOp = await batch.send(); // step 4

    await batchOp.confirmation(); // step 5
}
```

Here is its output on [TzKT](https://hangzhou2net.tzkt.io/onySyMJNZoqqo7CaFbesumuyFDLAbg6a7JLtLZqCUYsvd25cKjR) and [TzStats](https://hangzhou.tzstats.com/onySyMJNZoqqo7CaFbesumuyFDLAbg6a7JLtLZqCUYsvd25cKjR).

Our three transfer transactions and our contract call are now indeed batched together in an operation.

## Conclusion

_Taquito_ facilitates developers' interactions with the Tezos network. It can read data from a blockchain, send transactions, originate a contract, etc.

However, Dapps require the ability to manage keys. In our example, there was only a single key to manage. In production Dapps, each user will want to use a key that they own. That is where _wallets_ come into play. Most Tezos wallets are built upon _Taquito_ and make Dapps more user-friendly and accessible. Let's take a deeper look at wallets in the next chapter.

