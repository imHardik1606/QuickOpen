const fs = require('fs');
const path = require('path');
const os = require('os');

class RootConfig {
  constructor() {
    this.configDir = path.join(os.homedir(), '.smart-file-opener');
    this.configFile = path.join(this.configDir, 'root-config.json');
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
      console.warn('Warning: Could not load root config, starting fresh');
    }
    return { rootPath: null };
  }

  saveConfig(config) {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    } catch (error) {
      throw new Error(`Failed to save root config: ${error.message}`);
    }
  }

  setRoot(rootPath) {
    const config = this.loadConfig();

    // Validate path exists
    if (!fs.existsSync(rootPath)) {
      return { success: false, message: `Path "${rootPath}" does not exist.` };
    }

    // Check if it's a directory
    if (!fs.statSync(rootPath).isDirectory()) {
      return { success: false, message: `Path "${rootPath}" is not a directory.` };
    }

    config.rootPath = path.resolve(rootPath); // Store absolute path
    this.saveConfig(config);

    return { success: true, message: `Root path set to: ${config.rootPath}` };
  }

  getRoot() {
    const config = this.loadConfig();
    return config.rootPath || os.homedir();
  }

  isCustomRootSet() {
    const config = this.loadConfig();
    return config.rootPath !== null;
  }
}

module.exports = new RootConfig();