// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tezos Developer Documentation',
  tagline: 'Get started developing on Tezos by learning about its features, going through application development tutorials, and exploring the tools that are available to Tezos developers.',
  favicon: 'img/favicon.ico',
  url: 'https://docs.tezos.com',
  baseUrl: '/',
  organizationName: 'trilitech',
  projectName: 'tezos-developer-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': "Content-Security-Policy",
        content: "default-src 'self' jsdelivr.net googleapis.com",
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },

      }),
    ],
  ],

  plugins: [
    'plugin-image-zoom',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        style: 'primary',
        title: 'Tezos Docs',
        logo: {
          alt: 'Developer Docs for Tezos',
          src: 'img/logo-tezos.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'documentationSidebar',
            position: 'left',
            label: 'Documentation'
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialsSidebar',
            position: 'left',
            label: 'Tutorials',
          },
          {
            href: 'https://github.com/trilitech/tezos-developer-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
      },
      // https://github.com/flexanalytics/plugin-image-zoom
      // Enable click to zoom in to large images
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          scrollOffset: 0,
        },
      },
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID || 'R2IYF7ETH7',
        // Public API key: it is safe to commit it
        apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || '599cec31baffa4868cae4e79f180729b',
        indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME || 'docsearch',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },
        // Optional: Algolia search parameters
        // searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: false,
        //... other Algolia params
      },
    }),
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;
