---
id: build-an-nft-marketplace
title: NFT Marketplace Part 2
lastUpdated: 11th October 2023
---

## Introduction

![https://img.etimg.com/thumb/msid-71286763,width-1070,height-580,overlay-economictimes/photo.jpg](https://img.etimg.com/thumb/msid-71286763,width-1070,height-580,overlay-economictimes/photo.jpg)

This time, buy and sell an NFT feature is added !

Keep your code from the previous lesson or get the solution [here](https://github.com/marigold-dev/training-nft-1/tree/main/solution)

> If you clone/fork a repo, rebuild locally

```bash
npm i
cd ./app
yarn install
cd ..
```

## Smart contract

Add the following code sections on your `nft.jsligo` smart contract

Add offer type

```ligolang
export type offer = {
  owner : address,
  price : nat
};
```

Add `offers` field to storage, it should look like this below :

```ligolang
export type storage = {
  administrators: set<address>,
  offers: map<nat, offer>, //user sells an offer
  ledger: FA2Impl.NFT.ledger,
  metadata: FA2Impl.TZIP16.metadata,
  token_metadata: FA2Impl.TZIP12.tokenMetadata,
  operators: FA2Impl.NFT.operators
};
```

Explanation:

- an `offer` is an NFT _(owned by someone)_ with a price
- `storage` has a new field to store `offers`: a `map` of offers

Update the initial storage on file `nft.storageList.jsligo` to initialize `offers` field. Here is what it should look like :

```ligolang
#import "nft.jsligo" "Contract"

const default_storage : Contract.storage = {
    administrators: Set.literal(
        list(["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address])
    ) as set<address>,
    offers: Map.empty as map<nat, Contract.offer>,
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

Finally, compile the contract

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq compile nft.jsligo
```

### Sell at an offer price

Define the `sell` function as below:

```ligolang
@entry
const sell = ([token_id, price]: [nat, nat], s: storage): ret => {
  //check balance of seller

  const sellerBalance =
    FA2Impl.NFT.get_balance(
      [Tezos.get_source(), token_id],
      {
        ledger: s.ledger,
        metadata: s.metadata,
        operators: s.operators,
        token_metadata: s.token_metadata,
      }
    );
  if (sellerBalance != (1 as nat)) return failwith("2");
  //need to allow the contract itself to be an operator on behalf of the seller

  const newOperators =
    FA2Impl.Sidecar.add_operator(
      s.operators,
      Tezos.get_source(),
      Tezos.get_self_address(),
      token_id
    );
  //DECISION CHOICE: if offer already exists, we just override it

  return [
    list([]) as list<operation>,
    {
      ...s,
      offers: Map.add(
        token_id,
        { owner: Tezos.get_source(), price: price },
        s.offers
      ),
      operators: newOperators
    }
  ]
};
```

Explanation:

- User must have enough tokens _(wine bottles)_ to place an offer
- the seller will set the NFT marketplace smart contract as an operator. When the buyer sends his money to buy the NFT, the smart contract will change the NFT ownership _(it is not interactive with the seller, the martketplace will do it on behalf of the seller based on the offer data)_
- `storage` is updated with `offer` field

### Buy a bottle on the marketplace

Now that there are offers available on the marketplace, let's buy bottles!

Edit the smart contract to add the `buy` feature

```ligolang
@entry
const buy = ([token_id, seller]: [nat, address], s: storage): ret => {
  //search for the offer

  return match(Map.find_opt(token_id, s.offers)) {
    when (None()):
      failwith("3")
    when (Some(offer)):
      do {
        //check if amount have been paid enough

        if (Tezos.get_amount() < offer.price * (1 as mutez)) return failwith(
          "5"
        );
        // prepare transfer of XTZ to seller

        const op =
          Tezos.transaction(
            unit,
            offer.price * (1 as mutez),
            Tezos.get_contract_with_error(seller, "6")
          );
        //transfer tokens from seller to buyer

        const ledger =
          FA2Impl.Sidecar.transfer_token_from_user_to_user(
            s.ledger,
            token_id,
            seller,
            Tezos.get_source()
          );
        //remove offer

        return [
          list([op]) as list<operation>,
          {
            ...s, offers: Map.update(token_id, None(), s.offers), ledger: ledger
          }
        ]
      }
  }
};
```

Explanation:

- search for the offer based on the `token_id` or return an error if it does not exist
- check that the amount sent by the buyer is greater than the offer price. If it is ok, transfer the offer price to the seller and transfer the NFT to the buyer
- remove the offer as it has been executed

### Compile and deploy

Smart contract implementation of this second training is finished, let's deploy to ghostnet.

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:1.0.0 taq compile nft.jsligo
taq deploy nft.tz -e "testing"
```

```logs
┌──────────┬──────────────────────────────────────┬───────┬──────────────────┬────────────────────────────────┐
│ Contract │ Address                              │ Alias │ Balance In Mutez │ Destination                    │
├──────────┼──────────────────────────────────────┼───────┼──────────────────┼────────────────────────────────┤
│ nft.tz   │ KT1KyV1Hprert33AAz5B94CLkqAHdKZU56dq │ nft   │ 0                │ https://ghostnet.ecadinfra.com │
└──────────┴──────────────────────────────────────┴───────┴──────────────────┴────────────────────────────────┘
```

**Smart contract (backend) is implmented and deployed!**

## NFT Marketplace front

Generate Typescript classes and go to the frontend to run the server

```bash
taq generate types ./app/src
cd ./app
yarn install
yarn dev
```

## Sale page

Edit Sale Page on `./src/OffersPage.tsx`

Add this code inside the file :

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
});

type Offer = {
  owner: address;
  price: nat;
};

export default function OffersPage() {
  api.defaults.baseUrl = "https://api.ghostnet.tzkt.io";

  const [selectedTokenId, setSelectedTokenId] = React.useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  let [offersTokenIDMap, setOffersTokenIDMap] = React.useState<
    Map<string, Offer>
  >(new Map());
  let [ownerTokenIds, setOwnerTokenIds] = React.useState<Set<string>>(
    new Set()
  );

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
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("onSubmit: (values)", values, selectedTokenId);
      sell(selectedTokenId, values.price);
    },
  });

  const initPage = async () => {
    if (storage) {
      console.log("context is not empty, init page now");
      ownerTokenIds = new Set();
      offersTokenIDMap = new Map();

      const token_metadataBigMapId = (
        storage.token_metadata as unknown as { id: BigNumber }
      ).id.toNumber();

      const token_ids = await api.bigMapsGetKeys(token_metadataBigMapId, {
        micheline: "Json",
        active: true,
      });

      await Promise.all(
        token_ids.map(async (token_idKey) => {
          const token_idNat = new BigNumber(token_idKey.key) as nat;

          let owner = await storage.ledger.get(token_idNat);
          if (owner === userAddress) {
            ownerTokenIds.add(token_idKey.key);

            const ownerOffers = await storage.offers.get(token_idNat);
            if (ownerOffers) offersTokenIDMap.set(token_idKey.key, ownerOffers);

            console.log(
              "found for " +
                owner +
                " on token_id " +
                token_idKey.key +
                " with balance " +
                1
            );
          } else {
            console.log("skip to next token id");
          }
        })
      );
      setOwnerTokenIds(new Set(ownerTokenIds)); //force refresh
      setOffersTokenIDMap(new Map(offersTokenIDMap)); //force refresh
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

  const sell = async (token_id: number, price: number) => {
    try {
      const op = await nftContrat?.methods
        .sell(
          BigNumber(token_id) as nat,
          BigNumber(price * 1000000) as nat //to mutez
        )
        .send();

      await op?.confirmation(2);

      enqueueSnackbar(
        "Wine collection (token_id=" +
          token_id +
          ") offer for " +
          1 +
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
      {ownerTokenIds && ownerTokenIds.size != 0 ? (
        <Fragment>
          <Pagination
            page={currentPageIndex}
            onChange={(_, value) => setCurrentPageIndex(value)}
            count={Math.ceil(
              Array.from(ownerTokenIds.entries()).length / itemPerPage
            )}
            showFirstButton
            showLastButton
          />

          <ImageList
            cols={isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1}
          >
            {Array.from(ownerTokenIds.entries())
              .filter((_, index) =>
                index >= currentPageIndex * itemPerPage - itemPerPage &&
                index < currentPageIndex * itemPerPage
                  ? true
                  : false
              )
              .map(([token_id]) => (
                <Card key={token_id + "-" + token_id.toString()}>
                  <CardHeader
                    avatar={
                      <Tooltip
                        title={
                          <Box>
                            <Typography>
                              {" "}
                              {"ID : " + token_id.toString()}{" "}
                            </Typography>
                            <Typography>
                              {"Description : " +
                                nftContratTokenMetadataMap.get(token_id)
                                  ?.description}
                            </Typography>
                          </Box>
                        }
                      >
                        <InfoOutlined />
                      </Tooltip>
                    }
                    title={nftContratTokenMetadataMap.get(token_id)?.name}
                  />
                  <CardMedia
                    sx={{ width: "auto", marginLeft: "33%" }}
                    component="img"
                    height="100px"
                    image={nftContratTokenMetadataMap
                      .get(token_id)
                      ?.thumbnailUri?.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                  />

                  <CardContent>
                    <Box>
                      <Typography variant="body2">
                        {offersTokenIDMap.get(token_id)
                          ? "Traded : " +
                            1 +
                            " (price : " +
                            offersTokenIDMap
                              .get(token_id)
                              ?.price.dividedBy(1000000) +
                            " Tz)"
                          : ""}
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
                          setSelectedTokenId(Number(token_id));
                          formik.handleSubmit(values);
                        }}
                      >
                        <span>
                          <TextField
                            type="number"
                            name="price"
                            label="price"
                            placeholder="Enter a price"
                            variant="filled"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.price &&
                              Boolean(formik.errors.price)
                            }
                            helperText={
                              formik.touched.price && formik.errors.price
                            }
                            InputProps={{
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
              ))}{" "}
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

Explanation :

- the template displays all owned NFTs. Only NFTs belonging to the logged user are selected
- for each NFT, there is a form to make an offer at a price
- if you do an offer, it calls the `sell` function and the smart contract entrypoint `nftContrat?.methods.sell(BigNumber(token_id) as nat,BigNumber(price * 1000000) as nat).send()`. Multiply the XTZ price by 10^6 because the smart contract manipulates mutez.

## Let's play : Sell

- Connect with your wallet and choose **alice** account (or one of the administrators you set on the smart contract earlier). You are redirected to the Administration /mint page as there is no NFT minted yet
- Enter these values on the form for example :
  - `name`: Saint Emilion - Franc la Rose
  - `symbol`: SEMIL
  - `description`: Grand cru 2007
- Click on **Upload an image** and select a bottle picture on your computer
- Click on the Mint button

Your picture is pushed to IPFS and displayed, then your wallet ask you to sign the mint operation.

5. Now, go to the **Trading** menu and the **Sell bottles** submenu.

6. Click on the submenu entry

![sell.png](/images/sell.png)

You are the owner of this bottle so you can create an offer to sell it.

- Enter a price offer
- Click on **SELL** button
- Wait a bit for the confirmation, then after auto-refresh you have an offer for this NFT

## Wine Catalogue page

Edit the Wine Catalogue page on `./src/WineCataloguePage.tsx`

Add the following code inside the file

```typescript
import { InfoOutlined } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ImageList,
  Pagination,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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

type OfferEntry = [nat, Offer];

type Offer = {
  owner: address;
  price: nat;
};

const validationSchema = yup.object({});

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
      buy(selectedOfferEntry!);
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  const buy = async (selectedOfferEntry: OfferEntry) => {
    try {
      const op = await nftContrat?.methods
        .buy(
          BigNumber(selectedOfferEntry[0]) as nat,
          selectedOfferEntry[1].owner
        )
        .send({
          amount: selectedOfferEntry[1].price.toNumber(),
          mutez: true,
        });

      await op?.confirmation(2);

      enqueueSnackbar(
        "Bought " +
          1 +
          " unit of Wine collection (token_id:" +
          selectedOfferEntry[0] +
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
              Array.from(storage?.offers.entries()).length / itemPerPage
            )}
            showFirstButton
            showLastButton
          />
          <ImageList
            cols={isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1}
          >
            {Array.from(storage?.offers.entries())

              .filter((_, index) =>
                index >= currentPageIndex * itemPerPage - itemPerPage &&
                index < currentPageIndex * itemPerPage
                  ? true
                  : false
              )
              .map(([token_id, offer]) => (
                <Card key={offer.owner + "-" + token_id.toString()}>
                  <CardHeader
                    avatar={
                      <Tooltip
                        title={
                          <Box>
                            <Typography>
                              {" "}
                              {"ID : " + token_id.toString()}{" "}
                            </Typography>
                            <Typography>
                              {"Description : " +
                                nftContratTokenMetadataMap.get(
                                  token_id.toString()
                                )?.description}
                            </Typography>
                            <Typography>
                              {"Seller : " + offer.owner}{" "}
                            </Typography>
                          </Box>
                        }
                      >
                        <InfoOutlined />
                      </Tooltip>
                    }
                    title={
                      nftContratTokenMetadataMap.get(token_id.toString())?.name
                    }
                  />
                  <CardMedia
                    sx={{ width: "auto", marginLeft: "33%" }}
                    component="img"
                    height="100px"
                    image={nftContratTokenMetadataMap
                      .get(token_id.toString())
                      ?.thumbnailUri?.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                  />

                  <CardContent>
                    <Box>
                      <Typography variant="body2">
                        {" "}
                        {"Price : " + offer.price.dividedBy(1000000) + " XTZ"}
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
                          setSelectedOfferEntry([token_id, offer]);
                          formik.handleSubmit(values);
                        }}
                      >
                        <Button type="submit" aria-label="add to favorites">
                          <ShoppingCartIcon /> BUY
                        </Button>
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

## Buy some wine!

Now you can see on **Trading** menu the **Wine catalogue** submenu, click on it.

![buy.png](/images/buy.png)

As you are connected with the default administrator you can see your own unique offer on the market

- Disconnect from your user and connect with another account that has enough tez to buy the bottle
- The buyer can see that Alice is selling a bottle
- Buy the bottle by clicking on the **BUY** button
- Once confirmed, the offer is removed from the market
- Click on **Sell bottle** sub menu
- You are now the owner of this bottle, you can resell it at your own price, etc ...

## Conclusion

You created an NFT collection marketplace from the Ligo library, now you can buy and sell NFTs at your own price.
This concludes the NFT training!

In the next lesson, you will see another kind of NFT called **single asset**. Instead of creating _X_ token types, you will be allowed to create only 1 token*id 0, on the other side, you can mint a quantity \_n* of this token.

To continue, let's go to [Part 3](/tutorials/build-an-nft-marketplace/part-3).
