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