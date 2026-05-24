# Huayif Blog - Valaxy 个人博客项目指南

## 项目概述

这是一个基于 [Valaxy](https://valaxy.site/) 框架 + [Yun 主题](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-yun) 搭建的静态博客。

- **框架版本**: valaxy 0.26.2
- **主题版本**: valaxy-theme-yun 0.26.2
- **评论系统**: Waline (valaxy-addon-waline)
- **部署目标**: GitHub Pages (https://huayif.github.io)

---

## 快速开始

### 常用命令

```bash
# 开发预览
npm run dev

# 构建（SSG 静态生成）
npm run build
# 或
npm run build:ssg

# 预览构建结果
npm run serve

# 生成 RSS
npm run rss
```

---

## 项目结构

```
huayif-blog/
├── pages/                    # 页面内容
│   ├── posts/               # 博客文章目录
│   │   └── *.md             # 文章文件
│   ├── about/               # 关于页面
│   │   ├── index.md         # 关于我
│   │   └── site.md          # 关于站点
│   ├── links/               # 友情链接页面
│   ├── girls/               # 特殊页面
│   ├── archives/            # 归档页面
│   ├── categories/          # 分类页面
│   └── tags/                # 标签页面
├── public/                   # 静态资源
│   ├── avatar/              # 头像
│   │   └── favicon.jpg
│   ├── background/          # 背景图片
│   │   ├── bg_day.jpg       # 日间模式背景
│   │   └── bg_dark.jpg      # 夜间模式背景
│   └── webicon/             # 网站图标
│       └── favicon.ico
├── styles/                   # 自定义样式
│   ├── index.scss           # 主样式文件
│   └── README.md
├── site.config.ts           # 站点配置（基本信息）
├── valaxy.config.ts         # 主题配置（视觉、功能）
├── use.md                   # 文章 Frontmatter 用法参考
└── package.json
```

---

## 配置文件说明

### 1. site.config.ts - 站点基本信息

此文件配置站点的核心信息，如标题、作者、社交链接等。

**关键字段**:
- `url`: 站点 URL（部署后修改）
- `title`: 站点标题（显示在浏览器标签）
- `subtitle`: 副标题
- `description`: 站点描述/个性签名
- `author.name`: 作者名
- `author.avatar`: 头像路径（相对于 public 目录）
- `author.status`: 状态 emoji 和文字
- `favicon`: 网站图标路径
- `social`: 社交链接数组
- `sponsor`: 赞助配置

**示例修改**:
```typescript
export default defineSiteConfig({
  url: 'https://your-domain.com',  // 部署后更新
  title: '新标题',
  subtitle: '新副标题',
  description: '新的个性签名',
  author: {
    name: '新名字',
    avatar: '/avatar/new-avatar.jpg',
    status: {
      emoji: '🌟',
      message: '新的状态消息',
    },
  },
})
```

### 2. valaxy.config.ts - 主题与功能配置

此文件配置主题外观、特效、评论等功能。

**关键配置区块**:

#### 评论系统 (Waline)
```typescript
addons: [
  addonWaline({
    serverURL: 'https://your-waline-server.vercel.app', // Waline 服务端地址
    lang: 'zh-CN',
    dark: 'auto',
    requiredMeta: ['nick', 'mail'],
    comment: true,
    pageview: true
  }),
]
```

#### 背景图片
```typescript
themeConfig: {
  bg_image: {
    enable: true,
    url: "/background/bg_day.jpg",     // 日间背景
    dark: "/background/bg_dark.jpg",   // 夜间背景
    opacity: 0.6                        // 透明度 0-1
  },
}
```

#### 顶部横幅
```typescript
banner: {
  enable: true,
  title: ['Akukin','的','咖','啡','馆'],  // 逐字显示标题
}
```

#### 导航页面
```typescript
pages: [
  {
    name: '页面名称',
    url: '/links/',
    icon: 'i-ri-genderless-line',  // Iconify 图标名
    color: 'dodgerblue',
  },
]
```

#### 烟花特效
```typescript
fireworks: {
  enable: true,
  colors: ['#d096dfff', '#a7d1f3ff', 'rgba(240, 166, 255, 1)']
}
```

---

## 如何写文章

### 文章位置

所有文章存放在 `pages/posts/` 目录下，以 `.md` 为扩展名。

### 创建新文章

1. 在 `pages/posts/` 下创建新的 `.md` 文件
2. 文件名建议使用英文，如 `my-new-post.md`
3. 文件内容以 frontmatter 开头，然后是正文

### 文章模板

```markdown
---
title: 文章标题
date: 2026-03-24
categories: 分类名
tags:
  - 标签1
  - 标签2
---

文章正文内容，支持 Markdown 语法。

## 二级标题

- 列表项1
- 列表项2

**粗体文字**

[链接文字](https://example.com)

![图片说明](/images/photo.jpg)
```

### 常用 Frontmatter 字段

**基本信息**:
- `title`: 文章标题（必填）
- `date`: 发布日期，格式 `YYYY-MM-DD`
- `updated`: 更新日期
- `categories`: 分类（单个或多个层级）
- `tags`: 标签数组

**封面与摘要**:
- `cover`: 封面图路径，如 `/images/cover.jpg`
- `excerpt`: 自定义摘要文字
- 或使用 `<!-- more -->` 标记摘要截断点

**可见性**:
- `draft: true`: 草稿（开发环境可见，生产环境隐藏）
- `hide: true`: 隐藏文章（可访问但不在列表显示）
- `top: 1`: 置顶（数字越大越靠前）

**功能开关**:
- `comment: false`: 关闭评论
- `copyright: true`: 显示版权声明
- `end: true`: 文末显示完结标记
- `katex: true`: 启用数学公式

**完整参考**: 见 `use.md` 文件

---

## 静态资源管理

### 图片存放位置

- 头像: `public/avatar/`
- 背景: `public/background/`
- 文章图片: `public/images/`（需手动创建）
- 网站图标: `public/webicon/`

### 引用方式

在文章中引用图片使用绝对路径（相对于 public 目录）:

```markdown
![描述](/images/photo.jpg)
```

在 frontmatter 中:
```yaml
cover: /images/cover.jpg
```

---

## 特殊页面

### 关于页面

- `pages/about/index.md` - 关于我
- `pages/about/site.md` - 关于站点

### 友链页面

- `pages/links/index.md` - 编辑友情链接
- 格式参考已有文件

### 归档/分类/标签页面

这些是自动生成的页面，一般不需要修改:
- `pages/archives/index.md`
- `pages/categories/index.md`
- `pages/tags/index.md`

---

## 自定义样式

全局自定义样式在 `styles/index.scss` 中编写。

支持 SCSS 语法和 UnoCSS 类名。

---

## 部署

项目配置为使用 GitHub Actions 自动部署到 GitHub Pages:

- 配置文件: `.github/workflows/gh-pages.yml`
- 触发条件: push 到 main 分支
- 目标分支: gh-pages

如需部署到其他平台（Vercel/Netlify），请参考相应文档。

---

## 图标使用

主题使用 [Iconify](https://icones.js.org/) 图标库。

图标类名格式: `i-ri-xxx-line` 或 `i-ri-xxx-fill`

常用图标:
- `i-ri-home-line` - 主页
- `i-ri-qq-line` - QQ
- `i-ri-github-line` - GitHub
- `i-ri-bilibili-line` - 哔哩哔哩
- `i-ri-rss-line` - RSS

---

## 常见问题

**Q: 如何修改网站图标?**
A: 替换 `public/webicon/favicon.ico`，并在 `site.config.ts` 中更新 `favicon` 路径。

**Q: 如何添加新的导航页面?**
A: 在 `valaxy.config.ts` 的 `themeConfig.pages` 数组中添加配置项。

**Q: 文章如何设置密码?**
A: 在 frontmatter 中添加 `password: 你的密码`。

**Q: 如何关闭评论?**
A: 单篇文章使用 `comment: false`，或全局在 `valaxy.config.ts` 中修改 Waline 配置。

---

## 参考资源

- [Valaxy 官方文档](https://valaxy.site/)
- [Yun 主题文档](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-yun/docs)
- [Frontmatter 完整参考](./use.md)
- [Iconify 图标搜索](https://icones.js.org/)
