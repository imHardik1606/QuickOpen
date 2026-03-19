#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const commands = require('../src/cli/commands');
const logger = require('../src/utils/logger');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Show help if no command
if (!command) {
  logger.help();
  process.exit(0);
}

// Handle different commands
switch (command) {
  case 'scan':
  case 'rescan':
    commands.scan(args.slice(1));
    break;

  case 'cache-info':
    commands.cacheInfo();
    break;

  case 'clear-cache':
    commands.clearCache();
    break;

  case 'help':
  case '-h':
  case '--help':
    logger.help();
    break;

  default:
    // Regular search
    const searchQuery = args.join(' ');
    commands.search(searchQuery);
}