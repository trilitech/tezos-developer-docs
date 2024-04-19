---
title: "Part 4: Customizing operations"
authors: Tim McMackin
last_update:
  date: 19 April 2024
---

When you use the SmartPy FA2 library, you can't customize the FA2-required entrypoints directly.
These entrypoints should run according to the standard.

However, you can customize the contract by adding your own entrypoints.
In this part, you add an entrypoint that allows users to exchange one token for another.
To convert one token into another, the entrypoint follows these general steps:

1. Verify that the source and target tokens are defined.
1. Burn the source tokens by decreasing the amount in the ledger for the account or fail if the account doesn't have enough.
1. Mint the target tokens by increasing the amount in the ledger for the account.

The burn and mint steps are straightforward as long as you understand how FA2 contracts store information in their ledger.
As described in [Part 1](./basic-fa2-token), the contract stores information about who owns tokens in a key-value store:

- The key is a pair that contains the address of the owner and the ID of the token
- The value is the quantity of tokens

In table format, the ledger might look like this after some mint and burn transactions:

key | value
--- | ---
Alice, token ID 0 | 10
Alice, token ID 1 | 2
Alice, token ID 2 | 1
Alice, token ID 4 | 5
Bob, token ID 1 | 2
Bob, token ID 2 | 8
Bob, token ID 3 | 14

That means that to get the amount of the source token that an account has, you must put together a pair to use as the index.
For example, the code `(sp.sender, source_token_id)` creates a pair where the first item is the account that directly sent this transaction to the contract and the other is a variable that represents the ID of the token type.

## Tutorial contract

The completed contract that you create in this part is at [part_4_complete.py](https://github.com/trilitech/tutorial-applications/blob/smartpy-fa2-tutorial/smartpy_fa2_fungible/part_4_complete.py).

## Exchanging one token for another

Follow these steps to create the `convert` entrypoint that exchanges one token for another:

1. At the beginning of the module, after the `def my_module():` statement but before the `class` statement, add a type that represents the parameter for the entrypoint:

   ```smartpy
   conversion_type: type = sp.record(
       source_token_id = sp.nat,  # The ID of the source token
       target_token_id = sp.nat, # The ID of the target token
       amount = sp.nat, # The number of source tokens to convert
   )
   ```

   You could structure this parameter differently, but this is a simple way to do it.
   The parameter includes the ID of the source token, the ID of the token to convert it into, and the amount of tokens to convert.

1. After the `__init__()` function, add an entrypoint with the `@sp.entrypoint` annotation:

   ```smartpy
   # Convert one token into another
   @sp.entrypoint
   def convert(self, conversion):
   ```

1. Accept a parameter of the type you created in the first step and destructure it into individual variables:

   ```smartpy
   sp.cast(conversion, conversion_type)
   record(source_token_id, target_token_id, amount).match = conversion
   ```

1. Add this code to verify that the contract's security policy allows transfers (which it does by default) and that the source and target token exist:

   ```smartpy
   # Verify that transfers are allowed
   assert self.private.policy.supports_transfer, "FA2_TX_DENIED"
   # Verify that the source and target tokens exist
   assert self.is_defined_(source_token_id), "FA2_TOKEN_UNDEFINED"
   assert self.is_defined_(target_token_id), "FA2_TOKEN_UNDEFINED"
   ```

1. Create a pair that represents the key for the source token type:

   ```smartpy
   # Get a pair to represent the key for the ledger for the source tokens
   from_source = (sp.sender, source_token_id)
   ```

   Note that this code uses `sp.sender` instead of `sp.source` to identify the account that sent the transaction.
   The source is the account that initiated the original transaction that led to this entrypoint call, while the sender is the account that made the call that led directly to this entrypoint call.
   Using sender here is important to prevent other contracts from accepting a transaction from an account and then sending other transactions impersonating that account.
   For more information, see [Avoiding flaws](https://opentezos.com/smart-contracts/avoiding-flaws) on opentezos.com.

1. Add this code to burn the source tokens:

   ```smartpy
   # Burn the source tokens
   self.data.ledger[from_source] = sp.as_nat(
       self.data.ledger.get(from_source, default=0) - amount,
       error="FA2_INSUFFICIENT_BALANCE",
   )
   is_supply = sp.is_nat(
       self.data.supply.get(source_token_id, default=0) - amount
   )
   with sp.match(is_supply):
       with sp.case.Some as supply:
           self.data.supply[source_token_id] = supply
       with None:
           self.data.supply[source_token_id] = 0
   ```

   This code uses the key from the previous step to subtract the tokens from the ledger entry.
   Then it updates the contract storage with the total number of that type of token remaining.

1. Add this code to create a pair that represents the key for the target token type:

   ```smartpy
   # Get a pair to represent the key for the ledger for the target tokens
   from_target = (sp.sender, target_token_id)
   ```

1. Add this code to mint the target tokens:

   ```smartpy
   # Mint the target tokens
   is_target = self.data.ledger.get_opt(from_target)
   with sp.match(is_target):
       with sp.case.Some as target_amount:
           self.data.ledger[from_target] = amount + target_amount
       with None:
           self.data.ledger[from_target] = amount
   self.data.supply[target_token_id] += amount
   ```

   This code attempts to retrieve the record by the pair in the previous step.
   If it exists, the code adds the number of tokens to the existing amount.
   If not, it creates a new record in the ledger.
   Finally, it increases the supply of that token.

1. At the end of the file, add this test to verify that a user can convert their own tokens:

   ```smartpy


   scenario.h2("Convert tokens")

   # Verify that you can convert your own tokens
   contract.convert(
       sp.record(source_token_id = 0, target_token_id = 1, amount = 2),
       _sender=alice
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=0)) == 8
   )
   scenario.verify(
       _get_balance(contract, sp.record(owner=alice.address, token_id=1)) == 5
   )
   scenario.verify(_total_supply(contract, sp.record(token_id=0)) == 12)
   scenario.verify(_total_supply(contract, sp.record(token_id=1)) == 16)
   ```

That's all that's necessary to convert one fungible token into another.
if you wanted to extend this feature, you could implement an exchange rate, take a fee for converting tokens, or allow only certain accounts to convert tokens.

If you want to, you can deploy this new contract to the mockup mode with the same commands as in [Part 1: Setting up a simple FA2 token](./basic-fa2-token) and try it out locally.
In the next section, you deploy it to a test network.
