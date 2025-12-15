import{_ as i,c as a,o as n,af as l}from"./chunks/framework.BRexEvY2.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/linux/sshd-client-conn-glob.md","filePath":"posts/linux/sshd-client-conn-glob.md"}'),h={name:"posts/linux/sshd-client-conn-glob.md"};function p(k,s,t,e,F,r){return n(),a("div",null,[...s[0]||(s[0]=[l(`<h5 id="ssh客户端全局配置" tabindex="-1">ssh客户端全局配置 <a class="header-anchor" href="#ssh客户端全局配置" aria-label="Permalink to “ssh客户端全局配置”">​</a></h5><p>/etc/ssh/ssh_config - SSH 客户端配置<br> 作用：配置 SSH 客户端的行为，影响所有用户使用 ssh 命令时的默认设置<br> 一般在 /etc/ssh/ssh_config.d 目录下进行配置</p><ul><li><strong>配置选项</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 引入自定义配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Include</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/ssh/ssh_config.d/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.conf</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 主机配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pattern</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                    # 主机匹配模式，支持通配符 * ?</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HostName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hostname</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 实际的主机名或IP地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 22</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                        # 连接端口</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> username</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                  # 登录用户名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">AddressFamily</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> any</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 地址族：any, inet(IPv4), inet6(IPv6)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 认证方法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PreferredAuthentications</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publickey,password,keyboard-interactive</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 认证方法优先级</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PubkeyAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # 是否使用公钥认证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PasswordAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     # 是否使用密码认证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ChallengeResponseAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 挑战应答认证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">KbdInteractiveAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 键盘交互认证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPIAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # GSSAPI认证</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 密钥管理</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IdentityFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/id_rsa</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     # 身份密钥文件路径（可多次指定）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IdentitiesOnly</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 是否只使用指定的IdentityFile</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CertificateFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/id_rsa-cert.pub</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 证书文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 主机密钥验证</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">StrictHostKeyChecking</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ask</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 严格主机密钥检查：yes, no, ask</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">UserKnownHostsFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/known_hosts</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 已知主机文件路径</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GlobalKnownHostsFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/ssh/ssh_known_hosts</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 全局已知主机文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CheckHostIP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                # 检查已知主机文件中的IP地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HashKnownHosts</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 哈希已知主机文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HostKeyAlias</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> alias-name</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 主机密钥别名</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 连接管理</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ConnectTimeout</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               # 连接超时时间（秒）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ConnectionAttempts</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # 连接尝试次数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 服务器活跃检查间隔（秒）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ServerAliveCountMax</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 服务器活跃检查次数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">TCPKeepAlive</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               # TCP保持连接</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ExitOnForwardFailure</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 转发失败时是否退出</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 性能优化</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Compression</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                # 是否压缩数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CompressionLevel</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 6</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 压缩级别（1-9）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IPQoS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> lowdelay</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> throughput</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # IP服务质量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RekeyLimit</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1G</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1h</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 重新密钥限制</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 代理设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ForwardAgent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                # SSH代理转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ForwardX11</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                  # X11转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ForwardX11Trusted</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # 可信X11转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">XAuthLocation</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/bin/xauth</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # xauth程序路径</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 代理设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ProxyCommand</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -W</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> %h:%p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gateway.example.com</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 代理命令</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ProxyJump</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> user@jump-host</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # 跳板机代理</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ProxyUseFdpass</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 代理使用文件描述符传递</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 绑定地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BindAddress</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> address</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">            # 绑定本地地址</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BindInterface</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> interface</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 绑定网络接口</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">LocalForward</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [bind_address:]port host:hostport </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地端口转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RemoteForward</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [bind_address:]port host:hostport </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 远程端口转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">DynamicForward</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [bind_address:]port </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 动态端口转发（SOCKS代理）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 连接控制</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ControlMaster</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> auto</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 控制主连接：auto, autoask, yes, no</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ControlPath</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/master-%r@%h:%p</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 控制套接字路径</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ControlPersist</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 10m</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 控制连接保持时间</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 协议版本</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Protocol</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                     # SSH协议版本</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 加密算法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Ciphers</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> aes256-ctr,aes192-ctr,aes128-ctr</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 加密算法列表</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">MACs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hmac-sha2-512,hmac-sha2-256</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 消息认证码算法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HostKeyAlgorithms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ssh-ed25519,ssh-rsa,ssh-dss</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 主机密钥算法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">KexAlgorithms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> diffie-hellman-group-exchange-sha256</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 密钥交换算法</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># GSSAPI配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPIDelegateCredentials</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # 委托GSSAPI凭据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPIKeyExchange</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # GSSAPI密钥交换</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPIClientIdentity</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> identity</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # GSSAPI客户端身份</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPIRenewalForcesRekey</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # GSSAPI续订强制重新密钥</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GSSAPITrustDns</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 信任DNS获取GSSAPI主体</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 杂项设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SendEnv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> LANG</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> LC_</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 发送环境变量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SetEnv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> VAR=value</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               # 设置环境变量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Tunnel</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> device</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                  # 隧道设备</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">TunnelPointToPoint</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 点对点隧道</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">UseKeychain</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                 # 使用钥匙链（macOS）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">UseRoaming</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                  # 使用漫游功能</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">VerifyHostKeyDNS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">            # 通过DNS验证主机密钥</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">VisualHostKey</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               # 可视化主机密钥</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CanonicalDomains</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 规范域名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CanonicalizeFallbackLocal</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 规范化回退到本地</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CanonicalizeHostname</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 规范主机名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CanonicalizeMaxDots</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 规范最大点数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CanonicalizePermittedCNAMEs</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 允许的CNAME规范</span></span></code></pre></div><ul><li><strong>客户端配置示例</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 全局默认配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 基本设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 22</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    AddressFamily</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> any</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ConnectTimeout</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 30</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Protocol</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 认证设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PreferredAuthentications</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publickey,password</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PubkeyAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PasswordAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    StrictHostKeyChecking</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ask</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    UserKnownHostsFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/known_hosts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 性能优化</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Compression</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 60</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveCountMax</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    TCPKeepAlive</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 安全设置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ForwardAgent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ForwardX11</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentitiesOnly</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 加密算法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Ciphers</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> aes256-ctr,aes192-ctr,aes128-ctr</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    MACs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hmac-sha2-512,hmac-sha2-256</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 特定服务器配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> webserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    HostName</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168.1.100</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> admin</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2222</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentityFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/web_server_key</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentitiesOnly</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># GitHub配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> github.com</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentityFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/github_key</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentitiesOnly</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 通过跳板机连接</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> internal-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ProxyJump</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jumpuser@bastion.example.com:2222</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 30</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveCountMax</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 公司网络配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.company.com</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> corporate-user</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    GSSAPIAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    GSSAPIDelegateCredentials</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 连接复用配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> frequently-used</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlMaster</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> auto</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPath</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/cm-%r@%h:%p</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPersist</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1h</span></span></code></pre></div><ul><li><strong>查看客户端主机配置项</strong></li></ul><blockquote><p>ssh -G hostname</p></blockquote>`,8)])])}const g=i(h,[["render",p]]);export{y as __pageData,g as default};
