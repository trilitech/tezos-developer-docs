---
title: Managing contracts
authors: Tim McMackin
last_update:
  date: 12 December 2023
---

Smart contracts are backend programs that run on the Tezos blockchains.
Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

For more information about contracts, see [Smart contracts](../../smart-contracts).

You can create your own smart contracts or use the built-in contract that the SDK provides for managing tokens in Unity projects.

The Contract example scene shows how to deploy a copy of the built-in contract from a Unity project.

## The built-in contract

The SDK includes a built-in contract that you can use to manage tokens for your Unity projects.

The contract has entrypoints that allow you to create and transfer tokens.
See [Managing tokens](./managing-tokens).

The Michelson source code of the built-in contract is in the `Resources/Contracts` folder of the SDK, but it isn't very human-readable.

## Deploying the built-in contract

To deploy the built-in contract, call the [`TokenContract.Deploy()`](../../reference/unity/TokenContract#deploy) method and pass a callback function:

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

The SDK provides information about the contract such as its address in the [`TokenContract`](../../reference/unity/TokenContract) object.
You can use block explorers such as [Better Call Dev](https://better-call.dev/) to see information about the deployed contract.

For information about using the built-in contract, see [Managing tokens](./managing-tokens).

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

To deploy the contract from the Unity project, use the [`Wallet.OriginateContract()`](../../reference/unity/Wallet#originatecontract) method, as in this example:

```csharp
var contractJSON = Resources.Load<TextAsset>("Contracts/MyContract").text;
TezosManager.Instance.Tezos.Wallet.OriginateContract(contractJSON);
```

To get the address of the deployed contract, use the `ContractCallCompleted` event.

## Calling other contracts

The built-in contract provides convenience methods that you can use to interact with it.
See [Managing tokens](./managing-tokens).

To call any other contract, you need its source code in Michelson JSON format.
You can retrieve the code of a deployed contract by passing its address to the [TZKT](https://api.tzkt.io/) API, as in this example:

```bash
curl https://api.ghostnet.tzkt.io/v1/contracts/KT1T1saRmmTQcvpPVLiWzQ5FaMzAwkgwND8J/code
```

Then you can call the contract by assembling a `Netezos.Contracts.ContractScript` object that represents the contract and building a parameter out of the entrypoint to call and the value to pass to it, as in this example:

```csharp
using Netezos.Contracts;
using Netezos.Encoding;
using Newtonsoft.Json.Linq;

...

// Use Michelson JSON of the contract code
var contractJSON = Resources.Load<TextAsset>("Contracts/MyContract").text;
var code = JObject
    .Parse(contractJSON)
    .SelectToken("code");

// Create a `Netezos.Contracts.ContractScript` to represent the contract
var contract = new ContractScript(Micheline.FromJson(code.ToString()));

// Build the parameters for the call
var callParameters = contract.BuildParameter(
    entrypoint: entryPointName,
    value: 12
).ToJson();

// Call the contract
TezosManager.Instance.Tezos.Wallet.CallContract(
    contractAddress: address,
    entryPoint: entryPointName,
    input: callParameters
);
```

To get the hash of the transaction, use the `ContractCallCompleted` event.

<!-- TODO:
- Can you deploy a contract for each user?
- Managing multiple contracts?
- Encoding param for `value`
-->
