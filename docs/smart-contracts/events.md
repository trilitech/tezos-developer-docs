---
title: Events
authors: Tim McMackin
last_update:
  date: 10 January 2024
---

Events are a type of internal operation on Tezos.
Smart contracts emit events and off-chain applications can listen for events to know when things happen on the chain.

## Event data

An event includes data about the call to the smart contract that triggered the event, including the hash of that operation and the level of the block that included the operation.

The event can also include these optional fields:

- A tag that can identify the type of event or help clients filter the stream of events.
- A payload of data in Michelson format
- The Michelson data type of the payload

## Emitting events

Each high-level language has its own way of creating events.
The compiled Michelson code uses the `EMIT` command to emit the event.

For example, this contract stores a number and emits events when that amount changes:

JsLIGO

```ligolang
type storage = int;

@entry
const add = (addAmount: int, s: storage): [list<operation>, storage] =>
    [list([Tezos.emit("%add",{ source: Tezos.get_source(), addAmount: addAmount })]),
     s + addAmount
    ];

@entry
const reset = (_: unit, s: storage): [list<operation>, storage] =>
    [list([Tezos.emit("%reset",{ source: Tezos.get_source(), previousValue: s })]),
     0
    ];
```

SmartPy

```python
import smartpy as sp

@sp.module
def main():
    class Events(sp.Contract):
        def __init__(self, value):
            self.data.storedValue = value

        @sp.entrypoint
        def add(self, addAmount):
            sp.emit(sp.record(
                source=sp.source,
                addAmount=addAmount
            ), tag="add", with_type=True)
            self.data.storedValue += addAmount

        @sp.entrypoint
        def reset(self):
            sp.emit(sp.record(
                source=sp.source,
                previousValue=self.data.storedValue
            ), tag="reset", with_type=True)
            self.data.storedValue = 0

if "templates" not in __name__:

    @sp.add_test()
    def test():
        c1 = main.Events(12)
        scenario = sp.test_scenario("Events", main)
        scenario.h1("Add")
        scenario += c1
        c1.add(2).run(
            sender = sp.test_account("Alice")
        )
        scenario.verify(c1.data.storedValue == 14)
```

When a client calls the `reset` entrypoint, it emits an event that is tagged with "reset" and includes the address that called the entrypoint and the amount that the storage was before it was reset to 0.

## Responding to events

Smart contracts cannot respond to events.

Off-chain applications can listen for and respond to events by monitoring the event operations in blocks.

For example, Taquito includes tools to listen for and respond to events.
For example, this code listens for events from the contract with the address `contractAddress` and the tag `tagName`:

```javascript
const Tezos = new TezosToolkit(rpcUrl);

Tezos.setStreamProvider(
  Tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true,
    pollingIntervalMilliseconds: 1500,
  })
);

try {
  const sub = Tezos.stream.subscribeEvent({
    tag: tagName,
    address: contractAddress,
  });

  sub.on('data', console.log);
} catch (e) {
  console.log(e);
}
```

Both the `tag` and `address` parameters are optional in the `subscribeEvent` function, but most clients are interested in events from a specific contract address or tag.

The event data is in Michelson format, so an event from the `reset` entrypoint of the previous example contract might look like this:

```json
{
  "opHash": "onw8EwWVnZbx2yBHhL72ECRdCPBbw7z1d5hVCJxp7vzihVELM2m",
  "blockHash": "BM1avumf2rXSFYKf4JS7YJePAL3gutRJwmazvqcSAoaqVBPAmTf",
  "level": 4908983,
  "kind": "event",
  "source": "KT1AJ6EjaJHmH6WiExCGc3PgHo3JB5hBMhEx",
  "nonce": 0,
  "type": {
    "prim": "pair",
    "args": [
      {
        "prim": "int",
        "annots": ["%previousValue"]
      },
      {
        "prim": "address",
        "annots": ["%source"]
      }
    ]
  },
  "tag": "reset",
  "payload": {
    "prim": "Pair",
    "args": [
      {
        "int": "17"
      },
      {
        "bytes": "000032041dca76bac940b478aae673e362bd15847ed8"
      }
    ]
  },
  "result": {
    "status": "applied",
    "consumed_milligas": "100000"
  }
}
```

Note that the address field is returned as a byte value.
To convert the bytes to an address, use the `encodePubKey` function in `@taquito/utils`.

<!-- I reported this to the Taquito people and they are asking the core team if the RPC node could return the address as an address instead of as bytes. -->

You can see the complete content of the event operation by looking up the operation hash in a block explorer.
For example, to see the operation in the previous example, look up the operation `onw8EwWVnZbx2yBHhL72ECRdCPBbw7z1d5hVCJxp7vzihVELM2m`.

## Implementation details

- Michelson: [Contract events](https://tezos.gitlab.io/alpha/event.html)
- LIGO: [Events](https://ligolang.org/docs/contract/events)
- SmartPy: [`sp.emit`](https://smartpy.io/manual/syntax/operations#sp.emit)
- Archetype: [Events](https://archetype-lang.org/blog/events/#event)
- Taquito: [Contract Events](https://tezostaquito.io/docs/subscribe_event)
