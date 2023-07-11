---
id: fa12-fa2-standards
title: FA1.2 & FA2 token standards
slug: /fa12-fa2-standards
authors: Claude Barde
lastUpdated: July 2023
---

Token standards in a blockchain ecosystem are important for 2 reasons:
- they enforce best practices that improve the safety of the code the tokens depend on
- they provide an interface that makes it easier to create new applications that can use tokens already available on-chain.

The FA1.2 standard is the first token standard that was available on Tezos. It was followed a few years later by the FA2 standards. Both standards provide different interfaces and behaviors that developers can choose according to their needs.

{% callout type="note" title="Note" %}
To read the full specification of the FA1.2 standard, [check this page](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md). For the full specification of the FA2 standard, [follow this link](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).
{% /callout %}

## FA1.2 standard
The FA1.2 standard has been created for fungible tokens. This means that it is not possible to implement an NFT with this standard. A few common tokens used on Tezos are FA1.2, for example, kUSD or Ctez.

### Entrypoints
A token contract implementing FA1.2 must have at least 2 entrypoints:
- **%transfer**: the entrypoint to transfer an amount of tokens from one account to another
- **%approve**: the entrypoint to approve the spending of a provided amount by a third party.

In addition to these entrypoints, a FA1.2 contract must present 3 views:
- **%getAllowance**: to retrieve the allowance of a user
- **%getBalance**: to retrieve the balance of a user
- **%getTotalSupply**: to retrieve the total supply of tokens in the contract

The entrypoints must implement the following behaviors:
#### %transfer
- The transaction sender MUST be previously authorized to transfer the requested number of tokens or less from the `"from"` account using the `approve` entrypoint. In this case, the current number of tokens that the sender is allowed to withdraw from the `"from"` address is decreased by the number of transferred tokens.
- In case the `"from"` account is equal to the sender, the sender's token allowance SHOULD still be decreased by the number of transferred tokens.
- If the balance is not enough to perform the transfer, the contract must fail and a `NotEnoughBalance` error message must be returned.

#### %approve
- The transaction must update the current allowance for the third party.
- Updates from non-zero allowance to non-zero allowance are forbidden to prevent the [corresponding attack vector](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit). A non-zero allowance must first be updated to zero before being updated to a non-zero value.
- If an update from a non-zero allowance to a non-zero allowance is expected, the contract must fail and return a `UnsafeAllowanceChange` error message.

### Storage
No specific storage is required by the standard, however, these 2 values are suggested:
- `big_map %ledger address (pair nat (map address nat))` for the ledger
- `(nat %totalSupply)` for the total supply

## FA2 standard

The FA2 standard was created to handle both fungible and non-fungible tokens (NFT). Unlike the standards on Ethereum and other blockchains, Tezos provides the same standard with a certain flexibility for fungible and non-fungible tokens.

The FA2 standard provides a safe interface to create and interact with tokens on Tezos. All the NFTs (at the time of writing) on Tezos are FA2 tokens. Multiple popular fungible tokens are also FA2 tokens like uUSD and USDT.

### Entrypoints
A token contract implementing FA2 must have at least 3 entrypoints:
- **%transfer**: the entrypoint to transfer an amount of tokens from one account to another
- **%balance_of**: the entrypoint to query the balance owned by a specified account
- **%update_operators**: the entrypoint to approve the spending of a provided amount by a third party.

#### %transfer
The parameter sent to the contract is a list of transfers. Each transfer in the batch is specified between one source (`from_`) address and a list of destinations. Each destination specifies a token id and the
amount to be transferred from the source address to the destination (`to_`) address.

- Every transfer operation MUST happen atomically and in order. If at least one transfer in the batch cannot be completed, the whole transaction MUST fail, all token transfers MUST be reverted, and token balances MUST remain unchanged.
- Each transfer in the batch MUST decrement the token balance of the source (`from_`) address by the amount of the transfer and increment the token balance of the destination (`to_`) address by the amount of the transfer.
- If the transfer amount exceeds the current token balance of the source address, the whole transfer operation MUST fail with the error mnemonic "`FA2_INSUFFICIENT_BALANCE`".
- If the token owner does not hold any tokens of type `token_id`, the owner's balance is interpreted as zero. No token owner can have a negative balance.
- The transfer MUST update token balances exactly as the operation parameters specify it. Transfer operations MUST NOT try to adjust transfer amounts or try to add/remove additional transfers like transaction fees.
- Transfers of zero amount MUST be treated as normal transfers.
- Transfers with the same address (`from_` equals `to_`) MUST be treated as normal transfers.
- If one of the specified `token_id`s is not defined within the FA2 contract, the entrypoint MUST fail with the error mnemonic "`FA2_TOKEN_UNDEFINED`".
- Transfer implementations MUST apply transfer permission policy logic (either [default transfer permission policy](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md#default-transfer-permission-policy) or [customized one](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/permissions-policy.md#customizing-transfer-permission-policy)). If permission logic rejects a transfer, the whole operation MUST fail.
- Core transfer behavior MAY be extended. If additional constraints on token transfer are required, FA2 token contract implementation MAY invoke additional permission policies. If the additional permission fails, the whole transfer operation MUST fail with a custom error mnemonic.

#### %balance_of
The entrypoint accepts a list of `balance_of_requests` and a callback contract `callback` which accepts a list of `balance_of_response` records. This feature allows other contracts to query token balances on-chain.
- There may be duplicate `balance_of_request`s, in which case they should not be deduplicated nor reordered.
- If the account does not hold any tokens, the account balance is interpreted as zero.
- If one of the specified `token_id`s is not defined within the FA2 contract, the entrypoint MUST fail with the error mnemonic "`FA2_TOKEN_UNDEFINED`".

#### %update_operators
The entrypoint accepts a list of operators to add or remove for the specified token owner and token ids. This feature allows third parties like NFT marketplaces or exchanges to spend tokens on behalf of their owners.
- The entrypoint accepts a list of `update_operator` commands. If two different commands in the list add and remove an operator for the same token owner and token ID, the last command in the list MUST take effect.
- It is possible to update operators for a token owner that does not hold any token balances yet.
- Operator relation is not transitive. If C is an operator of B and if B is an operator of A, C cannot transfer tokens that are owned by A, on behalf of B.
The standard does not specify who is permitted to update operators on behalf of the token owner.

### Storage
FA2 contracts work very closely with the [TZIP-16 standard](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md) to implement token metadata and contract metadata.

A contract can use two methods to provide access to the token metadata:
- **Basic**: Store the values in a big_map annotated `%token_metadata` of type `(big_map nat (pair (nat %token_id) (map %token_info string bytes)))`.
- **Custom**: Provide a `token_metadata` off-chain view which takes the token id of type `nat` as a parameter and returns a value of type `(pair (nat %token_id) (map %token_info string bytes))`.

In both cases the “key” is the token id (of type `nat`) and one MUST store or return a value of type `(pair nat (map string bytes))`: the token id and the metadata defined above.

Here are some suggestions for the ledger `big_map` for the 3 most common use cases:
- Single asset contract => `big_map %ledger address nat`
- Multi-asset contract  => `big_map %ledger (pair address nat) nat`
- NFT asset contract    => `big_map %ledger nat address`

### Off-Chain Views
Within its TZIP-016 metadata, an FA2 contract does not have to provide any off-chain view but can provide 5 optional views: `get_balance`, `total_supply`, `all_tokens`, `is_operator`, and `token_metadata`. If present, all of these SHOULD be implemented, at least, as *“Michelson Storage Views”* and have the following types (Michelson annotations are optional) and semantics:

- `get_balance` has a parameter of type `(pair (address %owner) (nat %token_id))` and a return value of type `nat`; it must return the balance corresponding to the owner/token pair.
- `total_supply` has type `(nat %token_id) → (nat %supply)` and should return the total number of tokens for the given token id if known or fail if not.
- `all_tokens` has no parameter and returns the list of all the token ids, `(list nat)`, known to the contract.
- `is_operator` has type `(pair (address %owner) (pair (address %operator) (nat %token_id))) → bool` and should return whether `%operator` is allowed to transfer `%token_id` tokens owned by the `owner`.
- `token_metadata` is one of the 2 ways of providing token-specific metadata, it is defined in the section [Token Metadata](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md#token-metadata) and is not optional if the contract does not have a `%token_metadata` big_map.
