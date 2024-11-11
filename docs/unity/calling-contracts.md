---
title: Calling contracts with the Unity SDK
sidebar_label: Calling contracts
authors: Tim McMackin
last_update:
  date: 11 November 2024
---

Smart contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

For more information about contracts, see [Smart contracts](/smart-contracts).

The Unity SDK can call any deployed Tezos contract just like any other Tezos client can.

## Calling contracts

Smart contracts have one or more [entrypoints](/smart-contracts/entrypoints), which are the different ways that it can be called, similar to a method or function in programming languages or an endpoint in an API.
Therefore, to call a smart contract, you need:

- Its address, which starts with `KT1`
- The entrypoint to call
- The parameter to pass to the entrypoint, which must be in the format that the entrypoint expects
- An amount of tez tokens to send with the transaction, which can be zero or more

To call a contract, create an `OperationRequest` object with that information and pass it to the `TezosAPI.RequestOperation()` method.
For example, this code calls a contract and passes the parameter `5` to its `increment` entrypoint.
When the transaction completes successfully, it logs the hash of the transaction.
You can use this hash to look up information about the transaction in a [block explorer](/developing/information/block-explorers).

```csharp
private async void Awake()
{
    await TezosAPI.WaitUntilSDKInitialized();

    _connectButton.onClick.AddListener(OnConnectClicked);
    _disconnectButton.onClick.AddListener(OnDisconnectClicked);
    _requestOperationButton.onClick.AddListener(OnRequestOperationClicked);

    TezosAPI.OperationResulted += OperationResulted;
}

private async void OnRequestOperationClicked()
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
            Arg = new MichelineInt(5).ToJson(),
            // Amount of tez to send with the transaction
            Amount = "0",
        };
        var response = await TezosAPI.RequestOperation(request);
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

private void OperationResulted(OperationResponse operationResponse)
{
    Debug.Log("Transaction hash: " + operationResponse.TransactionHash);
}
```

## Calling views

To call a [view](/smart-contracts/views), pass the address of the contract, the name of the view, and the Michelson-encoded parameter to the `TezosAPI.ReadView()` method.
You must set the return type on the `TezosAPI.ReadView()` method, as in this example for a view that returns a string:

```csharp
var result = await TezosAPI.ReadView<string>("KT1K46vZTMEe8bnacFvFQfgHtNDKniEauRMJ", "simple", "\"String value\"");
Debug.Log("View response: " + result);
```
