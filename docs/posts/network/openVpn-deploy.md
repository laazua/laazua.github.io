##### openVpn 部署

> 阅读脚本,根据实际清空进行修改!!!
```shell
#!/bin/bash

##### 此脚本用于生成openvpn相关证书

## 说明：
##   1. 安装openvpn(根据具体操作系统而定:  
##        a. sudo yum install -y openvpn
##        b. sudo dnf install -y openvpn
##        c. sudo apt install -y openvpn
##   2. 安装easyrsa：
##        a. 先安装： sudo dnf install -y bc.x86_64
##        b. 下载: wget https://github.com/OpenVPN/easy-rsa/releases/download/v3.2.0/EasyRSA-3.2.0.tgz
##        c. 解压: tar -xf EasyRSA-3.2.0.tgz -C /usr/local

set -e

# 添加easyrsa工具到环境变量中
export PATH="$PATH:/usr/local/EasyRSA-3.2.0"

# 判断是否是root用户执行
if [[ "$EUID" -ne 0 ]];then
    echo "请使用root权限执行此脚本"
    exit 1
fi

# 检查easyrsa和openvpn是否安装
if ! easyrsa --version >/dev/null 2>&1; then
    echo "请先安装easyrsa,bc.x86_64,openssl工具"
    exit 1
fi

if ! openvpn --version >/dev/null 2>&1; then
    echo "请先安装openvpn软件包"
    exit 1
fi


VPN_HOME="/etc/openvpn"
CERT_PATH="${VPN_HOME}/easy-rsa"
VPN_NETWORK="10.8.0.0"
VPN_NETMASK="255.255.255.0"
SERVER_NAME="server"
SERVER_IP="82.29.129.162"

# 服务端配置
SRV_CONFIG="${VPN_HOME}/server"
# 客户端配置
CLT_CONFIG="${VPN_HOME}/client"

# vars相关参数设置(具体参考pki/vars.example)
RSA_REQ_COUNTRY="CN"
RSA_REQ_PROVINCE="Sichuan"
RSA_REQ_CITY="Chengdu"
RSA_REQ_ORG="Freedom Co"
RSA_REQ_EMAIL="zhangsan@vpn.net"
RSA_REQ_OU="Freedom"
RSA_NO_PASS=1
RSA_CERT_EXPIRE=3650
RSA_CRL_DAYS=3650

# 移除客户端用户
function removeClientUser() {
    local clt_username=$1
    cd $CERT_PATH && echo yes|easyrsa revoke $clt_username
    local result=$?
    if [[ $result -ne 0 ]];then
        echo "用户: $clt_username 不存在!!!"
        exit $result
    fi

    # 这里移除客户端后需要重启服务
    easyrsa gen-crl && 
    cp -r "${CERT_PATH}/pki/crl.pem" "${SRV_CONFIG}" &&
    sed -i 's|#crl-verify|crl-verify|' ${SRV_CONFIG}/server.conf

    # 移除用户的req文件
    find "${VPN_HOME}" -name "${clt_username:=abc}*" -exec rm -f {} \; &&
        return 0
}

# 开始进入脚本
if [[ "${#@}" -eq 2 && "$1" == "--rm" && "$2" != "" ]];then
    if removeClientUser $2; then
        echo "移除 $2 成功,请重启vpn服务."
    fi
    exit 0
fi

if [[ "${#@}" -ne 0 ]]; then
    cat <<EOF
如何使用此脚本:
  1. 直接运行: $0
  2. 移除客户端用户: $0 --rm NAME
EOF
    exit 0
fi

if [[ ! -d "${CERT_PATH}" ]];then
    mkdir -p "${CERT_PATH}"
fi

cd ${CERT_PATH}

# 初始化pki
if [[ ! -d "${CERT_PATH}/pki" ]];then
    easyrsa init-pki
fi

# 配置pki/vars参数
if [[ ! -f "${CERT_PATH}/pki/vars" ]];then
    cat <<EOF >"${CERT_PATH}/pki/vars"
set_var EASYRSA_REQ_COUNTRY  "${RSA_REQ_COUNTRY}"
set_var EASYRSA_REQ_PROVINCE "${RSA_REQ_PROVINCE}"
set_var EASYRSA_REQ_CITY     "${RSA_REQ_CITY}"
set_var EASYRSA_REQ_ORG	     "${RSA_REQ_ORG}"
set_var EASYRSA_REQ_EMAIL    "${RSA_REQ_EMAIL}"
set_var EASYRSA_REQ_OU	     "${RSA_REQ_OU}"
set_var EASYRSA_NO_PASS	     ${RSA_NO_PASS}
set_var EASYRSA_CERT_EXPIRE  ${RSA_CERT_EXPIRE}
set_var EASYRSA_CRL_DAYS     ${RSA_CRL_DAYS}
EOF
fi

# 创建ca证书
if [[ ! -f "${CERT_PATH}/pki/ca.crt" ]];then
    echo "\n\n"|easyrsa build-ca nopass
fi

# 生成dh.pem
if [[ ! -f "${CERT_PATH}/pki/dh.pem" ]];then
    easyrsa gen-dh nopass
fi 

# 生成服务端证书
if [[ ! -f "${CERT_PATH}/pki/reqs/${SERVER_NAME}.req" ]];then
    echo yes|easyrsa build-server-full "${SERVER_NAME}" nopass
fi

# 生成ta.key
if [[ ! -f "${CERT_PATH}/ta.key" ]];then
    openvpn --genkey secret ta.key
fi

# 生成服务端配置
if [[ ! -f "${SRV_CONFIG}/server.conf" ]];then
    [ ! -d "${VPN_HOME}/ccd" ] && mkdir -p "${VPN_HOME}/ccd"
    cat <<EOF >"${SRV_CONFIG}/server.conf"
port 11933
proto udp
dev tun0

# 优化重传参数
reneg-sec 3600
# 使用更大的缓冲区
sndbuf 393216
rcvbuf 393216
# 提高并发连接数,根据服务器能力调整
max-clients 2048

ca $CERT_PATH/pki/ca.crt
cert $CERT_PATH/pki/issued/$SERVER_NAME.crt
key $CERT_PATH/pki/private/$SERVER_NAME.key
dh $CERT_PATH/pki/dh.pem
tls-auth $CERT_PATH/ta.key 0
cipher AES-256-GCM
auth SHA256

server $VPN_NETWORK $VPN_NETMASK
ifconfig-pool-persist ${VPN_HOME}/ipp.txt
## 所有流量都走vpn
# push "redirect-gateway def1 bypass-dhcp"
## 只有在虚拟网段内的地址才走vpn
push "route $VPN_NETWORK $VPN_NETMASK"
push "dhcp-option DNS 8.8.8.8"
topology subnet

keepalive 10 120
persist-tun

status /var/log/openvpn/openvpn-status.log
log-append /var/log/openvpn/openvpn.log
verb 3
explicit-exit-notify 1

## 移除的客户端
#crl-verify $SRV_CONFIG/crl.pem

## 运行客户端之间流量转发
client-to-client
## 为客户端配置静态IP
client-config-dir ${VPN_HOME}/ccd
EOF
fi

# 生成客户端证书
while true;do
    read -rp "开始生成客户端证书, 请输入客户端证书名称: " -e USERNAME
    if [[ $USERNAME =~ ^[a-zA-Z]{3,12}[a-zA-Z0-9\_]+[a-zA-Z0-9_]*$ ]];then
        echo yes|easyrsa build-client-full "${USERNAME}" nopass
        break
    else
        echo "证书名称必须以字母开头且可以和数字和下划线组合, 请重新输入!"
    fi
done

if [[ ! -f ${CLT_CONFIG}/${USERNAME}.ovpn ]];then
    cat <<EOF >"${CLT_CONFIG}/${USERNAME}.ovpn"
client
dev tun0
proto udp
remote $SERVER_IP 11933
resolv-retry infinite
nobind
persist-tun
remote-cert-tls server
auth SHA256
cipher AES-256-GCM
verb 3
<ca>
$(cat $CERT_PATH/pki/ca.crt)
</ca>
<cert>
$(cat $CERT_PATH/pki/issued/$USERNAME.crt)
</cert>
<key>
$(cat $CERT_PATH/pki/private/$USERNAME.key)
</key>
<tls-auth>
$(cat $CERT_PATH/ta.key)
</tls-auth>
key-direction 1
EOF
fi

read -rp "是否为${USERNAME}配置静态IP地址(yes|no): " ENTER
if [[ "${ENTER}" != "yes" ]];then
    exit 0
fi

# 给客户端分配静态IP地址
if [[ ! -f "$VPN_HOME/ccd/$USERNAME" ]];then
    echo "当前虚拟网址为:   ${VPN_NETWORK}"
    echo "当前虚拟网址掩码: ${VPN_NETMASK}"
    read -rp "输入${USERNAME}IP地址: " static_ip
    if [[ $static_ip =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]];then
        echo "ifconfig-push $static_ip $VPN_NETMASK" >"${VPN_HOME}/ccd/${USERNAME}" 
	echo "${USERNAME} 静态IP配置成功"
    else
	echo "${USERNAME} 静态IP配置失败"
    fi
else
    echo "${USERNAME}静态IP配置地址已经存在"
fi
```