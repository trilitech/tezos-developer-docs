---
id: tickets
title: Tickets
authors: Daniel Nomadic
---

## Introduction

The Edo Amendment, adopted by the community in February 2021 introduced an improvement to the Michelson smart contract language, a new data type: **tickets**.

A speciﬁc feature of tickets is that they contain the address of the contract they come from - this information is immutable and cannot be duplicated; this ensures that a contract never has more tickets bearing its address than those it has created itself.

A ticket contains three elements in its structure:

- **A source**: the address of the contract it comes from.

- **An identiﬁer**: an element of any comparable type. This can be used to manage several types of tokens or to store information.

- **A value**: this value is equivalent to a quantity that distinguishes fungible and non-fungible tokens. In the case of fungible tokens, this value is greater than 1, but divisible into single units. In the case of non-fungible tokens, this value is always equal to **1**.

Tickets allow many use cases, in particular, it helps to simplify tokenization contracts by providing token materialization. It also ensures that access rights can be transferred simply outside of a given contract, i.e. without calling it or changing its storage.

## Instructions

There are four Michelson instructions that enable interactions with tickets:

- **`TICKET`**: to create a ticket with an identiﬁer and a value; the source address is that of the contract that initiated the creation.

- **`READ_TICKET`**: shows information about a ticket (address, identiﬁer, and value), while preserving it on the Michelson stack¹.

- **`JOIN_TICKETS`**: combines two tickets with the same source and identiﬁer into a new ticket; its value will be the sum of the values of the original tickets.

- **`SPLIT_TICKET`**: reverse of the JOIN_TICKETS operation; splits one ticket into two tickets with the same identiﬁer such that the sum of their values is equal to the value of the original ticket.

:::info
The majority of Michelson functions destroy the elements that they use on top of the stack, that's why you must first duplicate them (with the **`DUP`** instruction). `READ_TICKET` is an exception to this rule as it is not possible to duplicate a ticket.
:::

## Identiﬁers

In a Ticket structure, the ﬁeld called identiﬁer is not only useful to identify a ticket; it can also be used to store information that may be used by the contracts that will read the ticket.

For example, we can:

- manage an arbitrary number of different tickets on the same contract by changing the identiﬁer;

- have a piece of data that are veriﬁed by a contract in the same way that signatures are;

- give a piece of data used as a date or, alternatively, an activation date thanks to a timestamp.

By extending comparable types, it is possible to aggregate or combine these uses.

It is important to consider that the identifier type depends on the use that will be made of the ticket, and that two tickets of the same type will not necessarily have the same functions depending on the contracts in which they will be used.

Please note that since the Edo protocol, comparable types are pairs of two comparable types, optional comparable types, and unions of two comparable types.

## Use cases

### Tokenization

Tickets enable tokens of a tokenization contract to be materialized. In this way, they can be manipulated outside the original contract; this allows them to be exchanged against other tickets coming from different contracts.

In particular, Tezos roll-ups solution are heavily reliant on tickets because only them are transferable between the layer-1 and the layers-2. In order to deposit tokens (Tez, FA2, ...) inside a roll-up, they must first be wrapped as a ticket.

In some cases, tokens may be stored entirely in the form of tickets and circulate outside of the contract. This works for fungible or non-fungible assets. This is particularly the case when tokens are used for delivery versus payment, and where it is not necessary to know who holds the tokens until they are sent back to the contract to be destroyed, and for all legal intents and purposes.

Other contracts will be hybrid. This is the case for contracts representing video game items: Given that it is necessary to be able to know at any time whether a player holds an item, the contract must keep the information within its own data. However, it is possible to allow a player to withdraw one of their items temporarily, for example, to exchange them or prove to another contract that they have it.

### Privilege management

Tickets also enable a usage privilege to be granted to a user. We can thus ensure that this user is the only one able to use certain properties. Unless this user decides to transfer his token, we can therefore consider that by giving them (or selling them) the ticket, they are also selling the contract and associated privileges. This can facilitate cases where contracts are exchanged or sold.

Privilege management by ticket also enables users to choose the way in which they retain their ticket. For example, they can use a multi-signature contract such that the contract is controlled by several users.
We can also consider that this contract has tickets to access several contracts.

It is therefore possible to transfer or acquire access rights to a contract, such that a new user can choose the way he wishes to keep his ticket.

### Votes

Tickets can also allow voters to make decisions or to validate transactions.

A contract could ensure that transfers are performed according to the votes of a committee: Each time a transaction is proposed, members vote with their tickets.

It, therefore, becomes possible to consider cases of proportional voting in which participants do not have the same weighting (according to the number of tickets held).

Members can then sell all or some of their rights or, on the other hand, buy more units.

It is possible in this context to organize voting for a purpose external to the blockchain, such as elections or business decisions.

### Authentication

Authentication by using tickets entails allowing each user to choose their protection method. They just need to register the contract address they use to generate authentication tickets, and validate transactions that concern them, provided that they have a ticket from this contract as if this was a signature.

The main benefit of this system is that the contract may have its own ticket-issue management and may, for example, be a multi-signature wallet, a time-based contract, or a manager contract. Furthermore, the same contract may be used to generate the authentication tickets of several other contracts. It will also be possible to make a suitable contract that does not associate the same security with different functionalities.

Lastly, the main advantage of this method lies in its non-replicability. Indeed, if we request a ticket with a value of 1 and this ticket is used at the time in another application, this ticket cannot be reused. This enables several tickets to be issued without having to worry about the order in which they will be executed.

It is also possible for the authentication contract to create a ticket with a value greater than 1. This value will actually set the maximum number of uses for this authentication.
