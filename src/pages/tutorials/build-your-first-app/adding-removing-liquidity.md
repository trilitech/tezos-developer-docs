---
id: adding-removing-liquidity
title: "Part 4: Adding and removing liquidity"
authors:
  - Claude Barde
  - Tim McMackin
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

Removing liquidity from the Liquidity Baking contract is arguably the easiest of all the tasks accomplished by our interface. The interface only needs one input to receive the amount of SIRS that the user wants to unwrap to get XTZ and tzBTC.

![RemoveLiquidity UI](/images/build-your-first-app/remove-liquidity-ui.png "Remove liquidity UI")

The app will then calculate the corresponding amount of XTZ and tzBTC expected to be received for the amount of SIRS in the input field.

In the `lbUtils.ts` file, you will find the `removeLiquidityXtzTzbtcOut` function to calculate these amounts:

```typescript=
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

- `liquidityBurned` -> the amount of SIRS to burn
- `totalLiquidity` -> the total amount of SIRS tokens in the contract
- `xtzPool` -> the total amount of XTZ tokens in the contract
- `tokenPool` -> the total amount of tzBTC tokens in the contract

If the function has been able to calculate the amounts of XTZ and tzBTC, they are returned in an object, otherwise `null` is returned. After that, those amounts can be displayed in the interface.

Now, let's see how to interact with the `removeLiquidity` entrypoint of the contract. First, we create a `removeLiquidity` function within our TypeScript code that will be triggered when the user clicks on the `Remove liquidity` button:

```typescript=
const removeLiquidity = async () => {
    try {
      if (inputSirs) {
        removeLiquidityStatus = TxStatus.Loading;
        store.updateToast(
          true,
          "Removing liquidity, waiting for confirmation..."
        );

        const lbContract = await $store.Tezos.wallet.at(dexAddress);

    ...

};
```

The function starts by checking if there is an amount of SIRS that was input before the remove liquidity action was triggered. If that's the case, the `removeLiquidityStatus` is set to `loading` to update the UI and inform the user that the transaction is getting ready. A toast will also be displayed.

Next, a `ContractAbstraction` is created for the LB DEX in order to interact with it from Taquito.

Now, we can forge the actual transaction:

```typescript=
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

The `removeLiquidity` entrypoint expects 5 parameters:

1. `to` -> the account that will receive the XTZ and tzBTC
2. `lqtBurned` -> the amount of SIRS to burn
3. `minXtzWithdrawn` -> the minimum amount of XTZ expected to be received
4. `minTokensWithdrawn` -> the minimum amount of tzBTC expected to be received
5. `deadline` -> just as the other entrypoint, a deadline for the transaction must be provided

After the transaction has been emitted, we call `.confirmation()` on the operation object returned by Taquito.

If the transaction was successful, we update the UI and reset the token values to let the user know:

```typescript=
removeLiquidityStatus = TxStatus.Success;
inputSirs = "";
xtzOutput = 0;
tzbtcOutput = 0;

// fetches user's XTZ, tzBTC and SIRS balances
const res = await fetchBalances($store.Tezos, $store.userAddress);
if (res) {
  store.updateUserBalance("XTZ", res.xtzBalance);
  store.updateUserBalance("tzBTC", res.tzbtcBalance);
  store.updateUserBalance("SIRS", res.sirsBalance);
} else {
  store.updateUserBalance("XTZ", null);
  store.updateUserBalance("tzBTC", null);
  store.updateUserBalance("SIRS", null);
}

store.updateToast(true, "Liquidity successfully removed!");
```

If the transaction failed, we also update the UI accordingly:

```typescript=
removeLiquidityStatus = TxStatus.Error;
store.updateToast(true, "An error has occurred");
```

And that's it, the users have now the possibility to remove SIRS tokens and get XTZ and tzBTC tokens in exchange!


You've made it until the end of this tutorial 🙂

This very simple app introduced a lot of different concepts that are fundamental to developing applications on Tezos, but also to understanding how Tezos works in general.

Taquito is an amazing library to develop on Tezos, whether you want to prototype ideas quickly or want to create full-stack decentralized applications. It provides a main library with all you need to read from the Tezos blockchain, interact with smart contracts and use wallets, and several smaller packages for specific usage, for example, reading token metadata or batching operations.

Whether you want to build a front-end app, a back-end, or even a desktop app, as long as you are using JavaScript/NodeJS, you will be able to use Taquito!

This tutorial also introduced different tools you may need on your journey to developing dapps on Tezos, The Beacon SDK to interact with wallets, the TzKT API to get more data from the blockchain, etc.

Although this tutorial uses Svelte as its framework of choice, the skills you learned are transferrable to other frameworks as they are based on a lot of the same concepts (the component lifecycles are very similar, etc.) It gives you everything you need to build amazing dapps on Tezos and I can't wait to see what you will build next!
