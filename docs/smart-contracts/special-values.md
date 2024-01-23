---
title: Special values
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

The code of a contract can access some special values.
See the reference for your language for information about accessing these values:

- `caller`: The address of the direct caller of the current entrypoint.

  This value is often used for these reasons:

  - To check that the caller is allowed to call the entrypoint.
  For example, only a member of a DAO may call its vote entrypoint.
  Only the owner of an NFT may call an `addToMarket` entrypoint of a marketplace to put the NFT on sale.
  - To assign or transfer resources to the caller or to store information about them.
  For example, a user may call a `buy` entrypoint of an NFT marketplace and the contract assigns ownership of the NFT to them.
  The contract assigns ownership by storing the caller address in the record that is associated with the NFT.

- `source`: The address of the initiator of the sequence of calls that led to this entrypoint.
For example, assume that user A called contract B that in turn called contract C:

  A -> B -> C

  When C runs, `source` is the address of A, while `caller` is the address of B.

:::warning Access permissions
It is best practice to implement permissioning based on `caller` instead of `source` because any user account can call any entrypoint on Tezos.
:::

- `self`: The address of the contract itself.
For example, you can ensure that an entrypoint is called only by the contract itself by verifying that `caller` = `self`.

- `balance`: The amount of tez (in `mutez`) in the contract, including any tez that have been transferred to the contract by the current transaction.

- `amount`: The number of tez that have been transferred to the contract during the current transaction.

  - These tez are added to the balance, _except_ if the execution ends in a failure.
  - Some languages refer to this amount with the name `transferred`.

:::note Rejecting tez
By default, an entrypoint automatically accepts any tez that is sent to it.
If the contract should not accept tez, it can reject tez by verifying that the amount is zero.
:::

- `now`: The timestamp of the current block.
This value is the same during the execution of all of the contract calls from the same block.

  - Technically, this value is equal to the timestamp of the previous block plus the minimum block delay (the expected duration between two blocks).
  This prevents the baker of the current block from manipulating this value, while keeping it predictable to everyone.

  This value is often used to check deadlines, for example, if someone has to vote before a certain date.

- `level`: The level of a block corresponds to the number of blocks in the chain since the beginning of the chain (genesis block) until that block.
It increments by one for each new block.

## Implementation details

- Michelson: [Special operations](https://tezos.gitlab.io/active/michelson.html#special-operations), [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts)
- Archetype: [Constants](https://archetype-lang.org/docs/reference/expressions/constants/#now)
- SmartPy: [Timestamps](https://smartpy.io/manual/syntax/timestamps)
- LIGO: [Tezos](https://ligolang.org/docs/reference/current-reference), [Tezos specific built-ins](https://ligolang.org/docs/advanced/entrypoints-contracts#tezos-specific-built-ins), [Tezos.now](https://ligolang.org/docs/advanced/timestamps-addresses#starting-time-of-the-current-block)
