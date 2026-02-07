import { defineConfig } from 'vitepress'
import { sidebar } from 'vitepress-plugin-sidebar'  // 引入插件

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "📚博客文档",
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
        text: '🖥 操作系统',
        collapsed: true,
        link: '/posts/linux/index',
        items: [
          { text: '\u3000\u3000⏩ Linux相关', link: '/posts/linux/linux' },
          { text: '\u3000\u3000⏩ RockyLinux', link: '/posts/linux/rocky' },
        ]
      },
      {
        text: '⛏ 运维工具',
        collapsed: true,
        link: '/posts/tools/index',
        items: [
          { text: '\u3000\u3000⏩ Ansible', link: '/posts/tools/ansible' },
          { text: '\u3000\u3000⏩ Pyinfra', link: '/posts/tools/pyinfra' },
          { text: '\u3000\u3000⏩ Zabbix', link: '/posts/tools/zabbix' },
          { text: '\u3000\u3000⏩ Prometheus', link: '/posts/tools/prometheus' },
          { 
            text: '\u3000\u3000⏩ Jenkins', link: '/posts/tools/jenkins'
          },
          { text: '\u3000\u3000⏩ EBPF技术', link: '/posts/tools/ebpf' },
          { text: '\u3000\u3000⏩ vault', link: '/posts/tools/vault' },
          { text: '\u3000\u3000⏩ asdf工具', link: '/posts/tools/asdf' },
        ]
      },
      {
        text: '💻 语言相关',
        collapsed: true,
        link: '/posts/language/index',
        items: [
          {
            text: '\u3000\u3000⏩ C/C++',
            collapsed: true,
            link: '/posts/language/cc/index',
            items: [
              { text: '编码事项', link: '/posts/language/cc/index' },
            ]
          },
           {
            text: '\u3000\u3000⏩ Golang',
            collapsed: true,
            link: '/posts/language/golang/index',
            items: [
              { text: '编码事项', link: '/posts/language/golang/index' },
            ]
          },
          {
            text: '\u3000\u3000⏩ Python',
            collapsed: true,
            link: '/posts/language/python/index',
            items: [
              { text: '一些知识点', link: '/posts/language/python/index' },
              { text: 'uv项目管理工具', link: '/posts/language/python/uv' },
              { text: 'python启动设置', link: '/posts/language/python/py-run-env' },
            ]
          },
          {
            text: '\u3000\u3000⏩ PHP',
            collapsed: true,
            link: '/posts/language/php/index',
            items: [
              { text: 'fpm', link: '/posts/language/php/fpm' }
            ]
          },
          {
            text: '\u3000\u3000⏩ Java',
            collapsed: true,
            link: '/posts/language/java/index',
            items: [
              { text: '编码事项', link: '/posts/language/java/index' },
            ]
          },
          {
            text: '\u3000\u3000⏩ Rust',
            collapsed: true,
            link: '/posts/language/rust/index',
            items: [
               { text: '编码事项', link: '/posts/language/rust/index' },
            ]
          },
          {
            text: '\u3000\u3000⏩ Zig',
            collapsed: true,
            link: '/posts/language/zig/index',
            items: [
              { text: '编码事项', link: '/posts/language/zig/index'}
            ]
          }
        ]
      },
      {
        text: '🌐 网络相关',
        collapsed: true,
        link: '/posts/network/index',
        items: [
          { text: '\u3000\u3000⏩ v2ray', link: '/posts/network/v2ray' },
          { text: '\u3000\u3000⏩ openVpn', link: '/posts/network/openVpn' }
        ]
      },
      {
        text: '🎡 容器相关',
        collapsed: true,
        link: '/posts/containerd/docker/index',
        items: [
          {
            text: '\u3000\u3000⏩ Docker',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/containerd/docker/index' },
            ]
          },
          {
            text: '\u3000\u3000⏩ Podman',
            collapsed: true,
            items: []
          },
          {
            text: '\u3000\u3000⏩ Kubernetes',
            collapsed: true,
            items: [
              { text: '详解', link: '/posts/containerd/k8s/index' },
              { text: '部署', link: 'https://github.com/laazua/k8s' },
              { text: '示例', link: 'https://github.com/laazua/k8s/tree/main/examples' }
            ]
          },
          {
            text: '\u3000\u3000⏩ Helm',
            collapsed: true,
            items: [],
          }
        ]
      },
      {
        text: '🧱 中间件相关',
        collapsed: true,
        collapsible: true,
        link: '/posts/middleware/index',
        items: [
          {
            text: '\u3000\u3000⏩ Etcd',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/middleware/etcd/index' }
            ]
          },
          {
            text: '\u3000\u3000⏩ Elastic',
            collapsed: true,
            items: [
              { text: 'ELK技术栈', link: '/posts/middleware/elastic/index' }
            ]
          },
          {
            text: '\u3000\u3000⏩ Redis',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/middleware/redis/index' },
              { text: '技术文档', link: '/posts/middleware/redis/redis' },
            ]
          },
          {
            text: '\u3000\u3000⏩ MySQL',
            collapsed: true,
            items: []
          },
          { 
            text: '\u3000\u3000⏩ MongoDB',
            collapsed: true,
            items: []
          },
          {
            text: '\u3000\u3000⏩ PostgreSQL',
            collapsed: true,
            items: []
          },
          {
            text: '\u3000\u3000⏩ Nginx',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/posts/middleware/nginx/index' },
            ]
          },
          {
            text: '\u3000\u3000⏩ Kafka',
            collapsed: true,
            items: [],
          },
          {
            text: '\u3000\u3000⏩ Rabbitmq',
            collapsed: true,
            items: [],
          },
          {
            text: '\u3000\u3000⏩ Haproxy',
            collapsed: true,
            items: []
          },
        ]
      },
      {
        text: '👓 杂七杂八',
        collapsed: true,
        link: '/posts/other/index',
        items: [
          { text: '\u3000\u3000⏩ 一些工具', link: '/posts/other/tool' },
          { text: '\u3000\u3000⏩ 生活常识', link: '/posts/other/life/index' },
          { text: '\u3000\u3000⏩ 书籍推荐', link: '/posts/other/book/index' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/laazua' }
    ],
    footer: {
      message: '欢迎来到 Laazua 的站点',
      copyright: '版权归 Laazua 所有'
    },
    // 翻页
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
