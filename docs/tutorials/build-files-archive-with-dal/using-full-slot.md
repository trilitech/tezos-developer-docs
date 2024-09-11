---
title: "Part 5: Using the entire slot"
authors: Tezos core developers, Tim McMackin
last_update:
  date: 30 July 2024
---

In some cases, you may want to retrieve the entire contents of a slot.
For example, it can be convenient to get the entire slot because it has a fixed size, while the data in the slot may be smaller and padded to fit the slot.

## Fetching and storing the full slot

Retrieving the full slot is similar to retrieving any data from the slot.
In this case, you change the kernel to retrieve data of the exact size of the slot.

1. Update the `run` function in the `lib/rs` file to this code, without changing the rest of the file:

   ```rust
   pub fn run<R: Runtime>(
       host: &mut R,
       param: &RollupDalParameters,
       slot_index: u8,
   ) -> Result<(), RuntimeError> {
       // Reading one message from the shared inbox is always safe,
       // because the shared inbox contains at least 3 messages per
       // Tezos block.
       let sol = host.read_input()?.unwrap();

       let target_level = sol.level as usize - param.attestation_lag as usize;

       let mut buffer = vec![0u8; param.slot_size as usize];

       let bytes_read = host.reveal_dal_page(target_level as i32, slot_index, 0, &mut buffer)?;

       if bytes_read == 0 {
           debug_msg!(
               host,
               "No attested slot at index {} for level {}\n",
               slot_index,
               target_level
           );

           return Ok(());
       }

       debug_msg!(
           host,
           "Attested slot at index {} for level {}\n",
           slot_index,
           target_level
       );

       let num_pages = param.slot_size / param.page_size;

       for page_index in 1..num_pages {
           let _result = host.reveal_dal_page(
               target_level as i32,
               slot_index,
               page_index.try_into().unwrap(),
               &mut buffer[page_index as usize * (param.page_size as usize)
                   ..(page_index as usize + 1) * (param.page_size as usize)],
           );
       }

       let hash = blake2b::digest(&buffer, 32).unwrap();
       let key = hex::encode(hash);
       let path = OwnedPath::try_from(format!("/{}", key)).unwrap();

       debug_msg!(host, "Saving slot under `{}'\n", path);

       let () = host.store_write_all(&path, &buffer)?;

       Ok(())
   }
   ```

   Now the `run` function works like this:

      1. It allocates a buffer of the size of a slot, not a size of a page.
      1. It tries to fetch the contents of the first page.
      If 0 bytes are written by `reveal_dal_page`, the targeted slot has not been
   attested for this block.
      1. If the targeted slot has been attested, the function reads as many pages as necessary to get the full slot data.
      1. It stores the data in the durable storage, using the Blake2B hash (encoded in hexadecimal) as its key.

1. Add these `use` statements to the beginning of the file:

   ```rust
   use tezos_crypto_rs::blake2b;
   use tezos_smart_rollup::storage::path::OwnedPath;
   ```

   These dependencies use `tezos_crypto_rs` for hashing, and `hex` for encoding.

1. Add the matching dependencies to the end of the `Cargo.toml` file:

   ```toml
   tezos_crypto_rs = { version = "0.5.2", default-features = false }
   hex = "0.4.3"
   ```

   Adding `default-features = false` for `tezos_crypto_rs` is necessary for the crate to be compatible with Smart Rollups.

1. Deploy the Smart Rollup again, publish a file as you did in the previous section, and wait for enough levels to pass.
The Smart Rollup log shows the hash of the data, as in this example:

   ```
   RollupDalParameters { number_of_slots: 32, attestation_lag: 8, slot_size: 126944, page_size: 3967 }
   Attested slot at index 10 for level 7325751
   Saving slot under `/6a578d1e6746d29243ff81923bcea6375e9344d719ca118e14cd9f3d3b00cd96'
   See you in the next level
   ```

1. Get the data from the slot by passing the hash, as in this example:

   ```bash
   hash=6a578d1e6746d29243ff81923bcea6375e9344d719ca118e14cd9f3d3b00cd96
   curl "http://localhost:8932/global/block/head/durable/wasm_2_0_0/value?key=/${hash}" \
       -H 'Content-Type: application/octet-stream' \
       -o slot.bin
   ```

1. Convert the contents of the slot to text by running this command:

   ```bash
   xxd -r -p slot.bin
   ```

   The console shows your message in text, such as "Hi! This is a message to go on the DAL."

:::note Why `diff` won't work
You cannot use `diff` to ensure that the file you originally published and the one that you downloaded from the rollup node are equal.
Indeed, they are not: because the size of a slot is fixed, the DAL node pads the value it receives from `POST /slot` in order to ensure that it has the correct slot size.
:::

## Next steps

Now you know how to send files to the DAL and use a Smart Rollup to store the data.

From there, the sky's the limit.
You can implement many other features, such as:

- Handling more than one file per level
- Having file publishers pay for the storage that they are using in layer 2 by allowing them to deposit tez to the Smart Rollup and sign the files they publish
- Building a frontend to visualize the files in the archive
- Providing the original size of the file by modifying the script to prefix the file with its size
