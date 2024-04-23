---
title: SmartPy
authors: Mathias Hiron and Maxime Sallerin
last_update:
  date: 4 April 2024
---

SmartPy is a comprehensive solution for developing, testing, and deploying smart contracts on Tezos. With its easy-to-use Python syntax, developers can create contracts in a familiar and intuitive way, while SmartPy's type inference provides added safety.

To get started with SmartPy, see the tutorial [Deploy a smart contract with SmartPy](../../tutorials/smart-contract/smartpy), the [tutorial](https://smartpy.io/guides/tutorial) on smartpy.io, or [Smart contract development with SmartPy](https://opentezos.com/smartpy/write-contract-smartpy/) on opentezos.com.

## Test scenarios

SmartPy allows you test contracts in simulated scenarios, including complex cases with multiple interacting contracts. Then SmartPy compiles the contracts to Michelson for deployment. SmartPy can also automatically upload metadata and other files to IPFS directly from the test scenario.

## FA2 library

SmartPy provides a library of classes that you can extend to create FA2 token contracts. The library provides basic functionality for NFTs, fungible tokens, and single-asset token contracts and mixins that change how the tokens work. For more information, see [FA2lib](https://smartpy.io/guides/FA2-lib/overview) in the SmartPy documentation.

## Online IDE

The SmartPy [online IDE](https://smartpy.dev/ide) offers a user-friendly interface for trying out the language directly in a web browser. It comes with an origination feature for deployment of contracts to the blockchain at the click of a button. For those who prefer to write smart contracts and tests in their favourite editor, you can also install SmartPy locally.

## Explorer

The [SmartPy explorer](https://smartpy.io/explorer) allows you to explore and interact with with already deployed contracts. It presents contract data as SmartPy values, such as records and variants, to make interacting with contracts easier.

## Example

Here is a simple SmartPy contract and test scenario:

```python
import smartpy as sp

@sp.module
def main():
    class StoreGreeting(sp.Contract):
        def __init__(self, greeting): # Note the indentation
            # Initialize the storage with a string passed at deployment time
            # Cast the greeting parameter to a string
            sp.cast(greeting, sp.string)
            self.data.greeting = greeting

        @sp.entrypoint # Note the indentation
        def replace(self, params):
            self.data.greeting = params.text

        @sp.entrypoint # Note the indentation
        def append(self, params):
            self.data.greeting += params.text

# Automated tests that run on simulation
@sp.add_test()
def test():
    # Initialize the test scenario
    scenario = sp.test_scenario("Test scenario", main)
    scenario.h1("StoreGreeting")

    # Initialize the contract and pass the starting value
    contract = main.StoreGreeting("Hello")
    scenario += contract

    # Verify that the value in storage was set correctly
    scenario.verify(contract.data.greeting == "Hello")

    # Test the entrypoints and check the new storage value
    contract.replace(text = "Hi")
    contract.append(text = ", there!")
    scenario.verify(contract.data.greeting == "Hi, there!")
```

## Further reading

- [SmartPy documentation](https://smartpy.io/manual/)
- [Online IDE](https://smartpy.dev/ide)
- [OpenTezos](https://opentezos.com/smartpy)
