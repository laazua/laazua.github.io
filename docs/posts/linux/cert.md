---
title: OpenSSL自签证书
prev:
    text: 内核参数调整示例
    link: /posts/linux/kernel
next:
    text: OpenSSL CA自签证书
    link: /posts/linux/openssl-ca
---

#####

- **OpenSSL自签web通用证书**  

*说明*
```bash
1. 制作证书分为两个阶段,先创建CA证书, 再创建域名证书
2. 默认会在脚本所在的目录创建证书相关文件夹
3. 默认创建的证书有效期为 100 年

输入的域名是: example.com, 默认会签发 *.example.com 的证书(含 example.com 自身)

阶段一: 创建/检查 CA 证书  在默认的 ./ca 目录中未发现证书, 创建新CA证书。共3步
  (1/3)创建CA的私钥
  (2/3)创建CA的证书请求文件
  (3/3)CA自签证书

Certificate request self-signature ok
subject=C=CN, ST=ZJ, L=HZ, O=testca.com, OU=testca, CN=testca.com, emailAddress=admin@testca.com  

CA证书创建完毕, 相关证书文件路径为:  
  CA私钥: /to/path/aa/ca/ca.key  
  CA证书请求文件:/to/path/aa/ca/ca.csr  
  CA证书: /to/path/aa/ca/ca.crt

阶段二: 创建/检查域名证书  在默认域名同名的 ./example.com 目录创建域名证书。共3步
  (1/3)创建用户的私钥, 并从RSA私钥文件中提取公钥writing RSA key  
  (2/3)创建域名证书请求文件  
  (3/3)使用CA证书给域名的请求文件添加数字签名制作用户证书

Certificate request self-signature ok
subject=C=CN, ST=ZJ, L=HZ, O=test.com, OU=test, CN=*.example.com, emailAddress=pritest@test.com  

域名私钥: /to/path/aa/example.com/example.com.key  
域名公钥: /to/path/aa/example.com/example.com.pem  
域名证书请求文件: /to/path/aa/example.com/example.com.csr  
域名证书: /to/path/aa/example.com/example.com.crt域名证书详情

```
*脚本*
```bash
#!/bin/bash

## make_cert.sh example.com

set -e

echo "使用方法: $0 [域名]"
echo "  示例: $0 example.com"
echo "1. 制作证书分为两个阶段,先创建CA证书, 再创建域名证书"
echo "2. 默认会在脚本所在的目录创建证书相关文件夹"
echo "3. 默认创建的证书有效期为 100 年"
cd "$(dirname $0)"

DOMAIN=$1

if [ -z "$DOMAIN" ]
then
  read -p "请输入需要制作证书的域名: " DOMAIN
fi

echo "输入的域名是: $DOMAIN, 默认会签发 *.$DOMAIN 的证书(含 $DOMAIN 自身)"
if [ ! -x "$(command -v openssl)" ]
then
  echo "未检测到openssl命令, 请安装 openssl"
  exit 1
fi

make_ca() {
  # 添加一个空行
  echo
  echo "#阶段一: 创建/检查 CA 证书"
  if [ -f ca/ca.crt ]
  then
    echo "  CA证书已存在, 不需要重新创建。跳过"
    echo
    return
  fi
  echo "  在默认的 ./ca 目录中未发现证书, 创建新CA证书。共3步"
  mkdir -p ca
  echo "  (1/3)创建CA的私钥"
  openssl genrsa -out ca/ca.key 2048
  echo "  (2/3)创建CA的证书请求文件"
  openssl req -new -key ca/ca.key -subj "/C=CN/ST=ZJ/L=HZ/O=testca.com/OU=testca/CN=testca.com/emailAddress=admin@testca.com" -out ca/ca.csr
  echo "  (3/3)CA自签证书"
  openssl x509 -req -in ca/ca.csr -signkey ca/ca.key -out ca/ca.crt -days 36500
  echo "  CA证书创建完毕, 相关证书文件路径为: "
  echo "  CA私钥: $(pwd)/ca/ca.key"
  echo "  CA证书请求文件: $(pwd)/ca/ca.csr"
  echo "  CA证书: $(pwd)/ca/ca.crt"
}

make_crt() {
  echo
  echo "#阶段二: 创建/检查域名证书"
  if [ -d "$DOMAIN" ]
  then
    echo "  证书目录已存在, 请勿重复创建。若需重新创建, 请mv备份或删除该目录"
    return
  fi
  echo "  在默认域名同名的 ./${DOMAIN} 目录创建域名证书。共3步"
  mkdir "$DOMAIN"
  echo "  (1/3)创建用户的私钥, 并从RSA私钥文件中提取公钥"
  openssl genrsa -out "${DOMAIN}/${DOMAIN}.key" 2048
  openssl rsa -in "${DOMAIN}/${DOMAIN}.key" -pubout -out "${DOMAIN}/${DOMAIN}.pem"
  echo "  (2/3)创建域名证书请求文件"

  openssl req -new -key "${DOMAIN}/${DOMAIN}.key" \
    -subj "/C=CN/ST=ZJ/L=HZ/O=test.com/OU=test/CN=*.${DOMAIN}/emailAddress=pritest@test.com" \
    -addext "subjectAltName = DNS:*.${DOMAIN}, DNS:${DOMAIN}" \
    -out "${DOMAIN}/${DOMAIN}.csr"

  echo "  (3/3)使用CA证书给域名的请求文件添加数字签名制作用户证书"
  openssl x509 -req -CA ca/ca.crt -CAkey ca/ca.key -CAcreateserial -in "${DOMAIN}/${DOMAIN}.csr" -out "${DOMAIN}/${DOMAIN}.crt" -days 36500
  echo "  域名私钥: $(pwd)/${DOMAIN}/${DOMAIN}.key"
  echo "  域名公钥: $(pwd)/${DOMAIN}/${DOMAIN}.pem"
  echo "  域名证书请求文件: $(pwd)/${DOMAIN}/${DOMAIN}.csr"
  echo "  域名证书: $(pwd)/${DOMAIN}/${DOMAIN}.crt"
}

show_crt() {
  echo
  echo "域名证书详情"
  openssl x509 -in "${DOMAIN}/${DOMAIN}.crt" -noout -text
}

main() {
    make_ca
    make_crt
    show_crt
}

main
```

*证书使用*
1. nginx配置
```text
## nginx配置
server {
    listen 443 ssl;
    server_name example.com www.example.com;
    
    ssl_certificate /path/to/example.com/example.com.crt;
    ssl_certificate_key /path/to/example.com/example.com.key;
    
    # 可选：提高安全性
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    
    # 其他配置...
}
```
2. 客户端安装CA证书: 双击 ca.crt 文件  


- **专用服务端/客户端双向认证**
*脚本*
```bash
#!/bin/bash

set -e

# 设置工作目录
CERT_DIR="./ssl"
# 设置证书过期时间(天)
CA_EXPIRED=3650
echo "[*] 证书有效期限为 $CA_EXPIRED 天"

mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

echo "[*] 清理旧文件"
rm -f *.crt *.key *.csr *.srl openssl.cnf

echo "[*] 生成 CA 私钥和证书"
openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes -key ca.key -sha256 -days $CA_EXPIRED -out ca.crt -subj "/C=CN/ST=SC/L=CD/O=laazua/CN=lazuaCA"

echo "[*] 创建 OpenSSL 配置文件带 SAN 支持"
## openssl.cnf中
## [ alt_names ]块设置服务端地址
cat > openssl.cnf <<EOF
[ req ]
default_bits       = 2048
prompt             = no
default_md         = sha256
req_extensions     = req_ext
distinguished_name = dn

[ dn ]
C  = CN
ST = Sichuan
L  = Chengdu
O  = laazua
OU = laazua

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
IP.1  = 127.0.0.1
IP.2  = 192.168.165.89
EOF

### ==== 服务端证书 ====
echo "[*] 生成 Server 私钥和 CSR"
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=localhost" -config openssl.cnf

echo "[*] 签发 Server 证书（含 SAN）"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
-out server.crt -days $CA_EXPIRED -sha256 -extfile openssl.cnf -extensions req_ext

### ==== 客户端证书 ====
echo "[*] 生成 Client 私钥和 CSR"
openssl genrsa -out client.key 2048
openssl req -new -key client.key -out client.csr -subj "/CN=client" -config openssl.cnf

echo "[*] 签发 Client 证书（含 SAN）"
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial \
-out client.crt -days $CA_EXPIRED -sha256 -extfile openssl.cnf -extensions req_ext

echo "[✔] 所有证书生成完毕，位于 $CERT_DIR 目录下"
```

- **[常用签发脚本示例,以及其说明](./cert_script.md)**