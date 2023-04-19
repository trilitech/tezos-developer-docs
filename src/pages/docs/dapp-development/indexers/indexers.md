---
id: indexers
<<<<<<< HEAD
title: Indexers
slug: /indexers
authors: Claude Barde
---



## How to Use Blockchain Indexers on Tezos

Learn what blockchain indexers are and how to use TzKT, TzStats, Que Pasa, DipDup, or Dappetizer in your apps.
=======
disable_pagination: true
title: Indexers
authors: Tezos Ukraine
---

{% callout type="note" %}
This content was created by [Tezos Ukraine](https://tezos.org.ua/en) under MIT Licence. The original version can be found [here](https://indexers.tezos.org.ua/) in multiple languages.
{% /callout %}

{% callout type="note" %}
If you're just looking for API docs for a hosted indexer, [here is the one from TzStats](https://tzstats.com/docs/api/index.html)
{% /callout %}

# What is an indexer ? 
A block explorer, or an app that tracks activity on the blockchain, is typically made of:
>>>>>>> 9cd286b (indexers cleanup)

- an indexer that is a node operator that extracts the on-chain data and stores it into a database
- an API that queries the database
- a frontend that displays the data

<<<<<<< HEAD
1. [How Blockchain Indexers Work and Why We Need Them](.../../how-indexers-work//how-indexers-work)
    - What are databases and indexes
    - What data can be obtained from an indexer
    - Where indexers are used

2. [Full and Selective Indexers on Tezos](.../../full-and-selective-indexers/full-and-selective-indexers)
    - The differences between full and selective indexers
    - An overview of the features of full TzKT and TzStats
    - Short summaries of selective Que Pasa, DipDup and Dappetizer

3. [How to Use the TzKT API in a Simple Project on Tezos](.../../tzkt/tzkt)
    - Display the balance of the address 
    - Display liquidity backing stats
    - Improve the project

4. [How to Use Que Pasa in a Simple Project on Tezos](.../../que-pasa/que-pasa)
    - Install and configure Que Pasa and PostgreSQL
    - Index data from the Signum's smart contract  
    - Display indexed data in the project

5. [How to Use DipDup and Dappetizer on Tezos](.../../dip-dup-dappetizer/dip-dup-dappetizer)
    - Install and set up DipDup and Dappetizer
    - Do a simple project with DipDup
    - Create a similar project in Dappetizer

{% callout title="Info" %}

This content was created by [Tezos Ukraine.](https://tezos.org.ua/en) 
The original version can be found [here](https://indexers.tezos.org.ua/) in multiple languages.
{% /callout %}
=======
Since, the on-chain data is already in the database of the node itself why is an indexer needed? The indexer is relevant because it optimizes the way a node stores data. The purpose is to provide very quick access to blockchain data according to some specific criteria related to a given address.

So, the indexer is the part of the explorer that fetches the raw data from the node, then processes it and stores it in the database in an efficient way.


# How Blockchain Indexers Work and Why We Need Them

Blockchain Indexers are programs that simplify querying and searching through blockchain data. Almost any decentralized application uses indexers, and if you want to build your dApp, chances are you’ll need to use them too.


## A simple explanation of how indexers work

Indexers are programs for transforming a large amount of information into a database with convenient and fast search. Understanding indexers is easy if we use a library as an example.

There are thousands of books on the shelves in the library. They are usually sorted by genre and authors' names. The reader will quickly find the stand with novels or gardening books.

But let's say the reader wants to find something specific: a poem about an acacia tree, a story about a gas station architect, or all the books written in 1962. They will have to check all the books in the library until they come across what they are looking for.

The librarian got themselves ready for such visitors and compiled a special database. He wrote down the details of each book in separate indexes. For example, one index would list all the names of the characters of every book in alphabetical order and the name of the book where they appear. The second index will contain the key events, and the third—unique terms like “horcruxes” or “shai-hulud,” etc. The librarian can make as many indexes as he needs to simplify the search for a specific book.

Now let’s return to the blockchain. To find a transaction by its hash or by the address of the caller, you will have to check every transaction in every block. The best way out is to create a separate database with all the contents of the blockchain with pointers to search for information on specific queries and access it quickly. This is what indexers do.


## Why blockchain indexers are needed

Blockchain protocols work thanks to nodes that process transactions, ensure network security, and, most importantly, store copies of blocks in chronological order. Validator nodes are conditionally divided into light ones with a copy of the last blocks and archival ones with an entire blockchain. Users can get on-chain data from their nodes or third-party nodes using the Remote Procedure Call API to request data about the blockchain. 

However, nodes and RPC API aren't designed to work with complex searches and queries.
For example, a developer can access an operation's details only if they know where to look for them.

Let's try to get data about this transaction using Tezos client and RPC API — [opRjkzJxJ1xZaUnBDykGUjrRV8qgHFvchcYnbkkcotS1Y7idCSL](https://tzstats.com/opRjkzJxJ1xZaUnBDykGUjrRV8qgHFvchcYnbkkcotS1Y7idCSL). 

![](assets/transaction_tzstats.png)


The highlighted part at the top of the screenshot is the command we used: 

`tezos-client rpc get /chains/main/blocks/2283698/operations/3/2`

The numbers in the command mean the following:

- 2283698 — the level of the block in which the operation took place.
- 3 — the index of the operation's source type. "3" means the user initiated it.
- 2 — the index of the operation in a particular block.

To get the details of a specific operation, we need to know its location in the blockchain: when it was included, what operation type table it was written in, and its number in that index. To know it, we need to check all blocks in turn for the presence of the specified hash, which is very slow and ineffective. 

Indexers simplify the task of getting the data you need from the blockchain. They request whole blocks from public nodes and write them to their databases. Then indexers create indexes—-additional data structures optimized for fast data retrieval that store either the data or a link to the corresponding place in the central database. When searching for any data, the indexer looks for it in the corresponding index, not in the central database. For even faster searching, some indexers don't store all data in one table but create separate tables for any valuable data. 

![](assets/usdt_que_pasa.png)

Here is a USDT contract indexed with Que Pasa. It made tables for every entry point and big_map in the contract and an index for every table. It is an efficient way to fetch data. For example, the execution of a query to find a balance of a random USDT holder took only 0.064 milliseconds.

![](assets/que_pasa_sql.png)

The exact list of tables, indexes schemas, and command syntax depend on the indexer and database it uses. While using TzKT, a query for a USDT balance will look like this:

```
https://api.tzkt.io/v1/tokens/balances?token.contract=KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o&account=tz1a1RTsGUbads3VucUQDxJF4EDXkDWcDHPK
```

Let's look at the different parts of this url:
- `https://api.tzkt.io/v1/`: link to TzKT API.
- `tokens/balancesGreen`: the path to the table with token balances.
- `?token.contract=KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o`: first search filter, where we specify the contract address we need.
- `&account=tz1a1RTsGUbads3VucUQDxJF4EDXkDWcDHPK`: second search filter, where we specify holder address.

In addition to search speed, indexing has another advantage: the ability to modify indexing rules. For example, TzKT provides an additional index, where each Tezos FA1.2 and FA2 token has its internal id. So instead of comparing relatively long contract addresses, it will compare small numbers and retrieve data even faster.

![](assets/tzkt_api_token.png)

There are two types of blockchain indexers: full and selective. 

Full indexers process and write all data from blocks, from simple transactions to validator's node software versions. Blockchain explorers commonly use them to provide users with advanced blockchain analytics and allow them to search for any type of on-chain data. Also, those who host full indexers often offer public APIs that other projects can use without hosting the indexer themselves.

The best examples of full indexers with public APIs are [TzKT](https://tzkt.io/) and [TzStats](https://tzstats.com/). They allow you to find almost any information that once got into the Tezos blockchain.

Selective indexers store only selected data. Usually, they find their use in projects requiring only specific on-chain data: active user balances, balances of their smart contracts, and NFT metadata. A custom selective indexer can be optimized for fast execution of specific project queries and also needs less space and resources to maintain.

Popular selective indexers like [Que Pasa](https://github.com/tzConnectBerlin/que-pasa) and frameworks like [DipDup](https://dipdup.io/) and [Dappetizer](https://dappetizer.dev/) can be used to build the indexer you need. For example, [Teia.art](https://teia.art/) and other NFT marketplaces use their indexers based on DipDup, optimized for working with NFTs.

## What data can be obtained through a blockchain indexer

The exact list of queries and filters depends on the selected indexer. But in general, from a full indexer, you can get information about:

- Account: tez balance, transaction history, address type and status like "baker" or “delegator,” etc.
- Block: header, content, and metadata like address and socials of the baker who made the block.
- Contract: description, entry points, balance, code in Michelson, storage, and the content of a specific big map.
- Bakers and delegators: who earned how much, who endorsed a particular block, how much users delegate.
- Protocol: what cycle is now, what is on the vote, how many tez are in circulation.

We took some interesting and simple examples for calling BetterCallDev and TzKT indexers. Follow the links and paste your address instead of tz1…9v4 into the address bar to get data about your wallet:

- [fxhash NFTs you own](https://api.tzkt.io/v1/tokens/balances?account=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4&token.contract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton). The fxhash contract address filters the query, so try to change the address to see your NFTs from other marketplaces.
- [Your balance history in tez](https://api.tzkt.io/v1/accounts/tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4/balance_history). Nodes and indexers display balances without decimals, and ""balance": 500000" means only five tez.
- [List of FA1.2 and FA2 token transfers](https://api.tzkt.io/v1/tokens/transfers?from=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4) where you were the sender. Change "from" to "to" in the query to see the list of transfers where you were a recipient.

## Where Indexers Are Used

Many applications that work with on-chain data use an indexer.

The simplest example of working with an indexer is a blockchain wallet. For example, to display a user's token balances, Temple Wallet queries this data from the TzKT indexer and gets tokens' tickers and logos from the contract metadata. 

![](assets/temple_query.png)

Try it yourself: follow [this link](https://api.tzkt.io/v1/tokens/balances?account=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4) and replace tz1...9v4 with your wallet address to see which tokens you have. This is the same query to TzKT API that Temple uses: '/tokens/balances' in constants getTokenBalances and getNFTBalances.

In the same way, Temple Wallet receives transaction details and displays NFTs, delegation rewards, the value of your tokens, and other data. For different queries, it uses various sources. For example, it requests the XTZ price from Coingecko.

Other blockchain applications work similarly:

- Decentralized exchanges' websites use indexers to obtain historical data on the balances of each pool, transactions with them, and the value of tez. Based on this data, they calculate the volume of transactions in tez and dollars, as well as the historical prices of tokens in dollars.
- NFT marketplaces' websites index transactions with their contracts to display new NFTs, transaction history, and statistics of the most popular tokens.
- Blockchain explorers display data from all blocks with the help of indexers and allow users to find anything, like operation details by its hash. Thanks to this, users can find the information they need in a user-friendly graphical interface. Browsers also run public APIs that other projects use.


## Self study

Let's say you plan to launch a DeFi dashboard that will display the user's token balances: tez, stablecoins, fungible tokens, and NFTs. Think about how you would implement this based on what you have learned about blockchain indexers.

### Solution

The simple way to do this is to make a list of all token smart contracts addresses and then run an indexer to store the contents of their storage in a database. Then you could run queries to get all balance records about the selected address. TzKT does it this way and even has a specific API endpoint:

https://api.tzkt.io/v1/tokens/balances?account=tz1UEQzJbuaGJgwvkekk6HwGwaKvjZ7rr9v4


Using an indexer is not necessary, but the alternative — to use public RPC nodes and fetch data directly from the blockchain — is much more complicated. Token balances can be obtained by reading big_map contracts that store balance records. First, you would need to get the hash of the user's address in script-expression format. To do this, run the command

`octez-client hash data '"{address}"' of type address`

![](assets/hash_data.png)

Then you would need to find out the big_map id of the token contracts, pools, and farms you want to map. For example, Kolibri USD (kUSD) stores user balances in a big_map with id 380.

`octez-client get element exprvEJ9kYbvt2rmka1jac8voDT4xJSAiy48YJdtrXEVxrdZJRpLYr of big map 380`

![](assets/get_element.png)

That is, to find out the balances of FA1.2 and FA2 tokens, you need to collect in advance the id of the necessary big_map contracts of tokens, and in turn, ask them for values ​​by address.

See how much more complicated it is to query data from blockchain rather than to use indexers.



# How to Use the TzKT API in a Simple Project on Tezos

Previously, we talked about how indexers work and showed a couple of examples. Now let's explain how to use them for real-life tasks. First, let's make a simple website for displaying the balance of an address, then a more complex dashboard for displaying liquidity baking data and calculating indicators.

We will use public TzKT and JavaScript with the jQuery library in our examples. Nothing complicated, just one HTML file with a script.

## Displaying Address Balance Using the TzKT Public Indexer

The most popular use case for blockchain explorers and indexers is to check the balance of different tokens for a given address. It is convenient when storing cryptocurrencies in a cold wallet: you do not need to connect it to the network again, thus endangering the funds.

We will make a simple page where users can enter their addresses and check the balance in tez. Then we will add the display of token balances and some other information. To do this, we will use the TzKT API.

First, let's create an empty HTML file in VS Code (you may use another editor, of course) and add the essential elements: doctype, head, title, and body.

![](assets/check_balance_html_1.png)

We will use AJAX and the jQuery library to request data via the API and process it. Incorporating a library is simple: just provide a link to it in the script element.

![](assets/check_balance_html_2.png)

Let's get the balance of our address via AJAX. 

![](assets/check_balance_ajax.png)

First, we added the $(document).ready() command. It ensures the page is loaded before the scripts are processed.

Then we wrote a request to TzKT using AJAX: in "URL,” the request link to get the balance; in "type," the type of the GET request to get information; and in "success," the function that will process the response. 

In the function, we will declare the variable balance, assign the value of the answer (data), and immediately divide it by a million. You must do this because the indexer returns the balance in mutez, millionths of tez.

To use the balance variable in HTML, you need to assign an internal id to this variable. Let's do this with the document.getElementById method.

In the end, we will add a h2 element, in which we will display the balance. To display the variable's value, we use the span element and the id previously assigned to the balance variable.

Let's open the page and check the result.

![](assets/check_balance_result.png)

### Adding a button and field to check specific address balance

AJAX now sends an API request as soon as the page loads. Let's add a button, pressing which will launch the request.

![](assets/check_balance_button.png)

To do this, wrap the h2 in a div element and make it hidden with the style="display:none" parameter.

Let's create a button and add a call to the check function to it, in which we will place the entire request code. At the end of the function, add a change in the display style of the div to a visible block. 

Now we need to add a field for entering the user's address and tweak the check() function to insert it into the API request.

![](assets/check_balance_input.png)

To do this, we did the following: 

1. Added the address parameter to the check() function.
2. Changed the value of the "URL" field. When run, the script will make a valid API request using the received address.
3. Added a field for entering an address with an id.
4. Changed the button's code so that pressing it would launch the check() function and pass the entered address to it.

Now you can enter any address and, by pressing the button, get its balance in tez.

![](assets/check_balance_input_result.png)

Experiment: take [the code of this page](https://gist.github.com/pavelTU/e48c71d09ff5dcfb5343699d485760d9), paste it into an empty HTML file and open it in a browser. 

This is a simple example: the TzKT API returns the user's balance as JSON with only one number. The answer does not even need to be further processed: everything works as it is.

![](assets/tzkt_api_balance.png)

When solving real-life cases, however, you will have to work with JSON arrays and carefully read API responses to select the necessary data. The next chapter explores this matter further.

## Displaying liquidity baking statistics 

That contract with 5 million tez is [Sirius DEX](https://siriustoken.io/), better known as liquidity baking. Here is its [contract on TzKT explorer](https://tzkt.io/KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5/operations/). 

Liquidity Baking is Tezos' unique DeFi protocol. Users contribute tez and tzBTC to it to provide liquidity for the exchange, and the Tezos network itself adds another 2.5 tez to the pool in each block. Thus, the balances of liquidity providers in this pool are constantly growing. 

Since all liquidity backing data is stored on-chain, we can get it using API requests to public indexers and then calculate the annual yield and other helpful information.

First, we are interested in the balance of Sirius DEX, particularly how much the contract has tez and tzBTC. We will receive these numbers from the indexer. 

We need to calculate how much tez the protocol subsidies per year. Here you can calculate the number of seconds in a year, divide this value by the average block creation time—30 seconds—and multiply by one subsidy.

It remains to find out the current value of assets in Sirius DEX and the value of subsidized tez for the year and divide these values​​​​, which would be the annual return or APY.

We are starting a new page. First, let's try to get something simple, like the Sirius DEX internal contract id in the TzKT database.

![](assets/sirius_contract_id_html.png)

Let's copy the code of the first example and remove the button and the field for entering the address from it. Let's replace the API request URL with https://api.tzkt.io/v1/contracts/KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5 to get information about the contract from the indexer.

Now it’s time to change the function for data processing. To get specific values, you need to specify the key. In our case, the key is id, and requesting a value using this key will look like var contractId = data.id.

Ultimately, we assign an internal ID, "contractId", to the corresponding HTML element and display it on the page in the h2 element.

![](assets/sirius_contract_id_result.png)
  
We made sure everything worked, so now we can get the data we need: tez and tzBTC balances.

First, we should examine TzKT's response to our API request. It has a balance field in tez, so we can get it without changing the request.

![](assets/tzkt_sirius_contract.png)

Now, assign the value from the received array to the balanceInTez variable by the balance key.

![](assets/sirius_balance_html.png)

![](assets/sirius_balance_result.png)

Now we need to get the amount of tzBTC. Let's examine the storage of the liquidity backing contract on TzKT: it shows the amount of tzBTC under the tokenPool key. You can access it by requesting the contents of the storage. 

![](assets/tzkt_sirius_storage.png)

Now we should create another AJAX request. In the URL, we specify the API request for the storage content and assign the value of the corresponding entry, tokenPool, to the balanceInTZBTC variable.

![](assets/sirius_balance_tzbtc_html.png)

On the page, we will display the balance in tzBTC.

![](assets/sirius_balance_tzbtc_result.png)

Now it’s time to calculate the subsidies for the year. The average year has 31,556,926 seconds. We divide this value by the block creation time and multiply it by the subsidy amount.

We can get the block creation time and subsidy amount from TzKT at https://api.tzkt.io/v1/protocols/current. They will be referred to as timeBetweenBlocks and lbSubsidy in the response.

![](assets/tzkt_protocols.png)

So, we need to get data from two API requests in one function and use it for calculations. But as the variables are local and can't be used in other functions, we need to use nested functions:

1. Get the number of tez.
2. Write them to a variable.
3. Call the function to calculate annual percentage yield(APY) and pass it the number of tez as an argument.
4. In the APY function, get the necessary data and make calculations.
5. Write the results to variables and assign an ID.
6. Return to the first AJAX function and add a variable ID assignment at the end with the amount of tez.

First, let's add a call to the checkTimeAndSubsidy function to the function to get the Sirius DEX balance in tez.

![](assets/call_time_and_subsidy.png)

Below, we will declare the same function and add an AJAX call to request protocol data from TzKT.

![](assets/time_and_subsidy_function_1.png)
 
We should assign three new variables: 

- secondsInYear: the average number of seconds in a year, in fact, a constant.
- timeBetweenBlocks: block creation time.
- lbSubsidy: Sirius DEX pool subsidy in mutez. We divide it by a million to get the value in tez instead of mutez.

We now have all the data to calculate the annual subsidy and APY liquidity backing.

![](assets/time_and_subsidy_function_2.png)

Now we can calculate the necessary values by creating the variables yearlySubsidy and APY. 

To calculate APY, it is not necessary to obtain asset prices. At any given moment, the value of all tez in the pool equals the value of all tzBTC. To simplify APY calculation, we assume that the user adds to the liquidity pool not tez and tzBTC, but twice as much tez. His APY would be a share of the yearly subsidy divided by the liquidity he provided. Roughly speaking, APY = yearlySubsidy / (balanceInTez × 2) × 100%.

It’s now possible to give the annual amount of subsidies and APY internal ID values, and add them to the page. 

![](assets/time_and_subsidy_result.png)

[Example code on Github](https://gist.github.com/pavelTU/5a56c940952f01e838a3ca98215eab15).

## Self study

Try to calculate the value of tez in the Sirius DEX liquidity pool. 

1. Find a smart contract of any liquidity pool with a stablecoin against tez: tez/USDt, tez/kUSD, or tez/uUSD.
2. Get the number of tokens in the pool using an API request.
3. Divide the number of tez by the number of stablecoins to find the price of tez.
4. Multiply the number of tez in the Sirius DEX pool by the resulting exchange rate.
5. Add the result to the appropriate line.

### Solution

First, check [the tez/kUSD contract](https://tzkt.io/KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6/storage/) on an exchange on TzKT. Then examine the storage and find the necessary keys: tez_pool is the amount of tez, and token_pool stands for the amount of kUSD. 

![](assets/tez_kusd_contract.png)
 
And we need to remember that the token's amount in the contract's storage is a natural number. And to display the actual amount of tokens, we need to divide that nat by the corresponding number of decimals written in the contract's metadata. For example, kUSD has 18 zeros after the decimal point, and when we get raw token amount data, we need to divide it by 10^18 to get the actual amount.

![](assets/kolibri_usd.png)

Since we need to know the number of tez in the pool to calculate the cost of all tez, we need to use nested functions. After receiving the balanceInTez variable, we call the checkValueOfTez function with the balanceInTez argument. In this function, we use AJAX to get data from the tez/kUSD pool (remember to divide the number of tokens depending on the required number of zeros!)

Next, we calculate the price of one tez and the cost of all tez in the pool. At the end, we will add the readableValue variable: using the toLocaleString () method, we will add comma separators to the number.

![](assets/homework_value_of_tez.png)

As a result, we get the cost of all tez in the Sirius DEX pool, which we get completely from on-chain data.

![](assets/homework_value_of_tez_result.png)
>>>>>>> 9cd286b (indexers cleanup)
