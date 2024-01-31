---
title: Learn and play with security
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 11 January 2024
---

# Security

Web3 or the decentralized web introduces a new set of security challenges while reducing risks and enforcing security on the other side.

Users can interact directly with the blockchain network without any third-party protection because the paradigm is now READ-WRITE-OWN. No one is responsible for guarding your keys or seed phrase and protecting you against scams.

On the other hand, cryptography, especially hashing, ensures that the data is never altered or removed without agreement from the supporting network. Clients do not have to trust a centralized provider; implicit trust is built into the blockchain.

### Off chain attacks

Offchain attacks are a serious threat to the security and reliability of decentralized applications. They can exploit various vulnerabilities in the design, implementation, or deployment of smart contracts or user interfaces. Some examples of offchain attacks are:

- Bugs: A bug is a flaw or error in the code or logic of a smart contract or a frontend. For instance, a frontend may point to a non-existent smart contract address or invoke an entrypoint with incorrect parameters. This can result in loss of funds, incorrect execution, or denial of service. Bugs can be avoided by proper testing, auditing, and maintenance of the code.
- Impersonation: An impersonation attack is when an attacker pretends to be someone else, such as a legitimate service provider, a trusted party, or a user. For example, an attacker may create a phishing UI that mimics the appearance and functionality of a real frontend, but sends the user's funds or data to the attacker's address. Alternatively, an attacker may deploy a copy of a contract on the network, with slight modifications that benefit the attacker. Impersonation attacks can be prevented by verifying the identity and authenticity of the parties involved, such as using digital signatures, checksums, or domain verification.
- Replay attacks: A replay attack is when an attacker reuses a valid transaction from one context to another, without the consent or knowledge of the original sender. For example, an attacker may copy a L1 transaction to a L2 transaction, and execute it on a different chain or layer. This can result in double-spending, unauthorized actions, or inconsistent states. Replay attacks can be mitigated by introducing nonce and chain_id fields in the transactions, which ensure that each transaction is unique and valid for a specific context. Alternatively, a timestamp can be used as a nonce, which makes it easy to detect outdated or replayed transactions.
- Trusting and no verifying: This situation occurs when a user or a contract blindly accepts or relies on data or information from an offchain source without verifying its accuracy or integrity. For example, a user may trust an offchain API that provides market data from an oracle or an exchange without checking if the data is correct, manipulated, or even inexistent. Similarly, a user may sign a transaction payload from a wallet without inspecting its content or destination. Trust and no verification can lead to false assumptions, incorrect decisions, or malicious actions. Trust and no verification can be avoided by applying the principle of "trust but verify," which means that any offchain data or information should be validated by multiple sources, cross-checked with onchain data, or confirmed by the user before using it.
- FrontRunning and MEV (Maximum Extractable Value): MEV is an economic phenomenon that can be exploited by miners, validators, and sequencers who can arbitrarily include, exclude, or re-order transactions within the blocks they produce. MEV strategies involve executing a set of on-chain interactions prepared by offchain actors like humans or bots.
  It can be done by the baker itself because the list is known in advance at each period, or by any bots listening to the gossip network.
  Examples of common MEV strategies:

  - Sandwiching: When a large order is spotted on mempool, the attacker buys before and sells the tokens after. The large transaction will raise the price of the token. If you buy before the price increases and sell after the price increases, you earn the difference. If you cannot reorder the transaction yourself like a baker does, you will have to put higher gas, which is called PGA or Priority Gas Auctions.

  - Front running: Bakers and sequencers can simulate any transaction extracted from the mempool and look at the wallet increase of balance. If it is an arbitrage opportunity, then the attacker can decide to copy and place his own transaction before the others.
  - Arbitrage: Arbitrage is the process of buying and selling the same assets across different markets to capitalize on price discrepancies between them. It is not even considered a hack as it is the job of common traders and regulate the global market price

  &rarr; **SOLUTION**: Against MEV, there are a few solutions:

  - Reordering of transactions can be tackled through honest bakers or using Flashbots/Flashbake. Flashbake is proposing a private, off-chain system to send a transaction to a baker. It benefits the Tezos network and its users in a few ways: less mempool congestion and quicker inclusion of not publicly visible transactions.
  - Place an encrypted order, and reveal/execute it later time, or use a feature of Tezos named TimeLock. The goal is the same: hide the transaction until the last moment so no one can place an order ahead of it. This requires a smart contract to handle this kind of order and keep track of previous data to be able to execute the transaction. Anterior currency pairs history values in the context of a swap, for example.

### Onchain attacks

This training session will cover the topic of On-chain attacks, which are cyberattacks that target the blockchain network and its components. On-chain attacks can exploit various types of vulnerabilities, such as:

- Programming errors that affect the security and functionality of smart contracts, which are self-executing agreements that run on the blockchain. Smart contracts can have a larger attack surface than traditional applications, as they interact with other contracts and users on the network and so are subject to higher interest from hackers in draining funds.
- Different kinds of leaks:
  - Replay attacks: These occur when an attacker intercepts and retransmits a valid transaction on a different blockchain network, causing the same transaction to be executed twice.
  - Memory overflow: This happens when a smart contract runs out of memory or enters an unexpected context, allowing attackers to exploit a part of the code.
  - Re-entrancy attacks: These are a type of recursive call vulnerability that allows an attacker to repeatedly call a function within a smart contract before the previous call is finished, resulting in multiple withdrawals or transfers of funds.
- Blockchain user trust and management:
  - Administrators: These are the entities that have the highest level of authority and control over the contract. They can perform actions such as deploying, upgrading, pausing, or terminating the contract.
  - Lambda / mutable code: This refers to the parts of the contract code that can be changed after deployment, such as parameters, variables, or functions.
  - Checking roles: This is the process of verifying whether a user has the right to execute a certain part of the code, such as calling a function or modifying a state variable.
  - Trustable oracles: These are the external sources of data that your contract relies on, such as prices, events, or outcomes.

In this training session, we will use a hands-on approach to learn how to identify, prevent, and mitigate on-chain attacks. We will work with sample code that contains several bugs and vulnerabilities and we will try to fix them step by step. We will also discuss best practices and recommendations for developing secure and reliable smart contracts and blockchain applications.

## Prerequisites

In the next sections, some code needs to be executed. [Taqueria requires to be installed on your machine](https://taqueria.io/docs/getting-started/installation/).

To compile the code, run these commands:

```bash
npm i
TAQ_LIGO_IMAGE=ligolang/ligo:1.1.0 taq compile <MY_CONTRACT_FILE>.jsligo
```

> Alternative: You can use the Ligo compiler directly and it can be installed [here](https://ligolang.org/docs/intro/installation/?lang=jsligo)
> You will have to compile the parameters and the storage yourself. Instead of using the taq command, use this one :
>
> ```bash
> ligo compile contract ./contracts/<MY_CONTRACT_FILE>.jsligo
> ```

---

When you're ready, go to [Part 1: Programming errors](./security/part-1)
