const fs = require('fs').promises;
const path = require('path');
const { ok, fail } = require('../result');

/**
 * Recursively walks a directory and returns all file paths
 * @param {string} dir - Directory path to walk
 * @returns {Promise<Result<string[], string>>} - Result with array of file paths or error
 */
async function walkDirectory(dir) {
  // Validate input
  if (typeof dir !== 'string' || dir.trim() === '') {
    return fail('Directory path must be a non-empty string');
  }

  // Check if directory exists
  try {
    const stats = await fs.stat(dir);
    if (!stats.isDirectory()) {
      return fail(`Path is not a directory: ${dir}`);
    }
  } catch (error) {
    return fail(`Directory does not exist: ${dir}`);
  }

  const files = [];

  async function walk(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isFile()) {
          files.push(fullPath);
        } else if (entry.isDirectory()) {
          await walk(fullPath);
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to read directory ${currentDir}: ${error.message}`
      );
    }
  }

  try {
    await walk(dir);
    return ok(files);
  } catch (error) {
    return fail(error.message);
  }
}

module.exports = {
  walkDirectory,
};
