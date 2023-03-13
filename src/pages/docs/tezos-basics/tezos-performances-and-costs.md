---
id: tezos-performances-and-costs
title: Tezos performances and costs
authors: Nomadic Labs
---

:::info
This article and all its data have been taken during the Kathmandu protocol (September 2022) and therefore may be outdated when the next protocol will be launched.
:::
:::info
In this article, all performance statistics are given theoretically. All the data are estimates and may change depending on the used contract. If you wish to have access to a more empirical approach, you can read this [blog post](https://research-development.nomadic-labs.com/tps-evaluation.html).
:::

## Estimate Tezos performances (Kathmandu)

At the time of writing:

* the gas limit of a block is **5,200,000 gas units**,

* the gas limit of an operation is **1,040,000 gas units**,

* the block time is **30 seconds**,

* the maximum bytes size of an operation is **~33kB**.

Gas is accounted by an arbitrary unit so that one unit of gas represents one nanosecond of computation performed by the machines used during the benchmark.

### Tez transfer

A single transfer of tez is using **1001 gas units**. On the table below, you can also notice that batching transactions into a single operation doesn’t save up gas compared to perform them separately. The limit size of an operation (33 kB) is reached with a batch of 573 transfers.

| Batch size   | Gas consummed  |
| :----------- | :--------|
| 1   | 1001    |
| 10  | 10010   |  
| 100 | 100100  |
| 573 | 573573  |

For standard tez transfers, we can process the performance of the Tezos blockchain with the following formula:

$$
\frac{\text{max gas per block}}{\text{tx gas consumption * time per block}}=\text{tx/second}
$$

With the corresponding values, we then have a result of approximately **173 transfers per second**:

$$
\frac{5200000}{1001 * 30}\approx\bm{173tx/second}
$$

:::info
The following estimation cost have been made with a tez price of ~1.5€, **tez transaction cost estimation: >0.001€**.
This cost calculation is indicative only. It’s not absolute nor guaranteed, it’s a cost estimate based on figures which are valid at one particular moment.
:::

### FA1.2 transfer

A single transfer of a FA1.2 token is using **2612 gas units**.

With the same logic than for the xtz transfer, we got a result of theoretically **66 FA1.2 transfers per second**:

$$
\frac{5200000}{2612 * 30}\approx\bm{66tx/second}
$$

:::info
The following estimation cost have been made with a tez price of ~1.5€, **FA1.2 transaction cost estimation: ~0.001€**.
This cost calculation is indicative only. It’s not absolute nor guaranteed, it’s a cost estimate based on figures which are valid at one particular moment.
:::

### FA2 transfer

One interesting feature of the FA2 standard is the **transfer list** parameter that allows to directly pass to the contract a list of transfers to perform. Unlike batching, this will reduce the gas consumption.

Here is a summary table of the gas used depending on the size of the transfer list:

|  Transfer list size  |  Gas consummed      |
| :--------------- |:--------|
| 1   |  261
| 10  |  8975   |  
| 100 |  72613  |
| 300 |  214038 |  
| 650 |  461529 |

650 FA2 transfers can fit in a list before reaching the maximum size on an operation while consuming 461,529 gas units which under the gas limit for an operation. In the end, a block can include 11 operations with a list of 650 transfers plus one operation with a list of 171 transfers resulting in **244 FA2 transfers per second**.

:::info
The following estimation cost have been made with a tez price of ~1.5€, **FA2 transaction cost estimation: ~0.001€**.
This cost calculation is indicative only. It’s not absolute nor guaranteed, it’s a cost estimate based on figures which are valid at one particular moment.
:::
