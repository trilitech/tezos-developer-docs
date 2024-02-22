---
title: Views
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 22 February 2024
---

Views are a way for contracts to expose information to other contracts and to off-chain consumers.

Views help you get around a limitation in smart contracts: a smart contract can't access another contract's storage.
Smart contracts can provide information via callbacks, but using a callback means calling entrypoints, which is an asynchronous action.

By contrast, views are synchronous; a contract can call a view and use the information that it returns immediately.

Like entrypoints, views can accept parameters, access the contract's storage, and call other views.
Unlike entrypoints, views return a value directly to the caller.
However, views can't create operations, including calling smart contracts and transferring tez.
Views also can't change the contract storage.

A node can run a view without creating any operations, which lets developers use views without paying fees.
You can call the view from sources such as the Octez client and Taquito and get a response immediately from a node.

## Examples

Views can provide information about tokens.
You can use views to provide an account's balance of a token type or the total amount of a token in circulation.

DEXs and liquidity pools can provide the exchange rate between two tokens or the amount of liquidity in the pool.

Instead of repeating certain logic in multiple places, you can put the logic in a view and use it from different smart contracts.

## Creating views

In high-level languages, views look a lot like entrypoints because they take an input value and the contract storage as inputs.
Unlike entrypoints, they return only a value, without a list of operations.

### JsLIGO

This JsLIGO view returns the larger of two numbers:

```ts
type get_larger_input = [int, int];

@view
const get_larger = (input: get_larger_input, _s: storage): int => {
  const [a, b] = input;
  if (a > b) {
    return a;
  }
  return b;
}
```

### SmartPy

This SmartPy view does the same thing:

```python
@sp.onchain_view
def get_larger(self, a, b):
    sp.cast(a, sp.int)
    sp.cast(b, sp.int)
    if a > b:
        return a
    return b
```

## Calling views

Calling views from smart contracts is similar to calling entrypoints.

### JsLIGO

This JsLIGO code calls the views from the previous examples by passing the target contract address, parameters, and view name to the `Tezos.call_vew()` function:

```ts
@entry
const callView = (_i: unit, _s: storage): return_type => {
  const resultOpt: option<int> = Tezos.call_view(
    "get_larger",
    [4, 5],
    "KT1Uh4MjPoaiFbyJyv8TcsZVpsbE2fNm9VKX" as address
  );
  return match(resultOpt) {
    when (None):
      failwith("Something went wrong");
    when (Some(result)):
      [list([]), result];
  }
}
```

### SmartPy

This SmartPy code calls the views from the previous examples by passing the view name, target contract address, parameters, and return type to the `sp.view()` function:

```python
@sp.entrypoint
def callView(self, a, b):
    sp.cast(a, sp.int)
    sp.cast(b, sp.int)
    viewResponseOpt = sp.view(
        "get_larger",
        sp.address("KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj"),
        sp.record(a=a, b=b),
        sp.int
    )
    if viewResponseOpt.is_some():
        self.data.myval = viewResponseOpt.unwrap_some()
```

### Taquito

Calling a view with Taquito is similar to calling entrypoints.
When you create an object to represent the contract, its `contractViews` property has a method for each view, which you can call as in this example:

```javascript
const viewContractAddress = "KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj";
const contract = await Tezos.wallet.at(viewContractAddress);
const result = await contract.contractViews.get_larger({a: 2, b: 12})
  .executeView({ viewCaller: viewContractAddress });
console.log(result);
```

### Octez client

To call a view with the Octez client, use the `run view` command, as in this example:

```bash
octez-client run view "get_larger" on contract "KT1Uh4MjPoaiFbyJyv8TcsZVpsbE2fNm9VKX" with input "Pair 4 5"
```
<!-- TODO link to info on encoding param values -->

## Implementation details

- Michelson: [Operations on views](https://tezos.gitlab.io/active/michelson.html#operations-on-views)
- Archetype: [View](https://archetype-lang.org/docs/reference/declarations/view)
- SmartPy: [Views in testing](https://smartpy.io/manual/scenarios/testing_contracts#views)
- LIGO: [On-chain views](https://ligolang.org/docs/protocol/hangzhou#on-chain-views)
- Taquito: [On-chain views](https://tezostaquito.io/docs/on_chain_views)
