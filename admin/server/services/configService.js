import { loadTsConfig, generateSiteConfig, generateValaxyConfig, readText, writeText } from '../utils/configWriter.js'

const SITE_CONFIG_PATH = 'site.config.ts'
const VALAXY_CONFIG_PATH = 'valaxy.config.ts'
const STYLES_PATH = 'styles/index.scss'

// ——— Site Config ———

export async function getSiteConfig() {
  return loadTsConfig(SITE_CONFIG_PATH)
}

export async function updateSiteConfig(newConfig) {
  const existing = await loadTsConfig(SITE_CONFIG_PATH)

  // Deep merge: newConfig overrides existing
  const merged = deepMerge(existing, newConfig)

  const content = generateSiteConfig(merged)
  await writeText(SITE_CONFIG_PATH, content)
  return merged
}

// ——— Theme Config ———

export async function getThemeConfig() {
  const config = await loadTsConfig(VALAXY_CONFIG_PATH)
  // Extract waline options from addons array
  const result = { themeConfig: config.themeConfig, addons: [] }
  if (config.addons) {
    for (const addon of config.addons) {
      if (addon && addon.name === 'valaxy-addon-waline') {
        result.addons.push({ name: addon.name, options: addon.options || {} })
      }
    }
  }
  return result
}

export async function updateThemeConfig(newConfig) {
  const existing = await loadTsConfig(VALAXY_CONFIG_PATH)

  // Merge themeConfig
  const mergedThemeConfig = deepMerge(existing.themeConfig || {}, newConfig.themeConfig || {})

  // Rebuild with existing structure preserved where possible
  const rebuilt = { ...existing }
  rebuilt.themeConfig = mergedThemeConfig

  // Update waline options in addons
  if (newConfig.waline && rebuilt.addons) {
    for (const addon of rebuilt.addons) {
      if (addon && addon.name === 'valaxy-addon-waline') {
        addon.options = { ...addon.options, ...newConfig.waline }
      }
    }
  }

  const content = generateValaxyConfig({
    themeConfig: mergedThemeConfig,
    waline: newConfig.waline,
  })

  // Actually write via the generated config to keep it clean
  await writeText(VALAXY_CONFIG_PATH, content)
  return rebuilt
}

// ——— Styles ———

export async function getStyles() {
  const content = await readText(STYLES_PATH)
  return { content }
}

export async function updateStyles(content) {
  await writeText(STYLES_PATH, content)
  return { content }
}

// ——— Helpers ———

function deepMerge(base, override) {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const ov = override[key]
    const bv = base[key]
    if (ov !== undefined) {
      if (isPlainObject(bv) && isPlainObject(ov)) {
        result[key] = deepMerge(bv, ov)
      } else {
        result[key] = ov
      }
    }
  }
  return result
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}
