---
title: Loops and iterations
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
lastUpdated: 5th October 2023
---

A smart contract can contain loops, which take two general forms:

- Conditional loops, which keep iterating as long as a given condition is true, such as while loops
- Loops that iterate through every element of a data structure such as a list, map, or set

:::warning
When using loops, be careful of attacks that could increase the number of iterations in the loop.
:::

In many cases, it is possible to avoid performing loops in the contract itself by doing most of the computations off-chain.

## Implementation details

- Michelson: [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures)
- Archetype: [Asset - iteration](https://archetype-lang.org/docs/asset#iteration), [for](https://archetype-lang.org/docs/reference/instructions/control#for), [while](https://archetype-lang.org/docs/reference/instructions/control#while), [iter](https://archetype-lang.org/docs/reference/instructions/control#iter)
- LIGO: [Iteration](https://ligolang.org/docs/language-basics/loops)
