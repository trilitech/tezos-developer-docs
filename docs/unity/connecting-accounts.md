---
title: Connecting accounts
authors: Tim McMackin
last_update:
  date: 25 November 2024
---

Connecting to a user's wallet allows your project to see the tokens in it and to prompt the user to submit transactions, but it does not give your project direct control over the wallet.
Users still confirm or reject all transactions in their wallet application, so you must handle both of these use cases.

Using a wallet application in this way saves you from having to implement payment processing and security in your application.
Game developers can also use the wallet and its account as a unique account identifier and as the user's inventory.

<!-- For an example of connecting to wallets, see the [WalletConnection tutorial scene](/unity/scenes#wallet-connection-scene). -->

For more information about Tezos wallets, see [Installing and funding a wallet](/developing/wallet-setup).

## Best practices

When working with wallets, be sure to follow the advice in [Best practices and avoiding flaws](/dApps/best-practices) for wallet connections.
For example, don't force the user to connect their wallet as soon as the application loads.
Instead, let them see the application first.
Also, provide a prominent disconnect button to allow users to disconnect one account and connect a different one.

## Connection methods

This table shows the ways that the SDK can connect to wallets and which platforms they are appropriate for:

Connection method | Description | Web platform (WebGL) | Mobile apps | Standalone applications
--- | --- | --- | --- | ---
QR code | Users scan a QR code with a wallet app | Yes | No | Yes
Deep link | The application opens the user's wallet app directly | Yes | Yes | No
Social wallets | The application opens the user's Kukai web-based wallet | Yes | No | No

When wallets connect or disconnect, the SDK runs the `WalletConnected` or `WalletDisconnect` events for non-social wallets and the `SocialLoggedIn` and `SocialLoggedOut` events for social wallets.

<!-- TODO info about handshakes? -->
<!-- TODO info about persistent Beacon connections -->

## Wallet types

The SDK supports three types of wallets:

- Wallets that use the Tezos blockchain and connect to applications through the Beacon protocol, such as Temple
- Wallets that use the Tezos blockchain and connect to a federated identity login through [Kukai](https://wallet.kukai.app)
- Wallets that use the Etherlink blockchain and connect to applications through the WalletConnect protocol, such as MetaMask

## Connecting to Beacon wallets

Unity applications can connect to Beacon wallets by showing a QR code that the user scans with a wallet app or by opening that app directly through the Beacon protocol.
For an example of this method, see [Quickstart](./quickstart).

This method for connecting follows these general steps:

1. The Unity application calls the `TezosAPI.ConnectWallet()` method and passes the Beacon wallet type:

   ```csharp
   var walletProviderData = new WalletProviderData { WalletType = WalletType.BEACON };
   try
   {
       var result = await TezosAPI.ConnectWallet(walletProviderData);
       _infoText.text = result.WalletAddress;
   }
   catch (WalletConnectionRejected e)
   {
       _infoText.text = "Wallet connection rejected";
       Debug.LogError($"Wallet connection rejected. {e.Message}\n{e.StackTrace}");
   }
   catch (Exception e)
   {
       Debug.LogException(e);
   }
   ```

1. The Unity application connects in different ways depending on the platform:

   - On WebGL applications, the SDK uses the Beacon SDK to open a popup window that prompts the user to select a compatible wallet via a deep link or to show a QR code:

      <img src="/img/unity/unity-connecting-beacon-popup.png" alt="The Beacon popup window with a QR code and a list of compatible wallets" style={{width: 300}} />

   - On mobile applications, the application attempts to open a Beacon wallet on the same device directly.

   - On mobile applications, you can also generate a barcode yourself.
   On mobile applications, the `TezosAPI.ConnectWallet()` method triggers the `PairingRequested` event, which you can use to make the `Tezos.QR.QrCodeGenerator` class generate a QR code and show it on the interface for the user to scan with a wallet app.

1. Regardless of the connection method, the SDK runs the `WalletConnected` event and the `TezosAPI.ConnectWallet()` method returns information about the connected account.

## Connecting to WalletConnect wallets

Unity applications can connect to EVM wallets such as MetaMask by a showing popup window that helps users connect.
The popup window can show a QR code for wallet apps to scan or open wallet apps on devices directly.

Follow these steps to connect to a wallet with the WalletConnect protocol:

1. Install the Tezos Unity WalletConnect SDK:

   1. Make sure the Tezos Unity SDK is installed as described in [Installing the SDK](/unity/quickstart#installing-the-sdk).

   1. In your Unity project, in the Package Manager panel, click the `+` symbol and then click **Add package from git URL**.

   1. Enter the URL `https://github.com/trilitech/tezos-wallet-connect-unity-sdk.git` and click **Add**.

   The Package Manager panel downloads and installs the WalletConnect SDK.

1. In the Unity project, add a button that users click to connect their wallet and a button that users click to disconnect their wallet.
You will add code to these buttons in a later step.
You can also use a single button and change its behavior to connect or disconnect based on whether there is a currently connected wallet.

1. Add a TextMeshPro text field to show information about the connection, such as the account address.

   The scene looks similar to this example:

   ![An example of how the scene might look with information text, connection buttons, and a space for the QR code](/img/unity/unity-scene-layout-walletconnect.png)

1. In your Unity project, add a class in a script file to hold the code for the connection operations.
The class must inherit from the Unity `MonoBehaviour` class, as in this example:

   ```csharp
   using System;
   using Netezos.Encoding;
   using Tezos.API;
   using Tezos.Operation;
   using Tezos.WalletProvider;
   using TMPro;
   using UnityEngine;
   using UnityEngine.UI;

   public class MyScripts : MonoBehaviour
   {
       [SerializeField] private TMP_Text _infoText;
       [SerializeField] private Button _connectButton;
       [SerializeField] private Button _disconnectButton;

       private async void Awake()
       {
           await TezosAPI.WaitUntilSDKInitialized();

           // Check for prior connections
           if (TezosAPI.IsConnected()) _infoText.text = TezosAPI.GetConnectionAddress();

           // Run functions when users click buttons
           _connectButton.onClick.AddListener(OnConnectClicked);
           _disconnectButton.onClick.AddListener(OnDisconnectClicked);
       }

       private async void OnConnectClicked()
       {
           // Connect to an EVM wallet such as MetaMask
           var walletProviderData = new WalletProviderData { WalletType = WalletType.WALLETCONNECT };
           try
           {
               var result = await TezosAPI.ConnectWallet(walletProviderData);
               _infoText.text = result.WalletAddress;
           }
           catch (WalletConnectionRejected e)
           {
               _infoText.text = "Wallet connection rejected";
               Debug.LogError($"Wallet connection rejected. {e.Message}\n{e.StackTrace}");
           }
           catch (Exception e)
           {
               Debug.LogException(e);
           }
       }

       private async void OnDisconnectClicked()
       {
           // Disconnect the currently connected wallet
           try
           {
               var result = await TezosAPI.Disconnect();
               _infoText.text = "Disconnected";
           }
           catch (Exception e)
           {
               Debug.LogException(e);
           }
       }

   }
   ```

   This code includes:

      - Objects that represent the buttons and a text field to show information on the screen
      - An `Awake()` (or `Start()`) method that waits for the `TezosAPI.WaitUntilSDKInitialized()` method to complete, which indicates that the SDK is ready
      - A check to see if a wallet is already connected, because Beacon can automatically remember previously connected wallets
      - Listeners to run when users click the buttons, in this case a connect button and a disconnect button

1. On the component that represents your script, drag the connection buttons and text information field to bind them to the objects in your script, as in this image:

   ![Binding the buttons and text field to the objects in your script](/img/unity/unity-scripts-walletconnect.png)

1. Play the scene.

1. When the scene loads, click the connection button.

   The application shows a WalletConnect popup window with an option to open compatible wallet apps or show a QR code.

1. In your Tezos wallet, scan the QR code and connect to the application.

## Connecting to social wallets

Social wallets exist as federated identity accounts managed by web apps such as [Kukai](https://kukai.app/).
To connect to a social wallet, the Unity application calls

To connect to a social wallet, the Unity WebGL application calls `Wallet.Connect()` with the `walletProvider` parameter set to `WalletProviderType.kukai`.

Follow these steps to connect the application to social wallets:

1. For testing purposes, set up a local social login server.
This server acts as the federated identity server that manages user accounts.

   1. Run the example server at https://github.com/trilitech/social-login-web-client.

   1. Open the server in a web browser at http://localhost:3000.

   1. Use the Kukai log in window to log in to a social account:

      <img src="/img/unity/kukai-sample-server.png" alt="The Kukai login window" style={{width: 300}} />

   1. In the browser console, search for the phrase `OPENING DEEPLINK` and copy the URL for the deep link, which starts with `unitydl001://kukai-embed/`.

1. Configure the test script for social logins:

   1. In the Unity application, add a script named `DeepLinkTester.cs` with this code:

      ```csharp
      using System.Reflection;
      using UnityEngine;

      namespace Samples.RefactorExample
      {
          public class DeepLinkTester : MonoBehaviour
          {
              public string deepLinkURL = "";

              [ContextMenu("Trigger Deep Link")]
              public void SimulateDeepLinkActivation()
              {
                  // Use reflection to invoke the internal InvokeDeepLinkActivated method
                  var methodInfo = typeof(Application).GetMethod("InvokeDeepLinkActivated", BindingFlags.NonPublic | BindingFlags.Static);

                  methodInfo?.Invoke(null, new object[]
                                           {
                                               deepLinkURL
                                           });
              }
          }
      }
      ```

   1. Add the script to the canvas, open it, and add the URI in the **Deep Link URL** field:

      <img src="/img/unity/kukai-test-url.png" alt="Setting the URL" style={{width: 300}} />

1. In the Unity application, call the `TezosAPI.SocialLogIn()` method and passes the Kukai wallet type:

   ```csharp
   try
   {
       SocialProviderData socialProviderData = new SocialProviderData { SocialLoginType = SocialLoginType.Kukai };
       var result = await TezosAPI.SocialLogIn(socialProviderData);
       _infoText.text = result.WalletAddress;
       Debug.Log(result.WalletAddress);
   }
   catch (SocialLogInFailed e)
   {
       _infoText.text = "Social login rejected";
       Debug.LogError($"Social login rejected. {e.Message}\n{e.StackTrace}");
   }
   catch (Exception e)
   {
       Debug.LogException(e);
   }
   ```

1. Bind the code that uses `TezosAPI.SocialLogIn()` to a button.

1. Test the application by running it:

   1. Run the application.

   1. Click the button that triggers the `TezosAPI.SocialLogIn()` code.

   1. In the `DeepLinkTester.cs` script, click the properties and then click **Trigger Deep Link**:

      <img src="/img/unity/kukai-trigger-deep-link.png" alt="Triggering the URL for the deep link" style={{width: 300}} />

1. The deep link provides the connection information to the SDK and the call to `TezosAPI.SocialLogIn()` resolves with the wallet connection.

When you are ready to deploy the Unity app to production, you must run a social login server and make the application use it:

1. Run the social login server using the example at https://github.com/trilitech/social-login-web-client.

1. In the `Assets/Tezos/Resources/TezosConfig.asset` object, in the **Kukai Web Client Address** field, add the URL of your social login server to use.
This is a server that you run tp handle authentication for your application.
For an example, see https://github.com/trilitech/social-login-web-client.

Now when the app is deployed it sends users to your server to log in and the server returns a deep link to the app.

## Checking the connection type

To verify that the application is connected to a wallet, use one of these methods:

- `TezosAPI.IsConnected()`: Returns true if any kind of wallet is connected to the application and false if not.
- `TezosAPI.IsWalletConnected()`: Returns true if a Beacon or WalletConnect wallet is connected.
- `TezosAPI.IsSocialLoggedIn()`: Returns true if a social wallet is connected.

To distinguish between Beacon and WalletConnect wallets, use `TezosAPI.GetWalletConnectionData()`.
This method returns a `WalletProviderData` object that includes information about the connected wallet and account.
Its `WalletType` field is `WalletType.BEACON` for Beacon wallets and `WalletType.WALLETCONNECT` for WalletConnect wallets.

## Disconnecting

It's important to provide a disconnect button so the user can disconnect when they are finished with the application or if they want to connect with a different account.
To disconnect the active wallet, call the `Wallet.Disconnect()` method.
This method triggers the `WalletDisconnected` event and removes the connection from the wallet app.
For Beacon connections, it removes the connection from the persistent memory.
