import { Router } from 'express'
import * as configService from '../services/configService.js'

const router = Router()

// Site config
router.get('/site', async (req, res) => {
  try {
    const config = await configService.getSiteConfig()
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/site', async (req, res) => {
  try {
    const result = await configService.updateSiteConfig(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Theme config
router.get('/theme', async (req, res) => {
  try {
    const config = await configService.getThemeConfig()
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/theme', async (req, res) => {
  try {
    const result = await configService.updateThemeConfig(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Custom styles
router.get('/styles', async (req, res) => {
  try {
    const result = await configService.getStyles()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/styles', async (req, res) => {
  try {
    const result = await configService.updateStyles(req.body.content || '')
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
