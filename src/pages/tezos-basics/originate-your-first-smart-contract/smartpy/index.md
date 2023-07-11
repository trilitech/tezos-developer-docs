---
id: first-smart-contract-smartpy
title: Originate your First Smart Contract with SmartPy
slug: /first-smart-contract
authors: 'John Joubert, Sasha Aldrick'
lastUpdated: July 2023
---

## Prerequisites

| Dependency         | Installation instructions                                                                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SmartPy            | Follow the _Installation_ steps in this [guide](https://smartpy.dev/docs/manual/introduction/installation). SmartPy requires Docker to run. For MacOS and Linux, it is recommended to install [Docker Desktop](https://www.docker.com/products/docker-desktop/). |
| _octez-client_ CLI | Follow the _How to install the octez-client_ steps [here](/developers/docs/tezos-basics/get-started-with-octez/).                                                                                                                                                |

{% callout type="warning" title="Note" %}
Make sure you have **installed** the above CLI tools before getting started.
{% /callout %}

Now that you have installed the [_octez-client_](https://opentezos.com/tezos-basics/cli-and-rpc/#how-to-install-the-octez-client) and [_Smartpy_](https://smartpy.io/docs/cli/#installation), we'll go ahead and dive right in.

## Create a project folder

Now we can go ahead and create a folder somewhere on our local drive with the name of the project. Let's call it `example-smart-contract`.

```bash
mkdir example-smart-contract
```

```bash
cd example-smart-contract
```

## Create a project file

Inside the `example-smart-contract` folder, let's create a file called `store_greeting.py` and save it. We'll need this file later.

```bash
touch store_greeting.py
```

## Confirm your setup

### Smartpy

The preferred way of running SmartPy is via the `smartPy` wrapper. To obtain the SmartPy executable within your local project folder:

```bash
wget smartpy.io/smartpy
chmod a+x smartpy
```

If you are missing `wget` on MacOS, you can use `brew install wget` or the package manager of your choice.

This creates a local executable file named `smartpy` which we will use to to compile our contract.

We can check that it's correctly installed by running the following command:

```bash
./smartpy
```

And we should see something like this returned:

```
./smartpy
Usage:
   ./smartpy test        <script> <output> <options>* (execute all test targets)
   ./smartpy doc         <script> <output>            (document script)

   Parameters:
         <script>              : a script containing SmartPy code
         <output>              : a directory for the results

   Options:
         --protocol <protocol> : optional, select target protocol - default is lima
         --<flag> <arguments>  : optional, set some flag with arguments
         --<flag>              : optional, activate some boolean flag
         --no-<flag>           : optional, deactivate some boolean flag
```

### Octez-client

We can check that it's correctly installed by running the following command:

```
octez-client
```

And we should see something like this returned:

```
Usage:
  octez-client [global options] command [command options]
  octez-client --help (for global options)
  octez-client [global options] command --help (for command options)
  octez-client --version (for version information)

To browse the documentation:
  octez-client [global options] man (for a list of commands)
  octez-client [global options] man -v 3 (for the full manual)

Global options (must come before the command):
  -d --base-dir <path>: client data directory (absent: TEZOS_CLIENT_DIR env)
  -c --config-file <path>: configuration file
  -t --timings: show RPC request times
  --chain <hash|tag>: chain on which to apply contextual commands (commands dependent on the context associated with the specified chain). Possible tags are 'main' and 'test'.
  -b --block <hash|level|tag>: block on which to apply contextual commands (commands dependent on the context associated with the specified block). Possible tags include 'head' and 'genesis' +/- an optional offset (e.g. "octez-client -b head-1 get timestamp"). Note that block queried must exist in node's storage.
  -w --wait <none|<int>>: how many confirmation blocks are needed before an operation is considered included
  -p --protocol <hash>: use commands of a specific protocol
  -l --log-requests: log all requests to the node
  --better-errors: Error reporting is more detailed. Can be used if a call to an RPC fails or if you don't know the input accepted by the RPC. It may happen that the RPC calls take more time however.
  -A --addr <IP addr|host>: [DEPRECATED: use --endpoint instead] IP address of the node
  -P --port <number>: [DEPRECATED: use --endpoint instead] RPC port of the node
  -S --tls: [DEPRECATED: use --endpoint instead] use TLS to connect to node.
  -m --media-type <json, binary, any or default>: Sets the "media-type" value for the "accept" header for RPC requests to the node. The media accept header indicates to the node which format of data serialisation is supported. Use the value "json" for serialisation to the JSON format.
  -E --endpoint <uri>: HTTP(S) endpoint of the node RPC interface; e.g. 'http://localhost:8732'
  -s --sources <path>: path to JSON file containing sources for --mode light. Example file content: {"min_agreement": 1.0, "uris": ["http://localhost:8732", "https://localhost:8733"]}
  -R --remote-signer <uri>: URI of the remote signer
  -f --password-filename <filename>: path to the password filename
  -M --mode <client|light|mockup|proxy>: how to interact with the node

```

## Switch to a Testnet

Before going further let's make sure we're working on a [Testnet](https://teztnets.xyz).&#x20;

View the available Testnets:

```
https://teztnets.xyz
```

The [Ghostnet](https://teztnets.xyz/ghostnet-about) might be a good choice for this guide (at the time of writing).&#x20;

Copy the _Public RPC endpoint_ which looks something like this:

```
https://rpc.ghostnet.teztnets.xyz
```

Make sure we use this endpoint by running:

```bash
octez-client --endpoint https://rpc.ghostnet.teztnets.xyz config update
```

You should then see something like this returned:

```
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.
```

## Create a local wallet

We're now going to create a local wallet to use throughout this guide.

Run the following command to generate a local wallet with _octez-client_, making sure to replace `<my_wallet>` with a name of your choosing:

```bash
octez-client gen keys local_wallet
```

Let's get the address for this wallet because we'll need it later:

```bash
octez-client show address local_wallet
```

Which will return something like this:

```
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.

Hash: tz1dW9Mk...........H67L
Public Key: edp.............................bjbeDj
```

We'll want to copy the Hash that starts with `tz` to your clipboard:

```
tz1dW9Mk...........H67L
```

## Fund your test wallet&#x20;

Tezos provides a [faucet](https://faucet.ghostnet.teztnets.xyz) to allow you to use the Testnet for free (has no value and can't be used on the Mainnet).

Let's go ahead and fund our wallet through the [Ghostnet Faucet](https://faucet.ghostnet.teztnets.xyz). Paste the hash you copied earlier into the input field for "Or fund any address" and select the amount you'd like to add to your wallet.

![Fund your wallet using the Ghostnet Faucet](/developers/docs/images/wallet-funding.png)

Wait a minute or two and you can then run the following command to check that your wallet has funds in it:

```
 octez-client get balance for local_wallet
```

Which will return something like this:

```
100 ꜩ
```

## Use Smartpy to create the contract

Open the file `store_greeting.py` in your favourite text editor and let's start writing our first smart contract!

Copy and paste the following code block into your file and save it.

```python
import smartpy as sp

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

As you can see we're going to set the intial greeting to "Hello" and we'll have the ability later to either replace this greeting or add to it (append).

We've also included some tests to make sure all is working as expected. You can read more about about SmartPy testing [here](https://smartpy.io/manual/scenarios/overview).

## Compile the smart contract to Michelson&#x20;

Now that we have our code setup, let's compile the smart contract and run the tests simultaneously.

```bash
./smartpy test store_greeting.py store_greeting/
```

You should see this command output our test results and compiled contracts to the folder `/store_greeting/StoreGreeting`.

There are two types of output, JSON Michelson in `.json` files and [Micheline Micelson](https://tezos.gitlab.io/shell/micheline.html) in `.tz` files.

The most important file is `step_002_cont_0_contract.tz`. This Michelson file we can use to originate the contract to the testnet.

## Originate to the Testnet

First you need to make sure that your current directory is `/store_greeting/StoreGreeting`.

From the project folder:

```bash
cd output/storeGreeting
```

Then run the following command to originate the smart contract:

```bash
octez-client originate contract storeGreeting transferring 0 from local_wallet running step_002_cont_0_contract.tz --init '"Hello"' --burn-cap 0.1
```

This will originate the contract with an initial greeting of "Hello".

You should get a similar confirmation that your smart contract has been originated:

```bash
New contract KT1Nnk.................UFsJrq originated.
The operation has only been included 0 blocks ago.
We recommend to wait more.
```

Make sure you copy the contract address for the next step!

## Confirm that all worked as expected

To interact with the contract and confirm that all went as expected, you can use an Explorer such as:[TzKT ](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

Make sure you have switched to [Ghostnet](https://ghostnet.tzkt.io) before you start looking.

Then paste the contract address (starting with KT1) `KT1Nnk.................UFsJrq` into the search field and hit `enter` to find it.

Then navigate to the `Storage` tab to see your initial value of `Hello`.

![Confirmation that all worked correctly](/developers/docs/images/storage_success.png)

## Calling the entrypoints

Now that we've successfully originated our smart contract, let's test out the two entrypoints that we created: `replace` and `append`

#### Replace

To replace "Hello" with "Hi there!", we can run the command below:

```bash
octez-client --wait none transfer 0 from local_wallet to storeGreeting --entrypoint 'replace' --arg '"Hi there!"' --burn-cap 0.1
```

#### &#x20;Append

Finally, to append some text, you can run this command:

```bash
octez-client --wait none transfer 0 from local_wallet to storeGreeting --entrypoint 'append' --arg '" Appended Greeting"' --burn-cap 0.1
```
