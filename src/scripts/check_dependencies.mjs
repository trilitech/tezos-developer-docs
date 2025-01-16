/* Print a list of files and their dependencies based on front matter as in this example:

---
title: My topic
dependencies:
  smartpy: 0.19.0
  ligo: 1.6.0
  archetype: 1.0.26
---

*/

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import semver from 'semver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseFolder = path.resolve(__dirname, '../..');
const docsFolder = path.resolve(baseFolder, 'docs');

// List the current versions of the tools and this script will print the pages that have been tested only on older versions of the tools
const currentVersions = {
  archetype: '1.0.26',
  'octez-client': '20.1',
  rust: '1.73.0',
  smartpy: '0.20.0',
  taquito: '20.1',
  'tezos-smart-rollup': '0.2.1',
  ligo: '1.7.0',
};

const printDependencies = async () => {
  // Get all MD and MDX files
  const files = await glob(docsFolder + '/**/*.{md,mdx}');

  // Get front matter for each file
  const filesAndFrontMatter = await Promise.all(
    files.map(async (filePath) => {
      const fileContents = await fs.promises.readFile(filePath, 'utf8');
      const frontMatter = matter(fileContents).data;
      return {
        filePath: path.relative(baseFolder, filePath),
        frontMatter };
    })
  );

  // Filter to files with dependencies
  const filesWithDependencies = filesAndFrontMatter
    .filter(({ frontMatter }) => frontMatter.dependencies);

  // Print warnings
  filesWithDependencies.forEach(({ filePath, frontMatter }) => {
    const dependencies = frontMatter.dependencies;
    const tools = Object.keys(dependencies);
    let filePathPrinted = false;

    // Print warnings for files with outdated dependencies
    const outdatedDeps = tools.filter((oneTool) => {
      const currentVersion = currentVersions[oneTool];
      const usedVersion = dependencies[oneTool];
      if (!currentVersion) {
        // Tool has no current version; we'll warn about that later
        return false;
      }
      // Return true if the listed version of the dependency is less than the current version in the config file
      return semver.gt(semver.coerce(currentVersion).version, semver.coerce(usedVersion).version);
    });
    if (outdatedDeps.length > 0) {
      console.log(filePath);
      filePathPrinted = true;
      console.log('Outdated dependencies:');
      outdatedDeps.forEach((oneTool) => {
        const currentVersion = currentVersions[oneTool];
        const usedVersion = dependencies[oneTool];
        console.log(`For ${oneTool}, this file uses version ${usedVersion} but the current version is ${currentVersion}.`);
      });
    }

    // Check for dependencies that are listed in the file but have no current version in the config file
    const missingDeps = tools.filter((oneTool) => !currentVersions[oneTool]);
    if (missingDeps.length > 0) {
      if (!filePathPrinted) {
        console.log(filePath);
        filePathPrinted = true;
      }
      console.log('Missing dependencies:');
      missingDeps.forEach((oneTool) => {
        console.log(`This file has a dependency for ${oneTool} but there is no current version for this tool in the config.`);
      });
    }

    if (filePathPrinted) {
      console.log('');
    }

  });
  console.log(`Reviewed ${filesAndFrontMatter.length} files.`);
}

printDependencies();
