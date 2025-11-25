##### ssh服务端配置

/etc/ssh/sshd_config - SSH 服务器配置  
作用：配置 SSH 服务器（sshd）的行为，影响所有连接到该服务器的客户端  
一般在 /etc/ssh/sshd_config.d 目录下进行配置  


- **配置选项**
```bash
# 监听设置
Port 22                            # SSH服务监听端口（可多个Port 22 Port 2222）
ListenAddress 0.0.0.0              # 监听IP地址（0.0.0.0表示所有接口）
AddressFamily any                  # 地址族：any, inet(IPv4), inet6(IPv6)
Protocol 2                         # SSH协议版本（1或2，建议只用2）

# 网络设置
UseDNS yes                         # 是否进行DNS反向解析
ServerKeyBits 1024                 # 服务器密钥位数
KeyRegenerationInterval 3600       # 密钥重新生成间隔（秒）
SyslogFacility AUTH                # 日志设施
LogLevel INFO                      # 日志级别：QUIET, FATAL, ERROR, INFO, VERBOSE, DEBUG

# 登录认证
PermitRootLogin yes                # 允许root登录：yes, no, prohibit-password, without-password
StrictModes yes                    # 严格检查用户文件权限
MaxAuthTries 3                     # 最大认证尝试次数
MaxSessions 10                     # 每个连接最大会话数
LoginGraceTime 120                 # 登录宽限时间（秒）
PermitEmptyPasswords no            # 是否允许空密码
PasswordAuthentication yes         # 密码认证
ChallengeResponseAuthentication no # 挑战应答认证
KerberosAuthentication no          # Kerberos认证
GSSAPIAuthentication no            # GSSAPI认证
UsePAM yes                         # 使用PAM认证

# 公钥认证
PubkeyAuthentication yes           # 公钥认证
AuthorizedKeysFile .ssh/authorized_keys # 公钥文件路径
HostbasedAuthentication no         # 基于主机的认证
IgnoreUserKnownHosts no            # 忽略用户known_hosts
IgnoreRhosts yes                   # 忽略rhosts文件

# 用户限制
AllowUsers user1 user2@host        # 允许的用户列表
DenyUsers user3 user4              # 拒绝的用户列表
AllowGroups group1 group2          # 允许的用户组
DenyGroups group3 group4           # 拒绝的用户组

# 用户环境
PermitUserEnvironment no           # 是否允许用户环境
AcceptEnv LANG LC_*                # 接受的环境变量
PrintMotd yes                      # 显示MOTD信息
PrintLastLog yes                   # 显示最后登录信息
XAuthLocation /usr/bin/xauth       # xauth程序路径

# 会话管理
ClientAliveInterval 0              # 客户端活跃间隔（秒）
ClientAliveCountMax 3              # 客户端活跃检查次数
UseLogin no                        # 是否使用传统login

# 子系统
Subsystem sftp /usr/lib/openssh/sftp-server # SFTP子系统

# 转发功能
AllowTcpForwarding yes             # TCP端口转发
GatewayPorts no                    # 网关端口
X11Forwarding yes                  # X11转发
X11DisplayOffset 10                # X11显示偏移
X11UseLocalhost yes                # X11使用本地主机

# 压缩和性能
Compression yes                    # 压缩传输
UsePrivilegeSeparation yes         # 权限分离
TCPKeepAlive yes                   # TCP保持连接

# PAM相关
UsePAM yes                         # 使用PAM
PAMAuthenticationViaKBDInt yes     # 通过键盘交互进行PAM认证

# 密钥相关
HostKey /etc/ssh/ssh_host_rsa_key          # RSA主机密钥
HostKey /etc/ssh/ssh_host_dsa_key          # DSA主机密钥  
HostKey /etc/ssh/ssh_host_ecdsa_key        # ECDSA主机密钥
HostKey /etc/ssh/ssh_host_ed25519_key      # Ed25519主机密钥

# 加密算法
Ciphers aes256-ctr,aes192-ctr,aes128-ctr   # 加密算法
MACs hmac-sha2-512,hmac-sha2-256           # 消息认证码
KexAlgorithms diffie-hellman-group-exchange-sha256 # 密钥交换算法
```

- **安全加固配置示例**
```bash
# 引入自定义配置
Include /etc/ssh/sshd_config.d/*.conf

# 基本安全设置
Port 2222
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# 访问限制
AllowUsers alice bob@192.168.1.0/24
DenyUsers mallory
AllowGroups ssh-users

# 会话安全
MaxAuthTries 2
MaxSessions 5
LoginGraceTime 60
ClientAliveInterval 300
ClientAliveCountMax 2

# 加密算法配置
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,umac-128-etm@openssh.com
KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp521,ecdh-sha2-nistp384,ecdh-sha2-nistp256,diffie-hellman-group-exchange-sha256

# 其他安全设置
UseDNS no
StrictModes yes
IgnoreRhosts yes
HostbasedAuthentication no
PermitEmptyPasswords no
PrintLastLog yes
```

- **配置文件测试检查**
> sudo sshd -t