---
title: 'Part 4: Handling multi-asset tokens'
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 22 May 2024
---

Because a wine store can have many bottles of many different types, the appropriate template to use is the multi-asset template.
With this template, you can create as many token types as you need and set a different quantity for each type.

You can continue from your code from part 3 or start from the completed version here: https://github.com/marigold-dev/training-nft-3/tree/main/solution.

If you start from the completed version, run these commands to install dependencies for the web application:

```bash
npm i
cd ./app
yarn install
cd ..
```

## Updating the smart contract

To use the multi-asset template, you must change the code that your smart contract imports from the NFT template to the multi-asset template:

1. In the `nft.jsligo` file, change the first line to this code:

   ```jsligo
    #import "@ligo/fa/lib/fa2/asset/extendable_multi_asset.impl.jsligo" "FA2Impl"
   ```

1. In the storage, change the `offers` value to `map<[address, nat], offer>`.
   The storage type looks like this:

   ```jsligo
    export type Extension = {
      administrators: set<address>,
      offers: map<[address, nat], offer>, //user sells an offer for a token_id
    };
   ```

Now the offers map is indexed on the address of the seller and the ID of the token for sale.

1. Replace the `mint` entrypoint with this code:

   ```jsligo
      @entry
    const mint = (
      [token_id, quantity, name, description, symbol, ipfsUrl]: [
        nat,
        nat,
        bytes,
        bytes,
        bytes,
        bytes
      ],
      s: storage
    ): ret => {
      if (quantity <= (0 as nat)) return failwith("0");
      if (! Set.mem(Tezos.get_sender(), s.extension.administrators)) return failwith(
        "1"
      );
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
          ledger: Big_map.add(
            [Tezos.get_sender(), token_id],
            quantity as nat,
            s.ledger
          ) as FA2Impl.ledger,
          token_metadata: Big_map.add(
            token_id,
            { token_id: token_id, token_info: token_info },
            s.token_metadata
          ),
          operators: Big_map.empty as FA2Impl.operators
        }
      ]
    };

   ```

   This updated mint entrypoint accepts both a token ID and a quantity and mints the specified number of that token.

1. Replace the `sell` entrypoint with this code:

   ```jsligo
      @entry
    const sell = ([token_id, quantity, price]: [nat, nat, nat], s: storage): ret => {
      //check balance of seller
      const sellerBalance =
        FA2Impl.get_for_user([s.ledger, Tezos.get_source(), token_id]);
      if (quantity > sellerBalance) return failwith("2");
      //need to allow the contract itself to be an operator on behalf of the seller
      const newOperators =
        FA2Impl.add_operator(
          [s.operators, Tezos.get_source(), Tezos.get_self_address(), token_id]
        );
      //DECISION CHOICE: if offer already exists, we just override it
      return [
        list([]) as list<operation>,
        {
          ...s,
          extension: {
            ...s.extension,
            offers: Map.add(
              [Tezos.get_source(), token_id],
              { quantity: quantity, price: price },
              s.extension.offers
            )
          },
          operators: newOperators
        }
      ]
    };

   ```

   Like the mint entrypoint, this entrypoint now accepts a token ID and quantity as parameters.

1. Replace the `buy` entrypoint with this code:

   ```jsligo
   @entry
   const buy = ([token_id, quantity, seller]: [nat, nat, address], s: storage): ret => {
   //search for the offer
   return match(Map.find_opt([seller, token_id], s.extension.offers)) {
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
        let ledger =
          FA2Impl.decrease_token_amount_for_user(
            [s.ledger, seller, token_id, quantity]
          );
        ledger
        = FA2Impl.increase_token_amount_for_user(
            [ledger, Tezos.get_source(), token_id, quantity]
          );
        //update new offer
        const newOffer = { ...offer, quantity: abs(offer.quantity - quantity) };
        return [
          list([op]) as list<operation>,
          {
            ...s,
            extension: {
              ...s.extension,
              offers: Map.update(
                [seller, token_id],
                Some(newOffer),
                s.extension.offers
              )
            },
            ledger: ledger
          }
        ]
      }
   }
   };
   ```

1. Update the `nft.storageList.jsligo` with this code:

   ```jsligo
   #import "nft.jsligo" "Contract"

    #import "@ligo/fa/lib/fa2/asset/extendable_multi_asset.impl.jsligo" "FA2Impl"

    const default_storage: Contract.storage = {
        extension: {
            administrators: Set.literal(
                list(["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" as address])
            ) as set<address>,
            offers: Map.empty as map<[address, nat], Contract.offer>
        },
        ledger: Big_map.empty as FA2Impl.ledger,
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
        ) as FA2Impl.TZIP16.metadata,
        token_metadata: Big_map.empty as FA2Impl.TZIP12.tokenMetadata,
        operators: Big_map.empty as FA2Impl.operators,
    };

   ```

1. As in the previous parts, update the administrators to include addresses that you have access to.

1. Compile and deploy the new contract:

   ```bash
   TAQ_LIGO_IMAGE=ligolang/ligo:1.6.0 taq compile nft.jsligo
   taq deploy nft.tz -e "testing"
   ```

## Updating the frontend

Now that the contract handles both token IDs and quantities, you must update the frontend in the same way:

1. Generate the TypeScript classes and start the server:

   ```bash
   taq generate types ./app/src
   cd ./app
   yarn dev
   ```

1. In the file `src/App.tsx`, replace the function `refreshUserContextOnPageReload` with this code:

   ```typescript
   const refreshUserContextOnPageReload = async () => {
     console.log('refreshUserContext');
     //CONTRACT
     try {
       let c = await Tezos.contract.at(nftContractAddress, tzip12);
       console.log('nftContractAddress', nftContractAddress);

       let nftContrat: NftWalletType = await Tezos.wallet.at<NftWalletType>(
         nftContractAddress
       );
       const storage = (await nftContrat.storage()) as Storage;

       const token_metadataBigMapId = (
         storage.token_metadata as unknown as { id: BigNumber }
       ).id.toNumber();

       const token_ids = await api.bigMapsGetKeys(token_metadataBigMapId, {
         micheline: 'Json',
         active: true,
       });
       await Promise.all(
         token_ids.map(async (token_idKey) => {
           const key: string = token_idKey.key;

           let tokenMetadata: TZIP21TokenMetadata = (await c
             .tzip12()
             .getTokenMetadata(Number(key))) as TZIP21TokenMetadata;
           nftContratTokenMetadataMap.set(key, tokenMetadata);
         })
       );
       setNftContratTokenMetadataMap(new Map(nftContratTokenMetadataMap)); //new Map to force refresh
       setNftContrat(nftContrat);
       setStorage(storage);
     } catch (error) {
       console.log('error refreshing nft contract: ', error);
     }

     //USER
     const activeAccount = await wallet.client.getActiveAccount();
     if (activeAccount) {
       setUserAddress(activeAccount.address);
       const balance = await Tezos.tz.getBalance(activeAccount.address);
       setUserBalance(balance.toNumber());
     }

     console.log('refreshUserContext ended.');
   };
   ```

   This function now retrieves all of the tokens in the contract.

1. Replace the content of the `src/MintPage.tsx` file with this code:

   ```typescript
   import {
     AddCircleOutlined,
     Close,
     KeyboardArrowLeft,
     KeyboardArrowRight,
   } from '@mui/icons-material';
   import OpenWithIcon from '@mui/icons-material/OpenWith';
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
   } from '@mui/material';
   import Card from '@mui/material/Card';
   import CardContent from '@mui/material/CardContent';
   import Paper from '@mui/material/Paper';
   import Typography from '@mui/material/Typography';
   import { char2Bytes } from '@taquito/utils';
   import { BigNumber } from 'bignumber.js';
   import { useFormik } from 'formik';
   import { useSnackbar } from 'notistack';
   import React, { useEffect, useState } from 'react';
   import SwipeableViews from 'react-swipeable-views';
   import * as yup from 'yup';
   import { TZIP21TokenMetadata, UserContext, UserContextType } from './App';
   import { TransactionInvalidBeaconError } from './TransactionInvalidBeaconError';
   import { address, bytes, nat } from './type-aliases';

   export default function MintPage() {
     const {
       userAddress,
       nftContrat,
       refreshUserContextOnPageReload,
       nftContratTokenMetadataMap,
       storage,
     } = React.useContext(UserContext) as UserContextType;
     const { enqueueSnackbar } = useSnackbar();
     const [pictureUrl, setPictureUrl] = useState<string>('');
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
       name: yup.string().required('Name is required'),
       description: yup.string().required('Description is required'),
       symbol: yup.string().required('Symbol is required'),
       quantity: yup
         .number()
         .required('Quantity is required')
         .positive('ERROR: The number must be greater than 0!'),
     });

     const formik = useFormik({
       initialValues: {
         name: '',
         description: '',
         token_id: 0,
         symbol: 'WINE',
         quantity: 1,
       } as TZIP21TokenMetadata & { quantity: number },
       validationSchema: validationSchema,
       onSubmit: (values) => {
         mint(values);
       },
     });

     //open mint drawer if admin
     useEffect(() => {
       if (
         storage &&
         storage!.extension.administrators.indexOf(userAddress! as address) < 0
       )
         setFormOpen(false);
       else setFormOpen(true);
     }, [userAddress]);

     useEffect(() => {
       (async () => {
         if (
           nftContratTokenMetadataMap &&
           nftContratTokenMetadataMap.size > 0
         ) {
           formik.setFieldValue('token_id', nftContratTokenMetadataMap.size);
         }
       })();
     }, [nftContratTokenMetadataMap?.size]);

     const mint = async (
       newTokenDefinition: TZIP21TokenMetadata & { quantity: number }
     ) => {
       try {
         //IPFS
         if (file) {
           const formData = new FormData();
           formData.append('file', file);

           const requestHeaders: HeadersInit = new Headers();
           requestHeaders.set(
             'pinata_api_key',
             `${import.meta.env.VITE_PINATA_API_KEY}`
           );
           requestHeaders.set(
             'pinata_secret_api_key',
             `${import.meta.env.VITE_PINATA_API_SECRET}`
           );

           const resFile = await fetch(
             'https://api.pinata.cloud/pinning/pinFileToIPFS',
             {
               method: 'post',
               body: formData,
               headers: requestHeaders,
             }
           );

           const responseJson = await resFile.json();
           console.log('responseJson', responseJson);

           const thumbnailUri = `ipfs://${responseJson.IpfsHash}`;
           setPictureUrl(
             `https://gateway.pinata.cloud/ipfs/${responseJson.IpfsHash}`
           );

           const op = await nftContrat!.methods
             .mint(
               new BigNumber(newTokenDefinition.token_id) as nat,
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
             'Wine collection is minting ... it will be ready on next block, wait for the confirmation message before minting another collection',
             { variant: 'info' }
           );

           await op.confirmation(2);

           enqueueSnackbar('Wine collection minted', { variant: 'success' });

           refreshUserContextOnPageReload(); //force all app to refresh the context
         }
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

     const [formOpen, setFormOpen] = useState<boolean>(false);

     const toggleDrawer =
       (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
         if (
           event.type === 'keydown' &&
           ((event as React.KeyboardEvent).key === 'Tab' ||
             (event as React.KeyboardEvent).key === 'Shift')
         ) {
           return;
         }
         setFormOpen(open);
       };

     const isTablet = useMediaQuery('(min-width:600px)');

     return (
       <Paper>
         {storage ? (
           <Button
             disabled={
               storage.extension.administrators.indexOf(
                 userAddress! as address
               ) < 0
             }
             sx={{
               p: 1,
               position: 'absolute',
               right: '0',
               display: formOpen ? 'none' : 'block',
               zIndex: 1,
             }}
             onClick={toggleDrawer(!formOpen)}
           >
             {' Mint Form ' +
               (storage!.extension.administrators.indexOf(
                 userAddress! as address
               ) < 0
                 ? ' (You are not admin)'
                 : '')}
             <OpenWithIcon />
           </Button>
         ) : (
           ''
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
                 ? { marginTop: '0', marginRight: '0' }
                 : { marginTop: '35px', marginRight: '125px' }
             }
           />
           <Box
             sx={{
               width: isTablet ? '40vw' : '60vw',
               borderColor: 'text.secondary',
               borderStyle: 'solid',
               borderWidth: '1px',

               height: 'calc(100vh - 64px)',
             }}
           >
             <Button
               sx={{
                 position: 'absolute',
                 right: '0',
                 display: !formOpen ? 'none' : 'block',
               }}
               onClick={toggleDrawer(!formOpen)}
             >
               <Close />
             </Button>
             <form onSubmit={formik.handleSubmit}>
               <Stack spacing={2} margin={2} alignContent={'center'}>
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
                   error={
                     formik.touched.symbol && Boolean(formik.errors.symbol)
                   }
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
                   helperText={
                     formik.touched.quantity && formik.errors.quantity
                   }
                   variant="filled"
                 />

                 {pictureUrl ? (
                   <img height={100} width={100} src={pictureUrl} />
                 ) : (
                   ''
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
           <Box sx={{ width: '70vw' }}>
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
                       display: 'block',
                       maxWidth: '80vw',
                       overflow: 'hidden',
                     }}
                     key={token_id.toString()}
                   >
                     <CardHeader
                       titleTypographyProps={
                         isTablet ? { fontSize: '1.5em' } : { fontSize: '1em' }
                       }
                       title={token.name}
                     />

                     <CardMedia
                       sx={
                         isTablet
                           ? {
                               width: 'auto',
                               marginLeft: '33%',
                               maxHeight: '50vh',
                             }
                           : { width: '100%', maxHeight: '40vh' }
                       }
                       component="img"
                       image={token.thumbnailUri?.replace(
                         'ipfs://',
                         'https://gateway.pinata.cloud/ipfs/'
                       )}
                     />

                     <CardContent>
                       <Box>
                         <Typography>{'ID : ' + token_id}</Typography>
                         <Typography>{'Symbol : ' + token.symbol}</Typography>
                         <Typography>
                           {'Description : ' + token.description}
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
                     Array.from(nftContratTokenMetadataMap!.entries()).length -
                       1
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
           <Typography sx={{ py: '2em' }} variant="h4">
             Sorry, there is not NFT yet, you need to mint bottles first
           </Typography>
         )}
       </Paper>
     );
   }
   ```

1. Replace the content of the `src/OffersPage.tsx` file with this code:

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
     quantity: yup
       .number()
       .required('Quantity is required')
       .positive('ERROR: The number must be greater than 0!'),
   });

   type Offer = {
     price: nat;
     quantity: nat;
   };

   export default function OffersPage() {
     api.defaults.baseUrl = 'https://api.ghostnet.tzkt.io';

     const [selectedTokenId, setSelectedTokenId] = React.useState<number>(0);
     const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

     let [offersTokenIDMap, setOffersTokenIDMap] = React.useState<
       Map<number, Offer>
     >(new Map());
     let [ledgerTokenIDMap, setLedgerTokenIDMap] = React.useState<
       Map<number, nat>
     >(new Map());

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
         console.log('onSubmit: (values)', values, selectedTokenId);
         sell(selectedTokenId, values.quantity, values.price);
       },
     });

     const initPage = async () => {
       if (storage) {
         console.log('context is not empty, init page now');
         ledgerTokenIDMap = new Map();
         offersTokenIDMap = new Map();

         const ledgerBigMapId = (
           storage.ledger as unknown as { id: BigNumber }
         ).id.toNumber();

         const owner_token_ids = await api.bigMapsGetKeys(ledgerBigMapId, {
           micheline: 'Json',
           active: true,
         });

         await Promise.all(
           owner_token_ids.map(async (owner_token_idKey) => {
             const key: { address: string; nat: string } =
               owner_token_idKey.key;

             if (key.address === userAddress) {
               const ownerBalance = await storage.ledger.get({
                 0: userAddress as address,
                 1: BigNumber(key.nat) as nat,
               });
               if (ownerBalance.toNumber() !== 0)
                 ledgerTokenIDMap.set(Number(key.nat), ownerBalance);
               const ownerOffers = await storage.extension.offers.get({
                 0: userAddress as address,
                 1: BigNumber(key.nat) as nat,
               });
               if (ownerOffers && ownerOffers.quantity.toNumber() !== 0)
                 offersTokenIDMap.set(Number(key.nat), ownerOffers);

               console.log(
                 'found for ' +
                   key.address +
                   ' on token_id ' +
                   key.nat +
                   ' with balance ' +
                   ownerBalance
               );
             } else {
               console.log('skip to next owner');
             }
           })
         );
         setLedgerTokenIDMap(new Map(ledgerTokenIDMap)); //force refresh
         setOffersTokenIDMap(new Map(offersTokenIDMap)); //force refresh

         console.log('ledgerTokenIDMap', ledgerTokenIDMap);
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

     const sell = async (token_id: number, quantity: number, price: number) => {
       try {
         const op = await nftContrat?.methods
           .sell(
             BigNumber(token_id) as nat,
             BigNumber(quantity) as nat,
             BigNumber(price * 1000000) as nat //to mutez
           )
           .send();

         await op?.confirmation(2);

         enqueueSnackbar(
           'Wine collection (token_id=' +
             token_id +
             ') offer for ' +
             quantity +
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
         {ledgerTokenIDMap && ledgerTokenIDMap.size != 0 ? (
           <Fragment>
             <Pagination
               page={currentPageIndex}
               onChange={(_, value) => setCurrentPageIndex(value)}
               count={Math.ceil(
                 Array.from(ledgerTokenIDMap.entries()).length / itemPerPage
               )}
               showFirstButton
               showLastButton
             />

             <ImageList
               cols={
                 isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1
               }
             >
               {Array.from(ledgerTokenIDMap.entries())
                 .filter((_, index) =>
                   index >= currentPageIndex * itemPerPage - itemPerPage &&
                   index < currentPageIndex * itemPerPage
                     ? true
                     : false
                 )
                 .map(([token_id, balance]) => (
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
                                   nftContratTokenMetadataMap.get(
                                     token_id.toString()
                                   )?.description}
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
                           {'Owned : ' + balance.toNumber()}
                         </Typography>
                         <Typography variant="body2">
                           {offersTokenIDMap.get(token_id)
                             ? 'Traded : ' +
                               offersTokenIDMap.get(token_id)?.quantity +
                               ' (price : ' +
                               offersTokenIDMap
                                 .get(token_id)
                                 ?.price.dividedBy(1000000) +
                               ' Tz/b)'
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
                             setSelectedTokenId(token_id);
                             formik.handleSubmit(values);
                           }}
                         >
                           <span>
                             <TextField
                               type="number"
                               sx={{ width: '40%' }}
                               name="price"
                               label="price/bottle"
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
                             />
                             <TextField
                               sx={{
                                 width: '60%',
                                 bottom: 0,
                                 position: 'relative',
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
                                 formik.touched.quantity &&
                                 formik.errors.quantity
                               }
                               InputProps={{
                                 inputProps: {
                                   min: 0,
                                   max: balance.toNumber(),
                                 },
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

1. Replace the content of the `src/WineCataloguePage.tsx` file with this code:

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
     InputAdornment,
     Pagination,
     TextField,
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

   type OfferEntry = [{ 0: address; 1: nat }, Offer];

   type Offer = {
     price: nat;
     quantity: nat;
   };

   const validationSchema = yup.object({
     quantity: yup
       .number()
       .required('Quantity is required')
       .positive('ERROR: The number must be greater than 0!'),
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
         console.log('onSubmit: (values)', values, selectedOfferEntry);
         buy(values.quantity, selectedOfferEntry!);
       },
     });
     const { enqueueSnackbar } = useSnackbar();
     const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

     const buy = async (quantity: number, selectedOfferEntry: OfferEntry) => {
       try {
         const op = await nftContrat?.methods
           .buy(
             selectedOfferEntry[0][1],
             BigNumber(quantity) as nat,
             selectedOfferEntry[0][0]
           )
           .send({
             amount: quantity * selectedOfferEntry[1].price.toNumber(),
             mutez: true,
           });

         await op?.confirmation(2);

         enqueueSnackbar(
           'Bought ' +
             quantity +
             ' unit of Wine collection (token_id:' +
             selectedOfferEntry[0][1] +
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

         {storage?.extension.offers && storage?.extension.offers.size != 0 ? (
           <Fragment>
             <Pagination
               page={currentPageIndex}
               onChange={(_, value) => setCurrentPageIndex(value)}
               count={Math.ceil(
                 Array.from(storage?.extension.offers.entries()).filter(
                   ([_, offer]) => offer.quantity.isGreaterThan(0)
                 ).length / itemPerPage
               )}
               showFirstButton
               showLastButton
             />
             <ImageList
               cols={
                 isDesktop ? itemPerPage / 2 : isTablet ? itemPerPage / 3 : 1
               }
             >
               {Array.from(storage?.extension.offers.entries())
                 .filter(([_, offer]) => offer.quantity.isGreaterThan(0))
                 .filter((_, index) =>
                   index >= currentPageIndex * itemPerPage - itemPerPage &&
                   index < currentPageIndex * itemPerPage
                     ? true
                     : false
                 )
                 .map(([key, offer]) => (
                   <Card key={key[0] + '-' + key[1].toString()}>
                     <CardHeader
                       avatar={
                         <Tooltip
                           title={
                             <Box>
                               <Typography>
                                 {' '}
                                 {'ID : ' + key[1].toString()}{' '}
                               </Typography>
                               <Typography>
                                 {'Description : ' +
                                   nftContratTokenMetadataMap.get(
                                     key[1].toString()
                                   )?.description}
                               </Typography>
                               <Typography>{'Seller : ' + key[0]} </Typography>
                             </Box>
                           }
                         >
                           <InfoOutlined />
                         </Tooltip>
                       }
                       title={
                         nftContratTokenMetadataMap.get(key[1].toString())?.name
                       }
                     />
                     <CardMedia
                       sx={{ width: 'auto', marginLeft: '33%' }}
                       component="img"
                       height="100px"
                       image={nftContratTokenMetadataMap
                         .get(key[1].toString())
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
                             ' XTZ/bottle'}
                         </Typography>
                         <Typography variant="body2">
                           {'Available units : ' + offer.quantity}
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
                             setSelectedOfferEntry([key, offer]);
                             formik.handleSubmit(values);
                           }}
                         >
                           <TextField
                             type="number"
                             sx={{ bottom: 0, position: 'relative' }}
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
           <Typography sx={{ py: '2em' }} variant="h4">
             Sorry, there is not NFT to buy yet, you need to mint or sell
             bottles first
           </Typography>
         )}
       </Paper>
     );
   }
   ```

## Working with the completed application

Now you can create, buy, and sell bottles of wine as in the applications in the previous parts.
For example, if you connect an administrator account you can create types of wine with quantities and offer them for sale.
Then you can connect a different account and buy bottles from the available different types, as in this picture:

![Buying bottles from the available different types](/img/tutorials/nft-marketplace-4-buy.png)

## Summary

Now you can create token collections from the different templates that are available in the `@ligo/fa` library, including NFTs, single-asset tokens, and multi-asset tokens.
You can create web applications that manage token transactions and show information about tokens.

For the complete content of the contract and web app at the end of the tutorial, see the completed part 4 app at https://github.com/marigold-dev/training-nft-4.

If you want to continue with the application, you can extend the contract or application.
Here are some ideas:

- Create an online marketplace for a different kind of token, like flowers, candy, or cars
- Change how tokens behave, like sending a royalty to the marketplace as a sales fee when they are transferred
- Add error checking for the application to prevent it from sending invalid transactions
- Add new features to the marketplace, such as a shopping cart that lets people buy more than one kind of bottle at a time
