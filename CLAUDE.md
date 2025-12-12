# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **📖 Quick Links:** [README.md](./README.md) for setup and usage | [PRD.md](./PRD.md) for requirements and user stories

## Project Overview

Recycle is a **static file browser** - a zero-backend web application that transforms a content directory into an interactive file browser. The key innovation is using js-fileexplorer (designed for dynamic backends) with pre-generated JSON data to create a fully static site that feels dynamic.

**Core Constraint**: No backend. Everything is pre-generated at build time and deployed as static files.

For product vision and goals, see [PRD.md - Vision](./PRD.md#vision).

## Architecture

### Hybrid Static/Dynamic Model

The system operates in two phases:

1. **Build Time** (`src/build/generate.js`):
   - Walks `content/` directory recursively
   - Generates JSON for each directory and file
   - Creates image thumbnails (200×200px)
   - Parses markdown to HTML
   - Copies files to `public/content/`
   - Output: `data/` directory with JSON, `public/` for deployment

2. **Runtime** (`src/app.js` + `src/index.html`):
   - Single-page application with hash-based routing
   - FileExplorer library loads JSON instead of AJAX calls
   - Inline detail view toggles between browser and file content
   - No server requests after initial page load

### Critical Design Pattern: Overriding js-fileexplorer

js-fileexplorer expects a backend, but we override its callbacks to use static data:

```javascript
const explorer = new FileExplorer(container, {
  onrefresh: async (folder, required) => {
    // Load pre-generated JSON instead of AJAX
    const jsonFile = `data/${pathToJson(folder.GetPath())}`;
    const data = await fetch(jsonFile).then(r => r.json());
    folder.SetEntries(data.entries);
  },

  onopenfile: (folder, entry) => {
    // Show inline detail view
    showFileDetail(entry.id);
  },
});
```

This is the **entire trick** - we embrace js-fileexplorer's API design but feed it static JSON.

## Markdown Pairing Feature

A unique feature: `file.ext.md` files are automatically paired with `file.ext`:

- `logo.png` + `logo.png.md` → Detail view shows image with description below
- Paired `.md` files are **excluded** from directory listings
- Standalone `.md` files appear normally
- Build script detects pairing during two-pass directory traversal

This requires careful handling in `src/build/generate.js`:

1. First pass: identify all `.md` files and check if base file exists
2. Second pass: process files, skip paired `.md`, embed description in base file's JSON

## Data Format

See [PRD.md - Technical Specifications](./PRD.md#technical-specifications) for complete JSON format specifications.

**Key Points:**

- Directory JSON: Contains `entries` array with file/folder metadata
- File Detail JSON: Full metadata, URLs, thumbnails, and paired markdown
- IDs use format: `{path}-{filename}` (e.g., `images-logo.png`)

## Directory Structure

```
content/              # Source files (user content)
data/                 # Generated JSON (build output)
public/               # Deployable files (build output)
  ├── content/        # Original files copied here
  └── thumbnails/     # Generated thumbnails
src/                  # Frontend source
  ├── index.html      # SPA shell
  ├── app.js          # Router + FileExplorer integration
  └── styles.css      # Minimal (uses Tailwind)
lib/                  # js-fileexplorer library
build/
  └── generate.js     # Build script
```

**Generated directories (`data/`, `public/`, `thumbnails/`) should be in `.gitignore`** - they're build artifacts.

## Development Workflow

See [README.md - Build Process](./README.md#build-process) for commands.

**Quick Test Cycle:**

1. Modify code in `src/build/generate.js` or `src/`
2. `npm run build` - rebuild
3. `npm start` - serve locally
4. Test in browser at `http://localhost:8000`

## Supported File Types

**Current (v1)**:

- Images: PNG, JPEG, GIF, SVG, WebP
- Text: Markdown (.md)

**Future**: Keep architecture extensible for PDF, video, etc.

## Key Dependencies

When implementing:

- **sharp**: Image thumbnail generation and metadata extraction
- **marked**: Markdown parsing to HTML
- **highlight.js**: Syntax highlighting for code blocks in markdown
- **Tailwind CSS**: Styling (CDN or build process)

## Issue Tracking with Beads

This project uses `bd` (beads) for issue management:

```bash
bd list                          # List all issues
bd show recycle-4ry              # View specific issue
bd ready                         # Show ready work
bd update <id> --status in-progress
```

User stories are prefixed with "US-" (e.g., `US-1: Browse Directory Structure`). Implementation tasks are named descriptively.

## Design Philosophy: Ultrathink

This project follows the **ultrathink** philosophy:

- **Think Different**: Question assumptions (e.g., "Why does file browsing need a backend?")
- **Obsess Over Details**: Every interaction should feel natural and instant
- **Simplify Ruthlessly**: Minimum viable architecture, maximum functionality
- **Craft, Don't Code**: Function names, abstractions, and UX should "sing"

**When implementing features:**

1. Check [PRD.md - User Stories](./PRD.md#user-stories) for acceptance criteria
2. Understand the constraint: **zero backend, everything is static**
3. Design for elegance: if it feels complicated, there's a simpler way
4. Test the full user flow: build → deploy → browse

### Coding Standards

Always include a JSDoc comment for any module export. JSDoc comments should include:

- At least 1 full sentence explaining the motivation and use case. Maybe more if the complexity justifies it.
- Information about the parameters using @param
- Information about return value using @returns
- TypeScript types

Optimize for reading and debugging first. Premature optimization is the root of all evil!

- Use invariant to assert assumptions
- Favor Result monad over null or undefined return values
- Add comments that explain thinking behind tricky, complex or counter intuitive code, but do not over do it!
- Use console.log sensibly

Never use `any`, `Object` or `{}` as parameter or return types unless explicitly told to do so.
Tests should test the behavior, not the implementation. Avoid testing for precise values (e.g. error message strings) unless this precise value is actually important.

## Common Patterns

### Adding a New File Type

1. Update `src/build/generate.js`:
   - Add MIME type detection
   - Generate appropriate metadata
   - Create preview/thumbnail if needed
   - Add to file detail JSON

2. Update `src/app.js`:
   - Add rendering logic in `showFileDetail()`
   - Handle the new file type's display

3. Update supported formats in [README.md](./README.md#supported-file-types)

### Debugging Build Issues

Build script is synchronous and logs to console. If JSON is malformed:

- Check two-pass logic for markdown pairing
- Verify file path → ID conversion is consistent
- Ensure metadata extraction doesn't throw on edge cases

### Debugging Runtime Issues

Browser shows errors for:

- Missing JSON files → Check build output
- Hash routing not working → Verify `hashchange` event listener
- FileExplorer not loading → Check console for callback errors

Use browser DevTools Network tab to see which JSON files are fetched.

## Deployment

Build generates `public/` directory - deploy that anywhere. See [README.md - Deployment](./README.md#deployment) for platform-specific instructions (GitHub Pages, Netlify, Vercel, etc.).

## Non-Goals (Don't Implement)

- File upload/modification
- Real-time updates
- Server-side search (client-side search is future enhancement)
- Authentication (not v1)
- Backend APIs of any kind

Keep it **100% static**.
