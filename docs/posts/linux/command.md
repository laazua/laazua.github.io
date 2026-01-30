---
title: Linux命令
prev:
    text: Linux系统
    link: ./index
next:
    text: Bash脚本语法
    link: ./bash.md
---

##### 命令用法

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