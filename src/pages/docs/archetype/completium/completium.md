---
id: completium
title: Completium
authors: Benoit Rognier
---

## CLI

The Archetype compiler comes with the [Completium CLI](https://completium.com/docs/cli). You can deploy and interact with Archetype contracts from the command line.

### Install

The CLI is distributed as a npm package:

```bash
npm i -g @completium/completium-cli
completium-cli init
```

### Generate an address

The following command generates an address aliased as alice:

```bash
completium-cli generate account as alice
```

You can then fund it on a testnest by following [teztnets.xyz](https://teztnets.xyz/).

### Deploy and call contract

For example, the following command deploys the _escrow.arl_ contract:

```bash
completium-cli deploy escrow.arl --as alice
```

The following command calls the _init_ entrypoint:

```bash
completium-cli call escrow --entry init --amount 5tz --as alice
```

## JS library

The [Completium JS library](https://completium.com/docs/cli) makes it easy to interact with smart contracts from a JS script.

It is used to develop test scenarios that make sure the contract behaves as intended.

### Example

```js
const { deploy, getBalance, checkBalanceDelta } = require('@completium/completium-cli')

const test = async () => {
  // Scenario
  var [escrow, _] = await deploy('escrow.arl')

  checkBalanceDelta(alice, 0, async () => {
    await escrow.init({ amount: '5tz' }, { as: alice })
    await escrow.inc_value({ as: alice })
    await escrow.inc_value({ as: alice })
    await escrow.complete({ as: alice })
  })
}

test()
```

Learn more about Completium's [JS API](https://completium.com/docs/cli/jslibrary).
