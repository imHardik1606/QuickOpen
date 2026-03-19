<div align="center">

# ⚡ QuickOpen

**Stop navigating folders. Start living faster.**

Open any file on your computer in seconds. No more clicking through endless folders.

[![npm version](https://badge.fury.io/js/quickopen.svg)](https://badge.fury.io/js/quickopen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./tests)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Commands](#-commands) • [Contributing](#-contributing)

</div>

---

## 🎯 The Problem

You have a file buried deep in your computer:

```
C:\Users\YourName\Documents\2024\Projects\Finance\Reports\report.pdf
```

**Old way:** Click folder → Click folder → Click folder → Finally open ❌
**QuickOpen way:** `open report.pdf` → Opens instantly ✅

---

## ✨ Features

* 🚀 **Lightning Fast** - Search 270K+ files in milliseconds
* 📦 **Any File Type** - PDFs, images, videos, code, documents
* 🎯 **Smart App Selection**
* 🔍 **Fuzzy Search** - Handles typos
* 🌍 **Cross Platform** - Windows, macOS, Linux
* 💾 **One Time Setup**
* 🎨 **Beautiful CLI**
* 📱 **Minimal Dependencies**

---

## 🌍 Cross-Platform Support

QuickOpen works on **Windows**, **macOS**, and **Linux**. The tool automatically detects your operating system and uses appropriate commands.

### Requirements by Platform

**Windows:**
- Node.js 14+
- No additional setup needed

**macOS:**
- Node.js 14+
- VS Code (optional, for code file opening) - ensure `code` command is in PATH

**Linux:**
- Node.js 14+
- VS Code (optional, for code file opening) - ensure `code` command is in PATH
- `xdg-open` utility (usually pre-installed)

### Platform-Specific Behavior

- **File Opening**: Uses native system commands (`start` on Windows, `open` on macOS, `xdg-open` on Linux)
- **VS Code Integration**: Assumes VS Code is installed and `code` is available in PATH
- **File Scanning**: Works across all platforms using cross-platform libraries

---

## 📊 Quick Stats


| Metric           | Value            |
| ---------------- | ---------------- |
| Setup Time       | 2 minutes        |
| First Scan       | 1 to 3 minutes   |
| Search Speed     | under 100ms      |
| File Types       | 50+              |
| Code Size        | around 600 lines |
| Dependencies     | 3                |
| Time Saved Daily | 15 to 20 minutes |

---

## 🚀 Installation

### Requirements

* Node.js 14+
* npm

### Setup

```bash
git clone https://github.com/yourusername/quickopen.git
cd quickopen
npm install
chmod +x bin/open.js
npm run scan
open report.pdf
```

### Global Install

```bash
npm install -g .
```

---

## 💻 Usage

```bash
open report.pdf
open src/app.js
open financial report 2024
```

### System Commands

```bash
open scan
open rescan
open cache-info
open clear-cache
open help
```

---

## 📋 Commands

| Command          | Purpose         |
| ---------------- | --------------- |
| npm run scan     | First time scan |
| npm run rescan   | Update cache    |
| open <file>      | Open file       |
| open help        | Help            |
| open cache-info  | Cache info      |
| open clear-cache | Reset           |

---

## 🗂️ Project Structure

```
quickopen/
├── bin/
├── src/
├── tests/
├── package.json
└── README.md
```

---

## 🎨 Supported Files

### Code

JS, TS, Python, Java, C++, HTML, CSS, JSON

### Documents

PDF, Word, Excel, PowerPoint

### Media

Images, Videos, Audio

### Archives

ZIP, RAR, 7z

---

## ⚙️ Configuration

Edit:

```
src/utils/config.js
```

Example:

```js
const config = {
  ignoreFolders: ['**/node_modules/**'],
  fuzzyThreshold: 0.3,
  maxResults: 15
};
```

---

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

---

## 🐛 Troubleshooting

**Cache not found**

```bash
npm run scan
```

**No results**

```bash
npm run rescan
```

**Permission issue**

```bash
chmod +x bin/open.js
```

**VS Code not opening files (macOS/Linux)**

Ensure VS Code is installed and `code` command is in your PATH:

```bash
# Check if code command exists
which code

# If not found, add VS Code to PATH or create symlink
# macOS: Usually /Applications/Visual Studio Code.app/Contents/Resources/app/bin
# Linux: Usually /usr/bin or /snap/bin
```

**File opening fails**

- **Windows**: Ensure default apps are associated with file types
- **macOS**: Check if `open` command works: `open test.txt`
- **Linux**: Check if `xdg-open` works: `xdg-open test.txt`

**Large file systems**

Scanning may take longer on systems with many files. The cache is saved locally and reused for fast searches.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Coding standards
- Testing guidelines
- Submitting pull requests

---

<div align="center">

Made with ❤️ for developers who value their time.

</div>

---

## 🤝 Contributing

```bash
git clone your-fork
npm install
git checkout -b feature/name
npm test
git push
```

---

## 📝 Ideas

* Add more file types
* Improve search
* Add GUI
* Build VS Code extension

---

## 📄 Changelog

### v1.0.0

* Initial release
* Fuzzy search
* Fast caching
* CLI support

---

## 📜 License

MIT License

---

## 🙏 Credits

* inquirer
* fast-glob
* fuse.js

---

## 💡 Tips

```bash
npm run rescan
npm install -g .
```

---

## ⭐ Support

* Star the repo
* Share it
* Contribute

---

<div align="center">

Made with ❤️

**Open files instantly.**

</div>
