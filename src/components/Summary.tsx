import { ExtractionSummary } from '../types'

interface SummaryProps {
  summary: ExtractionSummary
  onNewBatch: () => void
  onOpenFolder: () => void
  hasOutputFolder: boolean
}

function Summary({ summary, onNewBatch, onOpenFolder, hasOutputFolder }: SummaryProps) {
  const allSuccessful = summary.failed === 0

  return (
    <div className="summary-screen">
      <div className="summary-icon">{allSuccessful ? '🎉' : '⚠️'}</div>

      <h2 className="summary-title">
        {allSuccessful ? 'Extraction Complete!' : 'Extraction Finished with Errors'}
      </h2>

      <p className="summary-message">
        {allSuccessful
          ? `All ${summary.successful} archive${summary.successful !== 1 ? 's' : ''} extracted successfully!`
          : `${summary.successful} succeeded, ${summary.failed} failed`}
      </p>

      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-value">{summary.total}</div>
          <div className="stat-label">Total Files</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#2e7d32' }}>
            {summary.successful}
          </div>
          <div className="stat-label">Successful</div>
        </div>
        {summary.failed > 0 && (
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#c62828' }}>
              {summary.failed}
            </div>
            <div className="stat-label">Failed</div>
          </div>
        )}
      </div>

      {summary.failed > 0 && summary.failedFiles.length > 0 && (
        <div className="failed-files">
          <h4>Failed Files:</h4>
          {summary.failedFiles.map((file, index) => (
            <div key={index} className="failed-file-item">
              <div className="failed-file-name">{file.name}</div>
              <div className="failed-file-reason">Reason: {file.reason}</div>
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons" style={{ justifyContent: 'center', marginTop: '30px' }}>
        {hasOutputFolder && (
          <button className="open-folder-button" onClick={onOpenFolder}>
            Open Output Folder
          </button>
        )}
        <button className="extract-button" onClick={onNewBatch}>
          Start New Batch
        </button>
      </div>
    </div>
  )
}

export default Summary
