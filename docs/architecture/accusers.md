---
title: Accusers
authors: Tim McMackin
last_update:
  date: 12 April 2024
---

Accusers are programs that monitor new blocks, look for problems, and denounce bakers that introduce blocks with problems.
Accusers ensure that bakers play by the rules and do not abuse the reward mechanism of the Tezos protocol.

Accusers look for:

- Bakers that sign two blocks at the same level
- Bakers that inject more than one attestation for the same baking slot

When they see one of these problems, they emit a double-baking or double-attesting denunciation operation, which cause the offending baker to lose some of its stake.
Some of the slashed stake goes to the accuser.

Anyone can run an accuser, and they don't have to stake any tez like bakers must.
