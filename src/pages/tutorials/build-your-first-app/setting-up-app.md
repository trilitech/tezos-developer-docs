---
id: setting-up-app
title: "Part 1: Setting up the application"
authors:
  - Claude Barde
  - Tim McMackin
lastUpdated: 7th September 2023
---

You can access Tezos through any JavaScript framework.
This tutorial uses the Svelte framework, and the following steps show you how to start a Svelte application and add the Tezos-related dependencies.
If you are familiar with Svelte, note that this application includes its own Svelte SPA, so it does not require SvelteKit.

## Setting up the app

1. Run these commands to install Svelte with TypeScript and Vite:

   ```
   npm create vite@latest lb-dex -- --template svelte-ts
   cd lb-dex
   npm install
   ```

1. Install Sass and the Tezos-related dependencies:

   ```
   npm install --save-dev sass
   npm install @taquito/taquito @taquito/beacon-wallet
   ```

1. Install the `buffer`, `events`, and `vite-compatible-readable-stream` libraries:

   ```
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

1. Run the project by running the command `npm run dev` on the command line and opening <http://localhost:4000> in your browser.
You should see a sample Svelte page that confirms that the application is configured properly.




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

- **assets** -> Contains the favicon and any other static files such as images for the application
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
- **styles** -> Contains the SASS files to style different elements of our interface
- **App.svelte** -> The entrypoint of the application, which contains the components that are bundled into the final application
- **config.ts** -> Constants for the application
- **lbUtils.ts** -> Methods to calculate values needed to interact with the LB contract, such as calculating the amount of output tokens
- **main.ts** -> Where the JavaScript for the app is bundled before being injected into the HTML file
- **store.ts** -> A file with a [Svelte store](https://svelte.dev/tutorial/writable-stores) to handle the app state
- **types.ts** -> Custom TypeScript types
- **utils.ts** -> Utility methods

The first thing to do is to import our styles into the `main.ts` file:

```typescript=
import App from './App.svelte'
import "./styles/index.scss";

const app = new App({
	target: document.body
})

export default app
```

Svelte uses SASS by default, so there is no configuration to do for that.

> _Note: I also like to target the `body` tag to inject the HTML produced by JavaScript instead of a `div` inside the `body`, but that's a personal choice and you are free to use a `div` instead_

Before continuing, this is what a Svelte file looks like:

```html=
<script lang="ts">
	... your TypeScript code
</script>

<style lang="scss">
	... your SASS code
</style>

... your HTML code
```

Svelte components are fully contained, which means that the style that you apply inside a component doesn't leak into the other components of your app. The style that we want to share among different components will be written in the `index.scss` file.

There is a `script` tag with a `lang` attribute set to `ts` for TypeScript, a `style` tag with a `lang` attribute set to `scss` for SASS, and the rest of the code in the file will be interpreted as HTML.

## Configuring the app

Now, let's set up different things in our `App.svelte` file.

The HTML part is just going to put all the higher-order components together:

```html=
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

The SASS part will import different settings and apply styling to the `main` tag:

```scss=
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

Now, the TypeScript part. First, you import the libraries and components we need:

```typescript=
import { onMount } from "svelte";
import { TezosToolkit } from "@taquito/taquito";
import store from "./store";
import { rpcUrl, dexAddress } from "./config";
import Sidebar from "./lib/Sidebar.svelte";
import Interface from "./lib/Interface.svelte";
import Toast from "./lib/Toast.svelte";
import type { Storage } from "./types";
import { fetchExchangeRates } from "./utils";
```

- `onMount` is a method exported by Svelte that will run some code when the component mounts (more on that below)
- `TezosToolkit` is the class that gives you access to all the features of Taquito
- `store` is a Svelte feature to manage the state of the app
- From the `config.ts` file, we import `rpcUrl` (the URL of the Tezos RPC node) and `dexAddress`, the address of the Liquidity Baking contract
- `Storage` is a custom type that represents the signature type of the LB DEX storage
- `fetchExchangeRates` is a function to fetch the exchange rates of XTZ and tzBTC (more on that below)

Next, we use `onMount` to set up the state of the app:

```typescript=
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

The first thing to do is to create an instance of the `TezosToolkit` by passing the URL of the RPC node we want to interact with. In general, you want to have a single instance of the `TezosToolkit` in order to keep the same configuration across all your app components, this is why we save it in the `store` with the `updateTezos` method.

After that, we want to fetch the storage of the LB DEX to get the amounts of XTZ, tzBTC, and SIRS in the contract. We create a `ContractAbstraction`, an instance provided by Taquito with different properties and methods that are useful to work with Tezos smart contracts.
From the `ContractAbstraction`, we can call the `storage` method that returns a JavaScript object that represents the storage of the given contract. We then pass the storage to the `updateDexInfo` method present on the `store` to update this data and display them to the user.

To finish, we need to fetch the exchange rates for XTZ and tzBTC to make the conversions required by this kind of app. The `utils.ts` file contains a function that will help us here:

```typescript=
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

We use the [QuipuSwap GraphQL API](https://analytics-api.quipuswap.com/graphql) to fetch these exchange rates. After the exchange rates are received, we parse the response from the API and validate the price given for XTZ and tzBTC. These prices are then returned by the function and we can save them in the store. The exchange rates are used, for example, to calculate the total value in USD locked in the contract.
