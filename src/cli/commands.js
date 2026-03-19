const inquirer = require('inquirer');
const { scan } = require('../core/fileScanner');
const { search } = require('../core/fileSearch');
const { openFile, getFileType } = require('../core/fileOpener');
const { getCacheInfo, clearCache: clearCacheUtil } = require('../utils/cache');
const logger = require('../utils/logger');

async function handleScan(scanArgs = []) {
  try {
    const scanDir = scanArgs[0] || process.cwd();
    await scan(scanDir);
  } catch (error) {
    logger.error(`Failed to scan: ${error.message}`);
    process.exit(1);
  }
}

function handleCacheInfo() {
  const info = getCacheInfo();

  if (!info) {
    logger.error('Cache not found. Run: open scan');
    return;
  }

  console.log(`
Cache Information:
  Location: ${info.path}
  Total Files: ${info.totalFiles.toLocaleString()}
  Size: ${info.size}
  Last Updated: ${new Date(info.lastUpdated).toLocaleString()}
  `);
}

async function handleClearCache() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Clear cache? (You will need to run "open scan" again)',
      default: false
    }
  ]);

  if (answer.confirmed) {
    clearCacheUtil();
    logger.success('Cache cleared. Run "open scan" to rebuild.');
  }
}

async function handleSearch(query) {
  try {
    const results = search(query);

    // If only one result, open directly
    if (results.length === 1) {
      await openFile(results[0]);
      const type = getFileType(results[0]);
      logger.opened(`${results[0]} (${type})`);
      return;
    }

    // Multiple results - show menu
    const choices = results.map(file => ({
      name: formatFileDisplay(file),
      value: file,
      short: file.split(/[\\/]/).pop()
    }));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFile',
        message: `Found ${results.length} file(s). Select:`,
        choices: choices,
        pageSize: 12
      }
    ]);

    await openFile(answer.selectedFile);
    const type = getFileType(answer.selectedFile);
    logger.opened(`${answer.selectedFile} (${type})`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function formatFileDisplay(filePath) {
  const filename = filePath.split(/[\\/]/).pop();
  const dirname = filePath.substring(0, filePath.lastIndexOf(filename) - 1);
  return `${filename}  ${dirname}`.substring(0, 100);
}

const commands = {
  scan: handleScan,
  cacheInfo: handleCacheInfo,
  clearCache: handleClearCache,
  search: handleSearch
};

module.exports = commands;