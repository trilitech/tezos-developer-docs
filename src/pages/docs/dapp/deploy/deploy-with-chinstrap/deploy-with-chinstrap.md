---
id: deploy-with-chinstrap
title: Deploy with Chinstrap
authors: ant4g0nist
---

[![Chinstrap](./chinstrap.png)](https://chinstrap.io)


*Chinstrap*, developed by [ant4g0nist](https://twitter.com/ant4g0nist), uses python scripts to perform smart contract deployments and makes deployments easier and faster.


*Chinstrap* makes developers' lives easier by providing support for multiple contract compilations, tests, and origination on public and private Tezos networks. *Chinstrap* can compile and deploy LIGO or SmartPy contracts on the Tezos network with a single command.

*Chinstrap* received grants from Tezos Foundation. :confetti_ball::confetti_ball:

# *Chinstrap* installation

## Requirements and dependencies

* Python >= 3.7
* Docker
* Node.js
* [Homebrew](https://brew.sh/) needs to be installed.

Open a terminal and run:

```
➜ brew tap cuber/homebrew-libsecp256k1
➜ brew install libsodium libsecp256k1 gmp
```

To install *Chinstrap* v0.1.0 from Github, open a terminal and run:
```
➜ git clone https://github.com/ant4g0nist/chinstrap/ -b v0.1.0
➜ cd chinstrap
➜ pip3 install . -U
```

#### M1 (ARM)
In case `secp256k1` or `gmp` cannot find either include or lib paths, try explicitly set environment vars:

```
export CFLAGS="-I`brew --prefix gmp`/include -I`brew --prefix libsecp256k1`/include"
export LDFLAGS="-L`brew --prefix gmp`/lib -L`brew --prefix libsecp256k1`/lib"
pip3 install . -U 
```

or follow instructions from [pytezos](https://github.com/baking-bad/pytezos/blob/master/README.md?plain=1#L63)

For more info, you can refer to the [official documentation](https://chinstrap.io)

# Usage

You can get list of sub-commands supported by Chinstrap by running:

```
➜ chinstrap -h
      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
usage: chinstrap [-h]
                 {init,config,networks,compile,install,create,templates,test,sandbox,develop,originate,account}
                 ...

positional arguments:
  {init,config,networks,compile,install,create,templates,test,sandbox,develop,originate,account}
    init                Initialize a new Chinstrap project
    config              Verify Chinstrap configuration
    networks            List currently available test networks
    compile             Compile contract source files
    install             Helper to install compilers
    create              Helper to create new contracts, originations
                        and tests
    templates           Download templates provided by SmartPy and
                        *LIGO
    test                Run pytest/smartpy/ligo tests
    sandbox             Start a Tezos local sandbox
    develop             Open an interactive console for Tezos
    originate           Run originations and deploy contracts
    account             Tezos account

optional arguments:
  -h, --help            show this help message and exit
```

Chinstrap provides the option to install the compilers to local machines or in Docker. By default, Chinstrap prefers to use Docker images to keep the local system clean.

```
➜ chinstrap install -h

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
usage: chinstrap install [-h] [-f] [-l] [-c {all,smartpy,ligo}]

optional arguments:
  -h, --help            show this help message and exit
  -f, --force           Force update compilers
  -l, --local           Install on local machine. If not specified, Docker is used
  -c {all,smartpy,ligo}, --compiler {all,smartpy,ligo}
                        Installs selected compilers
```
Please make sure Docker is running before running `chinstrap install`

```
➜ chinstrap install

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
🎉 Ligo installed
🎉 SmartPy installed
```

## Initializing a *Chinstrap* project
Chinstrap provides a sub-command to initialize a new Chinstrap project.

```
➜ mkdir tezos-example
➜ cd tezos-example
➜ chinstrap init

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
Done. Happy coding 🐧
```

### Project Structure overview

```
➜ tree
.
├── chinstrap-config.yml
├── contracts
│   └── SampleContract.py
├── originations
│   └── 1_samplecontract_origination.py
└── tests
    ├── sampleContractSmartPy.py
    └── samplecontractPytest.py

3 directories, 5 files
```

* **contracts**: the folder containing all the LIGO/SmartPy smart contracts that *Chinstrap* has to compile.
* **originations**: the folder containing the *Chinstrap* origination/deployment scripts for the deployment of the contracts.
* **test**: the folder containing Javascript tests
* **chinstrap-config.yaml**: the configuration file which defines networks and accounts to be used for the deployment.


## Configuring *Chinstrap*

*Chinstrap* configuration file is a yaml file, that tells chinstrap, which account and network to use for origination, which compiler to use for compilation and testing.

A minimal configuration file looks like this:

```
chinstrap:
  network:
    development:
      host: http://localhost:12345
      accounts:
        - privateKeyFile: ./.secret
  compiler:
    lang: smartpy
    test: smartpy
```

The above configuration file tells *Chinstrap* that we are building contracts using SmartPy, and we are writing tests in SmartPy. It also specifies `development` as the network to use and specifies the privateKeyFile to use to originate.

### Configuring *Chinstrap* compiler
Supported options for `lang`:
- *smartpy*
- *cameligo*
- *pascaligo*
- *reasonligo*
- *jsligo*

Supported options for `test`:
- *smartpy*
- *pytest*
- *smartpy*
- *cameligo*
- *pascaligo*
- *reasonligo*
- *jsligo*

### Configuring *Chinstrap* network

The network configuration in *Chinstrap* is added under the `network` option. Some networks are already defined: _hangzhounet_, _ithacanet_, _mainnet_, and _development_. However, as the Tezos protocol constantly evolving, new networks will have to be added to the configuration.

Each network requires:
* **host**: An RPC node ([https://tezostaquito.io/docs/rpc_nodes/](https://tezostaquito.io/docs/rpc_nodes/)) or a local node (as shown in the development network).
* **accounts**: A lsit of files that contains private key of accounts to be used for origination. First account from the list is used for originations.

```
➜ cat chinstrap-config.yml 
chinstrap:
# Networks define how Chinstrap connect to Tezos.
  network:
    development:
      host: http://localhost:20000

      # You need to configure accounts with private key,
      # to sign your transactions before they're sent to a remote public node
      accounts:
        - privateKeyFile: ./.secret

    # hangzhounet:
    #   host: https://hangzhounet.smartpy.io:443
    #   accounts:
    #     - privateKeyFile: ./.secret

    # ithacanet:
    #   host: https://ithacanet.smartpy.io:443
    #   accounts:
    #     - privateKeyFile: ./.secret

    # mainnet:
    #   host: https://mainnet.smartpy.io:443
    #   accounts:
    #     - privateKeyFile: ./.secret

  compiler:
    # Compiler configuration
    # lang: smartpy, cameligo, pascaligo, reasonligo, jsligo
    lang: smartpy

    # test: smartpy, pytest, smartpy, cameligo, pascaligo, reasonligo, jsligo
    test: smartpy
```

## Compiling smart contracts with *Chinstrap*

*Chinstrap* is mainly used for smart contract compilation, originations and testing. 


```
➜ chinstrap compile -h

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
usage: chinstrap compile [-h] [-c CONTRACT] [-l] [-r] [-w] [-e ENTRYPOINT]

optional arguments:
  -h, --help            show this help message and exit
  -c CONTRACT, --contract CONTRACT
                        Contract to compile. If not specified, all the contracts are compiled
  -l, --local           Use compiler from host machine. If not specified, Docker image is used
  -r, --werror          Treat Ligo compiler warnings as errors
  -w, --warning         Display Ligo compiler warnings
  -e ENTRYPOINT, --entrypoint ENTRYPOINT
                        Entrypoint to use when compiling Ligo contracts. Default entrypoint is main
```

To compile the contracts inside `contracts` folder, just run:

```
➜ chinstrap compile 

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
✔ SampleContract.py compilation successful!
```

*Chinstrap* picks up the contracts based on the `lang` configured in `chinstrap-config.yml` and compiles with specific compiler. Compiled contracts can be found in `build/contracts/` folder. 

:::info
Chinstrap considers each file inside `contracts` folder as an independent smart contract. Thus, if a smart contract is split into several LIGO files, *Chinstrap* will try to compile each file as a separate smart contract, resulting sometimes in a failed compilation. 

But, *Chinstrap* will manage to compile the right contract using LIGO compiler.
:::


## Sandbox
*Chinstrap* provides a *sandbox* sub-command to manage a local development node with flextesa sandbox. This enables development and testing smart contracts on test network, before we proceed with _mainnet_.

```
➜ chinstrap sandbox -h

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
usage: chinstrap sandbox [-h] [-o PORT] [-i] [-d] [-s] [-c NUM_OF_ACCOUNTS] [-m MINIMUM_BALANCE]
                         [-p {Hangzhou,Ithaca,Alpha}] [-l]

optional arguments:
  -h, --help            show this help message and exit
  -o PORT, --port PORT  RPC Port of Tezos local sandbox
  -i, --initialize      Initialize Tezos sandbox
  -d, --detach          Start the Tezos sandbox and detach
  -s, --stop            Stop the currently running Tezos sandbox
  -c NUM_OF_ACCOUNTS, --num-of-accounts NUM_OF_ACCOUNTS
                        Number of accounts to bootstrap on Tezos sandbox
  -m MINIMUM_BALANCE, --minimum-balance MINIMUM_BALANCE
                        Amount of Tezos to deposit while bootstraping on Tezos local sandbox
  -p {Hangzhou,Ithaca,Alpha}, --protocol {Hangzhou,Ithaca,Alpha}
                        Protocol to start Tezos sandbox with.
  -l, --list-accounts   List local accounts from sandbox
```

To start a local sandbox on port 12345, and generate 5 test accounts and use Ithaca protocol, run the following command:
```
➜ chinstrap sandbox -p Ithaca -o 12345 -c 5
      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
✔ Accounts created!
___________________________________________________________________________________________________________________________________________________

name                                  address                                  publicKey                                                privateKey
---------------------------------------------------------------------------------------------------------------------------------------------------
 Alice           tz1PiDHTNJXhqpkbRUYNZEzmePNd21WcB8yB edpkubiR5aDdZZ7bFgc1rKbg2k3wUSqb4GDXZ2WuKAmfq7fzvxQu8u edsk3AiSAERPfe6yqS7Q4YAxBQ5L1NLUao2H9sP34x7u1tEkXB5bwX
 Bob             tz1XxtxnMRTqkKax8F3pM3g67Zw36QqdMUCN edpktfBVohfeywZhn2CtBJXvF7oGWdK57WsPi25cL6SgP5b1jdF9SE edsk3BAGtjF1PnbRauYqjkyMBg9XqDDnQk3vf3J1azyiaJrZTdy9oV
 Carol           tz1WBjJAmPj1AaJgGwvP9FKsfUPbsbuHQWhC edpkuhRMLk7qHDkS2aB4cqui3nkCjhwiJWv9tYEqCTLb4eRXyD9aY5 edsk3BaRmZveqb8yP1A8ePnAtfzg2wfcN43tEcnidH1afJa3T4Rbsf
 Chuck           tz1YqC4LQNZK6UDW7yjwzh8mQthW4i1dmwKs edpkvYoBSJmaqGsgQoEpTicbAzTrLPzFLNBqJPREne6v3MwBF3XKsp edsk3Bb8M4K7BDqMEnNQT3458xhjirY9hZGHDpQZBDQzz1CUWLpjxP
 Craig           tz1U7FSJhS8QggXhzuxQ3kRVxtZuivwrL4ho edpkuqtWwroucmbwbqkmfVro2BWRwf36YVs3rCTmePjo149FtwndLz edsk3Bc7mTibCGhYivUSRATJDieR6TsNjiuaucoEotReo1czwx4ss1
---------------------------------------------------------------------------------------------------------------------------------------------------
WARNING: Please do not use these accounts on mainnet!
✔ Sandbox is at level: 20 and ready for use!
```

:::info
Please wait for the sandbox to reach level 20 before proceeding with deployments. *Chinstrap* notifies when the sandbox is ready to use.
:::

:::warning
Please DO NOT use the accounts generated by *chinstrap sandbox* on mainnet!
:::


## Originating smart contracts with *Chinstrap*

At this point, the smart contracts are compiled and ready to be originated. We are ready to originate or deploy our smart contracts on to the configured network. We will make use of Flextesa sandbox as a local node, to test our originations.

### Preparing origination scripts

Originating a contract needs origination script. Origination script usually updates the storage structure or initial data and the smart contract code. These scripts are located in the *orignations* directory. This works almost the same as *Truffle*.

Each origination is a _Python_ file, defining the deployment tasks, It executes Python code. Each origination starts with a number, followed by a title. *Chinstrap* will run the migrations in an ascending order.

An origination script defines:
* the initial storage of the smart contract(s)
* the contract deployment steps: the order of deployment of smart contracts, networks, accounts

These origination scripts are used the same way whether you deploy your smart contract for the first time, or you update a new version of a smart contract.

In any origination script, the first step is to import `getContract` function from `chinstrap.originations` module.

```
from chinstrap.originations import getContract
```

Next, we define a function called `deploy` that takes three arguments: 
- chinstrapState
- network
- accounts

```
def deploy(chinstrapState, network, accounts):
```

Now, inside the `deploy` funtion, we have to specify which smart contract is to be originated.

```
contract = getContract("SampleContract")
```

We define the storage as a json, and encode it as contract storage using `contract.storage.encode` function.

```
initial_storage = contract.storage.encode(
        {"counter": 0, "owner": accounts[0].key.public_key_hash()}
    )
```

Finally, we return `initial_storage`, `contract` from the function.

```
return initial_storage, contract
```

Here is a origination script example, defining a storage with essential types:

```
from chinstrap.originations import getContract

def deploy(chinstrapState, network, accounts):
    contract = getContract("SampleContract")
    initial_storage = contract.storage.encode(
        {"counter": 0, "owner": accounts[0].key.public_key_hash()}
    )
    return initial_storage, contract
```

### Originating

Before proceeding with originations, we have to configure accounts for originating. We can use any of the accounts generated by `chinstrap sandbox` and configure the accounts inside `chinstrap-config.yml`. We use these accounts ONLY on `development` network.

```
➜ cat .secret 
edsk3AiSAERPfe6yqS7Q4YAxBQ5L1NLUao2H9sP34x7u1tEkXB5bwX
```

Configuration file:

```
chinstrap:
  network:
    development:
      host: http://localhost:12345
      accounts:
        - privateKeyFile: ./.secret

  compiler:
    lang: smartpy
    test: smartpy
```

Finally we are ready to originate to development network. *Chinstrap* provides `originate* sub-command to originate contracts.

```
➜ chinstrap originate -h

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
usage: chinstrap originate [-h] [-o ORIGINATE] [-d NUMBER] [-n NETWORK] [-p PORT] [-r] [-c CONTRACT]
                           [-l] [-s] [-e ENTRYPOINT] [-f]

optional arguments:
  -h, --help            show this help message and exit
  -o ORIGINATE, --originate ORIGINATE
                        Origination script to execute. If not specified, all the originations will be
                        executed
  -d NUMBER, --number NUMBER
                        Run contracts from a specific migration. The number refers to the prefix of
                        the migration file.
  -n NETWORK, --network NETWORK
                        Select the configured network
  -p PORT, --port PORT  RPC Port of Tezos local sandbox
  -r, --reset           Run all originations from the beginning, instead of running from the last
                        completed migration
  -c CONTRACT, --contract CONTRACT
                        Contract to compile. If not specified, all the contracts are compiled
  -l, --local           Use compiler from host machine. If not specified, Docker image is used
  -s, --show            Show addresses of originations
  -e ENTRYPOINT, --entrypoint ENTRYPOINT
                        Entrypoint to use when compiling Ligo contracts. Default entrypoint is main
  -f, --force           Force originate all originations. Be careful, this will re-originate all the
                        contracts even if they are already deployed.

```

To originate all the origination scripts, we jsut run:
```
➜ chinstrap originate -n development

      _     _           _
  ___| |__ (_)_ __  ___| |_ _ __ __ _ _ __
 / __| '_ \| | '_ \/ __| __| '__/ _` | '_ \
| (__| | | | | | | \__ \ |_| | | (_| | |_) |
 \___|_| |_|_|_| |_|___/\__|_|  \__,_| .__/
                                     |_|

🐧 Chinstrap - a cute framework for developing Tezos Smart Contracts!
Using development network
Loaded wallet tz1PiDHTNJXhqpkbRUYNZEzmePNd21WcB8yB . Balance: ꜩ 20000.022856

✔ SampleContract.py compilation successful!
✔ SampleContract's origination transaction at: ooKGSzixRJvMGFKgGptTzHGDmGeJ5sJYZ9LPfvL2eQy9iWSGxDd
✔ Baking successful!
✔ SampleContract address: KT1AetSAmZW4ctNF3nnjvhW5znjg4de3JCAx
✔ Total Cost of originations:  ꜩ 0.139272
```

:::info
On origination, Chinstrap calculates and keeps track of the sha256 hash of the compiled contracts. This helps in preventing duplicate originations. If you want to re-originate the same contract, you can force chinstrap to do so using the -f` or --force flag.
:::

### Testing

Please find documentation related to testing on [Chinstrap](https://chinstrap.io/docs/testing)

# Conclusion

The first step in developing a Dapp is to deploy the smart contracts. _Chinstrap_ takes LIGO/SmartPy code and deploys it onto any public or private network. Each origination needs an initial storage that is compliant with the storage type of Michelson code.

Thanks to its easy configuration and readable origination files, _Chinstrap_ is an essential tool throughout the development and deployment of a Dapp.

:::info
🐧 *Chinstrap* v0.1.0 is still under active development. Please reach out to [ant4g0nist](https://twitter.com/ant4g0nist) or join [Telegram](https://t.me/chinstrap_io) if you have any queries or advices. Happy hacking :)
:::
