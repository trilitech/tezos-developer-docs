---
title: "Part 4: Getting information"
authors: "Tim McMackin"
last_update:
  date: 17 October 2023
---

In this section, you improve the user experience of the application by providing information from Tezos on the page.
Specifically, you show the amount of tez that the user has stored in the smart contract and that is available to withdraw.

Your app can do this because information on Tezos is public, including the code of smart contracts and their data storage.

In this case, the contract's storage is a data type called a big-map.
It maps account addresses with a number that indicates the amount of tez that address has deposited.
Your app can query that amount by getting the contract's storage and looking up the value for the user's account.

You can look up the storage manually by going to a block explorer and going to the Storage tab.
For example, Better Call Dev shows the storage for this contract like this:

![The block explorer, showing the storage for the contract in one big-map object](/img/tutorials/bank-app-block-explorer-storage.png)

You can expand the big-map object and search for the record that is related to your account address to see how much tez you have deposited.

## Accessing the contract storage

Your application can use the Taquito library to access the storage for the contract and look up the user's balance in the contract:

1. In the `App.svelte` file, in the `<script>` section, add a `bankBalance` variable to represent the user's balance in the contract:

   ```javascript
   let bankBalance;
   ```

1. Add a function to access the contract's storage and get the user's balance:

   ```javascript
   const getBankBalance = async (walletAddress) => {
     const contract = await Tezos.wallet.at(contractAddress);
     const storage = await contract.storage();
     const balanceMutez = await storage.get(walletAddress);
     bankBalance = isNaN(balanceMutez) ? 0 : balanceMutez / 1000000;
   }
   ```

   Like the `deposit` and `withdraw` functions, this function creates an object that represents the contract.
   Then it retrieves the contract's storage and uses the `get` method to look up a value from the big-map.
   If it does not find a value, it sets the user's balance to 0.
   If it finds a value, it divides by 1 million because the contract stores values in mutez, which is 1 millionth of a tez.

   Your IDE may show an error on the `get` method because it is not aware of the data type of the storage and that it has this method.
   You can ignore this error.

1. Call the `getBankBalance` function at the end of the `deposit`, `withdraw`, and `connectWallet` functions by adding this line of code to each:

   ```javascript
   await getBankBalance(address);
   ```

1. In the `<main>` section, after the line that shows the wallet balance in tez, add this code to show the bank balance:

   ```html
   <p>Its balance in the bank is {bankBalance}.</p>
   ```

1. Open the application in a web browser, connect your wallet again, and see your balance in the contract.
You can run deposits and withdrawals and see the amount change.
If the amount does not change, make sure that you call the `getBankBalance` function after each transaction.

For example, this image shows the bank balance at 18 tez:

![The completed application with a connected wallet and a bank balance of 18 tez](/img/tutorials/bank-app-complete.png)

## Summary

Now you have an application that can:

- Connect to wallets
- Send transactions to Tezos
- Retrieve information about Tezos

The code for the completed application is in this GitHub repository: https://github.com/trilitech/tutorial-applications/tree/main/bank-tutorial.

If you want to continue with the application, you can try creating a better UI.
Here are some ideas:

- Prevent the user from selecting more tez to deposit than the wallet balance.
- Use the Taquito [`estimate`](https://tezostaquito.io/docs/transaction_limits) function to get an estimate of the fees for the transaction instead of hard-coding them.
- Show toasts or messages on the page to notify the user when transactions complete.

You can also deploy your own smart contracts to use from your applications.
For a tutorial on deploying a simple smart contract, see [Deploy a smart contract](../smart-contract).
