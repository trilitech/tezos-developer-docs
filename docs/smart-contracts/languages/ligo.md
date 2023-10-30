---
title: Ligo
lastUpdated: 29th June 2023
---

LIGO is a functional programming language that is intended to be both user-friendly and to avoid patterns that make formal verification difficult.

LIGO offers two syntaxes:

- JsLIGO, a sytax that is inspired by TypeScript/JavaScript
- CameLIGO, a syntax that is inspired by OCaml

You can use either syntax and compile to Michelson to run on Tezos.

To learn LIGO, see these tutorials:

- [Deploy a smart contract with CameLIGO](../../tutorials/smart-contract/cameligo)
- [Deploy a smart contract with jsLIGO](../../tutorials/smart-contract/jsligo)

Let's define a LIGO contract in the two flavours above.

## CameLIGO

```
type storage = int

type parameter =
  Increment of int
| Decrement of int
| Reset

type return = operation list * storage

let main (action, store : parameter * storage) : return =
  [],
  (match action with
     Increment n -> store + n
   | Decrement n -> store - n
   | Reset       -> 0)
```

## JsLIGO

```
type storage = int;

type parameter =
  ["Increment", int]
| ["Decrement", int]
| ["Reset"];

type return_ = [list<operation>, storage];

let main = (action: parameter, store: storage) : return_ => {
  return [
    list([]),
    match(action, {
      Increment: n => store + n,
      Decrement: n => store - n,
      Reset:     ()       => 0
    })
  ];
};
```

This LIGO contract accepts the following LIGO expressions: `Increment(n)`, `Decrement(n)` and `Reset`. Those serve as `entrypoint` identification.

## Further reading

- [LIGO documentation](https://ligolang.org/docs/intro/introduction?lang=jsligo)
- [LIGO tutorials](https://ligolang.org/docs/tutorials/getting-started?lang=jsligo)
- [OpenTezos](https://opentezos.com/ligo)

