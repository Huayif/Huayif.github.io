import { Router } from 'express'
import * as postService from '../services/postService.js'

const router = Router()

// List all posts
router.get('/', async (req, res) => {
  try {
    const posts = await postService.listPosts()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await postService.getPost(req.params.slug)
    res.json(post)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

// Create post
router.post('/', async (req, res) => {
  try {
    const result = await postService.createPost(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

// Update post
router.put('/:slug', async (req, res) => {
  try {
    const result = await postService.updatePost(req.params.slug, req.body)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

// Delete post
router.delete('/:slug', async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.slug)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
})

export default router
