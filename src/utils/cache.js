const fs = require('fs');
const os = require('os');
const path = require('path');
const config = require('./config');

const cachePath = path.join(os.homedir(), config.cacheFile);

/**
 * Save files to cache
 */
function saveCache(files) {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      files: files
    };

    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error saving cache:', error.message);
    return false;
  }
}

/**
 * Load files from cache
 */
function loadCache() {
  try {
    if (!fs.existsSync(cachePath)) {
      return null;
    }

    const content = fs.readFileSync(cachePath, 'utf8');
    const data = JSON.parse(content);

    return Array.isArray(data) ? data : data.files;
  } catch (error) {
    console.error('❌ Error loading cache:', error.message);
    return null;
  }
}

/**
 * Get cache information
 */
function getCacheInfo() {
  try {
    if (!fs.existsSync(cachePath)) {
      return null;
    }

    const stats = fs.statSync(cachePath);
    const content = fs.readFileSync(cachePath, 'utf8');
    const data = JSON.parse(content);

    return {
      path: cachePath,
      size: (stats.size / 1024).toFixed(2) + ' KB',
      lastUpdated: stats.mtime,
      totalFiles: Array.isArray(data) ? data.length : data.totalFiles
    };
  } catch (error) {
    return null;
  }
}

/**
 * Clear cache
 */
function clearCache() {
  try {
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
    return false;
  }
}

module.exports = {
  saveCache,
  loadCache,
  getCacheInfo,
  clearCache,
  cachePath
};