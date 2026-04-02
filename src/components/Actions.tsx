interface ActionsProps {
  fileCount: number
  completedCount: number
  canExtract: boolean
  isExtracting: boolean
  onExtractAll: () => void
  onOpenFolder: () => void
  hasOutputFolder: boolean
}

function Actions({
  fileCount,
  completedCount,
  canExtract,
  isExtracting,
  onExtractAll,
  onOpenFolder,
  hasOutputFolder
}: ActionsProps) {
  return (
    <div className="actions-section">
      <div className="overall-progress">
        {isExtracting && (
          <span>
            Progress: {completedCount} / {fileCount} completed
          </span>
        )}
        {!isExtracting && fileCount > 0 && (
          <span>
            {fileCount} file{fileCount !== 1 ? 's' : ''} in queue
          </span>
        )}
      </div>

      <div className="action-buttons">
        {hasOutputFolder && (
          <button className="open-folder-button" onClick={onOpenFolder}>
            Open Output Folder
          </button>
        )}

        <button
          className="extract-button"
          onClick={onExtractAll}
          disabled={!canExtract}
        >
          {isExtracting ? 'Extracting...' : 'Extract All'}
        </button>
      </div>
    </div>
  )
}

export default Actions
