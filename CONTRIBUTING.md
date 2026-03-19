# Contributing to QuickOpen

Thank you for your interest in contributing to QuickOpen! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Run tests to ensure everything works
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 14 or higher
- npm 6 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/imHardik1606/QuickOpen.git
cd quickopen

# Install dependencies
npm install

# Make the CLI executable
chmod +x bin/open.js

# Run initial scan (optional, for testing)
npm run scan
```

### Development Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Start the CLI
npm start

# Lint code (if ESLint is added)
npm run lint
```

## 📁 Project Structure

```
quickopen/
├── bin/
│   └── open.js              # CLI entry point
├── src/
│   ├── cli/
│   │   └── commands.js      # Command handlers
│   ├── core/
│   │   ├── fileOpener.js    # File opening logic
│   │   ├── fileScanner.js   # File system scanning
│   │   ├── fileSearch.js    # Search functionality
│   └── utils/
│       ├── cache.js         # Cache management
│       ├── config.js        # Configuration
│       └── logger.js        # Logging utilities
├── tests/                   # Unit tests
│   ├── cache.test.js
│   ├── fileOpener.test.js
│   ├── fileScanner.test.js
│   ├── fileSearch.test.js
│   └── logger.test.js
├── package.json
├── README.md
└── CONTRIBUTING.md
```

## 💻 Coding Standards

### JavaScript Style

- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use arrow functions for anonymous functions
- Use template literals for string interpolation
- Keep lines under 100 characters
- Use meaningful variable and function names

### Code Organization

- Keep functions small and focused
- Use async/await for asynchronous operations
- Handle errors appropriately
- Add JSDoc comments for public functions
- Export only necessary functions from modules

### Example

```javascript
/**
 * Searches for files matching the query
 * @param {string} query - Search query
 * @returns {Array<string>} Matching file paths
 */
function search(query) {
  // Implementation
}
```

## 🧪 Testing

QuickOpen uses Jest for testing. All new features should include comprehensive tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/fileSearch.test.js
```

### Writing Tests

- Place test files in the `tests/` directory
- Name test files with `.test.js` extension
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies when necessary
- Aim for high code coverage

### Test Example

```javascript
describe('fileSearch.search', () => {
  test('returns matching files', () => {
    // Test implementation
  });
});
```

## 📝 Submitting Changes

### Pull Request Process

1. Ensure your code follows the coding standards
2. Add tests for new functionality
3. Update documentation if needed
4. Ensure all tests pass
5. Create a pull request with a clear description

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add fuzzy search functionality
fix: resolve issue with file path handling
docs: update README with installation instructions
test: add tests for cache management
```

### Pull Request Template

When submitting a PR, include:

- **Description**: What changes were made and why
- **Testing**: How the changes were tested
- **Breaking Changes**: Any breaking changes
- **Screenshots**: If UI changes were made

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment** (OS, Node.js version, etc.)
- **Error messages** or logs

### Feature Requests

For new features, please:

- Describe the problem you're trying to solve
- Explain why this feature would be useful
- Provide examples of how it would work

## 🔧 Development Notes

### Cross-Platform Considerations

QuickOpen is designed to work on Windows, macOS, and Linux. When making changes:

- Test on multiple platforms if possible
- Use `process.platform` for platform-specific logic
- Avoid platform-specific file paths in code
- Consider different default applications per platform

### Performance

- Keep the tool fast (target <100ms search time)
- Minimize file system operations
- Use caching effectively
- Profile performance for large file systems

### Security

- Validate user input
- Handle file paths safely
- Don't execute arbitrary commands
- Follow Node.js security best practices

## 📄 License

By contributing to QuickOpen, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you to all contributors who help make QuickOpen better! Your time and effort are greatly appreciated.

---

For questions or discussions, please open an issue on GitHub.