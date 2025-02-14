---
title: Handling errors
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

Unlike in many programming languages, there is no exception management on Tezos.
More precisely, there is no way to catch or intercept problems and trigger some alternate behavior when problems happen.

Instead, Tezos uses _failures_, which immediately cancel operations.
When code introduces a failure, all of the operations are canceled and any completed operations are reverted, as if the initial call to the contract never happened.
To reduce the risk of bugs, there is no way to catch or prevent a failure after code introduces it.

## What happens after a failure?

On Tezos, a failure causes several things to happen:

- The execution of the contract is immediately stopped and all of its potential effects are cancelled.
- All prior effects of the contract are reverted, as if they never happened, like a database rollback.
- Any changes to the storage are reverted.
- The contract's balance is restored to what it was before execution started.

Furthermore, if the contract was called by another contract, or if it generated a call to another contract, all of these operations are cancelled as well.
The entire execution of everything, from the initial contract call by a user to the failure, is undone.

This is a double-edged sword that you must keep in mind when designing a contract:

- **positive impact**: If something doesn't happen as intended and a single failure happens somewhere during a contract call or subsequent calls it produces, nothing at all happens, and you don't end up in an inconsistent state corresponding to a partial execution.
- **negative impact**: It takes only one small issue in one of the contracts called as a consequence of your initial call for everything that you wanted to happen to be undone.
In some cases, this can mean that your contract becomes unusable.

## Automatic failures

Some instructions automatically cause a failure.
Here are a few examples:

- Causing an overflow on a `mutez` type, such as when adding or multiplying
- Trying to do a bitwise left shift or right shift of a `nat` type by more than 256
- Generating a transaction where the amount of tez transferred is greater than the balance of the contract that creates the transaction
- Generating a transaction for an address that doesn't exist

There aren't too many of these cases, as most instructions that could cause an error use options as their return values, which allows (and also forces) you to explicitly handle the error case.
For example, integer division (`EDIV`) returns an option; if the division is successful, it returns `Some` and if the code tried to divide by zero, it returns `None`.

## Raising failures

If your code encounters a problem, you can raise a failure.
The failure includes an error value that can help users or tools of a contract understand what went wrong.
See the documentation for your language for how to raise a failure.

## Error values

The error value is meant to be used off-chain as information to identify the cause of the error.
Nothing can be done with it on-chain, because nothing at all happens on-chain when an error is produced.

The typical error value is a string with an error message, such as `Error: deadline has expired`.
Internally, all kinds of error values can be produced, such as integers or records.
The types supported depend on the language.

In particular, the error value is often used when testing  contracts, where the test verifies that a specific invalid call produces a specific error.

## Implementation details

- Michelson:
  - [Failures](https://octez.tezos.com/docs/active/michelson.html#failures)
  - [Control structures](https://tezos.gitlab.io/michelson-reference/#instructions-control_structure)
  - [`FAILWITH`](https://tezos.gitlab.io/michelson-reference/#instr-FAILWITH)
- Archetype: [require](https://archetype-lang.org/docs/reference/declarations/entrypoint/#require), [fail if](https://archetype-lang.org/docs/reference/declarations/entrypoint/#fail-if)
- SmartPy: [Exceptions](https://smartpy.io/manual/syntax/exceptions)
- LIGO: [Exceptions](https://ligolang.org/docs/language-basics/exceptions)
