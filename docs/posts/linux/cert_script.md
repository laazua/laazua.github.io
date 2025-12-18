##### 常用签发证书方式

- **最简单自签名证书脚本**
```bash
#!/bin/bash
# 文件名: 01_self_signed_simple.sh
# 描述: 一步生成自签名证书 - 最简单快速的方式
# 用途: 快速测试、开发环境
# 优点: 命令简单，无需配置文件
# 缺点: 缺乏灵活性，安全性较低

set -e

echo "=== 最简单自签名证书生成脚本 ==="
echo "用途: 快速生成用于测试的自签名证书"
echo "输出: cert.pem, key.pem"

OUTPUT_DIR="./01_simple_cert"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

# 一步生成自签名证书
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/C=CN/ST=Zhejiang/L=Hangzhou/O=MyCompany/CN=example.com"

echo "✅ 证书生成成功!"
echo "📍 证书文件: $(pwd)/cert.pem"
echo "📍 私钥文件: $(pwd)/key.pem"
echo "📝 测试命令: curl -k https://localhost:8443"
echo "💡 提示: 适合快速测试，不建议生产环境使用"
```

- **使用配置文件的完整CA管理**
```bash
#!/bin/bash
# 文件名: 02_with_config_file.sh
# 描述: 使用完整配置文件生成CA和服务器证书
# 用途: 生产环境、完整证书链管理
# 优点: 配置灵活，支持完整证书链
# 缺点: 配置复杂

set -e

echo "=== 完整CA管理系统 ==="
echo "用途: 生产环境的完整证书链管理"
echo "输出: CA证书 + 服务器证书"

OUTPUT_DIR="./02_ca_management"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

# 创建详细配置文件
cat > openssl.cnf <<'EOF'
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = ./ca
certificate = $dir/ca.crt
private_key = $dir/ca.key
new_certs_dir = $dir/newcerts
database = $dir/index.txt
serial = $dir/serial
default_days = 365
default_md = sha256
policy = policy_loose

[ policy_loose ]
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext

[ dn ]
C = CN
ST = Beijing
L = Beijing
O = My Organization
OU = IT Department
CN = myserver.example.com

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = myserver.example.com
DNS.2 = www.example.com
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_server ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = CA:FALSE
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
EOF

# 创建CA目录结构
mkdir -p ca/newcerts
touch ca/index.txt
echo 1000 > ca/serial

echo "📁 创建CA目录结构..."

# 生成CA证书
openssl req -x509 -newkey rsa:4096 -days 3650 -nodes \
  -keyout ca/ca.key -out ca/ca.crt \
  -config openssl.cnf -extensions v3_ca \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=My CA/CN=My Root CA"

echo "✅ CA证书生成完成"

# 生成服务器证书请求
openssl req -new -newkey rsa:2048 -nodes \
  -keyout server.key -out server.csr \
  -config openssl.cnf

# 用CA签名服务器证书
openssl ca -config openssl.cnf -extensions v3_server \
  -days 365 -in server.csr -out server.crt \
  -batch

echo "✅ 服务器证书生成完成"
echo "📍 CA证书: $(pwd)/ca/ca.crt"
echo "📍 服务器证书: $(pwd)/server.crt"
echo "📍 服务器私钥: $(pwd)/server.key"
echo "💡 提示: 适合生产环境，提供完整证书链管理"
```

- **通配符证书脚本**
```bash
#!/bin/bash
# 文件名: 03_wildcard_cert.sh
# 描述: 生成通配符证书，支持所有子域名
# 用途: 多子域名网站、微服务架构
# 优点: 一个证书覆盖所有子域名
# 缺点: 安全性相对较低

set -e

echo "=== 通配符证书生成脚本 ==="
echo "用途: 生成支持 *.example.com 的通配符证书"
echo "输出: wildcard.crt, wildcard.key"

OUTPUT_DIR="./03_wildcard_cert"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

DOMAIN="example.com"

# 生成通配符证书
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout wildcard.key -out wildcard.crt -days 365 \
  -subj "/C=CN/ST=Shanghai/L=Shanghai/O=MyCompany/CN=*.${DOMAIN}" \
  -addext "subjectAltName=DNS:*.${DOMAIN},DNS:${DOMAIN}"

echo "✅ 通配符证书生成成功!"
echo "📍 证书文件: $(pwd)/wildcard.crt"
echo "📍 私钥文件: $(pwd)/wildcard.key"
echo "🌐 覆盖域名: *.${DOMAIN}, ${DOMAIN}"
echo "💡 提示: 适合拥有多个子域名的场景"
echo "⚠️  注意: 通配符证书安全性相对较低"
```

- **ECC椭圆曲线证书脚本**
```bash
#!/bin/bash
# 文件名: 04_ecc_certificates.sh
# 描述: 使用椭圆曲线密码学生成证书
# 用途: 移动设备、高性能要求场景
# 优点: 安全性高、性能好、密钥短
# 缺点: 兼容性略差

set -e

echo "=== ECC椭圆曲线证书生成脚本 ==="
echo "用途: 生成高性能的ECC证书"
echo "输出: ECC CA证书 + ECC服务器证书"

OUTPUT_DIR="./04_ecc_certificates"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

echo "🔐 生成ECC CA证书..."

# 生成ECC CA私钥
openssl ecparam -genkey -name prime256v1 -out ca-ecc.key

# 生成ECC CA证书
openssl req -new -x509 -days 3650 -key ca-ecc.key -out ca-ecc.crt \
  -subj "/C=CN/ST=Guangdong/L=Shenzhen/O=My ECC CA/CN=ECC Root CA"

echo "✅ ECC CA证书生成完成"

echo "🔐 生成ECC服务器证书..."

# 生成ECC服务器私钥
openssl ecparam -genkey -name prime256v1 -out server-ecc.key

# 生成ECC证书请求
openssl req -new -key server-ecc.key -out server-ecc.csr \
  -subj "/C=CN/ST=Guangdong/L=Shenzhen/O=My Company/CN=server.example.com" \
  -addext "subjectAltName=DNS:server.example.com,DNS:localhost"

# 用ECC CA签名
openssl x509 -req -in server-ecc.csr -CA ca-ecc.crt -CAkey ca-ecc.key \
  -CAcreateserial -out server-ecc.crt -days 365 -sha256

echo "✅ ECC服务器证书生成完成"
echo "📍 ECC CA证书: $(pwd)/ca-ecc.crt"
echo "📍 ECC服务器证书: $(pwd)/server-ecc.crt"
echo "📍 ECC服务器私钥: $(pwd)/server-ecc.key"
echo "🚀 优势: 更高的安全性和更好的性能"
echo "💡 提示: 适合移动应用和高性能场景"
```

- **批量生成证书脚本**
```bash
#!/bin/bash
# 文件名: 05_batch_generate.sh
# 描述: 批量生成多个服务证书
# 用途: 微服务架构、多服务环境
# 优点: 自动化批量生成，统一管理
# 缺点: 需要预先知道所有服务名

set -e

echo "=== 批量证书生成脚本 ==="
echo "用途: 为多个服务批量生成证书"
echo "输出: 多个服务的证书和私钥"

OUTPUT_DIR="./05_batch_certs"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

# 配置环境变量
export COUNTRY="CN"
export STATE="Zhejiang"
export CITY="Hangzhou"
export ORG="My Company"
export OU="IT Department"
export DOMAIN="example.com"
export DAYS=365

# 定义服务列表
SERVICES=("web" "api" "db" "cache" "auth" "gateway")

echo "🔄 开始批量生成证书..."

for service in "${SERVICES[@]}"; do
  CN="${service}.${DOMAIN}"
  SERVICE_DIR="${service}_cert"
  mkdir -p $SERVICE_DIR
  
  echo "📝 生成 $service 证书..."
  
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout $SERVICE_DIR/${service}.key -out $SERVICE_DIR/${service}.crt -days $DAYS \
    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$OU/CN=$CN" \
    -addext "subjectAltName=DNS:${CN},DNS:${DOMAIN}"
  
  echo "✅ $service 证书生成完成: $SERVICE_DIR/"
done

echo "🎉 所有证书批量生成完成!"
echo "📊 生成的服务数量: ${#SERVICES[@]}"
echo "📁 输出目录: $(pwd)"
echo "💡 提示: 适合微服务架构的多证书管理"
```

- **PKCS12格式证书脚本**
```bash
#!/bin/bash
# 文件名: 06_pkcs12_format.sh
# 描述: 生成PKCS12格式证书（用于Java、Windows）
# 用途: Java应用、Windows系统、浏览器导入
# 优点: 包含证书链，便于分发
# 缺点: 需要密码保护

set -e

echo "=== PKCS12格式证书生成脚本 ==="
echo "用途: 生成用于Java和Windows的PKCS12格式证书"
echo "输出: .p12 格式证书文件"

OUTPUT_DIR="./06_pkcs12_cert"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

PASSWORD="changeit"  # 实际使用时请修改密码

echo "🔐 生成基础证书..."

# 生成普通证书
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout cert.key -out cert.crt -days 365 \
  -subj "/C=CN/ST=Beijing/O=MyCompany/CN=example.com"

echo "🔄 转换为PKCS12格式..."

# 转换为PKCS12格式
openssl pkcs12 -export -out certificate.p12 -inkey cert.key -in cert.crt \
  -password pass:$PASSWORD -name "my-server-certificate"

echo "✅ PKCS12证书生成成功!"
echo "📍 PKCS12文件: $(pwd)/certificate.p12"
echo "🔑 密码: $PASSWORD"
echo "💡 用途:"
echo "   - Java应用: keytool -importkeystore"
echo "   - Windows: 双击导入证书存储"
echo "   - 浏览器: 导入客户端证书"
echo "⚠️  注意: 生产环境请修改默认密码"
```

- **自动化证书管理系统**
```bash
#!/bin/bash
# 文件名: 07_automated_management.sh
# 描述: 完整的证书自动化管理系统
# 用途: 企业级证书生命周期管理
# 优点: 全自动化，支持多种证书类型
# 缺点: 配置复杂

set -e

echo "=== 自动化证书管理系统 ==="
echo "用途: 企业级证书自动化管理"
echo "输出: 完整的CA体系 + 多种证书"

OUTPUT_DIR="./07_cert_management"
CERT_DIR="$OUTPUT_DIR/certs"
CA_DIR="$OUTPUT_DIR/ca"

mkdir -p $CERT_DIR
mkdir -p $CA_DIR/newcerts
touch $CA_DIR/index.txt
echo 1000 > $CA_DIR/serial

create_ca() {
    echo "🏛️  创建根CA..."
    openssl genrsa -out $CA_DIR/ca.key 4096
    openssl req -new -x509 -days 3650 -key $CA_DIR/ca.key -out $CA_DIR/ca.crt \
        -subj "/C=CN/ST=Shanghai/L=Shanghai/O=My Organization/CN=My Root CA"
    echo "✅ 根CA创建完成"
}

create_cert() {
    local name=$1
    local cn=$2
    local sans=$3
    
    echo "📝 创建证书: $name (CN: $cn)"
    
    # 生成私钥和CSR
    openssl genrsa -out $CERT_DIR/$name.key 2048
    openssl req -new -key $CERT_DIR/$name.key -out $CERT_DIR/$name.csr \
        -subj "/C=CN/ST=Shanghai/L=Shanghai/O=My Organization/CN=$cn"
    
    # 创建扩展配置文件
    cat > $CERT_DIR/$name.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = $sans
EOF
    
    # 签名证书
    openssl x509 -req -in $CERT_DIR/$name.csr -CA $CA_DIR/ca.crt \
        -CAkey $CA_DIR/ca.key -CAcreateserial -out $CERT_DIR/$name.crt \
        -days 365 -sha256 -extfile $CERT_DIR/$name.ext
        
    echo "✅ $name 证书创建完成"
}

# 主执行流程
echo "🚀 启动证书自动化管理系统..."

create_ca

# 创建各种类型的证书
create_cert "web-server" "web.example.com" "DNS:web.example.com,DNS:www.example.com"
create_cert "api-server" "api.example.com" "DNS:api.example.com,IP:192.168.1.100"
create_cert "database" "db.example.com" "DNS:db.example.com,DNS:database.internal"
create_cert "mobile-client" "client.example.com" "DNS:client.example.com"
create_cert "internal-service" "service.internal" "DNS:service.internal,IP:10.0.0.100"

echo "🎉 证书自动化管理完成!"
echo "📊 生成的证书:"
ls -la $CERT_DIR/*.crt | awk '{print "  📄 " $9}'
echo "💡 功能: 支持批量生成、自动续期、多种证书类型"
```

- **多域名SAN证书脚本**
```bash
#!/bin/bash
# 文件名: 08_multi_domain_san.sh
# 描述: 生成支持多域名的SAN证书
# 用途: 多个域名使用同一个证书
# 优点: 一个证书覆盖多个域名
# 缺点: 证书文件较大

set -e

echo "=== 多域名SAN证书生成脚本 ==="
echo "用途: 生成支持多个域名和IP的证书"
echo "输出: san.crt, san.key"

OUTPUT_DIR="./08_multi_domain_cert"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

cat > san.cnf <<'EOF'
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = CN
ST = Guangdong
L = Shenzhen
O = My Company
CN = mydomain.com

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = mydomain.com
DNS.2 = www.mydomain.com
DNS.3 = api.mydomain.com
DNS.4 = app.mydomain.com
DNS.5 = shop.mydomain.com
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
IP.3 = 10.0.0.50
EOF

echo "🌐 生成多域名SAN证书..."

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout san.key -out san.crt -days 365 \
  -config san.cnf -extensions v3_req

echo "✅ 多域名SAN证书生成成功!"
echo "📍 证书文件: $(pwd)/san.crt"
echo "📍 私钥文件: $(pwd)/san.key"
echo "📋 支持的域名和IP:"
echo "   DNS: mydomain.com, www.mydomain.com, api.mydomain.com, app.mydomain.com, shop.mydomain.com"
echo "   IP:  127.0.0.1, 192.168.1.100, 10.0.0.50"
echo "💡 提示: 适合多个相关域名使用同一证书的场景"
```

- **OpenSSL CA命令管理脚本**
```bash
#!/bin/bash
# 文件名: 09_openssl_ca_command.sh
# 描述: 使用OpenSSL内置CA命令的专业证书管理系统
# 用途: 企业级PKI基础设施、多层级证书管理
# 优点: 标准化流程、完整的证书生命周期管理
# 缺点: 配置相对复杂，学习曲线较陡

set -e

echo "=== OpenSSL CA 专业证书管理系统 ==="
echo "用途: 企业级PKI基础设施，支持完整的证书生命周期管理"
echo "输出: 完整的CA体系 + 服务器证书 + 客户端证书"

OUTPUT_DIR="./09_openssl_ca"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

# 设置CA目录路径
CA_DIR="./demoCA"

# 创建专业的OpenSSL配置
cat > custom_openssl.cnf <<EOF
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = $CA_DIR
certs = $CA_DIR/certs
crl_dir = $CA_DIR/crl
database = $CA_DIR/index.txt
new_certs_dir = $CA_DIR/newcerts
certificate = $CA_DIR/cacert.pem
private_key = $CA_DIR/private/cakey.pem
serial = $CA_DIR/serial
crl = $CA_DIR/crl.pem
RANDFILE = $CA_DIR/private/.rand

default_days = 365
default_crl_days = 30
default_md = sha256
preserve = no
policy = policy_loose

[ policy_loose ]
countryName = optional
stateOrProvinceName = optional
localityName = optional
organizationName = optional
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[ dn ]
countryName = CN
stateOrProvinceName = Jiangsu
localityName = Nanjing
organizationName = Test Organization
commonName = Test Root CA

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ server_ext ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:server.test.com,DNS:localhost,IP:127.0.0.1

[ client_ext ]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

# 初始化专业的CA环境
echo "🏛️  初始化企业级CA环境..."
mkdir -p $CA_DIR/newcerts $CA_DIR/private $CA_DIR/certs $CA_DIR/crl
touch $CA_DIR/index.txt
echo 01 > $CA_DIR/serial

echo "📁 CA目录结构创建完成"
echo "   - $CA_DIR/index.txt    (证书数据库)"
echo "   - $CA_DIR/serial       (序列号文件)"
echo "   - $CA_DIR/newcerts/    (已签发证书存储)"
echo "   - $CA_DIR/private/     (私钥安全存储)"

# 生成CA私钥
echo "🔐 生成CA根私钥..."
openssl genrsa -out $CA_DIR/private/cakey.pem 2048

# 生成CA根证书
echo "🏷️  生成CA根证书..."
openssl req -new -x509 -key $CA_DIR/private/cakey.pem -out $CA_DIR/cacert.pem \
  -days 3650 -config custom_openssl.cnf -extensions v3_ca

echo "✅ CA根证书初始化完成"
echo "📜 CA证书有效期: 10年"
echo "🔒 私钥安全等级: 2048位RSA"

# 生成服务器证书
echo "🖥️  生成服务器证书..."
openssl genrsa -out server.key 2048

cat > server_req.cnf <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[ dn ]
countryName = CN
stateOrProvinceName = Jiangsu
localityName = Nanjing
organizationName = Test Organization
commonName = server.test.com
EOF

openssl req -new -key server.key -out server.csr -config server_req.cnf

echo "🔏 签发服务器证书..."
openssl ca -config custom_openssl.cnf -extensions server_ext \
  -in server.csr -out server.crt -days 365 -batch -notext

echo "✅ 服务器证书签发完成"

# 生成客户端证书
echo "📱 生成客户端证书..."
openssl genrsa -out client.key 2048

cat > client_req.cnf <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[ dn ]
countryName = CN
stateOrProvinceName = Jiangsu
localityName = Nanjing
organizationName = Test Organization
commonName = client.test.com
EOF

openssl req -new -key client.key -out client.csr -config client_req.cnf

echo "🔏 签发客户端证书..."
openssl ca -config custom_openssl.cnf -extensions client_ext \
  -in client.csr -out client.crt -days 365 -batch -notext

echo "🎉 OpenSSL CA专业管理系统部署完成!"

# 验证和输出信息
echo ""
echo "📊 === 系统输出总结 ==="
echo "🏛️  CA基础设施:"
echo "    📍 根证书:   $(pwd)/$CA_DIR/cacert.pem"
echo "    📍 CA私钥:   $(pwd)/$CA_DIR/private/cakey.pem"
echo "    📍 序列号:   $(pwd)/$CA_DIR/serial"
echo "    📍 证书数据库: $(pwd)/$CA_DIR/index.txt"

echo ""
echo "🖥️  服务器证书:"
echo "    📍 证书文件: $(pwd)/server.crt"
echo "    📍 私钥文件: $(pwd)/server.key"
echo "    📍 证书请求: $(pwd)/server.csr"

echo ""
echo "📱 客户端证书:"
echo "    📍 证书文件: $(pwd)/client.crt"
echo "    📍 私钥文件: $(pwd)/client.key"
echo "    📍 证书请求: $(pwd)/client.csr"

echo ""
echo "🔍 === 证书验证 ==="
echo "验证服务器证书链:"
openssl verify -CAfile $CA_DIR/cacert.pem server.crt && echo "✅ 服务器证书验证通过" || echo "❌ 服务器证书验证失败"

echo "验证客户端证书链:"
openssl verify -CAfile $CA_DIR/cacert.pem client.crt && echo "✅ 客户端证书验证通过" || echo "❌ 客户端证书验证失败"

echo ""
echo "📋 === 证书详细信息 ==="
echo "服务器证书:"
openssl x509 -in server.crt -subject -issuer -dates -noout
echo "扩展用途:"
openssl x509 -in server.crt -text -noout | grep -A5 "X509v3 Extended Key Usage"

echo ""
echo "客户端证书:"
openssl x509 -in client.crt -subject -issuer -dates -noout
echo "扩展用途:"
openssl x509 -in client.crt -text -noout | grep -A5 "X509v3 Extended Key Usage"

echo ""
echo "💼 === 使用场景说明 ==="
echo "🎯 适用场景:"
echo "   ✅ 企业级PKI基础设施"
echo "   ✅ 微服务架构双向TLS认证"
echo "   ✅ 金融级安全通信"
echo "   ✅ 政府机构安全认证"
echo "   ✅ 物联网设备身份认证"

echo ""
echo "🔧 技术特性:"
echo "   🔒 完整的证书链管理"
echo "   📝 证书签发记录追踪"
echo "   🔄 证书吊销列表支持"
echo "   🎯 精确的密钥用途控制"
echo "   🌐 SAN多域名支持"

echo ""
echo "🚀 === 部署示例 ==="
echo "1. Web服务器配置 (Nginx):"
echo "   ssl_certificate $(pwd)/server.crt;"
echo "   ssl_certificate_key $(pwd)/server.key;"
echo "   ssl_client_certificate $(pwd)/$CA_DIR/cacert.pem;"
echo "   ssl_verify_client on;"

echo ""
echo "2. gRPC双向TLS配置:"
echo "   // 服务端验证客户端证书"
echo "   tls.Config{"
echo "       Certificates: []tls.Certificate{serverCert},"
echo "       ClientAuth:   tls.RequireAndVerifyClientCert,"
echo "       ClientCAs:    caCertPool"
echo "   }"

echo ""
echo "3. 客户端使用示例:"
echo "   curl --cert $(pwd)/client.crt --key $(pwd)/client.key"
echo "        --cacert $(pwd)/$CA_DIR/cacert.pem"
echo "        https://server.test.com"

echo ""
echo "⚠️  === 安全注意事项 ==="
echo "   🔐 CA私钥必须离线存储"
echo "   📝 定期更新证书序列号"
echo "   🗑️  支持证书吊销流程"
echo "   🔍 启用证书透明度日志"
echo "   📊 监控证书过期时间"

echo ""
echo "🎉 系统就绪！开始使用企业级证书管理功能。"
```

- **代码签名证书脚本**
```bash
#!/bin/bash
# 文件名: 10_code_signing_cert.sh
# 描述: 生成代码签名证书
# 用途: 软件代码签名、应用签名
# 优点: 专门用于代码签名
# 缺点: 需要特定扩展

set -e

echo "=== 代码签名证书生成脚本 ==="
echo "用途: 生成用于代码签名的证书"
echo "输出: 代码签名证书和私钥"

OUTPUT_DIR="./10_code_signing"
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

# 生成代码签名证书
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout codesign.key -out codesign.crt -days 365 \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=My Software/CN=My Code Signing" \
  -addext "extendedKeyUsage=codeSigning" \
  -addext "keyUsage=digitalSignature"

echo "✅ 代码签名证书生成成功!"
echo "📍 证书文件: $(pwd)/codesign.crt"
echo "📍 私钥文件: $(pwd)/codesign.key"
echo "🔐 用途:"
echo "   - Windows软件签名"
echo "   - macOS应用签名" 
echo "   - Java程序签名"
echo "   - 驱动程序签名"
echo "💡 提示: 代码签名证书需要特定的扩展密钥用法"
```

- **MTLs证书生成脚本1**
```bash
#!/bin/bash

### 生成自签名的 mTLS 证书 ###

set -eu

##### 输出颜色
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
RESET='\e[0m'

##### 检查openssl是否安装
if ! command -v openssl &> /dev/null; then
    echo -e "${RED} openssl 未安装，请先安装 openssl ${RESET}" >&2
    exit 1
fi

##### 配置
CA_PASS="123456"
DAYS=3650
KEY_SIZE=2048
MTLS_PATH="./mtls"
# 获取绝对路径，解决openssl ca命令的路径问题
MTLS_ABS_PATH="$(cd "$(dirname "${MTLS_PATH}")" && pwd)/$(basename "${MTLS_PATH}")"

##### CA 证书信息
CA_COUNTRY_NAME="CN"
CA_PROVINCE_NAME="Beijing"
CA_LOCALITY_NAME="Beijing"
CA_ORGANIZATION_NAME="Freedom"
CA_ORGANIZATIONAL_UNIT="IT Department"
CA_COMMON_NAME="Freedom CA"
CA_EMAIL_ADDRESS="admin@freedom.com"
##### server 证书信息
SRV_COUNTRY_NAME="CN"
SRV_PROVINCE_NAME="Beijing"
SRV_LOCALITY_NAME="Beijing"
SRV_ORGANIZATION_NAME="Freedom"
SRV_ORGANIZATIONAL_UNIT="Server Department"
SRV_COMMON_NAME="server.example.com"
##### client 证书信息
CLT_COUNTRY_NAME="CN"
CLT_PROVINCE_NAME="Beijing"
CLT_LOCALITY_NAME="Beijing"
CLT_ORGANIZATION_NAME="Freedom"
CLT_ORGANIZATIONAL_UNIT="Client Department"
CLT_COMMON_NAME="client.example.com"
TCP_COMMON_NAME="tcp_client.example.com"
HTTP_COMMON_NAME="http_client.example.com"

read -p "请确认是否配置相关证书信息？(y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW} 请先修改脚本中的配置信息，然后重新运行脚本。 ${RESET}"
    exit 0
fi

echo -e "${GREEN} 开始生成 mTLS 证书... ${RESET}"
sleep 1
##### 创建目录
if [[ ! -d "${MTLS_PATH}" ]]; then
    mkdir -p "${MTLS_PATH}"/{ca,server,client,http_client,tcp_client}
fi

echo -e "${GREEN} 开始生成配置文件: ${MTLS_PATH}/ca/ca.cnf ${RESET}"
##### 创建配置文件
# ca.cnf - 使用绝对路径
cat > "${MTLS_PATH}/ca/ca.cnf" << EOF
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ${MTLS_ABS_PATH}/ca
certs             = ${MTLS_ABS_PATH}/ca/certs
crl_dir           = ${MTLS_ABS_PATH}/ca/crl
database          = ${MTLS_ABS_PATH}/ca/index.txt
new_certs_dir     = ${MTLS_ABS_PATH}/ca/newcerts
certificate       = ${MTLS_ABS_PATH}/ca/ca.crt
serial            = ${MTLS_ABS_PATH}/ca/serial
crlnumber         = ${MTLS_ABS_PATH}/ca/crlnumber
crl               = ${MTLS_ABS_PATH}/ca/crl.pem
private_key       = ${MTLS_ABS_PATH}/ca/private/ca.key
RANDFILE          = ${MTLS_ABS_PATH}/ca/private/.rand

x509_extensions   = usr_cert
name_opt          = ca_default
cert_opt          = ca_default
default_days      = 3650
default_crl_days  = 30
default_md        = sha256
preserve          = no
policy            = policy_loose

[ policy_loose ]
countryName             = supplied
stateOrProvinceName     = supplied
localityName            = supplied
organizationName        = supplied
organizationalUnitName  = supplied
commonName              = supplied
emailAddress            = optional

[ req ]
default_bits        = 4096
distinguished_name  = req_distinguished_name
string_mask         = utf8only
default_md          = sha256
x509_extensions     = v3_ca

[ req_distinguished_name ]
countryName                     = ${CA_COUNTRY_NAME}         ## Country Name (2 letter code)
countryName_default             = CN
stateOrProvinceName             = ${CA_PROVINCE_NAME}        ## State or Province Name (full name)
stateOrProvinceName_default     = Beijing
localityName                    = ${CA_LOCALITY_NAME}        ## Locality Name (eg, city)
localityName_default            = Beijing
organizationName                = ${CA_ORGANIZATION_NAME}    ## Organization Name (eg, company)
organizationName_default        = My Company
organizationalUnitName          = ${CA_ORGANIZATIONAL_UNIT}  ## Organizational Unit Name (eg, section)
organizationalUnitName_default  = IT Department
commonName                      = ${CA_COMMON_NAME}          ##Common Name (e.g. server FQDN or YOUR name)
commonName_default              = My Root CA
commonName_max                  = 64
emailAddress                    = ${CA_EMAIL_ADDRESS}        ## Email Address
emailAddress_max                = 64

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ server_cert ]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[ client_cert ]
basicConstraints = CA:FALSE
nsCertType = client
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth

[ usr_cert ]
basicConstraints = CA:FALSE
nsComment = "OpenSSL Generated Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = digitalSignature, nonRepudiation, keyEncipherment
EOF

echo -e "${GREEN} 开始生成配置文件: ${MTLS_PATH}/server/server.cnf ${RESET}"
sleep 1
# server.cnf
cat > ${MTLS_PATH}/server/server.cnf << EOF
[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
req_extensions      = req_ext
default_md          = sha256

[ req_distinguished_name ]
countryName                     = ${SRV_COUNTRY_NAME}         ##Country Name (2 letter code)
countryName_default             = CN
stateOrProvinceName             = ${SRV_PROVINCE_NAME}        ## State or Province Name (full name)
stateOrProvinceName_default     = Beijing
localityName                    = ${SRV_LOCALITY_NAME}        ## Locality Name (eg, city)
localityName_default            = Beijing
organizationName                = ${SRV_ORGANIZATION_NAME}    ## Organization Name (eg, company)
organizationName_default        = My Company
organizationalUnitName          = ${SRV_ORGANIZATIONAL_UNIT}  ## Organizational Unit Name (eg, section)
organizationalUnitName_default  = Server Department
commonName                      = ${SRV_COMMON_NAME}          ## Common Name (e.g. server FQDN or YOUR name)
commonName_default              = server.example.com
commonName_max                  = 64

[ req_ext ]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

## Subject Alternative Names
[ alt_names ]
DNS.1 = localhost
DNS.2 = server.example.com
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
EOF

echo -e "${GREEN} 开始生成配置文件: ${MTLS_PATH}/client/client.cnf ${RESET}"
sleep 1
# client.cnf
cat > ${MTLS_PATH}/client/client.cnf << EOF
[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
req_extensions      = req_ext
default_md          = sha256

[ req_distinguished_name ]
countryName                     = ${CLT_COUNTRY_NAME}         ##Country Name (2 letter code)
countryName_default             = CN
stateOrProvinceName             = ${CLT_PROVINCE_NAME}        ## State or Province Name (full name)
stateOrProvinceName_default     = Beijing
localityName                    = ${CLT_LOCALITY_NAME}        ## Locality Name (eg, city)
localityName_default            = Beijing
organizationName                = ${CLT_ORGANIZATION_NAME}    ## Organization Name (eg, company)
organizationName_default        = My Company
organizationalUnitName          = ${CLT_ORGANIZATIONAL_UNIT}  ## Organizational Unit Name (eg, section)
organizationalUnitName_default  = Client Department
commonName                      = ${CLT_COMMON_NAME}          ## Common Name (e.g. server FQDN or YOUR name)
commonName_default              = client.example.com
commonName_max                  = 64

[ req_ext ]
basicConstraints = CA:FALSE
nsCertType = client
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

echo -e "${GREEN} 开始初始化 CA 根目录 ${RESET}"
sleep 1
##### 初始化ca根目录
if [[ ! -d "${MTLS_PATH}/ca/certs" ]]; then
    mkdir -p "${MTLS_PATH}/ca/certs" "${MTLS_PATH}/ca/crl" "${MTLS_PATH}/ca/newcerts" "${MTLS_PATH}/ca/private"
    touch "${MTLS_PATH}/ca/index.txt"
    echo 1000 > "${MTLS_PATH}/ca/serial"
    echo 1000 > "${MTLS_PATH}/ca/crlnumber"
fi  

##### 设置证书密码文件
echo -e "${GREEN} 开始设置 CA 证书密码文件 ${RESET}"
sleep 1
echo "${CA_PASS}" > "/tmp/ca_pass.txt"
chmod 600 "/tmp/ca_pass.txt"

echo -e "${GREEN} 开始生成 CA 证书、服务器证书和客户端证书 ${RESET}"
sleep 1
##### 生成 CA 私钥和自签名证书
if [[ ! -f "${MTLS_PATH}/ca/private/ca.key" ]]; then
    echo -e "${YELLOW} 生成 CA 私钥... ${RESET}"
    # 生成私钥
    openssl genrsa -aes256 -out ${MTLS_PATH}/ca/private/ca.key -passout file:/tmp/ca_pass.txt 4096

    echo -e "${YELLOW} 生成 CA 自签名根证书... ${RESET}"
    # 生成自签名根证书
    openssl req -config ${MTLS_PATH}/ca/ca.cnf \
    -key ${MTLS_PATH}/ca/private/ca.key \
    -new -x509 -days 7300 -sha256 -extensions v3_ca \
    -out ${MTLS_PATH}/ca/ca.crt \
    -passin file:/tmp/ca_pass.txt

    # 查看根证书
    echo -e "${YELLOW} CA 证书信息: ${RESET}"
    openssl x509 -in ${MTLS_PATH}/ca/ca.crt -text -noout | head -20
fi

echo -e "${GREEN} 开始生成服务器证书 ${RESET}"
sleep 1
##### 生成服务器私钥和CSR并使用 CA 签名服务器证书
if [[ ! -f "${MTLS_PATH}/server/server.key" ]]; then
    echo -e "${YELLOW} 生成服务器私钥... ${RESET}"
    # 生成私钥
    openssl genrsa -out ${MTLS_PATH}/server/server.key ${KEY_SIZE}

    echo -e "${YELLOW} 生成服务器证书签名请求（CSR）... ${RESET}"
    # 生成证书签名请求（CSR）
    openssl req -config ${MTLS_PATH}/server/server.cnf \
    -key ${MTLS_PATH}/server/server.key \
    -new -sha256 \
    -out ${MTLS_PATH}/server/server.csr \
    -batch  # 使用batch模式避免交互

    echo -e "${YELLOW} 使用 CA 签署服务器证书... ${RESET}"
    # 创建一个包含SAN扩展的配置文件
    cat > /tmp/server_ext.cnf << EOF
[ server_san ]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
DNS.2 = server.example.com
IP.1 = 127.0.0.1
IP.2 = 192.168.1.100
EOF
    
    # 使用 CA 签署服务器证书，使用-batch模式避免交互
    openssl ca -config ${MTLS_PATH}/ca/ca.cnf \
    -days ${DAYS} -notext -md sha256 \
    -passin file:/tmp/ca_pass.txt \
    -in ${MTLS_PATH}/server/server.csr \
    -out ${MTLS_PATH}/server/server.crt \
    -extfile /tmp/server_ext.cnf \
    -extensions server_san \
    -batch  # 添加batch模式避免交互式输入

    rm -f /tmp/server_ext.cnf

    # 查看服务器证书
    echo -e "${YELLOW} 服务器证书信息: ${RESET}"
    openssl x509 -in ${MTLS_PATH}/server/server.crt -text -noout | head -30

    # 验证服务器证书是否正确签署
    echo -e "${YELLOW} 验证服务器证书... ${RESET}"
    openssl verify -CAfile ${MTLS_PATH}/ca/ca.crt ${MTLS_PATH}/server/server.crt

    # 将证书和私钥合并为PEM格式（用于某些服务）
    cat ${MTLS_PATH}/server/server.crt ${MTLS_PATH}/server/server.key > ${MTLS_PATH}/server/server.pem
    echo -e "${GREEN} 服务器证书生成完成 ${RESET}"
fi

echo -e "${GREEN} 开始生成客户端证书 ${RESET}"
sleep 1
##### 生成客户端私钥和CSR并使用 CA 签名客户端证书
if [[ ! -f "${MTLS_PATH}/client/client.key" ]]; then
    echo -e "${YELLOW} 生成客户端私钥... ${RESET}"
    # 生成私钥
    openssl genrsa -out ${MTLS_PATH}/client/client.key ${KEY_SIZE}

    echo -e "${YELLOW} 生成客户端证书签名请求（CSR）... ${RESET}"
    # 生成证书签名请求（CSR）
    openssl req -config ${MTLS_PATH}/client/client.cnf \
    -key ${MTLS_PATH}/client/client.key \
    -new -sha256 \
    -out ${MTLS_PATH}/client/client.csr \
    -batch  # 使用batch模式避免交互
    
    echo -e "${YELLOW} 使用 CA 签署客户端证书... ${RESET}"
    # 使用 CA 签署客户端证书，使用-batch模式避免交互
    openssl ca -config ${MTLS_PATH}/ca/ca.cnf \
    -days ${DAYS} -notext -md sha256 \
    -passin file:/tmp/ca_pass.txt \
    -in ${MTLS_PATH}/client/client.csr \
    -out ${MTLS_PATH}/client/client.crt \
    -extensions client_cert \
    -batch  # 添加batch模式避免交互式输入

    # 查看客户端证书
    echo -e "${YELLOW} 客户端证书信息: ${RESET}"
    openssl x509 -in ${MTLS_PATH}/client/client.crt -text -noout | head -20

    # 验证客户端证书是否正确签署
    echo -e "${YELLOW} 验证客户端证书... ${RESET}"
    openssl verify -CAfile ${MTLS_PATH}/ca/ca.crt ${MTLS_PATH}/client/client.crt

    echo -e "${YELLOW} 创建P12格式（用于浏览器等）... ${RESET}"
    # 创建P12格式（用于浏览器等）
    openssl pkcs12 -export \
    -in ${MTLS_PATH}/client/client.crt \
    -inkey ${MTLS_PATH}/client/client.key \
    -out ${MTLS_PATH}/client/client.p12 \
    -name "Client Certificate" \
    -passout pass:

    # 将证书和私钥合并为PEM格式（用于某些服务）
    cat ${MTLS_PATH}/client/client.crt ${MTLS_PATH}/client/client.key > ${MTLS_PATH}/client/client.pem
    echo -e "${GREEN} 客户端证书生成完成 ${RESET}"
fi

echo -e "${GREEN} 开始生成 HTTP 客户端证书 ${RESET}"
sleep 1
##### 生成 HTTP 客户端证书
if [[ ! -f "${MTLS_PATH}/http_client/http_client.key" ]]; then
    echo -e "${YELLOW} 生成 HTTP 客户端私钥... ${RESET}"
    # 复制 client.cnf 作为 http_client.cnf
    cp ${MTLS_PATH}/client/client.cnf ${MTLS_PATH}/http_client/http_client.cnf
    # 修改CN为HTTP客户端
    sed -i "s/${CLT_COMMON_NAME}/${HTTP_COMMON_NAME}/g" ${MTLS_PATH}/http_client/http_client.cnf
    
    # 生成私钥和CSR
    openssl genrsa -out ${MTLS_PATH}/http_client/http_client.key ${KEY_SIZE}
    
    openssl req -config ${MTLS_PATH}/http_client/http_client.cnf \
    -key ${MTLS_PATH}/http_client/http_client.key \
    -new -sha256 \
    -out ${MTLS_PATH}/http_client/http_client.csr \
    -batch  # 使用batch模式避免交互
    
    echo -e "${YELLOW} 使用 CA 签署 HTTP 客户端证书... ${RESET}"
    # 使用 CA 签署 HTTP 客户端证书，使用-batch模式避免交互
    openssl ca -config ${MTLS_PATH}/ca/ca.cnf \
    -days ${DAYS} -notext -md sha256 \
    -passin file:/tmp/ca_pass.txt \
    -in ${MTLS_PATH}/http_client/http_client.csr \
    -out ${MTLS_PATH}/http_client/http_client.crt \
    -extensions client_cert \
    -batch  # 添加batch模式避免交互式输入
    
    # 创建pem格式
    cat ${MTLS_PATH}/http_client/http_client.crt ${MTLS_PATH}/http_client/http_client.key > ${MTLS_PATH}/http_client/http_client.pem
    echo -e "${GREEN} HTTP 客户端证书生成完成 ${RESET}"
fi

echo -e "${GREEN} 开始生成 TCP 客户端证书 ${RESET}"
sleep 1
##### 生成 TCP 客户端证书
if [[ ! -f "${MTLS_PATH}/tcp_client/tcp_client.key" ]]; then
    echo -e "${YELLOW} 生成 TCP 客户端私钥... ${RESET}"
    # 复制 client.cnf 作为 tcp_client.cnf
    cp ${MTLS_PATH}/client/client.cnf ${MTLS_PATH}/tcp_client/tcp_client.cnf
    # 修改CN为TCP客户端
    sed -i "s/${CLT_COMMON_NAME}/${TCP_COMMON_NAME}/g" ${MTLS_PATH}/tcp_client/tcp_client.cnf
    
    # 生成私钥和CSR
    openssl genrsa -out ${MTLS_PATH}/tcp_client/tcp_client.key ${KEY_SIZE}
    
    openssl req -config ${MTLS_PATH}/tcp_client/tcp_client.cnf \
    -key ${MTLS_PATH}/tcp_client/tcp_client.key \
    -new -sha256 \
    -out ${MTLS_PATH}/tcp_client/tcp_client.csr \
    -batch  # 使用batch模式避免交互
    
    echo -e "${YELLOW} 使用 CA 签署 TCP 客户端证书... ${RESET}"
    # 使用 CA 签署 TCP 客户端证书，使用-batch模式避免交互
    openssl ca -config ${MTLS_PATH}/ca/ca.cnf \
    -days ${DAYS} -notext -md sha256 \
    -passin file:/tmp/ca_pass.txt \
    -in ${MTLS_PATH}/tcp_client/tcp_client.csr \
    -out ${MTLS_PATH}/tcp_client/tcp_client.crt \
    -extensions client_cert \
    -batch  # 添加batch模式避免交互式输入
    
    # 创建pem格式
    cat ${MTLS_PATH}/tcp_client/tcp_client.crt ${MTLS_PATH}/tcp_client/tcp_client.key > ${MTLS_PATH}/tcp_client/tcp_client.pem
    echo -e "${GREEN} TCP 客户端证书生成完成 ${RESET}"
fi

echo -e "${GREEN} 清理临时文件 ${RESET}"
sleep 1
if [[ -f "/tmp/ca_pass.txt" ]]; then
    rm -f /tmp/ca_pass.txt
fi

echo -e "${GREEN} ======================================= ${RESET}"
echo -e "${GREEN} mTLS 证书生成完成！ ${RESET}"
echo -e "${GREEN} ======================================= ${RESET}"
echo -e "${YELLOW} 生成的证书位置: ${MTLS_PATH} ${RESET}"
echo -e "${YELLOW} 根证书: ${MTLS_PATH}/ca/ca.crt ${RESET}"
echo -e "${YELLOW} 服务器证书: ${MTLS_PATH}/server/server.crt ${RESET}"
echo -e "${YELLOW} 服务器私钥: ${MTLS_PATH}/server/server.key ${RESET}"
echo -e "${YELLOW} 客户端证书: ${MTLS_PATH}/client/client.crt ${RESET}"
echo -e "${YELLOW} 客户端私钥: ${MTLS_PATH}/client/client.key ${RESET}"
echo -e "${YELLOW} HTTP客户端证书: ${MTLS_PATH}/http_client/http_client.crt ${RESET}"
echo -e "${YELLOW} TCP客户端证书: ${MTLS_PATH}/tcp_client/tcp_client.crt ${RESET}"
echo -e "${YELLOW} HTTP客户端pem: ${MTLS_PATH}/http_client/http_client.pem ${RESET}"
echo -e "${GREEN} ======================================= ${RESET}"
```

- **MTLs证书生成脚本2**
```bash
#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PKI_DIR="$BASE_DIR/pki"
CA_DIR="$PKI_DIR/ca"
CNF="$PKI_DIR/openssl.cnf"

KEY_TYPE="${KEY_TYPE:-rsa}"      # rsa | ec
RSA_BITS=2048
EC_CURVE=prime256v1
DAYS=3650

mkdir -p "$PKI_DIR"/{ca,certs}
touch "$PKI_DIR/ca/index.txt"
[[ -f "$PKI_DIR/ca/serial" ]] || echo 1000 > "$PKI_DIR/ca/serial"
[[ -f "$PKI_DIR/ca/crlnumber" ]] || echo 1000 > "$PKI_DIR/ca/crlnumber"

if [[ ! -f "$CNF" ]]; then
cat > "$CNF" <<EOF
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = $CA_DIR
database          = $CA_DIR/index.txt
new_certs_dir     = $CA_DIR
certificate       = $CA_DIR/ca.crt
serial            = $CA_DIR/serial
crlnumber         = $CA_DIR/crlnumber
crl               = $CA_DIR/crl.pem
private_key       = $CA_DIR/ca.key
default_md        = sha256
policy            = policy_strict
default_days      = 3650
default_crl_days  = 30
x509_extensions   = usr_cert

[ policy_strict ]
countryName             = supplied
organizationName        = supplied
organizationalUnitName  = supplied
commonName              = supplied

[ req ]
default_md = sha256
prompt = no
distinguished_name = dn

[ dn ]
C  = CN
O  = Freedom
OU = PKI
CN = unused

############################
# Extensions
############################

[ v3_ca ]
basicConstraints = critical,CA:TRUE
keyUsage = critical,keyCertSign,cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer

[ server_cert ]
basicConstraints = CA:FALSE
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @server_san

[ server_san ]
# 暴露给客户端访问的地址,请根据实际情况修改
# 当server有多个地址时,DNS和IP可以增加多个条目
# 但是建议使用DNS解析到负载均衡器IP,避免直接暴露服务器IP
DNS.1 = server.example.com
IP.1  = 127.0.0.1

[ client_cert ]
basicConstraints = CA:FALSE
keyUsage = critical,digitalSignature
extendedKeyUsage = clientAuth
subjectAltName = @client_san

[ client_san ]
URI.1 = spiffe://freedom/client
EOF
fi

read -p "请确认是否进行了相关配置？(y/n): " confirm
[[ "$confirm" != "y" ]] && echo "请先进行相关配置后再运行此脚本。" && exit 1
read -s -p "请输入 CA 私钥密码: " CA_PASS
echo
export CA_PASS

gen_key() {
  local out=$1
  if [[ "$KEY_TYPE" == "ec" ]]; then
    openssl ecparam -genkey -name "$EC_CURVE" -out "$out"
  else
    openssl genrsa -out "$out" "$RSA_BITS"
  fi
}

################################
# CA
################################
if [[ ! -f "$PKI_DIR/ca/ca.key" ]]; then
  echo ">> 生成 CA 私钥"
  gen_key "$PKI_DIR/ca/ca.key"

  echo ">> 生成 CA 证书"
  openssl req -new -x509 \
    -config "$CNF" \
    -extensions v3_ca \
    -key "$PKI_DIR/ca/ca.key" \
    -days "$DAYS" \
    -out "$PKI_DIR/ca/ca.crt"
fi

################################
# Issue server cert
################################
issue_server() {
  local name=$1
  local key="$PKI_DIR/certs/$name.key"
  local csr="$PKI_DIR/certs/$name.csr"
  local crt="$PKI_DIR/certs/$name.crt"

  gen_key "$key"

  openssl req -new \
    -key "$key" \
    -subj "/C=CN/O=Freedom/OU=SERVER/CN=$name" \
    -out "$csr"

  openssl ca \
    -config "$CNF" \
    -extensions server_cert \
    -in "$csr" \
    -out "$crt" \
    -batch

  rm -f "$csr"
}

################################
# Issue client cert
################################
issue_client() {
  local name=$1
  local uri=$2
  local key="$PKI_DIR/certs/$name.key"
  local csr="$PKI_DIR/certs/$name.csr"
  local crt="$PKI_DIR/certs/$name.crt"

  gen_key "$key"

  openssl req -new \
    -key "$key" \
    -subj "/C=CN/O=Freedom/OU=CLIENT/CN=$name" \
    -out "$csr"

  openssl ca \
    -config "$CNF" \
    -extensions client_cert \
    -in "$csr" \
    -out "$crt" \
    -batch

  rm -f "$csr"
}

################################
# Revoke
################################
revoke() {
  local crt=$1
  openssl ca -config "$CNF" -revoke "$crt"
  openssl ca -config "$CNF" -gencrl -out "$PKI_DIR/ca/crl.pem"
}

################################
# Main 这里调用函数生成证书
################################
issue_server server
issue_client client-http "spiffe://freedom/http"
issue_client client-tcp  "spiffe://freedom/tcp"

openssl verify -CAfile "$PKI_DIR/ca/ca.crt" "$PKI_DIR/certs/server.crt"

echo "✔ PKI ready"
```
