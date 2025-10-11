##### OpenVpn

使用openVpn可以进行异地组网,让不同局域网中的主机通过虚拟专用网络进行通信.

- [openVpn配置脚本](openVpn-deploy.md)
- 可以使用unbound软件服务进行vpn虚拟网段中的域名解析,详情参考软件官网

- **安装openVpn**
> sudo dnf install -y epel-release && sudo dnf install -y openvpn  

- **启动openVpn**
> 服务端: openvpn --config /etc/openvpn/server/server.conf  
> 客户端: openvpn --config /etc/openvpn/client/client.conf  