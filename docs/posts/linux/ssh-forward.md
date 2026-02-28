---
title: SSH 流量转发
prev:
    text: SSH CA 通用账号登录
    link: ./ssh-ca
next:
    text: 内核参数调整示例
    link: ./kernel
---

### SSH 流量转发

::: code-group
```bash [本地端口转发]
# 本地主机执行
ssh -fN -L 8077:localhost:8088 192.168.165.88

# -f 后台运行
# -N 不转发命令
# -L 指定本地转发端口
# localhost:80888 可以是相对于SSH服务192.168.165.88的可访问服务(这里是于SSH服务在同一个主机的服务)
# 192.168.165.88 SSH服务主机

# 目标：通过 SSH 服务器访问它内网里的一个 Web 服务（假设该 Web 服务只监听在 127.0.0.1 或者内网IP，无法直接外网访问
```

```bash [远程端口转发]
# 本地主机执行
ssh -fNg -R 8077:localhost:8088 192.168.165.88

# -R 指定远程开启转发端口(ssh服务上)
# -g 监听在0.0.0.0:8077(不指定,监听在127.0.0.1:8077)
# localhost:8088 就是当前执行命令的服务器上所开启的服务
# 192.168.165.88 SSH服务主机

# 说明ssh服务需要开启(GatewayPorts yes)

# 目标：将你本地电脑运行的一个临时服务，暴露到公网 SSH 服务器上，让其他人访问
```

```bash [动态端口转发]
# 本地主机执行
ssh -fNg -D 8077 192.168.165.88

# 梯子(socks)
ssh -fNg -D 8077 -p9527 root@82.29.129.162
```

```bash [堡垒机跳转]
ssh -J user_jump@192.168.1.100:22022 user_target@10.0.0.5 -p 2222
# 多级跳转: ssh -J user@jump1,user@jump2 user@target
```

```conf [堡垒机跳转配置]
# 配置: ~/.ssh/config

# 1. 先定义跳板机
Host my-jump
    HostName 192.168.1.100      # 跳板机的IP或域名
    User user_jump               # 跳板机的登录用户名
    Port 22                      # 跳板机的SSH端口，默认22可省略
    IdentityFile ~/.ssh/id_rsa_jump  # 连接跳板机的私钥（可选）

# 2. 再定义目标机器，并指定通过哪个跳板机连接
Host target-server
    HostName 10.0.0.5            # 目标服务器的内网IP
    User user_target              # 目标服务器的登录用户名
    Port 22                       # 目标服务器的SSH端口
    IdentityFile ~/.ssh/id_rsa_target # 连接目标服务器的私钥（可选）
    ProxyJump my-jump              # ✨ 关键配置：指定通过 my-jump 这个主机进行跳转
    # 假设你的SOCKS5代理在本地 1080 端口; 代理跳转
    ProxyCommand connect -S 127.0.0.1:1080 %h %p  # sudo apt-get install connect-proxy
```
:::