---
title: "Step 2: Set up a baker account"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 19 August 2024
---

The baker needs a user account that stakes tez.
In this section, you use the Octez client to create an account, register it as a delegate, and stake tez with it.

1. Connect the Octez client to your node by running this command:

   ```bash
   octez-client -E http://localhost:8732 config update
   ```

   If you see an error that says "Failed to acquire the protocol version from the node," ensure that your node is running and verify that the host name and port in the `config update` command are correct.

1. Make sure that the installation of the Octez client is using your node by running this command:

   ```bash
   octez-client bootstrapped
   ```

   The client waits until it is connected and the node is running at the current level.
   When it is connected and the node is updated, the command prints the message `Node is bootstrapped`.
   The time it takes depends on how many blocks the node must retrieve to catch up from the snapshot to the current head block.

1. Optional: Hide the Octez client's network warning message by running this command:

   ```bash
   export TEZOS_CLIENT_UNSAFE_DISABLE_DISCLAIMER=y
   ```

   This command suppresses the message that your instance of the Octez client is not using Mainnet.

1. Create or import an account in the Octez client.
The simplest way to get an account is to use the Octez client to randomly generate an account.
This command creates an account and associates it with the `my_baker` alias:

   ```bash
   octez-client gen keys my_baker
   ```

   The address of the generated account can be obtained with the following command:

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

1. Verify that the faucet sent the tez to the account with the same `get balance` command:

   ```bash
   octez-client get balance for my_baker
   ```

   If the balance still shows 0, the local node may not be ready yet.
   In this case you can temporarily use the public RPC endpoint.

   When the account receives its tez, it owns enough stake to bake but has still no consensus or DAL rights because it has not declared its intention to become a baker.

1. Register your account as a delegate by running the following command:

   ```bash
   octez-client register key my_baker as delegate
   ```

1. Stake at least 6,000 tez, saving a small amount for transaction fees,by running this command:

   ```bash
   octez-client stake 6000 for my_baker
   ```

Now the account has staked enough tez to earn the right to make attestations, including attestations that data is available on the DAL.
However, it does not receive these rights until the baking daemon is running and a certain amount of time has passed.

While you wait for attestation rights, continue to [Step 3: Run an Octez DAL node](/tutorials/join-dal-baker/run-dal-node).
