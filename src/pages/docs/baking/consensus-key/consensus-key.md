---
id: consensus-key
title: Create a baker's consensus key
authors: Ferdinand ATTIVI, Aurelien MONTEILLET, Nomadic Labs
---

:::info
This feature will be available starting from the [Lima](https://tezos.gitlab.io/protocols/015_lima.html) amendment.
:::

In this chapter, we present a new core feature introduced by the Lima amendment: the consensus keys. We'll explain the core concepts behind it, the motivations and the CLI command lines to manipulate a consensus key. 

:::caution
Executing the commands in this tutorial requires the deployment of your own [Tezos baking node](/baking/cli-baker).
:::

## Consensus key

The consensus key is simply a key that allows bakers to improve their operational security, by rotating keys without the need for redelegating. The consensus key is used for consensus operations (i.e. baking, (pre)endorsements). And the consensus key itself can be updated on-demand.

### Motivations

- **Security** : 
The use of consensus keys allows for optimal protection of parent keys and also allows establishing baking operations in environments where bakers may not have all access rights, such as on cloud platforms. 

- **Recovery mechanism** : A consensus key can be rotated without loss of delegation. Thus, if a baker loses his baking key (which may happen), they can stop baking, wait `PRESERVED_CYCLES`, and get the funds back in another account with the `Drain_delegate` operation. Then they can start baking again from this account.

Switching to consensus keys should be a priority if you are a baker. It should be adopted to improve security by using a separate key to manage the baking process.

### Operations 

The consensus key extends the context of the blockchain with two new tables, one storing the active consensus key of each baker and a second storing pending consensus key updates. The active consensus key of each baker is by default the baker’s regular key called its **manager key**. The consensus key feature comes with two new operations, the update operation (`Update_consensus_key`) and the drain operation (`Drain_delegate`).

#### Update operation: `Update_consensus_key (<new_public_key>)`

This operation must be signed by the **manager key** of the baker. It updates the consensus key of the baker with a new key `(<new_public_key>)` .

When the consensus key is updated, the newly created key is added in the second table and becomes active after 6 cycles ≈ 17 days (`PRESERVED_CYCLES` + 1). Note that a consensus key can only be used by a single baker. 

#### Drain operation: `Drain_delegate(<baker_pkh, consensus_pkh, destination_pkh>)`

This sensitive operation must be signed by the active consensus key of the baker. It enables using the consensus key for transferring all the free balance (i.e. the unfrozen balance) of the baker to another destination key which ensures that both keys have roughly the same privileges.


### What you need to create and use a consensus key

- A Tezos node configured and running (if not, please go [here](/deploy-a-node))
- A Tezos baker configured and running (if not, please go [here](//baking/cli-baker))


#### Create a basic wallet

The first step, before designating a key as a baker's consensus key, is to create an address. The Octez client allows it (e.g. the command below).

Let's create an address for bob (argument `--encrypted` can be added, to cipher the private key):

```shell
octez-client gen keys bob
```

After the creation command above, you will notice that the Octez client data directory (by default, `~/.octez-client`) has been populated with 3 files: `public_key_hashs`, `public_keys` and `secret_keys`. The content of each file is in JSON format and keeps the mapping between aliases (*e.g.* *bob*) and the kind of keys indicated by the name of each file.

#### Supply your wallet

Now that you have created an account, you need to supply it with real Tez.

:::caution
Be sure you are on the **mainnet** if you send **real Tez**.
:::

You can get the address of the previously created wallet with the following command:

```shell
octez-client show address bob
```

You can now send to *bob* any number of Tez from the wallet of your choice.

:::caution
If you are not sure of what you are doing, start by sending a small amount. Then send the whole amount. (6,000ꜩ is the minimum to register as a delegate on the network).
:::

Copy and paste the destination address into the search bar of an explorer (like [TzStats](https://tzstats.com/)) to see the transaction. The address should be visible on the explorer after the first transaction.
Using the Octez client, you can check the amount that *bob* holds with:

```shell
octez-client get balance for bob
```

#### Register a consensus key

To designate a consensus key for your baker, execute the following command:
```shell
octez-client set consensus key for <mgr> to <key>
```

It is also possible to register as a delegate and immediately set the consensus key:

```shell
octez-client register key <mgr> as delegate with consensus key <key>
```
- mgr: the delegate key 
- key: the consensus key
Once registered, you need to wait for **6** cycles ($\approx$ 17 days) for your rights to be considered.

:::info
**Revoking** one's consensus key is equivalent to setting the new consensus key to one's baking address itself.
:::

#### Drain operation with the consensus key

To drain all funds from a delegate, run the following command: 
```bash
octez-client drain delegate <mgr> to <key> with <consensus_key>
```

- mgr: the delegate key 
- key: the destination key (any tz address)
- consensus_key: the consensus key


The next three sections will guide you through the installation steps to launch a baking node using a consensus key. Feel free to jump directly to your favorite installation method.

### Set up using PPA with Tezos packages from [Serokell](https://github.com/serokell/tezos-packaging)

If you’re using Ubuntu, you can install packages with Tezos binaries from a Launchpad PPA.

:::info
Because octez-\* binaries are not yet available, we'll use tezos-\* ones.
:::

<details>
<summary>Step 1: Installation</summary>

In order to add the stable release PPA repository to your machine, run:

```bash
REPO="ppa:serokell/tezos"
```

Then choose the desired protocol for your baker/accuser (you probably want to replace `PtLimaPt` by the latest protocol version):

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

It is possible to define the directory where the data will be stored with `--data-dir` (by default, it is in `.octez-node`).

`--network=NETWORK` Select which network to run. Possible values are: sandbox, mainnet,
[testnet] (e.g., https://teztnets.xyz/limanet, . Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet**.

`--history-mode= MODE` Set the mode for the chain's data history storage. Possible values are **archive** , **full** (default), **full:N**, **rolling**, **rolling:N**.

- Archive mode retains all data since the genesis block.
- Full mode only maintains block headers and operations allowing replaying the chain since the genesis if wanted (full mode is recommended to bake. More information [here](https://tezos.gitlab.io/user/history_modes.html)).
- Rolling mode retains only the most recent data and deletes the rest.

For both Full and Rolling modes, it is possible to adjust the number of cycles to preserve by using
the **:N** annotation. The default number of preserved cycles is 5. The value experimental-rolling is
deprecated but is equivalent to rolling which should be used instead.

Read more about node configuration [here](https://tezos.gitlab.io/introduction/howtouse.html#node-configuration)).

For example, the following command configures the node for the **Limanet** Network and stores
data in the specified directory `~/tezos-limanet` with the **full** mode.

```bash
tezos-node config init --data-dir ~/tezos-limanet --network=https://teztnets.xyz/limanet --history-mode=full
```

You can run the node with :

```bash
tezos-node run --rpc-addr 127.0.0.1:8732 --log-output tezos.log
```

The parameter `--rpc-addr url:port` activates the RPC interface that will allow
communication with the node. By default, it runs on the port `8732` so it is not mandatory to specify it.
The file `tezos.log` will be saved in `/home/user/`.
</details>

<details>
<summary>Step 3: Check synchronization ✅</summary>

The Octez client can be used to interact with the node. It can query its status or ask the node to
perform some actions. For example, after starting your node, you can check if it has finished
synchronizing with the following command (you can use another terminal window if you still watch
the log):

```bash
octez-client -E http://127.0.0.1:8732/ bootstrapped
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

**Option 1 (next): Set up the Ledger to bake for your address**
Access the "Tezos Baking" app on your ledger and then do execute the following command:
(Replace `<key_alias>` by the alias chosen in step 4)

```bash
sudo tezos-client -E http://127.0.0.1:8732 setup ledger to bake for my-key-alias key-alias-or-ledger-uri
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
tezos-baker-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /home/user/.octez-node --liquidity-baking-toggle-vote vote
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Step 7: Bake with a consensus key</summary>

:::info
You don't need to stop the previous baking process (launched in step 6.) before executing the following command, since the new consensus key will take over the baking process.
:::

To bake with a consensus key, you can execute the following command:

```bash
tezos-baker-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /usr/local/bin <consensus_key_alias>
```

(In the future, you may change `octez-baker-PtLimaPt` by the next protocol binary)

Check that the baking process has started by watching the logs.

</details>

<details>
<summary>Step 8: Drain a baker's free balance with a consensus key</summary>

To drain all funds from a delegate, run the following command:

```shell
tezos-client drain delegate <mgr> to <key> with <consensus_key>
```

- mgr: the delegate key
- key: the destination key
- consensus_key: the consensus key

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
docker run --privileged -v /dev/bus/usb:/dev/bus/usb -v node-data-volume:/var/run/tezos/node -d -it -p 8732:8732 --name=tezos-public-node-full tezos/tezos:v15.0-rc1 octez-node --network=https://teztnets.xyz/limanet --history-mode=full
```

This command will automatically download the `tezos/tezos:v15` image:

- `--privileged` mode is only used to allow a connection with a Hardware secure module,
e.g. Ledger
- `--name` option to specify the name of the container
- `-v /dev/bus/usb:/dev/bus/usb` allows to mount USB volumes to the specified container
- `-v node-data-volume:/var/run/tezos/node` mount node-data-volume to the specified container. It is where blockchain
data will be stored
- `--network=NETWORK` selects which network to run. Possible values are: **sandbox**, **mainnet**,
**[testnet]** (e.g., limanet. Learn more about testnet aliases [here](https://tezos.gitlab.io/introduction/test_networks.html)). **Default is mainnet.**
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
octez-baker-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /usr/local/bin/ --liquidity-baking-toggle-vote <vote>
```

(In the future, you may change `octez-baker-PtLimaPt` by the next protocol binary)

Check that the baking process has started by watching the logs.

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Step 6: Register a consensus key</summary>

You can register a consensus key with:

```bash
docker exec -it tezos-public-node-full sh 
octez-client set consensus key for <mgr> to <key>

```
- mgr: the delegate key
- key: the consensus key

Once registered, you need to wait for **6** cycles ($\approx$ 17 days) for your rights to be considered.

</details>

<details>
<summary>Step 7: Bake with a consensus key</summary>

:::info
You don't need to stop the previous baking process (launched in step 6.) before executing the following command, since the new consensus key will take over the baking process.
:::

To bake with a consensus key, run the following command:

```bash
docker exec -it tezos-baker sudo octez-client run with local node /usr/local/bin <consensus_key_alias>
```

(In the future, you may change `octez-baker-PtLimaPt` by the next protocol binary)

Check that the baking process has started by watching the logs.



</details>

<details>
<summary>Step 8: Drain a baker's free balance with a consensus key</summary>


To drain all funds from a delegate, run the following command: 

```shell
docker exec -it tezos-public-node-full sh octez-client drain delegate <mgr> to <key> with <consensus_key>
```

- mgr: the delegate key
- key: the destination key
- consensus_key: the consensus key

</details>



<details>
<summary>Some useful commands</summary>

To see the manual of commands you can use:

```bash
docker run -it tezos/tezos:v15 man
```

To see the various commands and options of the tezos node, use the following command:

```bash
docker run -it tezos/tezos:v15 octez-node --help
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
it to run a baker and accuser for another protocol by replacing the `PROTOCOL` environment variable, in our case `PtLimaPt`, with the desired protocol.
(***full mode is recommended to bake***. More information [here](https://tezos.gitlab.io/user/history_modes.html).

```yml
version: "3.4"
volumes:
  node_data_full:
    name: lima-node
    external: false  
  client_data:
    name: lima-client
    external: false
services:
####################################################################################################################################
# You have to uncomment this section if you want to synchronize your node using a snapshot, else you can ignore or delete it.
# Replace /absolute/path/to/your_snapshot.full:/snapshot by the absolute path to the downloaded snapshot.
###################################################################################################################################  
#  import:
#    image: tezos/tezos:v15.1
#    container_name: tezos-snapshot-import
#    command: octez-snapshot-import
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
    image: tezos/tezos:v15.1
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

################################################################################################
# If you want to run a baker, keep that "baker" part, else delete it.
# You can change the version of the image of tezos in: image: tezos/tezos:v15.1
# You can change the PROTOCOL
# You can change the vote mode between on/off/pass. pass is the mode by default
################################################################################################
  baker:
    container_name: tezos-baker
    image: tezos/tezos:v15.1
    environment:
     - HOME=/tmp
     - NODE_HOST=127.0.0.1
     - NODE_RPC_PORT=8732
     - PROTOCOL=PtLimaPt
    command: octez-baker --liquidity-baking-toggle-vote pass
    volumes:
     - node_data_full:/var/run/tezos/node:ro
     - client_data:/var/run/tezos/client
     - /dev/bus/usb:/dev/bus/usb
    restart: on-failure

################################################################################################
# If you want to run an accuser, keep that "accuser" part, else delete it.
# You can change the version of the image of tezos in: image: tezos/tezos:v15.1
# You can change the PROTOCOL
################################################################################################
  accuser:
    container_name: tezos-accuser
    image: tezos/tezos:v15.1
    environment:
     - HOME=/tmp
     - NODE_HOST=127.0.0.1
     - NODE_RPC_PORT=8732
     - PROTOCOL=PtLimaPt
    command: octez-accuser
    volumes:
     - node_data_full:/var/run/tezos/node:ro
     - client_data:/var/run/tezos/client
    restart: on-failure

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
docker exec -it tezos-baker sudo octez-client --endpoint http://127.0.0.1:8732 list connected ledgers
```

Import a key from the Ledger:

```bash
docker exec tezos-baker sudo octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> <ledger://path/to/the/secret/key/on/your/device>
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
docker exec tezos-baker octez-client --endpoint http://127.0.0.1:8732 import secret key <key_alias> unencrypted:<your_private_key>
```

</details>

<details>
<summary>Step 3: Let's register as delegate</summary>

***Option 1 (next): Setup the Ledger to bake for your address***
Open the "Tezos Baking" app on your ledger. Then execute the following command:
(Replace `<key_alias>` by the alias chosen earlier in Step 3)

```bash
docker exec -it tezos-baker sudo octez-client -E http://127.0.0.1:8732 setup ledger to bake for <key_alias>Validate the request on your ledger.
```

***Register your key as a delegate on the network***
(Replace `<key-alias>` by the alias chosen earlier in Step 3)

```bash
docker exec tezos-baker octez-client --endpoint http://127.0.0.1:8732 register key <key_alias> as delegate
```

🎉 **Congratulations on setting up a baker node!** 🎉
</details>

<details>
<summary>Step 4: Register a consensus key</summary>

You can register a consensus key with:

```bash
docker exec -it tezos-baker sudo octez-client set consensus key for <mgr> to <key>
```
- mgr: the delegate key
- key: the consensus key


Once registered, you need to wait for **6** cycles ($\approx$ 17 days) for your rights to be considered.

</details>

<details>
<summary>Step 5: Bake with a consensus key</summary>

:::info
You don't need to stop the previous baking process (launched in step 6.) before executing the following command, since the new consensus key will take over the baking process.
:::

To bake with a consensus key, run the following commands:

```bash
docker exec -it tezos-public-node-full sh 
octez-baker-PtLimaPt --endpoint http://127.0.0.1:8732 run with local node /usr/local/bin <consensus_key_alias>
```

(In the future, you may change `octez-baker-PtLimaPt` by the next protocol binary)

Check that the baking process has started by watching the logs.


</details>


<details>
<summary>Step 6: Drain a baker's free balance with a consensus key</summary>

To drain all funds from a delegate, run the following command:

```bash
docker exec -it tezos-baker sudo octez-client drain delegate <mgr> to <key> with <consensus_key>
```
- mgr: the delegate key
- key: the destination key
- consensus_key: the consensus key



</details>



## References

[1] <https://midl-dev.medium.com/a-consensus-key-for-tezos-bakers-16a3ac8178cf>

[2] <https://gitlab.com/Ochem/tzip/-/blob/consensus_key/drafts/current/draft-consensus-key.md>

[3] <https://tezos.gitlab.io/protocols/015_lima.html#consensus-key>
