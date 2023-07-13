---
id: baker-selection
title: Submit transactions to a specific baker
authors: Daniel Nomadic
lastUpdated: 27th June 2023
---

Here we explain how operation issuers can filtrate access to their mempool of operations, using a dedicated server.

## Bakers selection and authentication

Using `--operations-pool` (visible in the baking manual: `octez-baker-alpha man`) argument when launching the baking software, bakers are able to fetch a mempool from a private server in addition to the mempool of any public Tezos node.

By controlling which bakers can access the server (the baker's address is known), users can manage those who can bake their transactions. Thus, bakers must pass a KYC to enter the set of allowed bakers but we will not discuss this part in this document.

Once bakers have been validated, the server must be able to authenticate them. The authentication mechanism needs to be determined.

## User authentication

Possibilities :

- with the URL directly: ​`http://username:password@example.com`

- with the credentials in the HTTP headers.

It really depends on how the server wants to proceed.

## Server specification

Besides authentication, the server needs to perform multiple checks on the operation sent by the user:

- It may only accept manager operations (i.e. transactions, revelation, origination, delegations)

- The server must perform a `dry-run` of the operation on its own node (public nodes could be malicious) to verify the validity of the operation and estimate its gas consumption

{% callout type="note" title="Dry run" %}
 A dry-run is a simulation performed with the octez-client
{% /callout %}


If one of these checks fails, the server responds back with an appropriate error message. If all is correct, the transaction is added to the pending queue of the server and the server sends back a confirmation that the transaction is waiting to be included in the estimated amount of time.


## Open questions users may address to use this tool

- Who hosts the server?

- Does the server need to send a confirmation that the transaction was baked or is it the user's responsibility to verify it?

- Should the server deliver the mempool only if the baker is going to bake soon?
