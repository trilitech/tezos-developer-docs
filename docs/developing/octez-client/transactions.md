---
title: Interacting with contracts
authors: Tim McMackin
lastUpdated: 27 October 2023
---

Before sending transactions to contracts with the Octez client, make sure that your client is configured to use an RPC node for the network that you want to use.
To verify the RPC node that you are using, run `octez-client config show` and look at the value in the `entrypoint` field.

## Sending tez

To send tez from a source account to a target account, use the `octez-client transfer` command, as in this example:

```bash
octez-client transfer 42 from account1 to account2 --fee-cap 0.9
```

You can use addresses or local aliases for the source and target accounts, but Octez must have the private key for the source account in order to sign the transaction.

To check the balance of an account after a transaction, use the `octez-client get balance for` command and pass the alias or address of an account, as in this example:

```bash
octez-client get balance for account1
```

## Calling smart contracts

To call a smart contract, use the `octez-client transfer` command, as in this example from the [Deploy a smart contract](../../tutorials/smart-contract) tutorial:

```bash
octez-client --wait none transfer 0 \
  from $MY_TZ_ADDRESS to my-counter \
  --entrypoint 'increment' --arg '5' --burn-cap 0.1
```

This command calls the `increment` entrypoint of the `my-counter` contract and includes 0 tez and up to 0.1 tez in fees with the transaction.
It passes the parameter "5" to the endpoint.
You can use a local alias or the full address for the smart contract.

Because entrypoints accept parameters in Michelson code, you must encode the values that you send as Michelson values.
The high-level languages have tools to help you encode values in Michelson.
For example, if you are using LIGO to create an entrypoint that accepts an integer, address, and string as a parameter, you can pass the parameter values as a LIGO expression and get the Michelson version with this command:

```bash
ligo compile parameter MyContract.jsligo -e "myentrypoint" \
  '[5, "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx" as address, "hello"]'
```

The compiled parameter value looks like this:

```
(Pair 5 "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx" "hello")
```

Then you can use this value for the value of the `--arg` argument in the `octez-client transfer` command.

## Originating (deploying) smart contracts

To deploy (originate) a smart contract to the current network, use the `octez-client originate contract` command, as in this example from the [Deploy a smart contract](../../tutorials/smart-contract) tutorial:

```bash
octez-client originate contract my-counter \
  transferring 0 from $MY_TZ_ADDRESS \
  running increment.tz \
  --init 10 --burn-cap 0.1 --force
```

This command accepts the compiled version of the contract as a Michelson `.tz` file.
See the documentation for the high-level language you are using for how to compile a contract.
Like the command to call a smart contract, this command accepts the initial value of the contract storage as a Michelson-encoded value.

After you originate the contract, you can use the local alias from this command to send transactions to its entrypoints.
You can see the aliases of contracts by running the command `octez-client list known contracts`.
