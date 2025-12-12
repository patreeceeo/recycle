/**
 * Markdown pairing utilities for detecting file.md pairs
 *
 * A paired markdown is a .md file that describes another file.
 * Pattern: filename.ext.md (e.g., logo.png.md describes logo.png)
 */

const { ok, fail } = require('../result');
const MD_EXTENSION = '.md';
const DOUBLE_MD_EXTENSION = '.md.md';

/**
 * Checks if a markdown file is a companion to another file
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file is a paired markdown
 */
function isPairedMarkdown(filename) {
  // Must be a .md file but not a standalone .md file
  if (!filename.endsWith(MD_EXTENSION) || filename === MD_EXTENSION) {
    return false;
  }

  // If it ends with .md.md, it's definitely a paired markdown
  if (filename.endsWith(DOUBLE_MD_EXTENSION)) {
    return true;
  }

  // Otherwise, check if there's another extension before the final .md
  const baseName = filename.slice(0, -3); // Remove final .md
  return baseName.includes('.');
}

/**
 * Returns the base file path for a paired markdown
 * @param {string} filename - The paired markdown filename
 * @returns {string|null} - The base file path or null if not paired
 */
function getBaseFilePath(filename) {
  if (!isPairedMarkdown(filename)) {
    return null;
  }

  // Remove the trailing .md to get the base file path
  return filename.slice(0, -3);
}

/**
 * @typedef {Object} MarkdownPairingResult
 * @property {boolean} isPaired - Whether the markdown is paired with another file
 * @property {string} [basePath] - The base file path if paired
 */

/**
 * Gets markdown pairing information as a Result
 * @param {string} filename - The filename to check
 * @returns {import('../result').Result<MarkdownPairingResult, string>} - Result with pairing info
 */
function getMarkdownPairing(filename) {
  // Validate input
  if (typeof filename !== 'string' || filename.trim() === '') {
    return fail('Filename must be a non-empty string');
  }

  // Check if it's a .md file
  if (!filename.endsWith(MD_EXTENSION)) {
    return ok({ isPaired: false });
  }

  // Check if it's just '.md'
  if (filename === MD_EXTENSION) {
    return ok({ isPaired: false });
  }

  // If it ends with .md.md, it's definitely a paired markdown
  if (filename.endsWith(DOUBLE_MD_EXTENSION)) {
    const basePath = filename.slice(0, -3); // Remove final .md
    return ok({ isPaired: true, basePath });
  }

  // Check if there's another extension before the final .md
  const baseName = filename.slice(0, -3); // Remove final .md
  if (baseName.includes('.')) {
    return ok({ isPaired: true, basePath: baseName });
  }

  // It's a standalone .md file
  return ok({ isPaired: false });
}

// Only export the Result-based function
module.exports = {
  getMarkdownPairing,
};
