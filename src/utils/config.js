const config = {
  cacheFile: 'smart-open-cache.json',

  // Folders to ignore during scan
  ignoreFolders: [
    // System & Language
    '**/node_modules/**',      // NPM packages
    '**/.git/**',              // Git folders
    '**/AppData/**',            // Windows app data
    '**/Windows/**',            // Windows system
    '**/Library/**',            // macOS system
    '**/Recycle.Bin/**',        // Recycle bin
    '**/.Trash/**',            // Trash folder

    // Python & Anaconda
    '**/anaconda/**',          // ALL anaconda folders
    '**/anaconda3/**',         // Anaconda3 specifically
    '**/.conda/**',            // Conda cache
    '**/venv/**',              // Python virtual environment
    '**/.venv/**',             // Python virtual environment
    '**/env/**',               // Python env
    '**/miniconda/**',         // Miniconda
    '**/__pycache__/**',       // Python cache

    // Build & Cache
    '**/dist/**',              // Build output
    '**/build/**',             // Build output
    '**/.cache/**',            // Cache folders
    '**/.npm/**',              // NPM cache
    '**/next/**',              // Next.js build
    '**/out/**',               // Build output

    // IDE & Editors
    '**/.vscode/**',           // VS Code settings
    '**/.idea/**',             // IntelliJ settings
    '**/.git/**',              // Git
    '**/.github/**',           // GitHub workflows

    // Package Managers
    '**/vendor/**',            // Composer (PHP)
    '**/gems/**',              // Ruby gems
    '**/go/pkg/**',            // Go packages

    // Other
    '**/node_modules_backup/**',
    '**/old/**',
    '**/backup/**',
    '**/temp/**',
    '**/tmp/**'
  ],

  codeExtensions: [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go',
    '.rb', '.php', '.swift', '.html', '.css', '.scss', '.json', '.xml',
    '.sql', '.sh', '.bash', '.yml', '.yaml', '.md', '.csv'
  ],

  priorityExtensions: [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.html', '.css', '.json', '.md'
  ],

  fuzzyThreshold: 0.3,
  maxResults: 15
};

module.exports = config;