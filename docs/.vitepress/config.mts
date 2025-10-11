import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "LAAZUA 的博客",
  description: "日常学习和工作的点点滴滴",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/avatar.png',
    siteTitle: "Laazua 的博客",
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts' }
    ],
    sidebar: [
      {
        text: 'Linux',
        collapsed: true,
        items: [
          { text: '内核参数调整', link: '/posts/linux/kernel.md' }
        ]
      },
      {
        text: 'Python',
        collapsed: true,
        items: [
          { text: 'python启动设置', link: '/posts/python/run.md' }
        ]
      },
      {
        text: 'Golang',
        collapsed: true,
        items: [
          { text: 'go编译优化', link: '/posts/golang/build.md' }
        ]
      },
      {
        text: 'Network',
        collapsed: true,
        items: [
          { text: 'v2ray', link: '/posts/network/v2ray.md' },
          { text: 'openVpn', link: '/posts/network/openVpn.md' }
        ]
      },
      {
        text: 'Kubernetes',
        collapsed: true,
        items: [
          { text: 'docker', link: '/posts/kubernetes/docker.md'}
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/laazua' }
    ],
    footer: {
      message: '欢迎来到 Laazua 的站点',
      copyright: '版权归 Laazua 所有'
    }
  }
})
