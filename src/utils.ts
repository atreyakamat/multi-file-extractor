export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  const lowerName = filename.toLowerCase()

  // Check for compound extensions first
  if (lowerName.endsWith('.tar.gz')) return '.tar.gz'
  if (lowerName.endsWith('.tar.bz2')) return '.tar.bz2'

  // Check for single extensions
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''

  return filename.substring(lastDot).toLowerCase()
}

export function isValidArchiveExtension(filename: string): boolean {
  const validExtensions = [
    '.zip',
    '.tar',
    '.gz',
    '.7z',
    '.tgz',
    '.bz2',
    '.tar.gz',
    '.tar.bz2',
    '.xz'
  ]

  const ext = getFileExtension(filename)
  return validExtensions.includes(ext)
}

export function getArchiveFormat(filename: string): string {
  const lowerName = filename.toLowerCase()

  if (lowerName.endsWith('.tar.gz') || lowerName.endsWith('.tgz')) return 'TAR.GZ'
  if (lowerName.endsWith('.tar.bz2')) return 'TAR.BZ2'
  if (lowerName.endsWith('.zip')) return 'ZIP'
  if (lowerName.endsWith('.tar')) return 'TAR'
  if (lowerName.endsWith('.7z')) return '7Z'
  if (lowerName.endsWith('.gz')) return 'GZ'
  if (lowerName.endsWith('.xz')) return 'XZ'
  if (lowerName.endsWith('.bz2')) return 'BZ2'

  return 'Unknown'
}

export function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
