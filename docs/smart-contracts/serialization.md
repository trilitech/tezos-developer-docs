---
title: Serialization
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 17 April 2024
---

Between contract calls, the code of a contract, as well as its storage, are stored as a serialized sequence of bytes, for efficiency purposes.
Every time the contract is called, the serialized code and storage are deserialized, unless the deserialized version is still cached.
Similarly, after the execution of the contract, the storage needs to be serialized to be stored again as a sequence of bytes.

This takes CPU time, which means that when you call an entrypoint, on top of paying for the gas for the execution of the code of the entrypoint itself, you also need to pay for this serialization/deserialization.
The cost to call a very simple entrypoint may get large if there is a lot of data in its storage.

Remember that unlike the rest of the storage, `big-maps` are not entirely serialized/deserialized for each call.
Instead, only the values that are read are deserialized, and only the values that are added or updated are serialized.
This makes using `big-maps` more efficient in these cases.

## PACK and UNPACK

Tezos provides the ability to serialize and deserialize data or code yourself:

- The `PACK` instruction takes a value of (almost) any type, and serializes it into a `bytes` value.
- The `UNPACK` instruction takes a `bytes` value, and deserializes it into its original value.
As the deserialization may be impossible if the sequence of bytes doesn't represent valid serialized data, it returns an option type.

Serializing your own data in this way may be useful if you want to apply operations that are only available on `bytes` values.
For example, you may want to compute the hash of some data.
You can do so by packing it first and then applying a hash function such as `BLAKE2B` on the resulting `bytes` value.

## Formatting

The Tezos `PACK` instruction prepends this metadata to the serialized value:

1. One byte to indicate the data format, usually `05` to indicate a Micheline value.
1. One byte to indicate the data type, such as string, int, nat, or address.
1. Four bytes to indicate the length of the data in bytes.

The rest of the serialized value is the original value converted to hexadecimal.

This metadata allows Tezos to compress data such as addresses into fewer bytes than ordinary byte-encoded strings.
For example, if you pack the address `tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx`, the resulting bytes are `0x050a00000016000032041dca76bac940b478aae673e362bd15847ed8`, but if you pack the string value `tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx`, the resulting bytes are longer: `0x050100000024747a3151435651696e453869566a31483266636b7178366f694d3835434e4a534b395378`.

Because of this metadata, you can't use other byte serialization functions to pack and unpack data on Tezos.
Many Tezos tools include functions to pack and unpack data, including LIGO, SmartPy, and the Octez client.

For example, to pack the address `tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx` with the Octez-client, run this command:

```bash
octez-client hash data '"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx"' of type "address"
```

To unpack the resulting bytes, use the `unpack michelson data` command to remove the metadata and then the `normalize data` command to get the original value, as in this example:

```bash
BYTES=$(octez-client unpack michelson data "0x050a00000016000032041dca76bac940b478aae673e362bd15847ed8")
octez-client normalize data "$BYTES" of type "address"
```

For more information about the format that Tezos uses to pack and unpack data, install the `octez-codec` program and run this command:

```bash
octez-codec describe alpha.script.expr binary schema
```

## Implementation details

- LIGO: [Pack and Unpack](https://ligolang.org/docs/language-basics/tezos-specific#pack-and-unpack)
- SmartPy: [Packing and Unpacking](https://smartpy.io/manual/syntax/strings-and-bytes#packing-and-unpacking)
- Archetype: [pack](https://archetype-lang.org/docs/reference/expressions/builtins#pack%28o%20:%20T%29), [unpack](https://archetype-lang.org/docs/reference/expressions/builtins#unpack%3CT%3E%28b%20:%20bytes%29)
