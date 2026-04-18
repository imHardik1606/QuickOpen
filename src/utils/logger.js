const chalk = require("chalk");

const logger = {
  info: (msg) => console.log(chalk.blue(`Info: ${msg}`)),
  success: (msg) => console.log(chalk.green(`Success: ${msg}`)),
  error: (msg) => console.error(chalk.red(`Error: ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`Warning: ${msg}`)),
  opened: (file) => console.log(chalk.cyan(`\nOpened: ${file}\n`)),

  help: () => {
    console.log(`
${chalk.bold('NAME')}
  qopen - Instantly open any file from your terminal

${chalk.bold('SYNOPSIS')}
  qopen <filename|folder> [options]
  qopen <command> [arguments]

${chalk.bold('DESCRIPTION')}
  QuickOpen is a fast file search and launcher for your terminal. Search across your
  file system and open files with their default applications in milliseconds.

${chalk.bold('QUICK COMMANDS')}
  qopen <filename>              Search and open a file by name
  qopen <query> <query2>        Search with multiple keywords
  qopen folder <name>           Open folder in VS Code
  qopen help                    Show this help message

${chalk.bold('CACHE MANAGEMENT')}
  qopen scan                    Initial file system scan
  qopen rescan                  Update cache with new files
  qopen cache-info              Display cache statistics and info
  qopen clear-cache             Reset cache completely

${chalk.bold('CONFIGURATION')}
  qopen set-root <path>         Set default scanning root path
  qopen get-root                Show current root path
  qopen ignore add <path>       Add folder to ignore list
  qopen ignore remove <path>    Remove folder from ignore list
  qopen ignore list             Show all ignored folders

${chalk.bold('EXAMPLES')}
  Search and open files:
    $ qopen report              # Opens report.pdf, report.docx, etc.
    $ qopen app.js              # Opens app.js with your editor
    $ qopen src app             # Multi-keyword search
    $ qopen budget 2024         # Find "budget" and "2024"

  Folder operations:
    $ qopen folder myproject    # Opens folder in VS Code
    $ qopen folder src          # Opens src folder

  Configuration:
    $ qopen set-root C:\\Users\\Name\\Projects
    $ qopen ignore add node_modules
    $ qopen ignore remove temp

${chalk.bold('FEATURES')}
  ✓ Universal file support (PDF, images, code, media, documents)
  ✓ Fuzzy search (typos don't matter)
  ✓ Lightning fast (<100ms search)
  ✓ Smart app selection (right application for each file)
  ✓ Persistent cache (scan once, search forever)
  ✓ Cross-platform (Windows, macOS, Linux)
  ✓ Interactive selection menu
  ✓ Minimal dependencies

${chalk.bold('CONFIGURATION FILES')}
  Root path:     ~/.smart-file-opener/root-config.json
  Ignore list:   ~/.smart-file-opener/ignore-config.json
    `);
  },
};

module.exports = logger;
