---
title: 'Part 2: Create an Ionic mobile application'
authors: 'Benjamin Fuentes'
last_update:
  date: 12 December 2023
---

A web3 mobile application is not different from a web2 one in terms of its basic functionality and user interface. Both types of applications can run on smartphones, tablets, and other mobile devices, and both can access the internet and provide various services to users. However, a web3 mobile application differs from a web2 one in terms of its underlying architecture and design principles. A web3 mobile application is built on decentralized technologies, such as blockchain, smart contracts, and peer-to-peer networks, that enable more transparency, security, and autonomy for users and developers.

## Create the Mobile app

[Ionic React](https://ionicframework.com/docs/react) is a good hybrid solution for creating mobile applications and compatible with the Typescript version of the [BeaconSDK](https://github.com/airgap-it/beacon-sdk). The behavior is equivalent to a classical web development, so for a web developer the ramp up is easy.

> Beacon : the protocol of communication between the dapp and the wallet.

> Note : As of today, it is not recommended to develop a native dapp in Flutter, React Native or native tools as it requires additional UI works (ex : missing wallet popup mechanism to confirm transactions).

1. Install Ionic

   ```bash
   npm install -g @ionic/cli
   ionic start app blank --type react
   ```

1. Generate smart contract types from taqueria plugin.

   It generates Typescript classes from Smart contract interface definition that is used on the frontend.

   ```bash
   taq install @taqueria/plugin-contract-types
   taq generate types ./app/src
   ```

1. Uninstall conflicting old jest libraries/react-scripts, install required Tezos web3 dependencies and Vite framework.

   ```bash
   cd app
   npm uninstall -S @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest
   rm -rf src/components src/pages/Home.tsx src/pages/Home.css
   rm src/setupTests.ts src/App.test.tsx
   echo '/// <reference types="vite/client" />' > src/vite-env.d.ts

   npm install -S  @taquito/taquito @taquito/beacon-wallet @airgap/beacon-sdk  @tzkt/sdk-api
   npm install -S -D @airgap/beacon-types vite @vitejs/plugin-react-swc @types/react @types/node  @types/react@18.2.42
   ```

1. Polyfill issues fix

   > :warning: Polyfill issues fix : Add the following dependencies in order to not get polyfill issues. The reason is that some dependencies are Node APIs and are not included in browsers.

   1. Install missing libraries

      ```bash
      npm i -D process buffer crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url path-browserify
      ```

   1. Create a new file `nodeSpecific.ts` in the src folder of your project.

      ```bash
      touch src/nodeSpecific.ts
      ```

   1. Edit it

      ```js
      import { Buffer } from 'buffer';
      globalThis.Buffer = Buffer;
      ```

   1. Edit `vite.config.ts` file.

      ```js
      import react from '@vitejs/plugin-react-swc';
      import path from 'path';
      import { defineConfig } from 'vite';
      // https://vitejs.dev/config/
      export default ({ command }) => {
        const isBuild = command === 'build';

        return defineConfig({
          define: { 'process.env': process.env, global: {} },
          plugins: [react()],
          build: {
            commonjsOptions: {
              transformMixedEsModules: true,
            },
          },
          resolve: {
            alias: {
              // dedupe @airgap/beacon-sdk
              // I almost have no idea why it needs `cjs` on dev and `esm` on build, but this is how it works 🤷‍♂️
              '@airgap/beacon-sdk': path.resolve(
                path.resolve(),
                `./node_modules/@airgap/beacon-sdk/dist/${
                  isBuild ? 'esm' : 'cjs'
                }/index.js`
              ),
              stream: 'stream-browserify',
              os: 'os-browserify/browser',
              util: 'util',
              process: 'process/browser',
              buffer: 'buffer',
              crypto: 'crypto-browserify',
              assert: 'assert',
              http: 'stream-http',
              https: 'https-browserify',
              url: 'url',
              path: 'path-browserify',
            },
          },
        });
      };
      ```

1. Adapt Ionic for Vite.

   1. Edit `index.html`, it fixes the Node buffer issue with `nodeSpecific.ts` file and points to the CSS file :

      ```html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Ionic App</title>

          <base href="/" />

          <meta name="color-scheme" content="light dark" />
          <meta
            name="viewport"
            content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-tap-highlight" content="no" />

          <link rel="manifest" href="/manifest.json" />
          <link href="assets/styles.css" rel="stylesheet" />

          <link rel="shortcut icon" type="image/png" href="/favicon.png" />

          <!-- add to homescreen for ios -->
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="Ionic App" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/nodeSpecific.ts"></script>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      ```

   1. Edit **src/main.tsx** to force dark mode and remove React strict mode.

      ```typescript
      import { createRoot } from 'react-dom/client';
      import App from './App';

      const container = document.getElementById('root');
      const root = createRoot(container!);

      // Add or remove the "dark" class based on if the media query matches
      document.body.classList.add('dark');

      root.render(<App />);
      ```

   1. Modify the default **package.json** default scripts to use Vite instead of default react scripts.

      ```json
        "scripts": {
          "dev": "jq -r '\"VITE_CONTRACT_ADDRESS=\" + last(.tasks[]).output[0].address' ../.taq/testing-state.json > .env && vite --host",
          "ionic:build": "tsc -v && tsc && vite build",
          "build": " tsc -v && tsc && vite build",
          "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
          "preview": "vite preview",
          "ionic:serve": "vite dev --host",
          "sync": "npm run build && ionic cap sync --no-build"
        },
      ```

1. Edit the default Application file to configure page routing and add the style.

   Edit **src/App.tsx** main file.

   ```typescript
   import {
     IonApp,
     IonRouterOutlet,
     RefresherEventDetail,
     setupIonicReact,
   } from '@ionic/react';
   import { IonReactRouter } from '@ionic/react-router';
   import { Redirect, Route } from 'react-router-dom';

   /* Core CSS required for Ionic components to work properly */
   import '@ionic/react/css/core.css';

   /* Basic CSS for apps built with Ionic */
   import '@ionic/react/css/normalize.css';
   import '@ionic/react/css/structure.css';
   import '@ionic/react/css/typography.css';

   /* Optional CSS utils that can be commented out */
   import '@ionic/react/css/display.css';
   import '@ionic/react/css/flex-utils.css';
   import '@ionic/react/css/float-elements.css';
   import '@ionic/react/css/padding.css';
   import '@ionic/react/css/text-alignment.css';
   import '@ionic/react/css/text-transformation.css';

   /* Theme variables */
   import './theme/variables.css';

   import { NetworkType } from '@airgap/beacon-types';
   import { BeaconWallet } from '@taquito/beacon-wallet';
   import { InternalOperationResult } from '@taquito/rpc';
   import {
     PollingSubscribeProvider,
     Subscription,
     TezosToolkit,
   } from '@taquito/taquito';
   import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
   import { MainWalletType, Storage } from './main.types';
   import { HomeScreen } from './pages/HomeScreen';
   import { RulesScreen } from './pages/Rules';
   import { SessionScreen } from './pages/SessionScreen';
   import { TopPlayersScreen } from './pages/TopPlayersScreen';
   import {
     MMap,
     address,
     bytes,
     mutez,
     nat,
     timestamp,
     unit,
   } from './type-aliases';

   setupIonicReact();

   export class Action implements ActionCisor, ActionPaper, ActionStone {
     cisor?: unit;
     paper?: unit;
     stone?: unit;
     constructor(cisor?: unit, paper?: unit, stone?: unit) {
       this.cisor = cisor;
       this.paper = paper;
       this.stone = stone;
     }
   }
   export type ActionCisor = { cisor?: unit };
   export type ActionPaper = { paper?: unit };
   export type ActionStone = { stone?: unit };

   export type Session = {
     asleep: timestamp;
     board: MMap<nat, { Some: address } | null>;
     current_round: nat;
     decoded_rounds: MMap<
       nat,
       Array<{
         action: { cisor: unit } | { paper: unit } | { stone: unit };
         player: address;
       }>
     >;
     players: Array<address>;
     pool: mutez;
     result: { draw: unit } | { inplay: unit } | { winner: address };
     rounds: MMap<
       nat,
       Array<{
         action: bytes;
         player: address;
       }>
     >;
     total_rounds: nat;
   };

   export type UserContextType = {
     storage: Storage | null;
     setStorage: Dispatch<SetStateAction<Storage | null>>;
     userAddress: string;
     setUserAddress: Dispatch<SetStateAction<string>>;
     userBalance: number;
     setUserBalance: Dispatch<SetStateAction<number>>;
     Tezos: TezosToolkit;
     wallet: BeaconWallet;
     mainWalletType: MainWalletType | null;
     loading: boolean;
     setLoading: Dispatch<SetStateAction<boolean>>;
     refreshStorage: (
       event?: CustomEvent<RefresherEventDetail>
     ) => Promise<void>;
     subReveal: Subscription<InternalOperationResult> | undefined;
     subNewRound: Subscription<InternalOperationResult> | undefined;
   };
   export const UserContext = React.createContext<UserContextType | null>(null);

   const App: React.FC = () => {
     const Tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev');

     const wallet = new BeaconWallet({
       name: 'Training',
       preferredNetwork: NetworkType.GHOSTNET,
     });

     Tezos.setWalletProvider(wallet);
     Tezos.setStreamProvider(
       Tezos.getFactory(PollingSubscribeProvider)({
         shouldObservableSubscriptionRetry: true,
         pollingIntervalMilliseconds: 1500,
       })
     );

     const [userAddress, setUserAddress] = useState<string>('');
     const [userBalance, setUserBalance] = useState<number>(0);
     const [storage, setStorage] = useState<Storage | null>(null);
     const [mainWalletType, setMainWalletType] =
       useState<MainWalletType | null>(null);
     const [loading, setLoading] = useState<boolean>(false);

     const [subscriptionsDone, setSubscriptionsDone] = useState<boolean>(false);
     const [subReveal, setSubReveal] =
       useState<Subscription<InternalOperationResult>>();
     const [subNewRound, setSubNewRound] =
       useState<Subscription<InternalOperationResult>>();

     const refreshStorage = async (
       event?: CustomEvent<RefresherEventDetail>
     ): Promise<void> => {
       try {
         if (!userAddress) {
           const activeAccount = await wallet.client.getActiveAccount();
           let userAddress: string;
           if (activeAccount) {
             userAddress = activeAccount.address;
             setUserAddress(userAddress);
             const balance = await Tezos.tz.getBalance(userAddress);
             setUserBalance(balance.toNumber());
           }
         }

         console.log(
           'VITE_CONTRACT_ADDRESS:',
           import.meta.env.VITE_CONTRACT_ADDRESS
         );
         const mainWalletType: MainWalletType =
           await Tezos.wallet.at<MainWalletType>(
             import.meta.env.VITE_CONTRACT_ADDRESS
           );
         const storage: Storage = await mainWalletType.storage();
         setMainWalletType(mainWalletType);
         setStorage(storage);
         console.log('Storage refreshed');

         event?.detail.complete();
       } catch (error) {
         console.log('error refreshing storage', error);
       }
     };

     useEffect(() => {
       try {
         if (!subscriptionsDone) {
           const sub = Tezos.stream.subscribeEvent({
             tag: 'gameStatus',
             address: import.meta.env.VITE_CONTRACT_ADDRESS!,
           });

           sub.on('data', (e) => {
             console.log('on gameStatus event :', e);
             refreshStorage();
           });

           setSubReveal(
             Tezos.stream.subscribeEvent({
               tag: 'reveal',
               address: import.meta.env.VITE_CONTRACT_ADDRESS,
             })
           );

           setSubNewRound(
             Tezos.stream.subscribeEvent({
               tag: 'newRound',
               address: import.meta.env.VITE_CONTRACT_ADDRESS,
             })
           );
         } else {
           console.warn(
             'Tezos.stream.subscribeEvent already done ... ignoring'
           );
         }
       } catch (e) {
         console.log('Error with Smart contract event pooling', e);
       }

       console.log('Tezos.stream.subscribeEvent DONE');
       setSubscriptionsDone(true);
     }, []);

     useEffect(() => {
       if (userAddress) {
         console.warn('userAddress changed', wallet);
         (async () => await refreshStorage())();
       }
     }, [userAddress]);

     return (
       <IonApp>
         <UserContext.Provider
           value={{
             userAddress,
             userBalance,
             Tezos,
             wallet,
             storage,
             mainWalletType,
             setUserAddress,
             setUserBalance,
             setStorage,
             loading,
             setLoading,
             refreshStorage,
             subReveal,
             subNewRound,
           }}
         >
           <IonReactRouter>
             <IonRouterOutlet>
               <Route path={PAGES.HOME} component={HomeScreen} />
               <Route path={`${PAGES.SESSION}/:id`} component={SessionScreen} />
               <Route path={PAGES.TOPPLAYERS} component={TopPlayersScreen} />
               <Route path={PAGES.RULES} component={RulesScreen} />
               <Redirect exact from="/" to={PAGES.HOME} />
             </IonRouterOutlet>
           </IonReactRouter>
         </UserContext.Provider>
       </IonApp>
     );
   };

   export enum PAGES {
     HOME = '/home',
     SESSION = '/session',
     TOPPLAYERS = '/topplayers',
     RULES = '/rules',
   }

   export default App;
   ```

   Explanations :

   - `import "@ionic..."` : Default standard Ionic imports.
   - `import ... from "@airgap/beacon-types" ... from "@taquito/beacon-wallet" ... from "@taquito/taquito"` : Require libraries to interact with the Tezos node and the wallet.
   - `export class Action implements ActionCisor, ActionPaper, ActionStone {...}` : Representation of the ligo variant `Action` in Typescript, it is needed when passing arguments on `Play` function.
   - `export type Session = {...}` : Taqueria export the global Storage type but sadly not this sub-type from the Storage type, it is needed for later, so extract a copy.
   - `export const UserContext = React.createContext<UserContextType | null>(null)`: Global React context that is passed along pages. More info on React context [here](https://beta.reactjs.org/learn/passing-data-deeply-with-context).
   - `const refreshStorage = async (event?: CustomEvent<RefresherEventDetail>): Promise<void> => {...` : useful function to force the smart contract Storage to refresh on React state changes (user balance, state of the game).
   - `useEffect(() => { ... Tezos.setStreamProvider(...) ... Tezos.stream.subscribeEvent({...` : During Application initialization, it configures the wallet, the websocket listening to smart contract events.
   - `<IonApp><UserContext.Provider ... ><IonReactRouter><IonRouterOutlet><Route path={PAGES.HOME} component={HomeScreen} /> ... ` : It injects the React context to all pages. Declare the global routing of the application.
   - `export enum PAGES {  HOME = "/home", ...` : Declaration of the global routes.

1. Add the default theming (CSS, pictures, etc...) via copying the content of the git repository folder named **assets** folder to your local project (considering you cloned the repo and assets folder is on root folder).

   ```bash
   cp -r ../../assets/* .
   ```

1. Connect / disconnect the wallet

   Declare two React Button components and fetch the user public hash key + balance.

   1. Create the 2 missing src component files.

      On `app` folder, create these files.

      ```bash
      touch src/ConnectWallet.tsx
      touch src/DisconnectWallet.tsx
      ```

   1. ConnectWallet button creates an instance wallet, get user permissions via a popup and then retrieve account information.

      Edit `ConnectWallet.tsx`.

      ```typescript
      import { NetworkType } from '@airgap/beacon-types';
      import { IonButton } from '@ionic/react';
      import { BeaconWallet } from '@taquito/beacon-wallet';
      import { TezosToolkit } from '@taquito/taquito';
      import { Dispatch, SetStateAction } from 'react';

      type ButtonProps = {
        Tezos: TezosToolkit;
        setUserAddress: Dispatch<SetStateAction<string>>;
        setUserBalance: Dispatch<SetStateAction<number>>;
        wallet: BeaconWallet;
      };

      const ConnectButton = ({
        Tezos,
        setUserAddress,
        setUserBalance,
        wallet,
      }: ButtonProps): JSX.Element => {
        const connectWallet = async (): Promise<void> => {
          try {
            console.log('before requestPermissions');

            await wallet.requestPermissions({
              network: {
                type: NetworkType.GHOSTNET,
                rpcUrl: 'https://ghostnet.tezos.marigold.dev',
              },
            });
            console.log('after requestPermissions');

            // gets user's address
            const userAddress = await wallet.getPKH();
            const balance = await Tezos.tz.getBalance(userAddress);
            setUserBalance(balance.toNumber());
            setUserAddress(userAddress);
          } catch (error) {
            console.log('error connectWallet', error);
          }
        };

        return (
          <IonButton expand="full" onClick={connectWallet}>
            Connect Wallet
          </IonButton>
        );
      };

      export default ConnectButton;
      ```

   1. DisconnectWallet button cleans the wallet instance and all linked objects.

      ```typescript
      import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
      import { BeaconWallet } from '@taquito/beacon-wallet';
      import { power } from 'ionicons/icons';
      import { Dispatch, SetStateAction } from 'react';

      interface ButtonProps {
        wallet: BeaconWallet;
        setUserAddress: Dispatch<SetStateAction<string>>;
        setUserBalance: Dispatch<SetStateAction<number>>;
      }

      const DisconnectButton = ({
        wallet,
        setUserAddress,
        setUserBalance,
      }: ButtonProps): JSX.Element => {
        const disconnectWallet = async (): Promise<void> => {
          setUserAddress('');
          setUserBalance(0);
          console.log('disconnecting wallet');
          await wallet.clearActiveAccount();
        };

        return (
          <IonFab slot="fixed" vertical="top" horizontal="end">
            <IonFabButton>
              <IonIcon icon={power} onClick={disconnectWallet} />
            </IonFabButton>
          </IonFab>
        );
      };

      export default DisconnectButton;
      ```

   1. Save both file.

1. Create the missing pages and the error utility class.

   ```bash
   touch src/pages/HomeScreen.tsx
   touch src/pages/SessionScreen.tsx
   touch src/pages/Rules.tsx
   touch src/pages/TopPlayersScreen.tsx
   touch src/TransactionInvalidBeaconError.ts
   ```

   `TransactionInvalidBeaconError.ts` utility class is used to display human readable message from Beacon errors

1. Edit all files.

   - HomeScreen.tsx : the home page where you can access all other pages.

     ```typescript
     import {
       IonButton,
       IonButtons,
       IonContent,
       IonFooter,
       IonHeader,
       IonIcon,
       IonImg,
       IonInput,
       IonItem,
       IonLabel,
       IonList,
       IonModal,
       IonPage,
       IonRefresher,
       IonRefresherContent,
       IonSpinner,
       IonTitle,
       IonToolbar,
       useIonAlert,
     } from '@ionic/react';
     import { BigNumber } from 'bignumber.js';
     import { person } from 'ionicons/icons';
     import React, { useEffect, useRef, useState } from 'react';
     import { useHistory } from 'react-router-dom';
     import { PAGES, Session, UserContext, UserContextType } from '../App';
     import ConnectButton from '../ConnectWallet';
     import DisconnectButton from '../DisconnectWallet';
     import { TransactionInvalidBeaconError } from '../TransactionInvalidBeaconError';
     import Paper from '../assets/paper-logo.webp';
     import Scissor from '../assets/scissor-logo.webp';
     import Stone from '../assets/stone-logo.webp';
     import XTZLogo from '../assets/xtz.webp';
     import { SelectMembers } from '../components/TzCommunitySelectMembers';
     import { address, nat } from '../type-aliases';

     export const HomeScreen: React.FC = () => {
       const [presentAlert] = useIonAlert();
       const { push } = useHistory();

       const createGameModal = useRef<HTMLIonModalElement>(null);
       const selectGameModal = useRef<HTMLIonModalElement>(null);
       function dismissCreateGameModal() {
         console.log('dismissCreateGameModal');
         createGameModal.current?.dismiss();
       }
       function dismissSelectGameModal() {
         selectGameModal.current?.dismiss();
         const element = document.getElementById('home');
         setTimeout(() => {
           return element && element.remove();
         }, 1000); // Give a little time to properly unmount your previous page before removing the old one
       }

       const {
         Tezos,
         wallet,
         userAddress,
         userBalance,
         storage,
         mainWalletType,
         setStorage,
         setUserAddress,
         setUserBalance,
         setLoading,
         loading,
         refreshStorage,
       } = React.useContext(UserContext) as UserContextType;

       const [newPlayer, setNewPlayer] = useState<address>('' as address);
       const [total_rounds, setTotal_rounds] = useState<nat>(
         new BigNumber(1) as nat
       );
       const [myGames, setMyGames] = useState<Map<nat, Session>>();

       useEffect(() => {
         (async () => {
           if (storage) {
             const myGames = new Map(); //filtering our games
             Array.from(storage.sessions.keys()).forEach((key) => {
               const session = storage.sessions.get(key);

               if (
                 session.players.indexOf(userAddress as address) >= 0 &&
                 'inplay' in session.result
               ) {
                 myGames.set(key, session);
               }
             });
             setMyGames(myGames);
           } else {
             console.log('storage is not ready yet');
           }
         })();
       }, [storage]);

       const createSession = async (
         e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
       ) => {
         console.log('createSession');
         e.preventDefault();

         try {
           setLoading(true);
           const op = await mainWalletType?.methods
             .createSession(total_rounds, [userAddress as address, newPlayer])
             .send();
           await op?.confirmation();
           const newStorage = await mainWalletType?.storage();
           setStorage(newStorage!);
           setLoading(false);
           dismissCreateGameModal();
           setTimeout(
             () => push(PAGES.SESSION + '/' + storage?.next_session.toString()),
             500
           );
           //it was the id created
           console.log('newStorage', newStorage);
         } catch (error) {
           console.table(`Error: ${JSON.stringify(error, null, 2)}`);
           const tibe: TransactionInvalidBeaconError =
             new TransactionInvalidBeaconError(error);
           presentAlert({
             header: 'Error',
             message: tibe.data_message,
             buttons: ['Close'],
           });
           setLoading(false);
         }
         setLoading(false);
       };

       return (
         <IonPage className="container">
           <IonHeader>
             <IonToolbar>
               <IonTitle>Shifumi</IonTitle>
             </IonToolbar>
           </IonHeader>
           <IonContent fullscreen>
             <IonRefresher slot="fixed" onIonRefresh={refreshStorage}>
               <IonRefresherContent></IonRefresherContent>
             </IonRefresher>

             {loading ? (
               <div className="loading">
                 <IonItem>
                   <IonLabel>Refreshing ...</IonLabel>
                   <IonSpinner className="spinner"></IonSpinner>
                 </IonItem>
               </div>
             ) : (
               <IonList inset={true}>
                 {!userAddress ? (
                   <>
                     <div
                       style={{
                         display: 'flex',
                         flexDirection: 'row',
                         padding: '4em',
                         justifyContent: 'space-around',
                       }}
                     >
                       <IonImg src={Stone} className="logo" />
                       <IonImg src={Paper} className="logo" />
                       <IonImg src={Scissor} className="logo" />
                     </div>
                     <IonList inset={true}>
                       <ConnectButton
                         Tezos={Tezos}
                         setUserAddress={setUserAddress}
                         setUserBalance={setUserBalance}
                         wallet={wallet}
                       />
                     </IonList>
                   </>
                 ) : (
                   <IonList>
                     <IonItem style={{ padding: 0, margin: 0 }}>
                       <IonIcon icon={person} />
                       <IonLabel
                         style={{ fontSize: '0.8em', direction: 'rtl' }}
                       >
                         {userAddress}
                       </IonLabel>
                     </IonItem>
                     <IonItem style={{ padding: 0, margin: 0 }}>
                       <IonImg
                         style={{ height: 24, width: 24 }}
                         src={XTZLogo}
                       />
                       <IonLabel style={{ direction: 'rtl' }}>
                         {userBalance / 1000000}
                       </IonLabel>
                     </IonItem>

                     <div
                       style={{
                         display: 'flex',
                         flexDirection: 'row',
                         paddingTop: '10vh',
                         paddingBottom: '10vh',
                         justifyContent: 'space-around',
                         width: '100%',
                       }}
                     >
                       <IonImg src={Stone} className="logo" />
                       <IonImg src={Paper} className="logo" />
                       <IonImg src={Scissor} className="logo" />
                     </div>

                     <IonButton id="createGameModalVisible" expand="full">
                       New game
                     </IonButton>
                     <IonModal
                       ref={createGameModal}
                       trigger="createGameModalVisible"
                     >
                       <IonHeader>
                         <IonToolbar>
                           <IonButtons slot="start">
                             <IonButton
                               onClick={() => dismissCreateGameModal()}
                             >
                               Cancel
                             </IonButton>
                           </IonButtons>
                           <IonTitle>New Game</IonTitle>
                           <IonButtons slot="end">
                             <IonButton
                               strong={true}
                               onClick={(e) => createSession(e)}
                               id="createGameModal"
                             >
                               Create
                             </IonButton>
                           </IonButtons>
                         </IonToolbar>
                       </IonHeader>
                       <IonContent className="ion-padding">
                         <h2>How many total rounds ?</h2>

                         <IonItem key="total_rounds">
                           <IonLabel
                             position="stacked"
                             className="text"
                           ></IonLabel>
                           <IonInput
                             onIonChange={(str: any) => {
                               if (str.detail.value === undefined) return;
                               setTotal_rounds(
                                 new BigNumber(str.target.value) as nat
                               );
                             }}
                             value={total_rounds.toString()}
                             placeholder="total_rounds"
                             type="number"
                             label="Total Rounds"
                           />
                         </IonItem>

                         <h2>Choose your opponent player</h2>

                         <SelectMembers
                           Tezos={Tezos}
                           member={newPlayer}
                           setMember={setNewPlayer}
                         />

                         <IonItem key="newPlayer">
                           <IonInput
                             onIonChange={(str: any) => {
                               if (str.detail.value === undefined) return;
                               setNewPlayer(str.detail.value as address);
                             }}
                             labelPlacement="floating"
                             class="address"
                             value={newPlayer}
                             placeholder="...tz1"
                             type="text"
                             label="Tezos Address "
                           />
                         </IonItem>
                       </IonContent>
                     </IonModal>

                     <IonButton id="selectGameModalVisible" expand="full">
                       Join game
                     </IonButton>
                     <IonModal
                       ref={selectGameModal}
                       trigger="selectGameModalVisible"
                     >
                       <IonHeader>
                         <IonToolbar>
                           <IonButtons slot="start">
                             <IonButton
                               onClick={() => dismissSelectGameModal()}
                             >
                               Cancel
                             </IonButton>
                           </IonButtons>
                           <IonTitle>Select Game</IonTitle>
                         </IonToolbar>
                       </IonHeader>
                       <IonContent>
                         <IonList inset={true}>
                           {myGames
                             ? Array.from(myGames.entries()).map(([key, _]) => (
                                 <IonButton
                                   key={'Game-' + key.toString()}
                                   expand="full"
                                   routerLink={
                                     PAGES.SESSION + '/' + key.toString()
                                   }
                                   onClick={dismissSelectGameModal}
                                 >
                                   {'Game n°' + key.toString()}
                                 </IonButton>
                               ))
                             : []}
                         </IonList>
                       </IonContent>
                     </IonModal>

                     <IonButton routerLink={PAGES.TOPPLAYERS} expand="full">
                       Top Players
                     </IonButton>
                   </IonList>
                 )}
               </IonList>
             )}
           </IonContent>
           <IonFooter>
             <IonToolbar>
               <IonTitle>
                 <IonButton
                   color="primary"
                   routerLink={PAGES.RULES}
                   expand="full"
                 >
                   Rules
                 </IonButton>
               </IonTitle>
             </IonToolbar>
           </IonFooter>

           {userAddress ? (
             <DisconnectButton
               wallet={wallet}
               setUserAddress={setUserAddress}
               setUserBalance={setUserBalance}
             />
           ) : (
             <></>
           )}
         </IonPage>
       );
     };
     ```

     Explanation :

     - `const createGameModal` : The popup to create a new game.
     - `const selectGameModal` : The popup to select a game to join.
     - `const [newPlayer, setNewPlayer] = useState<address>("" as address)` : Used on `New Game` popup form to add an opponent.
     - `const [total_rounds, setTotal_rounds] = useState<nat>(new BigNumber(1) as nat)` : Used on `New Game` popup form to set number of round for one game.
     - `const [myGames, setMyGames] = useState<Map<nat, Session>>()` : Used on `Join Game` popup window to display the games created or with invitation.
     - `Array.from(storage.sessions.keys()).forEach((key) => { ... if (session.players.indexOf(userAddress as address) >= 0 && "inplay" in session.result ...` : On storage change event, fetch and filter only games which the user can join and play (i.e with `inplay` status and where user appears on player list).
     - `const createSession = async (...) => { ...  const op = await mainWalletType!.methods.createSession([userAddress as address, newPlayer], total_rounds).send(); ... ` : createSession function is calling the Smart contract entrypoint passing on arguments : current user address,opponent address and total rounds, then it redirects to the newly created game page.
     - `{...<IonButton ... routerLink={PAGES.SESSION + "/" + key.toString()}` : If you click on a game button from the list it redirects you to the game to play.

   - SessionScreen.tsx : it is the game page where you can play on limited rounds and where the result of the game is displayed at the end.

     ```typescript
     import { IonPage } from '@ionic/react';
     import React from 'react';

     export const SessionScreen: React.FC = () => {
       return <IonPage className="container"></IonPage>;
     };
     ```

     Leave it empty for now and edit it later and explain what to write.

   - TopPlayersScreen.tsx : it is the player ranking page.

     ```typescript
     import { IonPage } from '@ionic/react';
     import React from 'react';

     export const TopPlayersScreen: React.FC = () => {
       return <IonPage className="container"></IonPage>;
     };
     ```

     Leave it empty for now and edit it later too.

   - Rules.tsx : just some information about game rules.

     ```typescript
     import {
       IonButton,
       IonButtons,
       IonContent,
       IonHeader,
       IonImg,
       IonItem,
       IonList,
       IonPage,
       IonTitle,
       IonToolbar,
     } from '@ionic/react';
     import React from 'react';
     import { useHistory } from 'react-router-dom';
     import Clock from '../assets/clock.webp';
     import Legend from '../assets/legend.webp';
     import Paper from '../assets/paper-logo.webp';
     import Scissor from '../assets/scissor-logo.webp';
     import Stone from '../assets/stone-logo.webp';

     export const RulesScreen: React.FC = () => {
       const { goBack } = useHistory();

       /* 2. Get the param */
       return (
         <IonPage className="container">
           <IonHeader>
             <IonToolbar>
               <IonButtons slot="start">
                 <IonButton onClick={goBack}>Back</IonButton>
               </IonButtons>
               <IonTitle>Rules</IonTitle>
             </IonToolbar>
           </IonHeader>
           <IonContent fullscreen>
             <div style={{ textAlign: 'left' }}>
               <IonList>
                 <IonItem className="nopm">
                   <IonImg src={Stone} className="logo" />
                   Stone (Clenched Fist). Rock beats the scissors by hitting it
                 </IonItem>
                 <IonItem className="nopm">
                   <IonImg src={Paper} className="logo" />
                   Paper (open and extended hand) . Paper wins over stone by enveloping
                   it
                 </IonItem>
                 <IonItem className="nopm">
                   <IonImg src={Scissor} className="logo" />
                   Scissors (closed hand with the two fingers) . Scissors wins paper
                   cutting it
                 </IonItem>

                 <IonItem className="nopm">
                   <IonImg src={Clock} className="logo" />
                   If you are inactive for more than 10 minutes your opponent can
                   claim the victory
                 </IonItem>

                 <IonItem className="nopm">
                   <IonImg src={Legend} className="logo" />
                   <ul style={{ listStyle: 'none' }}>
                     <li className="win">Won round</li>
                     <li className="lose">Lost round</li>
                     <li className="draw">Draw</li>
                     <li className="current">Current Round</li>
                     <li className="missing">Missing Rounds</li>
                   </ul>
                 </IonItem>
               </IonList>
             </div>
           </IonContent>
         </IonPage>
       );
     };
     ```

   - TransactionInvalidBeaconError.ts the utility class that formats Beacon errors.

     ```typescript
     export class TransactionInvalidBeaconError {
       name: string;
       title: string;
       message: string;
       description: string;
       data_contract_handle: string;
       data_expected_form: string;
       data_message: string;

       /**
           * 
           * @param transactionInvalidBeaconError  {
           "name": "UnknownBeaconError",
           "title": "Aborted",
           "message": "[ABORTED_ERROR]:The action was aborted by the user.",
           "description": "The action was aborted by the user."
       }
       */

       constructor(transactionInvalidBeaconError: any) {
         this.name = transactionInvalidBeaconError.name;
         this.title = transactionInvalidBeaconError.title;
         this.message = transactionInvalidBeaconError.message;
         this.description = transactionInvalidBeaconError.description;
         this.data_contract_handle = '';
         this.data_expected_form = '';
         this.data_message = this.message;
         if (transactionInvalidBeaconError.data !== undefined) {
           let dataArray = Array.from<any>(
             new Map(
               Object.entries<any>(transactionInvalidBeaconError.data)
             ).values()
           );
           let contract_handle = dataArray.find(
             (obj) => obj.contract_handle !== undefined
           );
           this.data_contract_handle =
             contract_handle !== undefined
               ? contract_handle.contract_handle
               : '';
           let expected_form = dataArray.find(
             (obj) => obj.expected_form !== undefined
           );
           this.data_expected_form =
             expected_form !== undefined
               ? expected_form.expected_form +
                 ':' +
                 expected_form.wrong_expression.string
               : '';
           this.data_message =
             (this.data_contract_handle
               ? 'Error on contract : ' + this.data_contract_handle + ' '
               : '') +
             (this.data_expected_form
               ? 'error : ' + this.data_expected_form + ' '
               : '');
         }
       }
     }
     ```

1. Test it.

   To test in web mode.

   ```bash
   npm run dev
   ```

   Considering that your wallet is well configured and has some Tez on Ghostnet, click on the **Connect** button.

   > Note : If you don't have tokens, to get some free XTZ on Ghostnet, follow this link to the [faucet](https://faucet.marigold.dev/).

   On the popup, select your Wallet, then your account and connect.

   You are _logged_.

   Optional : Click on the Disconnect button to test the logout.

## Summary

You have a mobile application where you can connect and disconnect a wallet, some default UI components and styles but not yet an interaction with your smart contract.
The next step is to be able to create a game, join a game and play a session.

When you are ready, continue to [Part 3: Create the game pages](./part-3).
