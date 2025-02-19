---
title: Operations
authors: 'Mathias Hiron (Nomadic Labs), Sasha Aldrick (TriliTech), Tim McMackin (TriliTech)'
last_update:
  date: 5 October 2023
---

The execution of the code of an entrypoint can have only two effects:

- Changing the value of the storage of the contract
- Generating new operations that run after the entrypoint execution is over

These operations can include:

- Transferring tez to an account or to a smart contract entrypoint (`TRANSFER_TOKENS`)
- Originating a new smart contract (`CREATE_CONTRACT`)
- Setting the delegate of the current smart contract (`SET_DELEGATE`)

Only the first type is technically a transaction, but the terms "operation" and "transaction" are often used interchangeably in courses, documentation, and tools.
Don't worry too much about the difference.

## Order of execution

The code of a contract never directly executes an operation or a transfer of tez.
Instead, it adds operations to a list and the list is added to a stack of operations to run after code of the entrypoint is complete.

The operations generated by a contract are executed in the order that they are added to the list.
All the operations generated by a contract and the operations these end up generating are executed before any other operations previously added to the stack.

For example, if a contract generates operations A and B, and operation A generates operation C, operation C runs before operation B.

## Operation examples

For example, assume three contracts named A, B, and C that each have an entrypoint named "Start."
Contract A's storage has a value named "text," which is a string.
Contract A also has an entrypoint named "Add," which adds text to the storage string based on a string that the sender passes.

This table shows the logic of the entrypoints:

{<table>
  <caption>Entrypoint Logic</caption>
  <tbody>
    <tr>
      <td>Contract A</td>
      <td>Contract B</td>
      <td>Contract C</td>
    </tr>
    <tr>
      <td>
        <ul>
          <li><code>start()</code>:<ol>
              <li>Replace text with "Start A,"</li>
              <li>Call B.start()</li>
              <li>Call C.start()</li>
              <li>Append "End A" to text</li>
            </ol>
          </li>
          <li><code>add(str)</code>:<ol>
              <li>Append <code>str</code> to text</li>
            </ol>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li><code>start()</code>:<ol>
              <li>Call A.add("Start B,")</li>
              <li>Call A.add("End B,")</li>
            </ol>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li><code>start()</code>:<ol>
              <li>Call A.add("Start C,")</li>
              <li>Call A.add("End C,")</li>
            </ol>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>}

## Operation Walkthrough

If a user calls `A.start()`, the following happens:

1. `A.start()` runs:
   1. Replaces its storage text with "Start A,"
   1. Adds operation` B.start()` to the list of operations
   1. Adds operation `C.start()` to the list of operations
   1. Adds "End A," to its storage, which becomes "Start A, End A"
   1. Pushes the operations from the list `[B.start(), C.start()]` to the stack;` B.start()` is on the top
1. `B.start()` runs:
   1. Adds operation `A.add("Start B,")` to the list of operations
   1. Adds operation `A.add("End B,")` to the list of operations
   1. Pushes the operations from the list `[A.add("Start B,"), A.add("End B,")]` to the top of the stack; the operation stack is now `[A.add("Start B,"), A.add("End B,"), C.start()]`
1. `A.add("Start B")` runs:
   1. Replaces its storage with "Start A,End A,Start B,"
1. `A.add("End B")` runs:
   1. Replaces its storage with "Start A,End A,Start B,End B,"
1. `C.start()` runs:
   1. Adds operation `A.add("Start C,")` to the list of operations
   1. Adds operation `A.add("End C,")` to the list of operations
   1. Pushes the operations from the list `[A.add("Start C,"), A.add("End C,")]` to the top of the stack
1. `A.add("Start C")` runs:
   1. Replaces its storage with "Start A,End A,Start B,End B,Start C,"
1. `A.add("End C")` runs:
   1. Replaces its storage with "Start A,End A,Start B,End B,Start C, End C,"

At the end of all operations, A's storage is "Start A,End A,Start B,End B,Start C, End C,".

To summarize:

- All of the code in an entrypoint runs before the operations it generates run
- If a contract A generates a call to a contract B then a call to a contract C, all of the operations generated by B run before contract C runs.
- If any of these operations cause a failure, everything is cancelled, including operations that have already completed.

## Implementation details

- Michelson: [Operations](https://tezos.gitlab.io/michelson-reference/#type-operation)
- Archetype: [Operation](https://archetype-lang.org/docs/reference/instructions/operation)
- LIGO: [Inter-contract invocations](https://ligolang.org/docs/advanced/entrypoints-contracts#inter-contract-invocations)
- SmartPy: [Operations](https://smartpy.io/manual/data-types/operations)
