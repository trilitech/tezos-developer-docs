---
id: modules
disable_pagination: true
title: Welcome to OpenTezos
sidebar_label: Modules
slug: /
authors: Aymeric Bethencourt
---

import NotificationBar from '../../../src/components/docs/NotificationBar';
import CardsWrapper from '../../../src/components/docs/Cards/CardsWrapper';
import OverlayCard from '../../../src/components/docs/Cards/OverlayCard';

:::info
Starting from Octez release 15.0, the Octez binaries will be named "octez-*" (e.g. "octez-client", "octez-node" instead of "tezos-client", "tezos-node"). These renamings are already in place on the "master" branch. The legacy names ("tezos-*") are still used in the [official documentation](https://tezos.gitlab.io/) for now and will be supported through symbolic links until the majority of users will upgrade to releases >= 15.0.
:::

Welcome Tezos Developers! Explore the technical and economic concepts behind the Tezos Network, experiment with our tutorials, or start building your own Tezos Dapp. Each module will teach you a full concept of Tezos.

<NotificationBar>
  <p>
    See an error somewhere? Fix it with a <a href="https://gitlab.com/tezos-paris-hub/opentezos" target="_blank">Gitlab Merge Request here</a>. OpenTezos is a constantly evolving platform that welcome all readers inputs. You can even add a new chapter or module if wish.
  </p>
</NotificationBar>

### Modules

<CardsWrapper>
  <OverlayCard
      description="What is a blockchain and how it works."
      icon="img/icons/blockchain-big-light.svg"
      iconDark="img/icons/blockchain-big-dark.svg"
      title="Blockchain Basics"
      to="/blockchain-basics"
  />
  <OverlayCard
      description="What is Tezos and how it works."
      icon="img/icons/tezos-big-light.svg"
      iconDark="img/icons/tezos-big-dark.svg"
      title="Tezos Basics"
      to="/tezos-basics"
  />
  <OverlayCard
      description="Learn the basics of smart contracts"
      icon="img/icons/handshake-big-light.svg"
      iconDark="img/icons/handshake-big-dark.svg"
      title="Smart Contracts"
      to="/smart-contracts/simple-nft-contract-1"
  />
  <OverlayCard
      description="How to deploy your own Tezos node."
      icon="img/icons/node-big-light.svg"
      iconDark="img/icons/node-big-dark.svg"
      title="Deploy a node"
      to="/deploy-a-node"
  />
  <OverlayCard
      description="Learn to use and interact with a Tezos explorer."
      icon="img/icons/explorer-big-light.svg"
      iconDark="img/icons/explorer-big-dark.svg"
      title="How to use an Explorer"
      to="/explorer"
  />
  <OverlayCard
      description="Learn the basics of the Archetype smart contract language."
      icon="img/icons/archetype-big-light.svg"
      iconDark="img/icons/archetype-big-dark.svg"
      title="Archetype"
      to="/archetype"
  />
  <OverlayCard
      description="Learn the basics of the SmartPy smart contract language."
      icon="img/icons/smartpy-big-light.svg"
      iconDark="img/icons/smartpy-big-dark.svg"
      title="SmartPy"
      to="/smartpy"
  />
    <OverlayCard
      description="Learn the basics of the LIGO smart contract language."
      icon="img/icons/ligo-big-light.svg"
      iconDark="img/icons/ligo-big-dark.svg"
      title="LIGO"
      to="/ligo"
  />
  <OverlayCard
    description="Learn the basics of the native Tezos smart contract language."
    icon="img/icons/michelson-big-light.svg"
    iconDark="img/icons/michelson-big-dark.svg"
    title="Michelson"
    to="/michelson"
  />
  <OverlayCard
    description="Everything you need to build your first Tezos Dapp."
    icon="img/icons/dapp-big-light.svg"
    iconDark="img/icons/dapp-big-dark.svg"
    title="Build a Dapp"
    to="/dapp"
  />
  <OverlayCard
    description="What is baking and how it works."
    icon="img/icons/baking-big-light.svg"
    iconDark="img/icons/baking-big-dark.svg"
    title="Baking"
    to="/baking"
  />
  <OverlayCard
    description="How to deploy your own bakers."
    icon="img/icons/baker-big-light.svg"
    iconDark="img/icons/baker-big-dark.svg"
    title="Deploy Bakers"
    to="/baking/cli-baker"
  />
  <OverlayCard
    description="Automated market maker, stablecoins, flash loans, synthetics, etc."
    icon="img/icons/defi-big-light.svg"
    iconDark="img/icons/defi-big-dark.svg"
    title="DeFi"
    to="/defi"
  />
  <OverlayCard
    description="Integrate authentication, in-games assets and achievents"
    icon="img/icons/gaming-big-light.svg"
    iconDark="img/icons/gaming-big-dark.svg"
    title="Gaming"
    to="/gaming"
  />
  <OverlayCard
    description="Take back control of your digital identity."
    icon="img/icons/self-sovereign-identity-light.svg"
    iconDark="img/icons/self-sovereign-identity-dark.svg"
    title="Self-Sovereign Identity"
    to="/self-sovereign-identity"
  />
  <OverlayCard
    description="Introduction to the concepts of formal verifications."
    icon="img/icons/formal-big-light.svg"
    iconDark="img/icons/formal-big-dark.svg"
    title="Formal Verification"
    to="/formal-verification"
  />
  <OverlayCard
    description="Create your own private Tezos network."
    icon="img/icons/private-big-light.svg"
    iconDark="img/icons/private-big-dark.svg"
    title="Private Blockchain"
    to="/private"
  />
  <OverlayCard
    description="Contribute to the Tezos ecosystem."
    icon="img/icons/contribute-big-light.svg"
    iconDark="img/icons/contribute-big-dark.svg"
    title="How to contribute"
    to="/contribute"
  />
</CardsWrapper>
