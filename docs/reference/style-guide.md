---
title: Documentation style guide
authors: Tim McMackin
last_update:
  date: 15 January 2024
---

## Overall Tezos-related issues

- Tezos is decentralized.
There is no official Tezos documentation, no official Tezos strategy, and no official entity in charge of Tezos.
However, there can be official documentation for a Tezos-related tool.

- Do not compare Tezos to other specific blockchains.
You can say that Tezos has advantages over other blockchains, but don't say that Tezos is better than or does  things differently from another specific blockchain.

- Use "tez" to describe the currency instead of "XTZ" unless there is a specific reason to use the ISO code/ticker symbol "XTZ," such as in accounting systems, exchange rates with other currencies, and anything that needs a standardized code.

- Avoid using the ꜩ glyph in text.

- Do not use the term "initial coin offering (ICO)" or refer to Tezos "investors."
Instead, refer to the Tezos fundraiser.
See https://tezos.gitlab.io/user/key-management.html#getting-keys-for-fundraiser-accounts.

## Blockchain terminology

- Clients that send transactions to contracts are called "senders."

- The fields in a contract's storage are called "properties."

- Use the full forms "layer 1" and "layer 2" when talking about layers.
The abbreviations "L1" and "L2" (always capitalized) are acceptable later after you have introduced the concept of layers.

## Capitalization

Use sentence case for headings, such as "Connecting to wallets."

Capitalize these terms in text:

- Tezos
- Smart Rollups
- Specific network names such as Mainnet, Ghostnet, Dailynet, and Mumbainet
- Data Availability Layer
- Sapling
- JSON
- Web3

Capitalize the "A" in "dApp."

Do not capitalize these terms unless they are the first word in a sentence or if the capitalization style requires all major words to be capitalized:

- tez
- blockchain
- proof of stake
- proof of work
- smart contract
- testnet

## Emphasis

Use emphasis sparingly to avoid making the page too visually busy or complex.

- Use backticks for file names, variable names, and command names, not to emphasize words or denote technical terms

- Use bold for:

  - Buttons or links that the user must click or interact with

  - Very sparingly, to highlight important words and phrases, such as the words at the beginning of a definition list, such as in the [Glossary](../overview/glossary)

- Do not emphasize the names of web sites, pages, or UI elements that the user sees but does not interact with directly

- Use [admonitions](https://docusaurus.io/docs/markdown-features/admonitions) such as notes or warnings sparingly, only to denote warnings and critical issues

- Avoid parenthetical expressions

## Style and clarity

- Use terms and phrasings that are clear to people using translation or to non-native speakers of English.

- Use gender-neutral terminology.

- Use the same word to represent something, instead of varying words for variety.
For example, use "stake" consistently and do not substitute synonyms such as "deposit" and "retainer" to refer to the same thing.

- Do not use "as" or "since" to mean "because," as in "The system shows an error, as you have not connected your wallet yet."

- Do not use "once" to mean "after," as in "Once the system shuts down, you can safely remove the drive."

- Avoid Latinate abbreviations like e.g. and i.e.

- Provide the information about the target of a link.
For example, instead of saying "for information about smart contracts, click [here](https://docs.tezos.com/smart-contracts)," say "for information about smart contracts, see [Smart contracts](https://docs.tezos.com/smart-contracts)."
When linking to an external site, consider mentioning the target site, as in "for more information, see [Blockchain basics](https://opentezos.com/blockchain-basics) on opentezos.com.

- Do not describe documentation in terms of "chapters" or "articles."

- Avoid meta-phrases that don't add information.
For example, instead of "We will see how you can deploy smart contracts to Tezos by...," say "You can deploy smart contracts to Tezos by..."

- When writing steps that the user must follow, make it clear what the user must do by following these guidelines:

  - Make each action that the user does a numbered step.

  - Cover the action that the user does in the first sentence.

  - Use language that makes it clear that the user must do something and what that action is.
  For example, instead of "4. In the file `myFile.js`:", say "4. Add this code to the file `myFile.js`."

- Structure lists and headings in a consistent way.
  For example, make sure each list item is capitalized and punctuated in the same way.
  List items should be all complete sentences or all sentence fragments, not a mix.
