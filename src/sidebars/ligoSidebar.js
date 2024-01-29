/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const ligoSidebar = {
  "Getting started": [
    "languages/ligo/intro/introduction",
    {
      "type": "category",
      "label": "Installation",
      "items": [
        "languages/ligo/intro/installation",
        "languages/ligo/intro/editor-support",
      ]
    },
    "languages/ligo/tutorials/getting-started/getting-started",
  ],
  "Writing a Contract": [
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
  "Comments": [
    "languages/ligo/comments/comments",
  ],
  "Keywords": [
    "languages/ligo/keywords/keywords",
    "languages/ligo/keywords/escaped_vars",
  ],
  "Constants": [
    "languages/ligo/constants/constants",
    "languages/ligo/constants/silent_vars",
  ],
  "Numbers": [
    "languages/ligo/numbers/declaring",
    "languages/ligo/numbers/casting",
    "languages/ligo/numbers/adding",
    "languages/ligo/numbers/subtracting",
    "languages/ligo/numbers/negating",
    "languages/ligo/numbers/multiplying",
    "languages/ligo/numbers/dividing",
  ],
  "Strings": [
    "languages/ligo/strings/strings",
    "languages/ligo/strings/concatenating",
    "languages/ligo/strings/sizing",
    "languages/ligo/strings/slicing",
    "languages/ligo/strings/verbatim",
  ],
  "Booleans": [
    "languages/ligo/booleans/booleans",
    "languages/ligo/booleans/or",
    "languages/ligo/booleans/and",
    "languages/ligo/booleans/not",
    "languages/ligo/booleans/comparing",
    "languages/ligo/booleans/conditionals",
  ],
  "Tuples": [
    "languages/ligo/tuples/declaring",
    "languages/ligo/tuples/accessing",
  ],
  "Functions": [
    "languages/ligo/functions/declaring",
    "languages/ligo/functions/lambdas",
    "languages/ligo/functions/higher-order",
    "languages/ligo/functions/inlining",
    "languages/ligo/functions/recursion",
  ],
  "Polymorphism": [
    "languages/ligo/polymorphism/polymorphism",
    "languages/ligo/polymorphism/parametric_types",
    "languages/ligo/polymorphism/functions",
  ],
  "Variants": [
    "languages/ligo/variants/unit",
    "languages/ligo/variants/variants",
    "languages/ligo/variants/options",
    "languages/ligo/variants/matching",
  ],
  "Side effects": [
    "languages/ligo/imperative/mutating",
    "languages/ligo/imperative/looping",
    "languages/ligo/imperative/failing",
    "languages/ligo/imperative/asserting",
  ],
  "Lists": [
    "languages/ligo/lists/declaring",
    "languages/ligo/lists/adding",
    "languages/ligo/lists/matching",
    "languages/ligo/lists/updating",
    "languages/ligo/lists/folding",
    "languages/ligo/lists/mapping",
    "languages/ligo/lists/looping",
  ],
  "Records": [
    "languages/ligo/records/declaring",
    "languages/ligo/records/accessing",
    "languages/ligo/records/assigning",
  ],
  "Sets": [
    "languages/ligo/sets/declaring",
    "languages/ligo/sets/sizing",
    "languages/ligo/sets/searching",
    "languages/ligo/sets/adding",
    "languages/ligo/sets/removing",
    "languages/ligo/sets/updating",
    "languages/ligo/sets/folding",
    "languages/ligo/sets/mapping",
    "languages/ligo/sets/iterating",
    "languages/ligo/sets/looping",
  ],
  "Maps": [
    "languages/ligo/maps/declaring",
    "languages/ligo/maps/sizing",
    "languages/ligo/maps/searching",
    "languages/ligo/maps/adding",
    "languages/ligo/maps/removing",
    "languages/ligo/maps/updating",
    "languages/ligo/maps/folding",
    "languages/ligo/maps/mapping",
    "languages/ligo/maps/iterating",
    "languages/ligo/maps/looping",
  ],
  "Modules/Namespaces": [
    "languages/ligo/modules/declaring",
    "languages/ligo/modules/accessing",
    "languages/ligo/modules/nesting",
    "languages/ligo/modules/aliasing",
    "languages/ligo/modules/importing",
    "languages/ligo/modules/including",
  ],
  "Signatures/Interfaces": [
    "languages/ligo/signatures/declaring",
    "languages/ligo/signatures/extending",
  ],
  "Switches": [
    "languages/ligo/switches/switches" //,
    //      "switches/discriminated"
  ],
  "Preprocessor": [
    "languages/ligo/preprocessor/preprocessor",
    "languages/ligo/preprocessor/comments",
    "languages/ligo/preprocessor/strings",
    "languages/ligo/preprocessor/if",
    "languages/ligo/preprocessor/define",
    "languages/ligo/preprocessor/include",
    "languages/ligo/preprocessor/import",
    "languages/ligo/preprocessor/error",
  ],
  "Tezos features": [
    "languages/ligo/advanced/decorators",
    "languages/ligo/advanced/entrypoints-contracts",
    "languages/ligo/contract/views",
    "languages/ligo/contract/events",
    "languages/ligo/language-basics/tezos-specific",
  ],
  // "Basics": [
  //   "language-basics/types",
  //   "language-basics/composite-types",
  //   "language-basics/type-annotations",
  //   "language-basics/functions",
  //   "language-basics/boolean-if-else",
  //   "language-basics/constants-and-variables",
  //   "language-basics/maps-records",
  //   "language-basics/sets-lists-tuples",
  //   /* TODO: + mutation */
  //   "language-basics/exceptions",
  //   "language-basics/math-numbers-tez",
  //   "language-basics/loops",
  //   "language-basics/unit-option-pattern-matching"
  // ],
  "Testing and Debugging": [
    "languages/ligo/advanced/testing",
    "languages/ligo/advanced/mutation-testing",
    "languages/ligo/advanced/michelson_testing",
    //TODO: write doc "testing/debugging"
  ],
  "Combining Code": [
    {
      type: "doc",
      id: "languages/ligo/language-basics/modules",
      label: "Modules",
      customProps: {
        jsLigoName: "Namespaces"
      }
    },
    "languages/ligo/advanced/global-constants",
    "languages/ligo/advanced/package-management",
  ],
  "Advanced Topics": [
    "languages/ligo/advanced/polymorphism",
    "languages/ligo/advanced/inline",
    "languages/ligo/advanced/dynamic-entrypoints",
    "languages/ligo/tutorials/inter-contract-calls/inter-contract-calls",
    "languages/ligo/tutorials/optimisation/optimisation",
    "languages/ligo/tutorials/security/security",
    //TODO: write doc "advanced/best-practices",
    "languages/ligo/advanced/timestamps-addresses",
    "languages/ligo/advanced/include",
    "languages/ligo/advanced/first-contract",
    "languages/ligo/advanced/michelson-and-ligo",
    "languages/ligo/advanced/interop",
    "languages/ligo/advanced/embedded-michelson",
  ],
  "Misc": [
    "languages/ligo/intro/editor-support",
    "languages/ligo/api/cli-commands",
    "languages/ligo/api/cheat-sheet",
    // "contributors/origin",
    // "contributors/philosophy",
    // "contributors/getting-started",
    // "contributors/documentation-and-releases",
    // "contributors/big-picture/overview",
    // "contributors/big-picture/front-end",
    // "contributors/big-picture/middle-end",
    // "contributors/big-picture/vendors",
    // "contributors/road-map/short-term",
    // "contributors/road-map/long-term",
    "languages/ligo/tutorials/registry/what-is-the-registry",
    "languages/ligo/tutorials/registry/how-to-make-an-audit",
    "languages/ligo/tutorials/tz-vs-eth/tz-vs-eth",
  ],
  "API": {
    "Language": [
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
  "CLI": [
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
  "Changelog": [
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
  "faq": {
    "FAQ": [
      "languages/ligo/faq/intro",
      "languages/ligo/faq/v1-migration-guide",
      "languages/ligo/faq/convert-address-to-contract",
      "languages/ligo/faq/polymorphic-comparison",
      "languages/ligo/faq/catch-error-view",
      "languages/ligo/faq/cameligo-ocaml-syntax-diff",
      "languages/ligo/faq/tezos-now-advance-time",
      "languages/ligo/faq/layout-comb-how",
      "languages/ligo/faq/layout-comb-why",
    ]
  }
};

module.exports = { ligoSidebar };
