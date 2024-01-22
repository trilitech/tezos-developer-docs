# Step 5: run an Octez baking daemon on Weeklynet

The baking daemon is launched almost as usual, the only difference is that we use the `--dal-node http://127.0.0.1` option to tell it to connect to the DAL node that we just launched in the previous step.

```
octez-baker-alpha run with local node "$HOME/.tezos-node" my_baker --liquidity-baking-toggle-vote on --adaptive-issuance-vote on --dal-node http://127.0.0.1 >> "$HOME/octez-baker.log 2>&1"
```

We can check that the DAL is now subscribed to the relevant topics by retrying the following RPC, which should now return all the topics of the form `{"slot_index":<index>,"pkh":"<ADDRESS OF OUR BAKER>"}` where `index` varies between `0` included and the number of slot indexes (`32` on Weeklynet) exluded:

```
curl http://localhost:10732/p2p/gossipsub/topics
```

We can also look at the baker logs to see if it manages to inject the expected operations. At each level, the baker is expected to:
- receive a block proposal (log message: "received new proposal ... at level ..., round ...")
- inject a preattestation for it (log message: "injected preattestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
- receive a block (log message: "received new head ... at level ..., round ...")
- inject an attestation for it (log message: "injected attestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
- inject a DAL attestation indicating which of the shards assigned to the baker have been seen on the DAL network (log message: "injected DAL attestation ... for level ..., round ..., with bitset ... for my_baker (&lt;address&gt;) to attest slots published at level ..."); if no shard was seen (either because they did not reach the DAL node for some reason or simply because nothing was published on the DAL at the targetted level), the operation is skipped (log message: "Skipping the injection of the DAL attestation for attestation level ..., round ..., as currently no slot published at level ... is attestable.")

Optionally, we can also launch an accuser which will monitor the behaviour of the other Weeklynet bakers and denounce them to the Tezos protocol if they are caught double-signing any block or consensus operation.

```
octez-accuser-alpha run >> "$HOME/octez-accuser.log 2>&1"
```
