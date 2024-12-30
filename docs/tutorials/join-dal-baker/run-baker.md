---
title: "Step 4: Run an Octez baking daemon"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 19 December 2024
---

Now that you have a layer 1 node and a DAL node, you can run a baking daemon that can create blocks and attests to DAL data.
If you already have a baking daemon, you can restart it to connect to the DAL node.

1. Optional: Set up a remote signer to secure the keys that the baker uses as described in [Signer](https://tezos.gitlab.io/user/key-management.html#signer) in the Octez documentation.

1. To run a baking daemon that connects to the DAL, start it as usual and pass the URL to your DAL node to it with the `--dal-node` argument:

   ```bash
   octez-baker-PsParisC run with local node "$HOME/.tezos-node" my_baker --liquidity-baking-toggle-vote pass --adaptive-issuance-vote on --dal-node http://127.0.0.1:10732
   ```

   Note that the command for the baker depends on the protocol version.
   This example uses the ParisC protocol, so the command starts with `octez-baker-PsParisC`.
   Check the current version of the protocol to see what command to run, and change this command when you upgrade to newer versions of the protocol.

   You may append `>>"$HOME/octez-baker.log" 2>&1` to redirect its output in a log file.

1. Ensure that the baker runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Run a persistent baking node](https://opentezos.com/node-baking/baking/persistent-baker/) on opentezos.com.

   For example, if your operating system uses the `systemd` software suite, your service file might look like this example:

   ```systemd
   [Unit]
   Description=Octez baker
   Wants=network-online.target
   After=network-online.target
   Requires=octez-node.service

   [Install]
   WantedBy=multi-user.target

   [Service]
   Type=simple
   User=tezos
   ExecStart=octez-baker-PsParisC run with local node "$HOME/.tezos-node" my_baker --liquidity-baking-toggle-vote pass --adaptive-issuance-vote on --dal-node http://127.0.0.1:10732
   WorkingDirectory=/opt/octez-baker
   Restart=on-failure
   RestartSec=5
   StandardOutput=append:/opt/octez-baker.log
   StandardError=append:/opt/octez-baker.log
   SyslogIdentifier=%n
   ```

1. In the same terminal window, run this command:

   ```bash
   curl http://localhost:10732/p2p/gossipsub/topics
   ```

   You may need to install the `curl` program.

   DAL nodes share shards and information about them over a peer-to-peer pub/sub network built on the Gossipsub P2P protocol.
   As layer 1 assigns shards to the bakers, the Gossipsub network manages topics that DAL nodes can subscribe to.
   For example, if a user submits data to slot 1, the network has a list of topics: a topic to identify the slot 1 shards assigned to baker A, a topic to identify the slot 1 shards assigned to baker B, and so on for all the bakers that are assigned shards from slot 1.

   Then, the baker daemon automatically asks the DAL node to subscribe to the topics that provide the shards that it is assigned to.

   In the results of this command, each topic contains a shard and the address of the baker that is assigned to it.
   The DAL node and baker are listening to these topics and attesting that the data that they refer to is available.

   This command returns all of the topics that the baker is subscribed to in the format `{"slot_index":<index>,"pkh":"<ADDRESS OF BAKER>"}` where `index` varies between `0` included and the number of slot indexes excluded.

   You can also look at the baker logs to see if it injects the expected operations. At each level, the baker is expected to do a subset of these operations:

      - Receive a block proposal (log message: "received new proposal ... at level ..., round ...")
      - Inject a preattestation for it (log message: "injected preattestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
      - Receive a block (log message: "received new head ... at level ..., round ...")
      - Inject a consensus attestation for it (log message: "injected attestation ... for my_baker (&lt;address&gt;) for level ..., round ...")
      - Attach a DAL attestation to it, indicating which of the shards assigned to the baker have been seen on the DAL network (log message: "ready to attach DAL attestation for level ..., round ..., with bitset ... for my_baker (&lt;address&gt;) to attest slots published at level ...")

## Calculating the delay for attestation rights

If you are setting up a new baker, you must wait until it receives attestation rights before it can bake blocks or attest to DAL data.
The delay to receive attestation rights is a number of cycles determined by the value of the `consensus_rights_delay` constant plus two cycles.

A cycle is a number of blocks; the `blocks_per_cycle` constant determines how many blocks are in a cycle.
The `minimal_block_delay` constant determines the time between blocks in seconds.
Therefore, you can calculate the approximate time in seconds that it takes a baker to receive attestation rights with this formula:

```
(consensus_rights_delay + 2) * blocks_per_cycle * minimal_block_delay
```

Follow these steps to calculate the delay to receive attestation rights:

1. Run these commands to get the values of the network constants:

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/constants | jq | grep consensus_rights_delay
   ```

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/constants | jq | grep blocks_per_cycle
   ```

   ```bash
   octez-client rpc get /chains/main/blocks/head/context/constants | jq | grep minimal_block_delay
   ```

   You may need to install the `jq` program to run these commands.

1. Using the values from the responses, calculate the attestation rights delay in seconds.
For example, if `consensus_rights_delay` is 3, `blocks_per_cycle` is 12,288, and `minimal_block_delay` is 5, a new baker receives attestation rights after a delay of 307,200 seconds.

1. Divide the number of seconds by 86,400 to get the attestation delay in days.
For example, if the delay is 307,200 seconds, that time is about 3.5 days.

   The exact time depends on what time in the current cycle the account staked its tez.

   :::note

   The amount of tez that the account stakes determines how often it is called on to make attestations, not how quickly it receives rights.
   Therefore, staking more tez brings more rewards but does not reduce the attestation delay.

   :::

1. After the delay computed above has passed, **the baker log** (not the Octez node log, neither the DAL node log) should contain lines about:

- Consensus pre-attestations: `injected preattestation ...`
- Consensus attestations: `injected attestation ...`
- Attach DAL attestations: `ready to attach DAL attestation ...`

Whether these messages appear or not after the attestation delay, proceed to [Step 5: Verifications](/tutorials/join-dal-baker/verify-rights).

## Optional: Run an accuser

The accuser is a daemon that monitors blocks and looks for problems, such as bakers who double-sign blocks or inject multiple attestations.
If it finds a problem, it posts a denunciation operation, which leads to penalizing the misbehaving baker.
You don't have to run an accuser, but if you do, you can receive as a reward part of the penalties of the denounced baker.

Like the baker, the command for the accuser has the protocol name at the end.
For example, if your operating system uses the `systemd` software suite, the attester service file might look like this example:

```systemd
[Unit]
Description=Octez accuser
Wants=network-online.target
After=network-online.target
Requires=octez-node.service

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
User=tezos
ExecStart=octez-accuser-PsParisC run
WorkingDirectory=/opt/octez-accuser
Restart=on-failure
RestartSec=5
StandardOutput=append:/opt/octez-accuser.log
StandardError=append:/opt/octez-accuser.log
SyslogIdentifier=%n
```
