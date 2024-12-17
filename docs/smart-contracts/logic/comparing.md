---
title: Comparing values
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 4 October 2023
---

The ways that you can compare values depends on the types of those values.

Many types allow the usual comparison operators: `=`, `!=`, `<`, `>`, `≤` and `≥`.
The syntax depends on the language.
Comparing values in this way produces a Boolean type that you can use in conditional instructions or to continue or terminate loops.

How values are compared depends on the type of the values:

- `nat`, `int`, `mutez` and timestamp values are compared numerically.
- Strings, `bytes`, `key_hash`, `key`, `signature` and `chain_id` values are compared lexicographically.
- Boolean values are compared so that false is strictly less than true.
- Address are compared as follows:
  - Addresses of user accounts are strictly less than addresses of smart contracts.
  - Addresses of the same type are compared lexicographically.
- Pair values (and therefore records) are compared component by component, starting with the first component.
- Options are compared as follows:
  - `None` is strictly less than any `Some`.
  - `Some x` and `Some y` are compared as `x` and `y`.
- Values of `union` types built with `or` are compared as follows:
  - any `Left x` is smaller than any `Right y`,
  - `Left x` and `Left y` are compared as `x` and `y`,
  - `Right x` and `Right y` are compared as `x` and `y`.
- Values of type `Unit` are all equal.

In Michelson, comparisons are done in two steps:

1. A `COMPARE` instruction consumes the values and produces a value that is 0 if the two elements are equal, negative if the first element in the stack is less than the second, and positive otherwise.
1. The instructions `EQ` (equal), `NEQ` (not equal), `LT` (lower than), `GT` (greater than), `LE` (lower or equal) and `GE` (greater or equal) consume this value and return the corresponding Boolean value.

### Implementation details

- Michelson: [Generic comparison](https://tezos.gitlab.io/active/michelson.html#generic-comparison)
- Archetype: [Comparison operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic#a--b-7)
- SmartPy: [Comparison](https://smartpy.io/manual/data-types/integers-and-mutez#comparison)
- LIGO: [Comparing values](https://ligolang.org/docs/language-basics/boolean-if-else#comparing-values)
