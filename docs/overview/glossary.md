---
title: Glossary
lastUpdated: 24th October 2023
---

## Tezos and tez

The following is adapted from this [Agora post](https://forum.tezosagora.org/t/nomenclature/2376) by Tezos Co-founder Arthur Breitman. As noted in the post, there is no official body that can authoritatively set Tezos' nomenclature, but the following is recommended:

- **Tezos**

   Used either as a noun or an adjective to designate:

   * An open-source project and software (as in, "contributing to the Tezos codebase")
   * A peer-to-peer network of nodes maintaining a blockchain (as in "a Tezos node")
   * The specific Tezos chain with the most economic relevance (as in "the Tezos chain"). Typically, this would be today the chain whose [millionth block](https://tzkt.io/BKtC4QCWoF73kxLj773vFpQuuwrnye6PS7T1aM3XEPvFXiQbNu7/endorsements) had hash `BKtC4QCWoF73kxLj773vFpQuuwrnye6PS7T1aM3XEPvFXiQbNu7`.

- **Tez**

   A unit of the cryptocurrency native to a Tezos chain, such as in "I sent you 2 tez." Tez is invariable. It is not capitalized except at the beginning of a sentence or when you would otherwise capitalize a noun. "I sent you 2 tez" and not "2 Tez".

- **XTZ**

   XTZ, tez, or ꜩ (`\ua729`, "Latin small letter tz") is the native currency of Tezos.

   "XTZ" is an ISO-4217-compatible code for representing tez on the most economically relevant Tezos chain. Unless there is a very specific reason to use an ISO code for it, the term tez is preferred. Situations where the ISO code might be useful typically involve accounting systems, exchange rates with other currencies, and anything that might need some sort of standardized code.

<!-- The following content is duplicated from https://tezos.gitlab.io/active/glossary.html -->

## Tezos terms

- **Block**

    The Tezos blockchain is a linked list of blocks (or actually, a tree when several competing branches exist).
    Blocks conceptually contain a header and a list of operations,
    which are specific to the economic protocol.

    The header itself decomposes into a shell header (common to all Tezos economic protocols), and a protocol-specific header.
    The shell header contains protocol-agnostic data such as the predecessor's block hash and the block's timestamp.

- **Context**

    The state of the blockchain. The context is defined by the
    economic protocol and typically includes information such as
    "this account is credited with this many tez" and "this is the
    code for that smart contract."

    The context is modified by operations. For example, an
    operation can transfer tez from one account to another, which modifies the
    part of the context that tracks account credit.

- **Economic protocol**

    The economic protocol is the set of rules defining valid operations and blocks, how the network agrees on the next block to build (the consensus algorithm),
    and how operations update the blockchain state, also called context.

    In Tezos, the economic protocol can be upgraded without interruption or
    forking of the blockchain. This is because the procedure for an upgrade is also defined within the economic protocol, which can thus update itself.

- **Fitness**

    (a.k.a. score, weight)
    For each block, the consensus algorithm can compute a score called fitness which determines the quality of the chain leading to that block.
    The shell changes the head of the chain to the valid block that has the highest fitness.

- **Height**

    See level.

- **Level**

    (a.k.a. block height)
    The position of a block in the blockchain, that is, the number of blocks
    since the genesis block, where the genesis block is at level 0.

- **Mempool**

    A (block or operation) metadata is a piece of data
    computed as a result of the application of the
    block or operation on an associated context. The metadata
    consists of many pieces of information such as the operation receipts,
    rewards updates, voting period, etc.

    A block's metadata is the collections of operations metadata for all the operations included in the block (if the validation was successful).

- **Node**

    A peer in the P2P network. It maintains a local state and propagates blocks
    and operations.

- **Operation**

    An operation transforms the context; this is what makes the state of the chain
    change. Operations are grouped into blocks; thus, the chain progresses in
    batches.

- **Score**

    See fitness.

- **Shell**

    The shell is a software component of the node. It is parameterized by a
    specific economic protocol. It serves as the bridge between the P2P layer
    (handling communication between nodes) and the economic protocol layer
    (handling the context, operation application, scoring, etc.).

- **Weight**

    See fitness.

## Protocol terms

- **Accuser**

    When a delegate attempts double signing (or when it tries
    to abuse the network in another similar way), another delegate can make an
    accusation, by providing evidence of the offense. The delegate injecting the accusation in a newly baked block is called the accuser.

    The accuser is awarded some funds from the security deposit of the accused.

    When using Octez, accusation operations are emitted by the
    accuser daemon. Note that this daemon is not associated to a delegate: accusation operations are anonymous, and any delegate can include them in a block.

- **Account**

    An account is an address managed by the protocol.
    In the context, each account is associated with a balance (an amount of
    tez available).

    An account can be either an originated account or an implicit account.

- **Baker**

    When a delegate creates a new block, it is called the baker of this block.
    Baking rights are distributed to different delegates based on their
    available stake. Only a delegate with baking rights
    is allowed to bake.
    The baker selects transactions from the mempool to be included in the block it bakes.

    When using Octez, baking and other consensus actions are handled by the baker
    daemon, on behalf of one or more delegate accounts.
    By extension, a baker designates the owner of such a delegate account, typically running the baker daemon on its behalf.

- **Baking**

    The act of creating a new block by a baker.

- **Baking rights**

    Baking/endorsing a block can only be done by a delegate who holds the
    baking/endorsing right for that block level and round. At the start of a cycle,
    baking and endorsing rights are computed for all the block levels and rounds in the
    cycle, based on the proportion of the stake of each delegate.

    For each block level and round, there is exactly one account that is allowed to bake, but several accounts are allowed to endorse.

- **Burn**

    To ensure responsible use of the storage space on the public blockchain,
    there are some costs charged to users for consuming storage. These
    costs are burnt (i.e., the amount of tez is destroyed). For example,
    a per-byte storage cost is burnt for increasing the storage space of a
    smart contract; a fixed amount is burnt for allocating a new contract
    (which consumes space by storing its address on the blockchain).

    See also fee.

- **Constant**

    Protocols are parameterized by several parameters called protocol constants, which may vary from one protocol to another or from one network to another.

- **Contract**

    See account.

- **Cycle**

    A cycle is a sequence of consecutive blocks of fixed length (given by a protocol constant). E.g., cycle 12 started at block
    level 49152 and ended at block level 53248.

    Cycles are used as a unit of "time" in the block chain. For example, the
    different phases in the amendment voting procedures are defined based on
    numbers of cycles.

    The length of a cycle is a (parametric) protocol
    constant, and thus might change across different
    Tezos protocols.

- **Delegate**

    An implicit account that can participate in consensus and in governance.
    Actual participation is under further provisions, like having a minimal stake.
    An implicit account becomes a delegate by registering as such.
    Through delegation, other accounts can delegate their rights to a delegate account.
    The delegate's rights are calculated based on its stake.
    Note that `tz4` accounts cannot be delegates.

- **Delegation**

    An operation in which an account designates a
    delegate. The delegating account's balance increases the delegate's stake and consequently
    its baking rights and endorsing rights. However, the delegate does not control the funds of
    the delegating account, e.g., it can not spend them.

- **Double signing**

    The situation when a baker signs two different blocks at the same level and same round,
    is called double baking. Double baking is detrimental to the network and might be
    indicative of an attempt to double spend.
    The same goes for signing two different endorsements at the same level and the same round.
    As such, double signing (i.e., double baking or double endorsing) is punished by the
    network: an accuser can provide proof of the double signing to be awarded
    part of the double signer's deposit -- see Slashing.

- **Failing Noop**

    The `Failingnoop` operation implements a *No-op*, which always
    fails at application time, and
    should never appear in applied
    blocks. This operation allows end-users to
    sign arbitrary messages which have no
    computational semantics.

- **Endorsing**

    When a block is created and propagated on the network, delegates that have
    endorsing rights for the matching block level and round can emit an endorsement operation.
    Endorsement operations are included in the next block.

- **Endorsing rights**

    See baking rights.

- **Fee**

    To ensure responsible use of computation resources of other nodes, and also to encourage active participation in the consensus protocol,
    users pay fees to bakers for including their operations in blocks.
    For example, fees are paid to a baker for operations such as a transaction or a revelation of a public key.

    Currently, only manager operations
    require collecting fees from its sender account.

    See also burn.

- **Gas**

    A measure of the number of elementary steps performed during
    the execution of a smart contract. Gas is used to measure how
    much computing power is used to execute a smart contract.

- **Implicit account**

    An account that is linked to a public key. Contrary to a smart
    contract, an implicit account cannot include a script and it
    cannot reject incoming transactions.

    If *registered*, an implicit account can act as a delegate.

    The address of an implicit account always starts with the
    letters tz followed by 1, 2, 3, or 4 (depending on the
    signature scheme) and finally the hash of the public key.

- **Layer 1**

    The primary blockchain i.e. the Tezos chain. Within any blockchain ecosystem, Layer 1 (L1) refers to the main chain to
    which side chains, rollups, or other protocols connect and settle to. The Layer 1 chain is deemed to be most
    secure, since it has the most value (or stake) tied to it, and be most decentralized and censorship resistant.
    However, transaction space is limited leading to low throughput and possibly high transaction costs.
    See Layer 2.

- **Layer 2**

    Layer 2 (L2) includes sidechains, rollups, payment channels, etc. that batch their transactions and
    write to the layer 1 chain. By processing transactions on layer 2 networks,
    greater scalability in speed and throughput can be achieved by the ecosystem overall, since the number of transactions
    the layer 1 can process directly is limited. By cementing transactions from a L2 to L1,
    the security of the L1 chain backs those operations. In Tezos there are a number of layer 2 solutions,
    including Smart Optimistic Rollups,
    validity or ZK-Rollups [Epoxy](https://research-development.nomadic-labs.com/files/cryptography.html) ,
    zkChannels, and sidechains such as [Deku](https://deku.marigold.dev/).

- **Michelson**

    The built-in language used by a smart contract.

- **Minimal stake**

    An amount of tez (e.g., 6000ꜩ) serving as a minimal amount for a
    delegate to have baking rights and voting rights in a cycle.

- **Operation kinds**

    The main kinds of operations in the protocol are transactions (to transfer funds
    or to execute smart contracts), accusations, activations, delegations,
    endorsements, and originations.

- **Originated account**

    See smart contract.

- **Origination**

    A manager operation whose purpose is to create -- that
    is, to deploy -- a smart contract on the Tezos blockchain.

- **Round**

    An attempt to reach consensus on a block at a given level.
    A round is represented by an index, starting with 0.
    Each round corresponds to a time span.
    A baker with baking rights at a given round is only allowed to bake during
    the round's corresponding time span. Baking outside of one's designated
    round results in an invalid block.

- **Roll**

    deprecated; see minimal stake.

- **Smart contract**

    Account which is associated to a Michelson script.
    They are created with an
    explicit origination operation and are therefore sometimes called
    originated accounts. The address of a smart contract always starts
    with the letters `KT1`.

- **Smart Optimistic Rollups**

    Smart optimistic rollups constitute a layer 2 solution that can be used to deploy either a general-purpose polyvalent layer 2 blockchain
    (e.g., an EVM-compatible one), or an application-specific DApp.

- **Stake**

    The amount of tokens that determines a delegate's weight in the
    governance process and in the selection of its baking and
    endorsing rights. A delegate's stake is usually given by the
    delegate's own tokens plus the sum of tokens delegated to
    it. However, there are cases when this is not the case, see
    [here](https://tezos.gitlab.io/active/consensus.html#active-stake-nairobi) for details.

- **Transaction**

    An operation to transfer tez between two accounts, or to run the code of a
    smart contract.

- **Validation pass**

    An index (a natural number) associated with a particular kind of
    operations, allowing to group them into classes. Validation passes
    enable prioritizing the validation and
    application of certain classes of
    operations.

- **Voting period**

    Any of the `proposal`, `exploration`, `cooldown`,
    `promotion` or `adoption` stages in the voting procedure when
    amending the economic protocol.

- **Voting listings**

    The list calculated at the beginning of each voting period that contains
    the staking balance (in number of mutez) of each delegate that owns more
    than the minimal stake at that moment. For each delegate, the voting listings
    reflect the weight of the vote emitted by the delegate when amending the
    economic protocol.