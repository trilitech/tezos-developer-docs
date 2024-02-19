---
title: Michelson syntax highlighting testing
---

These are some examples of Michelson to show how the syntax highlighter works.



```michelson
(list %update_operators (or
  (pair %add_operator (address %owner)
    (pair (address %operator)
          (nat %token_id)))
  (pair %remove_operator (address %owner)
    (pair
      (address %operator)
      (nat %token_id)))))
```

```michelson
{ parameter (or (unit %reset) (or (mutez %decrement) (mutez %increment))) ;
  storage mutez ;
  code { UNPAIR ;
         IF_LEFT
           { DROP 2 ; PUSH mutez 0 }
           { IF_LEFT {  SWAP ; SUB  } { ADD } } ;
         NIL operation ;
         PAIR } }
```

```michelson
parameter (unit %open_raffle);
storage   unit;
code
  {
    CDR;        # @storage
    # == open_raffle == # @storage
    NIL operation; # list operation : @storage
    PAIR;       # pair (list operation) @storage
  };
```

```michelson
(Pair 5 "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx" "hello")
```

Contract generated from SmartPy:

```michelson
parameter (pair %assign_larger (int %a) (int %b));
storage   int;
code
  {
    CAR;        # @parameter
    # == assign_larger ==
    # if a > b: # @parameter
    DUP;        # @parameter : @parameter
    CDR;        # int : @parameter
    DUP 2;      # @parameter : int : @parameter
    CAR;        # int : int : @parameter
    COMPARE;    # int : @parameter
    GT;         # bool : @parameter
    IF
      {
        # self.data.myval = a # @parameter
        CAR;        # int
      }
      {
        # self.data.myval = b # @parameter
        CDR;        # int
      }; # int
    NIL operation; # list operation : int
    PAIR;       # pair (list operation) int
  };
view
  "get_larger" (pair (int %a) (int %b)) int
  {
    CAR;        # @parameter
    # if a > b: # @parameter
    DUP;        # @parameter : @parameter
    CDR;        # int : @parameter
    DUP 2;      # @parameter : int : @parameter
    CAR;        # int : int : @parameter
    COMPARE;    # int : @parameter
    GT;         # bool : @parameter
    IF
      {
        # return a # @parameter
        CAR;        # int
      }
      {
        # return b # @parameter
        CDR;        # int
      }; # int
  };
```

From https://tezos.gitlab.io/alpha/michelson.html

```michelson
{ parameter int;
  storage int;
  code { CAR ;
         LAMBDA_REC  int int
                     { DUP;
                       EQ;
                       IF { PUSH int 1 }
                          { DUP;
                            DUP 3;
                            PUSH int 1;
                            DUP 4;
                            SUB;
                            EXEC;
                            MUL};
                       DIP { DROP 2 }};
         SWAP;
         EXEC;
         NIL operation;
         PAIR}}
```

```michelson
parameter (pair
             (pair :payload
                (nat %counter) # counter, used to prevent replay attacks
                (or :action    # payload to sign, represents the requested action
                   (pair :transfer    # transfer tokens
                      (mutez %amount) # amount to transfer
                      (contract %dest unit)) # destination to transfer to
                   (or
                      (option %delegate key_hash) # change the delegate to this address
                      (pair %change_keys          # change the keys controlling the multisig
                         (nat %threshold)         # new threshold
                         (list %keys key)))))     # new list of keys
             (list %sigs (option signature)));    # signatures

storage (pair (nat %stored_counter) (pair (nat %threshold) (list %keys key))) ;

code
  {
    UNPAIR ; SWAP ; DUP ; DIP { SWAP } ;
    DIP
      {
        UNPAIR ;
        # pair the payload with the current contract address, to ensure signatures
        # can't be replayed across different contracts if a key is reused.
        DUP ; SELF ; ADDRESS ; CHAIN_ID ; PAIR ; PAIR ;
        PACK ; # form the binary payload that we expect to be signed
        DIP { UNPAIR @counter ; DIP { SWAP } } ; SWAP
      } ;

    # Check that the counters match
    UNPAIR @stored_counter; DIP { SWAP };
    ASSERT_CMPEQ ;

    # Compute the number of valid signatures
    DIP { SWAP } ; UNPAIR @threshold @keys;
    DIP
      {
        # Running count of valid signatures
        PUSH @valid nat 0; SWAP ;
        ITER
          {
            DIP { SWAP } ; SWAP ;
            IF_CONS
              {
                IF_SOME
                  { SWAP ;
                    DIP
                      {
                        SWAP ; DIIP { DIP { DUP } ; SWAP } ;
                        # Checks signatures, fails if invalid
                        CHECK_SIGNATURE ; ASSERT ;
                        PUSH nat 1 ; ADD @valid } }
                  { SWAP ; DROP }
              }
              {
                # There were fewer signatures in the list
                # than keys. Not all signatures must be present, but
                # they should be marked as absent using the option type.
                FAIL
              } ;
            SWAP
          }
      } ;
    # Assert that the threshold is less than or equal to the
    # number of valid signatures.
    ASSERT_CMPLE ;
    DROP ; DROP ;

    # Increment counter and place in storage
    DIP { UNPAIR ; PUSH nat 1 ; ADD @new_counter ; PAIR} ;

    # We have now handled the signature verification part,
    # produce the operation requested by the signers.
    NIL operation ; SWAP ;
    IF_LEFT
      { # Transfer tokens
        UNPAIR ; UNIT ; TRANSFER_TOKENS ; CONS }
      { IF_LEFT {
                  # Change delegate
                  SET_DELEGATE ; CONS }
                {
                  # Change set of signatures
                  DIP { SWAP ; CAR } ; SWAP ; PAIR ; SWAP }} ;
    PAIR }
```

FA2 contract from Unity SDK:

https://better-call.dev/ghostnet/KT1T1saRmmTQcvpPVLiWzQ5FaMzAwkgwND8J/operations

```michelson
parameter (or
            (or
              (pair %balance_of (list %requests (pair (address %owner) (nat %token_id)))
                                (contract %callback (list (pair
                                                          (pair %request
                                                            (address %owner)
                                                            (nat %token_id))
                                                          (nat %balance)))))
              (or
                (pair %mint (pair (address %address) (nat %amount))
                            (pair (map %metadata string bytes) (nat %token_id)))
                (address %set_administrator)))
            (or (or (pair %set_metadata (string %k) (bytes %v)) (bool %set_pause))
                (or
                  (list %transfer (pair (address %from_)
                                       (list %txs (pair (address %to_)
                                                       (pair (nat %token_id)
                                                             (nat %amount))))))
                  (list %update_operators (or
                                           (pair %add_operator (address %owner)
                                                               (pair (address %operator)
                                                                     (nat %token_id)))
                                           (pair %remove_operator (address %owner)
                                                                  (pair
                                                                    (address %operator)
                                                                    (nat %token_id))))))));
storage (pair
          (pair (pair (address %administrator) (nat %all_tokens))
                (pair (big_map %ledger (pair address nat) nat)
                      (big_map %metadata string bytes)))
          (pair
            (pair
              (big_map %operators
                (pair (address %owner) (pair (address %operator) (nat %token_id)))
                unit)
              (bool %paused))
            (pair
              (big_map %token_metadata nat
                                       (pair (nat %token_id)
                                             (map %token_info string bytes)))
              (big_map %total_supply nat nat))));
code { CAST (pair
              (or
                (or
                  (pair (list (pair address nat))
                        (contract (list (pair (pair address nat) nat))))
                  (or (pair (pair address nat) (pair (map string bytes) nat)) address))
                (or (or (pair string bytes) bool)
                    (or (list (pair address (list (pair address (pair nat nat)))))
                        (list (or (pair address (pair address nat))
                                 (pair address (pair address nat)))))))
              (pair
                (pair (pair address nat)
                      (pair (big_map (pair address nat) nat) (big_map string bytes)))
                (pair (pair (big_map (pair address (pair address nat)) unit) bool)
                      (pair (big_map nat (pair nat (map string bytes)))
                            (big_map nat nat))))) ;
       UNPAIR ;
       IF_LEFT
         { IF_LEFT
             { SWAP ;
               DUP ;
               DUG 2 ;
               GET 3 ;
               CDR ;
               IF { PUSH string "FA2_PAUSED" ; FAILWITH } {} ;
               DUP ;
               CAR ;
               MAP { DUP 3 ;
                     GET 5 ;
                     SWAP ;
                     DUP ;
                     DUG 2 ;
                     CDR ;
                     MEM ;
                     IF {} { PUSH string "FA2_TOKEN_UNDEFINED" ; FAILWITH } ;
                     DUP 3 ;
                     CAR ;
                     GET 3 ;
                     SWAP ;
                     DUP ;
                     CDR ;
                     SWAP ;
                     DUP ;
                     DUG 3 ;
                     CAR ;
                     PAIR ;
                     MEM ;
                     IF
                       { DUP 3 ;
                         CAR ;
                         GET 3 ;
                         SWAP ;
                         DUP ;
                         CDR ;
                         SWAP ;
                         DUP ;
                         DUG 3 ;
                         CAR ;
                         PAIR ;
                         GET ;
                         IF_NONE { PUSH int 425 ; FAILWITH } {} ;
                         SWAP ;
                         PAIR }
                       { PUSH nat 0 ; SWAP ; PAIR } } ;
               NIL operation ;
               DIG 2 ;
               CDR ;
               PUSH mutez 0 ;
               DIG 3 ;
               TRANSFER_TOKENS ;
               CONS }
             { IF_LEFT
                 { SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   SENDER ;
                   COMPARE ;
                   EQ ;
                   IF {} { PUSH string "FA2_NOT_ADMIN" ; FAILWITH } ;
                   SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   GET 3 ;
                   SWAP ;
                   DUP ;
                   GET 4 ;
                   SWAP ;
                   DUP ;
                   DUG 3 ;
                   CAR ;
                   CAR ;
                   PAIR ;
                   MEM ;
                   IF
                     { SWAP ;
                       UNPAIR ;
                       UNPAIR ;
                       SWAP ;
                       UNPAIR ;
                       DUP ;
                       DIG 5 ;
                       DUP ;
                       GET 4 ;
                       SWAP ;
                       DUP ;
                       DUG 7 ;
                       CAR ;
                       CAR ;
                       PAIR ;
                       DUP ;
                       DUG 2 ;
                       GET ;
                       IF_NONE { PUSH int 535 ; FAILWITH } {} ;
                       DUP 7 ;
                       CAR ;
                       CDR ;
                       ADD ;
                       SOME ;
                       SWAP ;
                       UPDATE ;
                       PAIR ;
                       SWAP ;
                       PAIR ;
                       PAIR ;
                       SWAP }
                     { SWAP ;
                       UNPAIR ;
                       UNPAIR ;
                       SWAP ;
                       UNPAIR ;
                       DUP 5 ;
                       CAR ;
                       CDR ;
                       SOME ;
                       DIG 5 ;
                       DUP ;
                       GET 4 ;
                       SWAP ;
                       DUP ;
                       DUG 7 ;
                       CAR ;
                       CAR ;
                       PAIR ;
                       UPDATE ;
                       PAIR ;
                       SWAP ;
                       PAIR ;
                       PAIR ;
                       SWAP } ;
                   SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   CAR ;
                   CDR ;
                   SWAP ;
                   DUP ;
                   DUG 2 ;
                   GET 4 ;
                   COMPARE ;
                   LT ;
                   IF
                     {}
                     { DUP ;
                       GET 4 ;
                       DUP 3 ;
                       CAR ;
                       CAR ;
                       CDR ;
                       COMPARE ;
                       EQ ;
                       IF
                         {}
                         { PUSH string "Token-IDs should be consecutive" ; FAILWITH } ;
                       SWAP ;
                       UNPAIR ;
                       UNPAIR ;
                       CAR ;
                       PUSH nat 1 ;
                       DUP 5 ;
                       GET 4 ;
                       ADD ;
                       SWAP ;
                       PAIR ;
                       PAIR ;
                       PAIR ;
                       DUP ;
                       GET 5 ;
                       DIG 2 ;
                       DUP ;
                       GET 3 ;
                       SWAP ;
                       DUP ;
                       DUG 4 ;
                       GET 4 ;
                       PAIR ;
                       SOME ;
                       DUP 4 ;
                       GET 4 ;
                       UPDATE ;
                       UPDATE 5 ;
                       SWAP } ;
                   SWAP ;
                   DUP ;
                   DUG 2 ;
                   DUP ;
                   GET 6 ;
                   DIG 3 ;
                   GET 6 ;
                   DUP 4 ;
                   GET 4 ;
                   GET ;
                   IF_NONE { PUSH nat 0 } {} ;
                   DUP 4 ;
                   CAR ;
                   CDR ;
                   ADD ;
                   SOME ;
                   DIG 3 ;
                   GET 4 ;
                   UPDATE ;
                   UPDATE 6 }
                 { SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   SENDER ;
                   COMPARE ;
                   EQ ;
                   IF {} { PUSH string "FA2_NOT_ADMIN" ; FAILWITH } ;
                   SWAP ;
                   UNPAIR ;
                   UNPAIR ;
                   CDR ;
                   DIG 3 ;
                   PAIR ;
                   PAIR ;
                   PAIR } ;
               NIL operation } }
         { IF_LEFT
             { IF_LEFT
                 { SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   SENDER ;
                   COMPARE ;
                   EQ ;
                   IF {} { PUSH string "FA2_NOT_ADMIN" ; FAILWITH } ;
                   SWAP ;
                   UNPAIR ;
                   UNPAIR ;
                   SWAP ;
                   UNPAIR ;
                   SWAP ;
                   DUP 5 ;
                   CDR ;
                   SOME ;
                   DIG 5 ;
                   CAR ;
                   UPDATE ;
                   SWAP ;
                   PAIR ;
                   SWAP ;
                   PAIR ;
                   PAIR }
                 { SWAP ;
                   DUP ;
                   DUG 2 ;
                   CAR ;
                   CAR ;
                   CAR ;
                   SENDER ;
                   COMPARE ;
                   EQ ;
                   IF {} { PUSH string "FA2_NOT_ADMIN" ; FAILWITH } ;
                   SWAP ;
                   UNPAIR ;
                   SWAP ;
                   UNPAIR ;
                   CAR ;
                   DIG 3 ;
                   SWAP ;
                   PAIR ;
                   PAIR ;
                   SWAP ;
                   PAIR } }
             { IF_LEFT
                 { SWAP ;
                   DUP ;
                   DUG 2 ;
                   GET 3 ;
                   CDR ;
                   IF { PUSH string "FA2_PAUSED" ; FAILWITH } {} ;
                   DUP ;
                   ITER { DUP ;
                          CDR ;
                          ITER { DUP 4 ;
                                 CAR ;
                                 CAR ;
                                 CAR ;
                                 SENDER ;
                                 COMPARE ;
                                 EQ ;
                                 IF
                                   { PUSH bool True }
                                   { SENDER ; DUP 3 ; CAR ; COMPARE ; EQ } ;
                                 IF
                                   { PUSH bool True }
                                   { DUP 4 ;
                                     GET 3 ;
                                     CAR ;
                                     SWAP ;
                                     DUP ;
                                     DUG 2 ;
                                     GET 3 ;
                                     SENDER ;
                                     DUP 5 ;
                                     CAR ;
                                     PAIR 3 ;
                                     MEM } ;
                                 IF {} { PUSH string "FA2_NOT_OPERATOR" ; FAILWITH } ;
                                 DUP 4 ;
                                 GET 5 ;
                                 SWAP ;
                                 DUP ;
                                 DUG 2 ;
                                 GET 3 ;
                                 MEM ;
                                 IF
                                   {}
                                   { PUSH string "FA2_TOKEN_UNDEFINED" ; FAILWITH } ;
                                 DUP ;
                                 GET 4 ;
                                 PUSH nat 0 ;
                                 COMPARE ;
                                 LT ;
                                 IF
                                   { DUP ;
                                     GET 4 ;
                                     DUP 5 ;
                                     CAR ;
                                     GET 3 ;
                                     DUP 3 ;
                                     GET 3 ;
                                     DUP 5 ;
                                     CAR ;
                                     PAIR ;
                                     GET ;
                                     IF_NONE { PUSH int 404 ; FAILWITH } {} ;
                                     COMPARE ;
                                     GE ;
                                     IF
                                       {}
                                       { PUSH string "FA2_INSUFFICIENT_BALANCE" ;
                                         FAILWITH } ;
                                     DUP 4 ;
                                     UNPAIR ;
                                     UNPAIR ;
                                     SWAP ;
                                     UNPAIR ;
                                     DUP ;
                                     DUP 6 ;
                                     GET 3 ;
                                     DUP 8 ;
                                     CAR ;
                                     PAIR ;
                                     DUP ;
                                     DUG 2 ;
                                     GET ;
                                     IF_NONE { PUSH int 407 ; FAILWITH } { DROP } ;
                                     DUP 6 ;
                                     GET 4 ;
                                     DIG 9 ;
                                     CAR ;
                                     GET 3 ;
                                     DUP 8 ;
                                     GET 3 ;
                                     DUP 10 ;
                                     CAR ;
                                     PAIR ;
                                     GET ;
                                     IF_NONE { PUSH int 408 ; FAILWITH } {} ;
                                     SUB ;
                                     ISNAT ;
                                     IF_NONE { PUSH int 407 ; FAILWITH } {} ;
                                     SOME ;
                                     SWAP ;
                                     UPDATE ;
                                     PAIR ;
                                     SWAP ;
                                     PAIR ;
                                     PAIR ;
                                     DUP ;
                                     DUG 4 ;
                                     CAR ;
                                     GET 3 ;
                                     SWAP ;
                                     DUP ;
                                     GET 3 ;
                                     SWAP ;
                                     DUP ;
                                     DUG 3 ;
                                     CAR ;
                                     PAIR ;
                                     MEM ;
                                     IF
                                       { DIG 3 ;
                                         UNPAIR ;
                                         UNPAIR ;
                                         SWAP ;
                                         UNPAIR ;
                                         DUP ;
                                         DIG 5 ;
                                         DUP ;
                                         GET 3 ;
                                         SWAP ;
                                         DUP ;
                                         DUG 7 ;
                                         CAR ;
                                         PAIR ;
                                         DUP ;
                                         DUG 2 ;
                                         GET ;
                                         IF_NONE { PUSH int 410 ; FAILWITH } {} ;
                                         DIG 6 ;
                                         GET 4 ;
                                         ADD ;
                                         SOME ;
                                         SWAP ;
                                         UPDATE ;
                                         PAIR ;
                                         SWAP ;
                                         PAIR ;
                                         PAIR ;
                                         DUG 2 }
                                       { DIG 3 ;
                                         UNPAIR ;
                                         UNPAIR ;
                                         SWAP ;
                                         UNPAIR ;
                                         DUP 5 ;
                                         GET 4 ;
                                         SOME ;
                                         DIG 5 ;
                                         DUP ;
                                         GET 3 ;
                                         SWAP ;
                                         CAR ;
                                         PAIR ;
                                         UPDATE ;
                                         PAIR ;
                                         SWAP ;
                                         PAIR ;
                                         PAIR ;
                                         DUG 2 } }
                                   { DROP } } ;
                          DROP } ;
                   DROP }
                 { DUP ;
                   ITER { IF_LEFT
                            { DUP ;
                              CAR ;
                              SENDER ;
                              COMPARE ;
                              EQ ;
                              IF
                                { PUSH bool True }
                                { DUP 3 ; CAR ; CAR ; CAR ; SENDER ; COMPARE ; EQ } ;
                              IF
                                {}
                                { PUSH string "FA2_NOT_ADMIN_OR_OPERATOR" ; FAILWITH } ;
                              DIG 2 ;
                              UNPAIR ;
                              SWAP ;
                              UNPAIR ;
                              UNPAIR ;
                              PUSH (option unit) (Some Unit) ;
                              DIG 5 ;
                              DUP ;
                              GET 4 ;
                              SWAP ;
                              DUP ;
                              GET 3 ;
                              SWAP ;
                              CAR ;
                              PAIR 3 ;
                              UPDATE ;
                              PAIR ;
                              PAIR ;
                              SWAP ;
                              PAIR ;
                              SWAP }
                            { DUP ;
                              CAR ;
                              SENDER ;
                              COMPARE ;
                              EQ ;
                              IF
                                { PUSH bool True }
                                { DUP 3 ; CAR ; CAR ; CAR ; SENDER ; COMPARE ; EQ } ;
                              IF
                                {}
                                { PUSH string "FA2_NOT_ADMIN_OR_OPERATOR" ; FAILWITH } ;
                              DIG 2 ;
                              UNPAIR ;
                              SWAP ;
                              UNPAIR ;
                              UNPAIR ;
                              NONE unit ;
                              DIG 5 ;
                              DUP ;
                              GET 4 ;
                              SWAP ;
                              DUP ;
                              GET 3 ;
                              SWAP ;
                              CAR ;
                              PAIR 3 ;
                              UPDATE ;
                              PAIR ;
                              PAIR ;
                              SWAP ;
                              PAIR ;
                              SWAP } } ;
                   DROP } } ;
           NIL operation } ;
       PAIR }
```