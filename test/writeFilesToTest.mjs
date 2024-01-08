import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const __dirname = dirname(fileURLToPath(import.meta.url));

const filesToTestPath = path.resolve(__dirname, '../filesToTest.txt');

// Write the files to test with Jest to a file because we can't pass them directly to Jest via node
// per https://github.com/jestjs/jest/issues/5089#issuecomment-352170845

if (fs.existsSync(filesToTestPath)) {
  fs.unlinkSync(filesToTestPath);
}
fs.writeFileSync(filesToTestPath, argv._.join('\n'), 'utf8');
