const logger = require('../src/utils/logger');

// Disable chalk colors in tests
process.env.FORCE_COLOR = '0';

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
    // Check that console.log was called with a message containing the icon and text
    expect(console.log).toHaveBeenCalled();
    const callArg = console.log.mock.calls[0][0];
    expect(callArg).toContain('ℹ️');
    expect(callArg).toContain('hello');
  });

  test('success logs with checkmark icon', () => {
    logger.success('done');
    expect(console.log).toHaveBeenCalled();
    const callArg = console.log.mock.calls[0][0];
    expect(callArg).toContain('✅');
    expect(callArg).toContain('done');
  });

  test('error logs with cross icon', () => {
    logger.error('fail');
    expect(console.error).toHaveBeenCalled();
    const callArg = console.error.mock.calls[0][0];
    expect(callArg).toContain('❌');
    expect(callArg).toContain('fail');
  });

  test('warn logs with warning icon', () => {
    logger.warn('caution');
    expect(console.log).toHaveBeenCalled();
    const callArg = console.log.mock.calls[0][0];
    expect(callArg).toContain('⚠️');
    expect(callArg).toContain('caution');
  });

  test('opened logs formatted message', () => {
    logger.opened('file.txt');
    expect(console.log).toHaveBeenCalled();
    const callArg = console.log.mock.calls[0][0];
    expect(callArg).toContain('📂');
    expect(callArg).toContain('file.txt');
  });
});
