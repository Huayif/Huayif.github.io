import fs from 'node:fs/promises'
import path from 'node:path'
import { safeResolve } from '../utils/pathSafe.js'
import { readPost, writePost, slugify } from '../utils/frontmatter.js'

const POSTS_DIR = safeResolve('pages', 'posts')

export async function listPosts() {
  await fs.mkdir(POSTS_DIR, { recursive: true })
  const files = await fs.readdir(POSTS_DIR)
  const mdFiles = files.filter(f => f.endsWith('.md'))

  const posts = []
  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file)
    const stat = await fs.stat(filePath)
    try {
      const { frontmatter } = await readPost(filePath)
      posts.push({
        slug: file.replace(/\.md$/, ''),
        ...frontmatter,
        _fileSize: stat.size,
        _mtime: stat.mtime.toISOString(),
      })
    } catch {
      // Skip files with unparseable frontmatter
      posts.push({ slug: file.replace(/\.md$/, ''), title: file, _error: true })
    }
  }

  // Sort by date desc, then by top desc
  posts.sort((a, b) => {
    if (a.top && !b.top) return -1
    if (!a.top && b.top) return 1
    const da = String(a.date || '')
    const db = String(b.date || '')
    return db.localeCompare(da)
  })

  return posts
}

export async function getPost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  const exists = await fs.access(filePath).then(() => true).catch(() => false)
  if (!exists) {
    const err = new Error('文章不存在')
    err.status = 404
    throw err
  }
  const { frontmatter, content } = await readPost(filePath)
  return { slug, frontmatter, content, filePath: `pages/posts/${slug}.md` }
}

export async function createPost(data) {
  const slug = data.slug || slugify(data.title)
  const filePath = path.join(POSTS_DIR, `${slug}.md`)

  const exists = await fs.access(filePath).then(() => true).catch(() => false)
  if (exists) {
    const err = new Error(`文件名 "${slug}.md" 已存在`)
    err.status = 409
    throw err
  }

  const now = new Date().toISOString().slice(0, 10)
  const frontmatter = {
    title: data.title,
    date: data.date || now,
    categories: data.categories,
    tags: data.tags,
    cover: data.cover,
    excerpt: data.excerpt,
    top: data.top,
    draft: data.draft,
    comment: data.comment,
    copyright: data.copyright,
    end: data.end,
  }

  const content = writePost(frontmatter, data.content || '')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf-8')

  return { slug, filePath: `pages/posts/${slug}.md` }
}

export async function updatePost(slug, data) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  const exists = await fs.access(filePath).then(() => true).catch(() => false)
  if (!exists) {
    const err = new Error('文章不存在')
    err.status = 404
    throw err
  }

  const { frontmatter: existing } = await readPost(filePath)
  const now = new Date().toISOString().slice(0, 10)

  // Merge: new data overrides existing
  const merged = { ...existing }

  if (data.title !== undefined) merged.title = data.title
  if (data.date !== undefined) merged.date = data.date
  if (data.categories !== undefined) merged.categories = data.categories || undefined
  if (data.tags !== undefined) merged.tags = data.tags || undefined
  if (data.cover !== undefined) merged.cover = data.cover || undefined
  if (data.excerpt !== undefined) merged.excerpt = data.excerpt || undefined
  if (data.top !== undefined) merged.top = data.top || undefined
  if (data.draft !== undefined) merged.draft = data.draft || undefined
  if (data.comment !== undefined) merged.comment = data.comment
  if (data.copyright !== undefined) merged.copyright = data.copyright || undefined
  if (data.end !== undefined) merged.end = data.end || undefined

  // Auto-update the updated field
  merged.updated = now

  // Clean up undefined values
  for (const key of Object.keys(merged)) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      delete merged[key]
    }
  }
  // Ensure title and date always present
  merged.title = merged.title || existing.title || 'Untitled'
  merged.date = merged.date || existing.date

  const content = data.content !== undefined ? data.content : (await readPost(filePath)).content
  const output = writePost(merged, content)
  await fs.writeFile(filePath, output, 'utf-8')

  return { slug, filePath: `pages/posts/${slug}.md` }
}

export async function deletePost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  const exists = await fs.access(filePath).then(() => true).catch(() => false)
  if (!exists) {
    const err = new Error('文章不存在')
    err.status = 404
    throw err
  }
  await fs.unlink(filePath)
  return { slug }
}
