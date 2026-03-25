const config = require('../src/utils/config');

describe('fileOpener', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('isCodeFile should match config extensions', async () => {
    const { isCodeFile } = require('../src/core/fileOpener');

    expect(isCodeFile('foo.js')).toBe(true);
    expect(isCodeFile('foo.html')).toBe(config.codeExtensions.includes('.html'));
    expect(isCodeFile('foo.unknown')).toBe(false);
  });

  test('openInVSCode calls spawn with correct args on Windows', async () => {
    jest.doMock('child_process', () => ({
      spawn: jest.fn(() => ({ on: jest.fn(), unref: jest.fn() })),
      exec: jest.fn()
    }));

    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const { openInVSCode } = require('../src/core/fileOpener');
    const child_process = require('child_process');

    await openInVSCode('C:/test/file.txt');

    expect(child_process.spawn).toHaveBeenCalledWith('cmd', ['/c', 'code', '--new-window', 'C:/test', 'C:/test/file.txt'], expect.any(Object));

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  test('openWithDefault calls exec with proper command on Windows', async () => {
    jest.doMock('child_process', () => ({
      spawn: jest.fn(),
      exec: jest.fn((cmd, cb) => cb(null, '', ''))
    }));

    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const { openWithDefault } = require('../src/core/fileOpener');
    const child_process = require('child_process');

    await openWithDefault('C:/test/file.txt');

    expect(child_process.exec).toHaveBeenCalledWith(expect.stringContaining('cmd /c start'), expect.any(Function));

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });
});
