---
id: build-your-first-dapp
title: Build your first dapp on Tezos
slug: /build-your-first-dapp
authors: Claude Barde
---
{% callout title="Smart Contracts" %}
This guide assumes you are already familiar with smart contracts. See our guide [Deploy your first Smart Contract](../../tezos-basics/deploy-your-first-smart-contract/first-smart-contract) to get that background.
{% /callout %}

A decentralized application or dapp is an application that connects to a blockchain and provides services that are related to the blockchain it connects to.

You can use the framework of your choice to build a dapp on Tezos. In this article, we will use React.

The code presented here is made of snippets you can use in your React application. You will learn how to set up a dapp, connect and disconnect a wallet, transfer tez and make a contract call.

## Installing the packages

The first step is to install the NPM packages you need to run your dapp with the following command:

```shell
npm install @taquito/beacon-wallet @taquito/taquito react react-app-rewired react-dom react-scripts typescript
```

Here is what each package does:

- **@taquito/beacon-wallet**: provides a wrapper for the Beacon SDK to make it easier to use with Taquito
- **@taquito/taquito**: the main library to interact with the Tezos blockchain
- **react**: the React framework
- **react-app-rewired**: required to make changes to the React configuration for Beacon
- **react-dom**: the ReactDOM library
- **react-scripts**: scripts and configuration used by Create React App
- **typescript**: to use TypeScript in your project

You will also need a couple of dev dependencies:

```shell
npm install --save-dev os-browserify stream-browserify buffer
```

These dependencies are required to use Beacon with Webpack and are used in the `config-overrides.js` file:

```javascript
const webpack = require('webpack')

module.exports = function override(config, env) {
  console.log('override')
  let loaders = config.resolve
  loaders.fallback = {
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    os: require.resolve('os-browserify/browser'),
  }
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  )

  return config
}
```

## Setting up the app

After the environment is ready, you can create a `App.tsx` file to be the entry point of your app.

When the app mounts, you import the different classes and components needed and you create a new instance of the `TezosToolkit`. After that, you update the UI according to the connection status of the user's wallet.

```typescript
import React, { useState, useEffect } from 'react'
import { TezosToolkit } from '@taquito/taquito'
import type { BeaconWallet } from '@taquito/beacon-wallet'
import ConnectButton from './components/ConnectWallet'
import DisconnectButton from './components/DisconnectWallet'

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit | null>(null)
  const [wallet, setWallet] = useState<BeaconWallet | null>(null)
  const [userAddress, setUserAddress] = useState<string>('')
  const [userBalance, setUserBalance] = useState<number>(0)

  const contractAddress: string = 'KT1...'

  useEffect(() => {
    const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
    setTezos(tezos)
  })

  return (
    <div>
      <ConnectButton
        Tezos={Tezos}
        setWallet={setWallet}
        setUserAddress={setUserAddress}
        setUserBalance={setUserBalance}
        setStorage={setStorage}
        wallet={wallet}
      />
      <DisconnectButton
        wallet={wallet}
        setUserAddress={setUserAddress}
        setUserBalance={setUserBalance}
        setWallet={setWallet}
        setTezos={setTezos}
      />
      <div>Your code here...</div>
    </div>
  )
}

export default App
```

## Connecting /Disconnecting the wallet

It is best practice to keep all the functions related to the connection, interactions and disconnection of the wallet in their respective components.

You will here create 2 components: one responsible for the connection of the wallet and another one responsible for its disconnection.

In the `ConnectButton.tsx` file, you will receive various data and functions from the main component to infer the state of the dapp and update it according to the user's actions.

```typescript
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
} from '@airgap/beacon-dapp'

type ButtonProps = {
  Tezos: TezosToolkit
  setWallet: Dispatch<SetStateAction<any>>
  setUserAddress: Dispatch<SetStateAction<string>>
  setUserBalance: Dispatch<SetStateAction<number>>
  setStorage: Dispatch<SetStateAction<number>>
  contractAddress: string
  wallet: BeaconWallet
}

const ConnectButton = ({
  Tezos,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  contractAddress,
  wallet,
}: ButtonProps): JSX.Element => {
  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress)
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress)
    setUserBalance(balance.toNumber())
    // creates contract instance
    const contract = await Tezos.wallet.at(contractAddress)
    const storage: any = await contract.storage()
    setContract(contract)
    setStorage(storage.toNumber())
  }

  const connectWallet = async (): Promise<void> => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: 'https://ghostnet.ecadinfra.com',
        },
      })
      // gets user's address
      const userAddress = await wallet.getPKH()
      await setup(userAddress)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(
    () =>
      (async () => {
        const wallet = new BeaconWallet({
          name: 'Tezos React Dapp',
          preferredNetwork: NetworkType.GHOSTNET,
        })
        Tezos.setWalletProvider(wallet)
        setWallet(wallet)
        const activeAccount = await wallet.client.getActiveAccount()
        if (activeAccount) {
          const userAddress = await wallet.getPKH()
          await setup(userAddress)
        }
      })(),
    []
  )

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect wallet
        </span>
      </button>
    </div>
  )
}

export default ConnectButton
```

In the `DisconnectButton.tsx` component, you receive functions as props to update the general UI after the user disconnects their wallet.

It is essential in this step to clean up the state of the dapp so that the user can reconnect their wallet as if they just had loaded the dapp and to reset the UI to what it was before the user connects their wallet.

```typescript
import React, { Dispatch, SetStateAction } from 'react'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'

interface ButtonProps {
  wallet: BeaconWallet | null
  setUserAddress: Dispatch<SetStateAction<string>>
  setUserBalance: Dispatch<SetStateAction<number>>
  setWallet: Dispatch<SetStateAction<any>>
  setTezos: Dispatch<SetStateAction<TezosToolkit>>
}

const DisconnectButton = ({
  wallet,
  setUserAddress,
  setUserBalance,
  setWallet,
  setTezos,
}: ButtonProps): JSX.Element => {
  const disconnectWallet = async (): Promise<void> => {
    if (wallet) {
      await wallet.clearActiveAccount()
    }
    setUserAddress('')
    setUserBalance(0)
    setWallet(null)
    const tezosTK = new TezosToolkit('https://ghostnet.ecadinfra.com')
    setTezos(tezosTK)
  }

  return (
    <div className="buttons">
      <button className="button" onClick={disconnectWallet}>
        <i className="fas fa-times"></i>&nbsp; Disconnect wallet
      </button>
    </div>
  )
}

export default DisconnectButton
```

## Transfering tez

You can add a feature to your dapp that lets the users transfer tez from their account to another account.

The flow of sending a transfer transaction is the following:

1. You use the `wallet` property of the `TezosToolkit` instance to call the `transfer` method
2. The `transfer` method takes an object as a parameter with a `to` property for the recipient's address and an `amount` property for the amount in tez to be sent
3. You call the `send` method on the object returned by `transfer`
4. This returns an operation object, you can wait for the confirmation by calling the `confirmation` method (if no parameter is passed, the number of confirmations by default is 1)

```typescript
import React, { useState, Dispatch, SetStateAction } from 'react'
import { TezosToolkit } from '@taquito/taquito'

const Transfers = ({
  Tezos,
  setUserBalance,
  userAddress,
}: {
  Tezos: TezosToolkit
  setUserBalance: Dispatch<SetStateAction<number>>
  userAddress: string
}): JSX.Element => {
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const sendTransfer = async (): Promise<void> => {
    if (recipient && amount) {
      setLoading(true)
      try {
        const op = await Tezos.wallet
          .transfer({ to: recipient, amount: parseInt(amount) })
          .send()
        await op.confirmation()
        setRecipient('')
        setAmount('')
        const balance = await Tezos.tz.getBalance(userAddress)
        setUserBalance(balance.toNumber())
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div id="transfer-inputs">
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="button"
        disabled={!recipient && !amount}
        onClick={sendTransfer}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="far fa-paper-plane"></i>&nbsp; Send
          </span>
        )}
      </button>
    </div>
  )
}

export default Transfers
```

## Sending a contract call

One of the most interesting features of a dapp is the possibility to interact with smart contracts on-chain.

Here is how it works:

1. You use the instance of the `TezosToolkit` to create the contract abstraction for the contract you target
2. The contract abstraction exposes a `methods` property that contains methods named after each entrypoint of the contract
3. You call the entrypoint you target and you pass the required parameters
4. This returns an object with a `send` method that you must call to send the transaction
5. After being sent, Taquito returns an operation object with a `confirmation` property. By default, Taquito waits for 1 confirmation
6. After the transaction is confirmed, you can call the `storage` method on the contract abstraction to get the updated storage of the contract

```typescript
import React, { useState, Dispatch, SetStateAction } from 'react'
import { TezosToolkit, WalletContract } from '@taquito/taquito'

interface UpdateContractProps {
  contract: WalletContract | any
  setUserBalance: Dispatch<SetStateAction<any>>
  Tezos: TezosToolkit
  userAddress: string
  setStorage: Dispatch<SetStateAction<number>>
}

const UpdateContract = ({
  contract,
  setUserBalance,
  Tezos,
  userAddress,
  setStorage,
}: UpdateContractProps) => {
  const [loadingIncrement, setLoadingIncrement] = useState<boolean>(false)
  const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false)

  const increment = async (): Promise<void> => {
    setLoadingIncrement(true)
    try {
      const op = await contract.methods.increment(1).send()
      await op.confirmation()
      const newStorage: any = await contract.storage()
      if (newStorage) setStorage(newStorage.toNumber())
      setUserBalance(await Tezos.tz.getBalance(userAddress))
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingIncrement(false)
    }
  }

  const decrement = async (): Promise<void> => {
    setLoadingDecrement(true)
    try {
      const op = await contract.methods.decrement(1).send()
      await op.confirmation()
      const newStorage: any = await contract.storage()
      if (newStorage) setStorage(newStorage.toNumber())
      setUserBalance(await Tezos.tz.getBalance(userAddress))
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingDecrement(false)
    }
  }

  if (!contract && !userAddress) return <div>&nbsp;</div>
  return (
    <div className="buttons">
      <button
        className="button"
        disabled={loadingIncrement}
        onClick={increment}
      >
        {loadingIncrement ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-plus"></i>&nbsp; Increment by 1
          </span>
        )}
      </button>
      <button className="button" onClick={decrement}>
        {loadingDecrement ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-minus"></i>&nbsp; Decrement by 1
          </span>
        )}
      </button>
    </div>
  )
}

export default UpdateContract
```

{% callout title="More information" %}
You can find the code for this dapp in [this GitHub repo.](https://github.com/ecadlabs/taquito-react-template)
{% /callout %}
