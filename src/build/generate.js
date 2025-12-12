const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const { ok, fail } = require('../result');

const MIME_TYPES = {
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function getMimeType(ext) {
  return MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
}

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    // @ts-ignore - highlight.js types are incompatible
    if (lang && hljs.getLanguage(lang)) {
      try {
        // @ts-ignore - highlight.js types are incompatible
        const result = hljs.highlight(code, {
          language: lang,
          ignoreIllegals: true,
        });
        // @ts-ignore - result type is incompatible
        return result.value;
      } catch (err) {
        // Fallback to plain code if highlighting fails
      }
    }
    return code;
  },
  langPrefix: 'language-',
});

/**
 * Recursively walks a directory and returns all file paths
 * @param {string} dir - Directory path to walk
 * @returns {Promise<import('../result').Result<string[], string>>} - Result with array of file paths or error
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

/**
 * Converts markdown to HTML with syntax highlighting
 * @param {string} markdown - The markdown content to convert
 * @returns {Promise<import('../result').Result<string, string>>} - Result with HTML content or error
 */
async function processMarkdown(markdown) {
  // Validate input
  if (typeof markdown !== 'string') {
    return fail('Input must be a string');
  }

  try {
    // Convert markdown to HTML
    const html = marked.parse(markdown);
    return ok(html);
  } catch (error) {
    return fail(`Failed to parse markdown: ${error.message}`);
  }
}

/**
 * @typedef {Object} DirectoryEntry
 * @property {string} id - Unique identifier for the entry
 * @property {string} name - Name of the file/directory
 * @property {'file'|'directory'} type - Entry type
 * @property {string} [size] - File size in bytes (only for files)
 * @property {string} modified - ISO timestamp of last modification
 * @property {string} [mimeType] - MIME type (only for files)
 */

/**
 * @typedef {Object} DirectoryJSON
 * @property {string} path - Absolute path from root (with leading slash)
 * @property {string} name - Directory name
 * @property {DirectoryEntry[]} entries - Array of directory entries
 */

/**
 * Creates JSON structure for a directory listing
 * @param {string} dirName - Directory name (relative to content root)
 * @param {string[]} entries - Array of file/directory paths
 * @returns {Promise<import('../result').Result<DirectoryJSON, string>>} - Result with directory JSON or error
 */
async function createDirectoryJSON(dirName, entries) {
  if (typeof dirName !== 'string' || dirName.trim() === '') {
    return fail('Directory name must be a non-empty string');
  }

  if (!Array.isArray(entries)) {
    return fail('Entries must be an array');
  }

  try {
    /** @type {DirectoryEntry[]} */
    const dirEntries = await Promise.all(
      entries.map(async entryPath => {
        const stats = await fs.stat(entryPath);
        const name = path.basename(entryPath);
        const relativePath = path.join(dirName, name).replace(/\\/g, '/');
        const id = relativePath;
        const modified = stats.mtime.toISOString();

        if (stats.isDirectory()) {
          /** @type {DirectoryEntry} */
          const entry = {
            id,
            name,
            type: 'directory',
            modified,
          };
          return entry;
        }

        /** @type {DirectoryEntry} */
        const entry = {
          id,
          name,
          type: 'file',
          size: stats.size.toString(),
          modified,
          mimeType: getMimeType(path.extname(name)),
        };
        return entry;
      })
    );

    dirEntries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    /** @type {DirectoryJSON} */
    const result = {
      path: `/${dirName}`,
      name: dirName,
      entries: dirEntries,
    };
    return ok(result);
  } catch (error) {
    return fail(`Failed to create directory JSON: ${error.message}`);
  }
}

module.exports = {
  walkDirectory,
  processMarkdown,
  createDirectoryJSON,
};
