---
id: simple-nft-contract-2
title: First contracts - first flaws
authors: Mathias Hiron, Nomadic Labs
---

In this chapter, we will continue our discovery of smart contracts by adding features to our NFT contract, then discussing potential flaws and ways to prevent them.

## Flawed NFT with an increasing price

As smart contracts on Tezos are programmed with a Turing-complete language, we can imagine and implement all kinds of rules, with the only limit being our imagination. We can create digital objects with a number of interesting properties, create very unique collectibles, or even run interesting social experiments.

However, as we will see, adding new features comes with some risks, potential flaws and unintended consequences.

For example, just for fun, let’s say that we want to create an item that automatically becomes more expensive every time it is transferred. Instead of letting the owner set the price of their choice as we previously did, we will increase this price by 10% after every sale. If we start our NFT with a price of 1 tez, it will be worth 1.10 tez after one sale, 2.59 tez after 10 sales and 13780 tez after 100 sales.

To benefit from this as the author, in case our very unique NFT gets popular, let’s make sure we get a share of these sales by adding a royalties feature: every time the NFT is sold, let’s award ourselves 5% of the sale price. We will add our own address to the storage, as the author of the NFT.

**Question:** how would you design an NFT smart contract with these automated price increases, and royalties features?

Here is one way we could do this:

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>author: address</li>
		<li>metadata: string</li>
		<li>price: tez</li>
	</ul>
</td>
<td>
	<ul>
		<li>buy()
			<ul>
				<li>Check that the amount transferred is equal to the price</li>
				<li>Send 5% of the price to the author</li>
				<li>Send the remaining amount to the owner</li>
				<li>Replace owner with the caller in the storage</li>
				<li>Increase price by 10% in the storage</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Here is the corresponding implementation in the Archetype language:

```archetype
archetype risingNft(author : address, owner : address, metadata : string)

variable price : tez = 1tz

entry buy() {
  require { r1: transferred = price }
  effect {
    const royalties = 5% * price;
    transfer royalties to author;
    transfer (price - royalties) to owner;
    price := 110% * price;
    owner := caller;
  }
}
```

Unfortunately, we will see that as straightforward as this smart contract looks, it has some flaws, and doesn't provide the guarantees it seems to promise.

Note that Tezos purposely doesn’t support floating point numbers. This is to avoid not only imprecisions and rounding errors, but most of all, to ensure that there is no risk of inconsistencies between nodes that all need to perform the same computation, but may use different implementations of the Tezos protocol.

Additionally, formal verification doesn’t handle floating point operations very well. Instead, Tezos provides integer division, where we can both get the rounded down result of the integer division, and the remainder. In the example above, the Archetype language provides a syntax that makes it look like we are handling floating point numbers, but the actual values manipulated are fractions. 0.05 is actually the pair (1, 20) representing 1/20.

## Potential flaws

To figure out the flaws presented in this section, you need to know that any address can be a contract. Furthermore, when we send some tez to a contract without specifying any entry point, like we would for a transfer to a regular account, this will only work if the contract has a “default” entry point. This entry point may in turn execute some code and create new transactions.

**Question:** can you figure out a way that someone could sell this NFT without paying royalties to the author? Or a way that someone could bypass the system that forces the price to increase by 10% after every sale?

**Hint:** remember that if an entry point fails for any reason, everything is canceled.

### Initial attack: selling the NFT to yourself

Let’s say that you just bought this NFT, and want to make sure you can keep it, or at least not sell it for a mere 10% gain. For example, say you don’t want to sell it for less than twice the price you bought it for. Nothing prevents you from buying the NFT from yourself, and therefore immediately increasing the price by 10%. The tez you spend for this are sent to yourself, except for the 5% of royalties that will be sent to the author.

**Question:** is there a way to prevent this sort of manipulation?

The buy entry point could be changed to verify that the address of the buyer is not the address of the current owner. However, it is extremely easy for the same user to control two different accounts, so this would simply make this self-sale hard to detect. We simply can't prevent this type of attack.

> **Advice:** be careful when you see an NFT or other asset being sold at a very high price. You may think that this price is an indicator of the current value of this asset, but it could be the same user buying it from themselves, creating the illusion of a high value asset.

**Question:** as an attacker, can you find a way to sell this NFT at a lower price than the one computed by the contract?

As the contract itself sets the price and enforces the payment of royalties, to sell it at a lower price, we would need a way to sell the NFT without using the buy entry point of our contract.

**Bad idea:** selling the address that owns the NFT

If you bought the NFT with an address that isn’t used for anything else important, you could consider selling this address itself, at any price you choose. Selling an address means selling the corresponding private key, so that the buyer can perform transactions from that address.

**Question:** this approach wouldn’t work well. Can you figure out why?

The first issue is that there is no on-chain way to verify that you transferred your private key, without making it visible to everyone. So you can’t sell it on-chain. If you do it off-chain, in private, this means dealing with trust issues again.

The second and more serious issue is that you can’t prove to the buyer that you got rid of the private key and won’t sell it again to someone else. You can’t change the private key that corresponds to an address like you would change a password.

**A powerful approach: wrapping the NFT**

We can’t sell the address of a regular account. However, we can sell a smart contract! This is, after all, what we have been doing with our NFT contract.

Instead of buying the NFT with a regular account, we can simply buy it with a new smart contract, that we custom-built so that it can both take care of purchasing or selling NFTs, and also be for sale itself. Let’s call it NFTWrapper. Whoever owns the NFTWrapper contract, effectively owns the NFT this contract owns.

<table>
<tr>
<td>
Here, we will show an illustration of a user holding an NFT in their hand. The NFT has a 100 tez price tag. The user is handing it to another user, who pays 100 tez in exchange
</td>
<td>
Here, we will show an illustration of a contract that holds that same NFT in their hand. The NFT has the same 100 tez price tag, but the contract that holds it has its own, lower 80 tez price tag. We show the same two users as on the left, but this time the first user is transferring that contract to the other, in exchange for 80 tez.
</td>
</tr>
<tr>
<td>Direct sale of the NFT</td>
<td>Sale of the wrapped NFT</td>
</tr>
</table>

Owning our NFT through a contract allows us to go around the NFT’s restrictions in multiple ways: as we can sell our NFTWrapper contract itself and avoid using the buy entry point of the NFT, we can set our own rules, sell it at the price of our choice, and avoid paying royalties to the author.

If we add a `default` entry point to NFTWrapper, that simply fails whenever it is called, we can prevent anyone from successfully calling the buy entry point of the NFT to purchase it at the computed price: the transfer of tez to our NFTWrapper contract would indeed cause this `default` entry point to be called and fail, therefore preventing the sale from happening at all. We could also store a boolean in the storage of NFTWrapper, that indicates whether the default entry point should fail or not, therefore keeping the possibility to enable direct sales again, and “unwrap” our NFT.

Here is how this NFTWrapper contract could work:

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>allowSales: boolean</li>
		<li>price: tez</li>
		<li>owner: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>buyNft(nft: address)
			<ul>
				<li>Call the buy entry point of the nft contract</li>
			</ul>
		</li><br/>
		<li>setPrice(newPrice: tez)
			<ul>
				<li>Verify that the caller is the owner</li>
				<li>Replace price with newPrice in the storage</li>
			</ul>
		</li><br/>
		<li>buy()
			<ul>
				<li>Verify that the transferred amount equals the price</li>
				<li>Create a transaction that sends price tez to the owner</li>
				<li>Replace owner with the caller</li>
			</ul>
		</li><br/>
		<li>setAllowSale(newValue: boolean)
			<ul>
				<li>Verify that the caller is the owner</li>
				<li>Replace allowSales with newValue in the storage</li>
			</ul>
		</li><br/>
		<li>default()
			<ul>
				<li>Verify that allowSales is true</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

Wrapping digital assets into a contract like this is common on blockchains. This type of approach can even be used to transfer assets from one blockchain to another.


## Prevention measures

The only way to completely prevent someone from wrapping an NFT like we presented in the previous section, is to prevent contracts from calling the buy entry point and becoming the new owner. Tezos provides ways to check that the caller is a direct account, and not a contract. Unfortunately, doing this adds strong limitations, such as preventing a group of people from collectively owning an NFT through a multi-sig contract. Such limitations may negatively impact the value of your NFT, so we don’t recommend this approach.

One thing our wrapping "attack" does is to prevent direct sales by making the transaction that sends the payment to the owner fail.

**Question:** can you change the NFT contract so that it becomes impossible to prevent direct sales?

To do this, we need to change our buy entry point, so that it doesn’t directly create a transaction that sends money to the owner, but instead, stores the information that this money is owed to this previous owner. We then add a new entry point that the previous owner needs to call, in order to collect their funds. This way, they have no way to block the execution of the buy entry point and prevent users from directly buying the NFT itself.

Letting users call a dedicated entry point to obtain the money they are owed (we call that a pull approach), instead of trying to send it to them immediately (a push approach), is a very good practice, to prevent this kind of flaw.

### Adding a key-value store

As this owner may not immediately collect the funds they are owed, our contract will need to keep track of multiple amounts owed to a number of previous owners. To do that, we can add a key-value store to our contract. The key of an entry will be an address to which the contract owes money, and the value will be the amount that is owed. On Tezos, we use the big-map type.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>author: address</li>
		<li>metadata: string</li>
		<li>price: tez</li>
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
		<li>buy()
			<ul>
				<li>Check that the amount transferred is equal to the price</li>
				<li>Send 5% of the price to the author</li>
				<li>If ledger[owner] doesn’t exist, create it with value=0</li>
				<li>Add the price minus 5% to ledger[owner].value</li>
				<li>Replace owner with the caller, in the storage</li>
				<li>Increase price by 10%, in the storage</li>
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


Big-maps can contain huge amounts of data. The only limitations are indirect: calls that increase the amount of storage used by a contract need to include a fee to pay for this storage. The number of transactions that can be performed in a given amount of time is also limited.

## Multiple NFTs in a single contract

The introduction of the big-map type in the previous section, opens the possibility to create much more powerful contracts. In particular, instead of creating and deploying a new contract every time we want to create a new NFT, which is relatively costly, we could use a big-map to create a single contract that can store an unlimited number of NFTs.

**Question:** using what you have seen so far, try to design such a contract.

First, let’s figure out what we need in the storage of our contract. We need to store information about many NFTs, so we will store that in a big-map. In this big-map, what should we use as the key for each entry?

In our previous contract that was storing a single NFT, the address of the contract itself was the unique identifier. Here, we can’t do that anymore, as each NFT we will store will need its own unique identifier. We can simply use a number, starting with 1 and increasing by one for each new NFT. We will call this number tokenID. This number, combined with the address of our contract, is sufficient to make our NFT unique.

We can use tokenID as the key for our big-map. For a given tokenID, we need to store as the value, a record that contains the metadata, the author and the owner. We may also add a price so that we can still sell it.

The buy entry point will work similarly to our previous contract, except that it will take a tokenID parameter, and will access the corresponding entry in our tokens big-map. The claim entry point will stay the same.

We need to add a new entry point, so that it’s possible to create new NFTs. We call this minting, so we will create a mint entry point, that anyone may call, that will simply add an entry in our tokens big-map. We will use as a key, the current value of our nextID counter, that we then increment.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>nextID: int</li>
		<li>tokens: big-map
			<ul>
				<li>tokenID (key): int</li>
				<li>owner: address</li>
				<li>author: address</li>
				<li>metadata: string</li>
				<li>price: tez</li>
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
		<li>buy(tokenID)
			<ul>
				<li>Checks that tokens[tokenID] exists, call it token</li>
				<li>Check that the amount transferred is equal to the price of the token</li>
				<li>Send 5% of the price to the author of the token</li>
				<li>If ledger[owner] doesn’t exist, create it with value=0</li>
				<li>Add the price - 5% to ledger[owner].value</li>
				<li>Replace owner with the caller in the token</li>
				<li>Increase price by 10% in the token</li>
			</ul>
		</li><br/>
		<li>mint(metadata, price)
			<ul>
				<li>Create a new entry in tokens, with key nextID</li>
				<li>Set owner and author to the address of the caller</li>
				<li>Set metadata and price to the value of the parameters</li>
				<li>Increment nextID</li>
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

That’s it, now anyone can simply call this contract to create and sell their own NFT.

## A marketplace dApp to buy and sell NFTs

It is possible to create all kinds of NFTs, with different types of metadata, different rules on how they are minted, etc. However, if we want these NFTs to be convenient to trade, we need a dedicated dApp: a place where people can easily browse through all kinds of NFTs, and buy or sell them. This type of dApp is what we call a marketplace.

:::info
A dApp is a Decentralized Application. It is an application, usually web based, that provides a nice interface to help users to interact with one or more smart contracts. Through the dApp, users can sign transactions (and calls) to the smart contract with their wallet, and view the results. The dApp interact with a node of the blockchain to send transactions (including calls to smart contracts) and check the results. Keep in mind when using a dApp, that only the smart contract part of the dApp is usually decentralized.
:::

**Question:** what smart contracts would you need to develop, such a dApp, if any?

We could imagine a marketplace that is simply an off-chain web app that keeps track, using a traditional database, of all the different NFTs that are for sale. It would showcase them to users, and help users generate the purchasing transaction on the corresponding NFT smart contract.

A first issue to address with this approach is that this assumes that all these NFT contracts can be interacted with in the same way, for example with a buy entry point that takes a tokenID as parameter. This means creating and enforcing a standard that defines entry points smart contracts should implement so that they can be put on sale on our marketplace, and define what their parameters and effects should be. Such standards, like FA2 on Tezos, exist and are used by most if not all NFTs and marketplaces.

Another issue to address is the question of the business-model of our market-place. Typically, we would like to get a commission on every sale that happens thanks to our marketplace. We need to trust that once users find an NFT through our dApp, they don’t go around and buy it directly without paying a commission. This is where we need a smart contact: to automatically bring trust, or avoid the need for trusting anyone.

We need to make sure that while an NFT is visible on the marketplace, it may only be bought through this marketplace. This means that the marketplace needs to be in control of the NFT. One way to do this is to make the marketplace the temporary owner of the NFT. The marketplace can’t simply buy every NFT that users put on sale, so we need a new way to transfer them. We can do this by adding a transfer entry point to our NFT contract (and to our standard), and letting the owner define which contract(s) are allowed to call this entry point.

Here is how our marketplace contract would work:

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>feeRate: nat</li>
		<li>admin: address</li>
		<li>tokens: big-map<br/>
			Key:
			<ul>
				<li>contract: address</li>
				<li>tokenID: int</li>
			</ul>
			<br/>
			Value:
			<ul>
				<li>seller: address</li>
				<li>price: tez</li>
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
		<li>addToMarketplace(contract, tokenID, price)
			<ul>
				<li>Check that the caller is the owner of the token</li>
				<li>Transfer token ownership to the marketplace</li>
				<li>Add a contract/tokenID entry to tokens big-map, and store caller as the seller, and the price</li>
			</ul>
		</li><br/>
		<li>removeFromMarketplace(contract, tokenID)
			<ul>
				<li>Check that the caller is the seller</li>
				<li>Transfer token ownership back to the seller</li>
				<li>Delete tokens[(contract,tokenID)]</li>
			</ul>
		</li><br/>
		<li>buy(tokenID)
			<ul>
				<li>Check that the amount transferred is the price</li>
				<li>Transfer token ownership to the buyer</li>
				<li>Add admin fee to admin account in the ledger</li>
				<li>Add the rest to the seller account in the ledger</li>
				<li>Delete tokens[(contract,tokenID)]</li>
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

Note that now that we can buy and sell NFTs through this marketplace contract, we can use an NFT contract that doesn’t handle sales itself at all. It could be a simple as this:

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>nextID: int</li>
		<li>tokens: big-map
			<ul>
				<li>tokenID (key): int</li>
				<li>owner: address</li>
				<li>metadata: string</li>
			</ul>
		</li>
		<li>market: address</li>
	</ul>
</td>
<td>
	<ul>
		<li>mint(metadata)
			<ul>
				<li>Create a new entry in tokens, with key nextID</li>
				<li>Set owner to the address of the caller</li>
				<li>Set metadata to the value of the parameter</li>
				<li>Increment nextID</li>
			</ul>
		</li><br/>
		<li>setMarket(tokenID, market)
			<ul>
				<li>Checks that caller is the owner of tokens[tokenID]</li>
				<li>Replace market for this token, with the parameter</li>
			</ul>
		</li><br/>
		<li>transfer(tokenID, newOwner)
			<ul>
				<li>Checks that caller is the market of tokens[tokenID]</li>
				<li>Replace owner with newOwner</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>

## Auction

Now that we have a way, thanks to our standard, to manage the sale of our NFTs in a separate contract, we can imagine all kinds of strategies to sell NFTs, and create the corresponding dApps.

One feature that can be useful is to be able to manipulate time. In smart contracts, you can use a datetime type, compare dates, and get the date and time of creation of the current block, which approximately tells you what the current time and date are.

**Question:** think about how you would create a contract where anyone can put an NFT for sale using an auction: anybody can make an offer (a bid), and whoever makes the highest bid, gets to buy the NFT for that price. Can you make it so that everything always works, with no trust issues?

We could create a contract where anyone could call a bid entry point, and pass as parameter, the amount they are willing to pay. We would store the bids in a list of records, where each record stores the address of a bidder, and the amount they offer. After a while, the owner of the NFT would call a close entry point, that would stop the auction, loop through the entries in the list to identify the highest bidder, then store it as the winner of the auction. This winner could then call a buy entry point, send the amount they offered, and obtain the NFT.

**Question:** What problems do you see with this approach?

There are three main issues:

- The first issue is that if a very high number of people make a bid, for example of 0 tez, then when the owner closes the auction, the contract would have to loop through so many entries, that it would take too long, exceed the amount of gas allowed to be consumed in one operation, and fail. The owner could never close the auction, and the NFT would be stuck forever in the contract. Loops in smart contracts are dangerous, and should only be used if we know for sure that the number of iterations is limited, and can’t be increased arbitrarily by an attacker.

- The second issue is that the bidders would have to trust that the seller ends up calling the close entry point. We could imagine a situation where the seller is not happy with how much the highest bid is, and decides not to stop the auction, which would prevent the highest bidder from buying the NFT.

- The third issue is that the seller would have to trust that the highest bidder indeed buys the NFT after the seller closes the auction. If they don’t, the NFT would be stuck in the contract forever.

**Question:** How can we avoid these three issues?

For the first issue, we really don’t need to store all the bidders: we could only store the highest bidder. Every time someone bids, we just compare it to the current top bidder, and if the new bid is higher, we store it as the new top bidder and amount.

For the second issue, we can make it so that the owner doesn’t have to close the auction. When the NFT is put on sale, we set a deadline in the storage. Once this deadline expires, the auction is closed and the top bidder can buy the NFT. The owner doesn’t need to be trusted.

For the third issue and to make sure the top bidder does pay, we change it so that when they bid, they immediately transfer the money to the contract. If someone else bids a higher value, they can get their money back. If we reach the deadline and they are still the highest bidder, they can collect the NFT, and the money is sent to the seller. We use our ledger / claim system when sending money, to avoid the flaws described earlier. Otherwise, someone could bid with a contract, prevent anyone from bidding after them, and win the auction with a low price.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
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
				<li>Create an entry in tokens, with contract and tokenID as the key, the caller as seller, the caller as the initial value of topBidder, 0 tez as the initial value of topBid, and the deadline parameter.</li>
			</ul>
		</li><br/>
		<li>bid(contract, tokenID)
			<ul>
				<li>Check that the current time is before the deadline</li>
				<li>Check that the amount transferred is higher than the current topBidder</li>
				<li>Add the previous topBid to the ledger, for the previous owner</li>
				<li>Stores the caller as topBidder, and the amount transferred as topBid</li>
			</ul>
		</li><br/>
		<li>claimNFT(contract, tokenID)
			<ul>
				<li>Check that the current time is after the deadline</li>
				<li>Transfer token ownership to the caller</li>
				<li>Add the amount bid to the ledger, for the seller</li>
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
