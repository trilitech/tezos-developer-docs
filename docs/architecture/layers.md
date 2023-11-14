---
title: Layers
authors: Tim McMackin
last_update:
  date: 14 November 2023
---

Tezos runs transactions on two layers:

- Baking nodes run transactions on Tezos layer 1, which is the primary layer and the layer that most people mean when they talk about Tezos and transactions.

- Smart Rollup nodes run transactions and logic in a separate environment that doesn't need to follow all of the same rules as layer 1.
The transactions and logic that Smart Rollups run is called layer 2.

For example, Smart Rollups can run transactions at a much higher rate than layer 1 does.
Also, they can run large amounts of processing and handle large amounts of data that would be impractical on layer 1 blocks.
Smart Rollups regularly publish their state to layer 1 for nodes to verify.

Separating logic into layers like this allows Tezos to scale to run large amounts of transactions.
Smart Rollups can receive messages from layer 1 and use the information in the messages to run large processing operations independently of layer 1.

For more information about Smart Rollups, see [Smart Optimistic Rollups](./smart-rollups) and the tutorial [Deploy a smart rollup](../tutorials/smart-rollup).

## Communication between layers

As shown in the diagram in [Architecture](../architecture), each layer 1 block has a global rollups inbox that contains messages from layer 1 to all rollups.
Anyone can add a message to this inbox and all messages are available to all rollups.
Rollups receive this inbox, filter it to the messages that they are interested in, and act on them accordingly.

Smart Rollups can send messages back to layer 1 by adding them to their outbox, which consists of calls to smart contracts on layer 1.

Smart Rollups also have access to the _reveal data channel_, which lets them request data from sources outside the inbox.
This channel lets rollups access large amounts of data without having to store it on layer 1.
