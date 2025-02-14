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

const process_glossary = async () => {

  const repoRoot = path.resolve(__dirname, '../../');

  const buildFolder = path.resolve(repoRoot, '_glossaryBuild/');
  if (!fs.existsSync(buildFolder)){
    fs.mkdirSync(buildFolder, { recursive: true });
  }

  // Download glossary and conversion script
  const glossarySourceFileName = path.resolve(buildFolder, 'glossary.html');
  const glossaryFilePromise = download('https://octez.tezos.com/docs/active/glossary.html', glossarySourceFileName);
  await Promise.resolve(glossaryFilePromise);

  const downloadedGlossaryDom = new JSDOM(await fs.promises.readFile(glossarySourceFileName, 'utf8'));

  // Trim html header, body, and such out
  const trimmed = downloadedGlossaryDom.window.document.querySelector('#glossary');

  // Trim out H1
  const h1 = trimmed.querySelector('h1');
  h1.remove();

  // External links in new window
  const externalLinks = trimmed.querySelectorAll('a.external');
  externalLinks.forEach((link) => {
    link.setAttribute('target', '_blank');
  });

  // Internal links go to Octez docs
  const internalLinks = trimmed.querySelectorAll('a.reference.internal');
  internalLinks.forEach((link) => {
    if (link.getAttribute('href').startsWith('../')) {
      const newHref = link.getAttribute('href').replace('../', 'https://tezos.gitlab.io/');
      link.setAttribute('href', newHref);
      link.setAttribute('target', '_blank');
    } else if (!link.getAttribute('href').startsWith('#')) {
      link.setAttribute('href', 'https://tezos.gitlab.io/active/' + link.getAttribute('href'));
      link.setAttribute('target', '_blank');
    }
  });

  // Convert section header links to match the rest of the site
  const sectionHeaderLinks = trimmed.querySelectorAll('a.headerlink');
  sectionHeaderLinks.forEach((link) => {
    link.setAttribute('class', 'hash-link');
    const title = link.parentNode.firstChild.textContent;
    link.setAttribute('aria-label', 'Direct link to ' + title);
    link.setAttribute('title', 'Direct link to ' + title);
    link.textContent = '';
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
