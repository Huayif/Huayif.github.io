import { Router } from 'express'
import { runBuild } from '../services/buildService.js'

const router = Router()

router.post('/', async (req, res) => {
  // SSE (Server-Sent Events) streaming
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    await runBuild((data) => {
      const lines = data.split('\n').filter(l => l.trim())
      for (const line of lines) {
        res.write(`data: ${line.trim()}\n\n`)
      }
    })
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    res.write(`data: [ERROR] ${err.message}\n\n`)
    res.end()
  }
})

export default router
