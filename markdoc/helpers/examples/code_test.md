---
id: first-smart-contract
title: Deploy your First Smart Contract
slug: /first-smart-contract
authors: John Joubert
---

## Prerequisites

| Dependency         | Installation instructions                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Smartpy CLI        | Follow the _Installation_ steps in this [guide](https://smartpy.dev/docs/manual/introduction/installation).       |
| _octez-client_ CLI | Follow the _How to install the octez-client_ steps [here](/developers/docs/tezos-basics/get-started-with-octez/). |

{% callout type="warning" title="Note" %}
Make sure you have **installed** the above CLI tools before getting started.
{% /callout %}

Now that you have installed the [_octez-client_](https://opentezos.com/tezos-basics/cli-and-rpc/#how-to-install-the-octez-client) and [_Smartpy_](https://smartpy.io/docs/cli/#installation), we'll go ahead and dive right in.

## Create a project folder

This is some text. Now I will include a math equation:

{% math %}
E = mc^2
{% /math %}

This equation states that energy (E) is equal to mass (m) times the speed of light (c) squared.

This is an inline math equation: {% math inline=true %}E = mc^2{% /math %}

{% math %}
i \hbar \frac{\partial}{\partial t} \Psi = \hat{H} \Psi
{% /math %}

{% code language="javascript" %}
const hello = "Hello, world!";
console.log(hello);
mkdir example-smart-contract
{% /code %}

{% code language="bash" %}
mkdir example-smart-contract
{% /code %}

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

Installing the `smartpy-cli` would have created a `/smartpy-cli/` directory in `home` (on a Mac).&#x20;

We can check that it's correctly installed by running the following command:

```bash
~/smartpy-cli/SmartPy.sh --version
```

And we should see something like this returned:

```
SmartPy Version: 0.15.0
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
octez-client gen keys <my_wallet>
```

Let's get the address for this wallet because we'll need it later:

```
octez-client show address <my_wallet>
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
 octez-client get balance for <my_wallet>
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

class StoreGreeting(sp.Contract):
    def __init__(self, value):  # Note the indentation
        self.init(text = value)

    @sp.entry_point   # Note the indentation
    def replace(self, params):
        self.data.text = params.text

    @sp.entry_point    # Note the indentation
    def append(self, params):
        self.data.text += params.text

@sp.add_test(name = "StoreGreeting")

def test():
  scenario = sp.test_scenario()
  contract = StoreGreeting("Hello")
  scenario += contract

  scenario.verify(contract.data.text == "Hello")

  contract.replace(text = "Hi")
  contract.append(text = ", there!")
  scenario.verify(contract.data.text == "Hi, there!")

  sp.add_compilation_target("storeGreeting", StoreGreeting("Hello"))   # Set an initial value on compile
```

As you can see we're going to set the initial value to "Hello" and we'll have the ability later to either replace this greeting or add to it (append).

We've also included some tests to make sure all is working as expected.

## Run the tests

Now that we have our code set up, let's run the tests.

```
~/smartpy-cli/SmartPy.sh test store_greeting.py ./test-output
```

You should see this command output our test files to the folder `/test-ouput/`.

## Compile the smart contract to Michelson&#x20;

Run the following commands to compile the smart contract in preparation for deploying it to the Testnet.

```
 ~/smartpy-cli/SmartPy.sh compile store_greeting.py ./output
```

You should now see a new folder created called `/output/` which will contain all of your compiled files.

## Deploy to the Testnet

We're now going to deploy to the Testnet!

First, you need to make sure that your current directory is `/output/storeGreeting/`.

```bash
cd output/storeGreeting
```

Then run the following command to deploy the smart contract:

```
 ~/smartpy-cli/SmartPy.sh originate-contract --code step_000_cont_0_contract.json --storage step_000_cont_0_storage.json --rpc https://rpc.ghostnet.teztnets.xyz
```

You should get the following confirmation that your smart contract has been originated:

```
[INFO] - Using RPC https://rpc.ghostnet.teztnets.xyz...
[INFO] - Contract KT1Nnk.................UFsJrq originated!!!
```

Make sure you copy the contract address for the next step!

## Confirm that all worked as expected

To interact with the contract and confirm that all went as expected, you can use an explorer such as:[TzKT ](https://tzkt.io)

Make sure you switch to the [Ghostnet](https://ghostnet.tzkt.io) before you start.

Then paste the contract address (starting with KT1) `KT1Nnk.................UFsJrq` into the search field and hit `enter` to find it.

Then navigate to the `Storage` tab to see your initial value of `Hello`.

![Confirmation that all worked correctly](/developers/docs/images/storage.png)

## Replace or append the text

Now that we've successfully deployed our smart contract, let's test out the two entrypoints that we created: `replace` and `append`

#### Replace

To replace "Hello" with "Hi there!", we can run the command below:

{% callout title="Information" %}
Make sure that you replace **\<my_wallet>** with the name of the wallet your created earlier and **\<contract-address>** with the contract address starting with KT1.
{% /callout %}

```
octez-client transfer 0 from <my_wallet> to <contract-address> --entrypoint replace --arg '"Hi there!"'
```

You will likely see an error that says something like this:

```
Fatal error:
  The operation will burn ꜩ0.001 which is higher than the configured burn cap (ꜩ0).
   Use `--burn-cap 0.001` to emit this operation.
```

Just update your command to include `--burn-cap <amount>` to ensure that it is processed.

Once you've done that, you can refresh the Explorer page and see your new text.

#### &#x20;Append

Finally, to append some text, you can run this command:

```
octez-client transfer 0 from <my_wallet> to <contract-address> --entrypoint append --arg '"My name is Jane Doe."'
```
