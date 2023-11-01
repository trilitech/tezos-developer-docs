---
title: Sending transactions
authors: "Tim McMackin"
lastUpdated: 23 October 2023
---
<!-- TODO originating contracts: https://tezostaquito.io/docs/originate -->

After connecting to a wallet, dApps can call smart contract entrypoints and make transactions with that wallet.

These calls can include:

- Sending tez to an account or smart contract
- Calling a smart contract entrypoint
- Originating a smart contract

:::note Sending tez
Sending tez to an address is just a special case of calling a smart contract (via the `default` entrypoint).
However, some languages have a specific syntax for simply sending tez to a contract that is different from the syntax to call an entrypoint.
A call to a smart contract always includes a transfer of a certain amount of tez, even if that amount is zero.
:::

For information about calling contracts from other contracts, see [Operations](../smart-contracts/logic/operations).

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

For more information about Beacon, see <https://walletbeacon.io/>.

## Taquito

You can use the Taquito SDK to send transactions from JavaScript/TypeScript applications.
For more information about Taquito, see [Taquito](./taquito).

### Sending tez with Taquito

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
    return op.confirmation(3).then(() => op.opHash);
  })
  .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
```

For more information, see [Transfers](https://tezostaquito.io/docs/making_transfers) in the Taquito documentation.

### Calling contracts with Taquito

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
await contract.methods.doSomething('Param 1', 25)
  .send()
  .then((op) => {
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(3).then(() => op.opHash);
  })
  .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
```

For examples of calling smart contracts, see the [tutorials](../tutorials).

For more information, see [Smart contracts](https://tezostaquito.io/docs/smartcontracts) in the Taquito documentation.

## Octez

The Octez command-line client can send tez and call contracts from the command line.
For more information about Octez, see [Getting started with Octez](../reference/octez).

### Sending tez with Octez

To send tez with Octez, make sure you have imported the private key for the account that you are using.
Then, use the `transfer` command to send tez, replacing the account alias `local_wallet` with the alias for your account and `target_account` with the alias or address of the account to send tez to:

```bash
octez-client --wait none transfer 5 from local_wallet to target_account
```

### Calling contracts with Octez

To call a contract with Octez, make sure that you have imported the private key for the account that you are using.
Then, use the `transfer` command to call the contract.
For example, this command calls the entrypoint `increment` on a contract with the alias `my_contract` and passes the parameter `12`:

```bash
octez-client --wait none transfer 0 from local_wallet to my_contract \
  --entrypoint "increment" --arg "12" --burn-cap 0.1
```
