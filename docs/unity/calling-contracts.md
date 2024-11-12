---
title: Calling contracts with the Unity SDK
sidebar_label: Calling contracts
authors: Tim McMackin
last_update:
  date: 12 November 2024
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

## Encoding parameters

Entrypoint parameters must be in [Micheline](https://tezos.gitlab.io/shell/micheline.html) JSON format, which is the format that the Michelson language uses for values.
You can use the [Netezos](https://netezos.dev/) SDK to format Micheline parameters or construct them as JSON strings.

### Encoding parameters with the Netezos Micheline SDK

Micheline primitives include:

- Integers, as in `new MichelineInt(1)`
- Strings, as in `new MichelineString("Hello")`
- Bytes, as in `new MichelineBytes(bytes")`

As described in [Complex data types](/smart-contracts/data-types/conplex-data-types), Micheline values are organized as a series of nested pairs in tree and comb formats.
For example, if an entrypoint accepts an integer, a string, and a series of bytes as a nested pair, you can format the parameter like this:

```csharp
string myStringToBytes = "Hello!";
var bytes = new byte[myStringToBytes.Length];

for (var i = 0; i < myStringToBytes.Length; i++)
{
    bytes[i] = (byte)myStringToBytes[i];
}

var parameter = new MichelinePrim
{
    Prim = PrimType.Pair,
    Args = new List<IMicheline>
    {
        new MichelineInt(1),
        new MichelineString("Hello"),
        new MichelineBytes(bytes)
    }
}.ToJson();

var request = new OperationRequest
{
    Destination = "KT1PB9rp17qfL6RQR9ZUsKMm3NvbSoTopnwY",
    EntryPoint = "intStringBytes",
    Arg = parameter,
    Amount = "0",
};
var response = await TezosAPI.RequestOperation(request);
```

### Encoding parameters as JSON strings

Because the `Arg` field of the `OperationRequest` object accepts a JSON string, you can also use a raw Micheline-formatted JSON string.
For example, the `MichelinePrim` object in the previous example looks like this as a string:

```json
{
  "prim": "Pair",
  "args": [
    {
      "int": "1"
    },
    {
      "string": "Hello"
    },
    {
      "bytes": "48656c6c6f21"
    }
  ]
}
```

Therefore, you can create a string literal with this JSON, escaping characters as necessary, and use it in the `OperationRequest` object, as in this example:

```csharp
var jsonString = "{\"prim\":\"Pair\",\"args\":[{\"int\":\"1\"},{\"string\":\"Hello\"},{\"bytes\":\"48656c6c6f21\"}]}";

var request = new OperationRequest
{
    Destination = "KT1PB9rp17qfL6RQR9ZUsKMm3NvbSoTopnwY",
    EntryPoint = "intStringBytes",
    Arg = jsonString,
    Amount = "0",
};
```

Block explorers can help you format parameters.
For example, assume an entrypoint that accepts a parameter that consists of a string followed by any number of pairs of an integer and a string.
If you fill in values for this parameter on the **Interact** tab of [Better Call Dev](https://better-call.dev) and click **Execute > Raw JSON**, it shows this Micheline value in JSON format:

```json
{
  "prim": "Pair",
  "args": [
    {
      "string": "My string"
    },
    [
      {
        "prim": "Pair",
        "args": [
          {
            "int": "5"
          },
          {
            "string": "String one"
          }
        ]
      },
      {
        "prim": "Pair",
        "args": [
          {
            "int": "9"
          },
          {
            "string": "String two"
          }
        ]
      },
      {
        "prim": "Pair",
        "args": [
          {
            "int": "12"
          },
          {
            "string": "String three"
          }
        ]
      }
    ]
  ]
}
```

You can convert this JSON to a string and use it in the parameter instead of constructing the JSON with Netezos objects.

## Calling views

To call a [view](/smart-contracts/views), pass the address of the contract, the name of the view, and the Michelson-encoded parameter to the `TezosAPI.ReadView()` method.
You must set the return type on the `TezosAPI.ReadView()` method, as in this example for a view that returns a string:

```csharp
var result = await TezosAPI.ReadView<string>("KT1K46vZTMEe8bnacFvFQfgHtNDKniEauRMJ", "simple", "\"String value\"");
Debug.Log("View response: " + result);
```
