import{_ as s,o as n,c as e,ai as p}from"./chunks/framework.rV0OLpih.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/middleware/nginx/domain-proxy.md","filePath":"posts/middleware/nginx/domain-proxy.md"}'),r={name:"posts/middleware/nginx/domain-proxy.md"};function i(o,a,t,l,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h3 id="域名代理" tabindex="-1">域名代理 <a class="header-anchor" href="#域名代理" aria-label="Permalink to “域名代理”">​</a></h3><ul><li>说明</li></ul><pre>  访问 aaaaa.com/a/b/c 浏览器地址显示 aaaaa.com/a/b/c;
  但是实际是 bbbbb.com 提供的服务;
  与跳转不同, 跳转配置后浏览器地址会显示 bbbbb.com/a/b/c;
  
  作用: 对用户隐藏了具体的服务域名
</pre><ul><li>配置</li></ul><div class="language-conf"><button title="Copy Code" class="copy"></button><span class="lang">conf</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    listen 80;</span></span>
<span class="line"><span>    server_name aaaaa.com</span></span>
<span class="line"><span>    location /a/b/c {</span></span>
<span class="line"><span>        #proxy_set_header Host $host;</span></span>
<span class="line"><span>        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span>        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>        proxy_set_header X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span>        proxy_pass http://bbbbb.com/a/b/c$is_args$args;</span></span>
<span class="line"><span>        proxy_next_upstream http_502 http_504 error timeout invalid_header;</span></span>
<span class="line"><span>        proxy_redirect     off;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,5)])])}const h=s(r,[["render",i]]);export{b as __pageData,h as default};
