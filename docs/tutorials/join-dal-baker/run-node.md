---
title: "Step 1: Run an Octez node"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 17 January 2025
---

The first thing you need is a Tezos layer 1 node, which is an instance of the `octez-node` program and part of the Octez suite of programs.

## Installing Octez

The version of Octez to use depends on the Tezos network that you are using.

- For Mainnet or Ghostnet, install the most recent release of Octez, including `octez-client`, `octez-node`, `octez-dal-node`, and the baker for the current protocol:

   - On MacOS, run these commands:

      ```bash
      brew tap serokell/tezos-packaging-stable https://github.com/serokell/tezos-packaging-stable.git
      brew install tezos-client tezos-node tezos-dal-node tezos-baker-PsQuebec
      ```

   - On Linux and Windows WSL, download and install the built binaries from the [Octez release page](https://gitlab.com/tezos/tezos/-/releases), as in this example for Ubuntu:

      ```bash
      wget -O octez-binaries-20.3-linux-x86_64.tar.gz https://gitlab.com/tezos/tezos/-/package_files/150896058/download
      tar xf octez-binaries-20.3-linux-x86_64.tar.gz
      sudo cp octez-x86_64/octez* /usr/local/bin/
      ```

- For Weeklynet, look up the necessary version of Octez at https://teztnets.com/weeklynet-about and install it with the instructions there.

For more installation options, see [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html) in the Octez documentation.

If you build from source, you can use the `latest-release` branch to work with Ghostnet.

## Running the layer 1 node

1. Ensure that the port on which the node listens for connections from peer nodes (by default, 9732) is accessible from outside its system.
You may need to adapt your firewall rules or set up network address translation (NAT) to direct external traffic to the node.

1. Initialize the Octez node for the network.
For example, to initialize it for Ghostnet, run this command:

   ```bash
   octez-node config init --network ghostnet
   ```

   By default, the node stores its data in the folder `$HOME/.tezos-node`.

1. Download a rolling snapshot of the network from https://snapshot.tzinit.org based on the instructions on that site.
For example, the command to download a Ghostnet snapshot from the European servers might look like this:

   ```bash
   wget -O snapshot_file https://snapshots.eu.tzinit.org/ghostnet/rolling
   ```

   If you get an error that says that the data directory is invalid, clean up the directory as the error message indicates.

1. Load the snapshot in the node by running this command:

   ```bash
   octez-node snapshot import snapshot_file
   ```

1. Install the Zcash parameters as described [Install Zcash Parameters](https://tezos.gitlab.io/introduction/howtoget.html#setup-zcash-params) in the Octez documentation.

1. Start the node:

   ```
   octez-node run --rpc-addr 127.0.0.1:8732
   ```

   You may add option `--log-output="$HOME/octez-node.log"` to redirect its output in a log file.

   At first launch, the node generates a fresh identity file used to identify itself on the network.
   Then it bootstraps the chain, which takes a variable amount of time depending on how many blocks need to be loaded.

1. Make sure the Octez client uses your node by running this command:

   ```bash
   octez-client -E http://localhost:8732 config update
   ```

   If you see an error that says "Failed to acquire the protocol version from the node," ensure that your node is running and verify that the host name and port in the `config update` command are correct.

1. Wait for your node to bootstrap by running this command:

   ```bash
   octez-client bootstrapped
   ```

   The client waits until it is connected and the node is running at the current level.
   When it is connected and the node is updated, the command prints the message `Node is bootstrapped`.
   The time it takes depends on how many blocks the node must retrieve to catch up from the snapshot to the current head block.

1. Optional: Hide the Octez client's network warning message by running this command:

   ```bash
   export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=y
   ```

   This command suppresses the message that your instance of the Octez client is not using Mainnet.

1. Ensure that the node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.
You can also refer to [Setting up Octez Services](https://tezos.gitlab.io/introduction/services.html) in the Octez documentation.

   For example, if your operating system uses the `systemd` software suite, your service file might look like this example:

   ```systemd title="/etc/systemd/system/octez-node.service"
   [Unit]
   Description=Octez node
   Wants=network-online.target
   After=network-online.target

   [Install]
   WantedBy=multi-user.target

   [Service]
   Type=simple
   User=tezos
   ExecStart=octez-node run --rpc-addr 127.0.0.1:8732 --data-dir $HOME/.tezos-node
   WorkingDirectory=/opt/octez-node
   Restart=on-failure
   RestartSec=5
   StandardOutput=append:/opt/octez-node.log
   StandardError=append:/opt/octez-node.log
   SyslogIdentifier=%n
   ```

   If you name this service file `/etc/systemd/system/octez-node.service`, you can start it by running these commands:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start octez-node.service
   ```

   You can stop it by running this command:

   ```bash
   sudo systemctl stop octez-node.service
   ```

   The `systemd` software suite uses the `journalctl` program for logging, so you can use it to monitor the node and the other Octez daemons you run.
   For example, this command prints the log of the Octez node service as it is updated, similar to the `tail -f` command:

   ```bash
   journalctl --follow --unit=octez-node.service
   ```

   The `journalctl` program has options that let you search logs during time periods.
   For example, this command shows log entries between two times:

   ```bash
   journalctl --unit=octez-baker.service --since "20 minutes ago" --until "60 seconds ago"
   ```

   For more information about logging, see the documentation for the `journalctl` program.

1. Optional: When the node has bootstrapped and caught up with the current head block, you can delete the snapshot file to save space.

In the meantime, you can continue the baking infrastructure while the node is bootstrapping.
Continue to [Step 2: Set up baker accounts](/tutorials/join-dal-baker/prepare-account).
