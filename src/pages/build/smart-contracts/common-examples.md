---
id: simplified-contracts
title: Simplified examples of common contracts
authors: Mathias Hiron (Nomadic Labs)
lastUpdated: 30th June 2023
---

This page covers some common smart contract use cases. The goal is for you to get a good understanding of how these common smart contracts work. For example, what storage is used and how, how the entrypoints are used and how contracts interact with each other. This will bring you up to speed on a lot of the smart contracts you will run into on a daily basis, helping you understand the broader smart contract development landscape.

{% callout type="warning" title="" %}
The contracts on this page are simplified contracts, provided for educational purposes only. They are not meant to be implemented and used as is, as some of them may contain potential flaws.
{% /callout %}

## Prerequisites

If you haven't already, please go ahead and read [Smart Contract Concepts](/developers/docs/smart-contracts/smart-contracts-concepts/). It also might be worth having a read through the [Smart Contract Languages](/developers/docs/smart-contracts/smart-contract-languages/) section to get an understanding of the options available to you - this way you can start thinking about how the implementations below might look in another of the supported smart contract languages on *Tezos*.

## Common Contracts

- [FA1.2 Fungible token](#fa-1-2-fungible-token)
- [FA2 - NFTs: Non Fungible Tokens](#fa-2-nf-ts-non-fungible-tokens)
- [NFT Marketplace](#nft-marketplace)
- [Escrow](#escrow)
- [DAO: Decentralized Autonomous Organisation](#dao-decentralized-autonomous-organisation)
- [DeFi: Flash loan](#de-fi-flash-loan)


## FA1.2 Fungible token

The goal of this contract is to create and manage a single [fungible](https://en.wikipedia.org/wiki/Fungibility) token. It implements the FA1.2 standard, which makes it compatible with wallets, decentralized exchanges and other tools.

### Features

- Each user can own a certain number of tokens
- Users can transfer tokens to other users
- Users can allow another contract, for example a decentralized exchange, to transfer some amount of their tokens for them.

### Entrypoints

The contract contains two main entrypoints:
- `transfer` - to transfer a number of token from one address to another
- `approve` - to allow another address, on behalf of the caller, to transfer a number of their tokens

To be compatible with FA1.2, and so that other contacts can access to information, it also contains three entrypoints that have no effect other than reading storage:

- `getBalance` - returns the current token balance.
- `getAllowance` - returns the current token allowance amount for an approved address (via `approve`)
- `getTotalSupply` - returns the total number of tokens managed by this contract

{% table %}
* **FA 1.2** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledger`: `big-map`
	* Key:
      * `holder`: `address`
	* Value:
	  * `tokens`: `nat`
  * `allowance`: `big-map`
	* Key:
      * `owner`: `address`
	  * `spender`: `address`
	* Value:
	  * `amount`: `nat`	
  {% /list %}
* {% list type="checkmark" %}
  * `transfer(from: address, to: address, value:nat)`
      * Check the `ledger[from].tokens` value
	  * If the caller address is not `from`:
	     * Check that `allowance[from, caller]` exists, with `amount` value
		 * Subtract `value` from `allowance[from, caller].amount`
		 * If `allowance[from, caller].amount = 0`, delete `allowance[from, caller]`
      * Create entry `ledger[to]` with 0 tokens, if it doesn't exist.
	  * Add `value` to `ledger[to].tokens`
  * `approve(sender: address, value: nat)`
      * Check that `tokens[caller].tokens >= nbTokens`
	  * Create entry `allowance[caller, sender]` with `amount = 0`, if it doesn't exist.
  * `getBalance(owner: address, callback: contract)`
      * If `ledger[owner]` exists, set `ownerBalance` to `ledger[owner].tokens`
	  * Otherwise, set `ownerBalance` to 0
	  * Call `callback(ownerBalance)`
  * `getAllowance(owner: address, spender: address, callback: contract)`
      * If `allowance[owner, spender]` exists, set amount to `allowance[owner, spender]`
	  * Otherwise, set `amount` to 0
	  * Call `callback(amount)`

  {% /list %}
{% /table %}

## FA2 - NFTs: Non Fungible Tokens

The FA2 standard specifies contracts that can describe:
- Single fungible token
- Multiple fungible tokens
- Non-fungible tokens (NFTs)

Implementing the FA2 standard allows the contract to be compatible with wallets, explorers, marketplaces, etc. Here, we will present an implementation for NFTs. The entrypoints for the other types are the same, but the implementation differs.

### Entrypoints
FA2 contracts must have the following entrypoints:
- `transfer` - can be called either by the owner of tokens, or by a third party allowed to do so on their behalf. It accepts a list of transfers of different tokens from the token owner with recipient addresses.
- `update_operator` - can be called by the owner of tokens to add or remove operators allowed to perform transfers for them. It takes a list of variants, each consisting in either adding or removing an operator for a given token.
- `balance_of` - used to access the balance of a user for a given token.

{% table %}
* **FA 2** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `ledger`: `big-map`
	* Key:
      * `token_id`: `nat`
	* Value:
	  * `owner`: `address`
	  * `metadata`: `string`
  * `operators`: `big-map`
	* Key:
      * `owner`: `address`
	  * `operator`: `address`
	  * `token_id`: `nat`
	* Value:
	  * N/A
  {% /list %}
* {% list type="checkmark" %}
  * `transfer`:
	  * Arguments:
  	     * `from: address`
	     * `transfers: [to: address, token_id: nat, amount: nat])`
      * For each item `[to, token_id, amount]` in `transfers`
	     * Check that the `amount` is 1
		 * Check that the `caller` is `from`
		 * Or that `operators[from, caller, token_id]` exists
  * `update_operator`:
      * Arguments:
	     * `updates[]` 
		    * `variant, owner: address`
			* `operator: address, token_id: nat`
      * For each item in updates of type `add_operator`:
	     * Check that `owner` is the caller
		 * Create entry `operators[owner, operator, token_id]` if it doesn't exist.
	  * For each item in updates of type `remove_operator`
	     * Check that `owner` is the caller
		 * Delete entry `operators[owner, operator, token_id]` if it doesn't exist.
  * `balance_of`
      * Arguments:
	     * `requests: [owner: address, token_id: nat]`
		 * `callback: address`
	  * Create list `results` of `[owner: address, token_id: nat, balance: nat]`
	  * For each request in requests:
	    * If `ledger[token_id].owner` is `owner`, set `balance` to 1
		* Otherwise, set `balance` to 0
		* Add [`owner`, `token_id`, `balance`] to results
	  * Call `callback(results)`
  {% /list %}
{% /table %}

## NFT Marketplace

The goal of this example contract is to manage sales of NFTs. It pays a share of the selling price to the admin of the marketplace, in exchange for providing an application that facilitates finding and purchasing NFTs.


### Entrypoints
- `add` - called by a seller who lists an NFT for sale for a given price. The seller must indicate which FA2 contract holds the NFT, and the ID of the NFT within that contract. This requires the marketplace to have `operator` status within the FA2 contract.
- `remove` - called by a seller to remove their NFT from the marketplace.
- `buy` - called by a buyer who pays the required price to buy a given NFT. The admin account of the marketplace receives a share of the selling price.


{% table %}
* **NFT Marketplace** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `admin`: `address`
  * `fee_rate`: `nat`
  * `tokens`: `big-map`
	* Key:
      * `contract`: `address`
      * `token_id`: `nat`
	* Value:
	  * `seller`: `address`
	  * `price`: `tez`
  {% /list %}
* {% list type="checkmark" %}
  * `add(token_contract: address, token_id: nat, price: tez)`
      * Transfer token ownership to the marketplace
	     * Call `token_contract.transfer(caller, [self, token_id, 1])`
      * Add entry `[token_contract, token_id]` to tokens with values `[caller, price]`
  * `remove(token_contract: address, token_id: nat)`
      * Check that caller is the seller of the token:
	     * Check that `tokens[token_contract, token_id].seller` is `caller`
      * Transfer token ownership back to seller:
	     * Call `token_contract.transfer(self, [caller, token_id, 1])`
	  * Delete entry `[token_contract, token_id]` from tokens
  * `buy(token_contract: address, token_id: nat)`
      * Check that the token is on sale for the amount paid by the caller:
	     * `tokens[token_contract, token_id].amount = amount_paid`
      * Transfer token ownership to the caller:
	     * Call `token_contract.transfer(self, [caller, token_id, 1])`
      * Set `admin_fee = fee_rate * amount_paid / 100`
	  * Create transaction to send `admin_fee` to admin
	  * Create transaction to send `amount_paid - admin_fee` to `[token_contract, token_id].seller`
	  * Delete entry `[token_contract, token_id]` from tokens
  {% /list %}
{% /table %}

## Escrow

An escrow smart contract temporarily holds funds and only unlocks them based on certain conditions, time, or an agreement from both sides. For example, tokens paid by a buyer can be locked in a smart contract, until they confirmed they received what they paid for. 

An escrow provides some trust between parties of a transaction:
- when the buyer does not want to send the payment until the request has been fulfilled.
- when the seller does not want to provide the product/service without some guarantee that they will be paid.

There are a number of different types of escrow contracts. In our contract, the service to provided by the seller is data which can be verified to be valid by the escrow smart contract. For example, the request could consist in the service sending the decrypted version of some encrypted data.

### Entrypoints

Our contract has three entrypoints:
- `send_request` - creates a new request with a deadline and also sends the payment to the escrow contract. The request contains the code that will verify the validity of the answer.
- `fulfill_request` - called by the seller. It verifies that the request has been performed and transfers the funds to the seller.
- `cancel_request` - called by the buyer if the request has not been fulfilled after deadline expiration. The funds are transferred back to them.

{% table %}
* **Escrow** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `requests`: `big-map`
	* Key:
      * `owner`: `address`
      * `id`: `nat`
	* Value:
	  * `amount`: `tez`
	  * `service`: `contract`
	  * `data`: `bytes`
	  * `verification`: `lambda`
	  * `deadline`: `datetime`
	  * `answer`: `option: bytes`
  {% /list %}
* {% list type="checkmark" %}
  * `send_request(id, service, data, verification, deadline)`
      * Check that `requests[caller, id]` doesn't exist
	  * Create `requests[caller,id]` entry with `amount_paid` and all parameters
      * Create a call to `service(data, self, amount, deadline)`
  * `fulfill_request(id, answer)`
      * Set `request = requests[caller, id]`, checking that it exists
	  * Check that `verification(request.data, answer)` returns `true`
	  * Set `requests[caller, id].answer` to `answer`
	  * Create transaction to send `request.amount` to `caller`
      * Transfer token ownership back to seller:
	     * Call `token_contract.transfer(self, [caller, token_id, 1])`
	  * Delete entry `[token_contract, token_id]` from tokens
  * `cancel_request(id)`
      * Set `request = requests[caller,id]`
	  * Check that `request.answer` is `none` i.e. request hasn't been processed
      * Transfer token ownership to the caller:
	     * Call `token_contract.transfer(self, [caller, token_id, 1])`
      * Check that the deadline has expired: 
	     * `now > request.deadline`
	  * Create transaction to send `request.amount` to caller
	  * Delete `requests[caller,id]` entry
  {% /list %}
{% /table %}

## DAO: Decentralized Autonomous Organisation

A DAO is a smart contract that represents an organisation with members. It provides a way for these members to collectively take decisions. A common DAO decision is how to use tokens held in the DAO's treasury i.e. tokens held in the balance of the DAO contract. 

DAO contracts can be very flexible and wide-ranging, but here we will present a simple but powerful version. Our DAO stores the addresses of all its members, a list of all the current proposals, and keeps track of who voted for them.


### Entrypoints

- `propose` - called by any member to make a new proposal, in the form of a piece of code to execute (a lambda).
- `vote` - called by any member to vote in favour of the request. When the majority of members have voted in favour, the proposal is executed.
- `add_member` - adds a new member to the DAO. It can only be called by the DAO itself, which means the call has to go through a proposal and be voted on.
- `remove_member` - removes a member from the DAO. It can only be called by the DAO itself.

When deployed, an initial list of members needs to be provided, as well as some initial tez balance.

{% table %}
* **DAO** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `nb_members`: `nat`
  * `members`: `big-map`
	* Key:
      * `user`: `address`
	* Value:
	  * N/A
  * `requests`: `big-map`
	* Key:
      * `id`: `nat`
	* Value:
	  * `action`: `lambda`
	  * `deadline`: `datetime`
	  * `nb_votes`: `nat`
  * `votes`: `big-map`
	* Key:
      * `request_id`: `nat`
      * `user`: `address`
	* Value:
	  * N/A
  {% /list %}
* {% list type="checkmark" %}
  * `propose(id, action, deadline)`
      * Check that `requests[id]` doesn't exist
	  * Check that the caller is a member:
	     * i.e. `members[caller]` exists
	  * Create `requests[id]` entry with:
	     * values of `action` and `deadline`
		 * `nb_votes` set to 0
  * `vote(id))`
      * Check that the caller is a member:
	     * i.e. `members[caller]` exists
      * Check deadline: `now > requests[id].deadline`
	  * Check caller has not voted already:
	     * `votes[id, caller]` does not exist
      * Record vote:
	     * Create `votes[id, caller]` entry
	  * Increment `requests[id].nb_votes`
	  * If we have a majority of votes: 
	     * `requests[id].nb_votes * 2 > nb_members`
	     * Execute `requests[id].lambda` and the transactions it returns
		 * Delete entry `requests[id]`
  * `add_member(user)`
      * Check caller is DAO: `caller == self`
	  * Create entry `members[user]`, checking that it doesn't already exist
	  * Increment `nb_members`
  * `remove_member(user)`
      * Check caller is DAO: `caller == self`
	  * Delete entry `members[user]`, checking that it exists
	  * Decrement `nb_members`
  {% /list %}
{% /table %}

## DeFi: Flash Loan

A flash loan is one of the many tools of decentralized finance (deFi). In essence, it provides a way for a user to temporarily get access to large amounts of tez, without any collateral. This allows them to take advantage of opportunities and make a profit, without the need to have their own funds.

### Principle

The idea is that the following steps can will be done in an atomic way (all within the same transaction):
- the borrower receives the requested flash loan amount from the contract
- the borrower uses the amount in a series of calls to other contracts, that allow them to make some instant profit
- the borrower then pays the requested amount plus some interest to the contract pocketing any profit made

The key aspect to understand is that all this is done atomically, which means that if any of these step fails, and if for example the borrower is not able to pay back the borrowed amount plus interest, then the whole sequence is canceled, as if it never happened. There is no risk at all for the lender contract.This contract can even lend the same tez to multiple different people within the same block, as each loan is paid back immediately, so the tokens can be used again for another loan.

One simple example of a flash loan is arbitrage; if two different exchanges offer to buy/sell the same token but at a different price, the user can buy tokens from one exchange at the lower price, then sell it to the other exchange at a higher price, making a profit.

### Entrypoints

- `borrow` - called by the borrower, indicating how many tez they need. The amount is transferred to the caller, then a callback they provided is executed. At the end of this entrypoint, we verify that this callback has repaid the loan.
- `repay` - called by the callback once it times to repay the loan. The call should come with payment of the borrowed amount, plus some interest.
- `check_repaid` - called by the `borrow` entrypoint after the call to the callback. `borrow` can't do the verification itself, since the execution of the callback is done after all the code of the entrypoint is executed.


{% table %}
* **Flash Loan** {% colspan=2 %}
---
* **Storage**
* **Entrypoint Effects**
---
* {% list type="checkmark" %}
  * `admin`: `address`
  * `interest_rate`: `nat`
  * `in_progress`: `boolean`
  * `loan_amount`: `tez`
  * `repaid`: `boolean`
  {% /list %}
* {% list type="checkmark" %}
  * `borrow(loan_amount: tez, callback: address)`
      * Check `in_progress` is `False`
	  * Set `in_progress` to `True`
	  * Transfer `loan_amount` to `caller`
	  * Set storage `loan_amount` to `loan_amount`
	  * Set `repaid` to `False`
	  * Create call to callback
	  * Create call to `check_repaid`
  * `repay()`
      * Check `in_progress` is `True`
	  * Check `paid_amount > loan_amount + interest`
	  * Set `repaid` to `True`
  * `check_repaid())`
      * Check `repaid` is `True`
  * `collect(nbTez)`
      * Check `caller` is `admin`
	  * Transfer `nbTez` to `admin`
  {% /list %}
{% /table %}
