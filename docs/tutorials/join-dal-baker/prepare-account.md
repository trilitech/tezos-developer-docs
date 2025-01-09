---
title: "Step 2: Set up baker accounts"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 8 January 2025
---

In this section you use the Octez client to set up two accounts for your baker:

- The baker key itself (also called the manager key) stakes tez and registers as a delegate
- The consensus key is the key that the baker uses to sign attestations, which are generally referred to as _consensus operations_

## Why set up a consensus key?

Using a separate consensus key is not required but it is good security practice.
Signing consensus operations incurs no fees, so you can set up a consensus key with no tez.
You can generate and use this key on a remote machine that runs the baker and keep the baker key with your staked tez in a more secure location to reduce risk to your funds.
This prevents you from having to move private keys between machines, which is inherently dangerous.

If the consensus key is compromised or lost, you can create a new consensus key and switch the baker to it without changing how your tez is staked and delegated and without moving your delegators and stakers to a new account.
In this way you can avoid transferring or backing up the consensus key or you can store it in a Key Management System (KMS) or Hardware Security Module (HSM) where no one has access to its private key.

However, the consensus key can drain the liquid (unstaked) tez from the baker key, so you must keep the consensus key secure like all other keys.

For more information about consensus keys, see [Consensus key](https://tezos.gitlab.io/user/key-management.html#consensus-key) in the Octez documentation.

## Creating the accounts

In this section, you use the Octez client to create these two accounts and set them up for baking.

1. Create or import an account in the Octez client to be the baker account (sometimes called the "manager" account).
The simplest way to get an account is to use the Octez client to randomly generate an account.
This command creates an account and associates it with the `my_baker` alias:

   ```bash
   octez-client gen keys my_baker
   ```

   You can get the address of the generated account with this command:

   ```bash
   octez-client show address my_baker
   ```

   At this point, the balance of the `my_baker` account is still zero, as you can see by running this command:

   ```bash
   octez-client get balance for my_baker
   ```

1. Get at least 6,000 tez from the Ghostnet faucet.

   The account must stake tez to get consensus and DAL rights.
   To get tez, use the Ghostnet faucet linked from https://teztnets.com/ghostnet-about to send tez to the baker account.

   Running a baker requires staking at least 6,000 tez, but the more tez it stakes, the more rights it gets and the less time it has to wait to produce blocks and make attestations.
   However, be aware that, for protecting abuses of the faucet, getting such amounts of tez from the faucet may take a long time (e.g. more than one hour). Consequently, some individual requests may occasionally time out or fail and need to be relaunched.

1. Verify that the faucet sent the tez to the account with the same `get balance` command:

   ```bash
   octez-client get balance for my_baker
   ```

   If the balance still shows 0, the local node may not be ready yet.
   In this case you can temporarily use the public RPC endpoint.

   When the account receives its tez, it owns enough stake to bake but has still no consensus or DAL rights because it has not declared its intention to become a baker.

1. (Optional) Set up a separate account to be the consensus key.
This command creates an account and associates it with the `consensus_key` alias:

   ```bash
   octez-client gen keys consensus_key
   ```

   This account does not need any tez.

1. Register the baker account as a delegate and set its consensus key by running the following command:

   ```bash
   octez-client register key my_baker as delegate with consensus key consensus_key
   ```

1. Stake at least 6,000 tez, saving a small amount for transaction fees, by running this command:

   ```bash
   octez-client stake 6000 for my_baker
   ```

Now the baker account has staked enough tez to earn the right to make attestations, including attestations that data is available on the DAL.
Its consensus key is authorized to sign consensus operations on its behalf.
However, the baker account does not receive these rights until a certain amount of time has passed.

While you wait for attestation rights, continue to [Step 3: Run an Octez DAL node](/tutorials/join-dal-baker/run-dal-node).
