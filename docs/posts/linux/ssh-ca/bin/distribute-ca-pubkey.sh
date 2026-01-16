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
