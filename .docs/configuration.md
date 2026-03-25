# Configuration Guide

Learn how QuickOpen stores and manages configuration files.

---

## Configuration Overview

QuickOpen stores all user configuration in the `.smart-file-opener` folder in your home directory for cross-platform compatibility and persistence across sessions.

### Configuration Directory

| Platform | Path |
|----------|------|
| **Windows** | `C:\Users\[username]\.smart-file-opener\` |
| **Linux** | `/home/[username]/.smart-file-opener/` |
| **macOS** | `/Users/[username]/.smart-file-opener/` |

This directory is created automatically on first use.

---

## Configuration Files

### 1. root-config.json

**Purpose:**  
Stores the default scanning root path.

**Location:**  
`~/.smart-file-opener/root-config.json`

**Format:**
```json
{
  "rootPath": "C:\\Users\\HP\\Desktop\\Web_Development\\Projects"
}
```

or when using default:
```json
{
  "rootPath": null
}
```

**Created By:**
- Automatically created when you run `open set-root <path>`
- Also created on first scan if doesn't exist

**Managed By Commands:**
```bash
open set-root <path>     # Set custom root
open get-root           # View current root
open root reset         # Reset to default (home directory)
```

**Default Behavior:**
- If `rootPath` is `null` or file doesn't exist, uses home directory
- Windows: `C:\Users\[username]`
- Linux: `/home/[username]`
- macOS: `/Users/[username]`

---

### 2. ignore-config.json

**Purpose:**  
Stores user-defined folder ignore patterns.

**Location:**  
`~/.smart-file-opener/ignore-config.json`

**Format:**
```json
{
  "ignoredFolders": [
    "Downloads/**",
    "AppData/**",
    "node_modules/**",
    ".git/**",
    "temp/**"
  ]
}
```

**Created By:**
- Automatically created when you run `open ignore add <path>`
- Also created on first scan if doesn't exist

**Managed By Commands:**
```bash
open ignore add <path>     # Add folder to ignore list
open ignore remove <path>  # Remove folder from ignore list
open ignore list          # View all ignored folders
```

**Pattern Format:**
- Internally stored as glob patterns with `/**` suffix
- Examples: `"Downloads/**"`, `"node_modules/**"`, `".git/**"`
- User inputs are automatically normalized (e.g., `Downloads` → `Downloads/**`)

**Built-in Ignores:**
The following folders are ALWAYS ignored by default (defined in `src/utils/config.js`):
```javascript
[
  '**/node_modules/**',      // npm packages
  '**/venv/**',              // Python virtual env
  '**/AppData/**',           // Windows app data
  '**/Windows/**',           // Windows system
  '**/.git/**',              // Git folders
  '**/.github/**',           // GitHub folder
  '**/.vscode/**',           // VSCode settings
  '**/.idea/**',             // JetBrains IDE
  '**/dist/**',              // Build output
  '**/build/**',             // Build folder
  '**/next/**',              // Next.js build
  '**/.conda/**',            // Conda env
  '**/anaconda/**',          // Anaconda env
  '**/__pycache__/**',       // Python cache
  // ... and 35+ more patterns
]
```

These cannot be removed but user-defined patterns are additive.

---

### 3. smart-open-cache.json

**Purpose:**  
Cache of scanned files for fast searching.

**Location:**  
`~/.smart-file-opener/smart-open-cache.json`

**Format:**
```json
{
  "timestamp": "2026-03-25T14:30:45.123Z",
  "totalFiles": 5234,
  "files": [
    "C:/Users/HP/Desktop/project/src/app.js",
    "C:/Users/HP/Desktop/project/package.json",
    "C:/Users/HP/Desktop/project/README.md",
    "C:/Users/HP/Documents/report.pdf",
    "... more file paths ..."
  ]
}
```

**Created By:**
- First run of `open scan`
- Updated with each `open scan` or `open rescan`

**Managed By Commands:**
```bash
open scan              # Build/update cache
open rescan           # Quick rescan
open cache-info       # View statistics
open clear-cache      # Delete cache
```

**Cache Statistics:**
- `timestamp`: ISO format timestamp of last scan
- `totalFiles`: Count of indexed files
- `files`: Array of absolute file paths

**Performance Notes:**
- Cache makes searches extremely fast (<100ms)
- Cache size depends on directory size (typically 1-10 MB for 5K-50K files)
- Cache is text-based JSON for easy inspection

---

## Configuration Examples

### Complete Configuration (All Files Present)

```
~/.smart-file-opener/
├── root-config.json          # Custom root path set
├── ignore-config.json        # Custom ignore patterns
└── smart-open-cache.json     # Scanned files cache
```

### Minimal Configuration (Defaults)

```
~/.smart-file-opener/
├── root-config.json          # Contains: { "rootPath": null }
├── ignore-config.json        # Contains: { "ignoredFolders": [] }
└── smart-open-cache.json     # Contains: scanned files
```

---

## Modifying Configuration

### Method 1: Using CLI Commands (Recommended)

**Set Root Path:**
```bash
open set-root C:\Users\YourName\Projects
```

**Add Ignore Folder:**
```bash
open ignore add node_modules
open ignore add dist
open rescan
```

**View Configuration:**
```bash
open get-root
open ignore list
```

**Reset to Defaults:**
```bash
open root reset
# Then manually delete ignore-config.json to reset ignores
```

### Method 2: Manual File Editing (Advanced)

You can manually edit the JSON files if needed:

**File 1: root-config.json**
```json
{
  "rootPath": "C:\\Users\\HP\\Projects"
}
```

**File 2: ignore-config.json**  
```json
{
  "ignoredFolders": [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**"
  ]
}
```

**After manual edits:**
```bash
open rescan  # Reload configuration
```

---

## Configuration Scenarios

### Scenario 1: Multiple Projects

**Setup:**
```bash
# Project A
open set-root C:\Projects\ProjectA
open scan

# Project B (later)
open set-root C:\Projects\ProjectB
open rescan
```

**Result:**  
Only files from current root are indexed. Switch roots anytime.

---

### Scenario 2: Ignore Large Folders

**Setup:**
```bash
open set-root C:\Users\YourName
open ignore add AppData
open ignore add Downloads
open ignore add node_modules
open rescan
```

**Effect:**  
Scans are 10-50% faster by excluding massive folders.

---

### Scenario 3: Development Workspace

**Setup:**
```bash
# Set to active workspace
open set-root ~/workspace/current-project

# Ignore build artifacts
open ignore add node_modules
open ignore add dist
open ignore add .next
open ignore add __pycache__

# Initial scan
open scan
```

**Daily Workflow:**
```bash
open rescan              # Quick update (takes 30-60 seconds)
open feature.js         # Open files instantly
```

---

## Configuration Inheritance

Configuration files follow this inheritance chain:

```
1. User-defined root path (root-config.json)
   ↓ Falls back to
2. Home directory (default)
   ↓ (Used if root-config.json doesn't exist or rootPath is null)

And for ignores:

1. Built-in ignore patterns (always applied)
   ↓ Plus
2. User-defined ignore patterns (ignore-config.json)
   ↓ Applied together during scans
```

---

## Configuration Backup & Recovery

### Backup Your Configuration

```bash
# Copy config directory
cp -r ~/.smart-file-opener ~/backup/smart-file-opener

# Or manually backup individual files
cp ~/.smart-file-opener/root-config.json ~/backup/
cp ~/.smart-file-opener/ignore-config.json ~/backup/
```

### Restore Configuration

```bash
# Restore from backup
cp ~/backup/smart-file-opener/* ~/.smart-file-opener/

# Or individual files
cp ~/backup/root-config.json ~/.smart-file-opener/
```

### Reset to Factory Defaults

```bash
# Delete all configuration
rm -rf ~/.smart-file-opener

# QuickOpen will create new defaults on next run
open scan
```

---

## Configuration Validation

QuickOpen automatically validates configuration:

| Scenario | Behavior |
|----------|----------|
| Invalid JSON | Ignored, defaults used |
| Missing file | Created with defaults on first use |
| Invalid root path | Error shown, reverts to home directory |
| Duplicate ignores | Prevented automatically |
| Non-existent folders in ignores | Still applied (no harm in ignoring non-existent) |

---

## Environment Variables

QuickOpen respects these standard environment variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `HOME` (Linux/Mac) | Home directory path | `/home/username` |
| `USERPROFILE` (Windows) | Home directory path | `C:\Users\username` |

Configuration directory location is determined automatically from home directory.

---

## Configuration Size

Typical configuration file sizes:

| File | Typical Size |
|------|--------------|
| root-config.json | < 1 KB |
| ignore-config.json | 1-5 KB |
| smart-open-cache.json | 1-50 MB (depends on file count) |

**Cache Size Factors:**
- 5,000 files ≈ 500 KB
- 25,000 files ≈ 2-3 MB
- 100,000 files ≈ 10-20 MB

---

## Troubleshooting Configuration

**Problem:** "Configuration not persisting"
```bash
# Solution: Check file permissions
ls -la ~/.smart-file-opener/

# Ensure directory is writable
chmod u+w ~/.smart-file-opener/
```

**Problem:** "Wrong root path being used"
```bash
# Solution: Check current config
open get-root

# Reset if needed
open root reset
open set-root <correct-path>
```

**Problem:** "Ignore patterns not working"
```bash
# Solution: Always rescan after adding ignores
open ignore add <folder>
open rescan

# Verify ignores are applied
open ignore list
```

**Problem:** "Cache seems outdated"
```bash
# Solution: Clear and rebuild
open clear-cache
open scan
```
