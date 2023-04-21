# Framework Best Practices

When creating a frontend application that uses the Tezos blockchain, you will most probably use a JavaScript framework, may it be React, Vue, Svelte or another one.

There are some best practices to follow when you use one of these frameworks to make sure that your code is safe, your app behaves in the intended way and your users enjoy a great experience. Here are the most important ones.

# Dapp lifecycle

The JS framework of your choice probably introduces different functions or models to manage the lifecycles of your application: when it's mounted, when it's updated and when it's unmounted.

There are actions specific to a Tezos dapp that are better implemented during these stages.

- On mount: this is when you generally want to set up the `TezosToolkit` from [Taquito](https://tezostaquito.io/docs/quick_start) as it requires HTTP requests to be made to the selected Tezos node. At the same time, you can set up [Beacon](https://docs.walletbeacon.io/) and set the wallet provider on the instance of the `TezosToolkit` _without_ asking your user to connect their wallet.
- On update: this is when you ask the user if they want to connect their wallet after they interact with your dapp. Once the dapp is mounted, you can also fetch relevant information like XTZ balance, token balances or connection status.
- On unmount: you can disconnect the wallet if you wish to, and you should also clear any interval you set, for example, to regularly fetch data from the blockchain.

# Wallet connection

Connecting and interacting with a wallet is an experience specific to web3 apps and although there is still a lot to learn about user experience with wallets, some rules already exist to provide the best user experience possible.

1. **Do not force wallet connection**: the request to connect a user's wallet must come from the user interacting with your dapp, not appear out of nowhere, for example, when the dapp loads. Let the user get some details about your dapp before they decide to connect their wallet.
2. **Choose the right position for the wallet button**: the users visiting your dapp will expect to find the button to connect or interact with their wallet in the upper part of the interface, on the left or right side. The button must be clearly visible and discoverable in one second.
3. **Display wallet information**: the minimal information to display is the address of the connected account to let the users know which account they are using. A lot of dapps on Tezos also display the XTZ balance, as well as the network the dapp is connected to (mainnet/testnet) or the wallet used for the connection.
4. **Offer the option to select the RPC node**: network traffic can get busy on Tezos, but you can provide a better UX by adding a switch for a different Tezos node if the one selected by default becomes too slow. Some power users may also like having the choice to enter the address of their favourite node!
5. **Add an option to disconnect the wallet**: some users want to switch wallets while using your dapp, so there must be a way to disconnect their wallet and connect a new one effortlessly.

# Interacting with Tezos

The interactions with a blockchain introduce new challenges and solutions for these challenges:

1. **Display clear messages for wallet interactions**: whether it is about sending a transaction to the blockchain or signing a message, the action and its result must be clear to the user, signing a bunch of bytes or approving a transaction without a prior click on a button is a no-no.
2. **Entertain your users while they wait**: visual feedback is crucial while the transaction is being confirmed because it takes a few seconds. During that time, an animation in the UI helps the users understand that something is happening in the background. No visual feedback after signing a transaction will most probably be interpreted as a problem and the user may create a new transaction.
3. **Disable the UI during the transaction confirmation**: you can physically prevent the users from creating new transactions or messing with the current state of your dapp by disabling the UI. Disable the button that triggered the previous transaction and any other input whose value shouldn't change before the transaction is confirmed.
4. **Provide visual feedback for the outcome of the transaction**: if the transaction is successful, display a message and update the UI. If the transaction failed, inform the user about the failure and if possible, why it didn't work and how to fix it.
