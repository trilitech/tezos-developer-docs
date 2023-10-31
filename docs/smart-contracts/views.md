---
title: Views
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
lastUpdated: 5th October 2023
---

Views are a way for contracts to expose information to other contracts.

A view is similar to an entrypoint, with a few differences:

- Views return a value.
- Contracts can call views and use the returned values immediately.
In other words, calling a view doesn't produce a new operation.
The call to the view runs immediately and the return value can be used in the next instruction.
- Calling a view doesn't have any effect other than returning that value.
In particular, it doesn't modify the storage of its contract and doesn't generate any operations.

## Example View

Here is an example that uses a view.
The following contract is a ledger that handles a fungible token and keeps track of how many tokens are owned by each user.

<table>
  <caption>Ledger contract</caption>
  <thead>
    <tr>
      <th>Storage</th>
      <th>Entrypoint effects</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <ul>
          <li><code>ledger</code>: <code>big-map</code>
            <ul>
              <li>Key:<ul>
                  <li><code>user</code>: <code>address</code></li>
                </ul>
              </li>
              <li>Value:<ul>
                  <li><code>tokens</code>: <code>nat</code></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li><code>view getBalance(user: address)</code>
            <ul>
              <li>return <code>ledger[user].tokens</code></li>
            </ul>
          </li>
          <li><code>transfer(nbTokens, destination)</code>
            <ul>
              <li>Check that <code>tokens[caller].tokens &gt;= nbTokens</code></li>
              <li>Create an entry <code>tokens[destination]</code> (<code>value = 0</code> if it doesn't exist)</li>
              <li>Add <code>nbTokens</code> to <code>tokens[destination].nbTokens</code></li>
              <li>Subtract <code>nbTokens</code> from <code>tokens[caller].nbTokens</code></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Another contract might provide an `equalizeWith` entrypoint such that if they have more tokens than another user, they can make their balances equal (plus or minus one if the total amount is odd).
The following example code for this contract takes advantage of the `getBalance(user)` view of the first contract: to determine the balance of each user:

```javascript
equalizeWith(destination)
  destinationBalance = ledger.getBalance(destination)
  totalBalance = ledger.getBalance(caller) + destinationBalance
  targetBalance = totalBalance // 2
  ledger.transfer(targetBalance - destinationBalance, destination)
```

## Implementation details

- Michelson: [Operations on views](https://tezos.gitlab.io/active/michelson.html#operations-on-views)
- Archetype: [View](https://archetype-lang.org/docs/reference/declarations/view)
- SmartPy: [Views in testing](https://smartpy.io/manual/scenarios/testing_contracts#views)
- LIGO: [On-chain views](https://ligolang.org/docs/protocol/hangzhou#on-chain-views)
