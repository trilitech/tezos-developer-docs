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

const __dirname = dirname(fileURLToPath(import.meta.url));

const docsFolder = path.resolve(__dirname, '../../docs');
const imageFolder = path.resolve(__dirname, '../../static');

const getFilePaths = () => glob(docsFolder + '/**/*.{md,mdx}');
const getImagePaths = () => glob(imageFolder + '/**/*.{png,jpeg,jpg,gif,svg}');

// https://unifiedjs.com/learn/guide/using-unified/
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

const checkImages = async () => {
  const filePaths = await getFilePaths();
  const availableImagePaths = await getImagePaths();

  const allFileResults = await Promise.all(filePaths.map(async (oneFilePath) => {
    // Get the AST and the links to images in that AST
    const ast = await getAst(oneFilePath);
    const imagesInAst = getImagesInAst(ast, oneFilePath);

    // Find images that are missing
    const missingImages = imagesInAst.filter((oneImagePath) => {
      const fullImagePath = imageFolder + oneImagePath;
      return !availableImagePaths.includes(fullImagePath);
    });

    // Return the file path and the images that are missing
    return { file: oneFilePath, missingImages };
  }));

  // Filter out files with no missing images
  const allFilesWithMissingImages = allFileResults.filter(({ missingImages }) => missingImages.length > 0);

  if (allFilesWithMissingImages.length > 0) {
    console.log(allFilesWithMissingImages);
  } else {
    console.log('No missing images found in ' + filePaths.length + ' files.');
  }
}

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
const getImagesInAst = (ast, filePath) => {
  const imagePathsInFile = [];
  if (path.extname(filePath) === '.mdx') {
    // MDX files
    visit(ast, mdxTestFunction, (node) => {
      const srcAttribute = node.attributes.find((attr => attr.name === 'src'));
      imagePathsInFile.push(srcAttribute.value);
    });
  } else if (path.extname(filePath) === '.md'){
    // MD files
    visit(ast, markdownTestFunction, (node) => {
      imagePathsInFile.push(node.url);
    });
  }
  // Filter out external links to files
  return imagePathsInFile.filter((oneLink) =>
    !oneLink.startsWith('http://') && !oneLink.startsWith('https://')
  );
}

checkImages();
