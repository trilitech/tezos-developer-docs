---
title: Inspecting deployed contracts
authors: Benjamin Pila
lastUpdated: 28th June 2023
---

As a developer, you will often want to check the state of your deployed smart contracts. Using a blockchain explorer is a fast and easy way to do so. In this section, we will find a smart contract and check it out on _TzStats_.

## Find your smart contract on _TzStats_

Once you have the address of your smart contract, go to the _TzStats_ website associated with the network you deployed your contract on.

Remember, the following TzStats website links are the following:
- **Mainnet**: [tzstats.com](https://tzstats.com)
- **Ghostnet**: [florence.tzstats.com](https://ghost.tzstats.com/)

Copy/paste your address in the search bar:

![](/img/developing/tzStats_search_bar.png)

TzStats then shows a page with information related to your smart contract, e.g. the balance of the contract, the amounts sent and received, the originator's address, etc.

![](/img/developing/tzStats_smart_contract_general_information.png)

Below the general information, you have a list of tabs allowing you to see:

- the calls
- the entrypoints
- the contract code
- the storage
- the different *big_maps* of your smart contract (if there are any)

For the following examples, we will check out the smart contract, deployed on the Mainnet, whose address is the following:

```
KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn
```

Available at this [link](https://tzstats.com/KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn).

### Calls

Here you have the history of all transactions related to your smart contract.

You can see:
- the transactions with the amount and the address of the sender
- the calls made to the entrypoints with the name of the entrypoint in question
- on the right the status of the block with the number of confirmations received

![](/img/developing/tzStats_smart_contract_calls.png)

### Entrypoints

Here you have a list of all your entrypoints and their parameters. Furthermore, you can see how many calls each entrypoint has received.

![](/img/developing/tzStats_smart_contract_entrypoints.png)

### Contract Code

Here you have the Michelson code of your smart contract.

![](/img/developing/tzStats_smart_contract_code.png)

### Storage

Here you have access to the content of your storage with the type of each variable and its current value. Notice that the content excludes big_maps as they are specific tabs for them.

![](/img/developing/tzStats_smart_contract_storage.png)

### Big_map

Here you have the content of your big_map.

![](/img/developing/tzStats_smart_contract_bigmap.png)

## API Calls

The same pieces of information can be retrieved by API calls, without using the frontend.
A full documentation is available [here](https://tzstats.com/docs/api#tezos-api).

The following API endpoints are the following:
- Mainnet: https://api.tzstats.com
- Mainnet Staging: https://api.staging.tzstats.com
- Ghostnet: https://api.ghost.tzstats.com

First, let's get the contract information.
The "explorer" endpoints will be used (full reference [here](https://tzstats.com/docs/api#explorer-api)).

In this example, one of the contracts has been deployed on the Mainnet to `KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn`.

Let's retrieve the contract details:

```shell
$ curl https://api.tzstats.com/explorer/contract/KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn
{
   account_id: 1571823,
   address: "KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn",
   creator: "tz1Y1j7FK1X9Rrv2VdPz5bXoU7SszF8W1RnK",
   baker: "",
   storage_size: 76,
   storage_paid: 137130499,
   storage_burn: 34282.62475,
   total_fees_used: 35107.200459,
   first_seen: 1540787,
   last_seen: 3785361,
   first_seen_time: "2021-07-03T02:48:58Z",
   last_seen_time: "2023-06-28T11:55:20Z",
   n_calls_in: 5327898,
   n_calls_out: 12802647,
   n_calls_failed: 48128,
   bigmaps: {
      metadata: 6071,
      swaps: 6072
   },
   iface_hash: "a357937cb9a451f0",
   code_hash: "c1c14f183e87db20",
   storage_hash: "2ddc5c4d726ee5c1",
   call_stats: {
      cancel_swap: 755121,
      collect: 2982990,
      swap: 1589781,
      update_fee: 3,
      update_manager: 3
   },
   features: [
   "transfer_tokens"
   ],
   interfaces: [ ]
}
```


The pieces of information do match those from the web interface: *address*, *creator*, *first_seen_time*, *last_seen_time*...

The call to the entrypoints "swap" can be seen in the `call_stats` field: 3366 calls have indeed been made to this entrypoint.

More details can be fetched about those calls:

```shell
$ curl https://api.tzstats.com/explorer/contract/KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn/calls
[
   {
      id: 100977803329,
      hash: "ooKQreNc41frgFB6JyeiC2Z7yug6nwdPhG9vxEyUtovzCSCn3wF",
      type: "transaction",
      block: "BLk9c3KZ7gxsfczy1n9vSBY3TjVBQAmUMRwpetM157kmRRLPmJi",
      time: "2021-07-03T03:09:30Z",
      height: 1540799,
      cycle: 376,
      counter: 11788641,
      op_n: 65,
      op_p: 21,
      status: "applied",
      is_success: true,
      is_contract: true,
      gas_limit: 68256,
      gas_used: 41186,
      storage_limit: 209,
      storage_paid: 142,
      fee: 0.010003,
      burned: 0.0355,
      parameters: {
         entrypoint: "swap",
         value: {
            creator: "tz1Y1j7FK1X9Rrv2VdPz5bXoU7SszF8W1RnK",
            objkt_amount: "1",
            objkt_id: "127648",
            royalties: "150",
            xtz_per_objkt: "15000000"
         }
      },
      code_hash: "c1c14f183e87db20",
      sender: "tz1Y1j7FK1X9Rrv2VdPz5bXoU7SszF8W1RnK",
      receiver: "KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn",
      confirmations: 2244817
   }
], ...
```

It details the inputs used for this entrypoint, the storage after the call, the differences in the big_map that have changed after the call, etc...

The current storage can be fetched, with this endpoint:

```shell
$ curl https://api.tzstats.com/explorer/contract/KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn/storage
{
   "value":{
      counter: "2089781",
      fee: "10",
      manager: "tz1UBZUkXpKGhYsP5KtzDNqLLchwF4uHrGjw",
      metadata: 6071,
      objkt: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
      swaps: 6072
   }
}
```

The storage returned by the API does match the one displayed in the web interface.
The `swaps` big_map holds a big_map id, instead of the values.
Indeed, a big_map is meant to hold unbounded data size. Thus, fetching the storage could quickly become expensive, if the big_map holds a lot of values.

The values of a big_map have to be retrieved from a separate endpoint, thanks to its id (`6072` in this case):

```shell
$ curl https://api.tzstats.com/explorer/bigmap/6072/values
[
   {
      key: "500004",
      hash: "exprvBRmMqhYfn6WbKRvc1ZpgapmqWqxb6GMuGRJFhU2yCcJBnoKAh",
      value: {
         creator: "tz1fFvDY3knjU1rYYf4vxccRLhG76rFzkbRh",
         issuer: "tz1fFvDY3knjU1rYYf4vxccRLhG76rFzkbRh",
         objkt_amount: "8000",
         objkt_id: "156939",
         royalties: "100",
         xtz_per_objkt: "3000000"
      }
   },
   {
      key: "500005",
      hash: "expru8BYHanpVTF2qmCQ2h1hXef94dcmyJMe3MMXQkvPi2A2ea233F",
      value: {
         creator: "tz1L5rVycD7yn8F6rxnN6u94FW9JZAbWU5ab",
         issuer: "tz1L5rVycD7yn8F6rxnN6u94FW9JZAbWU5ab",
         objkt_amount: "0",
         objkt_id: "158301",
         royalties: "230",
         xtz_per_objkt: "2000000"
      }
   }, ...
]
```

All of the pieces of information displayed in the web interface can be retrieved from the API.
All these API calls can of course be made from any libraries and thus can be automated in any program.

# Conclusion

tzstats.com is extremely useful to monitor what is happening on the mainnet and public testnets.
All the pieces of information regarding the cycles, the blocks, the transactions, the smart contracts, etc... can quickly be found, thanks to a user-friendly interface.

In addition, _TzStats_ provides a complete and free REST API (for non-commercial use), without any authentication or enforcement of rate limits (as long as it remains reasonable). See the introduction of the [Tzstats API](https://tzstats.com/docs/api#tezos-api).

Those calls can be performed by any library: the pieces of information retrieved about a public Tezos network can be used in another monitoring tool, or even in Dapps.

Indeed, API calls can be used within Dapps to retrieve those kinds of information. For instance, _Taquito_ (a TypeScript library to interact with a Tezos node) is not able to retrieve the keys of a big_map with a simple call. A call to the _TzStats_ API solves this issue.

Those tools are also available for private networks.
This will be detailed in the next chapter, where a private _TzStats_ is set up to monitor a private network.

## References

[1] https://tzstats.com/

[2] https://tzstats.com/KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn

[3] https://tzstats.com/docs/api#tezos-api

[4] https://tzstats.com/docs/api#explorer-endpoints
