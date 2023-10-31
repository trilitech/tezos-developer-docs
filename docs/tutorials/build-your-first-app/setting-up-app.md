---
title: "Part 1: Setting up the application"
authors: 'Claude Barde, Tim McMackin'
lastUpdated: 17th October 2023
---

You can access Tezos through any JavaScript framework.
This tutorial uses the Svelte framework, and the following steps show you how to start a Svelte application and add the Tezos-related dependencies.

## Setting up the app

1. Run these commands to install Svelte with TypeScript and Vite:

   ```bash
   npm create vite@latest bank-tutorial -- --template svelte
   cd bank-tutorial
   npm install
   ```

1. Install the Tezos-related dependencies:

   ```bash
   npm install @taquito/taquito @taquito/beacon-wallet @airgap/beacon-sdk
   ```

1. Install the `buffer`, `events`, and `vite-compatible-readable-stream` libraries:

   ```bash
   npm install --save-dev buffer events vite-compatible-readable-stream
   ```

1. Update the `vite.config.js` file to the following code:

   ```javascript
   import { defineConfig, mergeConfig } from "vite";
   import path from "path";
   import { svelte } from "@sveltejs/vite-plugin-svelte";

   export default ({ command }) => {
     const isBuild = command === "build";

     return defineConfig({
       plugins: [svelte()],
         define: {
           global: {}
         },
       build: {
         target: "esnext",
         commonjsOptions: {
           transformMixedEsModules: true
         }
       },
       server: {
         port: 4000
       },
       resolve: {
         alias: {
           "@airgap/beacon-sdk": path.resolve(
             path.resolve(),
             `./node_modules/@airgap/beacon-sdk/dist/${
             isBuild ? "esm" : "cjs"
             }/index.js`
           ),
           // polyfills
           "readable-stream": "vite-compatible-readable-stream",
           stream: "vite-compatible-readable-stream"
         }
       }
     });
   };
   ```

   This updated file includes these changes to the default Vite configuration:

   - It sets the `global` object to `{}` so the application can provide the value for this object in the HTML file
   - It includes the a path to the Beacon SDK
   - It provides polyfills for `readable-stream` and `stream`

1. Update the default HTML file `index.html` to the following code:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" href="/favicon.ico" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <script>
         const global = globalThis;
       </script>
       <script type="module">
         import { Buffer } from "buffer";
         window.Buffer = Buffer;
       </script>
       <title>Tezos Bank dApp</title>
     </head>
     <body>
       <script type="module" src="/src/main.js"></script>
     </body>
   </html>
   ```

   This updated file sets the `global` variable to `globalThis` and adds a buffer object to the window.
   The Beacon SDK requires this configuration to run in a Vite app.

1. Replace the `src/main.js` file with this code:

   ```javascript
   import './app.css'
   import App from './App.svelte'

   const app = new App({
     target: document.body,
   })

   export default app
   ```

## Configuring Svelte

Svelte files include several different types of code in a single file.
The application's files have separate sections for JavaScript, style, and HTML code, as in this example:

```html
<script>
  // JavaScript or TypeScript code
</script>

<style>
  /* CSS or Sass code */
</style>

<main>
  <!-- HTML code -->
</main>
```

Svelte components are fully contained, which means that the style and code that you apply inside a component doesn't leak into the other components.
Styles and scripts that are shared among components typically go in the `src/styles` and `scripts` or `src/scripts` folders.

Follow these steps to set up the `src/App.svelte` file, which is the main component and container for other Svelte components:

1. Replace the default `src/App.svelte` file with this code:

   ```html
   <script>
   </script>

   <main>
   </main>

   <style>
   </style>
   ```

You will add code to connect to the user's wallet in the next section.
