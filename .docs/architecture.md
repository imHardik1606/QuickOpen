# Architecture Guide

Technical overview of QuickOpen's internal architecture and design patterns.

---

## System Overview

QuickOpen follows a simple but effective pipeline architecture:

```
┌─────────────┐     ┌────────┐     ┌──────────┐     ┌──────┐
│  Scanner    │ ──→ │ Cache  │ ──→ │  Search  │ ──→ │ Open │
└─────────────┘     └────────┘     └──────────┘     └──────┘
  Scan FS      Index Files    Find Matches   Execute File
```

---

## Phase 1: Scanner

**Purpose:**  
Recursively scan filesystem and build index of all files.

**Location:**  
`src/core/fileScanner.js`

### Scanning Strategy

```javascript
async function scan(scanDir = process.cwd()) {
  // 1. Resolve target directory
  const resolvedDir = path.resolve(scanDir);
  
  // 2. Use fast-glob for recursive pattern matching
  const pattern = `${resolvedDir.replace(/\\/g, '/')}/**/*`;
  
  // 3. Execute glob with options
  const files = await glob(pattern, {
    onlyFiles: true,
    suppressErrors: true,
    ignore: config.ignoreFolders,
    absolute: true
  });
  
  // 4. Filter and cache
  return cacheFiles(files);
}
```

### Key Features

**Performance Optimizations:**
- Uses `fast-glob` library (faster than recursive fs.readdir)
- Runs in single pass O(n) complexity
- Minimal memory footprint for large directories
- Pattern matching more efficient than JavaScript iteration

**Error Handling:**
- `suppressErrors: true` skips permission-denied folders
- Gracefully handles symlinks and circular references
- Returns partial results if scan encounters errors

**Ignore Logic:**
```javascript
ignore: [
  '**/node_modules/**',        // Always ignore
  '**/AppData/**',             // Always ignore
  // ... 50+ built-in patterns
  ...userDefinedIgnores        // Plus user patterns
]
```

### Glob Pattern Details

| Pattern | Matches |
|---------|---------|
| `**/*` | All files and directories recursively |
| `**/node_modules/**` | Anything inside node_modules at any depth |
| `dist/**` | Anything inside dist folder at root |

---

## Phase 2: Cache

**Purpose:**  
Persist scanned file list for sub-100ms searches.

**Location:**  
`src/utils/cache.js`

### Caching Mechanism

```javascript
// Cache Structure
{
  timestamp: "2026-03-25T14:30:45.123Z",  // Scan timestamp
  totalFiles: 5234,                        // File count
  files: [                                 // Full file paths
    "C:/Users/HP/Desktop/app.js",
    "C:/Users/HP/Desktop/config.json",
    // ...
  ]
}
```

### Performance Analysis

| Operation | Time | Method |
|-----------|------|--------|
| Scan 5K files | 15-30s | Recursive glob |
| Scan 50K files | 60-120s | Recursive glob |
| Search in cache | <100ms | Array filter + fuzzy |
| Load cache | 50-200ms | fs.readFile + JSON.parse |

### Cache Strategy

```javascript
// 1. On scan() → save cache
function saveCache(files) {
  const cache = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    files: files
  };
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

// 2. On search() → load cache
function loadCache() {
  const data = fs.readFileSync(cacheFile, 'utf8');
  return JSON.parse(data);
}
```

### Cache Behavior

- **Write:** After every `open scan` or `open rescan`
- **Read:** Before every `open <filename>` search
- **Location:** `~/.smart-file-opener/smart-open-cache.json`
- **Size:** 1-50 MB depending on file count (mostly file paths)
- **Invalidation:** Manual via `open clear-cache` or overwrite on scan

---

## Phase 3: Search

**Purpose:**  
Find files matching user query using smart matching algorithms.

**Location:**  
`src/core/fileSearch.js`

### Search Algorithm

The search uses a three-tier approach:

```
Tier 1: Direct Match
  ↓ (if not found)
Tier 2: Folder Path Match  
  ↓ (if not found)
Tier 3: Fuzzy Search
```

### Type 1: Direct Matching

```javascript
function directMatch(query, basename) {
  // Case-insensitive substring search
  return basename.toLowerCase().includes(query.toLowerCase());
}

// "app.js" matches:
// - "app.js"
// - "app" (if .js is secondary)
// - "myapp.js"
```

### Type 2: Folder Path Matching

```javascript
// If query includes "/" → match both folder and filename
// "src/app" matches:
// - /src/utils/app.js
// - /src/app.js
// - /src/app/main.js
```

### Type 3: Fuzzy Matching

Uses Fuse.js algorithm with configurable threshold:

```javascript
const options = {
  threshold: 0.3,           // 30% tolerance for typos
  keys: ['basename'],       // Search in filename only
  shouldSort: true,         // Sort by relevance
  maxPatternLength: 32      // Performance limit
};

const results = fuse.search(query);
```

**Threshold Examples:**
- `threshold: 0.3` → Allows ~30% character differences
- `"reprt"` matches `"report"` (2/6 chars different)
- `"app"` matches `"app.js"`, `"app.jsx"`, `"myapp.js"`

### Scoring System

```javascript
function scoreFile(file, query) {
  let score = 0;
  
  // Exact basename match → highest priority
  if (basename === query) score += 1000;
  
  // Code file extension → prioritize code files
  if (isCodeExtension(file)) score += 100;
  
  // Proximity to root → prefer files closer to root
  const depth = file.split('/').length;
  score += Math.max(0, 100 - depth);
  
  return score;
}
```

### Result Limiting

```javascript
const MAX_RESULTS = 15;    // Return max 15 matches
const results = matches
  .sort((a, b) => b.score - a.score)    // Sort by score
  .slice(0, MAX_RESULTS);                // Limit results
```

---

## Phase 4: Opening Files

**Purpose:**  
Launch files with appropriate application (code editor or OS default).

**Location:**  
`src/core/fileOpener.js`

### File Type Detection

```javascript
function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Code extensions from config.js
  const codeExts = [
    '.js', '.ts', '.jsx', '.tsx',
    '.py', '.java', '.c', '.cpp',
    '.html', '.css', '.json', '.md',
    // ... 30+ more
  ];
  
  return codeExts.includes(ext);
}
```

### Code File Opening (VS Code)

```javascript
async function openInVSCode(filePath) {
  const directory = path.dirname(filePath);  // Get folder
  const child = spawn(cmd, [
    '--new-window',     // Open in new window
    directory,          // With folder context
    filePath            // And file focused
  ]);
}

// Windows: cmd /c code --new-window folder\ file.js
// Mac/Linux: code --new-window folder file.js
```

**VS Code Features:**
- Opens in new window (isolated from existing)
- Loads entire folder context (can access files in sidebar)
- File automatically opened and focused
- Full workspace features available

### Default Application Opening

```javascript
async function openWithDefault(filePath) {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `cmd /c start "" "${filePath}"`;
  } else if (platform === 'darwin') {
    command = `open "${filePath}"`;
  } else {
    command = `xdg-open "${filePath}"`;
  }
  
  exec(command);  // OS determines default app
}
```

### Cross-Platform Implementation

| Platform | Code Files | Other Files |
|----------|-----------|------------|
| **Windows** | `code --new-window` | `cmd /c start` |
| **macOS** | `code --new-window` | `open` |
| **Linux** | `code --new-window` | `xdg-open` |

All paths automatically converted to platform-appropriate format.

---

## Configuration System

**Location:**  
`src/utils/config.js` + persistence files

### Configuration Flow

```
Program Start
    ↓
Load config.js (hardcoded)
    ↓
Load root-config.json (user root path)
    ↓
Load ignore-config.json (user ignore patterns)
    ↓
Merge: built-in defaults + user overrides
    ↓
Ready for scan/search
```

### Configuration Hierarchy

```javascript
// 1. Built-in defaults (always active)
const config = {
  ignoreFolders: [ /* 50+ patterns */ ],
  codeExtensions: [ /* 30+ extensions */ ],
  fuzzyThreshold: 0.3,
  maxResults: 15
};

// 2. Root path (if configured)
const rootPath = rootConfig.getRoot();  // User-defined or home

// 3. Ignore patterns (if configured)
const userIgnores = ignoreConfig.getIgnoredFolders();

// 4. Merged
const finalIgnores = [
  ...config.ignoreFolders,    // Built-ins
  ...userIgnores              // User-defined
];
```

---

## Cross-Platform Compatibility

### Path Handling

QuickOpen handles path differences automatically:

```javascript
// Normalize all paths to forward slashes internally
const normalized = filePath.replace(/\\/g, '/');

// When displaying to user, use platform-native format
const display = path.resolve(filePath);

// When passing to command, quote and escape
const escaped = `"${filePath}"`;
```

### Platform Detection

```javascript
const platform = process.platform;
// Returns: 'win32', 'darwin', 'linux'

const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';
```

### Command Execution

**Spawn-based** (preferred for static commands):
```javascript
spawn(cmd, args, { stdio: 'ignore' });
```

**Exec-based** (for shell commands):
```javascript
exec(`cmd /c start "" "${filePath}"`);
```

---

## Error Handling

### Error Categories

| Type | Handled By | Fallback |
|------|-----------|----------|
| Missing file | fileScanner | Skip file |
| Permission denied | fileScanner | Skip folder |
| Cache not found | search | Error message |
| Invalid path | rootConfig | Error message |
| App not found | fileOpener | Try default app |

### Error Recovery

```javascript
// Graceful degradation
try {
  await openInVSCode(file);
} catch (error) {
  // If VS Code failed, try default app
  await openWithDefault(file);
}
```

---

## Performance Characteristics

### Bottleneck Analysis

```
Task           Time      Bottleneck
─────────────────────────────────
Scan 50K files  60s      I/O (filesystem)
Load cache      200ms    I/O (JSON parse)
Search query    50ms     CPU (fuzzy matching)
Open file       <1s      Process spawning
```

### Optimization Strategies

1. **Caching** → Eliminates repeated scans
2. **Ignore patterns** → Reduces files to scan
3. **Streaming** → Process files during glob
4. **Limiting results** → Faster sorting (max 15)
5. **Lazy loading** → Only load cache on search

---

## Testing Architecture

**Test Structure:**
```
tests/
├── fileScanner.test.js   # Scan logic
├── fileSearch.test.js    # Search algorithms
├── fileOpener.test.js    # File opening
├── cache.test.js         # Caching mechanism
└── logger.test.js        # Output formatting
```

**Test Coverage:**
- Unit tests for each module
- Mock filesystem & child_process
- Cross-platform path testing
- Error scenario handling

---

## Extension Points

### Adding New File Types

Edit `src/utils/config.js`:
```javascript
codeExtensions: [
  // Add new extension
  '.rs',  // Rust
  '.go',  // Go
  '.php'  // PHP
]
```

### Adding Ignore Patterns

User-friendly via CLI:
```bash
open ignore add my_folder
```

Or manual edit:
```json
{
  "ignoredFolders": [
    "my_folder/**",
    "temp/**"
  ]
}
```

### Custom Search Logic

Modify `src/core/fileSearch.js`:
```javascript
// Customize scoring
function scoreFile(file, query) {
  // Custom algorithm here
}
```

---

## Design Principles

1. **Simplicity** → Single responsibility per module
2. **Performance** → Optimize for 95% use case (search)
3. **Reliability** → Graceful degradation on errors
4. **Portability** → Works on Windows/Mac/Linux
5. **Configurability** → User controls ignore patterns & root
6. **Feedback** → Color-coded messages for outcomes

---

## Future Architecture Improvements

Potential enhancements:

- **Incremental scanning** → Only scan changed files
- **Parallel processing** → Multi-threaded scanning
- **Custom matchers** → Allow user-defined search algorithms
- **Plugins system** → Extensible architecture
- **Database backend** → SQLite for faster queries on massive directories
- **Watch mode** → Auto-rescan on filesystem changes
