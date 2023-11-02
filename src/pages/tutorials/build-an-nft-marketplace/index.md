---
id: build-an-nft-marketplace
title: NFT Marketplace Part 1
lastUpdated: 11th October 2023
---

## Introduction

Welcome to the first part of our four-part series on building an NFT Marketplace. This tutorial aims to equip you with the knowledge and tools to create a robust NFT platform.

After this training, you will be able to:
- Understand the basic concepts about NFTs and collectibles
- Extend an existing Ligo library
- Create a marketplace to buy and sell tokens

{% callout type="note" %}
This training course is provided by [Marigold](https://www.marigold.dev/).
You can find the 4 parts on github (solution + materials to build the UI)

- [NFT 1](https://github.com/marigold-dev/training-nft-1): use FA2 NFT template to understand the basics
- [NFT 2](https://github.com/marigold-dev/training-nft-2): finish FA2 NFT marketplace to introduce sales
- [NFT 3](https://github.com/marigold-dev/training-nft-3): use FA2 single asset template to build another kind of marketplace
- [NFT 4](https://github.com/marigold-dev/training-nft-4): use FA2 multi asset template to build last complex kind of marketplace
{% /callout %}

## Key Concepts

### What is FA?

Business objects managed by a blockchain are called **assets**. On Tezos you find the term **Financial Asset (abbr. FA)**.

This diagram shows different kinds of assets. Some tangible assets in the real-world, like physical currency and precious metals, are _fungible_, or interchangeable. Other tangible assets, such as specific pieces of art or property, are non-fungible. Similarly, Tezos financial assets can be fungible or non-fungible.

![](http://jingculturecommerce.com/wp-content/uploads/2021/03/nft-assets-1024x614.jpg)

The diagram visually presents the classification of different types of assets based on two main criteria: tangibility and fungibility.

### What is IPFS?

The InterPlanetary File System is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices. While Tezos is a blockchain optimized for transactions and smart contracts, it isn't ideal for storing large data, which is where IPFS comes into play. It complements blockchains like Tezos by efficiently handling large file storage. In this tutorial, using the [Pinata](https://www.pinata.cloud/) (free developer plan) , you'll learn to store NFT metadata on IPFS and reference it on Tezos, offering a scalable and cost-effective solution for handling extensive data associated with NFTs. An alternative would be to install a local IPFS node or an API gateway backend with a usage quota.

### Smart Contracts Overview

There are two contracts for the marketplace.

#### The token contract

On Tezos, FA2 is the standard for non-fungible token contracts. The [template provided by Ligo](https://packages.ligolang.org/package/@ligo/fa) will be used to build out the token contract. The template contains the basic entrypoints for building a Fungible or non-fungible token including:

- Transfer
- Balance_of
- Update_operators

#### Marketplace contract

Next, you need to import the token contract into the marketplace contract. The latter is bringing missing features as:

- Mint
- Buy
- Sell

## Wine marketplace

The `@ligo/fa` package is a pre-built module from the [Ligo repository](https://packages.ligolang.org/) that provides foundational tools and functions for building and interacting with smart contracts on the Tezos blockchain.

The next step is to build a wine marketplace extending the `@ligo/fa` package from the [Ligo repository](https://packages.ligolang.org/).

The goal is to showcase how to extend an existing smart contract and build a frontend on top of it.

The wine marketplace has additional features on top of the generic NFT contract:

- Mint new wine bottles
- Update wine bottle metadata details
- Buy wine bottles
- Sell wine bottles

You can play with the [final demo](https://demo.winefactory.marigold.dev/). It is a platform where you can buy, sell, and check your own wine collection.

![nftfactory.png](/images/nftfactory.png)

| Token template | # of token_type | # of item per token_type |
| -------------- | --------------- | ------------------------ |
| NFT            | 0..n            | 1                        |
| single asset   | 0..1            | 1..n                     |
| multi asset    | 0..n            | 1..n                     |

Explanations:

- For NFT, you can have zero or many NFT tokens, and each NFT token represents a single unique item.

- For single asset, you can have either zero or one type of single asset token. However, for each type of this single asset token, you can have multiple items of it.

- For multi asset: You can have zero or many types of multi-asset tokens, and each type of multi-asset token can represent multiple items.

{% callout type="note" %}
Because of web3, buy or sell features are a real payment system using on-chain XTZ tokens as money. This differs from traditional web2 applications where you have to integrate a payment system and so, pay extra fees
{% /callout %}

## Prerequisites

Before building an NFT marketplace, you must install the following tools.

- [npm](https://nodejs.org/en/download/): for managing and installing dependencies in a TypeScript React application.
- [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable): to build and run the front-end (see this article for more details about [differences between `npm` and `yarn`](https://www.geeksforgeeks.org/difference-between-npm-and-yarn/))
- [taqueria >= v0.40.0](https://github.com/ecadlabs/taqueria): for Tezos app development and deployment.
- [Docker](https://docs.docker.com/engine/install/): creates containers for consistent app development environments, required by **taqueria**
- [jq](https://stedolan.github.io/jq/download/): command-line tool to parse and manipulate JSON data from **taqueria**
- [Temple wallet](https://templewallet.com/): A browser-based wallet for managing Tezos tokens and interacting with Tezos dApps.
- [`VS Code`](https://code.visualstudio.com/download): A code editor for developing and managing your application's codebase.
- [ligo VS Code extension](https://marketplace.visualstudio.com/items?itemName=ligolang-publish.ligo-vscode): Enhances VS Code with support for the LIGO smart contract language.

The following tool is optional:

- [taqueria VS Code extension](https://marketplace.visualstudio.com/items?itemName=ecadlabs.taqueria-vscode): A VS Code extension to visualize Tezos projects and execute related tasks.

## Smart Contract Modification

Use **Taqueria** to shape the project structure, then create the NFT marketplace smart contract thanks to the `ligo/fa` library.

{% callout type="note" %}
Copy some code from this git repository later, so you can clone it with:
```bash
git clone https://github.com/marigold-dev/training-nft-1.git
```


{% /callout %}

### Step 1: Taq'ify your project

1. Set up your smart contract structure.

    ```bash
    taq init training
    cd training
    taq install @taqueria/plugin-ligo
    ```
  The `taq init training` sets up a new workspace named "training" for smart contract development. Then, `cd training` navigates into this new directory. Lastly, `taq install @taqueria/plugin-ligo` installs `taqueria`.

**Your project is ready!**

### Step 2: FA2 contract

Next, you need to build the FA2 contract which relies on the Ligo FA library. To understand in detail how assets work on Tezos, please read the notes below.

- Additional contract metadata can be added to ease displaying token pictures, etc., this is described in the [TZIP-21 standard](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-21/tzip-21.md)

- [Generic Contract metadata reference](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md)

1. Install the `ligo/fa` library locally:

    ```bash
    echo '{ "name": "app", "dependencies": { "@ligo/fa": "^1.0.8" } }' >> ligo.json
    TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq ligo --command "install @ligo/fa"
    ```

### Step 3: NFT marketplace contract

1. Create an NFT marketplace contract with `taqueria`

   ```bash
   taq create contract nft.jsligo
   ```

1. Remove the default code and paste this code instead

    ```ligolang
    #import "@ligo/fa/lib/fa2/nft/nft.impl.jsligo" "FA2Impl"

    /* ERROR MAP FOR UI DISPLAY or TESTS
        const errorMap: map<string,string> = Map.literal(list([
          ["0", "Enter a positive and not null amount"],
          ["1", "Operation not allowed, you need to be administrator"],
          ["2", "You cannot sell more than your current balance"],
          ["3", "Cannot find the offer you entered for buying"],
          ["4", "You entered a quantity to buy than is more than the offer quantity"],
          ["5", "Not enough funds, you need to pay at least quantity * offer price to get the tokens"],
          ["6", "Cannot find the contract relative to implicit address"],
        ]));
    */

    export type storage = {
      administrators: set<address>,
      ledger: FA2Impl.NFT.ledger,
      metadata: FA2Impl.TZIP16.metadata,
      token_metadata: FA2Impl.TZIP12.tokenMetadata,
      operators: FA2Impl.NFT.operators
    };

    type ret = [list<operation>, storage];
    ```

    Explanations:

    - The first line `#import "@ligo/fa/lib/fa2/nft/nft.impl.jsligo" "FA2Impl"` imports the Ligo FA library implementation that your code is extending. Then, add new entrypoints to the base code.
    - `storage` definition is an extension of the imported library storage. You need to point to the original types keeping the same naming
      - `FA2Impl.NFT.ledger`: keep/trace ownership of tokens
      - `FA2Impl.TZIP16.metadata`: tzip-16 compliance
      - `FA2Impl.TZIP12.tokenMetadata`: tzip-12 compliance
      - `FA2Impl.NFT.operators`: permissions part of FA2 standard
    - `storage` has more fields to support a set of `administrators`

1. Write `transfer,balance_of,update_operators` entrypoints. You need to do a passthrough call to the underlying library.

    ```ligolang
    @entry
    const transfer = (p: FA2Impl.TZIP12.transfer, s: storage): ret => {
      const ret2: [list<operation>, FA2Impl.NFT.storage] =
        FA2Impl.NFT.transfer(
          p,
          {
            ledger: s.ledger,
            metadata: s.metadata,
            token_metadata: s.token_metadata,
            operators: s.operators,
          }
        );
      return [
        ret2[0],
        {
          ...s,
          ledger: ret2[1].ledger,
          metadata: ret2[1].metadata,
          token_metadata: ret2[1].token_metadata,
          operators: ret2[1].operators,
        }
      ]
    };

    @entry
    const balance_of = (p: FA2Impl.TZIP12.balance_of, s: storage): ret => {
      const ret2: [list<operation>, FA2Impl.NFT.storage] =
        FA2Impl.NFT.balance_of(
          p,
          {
            ledger: s.ledger,
            metadata: s.metadata,
            token_metadata: s.token_metadata,
            operators: s.operators,
          }
        );
      return [
        ret2[0],
        {
          ...s,
          ledger: ret2[1].ledger,
          metadata: ret2[1].metadata,
          token_metadata: ret2[1].token_metadata,
          operators: ret2[1].operators,
        }
      ]
    };

    @entry
    const update_operators = (p: FA2Impl.TZIP12.update_operators, s: storage): ret => {
      const ret2: [list<operation>, FA2Impl.NFT.storage] =
        FA2Impl.NFT.update_operators(
          p,
          {
            ledger: s.ledger,
            metadata: s.metadata,
            token_metadata: s.token_metadata,
            operators: s.operators,
          }
        );
      return [
        ret2[0],
        {
          ...s,
          ledger: ret2[1].ledger,
          metadata: ret2[1].metadata,
          token_metadata: ret2[1].token_metadata,
          operators: ret2[1].operators,
        }
      ]
    };
    ```

    Explanation:

    - Every `FA2Impl.NFT.xxx()` called function is taking the storage type of the NFT library, so you need to send a partial object from our storage definition to match the type definition
    - The return type contains also the storage type of the library, so you need to reconstruct the storage by copying the modified fields

    {% callout type="note" %}
    The LIGO team is working on merging type definitions, so you then can do **type union** or **merge 2 objects** like in Typescript
    {% /callout %}

1. Add the `Mint` function by adding the following code:

    ```ligolang
    @entry
    const mint = (
      [token_id, name, description, symbol, ipfsUrl]: [
        nat,
        bytes,
        bytes,
        bytes,
        bytes
      ],
      s: storage
    ): ret => {
      if (! Set.mem(Tezos.get_sender(), s.administrators)) return failwith("1");
      const token_info: map<string, bytes> =
        Map.literal(
          list(
            [
              ["name", name],
              ["description", description],
              ["interfaces", (bytes `["TZIP-12"]`)],
              ["artifactUri", ipfsUrl],
              ["displayUri", ipfsUrl],
              ["thumbnailUri", ipfsUrl],
              ["symbol", symbol],
              ["decimals", (bytes `0`)]
            ]
          )
        ) as map<string, bytes>;
      return [
        list([]) as list<operation>,
        {
          ...s,
          ledger: Big_map.add(token_id, Tezos.get_sender(), s.ledger) as
            FA2Impl.NFT.ledger,
          token_metadata: Big_map.add(
            token_id,
            { token_id: token_id, token_info: token_info },
            s.token_metadata
          ),
          operators: Big_map.empty as FA2Impl.NFT.operators,
        }
      ]
    };
    ```

    Explanation:

    - `mint` function allows you to create a unique NFT. You have to declare the name, description, symbol, and ipfsUrl for the picture to display
    - To simplify the contract it does not store a counter for the token ID and assumes that the front-end application will keep track of the next ID. Ideally, the contract should manage this ID to avoid conflicts. It is up to you what ID to start at, but usually NFTs start with the ID 0. Optionally, you can also add code to reuse the IDs from burned NFTs.
    - Most of the fields are optional except `decimals` that is set to `0`. A unique NFT does not have decimals, it is a unit
    - By default, the `quantity` for an NFT is `1`, that is why every bottle is unique and there is no need to set a total supply on each NFT.
    - There is no way to tell how many NFTs are in the collection from the contract because the big_map data type does not have a function to return its length. You could add an additional element in the storage to remember the number of NFTs. Another way to get the size of the collection is to index it on the front end.

    **Smart contract implementation for this first training is finished, let's prepare the deployment to ghostnet.**

1. Make sure that Docker Desktop is running.

1. Compile the `nft.jsligo` file to create a default taqueria initial storage and parameter file

    ```bash
    TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq compile nft.jsligo
    ```

1. Get the address of the account you want to use.

    Set the address of the account that will mint NFTs.

    You have the option to update the administrator address. You can either replace it with your personal address or retain the default Alice address tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb.

    Paste the address of the account and be ready to input it in the following step.

1. Edit the new storage file `nft.storageList.jsligo` as it.


    ```ligolang
    #import "nft.jsligo" "Contract"

    const default_storage : Contract.storage = {
        administrators: Set.literal(
            list(["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address])
        ) as set<address>,
        ledger: Big_map.empty as Contract.FA2Impl.NFT.ledger,
        metadata: Big_map.literal(
            list(
                [
                    ["", bytes `tezos-storage:data`],
                    [
                        "data",
                        bytes
                        `{
          "name":"FA2 NFT Marketplace",
          "description":"Example of FA2 implementation",
          "version":"0.0.1",
          "license":{"name":"MIT"},
          "authors":["Marigold<contact@marigold.dev>"],
          "homepage":"https://marigold.dev",
          "source":{
            "tools":["Ligo"],
            "location":"https://github.com/ligolang/contract-catalogue/tree/main/lib/fa2"},
          "interfaces":["TZIP-012"],
          "errors": [],
          "views": []
          }`
                    ]
                ]
            )
        ) as Contract.FA2Impl.TZIP16.metadata,
        token_metadata: Big_map.empty as Contract.FA2Impl.TZIP12.tokenMetadata,
        operators: Big_map.empty as Contract.FA2Impl.NFT.operators,
    };
    ```
    > For advanced users, just go to `.taq/config.local.testing.json` and change the default account by alice one's (publicKey,publicKeyHash,privateKey) and then redeploy:
      >
      > ```json
      > {
      >   "networkName": "ghostnet",
      >   "accounts": {
      >     "taqOperatorAccount": {
      >       "publicKey": "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
      >       "publicKeyHash": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      >       "privateKey": "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
      >     }
      >   }
      > }
      > ```

1. Compile and deploy to ghostnet

    ```bash
    TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq compile nft.jsligo
    taq install @taqueria/plugin-taquito
    taq deploy nft.tz -e "testing"
    ```

    {% callout type="note" %}
    If this is the first time you're using **taqueria**, you may want to run through [this training](https://github.com/marigold-dev/training-dapp-1#ghostnet-testnet-wallet).
    {% /callout %}


    The following response includes the address of the deployed contract and Taqueria records this address automatically.

    ```logs
    ┌──────────┬──────────────────────────────────────┬───────┬──────────────────┬────────────────────────────────┐
    │ Contract │ Address                              │ Alias │ Balance In Mutez │ Destination                    │
    ├──────────┼──────────────────────────────────────┼───────┼──────────────────┼────────────────────────────────┤
    │ nft.tz   │ KT18sgGX5nu4BzwV2JtpQy4KCqc8cZU5MwnN │ nft   │ 0                │ https://ghostnet.ecadinfra.com │
    └──────────┴──────────────────────────────────────┴───────┴──────────────────┴────────────────────────────────┘
    ```

    **Backend is finished!**

## NFT Marketplace frontend

This section guides you step-by-step in setting up an intuitive frontend.

### Step 1: Get the react boilerplate

To save time, a [boilerplate ready for the UI](https://github.com/marigold-dev/training-nft-1/tree/main/reactboilerplateapp) is ready for you.

1. Copy this code into your folder
    > Reminder: Ensure you've cloned the repository and are currently navigating from the `$REPO/training` directory.

    ```bash
    cp -r ../reactboilerplateapp/ ./app
    ```

    > Note: if you want to understand how it has been made from scratch look at [this training](https://github.com/marigold-dev/training-dapp-1#construction_worker-dapp)

    It is easier on frontend side to use typed objects. Taqueria provides a plugin to generate Typescript classes from your Michelson code.

    Install the plugin in the next step, then generate a representation of your smart contract objects that writes these files to your frontend app source code.

2. Run the server

    ```bash
    taq install @taqueria/plugin-contract-types
    taq generate types ./app/src
    cd app
    yarn install
    yarn dev
    ```

    > Note: On a **Mac**:green_apple:, sometimes `sed` commands do not work exactly the same as Unix commands. Look at the start script on package.json for Mac below:
    > `   "dev": "if test -f .env; then sed -i '' \"s/\\(VITE_CONTRACT_ADDRESS *= *\\).*/\\1$(jq -r 'last(.tasks[]).output[0].address' ../.taq/testing-state.json)/\" .env ; else jq -r '\"VITE_CONTRACT_ADDRESS=\" + last(.tasks[]).output[0].address' ../.taq/testing-state.json > .env ; fi && vite",`

    The website is ready! Now, it:

    - Automatically updats itself to recognize the most recently deployed contract address from the taqueria configuration.
    - Provides users to connect and disconnect their wallets.
    - Offers a structured user interface and navigation system

    If you try to connect you are redirected to `/` path that is also the wine catalog.

    There are no bottle collections yet, so you have to create the mint page.

### Step 2: Mint Page

1. In `MintPage.tsx`, replace the **HTML** template starting with `<Paper>` with this one:

    ```html
        <Paper>

          {storage ? (
            <Button
              disabled={storage.administrators.indexOf(userAddress! as address) < 0}
              sx={{
                p: 1,
                position: "absolute",
                right: "0",
                display: formOpen ? "none" : "block",
                zIndex: 1,
              }}
              onClick={toggleDrawer(!formOpen)}
            >
              {" Mint Form " +
                (storage!.administrators.indexOf(userAddress! as address) < 0
                  ? " (You are not admin)"
                  : "")}
              <OpenWithIcon />
            </Button>
          ) : (
            ""
          )}

          <SwipeableDrawer
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            anchor="right"
            open={formOpen}
            variant="temporary"
          >
            <Toolbar
              sx={
                isTablet
                  ? { marginTop: "0", marginRight: "0" }
                  : { marginTop: "35px", marginRight: "125px" }
              }
            />
            <Box
              sx={{
                width: isTablet ? "40vw" : "60vw",
                borderColor: "text.secondary",
                borderStyle: "solid",
                borderWidth: "1px",

                height: "calc(100vh - 64px)",
              }}
            >
              <Button
                sx={{
                  position: "absolute",
                  right: "0",
                  display: !formOpen ? "none" : "block",
                }}
                onClick={toggleDrawer(!formOpen)}
              >
                <Close />
              </Button>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2} margin={2} alignContent={"center"}>
                  <Typography variant="h5">Mint a new collection</Typography>

                  <TextField
                    id="standard-basic"
                    name="token_id"
                    label="token_id"
                    value={formik.values.token_id}
                    disabled
                    variant="filled"
                  />
                  <TextField
                    id="standard-basic"
                    name="name"
                    label="name"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="filled"
                  />
                  <TextField
                    id="standard-basic"
                    name="symbol"
                    label="symbol"
                    required
                    value={formik.values.symbol}
                    onChange={formik.handleChange}
                    error={formik.touched.symbol && Boolean(formik.errors.symbol)}
                    helperText={formik.touched.symbol && formik.errors.symbol}
                    variant="filled"
                  />
                  <TextField
                    id="standard-basic"
                    name="description"
                    label="description"
                    required
                    multiline
                    minRows={2}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    variant="filled"
                  />

                  {pictureUrl ? (
                    <img height={100} width={100} src={pictureUrl} />
                  ) : (
                    ""
                  )}
                  <Button variant="contained" component="label" color="primary">
                    <AddCircleOutlined />
                    Upload an image
                    <input
                      type="file"
                      hidden
                      name="data"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const data = e.target.files ? e.target.files[0] : null;
                        if (data) {
                          setFile(data);
                        }
                        e.preventDefault();
                      }}
                    />
                  </Button>

                  <Button variant="contained" type="submit">
                    Mint
                  </Button>
                </Stack>
              </form>
            </Box>
          </SwipeableDrawer>


          <Typography variant="h5">Mint your wine collection</Typography>

          {nftContratTokenMetadataMap.size != 0 ? (
            "//TODO"
          ) : (
            <Typography sx={{ py: "2em" }} variant="h4">
              Sorry, there is not NFT yet, you need to mint bottles first
            </Typography>
          )}
        </Paper>
    ```

2. Add the following element inside your `MintPage` Component function:

    - A `formik` form:

    ```typescript
    const validationSchema = yup.object({
      name: yup.string().required("Name is required"),
      description: yup.string().required("Description is required"),
      symbol: yup.string().required("Symbol is required"),
    });

    const formik = useFormik({
      initialValues: {
        name: "",
        description: "",
        token_id: 0,
        symbol: "WINE",
      } as TZIP21TokenMetadata,
      validationSchema: validationSchema,
      onSubmit: (values) => {
        mint(values);
      },
    });
    ```

3. Add `pictureUrl` and `setFile` declaration to display the token image after pinning it to IPFS, and to get the upload file on the form:

    ```typescript
    const [pictureUrl, setPictureUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    ```

4. Add drawer variables to manage the side popup of the form:

    ```typescript
    //open mint drawer if admin
    const [formOpen, setFormOpen] = useState<boolean>(false);

    useEffect(() => {
      if (storage && storage.administrators.indexOf(userAddress! as address) < 0)
        setFormOpen(false);
      else setFormOpen(true);
    }, [userAddress]);

    const toggleDrawer =
      (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }
        setFormOpen(open);
      };
    ```

5. Fix the missing imports at the beginning of the file:

    ```typescript
    import { AddCircleOutlined, Close } from "@mui/icons-material";
    import OpenWithIcon from "@mui/icons-material/OpenWith";
    import {
      Box,
      Button,
      Stack,
      SwipeableDrawer,
      TextField,
      Toolbar,
      useMediaQuery,
    } from "@mui/material";
    import Paper from "@mui/material/Paper";
    import Typography from "@mui/material/Typography";
    import { useFormik } from "formik";
    import React, { useEffect, useState } from "react";
    import * as yup from "yup";
    import { TZIP21TokenMetadata, UserContext, UserContextType } from "./App";
    import { address } from "./type-aliases";
    ```


1. Add the related imports at the beginning of the file:

   ```typescript
   import { useSnackbar } from "notistack";
   import { BigNumber } from "bignumber.js";
   import { address, bytes, nat } from "./type-aliases";
   import { char2Bytes } from "@taquito/utils";
   import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
   ```

2. Add the `mint` function inside your `MintPage` Component function

   ```typescript
   const { enqueueSnackbar } = useSnackbar();

   const mint = async (newTokenDefinition: TZIP21TokenMetadata) => {
     try {
       //IPFS
       if (file) {
         const formData = new FormData();
         formData.append("file", file);

         const requestHeaders: HeadersInit = new Headers();
         requestHeaders.set(
           "pinata_api_key",
           `${import.meta.env.VITE_PINATA_API_KEY}`
         );
         requestHeaders.set(
           "pinata_secret_api_key",
           `${import.meta.env.VITE_PINATA_API_SECRET}`
         );

         const resFile = await fetch(
           "https://api.pinata.cloud/pinning/pinFileToIPFS",
           {
             method: "post",
             body: formData,
             headers: requestHeaders,
           }
         );

         const responseJson = await resFile.json();
         console.log("responseJson", responseJson);

         const thumbnailUri = `ipfs://${responseJson.IpfsHash}`;
         setPictureUrl(
           `https://gateway.pinata.cloud/ipfs/${responseJson.IpfsHash}`
         );

         const op = await nftContrat!.methods
           .mint(
             new BigNumber(newTokenDefinition.token_id) as nat,
             char2Bytes(newTokenDefinition.name!) as bytes,
             char2Bytes(newTokenDefinition.description!) as bytes,
             char2Bytes(newTokenDefinition.symbol!) as bytes,
             char2Bytes(thumbnailUri) as bytes
           )
           .send();

         //close directly the form
         setFormOpen(false);
         enqueueSnackbar(
           "Wine collection is minting ... it will be ready on next block, wait for the confirmation message before minting another collection",
           { variant: "info" }
         );

         await op.confirmation(2);

         enqueueSnackbar("Wine collection minted", { variant: "success" });

         refreshUserContextOnPageReload(); //force all app to refresh the context
       }
     } catch (error) {
       console.table(`Error: ${JSON.stringify(error, null, 2)}`);
       let tibe: TransactionInvalidBeaconError = new TransactionInvalidBeaconError(
         error
       );
       enqueueSnackbar(tibe.data_message, {
         variant: "error",
         autoHideDuration: 10000,
       });
     }
   };
   ```

   {% callout type="note" %}
   Organize and fix any duplicated import declarations if necessary
   {% /callout %}

   ![mint form](/images/mintForm.png)

   Explanations:

   - On Mint button click, a file is uploaded and a call to the Pinata API pushes the file to IPFS. It returns the hash of the file.
   - The hash is used in two different ways:
     - On the UI, to display the picture using the Https pinata gateway url + hash
     - On the smart contract, the IPFS link is stored as artifactUrl field on the toekn definition metadata
   - TZIP standard requires storing data in `bytes`. As there is no Michelson function to convert string to bytes (using Micheline data PACK is not working, as it alters the final bytes), do the conversion using `char2Bytes` on the frontend side

   {% callout type="note" %}
   Note: Finally, if you remember on the backend, token_id increment management was done in the ui, so you can write this code. It is not a good security practice as it supposes that the counter is managed on frontend side, but it is ok for demo purpose.
   {% /callout %}

3. Add this code inside the `MintPage` component function. Each time it mints a token, it increments the counter for the next token's ID.

```typescript
    useEffect(() => {
      (async () => {
        if (nftContratTokenMetadataMap && nftContratTokenMetadataMap.size > 0) {
          formik.setFieldValue("token_id", nftContratTokenMetadataMap.size);
        }
      })();
    }, [nftContratTokenMetadataMap?.size]);
```

### Display all minted bottles

1. Replace the `"//TODO"` keyword with this template

```html
    <Box sx={{ width: "70vw" }}>
              <SwipeableViews
                axis="x"
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {Array.from(nftContratTokenMetadataMap!.entries()).map(
                  ([token_id, token]) => (
                    <Card
                      sx={{
                        display: "block",
                        maxWidth: "80vw",
                        overflow: "hidden",
                      }}
                      key={token_id.toString()}
                    >
                      <CardHeader
                        titleTypographyProps={
                          isTablet ? { fontSize: "1.5em" } : { fontSize: "1em" }
                        }
                        title={token.name}
                      />

                      <CardMedia
                        sx={
                          isTablet
                            ? {
                                width: "auto",
                                marginLeft: "33%",
                                maxHeight: "50vh",
                              }
                            : { width: "100%", maxHeight: "40vh" }
                        }
                        component="img"
                        image={token.thumbnailUri?.replace(
                          "ipfs://",
                          "https://gateway.pinata.cloud/ipfs/"
                        )}
                      />

                      <CardContent>
                        <Box>
                          <Typography>{"ID : " + token_id}</Typography>
                          <Typography>{"Symbol : " + token.symbol}</Typography>
                          <Typography>
                            {"Description : " + token.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                )}
              </SwipeableViews>
              <MobileStepper
                variant="text"
                steps={Array.from(nftContratTokenMetadataMap!.entries()).length}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={
                      activeStep ===
                      Array.from(nftContratTokenMetadataMap!.entries()).length - 1
                    }
                  >
                    Next
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                }
              />
            </Box>
```

Finally, your imports at beginning of the file should be like this:

```typescript
    import SwipeableViews from "react-swipeable-views";
    import OpenWithIcon from "@mui/icons-material/OpenWith";
    import {
      Box,
      Button,
      CardHeader,
      CardMedia,
      MobileStepper,
      Stack,
      SwipeableDrawer,
      TextField,
      Toolbar,
      useMediaQuery,
    } from "@mui/material";
    import Card from "@mui/material/Card";
    import CardContent from "@mui/material/CardContent";
    import {
      AddCircleOutlined,
      Close,
      KeyboardArrowLeft,
      KeyboardArrowRight,
    } from "@mui/icons-material";
    import Paper from "@mui/material/Paper";
    import Typography from "@mui/material/Typography";
    import { useFormik } from "formik";
    import React, { useEffect, useState } from "react";
    import * as yup from "yup";
    import { TZIP21TokenMetadata, UserContext, UserContextType } from "./App";
    import { useSnackbar } from "notistack";
    import { BigNumber } from "bignumber.js";
    import { address, bytes, nat } from "./type-aliases";
    import { char2Bytes } from "@taquito/utils";
    import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
```

and some variables inside your `MintPage` Component function

```typescript
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
      setActiveStep(step);
    };
```

## Let's play

- Connect with your wallet and choose **alice** account _(or the administrator you set on the smart contract earlier)_. You are redirected to the Administration /mint page as there is no NFT minted yet.
- Create your first wine bottle, for example:
  - `name`: Saint Emilion - Franc la Rose
  - `symbol`: SEMIL
  - `description`: Grand cru 2007
- Click on **Upload an image** and select a bottle picture on your computer
- Click on the Mint button

![minting](/images/minting.png)

Your picture is pushed to IPFS and displayed on the page.

Then, Temple Wallet _(or whatever other wallet you choose)_ asks you to sign the operation. Confirm it, and less than 1 minute after the confirmation notification, the page is automatically refreshed to display your wine collection with your first NFT!

Now you can see all NFTs

![wine collection](/images/winecollection.png)

## Summary

You are able to create an NFT collection marketplace from the `ligo/fa` library.

On next training, you will add the buy and sell functions to your smart contract and update the frontend to allow these actions.

To continue, let's go to [Part 2](/tutorials/build-an-nft-marketplace/part-2).
