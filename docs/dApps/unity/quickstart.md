---
title: Quickstart
authors: Tim McMackin
last_update:
  date: 27 November 2023
---

Follow these steps to install the Tezos SDK for Unity in an existing Unity project and start using it.

These instructions cover:

- Installing the SDK into an existing Unity project
- Testing that the SDK works in your project
- Connecting to a user's Tezos wallet
- Creating and managing tokens
- Prompting the user to sign messages

## Installing the SDK

1. Make sure that you have Unity Editor version 2021.3.23f1 or later.

1. Install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes.
For instructions, see [Installing and funding a wallet](../../developing/wallet-setup).

1. Switch the wallet to Ghostnet and use the [Ghostnet faucet](https://faucet.ghostnet.teztnets.xyz/) to get some tez that you can use to send transactions to your Unity projects.

1. Install the SDK from GitHub:

   1. From the SDK's GitHub page at https://github.com/trilitech/tezos-unity-sdk/releases, download the latest release of the SDK, which is a file named `TezosUnitySdk.unitypackage`.
   1. In the Unity Editor, click **Assets > Import Package > Custom Package** and import the SDK file.
   1. Verify that the SDK is installed by opening the Project panel and expanding the **Assets > TezosSDK** folder.

     If you see the TezosSDK folder with sub-folders including Editor, Examples, Resources, and Runtime, the SDK is installed correctly, as in this picture:

     <img src="/img/dApps/unity-installed-project-panel.png" alt="The SDK assets in the Project panel" style={{width: 200}} />

1. Verify that the SDK works in your project by running the WalletConnection example scene, which demonstrates how to connect to a Tezos wallet in a Unity project:

   1. In the Project panel, expand **Assets > TezosSDK > Examples > WalletConnection** and open the `_WalletConnection` scene.
   1. Run the scene, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   The project UI shows the address of the connected account, as in this picture:

      <img src="/img/dApps/unity-wallet-connection-scene-connected.png" alt="The new RPC node selected in the Temple wallet" style={{width: 500}} />

## Connecting to wallets

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

1. Copy the `MainThreadExecutor` and `TezosManager` prefabs to your scene.
These prefabs provide prerequisites to use Tezos in a scene.
The `TezosManager` fields control what users see in their wallet applications before connecting to the project, as shown in this picture of the Inspector panel:

   ![The Inspector panel, showing information about the project](/img/dApps/unity-inspector-tezosmanager.png)

1. Add features to your project that connect to users' wallets.
You can copy objects from the `_WalletConnection` scene, including the QRCode, LogoutButton, and AccountAddress objects.

   The `TezosSDK/Examples/WalletConnection/Scripts/QRImageGenerator.cs` file receives a handshake from the `TezosManager` object and uses the handshake information to generate a URI and encode that URI to a QR code image:

   ```csharp
   private void SetQrCode(HandshakeData handshake_data)
   {
       if (encoded)
       {
           return;
       }

       var uri = "tezos://?type=tzip10&data=" + handshake_data.PairingData;
       EncodeTextToQrCode(uri);
   }
   ```

   You can adjust this code and the bound Unity object to control when and where the QR code appears.

1. Add features to your project to use the connected account.
For example, the `TezosSDK/Examples/Common/Scripts/AccountInfoUI.cs` file responds to the `AccountConnected` event, which runs when the user scans the QR code and approves the connection in their wallet app.
When the event runs, it uses the `TezosManager.Instance.Wallet` object to get information about the connected account, such as its address:

   ```csharp
   private void Start()
   {
       addressText.text = notConnectedText;
       TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
       TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
   }

   private void OnAccountDisconnected(AccountInfo account_info)
   {
       addressText.text = notConnectedText;
   }

   private void OnAccountConnected(AccountInfo account_info)
   {
       addressText.text = TezosManager.Instance.Wallet.GetActiveAddress();
       // OR
       addressText.text = account_info.Address;
   }
   ```

   You can use this address as a user's account ID because Tezos account addresses are unique.

1. To respond to other events, add listeners for the events that the SDK provides.
You can see these events and their return values in the `WalletEventManager.cs` file:

   - `AccountConnected`: Runs when an account connects
   - `AccountConnectionFailed`: Runs when an attempt to connect to an account fails and provides error information
   - `AccountDisconnected`: Runs when an account disconnects
   - `ContractCallCompleted`: Runs when a call to a smart contract is confirmed on the blockchain and provides the hash of the transaction
   - `ContractCallFailed`: Runs when a call to a smart contract fails and provides error information
   - `ContractCallInjected`: Runs when the SDK sends a transaction to a smart contract but before it is confirmed on the blockchain
   - `HandshakeReceived`: Runs when the handshake with a user's wallet application is received and provides the information necessary to connect the wallet to the dApp
   - `PairingCompleted`: Runs when the user's wallet is connected to the project but before the user has approved the connection in the wallet app
   - `PayloadSigned`: Runs when the user signs a payload and returns the signature information

Note that if you stop the project while your wallet is connected and restart the project later, it remembers that your wallet is connected.
The SDK uses the [Beacon](https://docs.walletbeacon.io/) SDK to connect to wallets and remember connections.

## Managing tokens

To create and work with tokens in your project, you need a smart contract to manage them.
Smart contracts are programs on the blockchain that are permanent and hosted automatically by Tezos nodes, so you don't have to worry about where to host contracts and whether they will run when users call them.

Smart contracts can do many tasks, but for gaming they have two main purposes:

- They handle tokens, which are digital assets stored on the blockchain
- They provide backend logic that users can trust because it cannot change

You can create your own smart contracts or use the built-in contract that the SDK provides for managing tokens in Unity projects.
The built-in contract is compatible with the [FA2 token standard](../../architecture/tokens/FA2), which means that you can use a single smart contract to manage any number of types of tokens.
Each token type can be:

- Fungible tokens, which are collections of interchangeable tokens with a quantity that you define.
Fungible tokens can be quantifiable commodities like in-game currency, fuel, ammunition, or energy, or they can be identical items with a limited quantity.
- Non-fungible tokens (NFTs), which are unique assets with only one unit.
Games use NFTs for items that are unique and must not be duplicated.

For more information about smart contracts, see [Smart contracts](../../smart-contracts).

1. To deploy the built-in contract, call the `TezosManager.Instance.Tezos.TokenContract.Deploy` method and pass a callback function:

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
   The SDK stores the address of the contract as `TezosManager.Instance.Tezos.TokenContract.Address`.

   The address that deployed the contract becomes the administrator of the contract and is the only account that can create tokens.

1. To create tokens, call the contract's `mint` entrypoint.

   The built-in contract has a `mint` method that accepts these parameters and calls the deployed contract's `mint` entrypoint:

      - A callback function to run when the token is created
      - The metadata for the token, which includes a name and description, URIs to preview media or thumbnails, and how many decimal places the token can be broken into
      - The destination account that owns the new tokens, which can be a user account, this smart contract, or any other smart contract
      - The number of tokens to create

   For example, this code creates a token type with a quantity of 100:

   ```csharp
   var initialOwner = TezosManager
       .Instance
       .Wallet
       .GetActiveAddress();

   const string imageAddress = "ipfs://QmX4t8ikQgjvLdqTtL51v6iVun9tNE7y7Txiw4piGQVNgK";

   var tokenMetadata = new TokenMetadata
   {
       Name = "My token",
       Description = "Description for my token",
       Symbol = "MYTOKEN",
       Decimals = "0",
       DisplayUri = imageAddress,
       ArtifactUri = imageAddress,
       ThumbnailUri = imageAddress
   };

   TezosManager
       .Instance
       .Tezos
       .TokenContract
       .Mint(
           completedCallback: OnTokenMinted,
           tokenMetadata: tokenMetadata,
           destination: initialOwner,
           amount: 100);

   private void OnTokenMinted(TokenBalance tokenBalance)
   {
       Debug.Log($"Successfully minted token with Token ID {tokenBalance.TokenId}");
   }
   ```

   For a complete example of creating tokens, see the file `TezosSDK/Examples/Contract/Scripts/MintToken.cs` and the Contract example scene.

   Note that developers usually don't store large files such as images or large metadata files directly on the blockchain.
   Instead, they set up distributed storage for the file with the InterPlanetary File System (IPFS).
   For example, [Pinata](https://www.pinata.cloud/) provides an API to store files in IPFS.
   The tutorial [Create a contract and web app that mints NFTs](../../tutorials/create-an-nft/nft-taquito) covers setting up an IPFS account and storing files on IPFS.
   The code in the previous example assumes that the image that represents the token is already stored on IPFS.

1. To transfer tokens, call the contract's `Transfer` entrypoint.

   Like the `mint`entrypoint, the built-in contract has a `transfer` method that accepts these parameters and calls the deployed contract's `transfer` entrypoint:

      - A callback function to run when the transfer is complete
      - The account to transfer the tokens to
      - The ID of the token
      - The amount of tokens to transfer

   This example transfers 12 tokens with the ID 5 to the account in the variable `destinationAccountAddress`.

   ```csharp
   public void HandleTransfer()
   {
       TezosManager
           .Instance
           .Tezos
           .TokenContract
           .Transfer(
               completedCallback: TransferCompleted,
               destination: destinationAccountAddress,
               tokenId: 5,
               amount: 12);
   }

   private void TransferCompleted(string txHash)
   {
       Logger.LogDebug($"Transfer complete with transaction hash {txHash}");
   }
   ```

   For a complete example, see the Transfer example scene.

1. To get the tokens that the connected account owns, call the `TezosManager.Instance.Tezos.API.GetTokensForOwner` method in a coroutine.
This example prints information about the tokens that the account owns to the log:

   ```csharp
   using Beacon.Sdk.Beacon;
   using TezosSDK.Beacon;
   using TezosSDK.Tezos;
   using TezosSDK.Helpers;
   using TezosSDK.Tezos.API.Models.Tokens;
   using TezosSDK.Tezos.API.Models.Filters;
   using System.Linq;

   // ...

   void Start()
   {
       TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
   }

   private void OnAccountConnected(AccountInfo account_info)
   {
       var address = TezosManager.Instance.Wallet.GetActiveAddress();
       var routine = TezosManager.Instance.Tezos.API.GetTokensForOwner(
           callback: onTokenBalances,
           owner: address,
           withMetadata: true,
           maxItems: 10_000,
           orderBy: new TokensForOwnerOrder.ByLastTimeAsc(0)
       );
       StartCoroutine(routine);
   }

   private void onTokenBalances(IEnumerable<TokenBalance> tokenBalances)
   {
       var address = TezosManager.Instance.Wallet.GetActiveAddress();

       List<TokenBalance> tokens = new List<TokenBalance>(tokenBalances);
      // Filter to the tokens in the active contract
       List<TokenBalance> filteredTokens = tokens.Where(tb => tb.TokenContract.Address == TezosManager.Instance.Tezos.TokenContract.Address).ToList();
       if (filteredTokens.Count > 0)
       {
           foreach (var tb in filteredTokens)
           {
               Debug.Log(
                  $"{address} has {tb.Balance} tokens on contract {tb.TokenContract.Address}");
               Debug.Log(tb.TokenMetadata);
           }
       }
       else
       {
           Debug.Log($"{address} has no tokens in the active contract");
       }
   }
   ```

1. To see all of the tokens that the contract contains, copy the contract address, which starts with `KT1`, and search for that address on a block explorer such as [Better Call Dev](https://better-call.dev/).
For example, this image shows the Tokens tab of Better Call Dev and the three types of tokens in the contract:

   <img src="/img/dApps/unity-bcd-tokens.png" alt="Three types of tokens on the Tokens tab of the block explorer" style={{width: 500}} />

## Signing messages

You can also use the connection to the user's wallet to prompt them to sign messages.
Signing a message proves that it came from a specific user's wallet because the wallet encrypts the message with the user's account's key.
You can prompt users to sign messages for several reasons, including:

- Ensuring that a message came from them
- Ensuring that a user has the private key for a specific account
- Proving that they own a specific token, such as if they want to offer the token for sale
- Requiring operations to run only when multiple users sign messages
- Pre-signing transactions that another application can run later and pay the fees for on the signer's behalf

For example, this code prompts the user to sign the message "This message came from my account."

```csharp
using Beacon.Sdk.Beacon.Sign;

// ...

string payload = "This message came from my account.";

void Start()
{
    TezosManager.Instance.MessageReceiver.PayloadSigned += OnPayloadSigned;
    TezosManager.Instance.Wallet.RequestSignPayload(SignPayloadType.micheline, payload);
}

private void OnPayloadSigned(SignResult obj)
{
    // result is true if the message is signed correctly
    // and that it came from the currently-connected account
    var result = TezosManager.Instance.Wallet.VerifySignedPayload(SignPayloadType.micheline, payload);
    Debug.Log($"Payload verification response: {result}");
}
```

The `RequestSignPayload` method sends the request to the user's wallet.
If the user approves the request, the wallet returns the signed payload, which includes encrypted information about the account that it came from.

The callback uses the `VerifySignedPayload` method to verify that the signed payload came from the currently connected account and contains the same message that was sent in the signing request.

For more examples of how to work with the SDK, see the scenes in the `TezosSDK/Examples` folder.
