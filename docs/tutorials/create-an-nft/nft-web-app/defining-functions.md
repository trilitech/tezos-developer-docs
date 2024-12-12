---
title: "Part 2: Accessing wallets and minting NFTs"
authors: 'Yuxin Li'
last_update:
  date: 11 December 2024
---

Accessing the user's wallet is essential before your application can engage with the Tezos blockchain. It enables your app to view the tokens within the wallet and request the user to initiate transactions. However, it's important to note that accessing the wallet doesn't grant your app direct control over it.

## Connecting to the user's wallet

In this section, you add code to connect to the user's wallet with the `TezosToolkit` and `BeaconWallet` objects.

IMPORTANT: however you design your app, it is essential to use a single instance of the `BeaconWallet` object.
It is also highly recommended use a single instance of the `TezosToolkit` object.
Creating multiple instances can cause problems in your app and with Taquito in general.

1. Open the file named `src/App.svelte` and add the following code in the `<script lang="ts">` section after we initialize and set up the Ghostnet endpoint:

   ```javascript
   <script lang="ts">

   let wallet;
   let address;
   let balance;
   let statusMessage = "Mint an NFT";
   let buttonActive = false;

   const connectWallet = async () => {
     try {
       const newWallet = new BeaconWallet({
         name: "Simple NFT app tutorial",
         network: {
          type: NetworkType.GHOSTNET,
        },
       });
       await newWallet.requestPermissions();
       address = await newWallet.getPKH();
       const balanceMutez = await Tezos.tz.getBalance(address);
       balance = balanceMutez.div(1000000).toFormat(2);
       buttonActive = true;
       wallet = newWallet;
     } catch (error) {
       console.error("Error connecting wallet:", error);
     }
   };
   </script>
   ```

   The `connectWallet` function creates a `BeaconWallet` object that represents the user's wallet.
   It provides a name for the app, which appears in the wallet UI when it asks the user to allow the connection.
   It also includes the network to use, such as the Tezos main network or test network.

1. Add the following code in `<script lang="ts">` to disconnect the wallet:

   ```javascript
   const disconnectWallet = () => {
     wallet.client.clearActiveAccount();
     wallet = undefined;
     buttonActive = false;
   };
   ```

   The `disconnectWallet` function runs these steps to disconnect the wallet and reset the state of the app:

   1. It closes the connection to the Beacon SDK with the `wallet.client.clearActiveAccount()` command.
   1. It nullifies the wallet reference by setting `wallet` to `undefined`.
   1. It deactivates the associated button or functionality by setting the `buttonActive` flag to false.

1. Add this code inside `<main>`, which creates a button that the user can click to connect or disconnect their wallet:

   ```html
   <main>
     <h1>Simple NFT dApp</h1>

     <div class="card">
       {#if wallet}
         <p>The address of the connected wallet is {address}.</p>
         <p>Its balance in tez is {balance}.</p>
         <button on:click={disconnectWallet}> Disconnect wallet </button>
         <button on:click={requestNFT}>{statusMessage}</button>
       {:else}
         <button on:click={connectWallet}> Connect wallet </button>
       {/if}
     </div>
   </main>
   ```

   Now you have functions that allow your application to connect and disconnect wallets.

## Design considerations

Interacting with a wallet in a decentralized application is a new paradigm for many developers and users.
Follow these practices to make the process easier for users:

- Let users manually connect their wallets instead of prompting users to connect their wallet immediately when the app loads.
Getting a wallet pop-up window before the user can see the page is annoying.
Also, users may hesitate to connect a wallet before they have had time to look at and trust the application, even though connecting the wallet is harmless.

- Provide a prominent button to connect or disconnect wallets.

- Put the button in a predictable position, typically at the top right or left corner of the interface.

- Use **Connect** as the label for the button.
Avoid words like "sync" because they can have different meanings in dApps.

- Display the status of the wallet clearly in the UI.
You can also add information about the wallet, including token balances and the connected network for the user's convenience, as this tutorial application does.
Showing information about the tokens and updating it after transactions allows the user to verify that the application is working properly.

- Enable and disable functions of the application based on the status of the wallet connection.
For example, if the wallet is not connected, disable buttons for transactions that require a wallet connection.

## Minting NFTs

1. Still in `App.svelte`, add the following code to the` <script lang="ts">` section to initialize a deployed contract address. This contract has multiple entrypoints that allow us to interact with the Tezos blockchain, such as `mint`.

   ```javascript
   const nftContractAddress = "KT1Lr8m7HgfY5UF6nXDDcXDxDgEmKyMeds1b";
   ```
1. Add this code to build the function structure
   ```javascript
   const requestNFT = async () => {
   }
   ```
1. Add the following code inside the `requestNFT` function to set up button state:

   ```javascript
   if (!buttonActive) {
     return;
   }
   buttonActive = false;
   statusMessage = "Minting NFT...";
   ```
   This asynchronous function, requestNFT, checks if a button (likely associated with minting an NFT) is active, and if so, it deactivates the button and sets a status message indicating that the NFT minting process has begun.

1. Add the following code inside the `requestNFT` function to define the metadata for a specific NFT:

   ```javascript
   const metadata = new MichelsonMap();
   metadata.set("name", stringToBytes("My Token")); // replace with your metadata

   const mintItem = {
     to_: address,
     metadata: metadata,
   };
   ```
   Metadata for NFTs provides detailed information about the token, describing its unique attributes. This context helps in distinguishing each NFT. In this case the token has only a name, but you can add other fields.

   In the provided code, a new MichelsonMap instance is initialized to handle Tezos's native map data type, a structure used to store key-value pairs where each key is unique. The MichelsonMap utility allows for easier interaction with Tezos's smart contract language, Michelson.

1. Add the following code inside the `requestNFT` function to access the wallet and mint an NFT.

   ```javascript
   try {
     Tezos.setWalletProvider(wallet);

     console.log("getting contract");
     const nftContract = await Tezos.wallet.at(nftContractAddress);

     console.log("minting");
     const op = await nftContract.methodsObject.mint([mintItem]).send();

     console.log(`Waiting for ${op.opHash} to be confirmed...`);
     const hash = await op.confirmation(2).then(() => op.opHash);
     console.log(`Operation injected: https://ghost.tzstats.com/${hash}`);
   } catch (error) {
     console.error("Error minting NFT:", error);
   } finally {
     statusMessage = "Mint another NFT";
     buttonActive = true;
   }
   ```
   Taquito can fetch the user's tez balance from the connected wallet.
   To get the tez balances, the app uses the [Beacon SDK](/../dApps/wallets).
   The `mint` function takes two parameters: a metadata for the NFT and the user's wallet address.

You'll start the app and mint NFTs with your dApp in the next section!
