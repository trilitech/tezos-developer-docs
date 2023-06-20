---
id: persistent-baker
title: Run a persistent baking node
authors: Daniel Nomadic
---

<!-- # Run a persistent baking node -->

Want to make your baking infrastructure more resilient to electricity and internet cut-offs? Let's use Linux service files to keep those Tezos binaries running.

The following tutorial deep dives into the subject and shows how to create persistent Tezos services.

:::caution
The current Octez version is [`v<:CURRENT_OCTEZ_VERSION:>`](https://tezos.gitlab.io/releases/version-<:CURRENT_OCTEZ_VERSION_MAJOR:>.html) and the protocol version is [<:CURRENT_PROTOCOL@CAP:>](https://tezos.gitlab.io/protocols/_<:CURRENT_PROTOCOL:>.html).
:::

## Running Tezos binaries as services

One advantage of setting up the node and baker daemons as services is that it can automatically relaunch the daemons if they stop working, or when the machine restarts. No additional action is needed from the user side.

*(Note that systems relying on a Ledger hardware wallet will need to have the PIN input again after a power failure. In these cases only using a [UPS](https://en.wikipedia.org/wiki/Uninterruptible_power_supply) can ensure a truly persistent system.)*

Systemd is a set of system software components necessary for Linux operation. In particular, it exposes  a set of daemons: `systemd`, `journald`, `networkd`,  and `logind`. For each system, a set of utilities and commands are available to the user like `systemctl`, `journalctl`, `loginctl`, etc.
In our case, we will take advantage of this powerful Linux tool to build Tezos binaries that keep running over time.

**Pre-requisites**: Install and compile the [Tezos Octez suite from scratch](https://tezos.gitlab.io/introduction/howtoget.html#setting-up-the-development-environment-from-scratch) (the same approach works with Ubuntu PPA installation, but the .service files need to be adapted). It is also possible to use service files otherwise, but we will only cover the *From scratch approach* in this tutorial.

:::caution
The baking and accuser daemon versions are currently `<:CURRENT_PROTOCOL_SHORT_HASH:>` in the .service files, but you may need to change them with the right version.
:::

## Creation of the Octez Tezos node service

Create the following file (named `octez-node.service`) in `/etc/systemd/system/`.

```bash
# The Tezos Node service (part of systemd)
# file: /etc/systemd/system/octez-node.service 
​
[Unit]
Description     = Tezos Node Service
Documentation   = http://tezos.gitlab.io/
Wants           = network-online.target
After           = network-online.target
​
[Service]
User            = <user> 
Group           = <user>
WorkingDirectory= /home/<user>/tezos/
ExecStart       = /home/<user>/tezos/octez-node run --rpc-addr 127.0.0.1:8732 --data-dir ~/.octez-node
Restart         = on-failure
​
[Install]
WantedBy        = multi-user.target
RequiredBy      = octez-baker.service octez-accuser.service
```

## Creation of the baker service

Create the following file (named `octez-baker.service`) in `/etc/systemd/system/`.

:::caution

Don't forget to import your baking key on the octez-client with: `octez-client import secret key baker_alias <path_to_baker_secret_key>` (compatible with clear, encrypted and HSM key).

:::

:::caution

 Since the Jakarta amendment, the `--liquidity-baking-toggle-vote <vote>` command line switch becomes now mandatory. `<vote>` should be replaced by **on**,**off** or **pass**.
:::

```bash
# The Tezos Baker service (part of systemd)
# file: /etc/systemd/system/octez-baker.service 
​
[Unit]
Description     = Tezos baker Service
Documentation   = http://tezos.gitlab.io/
Wants           = network-online.target
Requires        = octez-node.service
​
[Service]
User            = <user>
Group           = <user>
Environment     = "TEZOS_LOG=* -> debug"
WorkingDirectory= /home/<user>/tezos/
ExecStart       = /home/<user>/tezos/octez-baker-<:CURRENT_PROTOCOL_SHORT_HASH:> --endpoint http://127.0.0.1:8732 run with local node /home/<user>/.octez-node --liquidity-baking-toggle-vote <vote>
Restart         = on-failure
​
[Install]
WantedBy        = multi-user.target
```

## Creation of the accuser service

Create the following file (named `octez-accuser.service`) in `/etc/systemd/system/`.

```bash
# The Tezos Accuser service (part of systemd)
# file: /etc/systemd/system/octez-accuser.service 
​
[Unit]
Description     = Tezos accuser Service
Documentation   = http://tezos.gitlab.io/
Wants           = network-online.target
Requires        = octez-node.service
​
[Service]
User            = <user>
Group           = <user>
WorkingDirectory= /home/<user>/tezos/
ExecStart       = /home/<user>/tezos/octez-accuser-<:CURRENT_PROTOCOL_SHORT_HASH:> --endpoint http://127.0.0.1:8732 run 
Restart         = on-failure
​
[Install]
WantedBy        = multi-user.target
```

## Enable and start service files

Once `octez-node.service`, `octez-baker.service`, and `octez-accuser.service` are created, continue with these steps:

1. Enable the services using:
 `sudo systemctl enable octez-node.service octez-baker.service octez-accuser.service`

2. Finally, start the services using:
 `sudo systemctl start octez-node.service octez-baker.service octez-accuser.service`

## Useful commands

### Monitor your services

`sudo systemctl status octez-node.service octez-baker.service octez-accuser.service`

### Stop your services

`sudo systemctl stop octez-node.service octez-baker.service octez-accuser.service`

### Reload or restart a service

`sudo systemctl reload-or-restart octez-*.service` (* being node, baker or accuser)

## Displaying service logs

When launching node, baker, and accuser services, we ideally want to be able to leanly monitor the behaviour of the daemons by keeping track of their logs.  Using services has the advantage of being able to rely on `journalctl` to handle and organize logs for you - including rotating logs so that they don't take a lot of space (verbose modes can get large quite quickly).

Moreover, `journalctl` support querying and exporting concrete snapshots of the logs.  Here follow a few examples on how to use `--since` and `--until` to refine the logs around particular time windows.

### Follow live the logs of the node/baker/accuser services

`journalctl --follow --unit=octez-node.service`
`journalctl --follow --unit=octez-baker.service`
`journalctl --follow --unit=octez-accuser.service`

:::tip
You might want to run each of them on separate terminal windows (and defining a handy `aliases` for them).
:::

### Export node logs since yesterday

`journalctl --follow --unit=octez-node.service --since yesterday`

### Export baker logs since 8 am today

`journalctl --follow --unit=octez-baker.service --since 08:00`

### Export node logs since a week ago until one hour ago

`journalctl --follow --unit=octez-node.service --since "1 week ago" --until "1 hour ago"`

### Export baker logs between two specific timestamps

`journalctl --follow --unit=octez-baker.service --since "2022-05-09 00:00:00" --until "2022-05-09 00:00:02"`

### Export interleaved node/baker/accuser logs around a specific window

`journalctl --follow --unit=octez-*.service --since "2 minutes ago" --until "60 seconds ago"`

:::tip
This command is good for debugging connection issues between node and baker.
:::

## Running a remote signer as a service

To secure their baking infrastructure, some bakers use a remote signer. This setup consists in:

- Running the node and baker on a first machine, e.g. a remote node running on a VPS in the cloud.

- Storing the key on a second machine, typically a local system (perhaps using a Ledger/HSM), and running a signing daemon to perform signing operations requested by the remote node running on the first machine.

### Setup a remote signer using a .service file

**Prerequisites**:

First make sure you have setup a remote machine on which your node will be running, and a "home" machine on which your baking keys will be stored (or that is connected to a Ledger/HSM).

Setup the remote signer following the procedure [here](https://tezos.gitlab.io/user/key-management.html#signer).

On the home machine, create and launch the following service:

```bash
# The Tezos Signer service (part of systemd)
# file: /etc/systemd/system/octez-signer.service 
​
[Unit]
Description     = Tezos Signer Service
Documentation   = http://tezos.gitlab.io/
Wants           = network-online.target
Requires        = octez-node.service
​
[Service]
User            = <user>
Group           = <user>
WorkingDirectory= /home/<user>/tezos/
ExecStart       = /home/<user>/tezos/octez-signer launch http signer
Restart         = on-failure
​
[Install]
WantedBy        = multi-user.target
```

To launch your signing service, follow the same steps as in the ["Enable and start service files"](#enable-and-start-service-files) section above.

Happy (Steady) Baking!
