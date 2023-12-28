---
title: 'Part 4: Publish on the Android store'
authors: 'Benjamin Fuentes'
last_update:
  date: 12 December 2023
---

Your game will be more successful if you publish it on the Android or Apple store. A recommendation is to start with Android as it is easy and cheaper than the iOS version.

## Bundle for Android

1. Install [Android SDK](https://developer.android.com/about/versions/13/setup-sdk).

1. Modify the name of your app, open the `capacitor.config.json` file and change `"appId":"dev.marigold.shifumi"` and `"appName": "Tezos Shifumi"` properties.

1. Hack: to build on Android, change **vite.config.ts** to remove **global** field from the configuration.

   ```javascript
   export default defineConfig({
     define: {
       "process.env": process.env,
       //global: {},
     },
   ```

1. Change the ionic config to move from react to custom type build on `ionic.config.json`.

   ```json
   {
     "name": "shifumi",
     "integrations": {
       "capacitor": {}
     },
     "type": "custom"
   }
   ```

1. Stay on the app folder, and prepare Android release. These lines copy all to android folder + the images resources used by the store.

   ```bash
   ionic capacitor add android
   ionic capacitor copy android
   npm install -g cordova-res
   cordova-res android --skip-config --copy
   ionic capacitor sync android
   ionic capacitor update android
   ```

   Open Android Studio and do a `Build` or `Make Project` action.

   > Note 1: in case of broken Gradle: `ionic capacitor sync android` and click on **sync** on **Android studio > build**.

   > Note 2: If you have `WSL2` and difficulties to run an emulator on it, I advice you to install Android studio on Windows and build, test and package all on this OS. Push your files on your git repo, and check on .gitignore for `android` folder that there is no filters on assets.
   >
   > 1. Comment end lines on file `app/android/.gitignore`:
   >
   >    ```bash
   >    # Cordova plugins for Capacitor
   >    #capacitor-cordova-android-plugins
   >
   >    # Copied web assets
   >    #app/src/main/assets/public
   >
   >    # Generated Config files
   >    #app/src/main/assets/capacitor.config.json
   >    #app/src/main/assets/capacitor.plugins.json
   >    #app/src/main/res/xml/config.xml
   >    ```
   >
   > 1. Comment also the `node_modules` and `dist` at your root project because it requires files from @capacitor and you need to install this libraries
   >
   >    ```bash
   >    #node_modules/
   >    #/dist
   >    ```
   >
   > 1. Force it to be included on committed files: `git add -f android/app/src/main/assets/  ; git add -f android/capacitor-cordova-android-plugins/ ;  git add -f node_modules ;` and push to git.
   > 1. Try again `Build` or `Make Project` action on Android Studio.

   ![build.png](/img/tutorials/mobile-build.png)

   Start the emulator of your choice (or a physical device) and click on `Run app`.

   ![run.png](/img/tutorials/mobile-run.png)

   I recommend to connect with a web wallet like Kukai (because some mobile wallet does not work on the emulator).

   ![kukai.png](/img/tutorials/mobile-kukai.png)

   Once connected, you can start a new game.

   ![home.png](/img/tutorials/mobile-home.png)

1. Invite Alice to play, click on the address of the opponent player and enter this on your Android Studio terminal.

   ```bash
   adb shell input text "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
   ```

   ![alice.png](/img/tutorials/mobile-alice.png)

1. Click on Create on top right button.

1. Confirm the transaction in Kukai and come back to the app.

   Perfect, the round is starting !

1. Now you can run the web version on VScode, connect with alice and play the party with your 2 players.

   Watch the video here to see how to play a full party.

   [![Shifumi](https://img.youtube.com/vi/SHg8VPmF_NY/0.jpg)](https://www.youtube.com/watch?v=SHg8VPmF_NY)

1. Publish your app to Google Play store.

   To publish your app to Android store, read the Google documentation.
   You need a developer account: https://developer.android.com/distribute/console/

   It costs 25\$ for life (for information: Apple developer account costs 99$/ year ...).

1. On Android studio, go to Build > Generate Signed bundle / APK...

   ![sign.png](/img/tutorials/mobile-sign.png)

   Follow the Google instruction to set your keystore, and click next.
   Watch where your binary is stored and upload it to your Google Play console app.

   After passing a (long) configuration of your application on Google Play Store and passed all Google validations, your app is published and everyone can download it on Earth.

## Summary

Having a web3 game has many advantages like the transparency and inheritance of in-game currency. Developing the dapp is not so different from a web2 application. Also the bundle to Android and iOS is similar and use the common tools from Google and Apple.

I hope you enjoyed this tutorial and don't hesitate to leave feedback to the Marigold team !
