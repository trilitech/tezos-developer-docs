---
title: "Part 3: Getting slot information"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 11 September 2024
---

When clients send data to the DAL, they must choose which slot to put it in.
This can cause conflicts, because only one client can write data to a given slot in a single block.
If more than one client tries to write to the same slot and a baker includes those operations in the same block, only the first operation in the block succeeds in writing data to the slot.
The other operations fail and the clients must re-submit the data to be included in a future block.

For this reason, clients should check the status of slots to avoid conflicts.

To see which slots are in use, you can use the Explorus indexer at https://explorus.io/dal and select your network.
For example, this screenshot shows that slots 10 and 25 are in use:

![The Explorus indexer, showing the slots that are in use in each block](/img/tutorials/dal-explorus-slots.png)

You can also see the state of the DAL slots by running a DAL node.
To reduce the amount of data that they have to manage, DAL nodes can subscribe to certain slots and ignore the data in others.
Similarly, the protocol assigns bakers to monitor certain slots.

## Starting a DAL node

To run a DAL node, you must configure a set of cryptographic parameters for it and the use the Octez `octez-dal-node` command and pass the slots to monitor in the `--observer-profiles` argument:

1. In a new terminal window in the Docker container, run this command to download the trusted setup scripts:

   ```bash
   wget https://gitlab.com/tezos/tezos/-/raw/master/scripts/install_dal_trusted_setup.sh https://gitlab.com/tezos/tezos/-/raw/master/scripts/version.sh
   ```

1. Run this command to make the scripts executable:

   ```bash
   chmod +x install_dal_trusted_setup.sh version.sh
   ```

1. Run this command to install the trusted setup:

   ```bash
   ./install_dal_trusted_setup.sh --legacy
   ```

1. Run this command to start a DAL node and monitor slot 0:

   ```bash
   octez-dal-node run --endpoint http://127.0.0.1:8732 \
     --observer-profiles=0 --data-dir _dal_node
   ```

Leave this process running in the terminal window.

## Accessing the slot data from a Smart Rollup

Follow these steps to update the Smart Rollup to access information about slot 0:

1. Update the `src/lib.rs` file to have this code:

   ```rust
   use tezos_smart_rollup::{host::RuntimeError, kernel_entry, prelude::*};
   use tezos_smart_rollup_host::dal_parameters::RollupDalParameters;

   const SLOT_TO_MONITOR: u8 = 0;

   pub fn run<R: Runtime>(
       host: &mut R,
       param: &RollupDalParameters,
       slot_index: u8,
   ) -> Result<(), RuntimeError> {
       let sol = host.read_input()?.unwrap();

       let target_level = sol.level as usize - param.attestation_lag as usize;

       let mut buffer = vec![0u8; param.page_size as usize];

       let bytes_read = host.reveal_dal_page(target_level as i32, slot_index, 0, &mut buffer)?;

       if 0 < bytes_read {
           debug_msg!(
               host,
               "Attested slot at index {} for level {}: {:?}\n",
               slot_index,
               target_level,
               &buffer.as_slice()[0..10]
           );
       } else {
           debug_msg!(
               host,
               "No attested slot at index {} for level {}\n",
               slot_index,
               target_level
           );
       }

       Ok(())
   }

   pub fn entry<R: Runtime>(host: &mut R) {
       let param = host.reveal_dal_parameters();
       debug_msg!(host, "{:?}\n", param);

       match run(host, &param, SLOT_TO_MONITOR) {
           Ok(()) => debug_msg!(host, "See you in the next level\n"),
           Err(_) => debug_msg!(host, "Something went wrong for some reasons"),
       }
   }

   kernel_entry!(entry);
   ```

   The key change is the addition of the function `run`.
   Using this function allows the code to use the `?` operator of Rust by using a function that returns a `Result` type.

   The `run` function proceeds as follows:

      1. First, it uses the DAL parameters to know the first level where a slot might be used.
      It subtracts the attestation lag from the current level, which it gets from the Smart Rollup inbox; the result is the most recent block that may have attested data in it.
      1. It allocates `Vec<u8>` buffer of the current page size.
      1. It attempts to fill the buffer with the `read_dal_page` function provided
      by the SDK.
      1. It checks the value returned by the function, which is the number of bytes
      read.
      Zero bytes mean that the slot has no attested data in it.
      Otherwise, it is necessarily the size of the page, because that's the size of the buffer.

1. Update the `Cargo.toml` file to add this dependency at the end:

   ```toml
   tezos-smart-rollup-host = { version = "0.2.2", features = [ "proto-alpha" ] }
   ```

   The end of the file looks like this:

   ```toml
   [dependencies]
   tezos-smart-rollup = { version = "0.2.2", features = [ "proto-alpha" ] }
   tezos-smart-rollup-host = { version = "0.2.2", features = [ "proto-alpha" ] }
   ```

1. Stop the process that is running the `octez-smart-rollup-node` program.

1. Run the commands to build and deploy the Smart Rollup and start the Smart Rollup node.

   If you set up the deployment script as described in [Part 2: Getting the DAL parameters](/tutorials/build-files-archive-with-dal/get-dal-params), you can run `./deploy_smart_rollup.sh my_wallet`, where `my_wallet` is the Octez client alias of your address.

   If not, run these commands, where `my_wallet` is the Octez client alias of your address:

   ```bash
   rm -rf _rollup_node
   cargo build --release --target wasm32-unknown-unknown
   cp target/wasm32-unknown-unknown/release/files_archive.wasm .

   smart-rollup-installer get-reveal-installer -P _rollup_node/wasm_2_0_0 \
     -u files_archive.wasm -o installer.hex

   octez-client originate smart rollup files_archive from my_wallet of kind wasm_2_0_0 \
     of type unit with kernel "$(cat installer.hex)" --burn-cap 2.0 --force

   octez-smart-rollup-node --endpoint http://127.0.0.1:8732  \
     run observer for files_archive with operators --data-dir _rollup_node \
     --dal-node http://localhost:10732 --log-kernel-debug
   ```

1. In another terminal window, view the log with the command `tail -F _rollup_node/kernel.log`.

The log shows information about slot 0, as in this example:

```
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
No attested slot at index 0 for level 7325504
See you in the next level
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
No attested slot at index 0 for level 7325505
See you in the next level
RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
No attested slot at index 0 for level 7325506
See you in the next level
```

For the first 8 Tezos blocks produced after the origination of the Smart Rollup, the kernel will report that no slot has been attested for the targeted level, _even if Explorus states the opposite_.
This is because, as of January, 2024, a Smart Rollup cannot fetch the content of a slot published before it is originated.
This is why you must wait for 8 blocks before seeing slot page contents being
logged.

Now that you can see the state of the slots, you can find an unused slot and publish data to it.
When you are ready, continue to [Part 4: Publishing on the DAL](/tutorials/build-files-archive-with-dal/publishing-on-the-dal).
