#!/bin/bash

set -e

: """
# ## .env
V2RAY_PORT=8080
V2RAY_LISTEN_ADDR="127.0.0.1"
V2RAY_PATH="/opt/app"
V2RAY_WORK_DIR="${V2RAY_PATH}/v2ray"
V2RAY_CONFIG_FILE="${V2RAY_WORK_DIR}/config.json"
V2RAY_CONFIG_DIR="${V2RAY_WORK_DIR}/configs/"
V2RAY_CLIENT_UUID1=cd8b8eb8-0849-420a-8c66-4d84f938cb27
V2RAY_CLIENT_UUID2=a8c97892-d1ac-95c5-9bec-cae7d01e3e51
V2RAY_CLIENT_UUID3=b0e35abb-ebd3-8438-305b-36c8e7fd0956
"""

## 服务器主机生成 V2Ray 5.38.0 服务配置
## 测试: v2ray test -c ${V2RAY_CONFIG_FILE} -d ${V2RAY_CONFIG_DIR}
## 运行: v2ray run  -c ${V2RAY_CONFIG_FILE} -d ${V2RAY_CONFIG_DIR}

# 生成协议类型
XY_TYPE=${1:-'vmess'}

### 生成 V2Ray 配置文件
ENV_FILE=${2:-'.env'}
if [ ! -f "$ENV_FILE" ]; then
    echo "环境变量文件 $ENV_FILE 不存在！"
    exit 1
fi
source "$ENV_FILE"

##### 校验环境变量
# 端口
: "${V2RAY_PORT:?请在 $ENV_FILE 中设置 V2RAY_PORT 环境变量}"
# 监听地址
: "${V2RAY_LISTEN_ADDR:?请在 $ENV_FILE 中设置 V2RAY_LISTEN_ADDR 环境变量}"
# V2Ray 安装路径
: "${V2RAY_PATH:?请在 $ENV_FILE 中设置 V2RAY_PATH 环境变量}"
# V2Ray 工作目录
: "${V2RAY_WORK_DIR:?请在 $ENV_FILE 中设置 V2RAY_WORK_DIR 环境变量}"
# V2Ray 配置文件路径
: "${V2RAY_CONFIG_FILE:?请在 $ENV_FILE 中设置 V2RAY_CONFIG_FILE 环境变量}"
# V2Ray 配置目录
: "${V2RAY_CONFIG_DIR:?请在 $ENV_FILE 中设置 V2RAY_CONFIG_DIR 环境变量}"

: "
v2ray/
├── config.json                   # 主配置文件（仅包含引用）
├── configs/                      # 配置片段目录
│   ├── 00_base.json              # 基础配置
│   ├── 01_log.json               # 日志配置
│   ├── 02_policy.json            # 策略配置
│   ├── 03_inbounds.json          # 入站配置
│   ├── 04_outbounds.json         # 出站配置
│   ├── 05_routing.json           # 路由配置
│   └── 06_dns.json               # DNS配置（可选）
└── v2ray                         # V2Ray 可执行文件
"
# 按照上面的目录结构创建配置文件
if [ ! -d "$V2RAY_WORK_DIR" ]; then
    echo "请先下载 V2Ray 并解压到 $V2RAY_PATH 目录下！"
    exit 1
fi

if [ ! -d "$V2RAY_CONFIG_DIR" ]; then
    mkdir -p "$V2RAY_CONFIG_DIR"
fi

if [ -f "$V2RAY_CONFIG_FILE" ]; then
    mv "$V2RAY_CONFIG_FILE" "$V2RAY_WORK_DIR/config.json.bak" 
fi

## vless协议
function _vless() {
# 生成主配置文件
cat > "$V2RAY_CONFIG_FILE" << EOF
{
  "log": {},
  "policy": {},
  "inbounds": [],
  "outbounds": [],
  "routing": {},
  "dns": {}
}
EOF

# 生成配置片段文件
cat > "${V2RAY_CONFIG_DIR}/00_base.json" << EOF
{
  "stats": {},
  "reverse": {},
  "observatory": {}
}
EOF

cat > "${V2RAY_CONFIG_DIR}/01_log.json" << EOF
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warning"
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/02_policy.json" << EOF
{
  "policy": {
    "levels": {
      "0": {
        "handshake": 8,
        "connIdle": 600,
        "uplinkOnly": 10,
        "downlinkOnly": 10,
        "statsUserUplink": true,
        "statsUserDownlink": true,
        "bufferSize": 524288
      }
    },
    "system": {
      "statsInboundUplink": false,
      "statsInboundDownlink": false
    }
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/03_inbounds.json" << EOF
{
  "inbounds": [
    {
      "port": $V2RAY_PORT,
      "protocol": "vless",
      "listen": "$V2RAY_LISTEN_ADDR",
      "settings": {
        "decryption": "none",
        "clients": [
          {
            "id": "$V2RAY_CLIENT_UUID1",
            "level": 0
          },
          {
            "id": "$V2RAY_CLIENT_UUID2",
            "level": 0
          },
          {
            "id": "$V2RAY_CLIENT_UUID3",
            "level": 0
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "none",
        "tcpSettings": {
          "acceptProxyProtocol": false
        },
        "tlsSettings": {
          "alpn": ["h2", "http/1.1"],
          "disableSessionResumption": false
        }
      }
    }
  ]
}
EOF

cat > "${V2RAY_CONFIG_DIR}/04_outbounds.json" << EOF
{
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct",
      "settings": {
        "domainStrategy": "UseIP"
      }
    }
  ]
}
EOF

cat > "${V2RAY_CONFIG_DIR}/05_routing.json" << EOF
{
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": ["geoip:cn"],
        "outboundTag": "direct"
      }
    ]
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/06_dns.json" << EOF
{
  "dns": {
    "servers": [
      {
        "address": "223.5.5.5",
        "domains": ["geosite:cn"]
      },
      "1.1.1.1"
    ],
    "queryStrategy": "UseIP"
  }
}
EOF
}

## vmess协议
function _vmess() {
cat > "${V2RAY_CONFIG_DIR}/api.json" << EOF
{
  "api": {
    "tag": "server-endpoint",
    "services": [
      "HandlerService",
      "LoggerService",
      "StatsService"
    ]
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/dns.json" << EOF
{
  "dns": {
    "tag": "dns-srv",
    "hosts": {
      "google.com": "google.com"
    },
    "servers": [
      {
        "address": "",
        "port": 5353,
        "domains": [
          "domain:v2ray.com"
        ],
        "expectIPs": [
          "geoip:cn"
        ]
      }
    ]
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/inbounds.json" << EOF
{
  "inbounds": [
    {
      "port": ${V2RAY_PORT},
      "protocol": "vmess",
      "listen": "${V2RAY_LISTEN_ADDR}",
      "settings": {
        "clients": [
          {
            "id": "${V2RAY_CLIENT_UUID1}",
            "alterId": 0
          },
          {
            "id": "${V2RAY_CLIENT_UUID2}",
            "alterId": 0
          },
          {
            "id": "${V2RAY_CLIENT_UUID3}",
            "altrId": 0
          }
        ]
      }
    }
  ]
}
EOF

cat > "${V2RAY_CONFIG_DIR}/log.json" << EOF
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "info"
  }
}
EOF

cat > "${V2RAY_CONFIG_DIR}/outbounds.json" << EOF
{
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
EOF

cat > "${V2RAY_CONFIG_DIR}/routing.json" << EOF
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "outboundTag": "direct",
        "ip": ["geoip:cn"]
      },
      {
	"type": "field",
	"ip": [
	  "geoip:private"
        ],
	"outboundTag": "direct"
      }
    ]
  }
}
EOF
}

[[ "$1" == "vmess" ]] && _vmess && echo "生成 vmess 协议配置" && exit
[[ "$1" == "vless" ]] && _vless && echo "生成 vless 协议配置" && exit
echo "Usage: $1 [vmess|vless] env_file"