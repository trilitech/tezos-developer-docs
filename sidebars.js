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
        'overview/tezos-different',
        // 'overview/quickstart', // TODO
        'overview/common-applications',
        'overview/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      // link: { // TODO
      //   id: 'architecture',
      //   type: 'doc',
      // },
      items: [
        'architecture/protocol',
        'architecture/accounts',
        // { // TODO
        //   type: 'category',
        //   label: 'Baking',
        //   link: {
        //     id: 'architecture/baking',
        //     type: 'doc',
        //   },
        //   items: [
        //     'architecture/baking/running-nodes',
        //     'architecture/baking/delegating',
        //   ],
        // },
        'architecture/smart-rollups',
        // 'architecture/data-availability', // TODO
        {
          type: "category",
          label: "Governance",
          link: {
            id: 'architecture/governance',
            type: "doc",
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
      items: [
        'developing/dev-environments',
        'developing/testnets',
        // 'developing/sandbox', // TODO
        {
          type: 'category',
          label: 'Getting information about the blockchain',
          // link: { // TODO
          //   id: 'developing/information',
          //   type: 'doc',
          // },
          items: [
            {
              type: 'category',
              label: 'Block explorers',
              link: {
                id: 'developing/information/block-explorers',
                type: 'doc',
              },
              items: [
                'developing/information/block-explorers/tzstats',
                'developing/information/block-explorers/inspect-contract-tzstats',
              ],
            },
            'developing/information/indexers',
            'developing/information/custom-indexers',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Smart contracts',
      link: {
        id: 'smart-contracts',
        type: 'doc'
      },
      items: [
        // 'smart-contracts/quickstart',  // TODO
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
        'smart-contracts/entrypoints',
        'smart-contracts/storage',
        'smart-contracts/special-values',
        'smart-contracts/constants',
        'smart-contracts/serialization',
        'smart-contracts/sapling',
        'smart-contracts/views',
        'smart-contracts/delegation',
        // 'smart-contracts/multisig-specialized',
        // 'smart-contracts/multisig-usage',
        'smart-contracts/testing',
        // 'smart-contracts/deploying',
      ],
    },
    {
      type: 'category',
      label: 'Decentralized applications (dApps)',
      // link: { // TODO
      //   id: 'dApps',
      //   type: 'doc',
      // },
      items: [
        // 'dApps/first-dapp', // TODO
        'dApps/samples',
        // 'dApps/creating', //TODO
        'dApps/wallets',
        'dApps/taquito',
        'dApps/unity',
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
      label: 'Reference',
      items: [
        {
          type: 'category',
          label: 'The Octez client',
          link: {
            id: 'reference/octez',
            type: 'doc',
          },
          items: [
            'reference/octez/cli-rpc',
            'reference/octez/installing',
            'reference/octez/upgrading',
            'reference/octez/monitoring',
            'reference/octez/sandbox',
            'reference/octez/best-practices',
          ],
        },
        // 'reference/rpc', // TODO
        // 'reference/encoding', // TODO
        // 'reference/merkle-formats', // TODO
        // 'reference/ocaml-apis', // TODO
        {
          type: 'category',
          label: 'Token standards',
          link: {
            id: 'reference/token-standards',
            type: 'doc',
          },
          items: [
            'reference/fa12-fa2-standards',
          ],
        },
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
        // 'reference/previous-versions', // TODO
      ],
    },
  ],
  tutorialsSidebar: [
    {
      type: 'category',
      label: 'Tutorials',
      link: {
        type: 'doc',
        id: 'tutorials',
      },
      items: [
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
          label: 'Create an NFT',
          link: {
            type: 'doc',
            id: 'tutorials/create-an-nft',
          },
          items: [
            'tutorials/create-an-nft/nft-tznft',
            'tutorials/create-an-nft/nft-taquito',
            {
              type: 'category',
              label: 'Mint NFTs from a Web App',
              link: {
                type: 'doc',
                id: 'tutorials/create-an-nft/nft-web-app',
              },
              items: [
                'tutorials/create-an-nft/nft-web-app/setting-up-app',
                'tutorials/create-an-nft/nft-web-app/defining-functions',
                'tutorials/create-an-nft/nft-web-app/lets-play',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Build your first app',
          link: {
            type: 'doc',
            id: 'tutorials/build-your-first-app',
          },
          items: [
            'tutorials/build-your-first-app/setting-up-app',
            'tutorials/build-your-first-app/wallets-tokens',
            'tutorials/build-your-first-app/swapping-tokens',
            'tutorials/build-your-first-app/adding-removing-liquidity',
          ],
        },
        {
          type: 'category',
          label: 'Deploy a smart rollup',
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
            id: 'tutorials/build-an-nft-marketplace/index',
          },
          items: [
            'tutorials/build-an-nft-marketplace/index',
            'tutorials/build-an-nft-marketplace/part-2',
            'tutorials/build-an-nft-marketplace/part-3',
            'tutorials/build-an-nft-marketplace/part-4',
          ],
        },
      ],
    }
  ],
}

module.exports = sidebars;
