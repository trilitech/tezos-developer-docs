---
title: NFT Marketplace Part 3
last_update:
  date: 11 October 2023
---

## Introduction

![https://vinepair.com/wp-content/uploads/2016/06/Cellar-HEAD.jpg](https://vinepair.com/wp-content/uploads/2016/06/Cellar-HEAD.jpg)

This time, let's use the single asset template. It is the opposite of the previous NFT template because:

- you have a unique `token_id`, so only 1 wine collection
- you have a certain quantity of items in the same collection

To sum up, you are producing wine bottles from the same collection with `n` quantity.

Keep your code from previous training or get the solution [here](https://github.com/marigold-dev/training-nft-2/tree/main/solution)

> If you clone/fork a repo, rebuild in local

```bash
npm i
cd ./app
yarn install
cd ..
```

## Smart Contract

Point to the new template changing the first import line of your `nft.jsligo` file to

```ligolang
#import "@ligo/fa/lib/fa2/asset/single_asset.impl.jsligo" "FA2Impl"
```

On nft.jsligo file, query/replace any reference to `NFT` namespace by `SingleAsset` one

Change the `offer` and `storage` definitions

```ligolang
export type offer = { quantity: nat, price: nat };

export type storage = {
  administrators: set<address>,
  totalSupply: nat,
  offers: map<address, offer>, //user sells an offer

  ledger: FA2Impl.Datatypes.ledger,
  metadata: FA2Impl.TZIP16.metadata,
  token_metadata: FA2Impl.TZIP12.tokenMetadata,
  operators: FA2Impl.Datatypes.operators,
};
```

Explanation:

- `offers` is now a `map<address,offer>`, because you don't have to store `token_id` as a key, now the key is the owner's address. Each owner can sell a part of the unique collection
- `offer` requires a quantity, each owner is selling a part of the unique collection
- `totalSupply` is set while minting in order to track the global quantity of minted items on the collection. It makes it unnecessary to recalculate each time the quantity from each owner's holdings (this value is constant)

Edit the `mint` function to add the `quantity` extra param, and finally change the `return`

```ligolang
@entry
const mint = (
  [quantity, name, description, symbol, ipfsUrl]: [
    nat,
    bytes,
    bytes,
    bytes,
    bytes
  ],
  s: storage
): ret => {
  if (quantity <= (0 as nat)) return failwith("0");
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
      totalSupply: quantity,
      ledger: Big_map.literal(list([[Tezos.get_sender(), quantity as nat]])) as
        FA2Impl.SingleAsset.ledger,
      token_metadata: Big_map.add(
        0 as nat,
        { token_id: 0 as nat, token_info: token_info },
        s.token_metadata
      ),
      operators: Big_map.empty as FA2Impl.SingleAsset.operators,
    }
  ]
};
```

Edit the `sell` function to replace `token_id` by `quantity`, add/override an offer for the user

```ligolang
@entry
const sell = ([quantity, price]: [nat, nat], s: storage): ret => {
  //check balance of seller

  const sellerBalance =
    FA2Impl.Sidecar.get_amount_for_owner(
      {
        ledger: s.ledger,
        metadata: s.metadata,
        operators: s.operators,
        token_metadata: s.token_metadata,
      }
    )(Tezos.get_source());
  if (quantity > sellerBalance) return failwith("2");
  //need to allow the contract itself to be an operator on behalf of the seller

  const newOperators =
    FA2Impl.Sidecar.add_operator(s.operators)(Tezos.get_source())(
      Tezos.get_self_address()
    );
  //DECISION CHOICE: if offer already exists, we just override it

  return [
    list([]) as list<operation>,
    {
      ...s,
      offers: Map.add(
        Tezos.get_source(),
        { quantity: quantity, price: price },
        s.offers
      ),
      operators: newOperators
    }
  ]
};
```

Also edit the `buy` function to replace `token_id` by `quantity`, check quantities, check final price is enough and update the current offer

```ligolang
@entry
const buy = ([quantity, seller]: [nat, address], s: storage): ret => {
  //search for the offer

  return match(Map.find_opt(seller, s.offers)) {
    when (None()):
      failwith("3")
    when (Some(offer)):
      do {
        //check if quantity is enough

        if (quantity > offer.quantity) return failwith("4");
        //check if amount have been paid enough

        if (Tezos.get_amount() < (offer.price * quantity) * (1 as mutez)) return failwith(
          "5"
        );
        // prepare transfer of XTZ to seller

        const op =
          Tezos.transaction(
            unit,
            (offer.price * quantity) * (1 as mutez),
            Tezos.get_contract_with_error(seller, "6")
          );
        //transfer tokens from seller to buyer

        let ledger =
          FA2Impl.Sidecar.decrease_token_amount_for_user(s.ledger)(seller)(
            quantity
          );
        ledger
        = FA2Impl.Sidecar.increase_token_amount_for_user(ledger)(
            Tezos.get_source()
          )(quantity);
        //update new offer

        const newOffer = { ...offer, quantity: abs(offer.quantity - quantity) };
        return [
          list([op]) as list<operation>,
          {
            ...s,
            offers: Map.update(seller, Some(newOffer), s.offers),
            ledger: ledger,
          }
        ]
      }
  }
};
```

Edit the storage file `nft.storageList.jsligo` as it. (:warning: you can change the `administrator` address to your own address or keep `alice`)

```ligolang
#import "nft.jsligo" "Contract"

const default_storage: Contract.storage = {
    administrators: Set.literal(
        list(["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address])
    ) as set<address>,
    totalSupply: 0 as nat,
    offers: Map.empty as map<address, Contract.offer>,
    ledger: Big_map.empty as Contract.FA2Impl.SingleAsset.ledger,
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
    operators: Big_map.empty as Contract.FA2Impl.SingleAsset.operators,
};
```

Compile again and deploy to ghostnet.

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq compile nft.jsligo
taq deploy nft.tz -e "testing"
```

```logs
┌──────────┬──────────────────────────────────────┬───────┬──────────────────┬────────────────────────────────┐
│ Contract │ Address                              │ Alias │ Balance In Mutez │ Destination                    │
├──────────┼──────────────────────────────────────┼───────┼──────────────────┼────────────────────────────────┤
│ nft.tz   │ KT1EUWEeR9RHMb5q5jeW5jbhxBFHbLTqQgiZ │ nft   │ 0                │ https://ghostnet.ecadinfra.com │
└──────────┴──────────────────────────────────────┴───────┴──────────────────┴────────────────────────────────┘
```

**The smart contract! _(backend)_ is finished**

## NFT Marketplace front

Generate Typescript classes and go to the frontend to run the server

```bash
taq generate types ./app/src
cd ./app
yarn install
yarn dev
```

### Update in `App.tsx`

Fetch the `token_id == 0`.
Replace the function `refreshUserContextOnPageReload` by

```typescript
const refreshUserContextOnPageReload = async () => {
  console.log("refreshUserContext");
  //CONTRACT
  try {
    let c = await Tezos.contract.at(nftContractAddress, tzip12);
    console.log("nftContractAddress", nftContractAddress);

    let nftContrat: NftWalletType = await Tezos.wallet.at<NftWalletType>(
      nftContractAddress
    );
    const storage = (await nftContrat.storage()) as Storage;

    try {
      let tokenMetadata: TZIP21TokenMetadata = (await c
        .tzip12()
        .getTokenMetadata(0)) as TZIP21TokenMetadata;
      nftContratTokenMetadataMap.set("0", tokenMetadata);

      setNftContratTokenMetadataMap(new Map(nftContratTokenMetadataMap)); //new Map to force refresh
    } catch (error) {
      console.log("error refreshing nftContratTokenMetadataMap: ");
    }

    setNftContrat(nftContrat);
    setStorage(storage);
  } catch (error) {
    console.log("error refreshing nft contract: ", error);
  }

  //USER
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    setUserAddress(activeAccount.address);
    const balance = await Tezos.tz.getBalance(activeAccount.address);
    setUserBalance(balance.toNumber());
  }

  console.log("refreshUserContext ended.");
};
```

### Update in `MintPage.tsx`

The quantity field is added and the `token_id` field is removed. Replace the full file by the following content:

```typescript
import OpenWithIcon from "@mui/icons-material/OpenWith";
import {
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
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BigNumber } from "bignumber.js";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { TZIP21TokenMetadata, UserContext, UserContextType } from "./App";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";

import {
  AddCircleOutlined,
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { char2Bytes } from "@taquito/utils";
import { useFormik } from "formik";
import SwipeableViews from "react-swipeable-views";
import * as yup from "yup";
import { address, bytes, nat } from "./type-aliases";
export default function MintPage() {
  const {
    userAddress,
    storage,
    nftContrat,
    refreshUserContextOnPageReload,
    nftContratTokenMetadataMap,
  } = React.useContext(UserContext) as UserContextType;
  const { enqueueSnackbar } = useSnackbar();
  const [pictureUrl, setPictureUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

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
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    symbol: yup.string().required("Symbol is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .positive("ERROR: The number must be greater than 0!"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      token_id: 0,
      symbol: "WINE",
      quantity: 1,
    } as TZIP21TokenMetadata & { quantity: number },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mint(values);
    },
  });

  //open mint drawer if admin
  useEffect(() => {
    if (storage && storage!.administrators.indexOf(userAddress! as address) < 0)
      setFormOpen(false);
    else setFormOpen(true);
  }, [userAddress]);

  const mint = async (
    newTokenDefinition: TZIP21TokenMetadata & { quantity: number }
  ) => {
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
            new BigNumber(newTokenDefinition.quantity) as nat,
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
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
    }
  };

  const [formOpen, setFormOpen] = useState<boolean>(false);

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

  const isTablet = useMediaQuery("(min-width:600px)");

  return (
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

              <TextField
                type="number"
                id="standard-basic"
                name="quantity"
                label="quantity"
                required
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={
                  formik.touched.quantity && Boolean(formik.errors.quantity)
                }
                helperText={formik.touched.quantity && formik.errors.quantity}
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
      ) : (
        <Typography sx={{ py: "2em" }} variant="h4">
          Sorry, there is not NFT yet, you need to mint bottles first
        </Typography>
      )}
    </Paper>
  );
}
```

### Update in `OffersPage.tsx`

The quantity field is added and the `token_id` filed is removed. Replace the full file with the following content:

```typescript
import { InfoOutlined } from "@mui/icons-material";
import SellIcon from "@mui/icons-material/Sell";
import * as api from "@tzkt/sdk-api";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ImageList,
  InputAdornment,
  Pagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import BigNumber from "bignumber.js";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import { UserContext, UserContextType } from "./App";
import ConnectButton from "./ConnectWallet";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { address, nat } from "./type-aliases";

const itemPerPage: number = 6;

const validationSchema = yup.object({
  price: yup
    .number()
    .required("Price is required")
    .positive("ERROR: The number must be greater than 0!"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("ERROR: The number must be greater than 0!"),
});

type Offer = {
  price: nat;
  quantity: nat;
};

export default function OffersPage() {
  api.defaults.baseUrl = "https://api.ghostnet.tzkt.io";

  const [selectedTokenId, setSelectedTokenId] = React.useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  let [ownerOffers, setOwnerOffers] = React.useState<Offer | null>(null);
  let [ownerBalance, setOwnerBalance] = React.useState<number>(0);

  const {
    nftContrat,
    nftContratTokenMetadataMap,
    userAddress,
    storage,
    refreshUserContextOnPageReload,
    Tezos,
    setUserAddress,
    setUserBalance,
    wallet,
  } = React.useContext(UserContext) as UserContextType;

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      price: 0,
      quantity: 1,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("onSubmit: (values)", values, selectedTokenId);
      sell(selectedTokenId, values.quantity, values.price);
    },
  });

  const initPage = async () => {
    if (storage) {
      console.log("context is not empty, init page now");

      const ledgerBigMapId = (
        storage.ledger as unknown as { id: BigNumber }
      ).id.toNumber();

      const ownersKeys = await api.bigMapsGetKeys(ledgerBigMapId, {
        micheline: "Json",
        active: true,
      });

      await Promise.all(
        ownersKeys.map(async (ownerKey) => {
          if (ownerKey.key === userAddress) {
            const ownerBalance = await storage.ledger.get(
              userAddress as address
            );
            setOwnerBalance(ownerBalance.toNumber());
            const ownerOffers = await storage.offers.get(
              userAddress as address
            );
            if (ownerOffers && ownerOffers.quantity != BigNumber(0))
              setOwnerOffers(ownerOffers!);

            console.log(
              "found for " +
                ownerKey.key +
                " on token_id " +
                0 +
                " with balance " +
                ownerBalance
            );
          } else {
            console.log("skip to next owner");
          }
        })
      );
    } else {
      console.log("context is empty, wait for parent and retry ...");
    }
  };

  useEffect(() => {
    (async () => {
      console.log("after a storage changed");
      await initPage();
    })();
  }, [storage]);

  useEffect(() => {
    (async () => {
      console.log("on Page init");
      await initPage();
    })();
  }, []);

  const sell = async (token_id: number, quantity: number, price: number) => {
    try {
      const op = await nftContrat?.methods
        .sell(
          BigNumber(quantity) as nat,
          BigNumber(price * 1000000) as nat //to mutez
        )
        .send();

      await op?.confirmation(2);

      enqueueSnackbar(
        "Wine collection (token_id=" +
          token_id +
          ") offer for " +
          quantity +
          " units at price of " +
          price +
          " XTZ",
        { variant: "success" }
      );

      refreshUserContextOnPageReload(); //force all app to refresh the context
    } catch (error) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
    }
  };

  const isDesktop = useMediaQuery("(min-width:1100px)");
  const isTablet = useMediaQuery("(min-width:600px)");
  return (
    <Paper>
      <Typography style={{ paddingBottom: "10px" }} variant="h5">
        Sell my bottles
      </Typography>
      {ownerBalance != 0 ? (
        <Fragment>
          <Pagination
            page={currentPageIndex}
            onChange={(_, value) => setCurrentPageIndex(value)}
            count={Math.ceil(1 / itemPerPage)}
            showFirstButton
            showLastButton
          />

          <ImageList
            cols={isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1}
          >
            <Card key={userAddress + "-" + 0}>
              <CardHeader
                avatar={
                  <Tooltip
                    title={
                      <Box>
                        <Typography>{"ID : " + 0}</Typography>
                        <Typography>
                          {"Description : " +
                            nftContratTokenMetadataMap.get("0")?.description}
                        </Typography>
                      </Box>
                    }
                  >
                    <InfoOutlined />
                  </Tooltip>
                }
                title={nftContratTokenMetadataMap.get("0")?.name}
              />
              <CardMedia
                sx={{ width: "auto", marginLeft: "33%" }}
                component="img"
                height="100px"
                image={nftContratTokenMetadataMap
                  .get("0")
                  ?.thumbnailUri?.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  )}
              />

              <CardContent>
                <Box>
                  <Typography variant="body2">
                    {"Owned : " + ownerBalance}
                  </Typography>
                  <Typography variant="body2">
                    {ownerOffers
                      ? "Traded : " +
                        ownerOffers?.quantity +
                        " (price : " +
                        ownerOffers?.price.dividedBy(1000000) +
                        " Tz/b)"
                      : ""}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                {!userAddress ? (
                  <Box marginLeft="5vw">
                    <ConnectButton
                      Tezos={Tezos}
                      nftContratTokenMetadataMap={nftContratTokenMetadataMap}
                      setUserAddress={setUserAddress}
                      setUserBalance={setUserBalance}
                      wallet={wallet}
                    />
                  </Box>
                ) : (
                  <form
                    style={{ width: "100%" }}
                    onSubmit={(values) => {
                      setSelectedTokenId(0);
                      formik.handleSubmit(values);
                    }}
                  >
                    <span>
                      <TextField
                        type="number"
                        sx={{ width: "40%" }}
                        name="price"
                        label="price/bottle"
                        placeholder="Enter a price"
                        variant="filled"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.price && Boolean(formik.errors.price)
                        }
                        helperText={formik.touched.price && formik.errors.price}
                      />
                      <TextField
                        sx={{
                          width: "60%",
                          bottom: 0,
                          position: "relative",
                        }}
                        type="number"
                        label="quantity"
                        name="quantity"
                        placeholder="Enter a quantity"
                        variant="filled"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.quantity &&
                          Boolean(formik.errors.quantity)
                        }
                        helperText={
                          formik.touched.quantity && formik.errors.quantity
                        }
                        InputProps={{
                          inputProps: { min: 0, max: ownerBalance },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                type="submit"
                                aria-label="add to favorites"
                              >
                                <SellIcon /> Sell
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </span>
                  </form>
                )}
              </CardActions>
            </Card>
          </ImageList>
        </Fragment>
      ) : (
        <Typography sx={{ py: "2em" }} variant="h4">
          Sorry, you don't own any bottles, buy or mint some first
        </Typography>
      )}
    </Paper>
  );
}
```

### Update in `WineCataloguePage.tsx`

The quantity field is added and `token_id` filed is removed. Replace the full file with the following content:

```typescript
import { InfoOutlined } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ImageList,
  InputAdornment,
  Pagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BigNumber from "bignumber.js";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { Fragment, useState } from "react";
import * as yup from "yup";
import { UserContext, UserContextType } from "./App";
import ConnectButton from "./ConnectWallet";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { address, nat } from "./type-aliases";

const itemPerPage: number = 6;

type OfferEntry = [address, Offer];

type Offer = {
  price: nat;
  quantity: nat;
};

const validationSchema = yup.object({
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("ERROR: The number must be greater than 0!"),
});

export default function WineCataloguePage() {
  const {
    Tezos,
    nftContratTokenMetadataMap,
    setUserAddress,
    setUserBalance,
    wallet,
    userAddress,
    nftContrat,
    refreshUserContextOnPageReload,
    storage,
  } = React.useContext(UserContext) as UserContextType;
  const [selectedOfferEntry, setSelectedOfferEntry] =
    React.useState<OfferEntry | null>(null);

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("onSubmit: (values)", values, selectedOfferEntry);
      buy(values.quantity, selectedOfferEntry!);
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  const buy = async (quantity: number, selectedOfferEntry: OfferEntry) => {
    try {
      const op = await nftContrat?.methods
        .buy(BigNumber(quantity) as nat, selectedOfferEntry[0])
        .send({
          amount:
            selectedOfferEntry[1].quantity.toNumber() *
            selectedOfferEntry[1].price.toNumber(),
          mutez: true,
        });

      await op?.confirmation(2);

      enqueueSnackbar(
        "Bought " +
          quantity +
          " unit of Wine collection (token_id:" +
          selectedOfferEntry[0][1] +
          ")",
        {
          variant: "success",
        }
      );

      refreshUserContextOnPageReload(); //force all app to refresh the context
    } catch (error) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
    }
  };
  const isDesktop = useMediaQuery("(min-width:1100px)");
  const isTablet = useMediaQuery("(min-width:600px)");

  return (
    <Paper>
      <Typography style={{ paddingBottom: "10px" }} variant="h5">
        Wine catalogue
      </Typography>

      {storage?.offers && storage?.offers.size != 0 ? (
        <Fragment>
          <Pagination
            page={currentPageIndex}
            onChange={(_, value) => setCurrentPageIndex(value)}
            count={Math.ceil(
              Array.from(storage?.offers.entries()).filter(([_, offer]) =>
                offer.quantity.isGreaterThan(0)
              ).length / itemPerPage
            )}
            showFirstButton
            showLastButton
          />
          <ImageList
            cols={isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1}
          >
            {Array.from(storage?.offers.entries())
              .filter(([_, offer]) => offer.quantity.isGreaterThan(0))
              .filter((_, index) =>
                index >= currentPageIndex * itemPerPage - itemPerPage &&
                index < currentPageIndex * itemPerPage
                  ? true
                  : false
              )
              .map(([owner, offer]) => (
                <Card key={owner}>
                  <CardHeader
                    avatar={
                      <Tooltip
                        title={
                          <Box>
                            <Typography>{"ID : " + 0}</Typography>
                            <Typography>
                              {"Description : " +
                                nftContratTokenMetadataMap.get("0")
                                  ?.description}
                            </Typography>
                            <Typography>{"Seller : " + owner} </Typography>
                          </Box>
                        }
                      >
                        <InfoOutlined />
                      </Tooltip>
                    }
                    title={nftContratTokenMetadataMap.get("0")?.name}
                  />
                  <CardMedia
                    sx={{ width: "auto", marginLeft: "33%" }}
                    component="img"
                    height="100px"
                    image={nftContratTokenMetadataMap
                      .get("0")
                      ?.thumbnailUri?.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                  />

                  <CardContent>
                    <Box>
                      <Typography variant="body2">
                        {"Price : " +
                          offer.price.dividedBy(1000000) +
                          " XTZ/bottle"}
                      </Typography>
                      <Typography variant="body2">
                        {"Available units : " + offer.quantity}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions>
                    {!userAddress ? (
                      <Box marginLeft="5vw">
                        <ConnectButton
                          Tezos={Tezos}
                          nftContratTokenMetadataMap={
                            nftContratTokenMetadataMap
                          }
                          setUserAddress={setUserAddress}
                          setUserBalance={setUserBalance}
                          wallet={wallet}
                        />
                      </Box>
                    ) : (
                      <form
                        style={{ width: "100%" }}
                        onSubmit={(values) => {
                          setSelectedOfferEntry([owner, offer]);
                          formik.handleSubmit(values);
                        }}
                      >
                        <TextField
                          type="number"
                          sx={{ bottom: 0, position: "relative" }}
                          fullWidth
                          name="quantity"
                          label="quantity"
                          placeholder="Enter a quantity"
                          variant="filled"
                          value={formik.values.quantity}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.quantity &&
                            Boolean(formik.errors.quantity)
                          }
                          helperText={
                            formik.touched.quantity && formik.errors.quantity
                          }
                          InputProps={{
                            inputProps: { min: 0, max: offer.quantity },
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  type="submit"
                                  aria-label="add to favorites"
                                >
                                  <ShoppingCartIcon /> BUY
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    )}
                  </CardActions>
                </Card>
              ))}
          </ImageList>
        </Fragment>
      ) : (
        <Typography sx={{ py: "2em" }} variant="h4">
          Sorry, there is not NFT to buy yet, you need to mint or sell bottles
          first
        </Typography>
      )}
    </Paper>
  );
}
```

### Let's play

- Connect with your wallet and choose **alice** account (or one of the administrators you set on the smart contract earlier). You are redirected to the Administration/mint page as there is no minted NFT yet
- Create an asset, for example:
  - `name`: Saint Emilion - Franc la Rose
  - `symbol`: SEMIL
  - `description`: Grand cru 2007
  - `quantity`: 1000
- Click on **Upload an image** and select a bottle picture on your computer
- Click on the Mint button

![minting.png](/img/tutorials/minting.png)

Your picture is pushed to IPFS and displayed, then your wallet asks you to sign the `mint` operation.

- Confirm operation
- Wait less than 1 minute to get the confirmation notification, the page is automatically refreshed.

![minted.png](/img/tutorials/minted.png)

Now you can see the **Trading** menu and the **Bottle offers** sub menu

Click on the sub-menu entry

You are the owner of this bottle so you can make an offer on it

- Enter a quantity
- Enter a price offer
- Click on the **SELL** button
- Wait a bit for the confirmation, then once automatically refreshed you have an offer attached to your NFT

![offer.png](/img/tutorials/offer.png)

For buying,

- Disconnect from your user and connect with another account _(who has enough XTZ to buy at least 1 bottle)_
- The buyer will see that alice is selling some bottles from the unique collection
- Buy some bottles while clicking on **BUY** button
- Wait for the confirmation, then the offer is updated on the market _(depending how many bottle you bought)_
- Click on **bottle offers** sub menu
- You are now the owner of some bottles, you can resell a part of it at your own price, etc ...

![buy.png](/img/tutorials/buy_part3.png)

## Conclusion

You are now able to play with a unique NFT collection from the Ligo library.

In the next lesson, you will use the last template **multi-asset** that will allow multiple NFT collections on the same contract

To continue, let's go to [Part 4](./part-4).
