---
title: "Part 3: Publishing on the DAL"
authors: 'Tezos Core Developers'
last_update:
  date: 26 January 2024
---

Now that you can get information about the DAL, the next step is to publish data to it and verify that the kernel can access it.

:::note Planning ahead
Before trying to run the code yourself, look at [Explorus](https://explorus.io/dal), select Weeklynet, and choose a slot that is not currently being used.
:::

The examples in this tutorial use slot 10.
Throughout the rest of this tutorial, replace slot 10 with the number of the slot that you choose.

## Switching slots

When you have selected a slot that does not appear to be in use, follow these steps to restart the Smart Rollup and DAL node:

1. Stop the DAL node and restart it with a new `--producer-profiles` argument.
For example, this command uses slot 10:

   ```bash
   octez-dal-node run --endpoint ${ENDPOINT} \
       --producer-profiles=10 --data-dir _dal_node
   ```

1. Update the kernel to monitor that slot by updating this line:

   ```rust
   const SLOT_TO_MONITOR: u8 = 0;
   ```

   For example, to monitor slot 10, change the 0 to a 10, as in this code:

   ```rust
   const SLOT_TO_MONITOR: u8 = 10;
   ```

1. Run the commands to build and deploy the Smart Rollup and start the node.
You can use the script in [Part 2: Getting the DAL parameters](/tutorials/build-files-archive-with-dal/get-dal-params) to simplify the process.

## Publishing messages

The DAL node provides an RPC endpoint for clients to send data to be added to a slot: `POST /slot`, whose body is the contents of the slot.

1. Run this command to publish a message to the DAL:

   ```bash
   curl localhost:10732/slots --data '"Hello, world!"' -H 'Content-Type: application/json'
   ```

   This command assumes that you have not changed the default RPC server address.

   The command returns the certificate from the DAL node, which looks like this example:

   ```json
   {
     "commitment": "sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ",
     "commitment_proof":"8229c63b8e858d9a96321c80a204756020dd13243621c11bec61f182a23714cf6e0985675fff45f1164657ad0c7b9418"
   }
   ```

   Note that the value of the message is in double quotes because it must be a valid JSON string, as hinted by the `Content-Type` header.

1. Using the values of the commitment and proof from the previous command, post the certificate to layer 1 with this command, being sure to set the slot number that you are using:

   ```bash
   commitment="sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ"
   proof="8229c63b8e858d9a96321c80a204756020dd13243621c11bec61f182a23714cf6e0985675fff45f1164657ad0c7b9418"
   octez-client --endpoint ${ENDPOINT} \
       publish dal commitment "${commitment}" from ${MY_ACCOUNT} for slot 10 \
       with proof "${proof}"
   ```

   If the Octez client successfully published the commitment, the response to the command shows the slot number and the block (level) that it was published in.
   For example, this response shows that the commitment is in level 8455 in slot 10:

   ```
   Data availability slot header publishing:
   Slot: slot_index: 13, commitment: sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ
   This data availability slot header publishing was successfully applied
   id:(published_level: 8455, index: 10), commitment: sh1u3tr3YKPDYUp2wWKCfmV5KZb82FREhv8GtDeR3EJccsBerWGwJYKufsDNH8rk4XqGrXdooZ
   Consumed gas: 1331.033
   ```

   After 4 blocks, you should see a message in the kernel log that looks like this:

   ```
   RollupDalParameters { number_of_slots: 32, attestation_lag: 4, slot_size: 65536, page_size: 4096 }
   Attested slot at index 10 for level 8455: [72, 101, 108, 108, 111, 44, 32, 119, 111, 114]
   See you in the next level
   ```

   You can verify your message by converting the bytes in the message back to the first 10 characters of the string "Hello, World!"

## Troubleshooting

If you don't see the message that the slot is attested and contains your data, try these things:

- If you see a message that says "A slot header for this slot was already proposed," another transaction tried to write to that slot in the same block, so you must try again.

- Make sure that the Smart Rollup and the DAL node are both using the slot that you published the commitment to:

   - In the file `lib/src.rs`, the line `const SLOT_TO_MONITOR: u8 = 13;` should use your slot.
   - When you run the command to start the DAL node, make sure that the `--producer-profiles` argument is set to your slot:

      ```bash
      octez-dal-node run --endpoint ${ENDPOINT} \
        --producer-profiles=10 --data-dir _dal_node
      ```
   - When you run the command to publish the commitment to the DAL, make sure that you publish it to your slot:

      ```bash
      octez-client --endpoint ${ENDPOINT} \
        publish dal commitment "${commitment}" from ${MY_ACCOUNT} for slot 10 \
        with proof "${proof}"
      ```

- Check the page at https://explorus.io/dal.
  If that page shows red (unattested) slots, it's possible that the attesters for the network are offline.
  You can also see the level that your commitment was published to in the result of the `octez-client publish dal commitment` command and check its status on https://explorus.io/dal.

## Publishing files

You can also send raw bytes to the DAL node with the header `Content-Type: application/octet-stream`.
In this case, you must prefix the data with its size due to limitations of the DAL.

1. Install the `jq` and `xxd` programs.
If you are using the Tezos Docker image, you can run `sudo apk add jq xxd`.

1. Create a file named `upload_file.sh` and add this code:

   ```bash
   #!/bin/sh

   path="${1}"
   alias="${2}"
   index="${3}"

   target="$(mktemp)"
   echo "storing temporary file at ${target}"
   file_size="$(cat "${path}" | wc -c)"
   slot_size_bin="$(printf "%08x" "${file_size}")"
   slot_contents="$(cat ${path} | xxd -p)"

   echo -n "${slot_size_bin}${slot_contents}" | xxd -p -r > "${target}"

   certificate="$(curl localhost:10732/slot --data-binary "@${target}" -H 'Content-Type: application/octet-stream')"

   echo "${certificate}"

   commitment="$(echo -n ${certificate} | jq '.commitment' -r)"
   proof="$(echo -n ${certificate} | jq '.commitment_proof' -r)"

   octez-client --endpoint ${ENDPOINT} \
       publish dal commitment "${commitment}" from "${alias}" \
       for slot "${index}" with proof "${proof}"

   rm "${target}"
   ```

   The script accepts three arguments: the file to send, the account alias to use and the slot index to use.
   This script also assumes that the `PATH` and `ENDPOINT` environment variables are correctly set.
   For example, if you create a file named `myFile.txt` and are using slot 10, you can run this command:

   ```bash
   ./upload_file.sh myFile.txt $MY_ACCOUNT 10
   ```

   If you run this script and see an error that says that the file was not found, update the first line of the script (the shebang) to the path to your shell interpreter.
   For example, if you are using the Tezos Docker image, the path is `/bin/sh`.

   If you see the error "Wrong value for command line option --endpoint," make sure that the `ENDPOINT` environment variable is set and then make it available to the script by running `export ENDPOINT=$ENDPOINT`.

   Again, by inspecting the kernel logs, you should be able to see that the file that you wanted to publish is indeed the one fetched by the Smart Rollup.

Now you can publish data to the DAL and use it in a Smart Rollup.
In the next section, you write to and retrieve the entire slot.
When you are ready, go to [Part 4: Using the entire slot](/tutorials/build-files-archive-with-dal/using-full-slot).
