/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const ligoSidebar = [
  {
    type: 'html',
    value: '<div class="sidebar-header">LIGO language reference</div>',
    className: 'menu__list-item',
  },
  {
    type: 'ref',
    id: 'languages',
    label: '<< Back to main',
  },
  {
    type: 'category',
    label: 'Getting started',
    items: [
      {
        type: 'doc',
        label: 'Introduction to LIGO',
        id: 'languages/ligo',
      },
      'languages/ligo/intro/installation',
      'languages/ligo/intro/editor-support',
    ],
  },
  {
    type: 'category',
    label: 'Learn',
    items: [
      {
        type: 'link',
        label: 'Learn with Marigold',
        href: 'https://www.marigold.dev/learn',
      }
    ],
  },
  {
    type: 'category',
    label: 'Basics',
    items: [
      "languages/ligo/language-basics/types",
      "languages/ligo/language-basics/composite-types",
      "languages/ligo/language-basics/type-annotations",
      "languages/ligo/language-basics/functions",
      "languages/ligo/language-basics/boolean-if-else",
      "languages/ligo/language-basics/constants-and-variables",
      "languages/ligo/language-basics/maps-records",
      "languages/ligo/language-basics/sets-lists-tuples",
      "languages/ligo/language-basics/exceptions",
      "languages/ligo/language-basics/math-numbers-tez",
      "languages/ligo/language-basics/loops",
      "languages/ligo/language-basics/unit-option-pattern-matching",
      "languages/ligo/advanced/decorators",
      "languages/ligo/advanced/entrypoints-contracts",
      "languages/ligo/contract/views",
      "languages/ligo/contract/events",
      "languages/ligo/language-basics/tezos-specific",
    ],
  },
  {
    type: 'category',
    label: 'Writing a contract',
    items: [
      {
        "type": "category",
        "label": "First contract",
        "items": [
          "languages/ligo/tutorials/taco-shop/tezos-taco-shop-smart-contract",
          "languages/ligo/tutorials/taco-shop/tezos-taco-shop-payout",
        ],
      },
      "languages/ligo/tutorials/start-a-project-from-a-template",
    ],
  },
  {
    type: 'category',
    label: "Testing and Debugging",
    items: [
      "languages/ligo/advanced/testing",
      "languages/ligo/advanced/mutation-testing",
      "languages/ligo/advanced/michelson_testing",
    ],
  },
  {
    type: 'category',
    label: "Combining Code",
    items: [
      "languages/ligo/language-basics/modules",
      "languages/ligo/advanced/global-constants",
      "languages/ligo/advanced/package-management",
    ],
  },
  {
    type: 'category',
    label: "Advanced Topics",
    items: [
      "languages/ligo/advanced/polymorphism",
      "languages/ligo/advanced/inline",
      "languages/ligo/advanced/dynamic-entrypoints",
      "languages/ligo/tutorials/inter-contract-calls/inter-contract-calls",
      "languages/ligo/tutorials/optimisation/optimisation",
      "languages/ligo/tutorials/security/security",
      "languages/ligo/advanced/timestamps-addresses",
      "languages/ligo/advanced/include",
      "languages/ligo/advanced/first-contract",
      "languages/ligo/advanced/michelson-and-ligo",
      "languages/ligo/advanced/interop",
      "languages/ligo/advanced/embedded-michelson",
    ],
  },
  {
    type: 'category',
    label: "Misc",
    items: [
      "languages/ligo/intro/editor-support",
      "languages/ligo/api/cli-commands",
      "languages/ligo/api/cheat-sheet",
      "languages/ligo/contributors/origin",
      "languages/ligo/contributors/philosophy",
      "languages/ligo/contributors/getting-started",
      "languages/ligo/contributors/documentation-and-releases",
      "languages/ligo/contributors/big-picture/overview",
      "languages/ligo/contributors/big-picture/front-end",
      "languages/ligo/contributors/big-picture/middle-end",
      "languages/ligo/contributors/big-picture/back-end",
      "languages/ligo/contributors/big-picture/vendors",
      "languages/ligo/contributors/road-map/short-term",
      "languages/ligo/contributors/road-map/long-term",
      "languages/ligo/tutorials/registry/what-is-the-registry",
      "languages/ligo/tutorials/registry/how-to-make-an-audit",
      "languages/ligo/tutorials/tz-vs-eth/tz-vs-eth",
    ],
  },
  {
    type: 'category',
    label: "API",
    items: [
      {
        type: 'category',
        label: "Language",
        items: [
          "languages/ligo/reference/toplevel",
          "languages/ligo/reference/big-map-reference",
          "languages/ligo/reference/bitwise-reference",
          "languages/ligo/reference/bytes-reference",
          "languages/ligo/reference/crypto-reference",
          "languages/ligo/reference/dynamic-entrypoints-reference",
          "languages/ligo/reference/list-reference",
          "languages/ligo/reference/map-reference",
          "languages/ligo/reference/set-reference",
          "languages/ligo/reference/string-reference",
          "languages/ligo/reference/option-reference",
          "languages/ligo/reference/current-reference",
          "languages/ligo/reference/test",
          "languages/ligo/reference/proxy-ticket-reference",
          "languages/ligo/contract/tickets",
        ],
      },
      {
        type: 'category',
        label: "CLI",
        items: [
          {
            "type": "doc",
            "id": "languages/ligo/manpages/ligo"
          },
          {
            "type": "category",
            "label": "ligo compile",
            "items": [
              "languages/ligo/manpages/compile constant",
              "languages/ligo/manpages/compile contract",
              "languages/ligo/manpages/compile expression",
              "languages/ligo/manpages/compile parameter",
              "languages/ligo/manpages/compile storage"
            ]
          },
          {
            "type": "category",
            "label": "ligo run",
            "items": [
              "languages/ligo/manpages/run dry-run",
              "languages/ligo/manpages/run evaluate-call",
              "languages/ligo/manpages/run evaluate-expr",
              "languages/ligo/manpages/run interpret",
              "languages/ligo/manpages/run test",
              "languages/ligo/manpages/run test-expr"
            ]
          },
          {
            "type": "category",
            "label": "ligo print",
            "items": [
              "languages/ligo/manpages/print ast-aggregated",
              "languages/ligo/manpages/print ast-core",
              "languages/ligo/manpages/print ast-typed",
              "languages/ligo/manpages/print ast-expanded",
              "languages/ligo/manpages/print ast-unified",
              "languages/ligo/manpages/print cst",
              "languages/ligo/manpages/print dependency-graph",
              "languages/ligo/manpages/print mini-c",
              "languages/ligo/manpages/print preprocessed",
              "languages/ligo/manpages/print pretty"
            ]
          },
          {
            "type": "category",
            "label": "ligo transpile",
            "items": [
              "languages/ligo/manpages/transpile contract",
              "languages/ligo/manpages/transpile-with-ast contract",
              "languages/ligo/manpages/transpile-with-ast expression"
            ]
          },
          {
            "type": "category",
            "label": "ligo info",
            "items": [
              "languages/ligo/manpages/info get-scope",
              "languages/ligo/manpages/info list-declarations",
              "languages/ligo/manpages/info measure-contract"
            ]
          },
          {
            "type": "category",
            "label": "ligo analytics",
            "items": [
              "languages/ligo/manpages/analytics accept",
              "languages/ligo/manpages/analytics deny"
            ]
          },
          {
            "type": "category",
            "label": "ligo init",
            "items": [
              "languages/ligo/manpages/init contract",
              "languages/ligo/manpages/init library"
            ]
          },
          {
            "type": "doc",
            "label": "ligo changelog",
            "id": "languages/ligo/manpages/changelog"
          },
          {
            "type": "doc",
            "label": "ligo install",
            "id": "languages/ligo/manpages/install"
          },
          {
            "type": "category",
            "label": "ligo registry",
            "items": [
              "languages/ligo/manpages/registry add-user",
              "languages/ligo/manpages/registry login",
              "languages/ligo/manpages/registry publish",
              "languages/ligo/manpages/registry unpublish"
            ]
          },
          {
            "type": "doc",
            "label": "ligo repl",
            "id": "languages/ligo/manpages/repl"
          }
        ],
      },
      {
        type: 'category',
        label: "Changelog",
        items: [
          "languages/ligo/intro/changelog",
          "languages/ligo/protocol/hangzhou",
          "languages/ligo/protocol/ithaca",
          "languages/ligo/protocol/jakarta",
          "languages/ligo/protocol/kathmandu",
          "languages/ligo/protocol/lima",
          "languages/ligo/protocol/mumbai",
          "languages/ligo/protocol/nairobi",
          "languages/ligo/protocol/oxford",
        ],
      },
      {
        type: 'category',
        label: "faq",
        items: [
          "languages/ligo/faq/intro",
          "languages/ligo/faq/v1-migration-guide",
          "languages/ligo/faq/convert-address-to-contract",
          "languages/ligo/faq/polymorphic-comparison",
          "languages/ligo/faq/catch-error-view",
          "languages/ligo/faq/cameligo-ocaml-syntax-diff",
          "languages/ligo/faq/tezos-now-advance-time",
          "languages/ligo/faq/layout-comb-how",
          "languages/ligo/faq/layout-comb-why",
        ],
      },
    ],
  },
];

module.exports = { ligoSidebar };
