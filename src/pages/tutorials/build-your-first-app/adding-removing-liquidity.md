---
id: adding-removing-liquidity
title: "Part 4: Adding and removing liquidity"
authors: 'Claude Barde, Tim McMackin'
lastUpdated: 12 September 2023
---

As mentioned before, users stake XTZ and tzBTC to the LB contract, in a process called "adding liquidity."
Those tokens become the liquidity pool that other users can use to swap tokens.
In this section, you will enhance the application to allow users to stake tokens and receive SIRS and to allow users to return the SIRS and receive their XTZ and tzBTC back with interest.

The most difficult part of this process is getting the tokens amounts correct.
Sending the transactions to Tezos is relatively simple.

The interface for staking tokens looks similar to the interface for swapping, but in this case, both token amounts are editable.
The user enters a token amount in one of the fields and the app calculates the amount of the other token in the other field.
Then, it displays the amount of SIRS tokens that the user receives, as in this picture:

![The interface for adding liquidity](/images/build-your-first-app/add-liquidity-ui.png "Add liquidity UI")

## Calculating token amounts

To set up the code that handles adding and removing liquidity, copy these files from the tutorial repository at <https://github.com/trilitech/tutorial-applications/tree/main/liquidity-baking-dapp>:

- `src/lib/AddLiquidityView.svelte`
- `src/lib/RemoveLiquidityView.svelte`
- `src/lib/SirsStats.svelte`

When the user enters a number into one of the fields, the app runs these steps:

1. The input field runs the `saveInput` function in the `AddLiquidityView.svelte` file and passes the name of the selected token and the amount.
This function calculates the amounts for the UI based on the field that the user filled in.
For example, if the user specifies an amount of XTZ, this code calculates the amount of tzBTC and stores it in the `inputTzbtc` variable:

   ```typescript
   if (token === "XTZ" && val && val > 0) {
     inputXtz = val.toString();
     let tzbtcAmount = addLiquidityTokenIn({
       xtzIn: val * 10 ** 6,
       xtzPool: $store.dexInfo.xtzPool,
       tokenPool: $store.dexInfo.tokenPool
     });
     if (tzbtcAmount) {
       inputTzbtc = tzbtcAmount.dividedBy(10 ** 8).toPrecision(6);
     } else {
       inputTzbtc = "";
     }
     // ...
   }
   ```

1. The function calculates the amount of liquidity created by the transaction via the `addLiquidityLiquidityCreated` function and stores it in the `sirsOutput` variable:

   ```typescript
   const liquidityCreated = addLiquidityLiquidityCreated({
     xtzIn: val * 10 ** 6,
     xtzPool: $store.dexInfo.xtzPool,
     totalLiquidity: $store.dexInfo.lqtTotal
   });
   if (liquidityCreated) {
     sirsOutput = Math.floor(liquidityCreated.toNumber());
   } else {
     sirsOutput = 0;
   }
   ```

   You can see the code of the `addLiquidityLiquidityCreated` function in the `src/lbUtils.ts` file.

   This function takes 3 parameters:

   - The amount of XTZ to add
   - The current state of the XTZ pool
   - The total amount of liquidity available in the contract, represented by the SIRS tokens

   The function returns the amount of SIRS that is created after the transaction.
   The `saveInput` function stores this amount in the `sirsOutput` variable and shows it on the interface.

## Sending the transaction

When the user confirms the transaction to add liquidity, the app runs the `addLiquidity` function:

1. The function verifies that the token amounts are set and updates the UI to show that the transaction is in progress.

1. The function creates objects of the `ContractAbstraction` type to represent the LB contract and the contract that manages tzBTC:

   ```typescript
   const lbContract = await $store.Tezos.wallet.at(dexAddress);
   const tzBtcContract = await $store.Tezos.wallet.at(tzbtcAddress);
   ```

1. As with the operation to swap tzBTC to XTZ, the transaction to add liquidity requires multiple operations.
You could use a Taquito batch operation as in the swap function, but to illustrate a different way of bundling the operations, the `addLiquidity` function batches operations in this way:

   ```typescript
   const batch = $store.Tezos.wallet.batch([
     {
     kind: OpKind.TRANSACTION,
     ...tzBtcContract.methods.approve(dexAddress, 0).toTransferParams()
     },
     {
     kind: OpKind.TRANSACTION,
     ...tzBtcContract.methods
       .approve(dexAddress, tzbtcForLiquidity)
       .toTransferParams()
     },
     {
     kind: OpKind.TRANSACTION,
     ...lbContract.methodsObject
       .addLiquidity({
       owner: $store.userAddress,
       minLqtMinted: sirsOutput,
       maxTokensDeposited: tzbtcForLiquidity,
       deadline: calcDeadline()
       })
       .toTransferParams(),
     amount: +inputXtz
     },
     {
     kind: OpKind.TRANSACTION,
     ...tzBtcContract.methods.approve(dexAddress, 0).toTransferParams()
     }
   ]);
   ```

   This code passes an array of operations to Taquito:

   1. This operation sets the amount of approved tzBTC for the LB DEX to zero.

      ```typescript
      {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methods.approve(dexAddress, 0).toTransferParams()
      }
      ```

      TPM TODO: Why do we need to do this? Is this to reset any pending transactions to 0 before setting the requested amount in the next transaction?

   1. This operation prompts the user's wallet to get approval for the amount of tzBTC to send:

      ```typescript
      {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methods
          .approve(dexAddress, tzbtcForLiquidity)
          .toTransferParams()
      }
      ```

   1. This operation calls the contract endpoint, represented by the `addLiquidity` function:

      ```typescript
      {
      	kind: OpKind.TRANSACTION,
      	...lbContract
      		.methodsObject
      		.addLiquidity({
      			owner: $store.userAddress,
      			minLqtMinted: sirsOutput,
      			maxTokensDeposited: tzbtcForLiquidity,
      			deadline: calcDeadline()
      		})
      		.toTransferParams(),
      	amount: +inputXtz
      }
      ```

      It passes these parameters, put in an object by the `methodsObject` method:

      - The address of the account that receives the SIRS tokens
      - The minimum amount of SIRS tokens to be received
      - The amount of tzBTC deposited
      - The deadline

      Finally, it adds the amount of XTZ as the last property of the operation.
      This field must be after the `toTransferParams` function or it is overwritten with the default amount, which is zero.

   1. This operation resets the allowed amount of tzBTC to be used by the LB contract back to zero.

      ```typescript
      {
        kind: OpKind.TRANSACTION,
        ...tzBtcContract.methods.approve(dexAddress, 0).toTransferParams()
      }
      ```

1. Then the function sends the transaction to Tezos and waits for it to complete:

   ```typescript
   const batchOp = await batch.send();
   await batchOp.confirmation();
   ```

1. The function clears the UI:

   ```typescript
   addLiquidityStatus = TxStatus.Success;
   inputXtz = "";
   inputTzbtc = "";
   sirsOutput = 0;
   ```

1. The function updates the user's balances with the `fetchBalances` function.

Now the app uses can add liquidity to the Liquidity Baking contract and invest their XTZ and tzBTC.

## Removing liquidity

The transaction to remove liquidity requires only the amount of SIRS that the user wants to exchange for tzBTC and XTZ.
Therefore, the UI shows only one input field:

![RemoveLiquidity UI](/images/build-your-first-app/remove-liquidity-ui.png "Remove liquidity UI")

The app uses the `removeLiquidityXtzTzbtcOut` function in the `src/lbUtils.ts` file to calculate the amount of XTZ and tzBTC that the user receives:

   ```typescript
   const outputRes = removeLiquidityXtzTzbtcOut({
     liquidityBurned: val,
     totalLiquidity: $store.dexInfo.lqtTotal.toNumber(),
     xtzPool: $store.dexInfo.xtzPool.toNumber(),
     tokenPool: $store.dexInfo.tokenPool.toNumber()
     });
   if (outputRes) {
     const { xtzOut, tzbtcOut } = outputRes;
     xtzOutput = xtzOut
       .decimalPlaces(0, 1)
       .dividedBy(10 ** 6)
       .decimalPlaces(6)
       .toNumber();
     tzbtcOutput = tzbtcOut
       .decimalPlaces(0, 1)
       .dividedBy(10 ** 8)
       .decimalPlaces(8)
       .toNumber();
     }
   ```

This function takes an object as a parameter with 4 properties:

- `liquidityBurned`: The amount of SIRS to return and burn
- `totalLiquidity`: The total amount of SIRS tokens in the contract
- `xtzPool`: The total amount of XTZ tokens in the contract
- `tokenPool`: The total amount of tzBTC tokens in the contract

The `removeLiquidity` function in the `src/lib/RemoveLiquidityView.svelte` file creates the transaction by running these steps:

1. It verifies the number of SIRS to return and updates the UI to show that a transaction is pending.

1. It creates an object of the `ContractAbstraction` that represents the LB contract:

   ```typescript
   const lbContract = await $store.Tezos.wallet.at(dexAddress);
   ```

1. It creates the transaction, sends it, and waits for it to complete:

   ```typescript
   const op = await lbContract.methodsObject
     .removeLiquidity({
       to: $store.userAddress,
       lqtBurned: inputSirs,
       minXtzWithdrawn: Math.floor(xtzOutput * 10 ** XTZ.decimals),
       minTokensWithdrawn: Math.floor(tzbtcOutput * 10 ** tzBTC.decimals),
       deadline: calcDeadline()
     })
     .send();
   await op.confirmation();
   ```

   The `removeLiquidity` entrypoint accepts these parameters:

   - `to`: The account that receives the XTZ and tzBTC
   - `lqtBurned`: The amount of SIRS to return and burn
   - `minXtzWithdrawn`: The minimum amount of XTZ to receive
   - `minTokensWithdrawn`: The minimum amount of tzBTC to receive
   - `deadline`: The deadline

1. The function updates the user's balances with the `fetchBalances` function.

Now the users can return their SIRS tokens and receive their XTZ and tzBTC tokens.

## Summary

You've made it until the end of this tutorial! 🙂

To start the application, run `npm run dev` from the command line and open it in a browser.

You learned: many concepts that are fundamental to developing applications on Tezos and to understanding how Tezos works in general, including:

- How to use Taquito to develop on Tezos, interact with smart contracts, and use wallet, whether you want to prototype ideas quickly or want to create full-stack decentralized applications.

- How to use the Beacon SDK to interact with wallets.

- How to use the TzKT API to get data from the blockchain.

Although this tutorial uses Svelte for its framework, the skills you learned are transferrable to other JS/TS frameworks, because many of them use the same concepts, such as similar component lifecycles.

Now you know many of the things that you need to build amazing dApps on Tezos and we can't wait to see what you build next!
