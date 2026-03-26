const inquirer = require('inquirer');
const { scan } = require('../core/fileScanner');
const { search } = require('../core/fileSearch');
const { openFile, getFileType } = require('../core/fileOpener');
const { getCacheInfo, clearCache: clearCacheUtil } = require('../utils/cache');
const ignoreConfig = require('../utils/ignoreConfig');
const rootConfig = require('../utils/rootConfig');
const logger = require('../utils/logger');
const fg = require('fast-glob');
const { exec } = require('child_process');

async function handleScan(scanArgs = []) {
  try {
    const scanDir = scanArgs[0] || rootConfig.getRoot() || process.cwd();
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

async function handleIgnoreAdd(args) {
  const folderPath = args[0];

  if (!folderPath) {
    logger.error('Usage: open ignore add <folderPath>');
    logger.info('Example: open ignore add Downloads');
    return;
  }

  try {
    const result = ignoreConfig.addFolder(folderPath);
    if (result.success) {
      logger.success(result.message);
      logger.info('Run "open rescan" to update the cache with new ignore settings.');
    } else {
      logger.warn(result.message);
    }
  } catch (error) {
    logger.error(`Failed to add ignore folder: ${error.message}`);
  }
}

async function handleIgnoreRemove(args) {
  const folderPath = args[0];

  if (!folderPath) {
    logger.error('Usage: open ignore remove <folderPath>');
    logger.info('Example: open ignore remove Downloads');
    return;
  }

  try {
    const result = ignoreConfig.removeFolder(folderPath);
    if (result.success) {
      logger.success(result.message);
      logger.info('Run "open rescan" to update the cache with new ignore settings.');
    } else {
      logger.warn(result.message);
    }
  } catch (error) {
    logger.error(`Failed to remove ignore folder: ${error.message}`);
  }
}

function handleIgnoreList() {
  try {
    const folders = ignoreConfig.listFolders();

    if (folders.length === 0) {
      logger.info('No custom ignore folders configured.');
      logger.info('Use "open ignore add <folderPath>" to add folders to ignore.');
      return;
    }

    console.log('\nIgnored Folders:');
    folders.forEach((folder, index) => {
      console.log(`  ${index + 1}. ${folder}`);
    });
    console.log('');
  } catch (error) {
    logger.error(`Failed to list ignore folders: ${error.message}`);
  }
}

async function handleSetRoot(args) {
  const rootPath = args[0];

  if (!rootPath) {
    logger.error('Usage: open set-root <path>');
    logger.info('Example: open set-root C:\\Users\\YourName\\Projects');
    return;
  }

  try {
    const result = rootConfig.setRoot(rootPath);
    if (result.success) {
      logger.success(result.message);
      logger.info('Run "open scan" to scan from the new root path.');
    } else {
      logger.error(result.message);
    }
  } catch (error) {
    logger.error(`Failed to set root path: ${error.message}`);
  }
}

function handleGetRoot() {
  try {
    const rootPath = rootConfig.getRoot();
    const isCustom = rootConfig.isCustomRootSet();

    if (isCustom) {
      console.log(`\nCustom Root Path: ${rootPath}\n`);
    } else {
      console.log(`\nDefault Root Path: ${rootPath} (home directory)\n`);
      logger.info('Use "open set-root <path>" to set a custom scanning root.');
    }
  } catch (error) {
    logger.error(`Failed to get root path: ${error.message}`);
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

async function handleOpenFolder(args) {
  const folderName = args[0];

  if (!folderName) {
    logger.error('Usage: open folder <folderName>');
    logger.info('Example: open folder myproject');
    return;
  }

  try {
    const root = rootConfig.getRoot() || process.cwd();
    const folders = await fg([`${root}/**/${folderName}`], {
      onlyDirectories: true,
      absolute: true,
      suppressErrors: true
    });

    if (folders.length === 0) {
      logger.error(`No folder named '${folderName}' found in ${root}`);
      return;
    }

    if (folders.length === 1) {
      exec(`code "${folders[0]}"`, (error) => {
        if (error) {
          logger.error(`Failed to open folder: ${error.message}`);
        } else {
          logger.success(`Opened folder: ${folders[0]}`);
        }
      });
      return;
    }

    // Multiple folders - show menu
    const choices = folders.map(folder => ({
      name: folder,
      value: folder
    }));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFolder',
        message: `Found ${folders.length} folder(s). Select:`,
        choices: choices,
        pageSize: 12
      }
    ]);

    exec(`code "${answer.selectedFolder}"`, (error) => {
      if (error) {
        logger.error(`Failed to open folder: ${error.message}`);
      } else {
        logger.success(`Opened folder: ${answer.selectedFolder}`);
      }
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
}

const commands = {
  scan: handleScan,
  cacheInfo: handleCacheInfo,
  clearCache: handleClearCache,
  ignoreAdd: handleIgnoreAdd,
  ignoreRemove: handleIgnoreRemove,
  ignoreList: handleIgnoreList,
  setRoot: handleSetRoot,
  getRoot: handleGetRoot,
  search: handleSearch,
  openFolder: handleOpenFolder
};

module.exports = commands;