# Recycle - Static File Browser

A beautiful, zero-backend file browser built as a static site. Browse directories, view images, and read markdown documentation with a seamless, app-like experience—all without a server.

I use it to display stuff that I want to give away, whether physical stuff sitting around my place or ideas that I want to see someone execute.

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

```
recycle/
├── content/              # Your source files (images, markdown, etc.)
│   ├── images/
│   │   ├── logo.png
│   │   └── logo.png.md   # Description for logo.png
│   └── docs/
│       └── README.md
│
├── data/                 # Generated JSON (created by build script)
│   ├── root.json
│   ├── images.json
│   └── files/
│       ├── logo.png.json
│       └── README.md.json
│
├── public/               # Deployable static files
│   ├── content/          # Original files (copied from content/)
│   └── thumbnails/       # Generated thumbnails
│
├── src/                  # Source code
│   ├── index.html        # Main page
│   ├── app.js            # Application logic
│   └── styles.css        # Custom styles (minimal, uses Tailwind)
│
├── lib/                  # js-fileexplorer library
│   ├── fancy-file-explorer.css
│   └── file_explorer.js
│
├── build/
│   └── generate.js       # Build script
│
├── package.json
├── PRD.md                # Product requirements
└── README.md             # This file
```

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

The markdown pairing feature is incredibly useful for documenting files:

```
content/
├── screenshot.png           # The image
├── screenshot.png.md        # Description (shown with image)
├── diagram.svg              # The SVG
├── diagram.svg.md           # Explanation (shown with SVG)
└── README.md                # Standalone markdown (shown alone)
```

**Important**: Paired `.md` files (like `screenshot.png.md`) do NOT appear as separate entries in the file browser—they're automatically embedded with their paired file.

### Supported File Types

**Images** (fully supported):
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- SVG (`.svg`)
- WebP (`.webp`)

**Text** (fully supported):
- Markdown (`.md`)

**Future**: PDF, videos, and more file types can be added

## Build Process

The build script (`build/generate.js`) does the following:

1. **Walks the content directory** recursively
2. **Detects paired markdown files** (e.g., `file.ext` + `file.ext.md`)
3. **Generates directory JSON files** with file listings
4. **Generates file detail JSON** with metadata
5. **Creates thumbnails** for images (200×200px)
6. **Extracts metadata** (dimensions, file sizes, dates)
7. **Parses markdown** to HTML with syntax highlighting
8. **Copies files** to `public/content/`

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

### Architecture

The application uses a **hybrid static/dynamic approach**:

1. **Build time**: Generate JSON data files for all content
2. **Runtime**: Single-page app that loads JSON on demand
3. **Navigation**: Hash-based routing (`#/path/to/folder`)
4. **Rendering**: Client-side, instant, no server calls

### Key Components

**`app.js`** - The orchestrator:
- Hash router for navigation
- FileExplorer integration (overrides `onrefresh` callback)
- Detail view rendering (images, markdown, paired content)
- State management (browser ↔ detail view)

**`build/generate.js`** - The generator:
- Directory traversal and file detection
- Markdown pairing logic
- Image thumbnail generation (using `sharp`)
- Metadata extraction
- JSON generation

**`index.html`** - The shell:
- Single page with two views (browser and detail)
- Loads js-fileexplorer library
- Tailwind CSS for styling

### Working with js-fileexplorer

js-fileexplorer expects a server backend, but we override its callbacks to use static data:

```javascript
const explorer = new FileExplorer(container, {
    // Override data loading
    onrefresh: async (folder, required) => {
        const path = folder.GetPath();
        const jsonFile = `data/${pathToJson(path)}`;
        const response = await fetch(jsonFile);
        const data = await response.json();
        folder.SetEntries(data.entries);
    },

    // Handle file clicks
    onopenfile: (folder, entry) => {
        showFileDetail(entry.id);
    }
});
```

## Beads Integration

This project uses [beads](https://github.com/patrickjm/beads) for issue tracking. View issues:

```bash
# List all issues
bd list

# Show a specific issue
bd show recycle-4ry

# Show ready work
bd ready

# Update an issue
bd update recycle-4ry --status in-progress
```

## Contributing

1. Check out the [PRD](./PRD.md) for the project vision
2. View open issues: `bd list --status open`
3. Pick an issue and mark it in-progress: `bd update <issue-id> --status in-progress`
4. Make your changes
5. Test locally: `npm run build && npm start`
6. Submit a pull request

## Design Philosophy

This project follows the **ultrathink** philosophy:

- **Think Different**: Question assumptions, find elegant solutions
- **Obsess Over Details**: Every interaction should feel natural
- **Plan Like Da Vinci**: Clear architecture, clean separation of concerns
- **Craft, Don't Code**: Every function name should sing
- **Iterate Relentlessly**: The first version is never good enough
- **Simplify Ruthlessly**: Remove complexity without losing power

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
