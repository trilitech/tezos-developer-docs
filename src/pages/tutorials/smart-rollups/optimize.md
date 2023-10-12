---
id: optimize
title: "Part 4: Optimizing the kernel"
lastUpdated: 11th October 2023
---

The kernel must be efficient with space and processing power because there is a size limit for kernels.
In these steps, you optimize the kernel:

1. Run this command to print the current size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   You can run this command inside or outside of the Docker container.

   The size of the compiled kernel and its dependencies may be 18MB or more, which is too large to deploy.

1. In a terminal window outside of the Docker container, run the `wasm-strip` command to reduce the size of the kernel:

   ```bash
   wasm-strip target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   This command removes WebAssembly code that is not necessary to run rollups.
   You must run this command outside of the Docker container because it does not have the `wasm-strip` command.

1. Run the `du` command again to see the new size of the kernel:

   ```bash
   du -h target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm
   ```

   The size of the kernel is smaller now.
   Note that the changes that you make to the kernel outside of the Docker container also appear in the container and vice versa because the folder is mounted with the Docker `--volume` argument.

   To optimize the kernel further, you can convert it to an _installer kernel_, which includes only enough information to start the kernel, like an installation program.
   This installer kernel keeps the rest of its logic and data in separate files called _preimages_.

1. Outside of the Docker container, run this command to install the installer kernel tool:

   ```bash
   cargo install tezos-smart-rollup-installer
   ```

1. Outside of the Docker container, run this command to convert the kernel to an installer kernel:

   ```bash
   smart-rollup-installer get-reveal-installer --upgrade-to target/wasm32-unknown-unknown/debug/hello_world_kernel.wasm --output hello_world_kernel_installer.hex --preimages-dir preimages/
   ```

   This command creates the following files:

   - `hello_world_kernel_installer.hex`: The hexadecimal representation of the installer kernel
   - `preimages/`: A directory that contains the preimages that allow nodes to restore the installer kernel to the original kernel code

   When a node runs the installer kernel, it retrieves the preimages through the reveal data channel, a channel that smart rollups use to communicate outside of layer 1.
   For more information about the reveal data channel, see [reveal data channel](https://tezos.gitlab.io/alpha/smart_rollups.html#reveal-data-channel).

1. Verify the size of the installer kernel by running this command:

   ```bash
   du -h hello_world_kernel_installer.hex
   ```

Now the kernel is small enough to be originated on layer 1.
In fact, when it is deployed, it will be even smaller than the result of this command because the command is checking the hexadecimal representation and the deployed kernel will be in binary.
