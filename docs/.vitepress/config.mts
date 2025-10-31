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
          { text: 'bash脚本相关', link: '/posts/linux/bash'},
          { text: 'linux内核参数调整', link: '/posts/linux/kernel' },
          { text: 'ssh服务相关配置详解', link: '/posts/linux/sshd' }
        ]
      },
      {
        text: '运维工具',
        collapsed: true,
        items: [
          { text: 'Ansible', link: '/posts/tools/ansible' },
          { text: 'Pyinfra', link: '/posts/tools/pyinfra' },
          { text: 'Elk', link: '/posts/tools/elk' },
          { text: 'Zabbix', link: '/posts/tools/zabbix' },
          { text: 'Prometheus', link: '/posts/tools/prometheus' },
          { 
            text: 'Jenkins',
            collapsed: true,
            items: [
              { text: '共享库示例', link: 'https://github.com/laazua/sharedlib' }
            ]
          }
        ]
      },
      {
        text: '语言相关',
        collapsed: true,
        items: [
          {
            text: 'Java',
            collapsed: true,
            items: [
              { text: '运行时环境优化', link: '/posts/language/java/runtime' },
              { text: '模块化编程', link: '/posts/language/java/module' },
            ]
          },
          {
            text: 'Python',
            collapsed: true,
            items: [
              { text: 'uv项目管理工具', link: '/posts/language/python/uv' },
              { text: 'python启动设置', link: '/posts/language/python/py-run-env' },
              { text: 'django-drf接口示例', link: '/posts/language/python/py-drf' },
              { text: '标准库 asyncio', link: '/posts/language/python/asyncio' },
              { text: 'python项目环境差异化配置', link: '/posts/language/python/py-config' },
              { text: '好用的三方库' , link: '/posts/language/python/third-py.md' },
            ]
          },
          {
            text: 'Golang',
            collapsed: true,
            items: [
              { text: 'go编译优化', link: '/posts/language/golang/build' },
              // { text: 'go项目代码组织', link: '/posts/language/golang/desc' },
            ]
          },
          {
            text: 'Rust',
            collapsed: true,
            items: [
              
            ]
          },
          {
            text: 'C/C++',
            collapsed: true,
            items: [
              
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
        text: '容器相关',
        collapsed: true,
        items: [
          {
            text: 'Docker',
            collapsed: true,
            items: [
              { text: '基础指令详解', link: '/posts/containerd/docker/base' },
              { text: 'dockerfile示例', link: '/posts/containerd/docker/dockerfile' }
            ]
          },
          {
            text: 'Kubernetes',
            collapsed: true,
            items: [
              { text: 'k8s部署', link: 'https://github.com/laazua/k8s' },
              { text: 'k8s示例', link: 'https://github.com/laazua/k8s/tree/main/examples' }
            ]
          },
          {
            text: 'Helm',
            collapsed: true,
            items: [],
          }
        ]
      },
      {
        text: '中间件相关',
        collapsed: true,
        items: [
          {
            text: 'Redis',
            collapsed: true,
            items: []
          },
          {
            text: 'MySQL',
            collapsed: true,
            items: []
          },
          { 
            text: 'MongoDB',
            collapsed: true,
            items: []
          },
          {
            text: 'PostgreSQL',
            collapsed: true,
            items: []
          },
          {
            text: 'Nginx',
            collapsed: true,
            items: []
          },
          {
            text: 'Kafka',
            collapsed: true,
            items: [],
          },
          {
            text: 'Rabbitmq',
            collapsed: true,
            items: [],
          },
          {
            text: 'Haproxy',
            collapsed: true,
            items: []
          }
        ]
      },
      {
        text: '其他',
        collapsed: true,
        items: [
          { text: '编辑器', link: '/posts/other/font' },
          { text: 'windows截屏制作', link: '/posts/other/cut' },
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
