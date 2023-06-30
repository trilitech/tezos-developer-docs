---
title: "Installation and Setup"
---

To start, we'll download and install tezos-client and create a couple of test wallets. We'll use [tezos-client](https://tezos.gitlab.io/api/cli-commands.html) - a command line interface to Tezos.

## Installation

### Linux \(64-bit\)

A quick and easy way to get tezos-client running on Linux is to download the latest `tezos-client` binary, make it executable, and put it somewhere in your path. Alternatively, you can add a package repository for your distribution, and install it from there. Using a package is a good idea for production systems as it automates the installation and allows easy updates.

#### Option 1: Install the binary

``` sh
$ wget https://github.com/serokell/tezos-packaging/releases/latest/download/tezos-client
$ chmod +x tezos-client
$ mkdir -p $HOME/.local/bin
$ mv tezos-client $HOME/.local/bin
$ echo 'export PATH="$HOME/.local/bin:$PATH"' >> $HOME/.bashrc
$ source $HOME/.bashrc
```
#### Option 2: Install from source

This information is based on documentation from: [Get Tezos](https://tezos.gitlab.io/introduction/howtoget.html%20)

Tips:

* Use ```tab``` to autocomplete partial commands previously entered
* Use the up and down arrows to cycle through previously entered commands

**1.** Make sure your system is up to date.

``` sh
sudo apt-get update
```

``` sh
sudo apt-get upgrade
```

* If asked if you want to use a certain amount of space for the update, enter: ```y```


**2.** Install rust.

``` sh
sudo apt install -y rsync git m4 build-essential patch unzip wget pkg-config libgmp-dev libev-dev libhidapi-dev libffi-dev opam jq zlib1g-dev
```

``` sh
wget https://sh.rustup.rs/rustup-init.sh
```

``` sh
chmod +x rustup-init.sh
```

``` sh
./rustup-init.sh --profile minimal --default-toolchain 1.52.1 -y
```

**3.**  Loading the cargo environment variable

``` sh
source $HOME/.cargo/env
```

**4.** Get the sources

``` sh
git clone https://gitlab.com/tezos/tezos.git
```

``` sh
cd tezos
```

``` sh
git checkout latest-release
```
**5.** Install the Tezos dependencies.

``` sh
opam init --bare
```

* You will be asked: ```do you want to modify ~/.profile? [N/y/f]``` press ```n```.
* You will then be asked: ```A hook can be added to opam's init scripts to ensure that the shell remains in sync with the opam environment when they are loaded. Set that up? [y/N]``` press ```n```.

``` sh
make build-deps
```

**6.** Compile sources ( This step can take a long time depending on your hardware )

``` sh
eval $(opam env)
```

``` sh
make
```

**7.** Get rolling snapshot

``` sh
wget https://mainnet.xtz-shots.io/rolling -O tezos-mainnet.rolling
```

**8.** Import the snapshot (This step can take a long time depending on your hardware)

``` sh
./tezos-node snapshot import tezos-mainnet.rolling
```

**9.** Run the node

``` sh
./tezos-node run --allow-all-rpc localhost:8732 --rpc-addr localhost:8732 --history-mode experimental-rolling
```

**Q&A**

* How do I stop the node?

  * Press ```Ctrl-c``` from within the terminal tab it is running in. Give it a minute or two, if it still does not work press it again.

* Where is Tezos installed?

  * ```~/tezos```

* Where is the blockchain data stored?

    * ```~/.tezos-node```

      * Note that the period in front of the directory denotes a hidden directory. Use ```ls -a``` to show all files and directories including hidden directories.
* What do I do if my node data becomes corrupted and I need to re-import a new snapshot?

  * You will need to first remove the old data. To do that run ```rm -rf .tezos-node``` from your home directory.
  * Then from the ```tezos``` directory use the same commands above to re-import new snapshots.

**Updating the node**

**1.** Pull updates from the git repo

``` sh
git pull
```

* This must be done in the tezos directory

**2.** Install the latest dependencies and compile the sources

``` sh
make build-deps
```

``` sh
eval $(opam env)
```

``` sh
make
```

#### Option 3: Using packages on Ubuntu or Fedora

``` sh
sudo add-apt-repository ppa:serokell/tezos && sudo apt-get update
sudo apt-get install -y tezos-client
sudo apt-get install -y tezos-node
sudo apt-get install -y tezos-baker-010-ptgranad
sudo apt-get install -y tezos-endorser-010-ptgranad
sudo apt-get install -y tezos-accuser-010-ptgranad
```

### Windows

Install one of Linux distributions using [Windows Subsystem for Linux \(WSL\)](https://docs.microsoft.com/en-us/windows/wsl/about) \(e.g. Ubuntu 18.04 LTS\) and follow instructions for Linux.

### Mac OS

With [Homebrew](https://brew.sh/):

``` sh
$ brew tap serokell/tezos-packaging https://github.com/serokell/tezos-packaging.git
$ brew install tezos-client
```

`tezos-packaging` also provides prebuilt brew bottles for some macOS versions.

## Configure

We'll configure `tezos-client` to use a public test network Tezos node:

``` sh
$ tezos-client --endpoint https://rpcalpha.tzbeta.net config update
```

`--endpoint` parameter specifies the address of the server, `config update` writes it to `tezos-client`'s configuration filed at `$HOME/.tezos-client/config`.

Alternatively, one can use an isolated sandboxed network instead of using a public test-network, which we'll do in the [“Sandbox”](run-a-sandbox.md) section.

### Try it out

Verify that you can run tezos-client and that it points to test network:

``` sh
$ tezos-client
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.

Usage:
  tezos-client [global options] command [command options]
  tezos-client --help (for global options)
  tezos-client [global options] command --help (for command options)

To browse the documentation:
  tezos-client [global options] man (for a list of commands)
  tezos-client [global options] man -v 3 (for the full manual)

Global options (must come before the command):
  -d --base-dir <path>: client data directory
  -c --config-file <path>: configuration file
  -t --timings: show RPC request times
  --chain <hash|tag>: chain on which to apply contextual commands (possible tags are 'main' and 'test')
  -b --block <hash|tag>: block on which to apply contextual commands (possible tags are 'head' and 'genesis')
  -w --wait <none|<int>>: how many confirmation blocks before to consider an operation as included
  -p --protocol <hash>: use commands of a specific protocol
  -l --log-requests: log all requests to the node
  -A --addr <IP addr|host>: [DEPRECATED: use --endpoint instead] IP address of the node
  -P --port <number>: [DEPRECATED: use --endpoint instead] RPC port of the node
  -S --tls: [DEPRECATED: use --endpoint instead] use TLS to connect to node.
  -E --endpoint <uri>: HTTP(S) endpoint of the node RPC interface; e.g. 'http://localhost:8732'
  -R --remote-signer <uri>: URI of the remote signer
  -f --password-filename <filename>: path to the password filename
  -M --mode <client|mockup>: how to interact with the node
```

Now that we know we are on a test network we can temporarily disable this warning so that we don't see it with each command.

``` sh
$ export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=yes
```

## Create Test Wallets

> With tezos-client installed we can now make a couple of test wallets.

* Go to the [faucet](https://faucet.tzalpha.net/).
* Complete the captcha and download the wallet in the form of a .json file.
* The file name is the wallet address \(also known as the public key hash, or PKH\) with a .json extension.
* If you look inside the file you will see a property called *pkh* which contains the address.
* The public key hash is used to identify the account on the Tezos blockchain and can be thought of as an address or account number.
* Next, we'll activate the account, passing it the path to the `.json` wallet we just downloaded
* We'll first create an account for Alice, then Bob, so we can perform some test transactions.
* Don't be alarmed by the blank `Error:` we'll explain why shortly.

``` sh
$ tezos-client activate account alice with ~/Downloads/tz1QLne6uZFxPRdRfJG8msx5RouENpJoRsfP.json
Node is bootstrapped, ready for injecting operations.
Operation successfully injected in the node.
Operation hash is 'oog2gMSBNWWTgHujoKViJaCed4wq27gPnLpHKQ27C5savX9ewAq'
Waiting for the operation to be included...
Error:

```

> Note empty `Error:` message at the end of the output. `tezos-client` attempts to wait for operation inclusion but the public Tezos node we are using disallows access \(as a security measure\) to the part of node api that is necessary for this functionality. We use `--wait none` throughout these tutorials to avoid this error. If you use your own local Tezos node you can omit `--wait none`, the error won't happen.

Make a variable for Alice's account address \(PKH\) \(notice that the address is the same as the name of your faucet `.json` file\):

``` sh
$ ALICE_ADDRESS="tz1QLne6uZFxPRdRfJG8msx5RouENpJoRsfP"
```

Ensure that the activation was successful:

``` sh
$ tezos-client get balance for $ALICE_ADDRESS
56828.546322 ꜩ
```

Now, we'll create a new wallet for Bob so we can do some test transactions in the next section.

* Go back to the [faucet](https://faucet.tzalpha.net/) and download a second wallet

``` sh
$ tezos-client activate account bob with tz1ZQYMDETodNBAc2XVbhZFGme8KniuPqrSw.json
$ BOB_ADDRESS="tz1ZQYMDETodNBAc2XVbhZFGme8KniuPqrSw"
$ tezos-client get balance for $BOB_ADDRESS
```

