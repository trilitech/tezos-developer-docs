---
title: 'Part 3: Sending transactions'
authors: 'Tim McMackin'
last_update:
  date: 15 November 2023
---

Now that the application can connect to the user's wallet, it can get the user's approval to send transactions to Tezos with that wallet.

## The tutorial smart contract

This decentralized application (or dApp) uses a _smart contract_ on Tezos, which is a type of program that runs on a blockchain.
This contract behaves like an API, because your application calls its entrypoints to run commands.

In this case, the smart contract was deployed for the purposes of this tutorial, so it is not a full-featured application.
It does two things to simulate a bank:

- It accepts deposits of tez tokens that users send and records how many tokens they sent.
- It accepts a request to withdraw tez and sends them back to the user's wallet.

The contract has two _entrypoints_ for these functions, named "deposit" and "withdraw."
These entrypoints are like API endpoints or functions in a program: clients can call them and pass parameters to them.
However, unlike API endpoints and functions, they do not return a value.

## Steps for sending transactions

Sending transactions with Taquito involves these general steps:

1. Create an object that represents the smart contract to call.
1. Disable UI elements related to the transaction to prevent the user from sending duplicate transactions.
1. Create the transaction, including specifying this information:

   - The entrypoint to call
   - The parameters to pass
   - The amount of tez to pass, if any
   - Maximum amounts for the fees for the transaction

1. Send the transaction to the user's wallet for approval.
1. Wait for the transaction to complete.
1. Update information about the user's wallet and other details in the UI based on the result of the transaction.
1. Enable UI elements that were disabled during the transaction.

## Making a deposit transaction

Follow these steps to set up the application to send transactions to the deposit entrypoint:

1. In the `App.svelte` file, add the address of the contract as a constant with the other constants in the `<script>` section:

   ```javascript
   const contractAddress = "KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu";
   ```

   The address of the deployed smart contract for this tutorial is `KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu`.
   You can use this address to look up the status of the contract and see its storage and recent transactions on a block explorer such as https://better-call.dev/.
   For example, this is a link to information about the tutorial contract: https://better-call.dev/ghostnet/KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu/operations.

1. Add variables to represent the amount that the user is depositing and the state of the UI button for the deposit:

   ```javascript
   let depositAmount = 1;
   let depositButtonActive = false;
   let depositButtonLabel = "Deposit";
   ```

1. Add this function to send the deposit transaction:

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
     depositButtonActive = true;
     depositButtonLabel = "Deposit";
   };
   ```

   This function does the general transaction steps from above:

      1. It changes variables to indicate the status of the transaction in the UI.
      1. It creates an object that represents the contract.
      1. It uses the `Tezos.estimate.transfer` method to estimate the fees for the transaction.
      1. It submits the transaction using the fee estimate and the amount of tez to send.
      Estimating the fees is important because the transaction must include the cost to increase the contract's storage in case this is the first time that the account is calling the contract.
      These fee amounts are only maximums; Tezos automatically takes the actual amount for fees from the account.
      1. It waits for the transaction to be confirmed.
      In this case, it waits for the transaction to appear in at least 2 Tezos blocks, which ensures that the transaction has been recorded permanently on the blockchain.
      1. It updates the UI with the new wallet balance.
      1. It changes variables to update the UI.

1. At the end of the `connectWallet` function, add code to enable the deposit button:

   ```javascript
   depositButtonActive = true;
   ```

   The updated `connectWallet` function looks like this:

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
     wallet = newWallet;
     depositButtonActive = true;
   };
   ```

1. In the `<main>` section, after the link to the faucet, add this code:

   ```html
   <p>
     Deposit tez:
     <input type="number" bind:value={depositAmount} min="1" max="100" />
     <input type="range" bind:value={depositAmount} min="1" max="100" />
     <button on:click={deposit} disabled={!depositButtonActive}> {depositButtonLabel} </button>
   </p>
   ```

   This code creates an input field and slider to let the user select an amount from 1 to 100 tez.
   It also adds a button to start the transaction.

   The updated application looks like this:

   ![The updated application with fields to set the amount and a button to send the transaction](/img/tutorials/bank-app-deposit.png)

1. Send a deposit with your wallet using the application:

   1. Make sure the application is still running and open it in your web browser.
   Because you made changes to the application, it refreshes automatically and you must connect your wallet again.

   1. Connect your wallet.

   1. Note the amount of tez in your wallet currently.

   1. Select an amount of tez to send that is less than your current wallet balance.
   Note that you must select less tez than the total balance of your wallet because the transaction adds fees.

   1. Click **Deposit**.

      The wallet application prompts you to approve the transaction, including the amount of tez to send and the maximum amounts for the fees.
      For example, this is how the transaction looks in Temple wallet for sending 9 tez:

      ![The transaction in the Temple wallet, showing the fees and prompting the user to approve the transaction](/img/tutorials/bank-app-deposit-transaction.png)

      The "Deposit" button changes to "Depositing..." while it waits for the transaction to be completed.
      When it changes back to "Deposit," the transaction is complete.

   1. Note the new balance of your wallet.

## Making a withdrawal transaction

The process for making a withdrawal is simpler because the user does not need to select an amount.
Instead, the withdrawal entrypoint checks its storage to see how much the user has deposited and sends that amount back to the user's account.

1. Add variables to represent the state of the UI button for the withdrawal:

   ```javascript
   let withdrawButtonActive = true;
   let withdrawButtonLabel = "Withdraw";
   ```

1. Add this function to send the withdrawal transaction:

   ```javascript
   const withdraw = async () => {
     withdrawButtonActive = false;
     withdrawButtonLabel = "Withdrawing...";

     Tezos.setWalletProvider(wallet);
     const contract = await Tezos.wallet.at(contractAddress);

     const transactionParams = await contract.methods
       .withdraw()
       .toTransferParams();
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
     withdrawButtonActive = true;
     withdrawButtonLabel = "Withdraw";
   }
   ```

   This function is similar to the `deposit` function with these main differences:

   - Instead of calling the `deposit` endpoint, it calls the `withdraw` endpoint.
   - It always sends 0 tez with the transaction.
   - It doesn't estimate the fees because this transaction does not result in a storage increase.

1. In the `<main>` section, after the deposit button, add a button to start the withdrawal transaction:

   ```html
   <p>
     Withdraw tez:
     <button on:click={withdraw} disabled={!withdrawButtonActive}> {withdrawButtonLabel} </button>
   </p>
   ```

1. Make a withdrawal by opening the application, connecting your wallet again, and clicking **Withdraw**.
The application sends the withdrawal transaction and your wallet's balance in the app updates.

Now that the application can send transactions, in the next section, you improve the user interface by showing the user's balance in the bank.

Here is the completed code of the `App.svelte` file at the end of this section:

```html
<script>
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-types";
  import { TezosToolkit } from "@taquito/taquito";

  const rpcUrl = "https://ghostnet.ecadinfra.com";
  const Tezos = new TezosToolkit(rpcUrl);
  const contractAddress = "KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu";

  let wallet;
  let address;
  let balance;

  let depositAmount = 1;
  let depositButtonActive = false;
  let depositButtonLabel = "Deposit";

  let withdrawButtonActive = true;
  let withdrawButtonLabel = "Withdraw";

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
    wallet = newWallet;
    depositButtonActive = true;
  };

  const disconnectWallet = () => {
    wallet.client.clearActiveAccount();
    wallet = undefined;
  };

  const getWalletBalance = async (walletAddress) => {
    const balanceMutez = await Tezos.tz.getBalance(walletAddress);
    balance = balanceMutez.div(1000000).toFormat(2);
  };

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
    depositButtonActive = true;
    depositButtonLabel = "Deposit";
  };

  const withdraw = async () => {
    withdrawButtonActive = false;
    withdrawButtonLabel = "Withdrawing...";

    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(contractAddress);

    const transactionParams = await contract.methods
      .withdraw()
      .toTransferParams();
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
    withdrawButtonActive = true;
    withdrawButtonLabel = "Withdraw";
  };
</script>

<main>
  <h1>Tezos bank dApp</h1>

  <div class="card">
    {#if wallet}
      <p>The address of the connected wallet is {address}.</p>
      <p>Its balance in tez is {balance}.</p>
      <p>
        To get tez, go to <a
          href="https://faucet.ghostnet.teztnets.com/"
          target="_blank"
        >
          https://faucet.ghostnet.teztnets.com/
        </a>.
      </p>
      <p>
        Deposit tez:
        <input type="number" bind:value={depositAmount} min="1" max="100" />
        <input type="range" bind:value={depositAmount} min="1" max="100" />
        <button on:click={deposit} disabled={!depositButtonActive}>
          {depositButtonLabel}
        </button>
      </p>
      <p>
        Withdraw tez:
        <button on:click={withdraw} disabled={!withdrawButtonActive}>
          {withdrawButtonLabel}
        </button>
      </p>
      <p>
        <button on:click={disconnectWallet}> Disconnect wallet </button>
      </p>
    {:else}
      <button on:click={connectWallet}> Connect wallet </button>
    {/if}
  </div>
</main>

<style>
</style>
```
