---
title: FA1.2 tokens
authors: "Claude Barde, Aymeric Bethencourt, Tim McMackin"
last_update:
  date: 22 February 2024
---

The FA1.2 standard is for _fungible tokens_, which are collections of identical, interchangeable tokens.
Tez are fungible tokens because each tez is the same as every other tez, though tez are not compatible with the FA1.2 standard.
Commonly used FA1.2 tokens include [kUSD](https://kickico.com/en/kusd) and [Ctez](https://ctez.app).

Contracts that follow this standard keep a ledger that records how many tokens different accounts own.
They have entrypoints that allow users to transfer tokens and limit the amount that can be transferred.
They also have entrypoints that provide information such as the total amount of tokens and the amount of tokens that a specified account owns.

For the full details of the FA1.2 standard, see [Tezos Improvement Proposal 7 (TZIP-7)](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md), which defines the standard.

You can verify that a contract follows the FA1.2 standard by running the following Octez client command, where `$CONTRACT_ADDRESS` is the address of the contract:

```bash
octez-client check contract $CONTRACT_ADDRESS implements fa1.2
```

The Octez client also supports other interactions with FA1.2 contracts, such as transferring tokens or checking balances, as described at [FA1.2 support](https://tezos.gitlab.io/user/fa12.html) in the Octez documentation.

## Allowances

FA1.2 contracts keep track of how many tokens an account _A_ permits another account _B_ to transfer out of account _A_, limit known as the _allowance_ for _B_.

This feature allows an account to authorize another account to transfer a certain amount of tokens on its behalf.

For example, you might authorize an application to take a certain amount of your tokens, as part of one or several transactions, by setting the application's allowance for your tokens.

The account that sends the transaction must have an allowance from the owner of the tokens for a number of their tokens to transfer.

Allowances also apply to the token owner.
An account cannot transfer more tokens than its allowance, even if it has enough tokens and it sent the request itself.
This means that if you want to transfer some of your tokens, you must first set your account's allowance to the amount to transfer.

For security reasons, an allowance cannot be changed from a non-zero amount to another non-zero amount.
Therefore, transferring FA1.2 tokens from a source account to a destination account often involves these steps:

1. Set the transaction sender account's allowance for the source account to 0.
1. Set the transaction sender account's allowance for the source account to the amount of tokens to transfer.
1. Transfer the tokens from the source account to the destination account.
1. Set the transaction sender account's allowance for the source account to 0 to prevent errors if a future change in allowance doesn't set the allowance to 0 first.

## Entrypoints

FA1.2 contracts must have these entrypoints:

- `approve`: Sets the amount of tokens that an account can transfer on behalf of the sender of the transaction.

  Its parameters are the address of the account that is authorized to transfer the tokens on behalf of the sender and the amount of tokens to allow.
  If the request tries to change the allowance from a non-zero amount to a non-zero amount, it must fail and return an `UnsafeAllowanceChange` error message.

- `transfer`: Transfers tokens from one account to another.

  Its parameters are the address to take tokens from and a tuple that includes the address to give tokens to and the amount of tokens to transfer.

  The transaction sender must be an address that has been authorized to transfer the tokens via the `approve` endpoint, even if the transaction sender and address that owns the tokens are the same address.
  After the transfer, the sender's allowance is decreased by the amount of tokens transferred.

FA1.2 contracts must also have the following entrypoints providing information to other smart contracts.
These entrypoints accept a contract address as a parameter and send a callback transaction to that address with information about the current state of the contract.
These entrypoints must not change the storage or generate any operations other than the callback transaction.

- `getAllowance`: Returns the allowance that the specified sender can transfer out of the specified source account
- `getBalance`: Returns the amount of tokens that the specified account owns
- `getTotalSupply`: Returns the total amount of tokens in the contract

FA1.2 contracts can add any other entrypoints in addition to the required entrypoints.

## Storage

No specific storage is required by the standard, but FA1.2 contracts typically use these values:

- A big-map named "ledger" where the key is the owner's address and the value is the amount of tokens it owns and a map of its allowances
- A natural number named "totalSupply" that is the total amount of tokens
