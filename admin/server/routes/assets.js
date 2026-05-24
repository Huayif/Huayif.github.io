import { Router } from 'express'
import multer from 'multer'
import * as assetService from '../services/assetService.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowed = /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|pdf|txt|css|js|json|xml|ico|mp4|webm|mp3|wav|ogg|woff2?|ttf|eot)$/i
    if (allowed.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  },
})

// Browse directory
router.get('/', async (req, res) => {
  try {
    const result = await assetService.browseAssets(req.query.dir || '')
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有选择文件' })
    }
    const result = await assetService.uploadFile(req.file, req.body.dir || '')
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

// Delete file
router.delete('/', async (req, res) => {
  try {
    const result = await assetService.deleteAsset(req.body.path)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

export default router
