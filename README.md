# Recycle - Static File Browser

A beautiful, zero-backend file browser built as a static site. Browse directories, view images, and read markdown documentation with a seamless, app-like experience—all without a server.

I use it to display stuff that I want to give away, whether physical stuff sitting around my place or ideas that I want to see someone execute.

> **📖 Documentation:** [PRD.md](./PRD.md) for product vision and requirements | [CLAUDE.md](./CLAUDE.md) for technical architecture

## Overview

Recycle transforms your content directory into an elegant, interactive file browser that can be deployed anywhere static files can be hosted. Built with [js-fileexplorer](https://github.com/cubiclesoft/js-fileexplorer), it provides a rich file browsing experience while remaining completely static.

### Why Recycle?

- **Zero Backend**: Pure HTML, CSS, and JavaScript—no servers, databases, or APIs needed
- **Deploy Anywhere**: GitHub Pages, Netlify, Vercel, S3, or even a USB stick
- **Elegant UX**: Smooth navigation, instant responses, and beautiful presentation
- **Smart Pairing**: Markdown descriptions automatically paired with files (e.g., `logo.png` + `logo.png.md`)
- **Build Once, Browse Forever**: Pre-generated JSON data makes navigation instant

## Features

### Core Functionality

- **Directory Browsing**: Navigate nested folder structures with breadcrumb trails
- **Image Viewing**: Display PNG, JPEG, GIF, SVG, and WebP images with metadata
- **Markdown Rendering**: Read documentation with syntax highlighting and formatted HTML
- **Paired Descriptions**: Add `.md` files to describe any file (e.g., `photo.jpg.md` describes `photo.jpg`)
- **Inline Detail View**: Seamless transitions between browser and detail views
- **Hash Routing**: Browser back/forward buttons work as expected
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

### Technical Highlights

- **Single-Page Application**: No page reloads, smooth transitions
- **Lazy Loading**: Only loads data for directories you visit
- **Thumbnails**: Auto-generated at build time for fast browsing
- **Metadata Extraction**: Image dimensions, file sizes, modification dates
- **SEO-Friendly**: Each view has its own URL hash for sharing

## Quick Start

### Prerequisites

- Node.js 16+ (for build script)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/recycle.git
cd recycle

# Install dependencies
npm install

# Add your content
mkdir -p content/images content/docs
# ... add your files to content/

# Build the static site
npm run build

# Serve locally (for testing)
npm start
```

Visit `http://localhost:8000` to browse your content.

## Project Structure

See [CLAUDE.md - Directory Structure](./CLAUDE.md#directory-structure) and [PRD.md - Project Structure](./PRD.md#project-structure) for detailed structure documentation.

## Usage

### Adding Content

1. **Add files to `content/` directory**:

   ```bash
   cp my-image.png content/images/
   cp my-doc.md content/docs/
   ```

2. **Add descriptions (optional)**:
   Create a `.md` file with the same name as any file to add a description:

   ```bash
   # This will be shown alongside my-image.png
   echo "# My Image\n\nThis is a beautiful image..." > content/images/my-image.png.md
   ```

3. **Rebuild**:
   ```bash
   npm run build
   ```

### Markdown Pairing

Create a `.md` file with the same name as any file to add a description:

```bash
echo "# My Image\n\nDescription..." > content/images/photo.png.md
```

Paired `.md` files are automatically embedded with their file and hidden from listings. See [CLAUDE.md - Markdown Pairing Feature](./CLAUDE.md#markdown-pairing-feature) for implementation details.

### Supported File Types

**v1.0**: Images (PNG, JPEG, GIF, SVG, WebP) and Markdown

See [CLAUDE.md - Supported File Types](./CLAUDE.md#supported-file-types) for details and [PRD.md - Future Enhancements](./PRD.md#future-enhancements-post-v1) for planned additions.

## Build Process

The build script pre-generates all JSON data and processes content at build time. See [CLAUDE.md - Architecture](./CLAUDE.md#architecture) for technical details.

### Build Commands

```bash
# Full build
npm run build

# Build with verbose output
npm run build -- --verbose

# Clean and rebuild
npm run clean
npm run build

# Watch mode (rebuilds on changes)
npm run watch
```

## Deployment

### GitHub Pages

```bash
# Build the site
npm run build

# Deploy public/ directory to gh-pages branch
npm run deploy:github
```

Set your repository's Pages settings to serve from the `gh-pages` branch.

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Deploy!

### Vercel

```bash
vercel --prod
```

### Manual Deployment

Copy everything in the `public/` directory to your web host:

```bash
rsync -av public/ user@yourserver.com:/var/www/html/
```

## Development

For architecture details, implementation patterns, and coding standards, see [CLAUDE.md](./CLAUDE.md).

**Quick Reference:**

- Architecture: [CLAUDE.md - Architecture](./CLAUDE.md#architecture)
- Design Patterns: [CLAUDE.md - Critical Design Pattern](./CLAUDE.md#critical-design-pattern-overriding-js-fileexplorer)
- Adding Features: [CLAUDE.md - Common Patterns](./CLAUDE.md#common-patterns)

Keep each document focused and use hyperlinks between documents to avoid duplicating information.

## Issue Tracking

This project uses [beads](https://github.com/patrickjm/beads) for issue tracking:

```bash
bd list          # List all issues
bd ready         # Show ready work
bd show <id>     # View specific issue
```

See [CLAUDE.md - Issue Tracking](./CLAUDE.md#issue-tracking-with-beads) for more commands.

## Contributing

1. Check out the [PRD](./PRD.md) for the project vision
2. View open issues: `bd list --status open`
3. Pick an issue and mark it in-progress: `bd update <issue-id> --status in-progress`
4. Make your changes
5. Test locally: `npm run build && npm start`
6. Submit a pull request

## Design Philosophy

This project follows the **ultrathink** philosophy: question assumptions, obsess over details, and simplify ruthlessly. See [CLAUDE.md - Design Philosophy](./CLAUDE.md#design-philosophy-ultrathink) for implementation guidance.

## Roadmap

### v1.0 (Current)

- ✅ Directory browsing
- ✅ Image viewing
- ✅ Markdown rendering
- ✅ Markdown pairing
- ✅ Responsive design

### Future Enhancements

- [ ] Client-side search
- [ ] Filter by file type
- [ ] Sort options (name, size, date)
- [ ] Dark mode
- [ ] PDF support
- [ ] Keyboard shortcuts

## License

MIT License - feel free to use this for your projects!

## Acknowledgments

- [js-fileexplorer](https://github.com/cubiclesoft/js-fileexplorer) by CubicleSOFT
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [marked](https://marked.js.org/) for markdown parsing
- [highlight.js](https://highlightjs.org/) for syntax highlighting
- [sharp](https://sharp.pixelplumbing.com/) for image processing

---

**Made with ✨ and the ultrathink philosophy**
