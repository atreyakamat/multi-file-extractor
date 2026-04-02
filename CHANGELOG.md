# Changelog

All notable changes to BatchUnpack will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-02

### Added
- Initial release of BatchUnpack
- Drag-and-drop interface for adding archive files
- File picker button as alternative to drag-and-drop
- Support for multiple archive formats:
  - ZIP (.zip)
  - TAR (.tar)
  - TAR.GZ (.tar.gz, .tgz)
  - TAR.BZ2 (.tar.bz2)
  - 7z (.7z)
  - GZ (.gz)
- Output folder selection with folder picker dialog
- Persistent storage of last used output folder
- Parallel extraction (up to 4 concurrent extractions)
- Real-time per-file progress tracking
- Overall progress summary (X of N completed)
- Status indicators for each file:
  - Queued (⏳)
  - Extracting (🔄)
  - Done (✅)
  - Failed (❌)
- File queue management:
  - Add multiple files
  - Remove files before extraction
  - View file sizes
  - See file count
- Error handling:
  - Invalid file type rejection
  - Corrupt archive detection
  - Graceful failure (other files continue)
  - Error messages for failed files
- Extraction summary screen:
  - Total files processed
  - Success/failure counts
  - List of failed files with reasons
- "Open Output Folder" functionality
- "Start New Batch" to clear and restart
- Cross-platform support (Windows, macOS, Linux)
- Electron Builder packaging configuration
- Comprehensive documentation:
  - README with installation and usage
  - CONTRIBUTING guide
  - DEVELOPMENT guide
  - TESTING guide
  - LICENSE (MIT)

### Technical Details
- Built with Electron 28 + React 18 + TypeScript 5
- Vite for fast development and building
- Electron Store for persistent settings
- Archive extraction libraries:
  - adm-zip for ZIP
  - node-tar for TAR/TAR.GZ/TAR.BZ2
  - node-7z for 7z (requires 7z CLI)
- Type-safe IPC communication via preload script
- Responsive UI with progress animations
- Utility functions for file formatting

### Architecture
- Each archive extracts into its own subfolder
- Internal directory structure preserved
- Concurrent extraction with configurable limit
- Non-blocking UI during extraction
- IPC-based communication between main and renderer

### Known Limitations
- 7z extraction requires 7z command-line tool installation
- No password-protected archive support
- No RAR support (licensing restrictions)
- Maximum 4 concurrent extractions
- No preview or partial extraction
- No compression/archive creation

## [Unreleased]

### Planned for v1.1
- Password-protected archive support
- Configurable extraction modes (subfolder vs flat)
- Estimated time remaining
- Extraction log export (CSV/TXT)
- Better disk space checking
- Enhanced progress indicators

### Planned for v2.0
- Watch folder mode (auto-extract)
- Advanced settings panel
- Custom extraction rules
- Batch rename on extraction
- Archive preview before extraction
- Multi-language support
