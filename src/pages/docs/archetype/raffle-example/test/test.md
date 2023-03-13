---
id: unit-test
title: Testing
authors: Benoit Rognier
---

This section presents the testing of the raffle contract.

:::info
The code source of the raffle contract and the test scenario are available in this [repository](https://gitlab.com/completium/archetype-raffle).
:::

## Test scenario

The first time, run the following command to install the [Completium](https://completium.com/docs/cli/jslibrary) and [mocha](https://www.npmjs.com/package/mocha) libraries:

```bash
npm i
```

Run the test with:

```bash
npm test
```

The test scenario is made of 14 steps. Below is the trace returned by the command above:
```bash

  Deploy
    ✔ Raffle

  Open Raffle
    ✔ The unauthorized user Alice unsuccessfully calls 'initialise' entrypoint.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint with wrong 'close_buy'.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint with wrong 'reveal_fee'.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint by sending not enough tez to the contract.
    ✔ Owner successfully calls 'initialise' entrypoint.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint because a raffle is already initialised.

  Test 'buy' entrypoint (at this point a raffle is open)
    ✔ Alice unsuccessfully calls 'buy' by sending a wrong amount of tez.
    ✔ Alice unsuccessfully calls 'buy' entrypoint because raffle is closed.
    ✔ Alice successfully calls 'buy' entrypoint.
    ✔ Alice unsuccessfully calls 'buy' entrypoint because she has already bought one.
    ✔ Jack successfully calls 'buy' entrypoint.
    ✔ Bob successfully calls 'buy' entrypoint.

  Players reveal their raffle key (at this point a raffle is open and two players participated)
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because it is before the 'close_date'.
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because of an invalid chest key.
    ✔ Alice successfully calls 'reveal' entrypoint and gets the reveal fee.
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because her raffle key is already revealed.
    ✔ Jack successfully calls 'reveal' entrypoint and gets the reveal fee.

  Test 'transfer' entrypoint
    ✔ Owner unsucessfully calls 'transfer' entrypoint because Bob is not revealed.
    ✔ Owner sucessfully calls 'reveal' entrypoint to remove Bob's chest, and gets the unlock reward.
    ✔ Owner sucessfully calls 'transfer' entrypoint to send the jackpot to Jack.


  21 passing (48s)
```

## Mockup mode

The Completium library allows running contracts on any network (mainnet, testnet, sandbox) but also in mockup mode.

Mockup mode runs contracts locally and quickly, so it is suitable for testing contracts. The following JS instruction activates the mockup mode within the test script:
```js
setEndpoint('mockup')
```

## Accounts

The mockup mode comes with a set of preconfigured test accounts. You can add any test account with the `import faucet` or `generate` CLI command.

Declare handlers to the required test accounts:

```js
const alice = getAccount('alice');
const owner = getAccount('bootstrap1');
const jack  = getAccount('bootstrap2');
const bob   = getAccount('bootstrap3');
```

## Mockup time

Use the `setMockupNow` function to set the contract 'now' value:

```js
const now = Math.floor(Date.now() / 1000)
setMockupNow(now)
```

## Raffle key chest
In this tutorial example, the _chest time_ parameter imposed by the contract is `10000000`.

:::warning
Note that it's probably *not* a decent _chest time_ value since it takes only 20s to break on a standard computer ...
:::

### Generate chest value
Player Alice's partial key is `123456`, Player Jack's is `234567`, and Player Bob is `345678`.

To get the timelocked value, the value is first packed (turned into bytes) with the following octez client command `hash data`:
```bash
$ octez-client -E https://hangzhounet.smartpy.io hash data '123456' of type nat
Warning:

                 This is NOT the Tezos Mainnet.

           Do NOT use your fundraiser keys on this network.

Raw packed data: 0x050080890f
```

We then use the Completium [timelock-utils](https://github.com/completium/timelock-utils) tool to timelock the packed data:
```bash
$ time ./timelock-utils --lock --data 050080890f --time 10000000
{
  "chest":
    "c5ecdde89eb8c1e7aaeb85abb8f5e5cef3b4fa80c4aee2fccbf0a78ce0debaa5e9ddede3ddfbd9abdea28cc7dc99e6d3a9baf3cbae9adaaabc89cbc39e97e2c7a6cba99197d19ba09ddfd181afc997ffbcc5acb2d29ecbb698c2cacbdd83d1b4ced0bffe9cd78295b3fba4d9f9d5f4d4ec9ad3c7e1a8eeb9dba5cbd8a2dbf29af8e4a4c1e4b1edacf98fccefaef9fea4f0bacdd38ecbfe81c3f9839b9e9ab8fbf5f1eabac48a9f8ca7c588eefe94d1f18bd9bcee9aecde8dd285cf9098f4e1a7eec787f3a0e0ff9cd0ce8ec5a2a4e5ecb08fce899eb5baa397fabf90de9397cebc81bbdfb386e6b4da9fd8fdd19ed9f8d684c782b0aacfeebae4f6e7d1c5c1e6a093c68081cf83b991b4ecd7b38aee92deddcad79eb9abe0a0a0c6b5909dc58495f69445fff5ae9cefe8b8beb2fb86ccf5c9ad91989bdad8a3cfbedaffa2de8bf19dc6ac8cbc8a9584fa9f85f9ba958fc6bbc09ac8e7d5f0fdb98b86c1c7d59ad7c6dfc2d2cefaf5d9db909bf0e3acd3ccc792bc9bccbab4a4febda9b685dbc39ea2a4a7b69990d3abd8b9b3d7dbc581b984f3e08a98f7f7f0e697cc8dfd88edc8c3ca8dc3b2a9ccf6cdd6d0efcc848bc8ead5858bbabfcfc1c8ecea84fd9b96a5e4eabb8c918dafe6f78d83e8e1c2e5f8ee88a4ee8dcaeeafffebfcbbfda1e9eb86c582f2eedd9299cbc0a7fce083ced8c8ddb0e7eaacb696c1fccdadcdc8e3c6f7b9de84eece9bb7919094fef4fdf6efd8b1ba8bbecb9380add4f59ddbf9a19f95facc84e9d0a99bfa93f1fcc3a0fbde9b9ce0c7e8dec6e8d1dfa7dda6f490bb9580abfdbcc0e202e5ff731c3c17d080ee430edd30979a47aa653656e11e593800000015c2ca2a23b732a72932611618ad9ea324986377591e"
  "key":
    "94a4f28fcdc3ece3e1ddcbe0f3e1ebb3f3e19daaa286c09986efd1b787b7a0d9bef2dfc8c4a8e2ebf3f8e3bdcaa998c9a3fe9c8a97f7b4ccedcd87b39fe39585898feab5e49fd095beb4f5d6e897d6fba08c9e9bfa8b9de7f5c7a686c0838ce5bfa985d6db86b4c2c4acc2facd9ea6a6c9ecd18c89b3acd79897e5fbc8d2e7feacd08ca1ec9beed2c7c8f3d3b9c0f9a2b1ccc782fda5c282abe9dfac9686e8bde2d0c6e1d8d68b8cd79dfc98a9b79bf5ecaccfd8ced1bae0caa5e5e286fbe2fba7968dcad0d5db95c1f1908288bb849ca9d78fd0eeeabec38ff4b5d4b6b9b6e7fcb2d789e498e8dbd8ceebc4d7cecb9ca8afc1ede6fc87e199dfe6a887e5c7a094af8dafdebef2f8db8ccc95f29fc4f0daa8e0b8bbaf9afc9befa6b5fbbacecec88fe69302a4c79db7b58c9c9a989799e2b7fee8c4f583f785fddcf9e7b1b9f3c5e0beb6aba48180a9c2b1fdbdebeeaff3b68af882ebf08885bfc8dfb0a7af84e4d091f4b492dbeec9b5b9ff8ae8daee80ffa1b3948fe598d7d2a0e19fa98192a4c5a1d9f5a3cf93ded78a858d9cab86939dd0abfed1adcec7fabf9ed38edba08f80c8b1f9fffbb78fa8e8bcb79f89afa2bcc4fb91d5b9988fccd998cbcb849eccf893f49cad9ec4dfdaaab0d1a1e3abc3c187fddab8f1a49cea96f7efb1f1dec9988895c6fcb9aa8ba4dca59bb08089b6d396b4a7e883eccab2928cb5d3c5cfacabd0d2d19dfab3aee49cd7c0e38fa2b3b0f2acb0cac5a0d8b8d381c3ee88ebdce6eeaffaf3acf29eb8fae6f3e2e7d8f6fdb9c8dafe929bcfcee3add3c4efdcb88eefebfebfe3e1bd02"
}
./timelock-utils --lock --data 050080890f --time 10000000  0.10s user 0.02s system 97% cpu 0.126 total
```
The timelock encryption generates a chest value, and the key to unlock it.

:::info
In the test scenario, Bob generates the chest value with the wrong time value `10000001`. As a result, the call to `reveal`  removes Bob as a player.
:::
### Crack chest

The following command is used to compute the chest key (ie. crack chest):
```bash
$ time ./timelock-utils --create-chest-key --chest c5ecdde89eb8c1e7aaeb85abb8f5e5cef3b4fa80c4aee2fccbf0a78ce0debaa5e9ddede3ddfbd9abdea28cc7dc99e6d3a9baf3cbae9adaaabc89cbc39e97e2c7a6cba99197d19ba09ddfd181afc997ffbcc5acb2d29ecbb698c2cacbdd83d1b4ced0bffe9cd78295b3fba4d9f9d5f4d4ec9ad3c7e1a8eeb9dba5cbd8a2dbf29af8e4a4c1e4b1edacf98fccefaef9fea4f0bacdd38ecbfe81c3f9839b9e9ab8fbf5f1eabac48a9f8ca7c588eefe94d1f18bd9bcee9aecde8dd285cf9098f4e1a7eec787f3a0e0ff9cd0ce8ec5a2a4e5ecb08fce899eb5baa397fabf90de9397cebc81bbdfb386e6b4da9fd8fdd19ed9f8d684c782b0aacfeebae4f6e7d1c5c1e6a093c68081cf83b991b4ecd7b38aee92deddcad79eb9abe0a0a0c6b5909dc58495f69445fff5ae9cefe8b8beb2fb86ccf5c9ad91989bdad8a3cfbedaffa2de8bf19dc6ac8cbc8a9584fa9f85f9ba958fc6bbc09ac8e7d5f0fdb98b86c1c7d59ad7c6dfc2d2cefaf5d9db909bf0e3acd3ccc792bc9bccbab4a4febda9b685dbc39ea2a4a7b69990d3abd8b9b3d7dbc581b984f3e08a98f7f7f0e697cc8dfd88edc8c3ca8dc3b2a9ccf6cdd6d0efcc848bc8ead5858bbabfcfc1c8ecea84fd9b96a5e4eabb8c918dafe6f78d83e8e1c2e5f8ee88a4ee8dcaeeafffebfcbbfda1e9eb86c582f2eedd9299cbc0a7fce083ced8c8ddb0e7eaacb696c1fccdadcdc8e3c6f7b9de84eece9bb7919094fef4fdf6efd8b1ba8bbecb9380add4f59ddbf9a19f95facc84e9d0a99bfa93f1fcc3a0fbde9b9ce0c7e8dec6e8d1dfa7dda6f490bb9580abfdbcc0e202e5ff731c3c17d080ee430edd30979a47aa653656e11e593800000015c2ca2a23b732a72932611618ad9ea324986377591e --time 10000000
94a4f28fcdc3ece3e1ddcbe0f3e1ebb3f3e19daaa286c09986efd1b787b7a0d9bef2dfc8c4a8e2ebf3f8e3bdcaa998c9a3fe9c8a97f7b4ccedcd87b39fe39585898feab5e49fd095beb4f5d6e897d6fba08c9e9bfa8b9de7f5c7a686c0838ce5bfa985d6db86b4c2c4acc2facd9ea6a6c9ecd18c89b3acd79897e5fbc8d2e7feacd08ca1ec9beed2c7c8f3d3b9c0f9a2b1ccc782fda5c282abe9dfac9686e8bde2d0c6e1d8d68b8cd79dfc98a9b79bf5ecaccfd8ced1bae0caa5e5e286fbe2fba7968dcad0d5db95c1f1908288bb849ca9d78fd0eeeabec38ff4b5d4b6b9b6e7fcb2d789e498e8dbd8ceebc4d7cecb9ca8afc1ede6fc87e199dfe6a887e5c7a094af8dafdebef2f8db8ccc95f29fc4f0daa8e0b8bbaf9afc9befa6b5fbbacecec88fe69302a4c79db7b58c9c9a989799e2b7fee8c4f583f785fddcf9e7b1b9f3c5e0beb6aba48180a9c2b1fdbdebeeaff3b68af882ebf08885bfc8dfb0a7af84e4d091f4b492dbeec9b5b9ff8ae8daee80ffa1b3948fe598d7d2a0e19fa98192a4c5a1d9f5a3cf93ded78a858d9cab86939dd0abfed1adcec7fabf9ed38edba08f80c8b1f9fffbb78fa8e8bcb79f89afa2bcc4fb91d5b9988fccd998cbcb849eccf893f49cad9ec4dfdaaab0d1a1e3abc3c187fddab8f1a49cea96f7efb1f1dec9988895c6fcb9aa8ba4dca59bb08089b6d396b4a7e883eccab2928cb5d3c5cfacabd0d2d19dfab3aee49cd7c0e38fa2b3b0f2acb0cac5a0d8b8d381c3ee88ebdce6eeaffaf3acf29eb8fae6f3e2e7d8f6fdb9c8dafe929bcfcee3add3c4efdcb88eefebfebfe3e1bd02
./timelock-utils --create-chest-key --chest  --time 10000000  19.45s user 0.03s system 99% cpu 19.491 total
```

## Test script

### Deploy contract

Use the `deploy` function to deploy the raffle contract.

```js
let raffle;
[raffle, _] = await deploy('./contract/raffle.arl', {
    parameters: {
        owner        : owner.pkh,
        jackpot      : JACKPOT,
        ticket_price : TICKET_PRICE,
    },
    as: owner.pkh
});
```

### Call an entrypoint

The `raffle` contract object provides the entrypoints as object methods.

```js
await raffle.initialise({
    arg    : {
      ob : OPEN_BUY,
      cb : CLOSE_BUY,
      cr : CLOSE_REVEAL,
      t  : CHEST_TIME,
      rf : REVEAL_FEE
    },
    as     : owner.pkh,
    amount : JACKPOT
})
```

### Expect to fail

Use the `expectToThrow` function to assert that the contract fails with a specified error value.

```js
it("Alice unsuccessfully calls 'buy' by sending a wrong amount of tez.", async () => {
    await expectToThrow(async () => {
      await raffle.buy({
        arg : {
          lrk  : ALICE_CHEST
        }
        as : alice.pkh
      })
    }, errors.INVALID_TICKET_PRICE)
});
```

### Check Balance

Use the `checkBalanceDelta` method to check the impact of an operation on an account balance.

```js
await checkBalanceDelta(owner.pkh,  0, async () => {
await checkBalanceDelta(alice.pkh,  1, async () => {
await checkBalanceDelta(jack.pkh,   0, async () => {
    await raffle.reveal({
        arg : { k : ALICE_CHEST_KEY },
        as : alice.pkh
    })
}) }) })
```
