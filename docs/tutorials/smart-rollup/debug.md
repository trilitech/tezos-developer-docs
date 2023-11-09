---
title: "Part 2: Running the kernel in debug mode"
last_update:
  date: 25 October 2023
---

Octez provides a command named `octez-smart-rollup-wasm-debugger` that runs Smart Rollups in debug mode to make it easier to test and observe them.
Later, you will deploy the rollup to the sandbox, but running it in debug mode first verifies that it built correctly.

1. In the terminal window inside the Docker container, go to the `hello_world_kernel` folder.

1. Run this command to start the rollup and pass an empty message inbox to it:

   ```bash
   octez-smart-rollup-wasm-debugger \
     --kernel target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm \
     --inputs empty_input.json
   ```

   The command prompt changes again to show that you are in debugging mode, which steps through commands.

1. At the debugging prompt, run this command to send the message inbox to the kernel:

   ```bash
   step inbox
   ```

   The response shows the logging information for the kernel, including these parts:

   - The message "Hello, kernel" from the `hello_kernel` function
   - The message "Got message: Internal(StartOfLevel)," which represents the start of the message inbox
   - The message "Got message: Internal(InfoPerLevel(InfoPerLevel ...," which provides the hash and timestamp of the previous block
   - The message "Got message: Internal(EndOfLevel)," which represents the end of the message inbox

1. Press Ctrl + C to end debugging mode.

Now you know that the kernel works.
In the next section, you optimize the kernel to be deployed to the sandbox.
