---
id: best-practices
title: Best practices
slug: /best-practices
authors: Nomadic Labs
---

## The best practices to run a node 

An alternative to using the services of a public node, you can run your own node.

This document presents a series of recommended practices for running Tezos nodes. It chiefly concerns the configuration of nodes for baking, but more largely applies to running the nodes in other contexts. Conversely, some other practices are signaled as being potentially dangerous; it is advisable to avoid them unless you really know what you are doing.

The discussion is centered on the Octez implementation of the Tezos node, although some aspects may apply to Tezos nodes in general.

### Context

Public blockchains are security-sensitive platforms. Indeed, given the high economic values at stake, such platforms are frequently targets of various kinds of attacks, such as denial of service (DOS), unforeseen and malicious uses of APIs, etc.

The Tezos mainnet is no exception to this general situation. This is why the Octez implementation of the Tezos blockchain (see https://tezos.gitlab.io) comes with a number of built-in protection mechanisms. For flexibility reasons, these mechanisms can be disabled or reconfigured by advanced users, but this implies mastering the associated risks.

For instance, the RPC interface offered by the Octez "octez-node" binary is disabled by default, as a first protection mechanism, and must be explicitly enabled for the clients to communicate with the node. However, it is dangerous to make the whole node interface publicly accessible on the internet, for example, because many RPC calls are costly, and can thus be used for DOS attacks. For this reason, a second protection mechanism allows configuring the RPC interface using access control lists to enable only specific RPC calls. Thus, advanced users may disable the first protection mechanism and configure the RPC interface at a fine grain, according to their own expertise, and at their own risks. Still, the recommended practice is to open the RPC interface only on localhost.

Besides protecting against attacks, the configuration of a node is also important for: preventing resource exhaustion (disk, RAM, ...), optimizing the performance of each node or of the network as a whole, optimizing rewards for bakers (e.g., by avoiding missed endorsements), etc.

The rest of this document is structured around different aspects of the Octez node configuration, and for each such aspect recommends best practices or warns about dangerous practices.

### RPC interface

The Tezos node offers an RPC programming interface, that is used by clients such as a wallet or a baker. This is a rich API providing many features (see https://tezos.gitlab.io/shell/rpc.html). 

Some of these RPC are sensitive in terms of security:

- either because they perform sensitive operations that shouldn't be available to untrusted peers, such as banning/trusting a peer, configuring the operations filtered out by the node mempool, etc.

- or because they perform costly operations that could serve for denial of service (DOS) attacks.

As a concrete example (in the second category), there are two RPC calls to estimate baking and endorsing rights for the next cycles (GET endorsing_rights and GET baking_rights). Calling these RPCs repeatedly with no limitation by remote nodes can stall a node, preventing it to do any useful work.

For this reasons, the Octez implementation of the Tezos nodes contains three built-in protection mechanisms:

- When running a node, the RPC interface is disabled by default. It has to be explicitly enabled using option --rpc-addr.

- The RPC interface can be configured at a fine grain in the node configuration file using an ACL (access control list) mechanism, by listing either the calls that are enabled (whitelist) or disabled (blacklist).

- A contextual policy is provided for configuring the RPC interface in the form of a default ACL. For the localhost interface, all RPCs are enabled by default. For other network interfaces of the current host, a subset of RPCs considered usually safe are enabled, while RPCs considered sensitive and costly are disabled. However, the default list for remote hosts should only be considered as a base for customizing an ACL under your own responsibility.

See http://tezos.gitlab.io/user/node-configuration.html#default-acl-for-rpc for more details on the default ACLs and some examples.

Advanced users may also establish more complex configurations using the proxy server (see https://tezos.gitlab.io/user/proxy-server.html), under their responsibility.
RECOMMENDATION

Based on these protection mechanisms, the recommended practice is to enable the RPC interface only on the localhost interface, thus only serving local binaries such as octez-client and octez-baker.

DANGER

Advanced users choosing to open the RPC interface for remote hosts do this at their own risks, and should carefully use the ACL mechanism for fine-grain configuration.

### History modes
The Octez node is configurable to keep more or less of the blockchain history. Different trade-offs between the required storage space and the possible queries on the history, are available in the form of three "history modes" called: Archive, Full, and Rolling (see https://tezos.gitlab.io/user/history_modes.html). These modes are suitable for different applications. For instance, the Archive mode stores all the blockchain history of balances since the genesis, and thus has the heaviest storage needs. It is suitable for applications such as indexers and block explorers. The lightest mode in storage consumption is the Rolling mode. The Full mode is an intermediate tradeoff (where everything is recomputable but only recent history is stored), generally suitable for bakers.

The Rolling mode is also compatible with baking, when used with caution. Specifically, as bakers are responsible, among others, of revealing nonces of blocks they produced during the previous cycle, they must proceed carefully when importing a snapshot. Indeed, a baker importing a snapshot in Rolling mode between the production of some block B and the revelation of the corresponding nonce, may lose information about block B, and fail to reveal its nonce, if the cycles reconstituted after the snapshot was imported are not including block B. (As a consequence, the baker would also lose the endorsing rewards for the cycle when they failed to reveal the nonce). For example, if the baker must reveal a nonce for block B at level L, the imported snapshot must record level L or lower.

These history modes also exhibit different CPU performance characteristics, which are worth taking into account. Specifically, nodes in Full mode are quicker in validating blocks than nodes in Archive mode (because in the latter case, data are searched in a larger file). This is especially true when nodes in Full mode have been restarted recently from a snapshot, and keep thus a limited history.

RECOMMENDATION

It is a recommended practice to use the Full mode for baking, and to regularly restart the baker from a recent snapshot, in order to ensure quick block validation. 

WARNING

It is not advised to set bakers in Archive mode, unless you have specific reasons to do so, as this typically slows down block validation. It is not advised to set bakers in Rolling mode either (even when it is not required to help other nodes to bootstrap), to always be able to reveal the nonce of the blocks they produced.

### Connections

In order to participate to the P2P network underlying the blockchain, the Tezos node establishes connections to different peers. The number of such connections is highly configurable, using options such as --connections, --min-connections, --max-connections, etc.

Being connected to more peers increases the chances of rapidly having up-to-date information about proposed operations and blocks, which is a very important consideration for bakers. On the other hand, having too many connections (e.g. hundreds) may incur an unacceptable overhead of communicating and synchronizing with all these peers. Therefore, it is advisable to configure a node to establish a reasonable number of connections. By default, the Tezos node currently targets 50 connections.

WARNING

It is advised not to configure a node to target too many connections (hundreds or so), as this could incur an unreasonable communication and synchronization overhead for the node. The default number of connections provides a reasonable base for defining an appropriate value for most cases.

### Disk space

Running a Tezos node requires providing enough disk space for its storage requirements. Indeed, if a node runs out of disk space, it shuts down and thus discontinues its service.

The disk space consumed by a node depends on its history mode, as explained above. But it is also important to know that, independendently of the archive mode, the disk space consumption varies in time. Thus, at regular intervals (about every 8 hours), disk space consumption increases temporarily, as the node re-orgranizes its storage. During this operation, the node keeps a copy of the old storage index, which explains why this temporary increase can typically add around 20G of disk space that are freed soon afterwards. More precisely, the extra space corresponds to the temporary copy of the `<node-dir>/context/index` subdirectory, where `<node-dir>` is the node's data directory.

RECOMMENDATION

Prior to running a node, make sure that it has not only enough disk space for its regular functioning (which may depend on its history mode and other options), but also extra available space for a copy of its index (typically around 20G extra space).

WARNING

Not allocating enough disk space for a node, including for its dynamic variations, incurs the risk of seeing the node regularly stopped.

### Memory space

Running a Tezos node requires providing enough memory space (RAM) for its functioning. Indeed, if a node runs out of RAM, it shuts down and thus discontinues its service.

The memory consumption of the node varies in time for the same reason as its disk space consumption: the node regularly reorganizes its storage (about every 8 hours). During normal operation, a node can typically work with 4G of RAM. During the storage reorganization operation, the node can consume twice as memory (up to 8G), but as each such operation is rather short-lived, it is safe to allocate the extra space as swap space on the disk.

RECOMMENDATION

Prior to running a node, make sure that enough RAM is available (typically 4GB), and also enough swap space on disk (typically 4GB).

### Performance

Ensuring a good performance level for a node requires allocating enough resources of different kinds (RAM, disk, CPUs) for its typical and peek needs. Currently, the central performance bottleneck of a Tezos node is constituted by disk bandwidth for read/write operations. For this reason, when dimensioning a machine for running a node, it is important to ensure sufficient disk bandwidth. This implies that increasing the number of CPUs machine and the RAM size of a machine to run several nodes on it does not scale well: the disk bandwidth will be the limiting factor. Rather, it is more resource-effective to run single nodes on moderately powerful machines.

RECOMMENDATION

When dimensioning machines for running Tezos nodes, it is advised to ensure a good disk bandwidth, such as those offered by SSD disks (and ideally, SSD/NVE disks). Running several nodes on the same machine should be considered with caution: pay attention not to saturate the disk bandwidth.

WARNING

Running several nodes on a multi-CPU machine will likely lead to suboptimal performance, because the disk bandwith will probably constitute the main bottleneck.

### Delayed endorsement

When a block is created and propagated on the network, nodes that have endorsing rights at that time slot can verify the validity of the block and emit an endorsement operation, which can be seen as a vote for including that block. Missing endorsement opportunities can result in missed rewards, but also has negative consequences on the network, such as slowing down the network and making the chain more susceptible to forks.
One possible reason for missing an endorsement opportunity is when the endorsement operation arrives too late, after the block has been created. Thus, it is important for bakers to emit endorsement operations as soon as possible.

RECOMMENDATION

Make sure that your baker process is not patched to delay endorsements, in order to avoid missed endorsements. So, if you are running an endorser with --endorsement-delay `<seconds>`, we suggest that you restart your endorser without it.

WARNING

Delaying endorsements, for historical reasons or for any reasons, incurs the risk of the endorsements arriving too late to be considered by block creators, hence resulting in missed reward opportunities.


## References

[1] https://tezos.gitlab.io/introduction/howtouse.html#node
