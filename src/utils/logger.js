const chalk = require('chalk');

const logger = {
  info: (msg) => console.log(chalk.blue(`Info: ${msg}`)),
  success: (msg) => console.log(chalk.green(`Success: ${msg}`)),
  error: (msg) => console.error(chalk.red(`Error: ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`Warning: ${msg}`)),
  opened: (file) => console.log(chalk.cyan(`\nOpened: ${file}\n`)),

  help: () => {
    console.log(`
Smart File Opener - Universal File Tool

USAGE:
  qopen <filename>          Open a file by name
  qopen <folder>/<file>     Open file from specific folder
  qopen folder <folderName> Open a folder in VS Code
  qopen scan                Scan your computer (first time)
  qopen rescan              Update file cache
  qopen cache-info          Show cache information
  qopen clear-cache         Clear cache
  qopen set-root <path>     Set default scanning root path
  qopen get-root            Show current root path
  qopen ignore add <path>   Add folder to ignore list
  qopen ignore remove <path> Remove folder from ignore list
  qopen ignore list         Show ignored folders
  qopen help                Show this help

EXAMPLES:
  qopen report              Opens report.pdf, report.docx, etc.
  qopen app.js              Opens app.js in new VS Code window with folder
  qopen src/app             Opens app file from src folder
  qopen data 2024           Finds files with both words
  qopen set-root C:\\Users\\YourName\\Projects
  qopen get-root
  qopen ignore add Downloads
  qopen ignore remove temp
  qopen ignore list

FEATURES:
  * Opens ANY file type (PDF, images, videos, documents, code)
  * Smart app selection (right app for each file, code files open in new VS Code window with folder)
  * Instant search (less than 100ms)
  * Fuzzy matching (typos don't matter)
  * One-time setup (scan once, use forever)
  * Cross-platform (Windows, macOS, Linux)
  * Configurable root path (set default scanning directory)
  * Custom ignore folders (persistent configuration)
    `);
  }
};

module.exports = logger;