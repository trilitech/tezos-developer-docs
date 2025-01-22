---
title: Tokens
authors: "Claude Barde, Aymeric Bethencourt, Tim McMackin"
last_update:
  date: 26 July 2024
---

In a blockchain ecosystem, a digital asset that can be transferred between accounts is called a _token_.

Like other blockchains, Tezos relies on a native token in which transaction fees are paid.
The native token of Tezos is tez (also known as XTZ or represented by the symbol ꜩ).

But other tokens representing some value in digital form can be programmed in a blockchain, for instance using smart contracts.
Tokens fall in two broad categories:

- Fungible tokens, which are interchangeable and represent the same value,
- Non-fungible tokens (NFTs), which are unique digital assets that model the ownership of some digital or real object

Many types of fungible tokens are already implemented in Tezos, including:

- Stablecoins, which are tied to the price of fiat currencies such as USD and EUR
- Wrapped tokens, which represent tokens from another blockchain or another standard; see [Wrapped tokens](#wrapped-tokens)

Tezos is also used as a platform for owning and exchanging various types of NFTs.

In most cases, (non-native) tokens are managed by smart contracts.
They are not stored directly in accounts; instead, smart contracts keep a ledger of how many tokens each account holds.

However, Tezos also offers a built-in abstraction called tickets, which are fungible tokens that can be created by smart contracts in limited quantity (possibly only one), but whose ownership are directly tracked by the blockchain.

To start right away using tokens, see these tutorials:

- [Create NFTs from a web application](/tutorials/create-nfts)
- [Create a fungible token with the SmartPy FA2 library](/tutorials/smartpy-fa2-fungible)
- [Build a simple web application](/tutorials/build-your-first-app)

## Fungible tokens

Fungible tokens are collections of identical, interchangeable tokens, just like one US dollar or Euro is the same as any other US dollar or Euro.

A contract that manages fungible tokens has a ledger that maps account IDs to an amount of tokens, as in this example:

Account address | Balance
--- | ---
tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx | 5
tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD | 12
tz1Z2iXBaFTd1PKhEUxCpXj7LzY7W7nRouqf | 3

When an account transfers tokens to another account, it sends the transaction to the smart contract, which deducts the amount of tokens from its balance in the ledger and adds it to the target account's balance.

In practice, a single contract can manage multiple types of fungible tokens.
Therefore, its ledger uses a combination of the account address and token ID as the key, as in this example:

key | value
--- | ---
tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx, token ID 0 | 10
tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx, token ID 1 | 2
tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx, token ID 2 | 1
tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx, token ID 4 | 5
tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD, token ID 1 | 2
tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD, token ID 2 | 8
tz1hQKqRPHmxET8du3fNACGyCG8kZRsXm2zD, token ID 3 | 14

## Non-fungible tokens (NFTs)

A non-fungible token represents something unique, and therefore it is not interchangeable with any other token.
An NFT can represent a specific piece of art, a specific seat at a specific event, or a role that can be held by only one person.
Therefore, a contract that manages NFTs has a ledger that shows the token ID and the owner's account, as in this example:

Token ID | Account address
--- | ---
0 | tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx
1 | tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx
2 | tz1Z2iXBaFTd1PKhEUxCpXj7LzY7W7nRouqf

When an account transfers an NFT to another account, it sends the transaction to the smart contract, which replaces the existing owner of the token with the target account as the new owner of the token.

## Regulations

If you plan to create a token, make sure to check the regulations that govern tokens in your country.
These rules may include security requirements, information disclosure requirements, and taxes.
For example, the markets in crypto-assets (MiCA) regulation governs blockchain tokens in the European Union.

## Risks

Always be cautious when creating, working with, and buying tokens.
Anyone can write smart contracts to create tokens and define how they behave, so you must evaluate tokens before buying or working with them.
Consider these questions:

- Is the high-level language code of the smart contract open source?
- Has the contract been audited?
- Is there a limit on the number of tokens or can the contract create any number of tokens?
- What are the rules for creating or transferring tokens?

Remember that holding a token usually means that the contract's ledger has a record that maps an account address to a balance of tokens.
Therefore, if the smart contract is malicious or has flaws, the ledger could be changed, erased, or frozen and the tokens could be stolen, destroyed, or made unusable.

## Token standards

While you can create tokens that behave in any way that you want them to behave, it's best to create tokens that follow a standard.
Token standards in a blockchain ecosystem are important for many reasons, including:

- They enforce best practices that improve the safety of the code that the tokens depend on
- They provide an interface that makes it easier for applications to work with them, such as a consistent way of transferring tokens from one account to another

When a project issues a new token that is compatible with a standard, existing decentralized exchanges, tools, wallets, applications, and block explorers can work with it and display it appropriately.
For example, block explorers can detect a standard-compliant contract and automatically show the tokens in the contract.
Also, the Octez client has dedicated commands for working with FA1.2 tokens, including transferring them and checking account balances.

A token standard is an interface and set of rules that smart contracts must follow to be compatible with the standard.
In Tezos, smart contracts define how tokens behave, such as how to transfer them between accounts, so it's the smart contract that actually follows the standard, but people often refer to tokens that are compatible with a certain standard.

Tezos provides two standards for tokens.
The standard that you use for your tokens depends on the kind of tokens that you want to create.
These standards are named with the prefix FA, which stands for _financial application_.

- [FA1.2](/architecture/tokens/FA1.2) tokens are fungible tokens
- [FA2](/architecture/tokens/FA2) tokens can be multiple types of tokens, including fungible and non-fungible tokens, and a single smart contract that follows this standard can create multiple types of tokens
- [FA2.1](/architecture/tokens/FA2.1) tokens can be multiple types of tokens like FA2 tokens, and they include features of FA1.2 tokens and of tickets

You can use templates for smart contracts adhering to these standards, instead of writing your own contract from scratch:

- For SmartPy templates, see [Tokens](https://smartpy.io/guides/tokens/) in the SmartPy documentation.
- For LIGO templates, see the [`@ligo/fa`](https://packages.ligolang.org/package/@ligo/fa) package.
- For Archetype templates, see [Templates](https://archetype-lang.org/docs/templates/overview/) in the Archetype documentation.

## Wrapped tokens

A wrapped token represents a token in a different context.
For example, tzBTC and ETHtz are Tezos tokens that represent tokens from the Bitcoin and Ethereum blockchains.
Tezos users can trade these wrapped tokens on Tezos and exchange them for the native Bitcoin and Ethereum tokens later.

:::danger
The wrapped version of a token has no formal or official relationship to the original token.
Instead, users create tokens that they call wrapped tokens and provide smart contracts to allow users to exchange the tokens for the wrapped tokens and vice versa.
You might imagine that the wrapped version of a token is the token with a wrapper around it that lets it operate in a new location or according to a new standard, but it is really an entirely different token.
Like all tokens, you must use caution when using a wrapped token.
:::
