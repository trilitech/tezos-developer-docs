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
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const params = argv['_'];

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseFolder = path.resolve(__dirname, '../..');
const docsFolder = path.resolve(baseFolder, 'docs');

// List the current versions of the tools in the config file and this script will print the pages that have been tested only on older versions of the tools

// You can pass individual tools to check, as in
// npm run check-dependencies smartpy taquito
// and it will check only those dependencies

// Import config file
// Not sure why I can't import a JSON file directly in MJS
const dependencyConfig = fs.readFileSync(path.resolve(__dirname, 'dependencies.json'), 'utf8');
const { currentVersions } = JSON.parse(dependencyConfig);

// Verify the passed dependencies parameters
const unrecognizedParams = params.filter((oneParam) => !currentVersions[oneParam]);
if (unrecognizedParams.length > 0) {
  console.error('Unrecognized tool names in parameters:');
  console.log(unrecognizedParams.join('\n'));
  process.exit(1);
}

const printDependencies = async () => {
  // Get all MD and MDX files
  const files = await glob(docsFolder + '/**/*.{md,mdx}');

  // Get front matter for each file
  const filesAndFrontMatter = await Promise.all(
    files
      .sort()
      .map(async (filePath) => {
      const fileContents = await fs.promises.readFile(filePath, 'utf8');
      const frontMatter = matter(fileContents).data;
      return {
        filePath: path.relative(baseFolder, filePath),
        frontMatter };
    })
  );

  // Filter to files with dependencies
  const filesWithDependencies = filesAndFrontMatter
    // Filter to the dependencies passed on the command line
    .map(({ filePath, frontMatter }) => {
      if (params.length > 0 && frontMatter.dependencies) {
        let newDependencies = {};
        params.forEach((oneParam) => {
          if (frontMatter.dependencies[oneParam]) {
            newDependencies[oneParam] = frontMatter.dependencies[oneParam];
          }
        });
        let newFrontMatter = JSON.parse(JSON.stringify(frontMatter));
        newFrontMatter.dependencies = newDependencies;
        return {
          filePath,
          frontMatter: newFrontMatter,
        };
      } else {
        return { filePath, frontMatter };
      }
    })
    // Filter out files without dependencies
    .filter(({ frontMatter }) => frontMatter.dependencies);

  // Print warnings
  filesWithDependencies.forEach(({ filePath, frontMatter }) => {
    const dependencies = frontMatter.dependencies;

    // Print warnings for files with outdated or missing dependencies
    const warnings = Object.keys(dependencies).reduce((prevWarnings, oneTool) => {
      const currentVersion = currentVersions[oneTool];
      const usedVersion = dependencies[oneTool];
      if (!currentVersion) {
        // Tool has no current version
        prevWarnings.push(`Error: Unknown dependency: ${oneTool}`);
      } else {
        if (semver.gt(semver.coerce(currentVersion).version, semver.coerce(usedVersion).version)) {
          // The listed version of the dependency is less than the current version in the config file
          prevWarnings.push(`Outdated: ${oneTool} ${usedVersion} < ${currentVersion}`);
        }
      }
      return prevWarnings;
    }, []);

    // Print results
    if (warnings.length > 0) {
      console.log(filePath);
      warnings.forEach(w => console.log(w));
      console.log();
    }

  });
  console.log(`Reviewed ${filesAndFrontMatter.length} files.`);
}

printDependencies();
