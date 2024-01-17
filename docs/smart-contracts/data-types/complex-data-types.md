---
title: Complex data types
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

Tezos contracts support these complex data types.
The high-level languages may implement these data types slightly differently, but they all behave the same way in the compiled Michelson code:

- [Pairs](#pairs)
- [Records](#records)
- [Options](#options)
- [Big-maps and maps](#big-maps)
- [Lists](#lists)
- [Sets](#sets)
- [Variants and Unions](#variants)
- [Lambdas](#lambdas)
- [Tickets](#tickets)

## Pairs {#pairs}

A pair is a complex type made of two other types.
For example, a pair of an `int` and a `string` can hold a value such as `(42, "Hello")`.
Languages have instructions to create pairs and to extract the left or right value from a pair.

Pairs can be nested, which makes it possible to create more complex structures with many values of different types.
The two main ways to nest pars is by using right combs or binary trees:

### Right combs

The most common way to nest pairs on Tezos is to create a right comb.
A right comb is a pair whose second element is a pair, whose second element is a pair, and so on.

For example, this right comb stores an int, a string, and a bool using nested pairs: `{-42; {"Hello"; True}}`.

To add another unit, the right value of the most nested pair becomes a pair, as in this example: `{-42; {"Hello"; {True; 21}}}`.

This is a way to create a Tuple (a sequence of elements of different types) using only pairs.
Because right combs are used often in Michelson, there are shorter ways to express them.
For example, the notation `{42; "Hello"; True; 21}` is equivalent to `{-42; {"Hello"; {True; 21}}}`.

### Binary trees

Another way to use pairs to combine multiple values is to use a binary tree layout.
In this layout, both sides of the main pair contain a pair, then both sides of these pairs contain pairs, and so on.

Here is an example of a binary tree: `{{-42; "Hello"}; {True; 21}}`

The binary tree layout is be more efficient than a right comb when accessing arbitrary elements.
For example, to access the last element, you can get the second element of the main pair (`{True; 21}`) and the second element of that pair (`21`).
If the tree is balanced, the number of operations to get to any element is
$$O(\log_2 (size))$$, whereas for a right comb, it's $$O(size)$$.

### Implementation details

- Michelson: [Operations on pairs and right combs](https://tezos.gitlab.io/active/michelson.html#operations-on-pairs-and-right-combs)
- LIGO: [Tuples](https://ligolang.org/docs/language-basics/sets-lists-tuples#tuples)
- SmartPy: [Tuples and Records](https://smartpy.io/manual/syntax/tuples-and-records)
- Archetype: [Composite types](https://archetype-lang.org/docs/language-basics/composite#tuple), [Tuple](https://archetype-lang.org/docs/reference/types#tuple)

## Records {#records}

To make it easier to create type that combine multiple elements, high-level languages provide the `record` data type.
The `record` data type assigns a name to each element, which makes it much easier to get the element that you need because you don't have to remember the location of the element in the data.
Records are similar to Python dictionaries and JavaScript objects.

Different high-level languages represent records in different ways, but here is a simple abstract representation of a record definition:

```bash
type person: record
	- age: nat
	- name: string
	- registered: bool
```

Here is an abstract example of a value of that record type:

```bash
person: record
	- age: 21
	- name: "Laura"
	- registered: True
```

When you compile the high-level code, Michelson represents records with nested pairs and annotations.
<!-- TODO link to annotations -->

In most cases, you can nest records.
For example, if you have a record type named "address," you can add it as an element to the previous record like this:

```bash
type person: record
- age: nat
- name: string
- registered: bool
- homeAddress: record
	- number: nat
	- street: string
	- city: string
	- zipcode: nat
	- country: string
```

### Implementation details

- Archetype: [Record](https://archetype-lang.org/docs/language-basics/composite#record)
- LIGO: [Records](https://ligolang.org/docs/language-basics/maps-records#records)
- SmartPy: [Tuples and Records](https://smartpy.io/manual/syntax/tuples-and-records)

## Options {#options}

Options represent a value that may or may not be defined.
Primitive types do not provide the possibility of a null or empty value; for example, an `int` type must always contain a number.
If you want to include the possibility that a value is unknown, undefined, or nonexistent, you can make a type into an option.
For example, an option based on an `int` type can hold a number or no value at all.
You can create an `option` type based on almost any other type.

For example, an `option` type based on an `int` is denoted as `option<int>` and can contain these values:

- An `int` value, represented as `Some(42)`
- No value, represented as `None`

Each time that you manipulate the value within an `option` you must check if it contains a value or not.

The features available for options are:

- Creating an option that contains a given value (`SOME`)
- Creating an option that contains nothing (`NONE`)
- Testing if an option contains something or none (`IF_NONE`)
- Getting the value contained in an option (`IF_NONE`)

### Using options instead of failures

Options are used for operations that can't always provide a result, which allows the code to handle the situation without failing and leads to good programming practice.

Here are a few examples where an `option` is used:

- Converting an `int` to a `nat` returns an `option`, which is `None` if the `int` is negative
- Dividing (`EDIV`), returns `None` when trying to divide by zero
- Extracting a portion of a `string` or a `bytes` value returns `None` if the extract is beyond the bounds of the value
- Fetching a value for a given key in a `big-map` or `map` returns `None` if the entry doesn't exist
- Fetching the contract that corresponds to an `address` returns `None` if the `address` is not a contract
- Unpacking `bytes` returns `None` if the data is not valid

### When not to use options

Using an `option` is convenient when you need it, but it makes the corresponding code harder to write and read and slightly slower and more costly.

When a value may be undefined only at the initial contract deployment, it may be more convenient and efficient to initialize the value instead of making it an option, as in these examples:

- For a `timestamp`, consider initializing it with epoch: January 1st, 1970.
- For an `address`, consider initializing it with the address of the owner of the contract.
Alternatively (but harder to understand without comments), you can use the special null address, `"tz1burnburnburnburnburnburnburjAYjjX"`, which does not correspond to an actual account

### Implementation details

- Michelson: [Operations on optional values](https://tezos.gitlab.io/active/michelson.html#operations-on-optional-values)
- LIGO: [Optional values](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#optional-values)
- SmartPy: [Options](https://smartpy.io/docs/types/options/)
- Archetype: [Options](https://archetype-lang.org/docs/reference/types#option%3CT%3E)

## Big-maps and maps {#big-maps}

Smart contracts often need to store a database of records where each record is identified by a key and can be fetched quickly.

For example, an NFT contract may store a database of NFTs, each identified by a unique numeric ID.
For each NFT it stores metadata, such as the current owner.

A `big-map` is a key-value store that associates values to different keys.
This example big-map uses `int` and `string` types to associate numbers with their names:

```bash
{
	Elt 1 "One";
	Elt 3 "Three";
	Elt 12 "Twelve";
	Elt 24 "Twenty four"
}
```

The main operations available for `big-maps` are:

- Creating an empty `big-map` (`EMPTY_BIG_MAP`)
- Checking if there is an entry for a given key (`MEM`)
- Accessing the entry associated with a given key (`GET`)
- Assigning an entry to a given key (`UPDATE`)
- Deleting the entry for a given key (`UPDATE`)

### Big-maps vs maps

Big-maps are a special type of `map` type that is optimized so that it can contain very large amounts of data without necessarily causing issues with gas limits.
This is because the content of a big-map is lazily deserialized; only the entries that are manipulated by a contract are deserialized/reserialized, as opposed to maps and all the other data types, where all of the content is deserialized/reserialized for each call of the contract.

This makes big-maps more useful in practice than maps, because using maps can quickly cause gas consumption issues if the number of entries gets large.

Maps support all the features of big-maps plus these:

- Iterating through each element of the map, and applying some code to it (`ITER`)
- Getting the size (number of elements) of the map (`SIZE`)

Furthermore, unlike big-maps, maps can be passed as parameters and included in records or big-maps.
You cannot pass big-maps as parameters or include them in records because doing so would require manipulating the serialized content of the big-map and defeat the purpose of big-maps.

In general, developers use big-maps unless there is a good reason to use maps because big-maps.
If you choose to use a map, take precautions and optimize your code.

### Example contract using big-maps

Here is a table representing an example of a contract that uses two big-maps:

{<table>
  <thead>
    <tr>
      <th>Storage</th>
      <th>Entrypoint effects</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <ul>
          <li><code>nextID</code>: <code>int</code>:</li>
          <li><code>tokens</code>: <code>big-map</code>:<ul>
              <li><code>tokenID</code>: <code>int</code></li>
              <li><code>owner</code>: <code>address</code></li>
              <li><code>author</code>: <code>address</code></li>
              <li><code>metadata</code>: <code>string</code></li>
              <li><code>price</code>: <code>tez</code></li>
            </ul>
          </li>
          <li><code>ledger</code>: <code>big-map</code>
            <ul>
              <li><code>key</code>: <code>address</code></li>
              <li><code>value</code>: <code>tez</code></li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li><code>buy(tokenID)</code>
            <ul>
              <li>Checks that <code>tokens[tokenID] exists</code></li>
              <li>Check that the amount transferred is correct</li>
              <li>Send 5% of the price to the author of the token</li>
              <li>If <code>ledger[owner]</code> doesn’t exist, create it with <code>value=0</code></li>
              <li>Add the price minus 5% to ledger[owner].value</li>
              <li>Replace owner with the caller in the token metadata</li>
              <li>Increase price by 10% in the token</li>
            </ul>
          </li>
          <li><code>mint(metadata, price)</code>
            <ul>
              <li>Create a new entry in tokens, with key <code>nextID</code></li>
              <li>Set owner and author to the address of the caller</li>
              <li>Set metadata and price to input values</li>
              <li>Increment <code>nextID</code></li>
            </ul>
          </li>
          <li><code>claim()</code>
            <ul>
              <li>Verify that <code>ledger[caller]</code> exists</li>
              <li>Create a transaction to send <code>ledger[caller].value</code> to caller</li>
              <li>Delete <code>ledger[caller]</code></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>}

### Implementation details

- Michelson: [Operations on big-maps](https://tezos.gitlab.io/active/michelson.html#operations-on-big-maps)
- Archetype: [Assets](https://archetype-lang.org/docs/reference/instructions/asset), [Map](https://archetype-lang.org/docs/language-basics/container#map)
- LIGO: [Maps](https://ligolang.org/docs/language-basics/maps-records#maps), [Big-maps](https://ligolang.org/docs/language-basics/maps-records#big-maps)
- SmartPy: [Maps and big-maps](https://smartpy.io/manual/syntax/lists-sets-and-maps#maps)

## Lists {#lists}

Lists can store and iterate through values of the same type.
For example, they can do these operations:

- Inserting an element at the beginning of a list (`CONS`)
- Getting the first element and the rest of a list (`IF_CONS`)
- Iterating through a list (`ITER`)
- Getting the number of items in a list (`SIZE`)

:::note High-level language list methods
Some high level languages may offer additional features such as getting an extract of a list.
Refer to the language documentation to see what is supported.
:::

:::warning List security considerations
To prevent attacks, make sure that the number of elements in a list can't be increased arbitrarily.
An attacker could make the list increase and cause problems.
In general, use big-maps to store large amounts of data.
:::

### Implementation details

- Michelson: [Operations on lists](https://tezos.gitlab.io/active/michelson.html#operations-on-lists)
- SmartPy: [Lists](https://smartpy.io/manual/syntax/lists-sets-and-maps#lists)
- Archetype: [List](https://archetype-lang.org/docs/language-basics/container#list)
- LIGO: [List](https://ligolang.org/docs/reference/list-reference)

## Sets {#sets}

Like lists, sets contain elements of the same data type, but in sets, each element can be present only once.
Sets are ordered, and the order is the natural order of the values in the set; see [Comparing values](../logic/comparing).

The main operations available on sets are:

- Creating an empty set (`EMPTY_SET`)
- Adding an element to the set (`UPDATE`)
- Removing an element from the set (`UPDATE`)
- Checking if an element is present in the set (`MEM`)
- Iterating through the set in the order of the value of the elements (`ITER`)
- Getting the number of items in the set (`SIZE`)

### Implementation details

- Michelson: [Operations on sets](https://tezos.gitlab.io/active/michelson.html#operations-on-sets)
- Archetype: [Set](https://archetype-lang.org/docs/language-basics/container#set)
- SmartPy: [Sets](https://smartpy.io/manual/syntax/lists-sets-and-maps#sets)
- LIGO: [Set](https://ligolang.org/docs/reference/set-reference)

## Variants and Unions {#variants}

A variant (or union) can hold values of multiple types.
For example, a variant can hold either an `int` or a `string`.

- When you use a variant, you can check which of the types it holds and run corresponding code.
- Variants are used internally as a way to implement entrypoints
- Some high-level languages use variants to implement enumerations, which is a type that has a list of valid named values.

### Implementation details

- Michelson: [Operations on unions](https://tezos.gitlab.io/active/michelson.html#operations-on-unions)
- LIGO: [Variant types](https://ligolang.org/docs/language-basics/unit-option-pattern-matching#variant-types)
- SmartPy: [Variants](https://smartpy.io/manual/syntax/options-and-variants#variants)
- Archetype: [Enum](https://archetype-lang.org/docs/language-basics/composite#enum)

## Lambdas {#lambdas}

A lambda is a piece of code that is also a value.
It can be stored or passed as a parameter to an entrypoint.

The code of a lambda takes parameters and returns a value but it has no side effects.
Unlike other code, it doesn't have access to the contract storage and cannot modify the storage.
<!-- TODO Lambdas can access
It does however have access to the [special values](#special-values) of the contract (its `balance`, the current `timestamp` etc.)
-->

Here are some common uses for lambdas:

- Lambdas allow you to reuse code in multiple places when the language does not support reuse.
In high-level languages, you can reuse code with functions or similar structures, but in Michelson, you may need to use a lambda for the same purpose.
- Lambdas can make parts of a contract upgradeable.
For example, the contact can store some of its logic in a lambda and an admin can call an entrypoint to change the lambda to change how the contract works.
Note that the ability to upgrade the contract can cause users to worry about the trustworthiness of the contract.
- You can use lambdas to implement a generic multi-sig or DAO contract where a proposal takes the form of a lambda that performs some action and people vote on whether to execute the action or not.

### Implementation details

- Michelson: [Control structures](https://tezos.gitlab.io/active/michelson.html#control-structures)
- Archetype: [apply_lambda](https://archetype-lang.org/docs/reference/expressions/builtins#apply_lambda%28f%20:%20lambda%3CA%20*%20T,%20R%3E,%20x%20:%20A%29)
- SmartPy: [Lambdas](https://smartpy.io/manual/syntax/lambdas)
- LIGO: [Anonymous functions](https://ligolang.org/docs/language-basics/functions#anonymous-functions-aka-lambdas)
- [Simplified DAO contract](https://opentezos.com/smart-contracts/simplified-contracts/#dao-decentralized-autonomous-organization)

## Tickets {#tickets}

A ticket is a data type that includes security mechanisms that make it suitable for issuing new tokens or granting portable permissions.
Tickets cannot be duplicated, so a single contract is always in control of a ticket.
In this way, a ticket can represent control over something or permission to do something.

A ticket contains three pieces of information:

- The address of the contract that created it, called the _ticketer_
- Some data with a type and value assigned by the contract, called the _wrapped value_ or the _payload_ of the ticket
- An amount in the form of a natural number

Tickets have a type, which is based on the type of the data.
For example, a ticket with a payload of a string value is referred to as a "string ticket."

The ticket's information is public and can be read by any contract that holds the ticket.

### Passing tickets

Contracts can pass tickets to entrypoints to change which contract is in control of the ticket.
If contract A passes a ticket to contract B, contract A loses all access to the ticket.
Contracts can pass tickets to other contracts via entrypoints accepting a ticket of the correct type; contracts can also pass tickets to user accounts.

### Ticket features

There are three main features at the core of tickets, each associated with one of its three pieces of information:

#### Guaranteed origin

The ticketer address always refers to the contract that created the ticket.
Contracts can't change the ticketer address or create tickets that reference other contracts as the creator.

#### Immutability of the wrapped value

The data stored in a ticket (the wrapped value) can't be changed after the creation of the ticket, even by the contract that created it.

#### Splitting and joining tickets

The contract that creates the ticket sets the initial amount to any natural number.
From then on, contracts that control tickets can change them in the following ways:

- `SPLIT_TICKET`: A contract splits a ticket into two tickets.
Both new tickets have the same ticketer address and payload, but the amount of the initial ticket is split between the two.
The initial ticket is destroyed.
- `JOIN_TICKETS`: A contract merges two tickets into a single ticket.
The tickets must have the same ticketer address and payload.
The new ticket has the same ticketer address and payload as the originals, and its amount is the sum of the amounts of the joined tickets.
The two initial tickets are destroyed.

For example, a contract can create a single ticket with a large amount and send it to another contract.
The other contract can split the ticket and send the resulting tickets to other contracts, which can split and join the ticket.
Eventually, many contracts may have a ticket that was split from the original or one of its descendants.
The ticketer address and payload stays the same for all of these tickets and the sum of the amounts is always the same as the amount of the original ticket.

:::note Differentiating tickets
Because the only identifying information of a ticket is the address of the contract that created it and its payload, it is possible to create multiple indistinguishable tickets.
For example, a contract can create multiple tickets with the same payload.
After other contracts split and join these tickets, there is no on-chain way to tell which descendant ticket can from which original ticket.
For this reason, your code should verify the address of the contract that mints tickets before trusting them.
:::

### Benefits of tickets used as tokens

The key benefit of `tickets` is that they continue existing independently of the contract that issued them.
This is very different from how tokens are usually managed, such as tokens that use the FA 1.2 or FA 2 standards.
Such tokens are fully under the control of the issuing contract; for example, transferring such a token may only be done by calling the smart contract that issued it.
Wrapping can be used as a way to work around this, but this is not technically transferring the token itself.
This helps bring extra trust in the value of the tokens represented by tickets, because there is no risk of the tokens suddenly becoming unusable if the issuing contract fails.
Tickets increase the decentralization of tokens and make them behave more like the native tez token, but with many more features and additional trust.

### Operations on tickets

Contracts can run these operations on tickets:

- Creating a new ticket with a given content and amount, and the current contract as the ticketer (`TICKET`)
- Reading a ticket, which returns the three values contained in the ticket plus the ticket itself (`READ_TICKET`)
- Splitting a ticket into two tickets with the same content and ticketer, but splitting the amount (`SPLIT_TICKET`)
- Joining two tickets that have the same content and ticketer into a new ticket with the sum of the amounts (`JOIN_TICKETS`)

### Implementation details

- Michelson: [Operations on tickets](https://tezos.gitlab.io/active/michelson.html#operations-on-tickets)
- LIGO: [Tickets](https://ligolang.org/docs/reference/current-reference#tickets)
- Archetype: [create_ticket and related](https://archetype-lang.org/docs/reference/expressions/builtins/#create_ticket%28s%20:%20T,%20n%20:%20nat%29)
- SmartPy: [Tickets](https://smartpy.io/manual/syntax/tickets)
