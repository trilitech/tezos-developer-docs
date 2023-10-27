---
title: Delegation
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
lastUpdated: 5th October 2023
---

Placing your tez in a smart contract means you can't stake them towards baking or delegate them to get rewards.
However, the smart contract itself can delegate the tez it holds and  distribute the rewards to the original owners of the tez or keep them in its balance.

To manage delegation, you can implement these features:

- Set, update, or remove the address of the baker that you want the contract to delegate its tez to (`SET_DELEGATE`).
- Obtain the voting power of a contract (a delegate), which is based on its total staking balance as computed at the beginning of the voting period (`VOTING_POWER`).
- Obtain the total voting power of all contracts (`TOTAL_VOTING_POWER`).

In practice, both the voting power of a contract and the total voting power of all contracts are expressed as a number of mutez, but this may change with time as the protocol evolves.

## Implementation details

- Michelson: [Operations on contracts](https://tezos.gitlab.io/active/michelson.html#operations-on-contracts).
- Archetype: [Total voting power](https://archetype-lang.org/docs/reference/expressions/constants#total_voting_power), [Voting power](https://archetype-lang.org/docs/reference/expressions/builtins#voting_power%28k%20:%20key_hash%29), [set_delegate](https://archetype-lang.org/docs/reference/expressions/builtins#set_delegate%28opkh%20:%20option%3Ckey_hash%3E%29).
- SmartPy: [Operations](https://smartpy.io/manual/syntax/operations).
