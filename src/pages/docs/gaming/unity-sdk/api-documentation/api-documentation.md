---
id: api-documentation
title: API Documentation
authors: Matthew Roberts
---

# API Documentation for Unity's Tezos Integration SDK

We have created this Tezos Integration SDK to give developers all they need to establish connections between games or other DApps built with Unity and the Tezos network, by way of a Tezos-compatible crypto wallet.  This SDK can be used for Unity games & DApps built to the iOS and Android mobile platforms, as well as to WebGL and to desktop.  Our SDK allows users to pair a wallet (on the same physical device or, where appropriate, on a different device) as the means of 'logging in' or authenticating to your app; after login, through this SDK your game or DApp can make PRC calls to the Tezos network, both to execute transactions on contracts and with entrypoints you have specified, and to read data from off-chain views you specify.    

The present document is solely intended as a guide to methods made available in the public API of the SDK itself, which was designed to support a very wide range of use cases involved with Tezos/Unity integration.  We will not discuss specific use cases here except to the extent that these pertain to or clarify a particular method of the API.  Our accompanying [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) was designed to showcase around a dozen common use-cases for a Web3-enabled live-action RPG game, so you may well wish to consult the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) to see how we are consuming this SDK in each case.  Some further potential use cases for this SDK are discussed in our [Other use cases](/gaming/unity-sdk/other-use-cases) document. 

## ITezosAPI.cs

Once you've imported our SDK package into a Unity project, you will find this C# class file at Assets/Scipts/TezosAPI/, along with its single implementatoin class **Tezos.cs**.  As an interface class, ITezosAPI contains only the method signatures, in addition to some commenting.  The following document will explain the general purpose of each method, define each of the arguments/parameters, offer code examples of how we call these methods for the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game), and explain any other aspects of each method that may be necessary to understand in using it for yourself.

The methods in our API can be grouped together into two main categories: 

1) Methods necessary to establish a connection (pairing) with a Tezos-compatible wallet, to manage that connection, ensure that the connection is still active at any given point, disconnect when necessary, and determine the currently-active wallet address whenever this is necessary for other operations.  An actively paired wallet is required in order to call any of the methods in the second category


2) Methods that communicate with the Tezos network itself, either directly with an on-chain smart-contract or with an off-chain view attached that contract, once the wallet connection is established.  

### Coroutines and IEnumerators

These terms will be familiar to many developers who use C#, but in case they are not, we should note here that some (though not all) of the methods in this API are defined as IEnumerators and are intended to be called as coroutines.

An **IEnumerator** is a special type of class in C# (and other languages) that is intended to return an enumeration or list of objects, as for example a list of items in a user's inventory.  But even if a particular data-fetch call is expected to return only a single data object --for example the balance of Tez or coins for a single user --a method must also be an IEnumerator if it is to be called via a coroutine.

**Coroutines** are one of the ways that Unity C# developers handle function calls that may have a noticeable latency or duration before returning data that the Unity app is waiting to process.  Classes in Unity apps are typically `monobehaviors`, and these are *single-threaded* (rather than multithreaded as in many modern applications).  This means that if the Unity app were to call one of these API methods in the usual direct way (e.g. `MyInventoryList[] = Tezos.ReadView(arg1, arg2...)`), the calling method would need to stop all further action and wait for `ReadView()` to return its data set before proceeding.  But `ReadView()` is making an http call to a Tezos RPC node to fetch that data, and the resulting wait might take several seconds, during which the calling method (and consequently the entire Unity app) would need to remain frozen.  Using coroutines instead allows the calling class to essentially step away from this method and conduct other business while awaiting the data return.

In short, coroutines and IEnumerators work together to handle calls which we know in advance will entail noticeable latency.

Here is a simple example of using a coroutine to call our API `ReadView()` method, passing in 'get_balance' as the view method to be executed, which returns a single-record json data structure `result` containing the named property `int` and some associated value, which we are then casting as an Int32 for further use:

```csharp
var caller = _tezos.GetActiveWalletAddress();
var input = string "MyString"; 

CoroutineRunner.Instance.StartCoroutine(
    _tezos.ReadView(contractAddress, "get_balance", input, result =>
    {
        var intProp = result.GetProperty("int");
        var intValue = Convert.ToInt32(intProp.ToString());
    }
```

As noted above, `ITezosAPI.ReadView()` may *only* be called with a coroutine because it has been defined as an IEnumerator:

 `public IEnumerator ReadView(string contractAddress, string entryPoint, object input, Action<JsonElement> callback);`

Please note as well that the above example is simple because the coroutine call is expecting *only* a single-record data return.  If it were instead expecting *multiple* records in the return, some kind of iteration logic would be needed to handle that return, e.g:

```csharp
public void GetMyCarsfromIEnumerator(int UserID) 
{  
    MyCars = new string[];

    CoroutineRunner.Instance.StartCoroutine(
        GetCarsByUserIDEnumerator(UserID, MyCars => OnCarsFetched(MyCars, callback));  
        //MyCars will be a string array like {"Volvo", "BMW", "Ford", "Mazda", "Kia", "Buick"}
        //we are passing this returned [] into a separate callback method OnCarsFetched() for handling
}

private OnCarsFetched(string[] carInventory){
    string car;
    Foreach (car in carInventory){
        Debug.Log("one of my cars is a " + car);
        }
}
```

### BeaconSDK and Netezos

In creating our Unity/Tezos integration SDK, the Unity team has leveraged two different 3d-party SDKs: one, created by the Papers team, is referred to in our code as Beacon (code can be found in the BeaconSDK folder under Scripts) and helps primarily with managing connections with our wallets.  The other, created by the Baking Bad team, is called Netezos (code in Netezos folder) and provides a number of direct and helper functions for connecting with the Tezos network and handling data passed in and out.

The Unity team very much appreciates the assistance of the Baking Bad and Papers teams in adapting their code to the needs of our Unity integration.  *For the most part*, the resulting code lies hidden behind our public API and its inner workings are outside the scope of this document.  While this code is open for your inspection, we cannot speak for the results of calling, for example, Netezos methods within our SDK directly, as their component was not intended to support all of the Unity platforms and has been modified in various ways for our purposes.

There are two important exceptions to keeping these 3rd-party functions hidden, having to do with Netezos helper functions to 1) prepare the input data necessary for communicating with Tezos functionality in some cases, and 2) parse the data returned from data-fetch operations.  As such, these helper functions are a part of our public API, and we will explain these functions as necessary below.

------

## Wallet Related Operations

### ConnectWallet()

 `public void ConnectWallet();`

<u>No parameters</u>.  

This public API method handles all instances of wallet pairing.  It could be called as follows:

```csharp
_tezos = new Tezos(networkName, networkRPC);
_tezos.ConnectWallet();
```

This method seems surprisingly simple, as it needs to accommodate three distinct modes of wallet-pairing: deeplink, QR Code Scan and injection:

1. With the game app deployed to either an <u>Android or iOS mobile device</u>, the pairing would most likely happen via **deeplink** to a wallet installed on that same device. Conceivably, you could have the game installed on one mobile device and pair via **QRCode scan** with a wallet installed on a second mobile device, but in most cases (as in our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project) the app UI will only offer the deeplink option for a game app running on mobile. 
2. With the game app deployed to a <u>desktop</u> platform, the pairing could happen via **deeplink** to a wallet installed on that same desktop machine (though only some wallets have that installation option, and Temple, for example, is not among them--it comes only as a browser plugin and a mobile app). More likely in this case, the pairing would happen via **QR Code scan** with a wallet installed on a mobile device.
3. With the game app published to <u>WebGL</u>, and thus hosted online, the pairing could happen through either a **QRCode scan** with a mobile wallet, or through **injection**, which in this context means pairing with a browser-extension wallet where that browser is also hosting the WebGL app. However, for WebGL this choice is offered natively by the dialogue that will be invoked by the call to _tezos.ConnectWallet(). 

Except in the case of WebGL, which handles the choice of pairing modes natively, the way that this API method handles the wallet-connection sequence depends on a degree of complexity and platorm-specific logic in the calling code, as *well* at the crucial services of a Beacon SDK component class called **BeaconMessageReceive**r, which is itself exposed in our Tezos API:

 `public BeaconMessageReceiver MessageReceiver { get; }`

The BeaconMessageReceiver class declares a series of public events which can be raised (and elsewhere subscribed to) to determine the success or failure of various API methods and the sequences they initiate:  As we'll encounter this Beacon class again with our final API method described below, **RequestSignPayload(),** let's go ahead and look at the full list of public events defined here:

```csharp
public event Action<string> ClientCreated;
public event Action<string> AccountConnected;     // <== we'll listen for this event to indicate a succesful pairing
public event Action<string> AccountConnectionFailed;
public event Action<string> AccountDisconnected;
public event Action<string> ContractCallCompleted;
public event Action<bool> ContractCallInjected;
public event Action<string> ContractCallFailed;
public event Action<string> PayloadSigned;
public event Action<string> HandshakeReceived;    //<== we'll listen for this event to confirm the initial handshake
public event Action<string> PairingCompleted;     //-- we'll lisen for this event in the case of iOS handshake success
public event Action<string> AccountReceived;
```

At one point or another, each of these enumerated actions will be subscribed by calling code in our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project in order to determine the success (or failure) of *some* operations in our various use cases.  For now we're interested, to start with, in the `HandshakeReceived` event, which can be subscribed to as follows:

`_exampleManager.GetMessageReceiver().HandshakeReceived += (handshake) => [TAKE SOME ACTION IN RESPONSE TO THIS MESSAGE]`

In practice, the `HandshakeReceived` event means that the game app has established some kind of physical connection with the wallet it would like to pair with: this manifests as the wallet app opening (requesting to be unlocked as necessary), and displayed a Confirmation screen, as we illustrate in the first use case of our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game). The actual string variable named `handshake` is a long string array which encodes exactly which app in the Tezos ecosystem (including our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game)) is requesting this pairing.   That string might look something like this in practice:

`"Px8f36UtZrQCKMVk37gQN2nesBMMjupr6zQDZ3MopxrzWjDcFxnBX5XAVDsy9zyuU5T1PZ6WYCQpn1hW2NCVVzGmtNggBJkEWvgikxSYNnpRPUaphAbWEeV7FtJj7RRF2SVtD9UL4AAmZNhgwxZn3MZP9SeLqxmB15VySdr5VVnvo9PAxX8odM6dLsdxhfX3NmrFJFBTvSxr495Yt5GbriXshRemueALqXQ99swYoaD8EoXyC3eiGKhEyCspnTbNgUXBhedJZpMo5dXchRUy2uWq8PoGJJWySZo5mKttu6reo7AgqeuxvYD8DjvwKV1eEMoLAmMaTcwK5uA4"`

This string might look daunting to process, but as you'll see in Use Case 2 of the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project, while we do have pass it around together with the `HandshakeReceived` event, most of the actual parsing of this string will done automatigically. If such parsing is necessary at all: it only really will be if the calling code finds a sitution in which we must actually display a QR Code to be scanned remotely, which means rendering that long handshake string into the distinctive and unique pattern of a QR code image.  This is done in our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project in QRCodeView.SetQRCode(), and for details on that the  reader is referred to **Use Case 2** of the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game#use-case-2-game-displays-a-running-count-of-the-users-in-game-currency-balance-and-wallet-tez-balance). 

 Whatever the pairing method, though, It's important to note though that this physical 'handshake' of the game and wallet apps only *initiates* the pairing; that paring is not finalized until it is confirmed by the user from within the wallet.  At that point BeaconMessageReciever will raise a second event, or actually two: HandshakeReceived for the benefit of iOS game devices, and ParingCompleted for the other platforms (don't ask).  So any calling code wishing to learn of the success (or indeed the failure) of this pairing sequence needs to subscribe to these events as well, such as HandshakeReceived but also AccountConnectionFailed and AccountDisconnected).  Here is one of our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project calling classes subscribing to a bunch these events at once, upon its initialiation:

```csharp
_manager.GetMessageReceiver().AccountConnected += OnAccountConnected; //<== the happy path
_manager.GetMessageReceiver().AccountConnectionFailed += OnAccountConnectionFailed; //<== pairing failed
_manager.GetMessageReceiver().AccountDisconnected += OnAccountDisconnected; //<== paring was diconnectd
_manager.GetMessageReceiver().ContractCallCompleted += OnContractCallCompleted;
_manager.GetMessageReceiver().ContractCallFailed += OnContractCallFailed;
_manager.GetMessageReceiver().ContractCallInjected += OnContractCallInjected;
```

In our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project, the class in question is UIManager, which handles the visibility and invisibiliy of our major UI panels (and the various user controls thereon), in response to these first thee events. Thus an AccountConnected event will call the method OnAccountConnected(), which will cause the Login Panel to hide, and the Welcome panel and Inventory and Market Tabs to appear.  You may not wish to publish across as many platforms, or for other reasons may want to streamline the wallet-pairing process.  But with calling ConnectWallet() and confirming the sequence of HandshakeReceived and then AccountConnected events, your app will not be able to prceed with Web3 integration. 



### DisconnectWallet()

 `public void DisconnectWallet();`

<u>No parameters</u>.  This method removes the active (paired) wallet connection and thus disconnects  the app from the SDK.  



### GetActiveWalletAddress()

 `public string GetActiveWalletAddress();`

<u>No parameters</u>.  This method returns the hashID address of the currently active wallet account, or NULL if there is no active wallet.  Useful both for UI display and (more importantly) when you need to pass in the current user account for a ReadView() or a CallConract() call.



## Tezos Communication Operations

### ReadBalance()

`public IEnumerator ReadBalance(Action<ulong> callback);`

 <u>Parameter:</u> **callback** Action -- how the calling method should respond to the balance returned value. 

Gets the currently-paired wallet's balance in Mutez (which are one-millionth of a full Tez, the Tezos cryptocurrency) , via an RPC call to a node.  This should not be confused with the account's balance in any local (in-game) currency you might be using, as we do with 'coin' in our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project.   As an IEnumerator, ReadBalance() must be called with a coroutine, as for example: 

```csharp
private void SetBalanceText(ulong balance)
{
    var floatBalance = balance * 0.000001;
    balanceText.text = (floatBalance).ToString();
}

var routine = _tezos.ReadBalance(SetBalanceText);
CoroutineRunner.Instance.StartCoroutine(routine);
```

Since the return value is only a single object, the ulong amount of the user's balance in MuTez, no iteration logic is needed for calling this particular method.  Just remember to convert this balance back to Tez before displaying it in a UI, as shown above.

### CallContract() and ReadView(): Formatting the Input as Micheline Data

CallContract() and ReadView() are both low-level, generic methods.  That is, CallContract() can be used to make a call to any specified entrypoint of any specified Tezos smart contract.  Conversely, ReadView() can make an RPC call to any existing Tezos off-chain view (views will be explained further as part of the method description below), as an efficient way of returning data from contract storage.  CallContract() could be used, for example, to grant users currency, mint items, place items on an in-game market and purchase items, among other operations.  ReadView() could be used to fetch a list of personal inventory items, a list of market items, a user's current balance of in-game currency, etc.

To allow for this generic nature, each of these methods specifies, as input parameters, the `contractAddress` of the contract to be called, the specific `entryPoint` (or view function) name to be called, and then a parameter named `input` which will be a string data structure including whatever additional arguments that specific view function or contract entryPoint requires.  This introduces some complexity related to the *format* in which this `input` data-string is composed: it must be JSON data string representing a Micheline expression.  

(For a general introduction to Micheline syntax see: https://tezos.gitlab.io/shell/micheline.html)

One possibility is to compose these Micheline-formatted input strings by hand.  For example, if your entrypoint required a single-element string input, like the string "Fred", this could be written as "{"prim\": \"Fred"}".  The composition becomes much more complex, however, if we wanted to specify for example three arguments--a sender's wallet address, a contract address and an itemID:

`"[ { \"prim\": \"Pair\", \"args\": [ { \"string\": \"" + sender + "\" }, [ { \"prim\": \"Pair\", \"args\": [ { \"string\": \""KT12345684735544450033"\" }, { \"prim\": \"Pair\", \"args\": [ { \"int\": \"" + 297 + "\" }, { \"int\": \"1\" } ] } ] } ] ] } ]";`

This is a bit diificult both to write and to read, as in C# this string would need to be written in a single line, and all the double quotes would need to be escaped. Presented as formatted JSON, this same string is considerably more readable:

```json
[
    {
        "prim": "Pair",
        "args": [
            { "string": sender },  //sender would be some specific wallet id, e.g. myWalletHashtzabczygtics
            [
                {
                    "prim": "Pair",
                    "args": [
                        { "string": "KT12345684735544450033" },
                        {
                            "prim": "Pair",
                            "args": [
                                { "int": "297" },
                                { "int": "1" }
                            ]
                        }
                    ]
                }
            ]
        ]
    } 
]
```

But unfortunately C# cannot pass in a nicely-formatted json string like this. Therefore we will use a set of helper classes from the Netezos component of our SDK to help us build these more complex Micheline-friendly strings. 

Using the utility class **MichelineString**, a Micheline expression in the JSON format can build a single-value string as follows: 

`input = new MichelineString("example");`

This call generates a string containing `{"string": "example"}` and loads it into the `input` parameter.  This could be used to send strings of any kind, such as an item name, but can also be used to send wallet addresses as these are hash strings.

The related class **MichelineInt** accepts an integer argument and builds a string with it: thus, `input = new MichelineInt (42)` will generated a string containing `"{"int": "42"}"`.  This can be used to send int, but also nat or tez, or timestamp values.

For more composed `input` structures like pairs or lists of parameters, we can use **MichelinePrim**, which has a type (prim), then potentially a list of arguments (args), where each argument itself is a Micheline expression.  For example, for a pair containing a string `owner` and an int `ItemID`, we can call:

```csharp
var parameter = new MichelinePrim
    {
        Prim = PrimType.Pair,
        Args = new List<IMicheline>
        {
            new MichelineString(owner), 
            new MichelineInt(itemID)
        }
    }.ToJson();
```

This will generate the string

```json
{
    "prim": "Pair",
	"args": [

        { "string": "myWalletHashtz1QQM1XgU43MhdLeyyRGdBiVeeeWDjQuLLU"},
    	{ "int": itemID }  //whatever the actual itemId is, e.g. "342"
    ]
}  
```

The full list of types for prim can be found here here: https://netezos.dev/api/Netezos.Encoding.PrimType.html

To figure out what Micheline expression to generate for a given contract entrypoint, an easy way is to use the online tool http://Better-Call.dev, find your specific contract and go to the “interact” tab; provide the values for the different parameters, then click on execute, and pick “Raw JSON”.  For an example see: https://better-call.dev/ghostnet/KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5/interact/addLiquidity

Another way to determine the Micheline expression is to use the CLI command `ligo compile parameter`, and select the json format.  See [https://ligolang.org/docs/manpages/compile_parameter](https://ligolang.org/docs/manpages/compile parameter)



### ReadView()

 `public IEnumerator ReadView(string contractAddress, string entryPoint, object input, Action<JsonElement> callback);`

As noted above, ReadView() is our generic API method for calling views.  A Tezos off-chain**view** executes in a single RPC node, though the Michelson code it executes is defined in the metadata of a specified on-chain contract.  The view accesses the current storage of the contract, and generate a Michelson data structure that we can then retrieve. This is a good way to access parts of the storage efficiently, and even do Michelson computation to get precisely what we need in a given call. The ReadView() method assumes that the off-chain view was present when the specified contract was deployed.

To call a view using this method we need the following <u>parameters</u>:

`contractAddress`: this will be the address set by the most recent call to SetContractAddress()

`entrypoint` : This is the name of the view--not a true entrypoint, but signature and logic of the view will be defined in the specified contract

`input`: this will be the Micheline-encoded sting containing all arguments required specifically for a given view function (see immediately above for Micheline encoding)

A `callback` action that handles the Micheline result returned by the ReadView() call

Because ReadView() makes an RPC call, *and* because it often (though not always) returns an array of multiple data records, this method is defined as an **IEnumerator** and will be called as a **coroutine**.  Because the data structure it returns will itself be Micheline-encoded, we must take an additional step to parse this returned data into a format that is more human-readable and useable by our C# Unity code. This step requires the use of another SDK utility method, `BeaconSDK.NetezosExtensions.HumanizeValue()`, which we will describe in a moment.  First, let's see what the full call from a consuming C# class might look like:

```csharp
var viewName= "view_items_on_market";
var input = micheline-encoded value as presented above
CoroutineRunner.Instance.StartCoroutine(
    _tezos.ReadView(viewName, input, result =>
        {
            var destination = contractAddress;
			CoroutineRunner.Instance.StartCoroutine(
    			BeaconSDK.NetezosExtensions.HumanizeValue(
        			result,
        			destination,
        			"humanizeMarketplace",
        			(
            			ContractInventoryViewResult[] inventory) =>
                		OnInventoryFetched(inventory, callback)
        			)
    			)
            );
        }
    )
);
```

We see that the call actually consists of two nested coroutines: the first one makes the actual call to Tezos.ReadView(), passing in the required parameters for that call; and the second one uses the **callback action** of the ReadView() call to make its own coroutine call to our SDK's helper method NetezosExtensions.HumanIzeValue().  

#### Parsing ReadView() results with HumanizeValue()

As noted, the data retrieved from a Tezos view will itself be a JSON string in Michelson format, which can be difficult to read.  For example, in the `view_items_on_market` case shown in the example code above, we will get a return data structure with (likely multiple) records for current marketplace items, where each item has a number of associated values (in the case of our Marketplace fetch there is a value for token_id, owner, CurrencyType, price, and ItemType). However, this michelson data structure will only include the actual *values* for each property, in a predefined order, but not the property names themselves   This makes that data return structure challenging not only to read but also to parse programmatically, as the Unity code will need to do.  

To help us here we use BeaconSDK.NetezosExtensions.HumanizeValue, to which we pass 

- the micheline result of the ReadView() call, 
- the address of the contract in which the view was defined, 
- the name of a helper method defined in that contract which is specific to our given use case (such as "humanizeMarketplace" in the example above), and 
- a further callback method that will process the 'humanized' results.

In brief, HumanizeValue is a Netezos helper method which goes (back) to the specified contract and, with the help of the specified helper function defined there (e.g. "humanizeMarketplace"), discovers the relevant field names for that array of values.   So in the case of the marketplace fetch, what will be important is is the way the storage type `view_marketplace_result` is defined in the relevant contract: 

```
// data format for marketplace
type view_marketplace_result ={
// @layout:comb
 id: int,
 owner: address,
 currency: int,
 price: int,
 item: Item.t};
```

Here we see all the correct property names defined.  The HumanizeValue() function is able to derive this data format, combine it with the original Michelson data structure returned from the ReadView() call, and return to the calling code a json string with all the name/value pairs specified.  This can then be much more easily parsed by the Unity code.  For specific examples see Use Case 3 and Use Case 7 in the [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game).



### CallContract()

 `public void CallContract(string contractAddress, string entryPoint, string input, ulong amount = 0);`

As explained above, this is our generic method for calling any contract entrypoint.  In our [Inventory Sample Game](/gaming/unity-sdk/inventory-sample-game) project we use CallContract() for minting NFTs, granting coins to users, adding items to the in-game market, buying items from the market, and transferring items to another user's account. 

Calling a contract is easier than calling a view, as you don’t have any data results to parse. On the other hand, the transaction needs to be signed by the user through their wallet.  

This method takes the following <u>Parameters:</u>

`contractAddress`: this will be the address set by the most recent call to SetContractAddress()

`entrypoint`: the name of the entrypoint in the contract we are calling

`input`: the Micheline-encoded string containing the arguments expected by the specified entrypoint

`amount`: this is optional and defaults to 0.  If the specified entrypoint involves a currency transfer, this will be the amount of currency. 

Here is an example of a call to this method:

```csharp
 public void BuyItem(string owner, int itemID, Action<bool> callback)
    {
        var destination = contractAddress;
        var entryPoint = "buy";
        
        var input = new MichelinePrim
        {
            Prim = PrimType.Pair,
            Args = new List<IMicheline>
            {
                new MichelineString(owner), 
                new MichelineInt(itemID)
            }
        }.ToJson();

        _tezos.CallContract(contractAddress, entryPoint, input, 0);
    }
```

Note first that we have no coroutines here: CallContract() is defined simply as a `public void` method, meaning that it cannot return data.  With no return data to parse, we likewise need no nested call to HumanizeValues.  However, we do still need to compose a micheline-formatted input string, for which we again use the Netezos Micheline helper classes MichelinePrim, MichelineString and MichelineInt.  In this case we are passing in a string containing arguments for the owner of the item as well as the itemID.  



### RequestSignPayload()

`public void RequestSignPayload(int signingType, string payload);`

This method sends a request to the paired wallet to sign a message (payload).  This could be used in place of our normal blockchain transaction requests if a game publisher wanted to execute transactions on behalf of a user without that user incurring such fees.  For example, a game developer might want to subsidize or fully cover players' fees during certain parts of the game, such as an onboarding tutorial.   Such a signed payload would typically have to be sent to a game back-end and processed there accordingly. 

[MATHIAS: CAN YOU PROVIDE A LINK TO HOW THIS KIND OF FULL-CYCLE IMPLEMENTATION MIGHT WORK IN PRACTICE? IT REALLY HAS MUCH LESS TO DO WITH THE SDK THAN BACK-END INFRASTRUCTURE]

Whatever the backend implementation, the currently paired wallet will still need to 'sign' or authorize this transaction, to provide the signed payload that can be processed in the backend.   Our API method `RequestSignPayload()` makes a call to a class within the Beacon component of our SDK, called **BeaconMessageReceiver**, which is also exposed in our Tezos API class:  We have already seen this pattern in our WalletConnect) API call; we have seen that BeaconMessageReceiver defines and invokes a series of public events.  Here's that list of events again:

```csharp
public event Action<string> ClientCreated;
public event Action<string> AccountConnected;   //<= wallet-pairing success event
public event Action<string> AccountConnectionFailed; // pairing-failure 
public event Action<string> AccountDisconnected;     // pairing disconnection
public event Action<string> ContractCallCompleted;
public event Action<bool> ContractCallInjected;
public event Action<string> ContractCallFailed;
public event Action<string> PayloadSigned;      //<===================================== our event of current interet
public event Action<string> HandshakeReceived;   // <= initial wallet handshake event
public event Action<string> PairingCompleted;
public event Action<string> AccountReceived;  
```

In this case the specific event `PayloadSigned` indicated here is raised when `tezos.RequestSignPayload()` calls `BeaconMessageReceiver.OnPayloadSigned()`.  Any code calling our API method RequestPayload() must subscribe to this event, for example

`_MessageReceiver.GetMessageReceiver().PayloadSigned += OnPayloadSigned => [Do some action as a result of this event];`

 parameter `signingType`: enumerates the signing type or format of the payload string to be signed (0 = MICHELINE, 1 = OPERATION, 2 = RAW)

[WOULD BE GOOD TO HAVE SOME CLEAR EXPLANATION OF WHAT THESE TYPES MEAN, AS THIS ISN'T CLARIFIED YET]

 parameter `payload`: payload string that is needs to be signed

