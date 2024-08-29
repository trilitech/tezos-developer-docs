---
title: Cryptographic data types
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 9 April 2024
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

## Time-locks

A `timelock` is a cryptographic primitive that can be used as part of a commit-and-reveal scheme, to provide a guarantee that the information associated to the commit is eventually revealed.

For information about using time-locks, see [Timelocks](/smart-contracts/timelocks).

## Implementation details

- Michelson: [Time-lock](https://tezos.gitlab.io/active/timelock.html)
- Archetype: [Timelock](https://archetype-lang.org/docs/language-basics/crypto#timelock)
- LIGO: [Timelock](https://ligolang.org/docs/reference/current-reference/?lang=jsligo#timelock)
