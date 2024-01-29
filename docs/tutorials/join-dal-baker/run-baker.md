---
title: "Step 5: Run an Octez baking daemon on Weeklynet"
authors: Tezos core developers
last_update:
  date: 23 January 2024
---

The baking daemon is launched almost as usual, the only difference is that we use the `--dal-node http://127.0.0.1:10732` option to tell it to connect to the DAL node that we just launched in the previous step.


```bash
octez-baker-alpha run with local node "$HOME/.tezos-node" my_baker --liquidity-baking-toggle-vote on --adaptive-issuance-vote on --dal-node http://127.0.0.1:10732 >> "$HOME/octez-baker.log" 2>&1
```

We can check that the DAL is now subscribed to the relevant topics by retrying the following RPC call, which should now return all the topics of the form `{"slot_index":<index>,"pkh":"<ADDRESS OF OUR BAKER>"}` where `index` varies between `0` included and the number of slot indexes (`32` on Weeklynet) excluded:

```bash
curl http://localhost:10732/p2p/gossipsub/topics
```

We can also look at the baker logs to see if it manages to inject the expected operations. At each level, the baker is expected to:
- Receive a block proposal (log message: "received new proposal ... at level ..., round ...")
- Inject a preattestation for it (log message: "injected preattestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
- Receive a block (log message: "received new head ... at level ..., round ...")
- Inject an attestation for it (log message: "injected attestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
- Inject a DAL attestation indicating which of the shards assigned to the baker have been seen on the DAL network (log message: "injected DAL attestation ... for level ..., round ..., with bitset ... for my_baker (&lt;address&gt;) to attest slots published at level ..."); if no shard was seen (either because they did not reach the DAL node for some reason or simply because nothing was published on the DAL at the targeted level), the operation is skipped (log message: "Skipping the injection of the DAL attestation for attestation level ..., round ..., as currently no slot published at level ... is attestable.")

Optionally, we can also launch an accuser which will monitor the behaviour of the other Weeklynet bakers and denounce them to the Tezos protocol if they are caught double-signing any block or consensus operation.

```bash
octez-accuser-alpha run >> "$HOME/octez-accuser.log" 2>&1
```

Now you have a complete DAL baking setup.
For a summary, see [Conclusion](./conclusion).
