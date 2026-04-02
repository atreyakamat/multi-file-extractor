import { ArchiveFile } from '../types'
import { formatFileSize } from '../utils'

interface FileItemProps {
  file: ArchiveFile
  onRemove: (id: string) => void
  isExtracting: boolean
}

function FileItem({ file, onRemove, isExtracting }: FileItemProps) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'queued':
        return '⏳'
      case 'extracting':
        return '🔄'
      case 'done':
        return '✅'
      case 'failed':
        return '❌'
    }
  }

  const getStatusText = () => {
    switch (file.status) {
      case 'queued':
        return 'Queued'
      case 'extracting':
        return 'Extracting...'
      case 'done':
        return 'Done'
      case 'failed':
        return 'Failed'
    }
  }

  const canRemove = file.status === 'queued' && !isExtracting

  return (
    <div className="file-item">
      <div className="file-icon">📦</div>
      <div className="file-info">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatFileSize(file.size)}</div>
      </div>

      {(file.status === 'extracting' || file.status === 'done') && (
        <div className="file-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${file.progress}%` }} />
          </div>
          <div className="progress-text">{file.progress}%</div>
        </div>
      )}

      <div className={`file-status status-${file.status}`}>
        <span>{getStatusIcon()} {getStatusText()}</span>
      </div>

      {canRemove && (
        <button className="remove-button" onClick={() => onRemove(file.id)} title="Remove">
          ×
        </button>
      )}

      {file.status === 'failed' && file.error && (
        <div className="file-error" style={{ fontSize: '12px', color: '#c62828', marginLeft: '10px' }}>
          {file.error}
        </div>
      )}
    </div>
  )
}

export default FileItem
