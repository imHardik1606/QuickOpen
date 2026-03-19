const logger = require('../src/utils/logger');

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('info logs with info icon', () => {
    logger.info('hello');
    expect(console.log).toHaveBeenCalledWith('ℹ️  hello');
  });

  test('success logs with checkmark icon', () => {
    logger.success('done');
    expect(console.log).toHaveBeenCalledWith('✅ done');
  });

  test('error logs with cross icon', () => {
    logger.error('fail');
    expect(console.error).toHaveBeenCalledWith('❌ fail');
  });

  test('warn logs with warning icon', () => {
    logger.warn('caution');
    expect(console.log).toHaveBeenCalledWith('⚠️  caution');
  });

  test('opened logs formatted message', () => {
    logger.opened('file.txt');
    expect(console.log).toHaveBeenCalledWith('\n📂 Opened: file.txt\n');
  });
});
