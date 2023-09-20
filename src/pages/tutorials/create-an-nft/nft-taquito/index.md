---
id: nft-taquito
title: Create a web app that mints NFTs
authors: 'Sol Lederer, Tim McMackin'
lastUpdated: 20th September 2023
---

This tutorial covers how to set up a decentralized web application (dApp) that allows users to create NFTs on Tezos.
No prior knowledge of NFTs or Tezos is required, but because the tutorial application uses TypeScript, some familiarity with JavaScript or TypeScript will make it easier to understand.

In this tutorial, you will learn:

- What NFTs are
- How to set up distributed storage for NFT metadata
- How to deploy (originate) a smart contract to Tezos
- How to use the [Taquito](https://tezostaquito.io/) JavaScript/TypeScript SDK to access Tezos and user wallets

## What is a non-fungible token (NFT)?

An NFT is a special type of blockchain token that represents something unique.
Fungible tokens such as XTZ and real-world currencies like dollars and euros are interchangeable; each one is the same as every other.
By contrast, each NFT is unique and not interchangeable.
NFTs can represent ownership over digital or physical assets like virtual collectibles or unique artwork, or anything that you want them to represent.

Like other types of Tezos tokens, a collection of NFTs is managed by a smart contract.
The smart contract defines what information is in each token and how the tokens behave, such as what happens when a user transfers an NFT to another user.
It also keeps a ledger that records which account owns each NFT.

In this tutorial, you create NFTs that comply with the FA2 standard (formally known as the [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard), the current standard for tokens on Tezos.
The FA2 standard creates a framework for how tokens behave on Tezos, including fungible, non-fungible, and other types of tokens.
It provides a standard API to transfer tokens, check token balances, manage operators (addresses that are permitted to transfer tokens on behalf of the token owner), and manage token metadata.


## Prerequisites

To run this tutorial you need Node.JS and NPM installed.
See <https://nodejs.org/>.
You can verify that they are installed by running these commands:

   ```bash
   node --version
   npm --version
   ```

## Configure IPFS storage

Because storage space on blockchains is expensive, developers don't put entire token metadata files on Tezos.
Instead, they configure decentralized storage for the NFT data and put only the link to that data on Tezos itself.
In this section, you set up storage for the NFT metadata using the InterPlanetary File System (IPFS) protocol.

IPFS requires authentication just like blockchain transactions, so in this section you set up an account with the Pinata IPFS provider and use it to upload (or _pin_) the NFT data to IPFS.

1. Create a free Pinata account at <https://app.pinata.cloud/developers/api-keys>.

1. Go to the API Keys tab and click **New Key**.

1. On the Create New API Key page, expand **API Endpoint Access > Pinning** and enable the `pinFileToIPFS` and `pinJSONToIPFS` permissions, as in this picture:

   ![Selecting the permissions for the Pinata key](/images/nft-create/pinata-key-permissions.png)

1. In the **Key Name** field, give the key a name, such as "My Key."

1. Click **Create Key**.

   The API Key Info window shows the API key and secret, which you must copy immediately, because they are not shown again.

1. Copy the API Key and API Secret fields and save the values on your computer.
You need these values in the next section.

   You can see the new API key on the API Keys tab:

   ![The new Pinata API key in the Pinata web app](/images/nft-create/created-pinata-key-two-permissions.png)

Now your applications can use your Pinata account to pin NFT data to IPFS.

## Download the tutorial files

The tutorial application has three parts:

- The smart contract that manages the NFTs
- The backend application that handles uploading data to IPFS
- The frontend application that connects to the user's wallet, sends the data to the backend application, and sends the transactions to the smart contract to mint the NFTs

The tutorial application files are in this GiHub repository: <https://github.com/trilitech/tutorial-applications/tree/main/nft-taquito>.

If you have the `git` program installed, you can clone the repository with this command:

```bash
git clone https://github.com/trilitech/tutorial-applications.git
```

If you don't have git installed, go to <https://github.com/trilitech/tutorial-applications/tree/main/nft-taquito> and click "Code > Download ZIP" and extra the ZIP file on your computer.

Then, go to the application in the `nft-taquito` folder.

## The tutorial contract

The file `contract/NFTS_contract.mligo` contains the code for the smart contract that manages the NFTs.
This contract is written in the CameLIGO version of the LIGO smart contract programming language, with a syntax similar to OCaml.
This contract is already written for you, so do not need any experience with these languages to run the tutorial.

This contract creates NFTs that comply with the FA2 standard (formally known as the [TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) standard), the current standard for tokens on Tezos.
The FA2 standard creates a framework for how tokens behave on Tezos, including fungible, non-fungible, and other types of tokens.
It provides a standard API to transfer tokens, check token balances, manage operators (addresses that are permitted to transfer tokens on behalf of the token owner), and manage token metadata.

The full details of the smart contract are beyond the scope of this tutorial, but the major parts of the contract have descriptions in comments.

### Contract entrypoints

Like APIs, smart contracts have _entrypoints_, which are commands that clients can call.
To comply with the TZIP-12 standard, the smart contract must have these entrypoints:

- `transfer`: Transfers tokens from one account to another
- `balance_of`: Provides information about the tokens that an account owns
- `update_operators`: Changes the accounts that can transfer tokens

This contract includes these additional entrypoints:

- `mint`: Creates NFTs
- `burn`: Destroys NFTs

### Contract types

Because Tezos uses strongly-typed languages, this contract's code starts by defining the types that the contract uses.
These types are important for verifying that data is in the correct format, including that the client sends the correct data to the entrypoints.

For example, the `transfer` entrypoint accepts a list of the `transfer` type.
This type includes the account to transfer tokens from and a list of the `transfer_destination` type, which includes the account to transfer tokens to, the ID of the token to transfer, and the amount to transfer:

```ocaml
type token_id = nat

type transfer_destination =
[@layout:comb]
{
  to_ : address;
  token_id : token_id;
  amount : nat;
}

type transfer =
[@layout:comb]
{
  from_ : address;
  txs : transfer_destination list;
}
```

The type `fa2_entry_points` is a special type that the contract's `main` function uses to define the endpoints.
It maps the entry points to the type of parameter that they accept:

```ocaml
type fa2_entry_points =
  | Transfer of transfer list
  | Balance_of of balance_of_param
  | Update_operators of update_operator list
  | Mint of mint_params
  | Burn of token_id
```

### Error messages

The contract defines a series of error messages, and comments in the code describe what each error message means.
For example, the `balance_of` and `transfer` endpoints return this error if the client requests information about a token that does not exist or tries to transfer a token that does not exist:

```ocaml
(** One of the specified `token_id`s is not defined within the FA2 contract *)
let fa2_token_undefined = "FA2_TOKEN_UNDEFINED"
```

### Internal functions

The contract has many internal functions, such as this function, which gets the specified account's balance of tokens.
In the case of NFTs, only one of each token exists, so the function returns a balance of 1 if the account owns the token and 0 if it does not.

```ocaml
(**
Retrieve the balances for the specified tokens and owners
@return callback operation
*)
let get_balance (p, ledger : balance_of_param * ledger) : operation =
  let to_balance = fun (r : balance_of_request) ->
    let owner = Big_map.find_opt r.token_id ledger in
    match owner with
    | None -> (failwith fa2_token_undefined : balance_of_response)
    | Some o ->
      let bal = if o = r.owner then 1n else 0n in
      { request = r; balance = bal; }
  in
  let responses = List.map to_balance p.requests in
  Tezos.transaction responses 0mutez p.callback
```

### Main function

The `main` function is a special function that defines the entrypoints in the contract.
In this case, it accepts the entrypoint that the client called and the current state of the contract's storage.
Then the function branches based on the entrypoint.

For example, if the client calls the `balance_of` entrypoint, the function calls the `get_balance` function and passes the parameters that the client passed and the
current state of the contract's ledger:

```ocaml
  | Balance_of p ->
    let op = get_balance (p, storage.ledger) in
    [op], storage
```

Here is the complete code of the `main` function:

```ocaml
let main (param, storage : fa2_entry_points * nft_token_storage)
    : (operation  list) * nft_token_storage =
  match param with
  | Transfer txs ->
    let (new_ledger, new_reverse_ledger) = transfer
      (txs, default_operator_validator, storage.operators, storage.ledger, storage.reverse_ledger) in
    let new_storage = { storage with ledger = new_ledger; reverse_ledger = new_reverse_ledger } in
    ([] : operation list), new_storage

  | Balance_of p ->
    let op = get_balance (p, storage.ledger) in
    [op], storage

  | Update_operators updates ->
    let new_ops = fa2_update_operators (updates, storage.operators) in
    let new_storage = { storage with operators = new_ops; } in
    ([] : operation list), new_storage

  | Mint p ->
    ([]: operation list), mint (p, storage)

  | Burn p ->
    ([]: operation list), burn (p, storage)
```

### Initial storage state

When you deploy the contract to Tezos, you must set the initial state of its storage.
For this contract, the initial storage state is in the comment at the end of the file.
This state creates empty variables for the ledger, the list of operators, and the next token ID
It also initializes a few other values.

## Deploy the smart contract to the testnet

There are many ways to deploy (originate) a contract on Tezos.
For a tutorial on using the command line, see [Deploy a smart contract](../../deploy-your-first-smart-contract/).

Before you deploy your contract to the main Tezos network (referred to as *mainnet*), you can deploy it to a testnet.
Testnets are useful for testing Tezos operations because testnets provide tokens for free so you can work with Tezos without spending real tokens.

This tutorial uses the online LIGO IDE at <https://ide.ligolang.org/> because you don't have to install any tools to use it.

Follow these steps to originate the smart contract to Tezos:

1. In a web browser, open the IDE at <https://ide.ligolang.org/>.

1. At the top right, click the **Network** drop-down list and next to **Tezos**, select the **Ghostnet** testnet.
The network changes to the Ghostnet testnet, as in this picture:

   ![The IDE menu, showing the Ghostnet testnet selected](/images/nft-create/web-ligo-ide-ghostnet.png)

1. Create an account to use to deploy the contract:

   1. At the top right, click the **Keypair Manager** button.
   The "Keypair Manager" window opens.

   1. Click **Create**.

   1. Give the keypair a name such as "My keys" and click **Create**.

   1. From the "Keypair Manager" window, copy the address of the new account, which begins with `kt1`.

   1. Click **Close**.

1. Send funds to the account from the testnet faucet:

   1. Go to the Ghostnet faucet at <https://faucet.ghostnet.teztnets.xyz/>.

   1. Put the new account address in the **Or fund any address** field.

   1. Click the button to request 100 tokens and wait for the browser to complete the operation.

   1. When you see a message that the tokens are sent to your address, go back to the web IDE, open the "Keypair Manager" window and verify that the account has tokens, as in this example:

      ![The IDE Keypair Manager window, showing an account with funds](/images/nft-create/web-ligo-ide-account.png)

1. In the IDE, Click the **New** button.

1. In the "Create a New Project" window, give your project a name, such as "NFT tutorial," select "Empty Project" in the **Template** field, and select "CameLIGO" in the **Syntax** field.

1. Click **Create Project**.
The IDE opens a blank contract file and shows commands for the file on the left-hand side of the window.

1. Paste the contents of the `contract/NFTS_contract.mligo` file into the editor.
The IDE saves the file automatically.

1. Click **Compile** and then in the "Compile" window, click **Compile**.
The IDE compiles the contract code to Michelson, the base language that all Tezos contracts use.
At the bottom of the window, it prints the message `wrote output to .workspaces/NFT tutorial/build/contracts/Contract.tz`.
If you see an error, make sure that you copied the entire contract file.

1. Deploy the contract:

   1. Click **Deploy**.

   1. In the "Deploy contract" window, in the **Init storage** field, paste the initial storage value for the contract, which you can get from the comment at the end of the contract:

      ```ocaml
      {
        ledger = (Big_map.empty: (token_id, address) big_map);
        operators = (Big_map.empty: ((address * (address * token_id)), unit) big_map);
        reverse_ledger = (Big_map.empty: (address, token_id list) big_map);
        metadata = Big_map.literal [
        ("", Bytes.pack("tezos-storage:contents"));
        ("contents", ("7b2276657273696f6e223a2276312e302e30222c226e616d65223a2254555473222c22617574686f7273223a5b2240636c617564656261726465225d2c22696e7465726661636573223a5b22545a49502d303132222c22545a49502d303136225d7d": bytes))
        ];
        token_metadata = (Big_map.empty: (token_id, token_metadata) big_map);
        next_token_id = 0n;
        admin = ("tz1Me1MGhK7taay748h4gPnX2cXvbgL6xsYL": address);
      }
      ```

   1. In the **Signer** field, make sure your new account is selected.

   1. Leave the other fields blank and click **Estimate**.
   The IDE calculates the fees for the deployment.

   1. Click **Deploy** and leave the window open to wait for the contract to be deployed.

      Deploying the contract can take a few minutes.
      When the transaction completes, the window shows a message that the contract was deployed.

   1. Copy the contract address, which starts with `KT1`, and then close the "Deploy contract" window.

1. Verify that the contract deployed successfully by finding it on a block explorer:

   1. Open a Tezos block explorer such as [TzKT](https://tzkt.io) or [Better Call Dev](https://better-call.dev/).

   1. Set the explorer to Ghostnet instead of mainnet.

   1. Paste the contract address into the search field and press Enter.

   1. Go to the Entrypoints tab to see the entrypoints and their parameters.

Now anyone can call the Tezos contract if they have tokens for the fees and send a valid request.







### Creating an NFT platform on Tezos

Now comes the time to look at some code 👀

Our simple NFT platform will be made of 3 different parts:

* The **contract** written in Ligo will securely store the NFT ids and metadata and allow the users to mint, transfer, and burn their tokens
* The **backend** app written in Express \(JavaScript\) will provide us with a secure way of pinning the metadata to the IPFS and ensure that they are not tampered with
* The **frontend** app written in Svelte \(JavaScript\) will provide a user-friendly interface to interact with the contract and the backend.

These three parts of the platform will communicate with each other at some point: the frontend talks to the contract when a user starts the minting process of a new NFT and to the backend to pin the metadata and the picture on the IPFS. The backend talks to the frontend to provide the IPFS hash \(also called a [**CID**](https://docs.ipfs.io/concepts/content-addressing/)\) before minting the NFT. The contract just listens because Michelson contracts do not return any value, they don’t talk 🙂

#### The contract

The goal of this tutorial is not to create an FA2 contract from scratch but rather to understand the principles of such a contract. You can find amazing templates of FA2 contracts in the [TQ Tezos repository on Github](https://github.com/tqtezos/smart-contracts). This app uses a modified version of their NFT contract.

An FA2 contract generally consists of the following parts:

* A bigmap called **ledger** whose purpose is to associate the token ids created in the contract with their owner
* A bigmap called **metadata** records the metadata associated with the contract itself \(its name, version, etc.\)
* A bigmap called **token\_metadata** records the metadata associated with every token stored in the contract
* An entrypoint called **transfer** allows \(or forbids\) the transfer of one or multiple tokens from one address to another
* An entrypoint called **update\_operators** allows owners of tokens to give permission to other addresses to handle their tokens. This can be useful, for example, if the contract implements a marketplace where you can set your NFTs on sale and let the contract handle the sale
* An entrypoint often called **mint** \(or its variations\) creates new tokens with the provided data. This is where the token metadata is provided to be stored and where the token id is assigned to the NFT that’s being created.

> Note: in addition to these entrypoints and bigmaps, an NFT contract can implement other structures according to its use case, for example, you can have a bigmap with all the NFTs on sale and different entrypoints to set an NFT on sale, to purchase it or to withdraw it from the marketplace, you can have a burn entrypoint to destroy the NFTs you don’t want on the platform anymore, etc.

> It is essential to understand the difference between “**metadata”** and “token\_metadata”. The “metadata” bigmap holds information about the contract itself while the “token\_metadata” bigmap holds information about every single token stored in the contract.

The contract we will use for this tutorial is a basic FA2 contract that implements the structures and entrypoints described above. The users of the platform will be able to mint, transfer and burn their NFTs.

You can have a look at the contract [at this address](https://github.com/claudebarde/taquito-pinata-tezos-nft/blob/main/contract/NFTS_contract.mligo).

#### The backend

The backend of the app is a simple Express app written in TypeScript. The app only exposes a single route, “`/mint`”, that will be called to create the NFT metadata and pin it on the IPFS with the associated picture. Before continuing with the code, you must set up an account with [Pinata](https://pinata.cloud/) and get your API keys.

First step, sign up to create an account and follow the instructions:

![](/images/nft-pinata/image36.png)

When you are all set up, click on “API Keys” in the left panel:

![](/images/nft-pinata/image22.png)

To finish, click on “_+ New Key_” to get your keys:

![](/images/nft-pinata/image9.png)

You will get an API key and a secret key, copy-paste them somewhere safe to use them later as they won’t be visible anymore after that.

The app uses 5 packages:

![](/images/nft-pinata/image34.png)

* **express** allows us to set up a server app quickly
* **@pinata/sdk** gives us convenient functions to interact with our Pinata account
* **fs** \(or file system\) is a package already installed in Node JS that we will use to manipulate the picture sent by the user
* **cors** allows us to set up a CORS policy for our app and avoid unwanted requests from unauthorized sources
* **multer** is a package that will make handling the picture sent by the user a lot easier

Next, we have to do some setup before writing the “mint” endpoint. Because I used [Heroku](https://id.heroku.com/login) to host the app, there is also some Heroku-specific setting up to do to start the server:

![](/images/nft-pinata/image28.png)

Heroku doesn’t like it too much when you try to tell it which port to use 😅 So for the production version, you must let Heroku decide on which port your app is going to listen to.

Setting up the Pinata SDK will also depend on the `process.env.NODE_ENV` variable. You can choose to have your API keys in a separate file, both in the development and production environment, but Heroku lets you define environment variables that are automatically injected in your build and stored securely, so this is generally the solution you would prefer, i.e having a separate file with your keys for development and having your keys in environment variables for production. Whichever solution you choose, the Pinata SDK can be easily instantiated by passing the API key and the secret key as parameters:

![](/images/nft-pinata/image20.png)

Let’s finish setting up the server app:

![](/images/nft-pinata/image29.png)

In the `corsOptions` variable, we indicate the URLs that are allowed to communicate with the server. During development, you should allow `localhost` with the port you are using, then you can use the URL of your app.

Now, we can set up the different middlewares:

* `upload` is a middleware returned by `multer` that we set by passing an object whose `dest` property is the path to the folder where we want to store the picture we will receive
* `cors` with the options set up above
* `express.json({ limit: “50mb” })` allows the app to receive up to 50 MB of JSON \(which will be necessary to pass the picture\)
* `express.urlencoded({ limit: “50mb”, extended: true, parameterLimit: 50000 })` works in conjunction with the setting above and allows the server to receive a picture up to 50 MB in size

Now, everything is set up, let’s write the `mint` endpoint!

![](/images/nft-pinata/image32.png)

This is going to be a `POST` endpoint \(because of the picture we need to receive\) that’s going to be called when a request comes to the `/mint` route. We use the `single` method of the `upload` middleware from `multer` with the `“image”` parameter, which tells `multer` that we are expecting to receive one image on this endpoint. We then store the request in a new variable cast to the `any` type because TypeScript will raise an error later as it is unaware that the request has been modified by `multer`.

The request comes with the file sent by the user:

![](/images/nft-pinata/image14.png)

We check first if a file was provided with `if(!multerReq.file)`, if there is none, the request fails with a 500 error code and a message. If a file was provided, we store the filename available at `multerReq.file.filename`.

After checking if the request came along with a file, we’re going to verify that our connection to the Pinata service works properly:

![](/images/nft-pinata/image21.png)

The instance of the Pinata SDK provides a method called `testAuthentication` that verifies that you are properly authenticated. With that done, we can go ahead and pin the user’s picture in Pinata:

![](/images/nft-pinata/image24.png)

> Note: we have to pin the picture first before pinning the metadata to the IPFS because the metadata must include the hash of the picture.

To pin a file to the IPFS using the Pinata SDK, you must provide a [readable stream](https://nodejs.org/api/stream.html). This can be easily achieved by using the `createReadStream` method of the `fs` package that you call with the path of the file that you want to convert to a readable stream. Remember that `multer` automatically saved the image in the request in the `uploads` folder, so this is where we will be looking for it.

After that, we must set some options to pass with the file, mainly so we can identify the file easily among the other files we pinned in our Pinata account. The `name` and `keyvalues` of the `pinataMetadata` property can be anything you want, the `name` property is going to be displayed in the pin manager of the Pinata website.

Next, we can pin the picture to the IPFS. We use the `pinFileToIPFS` method of the Pinata SDK and pass as arguments the readable stream we created earlier and the options. This returns a promise that resolves with an object containing 2 properties we verify to make sure the pinning was successful: the `IpfsHash` property holds the IPFS hash of the file we’ve just pinned and the `PinSize` property holds the size of the file. If these 2 properties are defined and not equal to zero, we can assume the file was correctly pinned.

Now, we can create the metadata for the NFT and pin it to the IPFS:

![](/images/nft-pinata/image41.png)

First, we are going to remove the user’s image from the server. Whether you are using a service on a free tier with a limited storage or you have your own server, you don’t want to keep the images the users sent on your server. To remove it, you can use the `unlinkSync` method of the `fs` package and pass to it the path to the file.

The metadata must follow a certain structure to help the dapps in the Tezos ecosystem read their properties correctly. Here are a few of the properties you can set:

* `name` =&gt; the name of the NFT
* `description` =&gt; a description of the NFT
* `symbol` =&gt; the symbol will appear in wallets to represent your NFT, choose it wisely
* `artifactUri` =&gt; the link to the asset formatted as `ipfs://` + the IPFS hash
* `displayUri` =&gt; the link to the picture formatted as `ipfs://` + the IPFS hash
* `creators` =&gt; a list of the creators of the NFT
* `decimals` =&gt; decimals are always set to `0` for NFTs
* `thumbnailUri` =&gt; the thumbnail to display for the NFT \(for example, in wallets\)
* `is_transferable` =&gt; whether the NFT can be transferred or not
* `shouldPreferSymbol` =&gt; allows wallets to decide whether or not a symbol should be displayed in place of a name

Once we created the object that will become the metadata of the NFT, we can pin it to the IPFS. The Pinata SDK offers a `pinJSONToIPFS` method to do what it says, pin JSON to the IPFS 😅 You can pass to it your JavaScript object directly \(I assume the SDK converts it into JSON because passing a JSON string throws an error\) and just like with the picture, you can set some metadata for the metadata! Once the promise resolves, we check if we got the IPFS hash back and that the data size is over 0. Now everything is pinned! We can send a simple response and attach the CID for the metadata and for the picture:

``` sh
res.status(200).json({
    status: true,
    msg: {
        imageHash: pinnedFile.IpfsHash,
        metadataHash: pinnedMetadata.IpfsHash
    }
});
```

The two hashes will confirm on the frontend side that the picture and the metadata have been correctly pinned.

#### The frontend

The app we will build for the frontend has the typical structure of a Tezos app so we will only focus on the functions required to get the picture and the metadata from the user and send them to the backend before minting the NFT and to display the NFTs the user may own. If you are interested in learning how to build a Tezos app, you can follow [this tutorial](https://medium.com/ecad-labs-inc/how-to-build-your-first-tezos-dapp-2021-edition-b1263b4ba016) to learn everything you need to know!

_1- Displaying the NFTs_

As explained earlier, the NFTs are just token ids stored in the contract. In order to find the NFTs owned by the users connected to the dapp, we just have to find the token ids associated with their addresses. The contract for this tutorial implements a convenient **reverse ledger** that allows you to fetch all the token ids associated with an address in a single call.

> Note: a reverse ledger is not a standard feature of NFT contracts and it may be absent from other platforms. If that’s the case, they may implement other ways of tracking token ids owned by a wallet address, for example, an external ledger file.

Let’s start by installing [Taquito](https://tezostaquito.io/) and creating a new instance of the Tezos toolkit:

![](/images/nft-pinata/image8.png)

Now, we can fetch the storage of the contract:

![](/images/nft-pinata/image10.png)

`await Tezos.wallet.at(contractAddress)` creates an instance of the contract with different useful methods to interact with the contract or get details about, like the storage, that you can get using `await contract.storage()`. After that, we have access to the whole storage.

Now, we can look for the token ids owned by the user by searching the `reverse_ledger` bigmap with the `get` function:

![](/images/nft-pinata/image19.png)

`getTokenIds` is an array containing all the ids owned by the `address`. We can simply loop through the array to get each id and look for the id in the `ledger` bigmap:

![](/images/nft-pinata/image37.png)

The id is returned by Taquito as a `BigNumber`, so you have to call `.toNumber()` first before being able to use it. Once we have the id, we can look for its metadata in the `token_metadata` bigmap. The value returned is a Michelson map and the metadata path is going to be stored at the empty key. Because the path is stored as bytes, we use `bytes2Char()` provided by the `@taquito/utils` package to convert the returned `bytes` into a `string`. To finish, we return an object with 2 properties: the token id and the IPFS hash of the metadata.

> Note: although the standard requires us to store the IPFS hash in the following manner =&gt; `ipfs://IPFS_HASH`, there is no safeguard and any kind of data can be stored there, this is why we make a simple check with `tokenInfo.slice(0, 7) === “ipfs://”` using the ternary operator to verify that at least this condition is fulfilled.

_2- Sending the picture and metadata to the backend_

First, we set up the HTML tags we need to get the picture, the name of the picture, and its description:

![](/images/nft-pinata/image23.png)

The `bind` attribute in Svelte makes it very easy to store the input in a variable that we can use later when we want to pin the NFT to the IPFS. A click on the `upload` button will trigger the upload of the picture, its title, and description to the server.

Now, let’s see how uploading the user data works!

![](/images/nft-pinata/image26.png)

We define 2 boolean variables called `pinningMetadata` and `mintingToken` that we will update according to the result of the different steps of the upload to give some visual feedback to the users in the UI. Because we are not using a traditional form, we must build the form data manually. After instantiating a new `FormData`, we use the `append` method to add the different details of the form, the picture, the title, the description, and the creator of the NFT.

Once the form is ready, we can use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make a POST request to the `/mint` endpoint of our server app. The request should include the required headers and the form in the `body`. The response from the server will include the hash for the picture and the hash for the metadata:

![](/images/nft-pinata/image33.png)

When the `response` comes, we can convert it to a usable JS object with the `json` method. We check that the `status` property is `200` and that the `metadataHash` and `imageHash` properties exist. If that’s the case, we can switch the UI from “pinning” to “minting” and send the transaction to the blockchain to save the NFT metadata:

![](/images/nft-pinata/image15.png)

This is a regular contract call. You create an instance of the contract by calling `Tezos.wallet.at(contractAddress)`, then you call the `mint` entrypoint in the `contract.methods` property. Because the entrypoint expects bytes, we have to convert the IPFS hash into bytes without forgetting to prefix `ipfs://` to make it valid. We pass the `userAddress` at the same time to identify the owner of the NFT in the contract. After the NFT is minted and the minting is confirmed, we save the data of the NFT into `newNft` to have it displayed in the interface, we reset the files, title, and description variables to give the opportunity to the user to mint another NFT and we refresh the list of NFTs owned by the user by querying them \(this is not absolutely necessary but getting up-to-date data from the contract never hurts\).

Now, the NFT has been successfully minted, its metadata is pinned on the IPFS and it is available to the world 🥳

### Suggested improvements

The purpose of this tutorial is to build a simple NFT platform and introduce some concepts related to creating and minting NFTs, in general, and specifically on the Tezos blockchain. Here are a few additional features and design considerations you would like to take into account for a fully-featured NFT app:

* Generate the IPFS hashes client-side first before pinning them: a failed transaction and other worst-case scenarios may leave unused content pinned into your Pinata account, to avoid this, you can spin up an IPFS node in the client browser, pin the data, mint the NFT and then pin it to your Pinata account
* Add a `burn` endpoint: right now, your users can only create tokens, but you could also allow them to delete their NFTs
* Display other NFTs of the platform in the front-end interface
* Add a fee to mint new NFTs: when sending a call to the mint entrypoint, add `.send({ amount: fee })` to monetize your service.

If you want to get your hands dirty, you can also improve the contract. You can add a marketplace to the contract where NFT creators can sell their artwork, you can implement royalties every time an NFT is sold, you can track the sales and their amount and create a “reputation” system for the artists, etc., the possibilities are endless!

### Conclusion

This tutorial introduced a lot of information about NFTs. You learned about the 3 different parts that make up an NFT platform: the contract that records the NFT ids and a link to their associated metadata, the backend that securely builds the metadata and pins it to the IPFS, and the frontend that collects the picture and the related information from the user before minting the NFT. These 3 elements work in concert to receive the user’s input, process it, format it, save it on the IPFS, and record it on the Tezos blockchain.

These 3 parts of the minting and pinning process require 3 tools that are the cornerstones of building NFT platforms on Tezos: a smart contract language like [Ligo](https://ligolang.org/) to write the smart contract, an IPFS pinning service like [Pinata](https://pinata.cloud/) to easily save data to the IPFS, and a JavaScript library like [Taquito](https://tezostaquito.io/) to let the users interact with the smart contract. This is everything you need to build yourself the next Hic et Nunc!

