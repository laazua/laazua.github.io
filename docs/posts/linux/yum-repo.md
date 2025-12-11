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