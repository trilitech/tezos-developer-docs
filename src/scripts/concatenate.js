const path = require('path');
const fs = require('fs');

const sidebars = require('../../sidebars');
const sidebarsToInclude = ['documentationSidebar'];

// Given a docusaurus sidebar object, return a list of the local doc IDs in it
function getIdsRecursive(sidebarObject) {
  if (typeof sidebarObject === 'string') {
    return sidebarObject;
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
// Got to remove FM because multiple FM blocks are not legal
// Could do this with gray-matter but I don't want to add the dependency
function removeFrontMatter(mdText) {
  let outputLines = [];
  const lines = mdText.split('\n');
  let inFrontMatter = false;
  let doneWithFrontMatter = false;
  const h1Regex = /^title:\s+(.*)$/;

  lines.forEach(line => {
    if (line == '---') {
      doneWithFrontMatter = inFrontMatter;
      inFrontMatter = true;
    }
    if (inFrontMatter && !doneWithFrontMatter && h1Regex.test(line)) {
      const result = h1Regex.exec(line);
      outputLines.push('# ' + result[1]);
    }
    if (line != '---' && doneWithFrontMatter) {
      outputLines.push(line);
    }
  });
  return outputLines.join('\n');
}

async function concatEverything() {

  const outputPath = path.resolve(__dirname, '../../', 'allMdFilesConcatenated.md');

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
    const oneFileText = removeFrontMatter(await fs.promises.readFile(oneFilePath, 'utf8') + '\n\n');
    return fs.promises.appendFile(outputPath, oneFileText);
  }, Promise.resolve());

  console.log('Wrote concatenated file to', outputPath);
}

concatEverything();
