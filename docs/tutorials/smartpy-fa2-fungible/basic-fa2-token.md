---
title: "Part 1: Setting up a simple FA2 token"
authors: Tim McMackin
last_update:
  date: 22 April 2024
---

In the first part of this tutorial, you create an FA2 token contact that has only the basic features that the standard requires.
For example, the standard does not require the contract to have `mint` and `burn` entrypoints that allow administrators to create and destroy tokens.
In this case, you create the contract with all of the tokens that it will ever have.

## Prerequisites

To run this part of the tutorial, makes sure that you have the following tools installed:

- [Python](https://www.python.org/) and the `pip` package manager
- [SmartPy](https://smartpy.io/manual/introduction/installation)

## Tutorial contract

The completed contract that you create in this part is at [part_1_complete.py](https://github.com/trilitech/tutorial-applications/blob/smartpy-fa2-tutorial/smartpy_fa2_fungible/part_1_complete.py).

## Using the library to create a contract

The FA2 library provides classes that you can extend to create your contract class.
Each class creates a certain type of token contract:

- `main.Nft`: Non-fungible tokens, which are unique digital assets
- `main.Fungible`: Fungible tokens, which are interchangeable assets, like tez or other cryptocurrencies
- `main.SingleAsset`: Single-asset tokens, which are a simplified case of fungible tokens, allowing only one token type per contract

Follow these steps to create your own token contract based on the `main.Fungible` base class:

1. Create a Python file with a `.py` extension, such as `fa2_fungible.py`, in any text editor.

1. In the file, import SmartPy and its FA2 modules:

   ```smartpy
   import smartpy as sp
   from smartpy.templates import fa2_lib as fa2

   # Alias the main template for FA2 contracts
   main = fa2.main
   ```

1. Create a SmartPy module to store your contract class:

   ```smartpy
   @sp.module
   def my_module():
   ```

1. In the module, create a contract class that inherits from the base class and the `OnchainviewBalanceOf` class, which provides an on-chain view that provides token balances:

   ```smartpy
   class MyFungibleContract(
       main.Fungible,
       main.OnchainviewBalanceOf,
   ):
   ```

1. Create the contract's `__init__()` method and initialize the superclasses:

   ```smartpy
   def __init__(self, contract_metadata, ledger, token_metadata):

       # Initialize on-chain balance view
       main.OnchainviewBalanceOf.__init__(self)

       # Initialize fungible token base class
       main.Fungible.__init__(self, contract_metadata, ledger, token_metadata)
   ```

   Note the order of these classes both in the `class` statement and within the `__init__()` method.
   You must inherit and initialize these classes in a specific order for them to work, as described in [Mixins](https://smartpy.io/guides/FA2-lib/mixins). <!-- TODO change link when new docs come out -->

1. Outside the module, add these two utility functions to call views in the contract:

   ```smartpy
   def _get_balance(fa2_contract, args):
       """Utility function to call the contract's get_balance view to get an account's token balance."""
       return sp.View(fa2_contract, "get_balance")(args)


   def _total_supply(fa2_contract, args):
       """Utility function to call the contract's total_supply view to get the total amount of tokens."""
       return sp.View(fa2_contract, "total_supply")(args)
   ```

At this point, the contract looks like this:

```smartpy
import smartpy as sp
from smartpy.templates import fa2_lib as fa2

# Alias the main template for FA2 contracts
main = fa2.main


@sp.module
def my_module():
    class MyFungibleContract(
        main.Fungible,
        main.OnchainviewBalanceOf,
    ):
        def __init__(self, contract_metadata, ledger, token_metadata):

            # Initialize on-chain balance view
            main.OnchainviewBalanceOf.__init__(self)

            # Initialize fungible token base class
            main.Fungible.__init__(self, contract_metadata, ledger, token_metadata)


def _get_balance(fa2_contract, args):
    """Utility function to call the contract's get_balance view to get an account's token balance."""
    return sp.View(fa2_contract, "get_balance")(args)


def _total_supply(fa2_contract, args):
    """Utility function to call the contract's total_supply view to get the total amount of tokens."""
    return sp.View(fa2_contract, "total_supply")(args)
```

Indentation is significant in Python, so make sure that your contract is indented like this example.

This short contract is all of the necessary code for a basic FA2 token contract.
The inherited classes provide all of the necessary entrypoints.

## Adding the contract to a test scenario

SmartPy provides a testing framework that runs contracts in a realistic simulation called a test scenario.
This test scenario is also the way SmartPy compiles contracts to Michelson for deployment, so you must add your contract to a test scenario.

1. At the end of the contract file, define a test scenario function with this code:

   ```smartpy
   @sp.add_test()
   def test():
   ```

   The code within this scenario is ordinary Python, not SmartPy, so you can do all of the things that you can normally do in Python, including importing modules and calling external APIs.
   Code within a SmartPy module (annotated with `@sp.module`) is SmartPy code and is limited by what you can do in smart contracts.
   Importing modules and calling external APIs isn't possible in SmartPy modules, except for the modules that SmartPy provides.

1. Inside the test scenario function, initialize the test scenario by passing a name for the scenario and the modules to use in the scenario to the `sp.test_scenario` function:

   ```smartpy
   # Create and configure the test scenario
   # Import the types from the FA2 library, the library itself, and the contract module, in that order.
   scenario = sp.test_scenario("fa2_lib_fungible", [fa2.t, fa2.main, my_module])
   ```

1. Define test accounts to use in the scenario with the `sp.test_account` function:

   ```smartpy
   # Define test accounts
   alice = sp.test_account("Alice")
   bob = sp.test_account("Bob")
   ```

1. Set up token metadata, which describes the tokens to users.
For example, these lines create metadata for two token types, named `Token Zero` and `Token One`:

   ```smartpy
   # Define initial token metadata
   tok0_md = fa2.make_metadata(name="Token Zero", decimals=0, symbol="Tok0")
   tok1_md = fa2.make_metadata(name="Token One", decimals=0, symbol="Tok1")
   ```

   The `fa2.make_metadata` function creates a token metadata object that complies with the [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard.

   Your contract can have as many types of fungible tokens as you want, but the examples in this tutorial use these two token types.
   The contract assigns them numeric IDs starting at 0.

1. Create the starting ledger for the contract, which lists the tokens and their owners.
This example gives 10 of token 0 to the Alice test account and 10 of token 1 to the Bob test account:

   ```smartpy
   # Define tokens and initial owners
   initial_ledger = {
       (alice.address, 0): 10,
       (bob.address, 1): 10,
   }
   ```

   The type of this ledger is set by the FA2 standard, so casting it to the `ledger_fungible` type helps you make sure that your ledger matches the standard.

   The ledger is a big map where the key is a pair of the token owner and token ID and the value is the amount of tokens.
   In table format, the ledger looks like this:

   key | value
   --- | ---
   Alice, token ID 0 | 10
   Bob, token ID 1 | 10

   You can distribute tokens to any accounts that you want in the test scenario.
   Because the contract has no `mint` entrypoint, this initial ledger defines all of the tokens and token types that the contract contains.

1. Create an instance of the contract in the test scenario and pass the values for its initial storage:

   ```smartpy
   # Instantiate the FA2 fungible token contract
   contract = my_module.MyFungibleContract(sp.big_map(), initial_ledger, [tok0_md, tok1_md])
   ```

   These are the parameters for the contract's `__init__()` method:

   - The contract metadata, which is blank for now
   - The initial ledger
   - The metadata for the token types, in a list

1. Add the contract to the test scenario, which deploys (originates) it to the simulated Tezos environment:

   ```smartpy
   # Originate the contract in the test scenario
   scenario += contract
   ``````

At this point, the contract looks like this:

```smartpy
import smartpy as sp
from smartpy.templates import fa2_lib as fa2

# Alias the main template for FA2 contracts
main = fa2.main


@sp.module
def my_module():
    class MyFungibleContract(
        main.Fungible,
        main.OnchainviewBalanceOf,
    ):
        def __init__(self, contract_metadata, ledger, token_metadata):

            # Initialize on-chain balance view
            main.OnchainviewBalanceOf.__init__(self)

            # Initialize fungible token base class
            main.Fungible.__init__(self, contract_metadata, ledger, token_metadata)


def _get_balance(fa2_contract, args):
    """Utility function to call the contract's get_balance view to get an account's token balance."""
    return sp.View(fa2_contract, "get_balance")(args)


def _total_supply(fa2_contract, args):
    """Utility function to call the contract's total_supply view to get the total amount of tokens."""
    return sp.View(fa2_contract, "total_supply")(args)


@sp.add_test()
def test():
    # Create and configure the test scenario
    # Import the types from the FA2 library, the library itself, and the contract module, in that order.
    scenario = sp.test_scenario("fa2_lib_fungible", [fa2.t, fa2.main, my_module])

    # Define test accounts
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")

    # Define initial token metadata
    tok0_md = fa2.make_metadata(name="Token Zero", decimals=0, symbol="Tok0")
    tok1_md = fa2.make_metadata(name="Token One", decimals=0, symbol="Tok1")

    # Define tokens and initial owners
    initial_ledger = {
        (alice.address, 0): 10,
        (bob.address, 1): 10,
    }

    # Instantiate the FA2 fungible token contract
    contract = my_module.MyFungibleContract(sp.big_map(), initial_ledger, [tok0_md, tok1_md])

    # Originate the contract in the test scenario
    scenario += contract
```

## Adding tests

SmartPy has built-in tools for testing contracts as part of the test scenario.
In test scenarios, you can call contract entrypoints, verify the contract storage, and do other things to make sure that the contract is working as expected.

Follow these steps to add tests to the contract:

1. At the end of the file, add this code to verify the initial state of the ledger:

   ```smartpy
   scenario.h2("Verify the initial owners of the tokens")
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=0)) == 10
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=0)) == 0
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=1)) == 0
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=1)) == 10
   )
   scenario.verify(_total_supply(contract, sp.record(token_id=0)) == 10)
   scenario.verify(_total_supply(contract, sp.record(token_id=1)) == 10)
   ```

   This code uses the `get_balance_of` and `total_supply` views to check the current owners of the tokens and the total amount of tokens when the contract is deployed.

   Note that the calls to these views are within the `scenario.verify` function.
   To verify details about the deployed contract, you must use this function to access the state of the contract within the test scenario.

1. Add this code to call the contract's `transfer` entrypoint and verify that the tokens transferred correctly:

   ```smartpy
   scenario.h2("Transfer tokens")
   # Bob sends 3 of token 1 to Alice
   contract.transfer(
       [
           sp.record(
               from_=bob.address,
               txs=[sp.record(to_=alice.address, amount=3, token_id=1)],
           ),
       ],
       _sender=bob,
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=0)) == 10
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=0)) == 0
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=1)) == 3
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=1)) == 7
   )
   scenario.verify(_total_supply(contract, sp.record(token_id=0)) == 10)
   scenario.verify(_total_supply(contract, sp.record(token_id=1)) == 10)

   # Alice sends 4 of token 0 to Bob
   contract.transfer(
       [
           sp.record(
               from_=alice.address,
               txs=[sp.record(to_=bob.address, amount=4, token_id=0)],
           ),
       ],
       _sender=alice,
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=0)) == 6
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=0)) == 4
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=1)) == 3
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=bob.address, token_id=1)) == 7
   )
   scenario.verify(_total_supply(contract, sp.record(token_id=0)) == 10)
   scenario.verify(_total_supply(contract, sp.record(token_id=1)) == 10)
   ```

   This code calls the transfer entrypoint, passes the transfer information, and adds the `_sender=bob` parameter to indicate that the transfer came from Bob's account.
   Then it calls the contract's views again to verify that the tokens were transferred and that the total supply of tokens remains the same.
   Then it tries again from Alice's account.

1. Test an entrypoint call that should fail by adding this code:

   ```smartpy
   # Bob cannot transfer Alice's tokens
   contract.transfer(
       [
           sp.record(
               from_=alice.address,
               txs=[sp.record(to_=bob.address, amount=1, token_id=0)],
           ),
       ],
       _sender=bob,
       _valid=False,
   )
   ```

   This call should fail because it comes from Bob's account but the call tries to transfer tokens out of Alice's account.
   The call includes the `_valid=False` parameter to indicate that this call should fail.

You can add any number of tests to your test scenario.
In practice, you should test all features of your contract thoroughly to identify any problems before deployment.

## Compiling the contract

To compile the contract, use the `python` command, just like any other Python file:

```bash
python fa2_fungible.py
```

If SmartPy compiles your contract successfully, nothing is printed to the command line output.
Its compiler writes your contract to a folder with the name in the `sp.test_scenario` function, which is `fa2_lib_fungible` in this example.
This folder has many files, including:

- `log.txt`: A compilation log that lists the steps in the test scenario and connects them to the other files that the compiler created.
- `step_003_cont_0_contract.tz`: The compiled Michelson contract, which is what you deploy to Tezos in the next section.
The compiler also creates a JSON version of the compiled contract.
- `step_003_cont_0_storage.tz`: The compiled Michelson value of the initial contract storage, based on the parameters you passed when you instantiated the contract in the test scenario.
The compiler also creates a JSON and Python version of the storage.
- `step_003_cont_0_types.py`: The Python types that the contract uses, which can help you call the contract from other SmartPy contracts.

You can use the compiled contract and storage files to deploy the contract.
In the next section, you deploy the contract to a local Tezos sandbox.

## Troubleshooting

If the `python` command shows any errors, make sure that your contract matches the example.
In particular, check your indentation, because indentation is significant in Python and SmartPy.

You can compare your contract with the completed contract here: [part_1_complete.py](https://github.com/trilitech/tutorial-applications/blob/smartpy-fa2-tutorial/smartpy_fa2_fungible/part_1_complete.py).

TODO more troubleshooting

## (Optional) Deploy the contract to the Octez client mockup mode

The Octez client provides a few local sandbox modes that you can use to test contracts without uploading them to a test network or running a local Tezos environment.

Follow these steps to set up the Octez client mockup mode and deploy the contract to it:

1. Install the Octez client by following the steps in [Installing the Octez client](../../developing/octez-client/installing).

1. Set up the Octez client mockup mode:

   1. Run this command to start mockup mode:

      ```bash
      octez-client \
        --protocol ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK \
        --base-dir /tmp/mockup \
        --mode mockup \
        create mockup
      ```

      Now you can run commands in mockup mode by prefixing them with `octez-client --mode mockup --base-dir /tmp/mockup`.

   1. Create an alias for mockup mode:

      ```bash
      alias mockup-client='octez-client --mode mockup --base-dir /tmp/mockup'
      ```

      Now you can run commands in mockup mode with the `mockup-client` alias, as in this example:

      ```bash
      mockup-client list known addresses
      ```

1. Deploy the contract to mockup mode:

   1. Create two Octez accounts to represent the Alice and Bob accounts in the test scenario:

      ```bash
      mockup-client gen keys alice
      mockup-client gen keys bob
      ```

   1. Get the addresses for Alice and Bob by running this command:

      ```bash
      mockup-client list known addresses
      ```

   1. Replace the addresses in the initial storage value in the `step_003_cont_0_storage.tz` file with the mockup addresses.
   For example, the file might look like this:

      ```michelson
      (Pair {Elt (Pair "tz1Utg2AKcbLgVokY7J8QiCjcfo5KHk3VtHU" 1) 10; Elt (Pair "tz1XeaZgLqgCqMA3Egz5Q7bqiqdFefaNoQd5" 0) 10} (Pair {} (Pair 2 (Pair {} (Pair {Elt 0 10; Elt 1 10} {Elt 0 (Pair 0 {Elt "decimals" 0x30; Elt "name" 0x546f6b656e205a65726f; Elt "symbol" 0x546f6b30}); Elt 1 (Pair 1 {Elt "decimals" 0x30; Elt "name" 0x546f6b656e204f6e65; Elt "symbol" 0x546f6b31})})))))
      ```

      Now you can use this file as the initial storage value and give the initial tokens to the mockup addresses.

   1. Deploy the contract by passing the compiled contract and initial storage value to the `originate contract` command.
   For example, if your compiled files are in the `fa2_lib_fungible` folder, the command looks like this:

      ```bash
      mockup-client originate contract smartpy_fa2_fungible \
        transferring 0 from bootstrap1 \
        running fa2_lib_fungible/step_003_cont_0_contract.tz \
        --init "$(cat fa2_lib_fungible/step_003_cont_0_storage.tz)" --burn-cap 3 --force
      ```

      If you see errors that refer to unexpected characters, make sure the paths to the files are correct and that you changed only the content of addresses inside quotes in the storage file.

      If you see the error "Keys in a map literal must be in strictly ascending order, but they were unordered in literal," reverse the order of the two addresses.

      If the deployment succeeds, the Octez client prints the address of the contract and aliases it as `smartpy_fa2_fungible`.

   1. Use the built-in `get_balance_of` view to see the tokens that one of the accounts owns:

      ```bash
      mockup-client run view get_balance_of \
        on contract smartpy_fa2_fungible \
        with input '{Pair "tz1Utg2AKcbLgVokY7J8QiCjcfo5KHk3VtHU" 1}'
      ```

      The response shows a Michelson value that includes the ID and amount of tokens that the address owns, as in this example:

      ```michelson
      { Pair (Pair "tz1Utg2AKcbLgVokY7J8QiCjcfo5KHk3VtHU" 1) 10 }
      ```

   <!-- TODO make a transaction or wait? We'd have to send tez from bootstrap to alice and then get the addresses right in the param file. -->

For more information, see [Mockup mode](https://tezos.gitlab.io/user/mockup.html) in the Octez documentation.

Now you have a basic FA2 fungible token contract that starts with a predefined amount of tokens.

In the next part, you add minting and burning functionality to the contract so an administrator can create and destroy tokens.
