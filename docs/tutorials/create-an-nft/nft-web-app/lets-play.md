---
title: "Part 3: Let's play"
authors: 'Yuxin Li'
last_update:
  date: 10 December 2024
---

Now that the app is complete, you are able to connect to your wallets and mint NFTs.

## Run the app

To run your app, run the following command:
```
npm run dev
```

Upon completion, the app's UI will appear as shown:

<img src="/img/tutorials/mint-ui.png" alt="The mint user interface section" style={{width: 300}} />

## Connect the wallet

Click the `Connect wallet` button and select a wallet to connect. The interface will appear as follows:

<img src="/img/tutorials/wallet-ui.png" alt="The connect wallet interface section" style={{width: 300}} />


## Review your information

Once connected to the wallet, you'll be able to view details such as your wallet address and balance:

<img src="/img/tutorials/info-ui.png" alt="interface section after connecting the wallet" style={{width: 500}} />


## Mint NFTs

Click the "mint an NFT" button. Its status will change to "Minting NFT...", and you'll be prompted to confirm the minting process.

<img src="/img/tutorials/mint_confirm.png" alt="mint comfirmation interface section" style={{width: 300}} />


After minting, a pop-up window will appear on your interface displaying “Open Blockexplorer”. You can click the button and you can see your NFT transactions on [TZKT](https://tzkt.io/), also you can also view your transactions on [Better Call Dev](https://better-call.dev/) by using your transaction hash. The interface will look like this:

<img src="/img/tutorials/block-explorer.png" alt="The block-explorer interface section " style={{width: 500}} />

Once finished, if you wish to mint another NFT, simply click the "Mint another NFT" button in the interface.

<img src="/img/tutorials/mint_another.png" alt="The mint-another-NFT interface section " style={{width: 500}} />

You can also look up the tokens minted by the contract on block explorers:

- https://ghostnet.tzkt.io/KT1Lr8m7HgfY5UF6nXDDcXDxDgEmKyMeds1b/tokens
- https://better-call.dev/ghostnet/KT1Lr8m7HgfY5UF6nXDDcXDxDgEmKyMeds1b/tokens

## Summary

Now you can use a web application to connect to a user's wallet, call a smart contract, and mint NFTs.
If you want to expand your knowledge of NFTs, try the tutorial [Build an NFT marketplace](/tutorials/build-an-nft-marketplace).
