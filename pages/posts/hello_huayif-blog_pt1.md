---
title: 搭建个人博客！
date: 2026-03-22
updated: 2026-03-22
categories: code
tags:
  - 建站
copyright: true
---

## 为什么选 Valaxy？

在此之前我也尝试过Hexo，当然也选的yun主题

但自从发现作者自研了新框架后，便果断的换了
- **Valaxy** —— 基于 Vue 3 + Vite，主题好看，文档是中文的

最后选了 Valaxy，主要原因是：主题 Yun 看着顺眼，而且文档对中文用户友好。

---

## 环境准备

需要提前装好：

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)（推荐，比 npm 快）

```bash
# 安装 pnpm（如果还没装）
npm install -g pnpm
```

---

## 初始化项目

Valaxy 提供了脚手架，一行命令搞定：

```bash
pnpm create valaxy
```

按提示输入项目名、选择主题（选 `yun`），它会自动帮你创建好项目结构并安装依赖。

完成后进入目录，启动开发服务器：

```bash
cd my-blog
pnpm dev
```

打开 `http://localhost:4859`，博客就跑起来了。

---

## 项目结构

```
my-blog/
├── pages/
│   ├── posts/        # 博客文章，在这里写 .md 文件
│   ├── about/        # 关于页
│   └── links/        # 友链页
├── public/           # 静态资源（图片、favicon 等）
├── styles/           # 自定义样式
├── site.config.ts    # 站点基本信息
└── valaxy.config.ts  # 主题与插件配置
```

最常用的就两个配置文件，下面分别说。

---

## 配置站点信息

`site.config.ts` 负责博客的基础信息：

```ts
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://你的域名',
  lang: 'zh-CN',
  title: '博客标题',
  author: {
    name: '你的名字',
    avatar: '/avatar/favicon.jpg',
  },
  subtitle: '副标题',
  description: '个性签名',
  social: [
    // GitHub、B站等社交链接
  ],
})
```

---

## 配置主题与插件

`valaxy.config.ts` 负责主题细节和插件：

```ts
import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'

export default defineValaxyConfig<UserThemeConfig>({
  theme: 'yun',

  themeConfig: {
    // 点击烟花特效
    fireworks: {
      enable: true,
      colors: ['#d096df', '#a7d1f3', '#f0a6ff']
    },
    // 背景图（昼/夜分别配置）
    bg_image: {
      enable: true,
      url: '/background/bg_day.jpg',
      dark: '/background/bg_dark.jpg',
      opacity: 0.6
    },
    // 首页 Banner 标题
    banner: {
      enable: true,
      title: ['你', '的', '博', '客', '名'],
    },
  },
})
```

背景图放到 `public/background/` 目录下就能被引用。

---

## 写第一篇文章

在 `pages/posts/` 下新建一个 `.md` 文件，比如 `hello.md`：

```markdown
---
title: 第一篇文章
date: 2026-03-22
categories: 随笔
tags:
  - 日常
---

正文内容写在这里。
```

Front Matter（两个 `---` 之间的部分）用来设置标题、日期、分类、标签等元信息，正文直接写 Markdown。

---

## 添加评论系统（Waline）

首先部署一个 Waline 服务端，官方推荐部署到 Vercel，参考 [Waline 官方文档](https://waline.js.org/guide/get-started/)，拿到服务端地址后：

```bash
pnpm add -D valaxy-addon-waline
```

在 `valaxy.config.ts` 中引入：

```ts
import { addonWaline } from 'valaxy-addon-waline'

export default defineValaxyConfig({
  addons: [
    addonWaline({
      serverURL: 'https://你的-waline-server.vercel.app',
      lang: 'zh-CN',
      comment: true,
      pageview: true,
    }),
  ],
})
```

在 `site.config.ts` 中开启评论：

```ts
export default defineSiteConfig({
  comment: { enable: true },
})
```

---

## 部署到 GitHub Pages

1. 在 GitHub 上新建仓库（建议命名为 `username.github.io`）
2. 把本地项目推上去：

```bash
git init
git remote add origin https://github.com/你的用户名/你的仓库名.git
git add .
git commit -m "init"
git push -u origin main
```

3. 在仓库的 `Settings → Pages` 里，Source 选 **GitHub Actions**
4. 在项目根目录创建 `.github/workflows/deploy.yml`，内容参考 [Valaxy 官方部署文档](https://valaxy.site/guide/deploy)

推送后等一两分钟，访问 `https://你的用户名.github.io` 就能看到了。

---

## 小结

整个流程其实不复杂：

1. `pnpm create valaxy` 初始化
2. 改 `site.config.ts` 和 `valaxy.config.ts`
3. 在 `pages/posts/` 写文章
4. 部署到 GitHub Pages 或 Vercel

后续还有很多可以客制化的内容，to be continued
