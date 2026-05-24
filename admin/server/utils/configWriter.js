import { createJiti } from 'jiti'
import fs from 'node:fs/promises'
import { safeResolve } from './pathSafe.js'

const jiti = createJiti(import.meta.url)

/**
 * Load a TypeScript config file and return its default export as a plain object.
 * Uses jiti (same as Valaxy) for runtime TS loading.
 */
export async function loadTsConfig(filePath) {
  const absolutePath = safeResolve(filePath)
  const mod = await jiti.import(absolutePath, { default: true })
  return mod.default || mod
}

/**
 * Read a text file (for styles).
 */
export async function readText(filePath) {
  const absolutePath = safeResolve(filePath)
  return fs.readFile(absolutePath, 'utf-8')
}

/**
 * Write a text file.
 */
export async function writeText(filePath, content) {
  const absolutePath = safeResolve(filePath)
  await fs.writeFile(absolutePath, content, 'utf-8')
}

/**
 * Serialize a value to pretty TypeScript/JavaScript code.
 * Handles objects, arrays, strings, numbers, booleans, and nested structures.
 */
export function toTsCode(value, indent = 0) {
  const pad = '  '.repeat(indent)
  const pad1 = '  '.repeat(indent + 1)

  if (value === null || value === undefined) return 'undefined'
  if (typeof value === 'string') {
    // Use single quotes if no single quotes inside, else double
    if (value.includes("'")) return JSON.stringify(value)
    return `'${value}'`
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return value.toString()

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    // Check if simple array (all primitives) — fit on one line
    const allSimple = value.every(v => typeof v !== 'object' || v === null)
    if (allSimple && value.length <= 5) {
      return '[' + value.map(v => toTsCode(v, 0)).join(', ') + ']'
    }
    return '[\n' + value.map(v => pad1 + toTsCode(v, indent + 1)).join(',\n') + ',\n' + pad + ']'
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined)
    if (entries.length === 0) return '{}'
    return '{\n' + entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`
      return `${pad1}${key}: ${toTsCode(v, indent + 1)}`
    }).join(',\n') + ',\n' + pad + '}'
  }

  return String(value)
}

/**
 * Generate a complete site.config.ts file from a config object.
 */
export function generateSiteConfig(config) {
  const lines = [
    `import { defineSiteConfig } from 'valaxy'`,
    '',
    `export default defineSiteConfig(${toTsCode(config)})`,
    '',
  ]
  return lines.join('\n')
}

/**
 * Generate a complete valaxy.config.ts file from theme config and waline options.
 * This is the tricky part — we need to preserve the import structure.
 */
export function generateValaxyConfig(config) {
  const lines = [
    `import type { UserThemeConfig } from 'valaxy-theme-yun'`,
    `import { defineValaxyConfig } from 'valaxy'`,
    `import { addonWaline } from 'valaxy-addon-waline'`,
    '',
    `const safelist = [`,
    `  'i-ri-home-line',`,
    `]`,
    '',
    `export default defineValaxyConfig<UserThemeConfig>({`,
    `  theme: 'yun',`,
    '',
  ]

  // Addons (Waline)
  if (config.waline) {
    const w = config.waline
    const walineOpts = {}
    if (w.serverURL) walineOpts.serverURL = w.serverURL
    walineOpts.lang = 'zh-CN'
    walineOpts.dark = 'auto'
    walineOpts.requiredMeta = ['nick', 'mail']
    walineOpts.locale = { placeholder: '填写qq邮箱或点击登录，可以展示个人头像~' }
    if (w.comment !== undefined) walineOpts.comment = w.comment
    if (w.pageview !== undefined) walineOpts.pageview = w.pageview

    lines.push(`  addons: [`)
    lines.push(`    addonWaline(${toTsCode(walineOpts, 2)}),`)
    lines.push(`  ],`)
    lines.push('')
  }

  // Theme config
  if (config.themeConfig) {
    lines.push(`  themeConfig: ${toTsCode(config.themeConfig, 2)},`)
    lines.push('')
  }

  lines.push(`  unocss: {`)
  lines.push(`    safelist`)
  lines.push(`  },`)
  lines.push('')
  lines.push(`})`)
  lines.push('')

  return lines.join('\n')
}
