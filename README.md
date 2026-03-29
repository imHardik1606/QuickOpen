<div align="center">

# ⚡ QuickOpen

<img src="./assets/logo.png" alt="QuickOpen Logo" width="500" height="250"/>

**Stop navigating folders. Start opening files instantly.**

Open any file on your computer in seconds directly from your terminal.

[![npm version](https://badge.fury.io/js/quickopen.svg)](https://badge.fury.io/js/quickopen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./tests)

[🚀 Install](#-installation) • [⚡ Features](#-features) • [💻 Usage](#-usage) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 The Problem

You have a file buried somewhere like:

```
C:\Users\[YourName]\Documents\2024\Projects\Finance\Reports\report.pdf
```

### ❌ Traditional Way

Click → Folder → Folder → Folder → File → Open

### ✅ QuickOpen Way

```bash
open report.pdf
```

👉 That’s it. File opens instantly.

---

## ⚡ Why QuickOpen?

* 🔍 **Faster than OS search**
* ⌨️ **Works directly from terminal**
* 🧠 **Fuzzy search handles typos** (`reprt` → `report.pdf`)
* ⚡ **Instant after first scan** (no repeated indexing)
* 🎯 **Smart app detection** (code → VS Code, media → default apps)

---

## ✨ Features

* 🚀 **Lightning Fast Search** — Scan once, search in milliseconds
* 📂 **Works with Any File Type** — documents, media, code, archives
* 🔍 **Fuzzy Search** — even if you mistype filenames
* 🧠 **Smart File Opening** — automatically chooses best app (code files open in new VS Code window with folder)
* 🌍 **Cross Platform** — Windows, macOS, Linux
* 💾 **Persistent Cache** — no repeated scanning
* 🎨 **Interactive CLI** — clean and intuitive experience
* 📦 **Minimal Dependencies** — fast and lightweight
* 🚫 **Custom Ignore Folders** — exclude folders from scanning
* 🏠 **Configurable Root Path** — set default scanning directory

---

## 🎬 Demo

<p align="center">
  <img src="./assets/demo.gif" alt="QuickOpen Demo" width="600" />
</p>

Example flow:

```bash
open report

✔ Found 3 matches:
1. report.pdf
2. report_final.pdf
3. report_2024.pdf

Select file: 1
→ Opening report.pdf...
```

---

## 📊 Performance

| Metric          | Value          |
| --------------- | -------------- |
| Setup Time      | ~2 minutes     |
| First Scan      | 1 to 3 minutes |
| Search Speed    | <100ms         |
| Supported Files | 50+ types      |
| Dependencies    | 3              |

---

## 🚀 Installation

### ✅ Install from npm (Recommended)

```bash
npm install -g quickopen
```

Now use from anywhere:

```bash
open report.pdf
open app.js
open photo.jpg
```

---

### 🛠️ Install from Source

```bash
git clone https://github.com/imHardik1606/QuickOpen.git
cd QuickOpen
npm install
chmod +x bin/open.js # Only for Linux or Mac users
npm run scan
```

---

## 💻 Usage

### Basic Commands

```bash
open report.pdf
open app.js
open financial report 2024
open folder myproject
```

### Folder Commands

Open folders directly in VS Code:

```bash
open folder <folderName>    # Open folder by name in VS Code
```

**Examples:**

```bash
open folder myproject       # Opens myproject folder in VS Code
open folder src             # Opens src folder in VS Code
```

**Notes:**
- Searches for folders within the configured root directory
- If multiple folders match, shows an interactive menu to select
- Opens the selected folder directly in VS Code

---

### System Commands

```bash
open scan         # First time scan
open rescan       # Update cache
open cache-info   # View stats
open clear-cache  # Reset cache
open set-root     # Set default root path
open get-root     # Show root path
open help         # Help menu
```

### Ignore Folder Management

Control which folders are excluded during scanning:

```bash
open ignore add <folderPath>     # Add folder to ignore list
open ignore remove <folderPath>  # Remove folder from ignore list
open ignore list                 # Show all ignored folders
```

**Examples:**

```bash
open ignore add Downloads        # Ignore Downloads folder
open ignore add temp             # Ignore temp folder
open ignore add .git             # Ignore .git folder
open ignore list                 # View ignored folders
open ignore remove temp          # Stop ignoring temp folder
```

**Notes:**
- Configuration persists between runs (stored in `~/.smart-file-opener/ignore-config.json`)
- Changes take effect on next scan/rescan
- Prevents duplicate entries automatically
- Built-in system folders (node_modules, .git, etc.) are always ignored

---

### Root Path Configuration

Set a default scanning root directory for cross-platform compatibility:

```bash
open set-root <path>    # Set default scanning root path
open get-root          # Show current root path
```

**Examples:**

```bash
open set-root C:\Users\YourName\Projects    # Windows
open set-root /home/username/projects       # Linux/Mac
open get-root                              # View current setting
open scan                                  # Scans from configured root
```

**Notes:**
- Configuration persists between runs (stored in `~/.smart-file-opener/root-config.json`)
- By default, scanning uses your home directory (`C:\Users\[username]` on Windows, `/Users/[username]` on Mac, `/home/[username]` on Linux)
- Use `set-root` to customize the scanning root to a specific directory
- Explicit scan path overrides configured root: `open scan /other/path`
- Root path must exist and be a directory

---

## 🧠 Real World Examples

```bash
open budget.xlsx      # Opens in Excel
open photo.jpg        # Opens in image viewer
open video.mp4        # Opens in media player
open app.js           # Opens in new VS Code window with folder
open reprt            # Finds report.pdf
```

---

## 🌍 Cross Platform Support

Works seamlessly on:

* **Windows** → uses `start`
* **macOS** → uses `open`
* **Linux** → uses `xdg-open`

No extra setup required.

---

## ⚙️ Configuration

### Built-in Settings

Default configuration in `src/utils/config.js`:

```js
const config = {
  ignoreFolders: [
    '**/node_modules/**',    // NPM packages
    '**/venv/**',           // Python virtual envs
    '**/AppData/**',        // Windows app data
    // ... and many more
  ],
  fuzzyThreshold: 0.3,      // Search sensitivity
  maxResults: 15           // Max search results
};
```

### Custom Ignore Folders

User-defined ignore folders are stored in:
```
~/.smart-file-opener/ignore-config.json
```

Manage with commands:
```bash
open ignore add Downloads
open ignore remove temp
open ignore list
```

---

## 🧪 Testing
"Uses Jest for Testing"
```bash
npm test
```

---

## 🐛 Troubleshooting

### Cache not found

```bash
npm run scan
```

### No results

```bash
npm run rescan
```

### Permission issue

```bash
chmod +x bin/open.js
```

---

## 🤝 Contributing

Contributions are welcome!

```bash
git clone https://github.com/imHardik1606/QuickOpen.git
cd QuickOpen
npm install
git checkout -b feature/your-feature
npm test
git push origin feature/your-feature
```

Then open a Pull Request 🚀

---

## 📝 Roadmap / Ideas

* File preview before opening
* GUI version
* VS Code extension
* Search filters (date, type)

---

## 📄 License

MIT License

---

## 🙏 Credits

* inquirer
* fast-glob
* fuse.js

---

## ⭐ Support

If this saves you time:

* ⭐ Star the repo
* 🐦 Share it
* 🤝 Contribute

---

<div align="center">

## 🚀 Ready to save time?

```bash
npm install -g quickopen
```

**Stop searching. Start opening.**

</div>
