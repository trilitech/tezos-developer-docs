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

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseFolder = path.resolve(__dirname, '../..');
const docsFolder = path.resolve(baseFolder, 'docs');

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
  // Pull together data on what files have what dependencies
  const dependencyData = await files.reduce(async (dataPromise, filePath) => {
    const data = await dataPromise;
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const frontMatter = matter(fileContents).data;
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
  }, Promise.resolve({}));

  // Pretty-print the data by program first, then version
  const programs = Object.keys(dependencyData);
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
  })
}

printDependencies();
