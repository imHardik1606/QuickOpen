const inquirer = require('inquirer');
const { scan } = require('../core/fileScanner');
const { search } = require('../core/fileSearch');
const { openFile, getFileType } = require('../core/fileOpener');
const { getCacheInfo, clearCache: clearCacheUtil } = require('../utils/cache');
const ignoreConfig = require('../utils/ignoreConfig');
const rootConfig = require('../utils/rootConfig');
const logger = require('../utils/logger');
const config = require('../utils/config');
const fg = require('fast-glob');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  return `${(ms / 1000).toFixed(2)}s`;
}

function logDuration(action, startTime) {
  logger.info(`${action} completed in ${formatDuration(Date.now() - startTime)}`);
}

async function handleScan(scanArgs = []) {
  const startTime = Date.now();

  try {
    const scanDir = scanArgs[0] || rootConfig.getRoot() || process.cwd();
    await scan(scanDir);
    logDuration('Scan', startTime);
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
  const startTime = Date.now();

  try {
    const results = search(query);

    // If only one result, open directly
    if (results.length === 1) {
      await openFile(results[0]);
      const type = getFileType(results[0]);
      logger.opened(`${results[0]} (${type})`);
      logDuration('Open file', startTime);
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
    logDuration('Open file', startTime);
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
  const startTime = Date.now();
  const folderName = args.join(' ').trim();

  if (!folderName) {
    logger.error('Usage: open folder <folderName>');
    logger.info('Example: open folder myproject');
    return;
  }

  try {
    // If user provided a direct path, open it immediately.
    const resolvedFolderPath = path.resolve(folderName);
    if (fs.existsSync(resolvedFolderPath) && fs.statSync(resolvedFolderPath).isDirectory()) {
      await new Promise((resolve, reject) => {
        exec(`code "${resolvedFolderPath}"`, (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      logger.success(`Opened folder: ${resolvedFolderPath}`);
      logDuration('Open folder', startTime);
      return;
    }

    const root = rootConfig.isCustomRootSet() ? rootConfig.getRoot() : process.cwd();
    const searchRoot = root.replace(/\\/g, '/');
    const folders = await fg([`${searchRoot}/**/${folderName}`], {
      onlyDirectories: true,
      absolute: true,
      suppressErrors: true,
      ignore: config.ignoreFolders
    });

    if (folders.length === 0) {
      logger.error(`No folder named '${folderName}' found in ${root}`);
      return;
    }

    if (folders.length === 1) {
      await new Promise((resolve, reject) => {
        exec(`code "${folders[0]}"`, (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      logger.success(`Opened folder: ${folders[0]}`);
      logDuration('Open folder', startTime);
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

    await new Promise((resolve, reject) => {
      exec(`code "${answer.selectedFolder}"`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    logger.success(`Opened folder: ${answer.selectedFolder}`);
    logDuration('Open folder', startTime);
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