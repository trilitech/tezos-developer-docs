---
title: Glossary
---

This glossary is divided in two sections, the first one concerns Tezos,
and the second one concerns the [economic protocol](). The definitions
in the latter section may be different for other protocol versions.

# Tezos

::: {#blocks}

\_[Block]{.title-ref}

:   The Tezos blockchain is a linked list of blocks (or actually, a tree
    when several competing branches exist). Blocks conceptually contain
    a header and a list of [operations](), which are specific to the
    [economic protocol]().

    The header itself decomposes into a
    `shell header<shell_header>`{.interpreted-text role="ref"} (common
    to all Tezos economic protocols), and a protocol-specific header.
    The shell header contains protocol-agnostic data such as the
    predecessor\'s block hash and the block\'s timestamp.

\_[Context]{.title-ref}

:   The state of the blockchain. The context is defined by the [economic
    protocol]() and typically includes information such as "this
    [account]() is credited with this many tez" and "this is the code
    for that [smart contract]()."

    The context is modified by [operations](). For example, an
    [operation]() can transfer tez from one [account]() to another,
    which modifies the part of the context that tracks [account]()
    credit.

\_[Economic protocol]{.title-ref}

:   The economic protocol is the set of rules defining valid
    [operations]() and [blocks](), how the network agrees on the next
    block to build (the consensus algorithm), and how operations update
    the blockchain state, also called [context]().

    In Tezos, the economic protocol can be upgraded without interruption
    or forking of the blockchain. This is because the procedure for an
    upgrade is also defined within the economic protocol, which can thus
    update itself.

\_[Fitness]{.title-ref} (a.k.a. score, weight)

:   For each block, the consensus algotrithm can compute a score called
    fitness which determines the quality of the chain leading to that
    block. The shell changes the head of the chain to the valid block
    that has the highest fitness.

\_[Height]{.title-ref}

:   See [level]().

\_[Level]{.title-ref} (a.k.a. block height)

:   The position of a [block]() in the blockchain, that is, the number
    of blocks since the genesis block, where the genesis block is at
    level 0.

\_[Mempool]{.title-ref}

:   A (block or operation) metadata is a piece of data computed as a
    result of the application of the block or operation on an associated
    [context](). The metadata consists of many pieces of information
    such as the operation receipts, rewards updates, voting period, etc.

    A block\'s metadata is the collections of operations metadata for
    all the operations included in the block (if the validation was
    successful).

    For a detailed metadata content check the `./rpc`{.interpreted-text
    role="doc"} under the prefix `../<block_id>/metadata`.

\_[Node]{.title-ref}

:   A peer in the P2P network. It maintains a local state and propagates
    [blocks]() and [operations]().
:::

::: {#operations}

\_[Operation]{.title-ref}

:   An operation transforms the [context](); this is what makes the
    state of the chain change. Operations are grouped into [blocks]();
    thus, the chain progresses in batches. For the different kinds of
    operations defined by the protocol, see [operation kinds]().

\_[Score]{.title-ref}

:   See [fitness]().

\_[Shell]{.title-ref}

:   The shell is a software component of the [node](). It is
    parameterized by a specific [economic protocol](). It serves as the
    bridge between the P2P layer (handling communication between nodes)
    and the [economic protocol]() layer (handling the [context](),
    [operation]() application, scoring, etc.).

\_[Weight]{.title-ref}

:   See [fitness]().
:::

# Protocol

\_[Accuser]{.title-ref}

:   When a [delegate]() attempts to inject several incompatible blocks
    (or when it tries to abuse the network in another similar way),
    another [delegate]() can make an accusation: show evidence of
    attempted abuse. The [delegate]() making the accusation is the
    accuser.

    The accuser is awarded some funds from the security deposit of the
    accused.

    When using `Octez <octez>`{.interpreted-text role="ref"},
    accusations are handled by the accuser binary.

\_[Account]{.title-ref}

:   An account is a unique identifier within the protocol. There are
    different kinds of accounts (see [originated account]() and
    [implicit account]()).

    In the [context](), each account is associated with a balance (an
    amount of tez available).

\_[Baker]{.title-ref}

:   When a [delegate]() creates a new [block](), it is the baker of this
    [block](). [Baking]() rights are distributed to different accounts
    based on their available balance. Only a [delegate]() with
    [baking]() rights is allowed to bake. The baker selects transactions
    from the [mempool]() to be included in the [block]() it bakes.

    When using `Octez <octez>`{.interpreted-text role="ref"}, [baking]()
    and other consensus actions are handled by the baker binary.

\_[Baking]{.title-ref}/\_[endorsing rights]{.title-ref}

:   A [delegate]() is allowed to bake/endorse a [block]() if it holds
    the baking/endorsing right for that [block](). At the start of a
    [cycle](), baking and endorsing rights are computed for all the
    [block]() levels in the [cycle](), based on the proportion of the
    stake owned by each account.

    For each [block]() level and block [round](), there is exactly one
    account that is allowed to bake.

    When a [block]() is created and propagated on the network, delegates
    that have [endorsing rights]() for the matching [block]() level can
    emit an endorsement [operation](). Endorsement [operations]() are
    included in the next [block]().

\_[Burn]{.title-ref}

:   To ensure responsible use of the storage space on the public
    blockchain, there are some costs charged to users for consuming
    storage. These costs are burnt (i.e., the amount of tez is
    destroyed). For example, a per-byte storage cost is burnt for
    increasing the storage space of a smart contract; a fixed amount is
    burnt for allocating a new contract (which consumes space by storing
    its address on the blockchain).

    See also [fee]().

\_[Constants]{.title-ref}

:   Protocols are parameterized by several parameters called protocol
    constants, which may vary from one protocol to another or from one
    network to another.

\_[Contract]{.title-ref}

:   See [account]().

\_[Cycle]{.title-ref}

:   A cycle is a set of consecutive blocks. E.g., cycle 12 started at
    [block]() level 49152 and ended at [block]() level 53248.

    Cycles are used as a unit of "time" in the blockchain. For example,
    the different phases in the amendment voting procedures are defined
    based on cycles.

    The length of a cycle is a (parametric) protocol
    `constant<Constants>`{.interpreted-text role="ref"}, and thus might
    change across different Tezos protocols.

\_[Delegate]{.title-ref}

:   An [implicit account]() to which an [account]() has delegated their
    rights to participate in consensus (aka [baking]() rights) and in
    governance. The delegate\'s rights are calculated based on its own
    tokens plus the sum of tokens delegated to it. Note that since `tz4`
    accounts cannot be delegates.

\_[Delegation]{.title-ref}

:   An [operation]() in which an [account]() balance is lent to a
    [delegate](). This increases the [delegate]()\'s stake and
    consequently its [baking]() rights. The [delegate]() does not
    control the funds from the [account]().

\_[Double signing]{.title-ref}

:   The action of a [baker]() signing two different blocks at the same
    level and same round is called *double baking*. Double baking is
    detrimental to the network and might be indicative of an attempt to
    double spend. The same goes for signing two different *endorsements*
    at the same level and the same round.

    Double signing (i.e. double baking or double endorsing) is punished
    by the network: an [accuser]() can provide proof of the double
    signing to be awarded part of the double signer\'s deposit \-- see
    `Slashing<slashing_mumbai>`{.interpreted-text role="ref"}.

\_[Failing Noop]{.title-ref}

:   The `Failing_noop` operation implements a *No-op*, which always
    fails at
    `application time<operation_validity_mumbai>`{.interpreted-text
    role="ref"}, and should never appear in `applied
    blocks<full_application_mumbai>`{.interpreted-text role="ref"}. This
    operation allows end-users to
    `sign arbitrary messages<failing_noop>`{.interpreted-text
    role="ref"} which have no computational semantics.

\_[Fee]{.title-ref}

:   To ensure responsible use of computation resources of other nodes,
    and also to encourage active participation in the consensus
    protocol, users pay fees to bakers for including (some of) their
    operations in blocks. For example, fees are paid to a baker for
    operations such as a [transaction]() or a revelation of a public
    key.

    Currently, only
    `manager operations<manager_operations_mumbai>`{.interpreted-text
    role="ref"} require collecting fees from its sender [account]().

    See also [burn]().

\_[Gas]{.title-ref}

:   A measure of the number of elementary [operations]() performed
    during the execution of a [smart contract](). Gas is used to measure
    how much computing power is used to execute a [smart contract]().

\_[Implicit account]{.title-ref}

:   An [account]() that is linked to a public key. Contrary to a [smart
    contract](), an [Implicit account]() cannot include a script and it
    cannot reject incoming transactions.

    If *registered*, an [implicit account]() can act as a [delegate]().

    The address of an [implicit account]() always starts with the
    letters [tz]{.title-ref} followed by [1]{.title-ref},
    [2]{.title-ref}, [3]{.title-ref} or [4]{.title-ref} (depending on
    the signature scheme) and finally the hash of the public key.

\_[Layer 1]{.title-ref}

:   The primary blockchain i.e. the Tezos chain. Within any blockchain
    ecosystem, Layer 1 (L1) refers to the main chain to which side
    chains, rollups, or other protocols connect and settle to. The Layer
    1 chain is deemed to be most secure, since it has the most value (or
    stake) tied to it, and be most decentralized and censorship
    resistant. However, transaction space is limited leading to low
    throughput and possibly high transaction costs. See [Layer 2]().

\_[Layer 2]{.title-ref}

:   Layer 2 (L2) includes sidechains, rollups, payment channels, etc.
    that batch their transactions and write to the [layer 1]() chain. By
    processing transactions on layer 2 networks, greater scalability in
    speed and throughput can be achieved by the ecosystem overall, since
    the number of transactions the layer 1 can process directly is
    limited. By cementing transactions from a L2 to L1, the security of
    the L1 chain backs those operations. In Tezos there are a number of
    layer 2 solutions, including
    `TORUs (Transaction Optimistic Rollups) <transaction_rollups>`{.interpreted-text
    role="doc"}, [Smart Optimistic Rollups](), validity or ZK-Rollups
    [Epoxy](https://research-development.nomadic-labs.com/files/cryptography.html)
    , zkChannels, and sidechains such as
    [Deku](https://www.marigold.dev/deku).

\_[Michelson]{.title-ref}

:   The built-in language used by a [smart contract]().

::: {#glossary_minimal_stake_mumbai}

\_[Minimal stake]{.title-ref}

:   An amount of tez (e.g., 6000ꜩ) serving as a minimal amount for a
    delegate to have [baking]() and voting rights in a [cycle]().

\_[Operation kinds]{.title-ref}

:   The main kinds of operations in the protocol are transactions (to
    transfer funds or to execute smart contracts), accusations,
    activations, delegations, endorsements and originations.

\_[Originated account]{.title-ref}

:   See [smart contract]().

\_[Origination]{.title-ref}

:   A manager [operation]() whose purpose is to create \-- that is, to
    deploy \-- a [smart contract]() on the Tezos blockchain.

\_[Round]{.title-ref}

:   An attempt to reach consensus on a block at a given level. A round
    is represented by an index, starting with 0. Each round corresponds
    to a time span. A [baker]() with [baking]() rights at a given round
    is only allowed to bake during the round\'s corresponding time span.
    [Baking]() outside of one\'s designated round results in an invalid
    [block]().

\_[Roll]{.title-ref}

:   deprecated; see [Minimal stake]().

\_[Smart contract]{.title-ref}

:   [Account]() which is associated to a [Michelson]() script. They are
    created with an explicit [origination]() operation and are therefore
    sometimes called originated accounts. The address of a smart
    contract always starts with the letters `KT1`.

\_[Smart Optimistic Rollups]{.title-ref}

:   Smart optimistic rollups constitute a [layer 2]() solution that can
    be used to deploy either a general-purpose polyvalent layer 2
    blockchain (e.g., an EVM-compatible one), or an application-specific
    DApp. See `smart_rollups`{.interpreted-text role="doc"}.

\_[Transaction]{.title-ref}

:   An [operation]() to transfer tez between two accounts, or to run the
    code of a [smart contract]().

\_[Validation pass]{.title-ref}

:   An index (a natural number) associated with a particular kind of
    operations, allowing to group them into classes. Validation passes
    enable prioritizing the `validation and
    application<operation_validity_mumbai>`{.interpreted-text
    role="ref"} of certain classes of operations.

\_[Voting period]{.title-ref}

:   Any of the `proposal`, `exploration`, `cooldown`, `promotion` or
    `adoption` stages in the voting procedure when amending the
    [economic protocol]().

\_[Voting listings]{.title-ref}

:   The list calculated at the beginning of each [voting period]() that
    contains the staking balance (in number of mutez) of each
    [delegate]() that owns more than one [roll]() at that moment. For
    each [delegate](), The voting listings reflects the weight of the
    vote emitted by the [delegate]() when amending the [economic
    protocol]().
:::
