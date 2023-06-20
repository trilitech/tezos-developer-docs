const fs = require('fs');
const path = require('path');

// Define the directory
const directory = 'examples';

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

        // Replace ``` with {% code language="javascript" %} and ``` with {% /code %}
        const result = data.replace(/```([^`]+)```/gs, '{% code language="javascript" %}$1{% /code %}');

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
