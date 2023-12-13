---
title: 'Part 1: Create the smart contract'
authors: 'Benjamin Fuentes'
last_update:
  date: 12 December 2023
---

On this first section, you will :

- create the game smart contract importing an existing Ligo library
- deploy your smart contract to the Ghostnet
- get the Shifumi Git repository folders to copy the game UI and CSS for the second party

## Smart contract

1. Clone the repository and start a new Taqueria project

   ```bash
   git clone https://github.com/marigold-dev/training-dapp-shifumi.git
   taq init shifumi
   cd shifumi
   taq install @taqueria/plugin-ligo
   ```

1. Download the Ligo Shifumi template, and copy the files to Taqueria **contracts** folder

   ```bash
   TAQ_LIGO_IMAGE=ligolang/ligo:1.2.0 taq ligo --command "init contract --template shifumi-jsligo shifumiTemplate"
   cp -r shifumiTemplate/src/* contracts/
   ```

1. Compile the contract. It creates the default required file `main.storageList.jsligo`

   ```bash
   TAQ_LIGO_IMAGE=ligolang/ligo:1.2.0 taq compile main.jsligo
   ```

1. Edit `main.storageList.jsligo` initial storage and save it

   ```ligolang
   #import "main.jsligo" "Contract"

   const default_storage: Contract.storage = {
       metadata: Big_map.literal(
           list(
               [
                   ["", bytes `tezos-storage:contents`],
                   [
                       "contents",
                       bytes
                       `
       {
       "name": "Shifumi Example",
       "description": "An Example Shifumi Contract",
       "version": "beta",
       "license": {
           "name": "MIT"
       },
       "authors": [
           "smart-chain <tezos@smart-chain.fr>"
       ],
       "homepage": "https://github.com/ligolang/shifumi-jsligo",
       "source": {
           "tools": "jsligo",
           "location": "https://github.com/ligolang/shifumi-jsligo/contracts"
       },
       "interfaces": [
           "TZIP-016"
       ]
       }
       `
                   ]
               ]
           )
       ) as big_map<string, bytes>,
       next_session: 0 as nat,
       sessions: Map.empty as map<nat, Contract.Session.t>,
   }
   ```

1. Compile again

   ```bash
   TAQ_LIGO_IMAGE=ligolang/ligo:1.2.0 taq compile main.jsligo
   ```

1. Deploy to Ghostnet

   ```bash
   taq install @taqueria/plugin-taquito
   taq deploy main.tz -e "testing"
   ```

   > Note : if it is the first time you use taqueria, I recommend to look at this training first [https://github.com/marigold-dev/training-dapp-1#ghostnet-testnet](https://github.com/marigold-dev/training-dapp-1#ghostnet-testnet)
   >
   > For advanced users, just go to `.taq/config.local.testing.json` , replace account with alice settings and then redeploy
   >
   > ```json
   > {
   >   "networkName": "ghostnet",
   >   "accounts": {
   >     "taqOperatorAccount": {
   >       "publicKey": "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
   >       "publicKeyHash": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
   >       "privateKey": "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
   >     }
   >   }
   > }
   > ```

   Your smart contract is ready on the Ghostnet !

   ```logs
   ┌──────────┬──────────────────────────────────────┬───────┐
   │ Contract │ Address                              │ Alias │
   ├──────────┼──────────────────────────────────────┼───────┤
   │ main.tz  │ KT1QjiZcAq63yVSCkfAr9zcFvmKBhQ7nVSWd │ main  │
   └──────────┴──────────────────────────────────────┴───────┘
   ```

## Summary

That's all for the smart contract. On the next section, you will create the mobile application and connect to your smart contract

When you are ready, continue to [Part 2: Create an Ionic mobile application](./part-2).
