# Testing Guide for BatchUnpack

## Manual Testing Checklist

### Initial Setup
- [ ] App launches successfully
- [ ] Window displays correctly
- [ ] No console errors on startup

### File Ingestion
- [ ] Drag and drop files onto drop zone
- [ ] Drop zone highlights on drag over
- [ ] Files appear in queue with correct names
- [ ] Files sizes display correctly
- [ ] Invalid file types are rejected with error
- [ ] Multiple files can be added at once
- [ ] "Browse Files" button opens file picker
- [ ] Files selected via picker are added to queue

### Output Folder Selection
- [ ] "Select Folder" button opens folder picker
- [ ] Selected path displays in UI
- [ ] Path persists after app restart
- [ ] "Change" button allows changing folder
- [ ] Extract button disabled when no folder selected

### File Queue Management
- [ ] Files display with correct status (Queued)
- [ ] Remove button appears for queued files
- [ ] Files can be removed from queue
- [ ] Queue shows correct file count
- [ ] Empty state shows when no files

### Extraction Process
- [ ] Extract button disabled when queue empty
- [ ] Extract button disabled when no output folder
- [ ] Extraction begins when clicked
- [ ] Status updates to "Extracting"
- [ ] Progress bars appear and update
- [ ] Overall progress shows X/N completed
- [ ] Files extract in parallel
- [ ] UI remains responsive during extraction
- [ ] Cannot remove files during extraction
- [ ] Can add more files during extraction

### Archive Format Support
Test each format:
- [ ] ZIP files extract correctly
- [ ] TAR files extract correctly
- [ ] TAR.GZ files extract correctly
- [ ] TAR.BZ2 files extract correctly
- [ ] 7z files extract correctly (requires 7z CLI)
- [ ] GZ files extract correctly

### Extraction Results
- [ ] Successful extraction marked "Done" with checkmark
- [ ] Failed extraction marked "Failed" with error
- [ ] Each archive extracts to its own subfolder
- [ ] Internal directory structure preserved
- [ ] Extracted files accessible in output folder

### Error Handling
- [ ] Corrupt archives marked as Failed
- [ ] Error message displayed for failed files
- [ ] Other files continue extracting
- [ ] Unsupported formats rejected at drop
- [ ] Clear error messages shown

### Summary Screen
- [ ] Summary appears after all extractions complete
- [ ] Shows correct total count
- [ ] Shows correct success count
- [ ] Shows correct failure count
- [ ] Failed files listed with reasons
- [ ] "Open Output Folder" button works
- [ ] "Start New Batch" clears queue and returns to main screen

### Output Folder Operations
- [ ] "Open Output Folder" button launches file explorer
- [ ] Correct folder opens
- [ ] Works on summary screen
- [ ] Works on main screen

### Edge Cases
- [ ] Very large files (> 1GB)
- [ ] Many small files (> 100)
- [ ] Nested archives
- [ ] Archives with special characters in names
- [ ] Archives with very long file paths
- [ ] Empty archives
- [ ] Single-file archives

### Performance
- [ ] Extracts 4 files concurrently
- [ ] Progress updates smoothly
- [ ] No memory leaks with many files
- [ ] CPU usage reasonable

### Cross-Platform (if applicable)
- [ ] Works on Windows
- [ ] Works on macOS
- [ ] Works on Linux

## Test Archives

Create test archives with:
1. **Simple ZIP** - Few small files
2. **Nested Structure** - Folders within folders
3. **Large Archive** - 500MB+ file
4. **Many Files** - 1000+ small files
5. **Mixed Types** - Different file formats inside
6. **Special Characters** - Filenames with unicode, spaces
7. **Corrupt Archive** - Intentionally damaged file
8. **Empty Archive** - No contents

## Automated Testing (Future)

Areas to add unit/integration tests:
- [ ] Utility functions (formatFileSize, getFileExtension, etc.)
- [ ] File validation logic
- [ ] Extraction functions
- [ ] IPC communication
- [ ] React component rendering
- [ ] State management

## Performance Benchmarks

Record extraction times for:
- 10 x 10MB ZIP files
- 1 x 100MB TAR.GZ file
- 100 x 1MB files
- 1 x 1GB 7z file

Target: Should extract at near disk I/O speed with minimal CPU overhead.

## Known Limitations

1. 7z extraction requires 7z CLI to be installed
2. No password-protected archive support in v1.0
3. No RAR support (licensing)
4. Progress estimation is approximate
5. Maximum 4 concurrent extractions

## Reporting Issues

When reporting bugs, include:
- Operating system and version
- Node.js version
- App version
- Steps to reproduce
- Expected vs actual behavior
- Console logs
- Sample archive file (if applicable)
