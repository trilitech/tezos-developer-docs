---
id: token-standards
title: Token Standards
author: Aymeric Bethencourt
lastUpdated: 10th July 2023
---

In the blockchain ecosystem, any digitally transferable asset between two people is called a **token**. Tokens can be native to a blockchain, e.g., BTC is the native token of Bitcoin or tokens can also be created and hosted on an existing blockchain via a smart contract. Some tokens, called [stablecoins](/defi/stablecoins), follow the price of fiat currencies (e.g., USD, EUR). Others, called [_NFT_](/defi/token-standards#fungible--non-fungible-tokens), can represent collectibles or art pieces. Finally, tokens can represent rights of ownership of real-world estates or companies (i.e., [stock tokens](https://www.investopedia.com/terms/t/tokenized-equity.asp)). In this chapter, we will see the main types of tokens and the token standards on Tezos.

## Token standard

A token standard is an interface, and a set of rules, that a smart contract must follow to be compatible with the common standards. Typically, token standards define how tokens can be transferred and how to keep a consistent record of those transfers.

Multiple implementations of a standard can co-exist, but they must all respect the interface and rules of the standard. Standards ensure that smart contracts remain compatible, so for instance, when a new project issues a token, it remains compatible with the existing decentralized exchanges, wallets, etc.

{% figure src="/images/token-standards/standards.svg" alt="token-standard-implementation" caption="FIGURE 1: Illustration of 2 implementations of the same token standard" %} {% /figure %}

## Fungible & Non-Fungible Tokens

The most basic token is the _Fungible Token_, i.e., a class of identical, interchangeable tokens. For instance, two _Ctez_ tokens are identical and interchangeable, just like a US dollar is identical and interchangeable with another US dollar. Both are exactly the same as the other.

However, a token can represent much more than a fungible asset. For instance, a concert ticket in the front row is obviously not equivalent to a concert ticket in the last row. These tickets are part of the same class (i.e., concert tickets), but they are not interchangeable: they are non-fungible. Two pieces of art are also non-fungible. The ownership of these assets can be coded with a _Non-Fungible Token_ (or _NFT_ for short) and then bought, sold, exchanged, etc., just like any other token. NFTs are particularly interesting as collectibles because their scarcity can be demonstrated and proven by the blockchain (i.e. an owner can prove that he has the only copy in the whole world).

## Token standards on Tezos

### FA1.2

The FA1.2 standard (standing for _Financial Application 1.2_) refers to a fungible token standard for Tezos.

At its core, FA1.2 implements a ledger that maps identities to balances. This ledger implements token transfer operations, as well as approvals for spending tokens from other accounts.


The FA1.2 specification is described in detail in the [TZIP-7 proposal](https://tzip.tezosagora.org/proposal/tzip-7/).

### FA2

The FA2 standard (standing for _Financial Application 2_) refers to the unified token standard on Tezos. It supports a wide range of token types:

- fungible (equivalent to [ERC-20](https://ethereum.org/en/standards/tokens/) on Ethereum),
- non-fungible (equivalent to [ERC-721](https://ethereum.org/en/standards/tokens/) on Ethereum),
- non-transferable (equivalent to [ERC-1238](https://ethereum.org/en/standards/tokens/) on Ethereum),
- as well as multi-asset contracts (equivalent to [ERC-1155](https://ethereum.org/en/standards/tokens/) on Ethereum).

As you can see, FA2 is a very powerful standard that allows many forms of tokens. It aims to provide significant expressivity to contract developers, allowing them to create new types of tokens while maintaining a common interface standard for wallet integrators and external developers. A variety of transfer permission policies can also be defined, such as how most tokens can be transferred, who can perform a transfer, and who can receive tokens. A token contract can be designed to support a single token type or multiple token types to optimize batch transfers and atomic swaps. A particular FA2 implementation may include hybrid implementations where multiple token kinds (fungible, non-fungible, non-transferable etc) can coexist (e.g. in a fractionalized NFT contract).

Note that FA2 is the successor to [FA1.2](/defi/token-standards#fa12) that only supports fungible tokens, it is still widely used in the Tezos ecosystem.


To learn more on how to implement FA2 tokens, please refer to the corresponding Tezos Improvments Proposal, the TZIP-12[[3]](/defi/token-standards#references).

{% figure src="/images/token-standards/tokens.svg" alt="fa2-token-standard" caption="FIGURE 2: Illustration of the multi-purpose aspect of the FA2 token standard." %} {% /figure %}

To learn more on how to implement FA2 tokens, please refer to the corresponding Tezos Improvements Proposal, the [TZIP-12](https://tzip.tezosagora.org/proposal/tzip-12/).

## Regulations

If you plan to create a token, make sure to check the regulations in your country. There are rules to follow depending on the type of token you are creating, its representation, and the taxes to be paid. [In Europe, the law text MICA will soon be effective.](https://data.consilium.europa.eu/doc/document/ST-13198-2022-INIT/en/pdf)

## Risks

Always be cautious as anyone can create tokens on Tezos. Before purchasing a token, make sure to question its value. Is the smart contract of the token open-source? Has it been audited? Is there a hard cap? Indeed, any rule regarding creating tokens or their transfer can be coded into the smart contract. For instance, uncapped tokens could be infinitely minted by their author, rendering their value null.

{% callout type="warning" title="Warning" %}
    Keep in mind that holding a token in your wallet doesn't, in itself, guarantee that your token is safe.

    Indeed, holding a token means that the token's smart contract holds a record that associates your public address with a balance. But if the smart contract is malicious or has bugs, that record could be altered, erased, or frozen, making your tokens unusable even if they are in your wallet.
{% /callout %}

## Resources on Tezos

- **[FA1.2](https://tzip.tezosagora.org/proposal/tzip-7/)**: Specification of the FA1.2 standard for fungible tokens.
- **[FA2](https://tzip.tezosagora.org/proposal/tzip-12/)**: Specification of the FA2 standard for a unified token contract interface.
- **[tzNFT](https://github.com/tqtezos/nft-tutorial)**: A tutorial showing users how to originate and interact with the FA2 NFT contract implementation.
- **[OpenMinter](https://github.com/tqtezos/minter)**: A reusable app that allows anyone to create and collect NFTs on Tezos.
- **[Peppermint](https://github.com/tzConnectBerlin/peppermint)**: A tool for batch minting/transferring tokens.
- **[Claimz](https://gitlab.com/nomadic-labs-free-resources/claimz)**: A tool to create NFT giveaways.
