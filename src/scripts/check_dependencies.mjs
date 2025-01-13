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
  'octez-client': '20.1',
  taquito: '20.1',
  ligo: '1.7.0',
};

/*
Data structure for info about dependencies:

{
  taquito: {
    19: [
      file1.md,
      file2.md
    ]
    20: [
      file3.md,
      file4.md
    ]
  }
  octez-client: {
    19: [
      file3.md,
      file4.md
    ]
    20: [
      file5.md
    ]
  }
}

*/

const printDependencies = async () => {
  // Get all MD and MDX files
  const files = await glob(docsFolder + '/**/*.{md,mdx}');

  // Get front matter for each file
  const filesAndFrontMatter = await Promise.all(
    files.map(async (filePath) => {
      const fileContents = await fs.promises.readFile(filePath, 'utf8');
      const frontMatter = matter(fileContents).data;
      return { filePath, frontMatter };
    })
  );

  // Collate data on what files have what dependencies
  const dependencyData = filesAndFrontMatter.reduce((data, {filePath, frontMatter}) => {
    if (frontMatter.dependencies) {
      const programs = Object.keys(frontMatter.dependencies);
      programs.forEach((oneProgram) => {
        const version = frontMatter.dependencies[oneProgram];
        const relativePath = path.relative(baseFolder, filePath);
        if (!data[oneProgram]) {
          data[oneProgram] = {};
        }
        if (!data[oneProgram][version]) {
          data[oneProgram][version] = [];
        }
        if (!data[oneProgram][version].includes(relativePath)) {
          data[oneProgram][version].push(relativePath);
        }
      });
    }
    return data;
  }, {});

  // Print a summary of the tools and versions used
  console.log('***\nSUMMARY\n***\n');
  console.log('Versions and tools used:\n');
  const programs = Object.keys(dependencyData);
  programs.forEach((oneProgram) => {
    const versions = Object.keys(dependencyData[oneProgram]);
    console.log(`${oneProgram}: ${versions.join(', ')}`);
  });
  console.log('\n');

  // Pretty-print the full data by program first, then version
  console.log('***\nFULL DATA\n***\n');
  console.log('List of every tool and the versions used in each file:\n');
  programs.forEach((oneProgram) => {
    console.log('Program:', oneProgram);
    const versions = Object.keys(dependencyData[oneProgram]);
    versions.forEach((oneVersion) => {
      console.log('  Version:', oneVersion);
      dependencyData[oneProgram][oneVersion].forEach((oneFilePath) => {
        console.log('    ', oneFilePath);
      })
    });
    console.log('\n');
  });
  console.log('\n');

  // Print files that may need to be updated based on the currentVersions constant
  console.log('***\nUPDATES NEEDED\n***\n');
  console.log('These pages need to be updated to the latest version of the specified tool:\n');
  const currentPrograms = Object.keys(currentVersions);
  currentPrograms.forEach((oneProgram) => {
    const currentVersion = semver.coerce(currentVersions[oneProgram]).version;
    console.log('Checking', oneProgram, 'for which the current version is', currentVersion);
    if (dependencyData[oneProgram]) {
      const versionsOfThisToolUsed = Object.keys(dependencyData[oneProgram]) || [];
      if (versionsOfThisToolUsed.length > 0) {
        const outdatedVersions = Object.keys(dependencyData[oneProgram])
          .filter((oneVersion) => semver.gt(currentVersion, semver.coerce(oneVersion).version));
        if (outdatedVersions.length > 0) {
          outdatedVersions.forEach((oneOutdatedVersion) => {
            console.log('  These files use version', oneOutdatedVersion + ':');
            dependencyData[oneProgram][oneOutdatedVersion].forEach((oneFile) => {
              console.log('    ', oneFile);
            })
          });
        } else {
          console.log('  All files up to date');
        }
      }
    } else {
      console.log('  Tool', oneProgram, 'is not used in the docs.');
    }
    console.log('\n');
  });

  // console.log(JSON.stringify(dependencyData, null, 2))
}

printDependencies();
