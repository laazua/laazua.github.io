import{_ as a,o as i,c as n,ai as l}from"./chunks/framework.rV0OLpih.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{"prev":false,"next":false},"headers":[],"relativePath":"posts/linux/ssh-forward.md","filePath":"posts/linux/ssh-forward.md"}'),p={name:"posts/linux/ssh-forward.md"};function t(e,s,h,k,r,d){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h3 id="ssh-流量转发" tabindex="-1">SSH 流量转发 <a class="header-anchor" href="#ssh-流量转发" aria-label="Permalink to “SSH 流量转发”">​</a></h3><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-3" id="tab-4" checked><label data-title="本地端口转发" for="tab-4">本地端口转发</label><input type="radio" name="group-3" id="tab-5"><label data-title="远程端口转发" for="tab-5">远程端口转发</label><input type="radio" name="group-3" id="tab-6"><label data-title="动态端口转发" for="tab-6">动态端口转发</label><input type="radio" name="group-3" id="tab-7"><label data-title="堡垒机跳转" for="tab-7">堡垒机跳转</label><input type="radio" name="group-3" id="tab-8"><label data-title="堡垒机跳转配置" for="tab-8">堡垒机跳转配置</label></div><div class="blocks"><div class="language-bash active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地主机执行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 将localhost:8088服务通过sshd服务在本地开启8077端口进行转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fN</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -L</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 8077:localhost:8088</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168.165.88</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># -f 后台运行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># -N 不转发命令</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># -L 指定本地转发端口</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># localhost:8088 需要被代理的服务(这里是与sshd服务在同一个主机的服务)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 192.168.165.88 SSH服务主机(与localhost:8088同主机)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 目标：通过 SSH 服务器访问它内网里的一个 Web 服务（假设该 Web 服务只监听在 127.0.0.1 或者内网IP，无法直接外网访问</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 访问示例: 192.168.165.88:8077</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地主机执行</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 将localhost:8088服务通过sshd服务在远程开启8077端口进行转发</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fNg</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 8077:localhost:8088</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168.165.89</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># -R 指定远程主机开启转发端口(ssh服务上)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># -g 监听在0.0.0.0:8077(不指定,监听在127.0.0.1:8077)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># localhost:8088 就是当前执行命令的服务器上所开启的服务</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 192.168.165.88 SSH服务主机</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 说明ssh服务需要开启(GatewayPorts yes)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 目标：将你本地电脑运行的一个临时服务，暴露到公网 SSH 服务器上，让其他人访问</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 访问示例: 192.168.165.89:8077</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 本地主机执行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fNg</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -D</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 8077</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168.165.88</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 梯子(socks)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fNg</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -D</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 8077</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p9527</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> root@82.29.129.162</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -J</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> user_jump@192.168.1.100:22022</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> user_target@10.0.0.5</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2222</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 多级跳转: ssh -J user@jump1,user@jump2 user@target</span></span></code></pre></div><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span># 配置: ~/.ssh/config</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 1. 先定义跳板机</span></span>
<span class="line"><span>Host my-jump</span></span>
<span class="line"><span>    HostName 192.168.1.100      # 跳板机的IP或域名</span></span>
<span class="line"><span>    User user_jump               # 跳板机的登录用户名</span></span>
<span class="line"><span>    Port 22                      # 跳板机的SSH端口，默认22可省略</span></span>
<span class="line"><span>    IdentityFile ~/.ssh/id_rsa_jump  # 连接跳板机的私钥（可选）</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 再定义目标机器，并指定通过哪个跳板机连接</span></span>
<span class="line"><span>Host target-server</span></span>
<span class="line"><span>    HostName 10.0.0.5            # 目标服务器的内网IP</span></span>
<span class="line"><span>    User user_target              # 目标服务器的登录用户名</span></span>
<span class="line"><span>    Port 22                       # 目标服务器的SSH端口</span></span>
<span class="line"><span>    IdentityFile ~/.ssh/id_rsa_target # 连接目标服务器的私钥（可选）</span></span>
<span class="line"><span>    ProxyJump my-jump              # ✨ 关键配置：指定通过 my-jump 这个主机进行跳转</span></span>
<span class="line"><span>    # 假设你的SOCKS5代理在本地 1080 端口; 代理跳转</span></span>
<span class="line"><span>    ProxyCommand connect -S 127.0.0.1:1080 %h %p  # sudo apt-get install connect-proxy</span></span></code></pre></div></div></div>`,2)])])}const o=a(p,[["render",t]]);export{g as __pageData,o as default};
