export {}

declare global {
  interface Window {
    electronAPI: {
      selectOutputFolder: () => Promise<string | null>
      getLastOutputFolder: () => Promise<string | null>
      getFileInfo: (filePath: string) => Promise<{
        size: number
        path: string
        name: string
      } | null>
      checkDiskSpace: (outputPath: string, requiredSpace: number) => Promise<boolean>
      extractArchive: (archivePath: string, outputPath: string) => Promise<{
        success: boolean
        outputPath?: string
        error?: string
      }>
      openFolder: (folderPath: string) => Promise<boolean>
      validateArchive: (filePath: string) => Promise<{
        valid: boolean
        format: string | null
      }>
      onExtractionProgress: (callback: (filePath: string, progress: number) => void) => void
    }
  }
}
