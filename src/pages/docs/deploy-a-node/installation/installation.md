---
id: installation
title: Installation & Set up
authors: Nomadic Labs
---

In this chapter, we will see the CLI command lines to install the necessary dependencies to run a Tezos node.

:::caution
The current Octez version is [`v15.1`](https://tezos.gitlab.io/releases/version-15.html) and the protocol version is [Lima](https://tezos.gitlab.io/protocols/015_lima.html).
:::

## Running an Octez node

A node is responsible for receiving, validating and transmitting blocks and operations to nodes it is connected to on the network.

### What you need

- A reliable internet connection
- 8 GB RAM
- 2 CPU cores
- Preferably 256 GB SSD drive

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

Run the node in detached mode (`-d`), as instance on the testnet Limanet network with the
history-mode "full" using the following command:

```bash
docker run --name=tezos-public-node-full -v node-data-volume:/var/run/tezos/node tezos/tezos:latest octez-node --network=limanet
```

This command will automatically download the `tezos/tezos:latest` image:

- `-v node-data-volume:/var/run/tezos/node` mount node-data-volume to the specified container. It is where blockchain
data will be stored
- `--network= NETWORK` selects which network to run. Possible values are: **sandbox**, **mainnet**,
**[testnet]** (e.g., ghostnet, limanet, kathmandunet, jakartanet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet.**
- `--history-mode= MODE` lets you set the mode for the node's blockchain history storage.
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
<summary>Step 1: Let's launch the node!</summary>

The code below launches a *full node* for the Lima protocol (**mainnet**). More information [here](https://tezos.gitlab.io/user/history_modes.html).

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
<summary>Bonus: Quick synchronization from a snapshot</summary>

If you want your node to be bootstrapped quickly, you can synchronize it with the blockchain using
a snapshot.

**1.** Download a .full snapshot from a snapshot provider (<https://xtz-shots.io/>, <https://snapshots.tezos.marigold.dev/>, <https://snapshots-tezos.giganode.io/>, <https://lambsonacid.nl/>),  in your current repository by replacing with `<snapshot_url>` in following command:

```bash
wget <snapshot_url>
```

**2.** Launch the node daemon:

```bash
docker-compose up -d node_full
sudo docker exec -it tezos-public-node-full sh
sudo rm /var/run/tezos/data/lock
exit
```

**3.** Stop the node:

```bash
docker-compose stop node_full
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

**6.** Upload the snapshot into the `mainnet-node` volume (You must uncomment the dedicated `import` part of the docker-compose file that was previously commented with `#`):

```bash
docker-compose up import
```

You will have to wait ~1-2 hours to import a full snapshot.

**7.** Start synchro from snapshot:

```bash
docker-compose stop import
docker-compose up -d node_full
```

</details>

<details>
<summary><a name="upgrade-storage">Bonus: Upgrade your node storage</a></summary>

Some protocol or client changes require upgrading the node storage.
You can simply update it with the following commands:

**1.** Stop the running container:

```bash
docker-compose stop node_full
```

**2.** Upgrade the storage:

```bash
docker run -it -v node_data_full:/var/run/tezos/node tezos/tezos:latest tezos-upgrade-storage
```

:::warning
If you encounter an error, follow these steps before proceeding to `step 2`:

**1.** Go inside the container:

```bash
docker run -it --entrypoint=/bin/sh -v node_data_full:/var/run/tezos/node tezos/tezos:latest
```

**2.** Delete lock files and change node data file ownership/group:

```bash
cd /var/run/tezos/node/
sudo chown -R tezos.tezos .
rm data/lock
```
:::

</details>

### Set up using PPA with Tezos packages from [Serokell](https://github.com/serokell/tezos-packaging)

If you’re using Ubuntu, you can install packages with Tezos binaries from a Launchpad PPA.

<details>
<summary>Step 1: Installation</summary>

In order to add the stable release PPA repository to your machine, do:

```bash
REPO="ppa:serokell/tezos"
```

Then, to install the binaries, run the following commands:

```bash
sudo add-apt-repository -y $REPO && sudo apt-get update
sudo apt-get install -y tezos-client
sudo apt-get install -y tezos-node
```

</details>

<details>
<summary>Step 2: Let's config and run!</summary>

The following command configures the node for the **Ghostnet** Network ([Tezos semi-permanent test network](https://teztnets.xyz/ghostnet-about)) and stores
data in the specified directory `~/tezos-ghostnet` with the *full mode*:

```bash
tezos-node config init --data-dir ~/tezos-ghostnet --network=ghostnet --history-mode=full
```

- `data-dir` Define the directory where the data will be stored (by default, it is in `.tezos-node`).

- `--network=NETWORK` Select which network to run. Possible values are: sandbox, mainnet,
[testnet] (e.g., ghostnet, limanet, kathmandunet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet**.

- `--history-mode=MODE` Set the mode for the chain's data history storage. Possible values are **archive** , **full** (default), **full:N**, **rolling**, **rolling:N**.

  - *Archive mode* retains all data since the genesis block.

  - *Full mode* only maintains block headers and operations allowing replaying of the chain since the genesis, if wanted. *Full mode* is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html).

  - *Rolling mode* retains only the most recent data and deletes the rest.

For both *Full* and *Rolling* modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to rolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration).

You can run the node with:

```bash
tezos-node run --rpc-addr 127.0.0.1:8732 --log-output tezos.log --data-dir ~/tezos-ghostnet
```

- `--rpc-addr url:port` activate the RPC interface that will allow communication with the node. By default, it runs on port `8732` so it is not mandatory to specify it.

- `--log-output tezos.log` will saved logs of the node in the `tezos.log` file.

- `data-dir` Define the directory where the data will be stored (by default, it is in `.tezos-node`).

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

- `-E` option is equal to `--endpoint` option

When you see the message " *Node is Bootstrapped* ", your Tezos node is synchronized with the
blockchain and you may now perform operations on it!
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

:::note
If you have trouble with `curl`, just download the script and run `sh install.sh`.
:::

For the next command line, answers the prompts with 'N' then 'y'. You may also be prompted for
your `sudo` password. You may encounter a "switch" error, but you can ignore it.

```bash
opam init --bare
```

</details>

<details>
<summary>Step 2: Install Rust</summary>
Compiling Tezos requires the Rust compiler, version 1.52.1, and the Cargo package manager for
Rust to be installed. If you have [rustup](https://rustup.rs/) installed, you can use [rustup](https://rustup.rs/) to install both. If you do not have `rustup`, please avoid installing it from Snapcraft; you can rather follow the simple
installation process shown below:

```bash
cd $HOME
wget https://sh.rustup.rs/rustup-init.sh
chmod +x rustup-init.sh
./rustup-init.sh --profile minimal --default-toolchain 1.52.1 -y
```

Once Rust is installed, note that your `PATH` environment variable (in `.profile`) may be
updated and you will need to restart your session so that changes can be taken into account.
Alternatively, you can do it manually without restarting your session with the following command :

```bash
source $HOME/.cargo/env
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

It is possible to define the directory where the data will be stored with `--data-dir` (by default, it is in `.octez-node`).

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

#### [Tezos OPAM packages](https://tezos.gitlab.io/introduction/howtoget.html#install-tezos-opam-packages) method

<details>
<summary>Step 1: Install OPAM</summary>

First, you need to install the OPAM package manager, at least version 2.0, that you can get by
following the install instructions.
The quickest way to get the latest opam up and working is to run this script:

```bash
bash -c "sh <(curl -fsSL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh)"
```

:::note
If you have trouble with `curl`, just download the script and run `sh install.sh`.
:::

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

If you get a `c compiler error`, run this to install some necessary tools:

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
directory`, by default, it is in `.octez-node`)

`4:` You can get some information with the following command:

```bash
octez-node snapshot info $path/name_of_snapshot_file
```

</details>

## Upgrade an Octez node

As you may know, Tezos is an evolving blockchain. Through its on-chain governance mechanism, Tezos smoothly evolves to become more secure and scalable
over time.

The following commands help to upgrade your node to the latest Octez version.

:::caution
That version `14.0` changes the storage format. A `tezos-node upgrade storage` is mandatory to update your storage. This upgrade is instantaneous but the data-directory used by your node can no longer be used with version `13.0` once upgraded (if you are using docker, see [upgrade instructions](#upgrade-storage) in `Bonus: Quick synchronization from a snapshot`).
:::

### Docker and docker-compose

<details>
<summary>Upgrade the docker image</summary>
To upgrade your node to the lastest Octez version, replace your previous image version (probably v13.0) by the lastest: v15.1.
Note that if you run the image latest, a restart of your container is sufficient.

To use the `v15.1` image, execute the following command:

```bash
docker run tezos/tezos:v15.1 ...
```
</details>

### Serokell PPA with Tezos packages

<details>
<summary>Upgrade tezos packages</summary>

To fetch the latest node version, run the following command:

```bash
sudo apt-get update
sudo apt-get upgrade
```

</details>

### From source

#### From scratch

<details>
<summary>Upgrade from scratch</summary>

Execute the following commands in your tezos repository:

```bash
git fetch
git checkout v15.1
opam switch remove .
rm -rf _opam _build
make build-deps
eval $(opam env)
make
```
:::caution
A `opam switch remove .` is only needed if you are updating an already compiled repository, not if you are compiling from a freshly cloned repository.
:::
</details>

#### Tezos opam packages

<details>
<summary>Upgrade using opam</summary>

Run the following commands:

```bash
opam update
opam depext
opam upgrade
```
</details>

:::caution
Be careful when closing terminal windows because this stops the node.
:::

:::tip
Use [screen](https://doc.ubuntu-fr.org/screen), or [nohup](https://www.computerhope.com/unix/unohup.htm) to keep the node running in the background.
:::

This module is a prerequisite to becoming a baker, and the [Deploy Bakers](/baking/cli-baker) module explains how to become a baker and start earning Tez rewards.


## References

[1] https://tezos.gitlab.io/introduction/howtoget.html

[2] https://github.com/serokell/tezos-packaging/blob/master/docs/baking.md
