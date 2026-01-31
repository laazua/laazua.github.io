---
title: ssh客户端连接配置
prev:
    text: ssh服务端配置
    link: ./ssh-server-conn
next:
    text: ssh客户全局端配置
    link: ./sshd-client-conn-glob
---


##### ssh客户端连接配置

~/.ssh/config - SSH 用户客户端配置  
作用: 配置 SSH 客户端的连接参数，可以简化连接命令、管理多个 SSH 连接配置  
优先级高于 /etc/ssh/ssh_config  


- **配置示例**

```bash
###### 主机配置 ######
# 匹配所有主机
Host *

# 匹配特定主机名
Host example.com

# 使用通配符
Host *.example.com

# 别名配置
Host myserver
    HostName example.com
    User username
    ProxyCommand ssh gateway-user@gateway.company.com -W %h:%p
    ServerAliveInterval 30
    TCPKeepAlive yes

###### 连接参数 ######
Host myserver
    HostName 192.168.1.100    # 实际主机名或IP
    User username             # 登录用户名
    Port 2222                 # SSH端口（默认22）
    IdentityFile ~/.ssh/id_rsa # 私钥文件路径

###### 认证相关 ######
Host myserver
    PreferredAuthentications publickey,password
    PubkeyAuthentication yes
    PasswordAuthentication no
    IdentitiesOnly yes        # 只使用指定的IdentityFile

###### 代理跳板 ######
# SSH代理转发
Host jumpserver
    HostName jump.example.com
    ForwardAgent yes          # 代理转发
    ProxyJump user@bastion    # 跳板机

# 本地端口转发
Host tunnel
    LocalForward 8080 localhost:80

###### 连接控制 ######
Host myserver
    ConnectTimeout 30         # 连接超时时间
    ServerAliveInterval 60    # 保持连接间隔
    ServerAliveCountMax 3     # 保持连接次数
    TCPKeepAlive yes          # TCP保持连接

###### 多路复用 ######
Host myserver
    ControlMaster auto        # 启用连接复用
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m        # 连接保持时间
```

- **使用过的配置**
```bash
# cat ~/.ssh/config
Host *
    ControlMaster auto
    ControlPath ~/.ssh/cm_socket/%r@%h:%p
    ControlPersist yes
    ServerAliveInterval 60
    ServerAliveCountMax 99999
    TCPKeepAlive yes
    # 以下为网络优化参数
    IPQoS throughput
    Compression yes
    ConnectTimeout 0
```