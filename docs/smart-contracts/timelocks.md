---
title: Time-locks
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 9 April 2024
---

Time-locks are a way to prevent exploits known as _front-running_, or more properly, Block Producer Extractable Value (BPEV) attacks.
In general, these attacks happen when a client uses information about upcoming transactions to make a profit.

:::note

Within decentralized finance, the term "front-running" can be misleading because it implies a relationship between clients and block producers where none may exist.

In traditional finance, front-running often relies on malicious brokers profiting from advance, nonpublic information about their clients' trades.
For example, a malicious stockbroker may tell friends or family to buy a security for themselves before they execute a client's large buy order, knowing that the client's buy order will drive the price of the security up.

In decentralized finance, anyone can see incoming transactions, so front-running does not always mean that block producers are acting maliciously or sharing private information with clients.
More often, bots see incoming transactions and insert their own transactions before the incoming transaction runs.

However, block producers may still be able to profit from advance information about transactions.
For example, they may craft blocks that include a client's transaction and one of their own in an order that guarantees a gain to the block producer.

:::

For more information about this kind of attack, see [An analysis of Ethereum front-running and its defense solutions](https://medium.com/degate/an-analysis-of-ethereum-front-running-and-its-defense-solutions-34ef81ba8456).

## Preventing BPEV attacks with time-locks

BPEV attacks can be prevented with the use of time-lock encryption, which encrypts a message so it can be decrypted in two ways:

- The author of the encrypted message provides the unencrypted message and proof that it matches the encrypted message.
- Anyone else can decrypt the message with a certain number of operations.

With time-locks, an author can encrypt a message in such a way that anyone else can reveal the message, but only after a certain amount of time.
The amount of time depends on the number of sequential operations required to decrypt the message and the hardware used to run the operations.
Therefore, authors can calculate the number of operations needed to keep a typical piece of hardware from breaking the encryption in a given amount of time.
The algorithm used to decrypt the message can't be parallelized, which means that there is a limit to how much computing power can be applied to it.

## Flow of time-locks in a typical commit-and-reveal scheme

Time-locks are often used to ensure that a group of users each submit information while keeping their submissions secret for a certain amount of time.
Sometimes this process is called a _commit and reveal scheme_ because all users must commit to their choice before anyone's choices are revealed.

This is the typical usage pattern of a time-lock:

1. In the first time period, a contract collects time-lock encrypted values from users along with some valuable deposit, such as tez.
2. In the second time period, after the values are collected, users submit a decryption of the value they submitted with a proof that the decryption is correct.
This prevents users from changing their values.
3. In the third time period, if any value isn't decrypted, anyone can claim some of the deposit by submitting a decryption of the value.
This prevents users from profiting by not revealing their decrypted values or blocking the process.
This period needs to be long enough so that people have enough time to perform the time-lock decryption.
4. Finally, the contract computes some function of the decrypted data.
For example, it might distribute funds to a winner or run an operation that the majority of the users secretly voted for.

Contracts can assess different penalties for not revealing, depending on whether the user merely failed to submit a decryption for their value or if they also intentionally encrypted invalid data.
They can also distribute different rewards for submitting a correct decryption.

Because it's possible to reveal the data eventually, all participants have an incentive to reveal because they will eventually lose their deposit when someone else cracks and reveals the data.
In this way, time locks work as a deterrent; in practice, participants nearly always reveal rather than forcing someone else to crack the encryption.
However, the second period needs to be long enough so that bakers cannot easily censor submission of the decryption in a bid to later claim the reward.

Also, contracts should burn part of a deposit when another user submits a decryption of someone else's value.
Burning a part of the deposit limits attacks where a user gets back their whole deposit by providing the decryption, but in a way that delays everyone else.

## Example

Time-locks make it possible to prove that a certain decision was taken before some information was revealed.
This information may be the decision of other participants or some external independent information.

As an example, imagine that two players want to play the game [rock, paper, scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors) via a smart contract.
If one player can see another player's choice before they choose, they will win every time.
Because it is impossible to force and verify that the two players reveal their choice simultaneously, they can use a commit-and-reveal scheme.

During the first step, they pick their choice and put it in a pair with some random data.
Then they compute a hash of the result to create a time-lock and send this value to the contract as a commitment.

After both players have sent their commitment, they can reveal by sending the actual data to the contract including the random data.
The contract can verify that the hash of this data matches the previous commitment.
When the two players have revealed their data, the smart contract determines the outcome of the game and distributes rewards accordingly.

## References

- [Time-lock puzzles and timed release Crypto](http://www.hashcash.org/papers/time-lock.pdf>)
- [Not protecting against bots (BPEV attacks)](https://opentezos.com/smart-contracts/avoiding-flaws/#6-not-protecting-against-bots-bpev-attacks)
