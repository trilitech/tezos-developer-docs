/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  documentationSidebar: [
    {
      type: 'category',
      label: 'Overview',
      link: {
        id: 'overview/index',
        type: 'doc',
      },
      items: [
        'overview/glossary',
        'overview/resources',
      ],
    },
    {
      type: 'category',
      label: 'Using Tezos',
      link: {
        id: 'using',
        type: 'doc',
      },
      items: [
        'using/user-accounts',
        'using/wallets',
        'using/dapps',
        // 'using/transactions',
        'using/staking',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: {
        id: 'architecture',
        type: 'doc',
      },
      items: [
        'architecture/nodes',
        'architecture/bakers',
        'architecture/accusers',
        'architecture/accounts',
        {
          type: 'category',
          label: 'Tokens',
          link: {
            id: 'architecture/tokens',
            type: 'doc',
          },
          items: [
            'architecture/tokens/FA1.2',
            'architecture/tokens/FA2',
            'architecture/tokens/FA2.1',
          ],
        },
        'architecture/smart-rollups',
        'architecture/data-availability-layer',
        {
          type: 'category',
          label: 'Governance',
          link: {
            id: 'architecture/governance',
            type: 'doc',
          },
          items: [
            'architecture/governance/amendment-history',
            'architecture/governance/improvement-process',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developing on Tezos',
      link: {
        id: 'developing',
        type: 'doc',
      },
      items: [
        'developing/wallet-setup',
        'developing/testing',
        'developing/testnets',
        'developing/sandbox',
        'developing/ipfs',
        {
          type: 'category',
          label: 'The Octez client',
          link: {
            id: 'developing/octez-client',
            type: 'doc',
          },
          items: [
            'developing/octez-client/installing',
            'developing/octez-client/accounts',
            'developing/octez-client/transactions',
          ],
        },
        {
          type: 'category',
          label: 'Getting information about the blockchain',
          link: {
            id: 'developing/information',
            type: 'doc',
          },

          items: [
            'developing/information/block-explorers',
            'developing/information/indexers',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Smart contracts',
      link: {
        id: 'smart-contracts',
        type: 'doc',
      },
      items: [
        'smart-contracts/samples',
        {
          type: 'category',
          label: 'Languages',
          link: {
            type: 'doc',
            id: 'smart-contracts/languages',
          },
          items: [
            'smart-contracts/languages/ligo',
            'smart-contracts/languages/smartpy',
            'smart-contracts/languages/archetype',
            'smart-contracts/languages/michelson',
          ],
        },
        {
          type: 'category',
          label: 'Data types',
          link: {
            type: 'doc',
            id: 'smart-contracts/data-types',
          },
          items: [
            'smart-contracts/data-types/primitive-data-types',
            'smart-contracts/data-types/complex-data-types',
            'smart-contracts/data-types/crypto-data-types',
          ],
        },
        {
          type: 'category',
          label: 'Logic',
          items: [
            'smart-contracts/logic/comparing',
            'smart-contracts/logic/loops',
            'smart-contracts/logic/operations',
            'smart-contracts/logic/errors',
          ],
        },
        'smart-contracts/creating',
        'smart-contracts/deploying',
        'smart-contracts/entrypoints',
        'smart-contracts/storage',
        'smart-contracts/special-values',
        'smart-contracts/constants',
        'smart-contracts/serialization',
        'smart-contracts/sapling',
        'smart-contracts/views',
        'smart-contracts/events',
        'smart-contracts/delegation',
        'smart-contracts/multisig',
        'smart-contracts/timelocks',
        'smart-contracts/oracles',
      ],
    },
    {
      type: 'category',
      label: 'Decentralized applications (dApps)',
      link: {
        id: 'dApps',
        type: 'doc',
      },
      items: [
        'dApps/samples',
        // 'dApps/creating', //TODO
        'dApps/wallets',
        'dApps/sending-transactions',
        'dApps/taquito',
        // 'dApps/frameworks', // TODO
        // Hide defi for now because the content is very outdated
        // 'dApps/defi',
        // 'dApps/scaling', // TODO
        // 'dApps/testing',
        // 'dApps/deploying',
        'dApps/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Tezos Unity SDK',
      link: {
        id: 'unity',
        type: 'doc',
      },
      items: [
        'unity/quickstart',
        'unity/connecting-accounts',
        'unity/calling-contracts',
        'unity/managing-tokens',
        'unity/upgrading',
        {
          type: 'category',
          label: 'Reference',
          link: {
            id: 'unity/reference',
            type: 'doc',
          },
          items: [
            'unity/reference/API',
            'unity/reference/events',
            'unity/reference/DataProviderConfigSO',
            'unity/reference/TezosConfigSO',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/style-guide',
        'reference/textfiles',
        {
          type: 'link',
          label: 'Whitepaper',
          href: 'https://tezos.com/whitepaper.pdf',
        },
        {
          type: 'link',
          label: 'Position paper',
          href: 'https://tezos.com/position-paper.pdf',
        },
      ],
    },
  ],
  tutorialsSidebar: [
    {
      type: 'doc',
      label: 'Tutorials home',
      id: 'tutorials',
    },
    {
      type: 'html',
      value: '<div>Beginner</div>',
      className: 'menu__divider',
    },
    {
      type: 'category',
      label: 'Deploy a smart contract',
      link: {
        type: 'doc',
        id: 'tutorials/smart-contract',
      },
      items: [
        'tutorials/smart-contract/jsligo',
        'tutorials/smart-contract/cameligo',
        'tutorials/smart-contract/smartpy',
        'tutorials/smart-contract/archetype',
      ],
    },
    {
      type: 'category',
      label: 'Start with a minimum dApp and add new features',
      link: {
        type: 'doc',
        id: 'tutorials/dapp',
      },
      items: [
        'tutorials/dapp/part-1',
        'tutorials/dapp/part-2',
        'tutorials/dapp/part-3',
        'tutorials/dapp/part-4',
      ],
    },
    {
      type: 'html',
      value: '<div>Intermediate</div>',
      className: 'menu__divider',
    },
    {
      type: 'category',
      label: 'Build a simple web application',
      link: {
        type: 'doc',
        id: 'tutorials/build-your-first-app',
      },
      items: [
        'tutorials/build-your-first-app/setting-up-app',
        'tutorials/build-your-first-app/wallets-tokens',
        'tutorials/build-your-first-app/sending-transactions',
        'tutorials/build-your-first-app/getting-information',
      ],
    },
    {
      type: 'category',
      label: 'Create a fungible token with the SmartPy FA2 library',
      link: {
        type: 'doc',
        id: 'tutorials/smartpy-fa2-fungible',
      },
      items: [
        'tutorials/smartpy-fa2-fungible/basic-fa2-token',
        'tutorials/smartpy-fa2-fungible/minting-and-burning',
        'tutorials/smartpy-fa2-fungible/adding-metadata',
        'tutorials/smartpy-fa2-fungible/customizing-operations',
        'tutorials/smartpy-fa2-fungible/deploying-contract',
      ],
    },
    {
      type: 'category',
      label: 'Create NFTs',
      link: {
        type: 'doc',
        id: 'tutorials/create-nfts',
      },
      items: [
        'tutorials/create-nfts/setting-up-app',
        'tutorials/create-nfts/connect-wallet',
        'tutorials/create-nfts/send-transactions',
        'tutorials/create-nfts/create-contract',
        'tutorials/create-nfts/show-info',
        'tutorials/create-nfts/summary',
      ],
    },
    {
      type: 'category',
      label: 'Run a Tezos node in 5 steps',
      link: {
        type: 'doc',
        id: 'tutorials/join-dal-baker',
      },
      items: [
        'tutorials/join-dal-baker/run-node',
        'tutorials/join-dal-baker/prepare-account',
        'tutorials/join-dal-baker/run-dal-node',
        'tutorials/join-dal-baker/run-baker',
        'tutorials/join-dal-baker/verify-rights',
        'tutorials/join-dal-baker/conclusion',
      ],
    },
    {
      type: 'category',
      label: 'Bake using a Ledger device',
      link: {
        type: 'doc',
        id: 'tutorials/bake-with-ledger',
      },
      items: [
        'tutorials/bake-with-ledger/install-app',
        'tutorials/bake-with-ledger/setup-ledger',
        'tutorials/bake-with-ledger/setup-baker',
        'tutorials/bake-with-ledger/run-baker',
      ],
    },
    {
      type: 'html',
      value: '<div>Advanced</div>',
      className: 'menu__divider',
    },
    {
      type: 'category',
      label: 'Deploy a Smart Rollup',
      link: {
        type: 'doc',
        id: 'tutorials/smart-rollup',
      },
      items: [
        'tutorials/smart-rollup/set-up',
        'tutorials/smart-rollup/debug',
        'tutorials/smart-rollup/optimize',
        'tutorials/smart-rollup/deploy',
        'tutorials/smart-rollup/run',
      ],
    },
    {
      type: 'category',
      label: 'Build an NFT marketplace',
      link: {
        type: 'doc',
        id: 'tutorials/build-an-nft-marketplace',
      },
      items: [
        'tutorials/build-an-nft-marketplace/part-1',
        'tutorials/build-an-nft-marketplace/part-2',
        'tutorials/build-an-nft-marketplace/part-3',
        'tutorials/build-an-nft-marketplace/part-4',
      ],
    },
    {
      type: 'category',
      label: 'Learn and play with security',
      link: {
        type: 'doc',
        id: 'tutorials/security',
      },
      items: [
        'tutorials/security/part-1',
        'tutorials/security/part-2',
        'tutorials/security/part-3',
      ],
    },
    {
      type: 'category',
      label: 'Create a mobile game',
      link: {
        type: 'doc',
        id: 'tutorials/mobile',
      },
      items: [
        'tutorials/mobile/part-1',
        'tutorials/mobile/part-2',
        'tutorials/mobile/part-3',
        'tutorials/mobile/part-4',
      ],
    },
    {
      type: 'category',
      label: 'Implement a file archive with the DAL',
      link: {
        type: 'doc',
        id: 'tutorials/build-files-archive-with-dal',
      },
      items: [
        'tutorials/build-files-archive-with-dal/set-up-environment',
        'tutorials/build-files-archive-with-dal/get-dal-params',
        'tutorials/build-files-archive-with-dal/get-slot-info',
        'tutorials/build-files-archive-with-dal/publishing-on-the-dal',
        'tutorials/build-files-archive-with-dal/using-full-slot',
      ],
    },
  ],
};

module.exports = sidebars;
