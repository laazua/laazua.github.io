#!/bin/bash
# SSH 用户证书签发脚本
# 用法: issue-user-cert.sh <用户名> [有效期天数] [权限选项]

set -e

# 配置文件
CA_KEY="/etc/ssh-ca/users/private/user-ca"
CERT_DIR="/etc/ssh-ca/users/certs"
LOG_DIR="/var/log/ssh-ca"
LOG_FILE="$LOG_DIR/user-certs.log"

# 创建日志目录
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

# 参数检查
if [ $# -lt 1 ]; then
    echo "错误: 缺少参数"
    echo "用法: $0 <用户名> [有效期天数] [权限选项]"
    echo "示例: $0 alice 30 'no-port-forwarding,no-x11-forwarding'"
    exit 1
fi

USERNAME="$1"
VALIDITY_DAYS="${2:-30}"  # 默认30天
OPTIONS="${3:-}"
PRINCIPALS="$USERNAME,admin"  # 允许登录的用户名（可登录为多个用户）

# 用户公钥文件（假设从客户端上传）
USER_PUB_KEY="/tmp/${USERNAME}-ssh-pubkey-$(date +%s).pub"

echo "请将用户的公钥内容粘贴到下面 (以 ssh-rsa/ssh-ed25519 开头，以用户邮箱或注释结尾)"
echo "粘贴完成后按 Ctrl+D"
cat > "$USER_PUB_KEY"

# 验证公钥格式
if ! ssh-keygen -l -f "$USER_PUB_KEY" &>/dev/null; then
    echo "错误: 无效的公钥格式"
    rm -f "$USER_PUB_KEY"
    exit 1
fi

# 生成唯一证书ID
CERT_ID="${USERNAME}-$(date +%Y%m%d-%H%M%S)"
CERT_FILE="${CERT_DIR}/${CERT_ID}.pub"

# 计算有效期
VALIDITY="+${VALIDITY_DAYS}d"

# 构建签发命令
SIGN_CMD="ssh-keygen -s \"$CA_KEY\" -I \"$CERT_ID\" -n \"$PRINCIPALS\" -V \"$VALIDITY\""

# 添加额外选项
if [ -n "$OPTIONS" ]; then
    # 解析选项并添加到命令
    IFS=',' read -ra OPTS <<< "$OPTIONS"
    for opt in "${OPTS[@]}"; do
        SIGN_CMD="$SIGN_CMD -O $opt"
    done
fi

# 添加源地址限制（示例：仅允许从特定网络访问）
# SIGN_CMD="$SIGN_CMD -O source-address=\"192.168.165.0/24\""

# 完成命令
SIGN_CMD="$SIGN_CMD \"$USER_PUB_KEY\""

echo "正在签发证书..."
eval "$SIGN_CMD"

# 移动证书到存储目录
PUB_KEY_NAME=$(echo ${USER_PUB_KEY}|awk -F'.' '{print $1}')
mv "${PUB_KEY_NAME}-cert.pub" "$CERT_FILE"

# 清理临时文件
rm -f "$USER_PUB_KEY"

# 记录日志
echo "$(date '+%Y-%m-%d %H:%M:%S') - 用户: $USERNAME - 证书: $CERT_ID - 有效期: $VALIDITY_DAYS天" >> "$LOG_FILE"

echo ""
echo "========== 证书签发成功 =========="
echo "证书文件: $CERT_FILE"
echo "证书ID: $CERT_ID"
echo "有效期: $VALIDITY_DAYS 天"
echo "允许的用户: $PRINCIPALS"
echo "=================================="
echo ""
echo "请将以下证书内容发送给用户:"
cat "$CERT_FILE"
