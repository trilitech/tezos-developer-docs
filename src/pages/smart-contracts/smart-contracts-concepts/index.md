---
id: smart-contracts-concepts
title: Smart Contract Concepts
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech)'
lastUpdated: 30th June 2023
---

## Introduction

The goal of this page is to give you an overview of all the features available for Tezos Smart Contracts, independently of any specific language. We will cover the differences between smart contracts and standard programs, including what they do and don't support. By the end of this page, you should have a general understanding of what smart contracts are and how they can be used.

If you'd like to learn more about each individual smart contract language, you can read the [Smart Contract Languages](/developers/docs/smart-contracts/smart-contract-languages/) section or if you are eager to get started you can [deploy your first smart contract](/developers/docs/tezos-basics/deploy-your-first-smart-contract/). 

## Smart Contract Features:

- [Basic data types](#basic-data-types): to manipulate numbers (int, nat), amounts of tez, strings, booleans, addresses, timestamps and bytes.
- [Storage](#storage): space allocated to each smart contract, to store data between different calls.
- [Entry points](#entry-points): the ways smart contracts can be called, like different functions of an API, with their parameters.
- [Comparing values](#comparing-values): how values of most types can be compared for equality, or &lt;, &gt;, &le;, &ge; operators.
- [Special values](#special-values): access to context information like the balance, the address of the caller or the current date/time.
- [Verifications and failures](#verifications-and-failures): ways to check that a given contract call is valid, and what happens when it's not.
- [Testing](#testing): tools and principles to test smart contracts thoroughly before deploying them, and reduce the risk of bugs.
- [Operations](#operations): code to transfer tez, call other contracts, or even generate new contracts.
- [Pairs](#pairs): the main internal way to combine multiple types into a new composed type.
- [Records](#records): a high-level language construct built on top of pairs, to create structured types that give names to each element.
- [Options](#options): a way to handle values that may sometimes be undefined.
- [Big-maps (and maps)](#big-maps-and-maps): a key-value store, to create mini-databases within your smart contracts.
- [Views](#views): a way for smart contracts to easily fetch data exposed by other smart contracts.
- [Lists](#lists): an ordered datastructure to list values of the same type, then iterate through them.
- [Sets](#sets): an ordered datastructure to keep track of which elements belong or don't belong to a set, or enumerate them.
- [Loops, iterations](#loops-iterations): ways to iterate through data structures or execute more complex algorithms.
- [Variants and unions](#variants-and-unions): a type that may hold a value that can have one of several types.
- [Lambdas](#lambdas): pieces of code that can be stored or passed as parameters, then executed by smart contracts as needed.
- [Annotations](#annotations): an internal mechanism used to assign names to values, types and entrypoints, to ease understanding and access.
- [Global table of constants](#global-table-of-constants): a way for smart contracts to share pieces of code or data (read-only), to save space and reduce costs.
- [Serialization / deserialization](#serialization--deserialization): a mechanism used to convert almost any typed data into a sequence of bytes, and vice-versa.
- [Cryptographic primitives](#cryptographic-primitives): hashing, verifying signatures, and more.
- [Tickets](#tickets): a decentralized mechanism to help contracts issue their own tokens or grant permissions.
- [Sapling](#sapling): a way to perform transactions with a higher level of privacy.
- [Timelocks](#timelocks): using cryptography to enable commit & reveal schemes, where the reveal part always happens.
- [Delegation](#delegation): the ability for a contract to delegate its own balance and benefit from baking rewards.

### Features in each language

Almost all of the features listed are available in each of the smart contract programming languages on Tezos. Some high-level languages provide a few additional features which make smart contract development easier. It should be noted that any additional high-level features are in fact built on top of everything provided by Michelson. Every high-level smart contract compiles down to Michelson before deployment on-chain.

For details about the specific syntax of each language, feel free to check the corresponding reference documentations:

- [Michelson](/developers/docs/smart-contracts/smart-contract-languages/michelson/), the low-level stack-based language that all other languages compile to.
- [Archetype](/developers/docs/smart-contracts/smart-contract-languages/archetype/), a high-level language specifically designed to write consise and elegant Tezos smart contracts.
- [SmartPy](/developers/docs/smart-contracts/smart-contract-languages/smartpy/), a python-based framework that uses meta-programming to build smart contracts.
- [LIGO](/developers/docs/smart-contracts/smart-contract-languages/ligo/), with two different flavours, [JsLIGO](/developers/docs/smart-contracts/smart-contract-languages/ligo/#js-ligo) and [CameLIGO](/developers/docs/smart-contracts/smart-contract-languages/ligo/#came-ligo).

{% callout type="note" title="VisualTez" %}
[VisualTez](https://visualtez.com/editor) allows you to visualise the fundamental logic of a smart contract without relying on any specific syntax. You can use VisualTez to help you get a visual understanding of the topics covered on this page.
{% /callout %}

## Basic data types

Tezos supports a small number of primitive data types:

### int and nat

Integers (`int`) are whole numbers that can be positive or negative.

Naturals (`nat`) are whole numbers that can only be positive or zero.

Tezos differentiates these two types to help you avoid some problems. In most cases, a `nat` should suffice, however having a differentiation between `int` and `nat` prevents problems arising from unknowingly performing operations that may not always return a positive number, causing bugs.

On Tezos, there is no hard limit to how large `nat` and `int` values can be. The only limits are those associated with the storage and gas costs. This means you never need to worry about overflow issues.

You can perform the usual arithmetic operations on `int` and `nat`:

- getting the opposite of a number (`NEG`)
- adding (`ADD`), subtracting(`SUB`) or multiplying (`MUL`) two values
- performing an integer division between two values (`EDIV`). It returns a pair with the result and the remainder.

**All** of these can apply to both `int` and `nat`, or a mix of the two. The type of the output may not be the same as the types of the inputs, and really depends on whether the output can be negative. For example, a subtraction always returns an `int`, while an addition only returns an `int` if at least one of the two operands is an `int`.

You can perform bitwise logical operations: the usual `OR`, `AND`, `XOR`, `NOT`.

You can also perform bitwise left and right shifts (`LSL` and `LSR`), with a parameter that indicates by how many bits you shift the value.

You can also compare them, see [Comparing values](#comparing-values).

Finally, you can convert an `int` to a `nat` or vice versa:

- you can take the absolute value of an `int` (`ABS`), and get a `nat`.
- you may simply convert a nat into an `int` (`INT`)
- you can convert an `int` to an `option` on a `nat` (ISNAT), see [options](#options) for details

### Why are decimal numbers not supported?

There is no floating point type (decimal numbers) on Tezos. Floating point numbers and the associated rounding errors can cause a lot of issues. Especially with Tezos protocol upgrades, floating points could be different between protocol implementations or their compiled versions on different architectures. Any difference between implementations mean that different nodes may end up with a different result for the execution of the same transactions. This would lead to inconsistencies within the blockchain, which should be avoided at all costs.

Finally, code that uses floating point values is much harder to carry out formal verification. The availability of formal verification of the protocol, its implementation and of smart contracts, is a high priority for Tezos, and supporting decimal numbers would conflict with this goal.

### mutez / tez

The `mutez` type (or micro tez) is used to store amounts of tokens from the native cryptocurrency of Tezos, the tez. One mutez is equal to one millionth of a tez.

Some languages also support the `tez` type, but the internal type is always the mutez, so you can see a value of type tez as just a shortcut for the corresponding value in `mutez`.

`mutez` values, like `nat`, are whole non-negative numbers. However, contrary to `nat`, they can't hold arbitrary large values.

More precisely, `mutez` are stored as signed 64 bit values. This means their value can only be between {% math inline=true %} 0 {% /math %} and {% math inline=true %} 2^{63} - 1 {% /math %}, which is approximately {% math inline=true %} 9.223 \cdot 10^{18} {% /math %} `mutez`, and corresponds to 9 trillion tez.

Although the actual amounts of mutez you will manipulate during transactions will be far from reaching these limits, there is still a risk of overflow, if you perform intermediate computations, such as computing the square of an amount, be careful as you might end up reaching storage limits.

You can do arithmetic operations on `mutez`:

- adding two mutez values (`ADD`)
- subtracting two `mutez` values (`SUB_MUTEZ`), which returns an `option`, as the result could be negative (which is not valid for `mutez`)
- multiplying a `mutez` value with a `nat`, to get a result in `mutez` (`MUL`)
- doing an integer division (`EDIV`)

You can also compare mutez `values` - see [Comparing values](#comparing-values).

### string

On Tezos, a `string` is a sequence of standard non-extended [ASCII](https://en.wikipedia.org/wiki/ASCII) characters.

This means there are only 128 possible values for each character, which excludes any accented letters.

Again, this is on purpose, as there is no real need for manipulating unicode characters in a smart contract, and unicode or other encoding options beyond standard ASCII cause all kinds of compatibility issues. If you need to store unicode text, store it as [bytes](#bytes).

Like `int` and `nat`, there is no limit on the size of a `string`, other than the indirect limits caused by the associated costs of storage.

There are only a few things you can do with `strings`:

- concatenate two `strings` (`CONCAT`)
- obtain the size of a `string`, as a `nat` (`SIZE`)
- extract a substring of a `string` (`SLICE`)
- compare two `strings` based on their lexicographical order ([Comparing values](#comparing-values))

### bytes

You can store any piece of information as a sequence of `bytes`, with no limits on the size, other than the indirect limits caused by the associated costs.

You may perform the same operations on `bytes` as on `strings`:

- concatenate two `bytes` values (`CONCAT`)
- obtain the size of a `bytes` value, as a `nat` (`SIZE`)
- extract a given piece of a `bytes` value (`SLICE`)
- compare two `bytes` values based on their lexicographical order (`COMPARE`). See [Comparing values](#comparing-values) section.

Furthermore, `bytes` can be used to store values of most other valid types, in an optimized binary representation.

Two operations are indeed possible:

- converting any value (of supported type) into a `bytes` value (`PACK`)
- converting a `bytes` value that encodes another type, into its original value (`UNPACK`)

This can be useful if you want to apply cryptographic functions to this data, say:

- Computing a cryptographic hash of some data, using one of several hash functions, for example `Blake2b-256`.
- Checking that a sequence of `bytes` has been signed with a given key
- Applying elliptic-curve cryptographic primitives (`BLS12-381`)

`bytes` are also used in [Sapling operations](#sapling).

### Boolean

Booleans or `bool` on Tezos work the same way as in most programming languages.

- A boolean value can be `True` or `False`.
- Comparison operators produce boolean values.
- Boolean values can be used in conditional statements or `while` loops
- The usual logic operators are supported: `AND`, `OR`, `XOR`, `NOT`.

### timestamp

Dates are very important in smart contracts, as you often need to verify that some call is made before or after a given deadline.

The `timestamp` type represents a number of seconds since January 1st 1970 i.e UNIX time. Internally, it's stored as an `int`, which means a `timestamp` can have a value before January 1st 1970, arbitrary far in the past, or arbitrary far in the future.

The special instruction `NOW`, can be used to obtain the timestamp of the current block.

The following operations are supported:

- adding a number of seconds to a `timestamp` (`ADD`)
- subtracting a number of seconds to a `timestamp` (`SUB`)
- computing the difference in seconds between the `timestamp` (`SUB`)
- comparing two `timestamps` (`COMPARE`). See [Comparing values](#comparing-values) section.

### address

On Tezos, each account, whether it is a user account (implicit account) or a contract (originated account), is uniquely identified by its `address`.

It takes the form of a `string`.

On Tezos, each account, whether it is a user account (implicit account) or a contract (originated account), is uniquely identified by its `address`. For implicit accounts, the string starts with "tz1", "tz2", "tz3" or "tz4". For contracts, the string starts with "KT1".

{% table %}
* Type of Account
* Example
---
* Implicit Account
* `tz1YWK1gDPQx9N1Jh4JnmVre7xN6xhGGM4uC`
---
* Originated Account
* `KT1S5hgipNSTFehZo7v81gq6fcLChbRwptqy`
{% /table %}

The next part of the string is a `Base58` encoded hash, followed by a 4-byte checksum.

### Other types

There are a number of other types available of Tezos, that we cover in later sections, from primitive types that are specific to cryptography, to complex types and data structures.

### Links

- Michelson: [int and nat](https://tezos.gitlab.io/active/michelson.html#operations-on-integers-and-natural-numbers), [booleans](https://tezos.gitlab.io/active/michelson.html#operations-on-booleans), [strings](https://tezos.gitlab.io/active/michelson.html#operations-on-strings), [timestamps](https://tezos.gitlab.io/active/michelson.html#operations-on-timestamps), [mutez](https://tezos.gitlab.io/active/michelson.html#operations-on-mutez).
- Archetype: [Types basics](https://archetype-lang.org/docs/language-basics/types), [Types](https://archetype-lang.org/docs/reference/types), [Arithmetic operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic)
- SmartPy: [Integers and mutez](https://smartpy.io/manual/syntax/integers-and-mutez), [Booleans](https://smartpy.io/manual/syntax/booleans), [Strings and Bytes](https://smartpy.io/manual/syntax/strings-and-bytes), [Timestamps](https://smartpy.io/manual/syntax/timestamps)
- LIGO: [numbers and tez](https://ligolang.org/docs/language-basics/math-numbers-tez), [strings & bytes](https://ligolang.org/docs/language-basics/strings-bytes), [booleans](https://ligolang.org/docs/language-basics/boolean-if-else)

## Storage

Each contract has an associated storage: some internal data that it can read and write to. Contracts can only access to their own storage. They can't access to the storage of other contracts.

On the other hand, the content of the storage of a contract, as everything on the blockchain, is public. For example, you can look at the current value of the storage of any contract, using an explorer, such as [Better Call Dev](https://better-call.dev/).

The type of the storage is fixed, as set in the code of the contract. It can be any type, from a basic primitive type such as a `nat`, to a complex type including `lists`, `sets`, `big-maps`, `variants`, etc.

The only effects of calling a contract are that it may update the value of this storage, and may generate new transactions that are executed after the execution of the code of the contract.

Here is one of the simplest possible smart contracts. It stores an `int`, and its code does only one thing: replace the storage with the new value, passed as a parameter.

Check some [examples of contracts](/developers/docs/smart-contracts/simplified-contracts/) to get a good idea of how storage can be used.

### Links

- Michelson: [Semantic of contracts and transactions](https://ligolang.org/docs/advanced/entrypoints-contracts)
- Archetype: [Storage](https://archetype-lang.org/docs/reference/declarations/storage)
- SmartPy: [Contracts](https://smartpy.io/manual/syntax/overview#contracts)
- LIGO: [Main function](https://ligolang.org/docs/advanced/entrypoints-contracts)

## Entry points

The entrypoints of a contract represent the different ways that it can be called, you can think of this as a method, or as an endpoint of an API.

### Specifications

- Each entrypoint has a name, and a parameter that can be of almost any type supported by Tezos.
- A contract always has at least one entrypoint.
- One special entrypoint is the `default` entrypoint.
  - `default` doesn't take any parameter (or more specifically, its parameter is of type `Unit`). If this entrypoint exists, it will be executed any time the contract is called without specifying any entrypoint or parameter. This is in particular the case when a user or a contract simply sends some tez to the contract, as you do when sending tez to a user.
- The code of an entrypoint may perform all kinds of computations, based on the value of the parameter, the value of the [storage](#storage), of a few [special values](#special-values), and the content of the [table of constants](#table-of-constants).
  - As described earlier, its only effects are that it may update the value of the storage of the contract, and may generate new transactions that are executed after the execution of the entrypoint. These transactions may include calls to other contracts, or to the contract itself (for example another entrypoint).

Internally, entrypoints are implemented using a variant, and the contract contains only one piece of code, that starts with some code that selects which part of the code to run, depending on the value of the variant. In Michelson, the different values of the variant are annotated with the name of the corresponding entrypoint.

When calling a smart contract, for example through the `octez-client` tool, you may either provide the full parameter as a variant, or specify the name of the entrypoint, and the corresponding parameter value.

Here is a very basic example of contract with two entrypoints:

{% table %}
* Entry Point
* Example
---
* `add`
* `add` takes an `int` as a parameter, and adds it to the previous value of the storage
---
* `reset`
*  `reset` takes no parameter, and replaces the storage with 0.
{% /table %}

Check some [examples of contracts](/developers/docs/smart-contracts/simplified-contracts/) to get a good idea of how entrypoints are used.

### Links

- Michelson: [Entrypoint](https://tezos.gitlab.io/active/michelson.html#entrypoints)
- Archetype: [Entrypoint](https://archetype-lang.org/docs/reference/declarations/entrypoint)
- SmartPy: [entry_points](https://smartpy.io/docs/introduction/entry_points/)
- LIGO: [Main function and Entrypoints](https://ligolang.org/docs/advanced/entrypoints-contracts)

## Comparing values

Two values of the same type can be compared, for a number of supported types.

- The usual comparison operators apply: `=`, `!=` (different), `<`, `>`, `≤` and `≥`.
- The syntax depends on the language used.
- Comparing two values produces a `bool`, that can then be used in many ways, including conditional instructions or as a criteria for terminating loops.

The result depends on the type. Here is the list of types that can be compared, and how their comparison behaves. Note that this includes types that are discussed later.

- `nat`, `int`, `mutez` and `timestamp` values are compared numerically.
- `strings`, `bytes`, `key_hash`, `key`, `signature` and `chain_id` values are compared lexicographically.
- `bool` values are compared so that `False` is strictly less than `True`.
- `address` values are compared as follows:
  - addresses of implicit accounts are strictly less than addresses of originated accounts.
  - addresses of the same type are compared lexicographically.
- `pair` values (and therefore `records`) are compared component by component, starting with the first component.
- `optional values` are compared as follows:
  - `None` is strictly less than any `Some x`.
  - `Some x` and `Some y` are compared as `x` and `y`.
- Values of `union` types built with `or` are compared as follows:
  - any `Left x` is smaller than any `Right y`,
  - `Left x` and `Left y` are compared as `x` and `y`,
  - `Right x` and `Right y` are compared as `x` and `y`.
- Values of type `Unit` are all equal.

In high level languages, we simply do comparisons using the different operators. In Michelson, comparisons are done using two steps: a `COMPARE` instruction that consumes two values and produces a value that is 0 if the two elements are equal, negative if the first element in the stack is less than the second, and positive otherwise. Then instructions `EQ` (equal), `NEQ` (not equal), `LT` (lower than), `GT` (greater than), `LE` (lower or equal) and `GE` (greater or equal) that consume this value, and return the corresponding `bool`.

### Links

- Michelson: [Generic comparison](https://tezos.gitlab.io/active/michelson.html#generic-comparison)
- Archetype: [Comparison operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic#a--b-7)
- SmartPy: [Comparing sp.int and sp.nat](https://smartpy.io/manual/syntax/integers-and-mutez#comparison)
- LIGO: [Comparing values](https://ligolang.org/docs/language-basics/boolean-if-else#comparing-values)

## Special values

The code of a contract can access some special values:

- `caller`: the address of the direct caller of the current entrypoint.

  This value is very often used, for two main reasons:

  - to check if whoever is calling this entrypoint is allowed to do so. For example, only a member of a DAO may call its vote entrypoint. Only the owner of an NFT may call an `addToMarket` entrypoint of a marketplace, to put that NFT on sale.
  - to assign or transfer resources to the `caller`, or store information about them. For example, a user may call a `buy` entrypoint of an NFT marketplace, and subsequently they will be assigned ownership of the NFT. This is done by storing the `caller` address in the `record` associated with the NFT.

- `source`: the address of the initiator of the sequence of calls that lead to this entrypoint. For example if we have user A, which calls a contract B, which in turn calls contract C.

  A -> B -> C

  Then during the execution of C, `source` is the address of A, while `caller` is the address of B.

{% callout type="warning" title="Access Permissions" %}
It is best practice to implement permissioning based on `caller` as opposed to `source`. This is because any implicit account can call any entrypoint on Tezos, so you would need to apply security at the `caller` level.
{% /callout %}

- `self`: the address of the contract itself. This can be useful for example, when an entrypoint should only be called by the contract itself. The check is then that `caller` = `self`.

- `balance`: this is simply the balance of the contract: the amount of `tez` (in `mutez`) including the `tez` that have been transferred to the contract by the current transaction.

- `amount`: this is the number of `tez` that has been transferred to the contract during the current transaction.

  - These `tez` are added to the `balance`, _except_ if the execution ends in a failure.
  - The name `transferred` may also be used, to identify this value, in some languages.

{% callout type="note" title="Rejecting Tez" %}
By default, an entrypoint automatically accepts any `tez` that is sent to it. It can be a good idea for some contracts to reject any transfer of `tez`, by verifying that this value is 0.
{% /callout %}

- `now`: the `timestamp` of the current block. This value is the same during the execution of all of the contracts calls from the same block.

  - Technically, this value is equal to the "actual" `timestamp` of the previous block, plus the minimum block delay (the expected duration between two blocks). This prevents the baker of the current block from manipulating this value, while keeping it predictable to everyone.

  This value is often used to check deadlines, for example, if someone has to vote before a certain date.

- `level`: the level of a block corresponds to the number of blocks in the chain since the beginning of the chain (genesis block) until that block. It increments by one for each new block.

### Links
- Michelson: [Special operations](https://tezos.gitlab.io/active/michelson.html#special-operations), [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Constants](https://archetype-lang.org/docs/reference/expressions/constants/#now)
- SmartPy: [Timestamps](https://smartpy.io/manual/syntax/timestamps)
- LIGO: [Tezos](https://ligolang.org/docs/reference/current-reference), [Tezos specific built-ins](https://ligolang.org/docs/advanced/entrypoints-contracts#tezos-specific-built-ins), [Tezos.now](https://ligolang.org/docs/advanced/timestamps-addresses#starting-time-of-the-current-block).

## Verifications and Failures

Most smart contract entrypoints start with a check on a specific condition being met. For example:

- check that the `caller` is the owner of the NFT whose ID is passed as a parameter
- check that the curent time, `now`, is before the deadline set in the storage
- check that the `amount` transferred is equal to the price of the NFT with that ID

Technically, each of these can be expressed as:

- if comparison is `False`, then `fail`

The way to write this differs from language to language, and can be done in one or more instructions and in all cases, it ends with a `failure` if the expected condition is not met.

On Tezos, a failure means that the execution of the contract is immediately stopped, and all its potential effects are cancelled. If you are familiar with databases, we can say that the effects are rolled back. It is as if they had never happened, so the storage of the contract is not changed, and neither is its `balance`.

Furthermore, if the contract was called by another contract, or if it generated a call to another contract, all these are cancelled as well. The entire execution of everything, from the initial contract call by a user to the failure, is undone.

This is a double edged sword that you need to keep in mind when designing a contract:

- **positive impact**: if something doesn't happen as intented and a single failure happens somewhere during a contract call or subsequent calls it produces, nothing at all happens, and you don't end up in an inconsistent state corresponding to a partial execution.
- **negative impact**: it only takes one small issue in one of the contracts called as a consequence of your initial call, for everything you wanted to happen to be undone. In some cases, this could mean your contract becomes unusable.

### Error values

To help users of a contract, or tools that use that contract, understand what went wrong when a failure happens, an error value can be attached to each failure.

{% callout type="note" title="Using Error Values" %}
The error value is only meant to be used off-chain, as information to identify the cause of the error. Nothing can be done with it on-chain, as nothing at all ends up happening on-chain, if an error is ever produced.
{% /callout %}

- The typical error value is simply a string, that contains an error message, for example, `Error: deadline has expired`.

- Internally, all kinds of error values can be produced, including an integer, a record, etc. This exact types supported depend on the language you are using.

In particular, the error value is often used when [testing](#testing) your contracts, where the test verifies that a specific invalid call produces a specific error.

### No exceptions

Unlike in many generic programming languages, there is no exception management on Tezos.

More precisely, there is no way to catch / intercept failures, and trigger some alternate behaviour when failures happen. A failure always means everything is cancelled, and there is nothing you can do about that.

### Automatic failures

Some instructions automatically cause a failure, if some conditions are not met.

Here are a few examples:

- Causing an overflow on a value of type `mutez`, for example when adding or multiplying
- Trying to do a bitwise left shift or right shift of a nat, by more than 256.
- Generating a transaction, where the `amount` of `tez` transferred is greater than the `balance` of the contract that creates the transaction.
- Generating a transaction, for an address that doesn't exist.

There aren't too many of these cases, as most instructions that could cause an error use options as their return values, which allows (and also forces) you to explicitly handle the error case.

This is for example the case for `ediv`, the instruction for integer division, which returns an option, with the value `None`, if you attempt to perform a division by zero.

### Links

- Michelson:
  - [Failures](https://tezos.gitlab.io/active/michelson.html#failures)
  - [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures)
  - [FAIL](https://tezos.gitlab.io/active/michelson.html#fail)
  - [Assertion macros](https://tezos.gitlab.io/active/michelson.html#assertion-macros),
- Archetype: [require](https://archetype-lang.org/docs/reference/declarations/entrypoint/#require), [fail if](https://archetype-lang.org/docs/reference/declarations/entrypoint/#fail-if).
- SmartPy: [Exceptions](https://smartpy.io/manual/scenarios/testing_contracts#exceptions).
- LIGO: [Exceptions](https://ligolang.org/docs/language-basics/exceptions).

## Testing

The hardest part, by far, of writing smart contracts, is avoiding bugs, that can either lead to assets being lost or stuck. Even though most contracts are relatively small, compared to regular software applications, but as they are executed in an adversarial environment, with high financial stakes, the potential for bugs with dramatic consequences is high.

- Due to the public nature of the blockchain, malicious users can exploit for these bugs for their own profit, at the expense of legitimate users.
- Due to the immutable nature of contracts (even with upgradeability), it is best to test your smart contracts _extensively_ before production deployment.

High-level languages come with tools to help write tests, and some testing tools can be used independently of the language used to write the smart contract. You can see for example, in [SmartPy](https://smartpy.io/manual/scenarios/overview), there is a whole syntax dedicated to testing.

### Structure of a test scenario

A test scenario usually consists of the following:

- Instructions to deploy the contract with a given initial storage and balance.
- Valid calls to entrypoints, with different parameters and context information such as:
  - the address of the `caller`
  - the amount of `tez` sent
  - the `timestamp` of the block (value of `now` during the call)
  - the `level` of the block
- Verification of the value of the storage or `balance`, after each execution of an entrypoint.
- Invalid calls to entrypoints, with the indication that they are expected to fail.
- Verification of the error caused by these invalid calls.

When executed, the test scenario is successful if all verifications are correct, and all invalid calls fail with the expected errors.

More advanced scenarios may involve a local sandbox deployment and calls to multiple contracts to test interactions.

### Programming languages for testing

The test scenarios are usually written using a full classical programming language, such as JavaScript or Python, with a library that gives you access to special features to:

- deploy contracts
- make calls to entrypoints
- manipulate all the types/values supported by Tezos
- generate testing accounts, to simulate calls from multiple accounts
- perform cryptographic computations similar to the ones available in the contract

### Rules when testing

Testing a contract thoroughly is not easy and requires experience, here are some tips to follow when getting started:

- Write the test, first without looking at the implementation of the contract, again, to avoid copying mistakes
- If possible, have another developer write the test to avoid testing semantic errors incorrectly
- Make sure to cover every possible execution path, whether it's valid or invalid
- Create many small tests, each checking something very specific, rather than a long test that tries to do many things at once
- Test around the limits. If a value should be strictly above 10, include a call with the value 10 that should fail, and a call with the value 11 that should succeed.
- Test the extremes
- See [Avoiding flaws](/developers/docs/smart-contracts/avoiding-flaws/), and make sure to follow the best practices listed there

### Links

- Michelson: [Mockup mode](https://tezos.gitlab.io/user/mockup.html).
- Archetype: [Completium test scenario](https://completium.com/docs/contract/test-scenario).
- SmartPy: [Tests and scenarios](https://smartpy.io/manual/scenarios/overview).
- LIGO: [Testing LIGO](https://ligolang.org/docs/advanced/testing).

## Operations

Remember that the execution of the code of an entrypoint can have only two effects:

- Changing the value of the storage of the contract.
- Generating new operations that will be executed after the entrypoint execution is over.

There are a number of types of operations that can be generated by a smart contract:

- Transferring `tez` to an account, or to a smart contract entrypoint to be called (`TRANSFER_TOKENS`).
- Originating a new smart contract (`CREATE_CONTRACT`).
- Setting the delegate of the current smart contract (`SET_DELEGATE`)

Only the first type is technically a `transaction`, but the terms `operation` and `transaction` are often used interchangeably in courses, documentations or tools. Don't worry too much about the difference.

{% callout type="note" title="Sending Tez" %}
Sending `tez` to an address is just a special case of calling a smart contract (via the `default` entrypoint). However, some languages have a specific syntax for simply sending `tez`, different from the syntax to call a smart contract entrypoint. One thing to remember is that a call to a smart contract always includes a transfer of a certain amount of `tez`, even if that amount is zero.
{% /callout %}

### Order of execution

The code of a contract never directly executes an `operation`, or even a transfer of `tez`. These operations are simply added to a list, and the content of this list is then pushed to a stack of operations to be performed after the execution of the code of the entrypoint is over.

The operations generated by a contract are executed in the order they have been added to the list. All the operations generated by a contract, and the operations these end up generating, are executed before any other operations previously added to the stack.

### Example Operations

Let's take an example with three simple contracts **A**, **B** and **C**:

Contract A's storage consists of `text: string`, and each contract has an entrypoint called `start()`.


### Example Operations

Let's take an example with three simple contracts **A**, **B** and **C**:

Contract A's storage consists of `text: string`, and each contract has an entrypoint called `start()`.

{% table %}

* **Entrypoint Logic** {% colspan=3 %}
---
* **Entrypoint A**
* **Entrypoint B**
* **Entrypoint C**
---
* {% list type="checkmark" %}
  * `start()`:
	  * Replace text with "Start A,"
	  * Call **B**.start()
	  * Call **C**.start()
	  * Append "End A" to text
  {% /list %}
* {% list type="checkmark" %}
  * `start()`:
      * Call **A**.add("Start B,")
	  * Call **A**.add("End B,")
  {% /list %}
* {% list type="checkmark" %}
  * `start()`:
	  * Call **A**.add("Start C,")
	  * Call **A**.add("End C,")
  {% /list %}
{% /table %}

### Operation Walkthrough

If a user calls `A.start()`, the following will happen:

- `A.start()` will execute:
  - replace its storage with `"Start A,"`
  - add operation `B.start()` to list of operations
  - add operation `C.start()` to list of operations
  - add `"End A,"` to its storage, which becomes `"Start A, End A"`
  - push the operations from the list `[B.start(), C.start()]` to the stack
    - `B.start()` ends up on top
- `B.start()` will execute and:
  - add operation `A.add("Start B,")` to list of operations
  - add operation `A.add("End B,")` to list of operations
  - push the operations from the list `[A.add("Start B,"), A.add("End B,")]` to the stack
- `A.add("Start B")` will execute:
  - replace its storage with `"Start A,End A,Start B,"`
- `A.add("End B")` will execute and:
  - replace its storage with `"Start A,End A,Start B,End B,"`
- `C.start()` will execute and:
  - add operation `A.add("Start C,")` to its list of operations
  - add operation `A.add("End C,")` to its list of operations
  - push the operations from the list `[A.add("Start C,"), A.add("End C,")]` to the stack
- `A.add("Start C")` will execute and:
  - replace its storage with `"Start A,End A,Start B,End B,Start C,"`
- `A.add("End C")` will execute and:
  - replace its storage with `"Start A,End A,Start B,End B,Start C, End C,"`

To summarize:

- All of the instructions from an entrypoint will be executed first before the operations it itself generates are executed
- If a contract A generates a call to a contract B then a call to a contract C, all the operations generated by B will be executed before contract C is executed.
- If any of these calls cause a failure, everything is cancelled.

### Links

- Michelson: [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Operation](https://archetype-lang.org/docs/reference/instructions/operation)
- LIGO: [Inter-contract invocations](https://ligolang.org/docs/advanced/entrypoints-contracts#inter-contract-invocations)
- SmartPy: [Operations](https://smartpy.io/manual/syntax/operations)

## Pairs

Primitive types can be combined to form more complex types, that can hold multiple values of different kinds. The main way to combine multiple values is to create a pair: a combination of two types.

For example, we can have a pair (int, string), that can hold a value such as `(42, "Hello")`. Languages have instructions to create pairs, or to extract the left or right value from a pair.

Pairs can be nested, which makes it possible to create more complex structures with many values of different types.

### Right combs

The most common way to nest pairs on Tezos is to create a right comb: a pair, whose second element is a pair, whose second element is a pair, etc. until we reach a simple pair of primitive types.

For example, if we want to store an int, a string, and bool using pairs, we can create this right comb: `(int, (string, bool))` i.e. `{-42; {"Hello"; True}}`

If we also want to add another int, we could use this right comb: `(int, (string, (bool, int))` i.e. `{-42; {"Hello"; {True; 21}}}`

This is a way to create a Tuple (a sequence of elements of different types), using only pairs. As right combs are used very often in Michelson, there are shorter ways to express this, such as this notation: `{42; "Hello"; True; 21}`

### Binary trees

Another way to use pairs to combine multiple values, is to use a binary tree layout, where both sides of the main pair may contain a pair, then both sides of these pairs may contain pairs, etc.

For example, for our four elements, we can use this binary tree: `{{-42; "Hello"}; {True; 21}}`

The binary tree layout has the advantage that it makes it faster to access an arbitrary element. For example if we want to access the last element, we can get the second element of the main pair, {True; 21}, then the second element of that pair, 21. If the tree is balanced, the number of operations to get to any element is
{% math inline=true %} O(\log_2 (size)) {% /math %}, whereas for a right comb, it's
{% math inline=true %} O(size) {% /math %}.

### Links

- Michelson: [Operations on pairs and right combs](https://archetype-lang.org/docs/reference/instructions/operation)
- LIGO: [Tuples](https://ligolang.org/docs/language-basics/sets-lists-tuples#tuples)
- SmartPy: [Tuples and Records](https://smartpy.io/manual/syntax/tuples-and-records)
- Archetype: [Composite types](https://archetype-lang.org/docs/language-basics/composite#tuple), [Tuple](https://archetype-lang.org/docs/reference/types#tuple)

## Records

High level languages offer a way to create types that combine multiple elements, that is much more convenient than using pairs: `records`.

With `records`, each element gets a name, which makes it much easier to use, as you don't need to remember which element means what, or even make mistakes, as you can simply identify them by their name. This is similar to a dictionary in Python, or an object in Javascript.

The way to express a `record` will depend on the language. Here, we will simply represent the type like this:

```bash
type person: record
	- age: nat
	- name: string
	- registered: bool
```

And a value of this type like this:

```bash
person: record
	- age: 21
	- name: "Laura"
	- registered: True
```

When compiled to Michelson, `records` will be represented using nested `pairs` and `annotations` (see [annotations](#annotations)) to assign a name to them.

Records can usually be nested. For example we could add an `address` as a `record`, to our Person `record`:

```bash
type person: record
- age: nat
- name: string
- registered: bool
- homeAddress: record
	- number: nat
	- street: string
	- city: string
	- zipcode: nat
	- country: string
```

### Links

- Archetype: [Record](https://archetype-lang.org/docs/language-basics/composite#record)
- LIGO: [Records](https://ligolang.org/docs/language-basics/maps-records#records)
- SmartPy: [Tuples and Records](https://smartpy.io/manual/syntax/tuples-and-records)

## Options

Sometimes, you need the ability to store a value, that is not always available. In other words, you want to be able to store the value "unknown" or "non-existent". A bit like the value NULL common in databases. Regular types don't provide this possibility, and for example, an `int` will always contain a number.

An `option` is a special type dedicated precisely to this possibility. It is like a container, that may or may not contain a value of a given type. It is possible to create an `option` type, that is associated to almost any other type.

For example, an `option` on an `int`, which type can be noted `option<int>` could either contain:

- some `int` value, for example 42. We can express this as `Some(42)`
- no value at all. We can express this as `None`

Every time you manipulate the value within an `option`, you need to check if it contains some value, or none.

The features available for options are:

- Creating an option that contains a given value (`SOME`).
- Creating an option that contains nothing (`NONE`).
- Testing if an option contains something or none (`IF_NONE`).
- Getting the value contained in an option (`IF_NONE`).

### Options instead of failures

Options are used a lot for operations that can't always provide a result. This is much better than causing a `failure`, as this offers an opportunity for the author of the smart contract to handle the situation where no result is available. Even better, it forces them to do so, which helps avoid some issues.

Here are a few examples where an `option` is used:

- Converting an `int` to a `nat` returns an `option`, which is `None` if the `int` is negative.
- Dividing (`EDIV`), returns `None` when trying to divide by zero.
- Extracting a portion of a `string` or a `bytes` value returns `None` if the extract is beyond the bounds of the `string` or `bytes`.
- Fetching a value for a given key in a `big-map` (or `map`) returns `None` if the entry doesn't exist.
- Fetching the contract that corresponds to an `address` returns `None` if the `address` is not that of a contract.
- Unpacking `bytes` returns `None` if the data is not valid.

### Recommendation

Using an `option` is convenient when you really need it, but it makes the corresponding code a bit harder to write and read, and a bit slower (costly).

When all you need to store us an initial value, before you get some data, it may be much more convenient to initialize your storage with an arbitrary value that always works.

Here are a couple of examples:

- For a `timestamp`, consider initializing it with epoch: January 1st, 1970
- For an `address`, consider initializing it with the address of the owner of the contract. Alternatively (but harder to understand without comments), you could use the special null address, `"tz1burnburnburnburnburnburnburjAYjjX"`, that will never correspond to an actual account which is used to 'burn' tokens.

### Links

- Michelson: [Operations on optional values](https://tezos.gitlab.io/active/michelson.html#operations-on-optional-values).
- LIGO: [Optional values](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#optional-values).
- SmartPy: [Options](https://smartpy.io/docs/types/options/).
- Archetype: [Options](https://archetype-lang.org/docs/reference/types#option%3CT%3E).

## Big-maps (and maps)

Smart contracts often need to store a database of `records`, where each `record` is identified by a key, and can be quickly be fetched.

For example, an NFT contract may store a database of NFTs, each identified by a unique numeric ID, and for each NFT, store some metadata i.e. its current owner.

A `big-map` is simply a key value store, that can associate values to different keys. For example, we could associate `strings` to `ints`. Here is an example of a big-map that for each number among 1, 3, 12 and 24, associates a `string` that contains its english name.

```bash
{
	Elt 1 "One";
	Elt 3 "Three";
	Elt 12 "Twelve";
	Elt 24 "Twenty four"
}
```

The main operations available for `big-maps` are:

- Creating an empty `big-map` (`EMPTY_BIG_MAP`)
- Checking if there is an entry for a given key (`MEM`)
- Accessing the entry associated with a given key (`GET`)
- Assigning an entry to a given key (`UPDATE`)
- Deleting the entry for a given key (`UPDATE`)

### Big-maps vs maps

`big-maps` are a special type of `map`, that is optimized so that it can contain very large amounts of data without necessarily causing issues with gas limits. This is because the content of `big-maps` is lazily deserialized: only the entries that are manipulated by a contract are deserialized/reserialized, as opposed to `maps` and all the other data types, where all of the content is deserialized/reserialized for each call of the contract.

This makes `big-maps` much more useful in practice than `maps`, as using `maps` can quickly cause gas consumption issues if the number of entries is getting large.

`maps` support all the features of `big-maps`, and a couple more:

- Iterating through each element of the `map`, and applying some code to it (`ITER`)
- Getting the `size` (number of elements) of the `map` (`SIZE`)

Furthermore, unlike `big-maps`, `maps` can be passed as parameters, included in `records`, or even a `big-map`.

None of these extra features would make sense for `big-maps`, as they all would require manipulating the entire content of the `big-map`, but this is the main reason we use `big-maps` in the first place.

In general, to avoid flaws related to unlimited gas consumption, we recommend considering using `big-maps` rather than `maps`, unless you really have a good reason for optimisation and take precautions.

### Example contract using big-maps

Here is a table representing an example of contract that uses two `big-maps`:

{% table %}

* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `nextID`: `int`:
  * `tokens`: `big-map`:
	  * `tokenID`: `int`
	  * `owner`: `address`
	  * `author`: `address`
	  * `metadata`: `string`
	  * `price`: `tez`
  * `ledger`: `big-map`
      * `key`: `address`
	  * `value`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `buy(tokenID)`
      * Checks that `tokens[tokenID] exists`
	  * Check that the amount transferred is correct
	  * Send 5% of the price to the author of the token
	  * If `ledger[owner]` doesn’t exist, create it with `value=0`
	  * Add the price minus 5% to ledger[owner].value
	  * Replace owner with the caller in the token metadata
	  * Increase price by 10% in the token
  * `mint(metadata, price)`
      * Create a new entry in tokens, with key `nextID`
	  * Set owner and author to the address of the caller
	  * Set metadata and price to input values
	  * Increment `nextID`
  * `claim()`
      * Verify that `ledger[caller]` exists
	  * Create a transaction to send `ledger[caller].value` to caller
	  * Delete `ledger[caller]`

  {% /list %}
{% /table %}

### Links

- Michelson: [Operations on big-maps](https://tezos.gitlab.io/active/michelson.html#operations-on-big-maps)
- Archetype: [Assets](https://archetype-lang.org/docs/reference/instructions/asset), [Map](https://archetype-lang.org/docs/language-basics/container#map)
- LIGO: [Maps](https://ligolang.org/docs/language-basics/maps-records#maps), [Big-maps](https://ligolang.org/docs/language-basics/maps-records#big-maps)
- SmartPy: [Maps and big-maps](https://smartpy.io/manual/syntax/lists-sets-and-maps#maps)

## Views

Contracts can read and write to their own storage, but can't access the storage of other contracts.`views` are a way for contracts to expose information of their choosing, to other contracts.

A view is very similar to an entrypoint, with a few differences:

- They return a value.
- Contracts can call them immediately to obtain this value. Calling a `view` doesn't produce a new `operation`. It is executed immediately, and the value can be used in the next instruction.
- The execution of a `view` doesn't have any effect other than returning that value. In particular, it doesn't modify the storage of its contract, and doesn't generate any `operation`.

### Example View

Here is an example that uses `view`. There are two example contracts. The first contract is a ledger that handles a fungible token, and keeps track of how many tokens are owned by each user.

{% table %}
* **Ledger Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledger`: `big-map`
	* Key:
      * `user`: `address`
	* Value:
	  * `tokens`: `nat`
  {% /list %}
* {% list type="checkmark" %}
  * `view getBalance(user: address)`
      * return `ledger[user].tokens`
  * `transfer(nbTokens, destination)`
      * Check that `tokens[caller].tokens >= nbTokens`
	  * Create an entry `tokens[destination]` (`value = 0` if it doesn't exist)
	  * add `nbTokens` to `tokens[destination].nbTokens`
	  * subtract `nbTokens` from `tokens[caller].nbTokens`

  {% /list %}
{% /table %}

The second contract allows a user to call an `equaliseWith` entrypoint such that if they have more tokens than another user, they can make their balances equal (plus or minus one if the total amount is odd). This contract takes advantage of the `getBalance(user)` view of the first contract: to determine the balance of each user.

{% table %}
* **Equalise Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint**
---
* `ledger`: `address`
* 
  ```javascript
	equaliseWith(destination)
	  destinationBalance = ledger.getBalance(destination)
	  totalBalance = ledger.getBalance(caller) + destinationBalance
	  targetBalance = totalBalance // 2
	  ledger.transfer(targetBalance - destinationBalance, destination)
  ```
{% /table %}


### Links

- Michelson: [Operations on views](https://tezos.gitlab.io/active/michelson.html#operations-on-views).
- Archetype: [View](https://archetype-lang.org/docs/reference/declarations/view).
- SmartPy: [Views in testing](https://smartpy.io/manual/scenarios/testing_contracts#views).
- LIGO: [On-chain views](https://ligolang.org/docs/protocol/hangzhou#on-chain-views).

## Lists

`lists` can be used to store, and iterate through, values of the same type.

- SmartPy: [Lists](https://smartpy.io/manual/syntax/lists-sets-and-maps#lists)
- Archetype: [List](https://archetype-lang.org/docs/language-basics/container#list)
- LIGO: [List](https://ligolang.org/docs/reference/list-reference)
- Inserting an element at the beginning of the `list` (`CONS`)
- Getting the first element and the rest of the `list` (`IF_CONS`)
- Iterating through the `list` (`ITER`)
- Getting the number of items in the `list` (`SIZE`)

{% callout type="note" title="High-level language list methods" %}
Some high level languages may offer additional features, such as getting an extract of a `list`. Please refer to their documentation to see what is supported.
{% /callout %}

{% callout type="warning" title="List security considerations" %}
Be very careful that the number of elements in your `list` can't be increased arbitrarily during contract calls, i.e. in the case of an attack. If you do need to store a lot of data, use `big-maps` instead.
{% /callout %}

### Links

- Michelson: [Operations on lists](https://tezos.gitlab.io/active/michelson.html#operations-on-lists)
- SmartPy: [Lists](https://smartpy.io/manual/syntax/lists-sets-and-maps#lists)
- Archetype: [List](https://archetype-lang.org/docs/language-basics/container#list)
- LIGO: [List](https://ligolang.org/docs/reference/list-reference)

## Sets

`sets` are a datastructure that contains elements of the same type, where each element can only be present once. 
A `set` is ordered, and the order is the natural order of the values in the `set` (see [Comparing values](#comparing-values)).

The main operations available on `sets` are:

- Creating an empty `set` (`EMPTY_SET`).
- Adding an element to the `set` (`UPDATE`).
- Removing an element from the `set` (`UPDATE`).
- Checking if an element is present in the `set` (`MEM`).
- Iterating through the `set`, in the order of the value of the elements (`ITER`).
- Getting the number of items in the `set` (`SIZE`).

### Links

- Michelson: [Operations on sets](https://tezos.gitlab.io/active/michelson.html#operations-on-sets)
- Archetype: [Set](https://archetype-lang.org/docs/language-basics/container#set)
- SmartPy: [Sets](https://smartpy.io/manual/syntax/lists-sets-and-maps#sets)
- LIGO: [Set](https://ligolang.org/docs/reference/set-reference)

## Loops, iterations

A smart contract may contain `loops`. They take mostly two forms:

- conditional `loops`, that keep iterating as long as a given condition is `True` (i.e. while `loops`).
- `loops` that iterate through every element of a data structure such as a `list`, a `map`, or a `set`.

{% callout type="warning" title="Loop Security Considerations" %}
Be careful when using `loops` that you don't have conditions that could allow for an attack vector where the number of iterations can be increased.
{% /callout %}

In many cases, it is possible to avoid performing `loops` in the contract itself, by doing most of the computations off-chain.

### Links

- Michelson: [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures)
- Archetype: [Asset - iteration](https://archetype-lang.org/docs/asset#iteration), [for](https://archetype-lang.org/docs/reference/instructions/control#for), [while](https://archetype-lang.org/docs/reference/instructions/control#while), [iter](https://archetype-lang.org/docs/reference/instructions/control#iter)
- LIGO: [Iteration](https://ligolang.org/docs/language-basics/loops)


## Variants and Unions

A `variant` (or `union`) is a special type of value, that can hold values of several types. For example, we could create a variant that is either an `int` or a `string`. 

* Whenever you use a `variant`, you can check which of the types it holds, and execute corresponding code. 
* `variants` are used internally, as a way to implement entrypoints.
* Another use by some high-level languages is to use them to support `enums`. An `enum` is a new type that has a list of named values that the `enum` values can take.

### Links

- Michelson: [Operations on unions](https://tezos.gitlab.io/active/michelson.html#operations-on-unions)
- LIGO: [Variant types](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#variant-types)
- SmartPy: [Variants](https://smartpy.io/manual/syntax/options-and-variants#variants)
- Archetype: [Enum](https://archetype-lang.org/docs/language-basics/composite#enum)

## Lambdas

A `lambda` is a piece of code that is also a value, that can be stored or passed as a parameter to an entrypoint.

The code of a `lambda` takes some parameters and returns a value, but doesn't have any side effects. It doesn't have access to the storage of the contract that calls it, and can't modify it. It does however have access to the [special values](#special-values) of the contract (its `balance`, the current `timestamp` etc.)

`lambdas` are mostly used for the following reasons:

- To reuse code in multiple places; if you use a high level language, this is done automatically by the compiler, and the program simply may contain different functions. If you use Michelson, you may need to use `lambdas` for this purpose.
- To make parts of a contract upgradable. A `lambda` that contains some of the behaviour of a contract may be put in the storage, and an entrypoint may be called by an admin of the contract to replace it with a new `lambda`, and therefore change the behaviour of that part of the contract. Note that the ability to upgrade the contract can cause users to worry about the trustworthiness of the contract.
- To implement a generic multi-sig or DAO contract, where a proposal takes the form of a `lambda` that performs some action, and people vote on whether to execute this action or not. 

### Links

- Michelson: [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures)
- Archetype: [apply_lambda](https://archetype-lang.org/docs/reference/expressions/builtins#apply_lambda%28f%20:%20lambda%3CA%20*%20T,%20R%3E,%20x%20:%20A%29)
- SmartPy: [Lambdas](https://smartpy.io/manual/syntax/lambdas)
- LIGO: [Anonymous functions](https://ligolang.org/docs/language-basics/functions#anonymous-functions-aka-lambdas)
- [Simplified DAO contract](/developers/docs/smart-contracts/simplified-contracts/#dao-decentralized-autonomous-organisation)


## Annotations

In the Michelson language, some values or types can be annotated with a name.

This doesn't have any effect on the code itself, but makes it possible for tools that call or analyze the code to associate a name to different values.

In particular, `annotations` are used:

- to give names to entrypoints
- to give names to parameters
- to give names to the different members of records (stored as `pairs` with `annotations`)

If you use a high level language, you are unlikely to need to manipulate `annotations` yourself.

Here is an example of Michelson code that uses `annotations`, to name the elements of its parameters: `parameter (pair (int:age) (int:height)) ;`

### Links

- Michelson: [Annotations](https://tezos.gitlab.io/active/michelson.html#annotations)

## Global table of constants

Tezos provides a feature that lets user store data in a `global table of constants`. This makes it possible to reuse code or data between contracts, and by doing so, reducing the size of these contracts. It is a write-only key value store, where anyone can add data, as long as they pay for the storage costs. When you register a piece of data in this table, you obtain its `address`, which is a Base58-encoded Blake2b hash of the binary serialization of the data.

The data can then be referenced anywhere in your code. It can be used to store code, types or data.

### Links

- Michelson: [Global constants](https://tezos.gitlab.io/active/global_constants.html)
- LIGO: [Global constants](https://ligolang.org/docs/protocol/hangzhou#global-constant)
- Archetype: [Global constants](https://archetype-lang.org/docs/cli/contract/)

## Serialization / deserialization

Between contract calls, the code of a contract, as well as its storage, are stored as a serialized sequence of `bytes`, for efficiency purposes. Every time the contract is called, the serialized code and storage are deserialized, unless the deserialized version is still cached. Similarly, after the execution of the contract, the storage needs to be serialized, to be stored again as a sequence of `bytes`.

This takes some CPU time, which means that when you call an entrypoint, on top of paying for the gas for the execution of the code of the entrypoint itself, you also need to pay for this serialization/deserialization. The cost to call a very simple entrypoint may get large, if there is a lot of data in the storage.

Remember that unlike the rest of the storage, `big-maps` are not entirely serialized/deserialized for each call. Instead, only the values that are read are deserialized, and only the values that are added or updated are serialized. This makes using `big-maps` more efficient in these cases.

### PACK and UNPACK

Tezos provides the possibility to serialize and deserialize data or code yourself:

- The `PACK` instruction takes a value of (almost) any type, and serializes it into a `bytes` value.
- The `UNPACK` instruction takes a `bytes` value, and deserializes it into its original value. As the deserialization may be impossible if the sequence of `bytes` doesn't represent valid serialized data, it returns an `option`.

Serializing your own data in this way may be useful if you want to apply operations that are only available on `bytes` value.

For example, you may want to compute the `hash` of some data. You can do so by packing it first, then applying a `hash` function such as `BLAKE2B` on the resulting `bytes` value.

### Links

- Michelson: [Operations on bytes](https://tezos.gitlab.io/active/michelson.html#operations-on-bytes)
- LIGO: [Pack and Unpack](https://ligolang.org/docs/language-basics/tezos-specific#pack-and-unpack)
- SmartPy: [Packing and Unpacking](https://smartpy.io/manual/syntax/strings-and-bytes#packing-and-unpacking)
- Archetype: [pack](https://archetype-lang.org/docs/reference/expressions/builtins#pack%28o%20:%20T%29), [unpack](https://archetype-lang.org/docs/reference/expressions/builtins#unpack%3CT%3E%28b%20:%20bytes%29)

## Cryptographic primitives

### Computing hashes

There are a number of hash functions available on Tezos.

We recommend using `BLAKE2B` by default, which computes a cryptographic hash of the value contents using the Blake2b-256 cryptographic hash function.

Other hash functions are available:

- `KECCAK`: Compute a cryptographic hash of the value contents using the Keccak-256 cryptographic hash function.
- `SHA256`: Compute a cryptographic hash of the value contents using the Sha256 cryptographic hash function.
- `SHA512`: Compute a cryptographic hash of the value contents using the Sha512 cryptographic hash function.
- `SHA3`: Compute a cryptographic hash of the value contents using the SHA3-256 cryptographic hash function.

### Checking signatures

Tezos offers the possibility to check that a given piece of data, a sequence of `bytes`, has been signed by the holder of the private key corresponding to a given public key.

The primitive `CHECK_SIGNATURE` takes as parameters the sequence of `bytes`, the `signature` and the `public key`, and returns a `boolean `that indicates if the `signature` is indeed a `signature` of that sequence of `bytes`, by the holder of ths key.

### BLS12-381 primitives

BLS12-381 is the name of an elliptic curve, a cryptographic primitive that can be used for digital `signatures` and zero-knowledge proofs.

It has the particularity of being pairing-friendly, which makes it possible to create short digital `signatures` that can be efficiently aggregated. It can also be used for identity-based cryptography, single-round multi-party key exchanges, or and efficient polynomial commitment schemes such as KZG commitments.

### Links

- Michelson: [Cryptographic primitives](https://tezos.gitlab.io/active/michelson.html#cryptographic-primitives), [BLS12-381 primitives](https://tezos.gitlab.io/active/michelson.html#bls12-381-primitives)
- LIGO: [Crypto](https://ligolang.org/docs/reference/crypto-reference)
- Archetype: [Blake2b and related](https://archetype-lang.org/docs/reference/expressions/builtins#blake2b%28b%20:%20bytes%29), [Elliptic curves](https://archetype-lang.org/docs/language-basics/crypto#elliptic-curves).
- SmartPy: [Cryptography](https://smartpy.io/manual/scenarios/cryptography#cryptography)
- Taquito: [Signing data](https://tezostaquito.io/docs/signing/)

## Tickets

A `ticket` is a special type of data type that includes security mechanisms that make it very suitable for issuing new tokens or grant portable permissions.

A `ticket` contains three pieces of information:

- The **address** of the contract that created it, the **ticketer**.
- Some **data**, with a type and value assigned by the contract. We call it the **wrapped value**, or the **payload** of the `ticket`.
- An **amount**, in the form of a natural number.

A `ticket` has a type, which is based on the type of the payload. For example a `string ticket` is a `ticket` whose payload is of type `string`.

All this information is public, and in particular, can be read by any contract holding the `ticket`.

There are three main features at the core of `tickets`, each associated with one of these three components:

### 1. Guaranteed origin

The first feature is that a `ticket` provides a mechanism that guarantees that it has indeed been created by the contract whose address it contains.

Only the contract itself may issue `tickets` that reference it as its creator.

In particular, a `ticket` can't be duplicated, it can only be stored or passed as a parameter in a call to an entrypoint, in such a way that there is only ever one existing copy of it.

If a contract A calls a contract B, passing a `ticket` as parameter, contract A loses any access to this `ticket`. This means the `ticket` is transferred to contract B. Note that a `ticket` can't be transferred to an implicit account, since the transfer needs to be done through an entrypoint that takes a `ticket` of the right type, as parameter.

### 2. Immutability of the wrapped value

The data stored in a `ticket`, the **wrapped value**, can't be changed after the creation of the `ticket`, even by the contract that created it.

### 3. Splitting and joining tickets

This feature is about the amount attached to a `ticket`.

The contract that creates the `ticket` sets the initial amount to any natural number it chooses. From then on, this amount may only be changed by performing the two following instructions:

- `SPLIT_TICKET`: taking a `ticket`, and splitting it into two `tickets`. Both new `tickets` share the same ticketer address and payload, but the amount of the initial `ticket` is split between the two. The initial `ticket` is destroyed.
- `JOIN_TICKETS`: taking two `tickets` that have the exact same ticketer address and payload, and combining them into a single `ticket`, still with the same ticketer address and payload, joining the amount. The two initial `tickets` are destroyed. 

These two instructions can be performed by any contract currently holding the `tickets` that are to be split or joined.

A contract may create an initial single `ticket` with a large amount, for example 1000, transfer it to another contract through a simple contract call, and by doing so, forfeiting any control over it. Through multiple split and join operations and passing the resulting `tickets` as parameters to other contracts, we may end up in a situation where hundreds of `tickets` exist, all with the same ticketer and payload, but held by many different contracts. If we compute the sum of the amounts of all these `tickets`, it will always be 1000.

{% callout type="note" title="Differentiating Tickets" %}
The contract at the origin of the initial `ticket` may, at any time, create another `ticket` with the exact same value, and the amount of its choice. After more splits and transfers of this new `ticket`, there would there be no way, at least on-chain, to differentiate `tickets` coming from this newly issued `ticket`, and `tickets` coming from the original one.
 This means it's important to verify the part of the contract that mints `tickets`, before trusting them.
{% /callout %}


### Benefits of tickets used as tokens

The key benefit of `tickets` is that they continue existing independently of the contract that issued them.  This is very different from how tokens are usually managed, for example when using the FA 1.2 or FA 2 standards. Such tokens are fully under the control of the issuing contract, and for example, transferring such a token may only be done by calling the smart contract that issued it. Wrapping can be used as a way to go around this, but this is not technically transferring the token itself. This helps bring extra trust in the value of the tokens represented by the `tickets`, as there is no risk of the tokens suddenly becoming unusable if the issuing contract fails. It basically increases the decentralization of tokens, and make them behave a little more like the native tez token, but with many more features and additional trust.

### Operations on tickets

The operations available on a `ticket` are limited to the following:

- Creating a new `ticket`, with a given content and amount, and the current contract as the ticketer (`TICKET`).
- Reading a `ticket`, which returns the three values contained in the ticket, plus the ticket itself (`READ_TICKET`).
- Splitting a `ticket` into two tickets with the same content and ticketer, but splitting the amount (`SPLIT_TICKET`).
- Joining two `tickets` that have the same content and ticketer, into a new ticket with total amount (`JOIN_TICKETS`).

### Links

- Michelson: [Operations on tickets](https://tezos.gitlab.io/active/michelson.html#operations-on-tickets)
- LIGO: [Tickets](https://ligolang.org/docs/reference/current-reference#tickets)
- Archetype: [create_ticket and related](https://archetype-lang.org/docs/reference/expressions/builtins/#create_ticket%28s%20:%20T,%20n%20:%20nat%29)
- SmartPy: [Tickets](https://smartpy.io/manual/syntax/tickets)

## Timelocks

A `timelock` is a cryptographic primitive that can be used as part of a **commit & reveal** scheme, to provide a guarantee that the information associated to the commit is eventually revealed.

### Classical commit & reveal scheme

Commit & reveal is a scheme that consists of two steps, involving one or more participants:

- Before a set deadline, each participant makes a decision, then publishes a **commitment**, a proof that they have taken a decision that they won't be able to change. The proof often takes the form of a hash of the data that corresponding to the decision.
- After the deadline, each participant reveals the data corresponding to their commitment. Other participants can check that the hash of this data indeed corresponds to their previous commitment.

This scheme makes it possible to prove that a certain decision was taken before some information was revealed. This information may be the decision of other participants, or some external independent information.

As an example, imagine that two players want to play the game [rock, paper, scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors) via a smart contract. As it is impossible to force and verify that the two players reveal their choice between rock, paper or scissors simultaneously, they can use a **commit & reval** scheme to do so.

During the first step, they pick their choice, identified by a number from 1 to 3, put it in a pair with some random data, compute a hash of the result. This hash is the commitment, that they can then send to the contract.

Once both players have sent their commitment, they can then reveal: send the actual data to the contract, including the random data. The contract can verify that the hash of this data matches the previous commitment. Once the two players have revealed their data, the smart contract can determine the outcome of the game round and distribute rewards accordingly.

### Not Revealing

One issue with the classical commit & reveal scheme, that arises in numerous use cases, is that once the first step is closed, and some information is revealed, for example the data from other participants, one participant may find it advantageous to not reveal at all, if it doesn't benefit them to do so. Why reveal if it will only make you lose? For some use cases, this can ruin the whole process.

In some cases, having a financial incentive, such as a number of tokens people deposit along with their commitments, that they get back once they reveal, can be sufficient to address the issue.

However in some other cases, a financial incentive may not be sufficient by itself, for example when the potential benefit of not revealing far exceeds what would be reasonable to request as a deposit. This is in particular true when multiple participants can team up and each decide on revealing or not, to benefit the team as a whole.

### Forcing the reveal with a time lock

A time lock is a way to produce a commitment using a cryptographic algorithm, that makes it possible to eventually force the reveal.

Instead of using a hash, the data is encrypted, using an encryption method that can be cracked with a known algorithm, given enough time.

The particularity is that the amount of time it takes to crack it is bounded. We can estimate the amount of time it takes for a regular computer to crack it, as well as the amount of time it would take for the fastest possible dedicated hardware. The algorithm used to crack it can't be parallelized, which means there is a limit to how much power you can throw at it. This range of time can be increased or decreased, depending on the number of iterations used to encrypt the data.

Let's say for example that you encrypt the data in a time lock, so that you know it will take between 10 minutes and 10 hours to decrypt, depending on what type of hardware is being used. You could have a commit phase that is opened during less than 10 minutes. This makes sure that no one can decrypt anyone's commitment while the commit phase is still open.
Once the reveal phase starts, you could give a few minutes for everyone to reveal their data. If a participant doesn't reveal, you set a financial reward for anyone else who manages to crack the encryption and reveal the data. Eventually, the data will be revealed,  and so there is no positive incentive for the participant not to reveal: they would lose their deposit when someone else reveals for them. This acts as a deterrent, and in practice it becomes very unlikely that someone doesn't reveal and forces someone to use some computing resources to do it for them. Overall, timelocks make commit and reveal schemes effective in many additional use cases.

Some use cases involve collectively generating a random value, or preventing [BPEV attacks](/developers/docs/smart-contracts/avoiding-flaws/#6-not-protecting-against-bots-bpev-attacks).

### Links:

- Michelson: [Operations on timelock](https://tezos.gitlab.io/active/michelson.html#operations-on-timelock)
- Archetype: [Timelock](https://archetype-lang.org/docs/language-basics/crypto#timelock)

## Sapling

Sapling is a protocol that enables transactions of fungible tokens, whilst increasing privacy. The transactions are hid from public, but they can be made available to specific entities to comply with regulations. 

The key steps are as follows:

- A **shielded pool** is created within a contract which a number of users can call to perform transactions whilst keeping details private.
- These users then send tokens to this shielded pool. We say that they **shield their tokens**. This information is public.
- Users then perform **shielded transactions**, in such a way that the amount, sender of receiver of each transactions are not revealed publicly. Only the origin and destination of each transaction have access to these information.
- Later, users may get some or all of their tokens out of the pool by **unshielding their tokens**. This operation is public as well.

If a regulator needs access to the transactions of a user, this user may share a **viewing key**, that gives access to all the transactions made by this user.

Note that using the sapling protocol in a **shielded pool** and expecting a high degree of privacy requires taking a number of precautions, including:

- Making sure there are enough members in the pool. For example, if there are only two members, it becomes very easy to identify the source and destinations of transactions.
- Adding dummy transactions, or dummy inputs and outputs of transactions, to hide the actual number of parties involved in each transaction.
- Making sure to use shielded tokens in multiple transactions. If Alice shields exactly 16.32 tokens and Bob later unshields exactly 16.32 tokens, this is traceable.
- Being careful about information that can be deduced from the timing of transactions.

The internals of `sapling` are quite technical. The system is based on an UTXO (bitcoin-like) transaction system, where each transaction consumes some unspent output, and produces new unspent outputs. A system of cryptographic commitments used in place of public amounts and addresses, that can then be "consumed" using a system of nullifiers. All this makes use a mix of cryptographic tools, including SNARKs, incremental Merkle trees and Diffie-Hellman key exchanges.

### Links

- Michelson: [Sapling integration](https://tezos.gitlab.io/active/sapling.html)
- Archetype: [Sapling](https://archetype-lang.org/docs/language-basics/crypto#sapling)
- LIGO: [Sapling](https://ligolang.org/docs/reference/current-reference#sapling)

## Delegation

Placing your `tez` in a smart contract means you can't stake them towards baking, or  delegate them to get rewards. However, the smart contract itself has the possibility of delegating the `tez` it holds, and either distributing the rewards to the original owners of the tez, or simply keeping them in its own balance for other purposes.

To manage this, there are a couple of features you can implement in a smart contract:

- Setting the delegate: simply set, update or remove the address of the baker you want the contract to delegate its `tez` to (`SET_DELEGATE`).
- Obtaining the voting power of a contract (a delegate), which is based on its total staking balance as computed at the beginning of the voting period (`VOTING_POWER`).
- Obtaining the total voting power of all contracts (`TOTAL_VOTING_POWER`).

In practice, both the voting power of a contract and the total voting power of all contracts are expressed as a number of `mutez`, but this may change with time as the protocol evolves.

### Links

- Michelson: [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Total voting power](https://archetype-lang.org/docs/reference/expressions/constants#total_voting_power), [Voting power](https://archetype-lang.org/docs/reference/expressions/builtins#voting_power%28k%20:%20key_hash%29), [set_delegate](https://archetype-lang.org/docs/reference/expressions/builtins#set_delegate%28opkh%20:%20option%3Ckey_hash%3E%29).
- SmartPy: [Operations](https://smartpy.io/manual/syntax/operations).
