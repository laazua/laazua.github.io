##### SSH CA 登录认证

- 说明
```bash
# CA:     192.168.165.71
# CLIENT: 192.168.165.72
# SERVER: 192.168.165.73
```

- CA服务器
```bash
##### 初始化CA证书
sudo mkdir -p /etc/ssh/ca
sudo chmod 755 /etc/ssh/ca
cd /etc/ssh/ca

## 生成CA密钥对（使用Ed25519算法，更安全高效）:这里使用的算法,在下面客户端生成用户密钥时要对应
ssh-keygen -t ed25519 -f ca_key -C "SSH Certificate Authority"

## 创建存放认证用户密钥目录
mkdir /etc/ssh/ca/user_keys

##### 获取认证用户的个人公钥放在 /etc/ssh/ca/user_keys 路径进行签名 (CLIENT进行认证用户的相关操作后执行)
## 对认证用户: alice 进行认证: 参数 -n 标识登录用户为张三(服务端必须创建此登录用户), -O "force-command=/usr/local/bin/audit-wrapper" 每次用户登录时都会执行的脚本
## ssh-keygen -s ca_key -I "alice_to_zhangsan" -n zhangsan -V +52w /etc/ssh/ca/user_keys/alice.pub
ssh-keygen -s ca_key -I alice_to_zhangsan -n zhangsan -O force-command=/usr/local/bin/audit-wrapper alice alice_to_zhangsan  -V +52w /etc/ssh/ca/user_keys/alice.pub
## 查看认证详情
ssh-keygen -L -f /etc/ssh/ca/user_keys/alice-cert.pub
## 将生成的用户证书alice-cert.pub回传到客户端(CLIENT): /home/alice/.ssh/id_rsa-cert.pub
```

- sshd服务端
```bash
## 创建一个用于登录的用户(zhangsan): adduser -m zhangsan

## 将CA服务器上生成的CA证书公钥拷贝到SERVER服务器上并进行配置
## scp root@192.168.165.71:/etc/ssh/ca/ca_key.pub /etc/ssh/ca_key.pub
## 配置CA登录认证
cat >/etc/ssh/sshd_config.d/10-ca-auth.conf<< 'EOF'
TrustedUserCAKeys /etc/ssh/ca_key.pub
PubkeyAuthentication yes
PasswordAuthentication no

## 下面的配置用于: ssh-keygen -s ca_key -I alice_to_zhangsan -n zhangsan -V +2h -O extension:realuser=alice /etc/ssh/ca/user_keys/alice.pub
TrustedUserCAKeys /etc/ssh/ca_key.pub
PubkeyAuthentication yes
PasswordAuthentication no

ExposeAuthInfo yes
AuthorizedPrincipalsCommand /usr/local/bin/ssh-principal-map.sh
AuthorizedPrincipalsCommandUser nobody
PermitUserEnvironment no
#ForceCommand /usr/local/bin/ssh-forcecmd.sh
Match User zhangsan
    AcceptEnv SSH_USER_CERTIFICATE REAL_USER SSH_KEY_ID LANG LC_*
    # 使用ForceCommand包装器
    ForceCommand /usr/local/bin/ssh-forcecmd.sh
    #AuthorizedKeysCommand /usr/local/bin/ssh-forcecmd.sh %u %k %t %T %I %f
    #AuthorizedKeysCommandUser nobody

EOF

## 创建: /usr/local/bin/ssh-principal-map.sh
cat >/usr/local/bin/ssh-principal-map.sh<'EOF'
#!/bin/bash
echo zhangsan
EOF
chmod +x /usr/local/bin/ssh-principal-map.sh

## 创建: /usr/local/bin/ssh-forcecmd.sh
cat >/usr/local/bin/ssh-forcecmd.sh<'EOF'
#!/bin/bash

#CERT_ID="$SSH_CERT_KEY_ID"   # OpenSSH 内置环境变量
#REAL_USER="${CERT_ID%@*}"   # 取 alice / bob

#export REAL_USER
#logger -p authpriv.notice "ssh-login real_user=$REAL_USER unix_user=$USER src=$SSH_CONNECTION cert_id=$SSH_CERT_KEY_ID"

#exec /bin/bash -l

CERT_FILE=$SSH_USER_AUTH
if [[ -n "$CERT_FILE" && -f "$CERT_FILE" ]]; then
  #ssh-keygen -Lf <(cat "$CERT_FILE"|awk '{sub($1 OFS, ""); print}')
  ## 这里解析的登录认证,需要在签发登录用户证书时使用 -O extension:realuser=alice 进行参数传递
  REAL_USER=$(ssh-keygen -Lf <(cat "$CERT_FILE"|awk '{sub($1 OFS, ""); print}') | awk '/realuser/ {print $4}'| xxd -r -p | tail -c +5)
else
  REAL_USER="unknown"
fi
#echo $REAL_USER
export REAL_USER

LOG=/var/log/session/${REAL_USER}-$(date +%Y%m%d%H%M%S)-$$.log
logger -p authpriv.notice "ssh-login real_user=$REAL_USER unix_user=$USER src=$SSH_CONNECTION cert_id=$SSH_CERT_KEY_ID log=$LOG"

exec script -q -f "$LOG"

EOF
chmod +x /usr/local/bin/ssh-forcecmd.sh

## 创建会话回放目录: mkdir /var/log/session && chown zhangsan:zhangsan /var/log/session

## 测试配置文件sshd -t
## 重启sshd服务: systemctl restart sshd
```

- sshd客户端
```bash
## 创建认证用户: alice 并生成用户密钥
sudo adduser -m alice
su alice && cd ~
mkdir .ssh
## 这里使用ed25519要与上面初始化CA证书时使用的算法一致
ssh-keygen -t ed25519 -f .ssh/id_ed25519 -N "" -C "alice@ssh-client"

## 将alice公钥拷贝到CA服务器进行认证
## cat cat .ssh/id_rsa.pub | ssh root@192.168.165.71:/etc/ssh/ca/user_keys/alice.pub

## CA服务端进行用户认证后, 将生成的alice-cert.pub证书放到客户端用户家目录中的.ssh/id_rsa-cert.pub
## 配置用户alice登录
cat > ~/.ssh/config <<'EOF'
Host 192.168.165.73
    HostName 192.168.165.73
    User zhangsan
    IdentityFile ~/.ssh/id_ed25519
    CertificateFile ~/.ssh/id_ed25519-cert.pub
EOF

## 扽了给测试
```

- 日志与审计
```bash
#!/bin/bash

## 在所有服务端新建审计bash脚本: /usr/local/bin/ssh-forcecmd.sh
## 检查 /var/log/session 路径是否存在，并授权登录用户zhangsan可访问: chown zhangsan:zhangsan /var/log/session

CERT_FILE=$SSH_USER_AUTH
if [[ -n "$CERT_FILE" && -f "$CERT_FILE" ]]; then
  #ssh-keygen -Lf <(cat "$CERT_FILE"|awk '{sub($1 OFS, ""); print}')
  ## 这里解析的登录认证,需要在签发登录用户证书时使用 -O extension:realuser=alice 进行参数传递
  REAL_USER=$(ssh-keygen -Lf <(cat "$CERT_FILE"|awk '{sub($1 OFS, ""); print}') | awk '/realuser/ {print $4}'| xxd -r -p | tail -c +5)
else
  REAL_USER="unknown"
fi
#echo $REAL_USER
export REAL_USER

LOG=/var/log/session/${REAL_USER}-$(date +%Y%m%d%H%M%S)-$$.log
logger -p authpriv.notice "ssh-login real_user=$REAL_USER unix_user=$USER src=$SSH_CONNECTION cert_id=$SSH_CERT_KEY_ID log=$LOG"

exec script -q -f "$LOG"

# chmod +x /usr/local/bin/ssh-forcecmd.sh
```