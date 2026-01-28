### 域名代理

- 说明
<pre>
  访问 aaaaa.com/a/b/c 浏览器地址显示 aaaaa.com/a/b/c;
  但是实际是 bbbbb.com 提供的服务;
  与跳转不同, 跳转配置后浏览器地址会显示 bbbbb.com/a/b/c;
  
  作用: 对用户隐藏了具体的服务域名
</pre>

- 配置
```conf
server {
    listen 80;
    server_name aaaaa.com
    location /a/b/c {
        #proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://bbbbb.com/a/b/c$is_args$args;
        proxy_next_upstream http_502 http_504 error timeout invalid_header;
        proxy_redirect     off;
    }
}
```