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
      link: {
        id: 'architecture',
        type: 'doc',
      },
      items: [
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
          ],
        },
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
        'architecture/rpc',
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
        'developing/wallet-setup',
        'developing/dev-environments',
        'developing/testnets',
        // 'developing/sandbox', // TODO
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
                // 'developing/information/block-explorers/inspect-contract-tzstats',
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
            { type: 'ref', id: 'smart-contracts/languages/ligo' },
            { type: 'ref', id: 'smart-contracts/languages/smartpy'},
            { type: 'ref', id: 'smart-contracts/languages/archetype'},
            { type: 'ref', id: 'smart-contracts/languages/michelson'},
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
        'smart-contracts/testing',
        'smart-contracts/deploying',
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
        'dApps/sending-transactions',
        {
          type: 'category',
          label: 'Taquito dApp SDK for TypeScript',
          link: {
            type: 'doc',
            id: 'dApps/taquito',
          },
          items: [
            'dApps/taquito/quick_start',
            'dApps/taquito/operation_flow',
            'dApps/taquito/rpc_nodes',
            'dApps/taquito/web3js_taquito',
            {
              type: 'category',
              label: 'Providers',
              items: [
                'dApps/taquito/prepare',
                'dApps/taquito/estimate',
              ],
            },
            {
              type: 'category',
              label: 'Operations',
              items: [
                'dApps/taquito/making_transfers',
                'dApps/taquito/originate',
                'dApps/taquito/consensus_key',
                'dApps/taquito/global_constant',
                'dApps/taquito/increase_paid_storage',
                'dApps/taquito/set_delegate',
                'dApps/taquito/smart_rollups',
                'dApps/taquito/proposal_and_ballot',
                'dApps/taquito/failing_noop',
              ],
            },
            {
              type: 'category',
              label: 'Smart contracts',
              items: [
                'dApps/taquito/smartcontracts',
                'dApps/taquito/contract_call_parameters',
                'dApps/taquito/fa2_parameters',
                'dApps/taquito/manager_lambda',
                'dApps/taquito/multisig_doc',
              ],
            },
            {
              type: 'category',
              label: 'Wallets',
              items: [
                'dApps/taquito/beaconwallet-singleton',
                'dApps/taquito/wallets',
                'dApps/taquito/transaction_limits',
              ],
            },
            {
              type: 'category',
              label: 'Michelson',
              items: [
                'dApps/taquito/maps_bigmaps',
                'dApps/taquito/michelsonmap',
                'dApps/taquito/tickets',
              ],
            },
            {
              type: 'category',
              label: 'Views',
              items: [
                'dApps/taquito/lambda_view',
                'dApps/taquito/on_chain_views',
              ],
            },
            {
              type: 'category',
              label: 'Contract and Token Metadata',
              items: [
                'dApps/taquito/tzip12',
                'dApps/taquito/metadata-tzip16',
              ],
            },
            {
              type: 'category',
              label: 'Signers',
              items: [
                'dApps/taquito/signing',
                'dApps/taquito/inmemory_signer',
                'dApps/taquito/ledger_signer'
              ],
            },
            {
              type: 'category',
              label: 'Packages',
              items: [
                'dApps/taquito/rpc_package',
                'dApps/taquito/michelson_encoder',
                'dApps/taquito/contracts-library',
                'dApps/taquito/taquito_utils',
                {
                  type: 'category',
                  label: 'Sapling',
                  collapsed: false,
                  collapsible: false,
                  items: ['dApps/taquito/sapling', 'dApps/taquito/sapling_in_memory_spending_key', 'dApps/taquito/sapling_in_memory_viewing_key'],
                },
              ],
            },
            {
              type: 'category',
              label: 'Advanced Scenarios',
              items: [
                'dApps/taquito/ophash_before_injecting',
                'dApps/taquito/drain_account',
                'dApps/taquito/complex_parameters',
                'dApps/taquito/confirmation_event_stream',
                'dApps/taquito/subscribe_event',
                'dApps/taquito/liquidity_baking',
                'dApps/taquito/storage_annotations',
                'dApps/taquito/tezos_domains',
              ],
            },
            {
              type: 'category',
              label: 'Modules customization',
              items: ['dApps/taquito/forger', 'dApps/taquito/rpc-cache', 'dApps/taquito/cancel_http_requests'],
            },
            {
              type: 'category',
              label: 'Running integration tests',
              items: ['dApps/taquito/ledger_integration_test', 'dApps/taquito/rpc_nodes_integration_test'],
            },
            {
              type: 'category',
              label: 'Dapp Development',
              items: [
                'dApps/taquito/mobile_bundle',
                'dApps/taquito/dapp_template',
                'dApps/taquito/dapp_prelaunch',

              ],
            },
            {
              type: 'category',
              label: 'Taquito Public API',
              items: [
                'dApps/taquito/wallet_API',
                'dApps/taquito/batch_API',
              ]
            },
            {
              type: 'category',
              label: 'Misc',
              items: [
                'dApps/taquito/tutorial_links',
                'dApps/taquito/contracts_collection',
              ],
            },
            {
              type: 'link',
              label: 'TypeDoc Reference',
              href: 'https://tezostaquito.io/typedoc',
            },
          ],
        },
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
        // 'reference/rpc', // TODO
        // 'reference/encoding', // TODO
        // 'reference/merkle-formats', // TODO
        // 'reference/ocaml-apis', // TODO
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

  ligoSidebar: [
    {
      type: 'ref',
      id: 'smart-contracts/languages',
      label: 'Back to main',
    },
    {
      type: 'doc',
      label: 'LIGO overview',
      id: 'smart-contracts/languages/ligo',
    },
    'smart-contracts/languages/ligo/faq',
    {
      type: 'category',
      label: 'Data types',
      link: {
        type: 'doc',
        id: 'smart-contracts/languages/ligo/data-types',
      },
      items: [
        'smart-contracts/languages/ligo/data-types/simple',
        'smart-contracts/languages/ligo/data-types/composite',
        'smart-contracts/languages/ligo/data-types/type-annotations',
        'smart-contracts/languages/ligo/data-types/booleans',
        'smart-contracts/languages/ligo/data-types/records',
        'smart-contracts/languages/ligo/data-types/tuples',
        'smart-contracts/languages/ligo/data-types/numbers',
      ],
    },
    'smart-contracts/languages/ligo/constants-variables',
    'smart-contracts/languages/ligo/functions',
    'smart-contracts/languages/ligo/entrypoints',
    'smart-contracts/languages/ligo/error-handling',
    'smart-contracts/languages/ligo/loops',
    'smart-contracts/languages/ligo/patterns',
    'smart-contracts/languages/ligo/attributes',
    'smart-contracts/languages/ligo/views',
    'smart-contracts/languages/ligo/operations',
    'smart-contracts/languages/ligo/domain-specific',
    {
      type: 'category',
      label: 'Combining code',
      items: [
        'smart-contracts/languages/ligo/combining-code/modules',
        'smart-contracts/languages/ligo/combining-code/global-constants',
        'smart-contracts/languages/ligo/combining-code/package-management',
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      link: {
        type: 'doc',
        id: 'smart-contracts/languages/ligo/testing',
      },
      items: [
        'smart-contracts/languages/ligo/testing/mutation',
        'smart-contracts/languages/ligo/testing/michelson',
      ],
    },
    'smart-contracts/languages/ligo/advanced',
  ],

  smartpySidebar: [
    {
      type: 'ref',
      id: 'smart-contracts/languages',
      label: 'Back to languages',
    },
    {
      type: 'doc',
      label: 'SmartPy overview',
      id: 'smart-contracts/languages/smartpy',
    },
    {
      type: 'category',
      label: 'Data types',
      link: {
        type: 'doc',
        id: 'smart-contracts/languages/ligo/data-types',
      },
      items: [
        'smart-contracts/languages/smartpy/data-types/integers',
        'smart-contracts/languages/smartpy/data-types/bytes',
        'smart-contracts/languages/smartpy/data-types/booleans',
        'smart-contracts/languages/smartpy/data-types/unit',
        'smart-contracts/languages/smartpy/data-types/timestamps',
        'smart-contracts/languages/smartpy/data-types/tuples',
        'smart-contracts/languages/smartpy/data-types/options',
        'smart-contracts/languages/smartpy/data-types/lists',
        'smart-contracts/languages/smartpy/data-types/lambdas',
        'smart-contracts/languages/smartpy/data-types/signatures',
        'smart-contracts/languages/smartpy/data-types/exceptions',
        'smart-contracts/languages/smartpy/data-types/tickets',
        'smart-contracts/languages/smartpy/data-types/bls',
        'smart-contracts/languages/smartpy/data-types/records',
        'smart-contracts/languages/smartpy/data-types/types',
      ],
    },
    'smart-contracts/languages/smartpy/operations',
    'smart-contracts/languages/smartpy/utils',
    'smart-contracts/languages/smartpy/error-handling',
    {
      type: 'category',
      label: 'Testing',
      items: [
        'smart-contracts/languages/smartpy/testing/contracts',
        'smart-contracts/languages/smartpy/testing/simulation',
        'smart-contracts/languages/smartpy/testing/cryptography',
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
              label: 'Mint NFTs from a web app',
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
            'tutorials/build-your-first-app/sending-transactions',
            'tutorials/build-your-first-app/getting-information',
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
            id: 'tutorials/build-an-nft-marketplace',
          },
          items: [
            'tutorials/build-an-nft-marketplace/part-1',
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
