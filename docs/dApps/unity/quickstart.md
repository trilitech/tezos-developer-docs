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

   1. In the Project panel, expand **Assets > TezosSDK > Examples > WalletConnection** and open the _WalletConnection scene.
   1. Run the scene, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   The project UI shows the address of the connected account, as in this picture:

      <img src="/img/dApps/unity-wallet-connection-scene-connected.png" alt="The new RPC node selected in the Temple wallet" style={{width: 500}} />

1. Copy the MainThreadExecutor and TezosManager prefabs to your scene.
These prefabs provide prerequisites to use Tezos in a scene.
The TezosManager fields control what users see in their wallet applications before connecting to the project, as shown in this picture of the Inspector panel:

   ![The Inspector panel, showing information about the project](/img/dApps/unity-inspector-tezosmanager.png)

1. Copy the necessary objects to the scene:

   1. Open the _WalletConnection scene again.
   1. In the Hierarchy panel, expand the Canvas object.
   1. Under Canvas, select the following objects by holding Ctrl or Cmd and clicking them:

      - ConnectedText
      - QRCode
      - LogoutButton
      - MetadataInfo
      - AccountAddress

   1. Right-click the elements and then click **Copy**.
   1. Go back to your scene and paste the objects into the scene's canvas in the Hierarchy panel.
   The Hierarchy panel looks like this:

      ![The Hierarchy panel, showing the Tezos-related objects](/img/dApps/unity-hierarchy-panel-quickstart.png)

   1. If the objects appear outside the border of your scene, reposition them on the canvas.
   1. Save the scene.
   1. Click the **Play** button to run the scene.
   1. Open the Simulator panel, which shows a QR code.
   1. Use your wallet app to scan the barcode and confirm the connection to the Unity project.
   Note that the wallet app shows the name of the project that you set on the TezosManager prefab.

      The project shows the address that you used to connect.

   1. Click the **Logout** button and then click the **Play** button to stop the scene.

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

      The new script appears in the Inspector pane, as in this image:

         <img src="/img/dApps/unity-account-balance-script.png" alt="The new script in the Inspector pane" style={{width: 300}} />

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
      Now the Balance object on the canvas is bound to the `balance` variable in the script, as shown in this picture:

         <img src="/img/dApps/unity-account-balance-bound.png" alt="The script in the Inspector pane, showing that the Balance object is bound to the `balance` variable" style={{width: 300}} />

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
