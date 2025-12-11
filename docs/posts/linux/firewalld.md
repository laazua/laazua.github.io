##### firewalld

- **白名单**
```bash
### 默认拒绝所有，只允许明确的

# 默认策略：拒绝所有入站，只允许出站
sudo firewall-cmd --set-default-zone=drop  # 或 block

# 然后明确允许需要的服务
sudo firewall-cmd --add-service=http
sudo firewall-cmd --add-service=https
sudo firewall-cmd --add-service=ssh

# 或者使用富规则允许特定IP
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" accept'

# ✅ 更安全：未知的连接默认被拒绝
# ✅ 需要明确配置每个允许的服务/IP
# ✅ 适合服务器、生产环境
```
- **黑名单**
```bash
### 默认允许所有，只拒绝明确的

# 默认策略：允许所有入站
sudo firewall-cmd --set-default-zone=public  # 默认允许

# 然后明确拒绝不需要的或恶意的
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="10.0.0.5" reject'
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="203.0.113.0/24" drop'

# 或者禁用某些端口
sudo firewall-cmd --remove-port=135-139/tcp

```
- **zone**
```bash
firewall-cmd --get-zones
## 网络接口和服务分配到不同的zone上,会对应不同的默认规则和策略
```

| zone   |     默认规则     |                         适用场景                             |
|:------:|:---------------:|:------------------------------------------------------------:|
| drop   | 丢弃所有传入流量 | 最高安全级别，适用于不信任的网络（如公共 Wi-Fi），丢弃所有未经请求的入站流量。|
| block  | 拒绝所有传入流量（返回 ICMP 拒绝消息）| 类似 drop，但会通知发送方连接被拒绝。适用于需要明确拒绝流量的场景。|
| public | 仅允许显式放行的传入流量 | 默认 zone，适用于公共网络（如咖啡馆、机场），仅开放必要的服务（如 HTTP/SSH）。|
| external | 仅允许指定传入流量，默认启用伪装（NAT）| 用于外部网络（如路由器防火墙），保护内部网络，通常允许 SSH 和伪装（IPv4 地址转换）。|
| internal | 允许大部分传入流量（信任内部用户）| 用于内部网络（如企业内网），允许 SSH、DHCP、Samba 等服务，信任内部设备。|
| dmz | 仅允许指定传入流量 | 用于隔离区（如暴露给外网的服务器），限制流量到特定服务（如 Web 服务器）。|
| work | 允许部分传入流量（信任工作环境）| 适用于工作场所，允许 SSH、DHCP、文件共享等，但限制高危服务。|
| home | 允许较多传入流量（信任家庭网络）| 家庭网络环境，允许打印机共享、DLNA、SSH 等，比 internal 更宽松。|
| trusted | 允许所有流量（完全信任）| 最高信任级别（如 VPN 或内部测试网络），无任何限制，慎用。|
---


- **说明**
1. 主机上的每个网络接口(ip a)只能绑定到一个zone上
2. 匹配顺序：先检查 来源 IP 绑定的 zone，再检查 接口 绑定的 zone, 最后回退到 默认 zone（通常是 public）
3. 所有 zone 默认允许出站流量，但入站流量根据 zone 规则控制
---


- **rich-rule**
1. 基本语法
```text 
rule [family="ipv4|ipv6"] [source address="ip/MASK" mac="MAC地址"|destination address="IP/MASK"] [service name="服务名"|port port="端口号"|protocol value="协议名"] [log prefix="前缀文本" level="info"] [audit] [action] [other_options]
```
2. 示例：
```bash
## 允许特定IP访问指定服务
firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.1.100" service name="ssh" accept'  

## 拒绝某网段的 ICMP 并记录日志
firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.2.0/24" protocol value="icmp" log prefix="ICMP BLOCK: " level="warning" reject'  

## 限速http请求
firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" port port="80" protocol="tcp" limit value="10/minute" accept'  

## 端口转发(公网 8080 → 内网 80)
firewall-cmd --zone=external --add-rich-rule='rule family="ipv4" forward-port port="8080" protocol="tcp" to-port="80" to-addr="192.168.1.2"'  

## 临时生效指定时长(30秒)
firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="10.0.0.5" service name="http" accept' --timeout=30  

## 端口转发
## echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
## sudo sysctl -p
## 网卡接口绑定
##   外部接口（eth0）绑定到 external zone（默认启用伪装 masquerade）。
firewall-cmd --zone=external --change-interface=eth0 --permanent

##   内部接口（如 eth1）绑定到 internal zone。
firewall-cmd --zone=internal --change-interface=eth1 --permanent

## 使用 forward-port 参数实现 DNAT：
sudo firewall-cmd --zone=external --add-rich-rule='rule family="ipv4" forward-port port="8080" protocol="tcp" to-port="80" to-addr="192.168.1.100"' --permanent

## 允许 192.168.1.0/24 通过防火墙访问外网，并启用 SNAT
firewall-cmd --zone=external --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" masquerade' --permanent
```
---

- **IPSET示例**

    - 主要字段

    | 字段          | 说明                           |
    | ----------- | ---------------------------- |
    | **name**    | ipset 名称，用于引用                |
    | **type**    | ipset 类型，决定存储结构和匹配方式         |
    | **options** | 创建时的额外参数（如最大条目、超时、范围等）       |
    | **entries** | ipset 内部存储的 IP / 网段 / MAC 条目 |

    - firewalld 支持的 ipset 类型及用途

    | type                 | 用途                | 适用 option                          |
    | -------------------- | ----------------- | ---------------------------------- |
    | **hash:ip**          | 单个 IP             | maxelem, hashsize, timeout, family |
    | **hash:net**         | 网段 (CIDR)         | maxelem, hashsize, timeout, family |
    | **hash:mac**         | MAC 地址            | maxelem, hashsize                  |
    | **hash:ip,port**     | IP + 端口组合         | maxelem, hashsize                  |
    | **hash:net,port**    | 网段 + 端口           | maxelem, hashsize                  |
    | **hash:ip,port,ip**  | 源 IP + 端口 + 目标 IP | maxelem, hashsize                  |
    | **hash:ip,port,net** | 源 IP + 端口 + 目标网段  | maxelem, hashsize                  |
    | **bitmap:ip**        | 连续 IP 范围          | range, maxelem                     |

    - options 只能在创建 ipset 时设置，多 option 用逗号分隔

    | Option              | 说明               | 适用类型              |
    | ------------------- | ---------------- | ----------------- |
    | maxelem=N           | 最大条目数            | hash 系列           |
    | hashsize=N          | 哈希表初始大小          | hash 系列           |
    | timeout=N           | 每条 entry 有效时间（秒） | hash:ip, hash:net |
    | family=inet / inet6 | IPv4 / IPv6      | hash:ip, hash:net |
    | range=IP1-IP2       | 连续 IP 范围         | bitmap:ip         |

    ```bash
    ##### firewalld ipset使用示例
    ## firewall-cmd --set-default-zone=drop
    # 1. 新建ipset
    IPSET_NAME=whitelist
    firewall-cmd --permanent --new-ipset=${IPSET_NAME} --type=hash:ip
    # 2. 查看ipset: IPSET_NAME
    firewall-cmd --permanent --info-ipset=${IPSET_NAME}
    # 3. 将指定ip加入: IPSET_NAME
    firewall-cmd --permanent --ipset=${IPSET_NAME} --add-entry=192.168.165.89
    # 4. 将指定ip段加入: IPSET_NAME
    firewall-cmd --permanent --ipset=${IPSET_NAME} --add-entry=192.168.165.0/24
    # 5. 指定端口放行 IPSET_NAME
    firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source ipset='whitelist' port protocol='tcp' port=8080 accept"

    # 6. 列出 rich rules
    firewall-cmd --permanent --list-rich-rules
    # 7. 从 IPSET_NAME 移除 指定ip
    firewall-cmd --permanent --ipset=${IPSET_NAME} --remove-entry=192.168.165.89
    # 8. 从 IPSET_NAME 移除 指定ip段
    firewall-cmd --permanent --ipset=${IPSET_NAME} --remove-entry=192.168.165.0/24
    # 9. 清空 IPSET_NAME
    firewall-cmd --permanent --ipset=${IPSET_NAME} --flush
    # 10. 删除 IPSET_NAME 
    firewall-cmd --permanent --delete-ipset=${IPSET_NAME}
    # 11. 列出存在的ipset
    firewall-cmd --permanent --get-ipsets
    ```


- **特别说明**
1. 调试建议：先用 --timeout 测试临时规则，避免配置错误导致访问中断
```bash
firewall-cmd --zone=external --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" masquerade' --timeout 30
```
---


- **脚本示例**
```bash
#!/bin/bash

CMD="/usr/bin/firewall-cmd"
ZONE_NAME="tmpz"
INTERFACE="ens192"          # 替换为你的实际网卡名
WHITELIST_IPS=("192.168.1.100" "192.168.165.88")  # 你允许访问的 IP

# 创建自定义 zone（如果不存在）
if ! $CMD --get-zones | grep -qw "$ZONE_NAME"; then
    echo "创建 zone: $ZONE_NAME"
    $CMD --permanent --new-zone=$ZONE_NAME
fi

# 清空 zone 的所有现有规则（确保纯净）
echo "清空 zone: $ZONE_NAME 的所有规则"
RICH_RULES=$($CMD --permanent --list-rich-rules --zone $ZONE_NAME)
if [[ -n "$RICH_RULES" ]]; then
    echo "清除已有 rich-rules:"
    while IFS= read -r rule; do
        echo "删除规则: $rule"
        $CMD --permanent --zone=$ZONE_NAME --remove-rich-rule="$rule"
    done <<< "$RICH_RULES"
else
    echo "没有需要删除的 rich-rule"
fi
$CMD --permanent --zone=$ZONE_NAME --remove-interface=$INTERFACE

# 添加 rich-rule 白名单 IP
for ip in "${WHITELIST_IPS[@]}"; do
    echo "添加白名单 IP: $ip"
    $CMD --permanent --zone=$ZONE_NAME \
        --add-rich-rule="rule family='ipv4' source address='$ip' accept"
done

# 默认拒绝其他访问
echo "设置默认策略为拒绝"
$CMD --permanent --zone=$ZONE_NAME --set-target=DROP

# 绑定网卡到新 zone
echo "绑定网卡 $INTERFACE 到 zone $ZONE_NAME"
$CMD --permanent --zone=$ZONE_NAME --add-interface=$INTERFACE

# 应用更改
echo "重新加载 firewalld"
$CMD --reload

# 验证
echo "验证规则"
$CMD --zone=$ZONE_NAME --list-all
```
---


- **iptables示例**
```bash
#!/bin/bash
set -e

iptables -F
iptables -X

iptables -P INPUT DROP
iptables -P OUTPUT ACCEPT


iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

iptables -A INPUT -p tcp --dport 1122 -j ACCEPT
iptables -A INPUT -p tcp --dport 6666 -j ACCEPT
iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
iptables -A INPUT -p tcp --dport 8877 -j ACCEPT

iptables save
```
