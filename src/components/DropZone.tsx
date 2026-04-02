import { useCallback, useState } from 'react'

interface DropZoneProps {
  onFilesAdded: (filePaths: string[]) => void
  disabled?: boolean
}

// Electron extends File with a path property
interface ElectronFile extends File {
  path: string
}

function DropZone({ onFilesAdded, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const filePaths = Array.from(e.dataTransfer.files).map((file) => (file as ElectronFile).path)
      if (filePaths.length > 0) {
        onFilesAdded(filePaths)
      }
    },
    [onFilesAdded, disabled]
  )

  const handleBrowse = useCallback(() => {
    if (disabled) return

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.zip,.tar,.gz,.7z,.tgz,.bz2,.tar.gz,.tar.bz2'

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        const filePaths = Array.from(target.files).map((file) => (file as ElectronFile).path)
        onFilesAdded(filePaths)
      }
    }

    input.click()
  }, [onFilesAdded, disabled])

  return (
    <div
      className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowse}
    >
      <div className="drop-zone-content">
        <h2>📦 Drop archive files here</h2>
        <p>Supported formats: ZIP, TAR, TAR.GZ, TAR.BZ2, 7z, GZ</p>
        <button className="browse-button" onClick={handleBrowse} disabled={disabled}>
          Browse Files
        </button>
      </div>
    </div>
  )
}

export default DropZone
