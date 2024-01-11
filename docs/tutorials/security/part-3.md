---
title: 'Part 3: User trust & management'
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 11 January 2024
---

> Note : clone this [project](https://github.com/marigold-dev/training-security-3.git) for compiling and testing this tutorial

1. Governance :

A decentralized system is not enough to ensure the security and efficiency of a blockchain network. It also requires a robust governance model that can handle conflicts, upgrades, and innovations. Moreover, the distribution of the native token that powers the network should be fair and balanced, avoiding concentration of power and wealth among a few actors. If these conditions are not met, the decentralized system may suffer from instability, stagnation, or manipulation. Therefore, it is important to design and implement a governance model and a token distribution strategy that align with the goals and values of the network and its users

One of the challenges of designing and deploying a smart contract is to define the roles and permissions of the different parties involved in the execution of the contract. The question is who can do what ?

- Who can create, modify, or terminate the contract?
  - creation : A smart contract is generally deploy by a devops person or a CI pipeline. Apart of knowing the creator address and the fees he paid, there is no critical event that can appear at this moment. The only hack here who be to impersonate another company smart contract, like discussed on the introduction of this training
  - update : By nature a smart contract code cannot be modified because it is immutable. There is an exception below on Chapter 2
  - deletion : By nature a smart contract cannot be deleted because the code is stored on a block forever and can be called/executed at any time. The only way to terminate a smart contract would be to programmatically have a boolean to enable/disable all entrypoints
- Who can invoke, monitor, or verify the contract functions?
  - invocation : This depends on the role based access set on each entrypoints. By default, all annotated `@entry` functions are exposed and are callable.
    &rarr; **SOLUTION** : Be very careful thinking about who has to right the call each of your entrypoints, one of the best practices for writing secure and reliable code is to always check the validity and trustworthiness of the inputs and outputs of your functions. This means that you should **verify either the sender or the source** every time at the beginning of your function to act as a guard against malicious or erroneous data
    [Look here for another way of doing RBAC with Tezos tickets](https://github.com/marigold-dev/training-dapp-3)
  - monitoring : Anyone can do this. Most famous ones are indexers, but there is no professional alerting system so far.
  - verification : By nature, everyone can verify the code. Sometimes the code is audited and a report is available.
    &rarr; **SOLUTION** : Read the audit if available or verify the code yourself. However, the code deployed is in Michelson and the reverse engineering is not really easy. Tools are missing for now for normal humans, nevertheless if the contract is TZIP16-compliant it can refer to the Ligo source code, so you can recompile and compare the outputs
- Who can resolve disputes or enforce penalties in case of contract violations?
  If the contract itself does not contain a function to resolve it, there is no resolution that can happen onchain.
  &rarr; **SOLUTION** : Use onchain dispute if available, or off-chain dispute but this latter introduces additional complexities such as Know Your Customer (KYC) regulations and legal considerations. KYC regulations require businesses to verify the identity of their clients. This can be difficult in the context of blockchain transactions, which are often pseudonymous. Legal considerations can also be complex, especially in cross-border transactions where different jurisdictions may have different laws.

2. Lambda, mutable code and dynamic entrypoints

A smart contract is immutable but not the storage that represents the mutable state.
A common way to change the behavior of a smart contract is to store some mutable code inside its storage and then execute it from the smart contract itself.

This feature presents a **high risk and break the trust** you can have on the execution of the contract. If the governance is not clear and transparent, an administrator can potentially push any function and drain your funds from this contract. It is recommended to read carefully the code to see which kind of action can be done through this lambda. A lambda can access the contract's state and call other functions.
For example, if the lambda is called in a function in order to update a static data configuration that has few impact, then it is not necessary dangerous. But if the lambda is able to create an operation that can be executed or is returning false information to fool the user over a transaction, then it is a red flag

> Other technics exist to update a dapp like the proxy pattern. It does not change the code of the smart contract, but deployed a new version of it and a proxy contract will redirect the user transaction to this new contract. The risk is located on the proxy contract. If this contract is hacked and badly protected, anyone can deploy a malicious contract and redirect to it

[An excellent tutorial here about smart contract upgrades using Lambda and proxies](https://github.com/marigold-dev/training-dapp-4)

3. (Trustable) oracles

Blockchain oracles are third-party services that provide smart contracts with external information1. They serve as bridges between blockchains and the outside world, allowing smart contracts to access off-chain data. Oracles verify, query, and authenticate external data sources, and transmit any valuable data.

A Oracle is composed with two parts :

- offchain : the data collector who push it to the onchain contract
- onchain : the contract storing the data on its storage and exposed it to other contracts. Generally a call for information involve monetization, and so fees.

Who control the Oracle ?
It can be a single company or person. So they can manipulate the data, being hacked or the service can go down and block the full flow of execution.

&rarr; **SOLUTION** :

- use many decentralized Oracles :
  - to avoid collusion : more actors equals less centralize power
  - to avoid that only one Oracle affects to much the volatility. Several sources average is better than relying to only one source, especially on CEX/DEX with few volumes
- always take Oracles providing timestamp : each data should have a validity date associated to it otherwise it is almost impossible to apply to correct data and verify afterwards

There are some provider on the market claiming to have decentralized Oracles or ZK execution :

- [Chainlink](https://chain.link/whitepaper)
- [Acurast](https://docs.acurast.com/acurast-protocol/architecture/architecture/)
