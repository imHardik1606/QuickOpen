const Fuse = require('fuse.js');
const path = require('path');
const { loadCache } = require('../utils/cache');
const config = require('../utils/config');
const logger = require('../utils/logger');

/**
 * Parse search query (filename or folder/filename)
 */
function parseQuery(query) {
  const parts = query.split('/').map(p => p.trim());
  const filename = parts[parts.length - 1];
  const folderPath = parts.length > 1 ? parts.slice(0, -1).join('/') : null;

  return { filename, folderPath };
}

/**
 * Filter files by exact or partial match
 */
function filterMatches(files, filename, folderPath) {
  return files.filter(file => {
    const basename = path.basename(file).toLowerCase();
    const filenameLower = filename.toLowerCase();

    // Check filename match
    if (!basename.includes(filenameLower)) return false;

    // Check folder path if specified
    if (folderPath) {
      const folderPathLower = folderPath.toLowerCase();
      const filePath = file.toLowerCase().replace(/\\/g, '/');
      return filePath.includes(folderPathLower);
    }

    return true;
  });
}

/**
 * Get priority score for file
 */
function getPriority(file, filename) {
  let score = 0;

  // Exact match bonus
  if (path.basename(file).toLowerCase() === filename.toLowerCase()) {
    score += 1000;
  }

  // Extension priority
  const ext = path.extname(file).toLowerCase();
  if (config.priorityExtensions.includes(ext)) {
    score += 100;
  }

  // Depth (closer to root = higher)
  const depth = file.split(path.sep).length;
  score += Math.max(0, 100 - depth);

  return score;
}

/**
 * Search for files
 */
function search(query) {
  if (!query || query.trim() === '') {
    logger.error('Please provide a filename to search');
    process.exit(1);
  }

  const files = loadCache();
  if (!files) {
    logger.error('Cache not found. Run: qopen scan');
    process.exit(1);
  }

  const { filename, folderPath } = parseQuery(query);

  // Direct matching
  let results = filterMatches(files, filename, folderPath);

  // If no results and no folder specified, try fuzzy search
  if (results.length === 0 && !folderPath) {
    const fuse = new Fuse(files, {
      threshold: config.fuzzyThreshold,
      ignoreLocation: true
    });

    const fuzzyResults = fuse.search(filename);
    results = fuzzyResults.map(r => r.item);
  }

  if (results.length === 0) {
    logger.error(`No files found: "${query}"`);
    process.exit(1);
  }

  // Sort by priority
  results.sort((a, b) => getPriority(b, filename) - getPriority(a, filename));

  // Return top results
  return results.slice(0, config.maxResults);
}

module.exports = { search };