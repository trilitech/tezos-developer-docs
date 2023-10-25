---
id: optimize
title: "Part 3: Optimizing the kernel"
lastUpdated: 25th October 2023
---

To originate the kernel on Tezos, it must fit within the maximum size for a layer 1 operation.
In these steps, you optimize the kernel:

1. Run this command to print the current size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   You can run this command inside or outside of the Docker container.

   Because you ran it in debug mode, the size of the compiled kernel and its dependencies may be 18MB or more, which is too large to originate.

1. In a terminal window outside of the Docker container, run this command to create a release build of the kernel:

   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

1. Check the size of the release build of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/release/hello_world_kernel.wasm
   ```

   The release build is significantly smaller, but still too large.

1. In a terminal window outside of the Docker container, run the `wasm-strip` command to reduce the size of the kernel:

   ```bash
   wasm-strip target/wasm32-unknown-unknown/release/hello_world_kernel.wasm
   ```

   This command removes WebAssembly code that is not necessary to run rollups.
   You must run this command outside of the Docker container because it does not have the `wasm-strip` command.

1. Run the `du` command again to see the new size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/release/hello_world_kernel.wasm
   ```

   The size of the kernel is smaller now.
   Note that the changes that you make to the kernel outside of the Docker container also appear in the container and vice versa because the folder is mounted with the Docker `--volume` argument.

   To get the kernel running with an even smaller size, you can use the installer kernel, which includes only enough information to install your original kernel.
   To do this, your kernel is split up and stored in separate files called preimages.
   Then you run the installer kernel, it requests these files and reconstructs the original kernel.

1. Outside of the Docker container, run this command to install the installer kernel tool:

   ```bash
   cargo install tezos-smart-rollup-installer
   ```

1. Outside of the Docker container, run this command to create an installer kernel:

   ```bash
   smart-rollup-installer get-reveal-installer \
     --upgrade-to target/wasm32-unknown-unknown/release/hello_world_kernel.wasm \
     --output hello_world_kernel_installer.wasm --preimages-dir preimages/
   ```

   This command creates the following files:

   - `hello_world_kernel_installer.wasm`: The installer kernel
   - `preimages/`: A directory that contains the preimages that allow nodes to restore the original kernel code

   When a node runs the installer kernel, it retrieves the preimages through the reveal data channel, a channel that smart rollups use to communicate outside of layer 1.
   For more information about the reveal data channel, see [reveal data channel](https://tezos.gitlab.io/alpha/smart_rollups.html#reveal-data-channel).

1. Verify the size of the installer kernel by running this command:

   ```bash
   du -h hello_world_kernel_installer.wasm
   ```

   Now the kernel is small enough to originate on layer 1.

1. Inside of the Docker container, run the installer kernel in debug mode by running this command:

   ```bash
   octez-smart-rollup-wasm-debugger --kernel hello_world_kernel_installer.wasm \
     --preimage-dir preimages/ --inputs empty_input.json
   ```

   Then you can use the `step inbox` command to simulate receiving the inbox from layer 1.
   Press Ctrl + C to end the debugging session.

1. Create a hexadecimal version of the installer kernel by running this command outside of the Docker container:

   ```bash
   smart-rollup-installer get-reveal-installer \
     --upgrade-to target/wasm32-unknown-unknown/release/hello_world_kernel.wasm \
     --output hello_world_kernel_installer.hex --preimages-dir preimages/
   ```

   In the next section, you originate this hex version of the installer kernel on layer 1.
