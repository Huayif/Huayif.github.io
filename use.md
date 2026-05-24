---
title: 文章 Frontmatter 用法总结
date: 2026-03-22
categories: 使用指南
tags:
  - 工具
draft: true
hide: true
---

文章开头 `---` 包裹的区域叫 **frontmatter**，用来控制文章的各种属性。

---

## 基本信息

```yaml
title: 文章标题           # 字符串
# 或多语言写法：
title:
  zh-CN: 文章标题
  en: Post Title

date: 2025-01-01          # 发布日期
updated: 2025-01-02       # 最后更新日期，与 date 相同时不显示
author: huayif            # 作者，覆盖全局设置
lang: zh-CN               # 语言
```

---

## 分类与标签

```yaml
categories: 生活          # 单个分类
# 或多层分类：
categories:
  - 技术
  - 前端

tags:
  - Vue
  - 博客
```

---

## 封面与题图

```yaml
cover: /images/cover.jpg          # 封面图，显示在文章卡片和页面顶部
image: /images/cover.jpg          # 同 cover，也用于 SEO schema
```

---

## 可见性控制

```yaml
draft: true       # 草稿，只在开发环境显示，生产构建中隐藏

hide: true        # 在首页列表和归档页都隐藏（文章本身可访问）
hide: all         # 同上
hide: index       # 只在首页列表隐藏，归档页仍显示

top: 1            # 置顶，数字越大越靠前（多篇置顶时排序用）
```

---

## 文章底部区域

```yaml
end: true         # 文末显示 Q.E.D.（表示文章已完结）
end: false        # 文末显示 To Be Continued.（表示未完待续）
# 不写 end：底部什么都不显示

copyright: true   # 强制显示版权声明
copyright: false  # 强制隐藏版权声明（不写则跟随全局设置）

sponsor: false    # 隐藏赞助按钮（不写则跟随全局设置）

comment: false    # 关闭此篇文章的评论区
nav: false        # 隐藏上一篇 / 下一篇导航
```

---

## 页面布局

```yaml
layout: post      # 覆盖默认布局（pages/posts/ 下默认就是 post）

sidebar: false    # 隐藏左侧侧边栏
aside: false      # 隐藏右侧面板（含目录）
toc: false        # 只隐藏目录，保留右侧面板
```

---

## 文章样式（yun 主题）

```yaml
type: bilibili    # 文章卡片类型，影响图标和主色（bilibili/yuque/link 或自定义）
icon: i-ri-heart-line   # 标题前的图标（Iconify 图标名，建议用 pageTitleClass 替代 color）
color: pink       # 标题颜色（已废弃，建议改用 pageTitleClass）

pageTitleClass: text-4xl          # 页面标题的 CSS class（UnoCSS 语法）
postTitleClass: font-bold         # 在文章列表卡片中标题的 CSS class
markdownClass: my-markdown        # 正文内容区的 CSS class
```

---

## 摘要

```yaml
excerpt: 这是自定义摘要文字       # 手动指定摘要，会覆盖 <!-- more --> 标记

excerpt_type: text    # 摘要渲染方式
# md   → 按 markdown 渲染
# html → 按 HTML 渲染（默认）
# text → 纯文本
# ai   → 显示为 AI 摘要样式（配合 excerpt 使用）
```

也可以在正文中用 `<!-- more -->` 标记摘要截断点，不需要写 excerpt。

---

## 加密

```yaml
password: mypassword      # 设置后文章整体加密，访问需输入密码
password_hint: 提示文字   # 密码输入框下方的提示
gallery_password: abc     # 单独加密相册部分
encrypt: true             # password 存在时自动为 true，一般不用手动写
```

---

## 功能开关

```yaml
katex: true         # 启用 KaTeX 数学公式渲染
medium_zoom: true   # 启用图片点击放大
codepen: true       # 启用 CodePen 嵌入组件

codeHeightLimit: 300   # 代码块最大高度（px），超出折叠

time_warning: true     # 文章超过 30 天未更新时显示过时警告
time_warning: 86400000 # 自定义警告阈值（单位：毫秒）
```

---

## 跳转与路径

```yaml
url: https://example.com    # 点击文章卡片直接跳转到此 URL，不进入文章页

from: /old-path             # 从旧路径重定向到此文章（客户端跳转）
from:
  - /old-path-1
  - /old-path-2
```

---

## 特殊布局字段

这些字段配合特定 `layout` 使用：

```yaml
# layout: albums —— 相册列表页
albums:
  - url: /album/travel/
    cover: /images/travel.jpg
    caption: 旅行
    desc: 一些旅行照片

# layout: gallery —— 图片画廊页
photos:
  - src: /images/photo1.jpg
    caption: 照片标题
    desc: 照片描述
```

---

## 自动生成字段（不要手动写）

```yaml
readingTime: 5      # 阅读时长（分钟），由 statistics.enable: true 自动生成
wordCount: 1000     # 字数统计，同上自动生成
abbrlink: a1b2c3d4  # 短链 hash，由 valaxy-addon-abbrlink 自动生成
```

---

## 最简模板

```yaml
---
title: 文章标题
date: 2025-01-01
categories: 分类名
tags:
  - 标签1
---
```

## 完整示例

```yaml
---
title: 我的文章
date: 2025-08-15
updated: 2025-09-01
categories: 生活
tags:
  - 杂谈
  - 日记
cover: /images/cover.jpg
top: 1
end: true
comment: true
copyright: true
excerpt: 这是一篇关于...的文章
katex: false
medium_zoom: true
codeHeightLimit: 300
---
```
