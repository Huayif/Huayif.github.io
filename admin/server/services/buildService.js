import { spawn } from 'node:child_process'
import { ROOT } from '../utils/pathSafe.js'

/**
 * Run npm build and stream output line-by-line via callback.
 * Returns a promise that resolves on success or rejects on error.
 */
export function runBuild(onData) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], {
      cwd: ROOT,
      shell: true,
      env: { ...process.env },
    })

    child.stdout.on('data', (chunk) => {
      onData(chunk.toString())
    })

    child.stderr.on('data', (chunk) => {
      onData(chunk.toString())
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`Build exited with code ${code}`))
      }
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
}
