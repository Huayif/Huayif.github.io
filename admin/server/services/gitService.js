import simpleGit from 'simple-git'
import { ROOT } from '../utils/pathSafe.js'

const git = simpleGit(ROOT)

export async function getStatus() {
  const status = await git.status()
  const branch = status.current || 'unknown'

  const files = []
  for (const f of status.files) {
    files.push(`${f.index} ${f.path}`)
  }

  return { branch, files, clean: status.isClean() }
}

export async function commit(message) {
  await git.add('.')
  const result = await git.commit(message)
  return {
    commit: result.commit,
    summary: result.summary,
  }
}

export async function push() {
  await git.push()
  return { success: true }
}

export async function log(limit = 20) {
  const logData = await git.log({ n: limit })
  return logData.all.map(entry => ({
    hash: entry.hash.slice(0, 7),
    message: entry.message,
    author: entry.author_name,
    date: entry.date,
  }))
}
