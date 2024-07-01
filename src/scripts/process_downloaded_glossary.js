// Convert the glossary downloaded from the Octez docs to something that can be shown on this site

const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Utility function to download files
const download = async (url, filename) => {
  const file = fs.createWriteStream(filename);
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded', url, 'and saved as', filename);
        resolve();
      });
      file.on('error', (e) => {
        reject(e);
      });
    });
  });
}

// Run child process as promise
const runProcess = async (scriptFileName, targetFileName, cwd, outputFileName) => {
  if (fs.existsSync(outputFileName)) {
    await fs.promises.unlink(outputFileName);
  }
  return new Promise((resolve, reject) => {
    const relativePathToTarget = path.relative(path.dirname(scriptFileName), targetFileName);
    const relativePathToScript = path.relative(path.dirname(targetFileName), scriptFileName);
    const run = spawn(relativePathToScript + ' ' + path.basename(targetFileName) + '> ' + outputFileName, [], {
      cwd,
      shell: true,
    });

    run.stderr.on('data', (data) => {
      reject(data);
    });

    run.on('close', (code) => {
      resolve();
    });
  });
}

const process_downloaded_glossary = async () => {

  // Conversion script expects the glossary file to in _build/
  const buildFolder = path.resolve(__dirname, '../../_build');
  if (!fs.existsSync(buildFolder)){
    fs.mkdirSync(buildFolder);
  }
  // Script file in _scripts/
  const scriptFolder = path.resolve(__dirname, '../../_scripts');
  if (!fs.existsSync(scriptFolder)){
    fs.mkdirSync(scriptFolder);
  }

  // Download glossary and conversion script
  const glossarySourceFileName = path.resolve(buildFolder, 'glossary.html');
  const scriptFileName = path.resolve(scriptFolder, 'extract_content');
  const glossaryFilePromise = download('https://tezos.gitlab.io/alpha/glossary.html', glossarySourceFileName);
  const scriptFilePromise = download('https://gitlab.com/tezos/tezos/-/raw/master/docs/scripts/extract_content?ref_type=heads&inline=false', scriptFileName);
  await Promise.all([glossaryFilePromise, scriptFilePromise]);
  await fs.promises.chmod(scriptFileName, '777');

  // Run conversion script
  const outputFileName = path.resolve(buildFolder, 'extracted_content.html');
  await runProcess(scriptFileName, glossarySourceFileName, buildFolder, outputFileName);
  const conversionScriptOutputFile = await fs.promises.readFile(outputFileName, 'utf8');

  const dom = new JSDOM(conversionScriptOutputFile);

  // Trim html header, body, and such out
  const trimmed = dom.window.document.querySelector('div#glossary');

  // Trim out H1
  const h1 = trimmed.querySelector('h1');
  h1.remove();

  // Convert to string
  var htmlStr = trimmed.outerHTML;

  // Fixes for MDX treating newlines as paragraphs:
  htmlStr = htmlStr.replace(/([^>])$\n/gm, '$1 ');
  htmlStr = htmlStr.replace(/>$\n/gm, '>');

  // Wrap with <div class='imported-glossary'></div> to apply custom styles
  htmlStr = `<div class='imported-glossary'>${htmlStr}</div>`;

  // Add front matter
  htmlStr = '---\ntitle: Glossary\n---\n\n' + htmlStr;

  await fs.promises.writeFile(path.resolve(__dirname, '../../docs/overview/glossary.md'), htmlStr, 'utf8')
}

process_downloaded_glossary();
