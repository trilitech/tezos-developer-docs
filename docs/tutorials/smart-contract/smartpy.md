---
title: Deploy a smart contract with SmartPy
authors: 'John Joubert, Sasha Aldrick, Tim McMackin'
last_update:
  date: 9 October 2023
---

This tutorial covers using the Octez command-line client to deploy a smart contract to Tezos.
The tutorial uses the SmartPy programming language, which is one of the languages that you can write Tezos smart contracts in.
SmartPy has syntax similar to Python, but you don't need any experience with Python or SmartPy to do this tutorial.

- If you are more familiar with OCaml, try [Deploy a smart contract with CameLIGO](./cameligo).
- If you are more familiar with JavaScript, try [Deploy a smart contract with jsLIGO](./jsligo).
- To learn the Archetype language, try [Deploy a smart contract with Archetype](./archetype).

In this tutorial, you will learn how to:

- Connect the Octez client to a testnet
- Create a wallet
- Get tokens from a faucet
- Code a contract in SmartPy, including:
  - Defining the storage for the contract
  - Defining entrypoints in the contract
  - Writing code to run when the entrypoints are called
- Deploy (or originate) the contract to Tezos and set its starting storage value
- Look up the current state of the contract
- Call the contract from the command line

## Tutorial contract

The contract that you deploy in this tutorial stores a string value.
It provides entrypoints that clients can call to change the value of that string:

- The `replace` endpoint accepts a new string as a parameter and stores that string, replacing the existing string.
- The `append` endpoint accepts a new string as a parameter and appends it to the existing string.

After you deploy the contract, you or any other user can call it through Octez or a distributed application (dApp).

## Prerequisites

To run this tutorial, you need the Octez client, Docker, and SmartPy.

- SmartPy requires Docker Desktop, so see https://www.docker.com/ to install Docker Desktop.

- To install the SmartPy programming language, see https://smartpy.io/manual/introduction/installation.

- To install the Octez client, which allows you to send transactions to the Tezos blockchain, use your operating system's package manager:

   - For MacOS, run these commands:

   ```bash
   brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
   brew install tezos-client
   ```

   - For Ubuntu, Windows WSL, and Linux distributions that use `apt`, run these commands:

   ```bash
   REPO="ppa:serokell/tezos"
   sudo add-apt-repository -y $REPO && sudo apt-get update
   sudo apt-get install -y tezos-client
   ```

   - For Fedora and Linux distributions that use Copr, run these commands:

   ```bash
   REPO="@Serokell/Tezos"
   dnf copr enable -y $REPO && dnf update -y
   dnf install -y tezos-client
   ```

   You can verify that the Octez client is installed by running this command:

   ```bash
   octez-client --version
   ```

   If you see a message with the version of Octez that you have installed, the Octez client is installed correctly.
   For help on Octez, run `octez-client --help` or see http://tezos.gitlab.io/index.html.

   For more detailed installation instructions, see [How to get Tezos](http://tezos.gitlab.io/introduction/howtoget.html).

SmartPy is a high-level programming language that you can use to write smart contracts for the Tezos blockchain.

It abstracts away the complexity of using Michelson (the smart contract language directly available on-chain) and provides different syntaxes that make it easier to write smart contracts on Tezos.

## Create a project folder

Follow these steps to create a SmartPy project:

1. On the command-line terminal, create a folder for the project and open it.
You can name your project anything you want, such as `example-smart-contract-smartpy`.

   ```bash
   mkdir example-smart-contract-smartpy
   cd example-smart-contract-smartpy
   ```

1. Create a file named `store_greeting.py` in the project folder.
This is where the contract code goes.

   ```bash
   touch store_greeting.py
   ```

## Switch to a testnet

Before you deploy your contract to the main Tezos network (referred to as *Mainnet*), you can deploy it to a testnet.
Testnets are useful for testing Tezos operations because testnets provide tokens for free so you can work with them without spending real tokens.

Tezos testnets are listed on this site: https://teztnets.xyz/.

The [Ghostnet](https://teztnets.xyz/ghostnet-about) testnet is a good choice for testing because it is intended to be long-lived, as opposed to shorter-term testnets that allow people to test new Tezos features.

Follow these steps to set your Octez client to use a testnet instead of the main network:

1. On https://teztnets.xyz/, click the testnet to use, such as Ghostnet.

1. Copy the one of the testnet's public RPC endpoints, such as `https://rpc.ghostnet.teztnets.xyz`.

1. Set your Octez client to use this testnet by running this command on the command line, replacing the testnet RPC URL with the URL that you copied:

   ```bash
   octez-client --endpoint https://rpc.ghostnet.teztnets.xyz config update
   ```

   Octez shows a warning that you are using a testnet instead of Mainnet.

1. Verify that you are using a testnet by running this command:

   ```bash
   octez-client config show
   ```

   The response from Octez includes the URL of the testnet.

## Create a local wallet

Deploying and using a smart contract costs fees, so you need a local wallet and XTZ tokens.
The Octez client can manage a local wallet for you, and you can get XTZ tokens on testnets from faucets.

1. Run the following command to generate a local wallet, replacing `local_wallet` with a name for your wallet:

   ```bash
   octez-client gen keys local_wallet
   ```

1. Get the address for the wallet by running this command, again replacing `local_wallet` with the name of your local wallet.

   ```bash
   octez-client show address local_wallet
   ```

   The Octez client prints a warning that you are using a testnet and the address of the new wallet in the `hash` field.
   The wallet address begins with `tz1`, `tz2`, or `tz3`, as in this example:

   ```bash
   Warning:

                    This is NOT the Tezos Mainnet.

              Do NOT use your fundraiser keys on this network.

   Hash: tz1dW9Mk...........H67L
   Public Key: edp.............................bjbeDj
   ```

   You need the wallet address to send funds to the wallet, to deploy the contract, and to send transactions to the contract.

1. On the testnets page at https://teztnets.xyz/, click the faucet link for the testnet you are using.
For example, the Ghostnet faucet is at https://faucet.ghostnet.teztnets.xyz.

1. On the faucet page, paste your wallet address into the input field labeled "Or fund any address" and click the button for the amount of XTZ to add to your wallet.
It may take a few minutes for the faucet to send the tokens and for those tokens to appear in your wallet.

   You can use the faucet as much as you need to get tokens on the testnet, but those tokens are worthless and cannot be used on Mainnet.

   ![Fund your wallet using the Ghostnet Faucet](/img/tutorials/wallet-funding.png)

1. Run this command to check the balance of your wallet:

   ```bash
   octez-client get balance for local_wallet
   ```

If your wallet is set up correctly and the faucet has sent tokens to it, the Octez client prints the balance of your wallet, as in this example:

```
100 ꜩ
```

## Create the contract

The contract that you will create has these basic parts:

- A function that initializes the contract and sets the starting value for it storage.

- Internal functions called entrypoints that run code when clients call the contract.

- Automated tests that verify that the contract works as expected.

Follow these steps to create the code for the contract:

1. Open the `store_greeting.py` in any text editor.

1. Add this line of code to import SmartPy:

   ```python
   import smartpy as sp
   ```

1. Add this code that creates the entrypoints:

   ```python
   @sp.module
   def main():
       class StoreGreeting(sp.Contract):
           def __init__(self, greeting):  # Note the indentation
               self.data.greeting = greeting

           @sp.entrypoint   # Note the indentation
           def replace(self, params):
               self.data.greeting = params.text

           @sp.entrypoint    # Note the indentation
           def append(self, params):
               self.data.greeting += params.text
   ```

   Indentation is significant in Python, so make sure that your indentation matches this code.

   The first two lines create a SmartPy module, which indicates that the code is SmartPy instead of ordinary Python.

   Then the code creates a class named StoreGreeting, which represents the smart contract.
   The contract has an `__init__` function, which runs when the contract is deployed.
   In this case, the function sets the initial value of the storage to a parameter that you pass when you deploy the contract.
   This storage value is a string, but the storage can be another primitive type such as an integer or timestamp, or a complex data type that contains multiple values.
   For more information on contract data types, see [Data types](../../smart-contracts/data-types).

1. Add this code that creates the tests:

   ```python
   @sp.add_test(name = "StoreGreeting")
   def test():
     scenario = sp.test_scenario(main)
     scenario.h1("StoreGreeting")

     contract = main.StoreGreeting("Hello")
     scenario += contract

     scenario.verify(contract.data.greeting == "Hello")

     contract.replace(text = "Hi")
     contract.append(text = ", there!")
     scenario.verify(contract.data.greeting == "Hi, there!")
   ```

   These tests run automatically on compilation to verify that the replace and append endpoints work.
   For more information about SmartPy and tests, see the [SmartPy documentation](https://smartpy.io/).

## Testing and compiling the contract

Before you can deploy the contract to Tezos, you must compile it to Michelson, the base language of Tezos contracts.
The compilation process automatically runs the tests in the `store_greeting.py` file.

1. Run this command to compile the contract:

   ```bash
   ./smartpy test store_greeting.py store_greeting/
   ```

If the compilation succeeds, no messages are shown in the terminal and SmartPy creates a compiled smart contract in the `store_greeting/StoreGreeting` folder.
If you see error messages, verify that your contract code matches the code in the previous section.

The output includes JSON Michelson in `.json` files and [Micheline Michelson](https://tezos.gitlab.io/shell/micheline.html) in `.tz` files.
The most important file is named `step_002_cont_0_contract.tz`.
This is the Michelson file that you will use to deploy the contract to the testnet.

## Deploying (originating) to the testnet

Deploying a contract to the network is called "originating."
Originating the contract requires a small amount of Tezos tokens as a fee.

1. Go to the the `store_greeting/StoreGreeting` folder:

   ```bash
   cd store_greeting/StoreGreeting
   ```

1. Run the following command to originate the smart contract, changing `$MY_TZ_ADDRESS` to the address of the wallet that you created earlier in the tutorial:

   ```bash
   octez-client originate contract storeGreeting \
       transferring 0 from $MY_TZ_ADDRESS \
       running step_002_cont_0_contract.tz \
       --init '"Hello"' --burn-cap 0.1
   ```

   This command includes these parts:

     - It uses the Octez client `originate contract` command to originate the contract and assigns the local name `storeGreeting` to the contract
     - It includes 0 tokens from your wallet with the transaction, but the `--burn-cap` argument allows the transaction to take up to 0.1 XTZ from your wallet for fees.
     - It sets the initial value of the contract storage to "Hello" with the `--init` argument.

   If the contract deploys successfully, Octez shows the address of the new contract, as in this example:

   ```bash
   New contract KT1Nnk.................UFsJrq originated.
   The operation has only been included 0 blocks ago.
   We recommend to wait more.
   ```

1. Copy the contract address, which starts with `KT1`.

1. Optional: Run the command `octez-client get balance for local_wallet` to get the updated balance of your wallet.

1. Verify that the contract deployed successfully by finding it on a block explorer:

  1. Open a Tezos block explorer such as [TzKT](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

  1. Set the explorer to Ghostnet instead of Mainnet.

  1. Paste the contract address, which starts with `KT1`, into the search field and press Enter.

  1. Go to the Storage tab to see that the initial value of the storage is "Hello".

![Confirmation that all worked correctly](/img/tutorials/storage_success.png)

## Calling the contract

Now you can call the contract from any Tezos client, including Octez.

To replace the string in storage, call the `replace` entrypoint and pass a new string value, again changing `$MY_TZ_ADDRESS` to the address or local name of the wallet that you created earlier in the tutorial:

```bash
octez-client --wait none transfer 0 from $MY_TZ_ADDRESS to storeGreeting --entrypoint 'replace' --arg '"Hi there!"' --burn-cap 0.1
```

The previous example uses the local name `storeGreeting`.
You can also specify the contract address.

To append text to the string in storage, pass the string to append to the `append` entrypoint:

```bash
octez-client --wait none transfer 0 from $MY_TZ_ADDRESS to storeGreeting --entrypoint 'append' --arg '" Appended Greeting"' --burn-cap 0.1
```

## Summary

Now the contract is running on the Tezos blockchain.
You or any other user can call it from any source that can send transactions to Tezos, including Octez, dApps, and other contracts.

If you want to continue working with this contract, try creating a dApp to call it from a web application, similar to the dApp that you create in the tutorial [Build your first app on Tezos](../build-your-first-app/).
You can also try adding your own endpoints and originating a new contract, but you cannot update the existing contract after it is deployed.
