---
title: Cryptographic data types
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
lastUpdated: 5th October 2023
---

Tezos provides hash functions for cryptographic purposes.

By default, use `BLAKE2B`, which computes a cryptographic hash of the value contents using the Blake2b-256 cryptographic hash function.

These other hash functions are available:

- `KECCAK`: Compute a cryptographic hash of the value contents using the Keccak-256 cryptographic hash function.
- `SHA256`: Compute a cryptographic hash of the value contents using the Sha256 cryptographic hash function.
- `SHA512`: Compute a cryptographic hash of the value contents using the Sha512 cryptographic hash function.
- `SHA3`: Compute a cryptographic hash of the value contents using the SHA3-256 cryptographic hash function.

## Checking signatures

Tezos lets you check that a given piece of data, a sequence of bytes in a `bytes` data type, has been signed by the holder of the private key corresponding to a given public key.

The primitive `CHECK_SIGNATURE` takes as parameters the sequence of bytes, the `signature` and the `public key`, and returns a Boolean that indicates if the `signature` is indeed a `signature` of that sequence of bytes, by the holder of ths key.

## BLS12-381 primitives

BLS12-381 is the name of an elliptic curve, a cryptographic primitive that can be used for digital `signatures` and zero-knowledge proofs.

It has the particularity of being pairing-friendly, which makes it possible to create short digital `signatures` that can be efficiently aggregated.
It can also be used for identity-based cryptography, single-round multi-party key exchanges, or and efficient polynomial commitment schemes such as KZG commitments.

## Implementation details

- Michelson: [Cryptographic primitives](https://tezos.gitlab.io/active/michelson.html#cryptographic-primitives), [BLS12-381 primitives](https://tezos.gitlab.io/active/michelson.html#bls12-381-primitives)
- LIGO: [Crypto](https://ligolang.org/docs/reference/crypto-reference)
- Archetype: [Blake2b and related](https://archetype-lang.org/docs/reference/expressions/builtins#blake2b%28b%20:%20bytes%29), [Elliptic curves](https://archetype-lang.org/docs/language-basics/crypto#elliptic-curves)
- SmartPy: [Cryptography](https://smartpy.io/manual/scenarios/cryptography#cryptography)
- Taquito: [Signing data](https://tezostaquito.io/docs/signing/)

## Timelocks

A `timelock` is a cryptographic primitive that can be used as part of a **commit & reveal** scheme, to provide a guarantee that the information associated to the commit is eventually revealed.

### Classical commit & reveal scheme

Commit & reveal is a scheme that consists of two steps, involving one or more participants:

- Before a set deadline, each participant makes a decision and publishes a commitment, which is a proof that they have taken a decision that they won't be able to change.
The proof often takes the form of a hash of the data that corresponding to the decision.
- After the deadline, each participant reveals the data corresponding to their commitment.
Other participants can check that the hash of this data indeed corresponds to their previous commitment.

This scheme makes it possible to prove that a certain decision was taken before some information was revealed.
This information may be the decision of other participants, or some external independent information.

As an example, imagine that two players want to play the game [rock, paper, scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors) via a smart contract.
As it is impossible to force and verify that the two players reveal their choice between rock, paper or scissors simultaneously, they can use a commit & reveal scheme to do so.

During the first step, they pick their choice, identified by a number from 1 to 3, put it in a pair with some random data, compute a hash of the result.
This hash is the commitment that they can then send to the contract.

After both players have sent their commitment, they can reveal by sending the actual data to the contract including the random data.
The contract can verify that the hash of this data matches the previous commitment.
When the two players have revealed their data, the smart contract determines the outcome of the game and distributes rewards accordingly.

### Not revealing

One issue with the classical commit & reveal scheme is that after the first step is closed and some information is revealed, one participant may find it advantageous to not reveal at all.
Why reveal if it will only make you lose? For some use cases, this can ruin the whole process.

One way to address this problem is by setting a financial incentive, such as tokens that people deposit along with their commitments.
After they reveal, they get the tokens back, which encourages them to reveal.

### Forcing the reveal with a time lock

In some cases, a financial incentive is not enough by itself.
For example, the benefit of not revealing may outweigh the benefit of revealing, or multiple participants may collaborate and decide not to reveal.

In this case, you can use a time lock to produce a commitment and force the reveal.

In this case, instead of using a hash, the data is encrypted using an encryption method that can be cracked with a known algorithm.
The amount of time that it takes to crack the encryption is bounded, which provides a time limit.

The algorithm used to crack it can't be parallelized, which means there is a limit to how much computing power can be applied to it.
You can estimate the time that it takes for an ordinary computer to crack it and for the fastest possible dedicated hardware to crack it.
Then you can set the time limit by setting the number of iterations in the data encryption.

For example, assume that you encrypt data in a time lock that you know takes between 10 minutes and 10 hours to decrypt, depending on the hardware.
You can use a commit phase that takes less than 10 minutes, which is not enough time to crack the encryption, so no one can decrypt anyone's commitment.
Then you can use a reveal phase that gives the participants a few minutes to reveal their data.
If a participant doesn't reveal, you can provide a financial reward (funded by the non-revealed participants' deposits) to anyone else to crack the encryption and reveal the data.

Because it's possible to reveal the data eventually, all participants have an incentive to reveal because they will eventually lose their deposit when someone else cracks and reveals the data.
In this way, time locks work as a deterrent; in practice, participants nearly always reveal rather than forcing someone else to crack the encryption.

Some use cases involve collectively generating a random value or preventing [BPEV attacks](https://opentezos.com/smart-contracts/avoiding-flaws/#6-not-protecting-against-bots-bpev-attacks).

## Implementation details

- Michelson: [Operations on timelock](https://tezos.gitlab.io/active/michelson.html#operations-on-timelock)
- Archetype: [Timelock](https://archetype-lang.org/docs/language-basics/crypto#timelock)
