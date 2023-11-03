---
title: Testing Smart Contracts
author: 'Yuxin Li'
lastUpdated: 2nd November 2023
---

## Introduction
Since smart contracts on the Tezos blockchain are immutable post-deployment, rigorous testing is paramount to ensure functionality, prevent errors, and avoid potential financial losses. Importantly, contract testing doesn't require any tokens or a wallet account to execute.

## Testing smart contracts
### Setting up a Testing Environment
SmartPy includes an integrated testing framework that emulates the Tezos blockchain environment, allowing for comprehensive testing without real token expenditure.

For LIGO developers, `ligo-mockup` is recommended for simulating contract execution and testing the contract's logic.

### Writing Automated Tests
Automated testing is crucial for verifying the correctness and security of your smart contract. Your test suite should include:
- **Functionality Tests**: Verifying that all contract functions perform as intended under normal conditions.
- **Edge Cases**: Testing how the contract deals with unexpected or extreme inputs to ensure robustness.
- **Security Tests**: Checking for common security issues, such as reentrancy attacks, integer overflows, and underflows to ensure the contract is not vulnerable to exploits.
- **Gas Optimization**: Ensuring that the contract operations are gas-efficient, conserving resources and minimizing transaction fees.

### Runing Tests
To run the tests:

1. Set up your preferred testing framework according to the documentation.
1. Write test scripts that systematically work through each function and potential interaction with the contract.
1. Execute these tests in your local environment or using a testnet to avoid incurring real-world transaction costs.

### Compiling the smart contract to Michelson
Before deploying the smart contract, you need to compile it into a form that the Tezos blockchain can execute.
Steps for compilation are as follows:

1. **Syntax Validation**: The first step of the compilation is to check the syntax. Your chosen IDE or text editor might highlight syntax errors as you write the code.
1. **Static Analysis**: Tools are available for some languages, like LIGO, to perform static analysis. This analysis can catch common mistakes before compilation.
1. **Compilation Command**: Use the compiler or CLI tool associated with your smart contract language to compile the code. For example, for SmartPy, you would use the [SmartPy online IDE](https://smartpy.io/ide) to compile your .py file into Michelson.

Upon successful compilation, your smart contract is ready for the deployment! In the next section, we will explore how to deploy a smart contract.