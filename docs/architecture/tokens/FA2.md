---
title: FA2 tokens
authors: "Claude Barde, Aymeric Bethencourt, Tim McMackin"
last_update:
  date: 26 October 2023
---

The FA2 standard supports several different token types, including:

- Fungible tokens
- Non-fungible tokens (NFTs)
- Non-transferable tokens, also known as soulbound tokens
- Multiple types of tokens in the same contract

FA2 gives developers freedom to create new types of tokens while following an interface standard that lets the tokens work with existing wallets and applications.
FA2 contracts let developers define rules for transferring tokens and for how tokens behave.

Because a single FA2 contract can define multiple types of tokens, each token type has an ID.
If the contract has only one type of token, its ID must be 0, but if it has multiple types of tokens, the IDs can be any value.

For the full details of the FA2 standard, see [Tezos Improvement Proposal 12 (TZIP-12)](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md), which defines the standard.

## Metadata

FA2 tokens have metadata that describes what the token represents.
The standard provides multiple options for the structure of the metadata and it refers to other standards for how the metadata is stored.
FA2 suggests that contracts store metadata according to [TZIP-16](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md).
For examples of working with metadata, see the NFT-related tutorials at [Create an NFT](../../tutorials/create-an-nft).

## Operators

Similar to allowances in FA1.2 tokens, FA2 token owners can allow other accounts to transfer tokens on their behalf.
Accounts that are authorized to transfer other accounts' tokens in this way are called _operators_.
For example, you might authorize a smart contract to transfer your tokens as part of a transaction.
Unlike allowances in FA1.2 tokens, operators can transfer any number of the owner's tokens.

## Minting and burning

FA2 does not require contracts to provide entrypoints that mint (create) or burn (destroy) tokens, but it permits developers to add those entrypoints if they choose.
If the contract does not have a mint entrypoint, it can create tokens in some other way or developers can initialize its storage with all of the tokens that it will ever have.

## Entrypoints

FA2 contracts must have these entrypoints:

- `transfer`: Transfers tokens from a source account to one or more destination accounts.
Its parameters are the address of the source account and a list of destination accounts, each with the token ID and amount to transfer.

- `balance_of`: Sends information about an owner's token balance to another contract.
Its parameters are a callback contract that accepts a list of token IDs and the amount that the specified account owns.

- `update_operators`: Adds or removes operators for the specified token owners and token IDs.
Its parameters are a list of commands to add or remove operators for token owners and IDs.

The standard defines what happens when these entrypoints are called, the format of their parameters, and the errors that they create.
For information about these requirements, see [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

FA1.2 contracts can add any other entrypoints in addition to the required entrypoints.

## Views

FA2 contracts are not required to have any views, but the specification suggests these optional views.
If any of them are implemented, all of them should be implemented, and they should be implemented with the parameters, return values, and behaviors that are defined in the standard:

- `get_balance`: Returns the amount of tokens that a specified owner owns of the specified token ID
- `total_supply`: Returns the total number of tokens of the specified token ID
- `all_tokens`: Returns the list of all token IDs in the contract
- `is_operator`: Returns true if the specified address is an operator for the specified token ID and owner address
- `token_metadata`: Returns the metadata for the specified token ID

FA1.2 contracts can add any other views in addition to the required views.

## Errors

FA2 defines a list of errors that contracts must create, such as "FA2_TOKEN_UNDEFINED" if a transaction refers to a token ID that doesn't exist.
For a list of these errors, see [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).
