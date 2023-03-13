---
id: introduction
title: Introduction
slug: /archetype
authors: Benoit Rognier
---

[Archetype](https://archetype-lang.org) is an elegant generic-purpose language to develop Smart Contracts on the Tezos blockchain.

⚡️ It supports all Michelson features, but also provides exclusive high-level features for a precise and concise source code, that make contracts easier to develop, read and maintain.

It also enables formal verification of contracts by transcoding to the [Why3](http://why3.lri.fr/) language.

[How to install Archetype.](https://archetype-lang.org/docs/installation)

## Business logic

Besides standard [Michelson](/michelson) types, Archetype provides `rational`, `date` and `duration` types to make business logic easy to express.

```archetype
archetype pay_with_penalty(holder : address, cost : tez, deadline : date)

entry pay () {
  const penalty = now > deadline ? 7% * (now - deadline) / 1d : 0;
  transfer ((1 + penalty) * cost) to holder
}
```

The `pay` entry point applies a penalty fee to the value transferred to _holder_, of 7% per day beyond the deadline .

[Learn more about Rationals in Archetype...](https://archetype-lang.org/docs/reference/types/#rational)

## Explicit execution conditions

Archetype provides a specific syntax to establish execution conditions so that the contract is easy to read and check.

```archetype
archetype exec_cond_demo(admin : address, value : nat)

entry set_value (v : nat) {
  called by admin
  require {
    r1: transferred > value otherwise "INSUFFICIENT_TRANSFERRED_AMOUNT";
    r2: now < 2023-01-01    otherwise "TOO_LATE";
  }
  effect { value := v; }
}
```

The `set_value` entry
point only executes if the sender is _admin_, if the transferred amount is greater than _value_, and if it is called before 2022.

 [Learn more about the sections of an Archetype contract...](https://archetype-lang.org/docs/reference/declarations/entrypoint#sections)

## Rich Storage API

The exclusive `asset` data container provides a rich API to access and manipulate collections of records:
* `add`, `addupate`, `remove`, `removeif`
* `contains`, `get`, `nth`
* `count`, `sum`
* `sort`, `select`
* `head`, `tail`
* ...

```archetype
archetype asset_demo

asset vehicle {
  vin         : string;
  nb_repairs  : nat  = 0;
}

entry incr(n : nat) {
  vehicle.select(the.nb_repairs = n).update_all({ nb_repairs += 1 })
}
```
The `incr` entry point increments the `nb_repairs` field of vehicles with a number of repairs equal to `n`.

[Learn more about assets...](https://archetype-lang.org/docs/asset)

## State Machine

With Archetype, it is possible  to design the contract as a state machine. Transitions may have guard conditions (like _initialize_) and effect on the storage (like _terminate_).

```archetype
archetype state_machine_demo(value : tez, holder : address)

states =
| Created initial
| Initialized

transition initialize () {
  from Created to Initialized
  when { transferred > value }
}
```

State machines help make the overall process clear and transparent.

[Learn more about state machines...](https://archetype-lang.org/docs/statemachine)

## Formal Specification

Archetype provides a full-featured specification language for contract invariants and entry point postconditions.

```archetype
specification entry repair_oldest () {
  postcondition p1 {
    0 <= vehicle.sum(nbrepairs) - before.vehicle.sum(nbrepairs) <= 3
  }
}
```

Postcondition `p1` of `repair_oldest` entry point specifies that the difference between the total number of repairs after the entry point's execution and before, is less or equal to 3.
