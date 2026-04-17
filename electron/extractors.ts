import AdmZip from 'adm-zip'
import * as tar from 'tar'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'

export async function extractZip(
  archivePath: string,
  outputPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(archivePath)
      const zipEntries = zip.getEntries()
      const totalEntries = zipEntries.length

      if (totalEntries === 0) {
        if (onProgress) onProgress(100)
        resolve()
        return
      }

      let extractedCount = 0

      // Extract all at once (AdmZip doesn't support incremental extraction with progress easily)
      zip.extractAllTo(outputPath, true)

      // Simulate progress
      if (onProgress) {
        const interval = setInterval(() => {
          extractedCount++
          const progress = Math.min((extractedCount / totalEntries) * 100, 100)
          onProgress(progress)

          if (extractedCount >= totalEntries) {
            clearInterval(interval)
            resolve()
          }
        }, 10)
      } else {
        resolve()
      }
    } catch (error) {
      reject(error)
    }
  })
}

export async function extractTar(
  archivePath: string,
  outputPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    let lastProgress = 0

    tar.extract({
      file: archivePath,
      cwd: outputPath,
      onentry: () => {
        if (onProgress) {
          lastProgress += 5
          onProgress(Math.min(lastProgress, 95))
        }
      }
    })
      .then(() => {
        if (onProgress) onProgress(100)
        resolve()
      })
      .catch(reject)
  })
}

export async function extract7z(
  archivePath: string,
  outputPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use 7z command line tool
    // Note: This requires 7z to be installed on the system
    // For cross-platform support, we should bundle 7z binary with the app

    const sevenZipPath = process.platform === 'win32' ? '7z' : '7z'
    const child = spawn(sevenZipPath, ['x', archivePath, `-o${outputPath}`, '-y'])

    let progressValue = 0
    const progressInterval = setInterval(() => {
      if (progressValue < 90) {
        progressValue += 10
        if (onProgress) onProgress(progressValue)
      }
    }, 200)

    let stderr = ''

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      clearInterval(progressInterval)

      if (code === 0) {
        if (onProgress) onProgress(100)
        resolve()
      } else {
        reject(new Error(`7z extraction failed with code ${code}: ${stderr}`))
      }
    })

    child.on('error', (error) => {
      clearInterval(progressInterval)
      reject(new Error(`Failed to start 7z: ${error.message}`))
    })
  })
}
