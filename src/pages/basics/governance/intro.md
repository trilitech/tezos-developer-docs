---
title: Self Amendment
lastUpdated: 3rd July 2023
---
Tezos is a self-amending blockchain network that incorporates an on-chain mechanism for proposing, selecting, testing, and activating protocol upgrades without the need to hard fork.

## How Does It Work? 

The self-amendment process is split into 5 periods: Proposal Period, Exploration Vote Period, Cooldown Period, Promotion Vote Period, and Adoption Period. Each of these periods lasts five baking cycles (i.e. 40,960 blocks at 30-second intervals or roughly 14 days, 5 hours), comprising roughly 2 months and 10 days.

Should there be any failure to proceed for a period, the whole process reverts to the Proposal Period, effectively restarting the whole process.

#### 1. Proposal Period

The Tezos amendment process begins with the Proposal Period, during which bakers can submit proposals on-chain. The baker submits the proposal by submitting the hash of the source code.

In each Proposal Period, bakers can submit up to 20 proposals. A proposal submission also counts as a vote, which is equivalent to the number of rolls in its staking balance at the start of the period. Other bakers can then vote on the proposals during the Proposal Period up to 20 times.

At the end of the Proposal Period, the network counts the proposal votes and the most-upvoted proposal proceeds to the Exploration Vote Period. If no proposals have been submitted or if there is a tie between proposals, a new Proposal Period begins.

#### 2. Exploration Vote Period

In the Exploration Vote Period, bakers may vote on the top-ranked proposal from the previous Proposal Period. Bakers get to vote either "Yea", "Nay", or "Pass" on a specific proposal. "Pass" just means to "not vote" on a proposal. As in the Proposal Period, a baker's vote is based on the number of rolls in its staking balance.

At the end of the Exploration Vote Period, the network counts the votes. If voting participation (the total of “Yea,” “Nay,” and “Pass”) meets the target, and an 80% majority of non-abstaining bakers approve, the proposal proceeds to the Testing Period.

The voting participation target tries to match the exponential moving average of the past participation rate. If the voting participation fails to achieve the target or the 80% supermajority is not met, the amendment process restarts at the beginning of the Proposal Period

#### 3. Cooldown Period

Previously, during the voting process, a test chain would be spun up during the “testing period” which took place between the exploration and promotion voting periods. The intent was that this test chain be used to verify that the new proposal worked correctly, but in practice, the test chain has never been used in this manner and has caused significant operational problems to node operators.

The Florence upgrade eliminates the test chain activation, the testing period has been retained but is now named the “cooldown period”. Instead, testing the protocol continues by using test chains that operate outside of the mainnet voting process.

#### 4. Promotion Vote Period

At the end of the Testing Period, the Promotion Vote Period begins. In this period, the network decides whether to adopt the amendment based on off-chain discussions and its behavior during the Testing Period. As in the Exploration Vote Period, bakers submit their votes using the ballot operation, with their votes weighted proportionally to the number of rolls in their staking balance.

At the end of the Promotion Vote Period, the network counts the number of votes. If the participation rate reaches the minimum quorum and an 80% supermajority of non-abstaining bakers votes “Yea,” then the proposal is activated as the new mainnet. Otherwise, the process once more reverts to the Proposal Period. The minimum vote participation rate is set based on past participation rates.

See [the full details of the governance process](https://medium.com/tezos/amending-tezos-b77949d97e1e).

#### 5. Adoption Period

The Adoption Period provides a "cooldown" allowing developers and bakers some additional time to adapt their code and infrastructure to the upgrade based on the results of the Promotion Vote Period.

