# Quick Reference - BatchUnpack

## Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd multi-file-extractor

# Install dependencies
npm install

# Install 7z CLI (required for 7z support)
# macOS
brew install p7zip

# Ubuntu/Debian
sudo apt-get install p7zip-full

# Windows - Download from https://www.7-zip.org/
```

## Development

```bash
# Start development server
npm run electron:dev

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean
```

## Building

```bash
# Build for current platform
npm run build

# Build for specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Project Structure

```
multi-file-extractor/
├── electron/              # Electron main process
│   ├── main.ts           # Entry point & IPC handlers
│   ├── preload.ts        # IPC bridge (secure)
│   └── extractors.ts     # Extraction logic
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── App.tsx          # Main app
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
├── package.json         # Dependencies & scripts
└── vite.config.ts       # Build configuration
```

## Key Files

| File | Purpose |
|------|---------|
| `electron/main.ts` | Main process, window creation, IPC |
| `electron/preload.ts` | Secure IPC bridge |
| `electron/extractors.ts` | Archive extraction logic |
| `src/App.tsx` | Main React component |
| `src/types.ts` | TypeScript interfaces |
| `vite.config.ts` | Vite + Electron config |

## IPC API

### From Renderer to Main

```typescript
// Select output folder
const folder = await window.electronAPI.selectOutputFolder()

// Get last used folder
const lastFolder = await window.electronAPI.getLastOutputFolder()

// Validate archive
const { valid, format } = await window.electronAPI.validateArchive(path)

// Extract archive
const result = await window.electronAPI.extractArchive(archivePath, outputPath)

// Open folder
await window.electronAPI.openFolder(folderPath)
```

### From Main to Renderer

```typescript
// Progress updates
window.electronAPI.onExtractionProgress((filePath, progress) => {
  // Update UI
})
```

## Supported Formats

| Format | Extension | Library |
|--------|-----------|---------|
| ZIP | `.zip` | adm-zip |
| TAR | `.tar` | node-tar |
| TAR.GZ | `.tar.gz`, `.tgz` | node-tar |
| TAR.BZ2 | `.tar.bz2` | node-tar |
| 7z | `.7z` | node-7z |
| GZ | `.gz` | node-tar |

## Component Hierarchy

```
App
├── DropZone (file input)
├── OutputFolder (folder picker)
├── FileQueue (file list)
│   └── FileItem (individual file)
├── Actions (buttons)
└── Summary (results screen)
```

## State Flow

```
User Action → State Update → UI Re-render
                ↓
        IPC to Main Process
                ↓
        File System Operation
                ↓
        IPC Progress Event
                ↓
        State Update → UI Update
```

## Common Tasks

### Add a new archive format

1. Install library: `npm install library-name`
2. Add extractor in `electron/extractors.ts`
3. Update handler in `electron/main.ts`
4. Add to validation list
5. Update docs

### Add a new UI component

1. Create in `src/components/`
2. Define prop types
3. Import in parent
4. Add styles to `src/index.css`

### Modify extraction behavior

Edit `electron/extractors.ts`:
- Change progress calculation
- Add error handling
- Modify output structure

## Debugging

### Main Process
- Logs appear in terminal
- Add `console.log()` in `electron/*.ts`

### Renderer Process
- Use DevTools (auto-opens in dev)
- Add `console.log()` in `src/*.tsx`
- Check Network/Console tabs

### IPC Communication
- Log both sides of IPC calls
- Check event names match
- Verify data types

## Performance

- Max 4 concurrent extractions
- Progress updates every ~10-50ms
- Non-blocking UI via async/await
- Worker threads (future enhancement)

## Security

- Context isolation enabled
- No node integration in renderer
- IPC via secure preload script
- File path validation in main process

## Build Output

```
release/
└── 1.0.0/
    ├── BatchUnpack-1.0.0.dmg        (macOS)
    ├── BatchUnpack-1.0.0.exe        (Windows)
    └── BatchUnpack-1.0.0.AppImage   (Linux)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 7z extraction fails | Install p7zip CLI |
| TypeScript errors | Run `npm run typecheck` |
| Build fails | Run `npm run clean && npm install` |
| App won't start | Check Node.js version (18+) |

## Scripts

```json
{
  "dev": "vite dev server",
  "electron:dev": "Full dev mode with Electron",
  "build": "Complete build",
  "build:vite": "Frontend only",
  "build:win/mac/linux": "Platform-specific",
  "typecheck": "TypeScript validation",
  "clean": "Remove build artifacts"
}
```

## Dependencies

### Production
- `electron-store` - Persistent settings
- `adm-zip` - ZIP extraction
- `tar` - TAR extraction
- `node-7z` - 7z extraction

### Development
- `electron` - Desktop framework
- `react` - UI framework
- `typescript` - Type safety
- `vite` - Build tool
- `vite-plugin-electron` - Electron integration

## Resources

- [PRD.md](PRD.md) - Product requirements
- [README.md](README.md) - User guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [TESTING.md](TESTING.md) - Testing checklist
- [CHANGELOG.md](CHANGELOG.md) - Version history

## License

MIT - See [LICENSE](LICENSE)
