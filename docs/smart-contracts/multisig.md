---
title: Multi-signature contracts
authors: Tim McMackin
last_update:
  date: 23 January 2025
dependencies:
  octez: 21.2
  smartpy: 0.20.0
---

Multi-signature (or multisig) contracts require multiple accounts to authorize operations before running them.
They have many applications, including:

- Governance: DAOs and other groups can use them to vote on the actions that the organization takes.
- Funds distribution: Accounts can vote on where funds are sent.
- Security: Requiring multiple signatures can prevent a single compromised wallet from doing malicious things.

As with any contract, a single account must originate multisig contracts, but that account does not necessarily have any special privileges on the contract.
The contract originator does not even need to be one of the accounts that can authorize operations.

## Using proposals

One common way to create a multisig contract is to allow authorized users to submit a proposal that other authorized users can vote on.
For example, this multisig contract stores tez and allows users to propose and vote on the account that should receive the tez:

```smartpy
import smartpy as sp


@sp.module
def main():
    proposal_type: type = sp.big_map[
        sp.int,
        sp.record(
            paymentAmt=sp.mutez,
            receiver=sp.address,
            voters=sp.set[sp.address],
            votingComplete=sp.bool,
        ),
    ]

    class MultiSigContract(sp.Contract):
        def __init__(self, members, requiredVotes):
            # Keep track of all the proposals submitted to the multisig
            self.data.proposals = sp.cast(sp.big_map(), proposal_type)
            self.data.activeProposalId = 0
            self.data.members = sp.cast(members, sp.set[sp.address])
            self.data.requiredVotes = sp.cast(requiredVotes, sp.nat)

        @sp.entrypoint
        def deposit(self):
            assert self.data.members.contains(sp.sender), "Not a Member of MultiSig"

        @sp.entrypoint
        def submit_proposal(self, params):
            """
            Submit a new proposal/lambda for members
            of the MultiSig to vote for.
            """
            assert self.data.members.contains(sp.sender), "Not a Member of MultiSig"
            assert (
                params.paymentAmt <= sp.balance
            ), "The MultiSig does not have enough funds for this proposal"
            self.data.activeProposalId += (
                1  # submitting a new proposal inactivates the last one
            )
            self.data.proposals[self.data.activeProposalId] = sp.record(
                paymentAmt=params.paymentAmt,
                receiver=params.receiver,
                voters={sp.sender},
                votingComplete=False,
            )

        @sp.entrypoint
        def vote_on_proposal(self):
            assert self.data.members.contains(sp.sender), "Not a Member of MultiSig"
            # check if the user has previously voted on the proposal
            assert not self.data.proposals[self.data.activeProposalId].voters.contains(
                sp.sender
            ), "Member has voted on this proposal"
            self.data.proposals[self.data.activeProposalId].voters.add(sp.sender)
            if (
                sp.len(self.data.proposals[self.data.activeProposalId].voters)
                == self.data.requiredVotes
            ):
                sp.send(
                    self.data.proposals[self.data.activeProposalId].receiver,
                    self.data.proposals[self.data.activeProposalId].paymentAmt,
                )
                self.data.proposals[self.data.activeProposalId].votingComplete = True


@sp.add_test()
def test():
    scenario = sp.test_scenario("Multisig test", main)
    alice = sp.test_account("alice")
    bob = sp.test_account("bob")
    charlie = sp.test_account("charlie")
    dani = sp.test_account("dani")
    earl = sp.test_account("earl")
    scenario.h3("MultiSig Proposal Contract")
    members = sp.set()
    members.add(alice.address)
    members.add(bob.address)
    members.add(charlie.address)
    members.add(earl.address)

    contract = main.MultiSigContract(members, 3)
    scenario += contract

    scenario.h3("Members can add funds to the contract")
    contract.deposit(_sender=alice.address, _amount=sp.tez(50))

    scenario.h3(
        "Members can submit a proposal for funds to be sent to an address - Proposal 1."
    )
    contract.submit_proposal(
        sp.record(paymentAmt=sp.tez(30), receiver=dani.address),
        _sender=alice.address
    )

    scenario.h3("Non-members cannot vote on proposals")
    contract.vote_on_proposal(_valid=False, _sender=dani.address)

    scenario.h3("Member 2 can vote on proposal")
    contract.vote_on_proposal(_sender=bob.address)

    scenario.h3("Member 3 can vote on proposal")
    contract.vote_on_proposal(_sender=charlie.address)

    scenario.h3("Contract balance should drop to 20tez after transfer")
    scenario.verify(contract.balance == sp.tez(20))

    scenario.h3("A New proposal can be created")
    contract.submit_proposal(
        sp.record(paymentAmt=sp.tez(20), receiver=dani.address),
        _sender=alice.address
    )

    scenario.h3("New proposal can be voted on")
    contract.vote_on_proposal(_sender=charlie.address)

```

This contract stores a big-map of proposals, each with an amount to pay, the account to pay, and information about who has voted for the proposal:

```smartpy
proposal_type: type = sp.big_map[
    sp.int,
    sp.record(
        paymentAmt=sp.mutez,
        receiver=sp.address,
        voters=sp.set[sp.address],
        votingComplete=sp.bool,
    ),
]
```

The `submit_proposal` entrypoint allows authorized users to submit a payment amount and an account address, which adds a proposal to the storage:

```smartpy
self.data.proposals[self.data.activeProposalId] = sp.record(
    paymentAmt=params.paymentAmt,
    receiver=params.receiver,
    voters={sp.sender},
    votingComplete=False,
)
```

Authorized accounts call the `vote_on_proposal` entrypoint to vote for the currently active proposal:

```smartpy
@sp.entrypoint
def vote_on_proposal(self):
    assert self.data.members.contains(sp.sender), "Not a Member of MultiSig"
    # check if the user has previously voted on the proposal
    assert not self.data.proposals[self.data.activeProposalId].voters.contains(
        sp.sender
    ), "Member has voted on this proposal"
    self.data.proposals[self.data.activeProposalId].voters.add(sp.sender)
```

Accounts that don't want to vote for the proposal don't need to do anything.

When the necessary number of votes have been reached, the `vote_on_proposal` entrypoint automatically sends the tez to the account in the proposal:

```smartpy
if (
    sp.len(self.data.proposals[self.data.activeProposalId].voters)
    == self.data.requiredVotes
):
    sp.send(
        self.data.proposals[self.data.activeProposalId].receiver,
        self.data.proposals[self.data.activeProposalId].paymentAmt,
    )
    self.data.proposals[self.data.activeProposalId].votingComplete = True
```

## Using multi-signature operations

You can also require operations to be signed by multiple accounts.
For example, the [Octez client](/developing/octez-client) has a built-in multisig contract that you can use.
The contract requires signatures from multiple accounts before running transactions such as :

- Distributing tez
- Changing the threshold
- Changing the accounts
- Setting the delegate of the contract
- Running arbitrary Michelson code

To originate the contract, you specify the accounts to include as authorized signers of the contract and the threshold, which is the number of accounts that are needed to authorize a transaction.
This example creates a contract with three members and a threshold of 2:

```bash
octez-client deploy multisig msig transferring 100 from my_account \
  with threshold 2 \
  on public keys alice bob charlie --burn-cap 1
```

To initiate a transaction, use the `octez-client prepare multisig transaction` command.
For example, this command initiates a transfer of 10 tez from the contract to Bob's account:

```bash
octez-client prepare multisig transaction on msig transferring 10 to bob
```

The response includes a string of bytes that the other accounts must sign, as in this example:

```
Bytes to sign: '0x05070707070a00000004af1864d90a0000001601af1399f7f3123697929b158b554f5dd697aa7e330007070001050502000000350320053d036d0743035d0a00000015000f2c3d65a941224c35fa05e965386726da7cab32031e0743036a0080dac409034f034d031b'
Blake 2B Hash: 'CmaXVZ2u7HxNGfSzw1Bu5vFEsoQs7YDPs5q6KH1g7HGG'
Threshold (number of signatures required): 2
Public keys of the signers:
  edpkuNgk7cbsBbuYCgbow7svichVJsVZ5pZ5DQ6Uv4aFCoA1gv1qaF
  edpktzDT3t9m2rSkrYbUycCHdvKVcK9MmcMffMRddHZKyxksUcnVXb
  edpkvGvA6b6KfdwH5Q8fyq9J3494Fw58BKKPgdei3QfvrrnLt5nd58
```

To sign the bytes, the other accounts run the `octez-client sign bytes` command.
For example, this code assigns the bytes to the `TO_SIGN` variable and signs them with two accounts:

```bash
TO_SIGN=$(octez-client prepare multisig transaction on msig transferring 10 to bob --bytes-only)
ALICE_S_SIGNATURE=$(octez-client sign bytes "$TO_SIGN" for alice | cut -d ' ' -f 2)
CHARLIE_S_SIGNATURE=$(octez-client sign bytes "$TO_SIGN" for charlie | cut -d ' ' -f 2)
```

Then you can use the two accounts' signatures to run the transaction:

```bash
octez-client run transaction "$TO_SIGN" \
  on multisig contract msig \
  on behalf of charlie \
  with signatures "$ALICE_S_SIGNATURE" "$CHARLIE_S_SIGNATURE"
```

The contract uses a counter to ensure that the signatures work only once.

For more information, run the command `octez-client man multisig` and see [Built-in multisig contracts](https://octez.tezos.com/docs/user/multisig.html) in the Octez documentation.

## Setting up multi-signature wallets

Some tools create wallets that can store tez and other tokens and manage the process of signing transactions.
For example, TzSafe provides a front-end application that lets you:

- Create a multisig wallet and store tez, FA1.2 tokens, and FA2 tokens in it
- Create proposals to transfer tokens
- Sign or reject proposals
- Run approved proposals

For more information about TzSafe, see https://docs.tzsafe.marigold.dev.

## Securing multisig contracts

Like all contracts, you must ensure ensure that multisig contracts won't become compromised or permanently blocked.

- Control the list of voters, how accounts can be added or removed, and how many votes are needed to approve a proposal
- Prevent users from blocking the contract by setting a time limit for proposals
- Prevent users from clogging the contract with too many proposals or submitting a new proposal before other users have time to vote on the current proposal

## More information

For more information on multisig contracts, see examples in the repository https://github.com/onedebos/multisig and an explanation in this video: https://www.youtube.com/watch?v=r9QrrSfJuVg.
