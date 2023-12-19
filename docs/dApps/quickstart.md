---
title: dApp quickstart
authors: "Tim McMackin"
last_update:
  date: 19 December 2023
---

This quickstart shows you how to get started with a simple dApp that calls an existing smart contract on the Tezos blockchain.
It uses the [Svelte](https://svelte.dev/) framework and JavaScript, but you can use any JavaScript/TypeScript framework and get similar results.

For a full walkthrough of creating this dApp, see the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app).
The following instructions are for setting up the application with minimal explanation.

## Prerequisites

To follow this quickstart, you need [Git](https://github.com/) to download a sample application and [Node.JS and NPM](https://nodejs.org/) to install its dependencies and run it.

You also need a Tezos wallet in a web browser extension, such as the [Temple wallet](https://templewallet.com/), and some test tez to pay transaction fees.
See [Installing and funding a wallet](../developing/wallet-setup).

## Setting up the sample dApp

The sample dApp is provided in the repository https://github.com/trilitech/tutorial-applications, so all you need to do is to clone it, install its dependencies, and start it:

1. Clone the repository by running this command:

   ```bash
   git clone https://github.com/trilitech/tutorial-applications
   ```

1. Go to the folder with the application:

   ```bash
   cd bank-tutorial
   ```

1. Install the dependencies:

   ```bash
   npm install
   ```

1. Start the application:

   ```bash
   npm run dev
   ```

The application starts and you can see it in a web browser at http://localhost:4000.

## Using the dApp

The running application looks like this:

![Completed bank application, showing information about the user's wallet and buttons to deposit or withdraw tez](/img/tutorials/bank-app-complete.png)

The application connects to a user's cryptocurrency wallet and shows the balance of that wallet in Tezos's native currency, which is referred to as tez, by the ticker symbol XTZ, or the symbol ꜩ.
It provides an input field and slider for the user to select an amount of tez to deposit and a button to send the deposit transaction to the smart contract by calling its `deposit` entrypoint.
It also provides a button to withdraw the amount from the smart contract by calling its `withdraw` entrypoint.

In this way, the application demonstrates how to do these basic dApp tasks:

- Connecting to users' wallets

  The dApp uses the Beacon SDK to connect to wallets, which allows the application to get information about the user's account and to prompt them to approve Tezos transactions.
  You can see this code in the `src/App.svelte` file, in the `connectWallet` function:

  ```javascript
  const connectWallet = async () => {
    const newWallet = new BeaconWallet({
      name: "Simple dApp tutorial",
      network: {
        type: NetworkType.GHOSTNET,
      },
    });
    await newWallet.requestPermissions();
    address = await newWallet.getPKH();
    await getWalletBalance(address);
    await getBankBalance(address);
    wallet = newWallet;
    depositButtonActive = true;
  };
  ```

  Note that your application does not need to store any passwords, keys, or secrets; all security is handled by the wallet.

- Sending transactions to Tezos

  A Tezos transaction is a call to a smart contract entrypoint.
  It optionally includes parameters and tez.
  The `deposit` and `withdraw` functions call the entrypoints of the same names.
  For example, the `deposit` function creates objects that represent the contract and the parameters for the transaction.
  Then it estimates the fees for the transaction, sends the transaction to the user's wallet for approval, and waits for the transaction to be confirmed on Tezos.

  ```javascript
    const deposit = async () => {
    depositButtonActive = false;
    depositButtonLabel = "Depositing...";

    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(contractAddress);
    const transactionParams = await contract.methods
      .deposit()
      .toTransferParams({
        amount: depositAmount,
      });
    const estimate = await Tezos.estimate.transfer(transactionParams);

    const operation = await Tezos.wallet
      .transfer({
        ...transactionParams,
        ...estimate,
      })
      .send();

    console.log(`Waiting for ${operation.opHash} to be confirmed...`);

    await operation.confirmation(2);

    console.log(
      `Operation injected: https://ghost.tzstats.com/${operation.opHash}`
    );

    await getWalletBalance(address);
    await getBankBalance(address);
    depositButtonActive = true;
    depositButtonLabel = "Deposit";
  };
  ```

  You can adapt this code to call any smart contract entrypoints.

## Next steps

Now that you have an application that can call a smart contract, you can call other contracts or deploy your own smart contracts to use with your dApps.
See the tutorial [Deploy a smart contract](../tutorials/smart-contract) to learn how to write a smart contract or the tutorial [Build your first app on Tezos](../tutorials/build-your-first-app) to learn more about writing dApps.
