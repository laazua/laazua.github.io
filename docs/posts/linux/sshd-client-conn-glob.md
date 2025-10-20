##### ssh客户端全局配置


/etc/ssh/ssh_config - SSH 客户端配置  
作用：配置 SSH 客户端的行为，影响所有用户使用 ssh 命令时的默认设置  
一般在 /etc/ssh/ssh_config.d 目录下进行配置  

- **配置选项**
```text
# 引入自定义配置
Include /etc/ssh/ssh_config.d/*.conf

# 主机配置
Host pattern                    # 主机匹配模式，支持通配符 * ?
HostName hostname              # 实际的主机名或IP地址
Port 22                        # 连接端口
User username                  # 登录用户名
AddressFamily any              # 地址族：any, inet(IPv4), inet6(IPv6)

# 认证方法
PreferredAuthentications publickey,password,keyboard-interactive # 认证方法优先级
PubkeyAuthentication yes       # 是否使用公钥认证
PasswordAuthentication yes     # 是否使用密码认证
ChallengeResponseAuthentication yes # 挑战应答认证
KbdInteractiveAuthentication yes # 键盘交互认证
GSSAPIAuthentication no        # GSSAPI认证

# 密钥管理
IdentityFile ~/.ssh/id_rsa     # 身份密钥文件路径（可多次指定）
IdentitiesOnly no              # 是否只使用指定的IdentityFile
CertificateFile ~/.ssh/id_rsa-cert.pub # 证书文件路径

# 主机密钥验证
StrictHostKeyChecking ask      # 严格主机密钥检查：yes, no, ask
UserKnownHostsFile ~/.ssh/known_hosts # 已知主机文件路径
GlobalKnownHostsFile /etc/ssh/ssh_known_hosts # 全局已知主机文件
CheckHostIP yes                # 检查已知主机文件中的IP地址
HashKnownHosts no              # 哈希已知主机文件
HostKeyAlias alias-name        # 主机密钥别名

# 连接管理
ConnectTimeout 0               # 连接超时时间（秒）
ConnectionAttempts 1           # 连接尝试次数
ServerAliveInterval 0          # 服务器活跃检查间隔（秒）
ServerAliveCountMax 3          # 服务器活跃检查次数
TCPKeepAlive yes               # TCP保持连接
ExitOnForwardFailure no        # 转发失败时是否退出

# 性能优化
Compression yes                # 是否压缩数据
CompressionLevel 6             # 压缩级别（1-9）
IPQoS lowdelay throughput      # IP服务质量
RekeyLimit 1G 1h              # 重新密钥限制

# 代理设置
ForwardAgent no                # SSH代理转发
ForwardX11 no                  # X11转发
ForwardX11Trusted no           # 可信X11转发
XAuthLocation /usr/bin/xauth  # xauth程序路径
# 代理设置
ProxyCommand ssh -W %h:%p gateway.example.com # 代理命令
ProxyJump user@jump-host       # 跳板机代理
ProxyUseFdpass no              # 代理使用文件描述符传递

# 绑定地址
BindAddress address            # 绑定本地地址
BindInterface interface        # 绑定网络接口

# 本地转发
LocalForward [bind_address:]port host:hostport # 本地端口转发
RemoteForward [bind_address:]port host:hostport # 远程端口转发
DynamicForward [bind_address:]port # 动态端口转发（SOCKS代理）

# 连接控制
ControlMaster auto             # 控制主连接：auto, autoask, yes, no
ControlPath ~/.ssh/master-%r@%h:%p # 控制套接字路径
ControlPersist 10m             # 控制连接保持时间

# 协议版本
Protocol 2                     # SSH协议版本

# 加密算法
Ciphers aes256-ctr,aes192-ctr,aes128-ctr # 加密算法列表
MACs hmac-sha2-512,hmac-sha2-256 # 消息认证码算法
HostKeyAlgorithms ssh-ed25519,ssh-rsa,ssh-dss # 主机密钥算法
KexAlgorithms diffie-hellman-group-exchange-sha256 # 密钥交换算法

# GSSAPI配置
GSSAPIDelegateCredentials no   # 委托GSSAPI凭据
GSSAPIKeyExchange no           # GSSAPI密钥交换
GSSAPIClientIdentity identity  # GSSAPI客户端身份
GSSAPIRenewalForcesRekey no    # GSSAPI续订强制重新密钥
GSSAPITrustDns no             # 信任DNS获取GSSAPI主体

# 杂项设置
SendEnv LANG LC_*              # 发送环境变量
SetEnv VAR=value               # 设置环境变量
Tunnel device                  # 隧道设备
TunnelPointToPoint no          # 点对点隧道
UseKeychain no                 # 使用钥匙链（macOS）
UseRoaming no                  # 使用漫游功能
VerifyHostKeyDNS no            # 通过DNS验证主机密钥
VisualHostKey no               # 可视化主机密钥
CanonicalDomains              # 规范域名
CanonicalizeFallbackLocal yes  # 规范化回退到本地
CanonicalizeHostname no        # 规范主机名
CanonicalizeMaxDots 1          # 规范最大点数
CanonicalizePermittedCNAMEs    # 允许的CNAME规范
```

- **客户端配置示例**
```text
# 全局默认配置
Host *
    # 基本设置
    Port 22
    AddressFamily any
    ConnectTimeout 30
    Protocol 2
    
    # 认证设置
    PreferredAuthentications publickey,password
    PubkeyAuthentication yes
    PasswordAuthentication yes
    StrictHostKeyChecking ask
    UserKnownHostsFile ~/.ssh/known_hosts
    
    # 性能优化
    Compression yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    
    # 安全设置
    ForwardAgent no
    ForwardX11 no
    IdentitiesOnly no
    
    # 加密算法
    Ciphers aes256-ctr,aes192-ctr,aes128-ctr
    MACs hmac-sha2-512,hmac-sha2-256

# 特定服务器配置
Host webserver
    HostName 192.168.1.100
    User admin
    Port 2222
    IdentityFile ~/.ssh/web_server_key
    IdentitiesOnly yes

# GitHub配置
Host github.com
    User git
    IdentityFile ~/.ssh/github_key
    IdentitiesOnly yes

# 通过跳板机连接
Host internal-*
    ProxyJump jumpuser@bastion.example.com:2222
    ServerAliveInterval 30
    ServerAliveCountMax 5

# 公司网络配置
Host *.company.com
    User corporate-user
    GSSAPIAuthentication yes
    GSSAPIDelegateCredentials yes

# 连接复用配置
Host frequently-used
    ControlMaster auto
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 1h
```

- **查看客户端主机配置项**
> ssh -G hostname  