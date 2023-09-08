---
id: wallets-tokens
title: "Part 2: Accessing wallets and tokens"
authors:
  - Claude Barde
  - Tim McMackin
lastUpdated: 8th September 2023
---

Accessing the user's wallet is a prerequisite for interacting with the Tezos blockchain.
Accessing the wallet allows your app to see the tokens in it and to prompt the user to submit transactions, but it does not give your app direct control over the wallet.

## Connecting to the user's wallet

It's very important to use a single instance of the Beacon SDK to access user wallets.
Using more than one instance of this SDK can cause bugs, so application isolates wallet-related code in a single component in the `src/lib/Wallet.svelte` file.

1. Create a file named `src/lib/Wallet.svelte` and add this code:

   ```typescript
   <script lang="ts">
     import { onMount } from "svelte";
     import { BeaconWallet } from "@taquito/beacon-wallet";
     import store, { type TezosAccountAddress } from "../store";
     import { rpcUrl, network } from "../config";
     import { shortenHash, fetchBalances } from "../utils";

     let connectedNetwork = "";
     let walletIcon = "";
     let walletName = "";

    const connectWallet = async () => {
      if (!$store.wallet) {
        const wallet = new BeaconWallet({
          name: "Tezos dev portal app tutorial",
          preferredNetwork: network
        });
        store.updateWallet(wallet);
      }

      await $store.wallet.requestPermissions({
        network: { type: network, rpcUrl }
      });
      const userAddress = (await $store.wallet.getPKH()) as TezosAccountAddress;
      store.updateUserAddress(userAddress);
      $store.Tezos.setWalletProvider($store.wallet);
      // Get account info
      await getWalletInfo($store.wallet);
      // Fetch the user's XTZ, tzBTC and SIRS balances
      const res = await fetchBalances($store.Tezos, userAddress);
      if (res) {
        store.updateUserBalance("XTZ", res.xtzBalance);
        store.updateUserBalance("tzBTC", res.tzbtcBalance);
        store.updateUserBalance("SIRS", res.sirsBalance);
      } else {
        store.updateUserBalance("XTZ", null);
        store.updateUserBalance("tzBTC", null);
        store.updateUserBalance("SIRS", null);
      }
    };

   </script>
   ```

   The `connectWallet` function creates a `BeaconWallet` object that represents the user's wallet or if the wallet is already connected, retrieves the connection from the store.
   It provides a name for the app, which appears in the wallet UI when it asks the user to allow the connection.
   It also includes the network to use, such as the Tezos main network or test network.
   Then it stores or updates the wallet object in the Svelte store so other parts of the application can use it.

   The Beacon SDK keeps track of live connections in the store, so if a user has connected to your app before and returns later, their wallet is connected automatically.

   The wallet object also provides a `client` property, which allows you to retrieve the wallet address and token balances and save them to the store so the app can display them on the interface.

   This code uses a custom type named `TezosAccountAddress`, which validates Tezos addresses for implicit accounts.
   Tezos addresses start with `tz1`, `tz2`, or `tz3`, so the type checks addresses for these strings.
   Its code looks like this:

   ```typescript
   type TezosAccountAddress = tz${"1" | "2" | "3"}${string}
   ```

   TypeScript raises a warning if you try to use a string that doesn't match this pattern.

1. Add the following code to the `<script lang="ts">` section:

   ```typescript
    onMount(async () => {
        const wallet = new BeaconWallet({
          name: "Tezos dev portal app tutorial",
          preferredNetwork: network
        });
        store.updateWallet(wallet);
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
          const userAddress = (await wallet.getPKH()) as TezosAccountAddress;
          store.updateUserAddress(userAddress);
          $store.Tezos.setWalletProvider(wallet);
          await getWalletInfo(wallet);
          // fetches user's XTZ, tzBTC and SIRS balances
          const res = await fetchBalances($store.Tezos, userAddress);
          if (res) {
            store.updateUserBalance("XTZ", res.xtzBalance);
            store.updateUserBalance("tzBTC", res.tzbtcBalance);
            store.updateUserBalance("SIRS", res.sirsBalance);
          } else {
            store.updateUserBalance("XTZ", null);
            store.updateUserBalance("tzBTC", null);
            store.updateUserBalance("SIRS", null);
          }
        }
      });
    ```

   This code runs when the component mounts, checks if the user has already connected a wallet, and if so, it updates information in the store.

   Now the wallet is connected so the app can show the connection status and token balances.

   IMPORTANT: however you want to design your app, it is essential to use a single instance of the `BeaconWallet` object.
   It is also highly recommended use a single instance of the `TezosToolkit` object.
   Creating multiple instances can cause problems in your app and with Taquito in general.

1. Add the following code to disconnect the wallet:

   ```typescript
   const disconnectWallet = async () => {
       $store.wallet.client.clearActiveAccount();
       store.updateWallet(undefined);
       store.updateUserAddress(undefined);
       connectedNetwork = "";
       walletIcon = "";
     };
   ```

   Disconnecting the wallet is as important as connecting it.
   There is nothing more frustrating than looking for how to disconnect your wallet for hours when it is not made explicit.
   Also, many users have multiple wallets (such as Temple or Kukai) and even multiple addresses within the same wallet, so you must make it easy to connect and disconnect wallets.

   The `disconnectWallet` function runs these steps to disconnect the wallet and reset the state of the app:

   1. It closes the connection to the Beacon SDK with the `$store.wallet.client.clearActiveAccount()` command.
   1. It removes the wallet from the store with the `store.updateWallet(undefined)` command, which triggers an update of the interface.
   1. It removes the user's address from the state with the `store.updateUserAddress(undefined)` command, which also updates the UI.
   1. It resets the local variables for the network and wallet icon.

   TPM TODO: Is this next paragraph needed? If this is the only thing I need to do, why am I doing other things in the `disconnectWallet` function?
   The call to `clearActiveAccount()` on the wallet instance is the only thing that you will do in whatever app you are building, it will remove all the data in the local storage and when your user revisits your app, they won't be automatically connected with their wallet.

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

## Fetching token balances

Taquito can fetch the user's XTZ balance from the connected wallet.
To get the tzBTC and SIRS balances, the app uses the [TzKT API](https://api.tzkt.io/).
This API has many features that provide information about Tezos.

1. Add this `fetchBalances` function to the `src/utils.ts` file:

   ```typescript
   export const fetchBalances = async (
     Tezos: TezosToolkit,
     userAddress: TezosAccountAddress
   ): Promise<{
     xtzBalance: number;
     tzbtcBalance: number;
     sirsBalance: number;
   } | null> => {
   	try {
   	// Add code here in the next step
     } catch (error) {
       console.error(error);
       return null;
     }
   }
   ```

   This function takes two parameters: an instance of the `TezosToolkit` and the user's wallet address.
   It returns an object with the token balances or `null` if any error occurs.

1. Replace the comment `// Add code here in the next step` with this code, which fetches the XTZ balance:

   ```typescript
   const xtzBalance = await Tezos.tz.getBalance(userAddress);
   if (!xtzBalance) throw "Unable to fetch XTZ balance";
   ```

   In this case, as in most of the time, Taquito returns numeric values from the blockchain in the `BigNumber` type, which makes it safer for JavaScript to handle large numbers.

1. After this code, add the following code, which fetches the tzBTC and SIRS balances:

   ```typescript
   const res = await fetch(
     `https://api.tzkt.io/v1/tokens/balances?account=${userAddress}&token.contract.in=${tzbtcAddress},${sirsAddress}`
   );
   if (res.status === 200) {
     const data = await res.json();
     console.log(data)
     if (Array.isArray(data)) {
       const tzbtcBalance = +data[0]?.balance || 0;
       const sirsBalance = +data[1]?.balance || 0;
       return {
         xtzBalance: xtzBalance.toNumber(),
         tzbtcBalance,
         sirsBalance
       }
     } else {
       // Wallet has no tzBTC or SIRS
       return {
         xtzBalance: xtzBalance.toNumber(),
         tzbtcBalance: 0,
         sirsBalance: 0
       };
     }
   } else {
     throw "Unable to fetch tzBTC and SIRS balances";
   }
   ```

   For more information about the call to the TzKT API in this code, see the API reference for the [GET /v1/tokens/balances](https://api.tzkt.io/#operation/Tokens_GetTokenBalances) endpoint.

1. At the top of the file, add this import statement to get the addresses of the tokens:

   ```typescript
   import { tzbtcAddress, sirsAddress } from "./config";
   ```

Now other components can fetch and store the user's token balances at any time.
