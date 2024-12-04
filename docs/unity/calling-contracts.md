---
title: Calling contracts with the Unity SDK
sidebar_label: Calling contracts
authors: Tim McMackin
last_update:
  date: 4 December 2024
---

Smart contracts are backend programs that run on blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

For more information about smart contracts on Tezos, see [Smart contracts](/smart-contracts).

The Unity SDK can call any deployed Tezos or Etherlink contract just like any other Tezos or EVM client can.

- To call a Tezos smart contract, the application must be connected to a Beacon or social wallet
- To call an Etherlink smart contract, the application must be connected to a WalletConnect contract

## Calling Tezos contracts

Smart contracts have one or more [entrypoints](/smart-contracts/entrypoints), which are the different ways that it can be called, similar to a method or function in programming languages or an endpoint in an API.
Therefore, to call a Tezos smart contract, you need:

- Its address, which starts with `KT1`
- The entrypoint to call
- The parameter to pass to the entrypoint, which must be in the format that the entrypoint expects
- An amount of tez tokens to send with the transaction, which can be zero or more

To call a contract, make sure that you are connected to a Beacon wallet.
Then create an `OperationRequest` object with that information and pass it to the `TezosAPI.RequestOperation()` method.
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
    // Verify that the app is connected to an EVM wallet via WalletConnect
    WalletProviderData walletProviderData = TezosAPI.GetWalletConnectionData();
    if (walletProviderData.WalletType != WalletType.BEACON && !TezosAPI.IsSocialLoggedIn()) {
        Debug.LogError("Connect to a Beacon or social wallet first.");
        return;
    }

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
        Debug.Log("Transaction hash: " + response.TransactionHash);
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

### Encoding parameters

Tezos entrypoint parameters must be in [Micheline](https://tezos.gitlab.io/shell/micheline.html) JSON format, which is the format that the Michelson language uses for values.
You can use the [Netezos](https://netezos.dev/) SDK to format Micheline parameters or construct them as JSON strings.

#### Encoding parameters with the Netezos Micheline SDK

Micheline primitives include:

- Integers, as in `new MichelineInt(1)`
- Strings, as in `new MichelineString("Hello")`
- Bytes, as in `new MichelineBytes(bytes")`

As described in [Complex data types](/smart-contracts/data-types/complex-data-types), Micheline values are organized as a series of nested pairs in tree and comb formats.
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

#### Encoding parameters as JSON strings

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

## Calling Tezos views

To call a [view](/smart-contracts/views), pass the address of the contract, the name of the view, and the Michelson-encoded parameter to the `TezosAPI.ReadView()` method.
You must set the return type on the `TezosAPI.ReadView()` method, as in this example for a view that returns a string:

```csharp
var result = await TezosAPI.ReadView<string>("KT1K46vZTMEe8bnacFvFQfgHtNDKniEauRMJ", "simple", "\"String value\"");
Debug.Log("View response: " + result);
```

If the return type is more complicated than a single primitive, you must create a type to represent the return type.
For example, the FA2 contract `KT1HP6uMwf829cDgwynZJ4rDvjLCZmfYjja1` has a view named `get_balance_of` that returns information about token owners.
Block explorers such as [tzkt.io](https://tzkt.io) show the parameter and return types for this view in JSON and Michelson format:

<img src="/img/unity/tzkt-balance-view.png" alt="Parameter and return types for the view" style={{width: 300}} />

The equivalent C# types look like these examples:

```csharp
private class ParameterType
{
    public string owner;
    public int    token_id;
}

private class ResponseType
{
    public Request request { get; set; }
    public string  balance { get; set; }
}

public class Request
{
    public string owner    { get; set; }
    public string token_id { get; set; }
}
```

This example shows how to use these types to call the view and receive the response:

```csharp
var parameter = new List<ParameterType>
{
    new()
    {
        owner    = "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
        token_id = 0
    },
    new()
    {
        owner    = "tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD",
        token_id = 0
    }

};

var json = await TezosAPI.ReadView<List<ResponseType>>(
    "KT1HP6uMwf829cDgwynZJ4rDvjLCZmfYjja1", "get_balance_of", parameter
);

foreach (var item in json)
{
    Debug.Log($"The account {item.request.owner} has {item.balance} tokens of type {item.request.token_id}");
}
```

## Calling Etherlink contracts

Like Tezos contracts, Etherlink smart contracts have functions that clients can call.
To call an Etherlink smart contract, you need:

- Its address
- The entrypoint to call
- The contract's application binary interface (ABI), which is a description of the contract's interface; you can get the ABI from the tool that deployed the contract or by compiling the source code of the contract in a tool such as the [Remix IDE](https://remix.ethereum.org/)
- The parameter to pass to the entrypoint
- An amount of XTZ to send with the transaction, which can be zero or more

The Unity SDK uses the [Reown SDK](https://reown.com/), so before you can access Etherlink, you must set up Reown:

1. At https://cloud.reown.com, create a Reown project and get its ID.

1. In Unity, install the WalletConnect SDK from the Git URL `https://github.com/trilitech/tezos-wallet-connect-unity-sdk.git`.

1. In the `Assets/Tezos/Resources/WalletConnectConfig.asset` object, in the **Project Id** field, add the ID of your Reown project and fill in the other fields with information including the name and URL of your application, as in this example:

   <img src="/img/unity/unity-walletconnect-config.png" alt="Setting the Reown project ID on the WalletConnectConfig object" style={{width: 300}} />

Now you can interact with Etherlink contracts with the Reown SDK.

To call a contract, make sure that you are connected to a WalletConnect wallet.
Then use the `AppKit.Evm.WriteContractAsync()` method to call the contract.

For example, this code calls a contract and passes the parameter `5` to its `set` entrypoint.
When the transaction completes successfully, it logs the hash of the transaction.
You can use this hash to look up information about the transaction in the Etherlink [block explorer](/developing/information/block-explorers).

<!-- TODO: How do I set the network? -->

```csharp
using Reown.AppKit.Unity;

public class MyScripts : MonoBehaviour
{

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
        // Verify that the app is connected to an EVM wallet via WalletConnect
        WalletProviderData walletProviderData = TezosAPI.GetWalletConnectionData();
        if (walletProviderData.WalletType != WalletType.WALLETCONNECT) {
            Debug.LogError("Connect to a WalletConnect wallet first.");
            return;
        }

        try
        {
            string contractAddress = "0xfac1791E9db153ef693c68d142Cf11135b8270B9";
            string ABI = "[ { \"inputs\": [], \"name\": \"get\", \"outputs\": [ { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" } ], \"stateMutability\": \"view\", \"type\": \"function\" }, { \"inputs\": [ { \"internalType\": \"uint256\", \"name\": \"x\", \"type\": \"uint256\" } ], \"name\": \"set\", \"outputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"function\" } ]";
            string entrypoint = "set";

            var result = await AppKit.Evm.WriteContractAsync(contractAddress, ABI, entrypoint, "5");

            Debug.Log("Result: " + result);
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

}
```

The Tezos Unity SDK supports these Reown SDK methods, but only for calls to Etherlink, not any other EVM chain:

- `AppKit.Evm.ReadContractAsync()`
- `AppKit.Evm.WriteContractAsync()`
- `AppKit.Evm.SendTransactionAsync()`
- `AppKit.Evm.SendRawTransactionAsync()`

For more information about using the Reown SDK, see https://docs.reown.com/appkit/unity/core/usage.
