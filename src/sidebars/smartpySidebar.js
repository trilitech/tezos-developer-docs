/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const smartpySidebar = [
  {
    type: 'ref',
    id: 'languages',
    label: '<< Back to main',
  },
  {
    type: 'category',
    label: 'Introduction',
    items: [
      'languages/smartpy',
      'languages/smartpy/overview/installation',
      'languages/smartpy/overview/new-syntax',
    ],
  },
  {
    type: 'category',
    label: 'Syntax',
    items: [
      'languages/smartpy/syntax/overview',
      'languages/smartpy/syntax/integers-and-mutez',
      'languages/smartpy/syntax/strings-and-bytes',
      'languages/smartpy/syntax/booleans',
      'languages/smartpy/syntax/unit',
      'languages/smartpy/syntax/timestamps',
      'languages/smartpy/syntax/tuples',
      'languages/smartpy/syntax/options-and-variants',
      'languages/smartpy/syntax/lists-sets-and-maps',
      'languages/smartpy/syntax/lambdas',
      'languages/smartpy/syntax/operations',
      'languages/smartpy/syntax/signatures',
      'languages/smartpy/syntax/exceptions',
      'languages/smartpy/syntax/tickets',
      'languages/smartpy/syntax/bls12-381',
      'languages/smartpy/syntax/records',
      'languages/smartpy/syntax/utils',
      'languages/smartpy/syntax/types',
    ],
  },
  {
    type: 'category',
    label: 'Tests and scenarios',
    items: [
      'languages/smartpy/scenarios/overview',
      'languages/smartpy/scenarios/testing_contracts',
      'languages/smartpy/scenarios/simulation_targets',
      'languages/smartpy/scenarios/cryptography',
    ],
  },
  {
    type: 'category',
    label: 'Guides',
    link: {
      type: 'doc',
      id: 'languages/smartpy/guides',
    },
    items: [
      'languages/smartpy/guides/tutorial',
      {
        type: 'category',
        label: 'Tokens',
        items: [
          'languages/smartpy/guides/tokens',
          'languages/smartpy/guides/tokens/faq',
          'languages/smartpy/guides/tokens/glossary',
          'languages/smartpy/guides/tokens/FA1_2',
        ],
      },
      {
        type: 'category',
        label: 'FA2 lib',
        items: [
          'languages/smartpy/guides/FA2-lib',
          'languages/smartpy/guides/FA2-lib/base_classes',
          'languages/smartpy/guides/FA2-lib/entrypoints',
          'languages/smartpy/guides/FA2-lib/mixins',
          'languages/smartpy/guides/FA2-lib/policies',
          'languages/smartpy/guides/FA2-lib/token_metadata',
          'languages/smartpy/guides/FA2-lib/contract_metadata',
          'languages/smartpy/guides/FA2-lib/errors',
          'languages/smartpy/guides/FA2-lib/see_also',
        ],
      },
      'languages/smartpy/guides/examples',
    ],
  },
  'languages/smartpy/releases',
];

module.exports = { smartpySidebar };
