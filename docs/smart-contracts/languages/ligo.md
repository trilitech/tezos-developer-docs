---
title: LIGO
last_update:
  date: 8 February 2024
dependencies:
  ligo: 1.9.2
---

LIGO is a functional programming language that is intended to be both user-friendly and to avoid patterns that make formal verification difficult.

LIGO offers two syntaxes:

- JsLIGO, a syntax that is inspired by TypeScript/JavaScript
- CameLIGO, a syntax that is inspired by OCaml

You can use either syntax and compile to Michelson to run on Tezos.

To learn LIGO, see these tutorials:

- [Deploy a smart contract with CameLIGO](/tutorials/smart-contract/cameligo)
- [Deploy a smart contract with JsLIGO](/tutorials/smart-contract/jsligo)

Here are examples of straightforward LIGO contracts.
Each contract stores an integer and provides entrypoints that increase or decrease the integer or reset it to zero.

## CameLIGO

```cameligo
type storage = int

type returnValue = operation list * storage

// Increment entrypoint
[@entry] let increment (delta : int) (store : storage) : returnValue =
  [], store + delta

// Decrement entrypoint
[@entry] let decrement (delta : int) (store : storage) : returnValue =
  [], store - delta

// Reset entrypoint
[@entry] let reset (() : unit) (_ : storage) : returnValue =
  [], 0
```

## JsLIGO

```jsligo
namespace Counter {
  type storage = int;
  type returnValue = [list<operation>, storage];

  // Increment entrypoint
  @entry
  const increment = (delta : int, store : storage) : returnValue =>
    [list([]), store + delta];

  // Decrement entrypoint
  @entry
  const decrement = (delta : int, store : storage) : returnValue =>
    [list([]), store - delta];

  // Reset entrypoint
  @entry
  const reset = (_p : unit, _s : storage) : returnValue =>
    [list([]), 0];
}
```

## Further reading

- [LIGO documentation](https://ligolang.org/docs/intro/introduction?lang=jsligo)
- [LIGO tutorials](https://ligolang.org/docs/tutorials/getting-started?lang=jsligo)
- [OpenTezos](https://opentezos.com/ligo)
