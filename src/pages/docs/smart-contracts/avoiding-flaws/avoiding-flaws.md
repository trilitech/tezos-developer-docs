---
id: avoiding-flaws
title: Avoiding flaws
authors: Mathias Hiron, Nomadic Labs
---

This chapter lists a number of common flaws in smart contracts.

With each type of flaw, it presents best practices that we invite you to apply when designing or reviewing contracts.

- [1. Using <code>source</code> instead of <code>sender</code> for authentication](#source-instead-of-sender-for-authentication)
- [2. Transferring tez in a call that should benefit others](#2-transferring-tez-in-a-call-that-should-benefits-others)
- [3. Performing unlimited computations](#3-performing-unlimited-computations)
- [4. Needlessly relying on one entity to perform a step](#4-needlessly-relying-on-one-entity-to-perform-a-step)
- [5. Trusting signed data without preventing wrongful uses](#5-trusting-signed-data-without-preventing-wrongful-uses)
- [6. Not protecting against bots (BPEV attacks)](#6-not-protecting-against-bots-bpev-attacks)
- [7. Using unreliable sources of randomness](#7-using-unreliable-sources-of-randomness)
- [8. Using computations that cause tez overflows](#8-using-computations-that-cause-tez-overflows)
- [9. Contract failures due to rounding issues](#9-contract-failures-due-to-rounding-issues)
- [10. Re-entrancy flaws](#10-re-entrancy-flaws)
- [11. Unsafe use of Oracles](#11-unsafe-use-of-oracles)
- [12. Forgetting to add an entry point to extract funds](#12-forgetting-to-add-an-entry-point-to-extract-funds)
- [13. Calling upgradable contracts](#13-calling-upgradable-contracts)
- [14. Misunderstanding the API of a contract](#14-misunderstanding-the-api-of-a-contract)

## 1. Using <code>source</code> instead of <code>sender</code> for authentication

### Summary:

> Using <code>source</code> to check who is allowed to call an entry point can be dangerous. Users may be tricked into indirectly calling this entry point and getting it to perform unintended transactions. It is safer to use <code>sender</code> for that purpose.

### Reminder: <code>source</code> vs <code>sender</code>

Smart contracts have two ways to get information about who made the call to a contract:
- <code>source</code> represents the address of the user who made the original call
- <code>sender</code> (or <code>caller</code> in some languages) represents the address of the direct caller.

For example, consider the chain of contract calls A → B → C, where a user A calls a contract B, that then calls a contract C. Within contract C, <code>source</code> will be the address of A, whereas <code>sender</code> will be the address of B.

### Example of vulnerable contract:

The <code>CharityFund</code> contract below has a <code>donate</code> entry point that sends some tez to a <code>charity</code>. To make sure only <code>admin</code> can initiate donations, this entry point checks that <code>admin</code> is equal to <code>source</code>.

<table>
<tr><td colspan="2"><strong>CharityFund</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>admin: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>deposit()
			<ul>
				<li>nothing (therefore accepting transfers of tez)</li>
			</ul>
		</li><br/>
		<li>donate(donation: tez, charity: address)
			<ul>
				<li><strong>Check that <code>source</code> == <code>admin</code></strong></li>
				<li>Create transaction to transfer <code>dontation</code> to <code>charity</code></li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Example of attack:

The contract <code>FakeCharity</code> below, can pass itself as a charity to receive a small donation from <code>CharityFund</code>. It can then take control of the <code>CharityFund</code> and transfer a large donation to the account of the attacker.

To do so, it contains a <code>default</code> entry point, that will be called when <code>CharityFund</code> makes its donation. Instead of simply accepting the transfer, it initiates a new large donation of 1000 tez to the attacker. When <code>CharityFund</code> then checks if the call is allowed, it checks the value of <code>source</code>, which is indeed the admin, since it was the admin who initiated the first call of this whole chain of transactions.

<table>
<tr><td colspan="2"><strong>FakeCharity</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>attackedContract: CharityFund contract</li>
		<li>attacker: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>default()
			<ul>
				<li>Create call to attackedContract.donate(1000tez, attacker)</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Best practice

The best way to prevent this type of attacks is simply to use <code>sender</code> (or <code>caller</code> in some languages), to check the identity of the user who called the contract. 

## 2. Transferring tez in a call that should benefits others

### Summary

> Sending tez to an address may fail if the address is that of a contract that doesn't accept transfers. This can cause the entire call to fail, which is very problematic if that call is important for other users.

### Example of attack

Take the following (partial) contract, that allows users to purchase NFTs, and sends 5% of royalties on each transaction:

<table>
<tr><td colspan="2"><strong>NFTSale</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>tokens: big-map<br/>
			Key:
			<ul>
				<li>tokenID: int</li>
			</ul>
			Value:
			<ul>
				<li>owner: address</li>
				<li>author: address</li>
				<li>price: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>buy(tokenID)
			<ul>
				<li>check that transferred amount = tokens[tokenID].price</li>
				<li>send 5% of transferred amount to tokens[tokenID].author</li>
				<li>send remaining tez to tokens[tokenID].owner</li>
				<li>set tokens[tokenID].owner to caller</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

The author could be a contract, that may fail if the user that controls it decides to prevent future sale of their NFTs.

### Best practice

One idea could be to only allow implicit accounts as the destination of transfers of tez, as implicit accounts may never reject a transfer of tez.

This is possible but not recommended, as it limits the usage of the contract, and for example prevents the use of multi-sigs or DAOs as the authors of NFTs.

A better solution is to avoid directly transferring tez from an entry point that does other operations, and instead, let the destination of that transfer fetch the funds themselves. One generic apprach is to include an internal ledger in the contract:

<table>
<tr><td colspan="2"><strong>NFTSale (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>tokens: big-map<br/>
			Key:
			<ul>
				<li>tokenID: int</li>
			</ul>
			Value:
			<ul>
				<li>owner: address</li>
				<li>author: address</li>
				<li>price: tez</li>
			</ul>
		</li>
		<li>ledger: big-map<br/>
			Key:
			<ul>
				<li>user: address</li>
			</ul>
			Value:
			<ul>
				<li>amount: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>buy(tokenID)
			<ul>
				<li>check that transferred amount = tokens[tokenID].price</li>
				<li>add 5% of transferred amount to ledger[tokens[tokenID].author]</li>
				<li>add remaining tez to ledger[tokens[tokenID].owner]</li>
				<li>set tokens[tokenID].owner to caller</li>
			</ul>
		</li><br/>
		<li>claim()
			<ul>
				<li>Send ledger[caller].amount to caller</li>
				<li>Set ledger[caller].amount to 0 tez</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>


## 3. Performing unlimited computations

### Summary

> There is a limit to how much computation a call to a smart contract may perform, expressed in terms of a gas consumption limit per operation. Any call to a contract that exceeds this limit will simply fail. If an attacker has a way to increase this amount of computation, for example by adding data to a list that the contract will iterate through, they could prevent future calls to this contract, and in doing so, locking all funds in the contract.

### Example of attack

Take for example this smart contract, that allows donors to lock some funds, with an associated deadline. The owner may claim any funds that have an expired deadline:

<table>
<tr><td colspan="2"><strong>TimeLock</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>lockedAmounts: list of records<br/>
			<ul>
				<li>deadline: address</li>
				<li>amount: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>lockAmount(deadline)
			<ul>
				<li>add record with (deadline, transferred amount) to lockedAmounts</li>
			</ul>
		</li><br/>
		<li>claimExpiredFunds()<br/>
			<ul>
			<li>for each item in lockedAmounts<br/>
				<ul>
					<li>if item.deadline &lt; now<br/>
					<ul>
						<li>send item.amount to owner</li>
						<li>delete item from lockedAmounts</li>
					</ul>
					</li>
				</ul>
			</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Anyone could attack this contract by calling the <code>lockAmount</code> entry point with 0 tez many times, to add so many entries into the <code>lockedAmount</code> list, that simply looping through the entries would consume too much gas.

From then on, all the funds would be forever locked into the contract.

Even simply loading the list into memory and deserializing the data at the beginning of the call, could use so much gas that any call to the contract would fail.

The same attack could happen with any kind of data that can grow indefinitely, including:
- integers and nats, as they can be increased to an arbitrary large value
- strings, as there is no limit on their lengths
- lists, sets, maps, that can contain an arbitrary number of items

### Best practice

There are three different ways to avoid this type of issue:

#### 1. Prevent data from growing too much:
- make it expensive, by requesting a minimum deposit for each call that increases the size of the stored data.
- set a hard limit, by rejecting any call that increases the size of the stored data beyond a given limit.

Here is a version of the contract with these two fixes:
	
<table>
<tr><td colspan="2"><strong>TimeLock (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>lockedAmounts: list of records<br/>
			<ul>
				<li>deadline: address</li>
				<li>amount: tez</li>
			</ul>
		</li>
		<li>nbEntries: int</li>
	</ul>
</td>
<td>
	<ul>
		<li>lockAmount(deadline)
			<ul>
				<li>check that transferred amount &ge; 10 tez</li>
				<li>check that nbEntries &le; 100</li>
				<li>add record with (deadline, transferred amount) to lockedAmounts</li>
				<li>increment nbEntries</li>
			</ul>
		</li><br/>
		<li>claimExpiredFunds()<br/>
			<ul>
			<li>for each item in lockedAmounts<br/>
				<ul>
					<li>if item.deadline &lt; now<br/>
					<ul>
						<li>send item.amount to owner</li>
						<li>delete item from lockedAmounts</li>
						<li>decrement nbEntries</li>
					</ul>
					</li>
				</ul>
			</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

#### 2. Store data in a big-map

Unless it's already in the cache, all data in the storage of a contract needs to be loaded and deserialized when the contract is called, and reserialized afterwards. Long lists, sets or maps therefore can increase gas consumption very significantly, to the point that it exceeds the limit per operation.

Big-maps are the exception: instead of being deserialized/reserialized entirely for every call, only the entries that are read or written are deserialized, on demand, during the execution of the contract.

Using big-map allows contracts to store unlimited data. The only practical limit is the time and costs of adding new entries.

This is of course only useful if the contract only loads a small subset of entries during a call.

#### 3. Do computations off-chain

The following is an approach you should always try to apply when designing your contracts:

> Avoid doing computations on-chain, if they can be done off-chain. Pass the results as parameters of the contract, and have the contract check the validity of the computation.

In our example, we could store all the data about locked funds in a big-map. The key could simply be an integer that increments every time we add an entry.

Whenever the user wants to claim funds with expired deadlines, do the computation off-chain, and send a list of keys for entries that have an expired deadline and significant funds.

Here is our example contract fixed using this and the previous approach:

<table>
<tr><td colspan="2"><strong>Timelock (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>lockedAmounts: big-map<br/>
			Key:
			<ul>
				<li>ID: nat</li>
			</ul>
			Value:
			<ul>
				<li>deadline: address</li>
				<li>amount: tez</li>
			</ul>
		</li>
		<li>currentID: int</li>
	</ul>
</td>
<td>
	<ul>
		<li>lockAmount(deadline)
			<ul>
				<li>check that transferred amount &ge; 10 tez</li>
				<li>add entry lockedAmounts[currentID] with value (deadline, transferred amount)</li>
				<li>increment currentID</li>
			</ul>
		</li><br/>
		<li>claimExpiredFunds(entries: list of nat)<br/>
			<ul>
			<li>
				for each itemID in entries<br/>
				<ul>
					<li>check that lockedAmounts[itemID].deadline &lt; now</li>
					<li>send lockedAmounts[itemID].amount to owner</li>
					<li>delete lockedAmounts[itemID]</li>
				</ul>
			</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

With this approach, the caller has full control on the list of entries sent to claimExpired and on its size, so there is no risk of getting the contract locked.

## 4. Needlessly relying on one entity to perform a step

### Summary

> Relying on one entity involved in a contract to perform a step that shouldn't require that entity's approval, breaks the trustless benefits that a smart contract is intended to provide. In some cases, it may cause funds to get locked in the contract, for example if this entity becomes permanently unavailable.

**Question:** can you find the flaw in this version of an NFT Auction contract?

<table>
<tr><td colspan="2"><strong>Auction</strong></td></tr>
<tr><td width="225px"><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>tokens: big-map<br/>
			Key:
			<ul>
				<li>contract: address</li>
				<li>tokenID: int</li>
			</ul>
			Value:
			<ul>
				<li>seller: address</li>
				<li>topBidder: address</li>
				<li>topBid: tez</li>
				<li>deadline: datetime</li>
			</ul>
		</li><br/>
		<li>ledger: big-map
			<ul>
				<li>key: address</li>
				<li>value: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>addToMarket(contract, tokenID, deadline)
			<ul>
				<li>Check that caller owns the NFT</li>
				<li>Transfer ownership of the NFT to the marketplace</li>
				<li>Create an entry in tokens, with:
				<ul>
					<li>contract and tokenID as the key</li>
					<li>caller as the seller</li>
					<li>caller as the initial value of topBidder</li>
					<li>0 tez as the initial value of topBid</li>
					<li>the last parameter as the deadline</li>
				</ul>
				</li>
			</ul>
		</li><br/>
		<li>bid(contract, tokenID)
			<ul>
				<li>Check that now is before the deadline</li>
				<li>Check that the amount transferred is higher than the current topBid</li>
				<li>Add the previous topBid to the ledger, to be claimed by the previous topBidder</li>
				<li>Store the caller as topBidder, and the amount transferred as topBid</li>
			</ul>
		</li><br/>
		<li>claimNFT(contract, tokenID)
			<ul>
				<li>Check that now is after the deadline</li>
				<li>Check that the caller is the topBidder for this token</li>
				<li>Transfer token ownership to the caller</li>
				<li>Add the value of topBid to the ledger, to be claimed by the seller</li>
			</ul>
		</li><br/>
		<li>claim()
			<ul>
				<li>Verify that ledger[caller] exists</li>
				<li>Create a transaction to send ledger[caller].value to caller</li>
				<li>Delete ledger[caller]</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

**Answer:** the issue with this contract is that the <code>claimNFT</code> entry point only allows the topBidder to call it. If this user never calls the entry point, not only the amount they paid stays stuck in the contract and the seller never receives the funds, but the NFT also stays stuck in the contract. This is a pure loss for the seller.

The top bidder has a strong incentive to call <code>claimNFT</code>, as they have already paid for the NFT and benefit from the call by getting the NFT they paid for. However, they may simply have disappeard somehow, lost access to their private keys, or simply forgot about the auction. Worse, as they have full control on whether the seller gets the funds or not, they could use this as leverage on the seller, to try to extort some extra funds from them.

Requiring for the seller themselves to call the entry point instead of the topBidder would lead to a similar issue.

In this case, the solution is simply to allow anyone to call the entry point, and make sure the token is transferred to topBidder, no matter who the caller is. There is no need to have any restriction on who may call this entry point.

### Best practice

When reviewing a contract, go through every entry point and ask: "What if someone doesn't call it?"

If something bad would happen, consider these approaches to reduce the risk:
- Make it so that other people can call the entry point, either by letting anyone call it, if it is safe, or by having the caller be a multi-sig contract, where only a subset of the people behind that multi-sig need to be available for the call to be made.

- Add financial incentives, with a deposit from the entity supposed to call the entry point, that they get back when they make the call. This reduces the risk that they simply decide not to call it, or forget to do so.


- Add a deadline that allows the other parties to get out of the deal, if one party doesn't do their part in time. Be careful, as in some cases, giving people a way to get out of the deal may make the situation worse.


## 5. Trusting signed data without preventing wrongful uses

### Summary

> Using a signed message from an off-chain entity as a way to ensure that this entity agrees to a certain operation, or certifies the validity of some data, can be dangerous. Make sure you prevent this signed message from being used in a different context than the one intended by the signer.

### Example of attack

Let's say that off-chain, Alice cryptographically signs a message that says "I, Alice, agree to transfer 100 tokens to Bob", and that Bob can then call a contract that accepts such a message, and does transfer tokens from Alice to him.

<table>
<tr><td colspan="2"><strong>Ledger</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>ledger: big-map<br/>
			Key:
			<ul>
				<li>user: address</li>
			</ul>
			Value:
			<ul>
				<li>tokens: int</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>handleMessage(message: record(signer, nbTokens, destination), signature)
			<ul>
				<li>check that signature is a valid signature of the message by message.signer</li>
				<li>check that ledger[signer].tokens &ge; message.nbTokens</li>
				<li>substract message.nbTokens from ledger[signer].tokens</li>
				<li>add message.nbTokens to ledger[destination].tokens</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>


Bob could steal tokens from Alice in two different ways:
- Bob could call the contract several times with the same message, causing multiple transfers of 100 tokens from Alice to him.
- Bob may send the same message to another similar contract, and steal 100 of Alice's tokens from that other contract.

### Best practice

To make sure the message is meant for this contract, simply include the address of the contract in the signed message.

Preventing replays is a bit more complex, and the solution may depend on the specific situation:

- Maintain a counter for each potential signer in the contract, and include the current value of that counter in the next message. Increment the counter when the message is received.

<table>
<tr><td colspan="2"><strong>Ledger (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>counters: big-map<br/>
			Key:
			<ul>
				<li>signer: address</li>
			</ul>
			Value:
			<ul>
				<li>counter: int</li>
			</ul>
		</li>
		<li>ledger: big-map<br/>
			Key:
			<ul>
				<li>user: address</li>
			</ul>
			Value:
			<ul>
				<li>tokens: int</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>handleMessage(message: record(contract, signer, nbTokens, destination, counter), signature)
			<ul>
				<li>check that signature is a valid signature of the message by message.signer</li>
				<li>check that message.contract = self (address of this contract itself)</li>
				<li>check that message.counter = counters[signer].counter</li>
				<li>increment counters[signer].counter</li>
				<li>check that ledger[signer].tokens &ge; message.nbTokens</li>
				<li>substract message.nbTokens from ledger[signer].tokens</li>
				<li>add message.nbTokens to ledger[destination].tokens</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

This is the approach used in the Tezos protocol itself, for preventing replays of native transactions. However, it prevents sending multiple messages from the same signer within a short period. This could be quite inconvenient for the present use case, as the whole point of signed messages, is that they can be prepared off-chain, and used much later.

- Including a unique arbitrary value in the message: the contract could then keep track of which unique values have already been used. The only downside is the cost of the extra storage required.

<table>
<tr><td colspan="2"><strong>Ledger (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>ledger: big-map<br/>
			Key:
			<ul>
				<li>user: address</li>
			</ul>
			Value:
			<ul>
				<li>tokens: int</li>
			</ul>
		</li>
	</ul>
	<ul>
		<li>usedUniqueIDs: big-map<br/>
			Key:
			<ul>
				<li>uniqueID: bytes</li>
			</ul>
			Value:
			<ul>
				<li>nothing</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>handleMessage(message: record(contract, signer, nbTokens, destination, uniqueID), signature)
			<ul>
				<li>check that message.contract = self (address of this contract)</li>
				<li>check that signature is a valid signature of the message from message.signer</li>
				<li>check that usedUniqueIDs[uniqueID] doesn't exist</li>
				<li>check that ledger[signer].tokens &ge; message.nbTokens</li>
				<li>substract message.nbTokens from ledger[signer].tokens</li>
				<li>add message.nbTokens to ledger[destination].tokens</li>
				<li>add entry usedUniqueIDs[uniqueID]</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

## 6. Not protecting against bots (BPEV attacks)

### Summary

> On a blockchain, all transactions, including calls to smart contracts, transit publicly on the P2P gossip network, before a block producer includes some of them in a new block, in the order of their choosing. In the absence of protection measures such as commit and reveal schemes and time locks, some of these contract calls may contain information that can be intercepted and used by bots, to the disadvantage of the original caller, and often, of the health of the blockchain itself.

### Example of attack

Let's consider a smart contract for a geocaching game, where users get rewarded with some tez if they are the first to find hidden capsules placed in a number of physical locations. The contract contains the hash of each of these passwords. When a user calls the contract with a password that has never been found before, they receive a reward.

<table>
<tr><td colspan="2"><strong>Geocaching</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>capsules: big-map<br/>
			Key:
			<ul>
				<li>passwordHash: bytes</li>
			</ul>
			Value:
			<ul>
				<li>reward: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>claimReward(password)
			<ul>
			    <li>compute hashedPassword = hash(password)</li>
				<li>check that capsules[hashedPassword] exists</li>
				<li>transfer capsules[hashedPassword].reward tez to caller</li>
				<li>delete capsules[hashedPassword]</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

A bot may listen to the gossip network and notice the call to claimReward, along with the password, before it is included in the next block.

This bot may simulate performing the same transaction with itself as the caller, and find out that this results in it receiving a reward. It can do so automatically, without knowing anything about the contract.

All it then has to do is to inject this new transaction, using a higher fee than the original caller, so that the baker of the next block includes it earlier in that block. Indeed, bakers usually place transactions with high fees earlier in their block. If successful, the bot gets the reward, while the original caller who did all the work of finding the capsule, gets nothing.

In the end, as multiple bots are likely to compete for this reward, they will engage in a bidding war over this transaction. The baker itself ends up getting most of the benefits from this attack, as it collects the increased fees. For this reason, this type of attack is part of what we call **Block Producer Extractable Value (BPEV)**.

Overall, the existence of such attacks has a negative impact on the health of the blockchain, as they eliminate the incentive for doing the actual work of finding opportunities. The bidding wars generate unnecessary transactions that slow the network while increasing the fees callers have to pay for their legitimate transactions to get included in the next block.

### Other types of bots attacks and BPEV

There are a number of different ways bots can take advantage of the fact that calls to smart contracts are publicly visible on the gossip network before they are included in a block.

Furthermore, block producers can take advantage of the fact that they have significant control on the content of the block: which transactions get included and in which order, as well as what will be the precise value for the timestamp of the next block.

A lot of these attacks take place in the field of DeFi (Decentralized Finance), where the value of assets change all the time, including within a single block.

- **Copying a transaction** is the easiest attack, as is done in our example. The most common such situation is the case of **arbitrage opportunities**. Consider, for example, two separate DEXes (Decentralized EXchanges), that temporarily offer a different price for a given token. An arbitrage opportunity exists as one may simply buy tokens on the DEX with the cheaper price, and resell them for more on the other DEX. A user who carefully analyzes the blockchain and detects such an opportunity, may get this opportunity (and all their work to detect it) snatched from them by a bot that simply copies their transaction.

- **Injecting an earlier transaction** before the attacked transaction. For example, if a user injects a transaction to purchase an asset at any price within a certain range, a bot could insert another transaction before it, that purchases the asset at the low end of that range, then sells it to this user at the high end of that range, pocketing the difference.

- **Injecting a later transaction** right after the target transaction. For example, as soon as an arbitrage oppourtunity is created by another transaction. This isn't an attack against the target transaction, but the potentially numerous generated transactions produced by bots to try to fight for the right spot in the sequence of transactions, may cause delays in the network, or unfairly benefit the block producer, who gets to decide in which order transactions are performed within the block.

- **Sandwich attacks**, where a purchase transaction is injected to manipulate the price of an asset before the target transaction occurs, and a later sale transaction is injected to sell the asset with a profit, at the expense of the target transaction.

More complex schemes that manipulate the order of transactions to maximize profits can be designed, all at the cost of healthier and legitimate uses.

### Best practice

Preventing this type of attack is not easy, but part of the solution, is to use a **commit and reveal** scheme.

This scheme involves two steps:
- **Commit**: the user sends a hash of the information they intend to send in the next step, without revealing that information yet. The information hahsed should include the user's address, to prevent another user (or bot) from simply sending the same commit message.

- **Reveal**: once the commit call has been included in a block, the user then sends the actual message. The contract can then verify that this message corresponds to the commit sent in the previous step, and that the caller is the one announced in that message.

Using this approach is sufficient to fix our example:
- The commit message sent by the user who found the capsule may simply be a hash of a pair containing the password and the address of the caller.
- The reveal call will simply send the password.

Here is the fixed contract:

<table>
<tr><td colspan="2"><strong>Geocaching (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>capsules: big-map<br/>
			Key:
			<ul>
				<li>passwordHash: bytes</li>
			</ul>
			Value:
			<ul>
				<li>reward: tez</li>
			</ul>
		</li>
		<li>commits: big-map<br/>
			Key:
			<ul>
				<li>commitedData: bytes</li>
			</ul>
			Value:
			<ul>
				<li>Nothing</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>commit(commitedData)
			<ul>
				<li>create entry commits[commitedData]</li>
			</ul>
		</li><br/>
		<li>claimReward(password)
			<ul>
				<li>compute commitData = hash((password, caller))</li>
				<li>check that commits[commitData] exists</li>
				<li>delete commits[commitData]</li>
			    <li>compute hashedPassword = hash(password)</li>
				<li>check that capsules[hashedPassword] exists</li>
				<li>transfer capsules[hashedPassword].reward tez to caller</li>
				<li>delete capsules[hashedPassword]</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Using financial incentives and Timelock for extra protection

Our geocaching example is a straightforward case where the situation is binary: either a user found a password, or it didn't.

Other situations may be more complex, and attackers may generate a number of commitments for different messages, in the hope that once they collect information during the reveal phase, revealing one of them will be beneficial to them.

This could be as simple as one commitment that bets that the value of an asset will increase, and another that bets that the value will decrease. Depending on what happens when other users reveal their own messages that may affect the price of this asset, the attacker may decide to reveal one or the other message.

To protect against such attack, financial incentives can be used, where users have to send a deposit along with each commitment. Users who never reveal the message corresponding to their previous commit lose their deposit.

Furthermore, the TimeLock cryptographic primitive may be used instead of a hash for the commit phase. This approach allows anyone to decrypt the content of the commit, given enough time, therefore forcing the reveal of the commited value.

For more information, check Nomadic Lab's [Blog Post on this topic](https://research-development.nomadic-labs.com/timelock-a-solution-to-minerblock-producer-extractable-value.html).


## 7. Using unreliable sources of randomness

### Summary

> Picking a random value during a contract call, for example for selecting the winner of a lottery, or fairly assigning newly minted NFTs to participants of a pre-sale, is far from being easy. Indeed, as any contract call must run on hundreds of nodes and produce the exact same result on each node, everything needs to be predictable. Most ways to generate randomness have flaws and can be taken advantage of.

### Examples of bad sources of randomness

- **The timestamp of a block**. Using the current timestamp of the local computer is a commonly used source of randomness on non-blockchain software, as the value is never the same. However, its use is not recommended at all in security sensitive situations, as it only offers a few digits of hard to predict randomness, with a precision in microseconds or even milliseconds.

	On the blokchain, it's a very bad idea, for multiple reasons:
	- the precision of the timestamp of a block is only in seconds
	- the value can be reasonably well predicted, as bakers often take a similar time to produce their block
	- the baker of the previous block can manipulate the timestamp it sends, therefore controlling the exact outcome.
	
- **The value of a new contract's address**. A contract may deploy a new contract and obtain its address. Unfortunately, a contract address is far from being as random as it looks. It is simply computed based on the operation group hash and an origination index (starting from 0 which is increased for every origination operation in the group). It can therefore be easily manipulated by the creator of the operation which is no better than trusting them.

- **The exchange rate between currencies**. One may consider using an off-chain Oracle to obtain the exchange rate between two common currencies, such as between the USD and Euro, and use it to get a few bits of entropy. After all, anyone would only dream of predicting the value of such exchange rates, so it might as well be considered random. There are however a number of issues with this approach:

	- We can only get a few bits of entropy (randomness), which is usually insufficient.
	- One of the entities behind the off-chain Oracle could influence the exact value. The exact way to do this depends on the specifics of the Oracle, but it's  likely that there is a way to do so.
	- A baker could also censor some of the transactions involved in the off-chain Oracle, and by doing so, influence the exact value as well.

- **A bad off-chain randomness Oracle**. Anyone can create an off-chain Oracle, and claim that this Oracle provides secure random values. Unfortunately, generating a random value off-chain in a reliable way, so that no single entity may influence or predict the outcome, is extremely hard. Don't blindly trust an Oracle, even if you find that many contracts use it already. A bad random Oracle may be the worst choice, as it could simply stop working and make your contract fail, or be under the control of a single person who then gains full control over all the outcomes of your contract that rely on it.

- **The hash of another source of randomness**. Hashing some input may seem like it produces some random output, spread rather evenly over a wide range of values. However, it is entirely predictable, and doesn't add any randomness to the value taken as input.

- **A combination of multiple bad sources of randomness**. It may seem like combining two sources of not so good randomness may be a good way to increase the quality of the randomness. However, although combining multiple sources of randomness increases the amount of entropy and makes it harder to predetermine the outcome, it also increases the risk for one entity to control this outcome. This entity only needs to have some control over the value of one of the sources of randomness, to gain the capacity to have some control over the final result.

**Remember** that an attacker only needs the ability to pick between two possible outcomes, or to predict which one is more likely, to significanly increase their chance of getting an outcome that benefits them.


### Best practice

The best practice is to avoid having to rely on a source of randomness, if you can. This avoids issues of reliability of the randomness source (which may stop working in the future), predictability of the outcome, or even control of the outcome by one party, such as a block producer.

If you really need a source of randomness, the two following approaches may be used:

- **Combine random values provided by every participant**. Each potential beneficiary of a random selection could contribute to the randomness: get each participant to pick a random value within a wide range, add all the received values, and use the result as a source of randomness. For this to work, a **commit and reveal** schemed needs to be used, combined with **financial incentives** and the use of a **timelock** cryptographic primitive, to make sure none of the participants may pick between different outcomes, simply by not revealing their value. This is a bit tricky to do well, and for it to be practical, it requires participants to be able to react fast, as the window for each participant to commit their random value has to be very short (a small number of blocks).

- **Use a good randomness Oracle**. It is, in theory, possible to create a good off-chain random Oracle. Chainlink offers a [randomness Oracle](https://docs.chain.link/docs/chainlink-vrf/) based on a [verifiable random function](https://en.wikipedia.org/wiki/Verifiable_random_function) (VRF), and may be one of the few, if not the only reasonably good available randomness Oracle. However, even assuming it's as good as it advertises, it is not ideal, as it is based on the assumption that there is no collusion between the owner of the smart contract that uses it, and some of the nodes that provide random values. Finally, Chainlink VRF currently is only available on a small number of blockchains, which don't include Tezos. At the time of writing, there is no good randomness Oracle on Tezos that we would recommend.


## 8. Using computations that cause tez overflows

### Summary

> At the time of writing, tez values are stored as signed 64 bits. Overflows or underflows are not possible on Tezos, as all the basic operations will generate an error (failure) if the result would exceed the range of acceptable values. However, this doesn't mean you never need to worry about them, as these failures may prevent your contract from working and funds may end up being locked in the contract.

### Example of failure

Let's say you use this formula as part of some computation:

$tzRes = \sqrt{\dfrac{tzA^2 + tzB^2}{2}}$

Now suppose that $tzA$ and $tzB$ are both 5000 tez. More precisely, 5,000,000,000 Mutez.

$tzA^2$ is worth $25*10^{18}$ Mutez, which is more than the largest value that can be stored in a 64 bits signed value, about $9.223*10^{18}$ Mutez (precisely $2^{63} - 1$).

This computation, if done using the tez type, will therefore fail, even though the final result, 5000 tez, easily fits within a 64 bit signed integer.

The protection against overflows will prevent the transfer of an incorrect value, but will do so by preventing the call from being done entirely, which in itself could cause a major issue, such as locking the contract, with large sums of tez stuck forever.

### Best practice

The main recommendation is to be very careful when doing computations with the Tez type, and double check that any intermediate  values may never cause an overflow or underflow.

A good way to avoid such issues is to use int or nat as the type for storing these intermediate computations, as these types can hold arbitrary large values.


## 9. Contract failures due to rounding issues

### Summary

> As a contract call will simply fail if it tries to transfer even slightly more than its own balance, it is very important to make sure that when splitting the balance into multiple amounts sent to several people, the total can never exceed the balance, even by a single microtez, due to a rounding issue. More generally, the rounding caused by performing integer divisions can be dangerous if not done carefully.

### Example of flaw

The following contract will fail whenever the balance is not a multiple of 4 Mutez:

<table>
<tr><td colspan="2"><strong>Distribution</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>userA: address</li>
		<li>userB: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>distribute()
			<ul>
				<li>quarter, remainder = ediv(balance , 4)</li>
				<li>transfer balance - quarter to userA</li>
				<li>transfer balance - 3*quarter to userB</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Indeed, let's say the current balance is 101 mutez.

ediv(balance, 4) returns a pair with the result of the integer division of balance by 4, and the remainder of this division.

With a balance of 101 mutez, quarter will be 25 mutez

The amount transferred to userA will be 101 - 25 = 76 mutez
The amount transferred to userB will be 101 - 3*25 = 26 mutez

The total amount the contract attempts to transfer is 102 mutez, which is more than the balance. The call will fail.

### Best practice

When transferring a portion of the balance of a contract, try to do your computations based on what remains in the balance after the previous transfers:

Here is one way to write the contract in a safer way:

<table>
<tr><td colspan="2"><strong>Distribution (fixed)</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>userA: address</li>
		<li>userB: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>distribute()
			<ul>
				<li>quarter, remainder = ediv(balance , 4)</li>
				<li>amountUserA = balance - quarter to userA</li>
				<li>transfer amountUserA to userA</li>
				<li>remainder = balance - amountUserA</li>
				<li>transfer remainder to userB</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Whenever you perform divisions, be very careful about the impact that the incurred rounding may cause.

## 10. Re-entrancy flaws

### Summary

> A re-entrancy attack was the cause of the infamous DAO hack that took place on Ehtereum in June 2016, and eventually lead to the fork of Ethereum into Ethereum and Ethereum Classic. Tezos has been designed in a way that makes re-entrancy bugs less likely, but they are still possible. They happen when the attacked contract calls another contract, that may in turn call the attacked contract in a way that breaks assumptions made by its internal logic.

### Example of flawed contracts

The two contracts below manage unique tokens identified by IDs. The first contract is a simple ledger that keeps track of who owns each token. The second contract is in charge of purchasing tokens at predifined prices.

**Question:** can you figure out how to steal funds from them?

<table>
<tr><td colspan="2"><strong>Ledger</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>adminContract: contract</li>
		<li>tokens: big-map<br/>
		Key:
			<ul>
			<li>tokenID: int</li>
			</ul>
		Value:
			<ul>
			<li>owner: address</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>view getTokenOwner(tokenID)
			<ul>
				<li>return tokens[tokenID].owner</li>
			</ul>
		</li><br/>
		<li>changeOwner(tokenID, newOwner)
			<ul>
				<li>check that caller = adminContract</li>
				<li>set tokens[tokenID].owner to newOwner</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

<table>
<tr><td colspan="2"><strong>Purchaser</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>ledgerContract: contract</li>
		<li>purchasePrices: big-map<br/>
		Key:
			<ul>
			<li>tokenID: int</li>
			</ul>
		Value:
			<ul>
			<li>price: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>offerToken(tokenID)
			<ul>
				<li>Check that caller = ledgerContract.getTokenOwner(tokenID)</li>
				<li>Create transfer of purchasePrices[tokenID].price tez to caller</li>
				<li>Create call to tokenContract.changeOwner(tokenID, self)</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

### Example of attack

Here is how a contract could use re-entrancy to steal some funds from the purchaser contract.

<table>
<tr><td colspan="2"><strong>Attack</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>nbCalls: nat</li>
		<li>tokenID: nat</li>
		
	</ul>
</td>
<td>
	<ul>
		<li>attack(purchaserContract, tokenID)
			<ul>
				<li>set nbCalls = 2</li>
				<li>set storage.tokenID = tokenID</li>
				<li>Create call to purchaserContract.offerToken(tokenID)</li>
			</ul>
		</li><br/>
		<li>default()
			<ul>
				<li>decrement nbCalls</li>
				<li>if nbCalls &gt; 0
				<ul>
					<li>Create call to caller.offerToken(tokenID)</li>
				</ul>
				</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Let's assume that:
- the attacker contract owns the token with ID 42
- the purchaser contract lists a price of 100 tez for it
- someone calls attackContract.attack(purchaserContract, 42)

Here is the succession of steps that will take place:

- attackContract.attack(purchaserContract, 42)
	- it creates a call to purchaserContract.offerToken(tokenID)
- purchaserContract.offerToken(42) is executed
	- it checks that the caller is the owner
	- it creates a transfer of purchasePrices[42].price to attackContract (the caller)
	- it creates a call to ledgerContract.changeOwner(42, self)
- attackContract.default() is executed
	- it decrements nbCalls to 1
	- it creates a call to purchaserContract.offerToken(42)
- **100 tez are transferred from purchaserContract to attackContract**
- purchaserContract.offerToken(42) is executed
	- it checks that the caller is the owner (it still is)
	- it creates a transfer of purchasePrices[42].price to attackContract (the caller)
	- it creates a call to ledgerContract.changeOwner(42, self)
- attackContract.default() is executed
	- it decrements nbCalls to 0
	- it doesn't do anything else
- **100 tez are transferred from purchaserContract to attackContract**
- ledgerContract.changeOwner(42, purchaserContract) is executed
	- it sets tokens[42].owner to purchaserContract
- ledgerContract.changeOwner(42, purchaserContract) is executed
	- it sets tokens[42].owner to purchaserContract
	
In the end, the attacker contract received 200 tez for a token that was priced at 100 tez, so it stole 100 tez from the purchaser contract. If we had initially set nbCalls to 10, and assuming there were enough funds in the balance of the purchaserContract, 10 calls would have been made, and it would have received 1000 tez for its token, stealing 900 tez.

What makes this flaw possible and hard to detect is that a new call to the purchase contract can be initiated in the middle of the execution of its different steps, interferring with the business logic that otherwise seems very sound:
- send tez to the seller
- take ownership of the token

What really happens is:
- send tez to the seller
- seller does all kinds of things, including trying to sell its token a second time
- take ownership of the token



### Best practice

There are two methods to avoid re-entrancy flaws.

#### 1. Order the steps in a safe way.

The idea is to start with the steps that prevents future similar calls.

In our example, the flaw would have been avoided, if we simply changed the order of these two instructions:

- create transfer of purchasePrices[tokenID].price to caller
- create call to tokenContract.changeOwner(tokenID, self)

Into:

- create call to tokenContract.changeOwner(tokenID, self)
- create transfer of purchasePrices[tokenID].price to caller

This approach can work, but as contracts become more complex, it can become **really hard** to make sure all cases are covered.

#### 2. Use a flag to prevent any re-entrancy

This approach is more radical and very safe: put a boolean flag "isRunning" in the storage, that will be set to true while the contract is being used.

The code of the entry point should have this structure:
- check that isRunning is false
- set isRunning to true
- perform all the logic, including creating calls to other contracts
- create a call to an entry point that sets isRunning to false

Here is the new version of the contract, using both fixes:

<table>
<tr><td colspan="2"><strong>Purchaser contract</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>isRunning: bookean</li>
		<li>ledgerContract: contract</li>
		<li>purchasePrices: big-map<br/>
		Key:
			<ul>
			<li>tokenID: int</li>
			</ul>
		Value:
			<ul>
			<li>price: tez</li>
			</ul>
		</li>
	</ul>
</td>
<td>
	<ul>
		<li>offerToken(tokenID)
			<ul>
				<li>check that isRunning is false</li>
				<li>set isRunning to true</li>
				<li>check that caller = ledgerContract.getTokenOwner(tokenID)</li>
				<li>create call to tokenContract.changeOwner(tokenID, self)</li>
				<li>create transfer of purchasePrices[tokenID].price to caller</li>
				<li>create call to self.stopRunning()</li>
			</ul>
		</li><br/>
		<li>stopRunning()
			<ul>
				<li>check that caller is self</li>
				<li>set isRunning to false</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>


## 11. Unsafe use of oracles

### Summary

> Oracles provide a way for smart contracts to obtain information about the rest of the world, such as exchange rates, outcomes of games or elections. As they usually rely on services that are hosted off-chain, they don't benefit from the same safety measures and trustless features provided by the blockchain. Using them comes with its own flaws, from using oracles that provide information that can be manipulated by single entities or a small number of colluding entities, to oracles that simply stop working and provide obsolete information. Some types of oracles, such as online price oracles, may be manipulated by contracts to provide incorrect information. Every time an oracle returns inaccurate information, it creates an opportunity for attackers to take advantage of the situtation and steal funds.

### Reminder about oracles

A typical oracle is composed of two parts:
- an off-chain service that collects information from one or more sources
- an oracle smart contract, that receives this information, as well as requests from other contracts (in the case of on-demand oracles)

The off-chain service tracks the requests made to the smart contract, fetches the information, and calls the oracle contract with this information, so that it can store it and provide it to other contracts, usually for a fee.

### Danger 1: using a centralized oracle

If the off-chain service is controlled by a single entity that just sends the requested information without any way to verify its origin and validity, anyone who uses this oracle is at risk for multiple reasons:

- **reliability issue**: if that single entity simply stops providing that service, every contract that relies on it simply stops working.
- **accuracy issue**: the single entity may suddently decide to provide false information, causing all contracts that rely on this information to make bad decisions. The entity may then take advantage of these bad decisions.

Good decentralized oracles include systems that prevent single entities from stopping the oracle or manipulating the information it sends.

**Best pracice**: only use oracles that are decentralized, in such a way that no single entity, or even no small group of colluding entities, may stop the oracle from working, or provide manipulated information.

### Danger 2: not checking the freshness of information

Oracles often provide information that may change over time, such as the exchange rate between two currencies. Information that is perfectly valid at one point, become obsolete and incorrect just a few minutes later.

Good oracles always attach a timestamp to the information they provide. If for some technical reason, the off-chain part of the oracle is unable to send updated information to the oracle smart contract, then the stored information may get old. This could be caused by network congestion, or blocks getting full and bakers not including the oracle's transactions.

**Best practice**: make sure your contract always checks that the timestamp attached to information provided by oracles is recent.

### Danger 3: using on-chain oracles that can be manipulated

On-chain oracles don't provide data from off-chain sources. Instead, they provide access to data collected from other smart contracts. For example, an on-chain oracle could collect and provide data about the exchange rate between two tokens from one or more DEXes (Decentralized EXchanges) running on the same blockchain. Doing this safely is not as simple as it may seem.

**Example of attack**: an attacking contract could perform the following steps:
- use a flash-loan to borrow a lot of tez
- buy a large number of tokens from one DEX, which temporarily increases the price of this token in this DEX
- call a contract that makes bad decisions based on this manipulated price, obtained though an unprotected Oracle
- profit from these bad decisions
- sell the tokens back to the DEX
- pay the flash-loan back, with interest

In some cases,the current price could simply be a fluke, not caused by a malicious intent, but simply a legitimate large transaction. The price may not be representing the current real value.

Good online oracles never simply return the current value obtained from a single DEX. Instead, they use recent but past historical values, get rid of outliers and use the median of the remaining values. When possible, they combine data from multiple DEXes.

**Best practice**: if you need to make decisions based on the price of tokens from a DEX, make sure you always get the prices through a good online oracle that uses this type of measures.


## 12. Forgetting to add an entry point to extract funds

### Summary

> Being the author of a contract, and having deployed the contract yourself, doesn't automatically give you any specific rights about that contract. In particular, it doesn't give you any rights to extract funds from the balance of your own contract. All the profits earned by your contract may be locked forever, if you don't plan for any way to collect them.

### Example of flawed contract

Here is a flash loan contract. Can you find the flaw?

<table>
<tr><td colspan="2"><strong>Flash loan contract</strong></td></tr>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>interest_rate: nat</li><br/>
		<li>in_progress: boolean</li><br/>
		<li>loan_amount: tez</li><br/>
		<li>repaid: booean</li>
	</ul>
</td>
<td>
	<ul>
		<li>borrow(loan_amount: tez, callback: address)
			<ul>
				<li>Check that in_progress is false</li>
				<li>Set in_progress to true</li>
				<li>Transfer loan_amount to caller</li>
				<li>Set storage loan_amount to loan_amount</li>
				<li>Set repaid to false</li>
				<li>Create call to callback</li>
				<li>Create call to check_repaid</li>
			</ul>
		</li><br/>
		<li>repay()
			<ul>
				<li>Check that in_progress is true</li>
				<li>Check that paid_amount is more than loan_amount + interest</li>
				<li>Set repaid to true</li>
			</ul>
		</li><br/>
		<li>check_repaid()
			<ul>
				<li>Check that repaid is true</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

This flash loan contract may accumulate interests for years, with the owner happily watching the balance increase on a regular basis... One day, as this owner decides to retire, they will realize that they have no way to withdraw not only the profits, but also the initial funds.

### Best practice

Always verify that you have some way to extract the benefits earned by your smart contract. Ideally, make sure you do so using a multi-sig contract, so that you have a backup system in case you lose access to your private keys.

**Warning:** this may seem very obvious, but note that this very unfortunate situation happens more often that you may think.

More generally, when you test your contract, make sure you test the whole life cycle of the contract, including what should happen at the end of its life.

## 13. Calling upgradable contracts

### Summary

> On Tezos, contracts are not upgradable by default: once a contract has been deployed, there is no way to modify its code, for example to fix a bug. There are however several ways to make them upgradable. Doing so provides extra security for the author of the contract who has a chance to fix any mistakes, but may cause very significant risks for any user who relies on the contract.

### Reminder: ways to upgrade a contract

There are two main ways to make a contract upgradable:

- put part of the logic in a piece of code (a lambda), in the storage of the contract
- put part of the logic in a separate contract, whose address is in the storage of the main contract

In either case, provide an entry point that the admin may call, to change these values, and therefore change the behavior of the contract.

### Example of attack

Imagine that you write a contract, that relies on an upgradable DEX contract. You have carefully checked the code of that contract, that many other users have used before. The contract is upgradable, and you feel safe because that means the author may be able to fix any bugs they may notice.

Then one day, all the funds disappear from your contract. As often, your contract used the DEX to exchange your tokens for a different type of tokens, but somehow, you never received the new tokens.

You then realize that the owner of the DEX has gone rogue, and decided to upgrade its contract, in a way that the DEX collects tokens but never sends any back in exchange.

### Best practice

Before you use a contract, directly or as part of your own contract, make sure this contract can't be upgraded in a way that breaks the key aspects that you rely on.

If the contract you want to use is upgradable, make sure the upgrade system follows a very safe process, where the new version is known well in advance, and the decision to to activate the upgrade is done by a large enough set of independent users.

## 14. Misunderstanding the API of a contract

### Summary

> There are many contracts that provide a similar, common service: DEXes, Oracles, Escrows, Marketplaces, Tokens, Auctions, DAOs, etc. As you get familiar with these different types of contracts, you start automatically making assumptions about how they behave. This may lead you to take shortcuts when interacting with a new contract, read the documentation and the contract a bit too fast, and miss a key difference between this contract and the similar ones you have used in the past. This can have very unfortunate consequences.

### Best practice

Never make any assumptions about a contract you need to use, based on your previous experience with similar contracts. Always check their documentation and code very carefully, before you use it.

<!--
## Unpausable contracts
## Be careful about race conditions (TODO)
-->
