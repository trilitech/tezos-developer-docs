---
title: 'Part 3: User trust & management'
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 11 January 2024
---

## Governance

A decentralized system is not enough to ensure the security and efficiency of a blockchain network. It also requires a robust governance model that can handle conflicts, upgrades, and innovations. Moreover, the distribution of the native token that powers the network should be fair and balanced, avoiding the concentration of power and wealth among a few actors. If these conditions are not met, the decentralized system may suffer from instability, stagnation, or manipulation. Therefore, it is important to design and implement a governance model and a token distribution strategy that aligns with the goals and values of the network and its users.

One of the challenges of designing and deploying a smart contract is to define the roles and permissions of the different parties involved in the execution of the contract. The question is who can do what?

- Who can create, modify, or terminate the contract?
  - Creation: A smart contract is generally deployed by a DevOps person or a CI pipeline. Apart from knowing the creator's address and the fees they paid, there is no critical event that can appear at this moment. The only hack here would be to impersonate another company's smart contract, as discussed in the introduction of this training.
  - Update: By design, a smart contract code cannot be modified because it is immutable. However, lambdas are an exception, as described in the next section.
  - Deletion: By design, a smart contract cannot be deleted because the code is stored on a block forever and can be called/executed at any time. The only way to terminate a smart contract would be to programmatically have a boolean to enable/disable all entrypoints.
- Who can invoke, monitor, or verify the contract functions?
  - Invocation: This depends on the role-based access set on each entrypoints. By default, all annotated `@entry` functions are exposed and are callable.
    &rarr; **SOLUTION**: Be very careful about who has the right to call each of your entrypoints. One of the best practices for writing secure and reliable code is to always check the validity and trustworthiness of the inputs and outputs of your functions. This means that you should **verify either the sender or the source** every time at the beginning of your function to act as a guard against malicious or erroneous data.
    [Look here for another way of doing RBAC with Tezos tickets](https://github.com/marigold-dev/training-dapp-3).
  - Monitoring: Anyone can do this. The most famous ones are indexers, but there is no professional alerting system so far.
  - Verification: By design, everyone can verify the code. Sometimes the code is audited and a report is available.
    &rarr; **SOLUTION**: Read the audit if available or verify the code yourself. However, the code deployed is in Michelson and the reverse engineering is not easy. Tools are missing for how to reverse engineer contracts; nevertheless if the contract is TZIP16-compliant it can refer to the LIGO source code, so you can recompile and compare the outputs.
- Who can resolve disputes or enforce penalties in case of contract violations?
  If the contract itself does not contain a function to resolve it, no resolution can happen on-chain.
  &rarr; **SOLUTION**: Use on-chain dispute if available, or off-chain dispute but this latter introduces additional complexities such as Know Your Customer (KYC) regulations and legal considerations. KYC regulations require businesses to verify the identity of their clients. This can be difficult in the context of blockchain transactions, which are often pseudonymous. Legal considerations can also be complex, especially in cross-border transactions where different jurisdictions may have different laws.

## Lambda, mutable code, and dynamic entrypoints

A smart contract is immutable but not the storage that represents the mutable state.
A common way to change the behavior of a smart contract is to store some mutable code inside its storage and then execute it from the smart contract itself.

This feature presents a **high risk and breaks the trust** you can have in the execution of the contract. If the governance is not clear and transparent, an administrator can potentially push any function and drain your funds from this contract. It is recommended to read carefully the code to see which kind of action can be done through this lambda. A lambda can access the contract's state and call other functions.
For example, if the lambda is called in a function to update a static data configuration that has few impacts, then it is not necessarily dangerous. But if the lambda can create an operation that can be executed or is returning false information to fool the user over a transaction, then it is a red flag.

> Other techniques exist to update a dApp, like the proxy pattern. It does not change the code of the smart contract, but deployed a new version of it and a proxy contract will redirect the user transaction to this new contract. The risk is located on the proxy contract. If this contract is hacked and badly protected, anyone can deploy a malicious contract and redirect to it.

For an example of upgrading smart contracts with lambdas and proxies, see [Create your minimum dapp on Tezos](/tutorials/dapp).

## (Trustable) oracles

Blockchain oracles are third-party services that provide smart contracts with external information. They serve as bridges between blockchains and the outside world, allowing smart contracts to access off-chain data. Oracles verify, query, and authenticate external data sources, and transmit any valuable data.

An [Oracle](/smart-contracts/oracles) is made of two parts:

- Off-chain: The data collector that pushes data to the on-chain contract
- On-chain: The contract that stores the data and exposes it to other contracts. Generally, a call for information involves monetization and so, some fees apply.

Who controls the oracle?
A single company or person may control the oracle. In this case, they can manipulate the data, be hacked, or the service can go down and block the full flow of execution.

&rarr; **SOLUTION**:

- Use many decentralized oracles:
  - More actors equals less centralized power and prevents collusion.
  - Using several oracles prevents a single oracle from affecting the volatility. Using the average of several sources is better than relying on only one source, especially on CEX/DEX with few volumes.
- Always use oracles that provide timestamps: data should have a validity date associated, otherwise it is almost impossible to apply to correct data and verify afterward.

There are some providers on the market claiming to have decentralized Oracles or ZK execution:

- [Chainlink](https://chain.link/whitepaper)
- [Acurast](https://docs.acurast.com/acurast-protocol/architecture/architecture/)
