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
    const relativePathToScript = path.relative(path.dirname(targetFileName), scriptFileName);
    const run = spawn(relativePathToScript + ' ' + path.basename(targetFileName) + '> ' + outputFileName, [], {
      cwd,
      // Use shell: true here so the script can use the `> output_file` syntax to write output to a file
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

const process_glossary = async () => {

  const repoRoot = path.resolve(__dirname, '../../');

  // Conversion script expects the downloaded glossary file to be in _build/
  const buildFolder = path.resolve(repoRoot, '_glossaryBuild/_build');
  if (!fs.existsSync(buildFolder)){
    fs.mkdirSync(buildFolder, { recursive: true });
  }
  // Script file in _scripts/
  const scriptFolder = path.resolve(repoRoot, '_glossaryBuild/_scripts');
  if (!fs.existsSync(scriptFolder)){
    fs.mkdirSync(scriptFolder, { recursive: true });
  }

  // Download glossary and conversion script
  const glossarySourceFileName = path.resolve(buildFolder, 'glossary.html');
  const scriptFileName = path.resolve(scriptFolder, 'extract_content');
  const glossaryFilePromise = download('https://tezos.gitlab.io/active/glossary.html', glossarySourceFileName);
  const scriptFilePromise = download('https://gitlab.com/tezos/tezos/-/raw/master/docs/scripts/extract_content?ref_type=heads&inline=false', scriptFileName);
  await Promise.all([glossaryFilePromise, scriptFilePromise]);
  await fs.promises.chmod(scriptFileName, '777');

  // Run conversion script
  const outputFileName = path.resolve(buildFolder, 'extracted_content.html');
  await runProcess(scriptFileName, glossarySourceFileName, buildFolder, outputFileName);
  console.log('Used Octez docs script to pull the content from its glossary');
  const conversionScriptOutputFile = await fs.promises.readFile(outputFileName, 'utf8');

  const downloadedGlossaryDom = new JSDOM(conversionScriptOutputFile);

  // Trim html header, body, and such out
  const trimmed = downloadedGlossaryDom.window.document.querySelector('div#glossary');

  // Trim out H1
  const h1 = trimmed.querySelector('h1');
  h1.remove();

  // External links in new window
  const externalLinks = trimmed.querySelectorAll('a.external');
  externalLinks.forEach((link) => {
    link.setAttribute('target', '_blank');
  });

  // Wrap with <div class='imported-glossary'></div> to apply custom styles
  const wrapper = new JSDOM('<div id="imported-glossary"></div>');
  const imported_glossary = wrapper.window.document.querySelector('div#imported-glossary');
  imported_glossary.appendChild(trimmed);



  // Convert to string and remove line breaks to prevent MDX processing from making them into paragraph tags
  let imported_glossary_str = imported_glossary.outerHTML;
  imported_glossary_str = imported_glossary_str.replace(/([^>])$\n/gm, '$1 ');
  imported_glossary_str = imported_glossary_str.replace(/>$\n/gm, '>');

  // Convert class to className because we're in MDX now
  imported_glossary_str = imported_glossary_str.replaceAll('class="', 'className="');

  // Overwrite existing glossary.md file
  let outputString = '---\ntitle: Glossary\n---\n\n';
  // Fix for anchor links taking you too far down the page
  outputString += 'import GlossaryAnchorScript from \'@site/src/components/GlossaryAnchorScript\';\n\n<GlossaryAnchorScript />\n\n';
  outputString += imported_glossary_str;
  const glossaryFilePath = path.resolve(repoRoot, 'docs/overview/glossary.md');
  if (fs.existsSync(glossaryFilePath)){
    fs.unlinkSync(glossaryFilePath);
  }
  await fs.promises.writeFile(glossaryFilePath, outputString, 'utf8');
  console.log('Wrote new glossary to', glossaryFilePath);
}

process_glossary();
