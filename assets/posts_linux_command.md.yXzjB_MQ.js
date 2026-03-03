import{_ as i,o as a,c as n,ai as l}from"./chunks/framework.rV0OLpih.js";const F=JSON.parse('{"title":"Linux命令","description":"","frontmatter":{"title":"Linux命令","prev":{"text":"Linux系统","link":"/posts/linux/linux"},"next":{"text":"Bash脚本语法","link":"/posts/linux/bash"}},"headers":[],"relativePath":"posts/linux/command.md","filePath":"posts/linux/command.md"}'),p={name:"posts/linux/command.md"};function t(h,s,k,e,r,g){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h5 id="命令用法" tabindex="-1">命令用法 <a class="header-anchor" href="#命令用法" aria-label="Permalink to “命令用法”">​</a></h5><ul><li><strong>su&amp;&amp;sudo</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#### su 切换用户身份</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换到 root 用户，但不改变当前环境变量（PATH 等仍可能是原用户的）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换到 root 用户，并模拟登录（推荐使用，会加载 root 用户的 .profile 等）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换到指定用户（如 zhangsan）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> zhangsan</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 以其他用户身份执行一条命令（不进入交互 shell）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;systemctl restart nginx&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> zhangsan</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#### sudo 让用户临时以root身份进行操作</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 以 root 权限执行单条命令（最常用）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 以指定用户身份执行命令</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> zhangsan</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whoami</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # 输出 zhangsan</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#### 给用户添加附加组</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 指定GID</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> groupadd</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3001</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devops</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 创建系统组,通常用于服务或守护进程: sudo groupadd -r nginx</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 给用户附加组: devops</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> usermod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -aG</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devops</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> zhangsan</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看用户的所属组: id zhangsan 或者groups zhangsan</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 移除用户: zhangsan 的附加组</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gpasswd</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> zhangsan</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> devops</span></span></code></pre></div><ul><li><strong>getent</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查询Linux系统数据库条目信息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 用法: getent database key</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看可用的database: getent --help</span></span></code></pre></div><ul><li><strong>rsync</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">rsync</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -av</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --exclude-from=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;exclude.txt&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> srcDir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> destDir</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 将 srcDir 路径中的文件同步到 destDir; 同步过程中排除exclude.txt中列出的文件或目录</span></span></code></pre></div><ul><li><strong>logger</strong></li></ul><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 将日志写入系统 rsyslog/syslogd服务</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">logger</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TESTLABLE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;这是一条测试日志&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># RHEL/CentOS rsyslog/syslogd 将上面日志写入 /var/log/messages</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Ubuntu/Debian rsyslog/syslogd 将上面日志写入 /var/log/syslog</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 自定义写入文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tee</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/rsyslog.d/99-custom.conf</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;EOF&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 自定义日志规则模板</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 语法：:属性, 操作, &quot;值&quot; 日志文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 按标签</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:syslogtag, contains, &quot;APP1&quot; /var/log/app1/app.log</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:syslogtag, contains, &quot;APP2&quot; /var/log/app2/app.log</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 按优先级</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">*.err /var/log/errors.log</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">*.warning /var/log/warnings.log</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 按facility</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">local0.* /var/log/local0.log</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">local1.* /var/log/local1.log</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  rsyslog</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 测试: logger -t APP1 &quot;app1: 这是一条测试日志&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 测试: logger -t APP2 &quot;app2: 这是一条测试日志&quot;</span></span></code></pre></div>`,9)])])}const o=i(p,[["render",t]]);export{F as __pageData,o as default};
