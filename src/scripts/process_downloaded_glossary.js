// Convert the glossary downloaded from the Octez docs to something that can be shown on this site

const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const process_downloaded_glossary = async () => {
  // TODO download current file from Octez
  const file = await fs.promises.readFile(path.resolve(__dirname, './downloaded_glossary.html'), 'utf8');

  const dom = new JSDOM(file);

  // Trim html header, body, and such out
  const trimmed = dom.window.document.querySelector("div#glossary");

  // Trim out H1
  const h1 = trimmed.querySelector("h1");
  h1.remove();

  // Convert to string
  var htmlStr = trimmed.outerHTML;

  // Fixes for MDX treating newlines as paragraphs:
  htmlStr = htmlStr.replace(/([^>])$\n/gm, '$1 ');
  htmlStr = htmlStr.replace(/>$\n/gm, '>');

  // Wrap with <div class="imported-glossary"></div> to apply custom styles
  htmlStr = `<div class="imported-glossary">${htmlStr}</div>`;

  // Add front matter
  htmlStr = '---\ntitle: Glossary\n---\n\n' + htmlStr;

  await fs.promises.writeFile(path.resolve(__dirname, '../../docs/overview/glossary.md'), htmlStr, 'utf8')
}

process_downloaded_glossary();
