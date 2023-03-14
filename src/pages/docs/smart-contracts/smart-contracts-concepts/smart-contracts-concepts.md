---
id: smart-contracts-concepts
title: Smart contract concepts
authors: Mathias Hiron, Nomadic Labs
---

The goal of this chapter is to give an overview of all the features available for Tezos Smart Contracts, independently of any specific language. It is not meant as a course to teach you how to program smart contracts. For this, we invite you to use the other content in the [Smart contracts module](/smart-contracts/simple-nft-contract-1), and the modules corresponding to each language.

The idea of this chapter is to make it easy for you to be aware about what is or isn't available when writing smart contracts. It doesn't intend to be a full reference and doesn't try to be exhaustive about every detail of each feature. Instead, it focuses on giving you a general understanding of what they are and how they can be used, and on making you aware of all the important aspects.

## Features in each language

Almost all of the features listed are available in each of the smart contract programming languages on Tezos. Some high-level languages provide a few additional features, to make writing contracts easier. All these extra features are however built on top of the ones listed below, as these are the only ones provided by Michelson, the low-level language that all high-level languages compile to.

For details about the specific syntax of each language, feel free to check the corresponding reference documentations:
- [Michelson](https://tezos.gitlab.io/active/michelson.html), the low-level stack-based language that all other languages compile to.
- [Archetype](https://archetype-lang.org/docs/introduction), a high-level language specifically designed to write consise and elegant Tezos smart contracts.
- [SmartPy](https://smartpy.io/reference.html), a python-based framework that uses meta-programming to build smart contracts.
- [LIGO](https://ligolang.org/docs/intro/introduction), four different syntaxes that let you write smart contracts in a style you may already be familiar with.

For each concept, we will provide links to the corresponding reference pages for each language.

**Visualtez**: it is also possible to practice writing your smart contract without learning any specific syntax, using [VisualTez](https://visualtez.com/editor), a visual programming language dedicated to creating Tezos Smart contracts. You may check VisualTez's [documentation](https://visualtez.com/docs) to understand the basics of manipulating the user interface. As there isn't really any syntax to learn with visualtez, you can start using it as long as you have a good understanding of the main Tezos smart contract features, which the present chapter tries to help you with.

### Quick access and description of each feature:

- [Basic data types](#basic-data-types): to manipulate numbers (int, nat), amounts of tez, strings, booleans, addresses, timestamps and bytes.
- [Storage](#storage): space allocated to each smart contract, to store data between different calls.
- [Entry points](#entry-points): the ways smart contracts can be called, like different functions of an API, with their parameters.
- [Comparing values](#comparing-values): how values of most types can be compared for equality, or &lt;, &gt;, &le;, &ge; operators.
- [Special values](#special-values): access to context information like the balance, the address of the caller or the current date/time.
- [Verifications / failures](#verifications--failures): ways to check that a given contract call is valid, and what happens when it's not.
- [Testing](#testing): tools and principles to test smart contracts thouroughly before deploying them, and reduce the risk of bugs.
- [Operations](#operations): code to transfer tez, call other contracts, or even generate new contracts.
- [Pairs](#pairs): the main internal way to combine multiple types into a new composed type. 
- [Records](#records): a high-level language construct built on top of pairs, to create structured types that give names to each element.
- [Options](#options): a way to handle values that may sometimes be undefined.
- [Big-maps (and maps)](#big-maps-and-maps): a key-value store, to create mini-databases within your smart contracts.
- [Views](#views): a way for smart contracts to easily fetch data exposed by other smart contracts.
- [Lists](#lists): an ordered datastructure to list values of the same type, then iterate through them.
- [Sets](#sets): an ordered datastructure to keep track of which elements belong or don't belong to a set, or enumerate them.
- [Loops, iterations](#loops-iterations): ways to iterate through data structures or execute more complex algorithms.
- [Variants / unions](#variants--unions): a type that may hold a value that can have one of several types.
- [Lambdas](#lambdas): pieces of code that can be stored or passed as parameters, then executed by smart contracts as needed.
- [Annotations](#annotations): an internal mechanism used to assign names to values, types and entry points, to ease understanding and access.
- [Global table of constants](#global-table-of-constants): a way for smart contracts to share pieces of code or data (read-only), to save space and reduce costs.
- [Serialization / deserialization](#serialization--deserialization): a mechanism used to convert almost any typed data into a sequence of bytes, and vice-versa.
- [Cryptographic primitives](#cryptographic-primitives): hashing, verifying signatures, and more.
- [Tickets](#tickets): a decentralized mechanism to help contracts issue their own tokens or grant permissions.
- [Sapling](#sapling): a way to perform transactions with a higher level of privacy.
- [Timelocks](#timelocks): using cryptography to enable commit & reveal schemes, where the reveal part always happens.
- [Delegation](#delegation): the ability for a contract to delegate its own balance and benefit from baking rewards.


## Basic data types

Tezos supports a small number of primitive data types :

### int and nat

Integers (`int`) are whole numbers that can be positive or negative.

Naturals (`nat`) are whole numbers that can only be positive or zero.

Tezos differentiates the two types to help you avoid some flaws. It is often very clear whether a given value should always be positive and therefore have a nat type. Using a specific type for these situations prevents you from unknowingly performing operations that may not always return a positive number, and would potentially cause bugs.

On Tezos, there is no hard limit to how large nat and int values can be (positively, as well as negatively in the case of ints). The only limits are those associated with the storage and gas costs. This means you never need to worry about overflow issues.

You can perform the usual arithmetic operations on ints and nats:

- getting the opposite of a number (`NEG`)
- adding (ADD), substracting(`SUB`) or multiplying (`MUL`) two values
- performing an integer division between two values (`EDIV`). It returns a pair with the result and the remainder.

All these can apply to both `int` and `nat`, or a mix of the two. The type of the output may not be the same as the types of the inputs, and really depends on whether the output can be negative. For example, a substraction always returns an `int`, while an addition only returns an `int` if at least one of the two operands is an `int`.

You can perform bitwise logical operations: the usual `OR`, `AND`, `XOR`, `NOT`.

You can also perform bitwise left and right shifts (`LSL` and `LSR`), with a parameter that indicates by how many bits you shift the value.

You can also compare them, as we will see in the [Comparing values](#comparing-values) section

Finally, you can convert an `int` to a `nat` or vice versa:
- you can take the absolute value of an `int` (`ABS`), and get a `nat`.
- you may simply convert a nat into an `int` (`INT`)
- you can convert an `int` to an `option` on a `nat` (ISNAT), see [options](#options) for details

### No decimal numbers

There is no floating point type (decimal numbers) on Tezos.

This is on purpose, as floating point numbers and the associated rounding errors can be the source of many issues.

First, using floating points in smart contracts makes it easy to create bugs.

Differences between protocol implementations or their compiled versions on different architectures, would be much more likely with floating point numbers. Any difference between implementations mean that different nodes may end up with a different result for the execution of the same transactions. This would lead to inconsistencies within the blockchain, which would be a huge problem.

Finally, code that uses floating point values is much harder to formally verify. The availability of formal verification of the protocol, its implementation and of smart contracts, is a high priority for Tezos, and supporting decimal numbers would go against this.

### mutez / tez

The `mutez` type (or micro tez) is used to store amounts of tokens from the native cryptocurrency of Tezos, the tez. One mutez is equal to one millionth of a tez.

Some languages also support the `tez` type, but the internal type is always the mutez, so you can see a value of type tez as just a shortcut for the corresponding value in `mutez`.

`mutez` values, like `nat`, are whole non-negative numbers. However, contrary to `nat`, they can't hold arbitrary large values.

More precisely, `mutez` are stored as signed 64 bit values. This means their value can only be between 0 and $2^{63} - 1$, which is approximately #9.223*10^18# `mutez`, and correspponds to 9 trillion tez.

Although the actual amounts of mutez you will manipulate during transactions will be far from reaching these limits, there is still a risk of overflow, if you perform intermediate computations, such as computing the square of an amount, which would cause an overflow if the amount is a bit more than 3000 tez. If you contract ends up computing $(3100 tez)^2$ and store the result as `tez` (or `mutez`), it will simply fail.

You can do arithmetic operations on `mutez`:
- adding two mutez values (`ADD`)
- substracting two `mutez` values (`SUB_MUTEZ`), which returns an `option`, as the result could be negative (which is not valid for `mutez`)
- multiplying a `mutez` value with a `nat`, to get a result in `mutez` (`MUL`)
- doing an integer division (`EDIV`)

You can also compare mutez `values`. See the [Comparing values](#comparing-values) section.

### string

On Tezos, a `string` is a sequence of standard non-extended [ASCII](https://en.wikipedia.org/wiki/ASCII) characters.

This means there are only 128 possible values for each character, which excludes any accented letters.

Again, this is on purpose, as there is no real need for manipulating unicode characters in a smart contract, and unicode or other encoding options beyond standard ASCII cause all kinds of compatibility issues. If you really need to store unicode text, store it as bytes.

Like `int` and `nat`, there is no limit on the size of a `string`, other than the indirect limits caused by the associated costs.

There are only a few things you can do with `strings`:
- concatenate two `strings` (`CONCAT`)
- obtain the size of a `string`, as a `nat` (`SIZE`)
- extract a substring of a `string` (`SLICE`)
- compare two `strings` based on their lexicographical order (COMPARE). See [Comparing values](#comparing-values) section.

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

Doing this can be particularly useful, if you want to apply cryptographic functions to this data:
- Computing a cryptographic hash of some data, using one of several hash functions, for example `Blake2b-256`.
- Checking that a sequence of `bytes` has been signed with a given key
- Applying elliptic-curve cryptographic primitives (`BLS12-381`)

`bytes` are also used in [Sapling operations](#sapling)

### Boolean

Booleans or `bool` on Tezos work the same way as in most programming languages.

A boolean value can be `True` or `False`.

Comparison operators produce boolean values.

Boolean values can be used in conditional statements or `while` loops

The usual logic operators are supported: `AND`, `OR`, `XOR`, `NOT`.

### timestamp

Dates are very important in Smart Contracts, as you often need to verify that some call is made before or after a given deadline.

The `timestamp` type represents a number of seconds since January 1st 1970. Internally, it's stored as an `int`, which means a `timestamp` can have a value before January 1st 1970, arbitrary far in the past, or arbitrary far in the future.

The special instruction `NOW`, can be used to obtain the timestamp of the current block.

The following operations are supported:
- adding a number of seconds to a `timestamp` (`ADD`)
- substracting a number of seconds to a `timestamp` (`SUB`)
- computing the difference in seconds between the `timestamp` (`SUB`)
- comparing two `timestamps` (`COMPARE`). See [Comparing values](#comparing-values) section.

### address

On Tezos, each account, whether it is a user account (implicit account) or a contract (originated account), is identified uniquely by its `address`.

It takes the form of a `string`.
- for implicit accounts, the string starts with "tz1", "tz2" or "tz3"
- for contracts, the string starts with "KT1"

The next part of the string is a Base58 encoded hash, followed by a 4-byte checksum.

Example of implicit account `address`: "tz1YWK1gDPQx9N1Jh4JnmVre7xN6xhGGM4uC"

Example of originated account `address`: "KT1S5hgipNSTFehZo7v81gq6fcLChbRwptqy"



### Other types

There are a number of other types available of Tezos, that we cover in later sections, from primitive types that are quite specific to cryptography or the blockchain, to complex types and data structures.

## Links

- Michelson: [int and nat](https://tezos.gitlab.io/active/michelson.html#operations-on-integers-and-natural-numbers), [booleans](https://tezos.gitlab.io/active/michelson.html#operations-on-booleans), [strings](https://tezos.gitlab.io/active/michelson.html#operations-on-strings), [timestamps](https://tezos.gitlab.io/active/michelson.html#operations-on-timestamps), [mutez](https://tezos.gitlab.io/active/michelson.html#operations-on-mutez).
- Archetype: [Types basics](https://archetype-lang.org/docs/language-basics/types), [Types](https://archetype-lang.org/docs/reference/types), [Arithmetic operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic), 
- SmartPy: [integers](https://smartpy.io/docs/types/integers/), [Mutez](https://smartpy.io/docs/types/mutez/), [Booleans](https://smartpy.io/docs/types/booleans/), [Bytes](https://smartpy.io/docs/types/bytes/), [Timestamps](https://smartpy.io/docs/types/timestamps/), [Addresses](https://smartpy.io/docs/types/contracts_addresses/)
- Ligo: [numbers and tez](https://ligolang.org/docs/language-basics/math-numbers-tez), [strings & bytes](https://ligolang.org/docs/language-basics/strings-bytes), [booleans](https://ligolang.org/docs/language-basics/boolean-if-else), 



## Storage

Each contract has an associated storage: some internal data that it can read and write to.

Contracts can only access to their own storage. They can't access to the storage of other contracts.

On the other hand, the content of the storage of a contract, as everything on the blockchain, is public. For example, you can look at the current value of the storage of any contract, using an explorer, such as [Better Call Dev](https://better-call.dev/).

The type of the storage is fixed, as set in the code of the contract. It can be any type, from a basic primitive type such as a `nat`, to a complex type including `lists`, `sets`, `big-maps`, `variants`, etc.

The only effects of calling a contract are that it may update the value of this storage, and may generate new transactions that are executed after the execution of the code of the contract.

Here is one of the simplest possible smart contracts. It stores an `int`, and its code does only one thing: replace the storage with the new value, passed as a parameter.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Code</strong></td></tr>
<tr><td>
	<ul>
		<li>value: int</li>
	</ul>
</td>
<td>
	<ul>
		<li>default(newValue: int)
			<ul>
				<li>Replace the storage with newValue.</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Check some of our [examples of contracts](/smart-contracts/simplified-contracts) to get a good idea of how the storage of contracts is used.

### Links

- Michelson: [Semantic of contracts and transactions](https://ligolang.org/docs/advanced/entrypoints-contracts)
- Archetype: [Storage](https://archetype-lang.org/docs/reference/declarations/storage)
- SmartPy: [Contracts and storage](https://smartpy.io/docs/introduction/contracts/)
- Ligo: [Main function](https://ligolang.org/docs/advanced/entrypoints-contracts)


## Entry points

The entry points of a contract represent the different ways that it can be called, a bit like different public functions of an API.

Each entry point has a name, and a parameter that can be of almost any type supported by Tezos.

A contract always has at least one entry point.

One special entry point is the `default` entry point. An entry point that doesn't take any parameter (or more specifically, its parameter is of type `Unit`). If this entry point exists, it will be executed any time the contract is called without specifying any entry point or parameter. This is in particular the case when a user or a contract simply sends some tez to the contract, as you do when sending tez to a user.

The code of an entry point may perform all kinds of computations, based on the value of the parameter, the value of the [storage](#storage), of a few [special values](#special-values), and the content of the [table of constants](#table-of-constants). As described earlier, its only effects are that it may update the value of the storage of the contract, and may generate new transactions that are executed after the execution of the entry point. These transactions may include calls to other contracts, or to the contract itself (for example another entry point).

Internally, entry points are implemented using a variant (see [variant section](#variants--unions)), and the contract contains only one piece of code, that starts with some code that selects which part of the code to run, depending on the value of the variant. In Michelson, the different values of the variant are annotated with the name of the corresponding entry point.

When calling a smart contract, for example through the `octez-client` tool, you may either provide the full parameter as a variant, or specify the name of the entry point, and the corresponding parameter value.

Here is a very basic example of contract with two entry points:
- add takes an `int` as a parameter, and adds it to the previous value of the storage
- reset takes no parameter, and replaces the storage with 0.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Code</strong></td></tr>
<tr><td>
	<ul>
		<li>value: int</li>
	</ul>
</td>
<td>
	<ul>
		<li>add(addedValue: int)
			<ul>
				<li>Replace the storage with value + addedValue.</li>
			</ul>
		</li>
		<li>reset()
			<ul>
				<li>Replace the storage with 0.</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Check some of our [examples of contracts](/smart-contracts/simplified-contracts) to get a good idea of how entry points are used.

### Links

- Michelson: [Entrypoints](https://tezos.gitlab.io/active/michelson.html#entrypoints)
- Archetype: [Entrypoint](https://archetype-lang.org/docs/reference/declarations/entrypoint)
- SmartPy: [entry_points](https://smartpy.io/docs/introduction/entry_points/)
- Ligo: [Main function and Entrypoints](https://ligolang.org/docs/advanced/entrypoints-contracts)

## Comparing values

Two values of the same type can be compared, for a number of supported types (listed below).

The usual comparison operators apply: `=`, `!=` (different), `<`, `>`, `≤` and `≥`. The syntax depends on the language used.

Comparing two values produces a `bool`, that can then be used in many ways, including conditional instructions or as a criteria for terminating loops.

The result depends on the type. Here is the list of types that can be compared, and how their comparison behaves. Note that this includes types that are presented later in this document.

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

In high level languages, we simply do comparisons using the different operators. In the lower-level Michelson language, comparisons are done using two steps: a `COMPARE` instruction that consumes two values and produces a value that is 0 if the two elements are equal, negative if the first element in the stack is less than the second, and positive otherwise. Then instructions `EQ` (equal), `NEQ` (not equal), `LT` (lower than), `GT` (greater than), `LE` (lower or equal) and `GE` (greater or equal) that consume this value, and return the corresponding `bool`.

### Links

- Michelson: [Generic comparison](https://tezos.gitlab.io/active/michelson.html#generic-comparison)
- Archetype: [Comparison operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic#a--b-7)
- SmartPy: [Comparison operators](https://smartpy.io/docs/types/comparison_operators/)
- Ligo: [Comparing values](https://ligolang.org/docs/language-basics/boolean-if-else#comparing-values)


## Special values

The code of a contract can use a small number of special values, relative to the execution context:

- `caller`: the address of the direct caller of the current entry point.

	This value is very often used, for two main reasons:
	- to check if whoever is calling this entry point is allowed to do so. For example, only a member of a DAO may call its vote entry point. Only the owner of an NFT may call an addToMarket entry point of a marketplace, to put that NFT on sale.
	- to assign or transfer resources to the `caller`, or store information about them. For example, a user may call a buy entry point of an NFT market place, and assuming they sent the right amount of tez, they will be assigned ownership of the NFT they try to buy. This is done by storing the `caller` address in the `record` associated with the NFT.

- `source`: the address of the initiator of the sequenece of calls that lead to this entry point. For example if we have a user A, that calls a contract B, that calls a contract C, that calls a contract D:

	A -> B -> C -> D
	
	Then during the execution of D, `source` is the address of A, while `caller` is the address of C.
	
	Note that it is usually a bad idea to use `source` in a contract, as a way to check if the call is allowed. Using `caller` is much safer.

- `self`: the address of the contract itself. This can be useful for example, when an entry point should only be called by the contract itself. The check is then that `caller` = `self`.


- `balance`: this is simply the balance of the contract: the number of `tez` (technically, `mutez`) that are currently owned by the contract, including the `tez` that have been transferred to the contract by the current transaction.

	Note that the `balance` never changes during the execution of the entry point, as any transactions generated by the entry point are executed after the execution of the code of the entry point is over.

- `amount`: this is the number of `tez` that have been transferred to the contract as part of the current transaction.

	The name `transferred` may also be used, to identify this value, in some languages.

	Note that by default, an entry point automatically accepts any `tez` that is sent to it. It can be a good idea for some contracts to reject any transfer of `tez`, by verifying that this value is 0, if the purpose of the entry point is not to receive `tez`.

	On Tezos (see transactions), these `tez` are added to the `balance`, except if the execution ends in a failure (see [section on failures](#verifications--failures))

- `now`: the `timestamp` of the current block. This value is the same during the execution of all of the contracts calls from the same block.

	Techincally, this value is equal to the "actual" `timestamp` of the previous block, plus 30 seconds (the expected duration between two blocks). This prevents the baker of the current block from manipulating this value, while making it as predictable by everyone.

	This value is often used to check deadlines, for exemple if someone has to vote before a certain date.
	
- `level`: the level of a block corresponds to the number of blocks in the chain since the beginning of the chain (genesis block) until that block. It increments by one for each new block.

### Links

- Michelson: [Special operations](https://tezos.gitlab.io/active/michelson.html#special-operations), [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Constants](https://archetype-lang.org/docs/reference/expressions/constants/#now), [Sections](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- SmartPy: [Global properties](https://smartpy.io/docs/general/block_properties/)
- Ligo: [Tezos](https://ligolang.org/docs/reference/current-reference), [Tezos specific built-ins](https://ligolang.org/docs/advanced/entrypoints-contracts#tezos-specific-built-ins), [Tezos.now](https://ligolang.org/docs/advanced/timestamps-addresses#starting-time-of-the-current-block).

## Verifications / failures

Most smart contract entry points start with instructions such as:

- check that this condition is met

For example:
- check that the `caller` is the owner of the NFT whose ID is passed as a parameter
- check that the curent time, `now`, is before the deadline set in the storage
- check that the `amount` transferred is equal to the price of the NFT with that ID

Technically, each of these can be expressed as:
- if comparison is `False`, then `fail`

The way to write this differs from language to language, and can be done in one or more instructions.

In all cases, it ends with a `failure` if the expected condition is not met.

On Tezos, a failure means that the execution of the contract is immediately stopped, and all its potential effects are cancelled. If you are familiar with databases, we can say that the effects are rolled back. It is as if they had never happened, so the storage of the contract is not changed, and neither is its `balance`.

Not only that, but if the contract was called by another contract, or if it generated a call to another contract, all these are cancelled as well. The entire execution of everything from the initial contract call by a user, to the failure of this contract, is undone.

This is a double edged sword with positive and negative impacts that you need to keep in mind when designing a contract:
- **positive impact**: if something doesn't happen as intented and a single failure happens somewhere during a contract call or subsequent calls it produces, nothing at all happens, and you don't end up in an inconsistent state corresponding to a partial execution.
- **negative impact**: it only takes one small issue in one of the contracts called as a consequence of your initial call, for everything you wanted to happen to be undone. In some cases, this could mean your contract becomes completely unusable.

### Error values

To help users of a contract, or tools that use that contract, understand what went wrong when a failure happens, an error value can be attached to each failure.

The typical error value is simply a string, that contains an error message, for example, "The deadline expired".

Internally, all kinds of error values can be produced, including an integer, a record, etc. This may or may not be supported by the language you are using.

The error value is only meant to be used off-chain, as information to identify the cause of the error. Nothing can be done with it on-chain, as nothing at all ends up happening on-chain, if an error is ever produced.

In particular, the error value is often used when testing your contracts, where the test verifies that a specific invalid call produces a specific error.

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

There aren't too many of these, as most instructions that could cause an error use options as their return values, which allows (and also forces) you to explicitly handle the error case.

This is for example the case for `ediv`, the instruction for integer division, which returns an option, with the value `None`, if you attempt to perform a division by zero.

### Links

- Michelson: [Failures](https://tezos.gitlab.io/active/michelson.html#failures), [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures), [FAIL](https://tezos.gitlab.io/active/michelson.html#fail), [Assertion macros](https://tezos.gitlab.io/active/michelson.html#assertion-macros), 
- Archetype: [require](https://archetype-lang.org/docs/reference/declarations/entrypoint/#require), [fail if](https://archetype-lang.org/docs/reference/declarations/entrypoint/#fail-if).
- SmartPy: [Checking conditions](https://smartpy.io/docs/general/checking_condition/).
- Ligo: [Exceptions](https://ligolang.org/docs/language-basics/exceptions).

## Testing

The hardest part, by far, of writing smart contracts, is to avoid any bugs or flaws, that can either lead to funds or other assets getting lost or stuck in a contract, or that malicious users can exploit for their own profit, at the expense of legitimate users.

Most contracts are relatively small, compared to regular software applications, but as they are executed in an adversarial environment, with very high financial (or other) stakes, the potential for bugs with dramatic consequences is high. Many entities, including bots, try to find ways go make a profit, using flaws in the smart contracts. As contracts can't easily be fixed when a bug is found, these bugs absolutely need to be detected before the contract is deployed.

For this reason, a lot of the time spend working on smart contract, is spent on testing that the contract works well in all situations.

High-level languages come with tools to help write tests, and some testing tools can be used independently of the language used to write the smart contract.

### Structure of a test scenario

A test scenario usually consists of the following:
- Instructions to deploy the contract with a given initial storage and balance.
- Valid calls to entry points, with different parameters and context information such as:
	- the address of the `caller`
	- the amount of `tez` sent
	- the `timestamp` of the block (value of `now` during the call)
	- the `level` of the block
- Verification of the value of the storage or `balance`, after each execution of an entry point.
- Invalid calls to entry points, with the indication that they are expected to fail.
- Verification of the error caused by these invalid calls.

When executed, the test scenario is successful if all verifications are correct, and all invalid calls fail with the expected errors.

More advanced scenarios may involve the deployment and calls to multiple contracts.

### Programming languages for testing

The test scenarios are usually written using a full classical programming language, such as javascript or python, with a library that gives you access to special features to:
- deploy contracts
- make calls to entry points
- manipulate all the types/values supported by Tezos
- generate testing accounts, to simulate calls from multiple accounts
- perform cryptographic computations similar to the ones available in the contract

Often, the program written to test a smart contract, is much longer than the contract itself.

### Rules when testing

Testing a contract thouroughly is not easy and requires experience, but we can list a few key rules you should follow:

- Make sure the person(s) writing the test to be different from the person(s) writing the contract, and as much as possible. Otherwise, they may simply make the same mistakes both in the contract an in the test.
- Write the test, first without looking at the implementation of the contract, again, to avoid copying mistakes.
- Make sure to cover every possible execution path, whether it's valid or invalid
- Create many small tests, each checking something very specific, rather than a long test that tries to do many things at once, a bit randomly.
- Test around the limits. If a value should be strictly above 10, include a call with the value 10 that should fail, and a call with the value 11 that should succeed.
- Test the extremes. 
- Check our [Avoiding flaws](/smart-contracts/avoiding-flaws) chapter, and make sure you follow all the best practice listed there.

### Links

- Michelson: [Mockup mode](https://tezos.gitlab.io/user/mockup.html).
- Archetype: [Completium test scenario](https://completium.com/docs/contract/test-scenario).
- SmartPy: [Tests and scenarios](https://smartpy.io/docs/scenarios/framework/).
- Ligo: [Testing Ligo](https://ligolang.org/docs/advanced/testing).

## Operations

Remember that the execution of the code of an entry point can have only two effects:
- Changing the value of the storage of the contract.
- Generating new operations that will be executed after the contract.

There are a number of types of operations that can be generated by a smart contract:
- Transfering `tez` to an account, or to a smart contract entry point to be called (`TRANSFER_TOKENS`).
- Originating a new smart contract (`CREATE_CONTRACT`).
- Setting the delegate of the current smart contract (`SET_DELEGATE`)

Only the first type is technically a `transaction`, but the terms `operation` and `transaction` are often used interchangably in courses, documentations or tools. Don't worry too much about the difference.

Note that sending `tez` to an address is only a special case of calling a smart contract. However, some languages have a specific syntax for simply sending `tez`, different from the syntax to call a smart contract entry point. One thing to remember is that a call to a smart contract always includes a transfer of a certain amount of `tez`, even if that amount may be zero.

### Order of execution

The code of a contract never directly executes an `operation`, or even a transfer of tez. These operations are simply added to a list, and the content of this list is then puhsed to a stack of operations to be performed after the execution of the code of the entry point is over.

The operations generated by a contract are executed in the order they have been added to the list. All the operations generated by a contract, and the operations these end up generating, are executed before any other operations previously added to the stack.

Let's take an example with three simple contracts A, B and C:

<table>
<tr><td colspan="2"><strong>Contract A</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Code</strong></td></tr>
<tr><td>
	<ul>
		<li>text: string</li>
	</ul>
</td>
<td>
	<ul>
		<li>start()
			<ul>
				<li>Replace text with "Start A,".</li>
				<li>Generate call to B.start()</li>
				<li>Generate call to C.start()</li>
				<li>Add "End A" to text</li>
			</ul>
		</li><br/>
	</ul>
</td>
</tr>
</table>

<table>
<tr><td colspan="2"><strong>Contract B</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Code</strong></td></tr>
<tr><td>
	<ul>
	</ul>
</td>
<td>
	<ul>
		<li>start()
			<ul>
				<li>Generate call to A.add("Start B,")</li>
				<li>Generate call to A.add("End B,")</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

<table>
<tr><td colspan="2"><strong>Contract C</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Code</strong></td></tr>
<tr><td>
	<ul>
	</ul>
</td>
<td>
	<ul>
		<li>start()
			<ul>
				<li>Generate call to A.add("Start C,")</li>
				<li>Generate call to A.add("End C,")</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>


If a user calls A.start(), the following will happen:
- A.start() will execute and :
	- replace its storage with "Start A,"
	- add operation B.start() to its list of operations
	- add operation C.start() to its list of operations
	- add "End A," to its storage, which becomes "Start A,End A"
	- push the operations from the list [B.start(), C.start()] to the stack. B.start() ends up on top.
- B.start() will execute and:
	- add operation A.add("Start B,") to its list of operations
	- add operation A.add("End B,") to its list of operations
	- push the operations from the list [A.add("Start B,"), A.add("End B,")] to the stack.
- A.add("Start B") will execute and:
	- replace its storage with "Start A,End A,Start B,"
- A.add("End B") will execute and:
	- replace its storage with "Start A,End A,Start B,End B,"
- C.start() will execute and:
	- add operation A.add("Start C,") to its list of operations
	- add operation A.add("End C,") to its list of operations
	- push the operations from the list [A.add("Start C,"), A.add("End C,")] to the stack.
- A.add("Start C") will execute and:
	- replace its storage with "Start A,End A,Start B,End B,Start C,"
- A.add("End C") will execute and:
	- replace its storage with "Start A,End A,Start B,End B,Start C, End C,"

To summarize:
- All of the instructions from an entry point will be executed before the operations it generates get executed
- If a contract A generates a call to a contract B then a call to a contract C, all the operations generated by B will be executed before contract C is executed.
- If any of these calls cause a failure, everything is cancelled.

### Links

- Michelson: [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Operation](https://archetype-lang.org/docs/reference/instructions/operation)
- Ligo: [Inter-contract invocations](https://ligolang.org/docs/advanced/entrypoints-contracts#inter-contract-invocations)
- SmartPy: [Contracts and addresses](https://smartpy.io/docs/types/contracts_addresses/), [Operations and transactions](https://smartpy.io/docs/types/operations/).

## Pairs

Primitive types can be combined to form more complex types, that can hold multiple values of different kinds.

The main way to combine multiple values is to create a pair: a combination of two types.

For example, we can have a pair (int, string), that can hold a value such as `(42, "Hello")`.

Languages have instructions to create pairs, or to extract the left or right value from a pair.

Pairs can be nested, which makes it possible to create more complex structures with many values of different types.

### Right combs

The most common way to nest pairs on Tezos is to create a right comb: a pair, whose second element is a pair, whose second element is a pair, etc. until we reach a simple pair of primitive types.

For example, if we want to store an int, a string, and bool using pairs, we can create this right comb:

	(int, (string, bool)

And for example have this value:

	{-42; {"Hello"; True}}

If we also want to add another int, we could use this right comb:

	(int, (string, (bool, int))

And have this value:
	
	{-42; {"Hello"; {True; 21}}}

This is basically a way to create a Tuple (a sequence of elements of different types), using only pairs.

As right combs are used very often in Michelson, there are shorter ways to express this, such as this notation:

	{42; "Hello"; True; 21}

### Binary trees

Another way to use pairs to combine multiple values, is to use a binary tree layout, where both sides of the main pair may contain a pair, then both sides of these pairs may contain pairs, etc.

For example, for our four elements, we can use this binary tree:

	{{-42; "Hello"}; {True; 21}}

The binary tree layout has the advantage that it makes it faster to access an arbitrary element. For example if we want to access the last element, we can get the second element of the main pair, {True; 21}, then the second element of that pair, 21. If the tree is balanced, the number of operations to get to any element is O(log<sub>2</sub>(size)), whereas for a right comb, it's O(size).

### Links

- Michelson: [Operations on pairs and right combs](https://archetype-lang.org/docs/reference/instructions/operation)
- Ligo: [Tuples](https://ligolang.org/docs/language-basics/sets-lists-tuples#tuples)
- SmartPy: [Pairs](https://smartpy.io/docs/types/pairs/)
- Archetype: [Composite types](https://archetype-lang.org/docs/language-basics/composite#tuple), [Tuple](https://archetype-lang.org/docs/reference/types#tuple)



## Records

High level languages offer a way to create types that combine multiple elements, that is much more convenient than using pairs: `records`. 

With `records`, each element gets a name, which makes it much easier to use, as you don't need to remember which element means what, or even make mistakes, as you can simply identify them by their name.

The way to express a `record` will depend on the language. Here, we will simply represent the type like this:

	type person: record
	- age: nat
	- name: string
	- registered: bool

And a value of this type like this:

	person: record
	- age: 21
	- name: "Laura"
	- registered: True

When compiled to Michelson, `records` will be represented using nested `pairs` and `annotations` (see [annotations section](#annotations)) to assign a name to them. 

Records can usally be nested. For example we could add an `address` as a `record`, to our Person `record`:

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

### Links

- Archetype: [Record](https://archetype-lang.org/docs/language-basics/composite#record).
- Ligo: [Records](https://ligolang.org/docs/language-basics/maps-records#records).
- SmartPy: [Records](https://smartpy.io/docs/types/records/).

## Options

Sometimes, you need the ability to store a value, that is not always available. In other words, you want to be able to store the value "unknown" or "non-existant". A bit like the value NULL, in databases.

Regular types don't provide this possibility, and for example, an `int` will always contain a number.

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

Options are used a lot for operations that can't always provide a result. This is much better than causing a `failure`, as this offers an opporunity for the author of the smart contract to handle the situation where no result is available. Even better, it forces them to do so, which helps avoid some issues.

Here are a few examples where an `option` is used:
- Converting an `int` to a `nat` returns an `option`, which is `None` if the `int` is negative.
- Dividing (`EDIV`), returns `None` when trying to divide by zero.
- Extracting a portion of a `string` or a `bytes` value returns `None` if the extract is beyond the bounds of the `string` or `bytes`.
- Fetching a value for a given key in a `big-map` (or `map`) returns `None` if the entry doesn't exist.
- Fetching the contract that corresponds to an `address` returns `None` if the `address` is not that of a contract.
- Unpacking `bytes` returns `None` if the data is not valid.

### Recommendation

Using an `option` is convenient when you really need it, but it makes the corresponding code a bit harder to write and read, and a bit slower (costly).

When all you need is to store an initial value, before you get some data, it may be much more convenient to initialize your storage with an arbitrary value that always works.

Here are a couple of examples:
- For a `timestamp`, consider initializing it with epoch: January 1st, 1970
- For an `address`, consider initializing it with the owner of the contract. Alternatively (but harder to undestand without comments), you could use the special null address, `"KT18amZmM5W7qDWVt2pH6uj7sCEd3kbzLrHT"`, that will never correspond to an actual account.

### Links

- Michelson: [Operations on optional values](https://tezos.gitlab.io/active/michelson.html#operations-on-optional-values).
- Ligo: [Optional values](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#optional-values).
- SmartPy: [Options](https://smartpy.io/docs/types/options/).
- Archetype: [Options](https://archetype-lang.org/docs/reference/types#option%3CT%3E).

## Big-maps (and maps)

Smart contracts often need to store a small (or not so small) database of `records`, where each `record` is identified by a key, and can be quickly be fetched.

For example, an NFT contract may store a database of NFTs, each identified by a unique numeric ID, and for each NFT, store some metadata and its current owner.

A `big-map` is simply a key value store, that can associate values to different keys. For example, we could associate `strings` to `ints`. Here is an example of a big-map that for each number among 1, 3, 12 and 24, associates a `string` that contains its english name.

	{
		Elt 1 "One";
		Elt 3 "Three";
		Elt 12 "Twelve";
		Elt 24 "Twenty four"
	}

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

Furthermore, unlike `big-maps`, `map`s can be passed as parameters, included in a `records`, or even a `big-map`.

None of these extra features would make sense for `big-maps`, as they all would require manipulating the entire content of the `big-map`, but avoiding this is the main reason we use `big-maps` in the first place.

In general, to avoid flaws related to unlimited gas consumption, we recommend considering using `big-maps` rather than `maps`, unless you realy have a good reason and take precautions.

### Example of contract using big-maps

Here is an example of contract that uses two `big-maps`, already presented in the [First contracts - first flaws](/smart-contracts/simple-nft-contract-2) chapter.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>nextID: int</li>
		<li>tokens: big-map
			<ul>
				<li>tokenID (key): int</li>
				<li>owner: address</li>
				<li>author: address</li>
				<li>metadata: string</li>
				<li>price: tez</li>
			</ul>
		</li><br/>
		<li>ledger: big-map
			<ul>
				<li>key: address</li>
				<li>value: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>buy(tokenID)
			<ul>
				<li>Checks that tokens[tokenID] exists, call it token</li>
				<li>Check that the amount transferred is equal to the price of the token</li>
				<li>Send 5% of the price to the author of the token</li>
				<li>If ledger[owner] doesn’t exist, create it with value=0</li>
				<li>Add the price - 5% to ledger[owner].value</li>
				<li>Replace owner with the caller in the token</li>
				<li>Increase price by 10% in the token</li>
			</ul>
		</li><br/>
		<li>mint(metadata, price)
			<ul>
				<li>Create a new entry in tokens, with key nextID</li>
				<li>Set owner and author to the address of the caller</li>
				<li>Set metadata and price to the value of the parameters</li>
				<li>Increment nextID</li>
			</ul>
		</li><br/>
		<li>claim()
			<ul>
				<li>Verify that ledger[caller] exists</li>
				<li>Create a transaction to send ledger[caller].value to caller</li>
				<li>Delete ledger[caller]</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Links

- Michelson: [Operations on big-maps](https://tezos.gitlab.io/active/michelson.html#operations-on-big-maps)
- Archetype: [Assets](https://archetype-lang.org/docs/reference/instructions/asset), [Map](https://archetype-lang.org/docs/language-basics/container#map)
- Ligo: [Maps](https://ligolang.org/docs/language-basics/maps-records#maps), [Big-maps](https://ligolang.org/docs/language-basics/maps-records#big-maps)
- SmartPy: [Maps and big-maps](https://smartpy.io/docs/types/maps/)

## Views

Contracts can read and write to their own storage, but can't access to the storage of other contracts.

`views` are a way for contracts to expose information of their choosing, to other contracts.

A view is very similar to an entry point, with a few differences:
- They return a value.
- Contracts can call them immediately to obtain this value. Calling a `view` doesn't produce a new `operation`. It is executed immediately, and the value can be used in the next instruction.
- The execution of a `view` doesn't have any effect other than returning that value. In particular, it doesn't modify the storage of its contract, and doesn't generate any `operation`.

### Example

Here is an example that uses a `view`.

The first contract is a ledger that handles a fungible token, and keeps track of how many tokens are owned by each user.

<table>
<tr><td colspan="2"><strong>Ledger</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>ledger: big-map<br/>
		Key:
			<ul>
			<li>user: address</li>
			</ul>
		Value:
			<ul>
			<li>tokens: nat</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>view getBalance(user: address)
			<ul>
				<li>return ledger[user].tokens</li>
			</ul>
		</li><br/>
		<li>transfer(nbTokens, destination)
			<ul>
				<li>check that tokens[caller].tokens >= nbTokens</li>
				<li>create an entry tokens[destination] with value 0, if it doesn't exist</li>
				<li>add nbTokens to tokens[destination].nbTokens</li>
				<li>substract nbTokens from tokens[caller].nbTokens</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

The second contract is a piece of code that can be called by a user that has more tokens than another, and will transfer enough tokens to that other user, so that they end up with the same amount (plus or minus one if the total amount is odd).

This second contract takes advantage of the `getBalance(user)` view of the first contract, to determine what the current balance of each user is, for this token.

<table>
<tr><td colspan="2"><strong>Equalize</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>ledger: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>equalizeWith(destination)
			<ul>
				<li>destinationBalance = ledger.getBalance(destination)</li>
				<li>totalBalance = ledger.getBalance(caller) + destinationBalance</li>
				<li>targetBalance = totalBalance // 2</li>
				<li>ledger.transfer(targetBalance - destinationBalance, destination)</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Links

- Michelson: [Operations on views](https://tezos.gitlab.io/active/michelson.html#operations-on-views).
- Archetype: [View](https://archetype-lang.org/docs/reference/declarations/view).
- SmartPy: [Views](https://smartpy.io/docs/general/views/).
- Ligo: [On-chain views](https://ligolang.org/docs/protocol/hangzhou#on-chain-views).


## Lists

`lists` can be used to store, then iterate through a number of values of the same type.

The main operations available on `lists` are:
- Creating an empty `list` (`NIL`)
- Inserting an element at the beginning of the `list` (`CONS`)
- Getting the first element and the rest of the `list` (`IF_CONS`)
- Iterating through the `list` (`ITER`)
- Getting the number of items in the `list` (`SIZE`)

Note that high level languages may offer additional features, such as getting an extract of a `list`.

Be very careful when using `lists`, that its number of elements can't be increased too much as the contract keeps being used, including in the case of an attack. If you need to store a lot of data, use `big-maps` instead.

### Links

- Michelson: [Operations on lists](https://tezos.gitlab.io/active/michelson.html#operations-on-lists).
- SmartPy: [Lists](https://smartpy.io/docs/types/lists/).
- Archetype: [List](https://archetype-lang.org/docs/language-basics/container#list).
- Ligo: [List](https://ligolang.org/docs/reference/list-reference).

## Sets

`sets` are a datastructure that contains elements of the same type, where each element can only be present once.

A `set` is ordered, and the order is the natural order of the values in the `set` (see the [Comparing values](#comparing-values) section).

The main operations available on `sets` are:
- Creating an empty `set` (`EMPTY_SET`).
- Adding an element to the `set` (`UPDATE`).
- Removing an element from the `set` (`UPDATE`).
- Checking if an element is present in the `set` (`MEM`).
- Iterating through the `set`, in the order of the value of the elements (`ITER`).
- Getting the number of items in the `set` (`SIZE`).

### Links

- Michelson: [Operations on sets](https://tezos.gitlab.io/active/michelson.html#operations-on-sets).
- Archetype: [Set](https://archetype-lang.org/docs/language-basics/container#set).
- SmartPy: [Sets](https://smartpy.io/docs/types/sets/).
- Ligo: [Set](https://ligolang.org/docs/reference/set-reference).

## Loops, iterations

A smart contract may contain `loops`. They take mostly two forms:
- conditional `loops`, that keep iterating as long as a given condition is `True` (while `loops`).
- `loops` that iterate through every element of a data structure such as a `list`, a `map`, or a `set`.

Be very careful when using `loops`, that the number of iterations may not increase too much as the contract is being used, or through an attack.

In many cases, it is possible to avoid performing `loops` in the contract itself, by doing most of the computations off-chain.

### Links

- Michelson: [Control sturctures](https://tezos.gitlab.io/active/michelson.html#control-structures).
- Archetype: [Asset - iteration](https://archetype-lang.org/docs/asset#iteration), [for](https://archetype-lang.org/docs/reference/instructions/control#for), [while](https://archetype-lang.org/docs/reference/instructions/control#while), [iter](https://archetype-lang.org/docs/reference/instructions/control#iter).
- Ligo: [Iteration](https://ligolang.org/docs/language-basics/loops).
- SmartPy: [For statement](https://smartpy.io/docs/general/control_statements/#for-statement), [While statement](https://smartpy.io/docs/general/control_statements/#while-statement).


## Variants / unions

A `variant` (or `union`) is a special type of value, that can hold values of any of several types.

For example, we could create a variant that is either an `int` or a `string`.

Whenever you use a `variant`, you can check which of the types it holds, and execute corresponding code.

`variants` are used internally, as a way to implement entry points.

Another use by some high-level langauges is to use them to support `enums`. An `enum` is a new type that has a list of named values that the `enum` values can take.

### Links

- Michelson: [Operations on unions](https://tezos.gitlab.io/active/michelson.html#operations-on-unions).
- Ligo: [Variant types](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#variant-types).
- SmartPy: [Variants](https://smartpy.io/docs/types/variants/).
- Archetype: [Enum](https://archetype-lang.org/docs/language-basics/composite#enum).

## Lambdas

A `lambda` is a piece of code that is also a value, that can be stored or passed as a parameter to an entry point.

The code of a `lambda` takes some parameters and returns a value, but doesn't have any side effects. It doesn't have access to the storage of the contract that calls it, and can't modify it. It does however have access to the [special values](#special-values) of the contract (its `balance`, the current `timestamp`, etc.)

`lambdas` are mostly used for the following reasons:
- As a way to reuse code in multiple places of the contract. If you use a high level language, this is done automatically by the compiler, and the program simply may contain different functions. If you use Michelson, you may need to use `lambdas` for this purpose.
- As a way to make parts of a contract upgradable. A `lambda` that contains some of the behaviour of a contract may be put in the storage, and an entry point may be called by an admin of the contract to replace it with a new `lambda`, and therefore change the behaviour of that part of the contract. Note that the ability to upgrade the contract causes potential trust issues.
- As a way to implement a generic multi-sig or DAO contract, where a proposal takes the form of a `lambda` that performs some action, and people vote on whether to execute this action or not. Check our [simplified DAO example](/smart-contracts/simplified-contracts#dao).

### Links

- Michelson: [Control sturcutres](https://tezos.gitlab.io/active/michelson.html#control-structures).
- Archetype: [apply_lambda](https://archetype-lang.org/docs/reference/expressions/builtins#apply_lambda%28f%20:%20lambda%3CA%20*%20T,%20R%3E,%20x%20:%20A%29).
- SmartPy: [Lambdas](https://smartpy.io/docs/types/lambdas/).
- Ligo: [Anonymous functions](https://ligolang.org/docs/language-basics/functions#anonymous-functions-aka-lambdas).


## Annotations

In the Michelson language, some values or types can be annotated with a name.

This doesn't have any effect on the code itself, but makes it possible for tools that call or analyze the code, to associate a name to different values.

In particular, `annotations` are used:
- to give names to entry points
- to give names to the parameters
- to give names to the different members of records (stored as `pairs` with `annotations`)

If you use a high level language, you are unlikely to need to manipulate `annotations` yourself.

Here is an example of Michelson code that uses `annotations`, to name the elements of its parameters:

	parameter (pair (int:age) (int:height)) ;

### Links

- Michelson: [Annotations](https://tezos.gitlab.io/active/michelson.html#annotations)


## Global table of constants

To make it possible to reuse code or data between contracts, and by doing so, reducing the size of these contracts, Tezos provides a feature that lets user store data in a `global table of constants`.

It is basically a write-only key value store, where anyone can add data, as long as they pay for the storage costs.

When you register a piece of data in this table, you obtain its `address`, which is a Base58-encode Blake2b hash of the binary serialization of the data.

The data can then be referenced anywhere in your code. It can be used to store code, types or data.

### Links

- Michelson: [Global constants](https://tezos.gitlab.io/active/global_constants.html).
- Ligo: [Global constant](https://ligolang.org/docs/protocol/hangzhou#global-constant).
- SmartPy: [Global constants](https://smartpy.io/docs/experimental/global_constants/).


## Serialization / deserialization

Between contract calls, the code of a contract, as well as its storage, are stored as a serialized sequence of `bytes`, for efficiency purposes.

Every time the contract is called, the serialized code and storage are deserialized, unless the deserialized version is still in memory, in the cache. Similarly, after the execution of the contract, the storage needs to be serialized, to be stored again as a sequence of `bytes`.

This takes some CPU time, which means that when you call an entry point, on top of paying for the gas for the execution of the code of the entry point itself, you also need to pay for this serialization/deserialization. The cost to call a very simple entry point may get large, if there is a lot of data in the storage.

Remember that unlike the rest of the storage, `big-maps` are not entirely serialized/deserialized for each call. Instead, only the values that are read are deserialized, and only the values that are added or updated are serialized.

### PACK and UNPACK

Tezos provides the possibility to serialize and deserialize data or code yourself:
- The `PACK` instruction takes a value of (almost) any type, and serializes it into a `bytes` value.
- The `UNPACK` instruction takes a `bytes` value, and deserializes it into its original value. As the deserialization may be impossible if the sequence of `bytes` doesn't represent valid serialized data, it returns an `option`.

Serializing your own data in this way may be useful if you want to apply operations that are only available on `bytes` value.

For example, you may want to compute the `hash` of some data. You can do so by packing it first, then applying a `hash` function such as `BLAKE2B` on the resulting `bytes` value.

### Links

- Michelson: [Operations on bytes](https://tezos.gitlab.io/active/michelson.html#operations-on-bytes).
- Ligo: [Pack and Unpack](https://ligolang.org/docs/language-basics/tezos-specific#pack-and-unpack).
- SmartPy: [Pack and Unpack](https://smartpy.io/docs/advanced/pack_unpack/).
- Archetype: [pack](https://archetype-lang.org/docs/reference/expressions/builtins#pack%28o%20:%20T%29), [unpack](https://archetype-lang.org/docs/reference/expressions/builtins#unpack%3CT%3E%28b%20:%20bytes%29).

## Cryptographic primitives

A number of cryptographic primitives are available on Tezos:

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

BLS12-381 is the name of an elliptic curve, a cryptographic primitive that can be used for ditigital `signatures` and zero-knowledge proofs.

It has the particularity of being pairing-friendly, which makes it possible to create short digital `signatures` that can be efficiently aggregated. It can also be used for identity-based cryptography, single-round multi-party key exchanges, or and efficient polynomial commitment schemes such as KZG commitments.

More information can be found [here](https://hackmd.io/@benjaminion/bls12-381).

<!--
### Other

 `HASH_KEY` computes the b58check of a public key. -->

### Links

- Michelson: [Cryptographic primitives](https://tezos.gitlab.io/active/michelson.html#cryptographic-primitives), [BLS12-381 primitives](https://tezos.gitlab.io/active/michelson.html#bls12-381-primitives).
- Ligo: [Crypto](https://ligolang.org/docs/reference/crypto-reference).
- Archetype: [Blake2b and related](https://archetype-lang.org/docs/reference/expressions/builtins#blake2b%28b%20:%20bytes%29), [Elliptic curves](https://archetype-lang.org/docs/language-basics/crypto#elliptic-curves).
- SmartPy: [Hashing functions](https://smartpy.io/docs/advanced/hashing_functions/), [Signatures](https://smartpy.io/docs/types/signatures/).
- Taquito: [Signing data](https://tezostaquito.io/docs/signing/).

## Tickets

A `ticket` is a special type of data type that includes security mechanisms that make it very suitable for issuing new tokens or grant portable permissions.

A `ticket` contains three pieces of information:
- The **address** of the contract that created it, the **ticketer**.
- Some **data**, with a type and value assigned by the contract. We call it the **wrapped value**, or the **payload** of the `ticket`.
- An **amount**, in the form of a natural number.

A `ticket` has a type, which is based on the type of the payload. For example a `string ticket` is a `ticket` whose payload is of type `string`.

All these informations are public, and in particular, can be read by any contract holding the `ticket`.

There are three main features at the core of `tickets`, each associated with one of these three components:

### 1. Guaranteed origin

The first feature is that a `ticket` provides a mechanism that guarantees that it has indeed been created by the contract whose address it contains.

Only the contract itself may issue `tickets` that reference it as its creator.

In particular, a `ticket` can't be duplicated, it can only be stored or passed as a parameter in a call to an entry point, in such a way that there is only ever one existing copy of it.

If a contract A calls a contract B, passing a `ticket` as parameter, contract A loses any access to this `ticket`. This means the `ticket` is transferred to contract B. Note that a `ticket` can't be transferred to an implicit account, since the transfer needs to be done through an entry point that takes a `ticket` of the right type, as parameter.

### 2. Immutability of the wrapped value

The data stored in a `ticket`, the **wrapped value**, can't be changed after the creation of the `ticket`, even by the contract that created it.

### 3. Splitting and joining tickets

This feature is about the amount attached to a `ticket`.

The contract that creates the `ticket` sets the initial amount to any natural number it chooses. From then on, this amount may only be changed by performing the two folloging instructions:
- `SPLIT_TICKET`: taking a `ticke`t, and splitting it in two `tickets`. Both new `tickets` share the same ticketer address and payload, but the amount of the initial `ticket` is split between the two: the sum of the amounts of the two new `tickets` is equal to the amount of the initial `ticket`. The initial `ticket` is destroyed.
- `JOIN_TICKETS`: taking two `tickets` that have the exact same ticketer address and payload, and combining them into a single `ticket`, still with the same ticketer address and payload, byt whose amount is the sum of the amounts of the two initial `tickets`. The two initial `tickets` are destroyed. This is the inverse of `SPLIT_TICKET`.

These two instructions can be performed by any contract currently holding the `tickets` that are split or joined.

A contract may create an initial single `ticket` with a large amount, for example 1000, transfer it to another contract through a simple contract call, and by doing so, forfeiting any control over it. Through multiple split and join operations and passing the resulting `tickets` as parameters to other contracts, we may end up in a situation where hundreds of `tickets` exist, all with the same ticketer and payload, but held by many different contracts. If we compute the sum of the amounts of all these `tickets`, it will always be 1000.

Note that the contract at the origin of the initial `ticket`, may at any time, create another `ticket` with the exact same value, and the amount of its choice, for example an amount of 9000. After more splits and transfers of this new `ticket`, there would there be no way, at least on-chain, to differentiate `tickets` coming from this newly issued `ticket`, and `tickets` coming from the original one.

In other words, the initial contract may any time increase the supply of `tickets` it creates with a given value. This means it's important to verify the part of the contract that mints `tickets`, before trusting them.

### Benefits of tickets used as tokens

The key benefit of `tickets` is that they continue existing independently of the contract that issued them. Once a contract transferred a `ticket` to another, the originating contract loses all control over this `ticket`.

This is very different from how tokens are usually managed, for example when using the FA 1.2 or FA 2 standards. Such tokens are fully under the control of the issuing contract, and for example, transferring such a token may only be done by calling the smart contract that issued it. Wrapping can be used as a way to go around this, but this is not technically transferring the token itself.

This helps bring extra trust in the value of the tokens represented by the `tickets`, as there is no risk of the tokens suddenly becoming unusable if the issuing contract fails. It basically increases the decentralization of tokens, and make them behave a little more like the native tez token, but with many more features and additional trust.

### Operations on tickets

The operations available on a `ticket` are limited to the following:
- Creating a new `ticket`, with a given content and amount, and the current contract as the ticketer (`TICKET`).
- Reading a `ticket`, which returns the three values contained in the ticket, plus the ticket itself (`READ_TICKET`).
- Splitting a `ticket` into two tickets with the same content and ticketer, but splitting the amount (`SPLIT_TiCKET`).
- Joining two `tickets` that have the same content and ticketer, into a new ticket an amount that is the sum of the amounts of the two tickets (`JOIN_TICKETS`).

All the verifications can be made on the values returned by reading the `ticket`.

### Links

- Michelson: [Operations on tickets](https://tezos.gitlab.io/active/michelson.html#operations-on-tickets).
- Ligo: [Tickets](https://ligolang.org/docs/reference/current-reference#tickets).
- Archetype: [create_ticket and related](https://archetype-lang.org/docs/reference/expressions/builtins/#create_ticket%28s%20:%20T,%20n%20:%20nat%29).
- SmartPy: [Tickets](https://smartpy.io/docs/types/tickets/).

## Timelocks

A `timelock` is a cryptographic primitive that can be used as part of a **commit & reveal** scheme, to provide a guarantee that the information associated to the commit is eventually revealed.

### Classical commit & reveal scheem

Commit & reveal is a scheme that consists in two steps, involving one or more participants:
- Before a set deadline, each participant takes some decision, then publishes a **commitment**, a proof that they have taken a decision, that they won't be able to change. The proof often takes the form of a hash of the data that corresponds to this decision.
- After the deadline, each participant reveals the data corresponding to their commitment. Other participants can check that the hash of this data indeed corresponds to their previous commitment.

This scheme makes it possible to prove that a certain decision was taken before some information was revealed. This information may be the decision of other participants, or some external independent information.

As an example, imagine that two players want to play the game ["rock, paper, scissors"](https://en.wikipedia.org/wiki/Rock_paper_scissors) through a smart contract. As it is impossible to force and verify that the two players reveal their choice between rock, paper or scissors simultaneously, they can use a **commit & reval** scheme to do so.

During the first step, they pick their choice, identified by a number from 1 to 3, put it in a pair with some random data, compute a hash of the result. This hash is the commitment, that they can then send to the contract.

Once both players have sent their commitment, they can then reveal: send the actual data to the contract, including the random data. The contract can verify that the hash of this data matches the previous commitment. Once the two players have revealed their data, the smart contract can determine the outcome of the game round and distribute rewards accordingly.

### The issue with not revealing

One issue with the classical commit & reveal scheme, that arises in numerous use cases, is that once the first step is closed, and some information is revealed, for example the data from other participants, one participant may find it advantageous to not reveal at all, if it doesn't benefit them to do so. Why reveal if it will only make you lose? For some use cases, this can ruin the whole process.

In some cases, having a financial incentive, such as a number of tokens people deposit along with their commitments, that they get back once they reveal, can be sufficient to address the issue.

However in some other cases, a financial incentive may not be sufficient by itself, for example when the potential benefit of not revealing far exceeds what would be reasonable to request as a deposit. This is in particular true when multiple participants can team up and each decide on revealing or not, to benefit the team as a whole.

### Forcing the reveal with a time lock

A time lock is a way to produce a commitment using a cryptographic algorithm, that makes it possible to eventually force the reveal.

Instead of using a hash, the data is encrypted, using an encryption method that can be cracked with a known algorithm, given enough time.

The particularity is that the amount of time it takes to crack it is bounded. We can estimate the amount of time it takes for a regular computer to crack it, as well as the amount of time it would take for the fastest possible dedicated hardware. The algorithm used to crack it can't be parallelized, which means there is a limit to how much power you can throw at it.

This range of time can be increased or decreased, depending on the number of iterations used to encrypt the data.

Let's say for example that you encrypt the data in a time lock, so that you know it will take between 10 minutes and 10 hours to decrypt, depending on what type of hardware is being used.

You could have a commit phase that is opened during less than 10 minutes. This makes sure that noone can decrypt anyone's commitment while the commit phase is still opene.

Once the reveal phase starts, you could give a few minutes for everyone to reveal their data. If a participant doesn't reveal, you set a financial reward for anyone else who manages to crack the encryption and reveal the data.

As eventually, the data will be revealed, there is no positive incentive for the participant not to reveal: they would lose their deposit, but not benefit from not revealing, since someone else will do it for them. This acts as a deterrent, and in practice it becomes very unlikely that someone doesn't reveal and forces someone to use some computing resources to do it for them.

Overall, timelocks make commit and reveal schemes effective in many additional use cases.

Some use cases involve collectively generating a random value, or preventing [BPEV attacks](#avoiding-flaws#6-not-protecting-against-bots-bpev-attacks).

### Links:

- Michelson: [Operations on timelock](https://tezos.gitlab.io/active/michelson.html#operations-on-timelock).
- SmartPy: [Timelock](https://smartpy.io/docs/experimental/timelock/).
- Ligo: [Chest](https://ligolang.org/docs/reference/current-reference#chest).
- Archetype: [Timelock](https://archetype-lang.org/docs/language-basics/crypto#timelock).


## Sapling

Sapling is a protocol that enables performing transactions of fungible tokens, in a way that increases privacy, by hiding from the public, the exact transactions that have been performed, while making it possible to make them available to specific entities, in particular to comply with regulations.

The key steps are as follows:

- A **shielded pool** is created, within a contract, that a number of users will call to perform transactions while keeping the details private.
- These users then send tokens to this shielded pool. We say that they **shield their tokens**. This information is public
- Users then perform **shielded transactions**, in such a way that the amount, sender of receiver of each transactions are not revealed publicly. Only the origin and destination of each transaction have access to these informations.
- Later, users may get some or all of their tokens out of the pool by **unshielding their tokens**. This operation is public as well.

If a regulator needs access to the transactions of a user, this user may share a **viewing key**, that gives access to all the transactions made by this user.

Note that using the sapling protocol in a **shielded pool** and expecting a high degree of privacy requires taking a number of precautions, including:
- Making sure there are enough members in the pool. For example, if there are only two members, it becomes very easy to identify the source and destinations of transactions.
- Adding dummy transactions, or dummy inputs and ouptuts of transactions, to hide the actual number of parties involved in each transaction.
- Making sure to use shielded tokens in multiple transactions. Indead, if alice shields 16.32 tokens and bob later unshields 16.32 tokens, it's easy to guess what happened.
- Being careful about information that can be deduced from the timing of transactions.

The internals of `sapling` are a bit techincal. The system is based on an UTXO (bitcoin-like) transaction system, where each transaction consumes some unspent output, and produces new unspent outputs. A system of cryptographic commitments used in place of public amounts and addresses, that can then be "consumed" using a system of nullifiers. All this makes use a mix of cryptographic tools, including SNARKs, incremental merkle trees and Diffie-Hellman key exchanges.

### Links

- Michelson: [Sapling integration](https://tezos.gitlab.io/active/sapling.html).
- SmartPy: [Sapling integration](https://smartpy.io/docs/advanced/sapling_integration/).
- Archetype: [Sapling](https://archetype-lang.org/docs/language-basics/crypto#sapling).
- Ligo: [Sapling](https://ligolang.org/docs/reference/current-reference#sapling).


## Delegation

Placing your tez in a smart contract means you can't stake them for baking, or even delegate them to get rewards.

However, the smart contract itself has the possibility of delegating the tez it holds, and either distributing the rewards to the original owners of the tez, or simply keeping them in its own balance for other purposes.

To manage this, there are a couple of features you can implement in a smart contract:
- Setting the delegate: simply set, update or remove the address of the baker you want the contract to delegate its tez to (`SET_DELEGATE`).
- Obtaining the voting power of a contract (a delegate), which is based on its total staking balance as computed at the beginning of the voting period (`VOTING_POWER`).
- Obtaining the total voting power of all contracts (`TOTAL_VOTING_POWER`).

In practice, both the voting power of a contract and the total voting power of all contracts are expressed as a number of `mutez`, but this may change with time as the protocol evolves.


### Links

- Michelson: [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Ligo: [Tezos](https://ligolang.org/docs/reference/current-reference).
- Archetype: [Total voting power](https://archetype-lang.org/docs/reference/expressions/constants#total_voting_power), [Voting power](https://archetype-lang.org/docs/reference/expressions/builtins#voting_power%28k%20:%20key_hash%29), [set_delegate](https://archetype-lang.org/docs/reference/expressions/builtins#set_delegate%28opkh%20:%20option%3Ckey_hash%3E%29).
- SmartPy: [Voting power](https://smartpy.io/docs/types/voting_power/), [Operations](https://smartpy.io/docs/types/operations/#operations).
