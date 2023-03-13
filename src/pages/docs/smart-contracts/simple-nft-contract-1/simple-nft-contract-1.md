---
id: simple-nft-contract-1
title: First contracts - NFTs
authors: Mathias Hiron, Nomadic Labs
---

In this chapter, we will introduce smart contracts, and present some of the main features available for building smart contract on Tezos, through examples based on one of the most popular current uses of smart contracts: NFTs (Non Fungible Tokens).

In most cases, the examples will be presented using plain English. A few examples of code will be shown, but the intention is not to teach you the syntax of one of the smart contract programming languages available on Tezos.

**We will also discuss potential flaws:** smart contracts are relatively small and simple looking programs, but as they can be called by anyone and manipulate valuable assets, any bug or flaw they may contain is likely to be discovered, and funds to be lost or taken by the attackers. We will highlight some examples of flaws and introduce ways to avoid them.

## What is a smart contract?

A smart contract is composed of mostly three elements that are maintained by nodes in the state of the blockchain:

- **Their balance**: a contract is a kind of account, and can receive and send Tez
- **Their storage**: data that is dedicated to and can be read and written by the contract
- **Their code**: it is composed of a set of entry-points, a kind of function that can be called either from outside of the chain, or from other contracts.

The code of smart contracts is expressed in **Michelson**, a Turing-complete stack-based language that includes common features as well as some very specific blockchain related features:

- **It doesn’t have variables**, but can manipulate data directly on a **stack**, through a set of stack manipulation instructions. For example the ADD instruction consumes two elements from the top of the stack, and puts their sum on top of the stack.
- **It is strongly typed**, with basic types such as integers, amounts of tez, strings, account addresses, as well as pairs, lists, key-value stores (big-maps), or pieces of code (lambdas).
- **It has limited access to data**, and can only read data from its own storage, data passed as parameters during calls to its entry points, and a few special values such as the balance of the contract, the amount of tez sent to it during a call, and the creation time of the current block. It can also access a table of constants.

When someone calls a smart contract, all the contract can do can be summarized as:

- **Performing some computations.**
- **Updating the value of its own storage.**
- **Generating a list of operations**. These operations will be performed once the contract's own execution is over. This can include transferring funds to other accounts, calling other contracts, or even originating new contracts, but not much more.

One key property of the execution of smart contracts on Tezos, designed to reduce the risk of bugs, is that if any part of the execution of a contract itself, or in the call of any other contract it calls, generates an error, then everything is canceled, and the result is as if the initial call to the contract had never been done. The idea is that either everything goes as intended, or nothing happens at all, reducing the risk of unintended situations.

### Smart contract languages

The Michelson language is a bit like the equivalent of the assembly language or even machine code of regular computers. It is a low level language that can do anything using a small set of relatively simple instructions, but is not very easy for humans to read and write.

A number of high level languages are available on Tezos, that allow developers to write smart contracts in very expressive, easy to read forms: SmartPy, Archetype or Ligo are the main examples. All these languages give access to all of Michelson smart contracts features, but using different philosophies that fit the style of all kinds of developers.

Here is an example of a very basic smart contract that does a simple computation and stores the result.

Contract expressed in the Archetype high-level language:

```archetype
archetype example

variable data : int = 0

entry compute(param : int) {
  data := 2 * data - 3 * param;
}
```

The same contract, compiled to Michelson:

```ocaml
storage int;
parameter (int %compute);
code { UNPAIR;
	   PUSH int 3;
	   MUL;
	   SWAP;
	   PUSH int 2;
	   MUL;
	   SUB;
	   NIL operation;
	   PAIR };
```

### Properties to keep in mind

As a resident of a decentralized blockchain, a smart contract has some unique properties:

- **Eternal:** it stays available forever!<br/>
*as long as enough people keep maintaining the blockchain.*

- **Immutable:** no-one can ever change its code<br/>
*but the effect of the code depends on the data in its storage, which may change.*

- **Decentralized:** its existence and availability doesn’t depend on any third party<br/>
*but it can use data provided by third parties.*

- **Public:** anyone can read it, call it, and access its data,<br/>
*but it may contain encrypted data, and restrict access to its features.*

## A single NFT smart contract

You may have heard about NFTs: Non Fungible Tokens. An NFT can be summarized as a digital asset that is uniquely identifiable, contains some information (metadata), has an owner and can be transferred.

Digital information such as text, images or music can usually be duplicated at virtually no cost, with no way of distinguishing the “original” version from mere copies. A blockchain such as Tezos provides a way to create a digital asset that stays unique: the data itself may be copied, but a unique, unambiguous owner is digitally attached to it, and has full control on what happens to it. Note that the ownership of an NFT of a digital asset such as an image, doesn’t usually imply ownership of the image itself, and associated rights.

One of the key features of Tezos that makes it very suitable for NFTs, is the on-chain governance that doesn’t rely on forks. Indeed, consider what happens to the uniqueness of an NFT if the blockchain that hosts it were to fork. On Tezos, there is always an unambiguous way to identify which is the official blockchain, and therefore which is the true NFT.

<table><tr><td>
Here, we will add an illustration of a chain that forks, and in the state associated with the head block of both branches, we will illustrate a copy of the same NFT.</td></tr></table>

Many artists, game producers or brands select Tezos for their NFTs, from Ubisoft with the Quartz project using Tezos NFTs to represent in-game collectibles, to RedBull Racing that proposes F1-themed collectibles for their fans. A number of marketplaces like Objkt, Hic et Nunc and Rarible allow people to find, buy or sell NFTs.

**Question:** based on what you have learned so far about what a smart contract is, take some time to think about how you would build a simple one to create your own NFT.

Looking at our summary above, an NFT will need three pieces of information:
- **a unique identifier**<br/>
*we can use the identifier of our smart contract itself: its address.*
- **some metadata**<br/>
*we can simply put a string in its storage.*
- **an owner**<br/>
*we will put the address of an account in the storage.*


We could deploy a smart contract that just has a storage with two values: the metadata and an owner. But we wouldn’t be able to transfer it.

For this, we will need to add some code: a <code>transfer</code> entry point, that does two things:
- Verify that the current owner is the one requesting the transfer
- Replace the owner in the storage with a new address.

:::info
Verifying who is making each request is one of the core aspects of blockchains: a simple transaction of some tez from account A to account B should only be accepted by the blockchain if the owner of account A allows this transaction. This is done by having the author of a transaction cryptographically sign it. Anyone can then verify this signature and check the legitimacy of the transaction.
:::

Within a smart contract, we simply have access to the address of the author of the call, the <code>caller</code> or <code>sender</code>, with the guarantee that all verifications have already been done. For the transfer of our NFT, we simply need to include in our entry point, a single line of code that checks that this sender is the current owner of the NFT.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>metadata: string</li>
	</ul>
</td>
<td>
	<ul>
		<li>transfer(newOwner)
			<ul>
				<li>Check that the caller (sender) is the current owner</li>
				<li>Replace owner with newOwner in the storage</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>
Here is the corresponding implementation in the SmartPy language:

```py
import smartpy as sp

class Account(sp.Contract):
	def __init__(self, firstOwner, metadata):
		self.init(owner = firstOwner, metadata = metadata)

	@sp.entry_point
	def transfer(self, newOwner):
		sp.verify(sp.sender == self.data.owner, "Not the owner")
		self.data.owner = newOwner
```

In SmartPy, we generate a smart contract with a class that inherits from <code>sp.Contract</code>.
Here, its constructor `__init__` takes two parameters:
- the address of the initial owner of our NFT
- the content of the metadata.

`self.init` is then called, to put these two values in the initial storage of the contract.

In the `transfer` entry point, we can see how `self.data.owner` is used both to read and write the value of the owner to and from the storage.

**This 10 lines example is all the code we need** to generate and deploy a contract that represents a single NFT. We will see how to add additional features and make it more convenient to use, but this is technically all we need to create an NFT that will exist forever.

## NFT for sale: building trust

An issue you will quickly encounter if you use our first NFT smart contract to create and sell your NFTs, will be concerns about trust.

The principle of a sale of an item is very basic, with two steps that need to take place:
- The buyer needs to transfer an agreed upon amount of money to the seller.
- The seller needs to transfer the ownership of the item to the buyer.

The issue, especially when the item is very valuable, is the order in which these two steps will happen. We have two possible orders, but each comes with a potential trust issue:
- If the buyer sends the money first, they need to trust the seller will then transfer the item.
- If the seller transfers the item first, they need to trust the buyer will then send the money.

In either situation, if the second person doesn’t do their part, they end up with both the money and the item, while the first person ends up with nothing. The second person has a strong incentive to betray the first person.

The traditional way to deal with this is to involve a **third party** that both the buyer and seller can trust.
- For casual sales, the third party is the government, its justice system and police force, with the possibility of filing a complaint, going to court, and hoping that justice will prevail.
- For the sale of expensive items, the sale itself goes through an intermediary, such as a notary. All this is complicated, takes time, and requires trust in this third party.

**Question:** how would you solve this trust issue with a smart contract? What features would the blockchain need to provide to make this possible?

### Trust without a third party

A very powerful benefit of blockchains, and of smart contracts in particular, is that they provide a mechanism to bring guaranteed trust into a transaction, replacing the need for involved parties to trust each other, and the need for introducing a third party.

This is done by making the exchange **atomic**: either the two steps of our transaction succeed, or neither of them happen.

This takes advantage of the property we presented earlier, that any error in the execution of a smart contract, causes everything previously done during this execution to be canceled, as if it had never happened.

The previous version of our smart contract already included the transfer of the NFT, assuming that the payment was done off-chain or through a separate transaction. To ensure the atomicity of the exchange, we need the same entry point to manage both the transfer of the item, and the transfer of tez.

Four new features of Tezos are needed:
- **We need  a new data type, `tez`**, to represent the price.
- **We need the buyer to send some tez**. On Tezos, a call to a contract is a special type of transaction, and you always send a number of tez (potentially 0) to a contract, when you call its entry point. That amount is automatically added to the balance of the contract.
- **We need to check that the transferred amount is correct.** The code of an entry point has access to the amount sent by the caller, usually through an amount keyword.
- **We need to send that amount to the seller.** We will use an instruction that generates a new transaction, from the balance of the contract, to a destination address.

We need two entry points in our contract:
- <code>setPrice</code>, for the seller to indicate at what price they are willing to sell their NFT.
- <code>buy</code>, for the buyer to initiate the purchase.

<table>
<tr><td><strong>Storage</strong></td><td><strong>Entry points effects</strong></td></tr>
<tr><td>
	<ul>
		<li>owner: address</li>
		<li>metadata: string</li>
		<li>price: tez</li>
	</ul>
</td>
<td>
	<ul>
		<li>setPrice(newPrice)
			<ul>
				<li>Check that the caller is the owner</li>
				<li>Replace price with newPrice in the storage</li>
			</ul>
		</li><br/>
		<li>buy()
			<ul>
				<li>Check that the amount sent is equal to the price</li>
				<li>Create a transaction that transfers price tez to the owner</li>
				<li>Replace owner with the caller</li>
			</ul>
		</li>
	</ul>
</td>
</tr>
</table>



Here is the corresponding implementation in the Archetype language:

```archetype
archetype nftForSale(owner : address, metadata: string)

variable price : tez = 0tz

entry setPrice(newPrice : tez) {
  called by owner
  effect { price := newPrice; }
}

entry buy() {
  require { r1 : transferred = price }
  effect {
	  transfer price to owner;
	  owner := caller;
  }
}
```


Note that with this version of our contract, if the buyer doesn’t immediately call `setPrice` after buying this NFT, nothing stops anyone from buying it from them at that same price.