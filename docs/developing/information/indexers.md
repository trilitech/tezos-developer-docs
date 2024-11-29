---
title: Indexers
authors: Tezos Ukraine, Tim McMackin
last_update:
  date: 2 January 2024
---

Indexers are off-chain applications that retrieve blockchain data, process it, and store it in a way that makes it easier to search and use.
Indexers are an important component of [Block explorers](/developing/information/block-explorers).

You can use indexers to provide the data that you need for your dApps.

## Why indexers are needed

Tezos nodes store copies of blocks, but they provide only certain information about those blocks through the [RPC interface](/architecture/nodes#the-rpc-interface).

For example, assume that you want information about an operation and all you have is its hash.
The RPC interface can't provide this information directly, so you would have to search each block until you found the block with this operation, which is very inefficient.

Instead, you can use an indexer that records information about each operation.
This kind of indexer can provide information about a specific operation by its hash or a list of operations sent by a certain account.

## How indexers work

You can imagine indexers as the card catalog in a library.
Libraries typically sort books by genre and author name, so readers can find a book if they know its genre or author.

However, suppose a reader wants to find a poem about acacia trees, a story about a gas station architect, or every book written in 1962.
Without any other information, they must check all the books in the library until they find what they are looking for.

To simplify the process of searching for books, libraries add each new book they receive to their card catalogs.
Card catalogs list all of the books on a certain topic and provide other metadata such as the authors' names and publication dates.
Readers can look up a topic in the catalog and get a list of all books on that topic.
Libraries can index books in as many ways as are necessary to help people search for books more efficiently.

Similarly, relational databases can have indexes to speed up queries.
In the same way, blockchain indexers create a database with the blockchain data organized in certain ways.

## Types of indexers

There are two main types of blockchain indexers: full and selective.

### Full indexers

Full indexers process and write all data from blocks, from simple transactions to validator's node software versions.
Blockchain explorers commonly use them to provide users with advanced blockchain analytics and allow them to search for any type of on-chain data.
Also, those who host full indexers can offer public APIs that other projects can use without hosting the indexer themselves.

You can get data from these full indexers, which allow you to find almost any information in the Tezos blockchain:

- [TzKT](https://api.tzkt.io/)
- [TzPro](https://docs.tzpro.io/)
- [TzIndex](https://github.com/blockwatch-cc/tzindex)

### Selective indexers

Selective indexers store only selected data, which means that they need less space and resources to maintain.
Creating a selective indexer requires you to write the logic for the indexes, including what data to fetch, how to process it, and how to store it.

Usually, they are used in projects that require only specific on-chain data, such as active user balances, balances of their smart contracts, and NFT metadata.
You can optimize a custom selective indexer for fast execution of specific project queries.
You can also use them to work with data in the way that you want to, such as storing token amounts with decimal places.

You can use these frameworks to create your own selective indexer to provide the data that you need in the format that you need:

- [Que Pasa](https://github.com/tzConnectBerlin/que-pasa)
- [DipDup](https://dipdup.io/)
- [Dappetizer](https://dappetizer.dev/)

For example, [Teia.art](https://teia.art/) and other NFT marketplaces use their indexers based on DipDup, optimized for working with NFTs.

## Setting up indexers

For information on setting up indexers, see the documentation for the indexer or [Indexers](https://opentezos.com/dapp/indexers/introduction/) on OpenTezos.

## Using indexers

The exact list of tables, index schemas, and command syntax depend on the indexer and database it uses.
For information about how to use a specific indexer, see its documentation.

Some indexers provide information about networks other than Mainnet, so check the indexer's documentation for information about selecting a network.

For example, this TzKT query gets an account's balance of the USDT token:

```
https://api.tzkt.io/v1/tokens/balances?token.contract=KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o&account=tz1a1RTsGUbads3VucUQDxJF4EDXkDWcDHPK
```

For information about the TZKT indexer's API, see https://api.tzkt.io.

<!-- In addition to search speed, indexing has another advantage: the ability to modify indexing rules. For example, TzKT provides an additional index, where each Tezos FA1.2 and FA2 token has its internal id. So instead of comparing relatively long contract addresses, it will compare small numbers and retrieve data even faster. -->

<!-- TODO what does this mean? Is it the convenience of having `id=5` instead of having to remember the address of the contract? Here's my rewrite: -->
<!-- This token now appears to have the ID 42290944933889; is that really better than the contract address? The example used id=85. -->

Indexers can organize data in custom ways.
For example, TzKT indexes FA1.2 and FA2 tokens and gives each an internal ID.
This ID can be faster and easier to work with and compare than using the contract ID and token ID.

This TzKT query gets information about an FA1.2 token based on its internal ID instead of its contract address and token ID:

```
https://api.tzkt.io/v1/tokens?id=42290944933889
```

The response provides information about the token:

```json
[
  {
    "id": 42290944933889,
    "contract": {
      "alias": "kUSD",
      "address": "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV"
    },
    "tokenId": "0",
    "standard": "fa1.2",
    "firstMinter": {
      "address": "tz1eDj5UuChVcZpA7gofUtyVS6mdQAcyEbZ5"
    },
    "firstLevel": 1330112,
    "firstTime": "2021-02-04T05:43:23Z",
    "lastLevel": 4860455,
    "lastTime": "2024-01-03T12:23:49Z",
    "transfersCount": 556579,
    "balancesCount": 11270,
    "holdersCount": 5313,
    "totalMinted": "34975975281693622711131319",
    "totalBurned": "33819058060274650139662474",
    "totalSupply": "1156917221418972571468845",
    "metadata": {
      "name": "Kolibri USD",
      "symbol": "kUSD",
      "decimals": "18"
    }
  }
]
```

## Data available on indexers

The exact list of queries and filters depends on the selected indexer.
Here are some examples of information you can get from full indexers:

- Account: Balance in tez, transaction history, address type, and status like "baker" or "delegator"
- Block: Header, content, and metadata like address and socials of the baker who made the block
- Contract: Description, entrypoints, balance, code in Michelson, storage, and the content of a specific big map
- Bakers and delegators: Who earned how much, who endorsed a particular block, and how much users delegate
- Protocol: What cycle is now, what is on the vote, how many tez are in circulation

For example, here are some examples for getting information from TzKT.
Follow the links and paste your address instead of `tz1…9v4` into the address bar to get data about your account:

- [fxhash NFTs you own](https://api.tzkt.io/v1/tokens/balances?account=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4&token.contract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton).
The fxhash contract address filters the query, so try to change the address to see your NFTs from other marketplaces.
- [Your balance history in tez](https://api.tzkt.io/v1/accounts/tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4/balance_history).
Nodes and indexers display balances without decimals, and ""balance": 500000" means only five tez.
- [List of FA1.2 and FA2 token transfers](https://api.tzkt.io/v1/tokens/transfers?from=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4) where you were the sender. Change "from" to "to" in the query to see the list of transfers where you were a recipient.

TzKT provides information about Ghostnet.
For example, you can run any of the previous queries on Ghostnet by changing the host name in the URL to `https://api.ghostnet.tzkt.io/`.

## Where indexers are used

Many applications that work with on-chain data use an indexer.

The simplest example of working with an indexer is a blockchain wallet.
For example, to display a user's token balances, Temple Wallet queries data from the TzKT indexer and gets tokens' tickers and logos from the contract metadata.

You can do the same thing by calling the `GET tokens/balances` endpoint of the TzKT API and including your address as the value of the `account` parameter, as in this example:

```
https://api.tzkt.io/v1/tokens/balances?account=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4
```

In the same way, Temple Wallet receives transaction details and displays NFTs, delegation rewards, the value of your tokens, and other data.
It uses other sources for other data.
For example, it requests the XTZ price from Coingecko.

Other blockchain applications use indexers in similar ways:

- Decentralized exchanges use indexers to get historical data on the balances of each pool, transactions with them, and the value of tez.
Based on this data, they calculate the volume of transactions in tez and other currencies, as well as the historical prices of tokens in fiat currencies.
- NFT marketplace websites index transactions with their contracts to display new NFTs, transaction history, and statistics of the most popular tokens.
- Block explorers display data from all blocks with the help of indexers and allow users to find anything, like operation details by hash.
Thanks to this, users can find the information they need in a user-friendly graphical interface.
