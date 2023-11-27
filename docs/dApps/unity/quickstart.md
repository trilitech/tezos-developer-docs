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
- Adding objects that connect to a user's Tezos wallet

Connecting to a user's wallet is a prerequisite to working with Tezos in any application.
Accessing the wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users must still confirm all transactions in their wallet application.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

1. Make sure that you have Unity Editor version 2021.3.23f1 or later.

1. Install a Tezos-compatible wallet on a mobile device that has a camera and can scan QR codes.

1. Switch the wallet to Ghostnet and use the [Ghostnet faucet](https://faucet.ghostnet.teztnets.xyz/) to get some tez that you can use to send transactions to your Unity projects.

1. Install the SDK through the Unity asset store:

   1. In the Unity asset store, find the [Tezos SDK for Unity](https://assetstore.unity.com/packages/decentralization/infrastructure/tezos-sdk-for-unity-239001).
   1. Click **Add to My Assets**.
   1. In the Unity Editor, in the Package Manager panel, find the Tezos SDK for Unity and click the **Download** button.
   1. TODO double-check these instructions when the new package is available on the asset store.
   1. Verify that the SDK is installed by opening the Project panel and expanding the **Assets > TezosSDK** folder.

     If you see the TezosSDK folder with sub-folders including Editor, Examples, Resources, and Runtime, the SDK is installed correctly, as in this picture:

     <img src="/img/dApps/unity-installed-project-panel.png" alt="The SDK assets in the Project panel" style={{width: 200}} />

1. Verify that the SDK works in your project by running the WalletConnection example scene, which demonstrates how to connect to a Tezos wallet in a Unity project:

   1. In the Project panel, expand **Assets > TezosSDK > Examples > WalletConnection** and open the `_WalletConnection` scene.
   1. Run the scene, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   The project UI shows the address of the connected account, as in this picture:

      <img src="/img/dApps/unity-wallet-connection-scene-connected.png" alt="The new RPC node selected in the Temple wallet" style={{width: 500}} />

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

   You can use this address as a user's account ID, because Tezos account addresses are unique.

1. Get the tokens that the connected account owns:


1. Send transactions to the user's wallet:







1. Add text to show the account's balance in tez:

   1. In the Hierarchy pane, right click the Canvas object and then click **Create Empty**.
   1. Name the new object "AccountBalance."
   1. Right-click the AccountBalance object and then click **UI > Text - TextMeshPro**.
   1. Name the new text object "Label" and set its text to "Account balance:".
   1. In the Scene panel, move the new text object to below the text "Account Address."
   If you can't find the text object, you can right-click the label object in the Hierarchy panel and then click **Move To View**.
   1. In the Hierarchy pane, right-click the AccountBalance object and then click **UI > Text - TextMeshPro** again.
   1. Name the new text object "Balance," clear its default text, and move it to the right of the Label object.
   1. In the Hierarchy pane, select the AccountBalance object, not the Label or Balance sub-objects.
   1. At the bottom of the Inspector pane, click **Add Component**.
   1. Click **New Script**, name the script "AccountBalance," and click **Create and Add**.

   1. Double-click the AccountBalance script to open the script file in your IDE.
   1. At the top of the file, add these imports:

      ```csharp
      using TMPro;
      using TezosSDK.Tezos;
      using TezosSDK.Beacon;
      ```

   1. Inside the `AccountBalance` class, add this variable to represent the text in the Balance object:

      ```csharp
      public TMP_Text balance;
      ```

   1. Inside the `Start` function, add these lines of code to add listeners:

      ```csharp
      TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
      TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
      ```

      These lines of code set functions that respond to events in the Tezos SDK.
      In this case, they set functions that run when the user's account connects or disconnects.

   1. After the `Start` function, add these functions:

      ```csharp
      private void OnAccountConnected(AccountInfo account_info)
      {
         var routine = TezosManager.Instance.Tezos.GetCurrentWalletBalance(OnBalanceFetched);
         StartCoroutine(routine);
      }

      private void OnBalanceFetched(ulong balance)
      {
         balance.text = $"{mutezBalance / 1000000f}";
      }

      private void OnAccountDisconnected(AccountInfo account_info)
      {
         balance.text = "";
      }
      ```

      The `OnAccountConnected` function runs when the account connects.
      It creates a routine that fetches the account balance and sets the `OnBalanceFetched` function as a callback.
      When the SDK returns the balance, the `OnBalanceFetched` function updates the text.

      The complete script file looks like this:

      ```csharp
      using System.Collections;
      using System.Collections.Generic;
      using UnityEngine;

      using TMPro;
      using TezosSDK.Tezos;
      using TezosSDK.Beacon;

      public class AccountBalance : MonoBehaviour
      {
          public TMP_Text balance;

          // Start is called before the first frame update
          void Start()
          {
              TezosManager.Instance.MessageReceiver.AccountConnected += OnAccountConnected;
              TezosManager.Instance.MessageReceiver.AccountDisconnected += OnAccountDisconnected;
          }

          private void OnAccountConnected(AccountInfo account_info)
          {
              var routine = TezosManager.Instance.Tezos.GetCurrentWalletBalance(OnBalanceFetched);
              StartCoroutine(routine);
          }

          private void OnBalanceFetched(ulong mutezBalance)
          {
              balance.text = $"{mutezBalance / 1000000f}";
          }

          private void OnAccountDisconnected(AccountInfo account_info)
          {
              balance.text = "";
          }

          // Update is called once per frame
          void Update()
          {

          }
      }
      ```

      1. Save the file.
      1. In the Unity Editor, in the Hierarchy pane, drag the Balance object to the `Balance` field of the Account Balance script in the Inspector pane.

      1. Run the project, connect your wallet, and see that the UI shows the account's balance in tez.

      Now you can bind objects to variables in the code and use listeners to respond to Tezos SDK events.
      For the complete list of listeners, see the file `Assets/TezosSDK/Runtime/Scripts/Beacon/WalletEventManager.cs` in the SDK.

Now that your project can connect to a user's account, you can use this connection to identify a user's account, because Tezos addresses are unique.
You can also use this connection to send transactions to Tezos on behalf of the user, such as manipulating Tezos tokens as game assets.
For examples, see the scenes in the `TezosSDK/Examples` folder.

Note that if you stop the project while your wallet is connected and restart the project later, it remembers that your wallet is connected.
The SDK uses the [Beacon](https://docs.walletbeacon.io/) SDK to connect to wallets and remember connections.

<!--
TODOs:

- Deploy contract
- Mint tokens
- Send tez transaction?
- What else to get started?

-->
