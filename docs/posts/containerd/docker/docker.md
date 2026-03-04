---
title: 容器相关
prev:
    text: 网络相关
    link:  /posts/network/index
next:
    text: Docker 语法指令
    link: /posts/containerd/docker/base
---


### 常用命令

- **删除所有镜像**
> `sudo docker image prune -a`

- **删除所有停止的容器**
> `sudo docker container prune`

- **运行`compose.yaml`**
> `sudo docker compose up -d`
> `sudo docker compose stop`

- **运行上面的命令光标会消失,恢复**
> `echo -e '\033[?25h'`