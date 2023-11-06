---
title: Testing smart contracts
author: 'Yuxin Li'
lastUpdated: 6th November 2023
---

## Introduction
Because Tezos blockchain smart contracts are immutable after deployment, you must rigorously test to ensure functionality, prevent errors, and avoid potential financial losses. Importantly, contract testing doesn't require any tokens or a wallet account to execute.

## Testing smart contracts
### Setting up a testing environment
SmartPy features an integrated testing framework that emulates the Tezos blockchain environment, enabling comprehensive testing without spending real tokens.

We recommend LIGO developers use `ligo-mockup` to simulate contract execution and test the contract's logic.

### Writing automated tests
Verifying the correctness and security of your smart contract is crucial through automated testing. Your test suite must include:
- Functionality Tests: Verifying that all contract functions perform as intended under normal conditions.
- Edge Cases: Testing how the contract deals with unexpected or extreme inputs to ensure robustness.
- Security Tests: Checking for common security issues, such as reentrancy attacks, integer overflows, and underflows to ensure the contract is not vulnerable to exploits.
- Gas Optimization: Ensuring that the contract operations are gas-efficient, conserving resources and minimizing transaction fees.

### Runing tests
To run the tests:

1. Set up your preferred testing framework according to the documentation.
1. Write test scripts that systematically work through each function and potential interaction with the contract.
1. Execute these tests in your local environment or using a testnet to avoid incurring real-world transaction costs.

### Compiling the smart contract to Michelson
Before deploying the smart contract, you need to compile it into a form that the Tezos blockchain can execute.
Steps for compilation are as follows:

1. Syntax Validation: Checking the syntax is the first step in compilation. Your chosen IDE or text editor might highlight syntax errors as you write the code.
1. Static Analysis: Some languages, like LIGO, offer tools you can use to perform static analysis. This analysis helps you catch common mistakes before you compile.
1. Compilation Command: Use the compiler or CLI tool associated with your smart contract language to compile the code. For example, for SmartPy, you would use the [SmartPy online IDE](https://smartpy.io/ide) to compile your .py file into Michelson.

Upon successful compilation, you can deploy your smart contract! 