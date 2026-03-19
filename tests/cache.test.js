const fs = require('fs');
const os = require('os');
const path = require('path');

describe('cache utilities', () => {
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-open-cache-'));
  });

  afterAll(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup failures
    }
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  function loadCacheModuleWithHome(homeDir) {
    jest.doMock('os', () => ({ homedir: () => homeDir }));
    return require('../src/utils/cache');
  }

  test('saveCache creates and writes a JSON cache file', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    const files = ['/a', '/b'];

    const result = cache.saveCache(files);

    expect(result).toBe(true);
    expect(fs.existsSync(cache.cachePath)).toBe(true);

    const saved = JSON.parse(fs.readFileSync(cache.cachePath, 'utf8'));
    expect(saved.files).toEqual(files);
  });

  test('loadCache returns null when cache does not exist', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    // Ensure cache does not exist
    if (fs.existsSync(cache.cachePath)) fs.unlinkSync(cache.cachePath);

    expect(cache.loadCache()).toBeNull();
  });

  test('loadCache returns files array when cache exists', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    const files = ['/x', '/y'];
    fs.writeFileSync(cache.cachePath, JSON.stringify({ files }), 'utf8');

    expect(cache.loadCache()).toEqual(files);
  });

  test('getCacheInfo returns expected metadata', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    const files = ['/x', '/y', '/z'];

    // Use saveCache to match the expected cache format
    cache.saveCache(files);

    const info = cache.getCacheInfo();
    expect(info).toBeDefined();
    expect(info.path).toBe(cache.cachePath);
    expect(info.totalFiles).toBe(files.length);
    expect(info.size).toMatch(/KB$/);
  });

  test('clearCache removes cache file and returns true', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    fs.writeFileSync(cache.cachePath, JSON.stringify({ files: ['/x'] }), 'utf8');

    expect(cache.clearCache()).toBe(true);
    expect(fs.existsSync(cache.cachePath)).toBe(false);
  });

  test('clearCache returns false when cache missing', () => {
    const cache = loadCacheModuleWithHome(tempDir);
    if (fs.existsSync(cache.cachePath)) fs.unlinkSync(cache.cachePath);

    expect(cache.clearCache()).toBe(false);
  });
});
