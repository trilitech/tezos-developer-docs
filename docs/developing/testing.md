---
title: Testing locally
authors: 'Yuxin Li'
last_update:
  date: 23 January 2024
---

Tezos smart contracts are immutable after deployment, so you must rigorously test them before deploying them to ensure functionality, prevent errors, and avoid potential financial losses. Importantly, contract testing doesn't require any tokens or a wallet account to execute.

## Tools for local testing

- The Michelson interpreter is an OCaml function that can be used by tools to simulate a call to any entry point of any smart contract, given an initial value of the storage and parameters. Some programming languages like LIGO or SmartPy use this as part of their testing frameworks.

- The mockup mode of `octez-client` can be used to test contract calls and other features such as some RPC calls, all without running an actual node, saving the time of going through the consensus mechanism and waiting to get blocks created and validated. Tools like Completium, built by the team behind the Archetype language, use this for their testing framework. Find out more in the [documentation of the mockup mode](https://tezos.gitlab.io/user/mockup.html).

   For example, when you compile the contract in the tutorial [Create a smart contract](/tutorials/smart-contract) to Michelson, its first line defines the parameter type that the contract accepts:

   ```
   parameter (or (unit %reset) (or (int %decrement) (int %increment)))
   ```

   You can call this contract in mockup mode by passing the compiled contract file, the storage value as a Michelson expression, and the parameter value to pass as a Michelson expression.
   For example, this command sets the storage to 4 and passes 5 to the `Increment` entrypoint:

   ```bash
   octez-client --mode mockup run script Counter.tz on storage 4 and input "(Right (Right 5))"
   ```

   The response in the console shows the new value of the storage and any operations emitted.

## Testing in high-level languages

High-level languages come with tools to help write tests locally, and some testing tools can be used independently of the language used to write the smart contract.
For example, [SmartPy](https://smartpy.io/manual/scenarios/overview) includes syntax dedicated to testing.

The following SmartPy test code snippet is for a Tezos smart contract that acts like a calculator. The code defines a series of tests to check the functionality of the calculator contract.

```bash
if "templates" not in __name__:

    @sp.add_test()
    def test():
        c1 = main.Calculator()
        scenario = sp.test_scenario("Calculator")
        scenario.h1("Calculator")
        scenario += c1
        c1.multiply(x=2, y=5)
        c1.add(x=2, y=5)
        c1.add(x=2, y=5)
        c1.square(12)
        c1.squareRoot(0)
        c1.squareRoot(1234)
        c1.factorial(100)
        c1.log2(c1.data.result)
        scenario.verify(c1.data.result == 524)
```
The test scenario runs these operations sequentially and would check if all operations execute as expected and if the final result matches the expected value.

## Structure of a test scenario

A test scenario usually consists of the following steps:

1. Decide the smart contract's initial storage and `balance`
1. Valid calls to entrypoints, with different parameters and context information such as:
    - the address of the `caller`
    - the amount of `tez` sent
    - the `timestamp` of the block (value of `now` during the call)
    - the `level` of the block
1. Verify the contract's storage or `balance` changed the way you expected.
1. Invalid calls to entrypoints, and they are expected to fail.
1. Verification of the error caused by these invalid calls, making sure the error messages are the ones you thought would come up.

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
- Test around the limits
For example, if a value should be always above 10, include a call with the value 10 that should fail and a call with the value 11 that should succeed.
- Test extremes

For more information about avoiding flaws in contracts, see [Avoiding flaws](https://opentezos.com/smart-contracts/avoiding-flaws/) on opentezos.com.

## Implementation details

- Michelson: [Mockup mode](https://tezos.gitlab.io/user/mockup.html)
- Archetype: [Completium test scenario](https://completium.com/docs/contract/test-scenario)
- SmartPy: [Tests and scenarios](https://smartpy.io/manual/scenarios/overview)
- LIGO: [Testing LIGO](https://ligolang.org/docs/next/testing/)

## Next steps

When you're done testing contracts locally, you can deploy them to a test network and test them there.
See [Testing on sandboxes and testnets](/developing/testnets).
