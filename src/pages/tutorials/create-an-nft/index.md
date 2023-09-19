---
id: create-an-nft
title: Create an NFT
authors: 'Sol Lederer, Tim McMackin'
lastUpdated: 18th September 2023
---

This tutorial covers how to create a collection of NFTs on Tezos and manipulate them using the `tznft` command-line tool.
No prior knowledge of NFTs or Tezos is required, but you need basic experience with your computer's command-line terminal to paste commands and run them.

In this tutorial, you will learn:

- What NFTs are
- How to install and start a local Tezos sandbox environment
- How to create metadata files to describe NFT collections and individual NFTs
- How to deploy (or _mint_) the NFTs to the sandbox
- How to transfer NFTs and change operator permissions for them
- How to mint NFTs to a testnet

## What is a non-fungible token (NFT)?

An NFT is a special type of blockchain token that represents something unique.
Fungible tokens such as XTZ and real-world currencies like dollars and euros are interchangeable; each one is the same as every other.
By contrast, each NFT is unique and not interchangeable.
NFTs can represent ownership over digital or physical assets like virtual collectibles or unique artwork, or anything that you want them to represent.

Like other types of Tezos tokens, a collection is managed by a smart contract.
The smart contract defines the collection of NFTs, including what information is in each token.
It also describes how they behave, such as what happens when a user transfers an NFT to another user.

In this tutorial, you create NFTs that comply with the FA2 standard (formally known as the [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard), the current standard for tokens on Tezos.
The FA2 standard creates a framework for how tokens behave on Tezos, including fungible, non-fungible, and other types of tokens.
It provides a standard API to transfer tokens, check token balances, manage operators (addresses that are permitted to transfer tokens on behalf of the token owner), and manage token metadata.

## Prerequisites

To run this tutorial you need Node.JS, NPM, and Docker Desktop to install and use the `tznft` CLI tool, which helps you create and test NFT collections on Tezos.

- Install Node.JS version 18 (not 20) and NPM.
See <https://nodejs.org/>.
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

   Unlike the live Tezos networks, this sandbox bakes a new block every 5 seconds.
   Therefore, commands that you run on the sandbox can take a few seconds to complete.

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

1. Create a metadata file for the first NFT in the collection by running this command:

   ```bash
   tznft create-nft-meta Token1 bob ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj
   ```

   This command creates a metadata file named `Token1.json` with default information about the NFT.
   It includes the minter's account address and URIs to pictures that represent the NFT.
   In this case, the `ipfs` URI links to a picture of the Tezos logo, which you can see at this link: <https://ipfs.io/ipfs/QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj>.

1. Optional: Edit the metadata such as the name and description fields in the `Token1.json` file.

1. Optional: Edit other fields in the metadata based on the FA2 standard.

   For example, you can expand the `attributes` section with other attributes.
   Each attribute must have the `name` and `value` fields and can optionally have a `type` field, as in this example:

   ```json
   "attributes": [
     {
       "name": "My string attribute",
       "value": "String attribute value"
      },
     {
       "name": "My integer attribute",
       "value": "5",
       "type": "integer"
      },
     {
       "name": "My number attribute",
       "value": "12.3",
       "type": "number"
      },
     {
       "name": "My percentage attribute",
       "value": "19",
       "type": "percentage"
      }
   ]
   ```

   By default the `artifactUri`, `displayUri`, and `thumbnailUri` fields are set to the picture that you passed in the `tznft create-nft-meta` command.
   You can update these to different images to allow applications to show media to represent the NFT.
   You can also add a `formats` object to provide media in different formats, such as different image, video, or audio formats:

   ```json
   "formats": [
     {
       "uri": "ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj",
       "hash": "a56017a1317b1bc900acdaf600874c00e5c048d30894f452049db6dcef6e4f0d",
       "mimeType": "image/svg+xml"
     },
     {
       "uri": "ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj",
       "hash": "8968db6bde43255876c464613a31fbd0416ca7d74be4c5ae86c1450418528302",
       "mimeType": "image/png",
       "dimensions": {
         "value": "512x512",
         "unit": "px"
       }
     },
     {
       "uri": "ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj",
       "hash": "d4a93fc8d8991caa9b52c04c5ff7edf5c4bc29317a373e3a97f1398c697d6714",
       "mimeType": "model/gltf+json"
     }
   ]
   ```

   For specifics about what is allowed in an NFT metadata file, see the [TZIP-21](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-21/tzip-21.md) standard.

1. Validate the NFT metadata file with this command:

   ```bash
   tznft validate-nft-meta Token1.json
   ```

   If the file does not validate, verify that it is valid JSON and has only the fields listed in the [TZIP-21](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-21/tzip-21.md) standard.

1. Create at least one more metadata file for other NFTs by running commands like this example:

   ```bash
   tznft create-nft-meta Token2 bob ipfs://QmRyTc9KbD7ZSkmEf4e7fk6A44RPciW5pM4iyqRGrhbyvj
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
First, you create the smart contract to manage the NFTs.
Then, you mint one or more NFTs with that contract.
The related `tznft` commands use the configuration files that you created earlier.

1. Create the collection contract from the metadata file by running this command:

   ```bash
   tznft create-collection bob --meta_file my_collection.json --alias my_collection
   ```

   This command takes the alias of the user who is the owner of the collection.
   In this case, the owner is one of the default accounts in the sandbox.
   The command also includes the metadata file and an optional local alias for the collection.

   The command also updates the `tznft.json` file with information about the new collection, including the address of the smart contract that manages the collection.
   This smart contract is a pre-compiled FA2 NFT contract written in the [LIGO](https://ligolang.org/) smart contract language.
   You can write your own smart contracts to manage NFTs, but using this contract prevents errors and provides all of the functionality needed to create, transfer, and manage NFTs.

1. Run this command to create a token and set Bob as the owner, replacing the IPFS URI with the URI that the `tznft pin-file` command returned in the previous section:

   ```bash
   tznft mint bob my_collection --tokens '1, ipfs://abcde12345'
   ```

   This command includes these parameters:

      - The alias or address of the initial owner.
      - The alias of the collection from the `tznft create-collection` command.
      - The ID number and IPFS URI for the NFTs in a comma-delimited string.

   If you forgot the IPFS URI, you can look it up in the Pinata app on the Files tab.
   This tab has a column labeled "Content Identifier (CID)."
   To create the IPFS URI, add the content identifier to the string `ipfs://`.

   The response in the terminal says that the token was minted.

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

Now the NFTs are minted to the sandbox.
Because these NFTs are only on your local computer, in the Flextesa sandbox, you can interact with them only locally.
They exist as long as you keep the Flextesa Docker container running, which you started with the `tznft bootstrap` command.

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

## Freeze the collection

When you have created all of the NFTs that you want, freeze the collection so it cannot be changed and no more NFTs can be added by running this command:

```bash
tznft mint-freeze bob my_collection
```

## Mint tokens on a testnet

So far, the NFTs that you have created are available only in your local sandbox.
When you are satisfied with the NFTs and how they behave, you can send them to a testnet and test them there.
You can use the same configuration files and IPFS data as you used on the sandbox.

By default, the `tznft.json` file has configuration information for the Tezos Ghostnet testnet, where you can test your tokens on a running Tezos network.

1. Show the available networks by running the command `tznft show-network --all` and verify that the testnet is in the list.

1. Change the `tznft` tool to use the testnet instead of your local sandbox:

   ```bash
   tznft set-network testnet
   ```

1. Run the `tznft bootstrap` command to get the testnet ready for your use.
Now that the network is set to testnet, this command deploys a helper balance inspector contract to testnet that allows the `tznft` command to get information from the testnet.
You only need to run this command for testnet once.

1. Create an alias on the testnet to own the NFTs.
You can do this in either of these two ways:

   - If you have an existing Tezos wallet that supports testnets (such as Temple wallet), copy the private key from that wallet and use the `tznft add-alias` command to create a local alias for it.
   For example, this command creates a wallet with the alias `my-account`:

      ```bash
      tznft add-alias my-account $TEZOS_PRIVATE_KEY
      ```

   - Create a local wallet with the installation of the `octez-client` command within the Flextesa Docker container:

      1. Generate local keys with the `octez-client gen keys` command.
      For example, this command creates keys for a wallet with the alias `my-account`:

         ```bash
         docker exec flextesa-sandbox octez-client gen keys my-account
         ```

      1. Get the private key for the wallet with this command:

         ```bash
         docker exec flextesa-sandbox octez-client show address my-account -S
         ```

         The response includes the hash, public key, and secret key for the wallet.

      1. Add the secret key as an alias with the `tznft` command:

         ```bash
         tznft add-alias my-account $TEZOS_PRIVATE_KEY
         ```

      1. Add funds to the new wallet by going to the Ghostnet faucet at <https://faucet.ghostnet.teztnets.xyz/>, pasting the wallet's hash in the "Or fund any address" field, and clicking a button to request tokens.
      The wallet needs tokens to pay the fees to create the collection and mint the tokens on Ghostnet.

1. Create the collection on the testnet.
The command is the same as for the sandbox, and you can create a new collection file or use the file from the sandbox.
Similarly, you can use the same collection because `tznft` keeps aliases separate on different networks, but be sure not to get the aliases confused.

   ```bash
   tznft create-collection my-account --meta_file my_collection.json --alias my_collection
   ```

1. Mint the tokens on the testnet.
The command is the same as for the sandbox:

   ```bash
   tznft mint my-account my_collection --tokens '1, ipfs://abcde12345'
   ```

   You can add more NFTs until you freeze the collection.

1. View your token balances.
The command is the same as for the sandbox:

   ```bash
   tznft show-balance --nft my_collection --signer my-account --owner my-account --tokens 1
   ```

1. View the tokens on a block explorer:

   1. Get the address of the collection on the testnet from the `testnet` section of the `tznft.json` file.
   The address starts with "KT1".

   1. Go to a block explorer, such as <https://tzkt.io>.

   1. Set the block explorer to use testnet instead of Tezos mainnet.

   1. In the search field, paste the address of the collection and press Enter.

   The block explorer shows information about the contract that manages the NFTs, including a list of all NFTs in the contract, who owns them, and a list of recent transactions.

Now the NFTs are on Tezos mainnet and you can transfer and manipulate them just like you did in the sandbox.
You may need to create more account aliases to transfer them, but the commands are the same.
For example, to transfer NFTs to an account with the alias `second-account`, run this command:

```bash
tznft transfer --nft my_collection --signer my-account --batch 'my-account, other-account, 1' 'my-account, other-account, 2'
```

## Summary

Now you can create, test, and deploy NFTs locally and to testnets.
The process for minting NFTs to Tezos mainnet is the same, but you must use an account with real XTZ in it to pay the transaction fees.

If you want to continue working with these NFTs, try creating a marketplace for them as described in the tutorial [Build an NFT Marketplace](../build-an-nft-marketplace).
