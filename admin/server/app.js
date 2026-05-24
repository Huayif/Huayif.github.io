import express from 'express'
import session from 'express-session'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

import postRoutes from './routes/posts.js'
import configRoutes from './routes/config.js'
import assetRoutes from './routes/assets.js'
import gitRoutes from './routes/git.js'
import buildRoutes from './routes/build.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Generate session secret on first run
let SESSION_SECRET
try {
  SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || randomBytes(32).toString('hex')
} catch {
  SESSION_SECRET = 'dev-secret-change-in-production'
}

// Default admin password — auto-generated on first run
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || randomBytes(6).toString('hex')

export function createApp() {
  const app = express()

  // View engine
  app.set('views', path.resolve(__dirname, '..', 'views'))
  app.set('view engine', 'ejs')

  // Body parsing
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Session
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
    },
  }))

  // Static files for admin UI
  app.use('/admin/static', express.static(path.resolve(__dirname, '..', 'public')))

  // Auth middleware
  app.use('/admin', (req, res, next) => {
    const publicPaths = ['/login', '/static']
    const isPublic = publicPaths.some(p => req.path.startsWith(p))
    if (isPublic) return next()
    if (req.session.authenticated) return next()
    res.redirect('/admin/login')
  })

  // API auth middleware
  app.use('/api', (req, res, next) => {
    if (req.session.authenticated) return next()
    res.status(401).json({ error: 'Unauthorized' })
  })

  // Helper: render a page template, then wrap it in the main layout
  function renderPage(res, view, options) {
    res.render(view, options, (err, body) => {
      if (err) return res.status(500).send(err.message)
      res.render('layouts/main', { ...options, body })
    })
  }

  // ===== Page Routes =====

  app.get('/admin/login', (req, res) => {
    if (req.session.authenticated) return res.redirect('/admin')
    res.render('login', { error: null })
  })

  app.post('/admin/login', (req, res) => {
    const { password } = req.body
    if (password === DEFAULT_PASSWORD) {
      req.session.authenticated = true
      return res.redirect('/admin')
    }
    res.render('login', { error: '密码错误' })
  })

  app.get('/admin/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin/login')
  })

  app.get('/admin', (req, res) => {
    renderPage(res, 'dashboard', { title: '首页看板', active: 'dashboard' })
  })

  app.get('/admin/posts', (req, res) => {
    renderPage(res, 'posts/list', { title: '文章管理', active: 'posts' })
  })

  app.get('/admin/posts/new', (req, res) => {
    renderPage(res, 'posts/editor', { title: '新建文章', slug: '', active: 'posts' })
  })

  app.get('/admin/posts/:slug/edit', (req, res) => {
    renderPage(res, 'posts/editor', { title: '编辑文章', slug: req.params.slug, active: 'posts' })
  })

  app.get('/admin/config/site', (req, res) => {
    renderPage(res, 'config/site', { title: '站点配置', active: 'config' })
  })

  app.get('/admin/config/theme', (req, res) => {
    renderPage(res, 'config/theme', { title: '主题配置', active: 'config' })
  })

  app.get('/admin/assets', (req, res) => {
    renderPage(res, 'assets', { title: '资源管理', active: 'assets' })
  })

  app.get('/admin/git', (req, res) => {
    renderPage(res, 'git', { title: 'Git 管理', active: 'git' })
  })

  // ===== API Routes =====
  app.use('/api/posts', postRoutes)
  app.use('/api/config', configRoutes)
  app.use('/api/assets', assetRoutes)
  app.use('/api/git', gitRoutes)
  app.use('/api/build', buildRoutes)

  return { app, DEFAULT_PASSWORD }
}
