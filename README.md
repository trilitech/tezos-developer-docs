# Tezos Documentation Portal (Beta)

This is the source code for the Tezos Documentation Portal: https://docs.tezos.com

## Contributing

We welcome contributions to the documentation! Here's how you can get involved:

1. Fork the repository: Click the "Fork" button at the top-right corner of this page to create your own copy of the repository.

2. Clone your fork: Clone the repository to your local machine using `git clone https://github.com/<your-username>/<repository>.git`.

3. Create a branch: Create a new branch with a descriptive name for your changes, e.g., `git checkout -b my-feature`.

4. Make changes: Implement your changes, enhancements, or bug fixes on your branch.

5. Commit your changes: Add and commit your changes using `git add .` and `git commit -m "Your commit message"`.

6. Push your changes: Push your changes to your fork using `git push origin my-feature`.

7. Create a pull request: Navigate to the original repository on GitHub and click the "New Pull Request" button. Select your fork and branch, then click "Create Pull Request".

## Getting started

To setup the site locally, first install the npm dependencies:

```bash
npm install
cp .env.example .env.local
```

Next, run the development server:

```bash
npm run start
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Tests

The workflow `.github/workflows/tests.yml` runs automated tests on pull requests.
To run tests locally, run `npm run test -- --filesToCheck=docs/developing.md,docs/architecture.mdx`, where `--filesToCheck` is a comma-separated list of the MD and MDX files to test.

Docusaurus automatically checks for broken links and markdown-encoded images when you run `npm run build`.

## Dependencies

MD and MDX files have fields that show the versions of tools that they were tested on, as in this example:

```markdown
---
title: My topic
dependencies:
  smartpy: 0.19.0
  ligo: 1.6.0
  archetype: 1.0.26
---
```

The current versions of these tools are set in the file `src/scripts/dependencies.json`.
When you run `npm run check-dependencies`, a script checks for files that need to be updated.
You can check specific tools by passing them to the script, as in `npm run check-dependencies smartpy taquito`.

## Search

Search on the site is powered by Algolia Docsearch.
The index is in the [Algolia dashboard](https://dashboard.algolia.com/apps/QRIAHGML9Q/dashboard).
Contextual search is enabled according to the [Docusaurus instructions](https://docusaurus.io/docs/search#using-algolia-docsearch), although the site does not currently use contextual search to separate searches by version, language, or other similar factors.

The search uses [this crawler](https://crawler.algolia.com/admin/crawlers/eaa2c548-8b82-493b-8ab8-0c37e2e5d5cc/configuration/edit) to index the site:

```js
new Crawler({
  rateLimit: 8,
  maxDepth: 10,
  maxUrls: 5000,
  startUrls: ["https://docs.tezos.com/"],
  sitemaps: ["https://docs.tezos.com/sitemap.xml"],
  renderJavaScript: false,
  ignoreCanonicalTo: true,
  ignoreQueryParams: ["source", "utm_*"],
  discoveryPatterns: ["https://docs.tezos.com/**"],
  schedule: "every 24 hours",
  appId: "QRIAHGML9Q",
  apiKey: "API_KEY_GOES_HERE",
  actions: [
    {
      indexName: "tezosdocs",
      pathsToMatch: ["https://docs.tezos.com/**"],
      recordExtractor: ({ $, helpers }) => {
        // priority order: deepest active sub list header -> navbar active item -> 'Documentation'
        const lvl0 =
          $(
            ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active",
          )
            .last()
            .text() || "Documentation";

        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: lvl0,
            },
            lvl1: ["header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
          },
          indexHeadings: true,
          aggregateContent: true,
          recordVersion: "v3",
        });
      },
    },
  ],
  initialIndexSettings: {
    tezosdocs: {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "content"],
      searchableAttributes: [
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
      separatorsToIndex: "_",
    },
  },
});
```

## License

This project is open for contribution but the source code itself uses a commercial template and is therefore not licensed under any open-source license. Forking this project as a base for your own projects is not permitted under the license of the original template.
