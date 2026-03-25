const fs = require('fs');
const path = require('path');
const os = require('os');

class IgnoreConfig {
  constructor() {
    this.configDir = path.join(os.homedir(), '.smart-file-opener');
    this.configFile = path.join(this.configDir, 'ignore-config.json');
    this.ensureConfigDir();
  }

  ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      // If config file is corrupted, return empty config
      console.warn('Warning: Could not load ignore config, starting fresh');
    }
    return { ignoredFolders: [] };
  }

  saveConfig(config) {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    } catch (error) {
      throw new Error(`Failed to save ignore config: ${error.message}`);
    }
  }

  addFolder(folderPath) {
    const config = this.loadConfig();

    // Normalize path separators and ensure it ends with /**
    const normalizedPath = folderPath.replace(/\\/g, '/').replace(/\/+$/, '') + '/**';

    // Check for duplicates
    if (config.ignoredFolders.includes(normalizedPath)) {
      return { success: false, message: `Folder "${folderPath}" is already in the ignore list.` };
    }

    config.ignoredFolders.push(normalizedPath);
    this.saveConfig(config);

    return { success: true, message: `Added "${folderPath}" to ignore list.` };
  }

  removeFolder(folderPath) {
    const config = this.loadConfig();

    // Normalize path separators and ensure it ends with /**
    const normalizedPath = folderPath.replace(/\\/g, '/').replace(/\/+$/, '') + '/**';

    const index = config.ignoredFolders.indexOf(normalizedPath);
    if (index === -1) {
      return { success: false, message: `Folder "${folderPath}" is not in the ignore list.` };
    }

    config.ignoredFolders.splice(index, 1);
    this.saveConfig(config);

    return { success: true, message: `Removed "${folderPath}" from ignore list.` };
  }

  listFolders() {
    const config = this.loadConfig();
    return config.ignoredFolders.map(folder => folder.replace('/**', ''));
  }

  getIgnoredFolders() {
    const config = this.loadConfig();
    return config.ignoredFolders;
  }
}

module.exports = new IgnoreConfig();