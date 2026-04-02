# BatchUnpack

A lightweight desktop application for batch extracting multiple archive files with drag-and-drop simplicity.

## Features

- **Drag & Drop Interface**: Simply drag archive files into the app
- **Multiple Format Support**: ZIP, TAR, TAR.GZ, TAR.BZ2, 7z, GZ
- **Parallel Extraction**: Extract up to 4 archives simultaneously
- **Progress Tracking**: Real-time progress bars for each file
- **Error Handling**: Graceful handling of corrupt or unsupported files
- **Output Management**: Choose your extraction destination with persistent settings

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **adm-zip** - ZIP extraction
- **tar** - TAR/TAR.GZ/TAR.BZ2 extraction
- **node-7z** - 7z extraction (requires 7z CLI)

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- 7-Zip command-line tool (for 7z support)
  - Windows: Download from [7-zip.org](https://www.7-zip.org/)
  - macOS: `brew install p7zip`
  - Linux: `apt-get install p7zip-full`

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd multi-file-extractor

# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run build
```

## Usage

1. **Launch the app**
2. **Drag and drop** archive files onto the drop zone (or click "Browse Files")
3. **Select output folder** where extracted files will be saved
4. **Click "Extract All"** to begin batch extraction
5. **View progress** as files are extracted in parallel
6. **Review summary** showing successful and failed extractions
7. **Open output folder** to access your extracted files

## Extraction Behavior

- Each archive is extracted into its own subfolder (named after the archive)
- Internal directory structure is preserved
- Concurrent extraction (max 4 files at once) for faster processing
- Failed extractions don't stop the batch - remaining files continue

## File Status Indicators

- ⏳ **Queued** - Waiting to be extracted
- 🔄 **Extracting** - Currently being extracted
- ✅ **Done** - Successfully extracted
- ❌ **Failed** - Extraction failed (with error message)

## Building for Distribution

```bash
# Build for current platform
npm run electron:build

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac
```

Built packages will be in the `release/` directory.

## Project Structure

```
.
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   ├── preload.ts     # Preload script (IPC bridge)
│   └── extractors.ts  # Archive extraction logic
├── src/               # React frontend
│   ├── components/    # React components
│   ├── App.tsx        # Main application component
│   ├── types.ts       # TypeScript type definitions
│   └── index.css      # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## License

MIT

## Author

Atreya

---

Built with ❤️ using Electron and React
