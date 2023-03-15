---
id: 1-raffle-contract
title: Raffle contract
authors: Maxime Sallerin, Benjamin Pilia, and Arthur Guillon
---

import NotificationBar from '../../../../src/components/docs/NotificationBar';

The language used in smart contracts on Tezos is [Michelson](/michelson), a stack-based language.
However, this kind of language is not commonly used by developers and as the code becomes complex
and longer, it gets increasingly harder to keep readable and clean code in Michelson. However, the
Tezos ecosystem provides a number of high level languages, which make smart contracts development as
easy as any application development. LIGO is one of these languages. In this chapter, we show how to
use LIGO to develop smart contracts for Tezos.

As mentionned in the introduction, a specificity of the LIGO language is that it proposes 4
different syntaxes to the user, which are inspired from various programming languages. The one we're
using in this tutorial is _PascaLIGO_, which is inspired from the Pascal programming language. This
is important to keep in mind, because each syntax variant has its own file extension. In the case of
PascaLIGO, this extension is just `.ligo`. Moreover, if you're using the online IDE, you have to
specify that you're using PascaLIGO as well.

If you want to learn the complete LIGO syntax, you can take a look at:
1. [The official Ligolang documentation](https://ligolang.org/docs/intro/introduction): a complete reference maintained by the developing team.
2. [Tezos Academy](https://tezosacademy.io/): a gamified interactive tutorial with 30 examples.

This chapter has been written with a smart contract development approach. Each part starts with an explanation of the LIGO syntax (called _LIGO prerequisite_ sections) that are later used for smart contract development.

The _LIGO prerequisite_ parts can be skipped if you do not want to learn the _PascaLigo_ syntax.

<NotificationBar>
  <p>

DISCLAIMER: This smart contract is meant for educational purpose only, and is not suitable for any other use. OpenTezos cannot be held responsible for any other use.

  </p>
</NotificationBar>

## Raffle smart contract
In this chapter, a simple [raffle](https://en.wikipedia.org/wiki/Raffle) example is considered. A raffle is a gambling game, where players buy tickets. The winning ticket is then drawn. In our case, a raffle will be developed in a smart contract with those rules:
- An administrator (with his public address) wants to organize a raffle, which reward is some Tez.
- The administrator pays the reward to the winner with his own funds.
- Anyone can participate in the raffle, and the participation fee is the same for everyone. However, each address can participate only once.
- Each ticket has the same probability of being picked.
- After a given time, defined at the beginning of the raffle, the administrator will close the raffle, and send the reward to the winner.

This raffle can be divided into three steps:
1. A raffle is opened, with a reward, for a given time.
2. During the allowed time, anyone can buy a raffle ticket.
3. The raffle is closed, the winner is randomly selected and rewarded with the prize.

Only one raffle session can be ongoing.

> Some choices have been made for educational purposes.

<NotificationBar>
  <p>

About the word **ticket**:
A ticket is a reserved word in Michelson and LIGO, introduced by the Edo protocol.
In this chapter, the word ticket only refers to a raffle ticket.

  </p>
</NotificationBar>

## Prerequisites for smart contracts development
When developing smart contracts, two tools are extremely useful:
1. a LIGO syntax support for your IDE
2. a LIGO compiler, which transforms the LIGO code into Michelson

These two tools will point out syntax errors and type-checking errors. However, it is recommended to compile a LIGO smart contract as often as possible. The compilation will detect errors that the IDE linter won't. Thus, errors will be found early and should be more easily addressed.

You can find instructions on how to install the LIGO compiler [on the official
website](https://ligolang.org/docs/intro/installation/?lang=pascaligo), as well as support for some
IDEs.

## Smart contract initialization
Through this raffle example, we present all the notions that are necessary to write a smart contract in LIGO:
- using built-in types, and declaring new ones;
- declaring constants and variables;
- declaring and using functions;
- writing the `main` function;
- compilation.

A Tezos smart contract has three parts:
1. **parameter**: possible invocations (function calls) of the smart contract.
2. **storage**: persistent on-chain data structure. Note that anyone can read the storage, but only the contract can change it.
3. **code**: a sequence of Michelson instructions to be executed when invoking a smart contract.

Those parts have to appear in a LIGO smart contract as well, and are compiled to their Tezos
representation by the compiler.

Let's get started! The first step is to create a _.ligo_ file. Let's create a file called `raffle.ligo` which will contain a minimaly viable contract.

### LIGO concepts used in this part

#### Types
LIGO is strongly and statically typed. This means that the compiler knows the types of every
expression, variable and function at compile-time, and checks that there is no type error in the
contract. This is a stricter programming discipline than those that you may find in
dynamically-typed languages. The upside is that those type errors cannot appear in the resulting
Michelson smart contract or at runtime, resulting in safer smart contracts. This is called
type-checking.

All LIGO variants have access to the same types. LIGO's native types are built on top of
the Michelson's type system, but the LIGO language lets us define new types as well (such as
records), allowing us a better fitting, higher-level view of our final application.

##### Built-in types

LIGO supports all Michelson types, from basic primitives (such as `string` or `int`) to composite types (such as `option`, `list` or `map`), including contract-specific types (such as `address` or `tez`).

You can find all built-in types on the [LIGO gitlab](https://gitlab.com/ligolang/ligo/-/blob/dev/src/environment/environment.ml).

Below is a table of the most used built-in types. Most of them will be used in the raffle smart contract:

| Type                           | Description                                                                               | Example                                                                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unit`                         | Carries no information.                                                                   | `Unit`                                                                                                                                                        |
| `option`                       | Value of some type or none.                                                               | `Some ("this string is defined")`, `(None: option string)`                                                                                                    |
| `string`                       | Sequence of character.                                                                    | `"This is a string"`                                                                                                                                          |
| `address`                      | Address of an implicit account or a smart contract.                                       | `("tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" : address)`                                                                                                          |
| `int`                          | Positive or negative integer.                                                             | `-5`,  `int(1n)`                                                                                                                                              |
| `nat`                          | Positive integer.                                                                         | `0n`, `abs (1)`                                                                                                                                               |
| `tez`, `tz`, `mutez`           | Amount in tz or mutez.                                                                    | `5mutez`, `10tez`                                                                                                                                             |
| `bool`                         | Boolean: true or false.                                                                   | `True`, `False`                                                                                                                                               |
| `timestamp`                    | Timestamp (bakers are responsible for providing the given current timestamp).             | `("2000-01-01T10:10:10Z" : timestamp)`, `Tezos.get_now ()`                                                                                                    |
| `bytes`                        | Sequence of bytes.                                                                        | `0x12e4`                                                                                                                                                      |
| `list (type)`                  | List definition. The same element can be found several times in a list.                   | `list [1; 2; 2]`, `nil`                                                                                                                                       |
| `set (type)`                   | Set definition. The same element cannot be found several times in a list.                 | `set []`, `set [3; 2; 2; 1]`                                                                                                                                  |
| `type1 * type2 ... * typeN`    | Tuple definition.                                                                         | `("Alice", 5n, True)`                                                                                                                                         |
| `(keyType, valueType) map`     | Map an element of type `keyType` to an element of type `valueType`. Meant for finite maps | `Map.empty`, `Map.literal [(("tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" : address), (1,2)); (("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address), (0,3))]`         |
| `(keyType, valueType) big_map` | Map an element of type `keyType` to an element of type `valueType`. Meant for huge maps   | `Big_map.empty`, `Big_map.literal [(("tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" : address), (1,2)); (("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address), (0,3))]` |

> As you may have noticed, there is no `float` type. Indeed, `float` is not deterministic as its precision depends on the hardware that it runs on.

##### Type aliases

Type aliasing consists in giving a new name to a given type when the context calls for a more precise name.

It can be used to express our intent more clearly: for instance, a `coordinates` type defined by a
tuple of two integers is more meaningful than just using a tuple.

```js
type coordinates is (int * int)
const my_position : coordinates = (2, 1)
```

⚠️ `Tuples` will be explained later.

It is also helpful to define a type for complex structures, such as the expected input and return of a function or the contract storage.

#### Constants & Variables declaration

##### Constants

Constants are immutable, named values, which means they can only be assigned once, at their declaration. A constant is defined by a name, a type, and a value:

```js
const age : int = 25
```

##### Variables

Variables, unlike constants, are mutable. They cannot be declared in a global scope, but they can be declared and used within functions or as function parameters.

```js
var c: int := 2 + 3
c := c - 3
```

⚠️ The assignment operator is different: `:=` for variables, instead of `=` for constants.

#### Introduction to functions

As many other languages, LIGO allows to create functions. There are several ways to define a function, but the header is always the same:

```js
function <functionName> (const param1 : <param2Type>, const param2 : <param2Type>, ...): <returnType> is
    <code>
```

Functions can be simple expressions to compute a value in a smart contract, or can implement a piece
of the smart contract logic. We give actual examples of functions in the next chapter.

#### Main function
Every LIGO smart contract must define a `main` function. This function handles the entrypoints of
the contract, which are the ways with which a user or other smart contracts can interact with it.
In the case of our raffle, we'll define several entrypoints, to register as a participant for
instance.

The `main` function is also responsible for defining the _operations_ emitted by the contract (such
as transferring some Tez to another address) and updating the contract _storage_. It takes two
parameters, the **contract parameter** and the **on-chain storage**, and returns a pair made of a
**list of operations** and a **(new) on-chain storage**.

<br/>

![](./main_function.svg)
<small className="figure">FIGURE 1: Main function</small>

<br/>

Depending on your programming background, you may be surprised to see that the `main` function
receives the contract's storage as an argument. This is a common style in functional programming:
instead of treating the storage of the contract as a global and always available variable, it is passed
to the `main` function, as well as to every function that needs to get some information from it.
This has an immediate benefit: it makes easier to know if a function depends on the contract's state
or not, and whether it can be refactored away in another module or not.

The contract parameter and storage type are up to the contract designer, but the type for the list
of operations is not. Finally, the return type of the `main` function is as follows (assuming that
the `storage` type has already been defined elsewhere).

```js
type storage is ...  // Can be any type, depending on the contract
type returnMainFunction is list (operation) * storage
```

### Raffle storage initialization

Now that we have introduced some basic LIGO concepts (`type`, `constant`, `variable`, `function` and the `main` function), let's design our _Raffle_ smart contract.

The first step is to define the storage. Contract storage holds the contract data: it can be a single value or a complex structure. The storage definition is a `type` instruction. First, the storage will be as simple as possible: _empty_.

```js
type storage is unit
```

⚠️ The word _unit_ is a reserved word of the language and represents an _empty type_.

### Raffle parameter initialization

The parameter definition lists all the entrypoints of a smart contract. We'll define the entrypoints
of our raffle contract in a latter chapter. For now, let's define define a smart contract with the
simplest possible entrypoint:

```js
type raffleEntrypoints is unit
```

### Raffle code definition

Finally, let's write some code for our smart contract. As for the entrypoints, we keep things as
simple as possible in this chapter, and will complete the code in the next chapters. A smart
contract can be an empty list of instructions, but it must always return two things:

1. a list of operations, which can be empty too
2. the storage, which can be unmodified

The Ligo compiler expects the smart contract to have at least one function, which is the `main`
function. It does not have to be named that way but it is good practice to do so. Finally, here's
our PascaLIGO smart contract:

```js
// raffle.ligo contract

type storage is unit
type raffleEntrypoints is unit
type returnMainFunction is list (operation) * storage

function main (const action : raffleEntrypoints; const store : storage): list (operation) * storage is
    (nil, store)
```

The `main` function here expects a tuple of two arguments, `action` and `store`, and returns a tuple
of two values, `nil` (the empty list) and `store`, unmodified.

### LIGO compilation

The LIGO code above should now compile with this command:

```shell
$ ligo compile contract raffle.ligo
```

If the compilation is successful, the output will be the Michelson code of the contract. It is
recommended to run this command as often as possible to check the code syntax and the types.

You may also observe a warning message, telling you that the `action` variable is unused.
Fortunately, this is something we're going to change in the next chapter.

