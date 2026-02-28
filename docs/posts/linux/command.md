---
title: Linux命令
prev:
    text: Linux系统
    link: /posts/linux/linux
next:
    text: Bash脚本语法
    link: /posts/linux/bash
---

##### 命令用法

- **su&&sudo**
```bash
#### su 切换用户身份

# 切换到 root 用户，但不改变当前环境变量（PATH 等仍可能是原用户的）
su

# 切换到 root 用户，并模拟登录（推荐使用，会加载 root 用户的 .profile 等）
su -

# 切换到指定用户（如 zhangsan）
su - zhangsan

# 以其他用户身份执行一条命令（不进入交互 shell）
su -c "systemctl restart nginx" zhangsan


#### sudo 让用户临时以root身份进行操作

# 以 root 权限执行单条命令（最常用）
sudo systemctl restart nginx

# 以指定用户身份执行命令
sudo -u zhangsan whoami   # 输出 zhangsan


#### 给用户添加附加组
# 指定GID
sudo groupadd -g 3001 devops
# 创建系统组,通常用于服务或守护进程: sudo groupadd -r nginx

# 给用户附加组: devops
sudo usermod -aG devops zhangsan

# 查看用户的所属组: id zhangsan 或者groups zhangsan

# 移除用户: zhangsan 的附加组
sudo gpasswd -d zhangsan devops
```

- **getent**
```bash
# 查询Linux系统数据库条目信息
# 用法: getent database key
# 查看可用的database: getent --help
```

- **rsync**
```bash
rsync -av --exclude-from='exclude.txt' srcDir destDir
# 将 srcDir 路径中的文件同步到 destDir; 同步过程中排除exclude.txt中列出的文件或目录
```

- **logger**
```bash
# 将日志写入系统 rsyslog/syslogd服务
logger -t TESTLABLE "这是一条测试日志"

# RHEL/CentOS rsyslog/syslogd 将上面日志写入 /var/log/messages
# Ubuntu/Debian rsyslog/syslogd 将上面日志写入 /var/log/syslog

# 自定义写入文件
sudo tee /etc/rsyslog.d/99-custom.conf > /dev/null << 'EOF'
# 自定义日志规则模板
# 语法：:属性, 操作, "值" 日志文件路径

# 按标签
:syslogtag, contains, "APP1" /var/log/app1/app.log
:syslogtag, contains, "APP2" /var/log/app2/app.log

# 按优先级
*.err /var/log/errors.log
*.warning /var/log/warnings.log

# 按facility
local0.* /var/log/local0.log
local1.* /var/log/local1.log
EOF
systemctl restart  rsyslog

# 测试: logger -t APP1 "app1: 这是一条测试日志"
# 测试: logger -t APP2 "app2: 这是一条测试日志"
```