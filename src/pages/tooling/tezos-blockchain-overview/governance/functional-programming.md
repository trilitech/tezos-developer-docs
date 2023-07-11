---
title: Tezos and Functional Programming
id: tezos-and-functional-programming
lastUpdated: June 2023
---

The Tezos protocol is written in OCaml, a general-purpose industrial-strength programming language with an emphasis on expressiveness and safety. It is the technology of choice in companies where speed is crucial and a single mistake can cost millions. It has a large standard library, which makes it useful for many of the same applications as Python or Perl, and it has robust modular and object-oriented programming constructs that make it applicable to large-scale software engineering. Many top companies use OCaml, including Facebook, Bloomberg, Docker, and Jane Street.

## What is functional programming?

[Functional programming](https://en.wikipedia.org/wiki/Functional_programming) is a programming paradigm — a style of building the structure and elements of computer programs — that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.

It is a declarative programming paradigm, which means programming is done with expressions or declarations instead of statements. In functional code, the output value of a function depends only on the arguments that are passed to the function, so that calling a function *f* twice with the same value for an argument *x* produces the same result *f\(x\)* each time. This is in contrast to procedures that depend on a local or global state, which may produce different results at different times when called with the same arguments but a different program state. Eliminating side effects, i.e. changes in state that do not depend on the function inputs, can make it much easier to understand and predict the behavior of a program, which is one of the key motivations for the development of functional programming.

### OCaml Resources

* [What is OCaml?](https://ocaml.org/learn/description.html)
* [Jane Street OCaml Tutorial](https://github.com/janestreet/learn-ocaml-workshop)
* [Real World OCaml](https://realworldocaml.org/)
