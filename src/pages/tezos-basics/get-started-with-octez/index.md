---
id: get-started-with-octez
title: Getting Started with Octez
authors: 'Thomas Zoughebi, Aymeric Bethencourt, and Maxime Fernandez'
lastUpdated: July 2023
---

## Octez - The Tezos Client 

_Octez_ is the official client to interact with a Tezos node via RPC (remote procedural calls). In theory, there can be multiple implementations of the Tezos protocol, but currently, there is only Octez. Octez consists of several binaries (i.e., executable files), including a client, a node, and a baker.

### How to install the *octez-client*

#### On Mac OS with [Homebrew](https://brew.sh/)

```bash
brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
brew install tezos-client
```

#### On Ubuntu with binaries

```bash
sudo add-apt-repository ppa:serokell/tezos && sudo apt-get update
sudo apt install tezos-client -y
```

#### On Fedora with binaries

```bash
dnf copr enable -y @Serokell/Tezos && dnf update -y
dnf install -y tezos-client
```

#### From [sources with OPAM](https://tezos.gitlab.io/introduction/howtoget.html#building-from-sources-via-opam)

### Connecting to a node

Below we'll connect to a community node (<https://ghostnet.tezos.marigold.dev>) on the Ghostnet **testnet**. We'll use the `--endpoint` parameter to update the configuration of the Octez Client on a Ubuntu system:

`octez-client --endpoint https://ghostnet.tezos.marigold.dev config update`


The result should look like this:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.
```

On Ubuntu, the config file should be written in "/.octez-client/config" under your "home" folder. For example, after the last command, the new "config" file looks like this (with Nano):

```bash
{ "base_dir": "/home/userName/.octez-client",
  "endpoint": "https://ghostnet.tezos.marigold.dev", "web_port": 8080,
  "confirmations": 0 }
```

### Account funding

To get free tez on testnet, you must first generate a Tezos account. If you don't already have one, you can generate one with the following command:

`octez-client gen keys my_account`

You can now retrieve the generated address (the hash of the public key, it starts with tz1, tz2 or tz3) with the command:

`octez-client show address my_account`

The result should look like this:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.

Hash: tz1VvyNvPUdypHaTgznTLSkumj9YMZxpmB9p
Public Key: edpkufA6kH6hw4ckZWWmYuLZpfwfXc9abiaEDLqH2iviFXnK9N4oct
```

You can now go to [the testnets website](https://teztnets.xyz/), select your testnet faucet and request tez!

### Octez Client user manual and version

{% callout type="note" %}
The full command list for *Octez client* is available [here](https://tezos.gitlab.io/shell/cli-commands.html).
{% /callout %}

## Octez Client examples

### Get balance

Get the balance of an account:

```bash
octez-client get balance for [account_id]
```

Example with our previously registered user "my_account":

```bash
octez-client get balance for my_account
```

The response:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.

1 ꜩ
```

The previous response is also a way of checking if the account is activated on the testnet (first transfer).

### Get timestamp

Get the UTC of the latest downloaded block. Keep in mind, timezones may differ from your local time:

```bash
octez-client get timestamp
```

Result example:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.

2022-10-04T13:34:00Z
```

### List known addresses

This call only lists registered **implicit accounts** in your Octez client.

```bash
octez-client list known addresses
```

Example response:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.

my_account: tz1VvyNvPUdypHaTgznTLSkumj9YMZxpmB9p (unencrypted sk known)
```

### List known contracts

This call lists **all registered accounts**, *implicit* **and** *originated* in your Octez client.

```bash
octez-client list known contracts
```

Our example:

```bash
Warning:
  
                 This is NOT the Tezos Mainnet.
  
           Do NOT use your fundraiser keys on this network.

my_account: tz1VvyNvPUdypHaTgznTLSkumj9YMZxpmB9p
```

Everything is correct: We don't have any *originated* account and only one *implicit* account!

### Transfers and receipts

The command below transfers 42 ꜩ from the account *user1* to *user2* (you can use Tezos addresses directly):

```bash
octez-client transfer 42 from user1 to user2
```

Notice that you can specify the maximum fee for this operation appending, "`--fee-cap`" (defaults to 1.0). The network would determine the actual fee, lower than this cap:

```bash
octez-client transfer 42 from user1 to user2 --fee-cap 0.9
```

You can also add "`--dry-run`" or "`-D`" if you want to test and display the transaction without finalizing it.

For our example, let's generate another account and feed it with tez from [the faucet website](https://faucet.ghostnet.teztnets.xyz/):

```bash
$ octez-client gen keys my_account_2
$ octez-client show address my_account_2 
Hash: tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3
Public Key: edpktfqbZHfRRSRcJ86hqxQZvgfFMLwR6zMZAXA5UgE81L7WqHt579
```

Let's verify the balance (and activation):

```bash
octez-client get balance for my_account_2
```

Response (without the warning message):

```bash
2 ꜩ
```

Let's finally try a transfer of 1.5 ꜩ from my_account_2 to my_account with a 0.5 ꜩ fee cap:

```bash
octez-client transfer 1.5 from my_account_2 to my_account --fee-cap 0.5
```

Response (without the warning message) should be:

```bash
Node is bootstrapped.
Estimated storage: no bytes added
Estimated gas: 1000.040 units (will add 0 for safety)
Estimated storage: no bytes added
Operation successfully injected in the node.
Operation hash is 'oocBxnYDf8qiT3EmRFZxR9axGKqEJMxWnFAnzN5Dwz8QFxUe89Z'
Waiting for the operation to be included...
Operation found in block: BLzxBbdk1yq61Z3U36652RBxMM6PMfitA53Rk3xFiZpMX9yQZVa (pass: 3, offset: 0)
This sequence of operations was run:
  Manager signed operations:
    From: tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3
    Fee to the baker: ꜩ0.00036
    Expected counter: 12102064
    Gas limit: 1000
    Storage limit: 0 bytes
    Balance updates:
      tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3 ... -ꜩ0.00036
      payload fees(the block proposer) ....... +ꜩ0.00036
    Revelation of manager public key:
      Contract: tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3
      Key: edpktfqbZHfRRSRcJ86hqxQZvgfFMLwR6zMZAXA5UgE81L7WqHt579
      This revelation was successfully applied
      Consumed gas: 1000
  Manager signed operations:
    From: tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3
    Fee to the baker: ꜩ0.000258
    Expected counter: 12102065
    Gas limit: 1001
    Storage limit: 0 bytes
    Balance updates:
      tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3 ... -ꜩ0.000258
      payload fees(the block proposer) ....... +ꜩ0.000258
    Transaction:
      Amount: ꜩ1.5
      From: tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3
      To: tz1VvyNvPUdypHaTgznTLSkumj9YMZxpmB9p
      This transaction was successfully applied
      Consumed gas: 1000.040
      Balance updates:
        tz1M9Snt3Sdcv9YkTrergj3ar6FuQ2g4T9y3 ... -ꜩ1.5
        tz1VvyNvPUdypHaTgznTLSkumj9YMZxpmB9p ... +ꜩ1.5

The operation has only been included 0 blocks ago.
We recommend to wait more.
Use command
  octez-client wait for oocBxnYDf8qiT3EmRFZxR9axGKqEJMxWnFAnzN5Dwz8QFxUe89Z to be included --confirmations 1 --branch BLngFFgWJ1TJUgPTp4CLvnyGFzwhKrpcazRFysptBmhZKKH4w94
and/or an external block explorer.
```

Let's check both balances (testnet warning messages removed):

```bash
$ octez-client get balance for my_account
2.5 ꜩ

$ octez-client get balance for my_account_2
0.499382 ꜩ
```

Everything is fine.

You can observe your actions on explorers like *tzkt* or *tzstats*:

* Mainnet: [TzKT](https://tzkt.io/), [TzStats](https://tzstats.com)
* Ghostnet: [TzKT](https://ghostnet.tzkt.io/), [TzStats](https://edo.tzstats.com)
  
OpenTezos has a guide on [how to use an explorer](https://opentezos.com/explorer).

{% callout type="note" %}
For a more comprehensive guide on how to install Octez, including via Docker images, see the [docs](https://tezos.gitlab.io/introduction/howtoget.html) by Nomadic Labs. 

The above is an abridged version of the [Octez guide](https://opentezos.france-ioi.org/en/a/1332828229711949831;p=1,3556096645042535892;pa=0) found on OpenTezos.
{% /callout %}
