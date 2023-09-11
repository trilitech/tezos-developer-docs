---
id: swapping-tokens
title: "Part 3: Swapping tokens"
authors:
  - Claude Barde
  - Tim McMackin
lastUpdated: 11th September 2023
---

Now that the app has a framework and the ability to connect to wallets, you can implement the most complex feature of the app: swapping XTZ and tzBTC.

Like most smart contracts, the Liquidity Baking contract is very picky about the requests that it accepts.
Your application must make several calculations to create a valid swap request.

When complete, the app UI will look like this:

![The swap user interface section, showing fields for the input and output amounts](/images/build-your-first-app/swap-ui.png "Swap UI")

The text field on the left is editable; the user can enter the amount of XTZ or tzBTC to exchange or click the "Max" button to set the field to the total amount of that token in the wallet.
The field on the right is not editable; it shows the corresponding amount that they will get of the other token.
The button in the middle with the 2 arrows switches the input between XTZ and tzBTC.

## Handling user input

To set up user input in your application, copy these files from the tutorial repository at <https://github.com/trilitech/tutorial-applications/tree/main/liquidity-baking-dapp>:

- `src/lib/UserInput.svelte`
- `src/lib/SwapView.svelte`

The component that contains the user input fields is in the file `src/lib/SwapView.svelte`.
Going into the details of how the text inputs are implemented is beyond the scope of this tutorial, but in a nutshell, one component (in the file `src/lib/UserInput.svelte`) displays input sections with a token icon, text field, and Max button.
Internally, each input component keeps track of the user's input and the available balance to display error messages if the balance is too low.
A container component shows the two input components and adjusts the general interface to changes in those components.

Every time an update is sent to the parent component (`SwapView.svelte`), the data provided with the update is passed to the `saveInput` function:

```typescript
import {
	xtzToTokenTokenOutput,
	tokenToXtzXtzOutput,
	calcSlippageValue
} from "../lbUtils";

const saveInput = ev => {
    const { token, val, insufficientBalance: insufBlnc } = ev.detail;
    insufficientBalance = insufBlnc;

    if (token === tokenFrom && val > 0) {
      inputFrom = val.toString();
      inputTo = "";
      if (tokenFrom === "XTZ") {
        // calculates tzBTC amount
        let tzbtcAmount = xtzToTokenTokenOutput({
          xtzIn: val * 10 ** XTZ.decimals,
          xtzPool: $store.dexInfo.xtzPool,
          tokenPool: $store.dexInfo.tokenPool
        });
        if (tzbtcAmount) {
          inputTo = tzbtcAmount.dividedBy(10 ** tzBTC.decimals).toPrecision(6);
        }
        // calculates minimum output
        minimumOutput = calcSlippageValue("tzBTC", +inputTo, +slippage);
      } else if (tokenFrom === "tzBTC") {
        // calculates XTZ amount
        let xtzAmount = tokenToXtzXtzOutput({
          tokenIn: val * 10 ** tzBTC.decimals,
          xtzPool: $store.dexInfo.xtzPool,
          tokenPool: $store.dexInfo.tokenPool
        });
        if (xtzAmount) {
          inputTo = xtzAmount.dividedBy(10 ** XTZ.decimals).toPrecision(8);
        }
        // calculates minimum output
        minimumOutput = calcSlippageValue("XTZ", +inputTo, +slippage);
      }
    } else {
      inputFrom = "";
      inputTo = "";
    }
  };
```

This function does several things:

- It receives the values necessary for the calculations of the token amounts in the `ev.detail` object
- It verifies that the values are received from the token that is currently active (the one on the left)
- If that token is XTZ, the function calculates the amount in tzBTC via the `xtzToTokenTokenOutput` function (more on that in the next section)
- If that token is tzBTC, the function calculates the amount in XTZ is calculated via the `tokenToXtzXtzOutput` function (more on that in the next section)
- It uses the `calcSlippage` function to calculate the minimum amount of the target token to be received based on the slippage that the user selects

*Slippage* is the percentage that the user tolerates losing during the trade due to changes in the exchange rate.
For example, if the user wants to swap 100 XTZ tokens for 100 xtBTC tokens and selects a slippage of 1%, the user receives between 99 and 100 tzBTC tokens.

## Calculating the tokens that the user receives

To set up the functions that calculate the transaction amounts, copy these files from the tutorial repository at <https://github.com/trilitech/tutorial-applications/tree/main/liquidity-baking-dapp>:

- `src/lbUtils.ts`

The functions `xtzToTokenTokenOutput` and `tokenToXtzXtzOutput` in this file calculate how many tzBTC a user will get according to the XTZ amount they input and vice versa.
They are adapted [from the code in this repo](https://github.com/kukai-wallet/kukai-dex-calculations).

```typescript
export const xtzToTokenTokenOutput = (p: {
  xtzIn: BigNumber | number;
  xtzPool: BigNumber | number;
  tokenPool: BigNumber | number;
}): BigNumber | null => {
  let { xtzIn, xtzPool: _xtzPool, tokenPool } = p;
  let xtzPool = creditSubsidy(_xtzPool);
  let xtzIn_ = new BigNumber(0);
  let xtzPool_ = new BigNumber(0);
  let tokenPool_ = new BigNumber(0);
  try {
    xtzIn_ = new BigNumber(xtzIn);
    xtzPool_ = new BigNumber(xtzPool);
    tokenPool_ = new BigNumber(tokenPool);
  } catch (err) {
    return null;
  }
  if (
    xtzIn_.isGreaterThan(0) &&
    xtzPool_.isGreaterThan(0) &&
    tokenPool_.isGreaterThan(0)
  ) {
    const numerator = xtzIn_.times(tokenPool_).times(new BigNumber(998001));
    const denominator = xtzPool_
      .times(new BigNumber(1000000))
      .plus(xtzIn_.times(new BigNumber(998001)));
    return numerator.dividedBy(denominator);
  } else {
    return null;
  }
};
```

The `xtzToTokenTokenOutput` function requires 3 values to calculate an output in tzBTC from an input in XTZ: the input amount in XTZ (`xtzIn`), the state of the XTZ pool in the contract (`xtzPool`), and the state of the SIRS pool (`tokenPool`).
Most of the modifications made to the original functions apply to the use of `BigNumber` in order to make it work more smoothly with Taquito.
The function then returns the corresponding amount in tzBTC or `null` if an error occurs.

The `tokenToXtzXtzOutput` function is similar.

After the corresponding amount of XTZ or tzBTC is calculated according to the inputs of the user, the UI unlocks and is ready for a swap.

## Creating the swap transaction

Now that the application has calculated the input and output amounts, it can create the swap request to send to Tezos.
Creating this request requires several steps because there are multiple moving parts that must play in unison.
Here are the beginning steps in the process:

1. When the user clicks the Swap button, the `swap` function in the `src/lib/SwapView.svelte` file runs.
1. First, the function verifies that the input and output values are numbers.
1. It updates the status of the transaction to "loading" and shows a message on the UI.
1. It creates an object of the Taquito type `ContractAbstraction` that represents the LB contract.
1. It calculates the deadline for the transaction, which it passes along with the transaction.
The contract rejects the transaction if the deadline is passed.

```typescript
  const swap = async () => {
    try {
      if (isNaN(+inputFrom) || isNaN(+inputTo)) {
        return;
      }
      swapStatus = TxStatus.Loading;
      store.updateToast(true, "Waiting to confirm the swap...");

      const lbContract = await $store.Tezos.wallet.at(dexAddress);
      const deadline = calcDeadline();

      // ...

      store.updateToast(true, "Swap successful!");
    } catch (error) {
      console.log(error);
      swapStatus = TxStatus.Error;
      store.updateToast(true, "An error has occurred");
    } finally {
      setTimeout(() => {
        swapStatus = TxStatus.NoTransaction;
        store.showToast(false);
      }, 3000);
    }
  };
```

Now the process forks depending on which tokens are being swapped, as described in the following sections:

### Swapping tzBTC for XTZ



PLACE








Now, you have 2 situations: the user selected either XTZ or tzBTC as the token to swap. Let's start with tzBTC as the preparation of the transaction is more complicated:

```typescript=
if (tokenFrom === "tzBTC") {
	const tzBtcContract = await $store.Tezos.wallet.at(tzbtcAddress);
	const tokensSold = Math.floor(+inputFrom * 10 ** tzBTC.decimals);
	let batch = $store.Tezos.wallet
	  .batch()
	  .withContractCall(tzBtcContract.methods.approve(dexAddress, 0))
	  .withContractCall(
		tzBtcContract.methods.approve(dexAddress, tokensSold)
	  )
	  .withContractCall(
		lbContract.methods.tokenToXtz(
		  $store.userAddress,
		  tokensSold,
		  minimumOutput,
		  deadline
		)
	  )
	  .withContractCall(tzBtcContract.methods.approve(dexAddress, 0));
	const batchOp = await batch.send();
	await batchOp.confirmation();
  }
```

The major difference between swapping XTZ to tzBTC and swapping tzBTC to XTZ is that the latter requires 3 additional operations: one to set the current permission for the LB DEX (if any) to zero, one to register the LB DEX as an operator within the tzBTC contract with the amount of tokens that it is allowed to spend on behalf of the user and one to set this amount back to zero and avoid later uses of the given permission.

> _Note 1: you can read more about the behaviors of the tzBTC contract and other FA1.2 contracts [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md)_.

> _Note 2: technically speaking, it is not necessary to set the permission back to zero at the end of the transaction (but setting it to zero at the beginning is required). It's just a common practice to prevent any unexpected pending permission._

First, you create the `ContractAbstraction` for the tzBTC contract as you are about to interact with it. Once done, you calculate the amount of tokens you should approve based on our previous calculations.

> _Note: the `ContractAbstraction` is a very useful instance provided by Taquito that exposes different tools and properties to get details about a given contract or interact with it._

After that, you use the [Batch API](https://tezostaquito.io/docs/batch_api/) provided by Taquito. The Batch API allows grouping multiple operations in a single transaction to save on gas and on processing time. This is how it works:

1. You call the `batch()` method present on the `wallet` or `contract` property of the instance of the `TezosToolkit`
2. This returns a batch instance with different methods that you can use to create transactions, in our example, `withContractCall()` is a method that will add a new contract call to the batch of operations
3. As a parameter for `withContractCall()`, you pass the contract call as if you would call it on its own, by using the name of the entrypoint on the `methods` property of the `ContractAbstraction`
4. In this case, you batch 1 operation to set the permission of the LB DEX within the tzBTC contract to zero, 1 operation to approve the amount required by the swap, 1 operation to confirm the swap within the LB DEX contract, and 1 operation to set the permission of the LB DEX back to zero
5. On the returned batch, you call the `.send()` method to forge the transaction, sign it and send it to the Tezos mempool, which returns an operation
6. You can `await` the confirmation of the transaction by calling `.confirmation()` on the operation returned in the step above.

Notice the penultimate transaction: the `tokenToXtz` entrypoint of the LB contract requires 4 parameters:

- The address of the account that will receive the XTZ
- The amount of tzBTC that will be sold for the swap
- The expected amount of XTZ that will be received
- A deadline after which the transaction expires

After the transaction is sent by calling the `.send()` method, you call `.confirmation()` on the operation object to wait for one confirmation (which is the default if you don't pass a parameter to the method).

### Swapping XTZ to tzBTC

This will be a much easier endeavor! Let's check the code first:

```typescript=
const op = await lbContract.methods
  .xtzToToken($store.userAddress, minimumOutput, deadline)
  .send({ amount: +inputFrom });
await op.confirmation();
```

The `xtzToToken` entrypoint takes 3 parameters:

- The address of the account that will receive the tzBTC tokens
- The expected amount of tzBTC to be received
- The deadline

In addition to that, you have to attach the right amount of XTZ to the transaction. This can be achieved very easily with Taquito.

Remember the `.send()` method that you call on the output of the entrypoint call? If you didn't know, you can pass parameters to this method, one of the most important ones is an amount of XTZ to send along with the transaction. Just pass an object with an `amount` property and a value of the amount of tez you want to attach, and that's it!

Then, just like any other transaction, you get an operation object and call `.confirmation()` on it to wait for the operation to be included in a new block.

### Updating the UI

Whether the swap is successful or not, it is crucial to provide feedback to your users.

If the swap succeeded, you will fetch the user's new balances and provide visual feedback:

```typescript=
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

// visual feedback
store.updateToast(true, "Swap successful!");
```

> _Note: it would also be possible to avoid 2 HTTP requests and calculate the new balances from the amounts that were passed as parameters for the swap. However, the users may have received tokens since the last time the balances were fetched, and it will provide a better user experience if you get the accurate balances after the swap._

If the swap isn't successful, you will be redirected to the `catch` branch where you also have to provide visual feedback and update the UI:

```typescript=
swapStatus = TxStatus.Error;
store.updateToast(true, "An error has occurred");
```

Setting `swapStatus` to `TxStatus.Error` will remove the loading interface you set during the swap before you display a toast to indicate that the transaction failed.

Finally (pun intended), you move to the `finally` branch to reset the UI after 3 seconds:

```typescript=
finally {
  setTimeout(() => {
	swapStatus = TxStatus.NoTransaction;
	store.showToast(false);
  }, 3000);
}
```

### Design considerations

As you can tell from the code involved, swapping tokens is a pretty complex action and there are a few things that you should keep in mind, regarding both the code you write and the UI you create:

- Try to structure your code into different steps that don't mix, for example, step 1: updating the UI before forging the transaction, step 2: forging the transaction, step 3: emitting the transaction, step 4: updating the UI, etc.
- Never forget to provide visual feedback to your users! Baking a new operation can take up to 30 seconds when the network is not congested, and even longer if there is a lot of traffic. The users will wonder what is happening if you don't make them wait. A spinner or a loading animation is generally a good idea to indicate that the app is waiting for some sort of confirmation.
- Disable the UI while the transaction is in the mempool! You don't want the users to click on the _Swap_ button a second time (or third, or fourth!) while the blockchain is processing the transaction they already created. In addition to costing them more money, it can also confuse them and create unexpected behaviors in your UI.
- Reset the UI at the end. Nobody wants to click on the _Refresh_ button after an interaction with the blockchain because the UI seems to be stuck in its previous state. Make sure the interface is in the same (or similar) state as it was when the user first opened it.
