import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "LAAZUA 的博客",
  description: "日常学习和工作的点点滴滴",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/avatar.png',
    siteTitle: "Laazua's Blog",
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts' }
    ],
    sidebar: [
      {
        text: 'Python',
        collapsed: true,
        items: [
          { text: '程序启动优化', link: '/posts/python/run'}
        ]
      },
      {
        text: 'Golang',
        collapsed: true,
        items: []
      },
      {
        text: 'Network',
        collapsed: true,
        items: [
          { text: 'v2ray', link: '/posts/network/v2ray.md' },
          { text: 'openVpn', link: '/posts/network/openVpn.md' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/laazua' }
    ],
    footer: {
      message: '@laazua',
      copyright: 'copyright by laazua'
    }
  }
})
