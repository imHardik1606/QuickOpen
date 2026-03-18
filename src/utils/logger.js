const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  opened: (file) => console.log(`\n📂 Opened: ${file}\n`),

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
  open help                Show this help

EXAMPLES:
  open report              Opens report.pdf, report.docx, etc.
  open app.js              Opens app.js in VS Code
  open src/app             Opens app file from src folder
  open data 2024           Finds files with both words

FEATURES:
  * Opens ANY file type (PDF, images, videos, documents, code)
  * Smart app selection (right app for each file)
  * Instant search (less than 100ms)
  * Fuzzy matching (typos don't matter)
  * One-time setup (scan once, use forever)
  * Cross-platform (Windows, macOS, Linux)
    `);
  }
};

module.exports = logger;