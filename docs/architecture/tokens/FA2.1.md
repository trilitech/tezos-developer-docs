---
title: FA2.1 tokens
authors: Tim McMackin
last_update:
  date: 23 July 2024
---

The FA2.1 standard adds several features to tokens while remaining backward-compatible with the FA2 standard.

Like FA2 tokens, FA2.1 tokens can be fungible or non-fungible.

For the full details of the FA2.1 standard, see [Tezos Improvement Proposal 26 (TZIP-26)](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-26/tzip-26.md), which defines the standard.

## Major changes from FA2

- FA2.1 allows contracts to export tokens as tickets, use those tickets outside of the contract, and import those tickets back into the contract.

- FA2.1 includes on-chain [views](../../smart-contracts/views) that allow contracts to provide information to on-chain and off-chain applications.

- FA2.1 includes [events](../../smart-contracts/events), which provide notifications of token-related activity to off-chain applications.

- FA2.1 adds the concept of allowances from FA1.2 so contracts can use operators or allowances to control access to tokens.

## Examples

For examples of FA2.1 contracts, see the [Implementation](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-26/tzip-26.md?ref_type=heads#implementation) section of the standard.

## Metadata

Like FA2 tokens, each FA2.1 token has metadata that describes what the token represents.
The standard provides multiple options for the structure of the metadata and it refers to other standards for how the metadata is stored.
FA2.1 suggests that contracts store metadata according to [TZIP-21](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-21/tzip-21.md), which is an extension of the TZIP-16 metadata standard used in FA2.
For examples of working with metadata, see the NFT-related tutorials at [Create an NFT](../../tutorials/create-an-nft).

## Tickets

A major change in FA2.1 is that contracts can optionally export [tickets](../../smart-contracts/data-types/complex-data-types#tickets) that represent tokens.
In this case, the contract decreases an owner's balance of tokens and creates a ticket that represents those tokens.
It keeps the total balance of the tokens in its ledger the same.
Then the ticket owner can transfer the ticket without using the original contract, similar to a wrapped token.

Then, contracts can import tickets by accepting the ticket, destroying it, and increasing the user's balance of tokens.
Exporting and importing tickets in this way allows users to bridge tokens between Tezos layers, such as how [Bridging tokens](https://docs.etherlink.com/get-started/bridging) works in Etherlink.
Contracts can even accept tickets created by other contracts.

## Access control

FA2.1 token contracts can implement neither, either, or both of two different methods for controlling token access: operators and allowances.
If it implements neither method, only token owners can transfer tokens.

### Operators

FA2.1 contracts can implement operators, which behave like they do in FA2 contracts.

Accounts that are authorized to transfer other accounts' tokens are called _operators_.
For example, a user might want to sell a token on a marketplace, so they set the marketplace as an operator of that token type, which allows the marketplace to sell the token without getting further approval from the owner.
Unlike allowances, operators can transfer any number of the owner's tokens of the specified type.

### Allowances

FA2.1 contracts can implement allowances, which are similar to allowances in FA1.2 contracts.

In this case, the contract keeps track of how many tokens an account A permits another account B to transfer out of account A.
This limit is known as the _allowance_ for account B.
In this scenario, account B is known as the _spender_ for account A.

The `approve` entrypoint changes allowances.

This feature allows an account to authorize another account to transfer a certain amount of tokens on its behalf.

For example, you might authorize an application to take a certain amount of your tokens, as part of one or several transactions, by setting the application's allowance for your tokens.

The spender must have an allowance from the owner of the tokens for a number of their tokens to transfer.
When a spender or token owner transfers tokens, their allowance decreases by the amount of tokens they transfer.

Allowances also apply to the token owner.
An account cannot transfer more tokens than its allowance, even if it has enough tokens and it sent the request itself.
This means that if you want to transfer some of your tokens, you must first set your account's allowance to the amount to transfer.

Unlike FA1.2 contracts, you can change an allowance from a non-zero amount to another non-zero amount.

## Minting and burning

Like FA2, FA2.1 does not require contracts to provide entrypoints that mint (create) or burn (destroy) tokens, but it permits developers to add those entrypoints if they choose.
If the contract does not have a mint entrypoint, it can create tokens in some other way or developers can initialize its storage with all of the tokens that it will ever have.

## Entrypoints

FA2.1 contracts must have these entrypoints:

- `transfer`: Transfers tokens from a source account to one or more destination accounts.
Its parameters are the address of the source account and a list of destination accounts, each with the token ID and amount to transfer.

   The core behavior of the `transfer` entrypoint is similar to that of the FA2 entrypoint but the FA2.1 version has different rules for who can transfer tokens, as described in [Access control](#access-control).

   This entrypoint must emit the `transfer_event`, `balance_update`, and `allowance_update` events.

- `balance_of`: Sends information about an owner's token balance to another contract.
Its parameters are a callback contract that accepts a list of token IDs and the amount that the specified account owns.
This entrypoint is the same as in FA2.

- `update_operators`: Adds or removes operators for the specified token owners and token IDs.
Its parameters are a list of commands to add or remove operators for token owners and IDs.
This entrypoint is the same as in FA2.

- `approve`: Sets the amount of tokens that an account can transfer on behalf of the token owner.
Its parameters are a list of commands to increase or decrease the allowances for token owners and IDs.
Unlike the `approve` entrypoint in the FA1.2 standard, this entrypoint accepts a batch of parameters.

   This entrypoint must emit the `allowance_update` event.

- `export_ticket`: Creates one or more tickets that represent an account's tokens and sends them to the specified addresses.
The contract deducts the tokens from the source account, but the contract's total supply of the tokens does not change; the `get_total_supply` view must return the same amount of tokens as before the entrypoint was called.

   This entrypoint must follow the same access control rules as the `transfer` entrypoint.
   For example, if the contract is using operators, only the token owner or their operators can call this entrypoint.

   This entrypoint must emit the `balance_update` and `allowance_update` events but not the `transfer_event` event.

- `import_ticket`: Accepts one or more tickets that represent tokens, destroys the tickets, and adds the tokens to the specified accounts.
This entrypoint is the converse of the `export_ticket` entrypoint.

   This entrypoint must emit the `balance_update` and `total_supply_update` events but not the `transfer_event` event.

- `lambda_export`: Creates one or more tickets and runs a lambda that determines what happens to them.
For security reasons, the contract runs the lambda in a separate sandbox contract.

   This entrypoint must emit the `balance_update` and `allowance_update` events.

The standard defines what happens when these entrypoints are called, the access control for them, the format of their parameters, and error cases.
For information about these requirements, see [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

FA2.1 contracts can add any other entrypoints in addition to the required entrypoints.

## Views

Unlike FA2, the FA2.1 standard specifies that entrypoints implement views to provide information about tokens.
The standard recommends that views don't fail or return errors but instead return meaningful default values.
For example, if a caller requests the balance of a non-existent address or token ID, the view should return 0.

These are the views that FA2.1 contracts must implement:

- `get_balance`: Returns the number of tokens of the specified token ID that the specified address owns.

- `get_total_supply`: Returns the total amount of the specified token ID.
For contracts that implement tickets, this amount includes the amount of tokens tracked directly in the contract ledger and the amount of tokens exported as tickets.

- `is_operator`: Returns true if the specified account is an operator of the specified account and token ID.

- `get_allowance`: Returns the allowance for the specified spender, owner, and token ID.

- `get_token_metadata`: Returns the metadata for the specified token ID.

- `is_token`: Returns true if the specified token ID exists.

## Events

Unlike FA2, the FA2.1 standard specifies that entrypoints emit events when they are called.
To avoid confusion about the order of events, the entrypoints must emit these events before other transactions.

These are the events that FA2.1 contracts must emit and the entrypoints that emit them:

- `transfer_event`: Emitted when tokens are transferred, either by the `transfer` entrypoint or any other mechanism that transfers tickets.
However, the `export_ticket` and `import_ticket` entrypoints should not emit this event.
The event includes the source and target accounts, the token ID, and the amount of tokens.

- `balance_update`: Emitted when the amount of tokens in an account changes, such as by the `transfer`, `export_ticket`, `lambda_export`, and `import_ticket` entrypoints.
The event includes the account, the token ID, the new balance, and the difference between the old and new balance.

- `total_supply_update`: Emitted when the total number of a certain token type changes, such as by minting tokens.
The event includes the token ID, the new total supply, and the difference between the old and new amounts.

- `operator_update`: Emitted when operators change, such as by the `update_operators` entrypoint.
The event includes the token owner, the operator, the token ID, and a Boolean value that is true if the operator is being added or false if the operator is being removed.

- `allowance_update`: Emitted when a spender's allowance is changed, including when it is decreased as a result of a token transfer.
The event includes the token owner, the spender, the token ID, the new allowance, and the difference between the old and new allowances.

- `token_metadata_update`: Emitted when a token's metadata changes.
The event includes the token ID and an option type that contains the new metadata or `none` if the token was burned.

## Errors

FA2.1 contracts use the same errors as FA2 contracts plus additional FA2.1 errors for failures related to tickets and allowances.
For a list of these errors, see [TZIP-26](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-26/tzip-26.md).
