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
   This sandbox comes preconfigured with two account aliases named `bob` and `alice` that you can use to test account operations like creating and transferring NFTs.

   You can verify that the sandbox is running by running the command `docker ps` and looking for a container named `flextesa-sandbox`.
   To stop the container, run the command `tznft kill-sandbox`, but beware that stopping the container sets the sandbox back to its initial state.

TODO: May need troubleshooting here for the sandbox.
What if people already have the sandbox running; how to restart it?

## Create NFT metadata

In most cases, you create a collection of NFTs instead of creating NFTs one at a time.
Follow these steps to set up the local metadata for the NFT collection:

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

1. Create a metadata file for the first NFT in the collection by running this command:

   ```bash
   tznft create-nft-meta Token1 bob ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj
   ```

   This command creates a metadata file named `Token1.json` with default information about the NFT.
   It includes the minter's account address and URIs to pictures that represent the NFT.
   In this case, the `ipfs` URI links to a picture of the Tezos logo, which you can see at this link: <https://ipfs.io/ipfs/QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj>.

1. Optional: Edit the metadata such as the name and description fields in the `Token1.json` file.

1. TODO Add metadata fields.

1. Create at least one more metadata file for other NFTs by running commands like this example:

   ```bash
   tznft create-nft-meta Token2 bob ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj
   ```

1. Validate the NFT metadata files with this command:

   ```bash
   tznft validate-nft-meta Token1.json
   ```

## Configure IPFS storage

Because storage space on blockchains is expensive, developers don't put entire token metadata files on Tezos.
Instead, they configure decentralized storage for the NFT data and put only the link to that data on Tezos itself.
In this section, you set up storage for the NFT metadata using the InterPlanetary File System (IPFS) protocol.

IPFS requires authentication just like blockchain transactions, so in this section you set up an account with the Pinata IPFS provider and use it to upload (or _pin_) the NFT data to IPFS.

1. Create a free Pinata account at <https://app.pinata.cloud/developers/api-keys>.

1. Go to the API Keys tab and click **New Key**.

1. On the Create New API Key page, expand API Endpoint Access and enable the `pinFileToIPFS` permission, as in this picture:

   ![Selecting the permissions for the Pinata key](/images/nft-create/pinata-key-permissions.png)

1. In the **Key Name** field, give the key a name, such as "My Key."

1. Click **Create Key**.

   The API Key Info window shows the API key and secret, which you must copy immediately, because it is not shown again.

1. Copy the API Key and API Secret fields and save the values on your computer.
You need these values in the next section.

   You can see the new API key on the API Keys tab:

   ![The new Pinata API key in the Pinata web app](/images/nft-create/created-pinata-key.png)

1. Add the API key and secret to your local `tznft` configuration by running this command, replacing `$PINATA_KEY` and `$PINATA_SECRET` with your API key and secret:

   ```bash
   tznft set-pinata-keys $PINATA_KEY $PINATA_SECRET --force
   ```

   This command stores the key and secret in the `tznft.json` file, so be careful not to share this file.

1. Pin the first NFT metadata file to IPFS by running this command and passing the file name and a tag for the NFT, which can be the same as the file name:

   ```bash
   tznft pin-file Token1.json --tag Token1
   ```

   The command returns the URI for the data on IPFS, which starts with `ipfs://`.

1. Copy the IPFS URI, because you will need it later.

1. In the same way, pin the other NFT metadata files with the `tznft pin-file` command and save their URIs.

1. Optional: Verify that the files are pinned successfully by opening the Pinata app to the Files page, as in this picture:

   ![The Files tab on Pinata, showing three NFT metadata files](/images/nft-create/pinned-nft-meta.png)

Now that the metadata is pinned to IPFS, you can create NFTs that link to this metadata.

## Mint NFTs

Creating NFTs is called _minting_.
When you mint NFTs, the `tznft` tool creates a smart contract to manage those NFTs based on the configuration files that you created in the previous steps.

To create NFTs, use the `tznft mint` command and pass these parameters:

- The alias or address of the initial owner.
- The alias of the collection from the `tznft create-collection` command.
- The ID number and IPFS URI for the NFTs in a comma-delimited string.

1. Run this command to create a token and set Bob as the owner, replacing the IPFS URI with the URI that the `tznft pin-file` command returned in the previous section:

   ```bash
   tznft mint bob my_collection --tokens '1, ipfs://abcde12345'
   ```

   The response in the terminal says that the token was minted.

   If you forgot the IPFS URI, you can look it up in the Pinata app on the Files tab.
   This tab has a column labeled "Content Identifier (CID)."
   To create the IPFS URI, add the content identifier to the string `ipfs://`.

1. Run the `tznft mint` command to mint the other NFTs.
You can create more than one NFT in a single command by providing more than one string after the `--tokens` switch, as in this example:

   ```bash
   tznft mint bob my_collection --tokens '2, ipfs://defgh12345' '3, ipfs://ijklm12345'
   ```

1. Verify that the NFTs were minted successfully by getting their metadata with the `tznft show-meta` command:

   ```bash
   tznft show-meta bob --nft my_collection --tokens 1 2
   ```

   If the NFTs were created successfully, the command prints the metadata that you pinned to IPFS.

1. When you have created all of the NFTs that you want, freeze the collection so it cannot be changed and no more NFTs can be added by running this command:

   ```bash
   tznft mint-freeze bob my_collection
   ```

Now the NFTs are minted to the sandbox.
Because these NFTs are only on your local computer, in the Flextesa sandbox, you can interact with them only locally.

## Transferring and manipulating NFTs

The `tznft` command provides commands to manipulate NFTs locally, including transferring them between accounts.
Just like transactions on live blockchain networks, the transaction signer must have permission to transfer or manipulate the NFTs.
Currently, only Bob has access to the NFTs, so the `tznft` commands include him as the signer of most transactions.

1. Use the `tznft show-balance` command to print information about Bob's NFTs.
This command takes the alias or address of the collection, the signer of the transaction, the owner of the NFTs, and the IDs of one or more NFTs.

   ```bash
   tznft show-balance --nft my_collection --signer bob --owner bob --tokens 1 2
   ```

   Because NFTs are unique, the response shows a balance of 1 if the account owns the token and 0 if it does not.

1. Use the `tznft show-balance` command to print information about Alice's NFTs:

   ```bash
   tznft show-balance --nft my_collection --signer alice --owner alice --tokens 1 2
   ```

   Because Bob is the initial owner of all of the NFTs, Alice's balance is 0 for each NFT.

1. Use the `tznft transfer` command to transfer one or more NFTs from Bob to Alice.
This command takes the alias or address of the collection, the signer, and one or more comma-separated strings with the current owner, the new owner, and the ID of the NFT to transfer.
For example, this command transfers NFTs 1 and 2 from Bob to Alice:

   ```bash
   tznft transfer --nft my_collection --signer bob --batch 'bob, alice, 1' 'bob, alice, 2'
   ```

1. Verify that the transfer worked by checking Alice's balance with the `tznft show-balance` command:

   ```bash
   tznft show-balance --nft my_collection --signer alice --owner alice --tokens 1 2
   ```

   Now Alice's balance is 1 for each token that transferred.
   Alice is in control of these NFTs and Bob can no longer transfer them.

1. Verify that Bob does not have control over the transferred NFTs by trying to transfer them back from Alice's account to Bob's account:

   ```bash
   tznft transfer --nft my_collection --signer bob --batch 'alice, bob, 1' 'alice, bob, 2'
   ```

   The response shows the error "FA2_INSUFFICIENT_BALANCE" because Bob's account does not have these NFTs.

   One way to give accounts control over NFTs that are not in their account is to make those accounts operators for those NFTs.

1. Make Bob an operator of Alice's NFTs by passing the token IDs to the `tznft update-ops` command:

   ```bash
   tznft update-ops alice --nft my_collection --add 'bob, 1' 'bob, 2'
   ```

1. Try again to transfer the NFTs from Alice's account to Bob's account with a transaction signed by Bob:

   ```bash
   tznft transfer --nft my_collection --signer bob --batch 'alice, bob, 1' 'alice, bob, 2'
   ```

1. Check Bob's account to see that he now owns the NFTs:

   ```bash
   tznft show-balance --nft my_collection --signer bob --owner bob --tokens 1 2
   ```









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
