import { useState, useEffect, useCallback } from 'react'
import { ArchiveFile, FileStatus, ExtractionSummary } from './types'
import DropZone from './components/DropZone'
import OutputFolder from './components/OutputFolder'
import FileQueue from './components/FileQueue'
import Actions from './components/Actions'
import Summary from './components/Summary'

function App() {
  const [files, setFiles] = useState<ArchiveFile[]>([])
  const [outputFolder, setOutputFolder] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [summary, setSummary] = useState<ExtractionSummary | null>(null)

  useEffect(() => {
    // Load last output folder on mount
    window.electronAPI.getLastOutputFolder().then((folder) => {
      if (folder) {
        setOutputFolder(folder)
      }
    })

    // Listen for extraction progress updates
    window.electronAPI.onExtractionProgress((filePath, progress) => {
      setFiles((prev) =>
        prev.map((file) =>
          file.path === filePath
            ? { ...file, progress, status: 'extracting' as FileStatus }
            : file
        )
      )
    })
  }, [])

  const handleFilesAdded = useCallback(async (filePaths: string[]) => {
    const newFiles: ArchiveFile[] = []

    for (const filePath of filePaths) {
      // Validate the archive format
      const validation = await window.electronAPI.validateArchive(filePath)

      if (!validation.valid) {
        alert(`Invalid file format: ${filePath}`)
        continue
      }

      // Get file info
      const fileInfo = await window.electronAPI.getFileInfo(filePath)

      if (fileInfo) {
        newFiles.push({
          id: Math.random().toString(36).substring(7),
          path: fileInfo.path,
          name: fileInfo.name,
          size: fileInfo.size,
          status: 'queued',
          progress: 0,
          format: validation.format || undefined
        })
      }
    }

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }, [])

  const handleSelectOutputFolder = useCallback(async () => {
    const folder = await window.electronAPI.selectOutputFolder()
    if (folder) {
      setOutputFolder(folder)
    }
  }, [])

  const handleExtractAll = useCallback(async () => {
    if (!outputFolder || files.length === 0) return

    setIsExtracting(true)
    setSummary(null)

    const results: { success: boolean; file: ArchiveFile; error?: string }[] = []

    // Process files with concurrency limit of 4
    const concurrencyLimit = 4
    const executing: Promise<void>[] = []

    for (const file of files) {
      const task = (async () => {
        try {
          // Update status to extracting
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'extracting' as FileStatus } : f
            )
          )

          const result = await window.electronAPI.extractArchive(file.path, outputFolder)

          if (result.success) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: 'done' as FileStatus, progress: 100 }
                  : f
              )
            )
            results.push({ success: true, file })
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: 'failed' as FileStatus, error: result.error }
                  : f
              )
            )
            results.push({ success: false, file, error: result.error })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: 'failed' as FileStatus, error: errorMessage }
                : f
            )
          )
          results.push({ success: false, file, error: errorMessage })
        }
      })()

      executing.push(task)

      if (executing.length >= concurrencyLimit) {
        await Promise.race(executing)
        executing.splice(
          executing.findIndex((p) => p === task),
          1
        )
      }
    }

    // Wait for all remaining tasks
    await Promise.all(executing)

    // Generate summary
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length
    const failedFiles = results
      .filter((r) => !r.success)
      .map((r) => ({
        name: r.file.name,
        reason: r.error || 'Unknown error'
      }))

    setSummary({
      total: files.length,
      successful,
      failed,
      failedFiles
    })

    setIsExtracting(false)
  }, [outputFolder, files])

  const handleOpenFolder = useCallback(async () => {
    if (outputFolder) {
      await window.electronAPI.openFolder(outputFolder)
    }
  }, [outputFolder])

  const handleNewBatch = useCallback(() => {
    setFiles([])
    setSummary(null)
  }, [])

  const completedCount = files.filter((f) => f.status === 'done').length

  if (summary) {
    return (
      <div className="app">
        <header className="header">
          <h1>BatchUnpack</h1>
          <p>Batch Archive Extractor</p>
        </header>
        <div className="main-content">
          <Summary
            summary={summary}
            onNewBatch={handleNewBatch}
            onOpenFolder={handleOpenFolder}
            hasOutputFolder={!!outputFolder}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>BatchUnpack</h1>
        <p>Batch Archive Extractor - Drag and drop archives to extract</p>
      </header>
      <div className="main-content">
        <DropZone onFilesAdded={handleFilesAdded} disabled={isExtracting} />

        <OutputFolder
          outputFolder={outputFolder}
          onSelectFolder={handleSelectOutputFolder}
        />

        <FileQueue
          files={files}
          onRemoveFile={handleRemoveFile}
          isExtracting={isExtracting}
        />

        <Actions
          fileCount={files.length}
          completedCount={completedCount}
          canExtract={files.length > 0 && !!outputFolder && !isExtracting}
          isExtracting={isExtracting}
          onExtractAll={handleExtractAll}
          onOpenFolder={handleOpenFolder}
          hasOutputFolder={!!outputFolder}
        />
      </div>
    </div>
  )
}

export default App
