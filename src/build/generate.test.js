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
    fs.writeFileSync(path.join(imagesDir, 'photo.jpg'), 'fake jpg content');
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
      expect(files).toContain(path.join(mockContentDir, 'images', 'photo.jpg'));
      expect(files).toHaveLength(4);
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
      expect(result.unwrapErr()).toBeTruthy();
    });

    test('returns Fail result for file instead of directory', async () => {
      const { walkDirectory } = require('./generate.js');

      const filePath = path.join(mockContentDir, 'README.md');
      const result = await walkDirectory(filePath);
      expect(result.isFail()).toBe(true);
      expect(result.unwrapErr()).toBeTruthy();
    });

    test('returns Fail result for invalid input', async () => {
      const { walkDirectory } = require('./generate.js');

      const result1 = await walkDirectory('');
      expect(result1.isFail()).toBe(true);
      expect(result1.unwrapErr()).toBeTruthy();

      const result2 = await walkDirectory(null);
      expect(result2.isFail()).toBe(true);
      expect(result2.unwrapErr()).toBeTruthy();
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
      // Check that code is highlighted (has hljs classes)
      expect(html).toMatch(/class=".*hljs.*"/);
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
      expect(result.unwrapErr()).toBeTruthy();
    });
  });

  describe('createDirectoryJSON', () => {
    test('creates JSON structure for directory entries', async () => {
      const { createDirectoryJSON } = require('./generate.js');

      const dirPath = path.join(mockContentDir, 'images');
      const entries = [
        path.join(dirPath, 'logo.png'),
        path.join(dirPath, 'photo.jpg'),
      ];

      const result = await createDirectoryJSON('images', entries);
      expect(result.isOk()).toBe(true);

      const json = result.unwrap();
      expect(json).toHaveProperty('path', '/images');
      expect(json).toHaveProperty('name', 'images');
      expect(json).toHaveProperty('entries');
      expect(json.entries).toHaveLength(2);

      // Check entries have expected structure
      expect(
        json.entries.every(
          entry =>
            entry.id &&
            entry.name &&
            entry.type === 'file' &&
            entry.size &&
            entry.modified &&
            entry.mimeType
        )
      ).toBe(true);

      // Verify file entries exist with expected names
      expect(json.entries.map(e => e.name)).toEqual(
        expect.arrayContaining(['logo.png', 'photo.jpg'])
      );

      // Check that IDs are generated correctly
      const logoEntry = json.entries.find(e => e.name === 'logo.png');
      expect(logoEntry.id).toBe('images/logo.png');
      expect(logoEntry.mimeType).toBe('image/png');

      // Verify timestamps are ISO strings
      expect(new Date(logoEntry.modified).toISOString()).toBe(
        logoEntry.modified
      );
    });

    test('sorts entries: directories first, then files alphabetically', async () => {
      const { createDirectoryJSON } = require('./generate.js');

      const dirPath = path.join(mockContentDir, 'mixed');
      fs.mkdirSync(dirPath);
      fs.writeFileSync(path.join(dirPath, 'zfile.txt'), 'content');
      fs.writeFileSync(path.join(dirPath, 'afile.txt'), 'content');
      fs.mkdirSync(path.join(dirPath, 'subdir'));

      const entries = [
        path.join(dirPath, 'zfile.txt'),
        path.join(dirPath, 'subdir'),
        path.join(dirPath, 'afile.txt'),
      ];

      const result = await createDirectoryJSON('mixed', entries);
      expect(result.isOk()).toBe(true);

      const json = result.unwrap();
      expect(json.entries).toHaveLength(3);

      // Find all directories and files
      const directories = json.entries.filter(e => e.type === 'directory');
      const files = json.entries.filter(e => e.type === 'file');

      // Should have one directory and two files
      expect(directories).toHaveLength(1);
      expect(files).toHaveLength(2);

      // Directory should be subdir
      expect(directories[0].name).toBe('subdir');

      // Files should be sorted alphabetically
      expect(files.map(f => f.name)).toEqual(['afile.txt', 'zfile.txt']);

      // All directories should appear before files
      const dirIndex = json.entries.findIndex(e => e.type === 'directory');
      const firstFileIndex = json.entries.findIndex(e => e.type === 'file');
      expect(dirIndex).toBeLessThan(firstFileIndex);
    });

    test('handles empty directory', async () => {
      const { createDirectoryJSON } = require('./generate.js');

      const result = await createDirectoryJSON('empty', []);
      expect(result.isOk()).toBe(true);

      const json = result.unwrap();
      expect(json.path).toBe('/empty');
      expect(json.name).toBe('empty');
      expect(json.entries).toEqual([]);
    });

    test('returns Fail for invalid inputs', async () => {
      const { createDirectoryJSON } = require('./generate.js');

      const result1 = await createDirectoryJSON(null, []);
      expect(result1.isFail()).toBe(true);
      expect(result1.unwrapErr()).toBeTruthy();

      const result2 = await createDirectoryJSON('test', null);
      expect(result2.isFail()).toBe(true);
      expect(result2.unwrapErr()).toBeTruthy();
    });
  });
});
