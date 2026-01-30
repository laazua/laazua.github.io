---
title: 内核参数调整示例
prev:
    text: sshd服务配置
    link: ./sshd
next:
    text: OpenSSL自签证书
    link: ./cert
---

##### Linux 内核调优示例

- **注意事项**
1. 修改前务必备份原文件: cp -a /etc/sysctl.d /etc/sysctl.d.bak.$(date +%F)
2. 检查语法和加载所有配置: sysctl --system

- **目录结构建议**
```shell
/etc/sysctl.d/
            ├── 10-kernel-base.conf        # 通用基础参数（所有类型通用）
            ├── 20-network-tuning.conf     # 网络栈调优
            ├── 30-memory-tuning.conf      # 内存与虚拟内存管理
            ├── 40-fs-io.conf              # 文件系统与IO参数
            ├── 50-security.conf           # 安全与内核保护机制
            └── 99-custom.conf             # 针对业务的特化参数
## 加载顺序由文件名前缀数字控制，后者可覆盖前者
```

- **应用服务器场景**
> 目标： 提升网络吞吐、并发连接、减少上下文切换，防止OOM
```shell
##### /etc/sysctl.d/10-kernel-base.conf
# 禁用 SysRq，避免误触发
kernel.sysrq = 0
# Panic 后自动重启（秒）
kernel.panic = 10
# 控制核心转储路径
kernel.core_pattern = /var/crash/core_%e.%p
# 提高进程文件句柄限制
fs.file-max = 2097152
# 提高最大 PID 数
kernel.pid_max = 4194304

##### /etc/sysctl.d/20-network-tuning.conf
# 基础网络缓冲区
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.core.netdev_max_backlog = 65536
# TCP 调优
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
# 提升端口可用范围
net.ipv4.ip_local_port_range = 10240 65535

##### /etc/sysctl.d/30-memory-tuning.conf
# 提高 I/O 效率
vm.vfs_cache_pressure = 50
# 优化 inode 回收
fs.inotify.max_user_instances = 8192
fs.inotify.max_user_watches = 524288
```

- **数据库服务器(mysql)**
> 目标： 提高 I/O 缓存能力，稳定内存行为，避免过度 swap
```shell
##### /etc/sysctl.d/20-network-tuning.conf
# 网络连接保持与吞吐
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 5
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 4096

##### /etc/sysctl.d/30-memory-tuning.conf
# 数据库推荐配置
vm.swappiness = 1
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
vm.dirty_expire_centisecs = 3000
vm.overcommit_memory = 2
vm.overcommit_ratio = 80

##### /etc/sysctl.d/40-fs-io.conf
# 强化页缓存
vm.vfs_cache_pressure = 10
# 调整 I/O 调度
fs.aio-max-nr = 1048576
fs.file-max = 2097152
```

- **缓存服务器(redis)**
> 目标： 最大化内存性能、低延迟、高并发 socket
```shell
##### /etc/sysctl.d/20-network-tuning.conf
# 优化 TCP 连接回收和端口重用
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 5
net.ipv4.tcp_max_tw_buckets = 5000
net.ipv4.tcp_max_syn_backlog = 16384
net.core.somaxconn = 65535

##### /etc/sysctl.d/30-memory-tuning.conf
# Redis 推荐参数
vm.overcommit_memory = 1
vm.swappiness = 1
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5
vm.vfs_cache_pressure = 50
```

- **网络网关(vpn|proxy)**
> 目标： 强化网络栈、连接追踪表、队列与转发性能
```shell
##### /etc/sysctl.d/20-network-tuning.conf
# 启用路由与转发
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1

# 增大 socket 缓冲
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216

# 提高并发连接队列
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.core.netdev_max_backlog = 32768

# NAT/Conntrack 优化
net.netfilter.nf_conntrack_max = 262144
net.netfilter.nf_conntrack_tcp_timeout_established = 600
net.netfilter.nf_conntrack_tcp_timeout_time_wait = 30

# 关闭 ICMP 重定向接受
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0

# 减少路由缓存抖动
net.ipv4.route.gc_timeout = 100

##### /etc/sysctl.d/50-security.conf
# 防止IP欺骗
net.ipv4.conf.all.rp_filter = 1
# 禁止IPv6隐式地址生成
net.ipv6.conf.all.accept_ra = 0
net.ipv6.conf.default.accept_ra = 0
# 关闭内核调试输出
kernel.printk = 3 4 1 3

```

- **监控并验证**

| 类别        | 指标命令                                             | 说明                  |
| --------- | ------------------------------------------------ | ------------------- |
| 网络延迟 / 吞吐 | `ss -s`, `sar -n TCP,DEV 1`                      | 检查 socket 状态、TCP 拥塞 |
| 内存        | `free -m`, `vmstat 1`, `cat /proc/meminfo`       | 验证 swap 使用情况        |
| 文件句柄      | `cat /proc/sys/fs/file-nr`                       | 查看使用率               |
| 连接跟踪      | `cat /proc/sys/net/netfilter/nf_conntrack_count` | NAT/防火墙跟踪状态         |
