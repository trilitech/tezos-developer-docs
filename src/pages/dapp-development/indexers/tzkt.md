---
sidebar_position: 2
hide_table_of_contents: true
title: "TzKT"
hide_title: true
---
## TzKT

We have talked about how a blockchain includes a lot of transactions and information. Working directly on the whole blockchain to fetch and process data will be time consuming. 

[TzKT](https://github.com/baking-bad/tzkt) is a lightweight Tezos blockchain indexer with an advanced API created by the [Baking Bad](https://baking-bad.org/docs) team with huge support from the [Tezos Foundation](https://tezos.foundation/).

The indexer fetches raw data from the Tezos node, then processes it and stores in the database in such a way as to provide effective access to the blockchain data. For example, getting operations by hash, or getting all operations of the particular account, or getting detailed baking rewards, etc. None of this can be accessed via node RPC, but TzKT indexer makes this data \(and much more\) available.

### Features:

* **More detailed data.** TzKT not only collects blockchain data, but also processes and extends it with unique properties or even entities. For example, TzKT was the first indexer introduced synthetic operation types such as "migration" or "revelation penalty", which fill in the gaps in account history \(because this data is missed in the blockchain\), and the only indexer that correctly distinguishes smart contracts among all contracts.
* **Micheline-to-JSON conversion** TzKT automatically converts raw Micheline JSON to human-readable JSON, so it's extremely handy to work with transaction parameters, contract storages, bigmaps keys, etc.
* **Data quality comes first!** You will never see an incorrect account balance, or total rolls, or missed operations, etc. TzKT was built by professionals who know Tezos from A to Z \(or, in other words, from tz to KT 😼\).
* **Advanced API.** TzKT provides a REST-like API, so you don't have to connect to the database directly. In addition to basic data access TzKT API has a lot of cool features such as deep filtering, sorting, data selection, exporting .csv statements, calculating historical data \(at any block\) such as balances or BigMap keys, injecting historical quotes and metadata, optimized caching and much more. See the complete [API documentation](https://api.tzkt.io/).
* **WebSocket API.** TzKT allows to subscribe to real-time blockchain data, such as new blocks or new operations, etc. via WebSocket. TzKT uses SignalR, which is very easy to use and for which there are many client libraries for different languages.
* **Low resource consumption.** TzKT is fairly lightweight. The indexer consumes up to 128MB of RAM, and the API up to 256MB-1024MB, depending on the network and configured cache size.
* **No local node needed.** TzKT indexer works well even with remote RPC node. By default it uses [tezos.giganode.io](https://tezos.giganode.io/), the most performant public RPC node in Tezos, which is more than enough for most cases.
* **Quick start.** Indexer bootstrap takes ~15 minutes by using snapshots publicly available for all supported networks. Of course, you can run full synchronization from scratch as well.
* **Validation and diagnostics.** TzKT indexer validates all incoming data so you will never get to the wrong chain and will never commit corrupted data. Also, the indexer performs self-diagnostics after each block, which guarantees the correct commiting.
* **Flexibility and scalability.** There is no requirement to run all TzKT components \(database, indexer, API\) together and on the same machine. This allows flexible optimization, because you can optimize each component separately and according to your needs. Or you can run all the components on the same machine as well, which is much cheaper.
* **PostgreSQL.** TzKT uses the world's most advanced open source database, that gives a lot of possibilities such as removing unused indexes to reduce storage usage or adding specific indexes to increase performance of specific queries. You can configure replication, clustering, partitioning and much more. You can use a lot of plugins to enable cool features like GraphQL. This is a really powerful database.

You can [install](https://github.com/baking-bad/tzkt#installation-docker) or [build](https://github.com/baking-bad/tzkt#installation-from-source) it, and [configure](https://github.com/baking-bad/tzkt#install-tzkt-indexer-and-api-for-testnets) it for the testnet.

At this point, we want to learn how to work with the **TzKT API**. Therefore, we will work with a [public endpoint](https://api.tzkt.io/#section/Introduction).

