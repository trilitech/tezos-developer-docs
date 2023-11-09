---
title: Entrypoints
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 4 October 2023
---

The entrypoints of a contract represent the different ways that it can be called, similar to a method or function in many programming languages or an endpoint of an API.
The entrypoints in a Tezos smart contract must meet these specifications:

- Contracts must have at least one entrypoint.
- Each entrypoint must have a name.
- Entrypoints may accept parameters, which can be of almost any data type that Tezos supports.

Unlike functions and API endpoints, entrypoints do not return a value.
To return a value from a smart contract, see [Views](./views).

For examples of contracts, see [Examples of contracts](https://opentezos.com/smart-contracts/simplified-contracts/) on opentezos.com.

## Entrypoint logic

An entrypoint may run all kinds of logic based on:

- Its storage
- The parameters that senders pass
- Global values such as the address of the caller
- The table of constants
<!-- TODO link to Tezos library for address of caller/globals and table of contents -->

Entrypoints may not access information outside Tezos, such as calling external APIs.
If an entrypoint needs information from outside Tezos it must use oracles; see [Using and trusting Oracles](https://opentezos.com/smart-contracts/oracles/) on opentezos.com.

The only effects that an entrypoint can have are changes to its storage and new transactions that are run after the entrypoint completes.
For example, an entrypoint can call other entrypoints in its contract or entrypoints in other contracts.

## Example entrypoints

Here is a very basic example of contract with two entrypoints:

| Entrypoint | Description |
| --- | --- |
| `add` | `add` takes an `int` as a parameter and adds it to the previous value of the storage |
| `reset` | `reset` takes no parameter and replaces the storage with 0 |

<!-- TODO

## Default entrypoint behavior

From Raphael:

> When calling a contract, there is no difference between explicitly passing default as entrypoint name and passing no entrypoint at all.

> When defining and originating a contract, the entrypoints are declared as annotations in the parameter type of the contract. There may or not be a %default in this parameter type. If there is no %default annotation, the whole parameter type is the type of the default entrypoint.

> you can still have other entrypoints but they are special cases of what you can achieve by calling the default entrypoint.

For example, if the parameter type is or (unit %be_nice) (unit %be_nasty), then calling the contract with:
- Unit on the be_nice entrypoint is equivalent to
- Left Unit on the default entrypoint
and:
- Unit on the be_nasty entrypoint is equivalent to
- Right Unit on the default entrypoint.


Each contract has a special entrypoint named "default," which runs when a caller calls the contract without specifying an entrypoint, such as if the caller sends tez to the contract.
Senders do not pass parameters to this endpoint, though technically it accepts a parameter of the type `Unit`.
-->


<!-- TODO old docs say "if this entrypoint exists" ; doesn't it always exist? -->
<!--
  - `default` doesn't take any parameter (or more specifically, its parameter is of type `Unit`). If this entrypoint exists, it will be executed any time the contract is called without specifying any entrypoint or parameter. This is in particular the case when a user or a contract simply sends some tez to the contract, as you do when sending tez to a user.
-->


## Entrypoint implementation

Internally, entrypoints are implemented using a variant data type.
The contract contains a single piece of logic that branches based on the value of that variant.
In Michelson, the different values of the variant are annotated with the name of the corresponding entrypoint.
<!-- TODO link to variants -->

When calling a smart contract, senders provide either the full parameter as a variant or specify the name of the entrypoint and the corresponding parameter value.

Other languages have different ways of indicating entrypoints.
For information about coding entrypoints in specific languages, see these links:

- Michelson: [Entrypoint](https://tezos.gitlab.io/active/michelson.html#entrypoints)
- Archetype: [Entrypoint](https://archetype-lang.org/docs/reference/declarations/entrypoint)
- SmartPy: [entry_points](https://smartpy.io/docs/introduction/entry_points/)
- LIGO: [Main function and Entrypoints](https://ligolang.org/docs/advanced/entrypoints-contracts)
