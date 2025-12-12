/**
 * Tests for markdown pairing functionality
 *
 * Markdown pairing detects when a .md file is a companion to another file
 * (e.g., logo.png.md is a description for logo.png)
 */

describe('markdownPairing', () => {
  const { isPairedMarkdown, getBaseFilePath } = require('./markdownPairing.js');

  describe('isPairedMarkdown', () => {
    test('identifies paired markdown files', () => {
      // Simple case: logo.png.md should be paired with logo.png
      expect(isPairedMarkdown('logo.png.md')).toBe(true);

      // Multiple dots: archive.tar.gz.md should be paired with archive.tar.gz
      expect(isPairedMarkdown('archive.tar.gz.md')).toBe(true);

      // No extension in base file: README.md.md should be paired with README.md
      expect(isPairedMarkdown('README.md.md')).toBe(true);
    });

    test('identifies unpaired markdown files', () => {
      // Standalone .md file should not be paired
      expect(isPairedMarkdown('README.md')).toBe(false);

      // Regular markdown files
      expect(isPairedMarkdown('guide.md')).toBe(false);
      expect(isPairedMarkdown('document.md')).toBe(false);
    });

    test('handles edge cases', () => {
      // Just .md extension (no base name)
      expect(isPairedMarkdown('.md')).toBe(false);

      // Multiple .md extensions
      expect(isPairedMarkdown('document.md.md')).toBe(true);
    });
  });

  describe('getBaseFilePath', () => {
    test('returns base file path for paired markdown', () => {
      expect(getBaseFilePath('logo.png.md')).toBe('logo.png');
      expect(getBaseFilePath('archive.tar.gz.md')).toBe('archive.tar.gz');
      expect(getBaseFilePath('README.md.md')).toBe('README.md');
    });

    test('returns null for unpaired markdown', () => {
      expect(getBaseFilePath('README.md')).toBeNull();
      expect(getBaseFilePath('document.md')).toBeNull();
    });
  });
});
