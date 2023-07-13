---
sidebar_position: 2
hide_table_of_contents: true
title: Michelson
hide_title: true
lastUpdated: 30th June 2023
---

## Michelson

Michelson is the domain-specific language used to write smart contracts on the Tezos blockchain. Michelson is a stack-based language and does not have variables. Stack-oriented languages operate on one or more stacks, each of which may serve a different purpose.

##### Key Michelson Resources

* [Michelson documentation](http://tezos.gitlab.io/007/michelson.html)
* [Michelson Reference](https://tezos.gitlab.io/michelson-reference/)
* [Michelson tutorial series](https://gitlab.com/camlcase-dev/michelson-tutorial/tree/master)

### An Overview of Michelson

Michelson is a low-level, stack-based programming language used to write smart contracts on the Tezos blockchain. Michelson was designed to facilitate formal verification, allowing users to prove the properties of their contracts.

It uses a stack rewriting paradigm, whereby each function rewrites an input stack into an output stack. \(The meaning of this will be fully explained below.\) This runs in a purely functional way and does not modify the inputs at all. Thus, all data structures are **immutable**.

### What is a stack?

A stack is an abstract data type that serves as a collection of elements, with two principal operations: push \(adds an element to the collection\) and pop \(removes the most recently added element that has not yet been removed\). The order in which elements come off a stack gives rise to its alternative name, LIFO \(last in, first out\). Additionally, a peek operation may give access to the top without modifying the stack.

![](https://upload.wikimedia.org/wikipedia/commons/9/9f/Stack_data_structure.gif)

Source: Wikipedia.

### Rewriting Stacks

To see what mean it means to rewrite stacks, we will run through a transaction in Michelson. First, before a transaction runs, the blockchain state at a certain hash is deserialized and put onto the stack as the variable `storage`. We have a `from` function that receives the transaction data `amount`, the amount of attached tez, and the `parameter`, the function's parameters.

``` sh
from [ (Pair (Pair amount parameter) storage) ]
```

After running the function, without any updates to the stack, the program will call a `to` function that has the parameters `result`, which is the result of the function, and the output `storage` that is serialized and stored on the blockchain.

``` sh
to [ (Pair result storage) ]
```

In the example, Michelson only manipulates the stack functionally and a new stack is passed from function to function.

