import path from 'path';
import fs from 'fs';

import {remark} from 'remark'
import strip from 'strip-markdown';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import sidebars from '../../sidebars.js';
const sidebarsToInclude = ['documentationSidebar'];
const pathsToFilterOut = [
  'overview/glossary',
];

// Given a docusaurus sidebar object, return a list of the local doc IDs in it
function getIdsRecursive(sidebarObject) {
  if (typeof sidebarObject === 'string') {
    return pathsToFilterOut.includes(sidebarObject) ? null : sidebarObject;
  }
  if (sidebarObject.constructor.name == "Array") {
    return sidebarObject.reduce((list, oneSidebarObj) =>
      list.concat(getIdsRecursive(oneSidebarObj)),
    []);
  }
  switch(sidebarObject.type) {
    case 'category':
      return [sidebarObject?.link?.id].concat(getIdsRecursive(sidebarObject.items));
    case 'doc':
      return sidebarObject.id;
    case 'link':
      if (sidebarObject.href && sidebarObject.href.startsWith('http')) {
        return null;
      } else {
        return sidebarObject.href;
      }
    default:
      return null;
  }
}

// Given a doc file ID from the sidebar, get the filename path
async function getFilePath(fileId) {
  const mdPath = path.resolve(__dirname, '../../docs', fileId) + '.md';
  try {
    await fs.promises.access(mdPath, fs.constants.F_OK);
    return mdPath;
  } catch {
    // Do nothing
  }
  const mdxPath = mdPath + 'x';
  try {
    await fs.promises.access(mdxPath, fs.constants.F_OK);
    return mdxPath;
  } catch {
    console.error("Could not file file with sidebar ID", fileId);
  }
}

// Remove the front matter from an MD file and replace with an H1
// Got to remove FM because multiple FM blocks break some markdown tools
// Could do this with gray-matter but I don't want to add the dependency
function removeFrontMatter(mdText) {
  const lines = mdText.split('\n');
  let inFrontMatter = false;
  let doneWithFrontMatter = false;
  const h1Regex = /^title:\s+(.*)$/;
  let titleLine = '';
  let line = '';

  while (lines.length > 0) {
    line = lines.shift();
    if (line == '---') {
      doneWithFrontMatter = inFrontMatter;
      inFrontMatter = true;
    }
    if (inFrontMatter && !doneWithFrontMatter && h1Regex.test(line)) {
      const result = h1Regex.exec(line);
      titleLine = '# ' + result[1];
    }
    if (line != '---' && doneWithFrontMatter) {
      return [titleLine, ''].concat(lines).join('\n');
    }
  }
}

async function concatEverything() {

  const outputPath = path.resolve(__dirname, '../../', 'allPageSourceFiles.md');

  // Remove old concatenated file if it exists
  try {
    await fs.promises.access(outputPath, fs.constants.F_OK);
    await fs.promises.unlink(outputPath);
  } catch {
    // Do nothing because the file does not exist
  }

  // Get list of MD file IDs in order from sidebars.js
  const allSidebarNames = Object.keys(sidebars)
    .filter((sidebarName) => sidebarsToInclude.includes(sidebarName));
  const allMdIds = allSidebarNames
    .reduce((list, sidebarName) =>
      list.concat(getIdsRecursive(sidebars[sidebarName])),
    [])
    .filter((item) => item);

  // Find the matching file paths
  const allFilePaths = await Promise.all(allMdIds.map(getFilePath));

  // Read and concat the files in TOC order
  await allFilePaths.reduce(async (previousPromise, oneFilePath) => {
    await previousPromise;
    const markdownText = removeFrontMatter(await fs.promises.readFile(oneFilePath, 'utf8'));
    const oneFileText = await remark()
      .use(strip)
      .process(markdownText);
    return fs.promises.appendFile(outputPath, String(oneFileText) + '\n\n');
  }, Promise.resolve());

  console.log('Wrote concatenated file to', outputPath);
}

concatEverything();
