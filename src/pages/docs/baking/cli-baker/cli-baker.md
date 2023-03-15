---
id: cli-baker
title: Become a baker
authors: Maxime Sallerin, Jean-Baptiste Col, Nomadic Labs
---

In this chapter, we will see the CLI command lines for registering as a delegate. Then we will see how to exercise your rights as a baker, endorser, and accuser.

This chapter requires the deployment of your own Tezos node, explained in the module [Deploy a node](/deploy-a-node).

:::caution
The current Octez version is [`v15.1`](https://tezos.gitlab.io/releases/version-15.html) and the protocol version is [Lima](https://tezos.gitlab.io/protocols/015_lima.html).
:::

## Running a Delegate

A delegate is responsible for baking blocks, endorsing blocks, and accusing other delegates if they try to double bake or double endorse.

### What you need

- A reliable internet connection
- At least 6,000ꜩ of staking balance
- A Tezos node configured and running (if not, please go [here](/deploy-a-node))

### Deposit

When baking or endorsing a block, a security deposit (>6,000ꜩ) is frozen for 5 cycles from the account of the delegate. Hence a delegate must have enough funds to be able to pay security deposits for all the blocks it can potentially bake/endorse during 5 cyles.

:::note
It is necessary to have at least 10% of your stake to follow the deposits.
:::

### Registration

#### Create a basic wallet

The Octez client is also a basic wallet. After the activation command below, you will notice that the Octez client data directory (by default, `~/.octez-client`) has been populated with 3 files: `public_key_hashs`, `public_keys` and `secret_keys`.

The content of each file is in JSON format and keeps the mapping between aliases (*e.g.* *bob*) and the kind of keys indicated by the name of each file. Create an address for bob (argument `--encrypted` to cipher the private key):

```shell
octez-client gen keys bob
```

#### Supply your wallet

Now that you have created an account, you need to supply it with real Tez.

:::caution
Be sure you are on the **mainnet** if you send **real Tez**.
:::

You can get the address of the previously created wallet with the following command:

```shell
octez-client list known addresses
```

You can now send to *bob* any number of Tez from a wallet of your choice.

:::caution
If you are not sure what you are doing, start by sending a small amount. Then send the whole amount. (6,000ꜩ is the minimum to register as a delegate).
:::

Copy and paste the destination address into the search bar of an explorer (like [TzStats](https://tzstats.com/)) to see the transaction. The address should be visible in the explorer after the first transaction.

You can check the amount that *bob* holds with:

```shell
octez-client get balance for bob
```

#### Register as a delegate

To run a delegate, you first need to register as one using the alias of your account:

```shell
octez-client register key bob as delegate
```

Once registered, you need to wait for **7** cycles ($\approx$ 20 days) for your rights to be considered.

### Baker

The baker is a *daemon* that, once connected to an account, computes the baking rights for that account, collects transactions from the *mempool*, and bakes a block. Note that the baker is the only program that needs *direct access* to the node data directory for performance reasons.

:::info
A *daemon* is a computer program that runs as a background process.

The *mempool* is made of all transactions that have been submitted for inclusion in the chain but have not yet been included in a block by a baker.
:::

Let’s launch the daemon pointing to the standard node directory and baking for the user *bob*.

There are different command lines depending on the *network* on which your node is configured:

- Limanet, Ghostnet & Mainnet: `octez-baker-015-PtLimaPt`
- Kathmandunet: `octez-baker-014-PtKathma`

So, for *bob* on the *Mainnet*, the command is as follow:

```shell
octez-baker-015-PtLimaPt run with local node ~/.octez-node bob
```

:::caution
Remember that having **two bakers or endorsers** running connected to **the same account** could lead to [**double baking/endorsing**](/baking/risks#actions-prejudicial-to-the-network) and **the loss of all your bonds**. If you are worried about the availability of your node when it is its turn to bake/endorse, there are other ways than duplicating your credentials (see the discussion in section [Inactive delegates](https://tezos.gitlab.io/introduction/howtorun.html#inactive-delegates)).

**Never use the same account on two daemons**.
:::

### Endorser

The endorser is a daemon that, once connected to an account, computes the endorsing rights for that account. Upon reception of a new block, the daemon verifies its validity and then emits an *endorsement operation*. It can endorse for a specific account or, if omitted, for all accounts. Since **Ithaca amendment**, the endorser daemon is embedded into the baking daemon.

### Accuser

The accuser is a daemon that monitors **all blocks received on all chains** and looks for:

- bakers who signed **two blocks at the same level**
- endorsers who injected **more than one endorsement operation for the same baking slot**

Upon finding such irregularity, it will respectively emit a *double-baking* or *double-endorsing* denunciation operation, which will cause the offender **to lose its security deposit**.

There are different command lines depending on the *network* on which your node is configured:

- Limanet, , Ghostnet & Mainnet: `octez-accuser-015-PtLimaPt`
- Kathmandunet: `octez-accuser-014-PtKathma`

So, on the *Mainnet*, the command is as follow:

```shell
octez-accuser-015-PtLimaPt run
```

## Let's dive into the practical part

The following section will guide you through the complete installation and setup of your own Tezos baker on Linux,
using [Docker images](#set-up-using-docker-images), [PPA packages](#set-up-using-ppa-with-tezos-packages-from-serokell), or by [building from source](#set-up-by-building-from-source).

### Prerequisites

Baking blocks on the Tezos blockchain requires:

- 6,000 tez (can be achieved through delegations)

and a dedicated machine online 24/7 with at least:

- 8 GB RAM
- 2 CPU cores
- 256 GB SSD drive


### Set up using PPA with Tezos packages from [Serokell](https://github.com/serokell/tezos-packaging)

If you’re using Ubuntu, you can install packages with Tezos binaries from a Launchpad PPA.

<details>
<summary>Step 1: Installation</summary>

In order to add the stable release PPA repository to your machine, do:

```bash
REPO="ppa:serokell/tezos"
```

Then choose the desired protocol for your baker/accuser (you probably want to replace `015-PtLimaPt` by the latest protocol version):

```bash
PROTOCOL="ptlimapt"
```

Then, to install the binaries, run the following commands:

```bash
sudo add-apt-repository -y $REPO && sudo apt-get update
sudo apt-get install -y tezos-client
sudo apt-get install -y tezos-node
sudo apt-get install -y tezos-baker-$PROTOCOL
sudo apt-get install -y tezos-accuser-$PROTOCOL
```

</details>

<details>
<summary>Step 2: Let's config and run!</summary>

It is possible to define the directory where the data will be stored with `--data-dir` (by default, it is in `.tezos-node`).

`--network=NETWORK` Select which network to run. Possible values are: sandbox, mainnet,
[testnet] (e.g., ghostnet, limanet, kathmandunet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet**.

`--history-mode= MODE` Set the mode for the chain's data history storage. Possible values are **archive** , **full** (default), **full:N**, **rolling**, **rolling:N**.

- Archive mode retains all data since the genesis block.
- Full mode only maintains block headers and operations allowing replaying the chain since the genesis if wanted (full mode is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html)).
- Rolling mode retains only the most recent data and deletes the rest.

For both Full and Rolling modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to rolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration)).

For example, the following command configures the node for the **Ghostnet** Network and stores
data in the specified directory `~/tezos-ghostnet` with the **full** mode.

```bash
tezos-node config init --data-dir ~/tezos-ghostnet --network=ghostnet --history-mode=full
```

You can run the node with :

```bash
tezos-node run --rpc-addr 127.0.0.1:8732 --log-output tezos.log
```

The parameter `--rpc-addr url:port` activate the RPC interface that will allow
communication with the node. By default, it runs on port `8732` so it is not mandatory to specify it.
The file `tezos.log` will be saved in `/home/user/`.
</details>

<details>
<summary>Step 3: Check synchronization ✅</summary>

The Octez client can be used to interact with the node. It can query its status or ask the node to
perform some actions. For example, after starting your node, you can check if it has finished
synchronizing with the following command (you can use another terminal window if you still watch
the log):

```bash
tezos-client -E http://127.0.0.1:8732/ bootstrapped
```

(`-E` option is equal to `--endpoint` option)
When you see the message " *Node is Bootstrapped* ", your Tezos node is synchronized with the
blockchain and you may now perform operations on it!
</details>

<details>
<summary>Step 4: Import your keys</summary>

***Option 1: Import keys from a Ledger***
**Prerequisites: The Ledger Nano should be configured with the Tezos wallet and Tezos
baking apps.**
Access the "Tezos wallet" app on your ledger and list the connected Ledgers with the following
command:

```bash
tezos-client --endpoint http://127.0.0.1:8732 list connected ledgers
```

Import a key from a Ledger with the following command:

```bash
tezos-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
```

You have to replace `<key_alias>` by the alias of your choice, and `<ledger://path/to/the/secret/key/on/your/device>` by the path to your secret
key on your ledger (four options are available to generate either `tz1`, `tz2` or `tz3` addresses).
Validate the public key hash displayed on the ledger to validate the key import.

***Option 2: Import a secret key with the tezos-client***

:::caution
This option isn't recommended. Be careful when using your private keys unencrypted
:::

You have to replace `<key_alias>` by the alias of your choice and provide the clear private key
to the tezos-client, after the keyword `unencrypted`:

```bash
tezos-client --endpoint http://127.0.0.1:8732 import secret key key_alias unencrypted:your_private_key
```

</details>

<details>
<summary>Step 5: Let's register as delegate</summary>

**Option 1 (next): Setup the Ledger to bake for your address**
Access the "Tezos Baking" app on your ledger and then do execute the following command:
(Replace `<key_alias>` by the alias chosen in step 4)

```bashbaker
sudo tezos-client -E http://127.0.0.1:8732 setup ledger to bake for key-alias-or-ledger-uri
```

You will need to validate the request on your ledger.

**Register your key as a delegate on the network**
(Replace `<key-alias>` by the alias chosen in step 4)

```bash
tezos-client --endpoint http://127.0.0.1:8732 register key <key_alias> as delegate
```

</details>

<details>
<summary>Step 6: Let's bake!</summary>

:::info
Since the Jakarta amendment, the `--liquidity-baking-toggle-vote <vote>` command line toggle is mandatory.
`<vote>` should be replaced by `on`, `off` or `pass`.
Read more about liquidity baking in the technical documentation.
:::

You can launch the baker with:

```bash
tezos-baker-015-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /home/user/.tezos-node --liquidity-baking-toggle-vote vote
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Bonus: Quick synchronization from a snapshot</summary>

If you want your node to be bootstrapped quickly, you can synchronize it with the blockchain using
a snapshot.

**1.** Download a `.full` snapshot from a snapshot provider (<https://xtz-shots.io/>, <https://snapshots.tezos.marigold.dev/>, <https://snapshots-tezos.giganode.io/>, <https://lambsonacid.nl/>) in your current repository
by replacing with `<snapshot_url>` in following command:

```bash
wget <snapshot_url>
```

**2.** Register the current directory in a variable:

```bash
path=$(pwd)
```

**3.** Import from the snapshot!

(Replace `<name_of_snapshot_file>`)

```bash
tezos-node snapshot import $path/<name_of_snapshot_file>
```

(It is possible to define the directory where the data will be stored with `--data-dir
directory`, by default, it is in `.tezos-node`)

**4.** You can get some information with the following command:

```bash
tezos-node snapshot info $path/<name_of_snapshot_file>
```

</details>

### Set up using Docker images

In this part, we will see how to install Tezos with Docker.

#### Docker

<details>
<summary>Step 1: Installation</summary>

If you don't have Docker on your machine, you can install it with the following command:

```bash
sudo apt install docker.io
```

and follow instructions on: <https://docs.docker.com/engine/install/linux-postinstall/>.
</details>

<details>
<summary>Step 2: Let's config and run!</summary>

Run the node in detached mode (`-d`), as instance on the testnet limanet network with the
history-mode "full" using the following command:

```bash
docker run --privileged -v /dev/bus/usb:/dev/bus/usb -v node-data-volume:/var/run/tezos/node -d -it -p 8732:8732 --name=tezos-public-node-full tezos/tezos:latest octez-node --network=limanet --history-mode=full
```

This command will automatically download the `tezos/tezos:latest` image:

- `--privileged` mode is only used to allow a connection with an Hardware secure module,
e.g. Ledger
- `--name` option to specify the name of the container
- `-v /dev/bus/usb:/dev/bus/usb` allows to mount USB volumes to the specified container
- `-v node-data-volume:/var/run/tezos/node` mount node-data-volume to the specified container. It is where blockchain
data will be stored
- `--network=NETWORK` selects which network to run. Possible values are: **sandbox**, **mainnet**,
**[testnet]** (e.g., ghostnet, limanet, kathmandunet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet.**
- `--history-mode=MODE` lets you set the mode for the node's blockchain history storage.
Possible values are **archive** , **full** (default), **full:N** , **rolling** , **rolling:N**.

  - *Archive mode* retains all data since the genesis block.

  - *Full mode* only maintains block headers and operations allowing replaying of the chain since the genesis, if wanted. *Full mode* is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html).

  - *Rolling mode* retains only the most recent data and deletes the rest.

For both *Full* and *Rolling* modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to rolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration).

After a few minutes, your node identity will be generated and you will be able to check if the node is
bootstrapped:

```bash
docker exec -it tezos-public-node-full octez-client --endpoint http://127.0.0.1:8732 bootstrapped
```

(Use **Ctrl+C** to stop logs displaying)
</details>

<details>
<summary>Step 3: Import your keys</summary>

***Option 1: Import keys from a Ledger***

**Prerequisites: The Ledger Nano should be configured with the Tezos wallet and Tezos
baking apps.**

Access the "Tezos wallet" app on your ledger and list the connected Ledgers with the following

Access the Tezos wallet app on your ledger and list the connected Ledgers with the following
command:

```bash
docker exec -it tezos-public-node-full sudo octez-client --endpoint http://127.0.0.18732 list connected ledgers
```

Import a key from the Ledger:

```bash
docker exec tezos-public-node-full sudo octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
```

You have to replace `<key_alias>` by the alias of your choice, and
`<ledger://path/to/the/secret/key/on/your/device>` by the path to your secret
key on your ledger (four options are available to generate either `tz1`, `tz2` or `tz3` addresses).
(You will need to validate the public key hash displayed on the ledger to validate the key
importation).

***Option 2: Import a secret key with the octez-client***

:::caution
This option isn't recommended. Be careful when using your private keys unencrypted.
:::

You have to replace `<key_alias>` by the alias of your choice and provide the clear private key
to the octez-client, after the keyword `unencrypted:`:

```bash
docker exec tezos-public-node-full octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> unencrypted:<your_private_key>
```

</details>

<details>
<summary>Step 4: Let's register as delegate</summary>

**_Option 1 (next): Setup the Ledger to bake for your address**
Access the "Tezos Baking" app on your ledger and then execute the following command:
(replace `<key_alias>` by the alias chosen in Step 3)

```bash
docker exec -it tezos-public-node-full sudo octez-client -E http://127.0.0.1:8732 setup ledger to bake for <key_alias>
```

Validate the request on your ledger.

**Register your key as a delegate on the network**
(Replace `<key-alias>` with the alias chosen in Step 3)

```bash
docker exec tezos-public-node-full octez-client --endpoint http://127.0.0.1:8732 register key <key_alias> as delegate
```

</details>

<details>
<summary>Step 5: Let's bake!</summary>

:::note
Since the Jakarta amendment, the `--liquidity-baking-toggle-vote vote` command line toggle is mandatory.
`vote` should be replaced by `on`, `off` or `pass`.

Read more about Liquidity Baking in the [technical documentation](https://tezos.gitlab.io/alpha/liquidity_baking.html).
:::

You can launch the baker with:

```bash
docker exec -it tezos-public-node-full sh 
octez-baker-015-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /usr/local/bin/ --liquidity-baking-toggle-vote <vote>
```

(In the future, you may change `octez-baker-015-PtLimaPt` by the next protocol binary)

Check baking has started by watching the logs.

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Some useful commands</summary>

To see the manual of commands you can use:

```bash
docker run -it tezos/tezos:latest man
```

To see the various commands and options of the tezos node, use the following command:

```bash
docker run -it tezos/tezos:latest octez-node --help
```

To use the client:

```bash
docker exec -it tezos-public-node-full octez-client --help
```

</details>

#### **Docker-compose**

One way to run those Docker images is with Docker Compose!

<details>
<summary>Step 1: Let's launch the node and the baker!</summary>

The code below launches a `full node`, a `baker` and an `accuser` for the Lima protocol. You can adapt
it to run a baker and accuser for another protocol by replacing the `PROTOCOL` environment variable, in our case `015-PtLimaPt`, with the desired protocol.
(***full mode is recommended to bake***. More information [here](https://tezos.gitlab.io/user/history_modes.html).

```yml
version: "3.4"
volumes:
  node_data_full:
    name: mainnet-node
    external: false  
  client_data:
    name: mainnet-client
    external: false
services:
####################################################################################################################################
# You have to uncomment this section if you want to synchronize your node using a snapshot, else you can ignore or delete it.
# Replace /absolute/path/to/your_snapshot.full:/snapshot by the absolute path to the downloaded snapshot.
###################################################################################################################################  
#  import:
#    image: tezos/tezos:latest
#    container_name: tezos-snapshot-import
#    command: tezos-snapshot-import
#    volumes:
#      - node_data_full:/var/run/tezos/node
#      - client_data:/var/run/tezos/client
#      - "/absolute/path/to/your_snapshot.full:/snapshot"
################################################################################################
# If you want to run a node with history-mode=full, keep that "node_full" part, else delete it.
# You can change the version of the image of tezos in : image: tezos/tezos:v15.1
# You can change the --network=NETWORK option.
################################################################################################
  node_full:
    container_name: tezos-public-node-full
    image: tezos/tezos:latest
    command: octez-node --net-addr :9732 --rpc-addr 127.0.0.1:8732 --rpc-addr 0.0.0.0:8732 --allow-all-rpc 0.0.0.0:8732 --history-mode=full 
    ports:
    - '9732:9732'
    - '8732:8732'
    expose:
    - "8732"
    - "9732" 
    privileged: true
    volumes:
     - node_data_full:/var/run/tezos/node
     - client_data:/var/run/tezos/client
     - /dev/bus/usb:/dev/bus/usb
    restart: on-failure
    network_mode: "host"
################################################################################################
# If you want to run a baker, keep that "baker" part, else delete it.
# You can change the version of the image of tezos in: image: tezos/tezos:v15.1
# You can change the PROTOCOL
# You can change the vote mode between on/off/pass. pass is the mode by default
################################################################################################
  baker:
    container_name: octez-baker
    image: tezos/tezos:latest
    environment:
     - HOME=/tmp
     - NODE_HOST=127.0.0.1
     - NODE_RPC_PORT=8732
     - PROTOCOL=015-PtLimaPt
    command: octez-baker --liquidity-baking-toggle-vote pass
    volumes:
     - node_data_full:/var/run/tezos/node:ro
     - client_data:/var/run/tezos/client
     - /dev/bus/usb:/dev/bus/usb
    restart: on-failure
    network_mode: "host"
################################################################################################
# If you want to run an accuser, keep that "accuser" part, else delete it.
# You can change the version of the image of tezos in: image: tezos/tezos:v15.1
# You can change the PROTOCOL
################################################################################################
  accuser:
    container_name: octez-accuser
    image: tezos/tezos:latest
    environment:
     - HOME=/tmp
     - NODE_HOST=127.0.0.1
     - NODE_RPC_PORT=8732
     - PROTOCOL=015-PtLimaPt
    command: octez-accuser
    volumes:
     - node_data_full:/var/run/tezos/node:ro
     - client_data:/var/run/tezos/client
    restart: on-failure
    network_mode: "host"
```

Copy-paste the code above into a `docker-compose.yml` file, and start the node with:

```bash
docker-compose -f docker-compose.yml up -d
```

To check if the node is bootstrapped:

```bash
docker exec -it tezos-public-node-full octez-client --endpoint http://127.0.0.1:8732 bootstrapped
```

</details>

<details>
<summary>Step 2: Import your keys</summary>

***Option 1: Import keys from a Ledger***
**Prerequisites: The Ledger Nano should be configured with the Tezos wallet and Tezos
baking apps.**
Open the "Tezos wallet" app on your ledger and list the connected Ledgers with the following command:

```bash
docker exec -it octez-baker sudo octez-client --endpoint http://127.0.0.1:8732 list connected ledgers
```

Import a key from the Ledger:

```bash
docker exec octez-baker sudo octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
```

You have to replace `<key_alias>` with the alias of your choice, and `<ledger://path/to/the/secret/key/on/your/device>` by the path to your secret key on your ledger (four options are available to generate either `tz1`, `tz2` or `tz3` addresses).

Validate the public key hash displayed on the ledger to validate the key import.

***Option 2: Import a secret key with the octez-client***

:::caution
This option isn't recommended. Be careful when using your private keys
unencrypted
:::

You have to replace `<key_alias>` by the alias of your choice and provide the clear private key
to the octez-client, after the keyword `unencrypted:`:

```bash
docker exec octez-baker octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> unencrypted:<your_private_key>
```

</details>

<details>
<summary>Step 3: Let's register as delegate</summary>

***Option 1 (next): Setup the Ledger to bake for your address***
Open the "Tezos Baking" app on your ledger. Then execute the following command:
(Replace `<key_alias>` by the alias chosen earlier in Step 3)

```bash
docker exec -it octez-baker sudo octez-client -E http://127.0.0.1:8732 setup ledger to bake for <key_alias>Validate the request on your ledger.
```

***Register your key as a delegate on the network***
(Replace `<key-alias>` by the alias chosen earlier in Step 3)

```bash
docker exec octez-baker octez-client --endpoint http://127.0.0.1:8732 register key <key_alias> as delegate
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Bonus: Quick synchronization from a snapshot</summary>

If you want your node to be bootstrapped quickly, you can synchronize it with the blockchain using
a snapshot.

**1.** Download a .full snapshot from a snapshot provider (<https://xtz-shots.io/>, <https://snapshots.tezos.marigold.dev/>, <https://snapshots-tezos.giganode.io/>, <https://lambsonacid.nl/>) in your current repository by replacing with `<snapshot_url>` in following command:

```bash
wget <snapshot_url>
```

**2.** Launch the node and baker daemons:

```bash
docker-compose up -d node_full
docker-compose up -d baker
sudo docker exec -it tezos-public-node-full sh
sudo rm /var/run/tezos/data/lock
exit
```

**3.** Stop the node, baker, and accuser daemons:

```bash
docker-compose stop node_full baker accuser
```

**4.** Execute these commands to clean up data and avoid duplicates:

```bash
sudo su
rm -rf /var/lib/docker/volumes/mainnet-node/_data/data/context
rm -rf /var/lib/docker/volumes/mainnet-node/_data/data/store
rm -rf /var/lib/docker/volumes/mainnet-node/_data/data/lock
```

(do **Ctrl+d** to quit su mode)

**5.** In the .yml file presented in Step 1, replace `/absolute/path/to/your_snapshot.full:/snapshot` by the absolute path to the
downloaded snapshot. You can use `pwd` command to know the absolute path of your current repository. ( **Read the comment in the .yml file in Step 1** )

**6.** Upload the snapshot into the `mainnet-node` volume:

```bash
docker-compose up import
```

You will have to wait ~1-2 hours to import a full snapshot.

**7.** Start synchro from snapshot:

```bash
docker-compose stop import
docker-compose up -d node_full baker accuser
```

</details>


If you’re using Ubuntu, you can install packages with Tezos binaries from a Launchpad PPA.
tezos
<details>
<summary>Step 1: Installation</summary>

In order to add the stable release PPA repository to your machine, do:

```bash
REPO="ppa:serokell/tezos"
```

Then choose the desired protocol for your baker/accuser (you probably want to replace `015-PtLimaPt` by the latest protocol version):

```bash
PROTOCOL="ptlimapt"
```

Then, to install the binaries, run the following commands:

```bash
sudo add-apt-repository -y $REPO && sudo apt-get update
sudo apt-get install -y tezos-client
sudo apt-get install -y tezos-node
sudo apt-get install -y tezos-baker-$PROTOCOL
sudo apt-get install -y tezos-accuser-$PROTOCOL
```

</details>

<details>
<summary>Step 2: Let's config and run!</summary>

It is possible to define the directory where the data will be stored with `--data-dir` (by default, it is in `.tezos-node`).

`--network=NETWORK` Select which network to run. Possible values are: sandbox, mainnet,
[testnet] (e.g., ghostnet, kathmandunet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet**.

`--history-mode= MODE` Set the mode for the chain's data history storage. Possible values are **archive** , **full** (default), **full:N**, **rolling**, **rolling:N**.

- Archive mode retains all data since the genesis block.
- Full mode only maintains block headers and operations allowing replaying the chain since the genesis if wanted (full mode is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html)).
- Rolling mode retains only the most recent data and deletes the rest.

For both Full and Rolling modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to tezos-clientrolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration)).

For example, the following command configures the node for the **Ghostnet** Network and stores
data in the specified directory `~/tezos-ghostnet` with the **full** mode.

```bash
tezos-node config init --data-dir ~/tezos-ghostnet --network=ghostnet --history-mode=full
```

You can run the node with :

```bash
tezos-node run --rpc-addr 127.0.0.1:8732 --log-output tezos.log
```

The parameter `--rpc-addr url:port` activate the RPC interface that will allow
communication with the node. By default, it runs on port `8732` so it is not mandatory to specify it.
The file `tezos.log` will be saved in `/home/user/`.
</details>

<details>
<summary>Step 3: Check synchronization ✅</summary>

The Octez client can be used to interact with the node. It can query its status or ask the node to
perform some actions. For example, after starting your node, you can check if it has finished
synchronizing with the following command (you can use another terminal window if you still watch
the log):

```bash
tezos-client -E http://127.0.0.1:8732/ bootstrapped
```

(`-E` option is equal to `--endpoint` option)
When you see the message " *Node is Bootstrapped* ", your Tezos node is synchronized with the
blockchain and you may now perform operations on it!
</details>

<details>
<summary>Step 4: Import your keys</summary>

***Option 1: Import keys from a Ledger***
**Prerequisites: The Ledger Nano should be configured with the Tezos wallet and Tezos
baking apps.**
Access the "Tezos wallet" app on your ledger and list the connected Ledgers with the following
command:

```bash
tezos-client --endpoint http://127.0.0.1:8732 list connected ledgers
```

Import a key from a Ledger with the following command:
tezos-client
```bash
tezos-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
```

You have to replace `<key_alias>` by the alias of your choice, and `<ledger://path/to/the/secret/key/on/your/device>` by the path to your secret
key on your ledger (four options are available to generate either `tz1`, `tz2` or `tz3` addresses).
Validate the public key hash displayed on the ledger to validate the key import.

***Option 2: Import a secret key with the octez-client***

:::caution
This option isn't recommended. Be careful when using your private keys unencrypted
:::

You have to replace `<key_alias>` by the alias of your choice and provide the clear private key
to the octez-client, after the keyword `unencrypted`:

```bash
tezos-client --endpoint http://127.0.0.1:8732 import secret key key_alias unencrypted:your_private_key
```

</details>

<details>
<summary>Step 5: Let's register as delegate</summary>

**Option 1 (next): Setup the Ledger to bake for your address**
Access the "Tezos Baking" app on your ledger and then do execute the following command:
(Replace `<key_alias>` by the alias chosen in step 4)

```bash
sudo tezos-client -E http://127.0.0.1:8732 setup ledger to bake for key-alias-or-ledger-uri
```

You will need to validate the request on your ledger.

**Register your key as a delegate on the network**
(Replace `<key-alias>` by the alias chosen in step 4)

```bash
tezos-client --endpoint http://127.0.0.1:8732 register key <key_alias> as delegate
```

</details>

<details>
<summary>Step 6: Let's bake!</summary>

:::info
Since the Jakarta amendment, the `--liquidity-baking-toggle-vote <vote>` command line toggle is mandatory.
`<vote>` should be replaced by `on`, `off` or `pass`.
Read more about liquidity baking in the technical documentation.
:::

You can launch the baker with:

```bash
octez-baker-015-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /home/user/.tezos-node --liquidity-baking-toggle-vote vote
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Bonus: Quick synchronization from a snapshot</summary>

If you want your node to be bootstrapped quickly, you can synchronize it with the blockchain using
a snapshot.

**1.** Download a `.full` snapshot from a snapshot provider (<https://xtz-shots.io/>, <https://snapshots.tezos.marigold.dev/>, <https://snapshots-tezos.giganode.io/>, <https://lambsonacid.nl/>) in your current repository
by replacing with `<snapshot_url>` in following command:

```bash
wget <snapshot_url>
```

**2.** Register the current directory in a variable:

```bash
path=$(pwd)
```

**3.** Import from the snapshot!

(Replace `<name_of_snapshot_file>`)

```bash
tezos-node snapshot import $path/<name_of_snapshot_file>
```

(It is possible to define the directory where the data will be stored with `--data-dir
directory`, by default, it is in `.tezos-node`)

**4.** You can get some information with the following command:

```bash
tezos-node snapshot info $path/<name_of_snapshot_file>
```

</details>

### Set up by building from source

In this part, we will see how to install Tezos from source.
The easiest way to build the binaries from the source code is to use the OPAM source package manager for
OCaml.

**This method is recommended for advanced users as it requires basic knowledge of the OPAM package
manager and the OCaml packages workflow**. In particular, upgrading Tezos from release to release might
require tinkering with different options of the OPAM package manager to adjust the local environment for the
new dependencies.

#### [From scratch](https://tezos.gitlab.io/introduction/howtoget.html#setting-up-the-development-environment-from-scratch) method

<details>
<summary>Step 1: Install OPAM</summary>

First, you need to install the OPAM package manager, at least version 2.0, that you can get by
following the install instructions.
The quickest way to get the latest opam up and working is to run this script:

```bash
bash -c "sh <(curl -fsSL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh)"
```

(If you have trouble with `curl`, just download the script and run `sh install.sh`)
For the next command line, answers the prompts with 'N' then 'y'. You may also be prompted for
your `sudo` password. You may encounter a "switch" error, but you can ignore it.

```bash
opam init --bare
```

</details>

<details>
<summary>Step 2: Install Rust</summary>
Compiling Tezos requires the Rust compiler, version 1.52.1, and the Cargo package manager for
Rust to be installed. If you have [rustup](https://rustup.rs/) installed, you can use [rustup](https://rustup.rs/) to install both. If you do not
have `rustup`, please avoid installing it from Snapcraft; you can rather follow the simple
installation process shown below:

```bash
cd $HOME
wget https://sh.rustup.rs/rustup-init.sh
chmod +x rustup-init.sh
./rustup-init.sh --profile minimal --default-toolchain 1.52.1 -y```
```

Once Rust is installed, note that your `PATH` environment variable (in `.profile`) may be
updated and you will need to restart your session so that changes can be taken into account.
Alternatively, you can do it manually without restarting your session with the following command :

```bash
$HOME/.cargo/env
```

</details>

<details>
<summary>Step 3: Install Zcash Parameters</summary>

Tezos binaries require the Zcash parameter files to run. This is for shielded/confidential
transactions with [Sapling](https://docs.nomadic-labs.com/nomadic-labs-knowledge-center/sapling-making-con-dential-transactions-on-tezos), that were added in the **Edo** amendment. If you compile from source and
move Tezos to another location (such as `/usr/local/bin`), the Tezos binaries may prompt
you to install the Zcash parameter files. The easiest way is to download and run this script:

```bash
wget https://raw.githubusercontent.com/zcash/zcash/master/zcutil/fetch-params.sh
chmod +x fetch-params.sh
./fetch-params.sh
```

</details>

<details>
<summary>Step 4: Install Tezos dependencies</summary>

Install the libraries that Tezos is dependent on:

```bash
sudo apt-get install -y rsync git m4 build-essential patch unzip wget pkg-config libgmp-dev libev-dev libhidapi-dev opam jq zlib1g-dev bc autoconf
```

Get the source code:

```bash
git clone https://gitlab.com/tezos/tezos.git
cd tezos
git checkout latest-release
```

Install tezos dependencies:

```bash
make build-deps
```

You may encounter a "switch" error, but you can ignore it.

You may encounter failures in the processes of the `make build-deps` command. In that case,
just re-type the command `opam init --bare` to re-initiate.
</details>

<details>
<summary>Step 5: Compile sources</summary>

Compile sources:

```bash
eval $(opam env)
make
```

</details>

<details>
<summary>Step 6: Check installation</summary>

To check the installation you can use the following commands:

```bash
octez-node --version
```

</details>

<details>
<summary>Step 7: Let's config and run!</summary>

It is possible to define the directory where the data will be stored with `--data-dir` (by default, it is in `.tezos-node`).
`--network= NETWORK`. Select which network to run. Possible values are: sandbox , mainnet ,
[testnet] (e.g., ghostnet, limanet, kathmandunet. See current testnets [here](https://teztnets.xyz/)). **Default is mainnet**.
`--history-mode= MODE`.

Set the mode for the chain's data history storage. Possible values are **archive** , **full** (default), **full:N**, **rolling**, **rolling:N**.

- Archive mode retains all data since the genesis block.
- Full mode only maintains block headers and operations allowing replaying the chain since the genesis if wanted. (full mode is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html)).
- Rolling mode retains only the most recent data and deletes the rest.

For both Full and Rolling modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to rolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration)).

For example, the following command configures the node for the **Ghostnet** Network and stores
data in the specified directory **~/tezos-ghostnet** with the **full** mode.

```bash
octez-node config init --data-dir ~/tezos-ghostnet --network=ghostnet --history-mode=full
```

You can run the node with :

```bash
octez-node run --rpc-addr 127.0.0.1:8732 --log-output tezos.log
```

The parameter `--rpc-addr url:port` activate the RPC interface that will allow
communication with the node. By default, it runs on port `8732` so it is not mandatory to specify it.
The file `tezos.log` will be saved in `/home/user/`.
</details>

<details>
<summary>Step 8: Check synchronization ✅</summary>

The Octez client can be used to interact with the node. It can query its status or ask the node to
perform some actions. For example, after starting your node, you can check if it has finished
synchronizing with the following command (you can use another terminal window if you still watch
the log) :

```bash
octez-client -E http://127.0.0.1:8732/ bootstrapped
```

Where:

- `-E` option is equal to `--endpoint` option

When you see the message " *Node is Bootstrapped* ", your Tezos node is synchronized with the
blockchain, and you may now perform operations on it!
</details>

<details>
<summary>Step 9: Import your keys</summary>

***Option 1: Import keys from a Ledger***
**Prerequisites: The Ledger Nano should be configured with the Tezos wallet and Tezos
baking apps.**
Access the "Tezos wallet" app on your ledger and list the connected Ledgers with the following
command:

```bash
octez-client --endpoint http://127.0.0.1:8732 list connected ledgers
```

Import a key from a Ledger with the following command:

```bash
octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
```

You have to replace `<key_alias>` by the alias of your choice, and `<ledger://path/to/the/secret/key/on/your/device>` by the path to your secret
key on your ledger (four options are available to generate either `tz1`, `tz2` or `tz3` addresses).
Validate the public key hash displayed on the ledger to validate the key import.

***Option 2: Import a secret key with the octez-client***

:::caution
This option isn't recommended. Be careful when using your private keys
unencrypted
:::

You have to replace `<key_alias>` by the alias of your choice and provide the clear private key
to the octez-client, after the keyword `unencrypted` :

```bash
octez-client --endpoint http://127.0.0.1:8732 import secret key key_alias unencrypted:your_private_key
```

</details>

<details>
<summary>Step 10: Let's register as delegate</summary>

**Option 1 (next): Setup the Ledger to bake for your address**
Access the "Tezos Baking" app on your ledger and then do execute the following command:
(Replace `<key_alias>` by the alias chosen in step 9)

```bash
sudo octez-client -E http://127.0.0.1:8732 setup ledger to bake for key-alias-or-ledger-uri
```

You will need to validate the request on your ledger.

**Register your key as a delegate on the network**
(Replace `<key-alias>` by the alias chosen in step 4)

```bash
octez-client --endpoint http://127.0.0.1:8732 register key key_alias as delegate
```

</details>

<details>
<summary>Step 11: Let's bake!</summary>

:::caution
Since the Jakarta amendment, the `--liquidity-baking-toggle-vote <vote>`
command line toggle is mandatory. `<vote>` should be replaced by `on`, `off` or `pass`. Read
more about liquidity baking in the technical documentation.
:::

You can launch the baker with:

```bash
octez-baker-015-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /home/user/.tezos-node --liquidity-baking-toggle-vote vote
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

#### [Tezos OPAM packages](https://tezos.gitlab.io/introduction/howtoget.html#install-tezos-opam-packages) method

<details>
<summary>Step 1: Install OPAM</summary>

First, you need to install the OPAM package manager, at least version 2.0, that you can get by
following the install instructions.
The quickest way to get the latest opam up and working is to run this script:

```bash
bash -c "sh <(curl -fsSL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh)"
```

(If you have trouble with `curl`, just download the script and run `sh install.sh`)
For the next command line, answers the prompts with 'N' then 'y'. You may also be prompted for
your `sudo` password. You may encounter a "switch" error, but you can ignore it.

```bash
opam init --bare
```

</details>

<details>
<summary>Step 2: Get an environment</summary>

```bash
wget -O latest-release:version.sh https://gitlab.com/tezos/tezos/raw/latest-release/scripts/version.sh
```

The binaries need a specific version of the OCaml compiler (see the value of the variable
`$ocaml_version` in file `/tezos/scripts/version.sh`).

```bash
source latest-release:version.sh
opam switch create for_tezos $ocaml_version
eval $(opam env)
```

If you get a "c compiler error", run this to install some necessary tools:

```bash
sudo apt-get install build-essential
```

</details>

<details>
<summary>Step 3: Get dependencies</summary>

In order to get the system dependencies of the binaries, do:

```bash
opam depext tezos
```

</details>

<details>
<summary>Step 4: Install binaries</summary>

```bash
opam install tezos
```

</details>

> Now follow Steps 6-7-8-9-10-11 of "[From scratch method](#from-scratch-method)"

<details>

<summary>Bonus: Quick synchronization from a snapshot</summary>

If you want your node to be bootstrapped quickly, you can synchronize it with the blockchain using
a snapshot.

`1:` Download a .full snapshot from a snapshot provider (<https://xtz-shots.io/>, <https://snapshots.tezos.marigold.dev/>, <https://snapshots-tezos.giganode.io/>, <https://lambsonacid.nl/>) in your current repository
by replacing with `<snapshot_url>` in following command:

```bash
wget <snapshot_url>
```

`2:` Register the current directory in a variable:

```bash
path=$(pwd)
```

`3:` Import from the snapshot!

(Replace `<name_of_snapshot_file>`)

```bash
octez-node snapshot import $path/name_of_snapshot_file
```

(It is possible to define the directory where the data will be stored with `--data-dir
directory`, by default, it is in `.tezos-node`)

`4:` You can get some information with the following command:

```bash
octez-node snapshot info $path/name_of_snapshot_file
```

</details>

:::caution
Be careful when closing terminal windows because this stops the node.
:::

:::tip
Use [screen](https://doc.ubuntu-fr.org/screen), or [nohup](https://www.computerhope.com/unix/unohup.htm) to keep the node running in the background.
:::

## Upgrade a baking node

### Docker and docker-compose

<details>
<summary>Upgrade the docker image</summary>

To upgrade your node to the lastest Octez version, replace your previous image version (most likely v13.0) by the lastest: `v15.1`. 
Note that if you run the image named `latest`, a restart of your container is sufficient.

To use the `v15.1` image, use the following tezos image, for both docker and docker-compose:
```bash
tezos/tezos:v15.1
```
The binary versions of both the baker and accuser must be replaced by the latest ones. If you use dokcer-compose, replace the `PROTOCOL` variable by:
```
PROTOCOL=015-PtLimaPt
```

</details>

### Serokell PPA with Tezos packages

<details>
<summary>Upgrade tezos packages</summary>

To fetch the latest node, baker and accuser deamons, run the following command:

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt install tezos-baker-015-ptlimapt
sudo apt install tezos-accuser-015-ptlimapt
```

</details>

### From source

#### From scratch

<details>
<summary>Upgrade from scratch</summary>

Refer to the section [upgrade an octez node from source](https://opentezos.com/deploy-a-node/installation#from-source). The required daemons will be automatically downloaded. Finally, relaunch your node, and run the new daemons (suffixed by `015-PtLimaPt`). 

:::caution
If the protocol upgrade has not yet taken place, keep running the "old" daemons. Note that you can both run old and new daemons without any double baking/endorsment risks.
:::

</details>

### Upgrade .service files

You can find the latest `.service` files in [this section](https://opentezos.com/baking/persistent-baker).

The general idea is to create the corresponding `.service` files, for the futur **baker** and **accuser** daemons, while still running the current ones. As with the current `.service`files that you are most likely running,
you will be able to *enable*, and then *start* them even if the current ones are running. 

First of all, refer to your installation method and follow one of the previous sections to upgrade your node.

Once your node is upgraded, copy the `.service` files of your current baker and accuser and paste them in new `.service` files. For example: `baker-1.service` and `accuser-1.service`. Change the `octez-accuser-014-PtKathma` and `octez-baker-014-PtKathma` binary names (**of the newly created files**) respectively by `octez-accuser-015-PtLimaPt` and `octez-baker-015-PtLimaPt`. **Carefully check that the new `.service`files contain the `015` daemons before following the next steps.

Execute:
```bash
systemctl daemon-reload
systemctl enable baker-1.service accuser-1.service
systemctl start baker-1.service accuser-1.service
```
While your are still baking blocks, your future daemons will take over at the first block of the new protocol!

### Switching testnet

Tezos is a fast-evolving blockchain and testnets follow each other and replace each other. It will therefore be necessary from time to time to connect to a new network to prepare for a change.

Let's say we already had a node configured on **Limanet** and that the new tesnet has just been released, let's say its name is **Newtestnet** (for the example).

To switch to **Newtesnet**, we will have to initialize another Tezos node.

Let's create a directory that will contain all the elements of our second node:

```bash
mkdir ~/tezos-newtestnet
```

We then create the configuration, which initializes the connection to Newtestnet and the list of bootstrap peers:

```bash
octez-node config init --data-dir ~/tezos-newtestnet --network newtestnet
```

Then we generate the identity:

```bash
octez-node identity generate --data-dir ~/tezos-newtestnet
```

And finally, we can launch it, with a different RPC port than the one already running on Jakartanet:

```bash
octez-node run --rpc-addr 127.0.0.1:8733 --data-dir ~/tezos-newtestnet
```

The day Limanet is shut down, we can delete the contents of the `.tezos-limanet` directory, the data of our node.

## Other options for Baking

This section presents how to setup a baker "from scratch", but here are several options for setting up a baker, each with its own advantages and disadvantages. Here are some baking options, with links to more information:

- [BakeBuddy and Ledger Nano](https://www.bakebuddy.xyz/): An intuitive plug-and-use method for setting up a node and baker.
- [Kiln and Ledger Nano](https://gitlab.com/tezos-kiln/kiln): An intuitive plug-and-use method for setting up a node and baker.
- [Remote Signer and Ledger Nano](https://github.com/obsidiansystems/ledger-app-tezos)
- [Signatory's remote Signer via the Cloud](https://www.ecadlabs.com/signatory)

The following links also provide information on setting up a baker:

- <https://github.com/tzConnectBerlin/baking-support>
- [Tezos Node Setup & Maintenance by BakingBenjamins](https://docs.bakingbenjamins.com/baking/tezos-baking-node-setup)

## References

[1] <https://tezos.gitlab.io/introduction/howtorun.html#delegateregistration>
