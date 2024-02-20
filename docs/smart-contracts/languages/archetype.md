---
title: Archetype
last_update:
  date: 29 June 2023
---

```archetype

// commment


archetype raffle(
  owner        : address,
  jackpot      : tez,
  ticket_price : tez
)

constant EXISTS_NOT_REVEALED     : string = "EXISTS_NOT_REVEALED"
constant INTERNAL_ERROR          : string = "INTERNAL_ERROR"
constant INVALID_AMOUNT          : string = "INVALID_AMOUNT"
constant INVALID_CHEST_KEY       : string = "INVALID_CHEST_KEY"
constant INVALID_OPEN_CLOSE_BUY  : string = "INVALID_OPEN_CLOSE_BUY"
constant INVALID_REVEAL_FEE      : string = "INVALID_REVEAL_FEE"
constant INVALID_TICKET_PRICE    : string = "INVALID_TICKET_PRICE"
constant PLAYER_ALREADY_REVEALED : string = "PLAYER_ALREADY_REVEALED"
constant PLAYER_NOT_FOUND        : string = "PLAYER_NOT_FOUND"
constant RAFFLE_CLOSED           : string = "RAFFLE_CLOSED"
constant RAFFLE_OPEN             : string = "RAFFLE_OPEN"
constant SETTINGS_NOT_INITIALIZED: string = "SETTINGS_NOT_INITIALIZED"

record r_settings {
  open_buy   : date;
  close_buy  : date;
  chest_time : nat;
  reveal_fee : rational;
}
variable o_settings : option<r_settings> = none

asset player {
  id                 : address;
  locked_raffle_key  : chest;
  revealed           : bool = false;
}

variable raffle_key  : nat = 0

states =
| Created initial
| Initialised
| Transferred

transition initialise(ob : date, cb : date, t : nat, rf : rational) {
  called by owner
  require {
    r0 : now <= ob < cb         otherwise INVALID_OPEN_CLOSE_BUY;
    r1 : rf <= 1                otherwise INVALID_REVEAL_FEE;
    r2 : transferred = jackpot  otherwise INVALID_AMOUNT
  }
  from Created to Initialised
  with effect {
    o_settings := some({open_buy = ob; close_buy = cb; chest_time = t; reveal_fee = rf})
  }
}

entry buy (lrk : chest) {
  state is Initialised
  constant {
    settings ?is o_settings otherwise SETTINGS_NOT_INITIALIZED;
  }
  require {
    r3 : transferred = ticket_price                   otherwise INVALID_TICKET_PRICE;
    r4 : settings.open_buy < now < settings.close_buy otherwise RAFFLE_CLOSED
  }
  effect { player.add({ id = caller; locked_raffle_key = lrk }) }
}

entry reveal(addr : address, k : chest_key) {
  state is Initialised
  constant {
    settings ?is o_settings otherwise SETTINGS_NOT_INITIALIZED;
    value_player ?is player[addr] otherwise PLAYER_NOT_FOUND;
  }
  require {
    r5 : settings.close_buy < now   otherwise RAFFLE_OPEN;
    r6 : not value_player.revealed  otherwise PLAYER_ALREADY_REVEALED
  }
  effect {
    match open_chest(k, value_player.locked_raffle_key, settings.chest_time) with
    | some (unlocked) -> begin
        match unpack<nat>(unlocked) with
        | some(partial_key) ->
          raffle_key += partial_key;
          player[addr].revealed := true
        | none -> player.remove(addr)
        end
      end
    | none -> fail(INVALID_CHEST_KEY)
    end;
    transfer (settings.reveal_fee * ticket_price) to caller;
  }
}

transition %transfer() {
  require {
    r7: player.select(the.revealed).count() = player.count() otherwise EXISTS_NOT_REVEALED
  }
  from Initialised to Transferred
  with effect {
    const dest ?= player.nth(raffle_key % player.count()) : INTERNAL_ERROR;
    transfer balance to dest;
  }
}
```

Archetype is an elegant generic-purpose language to develop smart contracts on the Tezos blockchain. It's a DSL (domain-specific language) for Tezos that facilitates formal verification and transcodes contracts to SmartPy and LIGO.

It supports all [Michelson](https://tezos.gitlab.io/michelson-reference/) features but also provides exclusive high-level features for a precise and concise source code, that make contracts easier to develop, read and maintain.

## Looking at a simple Archetype contract

Create a file `hello.arl`

```
archetype hello

variable msg : string = "Hello"

entry input(name : string) {
  msg += (length(msg) > 5 ? "," : "") + " " + name
}
```

The contract starts with the `archetype` keyword followed by a contract identifier.

For example:
```
archetype escrow

/* ... */
```

### Parameters

A contract may have parameters. A parameter value is not in the source code and is provided at deployment (origination) time. For example, the address of the contract owner is typically a contract parameter.

By default, a contract parameter is an element of the contract storage. It is defined by an identifier and a type. The list of parameters follows the contract's identifier between parenthesis and the parameters are separated by commas.

For example:
```
archetype escrow(seller : address, buyer : address)

/* ... */
```

The `seller` and `buyer` [addresses](https://archetype-lang.org/docs/reference/types/#address) then need to be set at deployment time.

## Deploy a contract with Completium:

The Completium CLI is the command line utility to install Archetype compiler and manage contracts (deploy, call).

To install and initialize Completium do:
```
$ npm install -g @completium/completium-cli
$ completium-cli init
```

Then you can deploy the contract with

```
completium-cli deploy hello.arl
```

Call contract's entrypoint `input` with argument "Archetype":

```
completium-cli call hello --entry input --arg '{ "name": "Archetype" }'
```

## Further reading

* [Archetype documentation](https://archetype-lang.org/docs/introduction)
* [OpenTezos](https://opentezos.com/archetype)
* [Medium article](https://medium.com/coinmonks/archetype-a-dsl-for-tezos-6f55c92d1035%20)
* [How To Verify a smart contract with Archetype](https://medium.com/coinmonks/verify-a-smart-contract-with-archetype-6e0ea548e2da%20)
