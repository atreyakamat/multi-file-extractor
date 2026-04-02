import { ArchiveFile } from '../types'

interface FileItemProps {
  file: ArchiveFile
  onRemove: (id: string) => void
  isExtracting: boolean
}

function FileItem({ file, onRemove, isExtracting }: FileItemProps) {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

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
        <div className="file-size">{formatSize(file.size)}</div>
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
