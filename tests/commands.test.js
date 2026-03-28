describe('cli.commands.openFolder', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  function mockCommonCommandDependencies() {
    jest.doMock('../src/core/fileScanner', () => ({
      scan: jest.fn()
    }));

    jest.doMock('../src/core/fileSearch', () => ({
      search: jest.fn()
    }));

    jest.doMock('../src/core/fileOpener', () => ({
      openFile: jest.fn(),
      getFileType: jest.fn(() => 'unknown')
    }));

    jest.doMock('../src/utils/cache', () => ({
      getCacheInfo: jest.fn(),
      clearCache: jest.fn()
    }));

    jest.doMock('../src/utils/ignoreConfig', () => ({
      addFolder: jest.fn(),
      removeFolder: jest.fn(),
      listFolders: jest.fn(() => [])
    }));

    jest.doMock('inquirer', () => ({
      prompt: jest.fn()
    }));
  }

  test('uses process.cwd() when no custom root is set', async () => {
    const cwd = 'C:/Users/HP/Desktop/Web_Development/Projects';
    jest.spyOn(process, 'cwd').mockReturnValue(cwd);
    mockCommonCommandDependencies();

    const fgMock = jest.fn().mockResolvedValue([]);
    jest.doMock('fast-glob', () => fgMock);

    jest.doMock('../src/utils/rootConfig', () => ({
      isCustomRootSet: () => false,
      getRoot: () => 'C:/Users/HP'
    }));

    jest.doMock('../src/utils/config', () => ({
      ignoreFolders: []
    }));

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      warn: jest.fn(),
      opened: jest.fn(),
      help: jest.fn()
    };
    jest.doMock('../src/utils/logger', () => logger);

    const commands = require('../src/cli/commands');

    await commands.openFolder(['ebook-to-audiobook']);

    expect(fgMock).toHaveBeenCalledWith(
      ['C:/Users/HP/Desktop/Web_Development/Projects/**/ebook-to-audiobook'],
      expect.objectContaining({ onlyDirectories: true, absolute: true })
    );
    expect(logger.error).toHaveBeenCalledWith(
      "No folder named 'ebook-to-audiobook' found in C:/Users/HP/Desktop/Web_Development/Projects"
    );
  });

  test('uses configured root when custom root is set', async () => {
    mockCommonCommandDependencies();

    const fgMock = jest.fn().mockResolvedValue([]);
    jest.doMock('fast-glob', () => fgMock);

    jest.doMock('../src/utils/rootConfig', () => ({
      isCustomRootSet: () => true,
      getRoot: () => 'C:/Workspace'
    }));

    jest.doMock('../src/utils/config', () => ({
      ignoreFolders: []
    }));

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      warn: jest.fn(),
      opened: jest.fn(),
      help: jest.fn()
    };
    jest.doMock('../src/utils/logger', () => logger);

    const commands = require('../src/cli/commands');

    await commands.openFolder(['ebook-to-audiobook']);

    expect(fgMock).toHaveBeenCalledWith(
      ['C:/Workspace/**/ebook-to-audiobook'],
      expect.objectContaining({ onlyDirectories: true, absolute: true })
    );
    expect(logger.error).toHaveBeenCalledWith(
      "No folder named 'ebook-to-audiobook' found in C:/Workspace"
    );
  });

  test('opens provided directory path directly in VS Code', async () => {
    const fgMock = jest.fn().mockResolvedValue([]);
    jest.doMock('fast-glob', () => fgMock);

    jest.doMock('../src/utils/rootConfig', () => ({
      isCustomRootSet: () => false,
      getRoot: () => 'C:/Users/HP'
    }));

    jest.doMock('../src/utils/config', () => ({
      ignoreFolders: []
    }));

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      warn: jest.fn(),
      opened: jest.fn(),
      help: jest.fn()
    };
    jest.doMock('../src/utils/logger', () => logger);

    mockCommonCommandDependencies();

    const execMock = jest.fn((cmd, cb) => cb(null));
    jest.doMock('child_process', () => ({ exec: execMock }));

    const existsSyncMock = jest.fn((value) => value === 'C:\\Projects\\ebook-to-audiobook');
    const statSyncMock = jest.fn(() => ({ isDirectory: () => true }));
    jest.doMock('fs', () => ({ existsSync: existsSyncMock, statSync: statSyncMock }));

    const commands = require('../src/cli/commands');

    await commands.openFolder(['C:\\Projects\\ebook-to-audiobook']);

    expect(execMock).toHaveBeenCalledWith(
      'code "C:\\Projects\\ebook-to-audiobook"',
      expect.any(Function)
    );
    expect(fgMock).not.toHaveBeenCalled();
    expect(logger.success).toHaveBeenCalledWith('Opened folder: C:\\Projects\\ebook-to-audiobook');
  });

  test('supports folder names containing spaces', async () => {
    const fgMock = jest.fn().mockResolvedValue([]);
    jest.doMock('fast-glob', () => fgMock);

    jest.doMock('../src/utils/rootConfig', () => ({
      isCustomRootSet: () => false,
      getRoot: () => 'C:/Users/HP'
    }));

    jest.doMock('../src/utils/config', () => ({
      ignoreFolders: []
    }));

    const logger = {
      error: jest.fn(),
      info: jest.fn(),
      success: jest.fn(),
      warn: jest.fn(),
      opened: jest.fn(),
      help: jest.fn()
    };
    jest.doMock('../src/utils/logger', () => logger);

    mockCommonCommandDependencies();

    const commands = require('../src/cli/commands');

    await commands.openFolder(['My', 'Folder']);

    expect(fgMock).toHaveBeenCalledWith(
      ['C:/Users/HP/Desktop/Web_Development/Projects/smart-file-opener/**/My Folder'],
      expect.objectContaining({ onlyDirectories: true, absolute: true })
    );
    expect(logger.error).toHaveBeenCalledWith(
      "No folder named 'My Folder' found in C:\\Users\\HP\\Desktop\\Web_Development\\Projects\\smart-file-opener"
    );
  });
});
