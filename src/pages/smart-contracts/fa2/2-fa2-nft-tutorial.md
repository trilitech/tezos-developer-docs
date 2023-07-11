---
id: 2-fa2-nft-tutorial
title: Non-Fungible Tokens on Tezos Using FA2
sidebar_label: FA2 NFT Tutorial LIGO
lastUpdated: July 2023
---

This tutorial shows how to originate and interact with the FA2 NFT contract
implementation. The tutorial uses a pre-compiled FA2 NFT contract written in
[LIGO](https://ligolang.org/) smart contract language and a command line interface
(CLI) to originate and interact with the NFT contracts either on the
[Flextesa](https://tezos.gitlab.io/flextesa/) sandbox or Tezos testnet (Carthagenet).

**Disclaimer:** We highly recommend users read the additional resources above and
take necessary precautions before following this tutorial and interacting with
experimental technology. Use this tutorial at your own risk.

## Introduction

### What is FA2 (TZIP-12)?

FA2 refers to a token standard ([TZIP-12](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md))
on Tezos. FA2 proposes a unified token contract interface, supporting a wide range
of token types. The FA2 provides a standard API to transfer tokens, check
token balances, manage operators (addresses that are permitted to transfer tokens
on behalf of the token owner) and manage token metadata.

### What is a Non-Fungible Token (NFT)?

An NFT (non-fungible token) is a special type of cryptographic token which represents
something unique; non-fungible tokens are thus not mutually interchangeable.
NFTs can represent ownership over digital or physical assets like virtual collectibles
or unique artwork.

For each individual non-fungible token, the FA2 assigns a unique
token ID and associates it with the token owner address. The FA2 API enables the
inspection of token balances for the specific token ID and token owner address.
For NFTs the balance can be either 0 (which means that the address does not own
this particular token) or 1 (the address owns the token).

The FA2 contract also associates some metadata with each token. This tutorial supports
token symbol and token name metadata attributes. However, the implementation can
be easily extended to support custom metadata attributes such as an associated
image or document URL and its crypto-hash.

## Tutorial

### Prerequisites

- [Node.js](https://nodejs.org/) must be installed. The Node installation must also
  include `npm` (Node package manager).

- [Docker](https://www.docker.com/) must be installed. You need docker to run
  Flextesa sandbox. You might skip docker installation if you plan to run this
  tutorial on the testnet (Carthagenet) only.

### The CLI Tool

You will need to install `tznft` CLI tool. After the installation, you can invoke
various commands in the form of `tznft <command> [options]`. `tznft` provides the
following commands:

- mint (contract origination) NFT with metadata command
- token inspection commands
- NFT transfer command
- Configuration commands to bootstrap Tezos network and configure address aliases

The commands will be explained in more detail below. You can always run

```sh
$ tznft --help
```

to list all available commands.

### Initial Setup

1. Create a new local directory to keep your tutorial configuration:

   ```sh
   $ mkdir nft-tutorial
   $ cd nft-tutorial
   ```

2. Install `@tqtezos/nft-tutorial` npm package:

   ```sh
   $ npm install -g https://github.com/tqtezos/nft-tutorial.git

   /usr/local/bin/tznft -> /usr/local/lib/node_modules/@tqtezos/nft-tutorial/lib/tznft.js

   + @tqtezos/nft-tutorial@1.0.0
   added 3 packages from 1 contributor and updated 145 packages in 11.538s
   ```

   The command installs `tznft` CLI tool.

3. Initialize tutorial config:

   ```sh
   $ tznft init-config

   tznft.json config file created
   ```

4. Check that the default active network is `sandbox`:

   ```sh
   $ tznft show-network

   active network: sandbox
   ```

5. Bootstrap Tezos network:

   ```sh
   $ tznft bootstrap

   ebb03733415c6a8f6813a7b67905a448556e290335c5824ca567badc32757cf4

   starting sandbox...
   sandbox started
   originating balance inspector contract...
   originated balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
   ```

   If you are bootstrapping a `sandbox` network for the first time, Docker will download
   the Flextesa docker-image as well.

   The default configuration comes with two account aliases `bob` and `alice`
   that can be used for token minting and transferring.

### Mint NFT Token(s)

This tutorial uses an NFT collection contract. Each time the user mints a new set
(collection) of tokens, a new NFT contract is created. The user cannot add more
tokens or remove (burn) existing tokens within the contract. However tokens can
be transferred to other owners.

`mint` command requires the following parameters:

- <owner> alias or address of the new tokens owner
- `--tokens` new tokens metadata. Each token metadata is represented as comma
  delimited string: `'<token_id>, <token_symbol>, <token_name>'`:

```sh
$ tznft mint <owner_alias> --tokens <token_meta_list>`
```

Example:

```sh
$ tznft mint bob --tokens '0, T1, My Token One' '1, T2, My Token Two'

originating new NFT contract...
originated NFT collection KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh
```

### Inspecting The NFT Contract

Using `KT1..` address of the NFT contract created by the `mint` command, we can
inspect token metadata and balances (i. e. which addresses own the tokens).

#### Inspect Token Metadata

`show-meta` command requires the following parameters:

- `--nft` address of the FA2 NFT contract to inspect
- `--signer` alias on behalf of which contract is inspected
- `--tokens` a list of token IDs to inspect

```sh
$ tznft show-meta --nft <nft_address> --signer <alias> --tokens <token_id_list>
```

Example:

```sh
$ tznft show-meta --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --tokens 0 1

token_id: 0	symbol: T1	name: My Token One	extras: { }
token_id: 1	symbol: T2	name: My Token Two	extras: { }
```

#### Inspect Token Balances

`show-balance` command requires the following parameters:

- `--nft` address of the FA2 NFT contract to inspect
- `--signer` alias on behalf of which contract is inspected
- `--owner` alias of the token owner to check balances
- `--tokens` a list of token IDs to inspect

```sh
$ tznft show-balance --nft <nft_address> --signer <alias> --owner <alias> --tokens <token_id_list>
```

Example 1, check `bob`'s balances:

```sh
$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 1
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 1
```

Example 2, check `alice` balances:

```sh
$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 0	balance: 0
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 1	balance: 0
```

### Tokens With External Metadata

Token metadata can store a reference to some external document and/or image.
This tutorial supports storing external data on [IPFS](https://ipfs.io) and keeping
an IPFS hash as a part of the token metadata.

Let's create a single NFT token which references an image on IPFS.

1. Upload your image to IPFS and obtain an image file hash. There are
   multiple ways to do that. One of the possible solutions is to install the
   [IPFS Companion](https://github.com/ipfs-shipyard/ipfs-companion) web plugin and
   upload an image file from there. You can upload multiple images and/or documents
   if you plan to create a collection of multiple NFTs.

2. Copy the IPFS file hash code (`CID`). For this example we will use
   `QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj`

3. Execute `tznft mint` command adding IPFS hash as a fourth parameter in the token
   description.

```sh
$ tznft mint bob -t '0, TZT, Tezos Token, QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj'

originating new NFT contract...
originated NFT collection KT1SgzbcfTtdHRV8qHNG3hd3w1x23oiC31B8
```

4. Now we can inspect new token metadata and see that the IPFS hash (`ipfs_cid`)
   is there.

```sh
$ tznft show-meta -s bob --nft KT1SgzbcfTtdHRV8qHNG3hd3w1x23oiC31B8 --tokens 0

token_id: 0	symbol: TZT	name: Tezos Token	extras: { ipfs_cid=QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj }
```

5. You can inspect the file on the web by opening a URL `https://ipfs.io/ipfs/<ipfs_cid>`.
   For our example, the URL would be
   [https://ipfs.io/ipfs/QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj](https://ipfs.io/ipfs/QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj)

### Transferring Tokens

`transfer` command requires the following parameters:

- `--nft` address of the FA2 NFT contract that holds tokens to be transferred
- `--signer` alias or address that initiates the transfer operation
- `--batch` a list of individual transfers. Each individual transfer is represented
  as a comma delimited string: `<from_address_or_alias>, <to_address_or_alias>, <token_id>`.
  We do not need to specify amount of the transfer for NFTs since we can only
  transfer a single token for any NFT type.

```sh
$ tznft transfer --nft <nft_address> --signer <signer> --batch <batch_list>`
```

Example, `bob` transfers his own tokens `0` and `1` to `alice`:

```sh
$ tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'bob, alice, 0' 'bob, alice, 1'

transferring tokens...
tokens transferred
```

Now, we can check token balances after the transfer:

```sh
$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 0
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 0

$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 0	balance: 1
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 1	balance: 1
```

### Operator Transfer

It is also possible to transfer tokens on behalf of the owner.

`bob` is trying to transfer one of `alice`'s tokens back:

```sh
$ tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'alice, bob, 1'

transferring tokens...
Tezos operation error: FA2_NOT_OPERATOR
```

As we can see, this operation has failed. The default behavior of the FA2 token
contract is to allow only token owners to transfer their tokens. In our example,
bob (as an operator) tries to transfer token `1` that belongs to `alice`.

However, `alice` can add `bob` as an operator to allow him transfer any tokens on
behalf of `alice`.

`update-ops` command has the following parameters:

- `<owner>` alias or address of the token owner to update operators for
- `--nft` address of the FA2 NFT contract
- `--add` list of pairs aliases or addresses and token id to add to the operator set
- `--remove` list of aliases or addresses and token id to remove from the operator set

```sh
$ tznft update-ops <owner> --nft <nft_address> --add [add_operators_list] --remove [add_operators_list]
```

Example, `alice` adds `bob` as an operator:

```sh
$ tznft update-ops alice --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --add 'bob, 1'

updating operators...
updated operators
```

Now `bob` can transfer a token on behalf of `alice` again:

```sh
$ tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'alice, bob, 1'

transferring tokens...
tokens transferred
```

Inspecting balances after the transfer:

```sh
$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 0
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 1

$ tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 0	balance: 1
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 1	balance: 0
```

Token `1` now belongs to `bob`.

### Configuration

`tznft` can be configured to interact with different Tezos networks. The user can
also configure address aliases to sign Tezos operations and/or use them as command
parameters when addresses are required. The default configuration that is created
by `tznft init-config` command includes two pre-configured networks: `sandbox`
and `testnet` (Carthagenet). Each pre-configured network has two bootstrap aliases:
`bob` and `alice`.

#### Network Configuration Commands

- `set-network <network>` select specified pre-configured network as an active one.
  All subsequent commands will operate on the active network

  Example:

  ```sh
  $ tznft set-network sandbox

  network sandbox is selected
  ```

- `show-network [--all]` show currently selected network. If `--all` flag is
  specified, show all pre-configured networks

  Example:

  ```sh
  $ tznft show-network --all

  * sandbox
    testnet
  ```

- `bootstrap` bootstrap selected network and deploy helper balance inspector contract.
  If selected network is `sandbox` this command needs to be run each time sandbox
  is restarted, for other public networks like `testnet` is it enough to run this
  command once.

  Example:

  ```sh
  $ tznft bootstrap

  366b9f3ead158a086e8c397d542b2a2f81111a119f3bd6ddbf36574b325f1f03

  starting sandbox...
  sandbox started
  originating balance inspector contract...
  originated balance inspector KT1WDqPuRFMm2HwDRBotGmnWdkWm1WyG4TYE
  ```

- `kill-sandbox` stop Flextesa sandbox process if selected network is `sandbox`.
  This command has no effect on other network types.

  Example:

  ```sh
  $ tznft kill-sandbox

  flextesa-sandbox

  killed sandbox.
  ```

The sandbox network (selected by default) is configured to bake new Tezos blocks
every 5 seconds. It makes running the commands that interact with the network
faster. However, all originated contracts will be lost after the sandbox is stopped.

If you are using `testnet`, your originated contracts will remain on the blockchain
and you can inspect them afterwards using an block explorer like [BCD](https://better-call.dev/).

_Note: Although `testnet` configuration already has two bootstrap aliases `bob`
and `alice`, it is a good practice to create your own alias from the faucet file
(see `tznft add-alias-faucet` command described below) and use it as a signer for
the commands like `mint`, `transfer` and `show_balance`. In this way, your Tezos
operations will not interfere with the operations initiated by other users._

#### Alias Configuration Commands

`tznft` allows user to configure and use short names (aliases) instead of typing
in full Tezos addresses when invoking `tznft` commands.
Each network comes with two pre-configured aliases `bob` and `alice`. The user
can manage aliases by directly editing `tznft.json` file or using the following
commands:

- `show-alias [alias]` show address and private key (if configured) of the
  specified `[alias]`. If `[alias]` option is not specified, show all configured
  aliases.

  Example:

  ```sh
  $ tznft show-alias bob

  bob	tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx

  $ tznft show-alias

  bob	tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx
  alice	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
  ```

- `add-alias <alias> <private_key>` add alias using its private key. Aliases
  that configured with the private key can be used to sign operations that
  originate or call smart contracts on chain. `tznft` commands that require Tezos
  operation signing have `--signer` option.

  Example:

  ```sh
  $ tznft add-alias jane edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq

  alias jane has been added

  $ tznft show-alias jane

  jane	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
  ```

- `add-alias <alias> <address>` add alias using Tezos address (public key hash).
  Such aliases do not have associated private key and cannot be used to sign
  Tezos operations.

  Example:

  ```sh
  $ tznft add-alias michael tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb

  alias michael has been added

  $ tznft show-alias michael

  michael	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
  ```

- `add-alias-faucet <alias> <faucet_json_file_path>` add alias with private key
  from the faucet file (see [Tezos Faucet](https://faucet.tzalpha.net/)). This
  command will not work on `sandbox` network. An alias configured from the faucet
  has the private key and can be used to sign Tezos operations.

  Example:

  ```sh
  $ tznft add-alias-faucet john ~/Downloads/tz1NfTBQM9QpZpEY6GSvdw3XBpyEjLLGhcEU.json

  activating faucet account...
  faucet account activated
  alias john has been added

  $ tznft show-alias john

  john	tz1NfTBQM9QpZpEY6GSvdw3XBpyEjLLGhcEU	edskRzaCrGEDr1Ras1U55U73dXoLfQQJyuwE95rSkqbydxUS4oS3fGmWywbaVcYw7DLH34zedoJzwMQxzAXQdixi5QzYC5pGJ6
  ```

- `remove-alias <alias>` remove alias from the selected network configuration.

  Example:

  ```sh
  $ tznft remove-alias john

  alias john has been deleted
  ```
