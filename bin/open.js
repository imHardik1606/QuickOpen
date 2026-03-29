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

  case 'set-root':
    commands.setRoot(args.slice(1));
    break;

  case 'get-root':
    commands.getRoot();
    break;

  case 'folder':
    commands.openFolder(args.slice(1));
    break;

  case 'ignore':
    const subCommand = args[1];
    const ignoreArgs = args.slice(2);

    switch (subCommand) {
      case 'add':
        commands.ignoreAdd(ignoreArgs);
        break;
      case 'remove':
        commands.ignoreRemove(ignoreArgs);
        break;
      case 'list':
        commands.ignoreList();
        break;
      default:
        logger.error('Invalid ignore command. Use: add, remove, or list');
        logger.info('Examples:');
        logger.info('  qopen ignore add Downloads');
        logger.info('  qopen ignore remove Downloads');
        logger.info('  qopen ignore list');
        process.exit(1);
    }
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