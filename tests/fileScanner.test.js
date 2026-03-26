describe('fileScanner.scan', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('scans and saves cache when files are found', async () => {
    const fakeFiles = ['/fake/path/a.txt', '/fake/path/b.txt'];

    jest.doMock('fast-glob', () => jest.fn(() => Promise.resolve(fakeFiles)));
    const saveCacheSpy = jest.fn();
    jest.doMock('../src/utils/cache', () => ({ saveCache: saveCacheSpy }));
    const logSpy = { info: jest.fn(), success: jest.fn(), error: jest.fn() };
    jest.doMock('../src/utils/logger', () => logSpy);

    const { scan } = require('../src/core/fileScanner');

    const result = await scan();

    expect(result).toEqual(fakeFiles);
    expect(saveCacheSpy).toHaveBeenCalledWith(fakeFiles);
    expect(logSpy.success).toHaveBeenCalledWith(expect.stringContaining('Found'));
  });

  test('logs error when no files are found and does not throw', async () => {
    jest.doMock('fast-glob', () => jest.fn(() => Promise.resolve([])));
    const saveCacheSpy = jest.fn();
    jest.doMock('../src/utils/cache', () => ({ saveCache: saveCacheSpy }));
    const logSpy = { info: jest.fn(), error: jest.fn(), success: jest.fn() };
    jest.doMock('../src/utils/logger', () => logSpy);

    const { scan } = require('../src/core/fileScanner');

    const result = await scan();

    expect(result).toBeUndefined();
    expect(logSpy.error).toHaveBeenCalledWith('No files found. Check permissions.');
    expect(saveCacheSpy).not.toHaveBeenCalled();
  });

  test('calls process.exit on error', async () => {
    jest.doMock('fast-glob', () => jest.fn(() => Promise.reject(new Error('boom'))));
    const logSpy = { info: jest.fn(), error: jest.fn(), success: jest.fn() };
    jest.doMock('../src/utils/logger', () => logSpy);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });

    const { scan } = require('../src/core/fileScanner');

    await expect(scan()).rejects.toThrow('exit');
    expect(logSpy.error).toHaveBeenCalledWith(expect.stringContaining('Scan failed'));
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
