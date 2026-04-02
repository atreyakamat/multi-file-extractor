import { contextBridge, ipcRenderer } from 'electron'

export interface FileInfo {
  size: number
  path: string
  name: string
}

export interface ValidationResult {
  valid: boolean
  format: string | null
}

export interface ExtractionResult {
  success: boolean
  outputPath?: string
  error?: string
}

contextBridge.exposeInMainWorld('electronAPI', {
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  getLastOutputFolder: () => ipcRenderer.invoke('get-last-output-folder'),
  getFileInfo: (filePath: string) => ipcRenderer.invoke('get-file-info', filePath),
  checkDiskSpace: (outputPath: string, requiredSpace: number) =>
    ipcRenderer.invoke('check-disk-space', outputPath, requiredSpace),
  extractArchive: (archivePath: string, outputPath: string) =>
    ipcRenderer.invoke('extract-archive', archivePath, outputPath),
  openFolder: (folderPath: string) => ipcRenderer.invoke('open-folder', folderPath),
  validateArchive: (filePath: string) => ipcRenderer.invoke('validate-archive', filePath),
  onExtractionProgress: (callback: (filePath: string, progress: number) => void) => {
    ipcRenderer.on('extraction-progress', (_event, filePath, progress) => {
      callback(filePath, progress)
    })
  }
})

declare global {
  interface Window {
    electronAPI: {
      selectOutputFolder: () => Promise<string | null>
      getLastOutputFolder: () => Promise<string | null>
      getFileInfo: (filePath: string) => Promise<FileInfo | null>
      checkDiskSpace: (outputPath: string, requiredSpace: number) => Promise<boolean>
      extractArchive: (archivePath: string, outputPath: string) => Promise<ExtractionResult>
      openFolder: (folderPath: string) => Promise<boolean>
      validateArchive: (filePath: string) => Promise<ValidationResult>
      onExtractionProgress: (callback: (filePath: string, progress: number) => void) => void
    }
  }
}
