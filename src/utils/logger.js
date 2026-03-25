const chalk = require('chalk');

const logger = {
  info: (msg) => console.log(chalk.blue(`ℹ️  ${msg}`)),
  success: (msg) => console.log(chalk.green(`✅ ${msg}`)),
  error: (msg) => console.error(chalk.red(`❌ ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`⚠️  ${msg}`)),
  opened: (file) => console.log(chalk.cyan(`\n📂 Opened: ${file}\n`)),

  help: () => {
    console.log(`
Smart File Opener - Universal File Tool

USAGE:
  open <filename>          Open a file by name
  open <folder>/<file>     Open file from specific folder
  open scan                Scan your computer (first time)
  open rescan              Update file cache
  open cache-info          Show cache information
  open clear-cache         Clear cache
  open set-root <path>     Set default scanning root path
  open get-root            Show current root path
  open ignore add <path>   Add folder to ignore list
  open ignore remove <path> Remove folder from ignore list
  open ignore list         Show ignored folders
  open help                Show this help

EXAMPLES:
  open report              Opens report.pdf, report.docx, etc.
  open app.js              Opens app.js in new VS Code window with folder
  open src/app             Opens app file from src folder
  open data 2024           Finds files with both words
  open set-root C:\\Users\\YourName\\Projects
  open get-root
  open ignore add Downloads
  open ignore remove temp
  open ignore list

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