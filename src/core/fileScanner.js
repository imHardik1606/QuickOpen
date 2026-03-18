const fg = require('fast-glob');
const os = require('os');
const { saveCache } = require('../utils/cache');
const config = require('../utils/config');
const logger = require('../utils/logger');

/**
 * Scan entire file system for files
 */
async function scan() {
  const home = os.homedir();

  logger.info('🔍 Scanning files...');
  logger.info(`📂 Location: ${home}\n`);

  try {
    const files = await fg(
      [`${home.replace(/\\/g, '/')}/**/*`],
      {
        onlyFiles: true,
        suppressErrors: true,
        ignore: config.ignoreFolders,
        absolute: true
      }
    );

    if (files.length === 0) {
      logger.error('No files found. Check permissions.');
      return;
    }

    logger.success(`\n✅ Found ${files.length.toLocaleString()} files`);

    // Save to cache
    saveCache(files);
    logger.success('📊 Cache saved successfully\n');

    return files;
  } catch (error) {
    logger.error(`Scan failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { scan };