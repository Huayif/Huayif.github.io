import { createApp } from './server/app.js'

const { app, DEFAULT_PASSWORD } = createApp()

const PORT = process.env.ADMIN_PORT || 3456

app.listen(PORT, () => {
  console.log()
  console.log('  🌸 博客管理后台')
  console.log()
  console.log(`  地址  http://localhost:${PORT}/admin`)
  console.log(`  密码  ${DEFAULT_PASSWORD}`)
  console.log()
})
