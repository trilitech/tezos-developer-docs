---
id: nft-taquito
title: Mint an NFT using Taquito
lastUpdated: 10th July 2023
---

In this guide, you will get an overview of the mechanics of NFTs, in general, and on Tezos. If you want to get your hands dirty, you will get an explanation of how the code of an NFT platform works, on the contract level but also on the app level. This article is mainly designed for beginner programmers who want to get a better idea of the code involved in the creation and use of NFTs, but non-technical readers will also find important information to deepen their understanding of both NFTs and the Tezos blockchain.

You will learn how to build a simple NFT platform backed by a smart contract on the Tezos blockchain capable of minting, transferring, and burning NFTs while hosting their metadata on the IPFS. You need a basic knowledge of JavaScript to follow along in part 2. We will only have a high-level overview of the smart contract so no knowledge of Ligo is required, but a general knowledge of programming concepts would help.

If you just want the code, you can find the complete source code in [this GitHub repository](https://github.com/claudebarde/taquito-pinata-tezos-nft). The **backend** folder holds the code that generates the metadata and pins the picture and the metadata to the IPFS. The **frontend** folder holds the code for the app that allows users to connect to their Tezos wallet and mint NFTs. The **contract** folder holds the FA2 contract written in CameLigo to mint, transfer, and burn NFTs.

Now, let’s start by understanding better what NFTs are and how they work!

> Note: the first part of the article doesn’t require any knowledge in programming but to follow the second part, you need to have a basic knowledge of JavaScript.


## What is an NFT?

“NFT” is an acronym that stands for “non-fungible token”. A token is called “fungible” when you can exchange it for another identical token without losing any value. For example, the coins in your wallet are fungible. If we both have 1 euro and we exchange our coins, we both still have 1 euro. An NFT is non-fungible due to its unique nature: there is no other token 100% identical with the same value.

> Note: the word “token” in this context means “a list of data that altogether represent something”. An NFT is a token because it is made of data related to something from the real world.

Although NFTs are mostly known for representing artwork, they can actually represent anything and have been used to represent certificates, contracts, users, etc. One of the most important things to remember about NFTs is that they are not a “physical object” but a representation of somebody’s ownership. When you own the NFT for an artwork, it doesn’t prove you have the artwork with you, but it proves you have ownership of the artwork.

On a technical level, NFTs are stored in smart contracts, little programs that live on blockchains and that are able to execute and store data. This point is particularly important to remember: if you have an NFT on your favorite platform, the data is saved in the contract the platform is built upon and the other platforms in the ecosystem built on different contracts are not aware of your NFT. In most cases, this also means you cannot transfer your NFT from one platform to another. If you are the creator of the NFT, you can “_burn_” it \(i.e destroy it\) and “_mint_” it \(i.e create it\) on another platform.

On Tezos, NFTs are stored in contracts that follow the [TZIP-12 standard](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) that you will often see labeled as “**FA2 contracts**”. The NFT is made of 2 main parts: an id to identify it in the contract and metadata to describe what the NFT is. The contract holds a _ledger_, a table where the ids of every NFT are matched with the address of their owner. Another table in the contract matches the ids of every NFT with their metadata, so knowing the id of an NFT, you can easily find out who owns it and what it represents. The metadata is just text and can be stored directly in the contract or somewhere else on the Internet, in which case the address of the metadata is stored in the contract.  
The contract that holds the NFTs can implement different features according to the platform, it can allow its users to transfer their NFTs to other users of the contract, sell them, burn them, track royalties for every purchase, etc. As the smart contract is just a piece of code, the possibilities are virtually limitless!

### Useful lexicon

* To mint an NFT: to create an NFT and record its data into a smart contract
* To burn an NFT: to delete the data associated with an NFT from a smart contract
* A smart contract: a piece of autonomous code that lives on a blockchain
* The [IPFS](https://ipfs.io/#how): a network of computers providing decentralized storage
* To pin on the IPFS: storing data on the IPFS

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

