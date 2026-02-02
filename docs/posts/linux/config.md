---
title: 一些系统相关配置
prev:
    text: OpenSSL加密解密
    link: /posts/linux/salt
next:
    text: firewalld简介
    link: /posts/linux/firewalld
---

##### 一些系统配置

- **history配置**
```sh
# 配置在: ~/.bashrc

# 保留历史记录命令条数
HISTFILESIZE=2000
# 历史命令输出格式
HISTTIMEFORMAT="%F %T "
```
---


- **crontab配置**
```bash
- **定时任务**
1. 配置目录: /etc/cron.d/
2. 配置任务: /etc/cron.d/filename
3. 配置格式: 参考文件 => /etc/crontab
4. 配置示例: * * * * * zhangsan echo 'hello world'
5. 执行的日志查询: sudo journalctl -u cron -S '2025-08-20 14:00:00' -U '2025-08-20 14:25:00' -g 'zhangsan'
```

- **系统用户相关**
```bash
####### 可以登录,系统管理 ########
# 创建组
sudo groupadd -g 1000 zhangsan
# 创建系统用户
sudo useradd -r -m -s /bin/bash zhangsan

# 创建系统用户并指定UID（推荐）
sudo useradd -r -m -s /bin/bash -u 1000 zhangsan

# 参数说明：
# -r：创建系统用户（UID < 1000）
# -m：创建家目录（默认在 /home/elastic）
# -s：指定shell
# -u：指定用户ID


######## 不可登录,服务使用 ########
sudo groupadd -g 995 elastic
sudo useradd -r -s /sbin/nologin -g 995 elastic

# 所有 elastic 相关的服务都与 elastic 组和用户绑定
```