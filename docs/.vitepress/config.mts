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
        text: '系统相关',
        collapsed: true,
        items: [
          { text: 'linux内核参数调整', link: '/posts/linux/kernel' }
        ]
      },
      {
        text: '语言相关',
        collapsed: true,
        items: [
          {
            text: 'Python',
            collapsed: true,
            items: [
              { text: 'python启动设置', link: '/posts/language/python/run' },
              { text: 'django-drf接口示例', link: '/posts/language/python/py-drf' },
            ]
          },
          {
            text: 'Golang',
            collapsed: true,
            items: [
              { text: 'go编译优化', link: '/posts/language/golang/build' },
            ]
          },
          {
            text: 'Java',
            collapsed: true,
            items: [
              { text: '运行时环境优化', link: '/posts/language/java/runtime' },
            ]
          }
        ]
      },
      {
        text: '网络相关',
        collapsed: true,
        items: [
          { text: 'v2ray', link: '/posts/network/v2ray' },
          { text: 'openVpn', link: '/posts/network/openVpn' }
        ]
      },
      {
        text: 'Kubernetes',
        collapsed: true,
        items: [
          { text: 'docker', link: '/posts/kubernetes/docker'}
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
