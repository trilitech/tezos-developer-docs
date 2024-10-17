---
title: The Data Availability Layer
authors: "Tim McMackin"
last_update:
  date: 17 October 2024
---

The Data Availability Layer (DAL) is a companion peer-to-peer network for the Tezos blockchain, designed to provide additional data bandwidth to Smart Rollups.
It allows users to share large amounts of data in a way that is decentralized and permissionless, because anyone can join the network and post and read data on it.

For a tutorial on how to use the DAL, see [Implement a file archive with the DAL and a Smart Rollup](/tutorials/build-files-archive-with-dal).

## Running DAL nodes

The DAL depends on individual people running nodes, just like Tezos layer 1.

- If you are already a Tezos node operator, you can add a DAL node to your setup with the instructions in [Running a DAL attester node](https://tezos.gitlab.io/shell/dal_run.html).
- For step-by-step instructions on running a DAL node, see [Join the DAL as a baker in 5 steps](/tutorials/join-dal-baker).

## How the DAL works

The DAL relies on a network of DAL nodes that distribute data via a peer-to-peer network.
Layer 1 bakers verify that the data is available.
After the bakers attest that the data is available, the DAL nodes provide the data to Smart Rollups.
Smart Rollups that need the data must use it or store it promptly, because it is available only temporarily on the DAL.

The DAL works like this:

1. Users post data to a DAL node.
1. The DAL node returns a certificate, which includes two parts:

   - The _commitment_ is like a hash of the data but has the additional ability to identify individual shards of the data and reconstruct the original data from a certain percentage of the shards.
   The number of shards needed depends on how the data is spread across shards, which is controlled by a parameter called the _redundancy factor_.
   - The _proof_ certifies the length of the data to prevent malicious users from overloading the layer with data.

1. Users post the certificate to Tezos layer 1 via the Octez client.
1. When the certificate is confirmed in a block, the DAL splits the data into shards and shares it through the peer-to-peer network.
1. Layer 1 assigns the shards to bakers.
1. Bakers verify that they are able to download the shards that they are assigned to.
1. Bakers attest that the data is available in their usual block attestations to layer 1.

   Each Tezos network has a delay of a certain number of blocks known as the _attestation lag_.
   This number of blocks determines when bakers attest that the data is available, so that the data is made available to Smart Rollups.
   For example, if a certificate is included in level 100 and the attestation lag is 4, bakers must attest that the data is available in level 104, along with their usual attestations that build on level 103.

   If enough shards are attested in that level, the data becomes available to Smart Rollups at the end of layer 104.
   If not enough shards are attested in that level, the certificate is considered bogus and the related data is dropped.

1. The Smart Rollup node monitors the blocks and when it sees attested DAL data, it connects to a DAL node to request the data.
Smart Rollups must store the data if they need it because it is available on the DAL for only a short time.

The overall workflow is summarized in the following figure:

![Overall diagram of the workflow of the Data Availability Layer](/img/architecture/dal-workflow.png)
<!-- https://lucid.app/lucidchart/cc422278-7319-4a2f-858a-a7b72e1ea3a6/edit -->

## Data structure

Internally, the Data Availability Layer stores information about the available data in layer 1 blocks.
Each block has several byte-vectors called _slots_, each with a maximum size.
DAL users can add information about the available data as _pages_ in these slots, as shown in this figure:

![Two example blocks with different DAL slots in use in each](/img/architecture/dal-slots-in-blocks.png)
<!-- https://lucid.app/lucidchart/46fa8412-8443-4491-82f6-305aafaf85f2/edit -->

The data in a slot is broken into pages to ensure that each piece of data can fit in a single Tezos operation.
This data must fit in a single operation to allow the Smart Rollup refutation game to work, in which every execution step of the Smart Rollup must be provable to layer 1.

When clients publish data, they must specify which slot to add it to.
Note that because the DAL is permissionless, clients may try to add data to the same slot in the same block.
In this case, the first operation in the block takes precedence, which leaves the baker that creates the block in control of which data makes it into the block.
Other operations that try to add data to the same slot fail.

The number and size of these slots can change.
Different networks can have different DAL parameters.
Future changes to the protocol may allow the DAL to resize slots dynamically based on usage.

## Getting the DAL parameters

Clients can get information about the current DAL parameters from the RPC endpoint `GET /chains/main/blocks/head/context/constants` or the Smart Rollup kernel SDK function `reveal_dal_parameters`.
These parameters include:

- `number_of_slots`: The maximum number of slots in each block
- `slot_size`: The size of each slot in bytes
- `page_size`: The size of each page in bytes
- `attestation_lag`: The number of blocks after a certificate is published when bakers attest that the data is available; if enough attestations are available in this block, the data becomes available to Smart Rollups
- `redundancy_factor`: How much redundancy is used to split the data into shards; for example, a redundancy factor of 2 means that half of all shards are enough to reconstruct the original data and a redundancy factor of 4 means that 25% of all shards are required

## Sending data to the DAL

Sending data to the DAL is a two-step process:

1. Send the data to a DAL node by passing it to its `POST /slot` endpoint, as in this example:

   ```bash
   curl -X POST http://dal-node.example.com:10732/slot --data '"Hello, world!"' -H 'Content-Type: application/json'
   ```

   The DAL node returns the commitment and proof of the data, as in this abbreviated example:

   ```json
   {
     "commitment": "sh1u3tr3YKPDY",
     "commitment_proof": "8229c63b8e858d9a9"
   }
   ```

1. Send an operation to include the commitment and proof in a block by running this Octez client command, where `$ENDPOINT` is an RPC endpoint served by a layer 1 node and `$MY_ACCOUNT` is an account alias or address:

   ```bash
   commitment="sh1u3tr3YKPDY"
   proof="8229c63b8e858d9a9"
   octez-client --endpoint ${ENDPOINT} \
     publish dal commitment "${commitment}" from ${MY_ACCOUNT} for slot 10 \
     with proof "${proof}"
   ```

For an example of sending larger amounts of data, see [Implement a file archive with the DAL and a Smart Rollup](/tutorials/build-files-archive-with-dal).

## Getting data from the DAL

Smart Rollups can use data from the DAL **only after it has been attested by the bakers**.
Due to the attestation lag, they cannot access DAL data published in the current level, because not enough blocks have elapsed to allow bakers to attest the data.

The more recent level in the past that Smart Rollups can access data from is the current level minus the attestation lag.
They can access the data in that level with the Smart Rollup kernel SDK function `reveal_dal_page`, which accepts the target level, slot, and page to receive, as in this example:

```rust
let param = host.reveal_dal_parameters();

let sol = host.read_input()?.unwrap();

let target_level = sol.level as usize - param.attestation_lag as usize;

let mut buffer = vec![0u8; param.page_size as usize];

let bytes_read = host.reveal_dal_page(target_level as i32, slot_index, 0, &mut buffer)?;

if 0 < bytes_read {
    debug_msg!(
        host,
        "Attested slot at index {} for level {}: {:?}\n",
        slot_index,
        target_level,
        &buffer.as_slice()[0..10]
    );
} else {
    debug_msg!(
        host,
        "No attested slot at index {} for level {}\n",
        slot_index,
        target_level
    );
}
```

## Reference

For more information about the DAL, see [DAL overview](https://tezos.gitlab.io/shell/dal_overview.html) in the Octez documentation.
