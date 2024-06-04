---
title: Primitive data types
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 4 June 2024
---

Tezos contracts support these primitive data types.
The high-level languages may implement these data types slightly differently, but they all behave the same way in the compiled Michelson code:

- [Numeric data types: `int` and `nat`](#numeric)
- [Token amounts: `mutez` and `tez`](#token-amounts)
- [Strings](#strings)
- [Bytes](#bytes)
- [Booleans](#booleans)
- [Timestamps](#timestamps)
- [Addresses](#addresses)

This list is intended for general information for developers and is not intended to be comprehensive.
For a complete list of data types that are available, see the reference information for the language that you are using:

- Michelson: [Types](https://tezos.gitlab.io/michelson-reference/#types)
- LIGO: [Introduction](https://ligolang.org/docs/intro/introduction?lang=jsligo)
- Archetype: [Types](https://archetype-lang.org/docs/reference/types)
- SmartPy: [Overview](https://smartpy.io/manual/syntax/overview)

## Numeric data types: `int` and `nat` {#numeric}

Integers (`int`) are whole numbers that can be positive or negative.

Naturals (`nat`) are whole numbers that can only be positive or zero.

Tezos differentiates these two types to prevent problems such as performing operations that may not always return a positive number.

On Tezos, there is no hard limit to how large `nat` and `int` values can be.
The only limits are those associated with the storage and gas costs.
This means you never need to worry about overflow issues.

You can perform these ordinary arithmetic operations on `int` and `nat` or a mix of the two:

- Getting the opposite of a number (`NEG`)
- Adding (`ADD`), subtracting(`SUB`) or multiplying (`MUL`) two values
- Performing an integer division between two values (`EDIV`), which returns a pair with the result and the remainder

The type of the output may not be the same type as the inputs.
In general, the output type depends on whether the result can be negative.
For example, subtraction always returns an `int`, but addition returns a `nat` if both inputs are `nat` and an `int` if either input was an `int`.

You can perform bitwise logical operations: the usual `OR`, `AND`, `XOR`, `NOT`.

You can also perform bitwise left and right shifts (`LSL` and `LSR`), with a parameter that indicates by how many bits you shift the value.

For information about comparing values, see [Comparing values](../logic/comparing).

Finally, you can convert an `int` to a `nat` or vice versa:

- To convert an `int` to a `nat`, use the absolute value function (`ABS`).
- To convert a `nat` into an `int`, use the `INT` function.

You can also convert an `int` to an `option` on a `nat` (ISNAT).
<!-- TODO link to "options" -->

### Why are decimal numbers not supported?

Tezos does not support floating point or decimal numbers.
These kinds of numbers and their associated rounding errors cause many problems.

For example, Tezos protocol upgrades could cause inconsistencies with floating point numbers.
If this happens, different nodes may get different results for the same transactions, which would lead to inconsistencies on the blockchain.
Also, code that uses floating point numbers is much harder to run formal verification on.

## Token amounts: `mutez` and `tez` {#token-amounts}

The `mutez` type (or micro tez) stores amounts of tokens from the native cryptocurrency of Tezos, the tez.
One mutez is equal to one millionth of a tez.

Some languages also support the `tez` type, but the internal type is always the mutez, so you can see a value of type tez as a shortcut for the corresponding value in `mutez`.

`mutez` values, like `nat` values, are whole non-negative numbers.
However, contrary to `nat`, they can't hold arbitrarily large values.

More precisely, `mutez` are stored as signed 64 bit values.
This means their value can only be between $$0$$ and $$2^{63} - 1$$, which is approximately $$9.223 \cdot 10^{18}$$ `mutez`, and corresponds to 9 trillion tez.

Although it is rare to work with mutez amounts this large, there is still a risk of overflow.
For example, if code performs intermediate computations such as squaring a number, it might reach the storage limit.

You can do these arithmetic operations on `mutez`:

- Adding two mutez values (`ADD`)
- Subtracting two `mutez` values (`SUB_MUTEZ`), which returns an `option` because the result could be negative
- Multiplying a `mutez` value with a `nat` (`MUL`), which returns a result in `mutez`
- Performing an integer division (`EDIV`)

For information about comparing values, see [Comparing values](../logic/comparing).

## Strings {#strings}

On Tezos, a `string` is a sequence of standard non-extended [ASCII](https://en.wikipedia.org/wiki/ASCII) characters.
This means there are only 128 possible values for each character, which excludes any accented letters.
This limited list of characters prevents compatibility issues with unicode characters.
If you need to store unicode text, store it as [bytes](#bytes).

Like `int` and `nat`, there is no limit on the size of a `string` other than the indirect limits caused by the associated costs of storage.

You can do these operations on strings:

- Concatenate two `string` types (`CONCAT`)
- Get the size of a `string` (`SIZE`), which returns a `nat`
- Extract a substring of a `string` (`SLICE`)
- Compare two `string` types based on their lexicographical order; see [Comparing values](../logic/comparing)

## Bytes {#bytes}

You can store any piece of information as a sequence of `bytes`.
This type has no limits on its size other than the indirect limits caused by the associated costs.

`bytes` have the same operations as `strings`:

- Concatenate two `bytes` types (`CONCAT`)
- Get the size of a `bytes` (`SIZE`), which returns a `nat`
- Extract a substring of a `bytes` (`SLICE`)
- Compare two `bytes` types based on their lexicographical order; see [Comparing values](../logic/comparing)

To save space, you can store most other data types in a `bytes` type.
To convert

Furthermore, `bytes` can be used to store values of most other valid types in an optimized binary representation.
To convert values to and from `bytes`, use these functions:

- To convert any value of a supported type to `bytes`, use `PACK`
- To convert `bytes` to the encoded type, use `UNPACK`

Serialization is also useful in applying cryptographic functions to data, as in these examples:

- Computing a cryptographic hash of some data using one of several hash functions, such as `Blake2b-256`
- Checking that a sequence of `bytes` has been signed with a given key
- Applying elliptic-curve cryptographic primitives (`BLS12-381`)

For more information about serialization, see [Serialization](../serialization).

`bytes` are also used in [Sapling](../sapling).

## Booleans {#booleans}

Boolean types on Tezos (`bool`) work the same way as in most programming languages.

- A Boolean value can be `True` or `False`
- Comparison operators produce Boolean values
- Boolean values can be used in conditional statements or `while` loops
- The usual logic operators are supported: `AND`, `OR`, `XOR`, `NOT`

## Timestamps {#timestamps}

Dates are very important in smart contracts, such as verifying that a call is made before or after a given deadline.

The `timestamp` type represents the number of seconds since January 1st, 1970, also known as UNIX time.
Internally, timestamps are stored as an `int`, so like `int` types, timestamps can have arbitrarily large positive or negative numbers, representing times long before or after January 1st, 1970.

The special instruction `NOW` represents the timestamp of the current block.

The following operations are supported on timestamps:

- Adding a number of seconds to a `timestamp` (`ADD`)
- Subtracting a number of seconds from a `timestamp` (`SUB`)
- Computing the difference in seconds between two `timestamp` values (`SUB`)
- Comparing two `timestamps` (`COMPARE`); see [Comparing values](../logic/comparing)

## Addresses {#addresses}

On Tezos, each account is uniquely identified by its `address`.

Internally, addresses take the form of a `string` type.
For user accounts, the string starts with "tz1", "tz2", "tz3" or "tz4".
For smart contract accounts, the string starts with "KT1".

| Type of Account | Example |
| --- | --- |
| User account | `tz1YWK1gDPQx9N1Jh4JnmVre7xN6xhGGM4uC` |
| Smart contract | `KT1S5hgipNSTFehZo7v81gq6fcLChbRwptqy` |

The next part of the string is a `Base58` encoded hash, followed by a 4-byte checksum.

## Data type implementations

See these links for technical information about how different languages handle different data types:

- Michelson: [int and nat](https://tezos.gitlab.io/active/michelson.html#operations-on-integers-and-natural-numbers), [booleans](https://tezos.gitlab.io/active/michelson.html#operations-on-booleans), [strings](https://tezos.gitlab.io/active/michelson.html#operations-on-strings), [timestamps](https://tezos.gitlab.io/active/michelson.html#operations-on-timestamps), [mutez](https://tezos.gitlab.io/active/michelson.html#operations-on-mutez).
- Archetype: [Types basics](https://archetype-lang.org/docs/language-basics/types), [Types](https://archetype-lang.org/docs/reference/types), [Arithmetic operators](https://archetype-lang.org/docs/reference/expressions/operators/arithmetic)
- SmartPy: [Integers and mutez](https://smartpy.io/manual/syntax/integers-and-mutez), [Booleans](https://smartpy.io/manual/syntax/booleans), [Strings and Bytes](https://smartpy.io/manual/syntax/strings-and-bytes), [Timestamps](https://smartpy.io/manual/syntax/timestamps)
- LIGO: [numbers and tez](https://ligolang.org/docs/language-basics/math-numbers-tez), [strings & bytes](https://ligolang.org/docs/language-basics/strings-bytes), [booleans](https://ligolang.org/docs/language-basics/boolean-if-else)
