// import gitP from 'simple-git';
// import matter from 'gray-matter';
// import fs from 'fs';
// import path from 'path';
// import { format } from 'date-fns';

// const fsPromises = fs.promises;

// // this file won't run unless it's in the project root directory
// async function updateLastUpdated(repoPath, docsDir) {
//   const git = gitP(repoPath);
//   const files = await fsPromises.readdir(docsDir, { withFileTypes: true });

//   for (const file of files) {
//     const filePath = path.join(docsDir, file.name);

//     if (file.isDirectory()) {
//       await updateLastUpdated(repoPath, filePath);
//     } else if (file.isFile() && file.name.endsWith('.md')) {
//       const logs = await git.log({ file: filePath });

//       if (logs.all.length < 2) {
//         // There's less than 2 commits for this file, continue to the next file.
//         continue;
//       }

//       const lastUpdatedDate = new Date(logs.all[1].date);
//       const lastUpdated = format(lastUpdatedDate, 'MMMM yyyy');

//       const content = await fsPromises.readFile(filePath, 'utf8');
//       const parsed = matter(content);
//       parsed.data.lastUpdated = lastUpdated;

//       const updatedContent = matter.stringify(parsed.content, parsed.data);
//       await fsPromises.writeFile(filePath, updatedContent);
//     }
//   }
// }

// updateLastUpdated('.', './src/pages').catch(console.error);

import gitP from 'simple-git';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const fsPromises = fs.promises;

async function updateLastUpdated(repoPath, docsDir) {
  const git = gitP(repoPath);
  const files = await fsPromises.readdir(docsDir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(docsDir, file.name);

    if (file.isDirectory()) {
      await updateLastUpdated(repoPath, filePath);
    } else if (file.isFile() && file.name.endsWith('.md')) {
      const log = await git.log({ file: filePath });
      const lastUpdatedDate = new Date(log.latest.date);
      const lastUpdated = format(lastUpdatedDate, 'do MMMM yyyy');

      const content = await fsPromises.readFile(filePath, 'utf8');
      const parsed = matter(content);
      parsed.data.lastUpdated = lastUpdated;

      const updatedContent = matter.stringify(parsed.content, parsed.data);
      await fsPromises.writeFile(filePath, updatedContent);
    }
  }
}

updateLastUpdated('.', './src/pages').catch(console.error);