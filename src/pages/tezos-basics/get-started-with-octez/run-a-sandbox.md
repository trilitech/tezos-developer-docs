---
sidebar_position: 3
hide_table_of_contents: true
title: "Run a Sandbox"
hide_title: true
proofread: true
---

## Use Docker and Flextesa to Run an Independent Tezos Sandbox

Running ephemeral and isolated sandboxes can be useful to experiment with faster networks or to automate reproducible tests.

Here we use [Flextesa](https://gitlab.com/tezos/flextesa) to run one or more Tezos nodes, bakers, and endorsers contained in a sandbox environment. The default sandbox is configured to be compatible with the `tezos-client` installed in the [“Client-setup”](https://assets.tqtezos.com/docs/setup/1-tezos-client) section.

### Dependencies

This example requires Docker, available for Linux, Mac, or Windows at [https://www.docker.com](https://www.docker.com/).

### Starting and Using a Sandbox

Start the sandbox _in the background_ \(will run with baking enabled\):

```text
docker run --rm --name my-sandbox --detach -p 20000:20000 \
       oxheadalpha/flextesa:20230502 mumbaibox start
```

After a few seconds, this should succeed:

```text
tezos-client config reset        # Cleans-up left-over configuration.
tezos-client --endpoint http://localhost:20000 bootstrapped
```

Configure the client to communicate with the sandbox:

```text
tezos-client --endpoint http://localhost:20000 config update
```

Then, instead of using a public faucet, you can just use tez by importing accounts already existing in the sandbox. They are visible with:

```text
 $ docker run --rm oxheadalpha/flextesa:20230502 mumbaibox info

Usable accounts:

- alice
  * edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn
  * tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
  * unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
- bob
  * edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4
  * tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6
  * unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt

Root path (logs, chain data, etc.): /tmp/mini-box (inside container).
```

You may then just import them:

```text
tezos-client import secret key alice unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq --force
tezos-client import secret key bob unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt --force
```

Check their balances:

```text
tezos-client get balance for alice
```

### Using The Sandbox

See also the [Tezos Client](https://assets.tqtezos.com/docs/setup/1-tezos-client) section or the [Wallet-usage](https://tezos.gitlab.io/introduction/howtouse.html#transfers-and-receipts) tutorial of the Tezos manual.

For instance, you can originate the most minimalistic [contract](https://gitlab.com/tezos/tezos/blob/mainnet/src/bin_client/test/contracts/attic/id.tz):

```text
# Download the contract:
wget https://gitlab.com/tezos/tezos/raw/mainnet/src/bin_client/test/contracts/attic/id.tz
# Run origination:
tezos-client originate contract hello-id transferring 0 from bob running id.tz --init "\"hello world\"" --burn-cap 1 --force
```

### Shutting Down The Sandbox

When you're done playing, just destroy the container:

```text
docker kill my-sandbox
```

### Advanced Usage

#### Tweak Protocol Constants

One can see the configuration of the protocol running in the sandbox with:

```text
tezos-client rpc get /chains/main/blocks/head/context/constants
```

One important field is `"time_between_blocks": [ "5" ],` which means that blocks are baked every 5 seconds \(as opposed to 60 seconds on mainnet\).

This constant can be configured with the `block_time` environment variable, see the example below:

```text
docker run --rm --name my-sandbox -e block_time=2 --detach -p 20000:20000 \
       oxheadalpha/flextesa:20230502 mumbaibox start
```

The above command runs a full sandbox with the Florence protocol and a faster time-between-blocks of 2 seconds.

Many other parameters are set by the `mumbaibox` [script](https://gitlab.com/tezos/flextesa/-/blob/master/src/scripts/tutorial-box.sh). All the configuration options available can be seen with the command:

```text
docker run --rm -it oxheadalpha/flextesa:20230502 flextesarl mini-net --help
```

#### Try The Nairobi Protocol

The Docker image also contains a `nairobibox` script:

```text
docker run --rm --name my-sandbox --detach -p 20000:20000 \
       oxheadalpha/flextesa:20230502 nairobibox start
```

You can then check that the protocol hash is `PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf`:

```text
 $ tezos-client rpc get /chains/main/blocks/head/metadata | grep protocol

{ "protocol": "PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf",
  "next_protocol": "PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf",
```

or that there are new constants like the one related to liquidity baking:

```text
 $ tezos-client rpc get /chains/main/blocks/head/context/constants | grep liquidity
  "liquidity_baking_subsidy": "2500000",
  "liquidity_baking_sunset_level": 525600,
  "liquidity_baking_escape_ema_threshold": 1000000 }
```

### Further Reading

For more issues or questions, see the [Flextesa](https://gitlab.com/tezos/flextesa) repository, and for even more advanced usage, see the [documentation](https://tezos.gitlab.io/flextesa/) \(esp. for the [`mini-net` command](https://tezos.gitlab.io/flextesa/mini-net.html)\).

