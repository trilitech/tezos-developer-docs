---
id: oracles
title: Using and trusting Oracles
authors: 'Mathias Hiron, Nomadic Labs'
lastUpdated: 29th June 2023
---

## The oracle problem

### The need for off-chain data

To be used in many domains and bring the benefits of a decentralized blockchain like Tezos, smart contracts need ways to interact with the rest of the world. More specifically, they need access to outside information, **off-chain data**, to base their decisions.

For example, an insurance smart contract may need access to information about the weather, to determine if an insurance claim related to a flood should be accepted. We could also imagine an insurance service that gets triggered when someone's flight is canceled or delayed or a service that depends on whether a package has been delivered in time or on the current location of a container ship. Access to all kinds of other data, such as the results of an election, or the outcome of a sports match, could be required for some applications of smart contracts.

As smart contracts often involve financial transactions, getting information about exchange rates or the current price of some commodities is one of the most common needs for off-chain data. As an example, [stablecoins](/defi/stablecoins) rely on frequent access to the exchange rates of the corresponding currencies to peg the token to the value of an off-chain currency.

Another particular type of need for off-chain data is off-chain computation. On-chain computation can be very costly, as it needs to be performed by every single node of the blockchain. Off-chain computation is much cheaper and may be the only reasonable solution in many cases, but needs to be verifiable on-chain.

### Fetching off-chain data wouldn't work

A naïve answer to the need for off-chain data would be to allow a smart contract to do an HTTPS request to an API and use the response directly.

However, this can't work at all for several reasons:
- **Consistency**: all the nodes from a blockchain execute every single contract call included in each block. For the blockchain to stay consistent, it is absolutely necessary that all these executions produce the same exact result. When calling the same external API, different nodes may receive a different output. This would break this consistency requirement, with huge consequences for the blockchain. An HTTP API can't guarantee consistency.

- **Performance**: each node needs to execute every transaction and contract call in the same order and needs to do so fast. Network calls in the middle of the execution of smart contracts would require waiting for the response and slow the whole blockchain.

- **Reliability**: if a call to a smart contract is included in a block, then the external API it depends on stops working and the nodes have no way of executing the block and computing the new context. The whole blockchain would simply fail. Not only do we need to absolutely guarantee that the effect of every transaction can be computed by every node when the new block is added but we also need to be able to recompute and verify everything far in the past. Indeed, anyone being able to verify everything from the very beginning of a chain is one of the key properties and benefits of blockchain, which makes the system trustworthy and enables many use cases.

### Injecting off-chain data by calling smart contracts

Since smart contracts can't directly fetch off-chain data, this means this data needs to be injected from the outside world.

Injecting data into a smart contract is easy: it's a simple matter of calling it and passing the data as parameter.

Doing so doesn't cause any **consistency** issue: once the transaction is injected and included in a block, every node receives and executes the same transaction, which is sent to them along with the rest of the block.

There are no **performance** issues either, as the data is immediately available as parameters of the smart contract when executed.

In terms of **reliability**, the decentralized architecture of the blockchain makes it extremely resilient and guarantees that the execution will take place once the transaction is added to the next block and this block becomes final.

However, we haven't done much more than move the problem somewhere else:
- The blockchain can't guarantee that some off-chain entity will indeed send the data as it is needed by the smart contract.
- If the data is sent by a single off-chain entity, we may entirely lose the trustless aspect of the blockchain: we would have to trust that this entity doesn't send invalid data.

These are precisely the problems that an **oracle** is meant to solve.

### Strong incentives to inject incorrect data

It is important, when thinking about developing or using oracles, to keep in mind that attackers have a lot to gain by manipulating data returned by oracles.

Many smart contracts make decisions based on these values and some of these decisions may involve very large amounts of money.

A transaction that seems like a very good deal when looking at some data provided by an oracle could turn out to be a terrible decision and cost huge amounts of money if that data was invalid.

Small changes in the value returned by an oracle can be used, with the help of flash loans, to extract very large amounts of tokens.

News about attacks due to manipulated oracle data are frequent and often involve losses in the millions of dollars. It isn't always clear whether they are caused by attacks or simple flukes.

Here are a few recent (at the time of writing) examples:
- March 15th 2022: [DeFi platform Deus Finance has suffered a \$3 million exploit resulting from the manipulation of its price oracle.](https://cryptobriefing.com/deus-finance-suffers-3m-oracle-exploit/)
	*"... the flash loan has managed to manipulate the oracle that updates the price from the USDC/DEI pools in Solidly and Spirit. The attack has caused a depeg between the token pair, resulting in a cascade of liquidations and users becoming insolvent."*
- May 9th 2022: [DeFi Lending Protocol Fortress Loses All Funds in Oracle Price Manipulation Attack](https://cryptonews.com/news/defi-lending-protocol-fortress-loses-all-funds-oracle-price-manipulation-attack.htm).
	*"Blockchain security firm Blocksec detailed that the Chain oracle used by Fortress lacked power verification, which enabled anyone to hijack it."*
- June 17th 2022: [Inverse Finance exploited again for \$1.2M in flash loan oracle attack](https://cointelegraph.com/news/inverse-finance-exploited-again-for-1-2m-in-flashloan-oracle-attack).
	*"Just two months after losing \$15.6 million in a price oracle manipulation exploit, Inverse Finance has again been hit with a flash loan exploit that saw the attackers make off with \$1.26 million in Tether (USDT) and Wrapped Bitcoin (wBTC). ... The latest exploit worked by using a flash loan to manipulate the price oracle for a liquidity provider (LP) token used by the protocol’s money market application. This allowed the attacker to borrow a larger amount of the protocol’s stablecoin, Dola (DOLA), than the amount of collateral they posted, letting them pocket the difference."*

## Who can we trust to reliably send accurate data?

For simplicity, let's first assume there exists a reliable official source of accurate data, that can be accessed through a secure HTTPS API.

Let's go through a few ways that this data could be sent to a contract and discuss how well they could work.

### Setting up your own off-chain service

One possibility would be to create your own off-chain service that simply fetches data from this source when your contract needs it and calls the contract when it needs it.

Question: can you tell what the issues would be with this approach?

This wouldn't solve either of the two problems listed above.

Indeed, users of your contracts:
- can't be certain that you will always keep your service running.
- can't be certain that you won't change the data before sending it.

The whole point of a smart contract on a blockchain is that even the authors of the contract shouldn't need to be trusted.

### Letting the source send the data

One possibility, in theory, would be to convince the official entity to directly call your contract with the data, any time it needs it. 

You would just need to collect the address of that entity's official account on the blockchain and your contract would verify that the call comes from this address any time a call to send new data is made.

However, expecting this entity to do that for every contract is completely unrealistic. At most, they could do that once for a single contract on that blockchain.

This is indeed one aspect of what oracles do: they provide a contract that is responsible for collecting some off-chain data, then make it available to other smart contracts. This simplifies the work of the off-chain services that will send the data.

However, even calling a single contract on the blockchain you are using is still way too much to expect from most entities. You can't expect most companies to send regular data updates to one contract for every blockchain that may need it, or even to a single blockchain. Most potential sources of data are not directly involved in blockchains at all (yet).

### Using data signed by the source

There is one straightforward approach we could ask for the official source of the data to perform, in order to make it easy to then reliably and accurately transmit this data: include a digital signature with the data that is made available through the HTTPS API.

Having the source include a signature in the messages it provides through its API and publishing its corresponding public key, makes it possible to trust these messages without having to trust the transmitter who then sends it to a smart contract. No matter how many intermediaries manipulate the data between its source and destination, the receiver, in our case the smart contract, can check the signature and verify that the data comes from the source and has not been tampered with.

This means that anyone at all can play the role of the transmitter. This solves both our issues:
- It is reliable: anyone can fetch the data through HTTPS, then call the contract, so it doesn't rely on any single intermediate.
- It is secure and accurate: the data can't be tampered with as long as the private key of the source is not compromised.

Of course, this is assuming that the source entity itself is reliable and provides accurate data.

On Tezos, this approach is used by the [**Harbinger oracle**](https://github.com/tacoinfra/harbinger#harbinger). It fetches signed price data from [**Coinbase pro**](https://pro.coinbase.com/).

Unfortunately, at the moment, only a small number of data sources include digital signatures with their data. This is something we can hope will change in the future, as this approach is relatively easy for the source to set up and is not specific to any blockchain or even specific to blockchains in general.

### Trusted Execution Environments (TEEs)

There exist computing architectures, that can execute software with several guarantees:
- The software that is executed has a certain specific hash and has not been tampered with
- The SSL connection used to fetch data from the source has not been tampered with
- The computer running the software has not been tampered with
- A cryptographic signature can be added to the output of the software, proving it has been produced on this architecture.

These architectures are called [**Trusted Execution Environments (TEEs)**](https://en.wikipedia.org/wiki/Trusted_execution_environment).

Using such an architecture, we can run software that:
- Fetches the data from the HTTPS API of the source.
- Signs it.
- Includes a proof that the data has been fetched:
	- through this specific HTTPS API
	- by a specific public piece of code
	- and not been tampered with
- Makes it available

The resulting message would be as secure as the source message but would contain an added signature and proof, that the contract could verify. In a sense, it's a service that securely adds a signature to any data from an HTTPS API that doesn't already provide one.

There is however some assumption of trust required:
- Trust that the software and the architecture are not flawed
- Trust that the provider of this architecture won't manipulate the data.

Providers of such architecture include :
- Google, through Android and its [SafetyNet](https://developer.android.com/training/safetynet) security model.
- Amazon, with [AWS Nitro enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/?nc1=h_ls).
- Intel’s [Software Guard eXtensions (SGX)](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html).
- ARM’s [TrustZone](https://www.arm.com/technologies/trustzone-for-cortex-m).

A really good advantage of this approach is that once the configuration and software required to set up a service using one of these architectures have been released, anyone can run them, as these architectures are often cloud-based and available to anyone, for a fee.

The corresponding companies are major international actors, with a lot more to lose in terms of reputation, than to gain by taking advantage of this issue, so this trust assumption is not very strong.

On the other hand, in the past, multiple vulnerabilities have been found in trusted environments like these, such as Intel's SGX and are not always easy to fix quickly. For this reason, using a trusted execution environment may be part of the solution, but should be only one of the measures used to minimize the risks. Another issue with this approach is that the on-chain verification of proofs can make it a bit expensive compared to other approaches.

## Sources and transmitters

As we can't expect the source of information to be aware of our smart contract or even blockchain and deliver information directly to it, the responsibilities have to be split between the sources of information and the transmitters that take care of bringing this information to the blockchain.

Independently of what features are used by the sources or the transmitters, it's important to avoid relying on a single one, if only for reliability purposes, to avoid introducing single points of failure.

### Avoiding a single source

In all of the approaches listed above, we assumed that there is a single secure and reliable official source that can be used.

Unfortunately, there doesn't usually exist such a source that we can fully trust. Relying on a single source poses trust and reliability issues. Instead, it is always a good idea, when possible, to combine multiple sources of information.

For example, one of the most commonly requested off-chain data is price information, such as exchange rates between two currencies. There are different sources that publish such data.

All these sources are well known and have a reputation to keep so they are unlikely to purposely send invalid information. However, any of them could have reliability issues and stop working temporarily or indefinitely. Furthermore, an attacker could take advantage of a security vulnerability, intrude into their system, manipulate the data and profit from the attack.

### Avoiding a single transmitter

We saw that the risk that a given transmitter manipulates the data while transferring it from the source to the smart contract can be removed when the source signs the data or reduced through the use of Trusted Execution Environments (for a cost).

We however need to take into account other risks. Indeed, a transmitter may choose to:
- simply avoid sending data that doesn't benefit them
- when the data changes on a very frequent basis, such as for any price data, simply select data that is more advantageous to them.

Preventing this behaviour from a single transmitter is really hard.

Furthermore, using a single transmitter introduces a big risk in terms of reliability.

To reduce all these risks significantly, the best approach is to combine multiple transmitters.

### Relying on decentralization

Blockchains get rid of the need to trust specific entities through decentralization. Letting anyone and everyone take part in the blockchain and support all its features, without requiring permission from anyone, is a great way to make sure the service stays available and through consensus mechanisms, to ensure that no single entity can cheat.

The same approach can be applied to create a reliable oracle, that combines one or more sources of data, using several transmitters to fetch the data from one or all sources and bring transmit it to the oracle smart contract. This set of transmitters, or nodes, is called a **decentralized oracle network**.

Creating a decentralized oracle is not easy, with two main potential issues:

- **Risk of collusion**: we need to make sure that a single entity doesn't pretend to be multiple entities, enough to reach a majority and send manipulated data. We also need to make sure that different entities don't collude with each other and agree to send manipulated data.

- **Reliability of service**: we need to make sure enough entities are interested in maintaining the service, as its reliability and security strongly depend on the fact that several independent entities take part in the process.

Several approaches can be used to mitigate these risks:

- Provide **financial incentives** to the participants: make the users of the oracle contract pay for the information and distribute the rewards among the participants who provided data that was deemed accurate.

- Deter against bad behavior, by requiring participants to make initial **financial deposits**. The deposit can be **slashed** if the participant is shown to feed incorrect data. The funds may be locked for a significant amount of time, to avoid the risk of frequent registration and de-registration. This deposit also acts as a commitment that the node will allocate resources. An issue with this approach is that the potential gains for the attacker may be far higher than any reasonable deposits that could be required from participants.

- Associate **a token** to the oracle, along with a **DAO** and distribute the power based on the stake in this token, as well as the weight in the transmitted values or the likelihood to be selected to send it. The token can also be used as voting power when making decisions to include or reject participants from the DAO. For this to work, the system and its token need to get popular enough that it becomes impossible for a single entity to acquire a majority. This impossibility would come from the cost, both in terms of acquiring tokens and also taking into account that its value would likely crash in the event of a majority of entities sending the same invalid data. The other cause of impossibility would be the unwillingness of core loyal participants to ever sell their tokens.

- A possibility is to only include **well-known entities** that already have a valuable **reputation** to defend, which makes the whole system more centralized, but much easier to set up. This can also be a good way to bootstrap the network before it reaches maturity and attracts enough entities.

Overall, creating a reliable and secure decentralized oracle is not easy at all and has many similarities with creating a blockchain. Some oracle networks are indeed their own blockchains.

### Selecting nodes for each request

If a decentralized oracle network is successful and receives many requests, then to avoid saturation, each request needs to be handled only by a subset of the nodes of the network (a type of sharding).

The selection of which nodes get to handle a given request is very sensitive, just like the selection of block producers on blockchains. If any entity can influence this selection, they could make sure that a majority of the subset consists of nodes they control, therefore giving it the ability to manipulate the data. Even just being able to predict the selection for a given request makes attacks more likely.

The selection of nodes often involves randomness, where any node gets the same chance of being selected, or where its chance is proportional to the size of its deposit. Picking a random value in a secure and decentralized way is in itself a hard problem. Oracles often use their own system for that, with the use of **Verifiable Random Functions (VRF)**.

Some systems use **reputation** as a way to deter bad behavior and calculate the chance of the participants' selection based on this reputation. The reputation gets automatically updated based on the participant's behavior. However, such systems may fall victim to the [Matthew effect](https://en.wikipedia.org/wiki/Matthew_effect), which observes that already more reputable actors increase their reputation faster than new entrants, which can lead to centralization. Some measures may help to mitigate this risk.

Another issue with a reputation system is that, as a single attack can lead to very large gains, it may be profitable to behave very honestly for a long time and build a great reputation, until the moment of a single big attack.

### Combining multiple versions of the data

The result of having multiple sources and multiple transmitters is that the smart contract will receive multiple versions of the data.

From these multiple values, the oracle smart contract needs to produce a single value. For transparency reasons and to avoid relying on a single entity again, this work tends to be done on-chain, by the smart contract.

In the simple case where the data has a unique precise value, that is either correct or incorrect, we can simply use a **super-majority rule**: out of all the versions of the data we received, we check if there is a value that is identical for more than a certain percentage, for example, 75% of the cumulative weight of the transmitters.

If a group fails to reach a consensus or if there are complaints about the validity of the result, the request could be automatically re-done with a different, larger group.

In many cases such as for price oracles however, the value changes all the time, so we can't expect multiple transmitters, let alone a majority of them, to send the same value. The usual solution is then to compute the median (or weighted median) of all the values sent by the transmitters. We can then get rid of any value that is too far from this median and assume that such outliers are either the result of a fluke or manipulated data. We can then compute the average of the remaining values and send this result to the contracts that requested this data.

### Reducing costs by combining data off-chain

Having each transmitter send its own data to the oracle smart contract and letting the contract take care of aggregating this data can be quite costly.

One way to avoid having multiple transactions is to get an off-chain entity simply aggregate the data into a single transaction containing all the signatures. The entity that requested the data could take care of this, or any other entity. This approach however only reduces the cost of performing multiple transactions, but the work of aggregating data still happens on-chain.

Another approach is to do the aggregation itself off-chain. This can be done in some cases thanks to [**Threshold Cryptography**](Threshold_cryptosystem), where if a certain percentage of the selected set of nodes produce and sign the same result, a single aggregated signature for the group can be generated, which makes it possible to send the data in a single transaction.

As is, this system only works for the kind of data where we can expect nodes to get the exact same value. For cases where the data changes fast, such as for price oracles, this approach won't work. More complex consensus-establishing systems could be imagined, but this may be complicated.

### Financial incentives

For an oracle to work reliably, we need to use financial incentives.

**Rewards** can be used to incentivize transmitters to participate. They may in turn pay to access the API of reliable sources.

This means requiring users of the oracle to pay for the service. Smart contracts that use the oracle may need to send some tez to the oracle contract every time they access a value, or maybe pay a regular subscription fee. Depending on the oracle, this payment can be done using the blockchain's native cryptocurrency, a token specific to the oracle network, or other tokens such as stablecoins.

**Punishments** can be used to deter transmitters from misbehaving. Misbehaving could take multiple forms:
- Sending invalid data, hoping to get the rewards without doing the actual work.
- Sending manipulated data as an attempt to influence the outcomes and profit.
- Failing to send data multiple times, which as explained earlier, could also be an attempt to manipulate the outcome.

This means getting participants to deposit funds to be able to take part while these funds may get **slashed** in case of misbehavior. This could be done automatically by the smart contract or by a collective decision of the participants, through a DAO associated with the oracle.

## On-demand Oracles

Sending data to a contract means paying some fees. If multiple transmitters need to update the oracle with new data every time it changes and for multiple sources of data, the fees will accumulate very quickly. This can only work if the data in question is requested very often.

A better approach, at least for data that isn't very frequently requested, is to use an **on-demand oracle**.

The idea is simple and the steps are as follows:
- A contract sends a request to the oracle, for some specific data, along with the payment and a deadline.
- The oracle stores this request in its storage and keeps the payment in escrow.
- Transmitters observe the blockchain, using custom-made indexers and immediately detect such requests.
- Transmitters fetch data from the sources and send it to the oracle.
- Once enough data has been fetched, the oracle combines the values received and produces the result.
- The oracle then calls the contract that made the request and sends the data as parameters of the call.
- If the deadline is overdue and the oracle didn't call them back yet, the requester contract may cancel the request and get the payment back.

## Levels of trust

Smart contracts being completely trustless is the goal, but in practice, there is always some degree of trust involved.

Here are a few examples:
- The core protocol implementation may have flaws.
- The smart contracts could have flaws, either introduced by mistake, or hidden voluntarily by a developer.
- The compilers used to compile the protocol or the smart contracts could have flaws.
- The private keys of a participating entity could get compromised, by insiders or attackers.

No matter what approach you choose, there is always some degree of trust required. The goal is simply to minimize it.

Approaches can be used to reduce the risks, such as lots of testing, formal verification, security audits, lots of code reviews and more generally, following known best practices.

## Other types of oracles

The most often used oracles are off-chain data-feed oracles: off-chain services that reliably provide data collected from official sources. There are however other types of related services that we can call oracles.

### On-chain oracles

An on-chain oracle is a smart contract that serves a similar purpose to regular off-chain oracles, but provides information that is already on-chain.

If the data is already available on-chain, why would we need an oracle? We don't have the same reliability or security issues as for off-chain data.

There are at least two aspects of oracles that can be useful even on-chain:
- **Combining multiple sources** can be necessary, for example for the most common use: prices, or more specifically, exchange rates between two tokens. These can usually be fetched from one or more decentralized exchanges. Techniques to combine them can be applied.
- **Using historical data to avoid anomalies**: sometimes, the exchange rate for a given pair can very temporarily drop or increase, due to some unusual activity, then immediately go back to a previous value. It's important for price oracles to take multiple measures over a small period of time, to return average values and avoid these anomalies. This approach is called **Time Weighted Average Price (TWAP)**. Doing this and in particular excluding the current instant value, help protects contracts against sandwich attacks or other flash loan attacks.

### Computation oracles

Performing computations on-chain is very costly and should be avoided. However, smart contracts sometimes need the results of complicated and costly computations. Computation oracles help fill the need for reliably providing accurate results of such computations.

We can present two approaches that computation oracles may use:

- Use [Trusted Execution Environments (TTEs)](#trusted-execution-environments-tees) to perform verifications in a way that can't be tampered with.

- Run the computation on a virtual machine and implement a contract with the ability to run single execution steps of this virtual machine. If an entity provides the result to a contract and another entity contests it, a negotiation process can be used to figure out the single execution step where the two entities disagree and punish the incorrect one.

These approaches can be seen as a kind of layer 2 computation platform. The latter is similar to how SCORUs (Smart Contract Optimistic Rollups) are being implemented on Tezos.

## Other safety issues

As usual when dealing with smart contracts and especially when large amounts are at stake, it is very important to be extremely careful about all kinds of potential flaws.

We invite you to check our chapter [Avoiding flaws](/smart-contracts/avoiding-flaws) and in particular the sections specific to oracles.

**Missing transactions**: not all transactions manage to get accepted in a block and if the transactions from the oracles fail to be accepted soon enough in a block, it could prevent the oracle from providing the latest data, which in some cases could lead smart contracts to use obsolete data.

It could also prevent honest nodes from sending their transactions and allow dishonest nodes from reaching a majority. The honest nodes could even get punished. An attack could consist in creating many transactions with high fees in one or more consecutive blocks, to prevent some transmitters from sending their data to the oracle smart contract.

**Freeloading**: as fetching the data from an official source or performing requested computations can be costly, it can be tempting for a node of an oracle to simply wait for another node to transmit its own answer and simply send and sign the same answer and get the corresponding reward without doing the work. This is unfair and most of all can be very dangerous, as it undermines the whole point of increasing security by having multiple nodes fetching the original data.

To prevent it, a system of commit & reveal can be used, where nodes have to submit a hash of their answer during the first phase and only reveal their actual answer in the second phase, which can be verified to match the committed hash. This comes at the cost of increasing the overall response time. Another approach could be to punish nodes that often take significant time before providing their answer.

**Mirrorring**: a single entity could fetch the data once and share it with multiple nodes it controls, collecting multiple rewards while doing the work only once. The commit & reveal scheme would not help here. The main way to prevent this is to manage to attract more participants, therefore reducing the risk that multiple nodes controlled by the same entity end up in the same subset.

**Reselling**: Getting users to pay means that the information provided by the oracle is valuable. We could imagine a situation where one user of the oracle creates its own secondary oracle that resells the information to multiple other contracts, for a cheaper price. They would make a profit without doing the work. Measures to prevent this behavior may be taken and this is another case where a DAO for the oracle can be useful: the community could simply have the ability to blacklist contracts that attempt to resell the information.

## Existing services

The current list is not exhaustive and may not be up to date.

### Signed sources of data

- [Coinbase Pro](https://pro.coinbase.com/) provides an API that delivers signed exchange rates between pairs of currencies or tokens. This service is used by the Harbinger oracle.

### Oracles

On Tezos:
- [Harbinger](https://github.com/tacoinfra/harbinger#harbinger), an oracle that relies on signed data sources, mainly from [Coinbase Pro](https://pro.coinbase.com/). Anyone can fetch and inject the signed data into the oracle contract.

- [Ubinetic](https://ubinetic.com/oracles/), an oracle that leverages a Trusted Execution Environment based on Android's SafetyNet, where applications fetch non-signed data from sources through REST APIs and produce signed data with verifiable proof that the application's operation has not been tampered with. An off-chain aggregator then collects data from several such transmitters and sends it to a normalization contract on Tezos.

Other oracles:

- [Chainlink](https://chain.link/), a decentralized oracle network that uses on-chain aggregation and a reputation-based node selection process. There were plans to integrate Chainlink with Tezos, but these have stalled for now.

- [Provable](https://provable.xyz/) (formerly Oraclize), uses TTEs and [TLSNotary](https://tlsnotary.org/). Also supports simple computations.

- [Witnet](https://witnet.io/) is a reputation-based oracle network, that selects a random subset of nodes for each request, based on their reputation. Protection schemes are set up to mitigate the risk of reputation centralization. It runs on its own blockchain.

- [DOS Network](https://dos.network/) is a decentralized on-demand data feed and computation oracle that can perform all kinds of services from off-chain computations. It uses VRF (Verifiable Random Function) to assign tasks randomly and verifiably to groups of users selected among the nodes of the network. Each node is required to lock in a security deposit. A single transaction that includes proof of cryptographic consensus built using Threshold Cryptography is sent to the contract, which performs the verification. It also uses zkSNARK for verifiable off-chain computation.

## Reading

- [Decentralized oracles, a comprehensive overview](https://medium.com/fabric-ventures/decentralised-oracles-a-comprehensive-overview-d3168b9a8841)
- [Verifiable Oracles for Tezos by Ubinetic](https://ubinetic.medium.com/oracles-by-ubinetic-1f358779425)
- [DOS Network white paper](https://s3.amazonaws.com/whitepaper.dos/DOS+Network+Technical+Whitepaper.pdf)
