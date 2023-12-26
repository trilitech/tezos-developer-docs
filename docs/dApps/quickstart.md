---
title: dApp quickstart
authors: "Tim McMackin"
last_update:
  date: 26 December 2023
---

This quickstart shows you how to get started with a simple dApp that calls an existing smart contract on the Tezos blockchain.
It uses the [Svelte](https://svelte.dev/) framework and JavaScript, but you can use any JavaScript/TypeScript framework and get similar results.

For the completed web application, see https://github.com/trilitech/tutorial-applications/tree/main/quickstartdapp.

## Prerequisites

To follow this quickstart, you need [Node.JS and NPM](https://nodejs.org/) installed.

You also need a Tezos wallet in a web browser extension, such as the [Temple wallet](https://templewallet.com/), and some test tez to pay transaction fees.
See [Installing and funding a wallet](../developing/wallet-setup).

## Setting up the web application

Run these steps to set up a simple web application:

1. In a terminal window, run these commands to start a Svelte application:

   ```bash
   npm create vite@latest quickstartdapp -- --template svelte
   cd quickstartdapp
   npm install
   ```

1. Install the Tezos-related dependencies:

   ```bash
   npm install @taquito/taquito @taquito/beacon-wallet @airgap/beacon-types
   ```

1. Install the `buffer`, `events`, and `vite-compatible-readable-stream` libraries:

   ```bash
   npm install --save-dev buffer events vite-compatible-readable-stream
   ```

1. Update the `vite.config.js` file to the following code:

   ```javascript
   import { defineConfig, mergeConfig } from "vite";
   import path from "path";
   import { svelte } from "@sveltejs/vite-plugin-svelte";

   export default ({ command }) => {
     const isBuild = command === "build";

     return defineConfig({
       plugins: [svelte()],
         define: {
           global: {}
         },
       build: {
         target: "esnext",
         commonjsOptions: {
           transformMixedEsModules: true
         }
       },
       server: {
         port: 4000
       },
       resolve: {
         alias: {
           "@airgap/beacon-types": path.resolve(
             path.resolve(),
             `./node_modules/@airgap/beacon-types/dist/${
             isBuild ? "esm" : "cjs"
             }/index.js`
           ),
           // polyfills
           "readable-stream": "vite-compatible-readable-stream",
           stream: "vite-compatible-readable-stream"
         }
       }
     });
   };
   ```

1. Update the default HTML file `index.html` to the following code:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" href="/favicon.ico" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <script>
         const global = globalThis;
       </script>
       <script type="module">
         import { Buffer } from "buffer";
         window.Buffer = Buffer;
       </script>
       <title>My quickstart dApp</title>
     </head>
     <body>
       <script type="module" src="/src/main.js"></script>
     </body>
   </html>
   ```

1. Replace the `src/main.js` file with this code:

   ```javascript
   import './app.css'
   import App from './App.svelte'

   const app = new App({
     target: document.body,
   })

   export default app
   ```

1. Replace the default `src/App.svelte` file with this code:

   ```html
   <script>
   </script>

   <main>
   </main>

   <style>
   </style>
   ```

You will add code to connect to the user's wallet in the next section.

## Connecting to the user's wallet

dApps use wallets to interact with user accounts.
You can use the Beacon SDK to connect to wallets and handle transaction approvals, so your application never needs to store account information, passwords, or keys.

Follow these steps to allow wallets to connect to your application:

1. In the `src/App.svelte` file, add these imports to the `<script>` section:

   ```javascript
   import { BeaconWallet } from "@taquito/beacon-wallet";
   import { NetworkType } from "@airgap/beacon-types";
   ```

1. After these imports, create variables to represent the wallet itself and its address:

   ```javascript
   let wallet;
   let address;
   ```

1. Still within the `<script>` section, add this function to connect to the user's wallet:

   ```javascript
   const connectWallet = async () => {
     const newWallet = new BeaconWallet({
       name: "dApp quickstart",
       network: {
        type: NetworkType.GHOSTNET,
      },
     });
     await newWallet.requestPermissions();
     address = await newWallet.getPKH();
     wallet = newWallet;
   };
   ```

1. Add this function to disconnect from the user's wallet:

   ```javascript
   const disconnectWallet = () => {
     wallet.client.clearActiveAccount();
     wallet = undefined;
   };
   ```

1. Update the `main` section to have this code:

   ```html
   <h1>Tezos dApp quickstart</h1>

   <div class="card">
      {#if wallet}
       <p>The address of the connected wallet is {address}.</p>
       <p>
         <button on:click={disconnectWallet}> Disconnect wallet </button>
       </p>
      {:else}
       <button on:click={connectWallet}> Connect wallet </button>
      {/if}
   </div>
   ```

1. Run this command to start the application:

   ```bash
   npm run dev
   ```

1. Open a web browser to http://localhost:4000.

1. Click the "Connect wallet" button and follow the prompts in your wallet to connect to the dApp.

After your wallet connects, the dApp shows your account address, as in this picture:

<img src="/img/dApps/quickstart-connected-wallet.png" alt="The quickstart dApp, showing the account address and the disconnect button" style={{width: 500}} />

Now your dApp can connect to users' Tezos wallets.
In the next section, you will add the ability for a user to send a transaction to Tezos.

## Sending transactions to Tezos

dApps use smart contracts on Tezos as backend logic, to manage tokens, store data, and to handle account information.
This quickstart uses a simple smart contract that stores an integer and lets users increment or decrement it.
Therefore, the dApp needs a number field for the amount to increment or decrement and buttons to send the increment or decrement transaction.

1. Under the disconnect wallet button, add this code to add the number field and buttons:

   ```html
   <p>
     <input type="number" bind:value={number} />
     <button on:click={increment}> Increment counter </button>
     <button on:click={decrement}> Decrement counter </button>
   </p>
   ```

1. In the `<script>` section, add a variable to represent the value of the number field:

   ```javascript
   let number;
   ```

1. Add the address of the contract as a constant:

   ```javascript
   const contractAddress = "KT18ikZ2PYNs4AaMw2jdD911Y2KqT1nsTQE8";
   ```

   This contract is pre-deployed for your use in the quickstart.
   Later you can deploy your own contracts.

1. Add an import for the Taquito SDK, which sends transactions to Tezos, and initialize it:

   ```javascript
   import { TezosToolkit } from "@taquito/taquito";

   const rpcUrl = "https://ghostnet.ecadinfra.com";
   const Tezos = new TezosToolkit(rpcUrl);
   ```

1. Add functions to call the increment and decrement transactions:

   ```javascript
   const increment = async () => {
     Tezos.setWalletProvider(wallet);
     const contract = await Tezos.wallet.at(contractAddress);
     const operation = await contract.methods.increment(number).send();
     const operationHash = await operation.confirmation(2);
     console.log(operationHash);
   }

   const decrement = async () => {
     Tezos.setWalletProvider(wallet);
     const contract = await Tezos.wallet.at(contractAddress);
     const operation = await contract.methods.decrement(number).send();
     const operationHash = await operation.confirmation(2);
     console.log(operationHash);
   }
   ```

   The complete `App.svelte` file looks like this:

   ```javascript
   <script>
     import { BeaconWallet } from "@taquito/beacon-wallet";
     import { NetworkType } from "@airgap/beacon-types";
     import { TezosToolkit } from "@taquito/taquito";

     let wallet;
     let address;
     let number;

     const contractAddress = "KT18ikZ2PYNs4AaMw2jdD911Y2KqT1nsTQE8";

     const connectWallet = async () => {
       const newWallet = new BeaconWallet({
         name: "dApp quickstart",
         network: {
           type: NetworkType.GHOSTNET,
         },
       });
       await newWallet.requestPermissions();
       address = await newWallet.getPKH();
       wallet = newWallet;
     };

     const disconnectWallet = () => {
       wallet.client.clearActiveAccount();
       wallet = undefined;
     };

     const rpcUrl = "https://ghostnet.ecadinfra.com";
     const Tezos = new TezosToolkit(rpcUrl);

     const increment = async () => {
       Tezos.setWalletProvider(wallet);
       const contract = await Tezos.wallet.at(contractAddress);
       const operation = await contract.methods.increment(number).send();
       const operationHash = await operation.confirmation(2);
       console.log(operationHash);
     }

     const decrement = async () => {
       Tezos.setWalletProvider(wallet);
       const contract = await Tezos.wallet.at(contractAddress);
       const operation = await contract.methods.decrement(number).send();
       const operationHash = await operation.confirmation(2);
       console.log(operationHash);
     }
   </script>

   <main>
     <h1>Tezos dApp quickstart</h1>

     <div class="card">
       {#if wallet}
         <p>The address of the connected wallet is {address}.</p>
         <p>
           <button on:click={disconnectWallet}> Disconnect wallet </button>
         </p>
         <p>
           <input type="number" bind:value={number} />
           <button on:click={increment}> Increment counter </button>
           <button on:click={decrement}> Decrement counter </button>
         </p>
       {:else}
         <button on:click={connectWallet}> Connect wallet </button>
       {/if}
     </div>
   </main>

   <style>
   </style>
   ```

Now the application shows a number input field and buttons that either increment or decrement the contract's number by that amount.
Enter a number and click one of the buttons to send a transaction and see your wallet application prompt you to approve the transaction.

<img src="/img/dApps/quickstart-increment-buttons.png" alt="The quickstart dApp, showing the number field and increment and decrement buttons" style={{width: 500}} />

In the next section, you will read the contract's storage to get the current value of the counter.

## Getting a contract's storage

Smart contacts can have persistent storage.
This storage is public, so your application can read the current value of the storage before and after users send transactions to the contract.

1. Add this import to the `App.svelte` file:

   ```javascript
   import { onMount } from "svelte";
   ```

1. Add a variable to represent the current value of the storage:

   ```javascript
   let currentValue;
   ```

1. Add a function that retrieves the current value of the contract storage and updates it on the UI:

   ```javascript
   const updateCounterValue = async () => {
     const contract = await Tezos.wallet.at(contractAddress);
      currentValue = await contract.storage();
   }
   onMount(updateCounterValue);
   ```

1. Add the code `await updateCounterValue();` to the end of the `connectWallet`, `increment`, and `decrement` functions.

1. In the `main` section, above the `{#if wallet}` code, add a text field to show the current value of the storage:

   ```html
   <p>
     Current counter value: {currentValue}
   </p>
   ```

Now when you run the application, it shows the current value of the contract storage:

<img src="/img/dApps/quickstart-connecte-with-counter-value.png" alt="The quickstart dApp, showing the current value of the counter" style={{width: 500}} />

Note that anyone can call this contract, so the storage value may change between your calls.

## Next steps

Now that you have an application that can call a smart contract, you can deploy your own smart contracts to use with your dApps.
See the tutorial [Deploy a smart contract](../tutorials/smart-contract) to learn how to write a smart contract or the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app) to learn more about writing dApps.
