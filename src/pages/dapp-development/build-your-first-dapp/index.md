# Build Your First Tezos Dapp

In this tutorial, you will learn how to set up and create a decentralized web application on Tezos. We will build together an interface for the Liquidity Baking smart contract that will allow us to interact with this DEX and perform different operations, like swapping tokens or providing liquidity. At the same time, you will be introduced to core concepts of building a decentralized application in general, but also specifically on Tezos.

As the dapp will be built with [TypeScript](https://www.typescriptlang.org/), a good knowledge of this programming language is required. We will use the [Svelte](https://svelte.dev/) framework to develop the application, no prior knowledge of it is required as it is pretty intuitive to use and I will explain how it works along the way.

As 99% of the dapps in the ecosystem, this dapp will use [Taquito](https://tezostaquito.io/), a TypeScript library that will provide a much better developer experience to use the Tezos blockchain.

## Overview of this tutorial
### Setting up the project
- Installing ViteJS + Svelte
- Installing Tezos packages
- Configuring ViteJS
- Checking that everything works

### Setting up the dapp
- File structure
- Configuration
- The `TezosToolkit` instance

### Setting up the wallet
- Setting up Beacon
- Design considerations (wallet, etc.)

### Fetching user's balances
- XTZ balance
- tzBTC balance
- SIRIUS balance
- Displaying the balances

### Swapping XTZ/tzBTC
- Requirements
- UI design
- Calculating minimum tokens out
- Transaction feedback

### Adding liquidity
- Requirements
- UI design
- Calculating amounts of XTZ and tzBTC

### Removing liquidity
- Requirements
- UI design



## The Liquidity Baking contract

There is a special contract on Tezos called the **Liquidity Baking** contract. This contract is a decentralized exchange (or DEX) that handles only 3 tokens: **XTZ** (the native token of Tezos), **tzBTC** (a wrapped token to use Bitcoin on Tezos) and **SIRS** (for _Sirius_, the token that represents an equal amount of liquidity in XTZ and tzBTC added to the contract).

The particularity of this contract is that every time a new block is baked on Tezos, 2.5 XTZ are added to the contract. Users are expected to bring tzBTC in order to keep the DEX liquidity balanced and the price of SIRS stable.

The contract is also fully public, which means that anybody with a Tezos wallet can interact with it to swap XTZ for tzBTC and vice-versa, provide liquidity or remove it, which is what we are going to do in this tutorial.

## What are we going to build?

In this tutorial, we will build a dapp interface that interacts with the LB contract to swap tokens, add liquidity and remove it. The dapp will handle different actions:

- Displaying users' information like their XTZ, tzBTC, and SIRS balance and update them after each transaction
- Connecting and disconnecting the users' wallet
- Displaying wallet information like its connection status and the network it's connected to
- Displaying different interfaces to swap tokens, add and remove liquidity
- Allowing users to swap XTZ for tzBTC and tzBTC for XTZ
- Allowing users to add liquidity by providing XTZ and tzBTC and getting SIRS in exchange
- Allowing users to remove liquidity, i.e. to redeem SIRS tokens and get XTZ and tzBTC tokens in exchange.

## What tools are we going to use?

As the decentralized application is ultimately a web app, we will use the following tools to build it:

- **Svelte** for the JavaScript framework
- **TypeScript** to make our JavaScript code safer and more expressive
- **Sass** as a CSS preprocessor
- **Vite** to bundle the application (pronounced like _veet_)
- **Taquito** to interact with the Tezos blockchain
- **Beacon** and the wrapper library provided by Taquito to use a Tezos wallet

## Useful links

- Svelte => https://svelte.dev/
- TypeScript => https://www.typescriptlang.org/
- Sass => https://sass-lang.com/
- Vite => https://vitejs.dev/
- Taquito => https://tezostaquito.io/
- Beacon => https://docs.walletbeacon.io/
- GitHub repo with the dapp => https://github.com/claudebarde/tezos-dev-portal-tutorial


As we are building a web app with the Svelte framework, the steps to set up the project will be very similar to the ones you would follow to set up any other web app.

In this tutorial, we will make a Svelte SPA, so we won't need SvelteKit, which will also make our life easier.

The first thing to do is to install Svelte with TypeScript and Vite:

```
npm create vite@latest lb-dex -- --template svelte-ts
cd lb-dex
npm install
```

Next, we will install all the dependencies we need for the dapp:

```
npm install --save-dev sass
npm install @taquito/taquito @taquito/beacon-wallet
```

Sass is a development-only dependency, `@taquito/taquito`  is the NPM package for the Taquito library and `@taquito/beacon-wallet` is the NPM package that contains Beacon with some little configuration to make it easier to plug into Taquito.

There are a couple of other libraries we need to install:

```
npm install --save-dev buffer events vite-compatible-readable-stream
```

These libraries are required to be able to run Beacon in a Svelte app. We will see down below how to use them.

Once everything has been installed, we have to set up the right configuration.

In your `app` folder, you will see the `vite.config.js` file, it's the file that contains the configuration that Vite needs to run and bundle your app. Make the following changes:

```javascript=
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

Here are a few changes we made to the template configuration given by Vite:
- We set `global` to `{}` and we will later provide the `global` object in our HTML file
- We provide a path to the Beacon SDK 
- We provide polyfills for `readable-stream` and `stream` 

Once these changes have been done, there is a last step to finish setting up the project: we have to update the HTML file where the JavaScript code will be injected.

Here is what you should have:

```html=
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

In the first `script` tag, we set the `global` variable to `globalThis`. Then, in the second `script` tag with a `module` type, we import `Buffer` from the `buffer` library and add it to the `window` global object.

> *Note: this configuration is required to run the Beacon SDK with a Vite app. Taquito works completely out of the box and doesn't require any settings.*

Once we updated the configuration in the `vite.config.js` file and in the `index.html` file, our project is successfully set up! You can run `npm run dev` in your terminal at the root of the project to check that everything works properly, the dapp should be running on `http://localhost:4000`

Now, let's start writing some code and setting up the dapp!

As we are building a web app with the Svelte framework, the steps to set up the project will be very similar to the ones you would follow to set up any other web app.

In this tutorial, we will make a Svelte SPA, so we won't need SvelteKit, which will also make our life easier.

The first thing to do is to install Svelte with TypeScript and Vite:

```
npm create vite@latest lb-dex -- --template svelte-ts
cd lb-dex
npm install
```

Next, we will install all the dependencies we need for the dapp:

```
npm install --save-dev sass
npm install @taquito/taquito @taquito/beacon-wallet
```

Sass is a development-only dependency, `@taquito/taquito`  is the NPM package for the Taquito library and `@taquito/beacon-wallet` is the NPM package that contains Beacon with some little configuration to make it easier to plug into Taquito.

There are a couple of other libraries we need to install:

```
npm install --save-dev buffer events vite-compatible-readable-stream
```

These libraries are required to be able to run Beacon in a Svelte app. We will see down below how to use them.

Once everything has been installed, we have to set up the right configuration.

In your `app` folder, you will see the `vite.config.js` file, it's the file that contains the configuration that Vite needs to run and bundle your app. Make the following changes:

```javascript=
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

Here are a few changes we made to the template configuration given by Vite:
- We set `global` to `{}` and we will later provide the `global` object in our HTML file
- We provide a path to the Beacon SDK 
- We provide polyfills for `readable-stream` and `stream` 

Once these changes have been done, there is a last step to finish setting up the project: we have to update the HTML file where the JavaScript code will be injected.

Here is what you should have:

```html=
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

In the first `script` tag, we set the `global` variable to `globalThis`. Then, in the second `script` tag with a `module` type, we import `Buffer` from the `buffer` library and add it to the `window` global object.

> *Note: this configuration is required to run the Beacon SDK with a Vite app. Taquito works completely out of the box and doesn't require any settings.*

Once we updated the configuration in the `vite.config.js` file and in the `index.html` file, our project is successfully set up! You can run `npm run dev` in your terminal at the root of the project to check that everything works properly, the dapp should be running on `http://localhost:4000`

Now, let's start writing some code and setting up the dapp!

If you've made it so far and your app is running on `http://localhost:4000`, congratulations!

Now, we have to set up the dapp in order to use Taquito and Beacon.

### File structure

The entrypoint of every Svelte app is a file called `App.svelte`, this is where you will import all your components to be bundled together into your final app. The file structure of our project looks like this:

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

Let's see what each of these elements does:

- **assets** -> contains the favicon (here, this is the default Svelte favicon, but you can choose another one)
- **lib** -> contains the different components that will make up our interface, here is what each does:
  - `SwapView.svelte`: the interface to swap XTZ and tzBTC tokens
  - `AddLiquidityView.svelte`: the interface to add liquidity to the LB DEX
  - `RemoveLiquidity.svelte`: the interface to remove liquidity from the LB DEX
  - `Interface.svelte`: the higher-order component to hold the different views to interact with the LB DEX
  - `Sidebar.svelte`: the component to navigate between the different interfaces and to connect or disconnect the wallet
  - `SirsStats.svelte`: the component to display the amount of XTZ, tzBTC, and SIRS present in the contract
  - `Toast.svelte`: a simple component to display the progression of the transactions and other messages when interacting with the contract
  - `UserInput.svelte`: a utility component to make it easier to interact and control input fields
  - `UserStats.svelte`: the component to display the user's balance in XTZ, tzBTC, and SIRS
  - `Wallet.svelte`: the component to manage wallet interactions
- **styles** -> contains the SASS files to style different elements of our interface
- **App.svelte** -> the entrypoint of the application
- **config.ts** -> different immutable values needed for the application and saved in a separate file for convenience
- **lbUtils.ts** -> different methods to calculate values needed to interact with the Liquidity Baking contract
- **main.ts** -> this is where the JavaScript for the app is bundled before being injected into the HTML file
- **store.ts** -> a file with a [Svelte store](https://svelte.dev/tutorial/writable-stores) to handle the dapp state
- **types.ts** -> custom TypeScript types
- **utils.ts** -> different utility methods

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

There is a `script` tag with a `lang` attribute set to `ts` for TypeScript, a `style` tag with a `lang` attribute set to `scss` for SASS and the rest of the code in the file will be interpreted as HTML.

### Configuring the dapp

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

The interface will change after different elements are available to the dapp, mostly, the data about the liquidity pools from the liquidity baking contract.

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
- `store` is a Svelte feature to manage the state of the dapp
- From the `config.ts` file, we import `rpcUrl` (the URL of the Tezos RPC node) and `dexAddress`, the address of the Liquidity Baking contract
- `Storage` is a custom type that represents the signature type of the LB DEX storage
- `fetchExchangeRates` is a function to fetch the exchange rates of XTZ and tzBTC (more on that below)

Next, we use `onMount` to set up the state of the dapp:

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