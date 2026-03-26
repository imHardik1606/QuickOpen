# QuickOpen CLI Commands

Complete reference guide for all QuickOpen commands with syntax, examples, and expected behavior.

---

## File Search Commands

### `open <filename>`

**Purpose:**  
Search for and open a file by name from the cache.

**Syntax:**
```bash
open <filename>
open <partial-name>
open <folder>/<filename>
```

**Examples:**
```bash
# Search by exact filename
open report.pdf

# Search with partial match (fuzzy search)
open reprt              # Finds report.pdf despite typo

# Search in specific folder
open src/app.js

# Multi-word search
open financial report 2024
```

**Expected Behavior:**
- Returns matching files sorted by relevance
- If single match found → opens directly
- If multiple matches found → shows interactive menu to select
- Uses fuzzy matching with 30% threshold tolerance
- Returns maximum 15 results
- **Note:** Requires cache from previous scan

---

### `open scan [directory]`

**Purpose:**  
Scan filesystem and build/update the cache of all files.

**Syntax:**
```bash
open scan                    # Scan from configured root (or home)
open scan <directory>        # Scan from specific directory
open scan .                  # Scan current directory
```

**Examples:**
```bash
# Scan from default root path
open scan

# Scan from specific directory
open scan C:\Users\YourName\Projects

# Scan current working directory
open scan .

# Scan Linux/Mac user home
open scan /home/username
```

**Expected Behavior:**
- Recursively scans directory for all files
- Respects ignore patterns (node_modules, .git, AppData, etc.)
- Saves results to `~/.smart-file-opener/smart-open-cache.json`
- Displays progress: "Scanning files..."
- Shows total files found: "Found 5,234 files"
- Takes 1-3 minutes depending on directory size
- **Note:** Must run before first search

---

## Folder Search Commands

### `open folder <folderName>`

**Purpose:**  
Search for and open a folder by name directly in VS Code.

**Syntax:**
```bash
open folder <folderName>
```

**Examples:**
```bash
# Open folder by exact name
open folder myproject

# Open folder with partial match
open folder proj          # Finds myproject, project-alpha, etc.

# Open common folder names
open folder src
open folder docs
open folder test
```

**Expected Behavior:**
- Searches for folders matching the name within the configured root directory
- If single folder found → opens directly in VS Code
- If multiple folders found → shows interactive menu to select
- Uses fuzzy matching for folder names
- Opens the selected folder in a new VS Code window
- **Note:** Requires VS Code CLI (`code` command) to be available in PATH

---

### `open rescan [directory]`

**Purpose:**  
Shorthand for rescanning and updating the cache.

**Syntax:**
```bash
open rescan                  # Rescan from configured root
open rescan <directory>      # Rescan from specific directory
```

**Examples:**
```bash
# Update cache from current root
open rescan

# Rescan a specific project folder
open rescan C:\Projects\MyApp
```

**Expected Behavior:**
- Equivalent to `open scan` with same behavior
- Useful for updating cache after file changes
- Displays same progress and results as scan
- Overwrites previous cache

---

## Root Path Configuration Commands

### `open set-root <path>`

**Purpose:**  
Set a default root directory for all future scans (persisted across sessions).

**Syntax:**
```bash
open set-root <path>
```

**Examples:**
```bash
# Windows
open set-root C:\Users\HP\Projects
open set-root C:\Users\HP\Documents

# Linux
open set-root /home/username/projects
open set-root /home/username/work

# macOS
open set-root /Users/username/Projects
open set-root /Users/username/Documents
```

**Expected Behavior:**
- Success message if path exists and is valid directory
- Error message if path doesn't exist  
- Error message if path is a file (not directory)
- Stores configuration in `~/.smart-file-opener/root-config.json`
- Persists across terminal sessions
- Future `open scan` commands use this root
- Can be overridden by explicit `open scan <path>`

---

### `open get-root`

**Purpose:**  
Display the current scanning root path.

**Syntax:**
```bash
open get-root
```

**Examples:**
```bash
# Shows custom root if set
Custom Root Path: C:\Users\HP\Desktop\Web_Development\Projects

# Shows default root if not configured
Default Root Path: C:\Users\HP (home directory)
Info: Use "open set-root <path>" to set a custom scanning root.
```

**Expected Behavior:**
- Shows "Custom Root Path" if user has set one
- Shows "Default Root Path" if using home directory default
- Displays the full absolute path
- Quick way to verify current configuration

---

### `open root reset`

**Purpose:**  
Reset root path to default home directory (removes custom configuration).

**Syntax:**
```bash
open root reset
```

**Examples:**
```bash
open root reset
# Result: Configuration cleared, scanning reverts to home directory
```

**Expected Behavior:**
- Removes custom root configuration
- Future `open scan` reverts to home directory default
- Shows success message
- Changes persist immediately

**Note:** `open get-root` will show default path after reset

---

## Ignore Folder Management Commands

### `open ignore add <path>`

**Purpose:**  
Add a folder to the ignore list (excluded from scans).

**Syntax:**
```bash
open ignore add <folderPath>
```

**Examples:**
```bash
# Ignore by folder name
open ignore add Downloads
open ignore add node_modules
open ignore add AppData

# Ignore by relative path
open ignore add .git
open ignore add dist

# Ignore by absolute path (if needed)
open ignore add C:\Users\HP\AppData\Roaming
```

**Expected Behavior:**
- Success message: "Added 'Downloads' to ignore list"
- Warning if already in list: "Already in ignore list"
- Stores in `~/.smart-file-opener/ignore-config.json`
- Changes take effect on next `open rescan`
- Normalizes paths with `/**` glob pattern internally
- Returns info message: "Run 'open rescan' to update cache"

---

### `open ignore remove <path>`

**Purpose:**  
Remove a folder from the ignore list (include in future scans).

**Syntax:**
```bash
open ignore remove <folderPath>
```

**Examples:**
```bash
# Remove from ignore list
open ignore remove Downloads
open ignore remove temp
open ignore remove .git
```

**Expected Behavior:**
- Success message: "Removed 'Downloads' from ignore list"
- Error if not found: "Not in ignore list"
- Changes take effect on next `open rescan`
- Returns info message: "Run 'open rescan' to update cache"
- **Note:** Built-in ignores (node_modules, AppData) always apply

---

### `open ignore list`

**Purpose:**  
Display all custom ignored folders.

**Syntax:**
```bash
open ignore list
```

**Examples:**
```bash
# Shows configured ignored folders
Ignored Folders:
  1. Downloads
  2. AppData
  3. node_modules
  4. .git
  5. temp

# If no custom ignores configured
Info: No custom ignore folders configured.
Info: Use "open ignore add <folderPath>" to add folders to ignore.
```

**Expected Behavior:**
- Lists all user-defined ignore patterns
- Shows numbered list for clarity
- Does NOT show built-in ignores (always applied)
- Returns info message if list is empty
- Useful for verifying current configuration

---

## System Commands

### `open cache-info`

**Purpose:**  
Display statistics about the current cache.

**Syntax:**
```bash
open cache-info
```

**Examples:**
```bash
Cache Information:
  Location: C:\Users\HP\.smart-file-opener\smart-open-cache.json
  Total Files: 45,234
  Size: 2.3 MB
  Last Updated: 3/25/2026, 2:45:30 PM
```

**Expected Behavior:**
- Shows cache file location
- Displays total indexed files
- Shows cache file size
- Shows last scan timestamp
- ❌ Red error if cache not found: "Cache not found. Run: open scan"

---

### `open clear-cache`

**Purpose:**  
Delete the cache file (requires confirmation).

**Syntax:**
```bash
open clear-cache
```

**Examples:**
```bash
# Prompts for confirmation
? Clear cache? (Y/n)
# After confirmation
✅ Cache cleared. Run "open scan" to rebuild.
```

**Expected Behavior:**
- Shows confirmation prompt  
- Only proceeds if user confirms (Y/n)
- ✅ Green success message after deletion
- User must run `open scan` to rebuild cache
- **Warning:** Will lose all indexed files

---

### `open help`

**Purpose:**  
Display command reference and examples.

**Syntax:**
```bash
open help
open -h
open --help
```

**Expected Behavior:**
- Displays complete command reference
- Shows all available commands with brief descriptions
- Shows usage examples
- Shows list of features
- No arguments required

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (invalid path, missing cache, etc.) |

---

## Tips & Best Practices

### Performance
```bash
# Set root to specific project folder for faster scans
open set-root C:\Projects\ActiveProject
open scan

# Add large folders to ignore list
open ignore add node_modules
open ignore add dist
open rescan
```

### Workflow
```bash
# First time setup
open set-root C:\Users\YourName\Projects
open scan

# Regular usage
open filename.js

# Update after adding files
open rescan
```

### Cross-Platform
```bash
# Windows
open set-root C:\Users\YourName\Projects

# Linux
open set-root /home/username/projects

# macOS
open set-root /Users/username/Projects
```

---

## Troubleshooting

**"Cache not found"**
```bash
# Solution: Run initial scan
open scan
```

**"No results found"**
```bash
# Solution: Rescan for new files
open rescan
```

**Too many results**
```bash
# Solution: Make search more specific
open filename.ext          # Instead of just "file"
open folder/filename       # Include folder path
```

**Slow scanning**
```bash
# Solution: Ignore large folders
open ignore add node_modules
open ignore add AppData
open rescan
```
