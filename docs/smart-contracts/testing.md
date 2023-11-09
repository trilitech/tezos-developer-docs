---
title: Testing
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

The hardest part of writing smart contracts is avoiding bugs.
Even though most contracts are small compared to regular software applications, they run in an adversarial environment with high financial stakes.
Therefore, the potential for bugs with dramatic consequences is high.

- Due to the public nature of the blockchain, malicious users can exploit bugs for their own profit at the expense of legitimate users.
- Due to the immutable nature of contracts (even with upgradeability), you must test your smart contracts extensively before production deployment.

High-level languages come with tools to help write tests, and some testing tools can be used independently of the language used to write the smart contract.
For example, [SmartPy](https://smartpy.io/manual/scenarios/overview) includes syntax dedicated to testing.

## Structure of a test scenario

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

## Programming languages for testing

The test scenarios are usually written using a full classical programming language, such as JavaScript or Python, with a library that gives you access to special features to:

- Deploy contracts
- Make calls to entrypoints
- Manipulate all the types/values supported by Tezos
- Generate testing accounts, to simulate calls from multiple accounts
- Perform cryptographic computations similar to the ones available in the contract

## Rules for testing

Testing a contract thoroughly is not easy and requires experience.
Here are some tips to follow when getting started:

- Write tests without looking at the implementation of the contract to avoid copying mistakes.
- If possible, have another developer write the test to avoid testing semantic errors incorrectly.
- Make sure to cover every possible execution path, whether it's valid or invalid.
- Create many small tests, each checking something very specific, rather than a long test that tries to do many things at once.
- Test around the limits.
For example, if a value should be always above 10, include a call with the value 10 that should fail and a call with the value 11 that should succeed.
- Test the extremes.

For more information about avoiding flaws in contracts, see [Avoiding flaws](https://opentezos.com/smart-contracts/avoiding-flaws/) on opentezos.com.

## Implementation details

- Michelson: [Mockup mode](https://tezos.gitlab.io/user/mockup.html)
- Archetype: [Completium test scenario](https://completium.com/docs/contract/test-scenario)
- SmartPy: [Tests and scenarios](https://smartpy.io/manual/scenarios/overview)
- LIGO: [Testing LIGO](https://ligolang.org/docs/advanced/testing)
