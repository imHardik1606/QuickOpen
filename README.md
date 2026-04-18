<div align="center">

# QuickOpen

<img src="./assets/logo.png" alt="QuickOpen Logo" width="450" height="250"/>

QuickOpen is a fast command-line utility that allows you to open any file on your computer in seconds directly from your terminal, without navigating through folder structures.

[![npm version](https://badge.fury.io/js/quickopen-cli.svg)](https://badge.fury.io/js/quickopen-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./tests)

[Quick Start](#quick-start) • [Features](#features) • [Usage](#usage) • [Configuration](#configuration) • [Troubleshooting](#troubleshooting) • [Contributing](#contributing) • [License](#license)

</div>

---

## Overview

### The Problem

Locating and opening files requires navigating through multiple directory levels:

```
C:\Users\[YourName]\Documents\2024\Projects\Finance\Reports\report.pdf
```

**Traditional Approach:**
Click → Folder → Folder → Folder → File → Open

**With QuickOpen:**

```bash
qopen report.pdf
```

The file opens instantly from anywhere in your terminal.

### Why QuickOpen?

- **Faster than OS search** - Optimized indexing for rapid file discovery
- **Terminal integration** - Works directly from your command line
- **Fuzzy search** - Handles typos intelligently (`reprt` → `report.pdf`)
- **Instant search** - No repeated indexing after initial scan
- **Smart file opening** - Automatically selects the appropriate application (code files open in VS Code, media files in default apps)

---

## Features

- **Lightning Fast Search** - Scan once, then search results appear in milliseconds
- **Universal File Support** - Works with documents, media, code, archives, and any file type
- **Fuzzy Search** - Finds files even with typos in the filename
- **Smart File Opening** - Automatically selects the best application (code files open in a new VS Code window with folder context)
- **Cross-Platform** - Fully supported on Windows, macOS, and Linux
- **Persistent Cache** - No repeated file system scanning required
- **Interactive CLI** - Clean and intuitive command-line interface
- **Minimal Dependencies** - Fast performance with lightweight dependencies
- **Custom Ignore Lists** - Exclude specific folders from scanning
- **Configurable Root Path** - Set a default directory for scanning operations

---

## Quick Start

### Installation

**From npm (Recommended):**

```bash
npm install @imhardik16/quickopen-cli
```

Usage from any terminal:

```bash
qopen report.pdf
qopen app.js
qopen photo.jpg
```

**From Source:**

```bash
git clone https://github.com/imHardik1606/QuickOpen.git
cd QuickOpen
npm install
chmod +x bin/open.js # Linux and macOS only
npm run scan
```

## Demo

<p align="center">
  <img src="./assets/demo.gif" alt="QuickOpen Demo" width="900" />
</p>

**Example Workflow:**

```bash
qopen report

Found 3 matches:
1. report.pdf
2. report_final.pdf
3. report_2024.pdf

Select file: 1
Opening report.pdf...
```

### Performance Metrics

| Metric          | Value          |
| --------------- | -------------- |
| Setup Time      | ~2 minutes     |
| Initial Scan    | 1 to 3 minutes |
| Search Speed    | <100ms         |
| Supported Types | 50+            |
| Dependencies    | 3              |

---

## Usage Guide

### File Search Commands

```bash
qopen report.pdf              # Open a specific file
qopen app.js                  # Search for a file
qopen financial report 2024   # Multi-word search
```

### Folder Operations

Open folders directly in VS Code:

```bash
qopen folder <folderName>    # Open folder by name in VS Code
```

**Examples:**

```bash
qopen folder myproject       # Opens myproject folder in VS Code
qopen folder src             # Opens src folder in VS Code
```

**Notes:**
- Searches for folders within the configured root directory
- If multiple folders match, displays an interactive menu for selection
- Opens the selected folder directly in VS Code

### Cache and Scanning Commands

```bash
qopen scan         # Initial file system scan
qopen rescan       # Update the cache with new files
qopen cache-info   # View cache statistics
qopen clear-cache  # Reset the cache
qopen help         # Show help menu
```

---

## Configuration

### Root Path Configuration

Set a default scanning root directory:

```bash
qopen set-root <path>    # Set default scanning root path
qopen get-root           # Display current root path
```

**Examples:**

```bash
qopen set-root C:\Users\YourName\Projects    # Windows
qopen set-root /home/username/projects       # Linux/macOS
qopen get-root                               # View current setting
qopen scan                                   # Scan from configured root
```

**Notes:**
- Configuration is persistent (stored in `~/.smart-file-opener/root-config.json`)
- Default scanning directory is your home directory
- Use `set-root` to customize the scanning directory
- Explicit scan path takes precedence: `qopen scan /other/path`
- Root path must exist and be a valid directory

### Ignore Folder Management

Exclude specific folders from scanning:

```bash
qopen ignore add <folderPath>     # Add folder to ignore list
qopen ignore remove <folderPath>  # Remove folder from ignore list
qopen ignore list                 # Display all ignored folders
```

**Examples:**

```bash
qopen ignore add Downloads        # Ignore Downloads folder
qopen ignore add temp             # Ignore temp folder
qopen ignore add .git             # Ignore .git folder
qopen ignore list                 # View ignored folders
qopen ignore remove temp          # Stop ignoring temp folder
```

**Notes:**
- Configuration is persistent (stored in `~/.smart-file-opener/ignore-config.json`)
- Changes take effect on the next scan/rescan
- Duplicate entries are automatically prevented
- Built-in system folders (node_modules, .git, etc.) are always ignored

### Default Settings

Default configuration is defined in [src/utils/config.js](src/utils/config.js):

```js
const config = {
  ignoreFolders: [
    '**/node_modules/**',    // NPM packages
    '**/venv/**',           // Python virtual environments
    '**/AppData/**',        // Windows application data
    // ... and more
  ],
  fuzzyThreshold: 0.3,      // Search sensitivity threshold
  maxResults: 15            // Maximum search results
};
```

---

## Platform Support

Cross-platform compatibility with automatic platform detection:

- **Windows** - Uses `start` command
- **macOS** - Uses `open` command
- **Linux** - Uses `xdg-open` command

No additional configuration required.

---

## Examples

```bash
qopen budget.xlsx      # Opens in Excel
qopen photo.jpg        # Opens in image viewer
qopen video.mp4        # Opens in media player
qopen app.js           # Opens in VS Code with folder context
qopen reprt            # Fuzzy search finds report.pdf
```

---

## Troubleshooting

### Cache Not Found

Run the initial scan:

```bash
npm run scan
```

### No Results Returned

Update the cache:

```bash
npm run rescan
```

### Permission Denied

Grant execution permissions (Linux/macOS):

```bash
chmod +x bin/open.js
```

---

## Testing

Run the test suite using Jest:

```bash
npm test
```

---

## Contributing

Contributions are welcome! Please follow these steps:

```bash
git clone https://github.com/imHardik1606/QuickOpen.git
cd QuickOpen
npm install
git checkout -b feature/your-feature
npm test
git push origin feature/your-feature
```

---

## Roadmap

- File preview before opening
- GUI application version
- VS Code extension
- Advanced search filters (by date, file type, size)

---

## Support

If you find this project useful, please consider:

- Starring the repository
- Sharing it with others
- Contributing improvements or bug fixes

---

## License

MIT License - See [LICENSE](LICENSE) file for details

---

## Credits

This project utilizes the following libraries:

- [inquirer](https://www.npmjs.com/package/inquirer) - Interactive command-line prompts
- [fast-glob](https://www.npmjs.com/package/fast-glob) - Fast file globbing
- [fuse.js](https://fusejs.io/) - Fuzzy search library
