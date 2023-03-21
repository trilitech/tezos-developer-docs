---
title: Overview of the economic protocol
---

# Tezos overview

Tezos is a distributed system in which nodes agree upon a chain of
blocks of operations. Tezos is also an account-based crypto-ledger,
where an account is associated to a public-private key pair, and has a
balance, that is, a number of tokens. Tezos is a
`proof-of-stake<proof_of_stake>`{.interpreted-text role="doc"} system in
which any account that has a minimal stake amount has the right to
produce blocks, in proportion to their balance.

A Tezos node has mainly three roles: it validates blocks and operations,
it broadcasts them to (and retrieves them from) other nodes, and it
maintains a main chain and its associated state (i.e. the ledger), which
includes accounts and their balances, among other things. Note that, as
blocks only specify a predecessor block, exchanged blocks do not
necessarily form a chain, but rather a tree. Nodes communicate over
`a gossip network<../shell/p2p>`{.interpreted-text role="doc"}.

A Tezos node acts as a server, which responds to queries and requests
from clients. Such queries and requests are implemented via `RPC
calls<../developer/rpc>`{.interpreted-text role="doc"}. A client can
query the chain's state and can inject blocks and operations into a
node. One particular client is the
`baker daemon <baker_run>`{.interpreted-text role="ref"}, which is
associated to an account. In particular the baker has access to the
account's private key and thus can sign blocks and operations.

The main reason for using such a client-server architecture is safety:
to insulate the component that has access to the client keys, i.e. the
baker, from the component which is exposed to the internet, i.e. the
node. Indeed, the node and the baker can sit on different computers and
the baker does not need to be exposed to the internet. So nodes manage
communication and shield bakers from network attacks, and bakers hold
secrets and bake blocks into the blockchain.

Another advantage of this architecture is that bakers can more easily
have different implementations, and this is important, for instance
because different bakers may want to implement different transaction
selection strategies.

Tezos is a self-amending blockchain, in that a large part of Tezos can
be changed through a so-called amendment procedure. To this end, as
mentioned in `the big picture<the_big_picture>`{.interpreted-text
role="ref"}, a Tezos node consists of two components:

-   the shell, which comprises the network and storage layer, and embeds
-   the economic protocol component, which is the part that can be
    changed through amendment.

# The role of the economic protocol

> Update for pipelined validation up to Lima.

At a very high level, a protocol must:

-   implement protocol-specific types, such as the type of operations or
    protocol-specific block header data (in addition to the shell
    generic header),
-   define under which conditions a block is a valid extension of the
    current blockchain, and define an ordering on blocks to arbitrate
    between concurrent extensions.

Validity conditions are implemented in the `apply` function which is
called whenever the node processes a block\-\--see the dedicated
`protocol validation and operation<validation>`{.interpreted-text
role="doc"} entry for further detail into the validation and application
process for `blocks<block_validation_overview_mumbai>`{.interpreted-text
role="ref"} and their
`operations<operation_validity_mumbai>`{.interpreted-text role="ref"}.

# Shell-protocol interaction {#shell_proto_interact_mumbai}

In the Tezos `architecture<the_big_picture>`{.interpreted-text
role="ref"}, the economic protocol and the shell interact in order to
ensure that the blocks being appended to the blockchain are valid. There
are mainly two rules that the shell uses when receiving a new block:

-   The shell does not accept a branch whose fork point is in a cycle
    more than `PRESERVED_CYCLES` in the past. More precisely, if `n` is
    the current cycle,
    `the last allowed fork point<lafl>`{.interpreted-text role="ref"} is
    the first level of cycle `n-PRESERVED_CYCLES`. The parameter
    `PRESERVED_CYCLES` therefore plays a central role in Tezos: any
    block before the last allowed fork level is immutable.
-   The shell changes the head of the chain to this new block only if
    the block is `valid<../shell/validation>`{.interpreted-text
    role="doc"}, and it has a higher fitness than the current head; a
    block is `valid<block_validation_overview_mumbai>`{.interpreted-text
    role="ref"} only if all the operations included are also
    `valid<operation_validity_mumbai>`{.interpreted-text role="ref"}.

The support provided by the protocol for validating blocks can be
modulated by different `validation
modes<validation_modes_mumbai>`{.interpreted-text role="ref"}. They
allow using this same interface for quite different use cases, as
follows:

-   being able to `apply<full_application_mumbai>`{.interpreted-text
    role="ref"} a block, typically used by the shell\'s
    `validator <../shell/validation>`{.interpreted-text role="doc"}
    component;
-   being able to
    `construct<full_construction_mumbai>`{.interpreted-text role="ref"}
    a block, typically used by the baker daemon to *bake* \-- that is,
    to produce \-- a new block;
-   being able to
    `partially construct<partial_construction_mumbai>`{.interpreted-text
    role="ref"} a block, typically used by the `prevalidator
    <../shell/prevalidation>`{.interpreted-text role="doc"} to determine
    valid operations in the mempool; and,
-   being able to
    `pre-apply<partial_application_mumbai>`{.interpreted-text
    role="ref"} a block, typically used in the
    `validator <../shell/validation>`{.interpreted-text role="doc"} to
    precheck a block, avoiding to further consider invalid blocks.

# Blocks, Operations and their Validation {#block_contents_mumbai}

> Integrate protocol-specific block parts in the blocks and ops entry.

A block consists of a header and operations. A block\'s header is
composed of two parts:
`the protocol-agnostic part<shell_header>`{.interpreted-text role="ref"}
and
`the protocol-specific part<shell_proto_revisit_mumbai>`{.interpreted-text
role="ref"}. This separation enables the shell to interact with
different protocols. Each Tezos economic protocol can specify different
kinds of operations, which are described further in detail in
`./blocks_ops`{.interpreted-text role="doc"}.

The semantics of, respectively, operations and blocks is indeed also
dependent on each economic protocol. The `Validation and
Application<validation>`{.interpreted-text role="doc"} entry explains
the internals of *validation* \-- that is, how to determine whether
operations and blocks can be safely be included in the Tezos blockchain
\-- and *application* \--that is, how the effects of operations and
blocks are taken into account \-- for this economic protocol.

# Protocol constants {#protocol_constants_mumbai}

Protocols are tuned by several *protocol constants*, such as the size of
a nonce, or the number of blocks per cycle. One can distinguish two
kinds of protocol constants:

-   *fixed* protocol constants, such as the size of a nonce, are values
    wired in the code of a protocol, and can only be changed by protocol
    amendment (that is, by adopting a new protocol)
-   *parametric* protocol constants, such as the number of blocks per
    cycle, are values maintained in a read-only data structure that can
    be instantiated differently, for the same protocol, from one network
    to another (for instance, test networks move faster).

The *list* of protocol constants can be found in the OCaml APIs:

-   fixed protocol constants are defined in the module `Constants_repr
    <tezos-protocol-016-PtMumbai/Tezos_raw_protocol_016_PtMumbai/Constants_repr/index.html>`{.interpreted-text
    role="package-api"}
-   parametric constants are defined in the module
    `Constants_parametric_repr
    <tezos-protocol-016-PtMumbai/Tezos_raw_protocol_016_PtMumbai/Constants_parametric_repr/index.html>`{.interpreted-text
    role="package-api"}

The *values* of protocol constants in any given protocol can be found
using specific RPC calls:

-   one RPC for
    `all constants <GET_..--block_id--context--constants>`{.interpreted-text
    role="ref"}, as shown in
    `this example <get_protocol_constants>`{.interpreted-text
    role="ref"}
-   one RPC for
    `the parametric constants <GET_..--block_id--context--constants--parametric>`{.interpreted-text
    role="ref"}.

Further documentation of various protocol constants can be found in the
subsystems where they conceptually belong. See, for example:

-   `proof-of-stake parameters <ps_constants_mumbai>`{.interpreted-text
    role="ref"}.
-   `consensus-related parameters <cs_constants_mumbai>`{.interpreted-text
    role="ref"}
-   `randomness generation parameters <rg_constants_mumbai>`{.interpreted-text
    role="ref"}.

# See also

An in-depth description of the internals of developing a new Tezos
protocol can be found in the blog post: [How to write a Tezos
protocol](https://research-development.nomadic-labs.com/how-to-write-a-tezos-protocol.html).
