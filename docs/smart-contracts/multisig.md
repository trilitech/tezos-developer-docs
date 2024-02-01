---
title: Multi-signature contracts
authors: Tim McMackin
last_update:
  date: 1 February 2024
---

Multi-signature (or multisig) contracts require multiple accounts to vote on operations before running them.
They have many applications, including:

- Governance: DAOs and other groups can use them to vote on the actions that the organization takes.
- Funds distribution: Accounts can vote on where funds are sent.
- Security: Requiring multiple signatures can prevent a single compromised wallet from doing malicious things.

## Using proposals

One common way to create a multisig contract is to allow authorized users to submit a proposal that other authorized users can vote on.
For example [this multisig contract](https://github.com/onedebos/multisig/blob/main/multisig.py) stores tez and allows users to propose and vote on the account that should receive the tez.
It stores a big-map of proposals, each with an amount to pay, the account to pay, and information about who has voted for the proposal:

```python
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

```python
self.data.proposals[self.data.activeProposalId] = sp.record(
    paymentAmt=params.paymentAmt,
    receiver=params.receiver,
    voters=sp.set(sp.sender),
    votingComplete=False,
)
```

Authorized accounts call the `vote_on_proposal` entrypoint to vote for the currently active proposal:

```python
assert self.data.members.contains(sp.sender), "Not a Member of MultiSig"
# Check if the user has previously voted on the proposal
assert not self.data.proposals[self.data.activeProposalId].voters.contains(
    sp.sender
), "Member has voted on this proposal"
# Add the user's vote for the proposal
self.data.proposals[self.data.activeProposalId].voters.add(sp.sender)
```

Accounts that don't want to vote for the proposal don't need to do anything.

When the necessary number of votes have been reached, the `vote_on_proposal` entrypoint automatically sends the tez to the account in the proposal:

```python
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

## Securing multisig contracts

Like all contracts, you must ensure ensure that multisig contracts won't become compromised or permanently blocked.

- Control the list of voters, how accounts can be added or removed, and how many votes are needed to approve a proposal
- Prevent users from blocking the contract by setting a time limit for proposals
- Prevent users from clogging the contract with too many proposals or submitting a new proposal before other users have time to vote on the current proposal

## More information

For more information on multisig contracts, see examples in the repository https://github.com/onedebos/multisig and an explanation in this video: https://www.youtube.com/watch?v=r9QrrSfJuVg.
