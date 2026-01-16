#!/bin/bash
# SSH 主机证书签发脚本

set -e

CA_KEY="/etc/ssh-ca/hosts/private/host-ca"
CERT_DIR="/etc/ssh-ca/hosts/certs"
HOSTNAME="$1"

if [ -z "$HOSTNAME" ]; then
    echo "用法: $0 <主机名或IP>"
    exit 1
fi

# 从目标服务器获取主机公钥（需要提前配置SSH密钥登录）
echo "正在从 $HOSTNAME 获取主机公钥..."
scp root@$HOSTNAME:/etc/ssh/ssh_host_rsa_key.pub /tmp/host-key-${HOSTNAME}.pub 2>/dev/null || {
    echo "无法获取主机公钥，请手动提供"
    exit 1
}

HOST_PUB_KEY="/tmp/host-key-${HOSTNAME}.pub"

# 签发主机证书（有效期为2年）
ssh-keygen -s "$CA_KEY" \
    -I "host-${HOSTNAME}-$(date +%Y%m%d)" \
    -h \  # 重要：标记为主机证书
    -n "$HOSTNAME, $(dig +short $HOSTNAME | tr '\n' ',')" \
    -V "-1w:+104w" \  # 一周前生效，104周后过期
    "$HOST_PUB_KEY"

# 移动证书
mv "${HOST_PUB_KEY}-cert.pub" "${CERT_DIR}/host-${HOSTNAME}.pub"

# 将证书发送回目标服务器
scp "${CERT_DIR}/host-${HOSTNAME}.pub" root@$HOSTNAME:/etc/ssh/ssh_host_rsa_key-cert.pub

echo "主机证书已签发并部署到 $HOSTNAME"
