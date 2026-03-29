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
- Automatically created when you run `qopen set-root <path>`
- Also created on first scan if doesn't exist

**Managed By Commands:**
```bash
qopen set-root <path>     # Set custom root
qopen get-root           # View current root
qopen root reset         # Reset to default (home directory)
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
- Automatically created when you run `qopen ignore add <path>`
- Also created on first scan if doesn't exist

**Managed By Commands:**
```bash
qopen ignore add <path>     # Add folder to ignore list
qopen ignore remove <path>  # Remove folder from ignore list
qopen ignore list          # View all ignored folders
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
- First run of `qopen scan`
- Updated with each `qopen scan` or `qopen rescan`

**Managed By Commands:**
```bash
qopen scan              # Build/update cache
qopen rescan           # Quick rescan
qopen cache-info       # View statistics
qopen clear-cache      # Delete cache
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
qopen set-root C:\Users\YourName\Projects
```

**Add Ignore Folder:**
```bash
qopen ignore add node_modules
qopen ignore add dist
qopen rescan
```

**View Configuration:**
```bash
qopen get-root
qopen ignore list
```

**Reset to Defaults:**
```bash
qopen root reset
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
qopen rescan  # Reload configuration
```

---

## Configuration Scenarios

### Scenario 1: Multiple Projects

**Setup:**
```bash
# Project A
qopen set-root C:\Projects\ProjectA
qopen scan

# Project B (later)
qopen set-root C:\Projects\ProjectB
qopen rescan
```

**Result:**  
Only files from current root are indexed. Switch roots anytime.

---

### Scenario 2: Ignore Large Folders

**Setup:**
```bash
qopen set-root C:\Users\YourName
qopen ignore add AppData
qopen ignore add Downloads
qopen ignore add node_modules
qopen rescan
```

**Effect:**  
Scans are 10-50% faster by excluding massive folders.

---

### Scenario 3: Development Workspace

**Setup:**
```bash
# Set to active workspace
qopen set-root ~/workspace/current-project

# Ignore build artifacts
qopen ignore add node_modules
qopen ignore add dist
qopen ignore add .next
qopen ignore add __pycache__

# Initial scan
qopen scan
```

**Daily Workflow:**
```bash
qopen rescan              # Quick update (takes 30-60 seconds)
qopen feature.js         # Open files instantly
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
qopen scan
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
qopen get-root

# Reset if needed
qopen root reset
qopen set-root <correct-path>
```

**Problem:** "Ignore patterns not working"
```bash
# Solution: Always rescan after adding ignores
qopen ignore add <folder>
qopen rescan

# Verify ignores are applied
qopen ignore list
```

**Problem:** "Cache seems outdated"
```bash
# Solution: Clear and rebuild
qopen clear-cache
qopen scan
```
