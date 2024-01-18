# Running the DAL as a Weeklynet baker, in 5 steps

Tezos' [Data-Availability Layer](https://tezos.gitlab.io/shell/dal.html) (DAL for short), is a key component for the scalability of Tezos. In a nutshell, the DAL is about increasing the data bandwidth available for Tezos smart rollups thanks to a new parallel P2P network on which rollup could connect to fetch inputs but without compromising their security and in particular the possibility for any participant to detect fraud attempts from rollup operators and refute them in the Tezos protocol.

In order for the DAL to be as secured as the Tezos Layer 1 itself, bakers would play a very important role in it. Currently, bakers on the L1 network are not only responsible for producing blocks but also for attesting that blocks are published on the L1 network; they are rewarded for this through protocol incentives and they also monitor the behaviour of other bakers to denounce cheating attempts. Similarly, the role of bakers for the DAL would be to attest the publication of data on the DAL P2P network, they would be rewarded for this through protocol incentives, and denounce cheating attempts from other bakers.

Since a new P2P network with hundreds of participants may take some time to setup, we will propose a smooth transition toward the DAL by not including any protocol incentives for DAL attestations in the first mainnet version of the DAL, this will let plenty of time for bakers to join the DAL network without risking any reward loss. This incentive-free version of the DAL is already available on the weeklynet test network and we consider it to be stable enough to be put in the hands of bakers willing to test it and report any issue they may find. Feedback from bakers is very important for us now because modifying DAL may become much harder once it is part of a protocol amendment proposal.

This article is a tutorial for bakers willing to test the DAL on the weeklynet network so that they can play with the feature and prepare well in advance for a possible future activation of the DAL on mainnet.

/!\ Warning: This tutorial uses a very simple setup running all required daemons on the same machine. In a production environment, we advise against running a DAL attester node under the same IP address than a baker's node because the DAL node may leak the IP address and ease DOS attacks on the baker. See also [the DAL documentation page on baking](https://tezos.gitlab.io/shell/dal_bakers.html).

/!\ Warning: This article was written in January 2024 to help bakers experiment with the DAL. If you are reading this article in the future, the UX of the DAL components will probably have changed with the feedback we got, in particular from the testers following this tutorial.

- [Step 1: get a Weeklynet-compatible Octez](./running-the-dal-as-a-weeklynet-baker-in-5-steps/get-octez)
- [Step 2: run an Octez node on Weeklynet](./running-the-dal-as-a-weeklynet-baker-in-5-steps/run-node)
- [Step 3: prepare an account for baking on Weeklynet](./running-the-dal-as-a-weeklynet-baker-in-5-steps/prepare-account)
- [Step 4: run an Octez DAL node on Weeklynet](./running-the-dal-as-a-weeklynet-baker-in-5-steps/run-dal-node)
- [Step 5: run an Octez baking deamon on Weeklynet](./running-the-dal-as-a-weeklynet-baker-in-5-steps/run-baker)
- [Conclusion](./running-the-dal-as-a-weeklynet-baker-in-5-steps/conclusion)
