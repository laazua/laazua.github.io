#!/bin/bash
# SSH 证书吊销脚本

set -e

CRL_FILE="/etc/ssh-ca/users/crl"
CA_KEY="/etc/ssh-ca/users/private/user-ca"

if [ $# -lt 1 ]; then
    echo "用法: $0 <证书文件或公钥文件> [原因]"
    exit 1
fi

CERT_FILE="$1"
REASON="${2:-revoked-by-admin}"

# 如果提供的是证书文件，提取其中的公钥
if [[ "$CERT_FILE" == *-cert.pub ]]; then
    # 从证书中提取公钥
    TMP_PUBKEY="/tmp/pubkey-$(basename $CERT_FILE)"
    ssh-keygen -L -f "$CERT_FILE" | grep -A1 "Public key" | tail -1 | sed 's/^ *//' > "$TMP_PUBKEY"
    KEY_TO_REVOKE="$TMP_PUBKEY"
else
    KEY_TO_REVOKE="$CERT_FILE"
fi

# 添加到吊销列表
if [ ! -f "$CRL_FILE" ]; then
    ssh-keygen -k -f "$CRL_FILE"
fi

ssh-keygen -u -f "$CRL_FILE" -s "$CA_KEY" -z "1" "$KEY_TO_REVOKE"

# 清理临时文件
[ -f "$TMP_PUBKEY" ] && rm -f "$TMP_PUBKEY"

echo "证书已吊销"
echo "请将吊销列表 $CRL_FILE 分发到所有服务器"
