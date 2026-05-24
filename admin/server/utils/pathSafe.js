import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..')

/**
 * Validate that a resolved path stays within the project root.
 * Throws if the path escapes the project directory.
 */
export function safeResolve(...segments) {
  const target = path.resolve(ROOT, ...segments)
  const normalizedRoot = path.normalize(ROOT)
  if (!target.startsWith(normalizedRoot + path.sep) && target !== normalizedRoot) {
    const err = new Error('Path traversal detected')
    err.status = 403
    throw err
  }
  return target
}

export { ROOT }
