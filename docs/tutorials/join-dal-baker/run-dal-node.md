---
title: "Step 3: Run an Octez DAL node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 22 August 2024
---

The DAL node is responsible for temporarily storing data and providing it to bakers and Smart Rollups.

1. Start the DAL node by running this command:

   ```bash
   octez-dal-node run >> "$HOME/octez-dal-node.log" 2>&1
   ```

   This, too, may take some time to launch the first time because it needs to generate a new identity file, this time for the DAL network.

1. Verify that the DAL node is connected to the DAL network by running this command:

   ```bash
   curl http://localhost:10732/p2p/gossipsub/connections
   ```

   The response lists the network connections that the DAL node has.
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

1. Like other Octez daemons, ensure that the DAL node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Run a persistent baking node](https://opentezos.com/node-baking/baking/persistent-baker/) on opentezos.com.

   For example, if your operating system uses the `systemd` software suite, your service file might look like this example:

   ```systemd
   [Unit]
   Description=Octez DAL node
   Wants = network-online.target
   After = network-online.target
   Requires = octez-node.service

   [Install]
   WantedBy=multi-user.target
   RequiredBy = octez-baker.service

   [Service]
   Type=simple
   User=mybaker
   ExecStart=/usr/bin/octez-dal-node run --data-dir /opt/dal
   WorkingDirectory=/opt/dal
   Restart=on-failure
   RestartSec=5
   StandardOutput=append:/opt/dal/octez-dal-node.log
   StandardError=append:/opt/dal/octez-dal-node.log
   SyslogIdentifier=%n
   ```

Now that you have a DAL node running, you can start a baking daemon that uses that DAL node.
Continue to [Step 4: Run an Octez baking daemon](./run-baker).
