/**
 * Tests for markdown pairing functionality
 *
 * Markdown pairing detects when a .md file is a companion to another file
 * (e.g., logo.png.md is a description for logo.png)
 */

describe('markdownPairing', () => {
  const { getMarkdownPairing } = require('./markdownPairing.js');

  describe('getMarkdownPairing (Result monad)', () => {
    test('returns Ok result for valid paired markdown files', () => {
      const result = getMarkdownPairing('logo.png.md');

      expect(result.isOk()).toBe(true);
      const data = result.unwrap();
      expect(data.isPaired).toBe(true);
      expect(data.basePath).toBe('logo.png');
    });

    test('returns Ok result for unpaired markdown files', () => {
      const result = getMarkdownPairing('README.md');

      expect(result.isOk()).toBe(true);
      const data = result.unwrap();
      expect(data.isPaired).toBe(false);
      expect(data.basePath).toBeUndefined();
    });

    test('returns Ok result for non-markdown files', () => {
      const result = getMarkdownPairing('logo.png');

      expect(result.isOk()).toBe(true);
      const data = result.unwrap();
      expect(data.isPaired).toBe(false);
      expect(data.basePath).toBeUndefined();
    });

    test('handles double .md extensions correctly', () => {
      const result = getMarkdownPairing('README.md.md');

      expect(result.isOk()).toBe(true);
      const data = result.unwrap();
      expect(data.isPaired).toBe(true);
      expect(data.basePath).toBe('README.md');
    });

    test('returns Fail result for invalid input', () => {
      const result1 = getMarkdownPairing('');
      expect(result1.isFail()).toBe(true);
      expect(result1.unwrapErr()).toBe('Filename must be a non-empty string');

      const result2 = getMarkdownPairing(null);
      expect(result2.isFail()).toBe(true);
      expect(result2.unwrapErr()).toBe('Filename must be a non-empty string');

      const result3 = getMarkdownPairing(undefined);
      expect(result3.isFail()).toBe(true);
      expect(result3.unwrapErr()).toBe('Filename must be a non-empty string');
    });

    test('handles edge case of just .md extension', () => {
      const result = getMarkdownPairing('.md');

      expect(result.isOk()).toBe(true);
      const data = result.unwrap();
      expect(data.isPaired).toBe(false);
      expect(data.basePath).toBeUndefined();
    });

    test('works with match method for pattern matching', () => {
      const result = getMarkdownPairing('logo.png.md');

      const message = result.match({
        ok: data =>
          data.isPaired ? `Paired with ${data.basePath}` : 'Not paired',
        fail: error => `Error: ${error}`,
      });

      expect(message).toBe('Paired with logo.png');
    });

    test('maps over success values', () => {
      const result = getMarkdownPairing('logo.png.md');

      const mapped = result.map(data => ({
        ...data,
        basePathUpper: data.basePath?.toUpperCase(),
      }));

      expect(mapped.isOk()).toBe(true);
      const mappedData = mapped.unwrap();
      expect(mappedData.basePathUpper).toBe('LOGO.PNG');
    });

    // Demonstrate equivalent functionality to old isPairedMarkdown
    test('can determine if paired using Result', () => {
      const pairedFile = getMarkdownPairing('logo.png.md');
      const unpairedFile = getMarkdownPairing('README.md');
      const nonMdFile = getMarkdownPairing('logo.png');

      expect(
        pairedFile.match({
          ok: data => data.isPaired,
          fail: () => false,
        })
      ).toBe(true);

      expect(
        unpairedFile.match({
          ok: data => data.isPaired,
          fail: () => false,
        })
      ).toBe(false);

      expect(
        nonMdFile.match({
          ok: data => data.isPaired,
          fail: () => false,
        })
      ).toBe(false);
    });

    // Demonstrate equivalent functionality to old getBaseFilePath
    test('can extract base path using Result', () => {
      const pairedFile = getMarkdownPairing('logo.png.md');
      const unpairedFile = getMarkdownPairing('README.md');

      expect(
        pairedFile.match({
          ok: data => data.basePath || null,
          fail: () => null,
        })
      ).toBe('logo.png');

      expect(
        unpairedFile.match({
          ok: data => data.basePath || null,
          fail: () => null,
        })
      ).toBeNull();
    });
  });
});
