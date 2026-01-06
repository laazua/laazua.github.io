import{_ as n,c as a,o as e,af as l}from"./chunks/framework.CpcvffoB.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/tools/jenkins-sharedlib.md","filePath":"posts/tools/jenkins-sharedlib.md"}'),i={name:"posts/tools/jenkins-sharedlib.md"};function p(t,s,r,o,c,h){return e(),a("div",null,[...s[0]||(s[0]=[l(`<h5 id="共享库" tabindex="-1">共享库 <a class="header-anchor" href="#共享库" aria-label="Permalink to “共享库”">​</a></h5><ul><li><strong><a href="https://github.com/laazua/sharedlib" target="_blank" rel="noreferrer">代码结构</a></strong></li></ul><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>sharedlib/</span></span>
<span class="line"><span>├── entrypoint                           # 流水线入口文件目录</span></span>
<span class="line"><span>│   └── show.jenkinsfile</span></span>
<span class="line"><span>├── README.md</span></span>
<span class="line"><span>├── resources                            # 配置以及shell和python脚本目录</span></span>
<span class="line"><span>│   ├── config.yaml</span></span>
<span class="line"><span>│   ├── scripts</span></span>
<span class="line"><span>│   │   ├── build.sh</span></span>
<span class="line"><span>│   │   └── request.py</span></span>
<span class="line"><span>│   └── show.properties</span></span>
<span class="line"><span>├── src                                  # 共享库源码目录,可以复用的代码逻辑</span></span>
<span class="line"><span>│   └── com</span></span>
<span class="line"><span>│       └── laazua</span></span>
<span class="line"><span>│           └── lib</span></span>
<span class="line"><span>│               └── Properties.groovy</span></span>
<span class="line"><span>└── vars                                 # 全局变量与步骤（无需类即可直接被 Pipeline 调用）</span></span>
<span class="line"><span>    └── LoadPipeline.groovy</span></span></code></pre></div><ul><li><p><strong>所需插件</strong></p><ul><li>gitee</li><li>Pipeline</li></ul></li><li><p><strong>系统配置</strong></p><ul><li><a href="https://www.jenkins.io/zh/doc/book/pipeline/shared-libraries/" target="_blank" rel="noreferrer">全局共享库配置</a></li><li>配置共享库认证密钥,用于拉取共享库代码</li><li>安装jenkins服务的主机要安装git</li></ul></li><li><p><strong>仓库分支</strong></p><ul><li>共享库的仓库代码需要一个分支(如： test)</li><li>git switch -c BranchName</li><li>git push --set-upstream origin BranchName</li></ul></li></ul>`,4)])])}const u=n(i,[["render",p]]);export{g as __pageData,u as default};
