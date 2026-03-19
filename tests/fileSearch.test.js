const path = require('path');
const config = require('../src/utils/config');

describe('fileSearch.search', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  function mockLoadCache(files) {
    jest.doMock('../src/utils/cache', () => ({
      loadCache: () => files
    }));
  }

  test('returns results prioritized by extension and limited by maxResults', () => {
    const files = [
      path.join('home', 'user', 'project', 'app.txt'),
      path.join('home', 'user', 'project', 'app.js'),
      path.join('home', 'user', 'project', 'README.md')
    ];

    mockLoadCache(files);
    const { search: searchWithMock } = require('../src/core/fileSearch');

    const results = searchWithMock('app');

    // app.js should rank higher than app.txt due to configured priorityExtensions
    expect(results[0]).toBe(path.join('home', 'user', 'project', 'app.js'));
    expect(results.length).toBeLessThanOrEqual(config.maxResults);
  });

  test('filters by folder path when query includes a folder', () => {
    const files = [
      path.join('home', 'user', 'project', 'src', 'app.js'),
      path.join('home', 'user', 'project', 'app.js')
    ];

    mockLoadCache(files);
    const { search: searchWithMock } = require('../src/core/fileSearch');

    const results = searchWithMock('src/app.js');

    expect(results).toEqual([path.join('home', 'user', 'project', 'src', 'app.js')]);
  });

  test('uses fuzzy search when no direct match and no folder specified', () => {
    const files = [
      path.join('home', 'user', 'project', 'app.js'),
      path.join('home', 'user', 'project', 'other.txt')
    ];

    mockLoadCache(files);
    const { search: searchWithMock } = require('../src/core/fileSearch');

    const results = searchWithMock('appp');

    expect(results[0]).toBe(path.join('home', 'user', 'project', 'app.js'));
  });

  test('exits when query is empty', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const errorSpy = jest.spyOn(require('../src/utils/logger'), 'error').mockImplementation(() => {});
    const { search } = require('../src/core/fileSearch');

    expect(() => search('')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith('Please provide a filename to search');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('exits when cache is missing', () => {
    mockLoadCache(null);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const errorSpy = jest.spyOn(require('../src/utils/logger'), 'error').mockImplementation(() => {});
    const { search } = require('../src/core/fileSearch');

    expect(() => search('app')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith('Cache not found. Run: open scan');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('exits when no matching files are found', () => {
    const files = ['/home/user/project/other.txt'];
    mockLoadCache(files);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    const errorSpy = jest.spyOn(require('../src/utils/logger'), 'error').mockImplementation(() => {});
    const { search } = require('../src/core/fileSearch');

    expect(() => search('app.js')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith('No files found: "app.js"');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
