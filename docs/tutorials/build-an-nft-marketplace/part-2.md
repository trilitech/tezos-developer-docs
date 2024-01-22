---
title: 'Part 2: Buying and selling tokens'
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 8 November 2023
---

In this section, you give users the ability to list a bottle for sale and buy bottles that are listed for sale.

You can continue from your code from part 1 or start from the completed version here: https://github.com/marigold-dev/training-nft-1/tree/main/solution.

If you start from the completed version, run these commands to install dependencies for the web application:

```bash
npm i
cd ./app
yarn install
cd ..
```

## Updating the smart contract

To allow users to buy and sell tokens, the contract must have entrypoints that allow users to offer a token for sale and to buy a token that is offered for sale.
The contract storage must store the tokens that are offered for sale and their prices.

1. Update the contract storage to store the tokens that are offered for sale:

   1. In the `nft.jsligo` file, before the definition of the `storage` type, add a type that represents a token that is offered for sale:

      ```ligolang
      export type offer = {
        owner : address,
        price : nat
      };
      ```

   1. Add a map named `offers` that maps token IDs to their offer prices to the `storage` type.
      Now the `storage` type looks like this:

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

   1. In the `nft.storageList.jsligo` file, add an empty map for the offers by adding this code:

      ```ligolang
      offers: Map.empty as map<nat, Contract.offer>,
      ```

      Now the `nft.storageList.jsligo` file looks like this:

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

1. As you did in the previous step, make sure that the administrators in the `nft.storageList.jsligo` file includes an address that you can use to mint tokens.

1. In the `nft.jsligo` file, add a `sell` entrypoint that creates an offer for a token that the sender owns:

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
       FA2Impl.NFT.add_operator(
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

   This function accepts the ID of the token and the selling price as parameters.
   It verifies that the transaction sender owns the token.
   Then it adds the contract itself as an operator of the token, which allows it to transfer the token without getting permission from the seller later.
   Finally, it adds the offer and updated operators to the storage.

1. Add a `buy` entrypoint:

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
             FA2Impl.NFT.transfer_token_from_user_to_user(
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

   This entrypoint accepts the token ID and seller as parameters.
   It retrieves the offer from storage and verifies that the transaction sender sent enough tez to satisfy the offer price.
   Then it transfers the token to the buyer, transfers the sale price to the seller, and removes the offer from storage.

1. Compile and deploy the new contract:

   ```bash
   TAQ_LIGO_IMAGE=ligolang/ligo:1.1.0 taq compile nft.jsligo
   taq deploy nft.tz -e "testing"
   ```

## Adding a selling page to the web application

1. Stop the web application if it is running.

1. Generate the TypeScript classes and start the server:

   ```bash
   taq generate types ./app/src
   cd ./app
   yarn dev
   ```

1. Open the sale page in the `./src/OffersPage.tsx` file and replace it with this code:

   ```typescript
   import { InfoOutlined } from '@mui/icons-material';
   import SellIcon from '@mui/icons-material/Sell';

   import * as api from '@tzkt/sdk-api';

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
   } from '@mui/material';
   import Paper from '@mui/material/Paper';
   import BigNumber from 'bignumber.js';
   import { useFormik } from 'formik';
   import { useSnackbar } from 'notistack';
   import React, { Fragment, useEffect, useState } from 'react';
   import * as yup from 'yup';
   import { UserContext, UserContextType } from './App';
   import ConnectButton from './ConnectWallet';
   import { TransactionInvalidBeaconError } from './TransactionInvalidBeaconError';
   import { address, nat } from './type-aliases';

   const itemPerPage: number = 6;

   const validationSchema = yup.object({
     price: yup
       .number()
       .required('Price is required')
       .positive('ERROR: The number must be greater than 0!'),
   });

   type Offer = {
     owner: address;
     price: nat;
   };

   export default function OffersPage() {
     api.defaults.baseUrl = 'https://api.ghostnet.tzkt.io';

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
         console.log('onSubmit: (values)', values, selectedTokenId);
         sell(selectedTokenId, values.price);
       },
     });

     const initPage = async () => {
       if (storage) {
         console.log('context is not empty, init page now');
         ownerTokenIds = new Set();
         offersTokenIDMap = new Map();

         const token_metadataBigMapId = (
           storage.token_metadata as unknown as { id: BigNumber }
         ).id.toNumber();

         const token_ids = await api.bigMapsGetKeys(token_metadataBigMapId, {
           micheline: 'Json',
           active: true,
         });

         await Promise.all(
           token_ids.map(async (token_idKey) => {
             const token_idNat = new BigNumber(token_idKey.key) as nat;

             let owner = await storage.ledger.get(token_idNat);
             if (owner === userAddress) {
               ownerTokenIds.add(token_idKey.key);

               const ownerOffers = await storage.offers.get(token_idNat);
               if (ownerOffers)
                 offersTokenIDMap.set(token_idKey.key, ownerOffers);

               console.log(
                 'found for ' +
                   owner +
                   ' on token_id ' +
                   token_idKey.key +
                   ' with balance ' +
                   1
               );
             } else {
               console.log('skip to next token id');
             }
           })
         );
         setOwnerTokenIds(new Set(ownerTokenIds)); //force refresh
         setOffersTokenIDMap(new Map(offersTokenIDMap)); //force refresh
       } else {
         console.log('context is empty, wait for parent and retry ...');
       }
     };

     useEffect(() => {
       (async () => {
         console.log('after a storage changed');
         await initPage();
       })();
     }, [storage]);

     useEffect(() => {
       (async () => {
         console.log('on Page init');
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
           'Wine collection (token_id=' +
             token_id +
             ') offer for ' +
             1 +
             ' units at price of ' +
             price +
             ' XTZ',
           { variant: 'success' }
         );

         refreshUserContextOnPageReload(); //force all app to refresh the context
       } catch (error) {
         console.table(`Error: ${JSON.stringify(error, null, 2)}`);
         let tibe: TransactionInvalidBeaconError =
           new TransactionInvalidBeaconError(error);
         enqueueSnackbar(tibe.data_message, {
           variant: 'error',
           autoHideDuration: 10000,
         });
       }
     };

     const isDesktop = useMediaQuery('(min-width:1100px)');
     const isTablet = useMediaQuery('(min-width:600px)');

     return (
       <Paper>
         <Typography style={{ paddingBottom: '10px' }} variant="h5">
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
               cols={
                 isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1
               }
             >
               {Array.from(ownerTokenIds.entries())
                 .filter((_, index) =>
                   index >= currentPageIndex * itemPerPage - itemPerPage &&
                   index < currentPageIndex * itemPerPage
                     ? true
                     : false
                 )
                 .map(([token_id]) => (
                   <Card key={token_id + '-' + token_id.toString()}>
                     <CardHeader
                       avatar={
                         <Tooltip
                           title={
                             <Box>
                               <Typography>
                                 {' '}
                                 {'ID : ' + token_id.toString()}{' '}
                               </Typography>
                               <Typography>
                                 {'Description : ' +
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
                       sx={{ width: 'auto', marginLeft: '33%' }}
                       component="img"
                       height="100px"
                       image={nftContratTokenMetadataMap
                         .get(token_id)
                         ?.thumbnailUri?.replace(
                           'ipfs://',
                           'https://gateway.pinata.cloud/ipfs/'
                         )}
                     />

                     <CardContent>
                       <Box>
                         <Typography variant="body2">
                           {offersTokenIDMap.get(token_id)
                             ? 'Traded : ' +
                               1 +
                               ' (price : ' +
                               offersTokenIDMap
                                 .get(token_id)
                                 ?.price.dividedBy(1000000) +
                               ' Tz)'
                             : ''}
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
                           style={{ width: '100%' }}
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
                 ))}{' '}
             </ImageList>
           </Fragment>
         ) : (
           <Typography sx={{ py: '2em' }} variant="h4">
             Sorry, you don't own any bottles, buy or mint some first
           </Typography>
         )}
       </Paper>
     );
   }
   ```

   This page shows the bottles that the connected account owns and allows the user to select bottles for sale.
   When the user selects bottles and adds a sale price, the page calls the `sell` entrypoint with this code:

   ```typescript
   nftContrat?.methods
     .sell(BigNumber(token_id) as nat, BigNumber(price * 1000000) as nat)
     .send();
   ```

   This code multiplies the price by 1,000,000 because the UI shows prices in tez but the contract records prices in mutez.
   Then the contract creates an offer for the selected token.

1. As you did in the previous part, connect an administrator's wallet to the application and create at least one NFT.
   The new contract that you deployed in this section has no NFTs to start with.

1. Offer a bottle for sale:

   1. Open the application and click **Trading > Sell bottles**.
      The sale page opens and shows the bottles that you own, as in this picture:

      ![The Sell bottles page, showing the bottles that you can offer for sale](/img/tutorials/nft-marketplace-2-sell.png)

   1. Set the price for a bottle and then click **Sell**.

   1. Approve the transaction in your wallet and wait for the page to refresh.

   When the page refreshes, the bottle updates to show "Traded" and the offer price, as in this picture:

   ![The bottle marked available for sale](/img/tutorials/nft-markeplace-2-traded-bottle.png)

## Add a catalog and sales page

In this section, you add a catalog page to show the bottles that are on sale and allow users to buy them.

1. Open the file `./src/WineCataloguePage.tsx` and replace it with this code:

   ```typescript
   import { InfoOutlined } from '@mui/icons-material';
   import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
   } from '@mui/material';
   import Paper from '@mui/material/Paper';
   import Typography from '@mui/material/Typography';

   import BigNumber from 'bignumber.js';
   import { useFormik } from 'formik';
   import { useSnackbar } from 'notistack';
   import React, { Fragment, useState } from 'react';
   import * as yup from 'yup';
   import { UserContext, UserContextType } from './App';
   import ConnectButton from './ConnectWallet';
   import { TransactionInvalidBeaconError } from './TransactionInvalidBeaconError';
   import { address, nat } from './type-aliases';

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
         console.log('onSubmit: (values)', values, selectedOfferEntry);
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
           'Bought ' +
             1 +
             ' unit of Wine collection (token_id:' +
             selectedOfferEntry[0] +
             ')',
           {
             variant: 'success',
           }
         );

         refreshUserContextOnPageReload(); //force all app to refresh the context
       } catch (error) {
         console.table(`Error: ${JSON.stringify(error, null, 2)}`);
         let tibe: TransactionInvalidBeaconError =
           new TransactionInvalidBeaconError(error);
         enqueueSnackbar(tibe.data_message, {
           variant: 'error',
           autoHideDuration: 10000,
         });
       }
     };
     const isDesktop = useMediaQuery('(min-width:1100px)');
     const isTablet = useMediaQuery('(min-width:600px)');
     return (
       <Paper>
         <Typography style={{ paddingBottom: '10px' }} variant="h5">
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
               cols={
                 isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1
               }
             >
               {Array.from(storage?.offers.entries())

                 .filter((_, index) =>
                   index >= currentPageIndex * itemPerPage - itemPerPage &&
                   index < currentPageIndex * itemPerPage
                     ? true
                     : false
                 )
                 .map(([token_id, offer]) => (
                   <Card key={offer.owner + '-' + token_id.toString()}>
                     <CardHeader
                       avatar={
                         <Tooltip
                           title={
                             <Box>
                               <Typography>
                                 {' '}
                                 {'ID : ' + token_id.toString()}{' '}
                               </Typography>
                               <Typography>
                                 {'Description : ' +
                                   nftContratTokenMetadataMap.get(
                                     token_id.toString()
                                   )?.description}
                               </Typography>
                               <Typography>
                                 {'Seller : ' + offer.owner}{' '}
                               </Typography>
                             </Box>
                           }
                         >
                           <InfoOutlined />
                         </Tooltip>
                       }
                       title={
                         nftContratTokenMetadataMap.get(token_id.toString())
                           ?.name
                       }
                     />
                     <CardMedia
                       sx={{ width: 'auto', marginLeft: '33%' }}
                       component="img"
                       height="100px"
                       image={nftContratTokenMetadataMap
                         .get(token_id.toString())
                         ?.thumbnailUri?.replace(
                           'ipfs://',
                           'https://gateway.pinata.cloud/ipfs/'
                         )}
                     />

                     <CardContent>
                       <Box>
                         <Typography variant="body2">
                           {' '}
                           {'Price : ' +
                             offer.price.dividedBy(1000000) +
                             ' XTZ'}
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
                           style={{ width: '100%' }}
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
           <Typography sx={{ py: '2em' }} variant="h4">
             Sorry, there is not NFT to buy yet, you need to mint or sell
             bottles first
           </Typography>
         )}
       </Paper>
     );
   }
   ```

1. Disconnect your administrator account from the application and connect with a different account that has enough tez to buy a bottle.

1. In the web application, click **Trading > Wine catalogue**.
   The page looks like this:

   ![The catalog page, showing one bottle for sale](/img/tutorials/nft-marketplace-2-buy.png)

1. Buy a bottle by clicking **Buy** and confirming the transaction in your wallet.

1. When the transaction completes, click **Trading > Sell bottles** and see that you own the bottle and that you can offer it for sale.

## Summary

Now you and other users can buy and sell NFTs from the marketplace dApp.

In the next part, you create a different type of token, called a single-asset token.
Instead of creating multiple token types with a quantity of exactly 1 as with the NFTs in this part, you create a single token type with any quantity you want.

For the complete content of the contract and web app at the end of this part, see the completed part 2 app at https://github.com/marigold-dev/training-nft-2.

To continue, go to [Part 3: Managing tokens with quantities](./part-3).
