---
id: modelling-theorem
title: Modelling for smart contracts
authors: Frank Hillard (Cardashift)
lastUpdated: 30th June 2023
---

This section describes how to bridge Tezos and the [Michelson](/smart-contracts/smart-contract-languages/michelson/) language with the formal world of [Coq](/advanced-topics/formal-verification/coq/). To achieve this, we are going to model a theorem representing a smart contract and the goal of the smart contract.

## Overview
The Tezos blockchain can run smart contracts using the Michelson language. Michelson is a low-level stack-based Turing-complete language that is formally proven. The proof of Michelson language is compiled in a library called [Mi-Cho-Coq](/advanced-topics/formal-verification/michocoq/).

The Coq proof assistant is built upon the paradigm of **calculus of constructions**. The [Gallina](https://en.wikipedia.org/wiki/Coq#Overview) language provides a syntax (terms) for describing formal objects (a theorem) and also provides a set of instructions (vernacular syntax, known as tactics) for writing the proof of the theorem.

The formal verification of a Michelson smart contract is done by providing the proof for this theorem. Coq will perform the verification of a given proof (and its related theorem) based on the Mi-Cho-Coq proof.

The proof consists of a sequence of tactics which the Coq engine will interpret. These instructions manipulate formal expressions (following laws of logic and the Mi-Cho-Coq definitions) to formally assert the truth of a given theorem (based on the given assumptions).

![](/images/modelling-theorem/overview_process.svg)

Notice that Gallina provides:

- **Terms** are the specification language; used for modelling logical objects such as theorems, axioms, assumptions, logical rules and specifications.
- **Vernacular** is the language of commands; used for writing a proof of a theorem (tactics are provided to interactively prove a theorem).

## Modelling a Smart Contract as a Theorem
This ecosystem combines the proof assistant, Coq, and a proof for the Michelson language using Mi-Cho-Coq to formally verify the correctness of a theorem and its proof.

The modelling theorem is based on: 

- a Michelson script representing what the smart contract does.
- post-conditions representing the rules of the smart contract in a formal form.

Formal verification of a Tezos smart contract consists in verifying formally that **the execution of the Michelson script satisfies specific post-conditions**.

![](/images/modelling-theorem/overview_theorem.svg)

The schema above describes an equivalence between the execution of instructions and post-conditions (A, B, C, D). Post-conditions are rules that must be verified, but these post-conditions do not describe the whole behaviour of the smart contract, only specific traits representing the intent of the smart contract.

In the following sections, we will detail how the execution of a Michelson script can be formally written and how to define the post-conditions. We will then study the formal proof as a sequence of Coq tactics (i.e. the vernacular part of the Gallina language).

### Smart Contract Invocation
Tezos smart contracts can be written in multiple high-level [languages](/smart-contracts/smart-contract-languages/) but these are all ultimately compiled in Michelson.

A smart contract invocation requires the smart contract itself (through its address), the entrypoint that is being called (and its related arguments) and the storage state. If all these elements are provided, the execution of the smart contract code is triggered, which results in side-effects on storage and optionally on the Tezos network itself:

![](/images/modelling-theorem/smartcontract_invocation.svg)

The entrypoint information is used to identify which portion of the code will be executed. The entrypoint arguments and the storage are used as the context of execution (i.e, the execution stack is initialized with arguments and a storage). The execution of the code produces a new storage state and operations.
The operations produced by this invocation are also some new invocations of other smart contracts.

### Formally Modelling The Execution of a Tezos smart contract
Now let's see how to formulate formally **the execution of the Michelson script**. 

As we have seen, the **the execution of the Michelson script** produces a new storage state and we assume there are no operations produced.

Formally, `EXECUTION(CODE,arguments, storage)` produces new storage. The execution of code is done by evaluating a sequence of Michelson instruction for a given initial stack (an `eval` function is provided by Coq). The execution of code also requires a context and a quantity of gas to be able to execute each instruction (requirement defined by Mi-Cho-Coq). The execution of code can be formalized as:

```
eval env CODE fuel (arguments,storage) = return (newStorage)
```

where:
- `fuel` represents the quantity of gas.
- `env` represents a context of evaluation for the Coq engine.
- `eval` represents an evaluator which effectively executes each instruction sequentially on the provided initial stack.
- `arguments` represents the parameter (entrypoint) and its related arguments.
- `storage` represents the storage state before the execution.
- `newStorage` represents the resulting storage after the execution.

The theorem can be formalized as:

```
eval env CODE fuel (arguments, storage) = return (newStorage) <=> post-conditions
```
where `<=>` represents an equivalence.

### Post-conditions

Post-conditions are logical assertions that model the intention of the smart contract. In other words, post-conditions are logical expressions defining constraints on verifying storage data.

The main effort is identifying rules (or constraints) that ensure the correctness of the execution (i.e. ensure that the storage cannot end up in an invalid state).

In fact, post-conditions are usually multiple assertions combined with a logical `AND` operator ( `^` in Coq):

``` sh
post-conditions <=> A ^ B ^ C ^ D
```

Since post-conditions are a generic concept formalising the smart contract intention as logical assertions, we will use an example in order to illustrate modelling post-conditions.

## Example Smart Contract

Let's consider a very simple **voting** smart contract that handles a voting process. The complete implementation of the theorem and its proof are available [here](https://gitlab.com/nomadic-labs/mi-cho-coq/-/blob/master/src/contracts_coq/vote.v). 

This smart contract allows anyone to vote for a candidate (we consider that candidates are registered and their number of votes is initialized to zero). When someone invokes this smart contract, one must indicate the candidate. If the candidate is registered, then the candidate's number of votes is incremented.

{% callout type="note" title="Storage and Operations" %}
When someone invokes the _Vote_ smart contract it will only modify its storage and thus will have no impact on other smart contract storages. The execution of the smart contract will **not** produce `operations`. 
{% /callout %}

### Smart Contract Code 

``` sh
{
    parameter (string %vote);
    storage (map string int);
    code {
        AMOUNT;
        PUSH mutez 5000000;
        COMPARE; GT;
        IF { FAIL } { NOOP };
        DUP; DIP { CDR; DUP }; CAR; DUP;
        DIP {
            GET; ASSERT_SOME;
            PUSH int 1; ADD; SOME
        };
        UPDATE;
        NIL operation; PAIR
    }
}
```

### Features

- Candidates are identified by a `string` value (entrypoint argument) and the storage is a `map string int`.
- The amount of Tez transferred must be lower than five million, otherwise the execution fails.
- The the candidate must be registered; otherwise the execution fails.

### Pseudo-code 

The simple code above is equivalent to the following pseudo-code:

```
candidate is string
storageMap is map(key=string, value=int)

....
function code(amount, candidate, storageMap) : storageMap {
    if (amount > 5000000)
        fail()
    else if (candidate not in storageMap)
        fail()
    else 
        storageMap[candidate] += 1;
    return storageMap;
}
```

where `amount` and `candidate` are given as arguments.

### Parameter definition

The parameter type and storage type can be defined in Coq as two distinct definitions:

``` sh
Definition parameter_ty : type := string.
Definition storage_ty := map string int.
```

The parameter type (`parameter_ty`) can be wrapped into a `SelfType` definition. This will be used when defining the smart contract:

``` sh
Module ST : (SelfType with Definition self_type := parameter_ty).
  Definition self_type := parameter_ty.
End ST.
```

### Annotated Script

The smart contract is a Michelson script but this script cannot be taken as input by the Coq engine as is. [Mi-Cho-Coq](/advanced-topics/formal-verification/michocoq/) (the Coq specification of the Michelson language) provides the correspondence between a Michelson instruction and an equivalent logical proposition. There is no automated process that translates Michelson code into a formal definition based on Mi-Cho-Coq definitions. Therefore, this must be done manually.

The example voting smart contract can be formalized in a formal definition in Coq (_Terms_ part of the _Gallina_ language):

``` sh
Definition vote : full_contract _ ST.self_type storage_ty :=
(
    AMOUNT ;;
    PUSH mutez (5000000 ~mutez);;
    COMPARE;; GT;;
    IF ( FAIL ) ( NOOP );;
    DUP;; DIP1 ( CDR;; DUP );; CAR;; DUP;;
    DIP1 (
      GET (i := get_map string int);; ASSERT_SOME;;
      PUSH int (Int_constant 1%Z);; ADD (s := add_int_int);; SOME
    );;
    UPDATE (i := Mk_update string (option int) (map string int) (Update_variant_map string int));;
    NIL operation;; PAIR 
).
```

This `vote` definition will be used to formalize the theorem. It takes the parameter and storage types, `parameter_ty` and `storage_ty` respectively, as arguments.

The `GET`, `UPDATE`, `ADD` and `PUSH` instructions are annotated:
- `ADD (s := add_int_int)` indicates it is an addition between two integers.
- `GET (i := get_map string int)` indicates it accesses elements into a `map string int`. 
- `UPDATE (i := Mk_update string (option int) (map string int) (Update_variant_map string int))` 
    - This updates (`Mk_update`) a `map` with a `string` as key and an `option int` as value.

### Example Post-conditions

As said previously, post-conditions are logical expressions defining constraints to verify on the storage data. In our example voting smart contract, the storage is a map containing the number of votes per candidate. So, how we can define logical assertions on the storage data?

Let us start by defining some rules governing the voting process:
- When someone votes for a candidate, its number of votes increments by 1.
- When someone votes for a candidate, the number of votes of other candidates does not change.
- When someone votes for a candidate, it does not change the list of candidates.
- If the voting process is successful, then it means that the candidate is registered.
- Invoking this smart contract does not impact the rest of the Tezos network, only the related storage.

Now, these rules can be translated into formal propositions. These propositions depend on the given parameter, the current storage state and the new storage state (and the produced operations). 

The post conditions of the example contract can be visualised:  

![](/images/modelling-theorem/postconditions_rules.svg)

The rule "Keys of the old storage exists in the new storage" can be written in Coq (Gallina - Terms) with the following:

``` sh
(forall s, (mem _ _ (Mem_variant_map _ int) s storage) <->
        (mem _ _ (Mem_variant_map _ int) s new_storage))
```

This expression verifies that all keys of the old storage are defined in the new storage.

The rule "For Bob, number of votes is incremented" can be formulated as: 
- "For each element of the mapping whose key is equal to the given parameter, the new value must be equal to the old value plus one". 

This can be written in Coq (Gallina - Terms) with the following:

``` sh
match (get _ _ _ (Get_variant_map _ int) param storage) with
  | Some n1 => match (get _ _ _ (Get_variant_map _ int) param new_storage) with
              | Some n2 => n2 = (BinInt.Z.add n1 1)
              | None => False
              end
  | None => False end
```

The rule "For others, number of votes do not change" can be formulated as:
- *"For each element of the mapping different from the given parameter, ensure that the old value is equal to the new value"*. 

This can be written in Coq (Gallina - Terms) with the following:

``` sh
(forall s, s <> param ->
   match (get _ _ _ (Get_variant_map _ int) s storage) with
  | Some n1 => match (get _ _ _ (Get_variant_map _ int) s new_storage) with
              | Some n2 => n2 = n1
              | None => False
              end
  | None => True end)
```

The rule "Only the storage is modified" can be expressed by verifying that no operations have been produced. This can be written in Coq (Gallina - Terms) with the following:

``` sh
returned_operations = nil
```

As seen previously, the smart contract can be executed only if the amount of Tez transferred is lower than 5 million; otherwise the execution fails. This constraint can be written in Coq (Gallina - Terms) with the following:

``` sh
(Z.ge (tez.to_Z (amount env)) 5000000)
```

To sum up, our post-conditions are a combination of all these logical rules merged into a single object which depends on the given storage state and parameter, and the resulting new storage state (and the returned operations).

This object `vote_spec` represents the post-conditions of the voting process: 

``` sh
Definition vote_spec
           (storage: data storage_ty)
           (param : data parameter_ty)
           (new_storage : data storage_ty)
           (returned_operations : data (list operation)) :=
  (* Preconditions *)
  (Z.ge (tez.to_Z (amount env)) 5000000) /\
  mem _ _ (Mem_variant_map _ int) param storage /\
  (* Postconditions *)
  (forall s, (mem _ _ (Mem_variant_map _ int) s storage) <->
        (mem _ _ (Mem_variant_map _ int) s new_storage)) /\
  returned_operations = nil /\
  match (get _ _ _ (Get_variant_map _ int) param storage) with
  | Some n1 => match (get _ _ _ (Get_variant_map _ int) param new_storage) with
              | Some n2 => n2 = (BinInt.Z.add n1 1)
              | None => False
              end
  | None => False end /\
  (forall s, s <> param ->
   match (get _ _ _ (Get_variant_map _ int) s storage) with
  | Some n1 => match (get _ _ _ (Get_variant_map _ int) s new_storage) with
              | Some n2 => n2 = n1
              | None => False
              end
  | None => True end).
  
```

The `vote_spec` definition above expresses logical assertions depending on:

- the initial storage state, `storage`
- the returned storage state, `new_storage`
- the parameter, `param`
- the returned operations, `returned_operations`

To conclude, the voting smart contract is defined by the `vote_spec` definition and can be used to formalize the theorem.

#### Theorem definition

As stated previously, the formal verification of a Tezos smart contract consists in verifying formally that **the execution of the Michelson script satisfies specific post-conditions**.

We have seen that the theorem can be formalized as:

```
eval env CODE fuel (arguments, storage) = return (newStorage) <=> post-conditions
```

Here is a schema describing graphically the theorem formalization:

![](/images/modelling-theorem/theorem_graphical.svg)

Now that we have defined the post-conditions to verify, we can define the theorem in Gallina (Terms) syntax: 

``` sh
Theorem vote_correct
      (storage : data storage_ty)
      (param : data parameter_ty)
      (new_storage : data storage_ty)
      (returned_operations : data (list operation))
      (fuel : Datatypes.nat) :
  fuel >= 42 ->
  eval env vote fuel ((param, storage), tt) = Return ((returned_operations, new_storage), tt)
  <-> vote_spec storage param new_storage returned_operations.
```

The `vote` object represents our smart contract (in a formal representation). Notice that the `vote_spec` object also represents the post-conditions to verify (in a formal representation).

We can represent this equivalence between the execution of the code and the verification of post-conditions by the following diagram:

![](/images/modelling-theorem/theorem_graphical_detail.svg)

Notice that the `vote_spec` definition is used as post condition and requires 4 arguments (`storage`, `param`, `new_storage`, `returned_operations`). 

### Example Proof

Now that the intention of our smart contract has been modelled into post-conditions and that our smart contract has been translated into a theorem (which combines evaluation of a sequence of Michelson instructions and post-conditions), we need to prove that this theorem is true.

The demonstration or proof of the theorem can be expressed with a sequence of Coq tactics.

Since the theorem is a complex logical proposition, we can decompose it into simpler propositions easily provable. This decomposition is done by separating into smaller independent propositions or applying reductions, see more info on Gallina [here](https://coq.inria.fr/distrib/current/refman/language/gallina-specification-language.html).

The following proof script relies on:
- tactics (commands of the Vernacular of Gallina) 
- induced types (Mi-Cho-Coq)
- proven theorem of Mi-Cho-Coq dealing with Tezos smart contract properties (e.g. gas)
- the Coq universe, which defines sets of numbers and related theorem. For example, natural integers are defined upon Peano arithmetic.

Here is the proof of our example voting smart contract:

``` sh
Proof.
  intro Hfuel. unfold ">=" in Hfuel.
  unfold eval.
  rewrite return_precond.
  rewrite eval_precond_correct.
  do 15 (more_fuel; simpl).
  rewrite if_false_not.
  apply and_both_0.
  - change (tez.compare (5000000 ~Mutez) (amount env)) with
        (5000000 ?= (tez.to_Z (amount env)))%Z.
    rewrite Z.compare_antisym.
    unfold ">="%Z.
    destruct (tez.to_Z (amount env) ?= 5000000)%Z; simpl; intuition discriminate.
  - (* Enough tez sent to contract *)
    destruct (map.get str Z string_compare param storage) eqn:mapget.
    + (* Key is in the map *)
      more_fuel; simpl.
      split; intros.
      * (* ->  *)
        simpl in *.
        repeat split; inversion H.
        -- apply map.map_getmem with z; assumption.
        -- intro Hstor.
           apply map.map_updatemem.
           assumption.
        -- intro Hnstor.
           destruct (string_compare s param) eqn:strcomp.
           rewrite string_compare_Eq_correct in strcomp; subst.
           apply map.map_getmem with z. assumption.
           eapply map.map_updatemem_rev with (k':= param).
           rewrite <- (compare_diff string). left. eassumption. eassumption.
           eapply map.map_updatemem_rev with (k':= param).
           rewrite <- (compare_diff string). right. eassumption. eassumption.
        -- reflexivity.
        -- rewrite mapget.
           rewrite map.map_updateeq.
           destruct z; try destruct p; reflexivity.
        -- intros s Hneq.
           destruct (map.get str Z string_compare s storage) eqn:mapget2.
           rewrite map.map_updateneq.
           rewrite mapget2. reflexivity. intro contra. subst; contradiction.
           constructor.
      * (* <- *)
        repeat simpl.
        destruct H as [H1 [H2 [H3 [H4 H5]]]].
        repeat f_equal.
        -- symmetry. assumption.
        -- symmetry.
           rewrite map.map_updateSome_spec.
           split.
           ++ unfold get, semantics.get in H5; simpl in H5.
              simpl in *.
              destruct (map.get str Z string_compare param storage); destruct (map.get str Z string_compare param new_storage); subst;
                try inversion H4.
              inversion mapget; subst. rewrite BinInt.Z.add_comm. reflexivity.
           ++ simpl in *.
              clear H4.
              intros s Hdiff. specialize (H5 s).
              assert (s <> param) as Hdiff2 by (intro contra; rewrite contra in Hdiff; contradiction);
                apply H5 in Hdiff2.
              unfold get, semantics.get in Hdiff2. simpl in Hdiff2.
              destruct (map.get str Z string_compare s storage) eqn:get1;
                destruct (map.get str Z string_compare s new_storage) eqn:get2; subst;
                  try reflexivity.
              inversion Hdiff2.
              exfalso. clear H5.
              apply map.map_getmem in get2.
              rewrite <- H2 in get2. apply map.map_memget in get2. destruct get2 as [v get2].
              rewrite get2 in get1. discriminate get1.
  + (* Key is not in the map *)
    more_fuel; simpl.
               split; intros.
      * (* -> *)
        inversion H.
      * (* <- *)
        destruct H as [H1 [H2 [H3 [H4 H5]]]].
        apply map.map_memget in H1. destruct H1 as [v H1].
        simpl in H1. rewrite H1 in mapget. discriminate mapget.
Qed.
```

## Conclusion

In this section, we discussed an example smart contract to walk you through: 
- how to translate a Tezos smart contract into a formal definition based on Mi-Cho-Coq definitions
- how to design post-conditions modelling the intention of a smart contract 
- how to define a theorem based on the Mi-Cho-coq evaluator and post-conditions.
- an example proof

{% comment %}
## References
[1] Coq - https://coq.inria.fr/distrib/current/refman/index.html

[2] Mi-cho-coq repository - https://gitlab.com/nomadic-labs/mi-cho-coq


[4] Gallina - https://coq.inria.fr/distrib/current/refman/language/gallina-specification-language.html

[5] Lambda-Calculus and Isomorphism Curry-Howard - http://disi.unitn.it/~bernardi/RSISE11/Papers/curry-howard.pdf

[6] Isomorphism Curry-Howard for Dummies - https://www.pédrot.fr/slides/inria-junior-02-15.pdf

[7] Isomorphism Curry-Howard (small) - https://www.seas.harvard.edu/courses/cs152/2015sp/lectures/lec15-curryhoward.pdf

[8] Higher-order abstract syntax in Coq - https://web.archive.org/web/20060830033826/http://www.site.uottawa.ca/~afelty/dist/tlca95.ps

[9] Michelson - https://tezos.gitlab.io/michelson-reference/

[10] Logique formelle - https://www.irif.fr/~roziere/2ord/2ndordre.pdf

[12] Axioms de Peano - https://fr.wikipedia.org/wiki/Axiomes_de_Peano

[13] Calculus of constructions - https://fr.wikipedia.org/wiki/Calcul_des_constructions

[14] Mini-guide Coq - https://www.lri.fr/~paulin/MathInfo/coq-survey.pdf

[15] Coq’Art - https://www.labri.fr/perso/casteran/CoqArt/coqartF.pdf

[16] The calculus of constructions (1988) by Thierry Coquand - https://www.sciencedirect.com/science/article/pii/0890540188900053

[17] Lambda-calcul - https://fr.wikipedia.org/wiki/Lambda-calcul

[18] Calculus of Inductive Constructions - https://coq.inria.fr/distrib/current/refman/language/cic.html

[19] Michelson - https://www.michelson-lang.com/why-michelson.html

[20] Vote example - https://gitlab.com/nomadic-labs/mi-cho-coq/-/blob/master/src/contracts_coq/vote.v

[21] Mi-Cho-Coq examples - https://gitlab.com/nomadic-labs/mi-cho-coq/-/blob/master/src/contracts_coq

[22] Archetype - https://completium.com/docs/verification/specification/
{% /comment %}


