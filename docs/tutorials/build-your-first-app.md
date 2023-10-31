---
title: Build your first app on Tezos
authors: 'Claude Barde, Tim McMackin'
lastUpdated: 17th October 2023
---

This tutorial shows you how to create a simple web application that uses Tezos.
Specifically, this application will be the user-facing web front end for a bank application that accepts deposits and returns withdrawals of test tokens.

You will learn:

- How to create a web application and import libraries that access Tezos
- How to connect to a user's wallet
- How to send a transaction to a smart contract on behalf of a user
- How to get information from Tezos and show it on a web page

## Prerequisites

This tutorial uses JavaScript, so it will be easier if you are familiar with JavaScript.

You do not need any familiarity with any of the libraries in the tutorial, including [Taquito](https://tezostaquito.io/), a library that helps developers access Tezos.

## The tutorial application

In this tutorial, you build a web application that allows users to send test tokens to a simulated bank on Tezos and withdraw them later.

The application looks like this:

![Completed bank application, showing information about the user's wallet and buttons to deposit or withdraw tez](/img/tutorials/bank-app-complete.png)

The application connects to a user's cryptocurrency wallet and shows the balance of that wallet in Tezos's native currency, which is referred to as tez, by the ticker symbol XTZ, or the symbol ꜩ.
It provides an input field and slider for the user to select an amount of tez to deposit and a button to send the deposit transaction to Tezos.
It also provides a button to withdraw the amount from Tezos.

The application is based on JavaScript, so it uses several JS-based tools to build and package the application:

- **[Svelte](https://svelte.dev/)** for the JavaScript framework
- **[Vite](https://vitejs.dev/)** (pronounced like _veet_) to bundle the application and provide the libraries to the user's browser

To access the user's wallet and run transactions on Tezos, the application uses these libraries:

- **[Taquito](https://tezostaquito.io/)** to interact with the Tezos blockchain
- **[Beacon](https://docs.walletbeacon.io/)** to access users' wallets

The code for the completed application is in this GitHub repository: <https://github.com/trilitech/tutorial-applications/tree/main/bank-tutorial>.

When you're ready, move to the next section to begin setting up the application.
