##### V2ray

- **v2ray安装**
> 版本: V2Ray 5.38.0
> 从官网下载软件包: v2ray-linux-64.zip  
> 解压v2ray软件包: unzip v2ray-linux-64.zip -d ./v2ray && mv v2ray /etc/  
> [使用脚本生成配置](./v2ray-conf.md)  


- **服务端配置**
> 创建配置目录 server/ : mkdir /etc/v2ray/server  
> log字段配置: [server/log.json](v2ray-log.md)  
> api字段配置: [server/api.json](v2ray-api.md)  
> dns字段配置: [server/dns.json](v2ray-dns.md)  
> inbounds字段配置: [server/inbounds.json](v2ray-inbounds.md)  
> outbounds字段配置: [server/outbounds.json](v2ray-outbounds.md)  
> routing字段配置: [server/routing.json](v2ray-routing.md)  


- **linux客户端配置**
> 创建配置目录 client/ : mkdir /etc/v2ray/client  
> inbounds字段配置: [client/inbounds.json](v2ray-client-inbounds.md)  
> outbounds字段配置: [client/outbounds.json](v2ray-client-outbounds.md)  
> linux系统如果需要使用v2ray代理服务,则需要配置http_proxy和https_proxy环境变量  

- **windows客户端配置**
> 下载[v2rayN](https://github.com/2dust/v2rayN)进行相应服务端配置即可  

- **检查配置并运行**
> 检查配置语法: v2ray test -d configs  
> 运行v2ray服务: v2ray run -d configs  

- **[关于v2ray具体配置参考这里](https://www.v2fly.org/)**