const fs = require('fs');
const path = require('path');

// Define the directory
const directory = 'examples';

// Define the table text
const tableText = `
{% table %}
* Heading 1
* Heading 2
---
* Row 1 Cell 1
* Row 1 Cell 2
---
* Row 2 Cell 1
* Row 2 cell 2
{% /table %}
`;

// Read the directory
fs.readdir(directory, (err, files) => {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`);
  }

  // Iterate over each file
  files.forEach((file) => {
    // Check if the file is a .md file and does not end with _helper.md
    if (path.extname(file) === '.md' && !file.endsWith('_helper.md')) {
      // Read the file
      fs.readFile(path.join(directory, file), 'utf8', (err, data) => {
        if (err) {
          return console.log(`Unable to read file: ${err}`);
        }

        // Replace <table> with {% comment %}\n<table> and </table> with </table>\n{% /comment %} and append the table text
        const result = data.replace(/<table>/g, '{% comment %}\n<table>').replace(/<\/table>/g, `</table>\n{% /comment %}${tableText}`);

        // Define the new file name
        const newFileName = path.join(directory, path.basename(file, '.md') + '_helper.md');

        // Write the modified content to the new file
        fs.writeFile(newFileName, result, 'utf8', (err) => {
          if (err) return console.log(`Unable to write file: ${err}`);
        });
      });
    }
  });
});
