# Product Requirements Document: Static File Browser

> **📖 Quick Links:** [README.md](./README.md) for setup and usage | [CLAUDE.md](./CLAUDE.md) for technical architecture

## Overview

A web-based, read-only file browser built as a static site using js-fileexplorer. The browser enables users to navigate directories and view file details without requiring a backend server.

## Vision

Create an elegant, zero-backend file browsing experience that feels dynamic and responsive while being deployable anywhere static files can be hosted. The system should make exploring content as natural as using a native file manager.

## Goals

- **Zero Backend**: Entirely static HTML/CSS/JS with pre-generated JSON data
- **Elegant UX**: Smooth navigation, instant responses, intuitive interface
- **Simple Deployment**: Works on GitHub Pages, Netlify, S3, or any static host
- **Maintainable**: Clear separation between content and presentation
- **Extensible**: Architecture supports future enhancements

## Non-Goals

- File upload/modification capabilities
- Real-time updates or collaboration features
- Server-side search or filtering
- Authentication or access control (in v1)

## Technical Architecture

For detailed architecture and implementation patterns, see [CLAUDE.md - Architecture](./CLAUDE.md#architecture).

**High-level overview:**
- **Library**: js-fileexplorer (adapted for static use)
- **Build Time**: Node.js generates all JSON data
- **Runtime**: Single-page app with hash routing
- **Key Innovation**: Override js-fileexplorer callbacks to load static JSON instead of AJAX

## User Stories

### US-1: Browse Directory Structure
**As a** user
**I want to** see a list of files and folders in a directory
**So that** I can understand the content organization

**Acceptance Criteria:**
- Directory view shows all files and subdirectories
- Files and folders are visually distinct (icons, styling)
- File entries show: name, type icon, file size
- Folder entries show: name, folder icon
- Entries are sorted (folders first, then alphabetically)

### US-2: Navigate Between Directories
**As a** user
**I want to** click on a folder to view its contents
**So that** I can explore nested directory structures

**Acceptance Criteria:**
- Clicking a folder navigates to that folder's view
- Browser URL updates with hash (e.g., `#/images/logos`)
- Browser back/forward buttons work correctly
- Breadcrumb trail shows current path
- Navigation is instant (no loading delays)

### US-3: View Image Files
**As a** user
**I want to** click on an image file to see it displayed
**So that** I can view the image content

**Acceptance Criteria:**
- Clicking an image file opens detail view
- Image is displayed at appropriate size (max-width: 100%)
- Detail view shows: filename, dimensions, file size, modified date
- "Back" button returns to directory view
- Supports: PNG, JPEG, GIF, SVG, WebP

### US-4: View Markdown Files
**As a** user
**I want to** click on a markdown file to see it rendered as HTML
**So that** I can read documentation and text content

**Acceptance Criteria:**
- Clicking a .md file opens detail view
- Markdown is rendered as formatted HTML
- Detail view shows: filename, file size, modified date
- Rendered HTML uses readable typography
- Code blocks have syntax highlighting
- Links in markdown are functional

### US-5: View Image with Markdown Description
**As a** user
**I want to** see a markdown description alongside an image
**So that** I can understand the context and details of the image

**Acceptance Criteria:**
- If `file.ext` has a paired `file.ext.md`, the markdown is shown
- Image displays at top of detail view
- Markdown description renders below the image
- The `.md` file does NOT appear as separate entry in browser
- Works for all supported image formats

### US-6: Inline Detail View
**As a** user
**I want to** see file details without leaving the page
**So that** I have a seamless browsing experience

**Acceptance Criteria:**
- Clicking a file toggles from browser to detail view
- Detail view and browser view are part of same page
- Transition is smooth (CSS animations)
- URL hash updates to reflect current file
- Browser back button returns to directory view

### US-7: Responsive Mobile Experience
**As a** mobile user
**I want to** browse files on my phone or tablet
**So that** I can access content from any device

**Acceptance Criteria:**
- Layout adapts to mobile screen sizes
- Touch interactions work smoothly
- Text is readable without zooming
- Images scale appropriately
- Navigation is thumb-friendly

### US-8: Build and Deploy
**As a** content maintainer
**I want to** run a build script to generate the static site
**So that** I can deploy updated content

**Acceptance Criteria:**
- Single command generates all necessary files
- Build script processes `content/` directory
- Generates JSON for each directory
- Generates JSON for each file
- Creates thumbnails for images
- Copies original files to public directory
- Build is idempotent (safe to re-run)
- Build script logs progress and errors

## User Flows

### Flow 1: Browse to Image with Description
1. User lands on home page showing root directory
2. User clicks "images" folder
3. Browser shows contents of images folder
4. User clicks "logo.png" (which has logo.png.md)
5. Detail view opens showing:
   - Large logo image
   - Image metadata (512×512, 44KB)
   - Rendered markdown description below
6. User clicks back arrow
7. Returns to images folder view

### Flow 2: Read Markdown Documentation
1. User clicks "docs" folder
2. Browser shows docs folder contents
3. User clicks "README.md"
4. Detail view opens showing rendered HTML
5. User scrolls through formatted content
6. User clicks link in markdown
7. Link opens in new tab
8. User clicks back arrow
9. Returns to docs folder view

## Technical Specifications

### Directory JSON Format
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

### File Detail JSON Format (Image with Description)
```json
{
  "id": "images-logo.png",
  "name": "logo.png",
  "path": "/images/logo.png",
  "type": "image/png",
  "size": 45230,
  "modified": "2025-12-11T10:30:00Z",
  "url": "/public/content/images/logo.png",
  "thumbnail": "/thumbnails/images/logo.png",
  "metadata": {
    "width": 512,
    "height": 512
  },
  "description": {
    "id": "images-logo.png.md",
    "content": "# Logo\n\nDescription...",
    "html": "<h1>Logo</h1><p>Description...</p>"
  }
}
```

### File Detail JSON Format (Standalone Markdown)
```json
{
  "id": "docs-README.md",
  "name": "README.md",
  "path": "/docs/README.md",
  "type": "text/markdown",
  "size": 2048,
  "modified": "2025-12-11T10:30:00Z",
  "content": "# README\n\nWelcome...",
  "html": "<h1>README</h1><p>Welcome...</p>"
}
```

## Project Structure

```
recycle/
├── content/              # Source content (add your files here)
├── data/                 # Generated JSON (build output)
├── public/               # Deployable static files (build output)
├── src/                  # Application source code
├── lib/                  # js-fileexplorer library
└── build/generate.js     # Build script
```

See [CLAUDE.md - Directory Structure](./CLAUDE.md#directory-structure) for detailed breakdown.

## Implementation Phases

**Phase 1**: Foundation (project structure, dependencies)
**Phase 2**: Build System (JSON generation, markdown pairing)
**Phase 3**: Image Processing (thumbnails, metadata)
**Phase 4**: Markdown Processing (HTML rendering, syntax highlighting)
**Phase 5**: Frontend Core (SPA, routing, js-fileexplorer integration)
**Phase 6**: Detail View (image/markdown rendering, navigation)
**Phase 7**: Polish & UX (styling, responsive design, animations)
**Phase 8**: Documentation & Testing (cross-browser, demo content)

See [README.md](./README.md) for setup instructions and [CLAUDE.md](./CLAUDE.md) for implementation guidance.

## Success Metrics

- **Build time**: < 5 seconds for 100 files
- **Page load**: < 2 seconds on 3G connection
- **Navigation**: Instant (< 100ms) between directories
- **Mobile usability**: 100% of features work on mobile
- **Browser support**: Works on Chrome, Firefox, Safari, Edge (latest 2 versions)

## Future Enhancements (Post-v1)

- Client-side search across all files
- Filter by file type
- Sort options (name, size, date)
- Dark mode
- File download as ZIP
- Keyboard shortcuts
- Permalink sharing
- Print-friendly views
- PDF support
- Video support

## Open Questions

None at this time. Ready for implementation.
