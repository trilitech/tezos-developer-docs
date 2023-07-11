---
id: tzstats-main-features
title: How to use the tzStats blockchain explorer?
authors: Maxime Sallerin
slug: /tzstats-main-features
lastUpdated: June 2023
---

In this chapter, we will use the [TzStats](https://tzstats.com/) explorer to illustrate the different features of an explorer, but similar features are usually available on others. Concerning the observation of smart contracts, the different aspects are discussed in the [following chapter](/explorer/tzstats-smart-contract).

[TzStats](https://tzstats.com/) is developed by _Blockwatch Data Inc._ It is a block explorer for public and private Tezos networks and it is based on the [TzIndex indexer](https://github.com/blockwatch-cc/tzindex).

Each Tezos network has its own _TzStats_ version:

- **Mainnet**: [tzstats.com](https://tzstats.com)
- **Ghostnet**: [florence.tzstats.com](https://ghost.tzstats.com/)

## TzStats' main features

TzStats has a complete guide available [here](https://tzstats.com/docs/guide).

- [Main Dashboard](https://tzstats.com/): This page provides a quick view of all the main activity on the Tezos network, e.g. staking activity, gas price, tez supply, transaction volume, etc.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_first_page.png" 
  alt="tzstats-main-dashboard" 
  caption="TzStats Main Dashboard" %}  
{% /figure %}

- [Cycle](https://tzstats.com/cycle/head): This page provides general information about a specific cycle number. A cycle is a way of measuring time. Every cycle is equal to 4096 blocks.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_cycle.png" 
  alt="tzstats-cycle-page" 
  caption="TzStats Cycle Page" %}  
{% /figure %}
  
- [Block](https://tzstats.com/1496426): This page provides general information about a specific block number along with its technical details such as gas used, block health (Endorsed Slots, Missed Priorities and Missed Endorsements), etc.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_block.png" 
  alt="tzstats-block-page" 
  caption="TzStats Block Page" %}  
{% /figure %}

- [Network Activity](https://tzstats.com/activity): This page provides a world map with the location of where new blocks are being baked. There is also the list of _whale operations_ (i.e. a list of high-value transfers >= $100,000).
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_activity.png" 
  alt="tzstats-activity-page" 
  caption="TzStats Activity Page" %}  
{% /figure %}

- [Bakers](https://tzstats.com/bakers): This page provides the total number of Tezos bakers. Several lists are also available to gain an overview of the Tezos baker landscape. You can choose between several tabs, namely, Public, Private, Closing, and Leaderboard.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_bakers.png" 
  alt="tzstats-bakers-page" 
  caption="TzStats Bakers Page" %}  
{% /figure %}

- [Protocols](https://tzstats.com/protocols): This page shows the past and current protocol used by Tezos and the overall age of the Tezos blockchain. Refer to the chapter on the [history of amendments](/tezos-basics/history-of-amendments) to understand each protocol.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_protocols.png" 
  alt="tzstats-protocols-page" 
  caption="TzStats Protocols Page" %}  
{% /figure %}

- [Voting](https://tzstats.com/election/head): This page shows the past and current elections and indicates when it ends. Refer to chapter on the [governance on chain](/tezos-basics/governance-on-chain) to understand the voting process.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_voting.png" 
  alt="tzstats-voting-page" 
  caption="TzStats Voting Page" %}  
{% /figure %}

- [Markets](https://tzstats.com/markets): This page provides an overview of the current market activity, e.g. list of exchanges, 1 day's volume, overall market capitalization, etc.
{% figure 
  src="/developers/docs/images/tzstats-main-features/tzStats_markets.png" 
  alt="tzstats-markets-page" 
  caption="TzStats Markets Page" %}  
{% /figure %}

Here the main features have been presented and, in the next chapter, we will see how to check out your smart contract.

## References

[1] https://tzstats.com

[2] https://tzstats.com/docs/guide
