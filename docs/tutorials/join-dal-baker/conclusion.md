---
title: "Conclusion"
authors: Tezos core developers
last_update:
  date: 23 January 2024
---

In this tutorial we have gone through all the steps needed to participate in the Weeklynet test network as a baker and DAL attester. We could further improve the setup by defining system services so that the daemons are automatically launched when the machine starts or when the network restarts on Wednesday. We could also plug a monitoring solution such as the Prometheus + Grafana combo; a Grafana dashboard template for DAL nodes is available in Grafazos. The interactions between our baker and the Weeklynet chain can be observed on the Explorus block explorer which is aware of the DAL and can in particular display which DAL slots are being used at each level.
