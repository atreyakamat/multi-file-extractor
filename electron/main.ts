import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import Store from 'electron-store'
import { fileURLToPath } from 'url'
import { extractZip, extractTar, extract7z } from './extractors.js'
import fs from 'fs/promises'
import { statSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const store = new Store()

let mainWindow: BrowserWindow | null = null

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'BatchUnpack'
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers

ipcMain.handle('select-output-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0]
    store.set('lastOutputFolder', folderPath)
    return folderPath
  }

  return null
})

ipcMain.handle('get-last-output-folder', () => {
  return store.get('lastOutputFolder', null)
})

ipcMain.handle('get-file-info', async (_event, filePath: string) => {
  try {
    const stats = statSync(filePath)
    return {
      size: stats.size,
      path: filePath,
      name: path.basename(filePath)
    }
  } catch (error) {
    console.error('Error getting file info:', error)
    return null
  }
})

ipcMain.handle('check-disk-space', async (_event, outputPath: string, requiredSpace: number) => {
  try {
    // Simple check - in production, use a library like 'check-disk-space'
    // For now, we'll return true
    return true
  } catch (error) {
    console.error('Error checking disk space:', error)
    return false
  }
})

ipcMain.handle('extract-archive', async (event, archivePath: string, outputPath: string) => {
  try {
    const ext = path.extname(archivePath).toLowerCase()
    const baseName = path.basename(archivePath, ext)

    // Create subfolder for this archive
    const targetPath = path.join(outputPath, baseName)
    await fs.mkdir(targetPath, { recursive: true })

    // Progress callback
    const onProgress = (progress: number) => {
      event.sender.send('extraction-progress', archivePath, progress)
    }

    // Determine extraction method based on file extension
    if (ext === '.zip') {
      await extractZip(archivePath, targetPath, onProgress)
    } else if (ext === '.tar' || archivePath.endsWith('.tar.gz') || archivePath.endsWith('.tar.bz2') || archivePath.endsWith('.tgz')) {
      await extractTar(archivePath, targetPath, onProgress)
    } else if (ext === '.7z') {
      await extract7z(archivePath, targetPath, onProgress)
    } else if (ext === '.gz' && !archivePath.endsWith('.tar.gz')) {
      // Single file gzip
      await extractTar(archivePath, targetPath, onProgress)
    } else {
      throw new Error(`Unsupported archive format: ${ext}`)
    }

    return { success: true, outputPath: targetPath }
  } catch (error) {
    console.error('Extraction error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
})

ipcMain.handle('open-folder', async (_event, folderPath: string) => {
  try {
    await shell.openPath(folderPath)
    return true
  } catch (error) {
    console.error('Error opening folder:', error)
    return false
  }
})

ipcMain.handle('validate-archive', async (_event, filePath: string) => {
  const ext = path.extname(filePath).toLowerCase()
  const validExtensions = ['.zip', '.tar', '.gz', '.7z', '.tgz', '.bz2']
  const fileName = path.basename(filePath).toLowerCase()

  // Check for tar.gz, tar.bz2
  if (fileName.endsWith('.tar.gz') || fileName.endsWith('.tar.bz2')) {
    return { valid: true, format: fileName.endsWith('.tar.gz') ? 'tar.gz' : 'tar.bz2' }
  }

  if (validExtensions.includes(ext)) {
    return { valid: true, format: ext.substring(1) }
  }

  return { valid: false, format: null }
})
