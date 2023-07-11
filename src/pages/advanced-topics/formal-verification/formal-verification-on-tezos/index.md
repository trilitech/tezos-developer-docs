---
id: general
title: Formal Verification on Tezos
authors: Frank Hillard (Cardashift)
lastUpdated: 30th June 2023
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

The [Michelson](/developers/docs/smart-contracts/smart-contract-languages/michelson/) language has been designed to take formal verification into account:

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

- [Coq](/developers/docs/advanced-topics/formal-verification/coq/) is a proof assistant designed to develop mathematical proofs, and especially to write formal specifications, programs, and proofs that programs comply to their specifications.
    - The specification of a program represents **what** a program is meant to do. _Coq_ provides a language [Gallina](https://en.wikipedia.org/wiki/Coq#Overview) for modelling logical objects such as theorems, axioms and assumptions. The proof is a sequence of logical deductions (based on axioms, assumptions and the inference rule) that verify the **compliance of a program to its specification**.

- [Mi-Cho-Coq](/developers/docs/advanced-topics/formal-verification/michocoq), a library which bridges between Tezos smart contracts and formal proofs in the [Coq](/developers/docs/advanced-topics/formal-verification/coq/) proof assistant.

- [K-Michelson](https://runtimeverification.github.io/michelson-semantics/) is based on K-framework which is a generic tool for specifications and proof languages.

### Mi-Cho-Coq

{% callout type="note" title="Further Reading" %}
If you want a deeper introduction to using Mi-Cho-Coq, please see our page on [Mi-Cho-Coq](/developers/docs/advanced-topics/formal-verification/michocoq). The official repository can be found [here](https://gitlab.com/nomadic-labs/mi-cho-coq).
{% /callout %}

Coq, combined with Mi-Cho-Coq library, provides a manual low-level approach to manually write a proof. This approach performs verification at the smart contract level (i.e. the Michelson script). It also provides a way to perform formal verification on smart contracts written in high-level languages (LIGO, SmartPy) since ultimately they are compiled to Michelson.

The Mi-Cho-Coq library represents the bridge between Tezos smart contracts and formal proofs in Coq. It is a formalization of the Michelson language using the Coq interactive theorem prover. In practice, the Mi-Cho-Coq library is used to produce a formal definition of a Michelson script (known as the the [modelling theorem](/developers/docs/advanced-topics/formal-verification/modelling-theorem/#modelling-a-smart-contract-as-a-theorem)). Each Michelson instruction has its equivalent in the Mi-Cho-Coq library.

Specifically, the Mi-Cho-Coq library provides a formal definition (in *Gallina*) of the **type system** (Michelson types), the **syntax** (instructions of the Michelson), the **semantics** (evaluator) and the lexing and parsing (for type-checking) (see [Mi-Cho-Coq](/developers/docs/advanced-topics/formal-verification/michocoq)).

There are several considerations to take into account when thinking about using Mi-Cho-Coq:
- data serialization/deserialization is not supported yet
- cryptographic functions are considered as a black box and used as such.
- a gas model is not taken into account.
- it only provides formal verification for Michelson.
- it does not provide a way to verify interactions between different smart contracts (see [Concert](https://dl.acm.org/doi/10.1145/3372885.3373829) if you are interested exploring more here)


