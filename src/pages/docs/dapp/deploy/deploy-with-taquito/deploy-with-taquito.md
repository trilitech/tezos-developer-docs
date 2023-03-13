---
id: deploy-with-taquito
title: Deploy with Taquito
authors: Damien ZONDA
---

## About *Taquito*

*Taquito*  is TypeScript library suite for development on the Tezos blockchain. An [entire chapter is dedicated to this library](/dapp/taquito).

Before starting this chapter, it is important to have done the chapter on Taquito, especially the [installation](/dapp/taquito#installation) and the [configuration](/dapp/taquito#taquito-configuration). Although this chapter takes up these elements, they will not be explained in detail.

We're also going to use the `raffle.ligo` contract from [the LIGO tutorial](https://opentezos.com/ligo/write-contract-ligo/raffle-contract/). The LIGO compiler is required to compile the contract. If you did not follow the LIGO tutorial, you can copy [the complete contract from the last section](https://opentezos.com/ligo/write-contract-ligo/refactoring/#refactoring-the-closeraffle-entrypoint).

## Initializing the deployment

Let's start by installing the necessary dependencies :

``` shell
mkdir deploy
touch deploy/main.ts
cd deploy
npx tsc --init --resolveJsonModule
yarn add typescript @taquito/taquito @taquito/signer @taquito/utils
```

Then, Taquito must be initialized and the signer provider set.

The basis of the project therefore looks like this :

``` typescript
// main.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const RPC_URL = "https://ghostnet.tezos.marigold.dev";

const deploy = async () => {
    try {
        const tezos = new TezosToolkit(RPC_URL);
        tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'));



    } catch (err) {
        console.log(err);
    }
}

deploy();
```

Let's run it with:

``` shell
npx ts-node main.ts
```

If *Taquito* is correctly installed and configured, this should not raise any exception.

## Compiling smart contracts

To be deployed with Taquito, the smart-contract must be compiled in Michelson in JSON format. Let's reuse the `raffle.ligo` contract from [the Raffle example](https://opentezos.com/ligo/write-contract-ligo/refactoring/#refactoring-the-closeraffle-entrypoint).

The ligo compiler allows this by passing the flag `--michelson-format` when compiling the contract:

```shell
mkdir contracts
ligo compile contract --michelson-format json raffle.ligo > contracts/raffle.json
```

The contract is now ready to be deployed. We can import it into our project :

``` typescript
// main.ts
...
import raffleJson from './contracts/raffle.json';
...
```

## Origination with Taquito

### Defining the initial storage

A smart contract defines a storage. When originated, the initial storage must be set and the storage must be compliant with the structure defined in the smart contract to be deployed: the names and types must be respected.
It also allows you to work with types specific to Michelson, such as bigmaps.

We therefore need to import two additional functions :

``` typescript
import { MichelsonMap } from '@taquito/taquito';
import { buf2hex } from '@taquito/utils';
```

Below is the matching table between Javascript and LIGO.

| LIGO             | Javascript                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| List, Tuple, Set | []                                                                                              |
| Big_map, Map     | const bigMap = new MichelsonMap() <br /> bigMap.set(key, values) <br /> *(from taquito module)* |
| string, address  | string                                                                                          |
| bytes            | `buf2hex(Buffer.from(string_to_convert))`                                                       |
| int, nat, mutez  | number                                                                                          |
| record           | Object {}                                                                                       |
| timestamp        | Date.now()                                                                                      |

Here is what our initial storage should look like :

``` typescript
// main.ts
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { buf2hex } from '@taquito/utils';

import raffleJson from './contracts/raffle.json';

const RPC_URL = "https://ghostnet.tezos.marigold.dev";

const deploy = async () => {
    try {
        // Initialize Taquito
        const tezos = new TezosToolkit(RPC_URL);
        tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'));

        // Initial storage definition
        const admin = 'YOUR_PUBLIC_KEY_HASH';  // Admin address, tz1...
        const closeDate = Date.now() + 10;
        const jackpot = 100;
        const description = "This is an incredible Raffle.";
        const players = [] as any[];
        const soldTickets = new MichelsonMap();
        const raffleIsOpen = true;
        const winningTicketHash = buf2hex(Buffer.from("ec85151eb06e201cebfbb06d43daa1093cb4731285466eeb8ba1e79e7ee3fae3"));

        const initialStorage = {
            "admin": admin,
            "close_date": closeDate.toString(),
            "jackpot": jackpot,
            "description": description,
            "players": players,
            "sold_tickets": soldTickets,
            "raffle_is_open": raffleIsOpen,
            "winning_ticket_number_hash": winningTicketHash
        }

    } catch (err) {
        console.log(err);
    }
}

deploy();
```

Any type and structure change in the LIGO smart contract storage must be mirrored in the
`initialStorage` variable. This way, the evolution of the storage used can be versioned.

### Deploying the contract

Originations can be sent with `tezos.contract.originate`. It returns a `Promise<OriginationOperation<DefaultContractType>>`.

A `OriginationOperation` contains the information about this origination. It also has a confirmation method. This method can wait for several confirmations on demand.

Let's deploy our contract with this function by setting your code in JSON Michelson format and our initial storage :

``` typescript
// main.ts
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { buf2hex } from '@taquito/utils';

import raffleJson from './contracts/raffle.json';

const RPC_URL = "https://ghostnet.tezos.marigold.dev";

const deploy = async () => {
    try {
        // Initialize Taquito
        const tezos = new TezosToolkit(RPC_URL);
        tezos.setSignerProvider(new InMemorySigner('YOUR_PRIVATE_KEY'));

        // Initial storage definition
        const admin = 'YOUR_PUBLIC_KEY_HASH'; // Admin address, tz1...
        const closeDate = Date.now() + 10;
        const jackpot = 100;
        const description = "This is an incredible Raffle.";
        const players = [] as any[];
        const soldTickets = new MichelsonMap();
        const raffleIsOpen = true;
        const winningTicketHash = buf2hex(Buffer.from("ec85151eb06e201cebfbb06d43daa1093cb4731285466eeb8ba1e79e7ee3fae3"));

        const initialStorage = {
            "admin": admin,
            "close_date": closeDate.toString(),
            "jackpot": jackpot,
            "description": description,
            "players": players,
            "sold_tickets": soldTickets,
            "raffle_is_open": raffleIsOpen,
            "winning_ticket_number_hash": winningTicketHash
        }

        const origination = await tezos.contract.originate({
            code: raffleJson,
            storage: initialStorage,
          });

          await origination.confirmation();
          const contract = await origination.contract();

          console.log(`Operation Hash: ${origination.hash}`);
          console.log(`Contract Address: ${contract.address}`);
    } catch (err) {
        console.log(err);
    }
}

deploy();
```

Run the script and retrieve the operation hash and the contract address :

```shell
npx ts-node main.ts
Operation Hash: onqm8fpox7aeTSV6TkLYSEKL9u2UWq5widZa5yFbgPLA2ji3EtV
Contract Address: KT1BvzBtpTNsB43mNTaEP1H4tgBx9Tfa4v3M
```

We can now check the [transaction](https://ghostnet.tzkt.io/onqm8fpox7aeTSV6TkLYSEKL9u2UWq5widZa5yFbgPLA2ji3EtV) and the [contract](https://ghostnet.tzkt.io/KT1BvzBtpTNsB43mNTaEP1H4tgBx9Tfa4v3M/operations) on an explorer.

# Conclusion

The first step in developing a Dapp is to deploy the smart contracts. *Taquito* takes Michelson code and deploys it onto any public or private network.

Each origination needs an initial storage that is compliant with the storage type of the Michelson code.
