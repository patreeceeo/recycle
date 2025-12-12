/**
 * Tests for the build script
 */

const path = require('path');
const fs = require('fs');

// Mock the content directory structure
const mockContentDir = path.join(__dirname, '..', '..', 'test-content');

describe('build script', () => {
  beforeEach(() => {
    // Clean up any existing test content
    if (fs.existsSync(mockContentDir)) {
      fs.rmSync(mockContentDir, { recursive: true });
    }

    // Create test content directory structure
    fs.mkdirSync(mockContentDir, { recursive: true });
    fs.writeFileSync(path.join(mockContentDir, 'README.md'), '# Test Content');

    const imagesDir = path.join(mockContentDir, 'images');
    fs.mkdirSync(imagesDir);
    fs.writeFileSync(path.join(imagesDir, 'logo.png'), 'fake png content');
    fs.writeFileSync(
      path.join(imagesDir, 'logo.png.md'),
      '# Logo\nLogo description'
    );
  });

  afterEach(() => {
    // Clean up test content directory
    if (fs.existsSync(mockContentDir)) {
      fs.rmSync(mockContentDir, { recursive: true });
    }
  });

  describe('walkDirectory', () => {
    test('recursively walks directory and returns all file paths', async () => {
      const { walkDirectory } = require('./generate.js');

      const result = await walkDirectory(mockContentDir);
      expect(result.isOk()).toBe(true);

      const files = result.unwrap();
      // Should find all files recursively
      expect(files).toContain(path.join(mockContentDir, 'README.md'));
      expect(files).toContain(path.join(mockContentDir, 'images', 'logo.png'));
      expect(files).toContain(
        path.join(mockContentDir, 'images', 'logo.png.md')
      );
      expect(files).toHaveLength(3);
    });

    test('returns empty array for empty directory', async () => {
      const { walkDirectory } = require('./generate.js');

      // Create empty directory
      const emptyDir = path.join(mockContentDir, 'empty');
      fs.mkdirSync(emptyDir);

      const result = await walkDirectory(emptyDir);
      expect(result.isOk()).toBe(true);
      const files = result.unwrap();
      expect(files).toHaveLength(0);
    });

    test('returns Fail result for non-existent directory', async () => {
      const { walkDirectory } = require('./generate.js');

      const result = await walkDirectory('/non/existent/path');
      expect(result.isFail()).toBe(true);
      expect(result.unwrapErr()).toContain('Directory does not exist');
    });

    test('returns Fail result for file instead of directory', async () => {
      const { walkDirectory } = require('./generate.js');

      const filePath = path.join(mockContentDir, 'README.md');
      const result = await walkDirectory(filePath);
      expect(result.isFail()).toBe(true);
      expect(result.unwrapErr()).toContain('is not a directory');
    });

    test('returns Fail result for invalid input', async () => {
      const { walkDirectory } = require('./generate.js');

      const result1 = await walkDirectory('');
      expect(result1.isFail()).toBe(true);
      expect(result1.unwrapErr()).toBe(
        'Directory path must be a non-empty string'
      );

      const result2 = await walkDirectory(null);
      expect(result2.isFail()).toBe(true);
      expect(result2.unwrapErr()).toBe(
        'Directory path must be a non-empty string'
      );
    });
  });

  describe('processMarkdown', () => {
    test('converts markdown to HTML with syntax highlighting', async () => {
      const { processMarkdown } = require('./generate.js');

      const markdown = `# Hello World

This is a **bold** text.

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`
`;

      const result = await processMarkdown(markdown);
      expect(result.isOk()).toBe(true);

      const html = result.unwrap();
      expect(html).toContain('<h1 id="hello-world">Hello World</h1>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<code class="language-javascript">');
      // console.log gets split into spans with highlighting
      expect(html).toMatch(/hljs-title.*function_.*log/);
    });

    test('handles empty markdown', async () => {
      const { processMarkdown } = require('./generate.js');

      const result = await processMarkdown('');
      expect(result.isOk()).toBe(true);
      const html = result.unwrap();
      expect(html).toBe('');
    });

    test('returns Fail result for invalid input', async () => {
      const { processMarkdown } = require('./generate.js');

      const result = await processMarkdown(null);
      expect(result.isFail()).toBe(true);
      expect(result.unwrapErr()).toContain('Input must be a string');
    });
  });
});
