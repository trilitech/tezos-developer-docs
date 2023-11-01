---
title: Global table of constants
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
lastUpdated: 5th October 2023
---

Tezos provides a feature that lets user store data in a global table of constants.
This makes it possible to reuse code or data between contracts, and by doing so, reducing the size of these contracts.
It is a write-only key-value store, where anyone can add data as long as they pay for the storage costs.
When you register a piece of data in this table, you obtain its address, which is a Base58-encoded Blake2b hash of the binary serialization of the data.

The data can then be referenced anywhere in your code.
It can be used to store code, types, or data.

## Implementation details

- Michelson: [Global constants](https://tezos.gitlab.io/active/global_constants.html)
- LIGO: [Global constants](https://ligolang.org/docs/protocol/hangzhou#global-constant)
- Archetype: [Global constants](https://archetype-lang.org/docs/cli/contract/)
