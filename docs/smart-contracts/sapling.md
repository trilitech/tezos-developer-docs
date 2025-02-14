---
title: Private transactions (Sapling)
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 4 October 2023
---

Sapling is a protocol that enables transactions of fungible tokens while increasing privacy.
It hides transactions from the public, but allows specific entities to view them to comply with regulations.

The key steps are as follows:

1. A _shielded pool_ is created within a contract which a number of users can call to perform transactions whilst keeping details private.
1. The users send tokens to this shielded pool, which is called _shielding tokens_.
Information about these transactions is public.
1. Users perform _shielded transactions_, in such a way that the amount, sender of receiver of each transactions are not revealed publicly.
Only the origin and destination of each transaction have access to the transaction information.
1. Later, users may get some or all of their tokens out of the pool by _unshielding their tokens_.
Information about these transactions is public.

If a regulator needs access to the transactions of a user, this user may share a _viewing key_, which gives access to all the transactions made by this user.

Note that using the Sapling protocol in a _shielded pool_ and expecting a high degree of privacy requires taking a number of precautions, including:

- Making sure there are enough members in the pool to ensure anonymity.
For example, if there are only two members, it becomes very easy to identify the source and destination of transactions.
- Adding dummy transactions, or dummy inputs and outputs of transactions, to hide the actual number of parties involved in each transaction.
- Making sure to use shielded tokens in multiple transactions.
For example, if a user shields exactly 16.32 tokens and another user later unshields exactly 16.32 tokens, the transaction may be traceable.
- Being careful about information that can be deduced from the timing of transactions.

The internals of Sapling are quite technical.
The system is based on an UTXO (bitcoin-like) transaction system, where each transaction consumes some unspent output and produces new unspent outputs.
It uses a system of cryptographic commitments in place of public amounts and addresses, that can then be "consumed" using a system of nullifiers.
The process uses a mix of cryptographic tools including SNARKs, incremental Merkle trees, and Diffie-Hellman key exchanges.

## Implementation information

- Michelson: [Sapling integration](https://octez.tezos.com/docs/active/sapling.html)
- Archetype: [Sapling](https://archetype-lang.org/docs/language-basics/crypto#sapling)
- LIGO: [Sapling](https://ligolang.org/docs/reference/current-reference#sapling)
