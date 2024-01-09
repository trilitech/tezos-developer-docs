// Check links to images in md and mdx files, in both markdown links and <img> and <Figure> tags

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { mdxjs } from 'micromark-extension-mdxjs'
import { visit } from 'unist-util-visit';
import { expect } from 'chai';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

import { exampleAstWithBrokenLinks, expectedImagesInAst } from './resources/imageCheckTestResources.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const docsFolder = path.resolve(__dirname, '../docs');
const imageFolder = path.resolve(__dirname, '../static');
// Get file names passed in the command or if none were passed, use all files
const getFilePaths = async () => {
  if (argv.filesToCheck) {
    return argv.filesToCheck
      .split(',')
      .map((oneFilePath) =>
        path.resolve(__dirname, '../', oneFilePath)
    );
  } else {
    return glob(docsFolder + '/**/*.{md,mdx}');
  }
}
const filePaths = await getFilePaths();

const availableImagePaths = await glob(imageFolder + '/**/*.{png,jpeg,jpg,gif,svg}');

// https://unifiedjs.com/learn/guide/using-unified/
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

  // Test functions to select nodes that are links to images
  const mdxTestFunction = (node) => ['img', 'Figure'].includes(node.name);
  const markdownTestFunction = (node) => node.type === 'image';

  // Get all of the images in an AST, visiting the correct nodes for MD and MDX files.
  /*
  For MDX, get Figure and img nodes, like this img node:
  {
    "type": "mdxJsxFlowElement",
    "name": "img",
    "attributes": [
      {
        "type": "mdxJsxAttribute",
        "name": "src",
        "value": "/img/tezos_smart_contract_content.svg"
      },
      {
        "type": "mdxJsxAttribute",
        "name": "alt",
        "value": "hi"
      }
    ],
    "children": [],
    "position": {...}
  },

  For MD, get image nodes, like this:
  {
    "type": "image",
    "title": null,
    "url": "/img/someimage.jpg",
    "alt": "some alt text",
    "position": {...}
  },
  */
  const getImagesInAst = (ast, /*filePath*/) => {
    const imagePathsInFile = [];
    // MDX elements
    visit(ast, mdxTestFunction, (node) => {
      const srcAttribute = node.attributes.find((attr => attr.name === 'src'));
      imagePathsInFile.push(srcAttribute.value);
    });
    // MD images
    visit(ast, markdownTestFunction, (node) => {
      imagePathsInFile.push(node.url);
    });
    // Filter out external links to files
    return imagePathsInFile.filter((oneLink) =>
      !oneLink.startsWith('http://') && !oneLink.startsWith('https://')
    );
  }

it('Verify that the test gets images from ASTs', () => {
  const imagesFoundInAst = getImagesInAst(exampleAstWithBrokenLinks);
  expectedImagesInAst.forEach(oneExpectedImage => {
    expect(imagesFoundInAst,
        'Image check test failed. getImagesInAst did not find an image it should have:' + oneExpectedImage
      ).to.include(oneExpectedImage);
  });
});

describe('Test for broken image links', async () => {
  if (filePaths.length === 0) {
    console.log('No files to test.');
    return;
  }
  filePaths.forEach((filePath) => {
    it('Check image paths in ' + filePath, async () => {
      // Get the AST and the links to images in that AST
      const ast = await getAst(filePath);
      const imagesInAst = getImagesInAst(ast, filePath);
      // Find images that are missing
      imagesInAst.forEach((oneImageInAst) =>
        expect(availableImagePaths,
            'Missing image ' + oneImageInAst
          ).to.include(imageFolder + oneImageInAst)
      );
    });
  })
})

// Convert file to AST, using the correct processors for MD and MDX files
const getAst = async (filePath) => {
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  if (path.extname(filePath) === '.mdx') {
    return fromMarkdown(fileContents, {
      extensions: [mdxjs()],
      mdastExtensions: [mdxFromMarkdown()]
    });
  } else if (path.extname(filePath) === '.md'){
    return processor.parse(fileContents);
  }
}
