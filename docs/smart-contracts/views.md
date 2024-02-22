---
title: Views
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 19 February 2024
---

Views are a way for contracts to expose information to other contracts and to off-chain consumers.

A view is similar to an entrypoint, with a few differences:

- Views return a value.
- Calls to views are synchronous, which means that contracts can call views and use the returned values immediately.
In other words, calling a view doesn't produce a new operation.
The call to the view runs immediately and the return value can be used in the next instruction.
- Calling a view doesn't have any effect other than returning that value.
In particular, it doesn't modify the storage of its contract and doesn't generate any operations.
- Views do not include the transfer of any tez and calling them does not require any fees.

## Examples

Views can provide information about tokens.
For example, the [FA2 standard](../architecture/tokens/FA2) suggests that contracts provide several views, including a view that provides the amount of a token that a specified account owns.

Views can provide information about the storage of contracts in a more convenient format.
Contracts can't directly access other contracts' storage, but they can use views to get information such as a value from a big-map for a specific index.

Views can run logic or processing, like logic that you want to externalize rather than repeat in multiple places.
For example, a view might run a mathematical operation like calculating the average or median of a list of numbers.

## Creating views

In high-level languages, views look a lot like entrypoints because they take an input value and the contract storage as inputs.
Unlike entrypoints, they return only a value, without a list of operations.

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

Calling a view with Taquito is similar to calling entrypoints.
When you create an object to represent the contract, its `contractViews` property has a method for each view, which you can call as in this example:

```javascript
const viewContractAddress = "KT1K6kivc91rZoDeCqEWjH8YqDn3iz6iEZkj";
const contract = await Tezos.wallet.at(viewContractAddress);
const result = await contract.contractViews.get_larger({a: 2, b: 12})
  .executeView({ viewCaller: viewContractAddress });
console.log(result);
```

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
