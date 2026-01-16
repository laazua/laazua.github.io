##### 基于 SSH CA 的集中密钥管理 - 完整实现过程

- 网络扑拓
```bash
    (颁发证书)                (持有证书)                (信任CA)
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 192.168.168.71  │     │ 192.168.165.72  │     │ 192.168.165.73  │
│     CA host     │────▶│   client host   │────▶│   server host   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- CA服务器上操作(第一阶段)
    + 环境准备
    ```bash
    # 登录到 CA 服务器
    ssh root@192.168.168.71

    # 1. 创建 SSH CA 目录结构
    mkdir -p /etc/ssh-ca/{users,hosts}/{certs,private,public,crl}
    mkdir -p /etc/ssh-ca/templates
    mkdir -p /etc/ssh-ca/bin

    # 2. 设置严格权限
    chmod 700 /etc/ssh-ca/users/private
    chmod 700 /etc/ssh-ca/hosts/private
    chmod 755 /etc/ssh-ca/{users,hosts}/{public,certs}
    chown root:root /etc/ssh-ca -R

    # 3. 记录服务器信息（便于后续使用）
    cat > /etc/ssh-ca/server-info.txt << EOF
    CA 服务器: 192.168.168.71
    客户端服务器: 192.168.165.72
    目标服务器: 192.168.165.73
    EOF
    ```
    + 创建 CA 根密钥对
    ```bash
    # 进入 CA 目录
    cd /etc/ssh-ca

    # 1. 创建用户 CA 密钥对（用于验证用户身份）
    ssh-keygen -t rsa -b 4096 \
    -f users/private/user-ca \
    -C "SSH User Certificate Authority" \
    -N ""  # 不设置密码（生产环境建议设置）

    # 2. 创建主机 CA 密钥对（可选，用于验证服务器身份）
    ssh-keygen -t rsa -b 4096 \
    -f hosts/private/host-ca \
    -C "SSH Host Certificate Authority" \
    -N ""

    # 3. 将公钥复制到公共目录
    cp users/private/user-ca.pub users/public/
    cp hosts/private/host-ca.pub hosts/public/

    # 4. 查看生成的密钥
    echo "=== 用户 CA 公钥 ==="
    cat users/public/user-ca.pub
    echo -e "\n=== 主机 CA 公钥 ==="
    cat hosts/public/host-ca.pub

    # 5. 记录公钥指纹（重要！）
    ssh-keygen -lf users/private/user-ca
    ssh-keygen -lf hosts/private/host-ca
    ```
    + 创建用户证书签发脚本
    ```bash
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
    ```

    + 创建主机证书签发脚本(可选)
    ```bash
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
    ```

    + 创建证书吊销脚本
    ```bash
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
    ```

    + 准备分发脚本
    ```bash
    #!/bin/bash
    # 分发 CA 公钥到目标服务器

    set -e

    USER_CA_PUB="/etc/ssh-ca/users/public/user-ca.pub"
    HOST_CA_PUB="/etc/ssh-ca/hosts/public/host-ca.pub"

    # 目标服务器列表
    SERVERS=("192.168.165.73")  # 只需要目标服务器信任CA

    for SERVER in "${SERVERS[@]}"; do
        echo "分发到 $SERVER..."
        
        # 分发用户 CA 公钥
        scp "$USER_CA_PUB" root@$SERVER:/etc/ssh/user-ca.pub
        
        # 在目标服务器上配置信任CA
        ssh root@$SERVER << 'REMOTE_EOF'
            # 确保 SSH 目录存在
            mkdir -p /etc/ssh
            
            # 备份原始配置
            cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)
            
            # 检查是否已配置 TrustedUserCAKeys
            if ! grep -q "TrustedUserCAKeys" /etc/ssh/sshd_config; then
                echo "TrustedUserCAKeys /etc/ssh/user-ca.pub" >> /etc/ssh/sshd_config
            else
                sed -i 's|^TrustedUserCAKeys.*|TrustedUserCAKeys /etc/ssh/user-ca.pub|' /etc/ssh/sshd_config
            fi
            
            # 确保权限正确
            chmod 644 /etc/ssh/user-ca.pub
            chown root:root /etc/ssh/user-ca.pub
            
            # 重启 SSH 服务
            systemctl restart sshd
            echo "已为 $SERVER 配置信任 CA"
    REMOTE_EOF
        
        echo "完成 $SERVER"
    done

    echo "所有服务器配置完成"
    ```

- 在目标服务器:192.168.165.73上操作(第二阶段)
    + 配置信任 CA
    ```bash
    # 登录到目标服务器
    ssh root@192.168.165.73

    # 1. 从 CA 服务器获取公钥（或者等待 CA 服务器分发）
    scp root@192.168.168.71:/etc/ssh-ca/users/public/user-ca.pub /etc/ssh/

    # 2. 备份 SSH 配置文件
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)

    # 3. 编辑 SSH 服务器配置
    cat >> /etc/ssh/sshd_config << 'EOF'

    # === SSH CA 配置 ===
    # 信任的用户 CA
    TrustedUserCAKeys /etc/ssh/user-ca.pub

    # 可选：配置吊销列表（如果需要）
    # RevokedKeys /etc/ssh/revoked_keys

    # 可选：禁用密码认证（推荐）
    PasswordAuthentication no
    ChallengeResponseAuthentication no

    # 可选：限制只有特定组的用户可以使用证书登录
    # Match User *,!root
    #    AuthenticationMethods publickey
    EOF

    # 4. 验证配置文件语法
    sshd -t

    # 5. 重启 SSH 服务
    systemctl restart sshd

    # 6. 测试配置是否生效
    sshd -T | grep -i trusteduserca

    # 7. 创建测试用户（可选）
    useradd -m testuser
    echo "testuser 用户创建完成"
    ```

    + 配置主机证书(可选)
    ```bash
    # 如果需要使用主机证书，执行以下步骤：

    # 1. 生成主机密钥（如果不存在）
    ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""

    # 2. 将主机公钥发送到 CA 服务器进行签名
    scp /etc/ssh/ssh_host_rsa_key.pub root@192.168.168.71:/tmp/$(hostname)-host-key.pub

    # 3. 在 CA 服务器上签发主机证书后，获取证书
    # 4. 配置 SSH 使用主机证书
    echo "HostCertificate /etc/ssh/ssh_host_rsa_key-cert.pub" >> /etc/ssh/sshd_config
    ```

- 在客户端服务器:192.168.165.72上操作(第三阶段)
    + 生成客户端密钥对
    ```bash
    # 登录到客户端服务器
    ssh root@192.168.165.72

    # 1. 创建测试用户（模拟实际用户）
    useradd -m alice
    su - alice

    # 2. 生成 SSH 密钥对
    ssh-keygen -t rsa -b 4096 \
    -f ~/.ssh/id_rsa \
    -C "alice@client-server" \
    -N ""  # 生产环境建议设置密码

    # 3. 查看公钥
    echo "=== 请复制以下公钥内容 ==="
    cat ~/.ssh/id_rsa.pub
    echo "=== 公钥结束 ==="

    # 4. 创建 SSH 配置（优化连接）
    cat > ~/.ssh/config << 'EOF'
    Host 192.168.165.73
        HostName 192.168.165.73
        User alice
        IdentityFile ~/.ssh/id_rsa
        CertificateFile ~/.ssh/id_rsa-cert.pub
        # 启用证书验证
        IdentitiesOnly yes

    Host 192.168.168.71
        HostName 192.168.168.71
        User root
        IdentityFile ~/.ssh/id_rsa
    EOF

    chmod 600 ~/.ssh/config

    # 5. 退出 alice 用户
    exit
    ```

    + 从 CA 服务器获取证书 (第一手动申请)
    ```bash
    # 1. 以管理员身份在 CA 服务器上执行签发
    # 在 CA 服务器上执行：
    # /etc/ssh-ca/bin/issue-user-cert.sh alice 30

    # 2. 将生成的证书内容复制到客户端
    # 在客户端服务器上，以 alice 用户执行：
    su - alice
    cat > ~/.ssh/id_rsa-cert.pub << 'CERT_CONTENT'
    # 在这里粘贴 CA 服务器生成的证书内容
    # 示例：
    # ssh-rsa-cert-v01@openssh.com AAAAB3NzaC1yc2E...（完整证书内容）
    CERT_CONTENT

    chmod 600 ~/.ssh/id_rsa-cert.pub
    ```

    + 自动申请脚本(后续申请)
    ```bash
    # 在客户端创建证书申请脚本
    cat > /usr/local/bin/request-ssh-cert.sh << 'EOF'
    #!/bin/bash
    # 自动向 CA 服务器申请 SSH 证书

    CA_SERVER="192.168.168.71"
    USERNAME=$(whoami)

    # 上传公钥到 CA 服务器
    scp ~/.ssh/id_rsa.pub $CA_SERVER:/tmp/$USERNAME-$(hostname)-pubkey.pub

    # 在 CA 服务器上签发证书
    ssh root@$CA_SERVER "/etc/ssh-ca/bin/issue-user-cert.sh $USERNAME 30 'no-port-forwarding,no-x11-forwarding' > /tmp/$USERNAME-cert.txt 2>&1"

    # 获取证书
    scp $CA_SERVER:/tmp/$USERNAME-cert.txt /tmp/

    # 从输出中提取证书（这里需要根据实际输出调整）
    # 实际部署时应使用更可靠的方法提取证书
    echo "请手动从 /tmp/$USERNAME-cert.txt 中提取证书内容"
    EOF

    chmod +x /usr/local/bin/request-ssh-cert.sh
    ```

- 测试整个流程(第四阶段)
    + 测试证书登录
    ```bash
    # 在客户端服务器 (192.168.165.72) 上测试

    # 1. 切换到 alice 用户
    su - alice

    # 2. 测试连接到目标服务器
    ssh -v 192.168.165.73

    # 3. 查看证书详情
    ssh-keygen -L -f ~/.ssh/id_rsa-cert.pub

    # 4. 测试连接（带详细输出）
    ssh -vvv -o PreferredAuthentications=publickey 192.168.165.73

    # 5. 如果连接失败，检查目标服务器日志
    # 在目标服务器上查看日志
    ssh root@192.168.165.73 "tail -f /var/log/auth.log | grep ssh"
    ```

    + 验证证书
    ```bash
    # 1. 检查证书有效期
    ssh-keygen -L -f ~/.ssh/id_rsa-cert.pub | grep -i valid

    # 2. 尝试使用过期的证书（测试吊销机制）
    # 3. 测试证书限制（如禁止端口转发）
    ssh -N -L 8080:localhost:80 192.168.165.73
    # 如果配置了 no-port-forwarding，这个命令应该失败
    ```

- 后期维护(第五阶段)
    + 定期任务（在 CA 服务器上）
    ```bash
    # 1. 证书过期检查脚本
    cat > /etc/cron.daily/check-cert-expiry.sh << 'EOF'
    #!/bin/bash
    # 检查即将过期的证书

    CERT_DIR="/etc/ssh-ca/users/certs"
    DAYS_WARNING=7

    for cert in "$CERT_DIR"/*.pub; do
        [ -f "$cert" ] || continue
        
        expiry=$(ssh-keygen -L -f "$cert" 2>/dev/null | grep "Valid:" | awk '{print $4}')
        if [ -n "$expiry" ]; then
            expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
            today_epoch=$(date +%s)
            days_left=$(( (expiry_epoch - today_epoch) / 86400 ))
            
            if [ $days_left -lt $DAYS_WARNING ] && [ $days_left -ge 0 ]; then
                echo "警告: 证书 $(basename $cert) 将在 $days_left 天后过期"
            fi
        fi
    done
    EOF

    chmod +x /etc/cron.daily/check-cert-expiry.sh

    # 2. 备份 CA 密钥（重要！）
    cat > /usr/local/bin/backup-ca-keys.sh << 'EOF'
    #!/bin/bash
    # 备份 CA 密钥

    BACKUP_DIR="/backup/ssh-ca"
    DATE=$(date +%Y%m%d)

    mkdir -p "$BACKUP_DIR/$DATE"
    cp -r /etc/ssh-ca/{users,hosts} "$BACKUP_DIR/$DATE/"
    cp /etc/ssh-ca/bin/*.sh "$BACKUP_DIR/$DATE/"
    tar -czf "$BACKUP_DIR/ssh-ca-backup-$DATE.tar.gz" -C /etc/ssh-ca .

    # 记录备份
    echo "$(date): 备份完成到 $BACKUP_DIR/ssh-ca-backup-$DATE.tar.gz" >> /var/log/ca-backup.log
    EOF

    chmod +x /usr/local/bin/backup-ca-keys.sh
    ```
    + 吊销证书示例
    ```bash
    # 如果需要吊销某个用户的证书：

    # 1. 在 CA 服务器上找到要吊销的证书
    ls -la /etc/ssh-ca/users/certs/

    # 2. 执行吊销
    /etc/ssh-ca/bin/revoke-cert.sh /etc/ssh-ca/users/certs/alice-20231201-143022.pub

    # 3. 分发吊销列表到所有目标服务器
    scp /etc/ssh-ca/users/crl root@192.168.165.73:/etc/ssh/revoked_keys

    # 4. 在目标服务器上重新加载 SSH 配置
    ssh root@192.168.165.73 "systemctl reload sshd"
    ```