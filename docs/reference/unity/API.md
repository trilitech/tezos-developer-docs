---
title: Unity SDK API object
sidebar_label: API object
authors: Tim McMackin
last_update:
  date: 5 December 2023
---

The `TezosManager.Instance.Tezos.API` object provides information about the Tezos blockchain, such as what tokens accounts or contracts control.

## Properties

None.

## Methods

### `GetTezosBalance()`

```csharp
IEnumerator GetTezosBalance(Action<ulong> callback, string address);
```

Returns the balance of the specified account address in mutez.

Example:

```csharp
public void RunGetTezosBalance()
{
    Debug.Log("Getting balance");
    var routine = TezosManager.Instance.Tezos.API.GetTezosBalance(
        HandleTezosBalance,
        myAddress
    );
    StartCoroutine(routine);
}

private void HandleTezosBalance(ulong balanceMutez)
{
    Debug.Log(balanceMutez/1000000);
}
```

### `ReadView()`

```csharp
IEnumerator ReadView(string contractAddress,
    string entrypoint,
    string input,
    Action<JsonElement> callback);
```

Returns the response from a contract [view](../../smart-contracts/views).

Example:

TODO

```csharp
```

### `GetTokensForOwner()`

```csharp
IEnumerator GetTokensForOwner(
    Action<IEnumerable<TokenBalance>> callback,
    string owner,
    bool withMetadata,
    long maxItems,
    TokensForOwnerOrder orderBy);
```

Gets the tokens that an account owns.

Example:

```csharp
public void RunGetTokensForOwner()
{
    var routine = TezosManager.Instance.Tezos.API.GetTokensForOwner(
        callback: HandleTokenBalances,
        owner: myAddress,
        withMetadata: true,
        maxItems: 10,
        orderBy: new TokensForOwnerOrder.ByLastTimeAsc(0)
    );
    StartCoroutine(routine);
}

private void HandleTokenBalances(IEnumerable<TokenBalance> tokenBalances)
{
    List<TokenBalance> tokens = new List<TokenBalance>(tokenBalances);
    foreach (var tb in tokens)
    {
        Debug.Log($"{tb.Balance} tokens on contract {tb.TokenContract.Address}");
    }
}
```

### `GetOwnersForToken()`

```csharp
IEnumerator GetOwnersForToken(
    Action<IEnumerable<TokenBalance>> callback,
    string contractAddress,
    uint tokenId,
    long maxItems,
    OwnersForTokenOrder orderBy);
```

Gets the accounts that own the specified token.

Example:

```csharp
public void RunGetOwnersForToken()
{
    var routine = TezosManager.Instance.Tezos.API.GetOwnersForToken(
        callback: HandleTokenOwners,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
        tokenId: 0,
        maxItems: 10,
        orderBy: new OwnersForTokenOrder.ByLastTimeAsc(0)
    );
    StartCoroutine(routine);
}

private void HandleTokenOwners(IEnumerable<TokenBalance> tokenBalances)
{
    List<TokenBalance> tokens = new List<TokenBalance>(tokenBalances);
    foreach (var tb in tokens)
    {
        Debug.Log($"{tb.Balance} tokens on contract {tb.TokenContract.Address}");
    }
}
```

### `GetOwnersForContract()`

```csharp
IEnumerator GetOwnersForContract(
    Action<IEnumerable<TokenBalance>> callback,
    string contractAddress,
    long maxItems,
    OwnersForContractOrder orderBy);
```

Gets the accounts that own tokens on the specified contract.

Example:

```csharp
public void RunGetOwnersForContract()
{
    var routine = TezosManager.Instance.Tezos.API.GetOwnersForContract(
        callback: HandleOwnersForContract,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
        maxItems: 10,
        orderBy: new OwnersForContractOrder.ByLastTimeAsc(0)
    );
    StartCoroutine(routine);
}

private void HandleOwnersForContract(IEnumerable<TokenBalance> tokenBalances)
{
    List<TokenBalance> tokens = new List<TokenBalance>(tokenBalances);
    foreach (var tb in tokens)
    {
        Debug.Log($"{tb.Owner} owns {tb.Balance} tokens on contract {tb.TokenContract.Address}");
    }
}
```

### `IsHolderOfContract()`

```csharp
IEnumerator IsHolderOfContract(
    Action<bool> callback,
    string wallet,
    string contractAddress);
```

Returns true if the specified account owns any token in the specified contract.

Example:

```csharp
public void GetIsHolderOfContract()
{
    var routine = TezosManager.Instance.Tezos.API.IsHolderOfContract(
        callback: HandleIsHolderOfContract,
        wallet: myAddress,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address
    );
    StartCoroutine(routine);
}

private void HandleIsHolderOfContract(bool response)
{
    Debug.Log(response);
}
```

### `IsHolderOfToken()`

```csharp
IEnumerator IsHolderOfToken(
    Action<bool> callback,
    string wallet,
    string contractAddress,
    uint tokenId);
```

Returns true if the specified account owns the specified token in the specified contract.

Example:

```csharp
public void GetIsHolderOfToken()
{
    var routine = TezosManager.Instance.Tezos.API.IsHolderOfToken(
        callback: HandleIsHolderOfToken,
        wallet: myAddress,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
        tokenId: 0
    );
    StartCoroutine(routine);
}

private void HandleIsHolderOfToken(bool response)
{
    Debug.Log(response);
}
```

### `GetTokenMetadata()`

```csharp
IEnumerator GetTokenMetadata(
    Action<JsonElement> callback,
    string contractAddress,
    uint tokenId);
```

Gets the metadata for the specified token.

Example:

```csharp
public void RunGetTokenMetadata()
{
    var routine = TezosManager.Instance.Tezos.API.GetTokenMetadata(
        callback: HandleGetTokenMetadata,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
        tokenId: 0
    );
    StartCoroutine(routine);
}

private void HandleGetTokenMetadata(JsonElement tokenMetadata)
{
    // TODO handle JSON data
    Debug.Log(tokenMetadata);
}
```

### `GetContractMetadata()`

```csharp
public IEnumerator GetContractMetadata(
    Action<JsonElement> callback,
    string contractAddress);
```

Gets the metadata for the specified contract.

Example:

<!-- TODO no worky -->

```csharp
public void RunGetContractMetadata()
{
    var routine = TezosManager.Instance.Tezos.API.GetContractMetadata(
        callback: HandleGetContractMetadata,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address
    );
    StartCoroutine(routine);
}

private void HandleGetContractMetadata(JsonElement contractMetadata)
{
    // TODO handle JSON data
    Debug.Log(contractMetadata);
}
```

### `GetTokensForContract()`

```csharp
IEnumerator GetTokensForContract(
    Action<IEnumerable<Token>> callback,
    string contractAddress,
    bool withMetadata,
    long maxItems,
    TokensForContractOrder orderBy);
```

Gets the tokens in a contract.

Example:

<!-- TODO cover how to implement the other fields in tokenList>
```csharp
public void RunGetTokensForContract()
{
    timesCalled = 0;
    var routine = TezosManager.Instance.Tezos.API.GetTokensForContract(
        callback: HandleGetTokensForContract,
        contractAddress: TezosManager.Instance.Tezos.TokenContract.Address,
        withMetadata: true,
        maxItems: 10,
        orderBy: new TokensForContractOrder.ByLastTimeAsc(0)
    );
    StartCoroutine(routine);
}

private void HandleGetTokensForContract(IEnumerable<Token> tokenList)
{
    List<Token> tokens = new List<Token>(tokenList);
    foreach (var tk in tokens)
    {
        Debug.Log(tk.TokenId);
    }
}
```

### `GetOperationStatus()`

```csharp
IEnumerator GetOperationStatus(
    Action<bool?> callback,
    string operationHash);
```

Returns true if the specified operation was successful, false if it failed, or null (or HTTP 204) if it doesn't exist.

Example:

```csharp
public void HandleTransfer()
{
    TezosManager
        .Instance
        .Tezos
        .TokenContract
        .Transfer(
            completedCallback: TransferCompleted,
            destination: address.text,
            tokenId: int.Parse(id.text),
            amount: int.Parse(amount.text));
}

private void TransferCompleted(string txHash)
{
    Debug.Log($"Transfer complete with transaction hash {txHash}");
    var routine = TezosManager.Instance.Tezos.API.GetOperationStatus(
        callback: HandleGetOperationStatus,
        operationHash: txHash
    );
    StartCoroutine(routine);
}
private void HandleGetOperationStatus(bool? result)
{
    Debug.Log(result);
}
```

### `GetLatestBlockLevel()`

```csharp
IEnumerator GetLatestBlockLevel(
    Action<int> callback);
```

Returns the block level, or the number of blocks since the genesis block.

Example:

```csharp
public void RunGetLatestBlockLevel()
{
    var routine = TezosManager.Instance.Tezos.API.GetLatestBlockLevel(
        callback: HandleGetLatestBlockLevel
    );
    StartCoroutine(routine);
}

private void HandleGetLatestBlockLevel(int blockLevel)
{
    Debug.Log(blockLevel);
}
```

### `GetAccountCounter()`

```csharp
IEnumerator GetAccountCounter(
    Action<int> callback,
    string address);
```

<!-- TODO what's an account's counter? -->

Example:

```csharp
public void RunGetAccountCounter()
{
    var routine = TezosManager.Instance.Tezos.API.GetAccountCounter(
        callback: HandleGetAccountCounter,
        address: myAddress
    );
    StartCoroutine(routine);
}

private void HandleGetAccountCounter(int counter)
{
    Debug.Log(counter);
}
```

### `GetOriginatedContractsForOwner()`

```csharp
IEnumerator GetOriginatedContractsForOwner(
    Action<IEnumerable<TokenContract>> callback,
    string creator,
    string codeHash,
    long maxItems,
    OriginatedContractsForOwnerOrder orderBy);
```

Gets the contracts that the specified account deployed (originated).
Optionally, you can pass the hash of a contract to return only contracts that match that hash.
For example, the hash of the contract in the [`TokenContract`](./TokenContract) object, which is in the `Resources/Contracts/FA2TokenContractCodeHash.txt` file, is `199145999`.

Example:

```csharp
public void RunGetOriginatedContractsForOwner()
{
    var routine = TezosManager.Instance.Tezos.API.GetOriginatedContractsForOwner(
        callback: HandleGetOriginatedContractsForOwner,
        creator: myAddress,
        codeHash: "",
        maxItems: 10,
        orderBy: new OriginatedContractsForOwnerOrder.ByLastActivityTimeAsc(0)

    );
    StartCoroutine(routine);
}

private void HandleGetOriginatedContractsForOwner(IEnumerable<TokenContract> contractList)
{
    List<TokenContract> contracts = new List<TokenContract>(contractList);
    foreach (var contract in contracts)
    {
        Debug.Log(contract.Address);
    }
}
```
