import { ArchiveFile } from '../types'
import FileItem from './FileItem'

interface FileQueueProps {
  files: ArchiveFile[]
  onRemoveFile: (id: string) => void
  isExtracting: boolean
}

function FileQueue({ files, onRemoveFile, isExtracting }: FileQueueProps) {
  if (files.length === 0) {
    return (
      <div className="file-queue">
        <h3>File Queue</h3>
        <div className="empty-state">No files added yet. Drag and drop archives above.</div>
      </div>
    )
  }

  return (
    <div className="file-queue">
      <h3>File Queue ({files.length})</h3>
      <div className="file-list">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
            isExtracting={isExtracting}
          />
        ))}
      </div>
    </div>
  )
}

export default FileQueue
