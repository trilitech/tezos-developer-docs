---
id: introduction
title: Introduction
authors: Frank Hillard
lastUpdated: 30th June 2023
---

One of the great benefits of Tezos is the ability to formally verify smart contracts. Tezos makes this formal verification possible for smart contracts with the design of Michelson and with tools such as [Coq](/advanced-topics/formal-verification/coq/) and the [Mi-Cho-Coq library](/advanced-topics/formal-verification/michocoq).

This entire section walks through formal verification and how it relates to Tezos:

- [Formal Verification on Tezos](/advanced-topics/formal-verification/formal-verification-on-tezos/) discusses how smart contracts on Tezos can be formally verified, its benefits, and what tooling makes this possible.

- [Modelling for Smart Contracts](/advanced-topics/formal-verification/modelling-theorem/) goes through an example smart contract, its formal specification and its proof.

- [Coq](/advanced-topics/formal-verification/coq/) gives a brief introduction to syntax and proof creating on Tezos using Mi-Cho-Coq.

- [Mi-Cho-Coq](/advanced-topics/formal-verification/michocoq/) discusses what Mi-Cho-Coq is and how it bridges between Tezos smart contracts and formal proofs in Coq.


## Visual Overview

The image below helps visualise the process for performing formal verification for Tezos smart contracts:

![](images/introduction/FormalVerification_overview_intro.svg)

{% callout type="note" title="Further Reading" %}
For mathematicians and very curious developers, an extra [theoretical](/advanced-topics/formal-verification/gadt-coq) section will introduce some basic concepts of **Type theory** such as *GADT* which allows inductive types on the Calculus of Inductive Construction (CiC). The proof assistant Coq, which is based on the CiC, can be used for proving theorems. 
{% /callout %}







