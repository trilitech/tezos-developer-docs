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
