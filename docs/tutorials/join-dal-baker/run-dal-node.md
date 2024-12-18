---
title: "Step 3: Run an Octez DAL node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 18 December 2024
---

The DAL node is responsible for temporarily storing data and providing it to bakers and Smart Rollups.
Follow these steps to run the DAL node:

1. Ensure that the port that the DAL node runs on (by default, 11732) is accessible from outside its system.
You may need to adapt your firewall rules or set up network address translation (NAT) to direct external traffic to the DAL node.
For more information, see [Running a DAL attester node](https://tezos.gitlab.io/shell/dal_run.html) in the Octez documentation.

1. Initialize the DAL node by running its `config init` command, passing the address of your `octez-node` instance in the `--endpoint` argument and your baker's account address in the `--attester-profiles` argument.
For example, this command initializes the DAL node with the address of a local `octez-node` instance on port 8732 and stores data in the default DAL node directory (`~/.tezos-dal-node`):

   ```bash
   octez-dal-node config init --endpoint http://127.0.0.1:8732 \
     --attester-profiles=tz1...
   ```

   You cannot use the `my_baker` alias from the Octez client as in the previous section, so you must specify the address of your baker's account explicitly.

1. Start the DAL node by running this command:

   ```bash
   octez-dal-node run
   ```

   You may append `>>"$HOME/octez-dal-node.log" 2>&1` to redirect its output in a log file.

   This, too, may take some time to launch the first time because it needs to generate a new identity file, this time for the DAL network.

   If you need to change the address or port that the DAL node listens for connections to other nodes on, pass the `--public-addr` argument.
   By default, it listens on port 11732 on all available network interfaces, equivalent to `--public-addr 0.0.0.0:11732`.

1. Verify that the DAL node is connected to the DAL network by running this command:

   ```bash
   curl http://localhost:10732/p2p/points/info
   ```

   where `10732` is the default port on which the DAL node serves RPC calls.
   You can override it with the `--rpc-addr` argument.

   The response lists the network connections that the DAL node has, as in this example:

   ```json
   [
     {
       "point": "46.137.127.32:11732",
       "info": {
         "trusted": true,
         "state": {
           "event_kind": "running",
           "p2p_peer_id": "idrpUzezw7VJ4NU6phQYuxh88RiU1t"
         },
         "p2p_peer_id": "idrpUzezw7VJ4NU6phQYuxh88RiU1t",
         "last_established_connection": [
           "idrpUzezw7VJ4NU6phQYuxh88RiU1t",
           "2024-10-24T15:02:31.549-00:00"
         ],
         "last_seen": [
           "idrpUzezw7VJ4NU6phQYuxh88RiU1t",
           "2024-10-24T15:02:31.549-00:00"
         ]
       }
     },
     {
       "point": "52.31.26.230:11732",
       "info": {
         "trusted": true,
         "state": {
           "event_kind": "running",
           "p2p_peer_id": "idqrcQybXbKwWk42bn1XjeZ33xgduC"
         },
         "p2p_peer_id": "idqrcQybXbKwWk42bn1XjeZ33xgduC",
         "last_established_connection": [
           "idqrcQybXbKwWk42bn1XjeZ33xgduC",
           "2024-10-24T15:02:31.666-00:00"
         ],
         "last_seen": [
           "idqrcQybXbKwWk42bn1XjeZ33xgduC",
           "2024-10-24T15:02:31.666-00:00"
         ]
       }
     }
   ]
   ```

   It may take a few minutes for the node to connect to the DAL network.

   You can also verify that the DAL node is connected by viewing its log.
   When the node is bootstrapped it logs messages that look like this:

   ```
   Aug 12 17:44:19.985: started tracking layer 1's node
   Aug 12 17:44:24.418: layer 1 node's block at level 7538687, round 0 is final
   Aug 12 17:44:29.328: layer 1 node's block at level 7538688, round 0 is final
   ```

   The DAL node waits for blocks to be finalized, so this log lags 2 blocks behind the layer 1 node's log.

   Now the DAL node is connected to the DAL network but it is not yet receiving data.

1. Ensure that the DAL node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Setting up Octez Services](https://tezos.gitlab.io/introduction/services.html) in the Octez documentation.

   For example, if your operating system uses the `systemd` software suite, your service file might look like this example:

   ```systemd
   [Unit]
   Description=Octez DAL node
   Wants = network-online.target
   After = network-online.target
   Requires = octez-node.service

   [Install]
   WantedBy = multi-user.target
   RequiredBy = octez-baker.service

   [Service]
   Type=simple
   User=mybaker
   ExecStart=/usr/bin/octez-dal-node run --data-dir /opt/dal-node
   WorkingDirectory=/opt/dal-node
   Restart=on-failure
   RestartSec=5
   StandardOutput=append:/opt/octez-dal-node.log
   StandardError=append:/opt/octez-dal-node.log
   SyslogIdentifier=%n
   ```

Now that you have a DAL node running, you can start a baking daemon that uses that DAL node.
Continue to [Step 4: Run an Octez baking daemon](/tutorials/join-dal-baker/run-baker).
