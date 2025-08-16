import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

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

  themeConfig: {

    bg_image: {
      enable: true,
      url: "/background/bg_day.jpg",	// 白日模式背景
      dark: "/background/bg_dark.jpg",	// 夜间模式背景
      opacity: 0.6
    },

    banner: {
      enable: true,
      title: 'Akukin咖啡馆',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2024,
      beian: {
        enable: true,
        icp: '暂无',
      },
    },
  },

  unocss: { safelist },
})
