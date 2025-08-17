import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'


// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  addons: [
    addonWaline({
      serverURL: 'https://my-waline-server-kappa.vercel.app', // 换成你刚才拿到的地址
      lang: 'zh-CN',
      dark: 'auto',
      requiredMeta: ['nick', 'mail'],
      locale: {
        placeholder: '填写qq邮箱或点击登录，可以展示个人头像~',
      },
      comment: true,
      pageview: true
    }),
  ],

  themeConfig: {

    fireworks: {
      enable: true,
      colors: ['#d096dfff', '#a7d1f3ff', '#e4c2eaff']
    },

    bg_image: {
      enable: true,
      url: "/background/bg_day.jpg",	// 白日模式背景
      dark: "/background/bg_dark.jpg",	// 夜间模式背景
      opacity: 0.6
    },

    banner: {
      enable: true,
      title: ['Akukin','的','咖','啡','馆'],
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: 'ta',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
      {
        name: 'markdown格式',
        url: 'https://www.ysjinyi.com/mdnext',
        icon: 'i-ri-archive-drawer-line',
        color: 'black',
      },
      {
        name: '图标',//每次加图标记得手动添加i-
        url: 'https://icones.js.org/',
        icon: 'https://api.iconify.design/iconoir:badge-check.svg',
        color: 'white',
      }
    ],

    footer: {
      since: 2024,
      beian: {
        enable: true,
        icp: '暂无icp备案',
      },
    },
  },

  unocss: {
     safelist 
    },
})
