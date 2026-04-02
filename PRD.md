Product Requirements Document
BatchUnpack — Drag-and-Drop Batch Archive Extractor
Version: 1.0  
Author: Atreya  
Status: Draft  
Last Updated: April 2026
---
1. Overview
1.1 Problem Statement
Working with multiple compressed archive files (ZIP, RAR, TAR, 7z, etc.) is tedious and time-consuming. Users are forced to extract each archive one at a time through OS file explorers or third-party tools — right-click, extract, choose folder, repeat. For anyone dealing with datasets, bulk downloads, or large batches of files regularly, this workflow is a significant bottleneck.
1.2 Solution
BatchUnpack is a lightweight desktop/web application that allows users to drag and drop any number of archive files onto a single interface, select a destination output folder, and extract everything in one click — automatically, in parallel, with full progress visibility.
1.3 Target User
Researchers and students managing bulk datasets
Developers handling build artifacts, logs, or dependency archives
Anyone regularly working with batches of compressed files
---
2. Goals & Non-Goals
Goals
Accept multiple archive files simultaneously via drag-and-drop or file picker
Support all major archive formats: ZIP, RAR, TAR, TAR.GZ, TAR.BZ2, 7z, GZ, XZ
Allow user to select or change the output/destination folder at any time
Extract all queued archives in parallel with per-file progress tracking
Preserve internal folder structure of each archive on extraction
Provide a clean extraction log / summary after completion
Handle errors gracefully (corrupt files, password-protected archives, insufficient disk space)
Non-Goals (v1.0)
Creating or compressing new archives (extraction only)
Cloud storage integration (Google Drive, Dropbox)
Archive preview or partial extraction (extract selected files only)
Mobile support
Automatic scheduling or watch-folder mode
---
3. Features & Requirements
3.1 File Ingestion
ID	Requirement	Priority
F1	User can drag and drop multiple archive files onto the app window	P0
F2	User can use a file picker button as an alternative to drag-and-drop	P0
F3	App accepts ZIP, RAR, TAR, TAR.GZ, TAR.BZ2, 7z, GZ, XZ formats	P0
F4	Invalid file types are rejected with a clear error message	P0
F5	User can add more files to the queue while extraction is already running	P1
F6	User can remove a file from the queue before extraction starts	P1
3.2 Output Folder Selection
ID	Requirement	Priority
O1	User can select an output/destination folder via a folder picker dialog	P0
O2	Selected output path is displayed clearly in the UI	P0
O3	App remembers the last used output folder across sessions	P1
O4	User can choose: extract each archive into its own subfolder, OR extract all into a flat output folder	P1
O5	App warns the user if the destination has insufficient disk space	P1
3.3 Extraction Engine
ID	Requirement	Priority
E1	All queued archives are extracted in parallel (configurable concurrency)	P0
E2	Internal directory structure of each archive is preserved	P0
E3	Extraction runs without blocking the UI	P0
E4	Password-protected archives surface a password prompt per file	P1
E5	On filename collision, user is prompted: Skip / Overwrite / Rename	P1
E6	Corrupt or unreadable archives are flagged and skipped; extraction continues for the rest	P0
3.4 Progress & Status
ID	Requirement	Priority
P1	Each file in the queue shows its extraction status: Queued / Extracting / Done / Failed	P0
P2	A progress bar or percentage indicator is shown per file	P0
P3	An overall progress summary (X of N completed) is shown	P0
P4	Estimated time remaining is displayed during extraction	P2
P5	A notification is shown when all extractions complete	P1
3.5 Extraction Log & Summary
ID	Requirement	Priority
L1	After completion, a summary shows: total files processed, success count, failure count	P0
L2	Failed files are listed with a reason (corrupt, wrong password, permission denied, etc.)	P0
L3	User can export the extraction log as a .txt or .csv file	P2
L4	User can open the output folder directly from the app after extraction	P1
---
4. User Flows
4.1 Primary Flow (Happy Path)
```
User opens app
    → Drags and drops N archive files onto the drop zone
    → Files appear in the queue list with format icons and file sizes
    → User clicks "Select Output Folder" → picks destination
    → User clicks "Extract All"
    → Progress bars animate per file; status chips update in real-time
    → Summary screen appears: "12/12 extracted successfully"
    → User clicks "Open Output Folder"
```
4.2 Error Recovery Flow
```
Extraction encounters a corrupt file
    → That file is marked as "Failed" with reason shown
    → Remaining files continue extracting uninterrupted
    → Summary shows "11/12 extracted — 1 failed"
    → User can retry failed files individually
```
4.3 Password-Protected Archive Flow
```
Extractor encounters a password-protected archive
    → Pauses that file
    → Prompts user for password inline
    → On correct password → extraction resumes
    → On incorrect password → file marked as Failed with option to retry
```
---
5. Technical Architecture
5.1 Recommended Tech Stack
Layer	Option A (Desktop)	Option B (Web)
Frontend	Electron + React	React (Vite)
Extraction Engine	Node.js (adm-zip, node-7z, node-tar)	WebAssembly (libarchive.wasm)
File System Access	Node.js `fs` module	File System Access API (Chrome)
Folder Picker	Electron dialog API	`showDirectoryPicker()`
Parallelism	Worker threads	Web Workers
Packaging	Electron Builder	PWA / hosted
Recommendation: Start with Electron + React for the best native file system access, then optionally port the frontend to web later.
5.2 Supported Formats & Libraries
Format	Library
ZIP	`adm-zip` or `jszip`
TAR, TAR.GZ, TAR.BZ2	`node-tar`
7z, RAR	`node-7z` (wraps 7-Zip CLI)
GZ (single file)	Node.js built-in `zlib`
5.3 Concurrency Model
Default: extract up to 4 archives in parallel
Each extraction runs in a Worker Thread to keep the UI non-blocking
Queue manages pending jobs and dispatches to free workers
5.4 Folder Naming Strategy (Configurable)
Subfolder mode (default): Each archive `dataset\_1.zip` extracts into `output/dataset\_1/`
Flat mode: All files extracted directly into `output/` (risk of collision — warn user)
---
6. UI Design Spec
6.1 Layout
```
┌─────────────────────────────────────────────────────┐
│  BatchUnpack                              \[— □ ✕]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │                                             │   │
│   │       Drop archive files here               │   │
│   │       or  \[Browse Files]                    │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│  Output Folder: /Users/atreya/datasets   \[Change]   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📦 archive\_1.zip        12 MB   ████░░ 67%  │   │
│  │ 📦 dataset\_2.tar.gz    340 MB   ██████ Done ✓│   │
│  │ 📦 backup.7z            55 MB   ░░░░░░ Queued│   │
│  │ 📦 logs.rar              8 MB   ░░░░░░ Failed│   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Progress: 1 / 4 done           \[Extract All]       │
└─────────────────────────────────────────────────────┘
```
6.2 File Status States
State	Color	Icon
Queued	Gray	⏳
Extracting	Blue	🔄 (animated)
Done	Green	✅
Failed	Red	❌
---
7. Error Handling
Error Type	Behavior
Unsupported file format	Rejected at drop; toast notification shown
Corrupt archive	Marked Failed; extraction continues for others
Wrong password	Inline password retry prompt
Output folder not selected	"Extract All" button is disabled until folder is chosen
Insufficient disk space	Warning banner before extraction starts
Permission denied on output path	Error shown; user prompted to choose different folder
---
8. MVP Scope (v1.0)
The following is the minimum viable feature set to ship:
Drag-and-drop + file picker ingestion
Output folder selection (with memory of last folder)
Extraction of ZIP, TAR, TAR.GZ, 7z formats
Per-file progress bars and status
Overall progress count
Error flagging for corrupt/unsupported files
"Open output folder" shortcut on completion
Electron desktop app (Windows + Mac)
Out of scope for v1.0: RAR support (licensing restrictions), password prompts, log export, flat vs. subfolder mode toggle.
---
9. Milestones
Milestone	Deliverable	Target
M1	Project scaffold (Electron + React + Vite)	Week 1
M2	Drag-and-drop UI + file queue rendering	Week 1
M3	Folder picker + output path management	Week 1
M4	ZIP + TAR extraction working end-to-end	Week 2
M5	7z extraction + parallel worker threads	Week 2
M6	Progress tracking + status states	Week 2
M7	Error handling + summary screen	Week 3
M8	App packaging (Electron Builder, Win + Mac)	Week 3
---
10. Open Questions
Should extracted files go into a subfolder named after the archive by default, or flat into the output folder?
Is RAR support a hard requirement for v1? (Requires 7-Zip CLI bundling due to RAR licensing)
Should the app support a "watch folder" mode in v2 where it auto-extracts anything dropped into a folder?
Do we need a settings panel in v1, or is everything decided through the main UI?
---
This document is a living spec. Update as decisions are made on open que