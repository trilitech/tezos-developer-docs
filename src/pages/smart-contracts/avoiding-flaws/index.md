---
id: avoiding-flaws
title: Avoiding flaws
authors: Mathias Hiron (Nomadic Labs)
---

The goal of this page is to bring you up to speed with a number of common flaws in smart contracts and some best practices on how to avoid them. 

- [1. Using source instead of sender for authentication](#1-using-source-instead-of-sender-for-authentication)
- [2. Transferring tez in a call that should benefit others](#2-transferring-tez-in-a-call-that-should-benefits-others)
- [3. Denying access by increasing computation](#3-denying-access-by-increasing-computation)
- [4. Needlessly relying on one entity to perform a step](#4-needlessly-relying-on-one-entity-to-perform-a-step)
- [5. Trusting signed data without preventing wrongful uses](#5-trusting-signed-data-without-preventing-wrongful-uses)
- [6. Not protecting against bots (BPEV attacks)](#6-not-protecting-against-bots)
- [7. Using unreliable sources of randomness](#7-using-unreliable-sources-of-randomness)
- [8. Using computations that cause tez overflows](#8-using-computations-that-cause-tez-overflows)
- [9. Contract failures due to rounding issues](#9-contract-failures-due-to-rounding-issues)
- [10. Reentrancy flaws](#10-reentrancy-flaws)
- [11. Unsafe use of Oracles](#11-unsafe-use-of-oracles)
- [12. Forgetting to add an entrypoint to extract funds](#12-forgetting-to-add-an-entrypoint-to-extract-funds)
- [13. Calling upgradable contracts](#13-calling-upgradable-contracts)
- [14. Misunderstanding the API of a contract](#14-misunderstanding-the-api-of-a-contract)

{% callout type="warning" title="DYOR" %}
This is **not** an exhaustive list, so please also **d**o **y**our **o**wn **r**esearch for your specific smart contract use case.
{% /callout %}

## 1. Using source instead of sender for authentication

### Summary

Using `source` to check who is allowed to call an entrypoint can be dangerous. Users may be tricked into indirectly calling this entrypoint and getting it to perform unintended transactions. It is safer to use `sender` for that purpose.

### When to use source vs sender

Smart contracts have two ways to get information about who made the call to a contract:
- `source` represents the address of the user who made the original call
- `sender` (or `caller` in some languages) represents the address of the direct caller.

For example, consider the chain of contract calls A → B → C, where a user A calls a contract B, that then calls a contract C. Within contract C, `source` will be the address of A, whereas `sender` will be the address of B.

### Example of a vulnerable contract

The `CharityFund` contract below has a entrypoint which can be used to `donate` some tez to `charity`. To make sure only an `admin` can initiate donations, this entrypoint checks that `admin` is equal to `source`.

{% table %}
* **Charity Fund Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `admin`: `address`
  {% /list %}
* {% list type="checkmark" %}
  * `deposit()`
      * Accepts transfers of tez
  * `donate(donation: tez, charity: address)`
      * Check that `source` == `admin`
	  * Create transaction to transfer `donation` to `charity`

  {% /list %}
{% /table %}

### Example of an attack

A contract `FakeCharity`  could pose as a reasonable charity willing to accept donations from `CharityFund`. This might not be immediately worrisome as only an admin can initiate donations. However, because the admin is checked against `source` and not `sender`, it is possible to transfer a large donation to the account of the attacker.

The `FakeCharity` contract contains a `default` entrypoint, that will be called when `CharityFund` makes its donation. Instead of simply accepting the transfer, it initiates a new donation of 1000 tez to the attacker. When `CharityFund` then checks if the call is allowed, it checks the value of `source`, which is indeed the admin, as it was the admin who initiated the first call of in this chain of transactions.

{% table %}
* **FakeCharity Attack Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `attackTarget`: `CharityFund` attack address
  * `attacker`: `address`
  {% /list %}
* {% list type="checkmark" %}
  * `default()`
      * Create call to `attackedContract.donate(1000tez, attacker)`
  {% /list %}
{% /table %}

### Best practices

The best way to prevent this type of attack is simply to, depending on your use case, use `sender` (or `caller` in some languages) where possible instead of `source`.

## 2. Transferring tez in a call that should benefits others

### Summary

Sending tez to a contract address may fail if the contract doesn't accept transfers. This will cause the entire call to fail, which can be problematic if that call includes other important transactions.

### Example of issue

Take the following (partial) contract, that allows users to purchase NFTs, and sends 5% of royalties on each transaction:

{% table %}
* **NFTSale Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `tokens`: `big-map`
	* Key:
      * `tokenID`: `int`
	* Value:
	  * `owner`: `address`
	  * `author`: `address`
	  * `price`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `buy(tokenID)`
      * Check that the amount transferred satisfies `tokens[tokenID].price`
	  * Send 5% of amount to `tokens[tokenID].author`
	  * Send remaining tez to `tokens[tokenID].owner`
	  * Set `tokens[tokenID].owner` to `caller`

  {% /list %}
{% /table %}

The holder of the NFT could be a contract in which case, `buy(tokenID)` may fail if the contract decides to prevent future sales of NFTs

### Best practices


A possibility would be to only allow to transfer tez to implicit accounts (disallow smart contract addresses) as implicit accounts never reject transfers of tez. This is possible but limits the usage of the contract and prevents the use of multi-sigs or DAOs purchasing NFTs.

A better solution would be to separate the transfer of tez from the purchase of the NFT. One approach would be to include an internal ledger in the contract and by adding a `claim` entrypoint:

{% table %}
* **NFTSale Contract with internal ledger** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `tokens`: `big-map`
	* Key:
      * `tokenID`: `int`
	* Value:
	  * `owner`: `address`
	  * `author`: `address`
	  * `price`: `tez`
  * `ledger`: `big-map`
	* Key:
      * `user`: `address`
	* Value:
	  * `amount`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `buy(tokenID)`
      * Check that the amount transferred satisfies `tokens[tokenID].price`
	  * Add 5% of amount to `ledger[tokens[tokenID].author]`
	  * Add remaining tez to `ledger[tokens[tokenID].owner]`
	  * Set `tokens[tokenID].owner` to `caller`
  * `claim()`
      * Send `ledger[caller].amount` to `caller`
	  * Set `ledger[caller].amount` to 0 tez
  {% /list %}
{% /table %}


## 3. Denying access by increasing computation

### Summary

There is a limit to how much computation a call to a smart contract may perform, expressed in terms of a gas consumption limit per operation. Any call to a contract that exceeds this limit will simply fail. If an attacker has a way to increase this amount of computation arbitrarily, for example by adding data to a list that the contract iterates through, this could prevent any future calls to this contract. This could lock funds within the contract permanently. 

### Example of attack

Take for example this `TimeLock` smart contract. It allows donors to lock some funds with an associated deadline. The owner may claim any funds that have an expired deadline:

{% table %}
* **TimeLock** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `owner`: `address`
  * `lockedAmount`: list of records
	  * `deadline`: `address`
	  * `amount`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `lockAmount(deadline)`
	  * Add record with `deadline, amount` to `lockedAmounts`
  * `claimExpiredFunds()`
	  * For each item in `lockedAmounts`:
	      * If `item.deadline < now`:
		     * Send `item.amount` to `owner`
			 * Delete `item` from `lockedAmounts`

  {% /list %}
{% /table %}

A possible attack would be to call the `lockAmount` entrypoint with 0 tez many times, adding a large number of entries to the `lockedAmount` list. When the contract tries to iterate through the entries, this would consume too much gas causing the transaction to fail. Effectively, all funds would now be locked into the contract. Even simply loading the list into memory and deserializing the data, at the beginning of the call, could use so much gas that any call to the contract would fail.

The same attack could happen with any kind of data that can grow indefinitely, including:
- `int` and `nat` as they can be increased to an arbitrary large value
- `string` as there is no limit on string length
- `list`, `set`, `map` which all can contain an arbitrary number of items

### Best practices

Here are some possible ways to avoid this issue:

#### Prevent Data from Increasing Arbitrarily

* This can be done:
	- by making it expensive, for example requesting a minimum deposit for each call that increases the size of the stored data.
	- by setting a hard limit, for example rejecting any call that increases the size of the stored data beyond a given limit.

Here is a version of the contract with these two fixes:

{% table %}
* **TimeLock (with data fixes)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `owner`: `address`
  * `lockedAmount`: list of records
	  * `deadline`: `address`
	  * `amount`: `tez`
  * `nbEntries`: `int`
  {% /list %}
* {% list type="checkmark" %}
  * `lockAmount(deadline)`
	  * Check that transferred `amount >= 10 tez`
	  * Check that `nbEntries <= 100`
	  * Add record with `deadline, amount` to `lockedAmounts`
	  * Increment `nbEntries` 
  * `claimExpiredFunds()`
	  * For each item in `lockedAmounts`:
	      * If `item.deadline < now`:
		     * Send `item.amount` to `owner`
			 * Delete `item` from `lockedAmounts`
			 * Decrement `nbEntries`

  {% /list %}
{% /table %}

#### Store data in a `big-map`

Unless it's already in the cache, all data in the storage of a contract needs to be loaded and deserialized when the contract is called, and reserialized afterwards. Long lists, sets or maps therefore can increase gas consumption very significantly, to the point that it exceeds the limit per operation.

Big-maps are the exception: instead of being deserialized/reserialized entirely for every call, only the entries that are read or written are deserialized, on demand, during the execution of the contract.

Using `big-map` allows contracts to store unlimited data. The only practical limit is the time and costs of adding new entries. This is useful if the contract only loads a small subset of entries during a call.

#### Push computation off-chain where possible

Avoid doing computations on-chain, if they can be done off-chain. Pass the results as parameters of the contract, and have the contract check the validity of the computation. In our example, we could store all the data about locked funds in a big-map. The key could simply be an integer that increments every time we add an entry. Whenever the user wants to claim funds with expired deadlines, do the computation off-chain, and send a list of keys for entries that have an expired deadline and significant funds.

Here is our example contract fixed using this and the previous approach:

{% table %}
* **TimeLock (with data validation)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `owner`: `address`
  * `lockedAmount`: `big-map`
	  * Key:
	  	* `ID`:`nat`
	  * Value:
	  	* `deadline`: `address`
	  	* `amount`: `tez`
  * `currentID`: `int`
  {% /list %}
* {% list type="checkmark" %}
  * `lockAmount(deadline)`
	  * Check that transferred `amount >= 10 tez`
	  * Add entry `lockedAmounts[currentID]` with value `deadline, amount`
	  * Add record with `deadline, amount` to `lockedAmounts`
	  * Increment `currentID` 
  * `claimExpiredFunds(entries: list of nat)`
	  * For each `itemID` in `entries`:
	      * Check that `lockedAmount[itemID].deadline < now`
		  * Send `lockedAmounts[itemID].amount` to `owner`
		  * Delete `lockedAmounts[itemID]`
  {% /list %}
{% /table %}

With this approach, the caller has full control on the list of entries sent to `claimExpiredFunds` and its size, so there is no risk of getting the contract locked.

## 4. Needlessly relying on one entity to perform a step

You should avoid relying on one entity involved in a contract to perform a step that shouldn't require that entity's approval, breaks the trustless benefits that a smart contract is intended to provide. In some cases, it may cause funds to get locked in the contract if this entity becomes permanently unavailable.

See if can you spot the flaw in this version of an NFT Auction contract:

{% table %}
* **Flawed NFTAuction** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `tokens`: `big-map`
	  * Key:
	  	* `contract`:`address`
	  	* `tokenID`:`int`
	  * Value:
	  	* `seller`: `address`
	  	* `topBidder`: `address`
	  	* `topBid`: `tez`
	  	* `deadline`: `datetime`
  * `ledger`: `big-map`
	  * `key`: `address`
	  * `value`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `addToMarket(contract, tokenID, deadline)`
	  * Check that caller owns the NFT
	  * Transfer ownership of the NFT to marketplace 
	  * Create an entry in `tokens`:
	  	* `contract` and `tokenID` as the key
		* `caller` as `seller`
		* `caller` as the initial value of `topBidder`
		* 0 tez as the initial value of `topBid`
		* Set parameter `deadline` as `deadline` in `tokens`.
  * `bid(contract, tokenID)`
	  * Check that `now` is before the deadline.
	  * Check transferred `amount > topBid`
	  * Add previous `topBid` to `ledger` to be claimed by previous `topBidder`
	  * Store `caller` as `topBidder`, and transferred `amount` as `topBid`
  * `claim()`
	  * Verify that `ledger[caller] exists`
	  * Create a transaction to send `ledger[caller].value` to `caller`
	  * Delete `ledger[caller]`
  {% /list %}
{% /table %}

Did you spot the issue? 

The `claimNFT` entrypoint only allows the `topBidder` to call it. If this user never calls the entrypoint, the amount they paid is stuck and therefore the seller never receives the funds. As such, the NFT also stays stuck in the contract. This is a pure loss for the seller.

The top bidder has a strong incentive to call `claimNFT`, as they have already paid for the NFT and benefit from the call by getting the NFT they paid for. However, they may have lost access to their private keys, or simply forgot about the auction. Worse, as they have full control on whether the seller gets the funds or not, they could use this as leverage on the seller, to try to extort some extra funds from them.

Furthermore, requiring for the seller themselves to call the entrypoint instead of the `topBidder` would lead to a similar issue.

In this case, the solution is simply to allow anyone to call the entrypoint, and make sure the token is transferred to `topBidder`, no matter who the caller is. There is no need to have any restriction on who may call this entrypoint.

### Best practices

When reviewing a contract, go through every entrypoint and ask: **"What if someone doesn't call it?"**

If something unintended could happen, consider these approaches to reduce the risk:

- Make it so that other people can call the entrypoint, either by letting anyone call it, if this is safe, or by having the caller be a multi-sig contract, where only a subset of the people behind that multi-sig need to be available for the call to be made.

- Add financial incentives, with a deposit from the entity supposed to call the entrypoint, that they get back when they make the call. This reduces the risk that they simply decide not to call it, or forget to do so.

- Add a deadline that allows the other parties to get out of the deal, if one party doesn't do their part in time. Be careful, as in some cases, giving people a way to get out of the deal may make the situation more complex.

## 5. Trusting signed data without preventing wrongful uses

Using a signed message from an off-chain entity as a way to ensure that this entity agrees to a certain operation, or certifies the validity of some data, can be dangerous. Make sure you prevent this signed message from being used in a different context than the one intended by the signer.

### Example of attack

Let's say that off-chain, Alice cryptographically signs a message that says "I, Alice, agree to transfer 100 tokens to Bob", and that Bob can then call a contract that accepts such a message, and does transfer tokens from Alice to him.

{% table %}
* **Ledger** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledger`: `big-map`
	  * Key:
	  	* `user`:`address`
	  * Value:
	  	* `tokens`: `int`
  {% /list %}
* {% list type="checkmark" %}
  * `handleAmount(parameters)`
      * parameters: 
	  	* `message: record(signer, nbTokens, destination)`
		* `signature`
	  * Check that signature is a valid signature by `message.signer`
	  * Subtract `message.nbTokens` from `ledger[signer].tokens`
	  * Add `message.nbTokens` to `ledger[destination].tokens`
  {% /list %}
{% /table %}


Bob could steal tokens from Alice in two different ways:
- Bob could call the contract several times with the same message, causing multiple transfers of 100 tokens from Alice to him.
- Bob may send the same message to another similar contract, and steal 100 of Alice's tokens from that contract.

### Best practices

To make sure the message is meant for this contract, simply include the address of the contract in the signed message.

Preventing replays is a bit more complex, and the solution may depend on the specific situation:

- Maintain a counter (nonce) for each potential signer in the contract, and include the current value of that counter in the next message. Increment this counter when the message is received.

{% table %}
* **Ledger (fixed)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `counters`: `big-map`
	  * Key:
	  	* `signer`:`address`
	  * Value:
	  	* `counter`: `int`
  * `ledger`: `big-map`
	  * Key:
	  	* `user`:`address`
	  * Value:
	  	* `tokens`: `int`
  {% /list %}
* {% list type="checkmark" %}
  * `handleMessage(parameters)`
      * parameters: 
	  	* `message`: `record`
			* `contract, signer, nbTokens, destination, counter`
		* `signature`
	  * Check that signature is a valid signature by `message.signer`
	  * Check that `message.contract = self` 
	  * Check that `message.counter = counters[signer].counter`
	  * Subtract `message.nbTokens` from `ledger[signer].tokens`
	  * Add `message.nbTokens` to `ledger[destination].tokens`
  {% /list %}
{% /table %}

This is the approach used in the Tezos protocol itself, for preventing replays of native transactions. However, it prevents sending multiple messages from the same signer within a short period. 

This could be quite inconvenient for the present use case, as the whole point of signed messages, is that they can be prepared off-chain, and used much later.

- To remedy this, consider including a unique arbitrary value in the message: the contract could then keep track of which unique values have already been used. The only downside is the cost of the extra storage required.

{% table %}
* **Ledger (fixed with arbitrary values)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledger`: `big-map`
	  * Key:
	  	* `user`:`address`
	  * Value:
	  	* `tokens`: `int`
  * `usedUniqueIDs`: `big-map`
	  * Key:
	  	* `uniqueID`:`bytes`
	  * Value:
	  	* N/A
  {% /list %}
* {% list type="checkmark" %}
  * `handleMessage(parameters)`
      * parameters: 
	  	* `message: record`
		* `contract, signer, nbTokens, destination, uniqueID`
		* `signature`
	  * Check that signature is a valid signature by `message.signer`
	  * Check that `message.contract = self` 
	  * Check that `message.counter = counters[signer].counter`
	  * Check `usedUniqueIDs[uniqueID]` doesn't exist
	  * Subtract `message.nbTokens` from `ledger[signer].tokens`
	  * Add `message.nbTokens` to `ledger[destination].tokens`
	  * Add `uniqueID` to `usedUniqueIDs`
  {% /list %}
{% /table %}

## 6. Not protecting against bots

On a blockchain, all transactions, including calls to smart contracts, travel publicly on the P2P network, before a block producer includes them in a new block. In the absence of protection measures such as commit and reveal schemes and time locks, some of these contract calls may contain information that can be intercepted and used by bots, to the disadvantage of the original caller.

### Example of attack

Let's consider a smart contract for a geocaching game, where users get rewarded with some tez if they are the first to find hidden capsules placed in a number of physical locations. The contract contains the hash of each of these passwords. When a user calls the contract with a password that has never been found before, they receive a reward:

{% table %}
* **Geocaching** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `capsules`: `big-map`
	  * Key:
	  	* `passwordHash`:`bytes`
	  * Value:
	  	* `reward`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `claimReward(password)`
	  * Compute `hashedPassword = hash(password)`
	  * Check that `capsules[hashedPassword]` exists
	  * Transfer `capsules[hashedPassword].reward` tez to caller
	  * Delete `capsules[hashedPassword]`
  {% /list %}
{% /table %}

A bot may listen to the gossip network and notice the call to `claimReward`, along with the password, before it is included in the next block.

This bot may simulate performing the same transaction with itself as the caller, and find out that this results in it receiving a reward. It can do so automatically, without knowing anything about the contract.

All it then has to do is to inject this new transaction, using a higher fee than the original caller, so that the baker of the next block includes it earlier in that block. Indeed, bakers usually place transactions with high fees earlier in their block. If successful, the bot gets the reward, while the original caller who did all the work of finding the capsule, gets nothing.

In the end, as multiple bots are likely to compete for this reward, they will engage in a bidding war over this transaction. The baker itself ends up getting most of the benefits from this attack, as it collects the increased fees. For this reason, this type of attack is part of what we call **Block Producer Extractable Value (BPEV)**.

Overall, the existence of such attacks has a negative impact on the health of the blockchain, as they eliminate the incentive for doing the actual work of finding opportunities. The bidding wars generate unnecessary transactions that slow the network while increasing the fees callers have to pay for their legitimate transactions to get included in the next block.

### Other types of bots attacks and BPEV

There are a number of different ways bots can take advantage of the fact that calls to smart contracts are publicly visible on the gossip network before they are included in a block. Block producers can also take advantage of the fact that they have significant control on the content of the block: which transactions get included and in which order, as well as what will be the precise value for the timestamp of the next block.

A lot of these attacks take place in the field of DeFi (Decentralized Finance), where the value of assets change all the time, including directly within a single block.

- **Copying a transaction** is the easiest attack, this happens in our example. The most common such situation is the case of **arbitrage opportunities**. Consider, for example, two separate DEXes (Decentralized EXchanges), that temporarily offer a different price for a given token. An arbitrage opportunity exists as one may simply buy tokens on the DEX with the cheaper price, and resell them for more on the other DEX. A user who carefully analyzes the blockchain and detects such an opportunity, may get this opportunity (and all their work to detect it) snatched from them by a bot that simply copies their transaction.

- **Injecting an earlier transaction** before the attacked transaction. For example, if a user injects a transaction to purchase an asset at any price within a certain range, a bot could insert another transaction before it, that purchases the asset at the low end of that range, then sells it to this user at the high end of that range, pocketing the difference.

- **Injecting a later transaction** right after the target transaction. For example, right after an arbitrage opportunity is created by another transaction. This isn't an attack against the target transaction, but the potentially numerous generated transactions produced by bots to try to fight for the right spot in the sequence of transactions, may cause delays in the network, or unfairly benefit the block producer, who gets to decide in which order transactions are performed within the block.

- **Sandwich attacks** where a purchase transaction is injected to manipulate the price of an asset before the target transaction occurs, and a later sale transaction is injected to sell the asset with a profit, at the expense of the target transaction.

More complex schemes that manipulate the order of transactions to maximize profits can be designed, all at cos to legitimate uses.

### Best practices

Preventing this type of attack is not easy, but part of the solution, is to use a **commit and reveal** scheme.

This scheme involves two steps:
- **Commit**: the user sends a hash of the information they intend to send in the next step, without revealing that information yet. The information hashed should include the user's address, to prevent another user (or bot) from simply sending the same commit message.

- **Reveal**: once the commit call has been included in a block, the user then sends the actual message. The contract can then verify that this message corresponds to the commit sent in the previous step, and that the caller is the one announced in that message.

Using this approach is sufficient to fix our example:
- The commit message sent by the user who found the capsule may simply be a hash of a pair containing the password and the address of the caller.
- The reveal call will simply send the password.

Here is the fixed contract:

{% table %}
* **Geocaching (fixed)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `capsules`: `big-map`
	  * Key:
	  	* `passwordHash`:`bytes`
	  * Value:
	  	* `reward`: `tez`
  * `commits`: `big-map`
	  * Key:
	  	* `committedData`:`bytes`
	  * Value:
	  	* N/A
  {% /list %}
* {% list type="checkmark" %}
  * `commit(committedData)`
	  * Create entry `commits[committedData]`
  * `claimReward(password)`
	  * Compute `commitData = hash(password, caller)`
	  * Check that `commits[commitData]` exists
	  * Delete `commits[commitData]`
	  * Compute `hashedPassword = hash(password)`
	  * Check that `capsules[hashedPassword]` exists
	  * Transfer `capsules[hashedPassword].reward` tez to caller
	  * Delete `capsules[hashedPassword]`
  {% /list %}
{% /table %}

### Using financial incentives and Timelock for extra protection

Our geocaching example is a straightforward case where the situation is binary: either a user found a password, or it didn't.

Other situations may be more complex, and attackers may generate a number of commitments for different messages, in the hope that once they collect information during the reveal phase, revealing one of them will be beneficial to them.

This could be as simple as one commitment that bets that the value of an asset will increase, and another that bets that the value will decrease. Depending on what happens when other users reveal their own messages that may affect the price of this asset, the attacker may decide to reveal one or the other message.

To protect against such attack, financial incentives can be used, where users have to send a deposit along with each commitment. Users who never reveal the message corresponding to their previous commit lose their deposit. Furthermore, the [TimeLock](https://research-development.nomadic-labs.com/timelock-a-solution-to-minerblock-producer-extractable-value.html) cryptographic primitive may be used instead of a hash for the commit phase. This approach allows anyone to decrypt the content of the commit, given enough time, therefore forcing the reveal of the commited value.

## 7. Using unreliable sources of randomness

Generating a random value during a contract call, for example for selecting the winner of a lottery or fairly assigning newly minted NFTs to participants of a pre-sale, on the blockchain is difficult. As all contract call must run on hundreds of nodes and produce the exact same result on each node, everything needs to be predictable. Most ways to generate randomness have flaws and can be taken advantage of.

### Examples of bad sources of randomness

- **The timestamp of a block**. Using the current timestamp of the local computer is a commonly used source of randomness on non-blockchain software, as the value is never the same. However, its use is not recommended at all in security sensitive situations, as it only offers a few digits to predict randomness, with a precision in microseconds or even milliseconds. 
	- the precision of the timestamp of a block is only in seconds
	- the value can be reasonably well predicted, as bakers often take a similar time to produce their block
	- the baker of the previous block can manipulate the timestamp it sends, therefore controlling the exact outcome.
	
- **The value of a new contract's address**. A contract may deploy a new contract and obtain its address. Unfortunately, a contract address is far from being as random as it looks. It is simply computed based on the operation group hash and an origination index (starting from 0 which is increased for every origination operation in the group). It can therefore be easily manipulated by the creator of the operation which is no better than trusting them.

- **The exchange rate between currencies**. One may consider using an off-chain [oracle](/developers/docs/smart-contracts/oracles/) to obtain the exchange rate between two common currencies, such USD and Euro, and use this to get a few bits of entropy for randomness. This can be considered difficult to predict and therefore "random". There are however a number of issues with this approach:
	- We can only get a few bits of entropy (randomness), which is usually insufficient.
	- One of the entities behind the off-chain oracle could influence the exact value. The exact way to do this depends on the specifics of the oracle, but it's likely that there is a way to do so.
	- A baker could also censor some of the transactions involved in the off-chain oracle, and by doing so, influence the exact value as well.

- **A bad off-chain randomness Oracle**. Anyone can create an off-chain oracle, and claim that this oracle provides secure random values. Unfortunately, generating a random value off-chain in a reliable way, so that no single entity may influence or predict the outcome, is extremely hard. Don't blindly trust an oracle, even if you find that many contracts use it already. A bad random oracle may be the worst choice, as it could simply stop working and make your contract fail, or be under the control of a single entity.

- **The hash of another source of randomness**. Hashing some input may seem like it produces some random output, spread rather evenly over a wide range of values. However, it is entirely predictable, and doesn't add any randomness to the value taken as input.

- **A combination of multiple bad sources of randomness**. It may seem like combining two sources of not so good randomness may be a good way to increase the quality of the randomness. However, although combining multiple sources of randomness increases the amount of entropy and makes it harder to predetermine the outcome, it also increases the risk for one entity to control this outcome. This entity only needs to have some control over the value of one of the sources of randomness, to gain the capacity to have some control over the final result.

Remember that an attacker only needs the ability to pick between two possible outcomes, or to predict which one is more likely, to significantly increase their chance of getting an outcome that benefits them.

### Best practices

The best practice is to avoid having to rely on a source of randomness if you can. This avoids issues of reliability of the randomness source (which may stop working in the future), predictability of the outcome, or even control of the outcome by one party, such as a block producer.

If you really need a source of randomness, the two following approaches may be used:

- **Combine random values provided by every participant**. Each potential beneficiary of a random selection could contribute to the randomness: get each participant to pick a random value within a wide range, add all the received values, and use the result as a source of randomness. For this to work, a **commit and reveal** scheme needs to be used, combined with **financial incentives** and the use of a **timelock** cryptographic primitive, to make sure none of the participants may pick between different outcomes, simply by not revealing their value. This is a bit tricky to do well, and for it to be practical, it requires participants to be able to react fast, as the window for each participant to commit their random value has to be very short (a small number of blocks).

- **Use a good randomness oracle**. It is, in theory, possible to create a good off-chain random Oracle. Chainlink offers a [randomness oracle](https://docs.chain.link/docs/chainlink-vrf/) based on a [verifiable random function](https://en.wikipedia.org/wiki/Verifiable_random_function) (VRF), and may be one of the few, if not the only reasonably good available randomness oracle. However, it is based on the assumption that there is no collusion between the owner of the smart contract that uses it, and some of the nodes that provide random values. Finally, Chainlink VRF currently is only available on a small number of blockchains, which don't include Tezos. At the time of writing, there is no good randomness oracle on Tezos that we would recommend.

## 8. Using computations that cause tez overflows

At the time of writing, tez values are stored as signed 64 bits. Overflows or underflows are not possible on Tezos, as all basic operations will generate an error if the result exceeds the range of acceptable values. Nevertheless, you still need to be aware of causing these errors as these failures may prevent your contract from working as intended, or even locking funds in your contract.

### Example of failure mode

Let's say you use this formula as part of some computation:

{% math %}
tzRes = \sqrt{\dfrac{tzA^2 + tzB^2}{2}}
{% /math %}

Now suppose that {% math inline=true %} tzA {% /math %} and {% math inline=true %} tzB {% /math %} are both 5000 tez. More precisely, 5,000,000,000 mutez.

{% math inline=true %} tzA^2 {% /math %} is worth {% math inline=true %} 25 \cdot {10^{18}} {% /math %} mutez which larger than the maximum amount that can be stored in a 64 bits signed value, about {% math inline=true %} 9.223 \cdot {10^{18}} {% /math %} mutez (precisely {% math inline=true %} 2^{63} - 1 {% /math %}).

This computation, if done using the tez type, will therefore fail, even though the final result, 5000 tez, easily fits within a 64 bit signed integer.

Overflow protection will prevent the transfer of an incorrect value by entirely preventing the call. This could be a major issue as this could effectively lock the contract with its tez balance stuck forever.

### Best practices

The main recommendation is to be very careful when doing computations with the Tez type, and double check that any intermediate values can never cause an overflow or underflow.

A good way to avoid such issues is to use the `int` or `nat` types for storing these intermediate computations since these types can hold arbitrarily large values.

## 9. Contract failures due to rounding issues

A contract call will fail if it tries to transfer more than its own balance. Therefore, it is very important to make sure that when splitting the balance into multiple amounts sent to several people, the total can never exceed the balance, even by a single microtez. More generally, the rounding caused by performing integer divisions can be dangerous if not done carefully.

### Example of flaw

The following contract will fail whenever the balance is not a multiple of 4 mutez:

{% table %}
* **Distribution** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `userA`: `address`
  * `userB`: `address`
  {% /list %}
* {% list type="checkmark" %}
  * `distribute()`
	  * `quarter, remainder = ediv(balance, 4)`
	  * Transfer `balance - quarter` to `userA`
	  * Transfer `balance - 3*quarter` to `userB`
  {% /list %}
{% /table %}

Let's walk through this contract when it has a balance of 101 mutez: `ediv(balance, 4)` returns a pair with the result of the integer division of balance by 4, and the remainder of this division. With a balance of 101 mutez, quarter will be 25 mutez

- The amount transferred to `userA` will be `101 - 25 = 76` mutez
- The amount transferred to `userB` will be `101 - 3*25 = 26` mutez

Therefore, the total amount is `76 + 26 = 102` which is more than the current balance of the contract; the call will fail.

### Best practices

When transferring a portion of the balance of a contract, try to do your computations based on what remains in the balance after the previous transfers:

{% table %}
* **Distribution (fixed)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `userA`: `address`
  * `userB`: `address`
  {% /list %}
* {% list type="checkmark" %}
  * `distribute()`
	  * `quarter, remainder = ediv(balance, 4)`
	  * `amountUserA = balance - quarter`
	  * Transfer `amountUserA` to `userA`
	  * `remainder = balance - amountUserA`
	  * Transfer `remainder` to `userB`
  {% /list %}
{% /table %}

Whenever you carry out division, be very careful to think about about any impact that the incurred rounding may have.

## 10. Reentrancy flaws

A reentrancy attack was the cause of the infamous DAO hack that took place on Ethereum in June 2016 eventually leading to the fork of Ethereum into Ethereum and Ethereum Classic. Tezos has been designed in a way that makes reentrancy bugs less likely, but they are still possible. They can happen when the attacked contract calls another contract, that may in turn call the attacked contract itself in a way that breaks some assumptions made by its internal logic.

### Example of flawed contracts

The two contracts below manage unique tokens identified by IDs. The first contract is a simple ledger that keeps track of who owns each token. The second contract is in charge of purchasing tokens at predefined prices. See if you can spot how to steal funds from them:

{% table %}
* **Ledger** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `adminContract`: `contract`
  * `tokens`: `big-map`
	* Key:
		* `tokenID`: `int`
	* Value:
		* `owner`: `address`
  {% /list %}
* {% list type="checkmark" %}
  * `view getTokenOwner(tokenID)`
	  * Return `tokens[tokenID].owner`
  * `changeOwner(tokenID, newOwner)`
	  * Check that `caller` = `adminContract`
	  * Set `tokens[tokenID].owner` to `newOwner`
  {% /list %}
{% /table %}

{% table %}
* **Purchaser** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledgerContract`: `contract`
  * `purchasePrices`: `big-map`
	* Key:
		* `tokenID`: `int`
	* Value:
		* `price`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `offerToken(tokenID)`
	  * Check that `caller` = `ledgerContract.getTokenOwner(tokenID)`
	  * Create transfer of `purchasePrices[tokenID].price` to `caller`
	  * Create call to `tokenContract.changeOwner(tokenID, self)`
  {% /list %}
{% /table %}

### Example of attack

Here is how a contract could use reentrancy to steal some funds from the purchaser contract:

{% table %}
* **Reentrancy Attack Contract** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `nbCalls`: `nat`
  * `tokenID`: `nat`
  {% /list %}
* {% list type="checkmark" %}
  * `attack(purchaserContract, tokenID)`
	* Set `nbCalls = 2`
	* Set `storage.tokenID = tokenID`
	* Create call to `purchaserContract.offerToken(tokenID)`
  * `default()`
	* Decrement `nbCalls`
	* If `nbCalls > 0`:
		* Create call to `caller.offerToken(tokenID)`
  {% /list %}
{% /table %}

Let's assume that:
- the attacker contract owns the token with ID 42
- the purchaser contract lists a price of 100 tez for token 42
- someone calls `attackContract.attack(purchaserContract, 42)`

Here is the succession of steps that will take place:

- `attackContract.attack(purchaserContract, 42)`
	- it creates a call to `purchaserContract.offerToken(tokenID)`
- `purchaserContract.offerToken(42)` is executed
	- it checks that the `caller` is the owner
	- it creates a transfer of `purchasePrices[42].price` to `attackContract` (the `caller`)
	- it creates a call to `ledgerContract.changeOwner(42, self)`
- `attackContract.default()` is executed
	- it decrements `nbCalls` to 1
	- it creates a call to `purchaserContract.offerToken(42)`
- 100 tez is transferred from `purchaserContract` to `attackContract`
- `purchaserContract.offerToken(42)` is executed
	- it checks that `caller` is the owner
	- it creates a transfer of `purchasePrices[42].price` to `attackContract` (`caller`)
	- it creates a call to `ledgerContract.changeOwner(42, self)`
- `attackContract.default()` is executed
	- it decrements `nbCalls` to 0
	- it doesn't do anything else
- 100 tez are transferred from `purchaserContract` to `attackContract`
- `ledgerContract.changeOwner(42, purchaserContract)` is executed
	- it sets `tokens[42].owner` to `purchaserContract`
- `ledgerContract.changeOwner(42, purchaserContract)` is executed
	- it sets `tokens[42].owner` to `purchaserContract`
	
In the end, the attacker contract has received 200 tez for a token that was priced at 100 tez, so it stole 100 tez from the purchaser contract. If we had initially set `nbCalls` to 10, and assuming there were enough funds in the balance of the `purchaserContract`, 10 calls would have been made, and it would have received 1000 tez for its token, stealing 900 tez.

What makes this flaw possible and hard to detect is that a new call to the purchase contract can be initiated in the middle of execution interfering with the business logic that otherwise seems sound:
- send tez to the seller
- take ownership of the token

In practice, this happens:
- send tez to the seller
- seller does all kinds of things, including trying to sell its token a second time
- take ownership of the token

### Best practices

There are two methods to avoid reentrancy flaws.

#### 1. Order the steps in a safe way

The idea is to start with steps that prevents future similar calls. In our example, reentrancy is avoided if we simply changed the order of these two instructions:

- create transfer of `purchasePrices[tokenID].price` to `caller`
- create call to `tokenContract.changeOwner(tokenID, self)`

to:

- create call to `tokenContract.changeOwner(tokenID, self)`
- create transfer of `purchasePrices[tokenID].price` to `caller`

This approach can work, however please note that as contracts become more complex, it can become very difficult to make sure all possible cases are covered.

#### 2. Use a flag to prevent any reentrancy

This approach is more to the point and very safe: put a `Boolean` flag `isRunning` in the storage, that will be set to true while the contract is being used.

The code of the entrypoint should have this structure:
- check that `isRunning` is `False`
- set `isRunning` to `True`
- carry out required logic, including creating calls to other contracts
- create a call to an entrypoint that sets `isRunning` to `False`

Here is the new version of the contract, using both fixes:

{% table %}
* **Purchaser Contract (fixed)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledgerContract`: `contract`
  * `purchasePrices`: `big-map`
	* Key:
		* `tokenID`: `int`
	* Value:
		* `price`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `offerToken(tokenID)`
	  * Check that `isRunning` is `False`
	  * Set `isRunning` is `True`
	  * Check that `caller` = `ledgerContract.getTokenOwner(tokenID)`
	  * Create call to `tokenContract.changeOwner(tokenID, self)`
	  * Create transfer of `purchasePrices[tokenID].price` to `caller`
	  * Create call to `self.stopRunning()`
  * `stopRunning()`
	  * Check that `caller` is `self`
	  * Set `isRunning` is `False`
  {% /list %}
{% /table %}


## 11. Unsafe use of oracles

Oracles provide a way for smart contracts to obtain information about the rest of the world, such as exchange rates, or outcomes of sports events or elections. They rely on services that are hosted off-chain, and so they don't benefit from the same safety and trust measures provided by the blockchain. When using oracles, you should be aware that they with their own risks: some oracles can be manipulated by single entities or a small number of colluding entities, or they can simply stop working and/or provide obsolete information. Some types of oracles, such as online price oracles, may be manipulated by contracts to provide incorrect information. Every time an oracle returns inaccurate information, it creates an opportunity for attackers to take advantage of the situation and steal funds.

### How oracles work

A typical oracle is composed of two parts:
- an off-chain service which collects information from one or more sources
- an oracle smart contract, that receives this information, as well as requests from other contracts (in the case of on-demand oracles)

The off-chain service tracks the requests made to the smart contract, fetches the information, and calls the oracle contract with this information, so that it can store it and provide it to other contracts, usually for a fee.

### Using a centralised oracle

If the off-chain service is controlled by a single entity which sends the requested information without any way to verify its origin and validity, anyone who uses this oracle is at risk for multiple reasons:

- **reliability**: if the single entity stops providing that service, every contract, which relies on it, stops working.
- **accuracy**: the single entity may suddenly decide to provide false information, causing downstream contracts to make decisions based on false information. The entity can therefore take advantage of these bad decisions.

Good decentralized oracles include systems that prevent single entities from stopping the oracle or manipulating the information it sends. 

### Not checking information recency

Oracles often provide information that may change over time, such as the exchange rate between two currencies. Information that is perfectly valid at one point, can become obsolete and incorrect a few minutes later.

Good oracles always attach a timestamp to the information they provide. If for some technical reason, the off-chain part of the oracle is unable to send updated information to the oracle smart contract, then the stored information may get old. This could be caused by network congestion, or blocks getting full and bakers not including the oracle's transactions.

### Using on-chain oracles that can be manipulated

On-chain oracles don't provide data from off-chain sources. Instead, they provide access to data collected from other smart contracts. For example, an on-chain oracle could collect and provide data about the exchange rate between two tokens from one or more [DEXes](/developers/docs/defi/dex/) running on the same blockchain. Doing this in a safe manner is not straightforward.

An attacking contract could perform the following steps:
- use a flash-loan to borrow a lot of tez
- buy a large number of tokens from one DEX, which temporarily increases the price of this token in this DEX
- call a contract that makes bad decisions based on this manipulated price, obtained though an unprotected oracle
- profit from these bad decisions
- sell the tokens back to the DEX
- pay the flash-loan back, with interest

In some cases,the current price could simply be a fluke, not caused by a malicious intent, but simply a legitimate large transaction. The price may not be representing the current value.

Good oracles never simply return the current value obtained from a single DEX. Instead, they use recent but past historical values, get rid of outliers and use the median of the remaining values. When possible, they should combine data from multiple DEXes.

#### Best practices

- Only use oracles that are decentralized, in such a way that no single entity, or even no small group of colluding entities, may stop the oracle from working, or provide manipulated information.
- Make sure your contract always checks that the timestamp attached to information provided by oracles is recent.
- If you need to make decisions based on the price of tokens from a DEX, make sure you always get the prices through a good online oracle that uses this type of measures.

## 12. Forgetting to add an entrypoint to extract funds

You may think that being the author of a contract, and having deployed the contract yourself, will automatically give you specific rights about that contract, but this is not the case. In particular, it doesn't give you any rights to extract funds from the balance of your own contract. All the profits earned by your contract may be locked forever, if you don't plan for any way to collect them.

### Example of flawed contract

Below is a schema for a flash loan contract. Have a think and see if you can spot the flaw.

{% table %}
* **Flash Loan Contract (fixed)** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `interest_rate`: `nat`
  * `in_progress`: `boolean`
  * `loan_amount`: `tez`
  * `repaid`: `boolean`
  {% /list %}
* {% list type="checkmark" %}
  * `borrow(loan_amount: tez, callback: address)`
	  * Check that `in_progress` is `False`
	  * Set `in_progress` to `True`
	  * Transfer `loan_amount` to `caller`
	  * Set storage `loan_amount` to `loan_amount`
	  * Set `repaid` to `False`
	  * Create `call` to callback
	  * Create `call` to `check_repaid`
  * `repay()`
	  * Check that `in_progress` is `True`
	  * Check that `paid_amount > loan_amount + interest`
	  * Set `repaid` is `True`
  * `check_repaid()`
	  * Check that `repaid` is `True`
  {% /list %}
{% /table %}

This flash loan contract may accumulate interests for years, with the owner happily watching the balance increase on a regular basis. When the owner decides to retire the contract, they will realise that they have no way to withdraw any funds, neither the profits nor the initial funds.

### Best practices

Always verify that you have some way to extract the benefits earned by your smart contract. Ideally, make sure you do so using a multi-sig contract, so that you have a backup system in case you lose access to your private keys.

{% callout type="warning" title="Keep your private keys safe" %}
This may seem obvious, but losing private keys happens all too often, even amongst those that are experienced. Make sure to have a backup system. 
{% /callout %}

More generally, when you test your contract, make sure you test the whole life cycle of the contract, including what should happen at the end of its life.

## 13. Calling upgradeable contracts

### Summary

On Tezos, contracts are not upgradable by default: once a contract has been deployed, there is no way to modify its code, for example to fix a bug. There are however several ways to make them upgradable. This can provide extra security for the author of the contract who has a chance to fix any mistakes or pause the contract in case of a critical bug, but this can cause significant risks for any user who relies on the contract.

### Upgrading a contract

There are two main ways to make a contract upgradable:

- put part of the logic in a piece of code (a lambda), in the storage of the contract
- put part of the logic in a separate proxy contract, whose address is in the storage of the main contract

In either case, to upgrade the contract, you must provide an entrypoint that an admin may call to change these values, and therefore upgrade the behaviour of the contract.

### Example of attack

Imagine that you write a contract, that relies on an upgradable DEX contract. You have carefully checked the code of that contract and many other users have used it before. The contract is upgradable, and you feel safe because that means the author may be able to fix any bugs. You might use your contract regularly to exchange tokens using the upgradeable DEX contract, and you initiate such a token exchange. For some reason, this time you notice you never receive the intended target tokens. You then realize that the owner of the DEX has gone rogue, and decided to upgrade their contract, in such a way that the DEX contract collects tokens but never sends any back in exchange.

### Best practices

Before you use any contract, directly or as part of your own contract, make sure this contract can't be upgraded in a way that breaks the key aspects that you rely on for the safe operation of your contract.

If a potential contract you want to use is upgradable, make sure the upgrade system follows a very safe process, where the new version is known well in advance, and the decision to to activate the upgrade is done by a large enough set of independent users.

## 14. Misunderstanding the API of a contract

There are many contracts that provide a similar, common service: DEXes, Oracles, Escrows, Marketplaces, Tokens, Auctions, DAOs, etc. As you get familiar with these different types of contracts, you start automatically making assumptions about how they behave. This may lead you to take shortcuts when interacting with a new contract i.e. reading the documentation and the contract a bit too fast and implementing these new features in your contract quickly. This enthusiasm is great but be wary, as it could cause you to miss some key differences between this new contract and the similar ones you have used in the past leading to some unintended consequences. 

### Best practices

Never make any assumptions about a contract you want to use based on previous experience with similar contracts. Always check their documentation and code very carefully, before you use it.
