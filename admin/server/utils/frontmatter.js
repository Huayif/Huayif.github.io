import matter from 'gray-matter'
import fs from 'node:fs/promises'

/**
 * Read a markdown file and parse its frontmatter + content.
 */
export async function readPost(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, content: content.trimStart() }
}

/**
 * Serialize frontmatter + content back to a markdown string.
 */
export function writePost(frontmatter, content) {
  // Sort keys for stable output: title, date, updated first, then rest
  const priorityKeys = ['title', 'date', 'updated', 'categories', 'tags', 'top', 'cover', 'excerpt']
  const sorted = {}
  for (const k of priorityKeys) {
    if (frontmatter[k] !== undefined && frontmatter[k] !== null && frontmatter[k] !== '') {
      sorted[k] = frontmatter[k]
    }
  }
  for (const k of Object.keys(frontmatter)) {
    if (!(k in sorted) && frontmatter[k] !== undefined && frontmatter[k] !== null && frontmatter[k] !== '') {
      sorted[k] = frontmatter[k]
    }
  }
  return matter.stringify(content.trim(), sorted)
}

/**
 * Generate a slug from a title string.
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    || 'untitled'
}
