---
title: Sending transactions
authors: "Tim McMackin"
last_update:
  date: 1 February 2024
---
<!-- TODO originating contracts: https://tezostaquito.io/docs/originate -->

After connecting to a wallet, dApps can call smart contract entrypoints and make transactions with that wallet.

These calls can include:

- Sending tez to an account or smart contract

  When a dApp sends tez, it removes the tez from the source account and adds it to the target account.
  When you send tez to a smart contract's address without calling an entrypoint, the smart contract behaves as though you called its `default` entrypoint.
  Some tools have a specific syntax for sending tez to a contract that is different from the syntax to call an entrypoint, so check your tool's documentation for how to send tez to a contract.

- Calling a smart contract entrypoint

  When a dApp calls a smart contract, it passes an argument in Michelson format that includes the name of the entrypoint and the parameters to pass to it.
  Most tools compile this argument for you, so you can call the entrypoint and pass parameters as though you were calling a function.
  A call to a smart contract entrypoint always includes a transfer of tez, even if the amount is zero.

- Originating a smart contract

  Tools can originate a smart contract from source code.

For information about calling contracts from other contracts, see [Operations](../smart-contracts/logic/operations).

## Taquito

You can use the Taquito SDK to send transactions from JavaScript/TypeScript applications.
For more information about Taquito, see [Taquito](/dApps/taquito).

### Sending tez

To send tez with Taquito, connect to the user's wallet and use the `Tezos.wallet.transfer` method, as in this example:

```typescript
import { TezosToolkit } from "@taquito/taquito";
const Tezos = new TezosToolkit(rpcUrl);

Tezos.setWalletProvider(wallet);

await Tezos.wallet.transfer({
  amount: sendAmount,
  to: targetAccount,
})
  .send()
  .then((op) => {
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(2).then(() => op.opHash);
  })
  .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
```

You can also use the Taquito Contract API to send tez in a similar way.
For more information, see [Transfers](https://tezostaquito.io/docs/making_transfers) in the Taquito documentation.

### Calling contracts

Taquito offers several different ways to send transactions from JavaScript/TypeScript code.
One way is to create a Taquito object that represents the contract.
That contract object contains a method that corresponds to each entrypoint in the contract.

For example, this code calls an entrypoint named "doSomething."
It passes parameters in the order that the contract expects them:

```javascript
import { TezosToolkit } from "@taquito/taquito";
const Tezos = new TezosToolkit(rpcUrl);

Tezos.setWalletProvider(wallet);
const contract = await Tezos.wallet.at(contractAddress);
try {
  const op = await contract.methods.doSomething('Param 1', 25).send();
  console.log(`Waiting for ${op.opHash} to be confirmed...`);
  await op.confirmation(2);
} catch (error) {
  console.log(`Error: ${JSON.stringify(error, null, 2)}`);
}
```

To call an entrypoint that accepts parameters, you must encode those parameters in the format that the entrypoint requires.

To see the format for these parameters, create a Taquito object that represents the contract and extract its parameter schema, as in the following example:

```javascript
const contract = await Tezos.wallet.at(contractAddress);
const parameterSchema = contract.parameterSchema;
console.log(parameterSchema.ExtractSignatures());
```

The response shows the entrypoints in the contract and the parameters that they accept.

For example, the [FA2](../architecture/tokens/FA2) `transfer` entrypoint appears like this:

```json
[
  "transfer",
  {
    "list": {
      "from_": "address",
      "txs": {
        "list": {
          "to_": "address",
          "token_id": "nat",
          "amount": "nat"
        }
      }
    }
  }
]
```

This `transfer` entrypoint accepts an array of token transfers.
Each transfer object includes the address to take the tokens from and an array of accounts to send the tokens to, as in this example:


```javascript
const transactionParams = [
  {
    from_: sourceAddress,
    txs: [
      {
        to_: targetAddress1,
        token_id: 7,
        amount: 2,
      },
      {
        to_: targetAddress2,
        token_id: 7,
        amount: 3,
      },
    ],
  },
];
```

To call the `transfer` entrypoint, pass this parameter to the Taquito entrypoint method, as in this example:

```javascript
Tezos.setWalletProvider(wallet);
const contract = await Tezos.wallet.at(contractAddress);

const transactionParams = [
  {
    from_: sourceAddress,
    txs: [
      {
        to_: targetAddress1,
        token_id: 7,
        amount: 2,
      },
      {
        to_: targetAddress2,
        token_id: 7,
        amount: 3,
      },
    ],
  },
];

const estimation = await Tezos.estimate.transfer({
  to: contractAddress,
  amount: 0,
  parameter: contract.methods.transfer(transactionParams).toTransferParams().parameter
});

const operation = await contract.methods
  .transfer(transactionParams, estimation)
  .send();

console.log(`Waiting for ${operation.opHash} to be confirmed...`);

await operation.confirmation(2);

console.log(
  `Operation injected: https://ghost.tzstats.com/${operation.opHash}`,
);
```

For more examples of calling smart contracts, see tutorials such as [Build a simple web application](../tutorials/build-your-first-app) or [Create a contract and web app that mints NFTs](../tutorials/create-an-nft/nft-taquito).

For more information about using Taquito, see [Smart contracts](https://tezostaquito.io/docs/smartcontracts) in the Taquito documentation.

For a video walkthrough, see [Interacting with FA2 Contracts Using Taquito](https://www.youtube.com/watch?v=xL6jyW1sqmA).

## Beacon

You can use the Beacon SDK to send transactions from JavaScript/TypeScript code.

### Sending tez with Beacon

To send tez with Beacon, use the `requestOperation` method, as in this example:

```javascript
const response = await dAppClient.requestOperation({
  operationDetails: [
    {
      kind: TezosOperationType.TRANSACTION,
      destination: targetAddress, // Address of the target account
      amount: sendAmount, // Amount to send in mutez
    },
  ],
})
```

### Calling contracts with Beacon

To call contracts with Beacon, use the `requestOperation` method and pass the address of the contract, the entrypoint to call, and the parameters to include, as in this example:

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

## Octez

The Octez command-line client can send tez and call contracts from the command line.
See [Interacting with contracts](../developing/octez-client/transactions).
