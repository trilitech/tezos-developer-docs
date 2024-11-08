---
title: Unity SDK TezosAPI object
sidebar_label: TezosAPI object
authors: Tim McMackin
last_update:
  date: 6 November 2024
---

The Unity SDK class `Tezos.API.TezosAPI`, which is available at runtime as the `TezosAPI` object, provides methods for many Tezos-related tasks, including connecting to wallets, getting information about the current wallet connection, and getting information about about the Tezos blockchain, such as what tokens accounts or contracts control.

## Properties

None.

## Methods

### `WaitUntilSDKInitialized()`

```csharp
public static async UniTask WaitUntilSDKInitialized();
```

Waits until the SDK is fully initialized.
Use this method at startup before trying to connect to wallets or use other features of the SDK.

### `ConnectWallet()`

```csharp
public static async UniTask<WalletProviderData> ConnectWallet(WalletProviderData walletProviderData);
```

Sends a request to a user's wallet to connect a Beacon or WalletConnect wallet to the application.
To connect social wallets, use [`SocialLogIn()`](#sociallogin).

If a wallet is already connected, this method either throws an exception (if a social wallet is connected) or returns the current connection information (if a Beacon or WalletConnect wallet is connected).

This method triggers the `WalletConnected` or `WalletConnectionFailed` events, depending on whether the connection was successful or not.

When the `WalletType` field of the `WalletProviderData` parameter is set to `WalletType.BEACON`, this method automatically picks the correct way to connect to wallets:

- In WebGL applications, it uses the `TezosSDK.Beacon.BeaconConnectorWebGl` class to trigger the browser to connect to a wallet app in a browser plugin.
- In all other applications, it uses the `TezosSDK.Beacon.BeaconConnectorDotNet` class to generate a QR code to connect to a wallet app on a mobile device or use a "deep link" to connect to a wallet on the same mobile device that is running the application.

When the `WalletType` field of the `WalletProviderData` parameter is set to `WalletType.WALLETCONNECT`, this method... TODO

TODO what happens then?


<!-- TODO
There's a lot more to connections, as described in https://opentezos.com/gaming/unity-sdk/api-documentation/#iwalletproviderconnect.
Need to work out what's relevant here and what should go in a topic on connecting to wallets.

What happens with the redirect param?
-->




### `SocialLogIn()`

```csharp
public static async UniTask<SocialProviderData> SocialLogIn(SocialProviderData socialProviderData);
```

Initiates a social login session.

### `RequestOperation()`

Sends a transaction.

```csharp
public static async UniTask<OperationResponse> RequestOperation(OperationRequest operationRequest);
```

TODO What does this return and what events does it trigger?







### `IsConnected()`

Returns true if any kind of wallet is connected to the application and false if not.

```csharp
public static bool IsConnected();
```

This method returns true if a Beacon, WalletConnect, or social wallet is connected.
To check for Beacon and WalletConnect connections specifically, use [`IsWalletConnected()`](#iswalletconnected).
To check for social wallets specifically, use [`IsSocialLoggedIn()`](#issocialloggedin).

### `IsWalletConnected()`

Returns true if a Beacon or WalletConnect wallet is connected.

```csharp
public static bool IsWalletConnected();
```

### `IsSocialLoggedIn()`

Returns true if a social wallet is connected.

```csharp
public static bool IsSocialLoggedIn();
```

### `GetWalletConnectionData()`

Retrieves information about the current wallet connection.

```csharp
public static WalletProviderData GetWalletConnectionData();
```

### `GetSocialLoginData()`

Retrieves information about the current social wallet connection.

```csharp
public static SocialProviderData GetSocialLoginData();
```

### `SocialLogIn()`

Initiates a social login session and returns information about the connection.

```csharp
public static async UniTask<SocialProviderData> SocialLogIn(SocialProviderData socialProviderData);
```

TODO what events does this trigger?


### `GetBalance()`

Fetches the balance of the connected account in mutez, as a string.

```csharp
public static async UniTask<string> GetBalance();
```

Example:

```csharp
public void RunGetBalance()
{
    Debug.Log("Getting balance");
    try
    {
        var balance = ulong.Parse(await TezosAPI.GetBalance());
        float convertedBalance = balance / 1000000f;
        Debug.Log($"Balance: {balance} tez");
    }
    catch (Exception e)
    {
        Debug.LogError($"Balance fetch error: {e.Message}");
    }
}
```

### `ReadView()`

```csharp
public static UniTask<T> ReadView<T>(string contractAddress, string entrypoint, string input);
```

Returns the response from a contract [view](/smart-contracts/views).
Note that the `input` parameter must be a Michelson-encoded object, as in the following example, which passes an integer and string parameter to the view:

Example:

```csharp
var result = await TezosAPI.ReadView<string>("KT1K46vZTMEe8bnacFvFQfgHtNDKniEauRMJ", "simple", "\"String value\"");
Debug.Log("View response: " + result);
```



<!-- PLACE -->






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
    Action<TokenMetadata> callback,
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
    Debug.Log(tokenMetadata.GetProperty("name"));
}
```

### `GetContractMetadata()`

```csharp
public IEnumerator GetContractMetadata(
    Action<JsonElement> callback,
    string contractAddress);
```

Gets the metadata for the specified contract.
Most contracts, including the built-in FA2 contract, do not have metadata.

Example:

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

The callback returns a list of tokens, but not all of the fields in the `Token` objects are populated by default.
You can populate the fields you want to retrieve by editing the `GetTokensForContract` method of the `TezosSDK.Tezos.API.TezosAPI` class.

The methods in this class retrieves information about Tezos via the [TZKT](https://tzkt.io/) block explorer.
To change the information that the `GetTokensForContract` method retrieves, update the URL to add fields.

The default URL looks like this:

```csharp
var url =
    $"tokens?contract={contractAddress}&select=contract,tokenId as token_id" +
    $"{(withMetadata ? ",metadata as token_metadata" : "")},holdersCount as holders_count,id," +
    $"lastTime as last_time&{sort}&limit={maxItems}";
```

To get the total supply of each token type, add the `totalSupply` field to the URL, like this:

```csharp
var url =
    $"tokens?contract={contractAddress}&select=contract,tokenId as token_id" +
    $"{(withMetadata ? ",metadata as token_metadata" : "")},holdersCount as holders_count,id," +
    $"totalSupply as total_supply," +
    $"lastTime as last_time&{sort}&limit={maxItems}";
```

Now when you run the `GetTokensForContract` method, the data passed to the callback includes the total supply of each token:

```csharp
private void HandleGetTokensForContract(IEnumerable<Token> tokenList)
{
    List<Token> tokens = new List<Token>(tokenList);
    foreach (var tk in tokens)
    {
        Debug.Log($"Token ID {tk.TokenId} has total supply {tk.TotalSupply} among {tk.HoldersCount} holders");
    }
}
```

For information about what fields you can add to this URL, see the [TZKT API reference](https://api.tzkt.io/).

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

Returns the counter for implicit accounts, which is a unique number that you can use to ensure that transactions are not duplicated.

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
For example, the hash of the contract in the `TokenContract` object is in the `Resources/Contracts/FA2TokenContractCodeHash.txt` file.

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
