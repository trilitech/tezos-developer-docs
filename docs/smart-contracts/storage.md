---
title: Storage
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

Each contract has associated storage, which is persistent internal data that it can read and write to.
Contracts can access only their own storage; they can't access the storage of other contracts.
To provide information to other contracts, use [Views](./views).

However, the content of the storage of a contract is public, like everything else in the state of the blockchain.
Therefore, you can see the current value of the storage of any contract using an explorer such as [Better Call Dev](https://better-call.dev/).

The type of the storage is fixed by the code of the contract and cannot change.
It can be any type, from a basic primitive type such as a `nat`, to a complex type that includes `lists`, `sets`, `big-maps`, and `variants`.

See [Examples of contracts](https://opentezos.com/smart-contracts/simplified-contracts/) on opentezos.com for ideas about how storage can be used.

## Implementation details

- Michelson: [Semantic of contracts and transactions](https://ligolang.org/docs/advanced/entrypoints-contracts)
- Archetype: [Storage](https://archetype-lang.org/docs/reference/declarations/storage)
- SmartPy: [Contracts](https://smartpy.io/manual/syntax/contracts)
- LIGO: [Main function](https://ligolang.org/docs/advanced/entrypoints-contracts)
