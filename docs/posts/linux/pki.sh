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
