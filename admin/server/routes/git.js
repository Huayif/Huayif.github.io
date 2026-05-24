import { Router } from 'express'
import * as gitService from '../services/gitService.js'

const router = Router()

router.get('/status', async (req, res) => {
  try {
    const status = await gitService.getStatus()
    res.json(status)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/commit', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: '提交信息不能为空' })
    const result = await gitService.commit(message)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/push', async (req, res) => {
  try {
    const result = await gitService.push()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/log', async (req, res) => {
  try {
    const log = await gitService.log()
    res.json(log)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
