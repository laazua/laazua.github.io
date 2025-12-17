import{_ as i,c as a,o as n,af as l}from"./chunks/framework.CpcvffoB.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/linux/sshd-client-conn.md","filePath":"posts/linux/sshd-client-conn.md"}'),h={name:"posts/linux/sshd-client-conn.md"};function p(k,s,t,e,F,r){return n(),a("div",null,[...s[0]||(s[0]=[l(`<h5 id="ssh客户端连接配置" tabindex="-1">ssh客户端连接配置 <a class="header-anchor" href="#ssh客户端连接配置" aria-label="Permalink to “ssh客户端连接配置”">​</a></h5><p>~/.ssh/config - SSH 用户客户端配置<br> 作用: 配置 SSH 客户端的连接参数，可以简化连接命令、管理多个 SSH 连接配置<br> 优先级高于 /etc/ssh/ssh_config</p><ul><li><strong>配置示例</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 主机配置 ######</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 匹配所有主机</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 匹配特定主机名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 使用通配符</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 别名配置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    HostName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> example.com</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> username</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ProxyCommand</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ssh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gateway-user@gateway.company.com</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -W</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> %h:%p</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 30</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    TCPKeepAlive</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 连接参数 ######</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    HostName</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168.1.100</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 实际主机名或IP</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    User</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> username</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 登录用户名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2222</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                 # SSH端口（默认22）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentityFile</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/id_rsa</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 私钥文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 认证相关 ######</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PreferredAuthentications</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publickey,password</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PubkeyAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    PasswordAuthentication</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> no</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IdentitiesOnly</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 只使用指定的IdentityFile</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 代理跳板 ######</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># SSH代理转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jumpserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    HostName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jump.example.com</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ForwardAgent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 代理转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ProxyJump</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> user@bastion</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 跳板机</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地端口转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tunnel</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    LocalForward</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 8080</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> localhost:80</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 连接控制 ######</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ConnectTimeout</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 30</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         # 连接超时时间</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 60</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 保持连接间隔</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveCountMax</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     # 保持连接次数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    TCPKeepAlive</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # TCP保持连接</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">###### 多路复用 ######</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> myserver</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlMaster</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> auto</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 启用连接复用</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPath</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/cm-%r@%h:%p</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPersist</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 10m</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 连接保持时间</span></span></code></pre></div><ul><li><strong>使用过的配置</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># cat ~/.ssh/config</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Host</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlMaster</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> auto</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPath</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/cm_socket/%r@%h:%p</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ControlPersist</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveInterval</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 60</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ServerAliveCountMax</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 99999</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    TCPKeepAlive</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 以下为网络优化参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    IPQoS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> throughput</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    Compression</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    ConnectTimeout</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span></code></pre></div>`,6)])])}const y=i(h,[["render",p]]);export{g as __pageData,y as default};
