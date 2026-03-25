# Contributing Guide

Welcome to QuickOpen! This guide helps you set up your development environment and contribute to the project.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Running Locally](#running-locally)
5. [Testing](#testing)
6. [Making Changes](#making-changes)
7. [Submitting Pull Requests](#submitting-pull-requests)
8. [Code Style Guide](#code-style-guide)
9. [Reporting Issues](#reporting-issues)

---

## Getting Started

### Prerequisites

- **Node.js** 14+ (check with `node --version`)
- **npm** 6+ (check with `npm --version`)
- **Git** (for version control)
- **VS Code** (recommended for development)

### Quick Setup (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/imHardik1606/QuickOpen.git
cd QuickOpen

# 2. Install dependencies
npm install

# 3. Run initial scan
npm run scan

# 4. Test the CLI
node bin/open.js help
```

If the help message displays, you're ready to develop!

---

## Development Environment

### Step 1: Fork the Repository

1. Go to [QuickOpen GitHub](https://github.com/imHardik1606/QuickOpen)
2. Click **Fork** in top-right corner
3. Clone your fork locally

```bash
git clone https://github.com/YOUR-USERNAME/QuickOpen.git
cd QuickOpen
git remote add upstream https://github.com/imHardik1606/QuickOpen.git
```

### Step 2: Create a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming convention:**
- `feature/add-xyz` - New feature
- `fix/bug-name` - Bug fix
- `docs/improve-readme` - Documentation
- `refactor/module-name` - Code refactoring

### Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages:
- `inquirer` - Interactive CLI prompts
- `fast-glob` - Filesystem scanning
- `fuse.js` - Fuzzy search
- `chalk` - Terminal colors
- `jest` - Testing framework

---

## Project Structure

```
QuickOpen/
├── .docs/                      # Documentation files
│   ├── commands.md            # CLI command reference
│   ├── configuration.md        # Config guide
│   ├── architecture.md         # System design
│   ├── performance.md          # Performance tips
│   └── contributing.md         # This file
│
├── bin/
│   └── open.js                # CLI entry point
│
├── src/
│   ├── cli/
│   │   └── commands.js        # Command handlers
│   │
│   ├── core/
│   │   ├── fileScanner.js     # Filesystem scanning
│   │   ├── fileSearch.js      # Search algorithm
│   │   └── fileOpener.js      # File opening logic
│   │
│   └── utils/
│       ├── cache.js           # Cache management
│       ├── config.js          # Configuration
│       ├── ignoreConfig.js    # Ignore patterns
│       ├── rootConfig.js      # Root path management
│       └── logger.js          # Colored output
│
├── tests/
│   ├── fileScanner.test.js
│   ├── fileSearch.test.js
│   ├── fileOpener.test.js
│   ├── cache.test.js
│   └── logger.test.js
│
├── package.json               # Dependencies
├── README.md                  # User documentation
└── jest.config.js             # Test configuration
```

### Module Responsibilities

| Module | Purpose |
|--------|---------|
| `fileScanner.js` | Recursively scan filesystem |
| `fileSearch.js` | Find files matching query |
| `fileOpener.js` | Open files with appropriate app |
| `cache.js` | Persist scanned files |
| `ignoreConfig.js` | Manage ignore patterns |
| `rootConfig.js` | Manage root path configuration |
| `logger.js` | Colored terminal output |
| `config.js` | Static configuration |
| `commands.js` | CLI command handlers |

---

## Running Locally

### Development Command

```bash
# Scan a directory
node bin/open.js scan /path/to/directory

# Search for a file
node bin/open.js myfile.js

# View help
node bin/open.js help

# Check root path
node bin/open.js get-root

# Set root path
node bin/open.js set-root /path/to/root

# Add ignore folder
node bin/open.js ignore add node_modules
```

### With npm Scripts

```bash
# Run initial scan
npm run scan

# Run tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Debug Mode

Add logging to see what's happening:

```javascript
// In any module
console.log('Debug message:', variable);

// Then run
node bin/open.js scan
# You'll see debug output
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test fileScanner.test.js

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Files

```
tests/
├── fileScanner.test.js    # Tests for scanning logic
├── fileSearch.test.js     # Tests for search algorithm
├── fileOpener.test.js     # Tests for file opening
├── cache.test.js          # Tests for caching
└── logger.test.js         # Tests for output formatting
```

### Writing Tests

Example test structure:

```javascript
const { scan } = require('../src/core/fileScanner');

describe('fileScanner', () => {
  test('scan returns array of files', async () => {
    const files = await scan('/test/directory');
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
  });

  test('scan respects ignore patterns', async () => {
    const files = await scan('/test/directory');
    const hasNodeModules = files.some(f => 
      f.includes('node_modules')
    );
    expect(hasNodeModules).toBe(false);
  });
});
```

### Test Best Practices

```javascript
// ✅ DO
test('should find exact file match', () => {
  const results = search('app.js');
  expect(results).toContain('app.js');
});

// ❌ DON'T
test('search works', () => {
  const results = search('app.js');
  expect(results).toBeDefined();
});
```

---

## Making Changes

### Adding a New Feature

**Example: Add a new command `open sort <query>`**

1. **Implement the feature** in `src/core/`:
   ```javascript
   // src/core/fileSort.js
   function sort(query, sortBy) {
     // Implementation
   }
   module.exports = { sort };
   ```

2. **Add CLI handler** in `src/cli/commands.js`:
   ```javascript
   async function handleSort(args) {
     const query = args[0];
     const sortBy = args[1] || 'name';
     const results = sort(query, sortBy);
     // Display results
   }
   ```

3. **Add command routing** in `bin/open.js`:
   ```javascript
   case 'sort':
     commands.sort(args.slice(1));
     break;
   ```

4. **Write tests** in `tests/`:
   ```javascript
   describe('sort', () => {
     test('should sort by name', () => {
       // Test implementation
     });
   });
   ```

5. **Update documentation** in `.docs/commands.md`

6. **Test locally**:
   ```bash
   npm test
   node bin/open.js sort myquery
   ```

### Fixing a Bug

**Example: Fix case-sensitive search issue**

1. **Write a failing test** first (TDD):
   ```javascript
   test('search should be case-insensitive', () => {
     const results = search('APP.js');
     expect(results).toContain('app.js');
   });
   ```

2. **Run to verify it fails**:
   ```bash
   npm test
   # FAIL: search should be case-insensitive
   ```

3. **Fix the code** in `src/core/fileSearch.js`:
   ```javascript
   // Before
   if (filename.includes(query)) { ... }
   
   // After
   if (filename.toLowerCase().includes(query.toLowerCase())) { ... }
   ```

4. **Verify test passes**:
   ```bash
   npm test
   # PASS: search should be case-insensitive
   ```

5. **Test manually**:
   ```bash
   npm run scan
   node bin/open.js APP.js        # Should find app.js
   ```

### Improving Performance

1. **Identify bottleneck** with timing:
   ```javascript
   console.time('scan');
   const files = await scan(dir);
   console.timeEnd('scan');
   ```

2. **Optimize** the code:
   ```javascript
   // Before: Array filter + map
   const files = await glob(pattern);
   const filtered = files.filter(f => !ignored(f));
   
   // After: Pass ignore to glob directly
   const files = await glob(pattern, { ignore });
   ```

3. **Benchmark** before/after:
   ```bash
   # Before: 2000ms
   # After:  500ms
   # Improvement: 4x faster!
   ```

---

## Submitting Pull Requests

### Step 1: Commit Your Changes

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add sort by filename feature"
# or
git commit -m "fix: resolve case-sensitive search issue"
```

**Commit message format:**
```
type: subject

body (optional)

Example:
feat: add sort command for search results
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactoring
- `test` - Test additions
- `perf` - Performance improvement

### Step 2: Push Your Branch

```bash
git push origin feature/your-feature-name
```

### Step 3: Create Pull Request

1. Go to [GitHub repository](https://github.com/imHardik1606/QuickOpen/pulls)
2. Click **New Pull Request**
3. Select your branch
4. Fill in PR title and description

**PR Template:**
```markdown
## Description
Brief description of changes

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation

## Testing
- [x] Tests pass locally
- [x] Manual testing completed
- [x] No breaking changes

## Screenshots (if applicable)
Before: [image]
After: [image]
```

### Step 4: Respond to Reviews

- Maintainers may request changes
- Make updates and push to same branch
- PR automatically updates

---

## Code Style Guide

### JavaScript Style

**Use consistent formatting:**

```javascript
// ✅ GOOD
function searchFiles(query, options) {
  const results = cache.filter(file => {
    return file.includes(query);
  });
  
  return results.sort((a, b) => 
    a.localeCompare(b)
  );
}

// ❌ BAD
function search(q,o){
let r=cache.filter(f=>f.includes(q));return r.sort((a,b)=>a.localeCompare(b));}
```

### Naming Conventions

```javascript
// Files: kebab-case
my-module.js
file-opener.js

// Functions: camelCase
function scanDirectory() { }
function findMatches(query) { }

// Constants: UPPER_SNAKE_CASE
const MAX_RESULTS = 15;
const DEFAULT_THRESHOLD = 0.3;

// Classes: PascalCase
class FileScanner { }

// Private functions: _leadingUnderscore
function _privateHelper() { }
```

### Comments

```javascript
// ✅ GOOD - Explain WHY, not WHAT
// Use fast-glob instead of recursive fs for 5x speed improvement
const files = await glob(pattern, { ignore });

// ❌ BAD - Obvious from code
// Get files from glob
const files = await glob(pattern, { ignore });
```

### Error Handling

```javascript
// ✅ DO
try {
  const root = rootConfig.getRoot();
  if (!fs.existsSync(root)) {
    throw new Error(`Root path does not exist: ${root}`);
  }
} catch (error) {
  logger.error(`Setup error: ${error.message}`);
}

// ❌ DON'T
try {
  doSomething();
} catch (e) {
  // Silently ignore errors
}
```

---

## Reporting Issues

### Finding Existing Issues

```bash
# Search for related issues
# Go to: https://github.com/imHardik1606/QuickOpen/issues

# Look for similar problems
# Add comment to existing issue instead of creating duplicate
```

### Creating a New Issue

Use appropriate template:

**Bug Report:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Run `open scan`
2. Search for `file.js`
3. Bug occurs: ...

## Expected Behavior
Files should be found

## Actual Behavior
No files found

## Environment
- OS: Windows 10
- Node: v14.0.0
- QuickOpen: v1.0.0

## Error Message
```
error message here
```
```

**Feature Request:**
```markdown
## Description
Brief description of feature

## Motivation
Why this feature is needed

## Proposed Solution
How it should work

## Example Usage
open new-command
```

---

## Development Workflow Summary

```
1. Fork repository
   ↓
2. Create feature branch
   git checkout -b feature/name
   ↓
3. Make changes + write tests
   ↓
4. Run tests locally
   npm test
   ↓
5. Commit changes
   git commit -m "feat: description"
   ↓
6. Push to your fork
   git push origin feature/name
   ↓
7. Create Pull Request on GitHub
   ↓
8. Address review comments
   ↓
9. PR merged! 🎉
```

---

## Getting Help

- **Documentation**: Check `.docs/` folder
- **Issues**: Search [GitHub issues](https://github.com/imHardik1606/QuickOpen/issues)
- **Discussions**: Create GitHub discussion for questions
- **Code Review**: Ask for help in PR comments

---

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Jest Testing Docs](https://jestjs.io/docs/getting-started)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Thank You!

Your contributions help make QuickOpen better for everyone. Whether it's code, documentation, bug reports, or feature ideas - we appreciate your involvement!

**Happy contributing!** 🚀
