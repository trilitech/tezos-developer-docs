// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const math = require('remark-math');
const katex = require('rehype-katex');

// script-src causes development builds to fail
// But unsafe-eval should NOT be in production builds
// Also, put GTM first because sometimes the ';' in the escaped single quotes causes the browser to think it's the end
const scriptSrc = process.env.NODE_ENV === 'development' ?
  `https://*.googletagmanager.com 'self' 'unsafe-inline' 'unsafe-eval'`
  : `https://*.googletagmanager.com 'self' 'unsafe-inline'`;

const contentSecurityPolicy = `
default-src 'none';
base-uri 'self';
manifest-src 'self';
script-src ${scriptSrc};
style-src 'self' 'unsafe-inline';
font-src 'self';
img-src 'self' https://*.googletagmanager.com https://*.google-analytics.com data:;
media-src 'self';
form-action 'self';
connect-src 'self' https://*.algolia.net https://*.algolianet.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
frame-src https://tezosbot.vercel.app;`;

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
  onBrokenAnchors: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },
  noIndex: process.env.BUILD_ENV == 'staging' ? true : false,

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Content-Security-Policy',
        content: contentSecurityPolicy,
      },
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve the docs at the site's root
          remarkPlugins: [math],
          rehypePlugins: [katex],
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleTagManager: {
          containerId: 'GTM-56M3FZ8',
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
        additionalLanguages: ['csharp', 'toml', 'ocaml'],
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
        appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID || "QRIAHGML9Q",
        // Public API key: it is safe to commit it
        apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY || "57d6a376a3528866784a143809cc7427",
        indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME || "tezosdocs",
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
      href: '/css/katex.min.css',
      type: 'text/css',
    },
  ],
};

module.exports = config;
