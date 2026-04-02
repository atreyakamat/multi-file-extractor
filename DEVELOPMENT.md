# BatchUnpack Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run build
```

## Development Workflow

### Running the App

The development server uses Vite for hot module replacement:

```bash
npm run electron:dev
```

This will:
1. Start Vite dev server on http://localhost:5173
2. Launch Electron once the server is ready
3. Auto-reload on code changes

### Building

```bash
# Build everything (TypeScript + Frontend + Electron app)
npm run build

# Build only frontend
npm run build:vite

# Build for specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

Built applications will be in `release/[version]/` directory.

## Architecture Overview

### Electron Main Process (`electron/main.ts`)

The main process:
- Creates the application window
- Handles IPC communication with renderer
- Manages file system operations
- Coordinates archive extraction

Key IPC handlers:
- `select-output-folder` - Opens folder picker dialog
- `get-last-output-folder` - Retrieves saved output path
- `extract-archive` - Extracts a single archive
- `validate-archive` - Validates file format
- `open-folder` - Opens folder in file explorer

### Preload Script (`electron/preload.ts`)

Bridges the main and renderer processes securely:
- Exposes safe IPC methods to renderer
- Provides type-safe API surface
- Uses contextBridge for security

### Extraction Engine (`electron/extractors.ts`)

Handles archive extraction:
- `extractZip()` - ZIP files using adm-zip
- `extractTar()` - TAR/TAR.GZ/TAR.BZ2 using node-tar
- `extract7z()` - 7z files using 7z CLI

Each function:
- Takes archive path and output path
- Provides progress callbacks
- Handles errors gracefully
- Returns Promise

### React Frontend (`src/`)

**App.tsx** - Main application component
- Manages application state
- Coordinates extraction workflow
- Handles file queue management

**Components:**
- `DropZone` - Drag-and-drop interface
- `OutputFolder` - Folder selection UI
- `FileQueue` - List of queued files
- `FileItem` - Individual file display
- `Actions` - Action buttons
- `Summary` - Extraction results

## State Management

Uses React hooks for state management:

```typescript
const [files, setFiles] = useState<ArchiveFile[]>([])
const [outputFolder, setOutputFolder] = useState<string | null>(null)
const [isExtracting, setIsExtracting] = useState(false)
const [summary, setSummary] = useState<ExtractionSummary | null>(null)
```

## File Processing Flow

1. **File Selection**
   - User drags files or uses file picker
   - Files validated against supported formats
   - File info retrieved from file system
   - Files added to queue with 'queued' status

2. **Extraction**
   - User selects output folder
   - User clicks "Extract All"
   - Files processed with concurrency limit (4)
   - Progress updates sent via IPC
   - Status updated: queued → extracting → done/failed

3. **Completion**
   - Summary generated with results
   - Failed files listed with reasons
   - User can open output folder
   - User can start new batch

## Concurrency Model

Extractions run in parallel with a limit of 4 concurrent operations:

```typescript
const concurrencyLimit = 4
const executing: Promise<void>[] = []

for (const file of files) {
  const task = extractFile(file)
  executing.push(task)

  if (executing.length >= concurrencyLimit) {
    await Promise.race(executing)
    // Remove completed task
  }
}
```

This prevents overwhelming the system while maintaining good performance.

## Progress Tracking

Progress flows from main process to renderer:

1. Extractor function calls `onProgress(percentage)`
2. Main process sends IPC event: `extraction-progress`
3. Renderer updates file status and progress bar

```typescript
// Main process
event.sender.send('extraction-progress', archivePath, progress)

// Renderer
window.electronAPI.onExtractionProgress((filePath, progress) => {
  updateFileProgress(filePath, progress)
})
```

## Error Handling

Errors are captured at multiple levels:

1. **Validation Errors**
   - Invalid file formats rejected at drop
   - User shown alert message
   - File not added to queue

2. **Extraction Errors**
   - Caught in try-catch blocks
   - File marked as 'failed' with error message
   - Extraction continues for remaining files

3. **File System Errors**
   - Permission denied
   - Disk space issues
   - Path not found

All errors preserve user data and allow recovery.

## Persistent Settings

Uses `electron-store` to persist settings:

```typescript
import Store from 'electron-store'
const store = new Store()

// Save
store.set('lastOutputFolder', folderPath)

// Load
const folder = store.get('lastOutputFolder', null)
```

Currently persisted:
- Last used output folder

## Supported Archive Formats

| Format | Extension | Library | Status |
|--------|-----------|---------|--------|
| ZIP | .zip | adm-zip | ✅ Implemented |
| TAR | .tar | node-tar | ✅ Implemented |
| TAR.GZ | .tar.gz, .tgz | node-tar | ✅ Implemented |
| TAR.BZ2 | .tar.bz2 | node-tar | ✅ Implemented |
| 7z | .7z | node-7z (7z CLI) | ✅ Implemented |
| GZ | .gz | node-tar | ✅ Implemented |
| RAR | .rar | N/A | ❌ Not planned (licensing) |

## Adding New Archive Formats

1. **Install library**
   ```bash
   npm install library-name
   npm install --save-dev @types/library-name
   ```

2. **Add extractor function** (`electron/extractors.ts`)
   ```typescript
   export async function extractNewFormat(
     archivePath: string,
     outputPath: string,
     onProgress?: (progress: number) => void
   ): Promise<void> {
     // Implementation
   }
   ```

3. **Update main process** (`electron/main.ts`)
   ```typescript
   import { extractNewFormat } from './extractors.js'

   // In extract-archive handler
   if (ext === '.newext') {
     await extractNewFormat(archivePath, targetPath, onProgress)
   }
   ```

4. **Update validation** (`electron/main.ts`)
   ```typescript
   const validExtensions = ['.zip', '.tar', '.gz', '.7z', '.tgz', '.bz2', '.newext']
   ```

5. **Update UI** (optional)
   - Add format to documentation
   - Update drop zone accepted formats

## Debugging

### Main Process

Add to `electron/main.ts`:
```typescript
console.log('Debug info:', data)
```

Logs appear in terminal running `npm run electron:dev`

### Renderer Process

Use browser DevTools (automatically opens in dev mode):
```typescript
console.log('Debug info:', data)
```

Or open manually: `View → Toggle Developer Tools`

### IPC Communication

Log both sides:
```typescript
// Main
ipcMain.handle('my-event', (event, arg) => {
  console.log('Main received:', arg)
  return result
})

// Renderer
const result = await window.electronAPI.myEvent(arg)
console.log('Renderer received:', result)
```

## Performance Optimization

### Current Optimizations

1. **Parallel Extraction** - Up to 4 concurrent extractions
2. **Progress Streaming** - Real-time progress updates
3. **Non-blocking UI** - Extraction doesn't freeze interface
4. **Efficient State Updates** - React state batching

### Future Optimizations

1. **Worker Threads** - Move extraction to worker threads
2. **Stream Processing** - Stream large archives
3. **Smart Concurrency** - Adjust based on file sizes
4. **Memory Management** - Better handling of large files

## Building for Distribution

### Windows

```bash
npm run build:win
```

Creates:
- NSIS installer (.exe)
- Portable version (.exe)

### macOS

```bash
npm run build:mac
```

Creates:
- DMG installer (.dmg)
- ZIP archive (.zip)

Requires code signing for distribution.

### Linux

```bash
npm run build:linux
```

Creates:
- AppImage (.AppImage)
- Debian package (.deb)

## Troubleshooting

### 7z extraction fails

Ensure 7z CLI is installed:
- Windows: Add 7z to PATH
- macOS: `brew install p7zip`
- Linux: `apt-get install p7zip-full`

### TypeScript errors

Run type checking:
```bash
npm run typecheck
```

### Build fails

Clean and rebuild:
```bash
npm run clean
npm install
npm run build
```

### App won't start

Check Node.js version:
```bash
node --version  # Should be 18+
```

## Project Decisions

### Why not Web Workers for extraction?

Electron provides native Node.js modules with better performance and broader format support than WebAssembly alternatives.

### Why subfolder extraction by default?

Prevents file name collisions and keeps extracted content organized per archive.

### Why limit concurrent extractions to 4?

Balances performance with system resources. Extracting too many archives simultaneously can exhaust memory and disk I/O.

### Why no password support in v1?

Password-protected archives require per-file user interaction, complicating batch operations. Planned for v2.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
