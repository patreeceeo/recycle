# Implementation Plan: Build Script for Recycle (recycle-vmp)

## Overview

Implement the core build script that transforms the `content/` directory into static JSON data for the Recycle file browser. This is the foundation that enables the zero-backend architecture.

## Current State

- Project structure exists but build directory is empty
- Dependencies (sharp, marked, highlight.js) not installed
- Sample content exists: `content/README.md` and `content/images/logo.png.md`
- js-fileexplorer library downloaded in `lib/`

## Implementation Steps

### 1. Install Dependencies

Update `package.json` to add:

```json
{
  "devDependencies": {
    "sharp": "^0.33.0",
    "marked": "^11.0.0",
    "highlight.js": "^11.9.0"
  }
}
```

### 2. Create Build Script (`src/build/generate.js`)

Implement a comprehensive build script with these components:

- **Two-pass algorithm for markdown pairing**:
  - Pass 1: Discover all `.md` files and potential pairings
  - Pass 2: Process files, skipping paired `.md` files and embedding content in base files

- **Core functions**:
  - `walkDirectory(dir)`: Recursively walks content directory
  - `processImage()`: Handles image metadata and thumbnails (future enhancement)
  - `processMarkdown()`: Parses markdown to HTML
  - `createDirectoryJSON()`: Generates directory listing JSON
  - `createFileJSON()`: Generates file detail JSON

### 3. Data Structure Generation

Create JSON files in `data/` directory:

- **Directory format**:

```json
{
  "path": "/images",
  "name": "images",
  "entries": [
    {
      "id": "images-logo.png",
      "name": "logo.png",
      "type": "file",
      "size": 45230,
      "modified": "2025-12-11T10:30:00Z",
      "mimeType": "image/png",
      "thumbnail": "/thumbnails/images/logo.png"
    }
  ]
}
```

- **File detail format** (with paired markdown):

```json
{
  "id": "images-logo.png",
  "name": "logo.png",
  "path": "/images/logo.png",
  "type": "image/png",
  "description": {
    "id": "images-logo.png.md",
    "content": "# Logo\\n\\nDescription...",
    "html": "<h1>Logo</h1><p>Description...</p>"
  }
}
```

### 4. File Processing

- Copy all files from `content/` to `public/content/`
- Generate basic directory structure (thumbnails in future iteration)
- Handle markdown pairing: `file.ext.md` pairs with `file.ext`

### 5. Update Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build": "node src/build/generate.js",
    "clean": "rm -rf data/ public/",
    "start": "npm run build && cd public && python3 -m http.server 8000"
  }
}
```

## Key Implementation Details

- Use `fs.promises` for async file operations
- Handle errors gracefully - continue processing if individual files fail
- Log progress with timestamps
- Create necessary directories if they don't exist
- Sort entries: directories first, then files (alphabetical)

## Testing

- Test with existing content (README.md and logo.png.md)
- Verify JSON structure matches PRD specifications
- Ensure markdown pairing works correctly

## Files to Modify/Create

1. `package.json` - Add dependencies and scripts
2. `src/build/generate.js` - Create main build script
3. Test output in `data/` and `public/` directories

This implementation provides the foundation for all other features and follows the hybrid static/dynamic model described in CLAUDE.md.
