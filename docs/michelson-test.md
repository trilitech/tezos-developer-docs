---
title: Michelson syntax highlighting testing
---

These are some examples of Michelson to show how the syntax highlighter works.

## Version A: [Matching Octez docs](https://tezos.gitlab.io/alpha/michelson.html)

```michelsona
{ parameter (or (unit %reset) (or (mutez %decrement) (mutez %increment))) ;
  storage mutez ; # this is a comment
  code { UNPAIR ;
         IF_LEFT
           { DROP 2 ; PUSH mutez 0 }
           { IF_LEFT {  SWAP ; SUB  } { ADD } } ;
         NIL operation ;
         PAIR } }
```

For reference, here's what Michelson looks like in the Octez docs:

![](/img/octez-doc-michelson-formatting.png)

## Version B: Red instruction names

```michelsonb
{ parameter (or (unit %reset) (or (mutez %decrement) (mutez %increment))) ;
  storage mutez ; # this is a comment
  code { UNPAIR ;
         IF_LEFT
           { DROP 2 ; PUSH mutez 0 }
           { IF_LEFT {  SWAP ; SUB  } { ADD } } ;
         NIL operation ;
         PAIR } }
```

## Version C: Blue-red scheme

```michelsonc
{ parameter (or (unit %reset) (or (mutez %decrement) (mutez %increment))) ;
  storage mutez ; # this is a comment
  code { UNPAIR ;
         IF_LEFT
           { DROP 2 ; PUSH mutez 0 }
           { IF_LEFT {  SWAP ; SUB  } { ADD } } ;
         NIL operation ;
         PAIR } }
```