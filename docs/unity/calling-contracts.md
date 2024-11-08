---
title: Calling contracts with the Unity SDK
sidebar_label: Calling contracts
authors: Tim McMackin
last_update:
  date: 6 November 2024
---

Smart contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

For more information about contracts, see [Smart contracts](/smart-contracts).

The Unity SDK can call any deployed Tezos contract just like any other Tezos client can.

## Calling contracts

To call a contract, create an `OperationRequest` object with the parameters for the transaction and pass it to the `TezosAPI.RequestOperation()` method.
For example, this function calls a contract and passes the parameter `4` to its `increment` entrypoint:
<!-- TODO what to do if the param is a complex Michelson expression? -->

```csharp
public async void SendTransaction()
{
    try
    {
      var request = new OperationRequest
      {
          // Contract to call
          Destination = "KT1R2LTg3mQoLvHtUjo2xSi7RMBUJ1sJkDiD",
          // Entrypoint to call
          EntryPoint = "increment",
          // Parameter to pass, as a Michelson expression
          Arg = "4",
          // Amount of tez to send with the transaction
          Amount = "0",
        };

        var response = await TezosAPI.RequestOperation(request);
        Debug.Log($"Transaction hash: {response.TransactionHash}");
    }
    catch (Exception e) when (e is WalletOperationRejected or SocialOperationFailed)
    {
        Debug.LogError($"Operation failed: {e.Message}");
    }
    catch (Exception e)
    {
        Debug.LogError($"Unexpected error during operation: {e.Message}");
    }

}
```

The response includes the hash of the operation, which you can use to look up the status of the transaction.

## Calling views

To call a [view](/smart-contracts/views), pass the address of the contract, the name of the view, and the Michelson-encoded parameter to the `TezosAPI.ReadView()` method.
You must set the return type on the `TezosAPI.ReadView()` method, as in this example for a view that returns a string:

```csharp
var result = await TezosAPI.ReadView<string>("KT1K46vZTMEe8bnacFvFQfgHtNDKniEauRMJ", "simple", "\"String value\"");
Debug.Log("View response: " + result);
```
