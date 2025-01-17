---
title: "Part 3: Sending transactions"
authors: Tim McMackin
last_update:
  date: 18 December 2024
---

To send a transaction to Tezos, a dApp creates the transaction, including its parameters.
Then it sends the transaction to the user's wallet application.
With the user's approval, the wallet encrypts ("signs") the transaction with the user's private key and sends it to Tezos.

In this section, you add functions to the application that send a transaction that creates ("mints") an NFT on Tezos.
The transaction calls a pre-deployed smart contract that manages NFTs.
In a later section, you will deploy your own contract to manage your NFTs, but for now you can use the pre-deployed contract to learn about how it works.

## The pre-deployed contract

You can see the pre-deployed contract by looking up its address `KT1SRdvmiXjQxtY78sefFY2qrCHNpNttWZXq` on a block explorer such as these:

- https://ghostnet.tzkt.io/KT1SRdvmiXjQxtY78sefFY2qrCHNpNttWZXq
- https://better-call.dev/ghostnet/KT1SRdvmiXjQxtY78sefFY2qrCHNpNttWZXq

The block explorer shows the transactions that the contract has received and information about the tokens that it manages.
Usually the block explorer has a **Tokens** tab for contracts that manage tokens.
For example, Better Call Dev shows the tokens like this:

<img src="/img/tutorials/create-nfts-transaction-existing-tokens.png" alt="The tokens in the pre-deployed contract" style={{width: 300}} />

Most tokens have metadata that describes what the token represents.
For example, the first token on the pre-deployed contract has this metadata:

<img src="/img/tutorials/create-nfts-transaction-token-metadata.png" alt="The metadata of one token" style={{width: 300}} />

Normally, contracts that manage tokens have restrictions on who can mint tokens, but for the purposes of the tutorial, this contract allows any account to mint NFTs.

## Minting NFTs

To call a smart contract, you need the address of the contract, the name of  the entrypoint to call, and a properly formatted parameter.

1. In the `App.svelte` file, in the `<script>` section, add a constant with the address of the pre-deployed contract:

   ```javascript
   const nftContractAddress = "KT1Lr8m7HgfY5UF6nXDDcXDxDgEmKyMeds1b";
   ```

1. Add a constant with a pre-deployed image.
The application will use this image to represent the NFT in wallet applications.

   ```javascript
   const defaultImage = "https://gateway.pinata.cloud/ipfs/QmRCp4Qc8afPrEqtM1YdRvNagWCsFGXHgGjbBYrmNsBkcE";
   ```

1. Add a function called `createNFT` that creates an NFT, first checking if the button is active because the wallet is connected:

   ```javascript
   if (!buttonActive) {
     return;
   }
   buttonActive = false;
   statusMessage = "Minting NFT; please wait...";
   ```

1. Further inside the function, create the metadata for the token:

   ```javascript
   // Create token metadata
   const metadata = new MichelsonMap();
   metadata.set("name", stringToBytes("My Token"));
   metadata.set("symbol", stringToBytes("Tok"));
   metadata.set("decimals", stringToBytes("0"));
   metadata.set("artifactUri", stringToBytes(defaultImage));
   metadata.set("displayUri", stringToBytes(defaultImage));
   metadata.set("thumbnailUri", stringToBytes(defaultImage));
   ```

   These are the metadata fields that the pre-deployed contract expects for new tokens.
   When you create your own contract you can define the fields, but these fields are commonly used for Tezos FA2 tokens, including NFTs.

   Note that the value of the `decimals` field is set to zero because the token cannot be divided like a fungible token can.

   Also note that each field is converted from a string to bytes because token metadata is stored as a key-value map with string keys and byte values.

1. Create the parameter for the transaction:

   ```javascript
   const mintItem = {
     to_: address,
     metadata: metadata,
   };

   const mintParameter = [mintItem];
   ```

   There is no standard way that FA2 contracts mint tokens; in fact, FA2 contracts are not required to have a `mint` entrypoint.
   In this case, the mint entrypoint accepts a list of tokens to create, with each list item including the address of the token owner and the metadata for the new token.
   You can set up your contract to mint tokens in any way.

1. Within a `try/catch` block, create an object that represents the contract and call its `mint` entrypoint by adding this code:

   ```javascript
   try {
     Tezos.setWalletProvider(wallet);

     console.log("getting contract");
     const nftContract = await Tezos.wallet.at(nftContractAddress);

     console.log("minting");
     const op = await nftContract.methodsObject.mint(mintParameter).send();

     console.log(`Waiting for ${op.opHash} to be confirmed...`);
     const hash = await op.confirmation(2).then(() => op.opHash);
     console.log(`Operation injected: https://ghostnet.tzkt.io/${hash}`);
   } catch (error) {
     console.error("Error minting NFT:", error);
   } finally {
     statusMessage = "Ready to mint another NFT.";
     buttonActive = true;
   }
   ```

   When you call the `Tezos.wallet.at()` method, Taquito creates an object that represents the contract.
   This object has a `methodsObject` property that has a method for each entrypoint in the contract.
   In this way, the `nftContract.methodsObject.mint()` method represents a call to the contract's `mint` entrypoint.

   The complete function looks like this:

   ```javascript
   const createNFT = async () => {
   if (!buttonActive) {
     return;
   }
   buttonActive = false;
   statusMessage = "Minting NFT; please wait...";

   // Create token metadata
   const metadata = new MichelsonMap();
   metadata.set("name", stringToBytes("My Token"));
   metadata.set("symbol", stringToBytes("Tok"));
   metadata.set("decimals", stringToBytes("0"));
   metadata.set("artifactUri", stringToBytes(defaultImage));
   metadata.set("displayUri", stringToBytes(defaultImage));
   metadata.set("thumbnailUri", stringToBytes(defaultImage));

   const mintItem = {
     to_: address,
     metadata: metadata,
   };

   const mintParameter = [mintItem];

   try {
     Tezos.setWalletProvider(wallet);

     console.log("getting contract");
     const nftContract = await Tezos.wallet.at(nftContractAddress);

     console.log("minting");
     const op = await nftContract.methodsObject.mint(mintParameter).send();

     console.log(`Waiting for ${op.opHash} to be confirmed...`);
     const hash = await op.confirmation(2).then(() => op.opHash);
     console.log(`Operation injected: https://ghostnet.tzkt.io/${hash}`);
   } catch (error) {
     console.error("Error minting NFT:", error);
   } finally {
     statusMessage = "Ready to mint another NFT.";
     buttonActive = true;
   }

   }
   ```

1. In the `<main>` section, add a button to call the `createNFT` function.
The `<main>` section looks like this:

   ```javascript
   <main>
     <h1>Create NFTs</h1>

     <div class="card">
       {#if wallet}
         <p>The address of the connected wallet is {address}.</p>
         <p>Its balance in tez is {balance}.</p>
         <button on:click={disconnectWallet}>Disconnect wallet</button>
         <button on:click={createNFT}>Create NFT</button>
       {:else}
         <button on:click={connectWallet}>Connect wallet</button>
       {/if}
       <p>{statusMessage}</p>
     </div>
   </main>
   ```

1. Run the application with the command `npm run dev` and connect your wallet as you did previously.

1. Click the **Create NFT** button and approve the transaction in your wallet.

1. Verify that the NFT was created by looking up the transaction hash in a block explorer.
Here are some ways to get the transaction hash:

   - Open the browser console and find the message that starts with `Operation injected`.
   - Click the link in the confirmation window in your wallet application.
   - Open the contract in a block explorer and look at the most recent transaction or search for your address in its recent transactions.

   For example, [this transaction](https://ghostnet.tzkt.io/oopNizDc1p6uuCLsbEP4LEzUvgiJefPFe6W9QZur9kfZzDui9bb/19762971) shows the address of the token creator, the `mint` entrypoint, and the name of the new token:

   <img src="/img/tutorials/create-nfts-transaction-completed-transaction.png" alt="The completed transaction" style={{width: 300}} />

## Viewing the NFT in your wallet

Because the contract follows the FA2 standard, Tezos wallets can show information about it.
However, your wallet is not immediately aware that you have the token.
You can add the token to your wallet manually to see it and work with it in your wallet:

1. In your wallet, go to the tab that shows NFTs, which is usually called "Collectibles" or "NFTs."

   For example, the Temple wallet shows NFTs on the Collectibles tab:

   <img src="/img/tutorials/create-nfts-transaction-temple-no-nfts.png" alt="The Collectibles tab of the Temple wallet, showing no NFTs" style={{width: 300}} />

1. Add the predefined contract address `KT1Lr8m7HgfY5UF6nXDDcXDxDgEmKyMeds1b` as a source of NFTs.

   For example, in Temple, click **Manage assets list > Manage**, click **Add Collectible**, add the contract address in the **Address** field, and click **Add Asset**:

   <img src="/img/tutorials/create-nfts-transaction-temple-add-contract.png" alt="Adding a contract to Temple" style={{width: 300}} />

   In most cases you can leave the asset ID blank and the wallet will retrieve all of your tokens in the contract.

   Now the wallet shows the NFT:

   <img src="/img/tutorials/create-nfts-transaction-temple-show-nft.png" alt="An NFT in the Temple wallet" style={{width: 300}} />

   You can click the token to see information about it and to send it to another account.
   Because the contract is FA2-compliant, wallets can perform operations on the token without any further information.

   <img src="/img/tutorials/create-nfts-transaction-temple-show-nft-info.png" alt="An NFT in the Temple wallet" style={{width: 300}} />

Now you can create NFTs with your application and the built-in contract.
In the next section you start creating your own contract to create NFTs your own way.
Continue to [Part 4: Creating the contract](/tutorials/create-nfts/create-contract).
