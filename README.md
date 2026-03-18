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
* 🌍 **Cross Platform**
* 💾 **One Time Setup**
* 🎨 **Beautiful CLI**
* 📱 **Minimal Dependencies**

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
