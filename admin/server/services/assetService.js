import fs from 'node:fs/promises'
import path from 'node:path'
import { safeResolve } from '../utils/pathSafe.js'

const PUBLIC_DIR = safeResolve('public')

function friendlySize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export async function browseAssets(dir = '') {
  const targetDir = dir ? safeResolve('public', dir) : PUBLIC_DIR

  // Verify targetDir is within PUBLIC_DIR
  if (!targetDir.startsWith(PUBLIC_DIR)) {
    const err = new Error('Path traversal detected')
    err.status = 403
    throw err
  }

  const entries = await fs.readdir(targetDir, { withFileTypes: true })

  const dirs = []
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue // skip hidden
    if (entry.isDirectory()) {
      dirs.push(entry.name)
    } else {
      const stat = await fs.stat(path.join(targetDir, entry.name))
      files.push({
        name: entry.name,
        size: friendlySize(stat.size),
        path: '/public/' + (dir ? dir + '/' : '') + entry.name,
        mtime: stat.mtime.toISOString(),
      })
    }
  }

  const result = {
    dirs: dirs.sort(),
    files: files.sort((a, b) => a.name.localeCompare(b.name)),
  }

  // Add parent navigation
  if (dir) {
    result.parent = path.dirname(dir).replace(/\\/g, '/')
    if (result.parent === '.') result.parent = ''
  }

  return result
}

export async function uploadFile(file, targetDir = '') {
  const destDir = targetDir ? safeResolve('public', targetDir) : PUBLIC_DIR

  if (!destDir.startsWith(PUBLIC_DIR)) {
    const err = new Error('Path traversal detected')
    err.status = 403
    throw err
  }

  await fs.mkdir(destDir, { recursive: true })
  const destPath = path.join(destDir, file.originalname)

  // Avoid overwriting — add suffix
  let finalPath = destPath
  let counter = 1
  const ext = path.extname(file.originalname)
  const base = path.basename(file.originalname, ext)
  while (true) {
    const exists = await fs.access(finalPath).then(() => true).catch(() => false)
    if (!exists) break
    finalPath = path.join(destDir, `${base}_${counter}${ext}`)
    counter++
  }

  await fs.writeFile(finalPath, file.buffer)

  const relPath = '/' + path.relative(PUBLIC_DIR, finalPath).replace(/\\/g, '/')
  return {
    name: path.basename(finalPath),
    path: '/public' + relPath,
  }
}

export async function deleteAsset(filePath) {
  // filePath is relative to project root, e.g. "public/images/photo.jpg"
  const absolutePath = safeResolve(filePath)

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    const err = new Error('Can only delete files within public/')
    err.status = 403
    throw err
  }

  const stat = await fs.stat(absolutePath)
  if (stat.isDirectory()) {
    const err = new Error('Cannot delete directories from admin panel')
    err.status = 400
    throw err
  }

  await fs.unlink(absolutePath)
  return { path: '/' + filePath }
}
