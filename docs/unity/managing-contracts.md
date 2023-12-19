---
title: Managing contracts
authors: Tim McMackin
last_update:
  date: 18 December 2023
---

Smart contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

For more information about contracts, see [Smart contracts](../smart-contracts).

You can create your own smart contracts or use the built-in contract that the SDK provides for managing tokens in Unity projects.

The Contract tutorial scene shows how to deploy a copy of the built-in contract from a Unity project.

## The built-in contract

The SDK includes a built-in contract that you can use to manage tokens for your Unity projects.

The contract has entrypoints that allow you to create and transfer tokens.
See [Managing tokens](./managing-tokens).

The Michelson source code of the built-in contract is in the `Resources/Contracts` folder of the SDK, but it isn't very human-readable.
For a list of the entrypoints in the contract, see [TokenContract object](./reference/TokenContract).

## Deploying the built-in contract

To deploy the built-in contract, call the [`TokenContract.Deploy()`](./reference/TokenContract#deploy) method and pass a callback function:

```csharp
public void DeployContract()
{
    TezosManager
        .Instance
        .Tezos
        .TokenContract
        .Deploy(OnContractDeployed);
}

private void OnContractDeployed(string contractAddress)
{
    Debug.Log(contractAddress);
}
```

The project sends the deployment transaction to the connected wallet, which must approve the transaction and pay the related fees.
The callback function receives the address of the deployed contract, which the project uses to send requests to the contract.
It can take a few minutes for the contract to deploy and be confirmed in multiple blocks on the blockchain.

The address that deployed the contract becomes the administrator of the contract and is the only account that can create tokens.

The SDK provides information about the contract such as its address in the [`TokenContract`](./reference/TokenContract) object.
You can use block explorers such as [Better Call Dev](https://better-call.dev/) to see information about the deployed contract.

For information about using the built-in contract, see [Managing tokens](./managing-tokens).

## Getting the contract address

When you deploy a contract with the [`TokenContract.Deploy()`](./reference/TokenContract#deploy) method, the SDK saves the contract address by running this code:

```csharp
PlayerPrefs.SetString("CurrentContract:" + Tezos.Wallet.GetActiveAddress(), contractAddress);
```

Then during SDK initialization, the SDK saves the address to the [`TokenContract.Address`](./reference/TokenContract) property.

To retrieve the address of contracts that you haven't deployed through the project, you can use the [`API.GetOriginatedContractsForOwner()`](./reference/API#getoriginatedcontractsforowner) method or use another way of getting the contract address.

## Calling contracts

The built-in contract has convenience methods for minting and transferring tokens; see [Managing tokens](./managing-tokens).

To call the contract's other entrypoints, use the [`Wallet.CallContract()`](./reference/Wallet#callcontract) method.
For example, to call the contract's `set_administrator` entrypoint to set a new administrator account, use this code:

```csharp
TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
    entryPoint: "set_administrator",
    input: new MichelineString(newAdminAddress).ToJson()
);
```

For information about the entrypoints in the built-in contract, see [Unity SDK TokenContract object](./reference/TokenContract#entrypoints).

You can call any other contract by using its address, entrypoint name, and parameter value, as in this example:

```csharp
TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: address,
    entryPoint: entryPointName,
    input: new MichelineInt(12).ToJson()
);
```

This example passes the value 12 to the entrypoint in the variable `entryPointName`.

Note that the parameter is encoded as a Michelson value.
For information about encoding more complex parameters, see [Encoding parameters](#encoding-parameters).

To get the hash of the transaction, use the `ContractCallCompleted` event.

## Encoding parameters

When you call contract entrypoints or views with `Wallet.CallContract()` or `Wallet.ReadView()`, you must encode the parameter as a Micheline value.
For example, if an entrypoint accepts two integers and one string as parameters, you must pass a list of two `Netezos.Encoding.MichelineInt` values and one `Netezos.Encoding.MichelineString` value:

```csharp
var input = new MichelinePrim
{
    Prim = PrimType.Pair,
    Args = new List<IMicheline>
    {
        new MichelineInt(1),
        new MichelineInt(2),
        new MichelineString("My string value")
    }
}.ToJson();

TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: address,
    entryPoint: entryPointName,
    input: input
);
```

You can also use the value of the parameters in Michelson JSON.
The previous example looks like this with a JSON parameter value:

```csharp
var input = @"{
    ""prim"": ""Pair"",
    ""args"": [
        {
        ""int"": ""1""
        },
        {
        ""prim"": ""Pair"",
        ""args"": [
            {
            ""int"": ""2""
            },
            {
            ""string"": ""My string value""
            }
        ]
      }
    ]
}";

TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: address,
    entryPoint: entryPointName,
    input: input
);
```

Some block explorers allow you to fill in parameter values for an entrypoint and then download the Michelson JSON to use in your code.

You can build more complex parameters out of `Netezos.Encoding` objects.
For example, the built-in contract has an entrypoint named `update_operators`, which is an FA2 standard entrypoint that gives an account control over another account's tokens.
It accepts a list of changes to make to token operators, each including these fields in this order:

- Either "add_operator" or "remove_operator"
- The address of the operator, which will be able to control the owner's tokens of the specified ID.
- The ID of the token
- The address of the token owner

This is the Michelson parameter type for the endpoint:

```
(list %update_operators (or
  (pair %add_operator (address %owner)
    (pair (address %operator)
          (nat %token_id)))
  (pair %remove_operator (address %owner)
    (pair
      (address %operator)
      (nat %token_id)))))
```

In this case, you set the "add_operator" value by passing a `PrimType.Left` Michelson primitive or the "remove_operator" value by passing a `PrimType.Right` primitive.
The values in the primitive are a series of nested pairs called a [right comb](../smart-contracts/data-types/complex-data-types#right-combs), as in this example:

```json
{
  "prim": "LEFT",
  "args": [
    {
      "prim": "Pair",
      "args": [
        {
          "string": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx"
        },
        {
          "prim": "Pair",
          "args": [
            {
              "string": "tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD"
            },
            {
              "int": "1"
            }
          ]
        }
      ]
    }
  ]
}
```

The code to create a list of these elements to pass to the entrypoint looks like this:

```csharp
var operatorAddress = "tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD";
var ownerAddress = "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx";
int[] tokenIds = {1, 2, 3};

var operatorArray = new MichelineArray();
foreach (var tokenId in tokenIds)
{
    operatorArray.Add(new MichelinePrim
    {
        Prim = PrimType.Left,
        Args = new List<IMicheline>
        {
            new MichelinePrim
            {
                Prim = PrimType.Pair,
                Args = new List<IMicheline>
                {
                    new MichelineString(ownerAddress),
                    new MichelinePrim
                    {
                        Prim = PrimType.Pair,
                        Args = new List<IMicheline>
                        {
                            new MichelineString(operatorAddress),
                            new MichelineInt(tokenId)
                        }
                    }

                }
            }
        }
    });
};

TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: address,
    entryPoint: "update_operators",
    input: operatorArray.ToJson()
);
```

## Deploying other contracts

To deploy a contract from Unity, you must compile the contract to Michelson in JSON format.
For example, to compile a contract in LIGO to Michelson JSON, run this code:

```bash
ligo compile contract MyContract.jsligo \
  -m MyContract -o MyContract.json --michelson-format json
```

Then, ensure that the code of the code and initial storage value of the contract are wrapped in `code` and `storage` fields at the root of the file, as in this example:

```json
{
  "code": [
    {
      "prim": "parameter",
      "args": [
        ...
    },
  ],
  "storage": {
    "int": "0"
  }
}
```

To deploy the contract from the Unity project, use the [`Wallet.OriginateContract()`](./reference/Wallet#originatecontract) method, as in this example:

```csharp
var contractJSON = Resources.Load<TextAsset>("Contracts/MyContract").text;
TezosManager.Instance.Tezos.Wallet.OriginateContract(contractJSON);
```

To get the address of the deployed contract, use the `ContractCallCompleted` event.


<!-- TODO:
- Can you deploy a contract for each user?
- Managing multiple contracts?
-->
