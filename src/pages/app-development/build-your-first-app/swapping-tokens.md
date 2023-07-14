---
id: swapping-tokens
title: Swapping XTZ and tzBTC
authors: Claude Barde
lastUpdated: 10th July 2023
---

## Swapping XTZ and tzBTC

Now, let's go down the rabbit hole and implement the most complex feature of the dapp: the swap of XTZ and tzBTC.

### Designing the UI

I say "the most complex" because the interface you are about to build includes a lot of moving parts and calculations that must be done at the moment of the user's input and confirmation. The Liquidity Baking contract is also a bit picky about the data you must send in order to swap tokens, so you will have to fine-tune our code to make sure that it goes like clockwork!

Here is a screenshot of the UI you are aiming for:

![Swap UI](/images/build-your-first-dapp/swap-ui.png "Swap UI")

There are 2 text inputs, the one on the left is editable and will let the user input the amount of XTZ or tzBTC they want to exchange and the one on the right will be disabled and will display the corresponding amount they'll get in the other token. The button in the middle with the 2 arrows will allow the user to switch the input between XTZ and tzBTC.

Going into the details of how the text inputs are implemented would go beyond the scope of this tutorial, but you can have a look at it in the `UserInput.svelte` file.

### Handling user input

In a nutshell, each input with its token icon and `max` field is the same component, the parent component tracks the position of each to update their UI accordingly. Internally, each input component keeps track of the user's input and the available balance to display error messages if the balance is too low. Each update in the input is dispatched to the parent component to adjust the general UI.

Every time an update is sent to the parent component (`SwapView.svelte`), the data provided with the update is passed to the `saveInput` function:

```typescript=
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

Here, a lot of things happen:

- the values necessary for the calculations of the token amounts are destructured from the `ev.detail` object
- the function verifies that the values are received from the token that is currently active (the one on the left)
- if that token is XTZ, the amount in tzBTC is calculated via the `xtzToTokenTokenOutput` function (more on that below)
- if that token is tzBTC, the amount in XTZ is calculated via the `tokenToXtzXtzOutput` function (more on that below)
- the minimum amount to be expected according to the slippage set by the user is calculated by the `calcSlippage` function

> _Note: the "slippage" refers to the percentage that the user accepts to lose during the trade, a loss of tokens can happen according to the state of the liquidity pools. For example, if 100 tokens A can be swapped for 100 tokens B with a slippage of 1%, it means that you will receive between 99 and 100 tokens B._

### Exchanging XTZ for tzBTC and tzBTC for XTZ

Now, let's have a look at the functions you introduced above, `xtzToTokenTokenOutput` and `tokenToXtzXtzOutput`. They were adapted [from the code in this repo](https://github.com/kukai-wallet/kukai-dex-calculations) and allow you to calculate how many tzBTC a user will get according to the XTZ amount they input and vice-versa.

```typescript=
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

The `xtzToTokenTokenOutput` function requires 3 values to calculate an output in tzBtc from an input in XTZ: the said amount in XTZ (`xtzIn`), the state of the XTZ pool in the contract (`xtzPool`), and the state of the SIRS pool (`tokenPool`). Most of the modifications made to the original functions apply to the use of `BigNumber` in order to make it work more smoothly with Taquito. The function then returns the corresponding amount in tzBTC or `null` if an error occurs.

The same goes for `tokenToXtzXtzOutput`:

```typescript=
export const tokenToXtzXtzOutput = (p: {
  tokenIn: BigNumber | number;
  xtzPool: BigNumber | number;
  tokenPool: BigNumber | number;
}): BigNumber | null => {
  const { tokenIn, xtzPool: _xtzPool, tokenPool } = p;
  let xtzPool = creditSubsidy(_xtzPool);
  let tokenIn_ = new BigNumber(0);
  let xtzPool_ = new BigNumber(0);
  let tokenPool_ = new BigNumber(0);
  try {
    tokenIn_ = new BigNumber(tokenIn);
    xtzPool_ = new BigNumber(xtzPool);
    tokenPool_ = new BigNumber(tokenPool);
  } catch (err) {
    return null;
  }
  if (
    tokenIn_.isGreaterThan(0) &&
    xtzPool_.isGreaterThan(0) &&
    tokenPool_.isGreaterThan(0)
  ) {
    let numerator = new BigNumber(tokenIn)
      .times(new BigNumber(xtzPool))
      .times(new BigNumber(998001));
    let denominator = new BigNumber(tokenPool)
      .times(new BigNumber(1000000))
      .plus(new BigNumber(tokenIn).times(new BigNumber(999000)));
    return numerator.dividedBy(denominator);
  } else {
    return null;
  }
};
```

After the corresponding amount of XTZ or tzBTC is calculated according to the inputs of the user, the UI unlocks and is ready for a swap.

### Creating a swap transaction

Swapping the tokens is pretty intensive as they are multiple moving parts that must play in unison. Let's describe step by step what happens after the user clicks on the _Swap_ button:

```typescript=
const swap = async () => {
    try {
      if (isNaN(+inputFrom) || isNaN(+inputTo)) {
        return;
      }

...

	 } catch (error) {
	      console.log(error);
	      swapStatus = TxStatus.Error;
	      store.updateToast(true, "An error has occurred");
	}
};
```

The `swap` function is triggered when the user clicks the _Swap_ button. The first thing to do is to check if there is a valid value for `inputFrom`, i.e. the token that the user wants to exchange (XTZ or tzBTC), and a valid value for `inputTo`, i.e. the token that the user will receive. There is no point in going further if those two values are not set properly.

Next, you update the UI in order to show the user that the transaction is getting ready:

```typescript=
enum TxStatus {
  NoTransaction,
  Loading,
  Success,
  Error
}

swapStatus = TxStatus.Loading;
store.updateToast(true, "Waiting to confirm the swap...");

const lbContract = await $store.Tezos.wallet.at(dexAddress);
const deadline = calcDeadline();
```

You create an [`enum`](https://www.typescriptlang.org/docs/handbook/enums.html) to represent the status of the transaction (available in the `type.ts` file) and you update the `swapStatus` variable responsible for updating the UI and blocking the inputs. The store is also updated with the `updateToast()` method to get a simple toast to show up in the interface.

After that, you create the `ContractAbstraction` from Taquito in order to interact with the DEX and you also calculate the deadline.

> _Note: the Liquidity Baking contract expects you to pass a deadline for the swap, the transaction will be rejected if the deadline is expired._

#### Swapping tzBTC for XTZ

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

#### Swapping XTZ to tzBTC

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
