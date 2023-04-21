# Build your first dapp on Tezos

A decentralized application or dapp is an application that connects to a blockchain and provides services that are related to the blockchain it connects to.

You can use the framework of your choice to build a dapp on Tezos. In this article, we will use React.

The code presented here is made of snippets you can use in your React application. You will learn how to set up a dapp, connect and disconnect a wallet, transfer tez and make a contract call.

# Installing the packages

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

These dependencies are required to use Beacon with Webpack.

# Setting up the app

```typescript
import React, { useState } from 'react'
import { TezosToolkit } from '@taquito/taquito'
import type { BeaconWallet } from '@taquito/beacon-wallet'

const App = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit('https://ghostnet.ecadinfra.com')
  )
  const [wallet, setWallet] = useState<BeaconWallet | null>(null)
  const [userAddress, setUserAddress] = useState<string>('')
  const [userBalance, setUserBalance] = useState<number>(0)

  const contractAddress: string = 'KT1...'

  return <div>Your code here...</div>
}

export default App
```

# Connecting /Disconnecting the wallet

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
  setContract: Dispatch<SetStateAction<any>>
  setWallet: Dispatch<SetStateAction<any>>
  setUserAddress: Dispatch<SetStateAction<string>>
  setUserBalance: Dispatch<SetStateAction<number>>
  setStorage: Dispatch<SetStateAction<number>>
  contractAddress: string
  setBeaconConnection: Dispatch<SetStateAction<boolean>>
  setPublicToken: Dispatch<SetStateAction<string | null>>
  wallet: BeaconWallet
}

const ConnectButton = ({
  Tezos,
  setContract,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  contractAddress,
  setBeaconConnection,
  setPublicToken,
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
      setBeaconConnection(true)
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
          setBeaconConnection(true)
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

```typescript
import React, { Dispatch, SetStateAction } from 'react'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'

interface ButtonProps {
  wallet: BeaconWallet | null
  setPublicToken: Dispatch<SetStateAction<string | null>>
  setUserAddress: Dispatch<SetStateAction<string>>
  setUserBalance: Dispatch<SetStateAction<number>>
  setWallet: Dispatch<SetStateAction<any>>
  setTezos: Dispatch<SetStateAction<TezosToolkit>>
  setBeaconConnection: Dispatch<SetStateAction<boolean>>
}

const DisconnectButton = ({
  wallet,
  setPublicToken,
  setUserAddress,
  setUserBalance,
  setWallet,
  setTezos,
  setBeaconConnection,
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
    setBeaconConnection(false)
    setPublicToken(null)
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

# Transfering tez

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

# Sending a contract call

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
You can find the code for this dapp in [this GitHub repo](https://github.com/ecadlabs/taquito-react-template)
{% /callout %}
