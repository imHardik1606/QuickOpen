const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('../utils/config');

/**
 * Get file type from extension
 */
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  const types = {
    '.pdf': 'PDF Document',
    '.doc': 'Word Document',
    '.docx': 'Word Document',
    '.xlsx': 'Excel Spreadsheet',
    '.xls': 'Excel Spreadsheet',
    '.ppt': 'PowerPoint Presentation',
    '.pptx': 'PowerPoint Presentation',
    '.jpg': 'JPEG Image',
    '.jpeg': 'JPEG Image',
    '.png': 'PNG Image',
    '.gif': 'GIF Image',
    '.mp4': 'MP4 Video',
    '.avi': 'AVI Video',
    '.mkv': 'MKV Video',
    '.mp3': 'MP3 Audio',
    '.wav': 'WAV Audio',
    '.zip': 'ZIP Archive',
    '.rar': 'RAR Archive',
    '.txt': 'Text File',
    '.md': 'Markdown File'
  };

  return types[ext] || 'File';
}

/**
 * Check if file should open in VS Code
 */
function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return config.codeExtensions.includes(ext);
}

/**
 * Open file with VS Code
 */
async function openInVSCode(filePath) {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const directory = path.dirname(filePath);
    const cmd = isWindows ? 'cmd' : 'code';
    const args = isWindows
      ? ['/c', 'code', '--new-window', directory, filePath]
      : ['--new-window', directory, filePath];

    console.log(`Running: ${cmd} ${args.map(a => JSON.stringify(a)).join(' ')}`);

    const child = spawn(cmd, args, {
      detached: true,
      stdio: 'ignore'
    });

    child.on('error', (error) => {
      console.error(`VSCode spawn error: ${error.message}`);
      reject(error);
    });

    child.unref();
    resolve();
  });
}

/**
 * Open file with default application
 */
async function openWithDefault(filePath) {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command;

    try {
      if (platform === 'win32') {
        command = `cmd /c start "" "${filePath}"`;
      } else if (platform === 'darwin') {
        command = `open "${filePath}"`;
      } else {
        command = `xdg-open "${filePath}"`;
      }

      console.log(`Running: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Open default app error: ${error.message}`);
          console.error(`stderr: ${stderr}`);
          reject(error);
        } else {
          resolve();
        }
      });
    } catch (error) {
      console.error(`Open default app exception: ${error.message}`);
      reject(error);
    }
  });
}

/**
 * Open file with appropriate application
 */
async function openFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const isCode = isCodeFile(filePath);

  if (isCode) {
    try {
      await openInVSCode(filePath);
    } catch {
      await openWithDefault(filePath);
    }
  } else {
    await openWithDefault(filePath);
  }
}

module.exports = {
  getFileType,
  isCodeFile,
  openFile,
  openInVSCode,
  openWithDefault
};