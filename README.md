<div align="center">

# ⚡ QuickOpen

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
* 🧠 **Smart File Opening** — automatically chooses best app
* 🌍 **Cross Platform** — Windows, macOS, Linux
* 💾 **Persistent Cache** — no repeated scanning
* 🎨 **Interactive CLI** — clean and intuitive experience
* 📦 **Minimal Dependencies** — fast and lightweight

---

## 🎬 Demo

> *(Add a GIF here — this is important for real impact)*

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
```

---

### System Commands

```bash
open scan         # First time scan
open rescan       # Update cache
open cache-info   # View stats
open clear-cache  # Reset cache
open help         # Help menu
```

---

## 🧠 Real World Examples

```bash
open budget.xlsx      # Opens in Excel
open photo.jpg        # Opens in image viewer
open video.mp4        # Opens in media player
open app.js           # Opens in VS Code
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

<!-- ## ⚙️ Configuration

Customize behavior in:

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
``` -->

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
