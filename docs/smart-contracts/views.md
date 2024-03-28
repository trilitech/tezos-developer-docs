---
title: Views
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 26 March 2024
---

Views are a way for contracts to expose information to other contracts and to off-chain consumers.

Views help you get around a limitation in smart contracts: a smart contract can't access another contract's storage.
Smart contracts can provide information via callbacks, but using a callback means calling entrypoints, which is an asynchronous action.

By contrast, views are synchronous; a contract can call a view and use the information that it returns immediately.

Like entrypoints, views can accept parameters, access the contract's storage, and call other views.
Unlike entrypoints, views return a value directly to the caller.
However, views can't cause side effects, so they can't create operations, including calling smart contracts and transferring tez.
Views also can't change the contract storage.

Nodes can run views without creating any operations, which lets off-chain users get a node to run a view and return the result immediately, as a convenient way to get information from a smart contract.

## Types of views

Contracts can store the source code of their views either _on-chain_ or _off-chain_:

  - The code of on-chain views is stored in the smart contract code itself, like entrypoints.
  - The code of off-chain views is stored externally, usually in decentralized data storage such as IPFS.
  The contract metadata has information about its off-chain views that consumers such as indexers and other dApps use to know what off-chain views are available and to run them.

On-chain and off-chain views have the same capabilities and limitations.

## Examples

Views can provide information about tokens.
You can use views to provide an account's balance of a token type or the total amount of a token in circulation.

DEXs can provide the exchange rate between two tokens or the amount of liquidity in the pool.

Instead of repeating certain logic in multiple places, you can put the logic in a view and use it from different smart contracts.

## Creating views in JsLIGO

Views in LIGO look like entrypoints because they receive the input values and storage as parameters, but they have the `@view` annotation instead of the `@entry` annotation.
They return a value instead of a list of operations and the new value of the storage.

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

This view returns a value from a big-map in storage:

```ts
type storageType = big_map<string, string>;

@view
const get = (key: string, s: storageType): string => {
  const valOpt = Big_map.find_opt(key, s);
  return match(valOpt) {
    when(Some(val)): val;
    when(None): "";
  }
}
```

## Calling views in JsLIGO

This JsLIGO code calls the `get_larger` view from the previous example by passing the target contract address, parameters, and view name to the `Tezos.call_vew()` function:

```ts
@entry
const callView = (_i: unit, _s: storage): return_type => {
  const resultOpt: option<int> = Tezos.call_view(
    "get_larger", // Name of the view
    [4, 5], // Parameters to pass
    "KT1Uh4MjPoaiFbyJyv8TcsZVpsbE2fNm9VKX" as address // Address of the contract
  );
  return match(resultOpt) {
    when (None):
      failwith("Something went wrong");
    when (Some(result)):
      [list([]), result];
  }
}
```

If the view takes no parameters, pass a Unit type for the parameter:

```ts
const unitValue: unit = [];
const resultOpt: option<int> = Tezos.call_view(
  "no_param_view", // Name of the view
  unitValue, // No parameter
  "KT1Uh4MjPoaiFbyJyv8TcsZVpsbE2fNm9VKX" as address // Address of the contract
);
```

## Creating views in SmartPy

Views in SmartPy look like entrypoints because they receive the `self` object and input values as parameters, but they have the `@sp.onchain_view` annotation instead of the `@sp.entrypoint` annotation.

This SmartPy view returns the larger of two integers:

```python
@sp.onchain_view
def get_larger(self, a, b):
    sp.cast(a, sp.int)
    sp.cast(b, sp.int)
    if a > b:
        return a
    return b
```

This view returns a value from a big-map in storage:

```python
@sp.onchain_view
def get(self, key):
  valOpt = self.data.myBigmap.get_opt(key)
  if valOpt.is_some():
    return valOpt.unwrap_some()
  else:
    return ""
```

## Calling views in SmartPy

In SmartPy tests, you can call views in the contract just like you call entrypoints.
However, due to a limitation in SmartPy, if the view accepts multiple parameters, you must pass those parameters in a record.
For example, to call the `get_larger` view in the previous example, use this code:

```python
viewResult = contract.get_larger(sp.record(a = 4, b = 5))
scenario.verify(viewResult == 5)
```

To call a view in an entrypoint, pass the view name, target contract address, parameters, and return type to the `sp.view()` function, as in this example:

```python
@sp.entrypoint
def callView(self, a, b):
    sp.cast(a, sp.int)
    sp.cast(b, sp.int)
    viewResponseOpt = sp.view(
        "get_larger", # Name of the view
        sp.address("KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj"), # Address of the contract
        sp.record(a=a, b=b), # Parameters to pass
        sp.int # Return type of the view
    )
    if viewResponseOpt.is_some():
        self.data.myval = viewResponseOpt.unwrap_some()
```

If the view takes no parameters, pass `()` for the parameter:

```python
viewResponseOpt = sp.view(
    "no_param_view", # Name of the view
    sp.address("KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj"), # Address of the contract
    (), # No parameter
    sp.int # Return type of the view
)
```

## Calling views with Taquito

Calling a view with Taquito is similar to calling entrypoints.
When you create an object to represent the contract, its `contractViews` property has a method for each view, which you can call as in this example:

```javascript
const viewContractAddress = "KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj";
const contract = await Tezos.wallet.at(viewContractAddress);
const result = await contract.contractViews.get_larger({a: 2, b: 12})
  .executeView({ viewCaller: viewContractAddress });
console.log(result);
```

## Calling views with the Octez client

To call a view with the Octez client, use the `run view` command, as in this example:

```bash
octez-client run view "get_larger" on contract "KT1Uh4MjPoaiFbyJyv8TcsZVpsbE2fNm9VKX" with input "Pair 4 5"
```

If the view takes no parameters, you can pass Unit or omit the `with input`.
<!-- TODO link to info on encoding param values -->

## Implementation details

- Octez: [On-chain views](https://tezos.gitlab.io/active/views.html)
- Archetype: [View](https://archetype-lang.org/docs/reference/declarations/view)
- SmartPy: [Views in testing](https://smartpy.io/manual/scenarios/testing_contracts#views)
- LIGO: [On-chain views](https://ligolang.org/docs/protocol/hangzhou#on-chain-views)
- Taquito: [On-chain views](https://tezostaquito.io/docs/on_chain_views)
