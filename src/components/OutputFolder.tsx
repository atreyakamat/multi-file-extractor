interface OutputFolderProps {
  outputFolder: string | null
  onSelectFolder: () => void
}

function OutputFolder({ outputFolder, onSelectFolder }: OutputFolderProps) {
  return (
    <div className="output-folder-section">
      <label>Output Folder:</label>
      <div className={`output-folder-path ${!outputFolder ? 'empty' : ''}`}>
        {outputFolder || 'No folder selected'}
      </div>
      <button className="change-folder-button" onClick={onSelectFolder}>
        {outputFolder ? 'Change' : 'Select Folder'}
      </button>
    </div>
  )
}

export default OutputFolder
