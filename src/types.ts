export type FileStatus = 'queued' | 'extracting' | 'done' | 'failed'

export interface ArchiveFile {
  id: string
  path: string
  name: string
  size: number
  status: FileStatus
  progress: number
  error?: string
  format?: string
}

export interface ExtractionSummary {
  total: number
  successful: number
  failed: number
  failedFiles: Array<{
    name: string
    reason: string
  }>
}
