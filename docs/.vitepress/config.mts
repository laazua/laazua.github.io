import { defineConfig } from 'vitepress'
// import { sidebar } from 'vitepress-plugin-sidebar'  // 引入插件


const TSPACE = '\u3000\u3000' // 定义两个全角空格

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
          { text: `${TSPACE}⏩ Linux相关`, link: '/posts/linux/linux' },
          { text: `${TSPACE}⏩ RockyLinux`, link: '/posts/linux/rocky' },
        ]
      },
      {
        text: '⛏ 运维工具',
        collapsed: true,
        link: '/posts/tools/index',
        items: [
          { text: `${TSPACE}⏩ Ansible`, link: '/posts/tools/ansible' },
          { text: `${TSPACE}⏩ Pyinfra`, link: '/posts/tools/pyinfra' },
          { text: `${TSPACE}⏩ Zabbix`, link: '/posts/tools/zabbix' },
          { text: `${TSPACE}⏩ Prometheus`, link: '/posts/tools/prometheus' },
          { 
            text: `${TSPACE}⏩ Jenkins`, link: '/posts/tools/jenkins'
          },
          { text: `${TSPACE}⏩ EBPF技术`, link: '/posts/tools/ebpf' },
          { text: `${TSPACE}⏩ vault`, link: '/posts/tools/vault' },
          { text: `${TSPACE}⏩ asdf工具`, link: '/posts/tools/asdf' },
          { text: `${TSPACE}⏩ airflow工具`, link: '/posts/tools/airflow' },
        ]
      },
      {
        text: '💻 语言相关',
        collapsed: true,
        link: '/posts/language/index',
        items: [
          {
            text: `${TSPACE}⏩ C/C++`,
            collapsed: true,
            link: '/posts/language/cc/index',
            items: [
              { text: `${TSPACE}编码事项`, link: '/posts/language/cc/index' },
            ]
          },
           {
            text: `${TSPACE}⏩ Golang`,
            collapsed: true,
            link: '/posts/language/golang/index',
            items: [
              { text: `${TSPACE}编码事项`, link: '/posts/language/golang/index' },
            ]
          },
          {
            text: `${TSPACE}⏩ Python`,
            collapsed: true,
            link: '/posts/language/python/index',
            items: [
              { text: `${TSPACE}一些知识点`, link: '/posts/language/python/index' },
              { text: `${TSPACE}uv项目管理工具`, link: '/posts/language/python/uv' },
              { text: `${TSPACE}python启动设置`, link: '/posts/language/python/py-run-env' },
            ]
          },
          {
            text: `${TSPACE}⏩ PHP`,
            collapsed: true,
            link: '/posts/language/php/index',
            items: [
              { text: `${TSPACE}fpm`, link: '/posts/language/php/fpm' }
            ]
          },
          {
            text: `${TSPACE}⏩ Java`,
            collapsed: true,
            link: '/posts/language/java/index',
            items: [
              { text: `${TSPACE}编码事项`, link: '/posts/language/java/index' },
            ]
          },
          // {
          //   text: `${TSPACE}⏩ Rust`,
          //   collapsed: true,
          //   link: '/posts/language/rust/index',
          //   items: [
          //      { text: `${TSPACE}编码事项`, link: '/posts/language/rust/index' },
          //   ]
          // },
          // {
          //   text: `${TSPACE}⏩ Zig`,
          //   collapsed: true,
          //   link: '/posts/language/zig/index',
          //   items: [
          //     { text: `${TSPACE}编码事项`, link: '/posts/language/zig/index'}
          //   ]
          // }
        ]
      },
      {
        text: '🌐 网络相关',
        collapsed: true,
        link: '/posts/network/index',
        items: [
          { text: `${TSPACE}⏩ v2ray`, link: '/posts/network/v2ray' },
          { text: `${TSPACE}⏩ openVpn`, link: '/posts/network/openVpn' }
        ]
      },
      {
        text: '🎡 容器相关',
        collapsed: true,
        link: '/posts/containerd/docker/index',
        items: [
          {
            text: `${TSPACE}⏩ Docker`,
            collapsed: true,
            items: [
              { text: `${TSPACE}基础知识`, link: '/posts/containerd/docker/index' },
            ]
          },
          {
            text: `${TSPACE}⏩ Podman`,
            collapsed: true,
            items: []
          },
          {
            text: `${TSPACE}⏩ Kubernetes`,
            collapsed: true,
            items: [
              { text: `${TSPACE}详解`, link: '/posts/containerd/k8s/index' },
              { text: `${TSPACE}部署`, link: 'https://github.com/laazua/k8s' },
              { text: `${TSPACE}示例`, link: 'https://github.com/laazua/k8s/tree/main/examples' }
            ]
          },
          {
            text: `${TSPACE}⏩ Helm`,
            collapsed: true,
            items: [],
          }
        ]
      },
      {
        text: '🧱 中间件相关',
        collapsed: true,
        link: '/posts/middleware/index',
        items: [
          {
            text: `${TSPACE}⏩ Etcd`,
            collapsed: true,
            items: [
              { text: `${TSPACE}基础知识`, link: '/posts/middleware/etcd/index' }
            ]
          },
          {
            text: `${TSPACE}⏩ Elastic`,
            collapsed: true,
            items: [
              { text: `${TSPACE}ELK技术栈`, link: '/posts/middleware/elastic/index' }
            ]
          },
          {
            text: `${TSPACE}⏩ Redis`,
            collapsed: true,
            items: [
              { text: `${TSPACE}基础知识`, link: '/posts/middleware/redis/index' },
              { text: `${TSPACE}技术文档`, link: '/posts/middleware/redis/redis' },
            ]
          },
          {
            text: `${TSPACE}⏩ MySQL`,
            collapsed: true,
            link: '/posts/middleware/mysql/index',
            items: []
          },
          { 
            text: `${TSPACE}⏩ MongoDB`,
            collapsed: true,
            link: '/posts/middleware/mongo/index',
            items: []
          },
          {
            text: `${TSPACE}⏩ PostgreSQL`,
            collapsed: true,
            items: []
          },
          {
            text: `${TSPACE}⏩ Nginx`,
            collapsed: true,
            items: [
              { text: `${TSPACE}基础知识`, link: '/posts/middleware/nginx/index' },
            ]
          },
          {
            text: `${TSPACE}⏩ Kafka`,
            collapsed: true,
            link: '/posts/middleware/kafka/index',
            items: [],
          },
          {
            text: `${TSPACE}⏩ Rabbitmq`,
            collapsed: true,
            link: '/posts/middleware/rabbitmq/index',
            items: [],
          },
          {
            text: `${TSPACE}⏩ Haproxy`,
            collapsed: true,
            link: '/posts/middleware/haproxy/index',
            items: []
          },
        ]
      },
      {
        text: '👓 杂七杂八',
        collapsed: true,
        link: '/posts/other/index',
        items: [
          { text: `${TSPACE}⏩ 一些工具`, link: '/posts/other/tool' },
          { text: `${TSPACE}⏩ 生活常识`, link: '/posts/other/life/index' },
          { text: `${TSPACE}⏩ 书籍推荐`, link: '/posts/other/book/index' },
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
