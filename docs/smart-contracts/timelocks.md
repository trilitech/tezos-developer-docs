---
title: Timelocks
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 9 May 2024
---

Timelocks are a way to prevent exploits known as _front-running_, or more properly, _extractable value (EV) attacks_.
In general, these attacks happen when a client uses information about an upcoming transaction to make a profit at its expense.

:::note

Within decentralized finance, the term "front-running" can be misleading because it implies a relationship between clients and block producers where none may exist.

In traditional finance, front-running often relies on malicious brokers profiting from advance, nonpublic information about their clients' trades.
For example, a malicious stockbroker may buy a security for themselves before they execute a client's large buy order, knowing that the client's buy order will drive the price of the security up.

In decentralized finance, anyone can see incoming transactions, so front-running does not always mean that block producers are acting maliciously or sharing private information with clients.
EV attacks can come from bots that watch for incoming transactions and insert their own transactions before the incoming transaction runs.

However, block producers may still be able to profit from advance information about transactions.
For example, they may craft blocks that include a client's transaction and one of their own in an order that guarantees a gain to the block producer.
This type of attack is called a block producer extractable value (BPEV) attack.

:::

For more information about this kind of attack, see [An analysis of Ethereum front-running and its defense solutions](https://medium.com/degate/an-analysis-of-ethereum-front-running-and-its-defense-solutions-34ef81ba8456).

## Preventing EV attacks with timelocks

Tezos developers can prevent EV attacks with timelock encryption, which encrypts a message so it can be decrypted in two ways:

- The author of the encrypted message provides the unencrypted message and proof that it matches the encrypted message.
- Anyone else can decrypt the message with a certain number of operations.

With timelocks, an author can encrypt a message in such a way that anyone else can reveal the message, but only after a certain amount of time.
This duration is based on the time it takes for a single computer to decrypt the commitments because the decryption algorithm can’t be parallelized.
That means that computers can’t easily work together to decrypt it and that adversaries cannot break it even with significant computing power.

dApps that use timelocks to prevent EV attacks work in this general way:

1. A user sends a timelock-encrypted transaction or operation to the dApp.
1. The dApp adds the transaction to its queue before anyone can see what the transaction is.
To everyone else, including bakers, bots, and the dApp itself, the transaction is encrypted and unreadable.
No one else can decrypt the transaction quickly, so they can’t take advantage of it in an EV attack.
1. In the background, the dApp begins decrypting the transaction.
1. One of two things happen:

   - The user submits the decrypted transaction and the proof that the decryption is accurate to the dApp before the dApp decrypts the transaction.
   - The dApp decrypts the transaction before the user submits the decrypted transaction, such as if prices changed and the user doesn't want to execute the transaction anymore.
   In this case, the dApp takes a penalty charge from the transaction for making it waste processing power on decrypting it.
1. The dApp fulfills the decrypted transactions in its queue in the order that they were submitted.

In practice, DeFi users nearly always submit their decrypted transactions before anyone else decrypts them.
They don’t want to pay the penalty and they know how long it will take the dApp to break the transaction’s encryption.

## Flow of timelocks in a typical commit-and-reveal scheme

Timelocks are often used to ensure that a group of users each submit information while keeping their submissions secret for a certain amount of time.
Sometimes this process is called a _commit and reveal scheme_ because all users commit to their choice without seeing the others' choices.

This is the typical usage pattern of a timelock:

1. In the first time period, a contract collects timelock encrypted values from users along with some valuable deposit, such as tez.
2. In the second time period, after the values are collected, users submit a decryption of the value they submitted with a proof that the decryption is correct.
This prevents users from changing their values.
3. In the third time period, if any value isn't decrypted, anyone can claim some of the deposit by submitting a decryption of the value.
This prevents users from profiting by not revealing their decrypted values or blocking the process.
This period needs to be long enough so that people have enough time to perform the timelock decryption.
4. Finally, the contract runs some logic based on the decrypted data.
For example, it might distribute funds to a winner or run an operation that the majority of the users secretly voted for.

Contracts can assess different penalties for not revealing, depending on whether the user merely failed to submit a decryption for their value or if they also intentionally encrypted invalid data.
They can also distribute different rewards for submitting a correct decryption.

Because it's possible to reveal the data eventually, all participants have an incentive to reveal because they will eventually lose their deposit when someone else cracks and reveals the data.
In this way, timelocks work as a deterrent; in practice, participants nearly always reveal rather than forcing someone else to crack the encryption.
However, the second period needs to be long enough so that bakers cannot easily censor submission of the decryption in a bid to later claim the reward.

Also, contracts should burn part of a deposit when another user submits a decryption of someone else's value.
Burning a part of the deposit limits attacks where a user gets back their whole deposit by providing the decryption, but in a way that delays everyone else.

## Example

Timelocks make it possible to prove that a certain decision was taken before some information was revealed.
This information may be the decision of other participants or some external independent information.

As an example, imagine that two players want to play the game [rock, paper, scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors) via a smart contract.
If one player can see another player's choice before they choose, they will win every time.
Because it is impossible to force and verify that the two players reveal their choice simultaneously, they can use a commit-and-reveal scheme.

During the first step, they pick their choice and put it in a pair with some random data.
Then they compute a hash of the result to create a timelock and send this value to the contract as a commitment.

After both players have sent their commitment, they can reveal by sending the actual data to the contract including the random data.
The contract can verify that the hash of this data matches the previous commitment.
When the two players have revealed their data, the smart contract determines the outcome of the game and distributes rewards accordingly.

## References

- [Timelock puzzles and timed release Crypto](http://www.hashcash.org/papers/timelock.pdf>)
- [Not protecting against bots (BPEV attacks)](https://opentezos.com/smart-contracts/avoiding-flaws/#6-not-protecting-against-bots-bpev-attacks)
- [How Tezos timelocks help protect DeFi transactions](https://spotlight.tezos.com/timelocks-defi/)
