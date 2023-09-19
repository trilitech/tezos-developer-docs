---
id: setting-up-app
title: "Part 1: Setting up the application"
authors: 'Claude Barde, Tim McMackin'
lastUpdated: 8th September 2023
---

You can access Tezos through any JavaScript framework.
This tutorial uses the Svelte framework, and the following steps show you how to start a Svelte application and add the Tezos-related dependencies.
If you are familiar with Svelte, note that this application includes its own Svelte SPA, so it does not require SvelteKit.

## Setting up the app

1. Run these commands to install Svelte with TypeScript and Vite:

   ```bash
   npm create vite@latest lb-dex -- --template svelte-ts
   cd lb-dex
   npm install
   ```

1. Install Sass and the Tezos-related dependencies:

   ```bash
   npm install --save-dev sass
   npm install @taquito/taquito @taquito/beacon-wallet
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
           "@airgap/beacon-sdk": path.resolve(
             path.resolve(),
             `./node_modules/@airgap/beacon-sdk/dist/${
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

   This updated file includes these changes to the default Vite configuration:

   - It sets the `global` object to `{}` so the application can provide the value for this object in the HTML file
   - It includes the a path to the Beacon SDK
   - It provides polyfills for `readable-stream` and `stream`

1. Update the default HTML file, `index.html`, to the following code:

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
       <title>Liquidity Baking DEX</title>
     </head>
     <body>
       <script type="module" src="/src/main.ts"></script>
     </body>
   </html>
   ```

   This updated file sets the `global` variable to `globalThis` and adds a buffer object to the window.
   The Beacon SDK requires this configuration to run in a Vite app.

## File structure

The final structure of the tutorial application will look like this:

```
- src
  - assets
    - svelte.png
  - lib
    - AddLiquidityView.svelte
    - Interface.svelte
    - RemoveLiquidity.svelte
    - Sidebar.svelte
    - SirsStats.svelte
    - SwapView.svelte
    - Toast.svelte
    - UserInput.svelte
    - UserStats.svelte
    - Wallet.svelte
  - styles
    - index.scss
    - settings.scss
  - App.svelte
  - config.ts
  - lbUtils.ts
  - main.ts
  - store.ts
  - types.ts
  - utils.ts
- index.html
- svelte.config.js
- tsconfig.json
- vite.config.js
```

Here are descriptions for each of these files:

- **assets** -> Contains the favicon and other static files such as images for the application
- **lib** -> Contains the components that make up the app interface:
  - `SwapView.svelte`: The interface to swap XTZ and tzBTC tokens
  - `AddLiquidityView.svelte`: The interface to add liquidity to the LB DEX
  - `RemoveLiquidity.svelte`: The interface to remove liquidity from the LB DEX
  - `Interface.svelte`: The higher-order component that contains the different views to interact with the LB DEX
  - `Sidebar.svelte`: The component that navigates between the different interfaces and that hosts the button to connect or disconnect the wallet
  - `SirsStats.svelte`: The component to display the amount of XTZ, tzBTC, and SIRS present in the LB contract
  - `Toast.svelte`: A simple component to display the progress of the transactions and other messages
  - `UserInput.svelte`: A utility component to make it easier to interact with input fields
  - `UserStats.svelte`: The component to display the user's balance in XTZ, tzBTC, and SIRS
  - `Wallet.svelte`: The component that manages wallet interactions
- **styles** -> Contains the Sass files to style different elements of our interface
- **App.svelte** -> The entrypoint of the application, which contains the components that are bundled into the final application
- **config.ts** -> Constants for the application
- **lbUtils.ts** -> Methods to calculate values needed to interact with the LB contract, such as calculating the amount of output tokens
- **main.ts** -> Where the JavaScript for the app is bundled before being injected into the HTML file
- **store.ts** -> A file with a [Svelte store](https://svelte.dev/tutorial/writable-stores) to handle the app state
- **types.ts** -> Custom TypeScript types
- **utils.ts** -> Utility methods

## Setting up the style sheets

Svelte uses Sass, which allows you to create powerful and simple CSS style sheets.
These steps set up the style sheets for the application:

1. Create a file in the `src/styles` folder (creating the folder if necessary) named `index.scss` and paste in this code:

   ```css
   @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");
   @import "./settings.scss";

   html,
   body {
     height: 100%;
     width: 100%;
     padding: 0px;
     margin: 0px;
     font-family: "Montserrat", sans-serif;
     font-size: $font-size;
     background-color: $honeydew;
     color: $prussian-blue;
   }

   button {
     cursor: pointer;
     padding: calc(#{$padding} / 2);
     outline: none;
     transition: 0.3s;
     display: flex;
     justify-content: center;
     align-items: center;
     gap: 10px;

     &.primary {
       border: solid 2px $celadon-blue;
       border-radius: 5px;
       background-color: $celadon-blue;
       color: white;
       font-family: inherit;
       font-size: 0.9rem;

       &:hover {
         transform: translateY(-2px);
       }

       &:disabled {
         text-decoration: line-through;
       }
     }

     &.wallet-button {
       align-items: center;
       appearance: none;
       background-color: #fcfcfd;
       border-radius: 4px;
       border-width: 0;
       box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
         rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
       box-sizing: border-box;
       color: inherit;
       cursor: pointer;
       display: inline-flex;
       justify-content: center;
       height: 48px;
       line-height: 1;
       list-style: none;
       overflow: hidden;
       padding: 0px 16px;
       position: relative;
       text-align: center;
       text-decoration: none;
       transition: box-shadow 0.15s, transform 0.15s;
       user-select: none;
       -webkit-user-select: none;
       touch-action: manipulation;
       white-space: nowrap;
       will-change: box-shadow, transform;
       font-size: inherit;

       &:focus {
         box-shadow: #d6d6e7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
           rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
       }

       &:hover {
         box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
           rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
         transform: translateY(-2px);
       }

       &:active {
         box-shadow: #d6d6e7 0 3px 7px inset;
         transform: translateY(2px);
       }
     }

     &.sidebar-button {
       background-color: transparent;
       border: solid 3px transparent;
       font-size: inherit;
       font-family: inherit;
       color: inherit;
       margin: 10px;
       border-radius: 4px;

       &:hover {
         background-color: $powder-blue;
       }

       &.active {
         border-color: $powder-blue;
       }
     }

     &.transparent {
       background-color: transparent;
       border: none;
       padding: 0px;
       margin: 0px;
       color: inherit;
     }

     &:disabled {
       cursor: not-allowed;

       &:hover {
         transform: translateY(0px);
       }
     }
   }

   h1 {
     font-size: 2rem;
     font-weight: bold;
     margin: 0px;
     margin-bottom: $padding;
   }

   .input-with-logo {
     img {
       height: 32px;
       width: 32px;
     }
     input {
       height: 28px;
       padding: 5px 10px;
       border: solid 2px transparent;
       border-radius: $std-border-radius;
       outline: none;
       background-color: darken($honeydew, 8);
       transition: 0.3s;
       font-size: inherit;
       color: inherit;

       &:focus {
         border-color: $powder-blue;
       }

       &.error {
         border-color: $imperial-red;
       }
     }

     .input-with-logo__input {
       display: flex;
       justify-content: center;
       align-items: center;
       gap: 10px;
       padding: 5px 0px;
     }

     .input-with-logo__max {
       font-size: 0.8rem;
       color: inherit;
     }
     &.left-logo .input-with-logo__max {
       float: left;
       padding-left: 10px;
     }
     &.right-logo .input-with-logo__max {
       float: right;
       padding-right: 10px;
     }
   }

   .container {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 20px;
     border: solid 3px darken($powder-blue, 10);
     border-radius: $std-border-radius;
     padding: calc(#{$padding} * 3);
     margin: 20px;
     background-color: $powder-blue;
   }

   @media screen and (max-height: 700px) {
     .container {
       padding: 15px;
     }
   }

   .spinner {
     display: inline-block;
     position: relative;
     width: $font-size;
     height: $font-size;
   }
   .spinner div {
     box-sizing: border-box;
     display: block;
     position: absolute;
     width: $font-size;
     height: $font-size;
     border: 2px solid #fff;
     border-radius: 50%;
     animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
     border-color: #fff transparent transparent transparent;
   }
   .spinner div:nth-child(1) {
     animation-delay: -0.45s;
   }
   .spinner div:nth-child(2) {
     animation-delay: -0.3s;
   }
   .spinner div:nth-child(3) {
     animation-delay: -0.15s;
   }
   @keyframes spinner {
     0% {
       transform: rotate(0deg);
     }
     100% {
       transform: rotate(360deg);
     }
   }
   ```

1. Create a file in the `src/styles` folder named `settings.scss` and paste in this code:

   ```css
   /* Color palette: https://coolors.co/palette/e63946-f1faee-a8dadc-457b9d-1d3557 */

   $imperial-red: rgba(230, 57, 70, 1);
   $honeydew: rgba(241, 250, 238, 1);
   $powder-blue: rgba(168, 218, 220, 1);
   $celadon-blue: rgba(69, 123, 157, 1);
   $prussian-blue: rgba(29, 53, 87, 1);

   $font-size: 18px;
   $padding: 20px;
   $std-border-radius: 10px;
   ```

1. In the `src/main.ts` file, import the style sheets by replacing the default code of the file with this code:

   ```typescript
   import App from './App.svelte'
   import "./styles/index.scss";

   const app = new App({
     target: document.body
   })

   export default app
   ```

   This code targets the `body` tag to inject the HTML produced by JavaScript instead of a `div` tag inside the `body` tag as Svelte apps do by default.
   Your applications can target any tag on the page.

## Configuring Svelte

Svelte files include several different types of code in a single file.
The files you will create have separate sections for TypeScript, Sass, and HTML code, as in this example:

```html
<script lang="ts">
  // Your TypeScript code
</script>

<style lang="scss">
  /* Your Sass code */
</style>

<main>
  <!-- Your HTML code -->
</main>
```

Svelte components are fully contained, which means that the style and JS/TS code that you apply inside a component doesn't leak into the other components of your app.
Styles and scripts that are shared among components typically go in the `src/styles` and `scripts` or `src/scripts` folders.

Follow these steps to set up the `src/App.svelte` file, which is the container for the other Svelte components:

1. In the `App.svelte` file, replace the default `<main>` section with this code:

   ```html
   <main>
     <Toast />
     {#if $store.Tezos && $store.dexInfo}
       <Sidebar />
       <Interface />
     {:else}
       <div>Loading</div>
     {/if}
   </main>
   ```

   The interface will change after different elements are available to the app, mostly, the data about the liquidity pools from the liquidity baking contract.

1. Replace the default `<style>` section with this code:

   ```scss
   @import "./styles/settings.scss";

   main {
     display: grid;
     grid-template-columns: 250px 1fr;
     gap: $padding;
     padding: $padding;
     height: calc(100% - (#{$padding} * 2));
   }

   @media screen and (max-height: 700px) {
     main {
     padding: 0px;
     height: 100%;
     }
   }
   ```

1. Remove the default TypeScript section and replace it with this code, which imports the libraries and components that the app uses:

   ```html
   <script lang="ts">
    import { onMount } from "svelte";
    import { TezosToolkit } from "@taquito/taquito";
    import store from "./store";
    import { rpcUrl, dexAddress } from "./config";
    import Sidebar from "./lib/Sidebar.svelte";
    import Interface from "./lib/Interface.svelte";
    import Toast from "./lib/Toast.svelte";
    import type { Storage } from "./types";
    import { fetchExchangeRates } from "./utils";
   </script>
   ```

   You will add these imported files later, so your IDE may show errors for them now.
   The imports include these elements:

   - `onMount`: A method exported by Svelte that runs code when the component mounts
   - `TezosToolkit`: The class that gives you access to all the features of Taquito
   - `store`: A Svelte feature that manages the state of the app
   - `rpcUrl` and `dexAddress`: The URL of the Tezos RPC node and the address of the LB contract
   - `Storage`: A custom type that represents the signature type of the LB DEX storage
   - `fetchExchangeRates`: A function that fetches the exchange rates of XTZ and tzBTC

1. In the `<script lang="ts">` section, add this code to set up the state of the app when it mounts, or loads:

   ```typescript
   onMount(async () => {
       const Tezos = new TezosToolkit(rpcUrl);
       store.updateTezos(Tezos);
       const contract = await Tezos.wallet.at(dexAddress);
       const storage: Storage | undefined = await contract.storage();

       if (storage) {
         store.updateDexInfo({ ...storage });
       }

       // fetches XTZ and tzBTC prices
       const res = await fetchExchangeRates();
       if (res) {
         store.updateExchangeRates([
           { token: "XTZ", exchangeRate: res.xtzPrice },
           { token: "tzBTC", exchangeRate: res.tzbtcPrice }
         ]);
       } else {
         store.updateExchangeRates([
           { token: "XTZ", exchangeRate: null },
           { token: "tzBTC", exchangeRate: null }
         ]);
       }
     });
   ```

   This code creates an instance of the `TezosToolkit` object, which provides access to the Tezos chain itself.
   Then the code saves the object in the Svelte store for other components to use.
   This way, your entire application can use a single instance of the Tezos toolkit with a consistent configuration.

   Then the code creates a `contract` object to represent the LB contract and a `storage` object to represent the contract's persistent storage.
   Finally, it retrieves the exchange rates for XTZ and tzBTC and stores them using the code you create in the next step.

   Don't worry about errors about missing imports in this file, because you will add those imports later.

1. Create a file named `src/utils.ts` and add the following function to retrieve the exchange rates:

   ```typescript
   export const fetchExchangeRates = async (): Promise<{
     tzbtcPrice: number;
     xtzPrice: number;
   } | null> => {
     const query = `
         query {
           overview { xtzUsdQuote },
           token(id: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn") { price }
         }
       `;
     const res = await fetch(`https://analytics-api.quipuswap.com/graphql`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         query
       })
     });
     if (res.status === 200) {
       const resData = await res.json();
       let xtzPrice = resData?.data?.overview?.xtzUsdQuote;
       let tzbtcPrice = resData?.data?.token?.price;
       // validates the 2 values
       if (xtzPrice && tzbtcPrice) {
         xtzPrice = +xtzPrice;
         tzbtcPrice = +tzbtcPrice;
         if (!isNaN(xtzPrice) && !isNaN(tzbtcPrice)) {
           // tzBTC price is given in XTZ by the API
           tzbtcPrice = tzbtcPrice * xtzPrice;
           return { tzbtcPrice, xtzPrice };
         }
       } else {
         return null;
       }
     } else {
       return null;
     }
   };
   ```

   This function uses the [QuipuSwap GraphQL API](https://analytics-api.quipuswap.com/graphql) to fetch the exchange rates.
   Then the function parses them and validates the prices for XTZ and tzBTC.

1. Add this code to the top of the `utils.ts` file, which includes functions to format token amounts:

   ```typescript
   import BigNumber from "bignumber.js";
   import type { TezosToolkit } from "@taquito/taquito";
   import type { token } from "./types";
   import type { TezosAccountAddress } from "./store";
   import { tzbtcAddress, sirsAddress } from "./config";

   export const displayTokenAmount = (
     amount_: BigNumber | number,
     token: token
   ): string => {
     let amount = BigNumber.isBigNumber(amount_) ? amount_.toNumber() : amount_;
     switch (token) {
       case "XTZ":
         return (+(amount / 10 ** 6).toFixed(6)).toLocaleString("en-US");
       case "tzBTC":
         if (amount < 100) {
           return "> 0.000001";
         }
         return (+(amount / 10 ** 8).toFixed(8)).toLocaleString("en-US", {
           maximumSignificantDigits: 8
         });
       case "SIRS":
         return (+amount.toFixed(2)).toLocaleString("en-US");
     }
   };

   export const shortenHash = (hash: string): string =>
     hash ? hash.slice(0, 5) + "..." + hash.slice(-5) : "";

   export const calcDeadline = () =>
   new Date(Date.now() + 3_600_000).toISOString();
   ```

1. Copy these files from the tutorial repository at <https://github.com/trilitech/tutorial-applications/tree/main/liquidity-baking-dapp>, making sure to put the files in the sale folder in your application.
These files handle parts of the application including displaying the user's wallet information and storing application state information:

   - `src/config.ts`
   - `src/store.ts`
   - `src/types.ts`
   - `src/lib/Interface.svelte`
   - `src/lib/Sidebar.svelte`
   - `src/lib/Toast.svelte`
   - `src/lib/UserStats.svelte`

   Create the `src/lib` folder if your application does not already have it.