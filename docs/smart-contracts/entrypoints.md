---
title: Entrypoints
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 26 December 2023
---

The entrypoints of a contract represent the different ways that it can be called, similar to a method or function in many programming languages or an endpoint of an API.
The entrypoints in a Tezos smart contract must meet these specifications:

- Contracts must have at least one entrypoint.
- Each entrypoint must have a name.
- Entrypoints may accept parameters, which can be of almost any data type that Tezos supports.

Unlike functions and API endpoints, entrypoints do not return a value directly to the caller.
To return a value from a smart contract, you can use one of these methods:

- Use [Views](./views)
- Include a callback parameter that sends information to another smart contract, as in the `getAllowance`, `getBalance`, and `getTotalSupply` entrypoints of [FA1.2](../architecture/tokens/FA1.2) contracts

For an example of a simple contract, see the tutorial [Create a smart contract](../tutorials/smart-contract).

For examples of more complex contracts, see [Examples of contracts](https://opentezos.com/smart-contracts/simplified-contracts/) on opentezos.com.

## Entrypoint logic

An entrypoint may run logic based on:

- The contract storage
- The parameters that senders pass
- Transaction context values such as the address of the caller
- The table of constants
<!-- TODO link to Tezos library for address of caller/globals and table of contents -->

Entrypoints cannot access information outside of Tezos, such as calling external APIs.
If an entrypoint needs information from outside Tezos it must use oracles; see [Using and trusting Oracles](https://opentezos.com/smart-contracts/oracles/) on opentezos.com.

The only effects that an entrypoint can have are changes to its storage and new operations that are run after the entrypoint completes.
An entrypoint can call other entrypoints in its contract or entrypoints in other contracts.

## Example entrypoints

The contract in the tutorial [Create a smart contract](../tutorials/smart-contract) has three entrypoints:

| Entrypoint | Description |
| --- | --- |
| `increment` | `increment` takes an `int` as a parameter and adds it to the previous value of the storage |
| `decrement` | `decrement` takes an `int` as a parameter and subtracts it from the previous value of the storage |
| `reset` | `reset` takes "Unit" (no value) as a parameter and sets the storage to 0 |

## Implementation details: the default entrypoint

Even though your higher-level code may have separate codeblocks for each entrypoint, the compiled Michelson code uses a single codeblock with a single entrypoint, known as the default entrypoint.
This default entrypoint uses the parameter that clients pass to decide which code to run.

In most cases, developers can ignore the default entrypoint and imagine that the compiled Michelson code has multiple entrypoints like the higher-level code.
However, in some cases, you may need to consider how the contract actually decides which code to run and how clients trigger this code.

For example, when you compile the contract in the tutorial [Create a smart contract](../tutorials/smart-contract) to Michelson, its first line defines the parameter type that the contract accepts:

```
parameter (or (unit %reset) (or (int %decrement) (int %increment)))
```

To call the `reset` entrypoint, clients technically call the default entrypoint and pass the Michelson-encoded parameter `Left Unit`.
This parameter value means that the left value of the parameter type, which is annotated `%reset`, is set to the value `Unit`, which means no value.
In its logic, the compiled Michelson code uses the `IF_LEFT` command to check if the left value of the parameter is defined and if so, it runs the `reset` entrypoint code.

In this way, the following Octez client commands are equivalent; one passes `Unit` to the `reset` entrypoint and the other passes `Left Unit` to the default entrypoint:

```bash
octez-client --wait none transfer 0 from myAccount to myContract \
  --entrypoint 'reset' --arg 'Unit' --burn-cap 0.1
```

```bash
octez-client --wait none transfer 0 from myAccount to myContract \
  --arg 'Left Unit' --burn-cap 0.1
```

Developers need to know about the default entrypoint only when they encode parameters for smart contracts manually.
Most Tezos clients, including Octez and Taquito, encode parameters automatically.
Working from the previous example, they convert a call to the `increment` entrypoint with the parameter 5 as a call to the default entrypoint with the parameter `Right (Right 5)`.

Different languages have different ways of indicating entrypoints.
For information about coding entrypoints in specific languages, see these links:

- Michelson: [Entrypoint](https://tezos.gitlab.io/active/michelson.html#entrypoints)
- Archetype: [Entrypoint](https://archetype-lang.org/docs/reference/declarations/entrypoint)
- SmartPy: [entry_points](https://smartpy.io/docs/introduction/entry_points/)
- LIGO: [Main function and Entrypoints](https://ligolang.org/docs/advanced/entrypoints-contracts)
