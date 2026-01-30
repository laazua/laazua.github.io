---
title: 给 dnf/yum 源设置代理
prev:
    text: Git仓库操作
    link: ./git
next:
    text: monit 监控工具
    link: https://mmonit.com/
---

##### 给源设置代理

- **RockyLinux为例**
```bash
# cat /etc/yum.repos.d/goreleaser.repo
[goreleaser]
name=GoReleaser
baseurl=https://repo.goreleaser.com/yum/
enabled=1
gpgcheck=0

# 代理地址配置
proxy=http://192.168.165.89:8080
```