---
title: Unity SDK TezosAPI object
sidebar_label: TezosAPI object
authors: Tim McMackin
last_update:
  date: 15 November 2024
---

The Unity SDK class `Tezos.API.TezosAPI` provides methods for many Tezos-related tasks, including connecting to wallets, sending transactions to Tezos, and getting information about about the Tezos blockchain, such as what tokens accounts or contracts control.

## Properties

None.

## Initialization methods

### `WaitUntilSDKInitialized()`

```csharp
public static async UniTask WaitUntilSDKInitialized();
```

Waits until the SDK is fully initialized.
Use this method at startup before trying to connect to wallets or use other features of the SDK.

## Wallet connection methods

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

When the `WalletType` field of the `WalletProviderData` parameter is set to `WalletType.WALLETCONNECT`, this method opens the WalletConnect SDK's popup window, which provides deep links and a QR code to connect EVM wallets.

For more information about connecting to wallets, see [Connecting accounts](/unity/connecting-accounts).

<!-- TODO
There's a lot more to connections, as described in https://opentezos.com/gaming/unity-sdk/api-documentation/#iwalletproviderconnect.
Need to work out what's relevant here and what should go in a topic on connecting to wallets.
-->

### `SocialLogIn()`

Initiates a social login session and returns information about the connection.

```csharp
public static async UniTask<SocialProviderData> SocialLogIn(SocialProviderData socialProviderData);
```

This method triggers the `SocialLoggedIn` event.

### `Disconnect()`

Disconnects the currently connected wallet and returns true if a wallet was connected or false if no wallet was connected.

```csharp
public static async UniTask<bool> Disconnect()
```

## Wallet information methods

### `IsConnected()`

Returns true if any kind of wallet is connected to the application and false if not.

```csharp
public static bool IsConnected();
```

This method returns true if a Beacon, WalletConnect, or social wallet is connected.
To check for Beacon and WalletConnect connections specifically, use [`IsWalletConnected()`](#iswalletconnected).
To check for social wallets specifically, use [`IsSocialLoggedIn()`](#issocialloggedin).

### `GetConnectionAddress()`

Returns the connected address or an empty string if no wallet is connected.

```csharp
public static string GetConnectionAddress()
```

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

### `GetWalletProvider()`

Returns the internal object that the SDK uses to represent the connection to Beacon and WalletConnect wallets.

```csharp
public static IWalletProvider GetWalletProvider<T>();
```

To use this method you must specify the type of wallet provider that the Unity application is using.

Example for WebGL applications:

```csharp
BeaconWebGLProvider walletProvider = TezosAPI.GetWalletProvider<BeaconWebGLProvider>();
Debug.Log(walletProvider.WalletType);
```

Example for mobile applications:

```csharp
BeaconMobileProvider walletProvider = TezosAPI.GetWalletProvider<BeaconMobileProvider>();
Debug.Log(walletProvider.WalletType);
```

### `GetSocialProvider()`

Returns the internal object that the SDK uses to represent the connection to social wallets.

```csharp
public static ISocialLoginProvider GetSocialProvider<T>();
```

Example:

```csharp
KukaiMobileProvider walletProvider = TezosAPI.GetSocialProvider<KukaiMobileProvider>();
Debug.Log(walletProvider.WalletType);
```

## Tezos information methods

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

### `GetTokenMetadata()`

Gets the metadata for the specified token.

```csharp
public static UniTask<JsonElement> GetTokenMetadata(
    string contractAddress,
    uint   tokenId
);
```

### `GetContractMetadata()`

```csharp
public static UniTask<JsonElement> GetContractMetadata(
    string contractAddress
);
```

Gets the metadata for the specified contract, if it has metadata.

### `GetTokensForContract()`

```csharp
public static UniTask<IEnumerable<TokenData>> GetTokensForContract(
    string                 contractAddress,
    bool                   withMetadata,
    long                   maxItems,
    TokensForContractOrder orderBy
);
```

Gets the tokens in a contract.

<!-- TODO not sure if this works -->

Example:

```csharp
var tokenList = await TezosAPI.GetTokensForContract(
    "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
    true,
    5,
    new TokensForContractOrder.Default(0)
);
List<TokenData> tokens = new List<TokenData>(tokenList);
foreach (var tk in tokens)
{
    Debug.Log("ID: " + tk.TokenID);
}
```
<!-- Not sure if relevant anymore-->
<!--
The method returns a list of tokens, but not all of the fields in the `TokenData` objects are populated by default.
You can populate the fields you want to retrieve by editing the `GetTokensForContract` method of the `Tezos.API.TezosAPI` class.

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

-->

### `GetOwnersForToken()`

Gets the accounts that own the specified token.

```csharp
public static UniTask<IEnumerable<TokenBalance>> GetOwnersForToken(
    string              contractAddress,
    uint                tokenId,
    long                maxItems,
    OwnersForTokenOrder orderBy
);
```

<!-- TODO explain ordering -->

Example:

```csharp
var ownerList = await TezosAPI.GetOwnersForToken(
    "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
    7,
    5,
    new OwnersForTokenOrder.Default(0)
);
foreach (TokenBalance balance in ownerList)
{
    Debug.Log("Owner: " + balance.Owner + " has " + balance.Balance + " tokens");
}
```

### `GetOwnersForContract()`

Gets the accounts that own tokens on the specified contract.

```csharp
public static UniTask<IEnumerable<TokenBalance>> GetOwnersForContract(
    string                 contractAddress,
    long                   maxItems,
    OwnersForContractOrder orderBy
    );
```

Example:

```csharp
var ownerList = await TezosAPI.GetOwnersForContract(
    "KT1Nhr9Bmhy7kcUmezRxbbDybh5buNnrVLTY",
    5,
    new OwnersForContractOrder.Default(0)
);
foreach (TokenBalance balance in ownerList)
{
    Debug.Log("Owner: " + balance.Owner + " has " + balance.Balance + " tokens");
}
```

<!-- TODO explain ordering -->

### `GetLatestBlockLevel()`

```csharp
public static UniTask<int> GetLatestBlockLevel();
```

Returns the current block level, or the number of blocks since the genesis block.

### `GetAccountCounter()`

Returns the counter for implicit accounts, which is a unique number that you can use to ensure that transactions are not duplicated.

```csharp
public static UniTask<int> GetAccountCounter(string address);
```

## Transaction methods

### `RequestOperation()`

Sends a Tezos transaction and returns an object with the hash of the transaction.

```csharp
public static async UniTask<OperationResponse> RequestOperation(OperationRequest operationRequest);
```

This method triggers the `OperationResulted` event.

For examples, see [Calling contracts](/unity/calling-contracts).

### `GetOperationStatus()`

```csharp
public static UniTask<bool> GetOperationStatus(string operationHash);
```

Returns true if the specified operation was successful, false if it failed, or null (or HTTP 204) if it doesn't exist.

### `RequestSignPayload()`

Prompts the connected wallet to sign a payload and returns the signed payload.

```csharp
public static async UniTask<SignPayloadResponse> RequestSignPayload(SignPayloadRequest operationRequest)
```

Example:

```csharp
private async void Start()
{
    TezosAPI.SigningResulted += SigningResulted;

    await TezosAPI.WaitUntilSDKInitialized();
}

public async void SignPayloadClick()
{
    try
    {
        var payload = "Hello World!";
        var bytes = Encoding.UTF8.GetBytes(payload);
        var hexPayload = BitConverter.ToString(bytes);
        hexPayload = hexPayload.Replace("-", "");
        hexPayload = "05" + hexPayload;
        var result = await TezosAPI.RequestSignPayload(
            new SignPayloadRequest
            {
                Payload = hexPayload,
                SigningType = SignPayloadType.MICHELINE
            }
        );
        Debug.Log($"Signature: {result.Signature}");
    }
    catch (Exception e)
    {
        Debug.Log($"{e.Message}");
        Debug.Log($"{e.StackTrace}");
    }
}

public void SigningResulted(SignPayloadResponse response)
{
    Debug.Log("SigningResulted");
    Debug.Log(response);
}
```

### `DeployContract()`

Deploys (originates) a smart contract to Tezos.

```csharp
public static UniTask DeployContract(DeployContractRequest deployContractRequest);
```

TODO example








## Old methods that don't work

Old methods that may still be used or may be outdated, but the code is still in there:

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






### `GetOriginatedContractsForOwner()`

<!-- Throws an error in SDK v4 -- maybe the TZKT API url is wrong?-->

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
