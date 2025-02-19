/* Print a list of files and their dependencies based on front matter as in this example:

---
title: My topic
dependencies:
  smartpy: 0.19.0
  ligo: 1.6.0
  archetype: 1.0.26
---

List the current versions of the tools in the config file at ./dependencies.json and this script will print the pages that have been tested only on older versions of the tools.

Arguments:

You can pass individual tools to check in a comma-separated list, as in npm run check-dependencies -- --dependencies=smartpy,taquito and it will check only those dependencies.

By default, this script checks for differences down to the fixpack level.
You can pass --major or --minor to ignore differences up to the specified level.

By default, this script checks all files.
You can pass individual files to check as anonymous arguments after the other parameters, as in
npm run check-dependencies -- --major -d=smartpy,taquito docs/developing/octez-client/accounts.md docs/tutorials/build-your-first-app.md

You can also pass folders to check, as in
npm run check-dependencies -- --major -d=smartpy,taquito docs/tutorials
*/

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import semver from 'semver';
import minimist from 'minimist';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseFolder = path.resolve(__dirname, '../..');
const docsFolder = path.resolve(baseFolder, 'docs');

// Import config file
// Not sure why I can't import a JSON file directly in MJS
const dependencyConfig = fs.readFileSync(path.resolve(__dirname, 'dependencies.json'), 'utf8');
const { currentVersions } = JSON.parse(dependencyConfig);

// Set up parameters
// Anonymous params are in argv['_']
const argv = minimist(process.argv.slice(2), {
  boolean: ['major', 'minor'],
  string: ['dependencies'],
  alias: {
    d: 'dependencies',
  },
});

// By default, check all dependencies
const dependenciesToCheck = argv['dependencies'] ? argv['dependencies'].split(',') : Object.keys(currentVersions);
dependenciesToCheck.forEach((oneDependency) => {
  if (!Object.keys(currentVersions).includes(oneDependency)) {
    console.error('Unknown dependency:', oneDependency);
    process.exit(1);
  }
});

// By default, check to the fixpack version
const checkMajor = argv.major;
const checkMinor = argv.minor;
if (checkMajor && checkMinor) {
  console.error('Include either --major or --minor, not both');
  process.exit(1);
}

const getFilesToCheck = async () => {
  // By default, check all files
  if (argv['_'].length === 0) {
    return glob(docsFolder + '/**/*.{md,mdx}');
  }
  // But if file names or paths are passed as anonymous params, check only those files
  return argv['_'].reduce(async (allFilesPromise, oneShortPath) => {
    const fullPath = path.resolve(baseFolder, oneShortPath);
    const allFiles = await allFilesPromise;
    // Is this a path or a file name?
    return fs.promises.lstat(fullPath)
      .then(async (lstatResult) => {
        if (lstatResult.isFile()) {
          return allFiles.concat([fullPath]);
        } else if (lstatResult.isDirectory()) {
          return allFiles.concat(await glob(path.resolve(fullPath, '**/*.{md,mdx}')));
        } else {
          throw 'Path does not appear to be either a file or a directory.';
        }
      })
      .catch((err) => {
        console.error('Error: Could not resolve this file or path:', oneShortPath);
        console.error(err);
        process.exit(1);
      });
  }, Promise.resolve([]));
}

// Function to compare versions based on whether we care about major, minor, or patch versions
// diff(v1, v2): Returns the difference between two versions by the release type (major, premajor, minor, preminor, patch, prepatch, or prerelease), or null if the versions are the same.
const isOldVersion = (v1String, v2String) => {
  const v1 = semver.coerce(v1String);
  const v2 = semver.coerce(v2String);
  const diff = semver.diff(v1, v2);
  if (!diff) {
    // Versions match
    return false;
  }

  if (diff === 'major') {
    return true;
  }
  if (diff === 'minor' && !checkMajor) {
    return true;
  }
  if (diff === 'fixpack' && !checkMinor) {
    return true;
  }
  return false;
}

const printDependencies = async () => {
  // Get files to check
  const files = await getFilesToCheck();

  // Get front matter for each file
  const filesAndFrontMatter = await Promise.all(
    files
      .sort()
      .map(async (filePath) => {
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        const frontMatter = matter(fileContents).data;
        return {
          filePath: path.relative(baseFolder, filePath),
          frontMatter
        };
      })
  );

  // Filter to dependencies that we care about
  const filesWithDependencies = filesAndFrontMatter
    .map(({ filePath, frontMatter }) => {
      if (frontMatter.dependencies) {
        let newDependencies = {};
        dependenciesToCheck.forEach((oneDependency) => {
          if (frontMatter.dependencies[oneDependency]) {
            newDependencies[oneDependency] = frontMatter.dependencies[oneDependency];
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
        if (isOldVersion(currentVersion, usedVersion)) {
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
