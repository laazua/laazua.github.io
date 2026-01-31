import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "LAAZUA の Document",
  description: "记录日常学习和工作的点点滴滴",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/avatar.png',
    siteTitle: "Laazua",
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts' }
    ],
    sidebar: [
      {
        text: '操作系统',
        collapsed: true,
        items: [
          { text: 'Linux相关', link: '/posts/linux/index' },
          { text: 'RockyLinux', link: '/posts/linux/rocky' },
        ]
      },
      {
        text: '运维工具',
        collapsed: true,
        items: [
          { text: 'Ansible', link: '/posts/tools/ansible' },
          { text: 'Pyinfra', link: '/posts/tools/pyinfra' },
          // { text: 'Elastic', link: '/posts/tools/elk' },
          { text: 'Zabbix', link: '/posts/tools/zabbix' },
          { text: 'Prometheus', link: '/posts/tools/prometheus' },
          { 
            text: 'Jenkins', link: '/posts/tools/jenkins'
          },
          { text: 'EBPF技术', link: '/posts/tools/ebpf' },
          { text: 'vault', link: '/posts/tools/vault' }
        ]
      },
      {
        text: '语言相关',
        collapsed: true,
        items: [
          {
            text: 'Rust',
            collapsed: true,
            items: [
               { text: '编码事项', link: '/posts/language/rust/index' },
            ]
          },
          {
            text: 'Java',
            collapsed: true,
            items: [
              { text: '编码事项', link: '/posts/language/java/index' },
            ]
          },
          {
            text: 'Python',
            collapsed: true,
            items: [
              { text: '一些知识点', link: '/posts/language/python/index' },
              { text: 'uv项目管理工具', link: '/posts/language/python/uv' },
              { text: 'python启动设置', link: '/posts/language/python/py-run-env' },
            ]
          },
          {
            text: 'Golang',
            collapsed: true,
            items: [
              { text: '编码事项', link: '/posts/language/golang/index' },
            ]
          },
          {
            text: 'C/C++',
            collapsed: true,
            items: [
              { text: '编码事项', link: '/posts/language/cc/index' },
            ]
          }
        ]
      },
      {
        text: '网络相关',
        collapsed: true,
        items: [
          { text: '网络概念', link: '/posts/network/index' },
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
              { text: '基础知识', link: '/posts/containerd/docker/index' },
            ]
          },
          {
            text: 'Podman',
            collapsed: true,
            items: []
          },
          {
            text: 'Kubernetes',
            collapsed: true,
            items: [
              { text: '详解', link: '/posts/containerd/k8s/index' },
              { text: '部署', link: 'https://github.com/laazua/k8s' },
              { text: '示例', link: 'https://github.com/laazua/k8s/tree/main/examples' }
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
            text: 'Etcd',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/middleware/etcd/index' }
            ]
          },
          {
            text: 'Elastic',
            collapsed: true,
            items: [
              { text: 'ELK技术栈', link: '/posts/middleware/elastic/index' }
            ]
          },
          {
            text: 'Redis',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/middleware/redis/index' },
              { text: '技术文档', link: '/posts/middleware/redis/redis' },
            ]
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
            items: [
              { text: '基础知识', link: '/posts/middleware/nginx/index' },
            ]
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
          },
        ]
      },
      {
        text: '其他知识点',
        collapsed: true,
        items: [
          { text: '一些工具', link: '/posts/other/index' },
          { text: '生活常识', link: '/posts/other/life/index' },
          { text: '书籍推荐', link: '/posts/other/book/index' },
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
