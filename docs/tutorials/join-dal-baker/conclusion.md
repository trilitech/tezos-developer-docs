---
title: "Conclusion"
authors: Tezos core developers
last_update:
  date: 13 August 2024
---

In this tutorial you have gone through all the steps needed to participate as a baker and DAL node.
The steps for participating on any other network, including Tezos Mainnet, are similar, but other networks have different parameters.
For example, the attestation delay on Mainnet is 2 weeks.

You could further improve the setup by defining system services so that the daemons are automatically launched when the machine starts.
You could also plug a monitoring solution such as the Prometheus + Grafana combo; a Grafana dashboard template for DAL nodes is available in Grafazos.
The interactions between your baker and the chain can be observed on the Explorus block explorer which is aware of the DAL and can in particular display which DAL slots are being used at each level.

As a next step, you can create a Smart Rollup that uses DAL data in the tutorial [Implement a file archive with the DAL and a Smart Rollup](/tutorials/build-files-archive-with-dal).
