---
title: 'Part 3: Create the game pages'
authors: 'Benjamin Fuentes (Marigold)'
last_update:
  date: 12 December 2023
---

In this section, you will create the pages to:

- Create a game: you interact with the modal `createGameModal` from the `HomeScreen.tsx` page to create a game session.
- Join a game: it redirects you to an existing game session on the `SessionScreen.tsx` page. This modal is coded on the `HomeScreen.tsx` page.
- Play a session: when you are in a game session against someone, you can play some action
  - Choose a move: Scissor, Stone, or Paper
  - Reveal your move to resolve the game round. A game session can have several rounds.
- Visualize the top player results.

## Play a game session

1. Click the `New Game` button from the home page and then create a new game.

1. Confirm the operation with your wallet.

   You are redirected the new game session page (that is blank page right now).

   > Note: you can look at the code of the modal `createGameModal` from the `HomeScreen.tsx` page to understand how it works.

1. Edit the file `./src/SessionScreen.tsx` to look like this:

   ```typescript
   import {
     IonButton,
     IonButtons,
     IonContent,
     IonFooter,
     IonHeader,
     IonIcon,
     IonImg,
     IonItem,
     IonLabel,
     IonList,
     IonPage,
     IonRefresher,
     IonRefresherContent,
     IonSpinner,
     IonTitle,
     IonToolbar,
     useIonAlert,
   } from '@ionic/react';
   import { MichelsonV1ExpressionBase, PackDataParams } from '@taquito/rpc';
   import { MichelCodecPacker } from '@taquito/taquito';
   import { BigNumber } from 'bignumber.js';
   import * as crypto from 'crypto';
   import { eye, stopCircle } from 'ionicons/icons';
   import React, { useEffect, useState } from 'react';
   import { RouteComponentProps, useHistory } from 'react-router-dom';
   import { Action, PAGES, UserContext, UserContextType } from '../App';
   import { TransactionInvalidBeaconError } from '../TransactionInvalidBeaconError';
   import Paper from '../assets/paper-logo.webp';
   import Scissor from '../assets/scissor-logo.webp';
   import Stone from '../assets/stone-logo.webp';
   import { bytes, nat, unit } from '../type-aliases';

   export enum STATUS {
     PLAY = 'Play !',
     WAIT_YOUR_OPPONENT_PLAY = 'Wait for your opponent move',
     REVEAL = 'Reveal your choice now',
     WAIT_YOUR_OPPONENT_REVEAL = 'Wait for your opponent to reveal his choice',
     FINISHED = 'Game ended',
   }

   type SessionScreenProps = RouteComponentProps<{
     id: string;
   }>;

   export const SessionScreen: React.FC<SessionScreenProps> = ({ match }) => {
     const [presentAlert] = useIonAlert();
     const { goBack } = useHistory();

     const id: string = match.params.id;

     const {
       Tezos,
       userAddress,
       storage,
       mainWalletType,
       setStorage,
       setLoading,
       loading,
       refreshStorage,
       subReveal,
       subNewRound,
     } = React.useContext(UserContext) as UserContextType;

     const [status, setStatus] = useState<STATUS>();
     const [remainingTime, setRemainingTime] = useState<number>(10 * 60);
     const [sessionEventRegistrationDone, setSessionEventRegistrationDone] =
       useState<boolean>(false);

     const registerSessionEvents = async () => {
       if (!sessionEventRegistrationDone) {
         if (subReveal)
           subReveal.on('data', async (e) => {
             console.log('on reveal event', e, id, UserContext);
             if (
               (!e.result.errors || e.result.errors.length === 0) &&
               (e.payload as MichelsonV1ExpressionBase).int === id
             ) {
               await revealPlay();
             } else
               console.warn(
                 'Warning: here we ignore this transaction event for session ',
                 id
               );
           });

         if (subNewRound)
           subNewRound.on('data', (e) => {
             if (
               (!e.result.errors || e.result.errors.length === 0) &&
               (e.payload as MichelsonV1ExpressionBase).int === id
             ) {
               console.log('on new round event:', e);
               refreshStorage();
             } else
               console.log('Warning: here we ignore this transaction event', e);
           });

         console.log(
           'registerSessionEvents registered',
           subReveal,
           subNewRound
         );
         setSessionEventRegistrationDone(true);
       }
     };

     const buildSessionStorageKey = (
       userAddress: string,
       sessionNumber: number,
       roundNumber: number
     ): string => {
       return (
         import.meta.env.VITE_CONTRACT_ADDRESS +
         '-' +
         userAddress +
         '-' +
         sessionNumber +
         '-' +
         roundNumber
       );
     };

     const buildSessionStorageValue = (
       secret: number,
       action: Action
     ): string => {
       return (
         secret +
         '-' +
         (action.cisor ? 'cisor' : action.paper ? 'paper' : 'stone')
       );
     };

     const extractSessionStorageValue = (
       value: string
     ): { secret: number; action: Action } => {
       const actionStr = value.split('-')[1];
       return {
         secret: Number(value.split('-')[0]),
         action:
           actionStr === 'cisor'
             ? new Action(true as unit, undefined, undefined)
             : actionStr === 'paper'
             ? new Action(undefined, true as unit, undefined)
             : new Action(undefined, undefined, true as unit),
       };
     };

     useEffect(() => {
       if (storage) {
         const session = storage?.sessions.get(new BigNumber(id) as nat);
         console.log(
           'Session has changed',
           session,
           'round',
           session?.current_round.toNumber(),
           'session.decoded_rounds.get(session.current_round)',
           session?.decoded_rounds.get(session?.current_round)
         );
         if (
           session &&
           ('winner' in session.result || 'draw' in session.result)
         ) {
           setStatus(STATUS.FINISHED);
         } else if (session) {
           if (
             session.decoded_rounds &&
             session.decoded_rounds.get(session.current_round) &&
             session.decoded_rounds.get(session.current_round).length === 1 &&
             session.decoded_rounds.get(session.current_round)[0].player ===
               userAddress
           ) {
             setStatus(STATUS.WAIT_YOUR_OPPONENT_REVEAL);
           } else if (
             session.rounds &&
             session.rounds.get(session.current_round) &&
             session.rounds.get(session.current_round).length === 2
           ) {
             setStatus(STATUS.REVEAL);
           } else if (
             session.rounds &&
             session.rounds.get(session.current_round) &&
             session.rounds.get(session.current_round).length === 1 &&
             session.rounds.get(session.current_round)[0].player === userAddress
           ) {
             setStatus(STATUS.WAIT_YOUR_OPPONENT_PLAY);
           } else {
             setStatus(STATUS.PLAY);
           }
         }

         (async () => await registerSessionEvents())();
       } else {
         console.log('Wait parent to init storage ...');
       }
     }, [storage?.sessions.get(new BigNumber(id) as nat)]);

     //setRemainingTime
     useEffect(() => {
       const interval = setInterval(() => {
         const diff = Math.round(
           (new Date(
             storage?.sessions.get(new BigNumber(id) as nat).asleep!
           ).getTime() -
             Date.now()) /
             1000
         );

         if (diff <= 0) {
           setRemainingTime(0);
         } else {
           setRemainingTime(diff);
         }
       }, 1000);

       return () => clearInterval(interval);
     }, [storage?.sessions.get(new BigNumber(id) as nat)]);

     const play = async (action: Action) => {
       const session_id = new BigNumber(id) as nat;
       const current_session = storage?.sessions.get(session_id);
       try {
         setLoading(true);
         const secret = Math.round(Math.random() * 63); //FIXME it should be 654843, but we limit the size of the output hexa because expo-crypto is buggy
         // see https://forums.expo.dev/t/how-to-hash-buffer-with-expo-for-an-array-reopen/64587 or https://github.com/expo/expo/issues/20706 );
         localStorage.setItem(
           buildSessionStorageKey(
             userAddress,
             Number(id),
             storage!.sessions
               .get(new BigNumber(id) as nat)
               .current_round.toNumber()
           ),
           buildSessionStorageValue(secret, action)
         );
         console.log('PLAY - pushing to session storage ', secret, action);
         const encryptedAction = await create_bytes(action, secret);
         console.log(
           'encryptedAction',
           encryptedAction,
           'session_id',
           session_id,
           'current_round',
           current_session?.current_round
         );

         const preparedCall = mainWalletType?.methods.play(
           session_id,
           current_session!.current_round,

           encryptedAction
         );

         const { gasLimit, storageLimit, suggestedFeeMutez } =
           await Tezos.estimate.transfer({
             ...preparedCall!.toTransferParams(),
             amount: 1,
             mutez: false,
           });

         console.log({ gasLimit, storageLimit, suggestedFeeMutez });
         const op = await preparedCall!.send({
           gasLimit: gasLimit * 2, //we take a margin +1000 for an eventual event in case of paralell execution
           fee: suggestedFeeMutez * 2,
           storageLimit: storageLimit,
           amount: 1,
           mutez: false,
         });

         await op?.confirmation();
         const newStorage = await mainWalletType?.storage();
         setStorage(newStorage!);
         setLoading(false);
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

     const revealPlay = async () => {
       const session_id = new BigNumber(id) as nat;

       //force refresh in case of events
       const storage = await mainWalletType?.storage();

       const current_session = storage!.sessions.get(session_id)!;

       console.warn(
         'refresh storage because events can trigger it outisde react scope ...',
         userAddress,
         current_session.current_round
       );

       //fecth from session storage
       const secretActionStr = localStorage.getItem(
         buildSessionStorageKey(
           userAddress,
           session_id.toNumber(),
           current_session!.current_round.toNumber()
         )
       );

       if (!secretActionStr) {
         presentAlert({
           header: 'Internal error',
           message:
             'You lose the session/round ' +
             session_id +
             '/' +
             current_session!.current_round.toNumber() +
             ' storage, no more possible to retrieve secrets, stop Session please',
           buttons: ['Close'],
         });
         setLoading(false);
         return;
       }

       const secretAction = extractSessionStorageValue(secretActionStr);
       console.log('REVEAL - Fetch from session storage', secretAction);

       try {
         setLoading(true);
         const encryptedAction = await packAction(secretAction.action);

         const preparedCall = mainWalletType?.methods.revealPlay(
           session_id,
           current_session?.current_round!,

           encryptedAction as bytes,
           new BigNumber(secretAction.secret) as nat
         );

         const { gasLimit, storageLimit, suggestedFeeMutez } =
           await Tezos.estimate.transfer(preparedCall!.toTransferParams());

         //console.log({ gasLimit, storageLimit, suggestedFeeMutez });
         const op = await preparedCall!.send({
           gasLimit: gasLimit * 3,
           fee: suggestedFeeMutez * 2,
           storageLimit: storageLimit * 4, //we take a margin in case of paralell execution
         });
         await op?.confirmation();
         const newStorage = await mainWalletType?.storage();
         setStorage(newStorage!);
         setLoading(false);
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

     /** Pack an action variant to bytes. Same is Pack.bytes()  */
     async function packAction(action: Action): Promise<string> {
       const p = new MichelCodecPacker();
       const actionbytes: PackDataParams = {
         data: action.stone
           ? { prim: 'Left', args: [{ prim: 'Unit' }] }
           : action.paper
           ? {
               prim: 'Right',
               args: [{ prim: 'Left', args: [{ prim: 'Unit' }] }],
             }
           : {
               prim: 'Right',
               args: [{ prim: 'Right', args: [{ prim: 'Unit' }] }],
             },
         type: {
           prim: 'Or',
           annots: ['%action'],
           args: [
             { prim: 'Unit', annots: ['%stone'] },
             {
               prim: 'Or',
               args: [
                 { prim: 'Unit', annots: ['%paper'] },
                 { prim: 'Unit', annots: ['%cisor'] },
               ],
             },
           ],
         },
       };
       return (await p.packData(actionbytes)).packed;
     }

     /** Pack an pair [actionBytes,secret] to bytes. Same is Pack.bytes()  */
     async function packActionBytesSecret(
       actionBytes: bytes,
       secret: number
     ): Promise<string> {
       const p = new MichelCodecPacker();
       const actionBytesSecretbytes: PackDataParams = {
         data: {
           prim: 'Pair',
           args: [{ bytes: actionBytes }, { int: secret.toString() }],
         },
         type: {
           prim: 'pair',
           args: [
             {
               prim: 'bytes',
             },
             { prim: 'nat' },
           ],
         },
       };
       return (await p.packData(actionBytesSecretbytes)).packed;
     }

     const stopSession = async () => {
       try {
         setLoading(true);
         const op = await mainWalletType?.methods
           .stopSession(new BigNumber(id) as nat)
           .send();
         await op?.confirmation(2);
         const newStorage = await mainWalletType?.storage();
         setStorage(newStorage!);
         setLoading(false);
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

     const create_bytes = async (
       action: Action,
       secret: number
     ): Promise<bytes> => {
       const actionBytes = (await packAction(action)) as bytes;
       console.log('actionBytes', actionBytes);
       const bytes = (await packActionBytesSecret(
         actionBytes,
         secret
       )) as bytes;
       console.log('bytes', bytes);

       /* correct implementation with a REAL library */
       const encryptedActionSecret = crypto
         .createHash('sha512')
         .update(Buffer.from(bytes, 'hex'))
         .digest('hex') as bytes;

       console.log('encryptedActionSecret', encryptedActionSecret);
       return encryptedActionSecret;
     };

     const getFinalResult = (): string | undefined => {
       if (storage) {
         const result = storage.sessions.get(new BigNumber(id) as nat).result;
         if ('winner' in result && result.winner === userAddress) return 'win';
         if ('winner' in result && result.winner !== userAddress) return 'lose';
         if ('draw' in result) return 'draw';
       }
     };

     const isDesktop = () => {
       const { innerWidth } = window;
       if (innerWidth > 800) return true;
       else return false;
     };

     return (
       <IonPage className="container">
         <IonHeader>
           <IonToolbar>
             <IonButtons slot="start">
               <IonButton onClick={goBack}>Back</IonButton>
             </IonButtons>
             <IonTitle>Game n°{id}</IonTitle>
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
             <>
               <IonList inset={true} style={{ textAlign: 'left' }}>
                 {status !== STATUS.FINISHED ? (
                   <IonItem className="nopm">Status: {status}</IonItem>
                 ) : (
                   ''
                 )}
                 <IonItem className="nopm">
                   <span>
                     Opponent:{' '}
                     {storage?.sessions
                       .get(new BigNumber(id) as nat)
                       .players.find((userItem) => userItem !== userAddress)}
                   </span>
                 </IonItem>

                 {status !== STATUS.FINISHED ? (
                   <IonItem className="nopm">
                     Round:
                     {Array.from(
                       Array(
                         storage?.sessions
                           .get(new BigNumber(id) as nat)
                           .total_rounds.toNumber()
                       ).keys()
                     ).map((roundId) => {
                       const currentRound: number = storage
                         ? storage?.sessions
                             .get(new BigNumber(id) as nat)
                             .current_round?.toNumber() - 1
                         : 0;
                       const roundwinner = storage?.sessions
                         .get(new BigNumber(id) as nat)
                         .board.get(new BigNumber(roundId + 1) as nat);

                       return (
                         <div
                           key={roundId + '-' + roundwinner}
                           className={
                             !roundwinner && roundId > currentRound
                               ? 'missing'
                               : !roundwinner && roundId === currentRound
                               ? 'current'
                               : !roundwinner
                               ? 'draw'
                               : roundwinner.Some === userAddress
                               ? 'win'
                               : 'lose'
                           }
                         ></div>
                       );
                     })}
                   </IonItem>
                 ) : (
                   ''
                 )}

                 {status !== STATUS.FINISHED ? (
                   <IonItem className="nopm">
                     {'Remaining time:' + remainingTime + ' s'}
                   </IonItem>
                 ) : (
                   ''
                 )}
               </IonList>

               {status === STATUS.FINISHED ? (
                 <IonImg
                   className={'logo-XXL' + (isDesktop() ? '' : ' mobile')}
                   src={'assets/' + getFinalResult() + '.png'}
                 />
               ) : (
                 ''
               )}

               {status === STATUS.PLAY ? (
                 <IonList
                   lines="none"
                   style={{ marginLeft: 'calc(50vw - 70px)' }}
                 >
                   <IonItem style={{ margin: 0, padding: 0 }}>
                     <IonButton
                       style={{ height: 'auto' }}
                       onClick={() =>
                         play(new Action(true as unit, undefined, undefined))
                       }
                     >
                       <IonImg src={Scissor} className="logo" />
                     </IonButton>
                   </IonItem>
                   <IonItem style={{ margin: 0, padding: 0 }}>
                     <IonButton
                       style={{ height: 'auto' }}
                       onClick={() =>
                         play(new Action(undefined, true as unit, undefined))
                       }
                     >
                       <IonImg src={Paper} className="logo" />
                     </IonButton>
                   </IonItem>
                   <IonItem style={{ margin: 0, padding: 0 }}>
                     <IonButton
                       style={{ height: 'auto' }}
                       onClick={() =>
                         play(new Action(undefined, undefined, true as unit))
                       }
                     >
                       <IonImg src={Stone} className="logo" />
                     </IonButton>
                   </IonItem>
                 </IonList>
               ) : (
                 ''
               )}

               {status === STATUS.REVEAL ? (
                 <IonButton onClick={() => revealPlay()}>
                   <IonIcon icon={eye} />
                   Reveal
                 </IonButton>
               ) : (
                 ''
               )}
               {remainingTime === 0 && status !== STATUS.FINISHED ? (
                 <IonButton onClick={() => stopSession()}>
                   <IonIcon icon={stopCircle} />
                   Claim victory
                 </IonButton>
               ) : (
                 ''
               )}
             </>
           )}
         </IonContent>
         <IonFooter>
           <IonToolbar>
             <IonTitle>
               <IonButton routerLink={PAGES.RULES} expand="full">
                 Rules
               </IonButton>
             </IonTitle>
           </IonToolbar>
         </IonFooter>
       </IonPage>
     );
   };
   ```

   Explanations:

   - `export enum STATUS {...`: This enum is used to guess the actual status of the game based on different field values. It gives the connected user the next action to do, and so controls the display of the buttons.
   - `const subReveal = Tezos.stream.subscribeEvent({tag: "reveal",...`: Websocket subscription to the smart contract `reveal` event. When it is time to reveal, it can trigger the action from the mobile app without asking the user to click the button.
   - `const subNewRound = Tezos.stream.subscribeEvent({tag: "newRound",...`: Websocket subscription to smart contract `newround` event. When a new round is ready, this event notifies the mobile to refresh the current game so the player can play the next round.
   - `const buildSessionStorageKey ...`: This function is a helper to store on browser storage a unique secret key of the player. This secret is a salt that is added to encrypt the Play action and then to decrypt the Reveal action.
   - `const buildSessionStorageValue ...`: Same as above but for the value stored as a string.
   - `const play = async (action: Action) => { ... `: Play action. It creates a player secret for this Play action randomly `Math.round(Math.random() * 63)` and stores it on the browser storage `localStorage.setItem(buildSessionStorageKey(...`. Then it packs and encrypts the Play action calling `create_bytes(action, secret)`. It estimates the cost of the transaction and adds an extra amount for the event cost `mainWalletType!.methods.play(encryptedAction,current_session!.current_round,session_id) ... Tezos.estimate.transfer(...) ... preparedCall.send({gasLimit: gasLimit + 1000, ...`. It asks for 1 XTZ from each player doing a Play action. This money is staked on the contract and freed when the game is ended. The Shifumi game itself does not take any extra fees by default. Only players win or lose money.
   - `const revealPlay = async () => {...`: Reveal action. It fetches the secret from `localStorage.getItem(...`, then it packs the secret action and reveals the secret: `mainWalletType!.methods.revealPlay(encryptedAction as bytes,new BigNumber(secretAction.secret) as nat,current_session!.current_round,session_id);`. It adds again an extra gas limit `gasLimit: gasLimit * 3`. It increases the gas limit because if two players reveal actions on the same block, the primary estimation of gas made by the wallet is not enough. The reason is that the execution of the second reveal play action executes another business logic because the first action is modifying the initial state, so the estimation at this time (with this previous state) is no longer valid.
   - `const getFinalResult`: Based on some fields, it gives the final status of the game when it is ended. When the game is ended the winner gets the money staked by the loser. In case of a draw, the staked money is sent back to the players.
   - `const stopSession = async () => {...`: There is a countdown of 10 minutes. If no player wants to play any more and the game is unfinished, someone can claim the victory and close the game calling `mainWalletType!.methods.stopSession(`. The smart contract looks at different configurations to guess if there is someone guilty or it is just a draw because no one wants to play any more. Gains are sent to the winner or in a case of draw, the tez is sent back to players.

   When the page refreshes, you can see the game session.

1. Create the Top player score page:

   The last step is to see the score of all players.

   Edit `TopPlayersScreen.tsx` to look like this:

   ```typescript
   import {
     IonButton,
     IonButtons,
     IonCol,
     IonContent,
     IonGrid,
     IonHeader,
     IonImg,
     IonPage,
     IonRefresher,
     IonRefresherContent,
     IonRow,
     IonTitle,
     IonToolbar,
   } from '@ionic/react';
   import React, { useEffect, useState } from 'react';
   import { useHistory } from 'react-router-dom';
   import { UserContext, UserContextType } from '../App';
   import Ranking from '../assets/ranking.webp';
   import { nat } from '../type-aliases';

   export const TopPlayersScreen: React.FC = () => {
     const { goBack } = useHistory();
     const { storage, refreshStorage } = React.useContext(
       UserContext
     ) as UserContextType;

     const [ranking, setRanking] = useState<Map<string, number>>(new Map());

     useEffect(() => {
       (async () => {
         if (storage) {
           const ranking = new Map(); //force refresh
           Array.from(storage.sessions.keys()).forEach((key: nat) => {
             const result = storage.sessions.get(key).result;
             if ('winner' in result) {
               const winner = result.winner;
               let score = ranking.get(winner);
               if (score) score++;
               else score = 1;
               ranking.set(winner, score);
             }
           });

           setRanking(ranking);
         } else {
           console.log('storage is not ready yet');
         }
       })();
     }, [storage]);

     /* 2. Get the param */
     return (
       <IonPage className="container">
         <IonHeader>
           <IonToolbar>
             <IonButtons slot="start">
               <IonButton onClick={goBack}>Back</IonButton>
             </IonButtons>
             <IonTitle>Top Players</IonTitle>
           </IonToolbar>
         </IonHeader>
         <IonContent fullscreen>
           <IonRefresher slot="fixed" onIonRefresh={refreshStorage}>
             <IonRefresherContent></IonRefresherContent>
           </IonRefresher>
           <div style={{ marginLeft: '40vw' }}>
             <IonImg
               src={Ranking}
               className="ranking"
               style={{ height: '10em', width: '5em' }}
             />
           </div>

           <IonGrid fixed={true} style={{ color: 'white', padding: '2vh' }}>
             <IonRow
               style={{
                 backgroundColor: 'var(--ion-color-primary)',
               }}
             >
               <IonCol className="col">Address</IonCol>
               <IonCol size="2" className="col">
                 Won
               </IonCol>
             </IonRow>

             {ranking && ranking.size > 0
               ? Array.from(ranking).map(([address, count]) => (
                   <IonRow
                     key={address}
                     style={{
                       backgroundColor: 'var(--ion-color-secondary)',
                     }}
                   >
                     <IonCol className="col tiny">{address}</IonCol>
                     <IonCol size="2" className="col">
                       {count}
                     </IonCol>
                   </IonRow>
                 ))
               : []}
           </IonGrid>
         </IonContent>
       </IonPage>
     );
   };
   ```

   Explanations:

   - `let ranking = new Map()`: It prepares a map to count the score for each winner. Looping through all sessions with `storage.sessions.keys()).forEach`, it takes only where there is a winner `if ("winner" in result)` then it increments the score `if (score) score++;else score = 1` and pushes it to the map `ranking.set(winner, score);`.

   All pages are ready. The Game is done!

## Summary

You have successfully create a Web3 game that runs 100% on-chain.
The next step is to build and distribute your game as an Android app.

When you are ready, continue to [Part 4: Publish on the Android store](/tutorials/mobile/part-4).
