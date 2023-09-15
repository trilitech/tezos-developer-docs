---
id: create-an-nft
title: Create an NFT
authors: 'Sol Lederer, Tim McMackin'
lastUpdated: 15th September 2023
---

This tutorial covers how to create a collection of NFTs on Tezos.

TODO learning objectives


## Prerequisites

TODO: Need to mention that Flextesa requires node version before 20.

To run this tutorial you need Node.JS, NPM, and Docker Desktop to install and use the `tznft` CLI tool, which helps you create and test NFT collections on Tezos.

- To install Node.JS and NPM, see <https://nodejs.org/>.
You can verify that they are installed by running these commands:

   ```bash
   node --version
   npm --version
   ```

   If you see a message with the versions of Node.JS and NPM, they are installed correctly.

- To install Docker Desktop, see <https://www.docker.com>.
Make sure to start Docker Desktop after you install it.

- To install the `tznft` tool, run this command:

   ```bash
   npm install -g @oxheadalpha/tznft
   ```

   You can verify that it is installed by running this command:

   ```bash
   tznft --version
   ```

   If you see a message with the version of the `tznft` tool, it is installed correctly.

## What is a non-fungible token (NFT)?

An NFT is a special type of blockchain token that represents something unique.
Fungible tokens such as XTZ and real-world currencies like dollars and Euros are interchangeable; each one is the same as every other.
By contrast, each NFT is unique and not interchangeable.
NFTs can represent ownership over digital or physical assets like virtual collectibles or unique artwork, or anything that you want them to represent.

Like other types of Tezos tokens, a collection is managed by a smart contract.
The smart contract defines the collection of NFTs, including what information is in each token.
It also describes how they behave, such as what happens when a user transfers an NFT to another user.

In this tutorial, you create NFTs that comply with the FA2 standard (formally known as the [TZIP-12](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard), the current standard for tokens on Tezos.
The FA2 standard creates a framework for how tokens behave on Tezos, including fungible, non-fungible, and other types of tokens.
It provides a standard API to transfer tokens, check token balances, manage operators (addresses that are permitted to transfer tokens on behalf of the token owner), and manage token metadata.





For each non-fungible token, the FA2 assigns a unique
token ID and associates it with the token owner's address. The FA2 API enables the
inspection of token balances for the specific token ID and token owner address.
For NFTs the balance can be either 0 (which means that the address does not own
this particular token) or 1 (the address owns the token).

The FA2 contract also associates some metadata with each token. This tutorial supports
token symbol and token name metadata attributes. However, the implementation can
be easily extended to support custom metadata attributes such as an associated
image or document URL and its crypto-hash.



This guide shows how to originate and interact with the FA2 NFT contract
implementation. We use a pre-compiled FA2 NFT contract written in the
[LIGO](https://ligolang.org/) smart contract language and a command line interface
(CLI) to originate and interact with the NFT contracts either on the
[Flextesa](https://tezos.gitlab.io/flextesa/) sandbox or Tezos testnet.


## Create a project folder

1. Create a folder to store your NFT configuration files:

   ```bash
   mkdir nft-tutorial
   cd nft-tutorial
   ```

3. Create a starter NFT configuration file:

   ```bash
   tznft init
   ```

   The resulting file, named `tznft.config`, contains information about the Tezos networks that are available for you to work with, including the [Ghostnet](https://teztnets.xyz/ghostnet-about) test network and the local sandbox that you set up in the next steps.
   The `tznft` tool requires this file, so the commands in the following steps work only from the directory that you ran `tznft init` in.

4. Check that the default active network is "sandbox":

   ```bash
   tznft show-network
   ```

   The response should show that the active network is "sandbox."
   The sandbox is a local simulation of Tezos that you can use to test your work.

5. Set up a local Tezos sandbox:

   ```bash
   tznft bootstrap
   ```

   This command uses the [Flextesa](https://tezos.gitlab.io/flextesa/) tool to create a local sandbox in a Docker container.
   This sandbox comes preconfigured with two account aliases named `bob` and `alice` that you can use to test account operations like transferring NFTs.

TODO: May need troubleshooting here for the sandbox.
What if people already have the sandbox running; how to restart it?

## Create an NFT collection

In most cases, you create a collection of NFTs instead of creating NFTs one at a time.
Follow these steps to create a smart contract that manages the NFT collection:

1. Create a collection metadata file by running this command:

   ```bash
   tznft create-collection-meta my_collection
   ```

   The new metadata file is named `my_collection.json` and has information such as the name, description, home page, and creator of the collection.
   It also includes the interfaces that the NFTs support, including the TZIP-12 interface that was mentioned earlier.

1. Optional: Edit the `my_collection.json` file to put your information in the `name`, `description`, and `authors` fields.

1. Validate the collection by running this command:

   ```bash
   tznft validate-collection-meta my_collection.json
   ```

   If you did not change values in the file, this command may show warnings that the collection uses placeholder values.
   You can continue with these placeholder values or insert your own information.
   If there are any errors, make sure that the file is valid JSON.

1. Create the collection from the metadata file by running this command:

   ```bash
   tznft create-collection bob --meta_file my_collection.json --alias my_collection
   ```

   This command takes the alias of the user who is the owner of the collection.
   In this case, the owner is one of the default accounts in the sandbox.
   The command also includes the metadata file and an optional local alias for the collection.

   The command also updates the `tznft.json` file with information about the new collection, including the address of the smart contract that manages the collection and the addresses of the two users in the sandbox, Alice and Bob.

   TODO: Is this the address of the contract, the collection, or the address of something else?

## Mint NFTs

Creating NFTs is called _minting_.
When you mint NFTs, the `tznft` tool creates a smart contract to manage those NFTs based on the configuration files that you created in the previous steps.

You can't add more NFTs to a contract later, so you must create all of the NFTs in the collection at once.

To create NFTs, use the `tznft mint` command and pass these parameters:

- The alias or address of the new tokens' owner.
- The alias of the collection from the `tznft create-collection` command.
- The metadata for the new tokens in a comma-delimited string.
In this case, the metadata for each token is a comma-separated list of the token's internal ID, symbol, and name.

1. Run this command to create two tokens and set Bob as the owner:

   ```bash
   tznft mint bob my_collection --tokens '0, T1, My Token One' '1, T2, My Token Two'
   ```

   The response in the terminal says that the tokens were minted.






### Inspecting The NFT Contract

Using `KT1...` address of the NFT contract created by the `mint` command, we can
inspect token metadata and balances (i. e. which addresses own the tokens).

#### Inspect Token Metadata

`show-meta` command requires the following parameters:

- `--nft` address of the FA2 NFT contract to inspect
- `--signer` alias on behalf of which contract is inspected
- `--tokens` a list of token IDs to inspect

```bash
tznft show-meta --nft <nft_address> --signer <alias> --tokens <token_id_list>
```

Example:

```bash
tznft show-meta --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --tokens 0 1

token_id: 0	symbol: T1	name: My Token One	extras: { }
token_id: 1	symbol: T2	name: My Token Two	extras: { }
```

#### Inspect Token Balances

`show-balance` command requires the following parameters:

- `--nft` address of the FA2 NFT contract to inspect
- `--signer` alias on behalf of which contract is inspected
- `--owner` alias of the token owner to check balances
- `--tokens` a list of token IDs to inspect

```bash
tznft show-balance --nft <nft_address> --signer <alias> --owner <alias> --tokens <token_id_list>
```

Example 1, check `bob`'s balances:

```bash
tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 1
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 1
```

Example 2, check `alice` balances:

```bash
tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 0	balance: 0
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 1	balance: 0
```

### Tokens With External Metadata

Token metadata can store a reference to some external document and/or image.
This tutorial supports storing external data on [IPFS](https://ipfs.io) and keeping
an IPFS hash as a part of the token metadata.

Let's create a single NFT token that references an image on IPFS.

1. Upload your image to IPFS and obtain an image file hash. There are
   multiple ways to do that. One of the possible solutions is to install the
   [IPFS Companion](https://github.com/ipfs-shipyard/ipfs-companion) web plugin and
   upload an image file from there. You can upload multiple images and/or documents
   if you plan to create a collection of multiple NFTs.

2. Copy the IPFS file hash code (`CID`). For this example, we will use
   `QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj`

3. Execute `tznft mint` command adding IPFS hash as a fourth parameter in the token
   description.

```bash
tznft mint bob -t '0, TZT, Tezos Token, QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj'

originating new NFT contract...
originated NFT collection KT1SgzbcfTtdHRV8qHNG3hd3w1x23oiC31B8
```

4. Now we can inspect new token metadata and see that the IPFS hash (`ipfs_cid`)
   is there.

```bash
tznft show-meta -s bob --nft KT1SgzbcfTtdHRV8qHNG3hd3w1x23oiC31B8 --tokens 0

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
  as a comma-delimited string: `<from_address_or_alias>, <to_address_or_alias>, <token_id>`.
  We do not need to specify the amount of the transfer for NFTs since we can only
  transfer a single token for any NFT type.

```bash
tznft transfer --nft <nft_address> --signer <signer> --batch <batch_list>`
```

Example, `bob` transfers his own tokens `0` and `1` to `alice`:

```bash
tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'bob, alice, 0' 'bob, alice, 1'

transferring tokens...
tokens transferred
```

Now, we can check token balances after the transfer:

```bash
tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 0
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 0

tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 0	balance: 1
owner: tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	token: 1	balance: 1
```

### Operator Transfer

It is also possible to transfer tokens on behalf of the owner.

`bob` is trying to transfer one of `alice`'s tokens back:

```bash
tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'alice, bob, 1'

transferring tokens...
Tezos operation error: FA2_NOT_OPERATOR
```

As we can see, this operation has failed. The default behavior of the FA2 token
contract is to allow only token owners to transfer their tokens. In our example,
Bob (as an operator) tries to transfer token `1` that belongs to `alice`.

However, `alice` can add `bob` as an operator to allow him to transfer any tokens on
behalf of `alice`.

`update-ops` command has the following parameters:

- `<owner>` alias or address of the token owner to update operators for
- `--nft` address of the FA2 NFT contract
- `--add` list of pairs aliases or addresses and token id to add to the operator set
- `--remove` list of aliases or addresses and token id to remove from the operator set

```bash
tznft update-ops <owner> --nft <nft_address> --add [add_operators_list] --remove [add_operators_list]
```

Example, `alice` adds `bob` as an operator:

```bash
tznft update-ops alice --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --add 'bob, 1'

updating operators...
updated operators
```

Now `bob` can transfer a token on behalf of `alice` again:

```bash
tznft transfer --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --batch 'alice, bob, 1'

transferring tokens...
tokens transferred
```

Inspecting balances after the transfer:

```bash
tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner bob --tokens 0 1

querying NFT contract KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh using balance inspector KT1Pezr7JjgmrPcPhpkbkH1ytG7saMZ34sfd
requested NFT balances:
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 0	balance: 0
owner: tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	token: 1	balance: 1

tznft show-balance --nft KT1XP3RE6S9t44fKR9Uo5rAfqHvHXu9Cy7fh --signer bob --owner alice --tokens 0 1

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

- `set-network <network>` selects a specified pre-configured network as an active one.
  All subsequent commands will operate on the active network

  Example:

  ```bash
  tznft set-network sandbox

  network sandbox is selected
  ```

- `show-network [--all]` show currently selected network. If `--all` flag is
  specified, show all pre-configured networks

  Example:

  ```bash
  tznft show-network --all

  * sandbox
    testnet
  ```

- `bootstrap` bootstrap selected network and deploy helper balance inspector contract.
  If the selected network is `sandbox`, this command needs to be run each time the sandbox
  is restarted, for other public networks like `testnet` it is enough to run this
  command once.

  Example:

  ```bash
  tznft bootstrap

  366b9f3ead158a086e8c397d542b2a2f81111a119f3bd6ddbf36574b325f1f03

  starting sandbox...
  sandbox started
  originating balance inspector contract...
  originated balance inspector KT1WDqPuRFMm2HwDRBotGmnWdkWm1WyG4TYE
  ```

- `kill-sandbox` stop Flextesa sandbox process if the selected network is `sandbox`.
  This command has no effect on other network types.

  Example:

  ```bash
  tznft kill-sandbox

  flextesa-sandbox

  killed sandbox.
  ```

The sandbox network (selected by default) is configured to bake new Tezos blocks
every 5 seconds. It makes running the commands that interact with the network
faster. However, all originated contracts will be lost after the sandbox is stopped.

If you are using `testnet`, your originated contracts will remain on the blockchain
and you can inspect them afterwards using a block explorer like [BCD](https://better-call.dev/).

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

  ```bash
  tznft show-alias bob

  bob	tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx

  tznft show-alias

  bob	tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU	edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx
  alice	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
  ```

- `add-alias <alias> <private_key>` add alias using its private key. Aliases
  that are configured with the private key can be used to sign operations that
  originate or call smart contracts on-chain. `tznft` commands that require Tezos
  operation signing have `--signer` option.

  Example:

  ```bash
  tznft add-alias jane edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq

  alias jane has been added

  tznft show-alias jane

  jane	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb	edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
  ```

- `add-alias <alias> <address>` add alias using Tezos address (public key hash).
  Such aliases do not have an associated private key and cannot be used to sign
  Tezos operations.

  Example:

  ```bash
  tznft add-alias michael tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb

  alias michael has been added

  tznft show-alias michael

  michael	tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
  ```

- `add-alias-faucet <alias> <faucet_json_file_path>` add alias with private key
  from the faucet file (see [Tezos Faucet](https://faucet.tzalpha.net/)). This
  command will not work on `sandbox` network. An alias configured from the faucet
  has the private key and can be used to sign Tezos operations.

  Example:

  ```bash
  tznft add-alias-faucet john ~/Downloads/tz1NfTBQM9QpZpEY6GSvdw3XBpyEjLLGhcEU.json

  activating faucet account...
  faucet account activated
  alias john has been added

  tznft show-alias john

  john	tz1NfTBQM9QpZpEY6GSvdw3XBpyEjLLGhcEU	edskRzaCrGEDr1Ras1U55U73dXoLfQQJyuwE95rSkqbydxUS4oS3fGmWywbaVcYw7DLH34zedoJzwMQxzAXQdixi5QzYC5pGJ6
  ```

- `remove-alias <alias>` remove the alias from the selected network configuration.

  Example:

  ```bash
  tznft remove-alias john

  alias john has been deleted
  ```

{% callout type="note" %}
This guide was created by Oxhead Alpha and can be found [here](https://github.com/oxheadalpha/nft-tutorial/blob/master/packages/tznft/README.md).
{% /callout %}
