---
id: general
title: Formal Verification on Tezos
authors: Frank Hillard (Cardashift), Sasha Aldrick (TriliTech)
---

Smart contracts, though most are relatively simple, are prone to bugs like any program. However, within the context of a blockchain, it can be hard for a developer to predict and test for all the interactions and externalities possible. As a consequence, this can lead to critical bugs which can and has led to the loss of funds.

One of the great benefits of Tezos is the ability to formally verify smart contracts. Tezos makes this formal verification possible for smart contracts with the design of Michelson and with tools such as [Coq](/developers/docs/advanced-topics/formal-verification/coq/) and the [Mi-Cho-Coq library](/developers/docs/advanced-topics/formal-verification/michocoq).

## Trust & Formal Verification

A blockchain ensures the execution of transactions without a trusted third-party. The deployment of smart contracts re-introduces a trusted third-party (the smart contract developer). Testing is possible but ensuring the quality and completeness of these tests is difficult. As such, smart contracts can be hard to trust, especially with the amount of critical bugs that have occurred. 

Formal verification consists of proving mathematically that a smart contract possesses the properties described in its formal specification. This mathematical proof is formal so its correctness can be verified automatically. In this case, trust is based on the **existence of a proof** for a smart contract and the **understanding of the formal specification** of the smart contract - this describes, without ambiguity, the properties of the program.

### The Formal Verification Process on Tezos

The formal verification process on Tezos for smart contracts consists of:

- **describing** the formal specification of expected behaviour
- **translating** the smart contract, its formal specification and the specification of the language itself into a proof assistant language.
- **writing** a proof using a proof assistant. This can be done manually (or assisted by solvers tools) to produce a formal proof that smart contract complies with the given specification.
- **publishing** this proof to allow anyone to verify automatically that the smart contract does indeed comply with its specification.

### How does Tezos make Formal Verification possible?

The [Michelson](/developers/docs/tezos-basics/smart-contract-languages/michelson/) language has been designed to take formal verification into account:

- introducing a typing system on a stack-based language
- preventing JUMP instructions which would make the formal verification more complex
- not supporting floating-point numbers (because of overflow and rounding)
- avoiding execution errors with obvious failures (e.g. division by 0)

Generally speaking, smart contracts also have specific characteristics making them more suited to being verified than other common programs:

- most smart contracts are not intended to be modified, therefore only requiring one proof for its lifetime.
- proofs can be verified automatically by anyone, without a trusted third-party, which aligns well with the ethos of decentralisation
- smart contracts are relatively short, making proof writing easier
- smart contracts are executed in the well-defined context of the Tezos protocol
- formal verification is particularly relevant when financial value is at stake.

## Proof Tooling

There are many proof assistants available to translate a smart contract into a formal definition, formalize its specifications and ensure its compliance with these specifications:

- [Mi-Cho-Coq](/developers/docs/advanced-topics/formal-verification/michocoq), a library for the [Coq](/developers/docs/advanced-topics/formal-verification/coq/) proof assistant.

- The [Archetype](/developers/docs/tezos-basics/smart-contract-languages/archetype/) language has some native support formal verification (based on [Why3](**ADD LINK**)). The specification can be written directly within the smart contract.

- [K-Michelson](**ADD LINK**) is based on K-framework which is a generic tool for specifications and proof languages.

### Coq and Mi-Cho-Coq

#### Coq

[Coq]() is a proof assistant designed to develop mathematical proofs, and especially to write formal specifications, programs, and proofs that programs comply to their specifications.

Specifications, programs, and proofs are formalized in the _Coq_ language called _Gallina_, which follows the _Calculus of Inductive Constructions_ (CIC).

A program is a sequence of instructions in a language. _Coq_ is a generic tool and can support many languages (e.g. Mi-Cho-Coq is a library for Michelson language support). A program represents **how** a modification is applied.
The specification of a program represents **what** a program is meant to do. _Coq_ provides a language (called Gallina -Terms) for modeling logical objects such as theorems, axioms, assumptions). The proof is a sequence of logical deductions (based on axioms, assumptions and the inference rule) that verify the **compliance of a program to its specification**.

#### Mi-Cho-Coq

The _Mi-Cho-Coq_ library represents the bridge between Tezos smart contracts and formal proofs in Coq.

The _Mi-Cho-Coq_ library [[2]](/formal-verification/modeling-theorem#references) is a formalization of the Michelson language [[9]](/formal-verification/modeling-theorem#references) using the Coq interactive theorem prover [[1]](/formal-verification/modeling-theorem#references).

In practice, the _Mi-Cho-Coq_ library is used to produce a formal definition of a Michelson script (i.e., the "Modeling theorem" [section](/formal-verification/modeling-theorem#Example_vote)). Each Michelson instruction has its equivalent in the _Mi-Cho-Coq_ library.

The _Mi-Cho-Coq_ library provides a formal definition (in _Gallina_) of the **type system** (Michelson types), the **syntax** (instructions of the Michelson), the **semantics** (evaluator) and the lexing and parsing (for type-checking). More details in the next [page](/formal-verification/michocoq).

#### Pros and cons

_Coq_ combined with _Mi-Cho-Coq_ provides a manual low-level approach to write manually a proof assisted by Coq. This approach performs verification at smart contract level (Michelson script).

It also provides a way to perform formal verification on smart contracts written in high-level languages (LIGO, SmartPy) since ultimately they are compiled to Michelson.

Mi-Cho-Coq limitations are:
- data serialization/deserialization is not supported yet
- cryptographic functions are considered as a black box and used as such.
- gas model is not taken into account.

Mi-Cho-Coq official repository is available at https://gitlab.com/nomadic-labs/mi-cho-coq

### Archetype

Archetype official documentation is available at https://archetype-lang.org/

### K-Michelson

K-Michelson official documentation is available at https://runtimeverification.github.io/michelson-semantics/

### Juvix

Juvix official documentation is available at https://juvix.org/docs/proof-system

### Lorentz (Haskell)

Lorentz official documentation is available at https://serokell.io/blog/lorentz

## Modeling specifications

All these proof assistants provides tools for formal verification but also provides a way to express the semantic of a program (e.i. formal semantic). They share the same purpose which is to define what a program is meant to do and to verify that the program does comply to these intentions (called **specifications**).

### Expressivity vs automation

Proof assistants have chosen different ways to model specifications. For example, Mi-Cho-Coq is a Coq library allowing to verify at Michelson level, and specifications are designed in Coq as logical objects (with all the **expressivity** power of the Gallina language).

Whereas Archetype design specifications by adding annotations directly inside the smart contract (written in a high-level language). Using annotations for expressing specifications, has the benefit to allow the **automatic generation of the proof**. This automatic proof cannot be done in all cases (it depends on the complexity) but is It introduces an inconvenience which is to limit the expressivity of these specifications to the annotation grammar.


![](/developers/docs/images/general/proof_assistants_comparison.svg)
<small className="figure">FIGURE 1: Comparison of proof assistants approaches.</small>

Due to these different approaches and their implementations, the time of verification may vary. Automated generated proofs take more time to verify correctness (i.e. time spent for running the proof). Obviously, automation reduces drastically the time spent on writing the proof !

###  Verification level

It's worth to mention that these proof assistants have different approaches concerning the level at which the verification is applied.

The Mi-Cho-Coq approach is to apply formal verification on the low-level language (Michelson) and provides trust on the smart contract.

Another approach is to apply formal verification on a high-level language and provides trust in the high-level language compiler (which produces Michelson). (e.g. Archetype).

### Specification based on resources

By default, specifications are expressed on impacts of execution of a smart contract (i.e. on modifications of the smart contract storage).

Some proof assistants also express specifications based on resources (such as the storage size, or the gaz consumption). The size of storage could be bounded, and thus specifications could reason on these boundaries.
The gaz consumption (equivalent to the execution time) could also be a criterion useful for specifying the intention of the smart contract.


### Verification applied on interactions of multiple contracts

As a stand-alone, Mi-Cho-Coq approach provides a solid (full-expressivity) manner for expressing specifications and for verifying a proof but does not provide a way to verify interactions between multiple smart contracts.

The _Concert_ library for Coq provides a way to model each smart contract as a Coq function and allows to reason on these functions (which can call each other). _Concert_ is a generic tool and not a tezos-specific library such as Mi-Cho-Coq.


### Examples of famous proven smart contracts

There smart contracts that have already been proven such as Dexter thus providing trust on the _Dexter_ decentralized exchange platform.

Liquidity Baking smart contracts have also been proven.