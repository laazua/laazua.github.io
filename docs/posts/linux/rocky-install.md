##### Rocky10系统安装


* **分区(根据实际情况调整)**
```bash
挂载点: /boot        大小: 800M
挂载点: /boot/efi    大小: 260M
挂载点: swap         大小: 2000M
挂载点: /            大小: 剩余所有
```

* **创建一个普通用户**
```bash
# 创建用户: zhangsan
groupadd zhangsan
useradd -m -g zhangsan zhangsan

# 设置 sudo 权限
sudo cat >/etc/sudoers.d/zhangsan <<EOF
zhangsan  ALL=(ALL)  NOPASSWD: ALL
EOF
```

* **静态ip配置**
    - cat /etc/NetworkManager/system-connections/ens192.nmconnection
    ```bash
    [connection]
    id=ens192
    uuid=9dfb6146-1f4d-395e-877d-b97db47d36e9
    type=ethernet
    autoconnect-priority=-999
    interface-name=ens192
    timestamp=1747526432

    [ethernet]

    [ipv4]
    method=manual
    # address1=ip/网段,网关(这里没有设置网关,默认)
    address1=192.168.165.83/24
    dns=8.8.8.8;114.114.114.144

    [ipv6]
    addr-gen-mode=eui64
    method=auto

    [proxy]
    ```
    - 或者用 nmcli 命令操作
    ```bash
    # 查看网络接口设备
    sudo nmcli d status
    # 配置静态ip
    sudo nmcli c mod ens192 ipv4.addresses 192.168.165.82/24 ipv4.gateway 192.168.165.254 ipv4.dns "8.8.8.8 114.114.114.114" ipv4.method manual
    # 重启网卡
    sudo nmcli c down ens192 && sudo nmcli c up ens192
    ```
    - 重启网络: sudo systemctl restart NetworkManager

* **更新系统软件源**
    - [参考阿里云替换源](https://developer.aliyun.com/mirror/)
    ```bash
    # 替换源并备份
    sed -e 's|^mirrorlist=|#mirrorlist=|g' -e 's|^#baseurl=http://dl.rockylinux.org/$contentdir|baseurl=https://mirrors.aliyun.com/rockylinux|g' -i.bak /etc/yum.repos.d/rocky-*.repo
    # 建立元数据缓存
    dnf makecache
    ```

* **禁用SELinux**
```bash
# 临时关闭
setenforce 0
# 永久关闭
sed -i 's|SELINUX=enforcing|SELINUX=disable|g' /etc/selinux/config
# 内核参数中添加selinux=0标记
grubby --update-kernel ALL --args selinux=0
# 查看标记
grubby --info DEFAULT
# 回滚内核层禁用selinux操作
grubby --update-kernel ALL --remove-args selinux=0
```

* **防火墙设置**
    - firewalld
    ```bash
    # 关闭
    systemctl stop firewalld
    # 永久移除
    systemctl disable firewalld
    ```
    - iptables-services
    ```bash
    # 安装
    yum install iptables-nft-services -y
    systemctl start iptables

    # 情况默认表规则
    iptables -F
    # 查看默认表规则
    iptables -nL
    # 保存持久化到文件
    iptables-save 
    ```

* **设置系统时区**
```bash
timedatectl set-timezone Asia/Shanghai
```