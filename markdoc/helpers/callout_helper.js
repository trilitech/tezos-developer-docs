const fs = require('fs')
const path = require('path')

// Define the directory
const directory = 'examples'

// Read the directory
fs.readdir(directory, { withFileTypes: true }, (err, dirents) => {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`)
  }

  // Iterate over each item in the directory
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      // This is a subdirectory, search within it
      const subdir = path.join(directory, dirent.name)

      fs.readdir(subdir, (err, files) => {
        if (err) {
          return console.log(`Unable to scan subdirectory: ${err}`)
        }

        // Process the files in the subdirectory
        processFiles(subdir, files)
      })
    } else if (
      path.extname(dirent.name) === '.md' &&
      !dirent.name.endsWith('_helper.md')
    ) {
      // This is a .md file in the root directory, process it
      processFiles(directory, [dirent.name])
    }
  })
})

function processFiles(directory, files) {
  // Iterate over each file
  files.forEach((file) => {
    // Read the file
    fs.readFile(path.join(directory, file), 'utf8', (err, data) => {
      if (err) {
        return console.log(`Unable to read file: ${err}`)
      }

      // Replace :::note, :::info, :::tip with {% callout type="note" title="" %} and :::caution with {% callout type="warning" title="" %}
      const result = data.replace(
        /:::(note|info|tip|caution)\n([\s\S]*?):::/gs,
        (match, type, content) => {
          type = (type === 'note' || type === 'info' || type === 'tip') ? 'note' : 'warning';
          return `{% callout type="${type}" title="" %}\n${content}\n{% /callout %}`;
        }
      )

      // Define the new file name
      const newFileName = path.join(
        directory,
        path.basename(file, '.md') + '_helper.md'
      )

      // Write the modified content to the new file
      fs.writeFile(newFileName, result, 'utf8', (err) => {
        if (err) return console.log(`Unable to write file: ${err}`)
      })
    })
  })
}
