---
prev: false
next:
  text: 回到v2ray
  link: ./v2ray
---

##### V2ray 配置生成

```shell
#!/usr/bin/bash

##### 从官网(github)下载已经已经编译好的v2ray软件包
##### 解压到/etc/v2ray: unzip v2ray-linux-64.zip -d /etc/v2ray
##### 目录结构如下:
##### /etc/v2ray/
##### ├── config.json
##### ├── geoip.dat
##### ├── geoip-only-cn-private.dat
##### ├── geosite.dat
##### ├── systemd
##### │   └── system
##### │       ├── v2ray.service
##### │       └── v2ray@.service
##### ├── v2ray
##### ├── vpoint_socks_vmess.json
##### └── vpoint_vmess_freedom.json

set -e

## v2ray配置
V2RAY_HOME_PATH=/etc/v2ray
V2RAY_LOG_PATH="${V2RAY_HOME_PATH}/logs"
V2RAY_SERVER_IP=
V2RAY_SERVER_PORT=6868
V2RAY_SERVER_CONF_PATH="${V2RAY_HOME_PATH}/server"
V2RAY_CLIENT_PORT=8080
V2RAY_CLIENT_CONF_PATH="${V2RAY_HOME_PATH}/client"
UUID_VALUES_1=$("${V2RAY_HOME_PATH}/v2ray" uuid)
UUID_VALUES_2=$("${V2RAY_HOME_PATH}/v2ray" uuid)
UUID_VALUES_3=$("${V2RAY_HOME_PATH}/v2ray" uuid)

if [[ -z "${V2RAY_HOME_PATH}" ]];then
    echo "请先配置v2ray安装路径!"
    exit
fi

if [[ -z "${V2RAY_SERVER_IP}" ]];then
    echo "请先设置v2ray服务IP!"
    exit
fi

if [[ ! -d "${V2RAY_LOG_PATH}" ]];then
    mkdir -p "${V2RAY_LOG_PATH}"
fi

_client() {
if [[ ! -d "${V2RAY_CLIENT_CONF_PATH}" ]];then
    mkdir -p "${V2RAY_CLIENT_CONF_PATH}"
fi
# inbounds字段配置
cat <<EOF >"${V2RAY_CLIENT_CONF_PATH}/inbounds.json"
{
  "inbounds": [
    {
      "port": ${V2RAY_CLIENT_PORT},
      "protocol": "http",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      }
    }
  ]
}
EOF
# outbounds字段配置
cat <<EOF >"${V2RAY_CLIENT_CONF_PATH}/outbounds.json"
{
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "${V2RAY_SERVER_IP}",
            "port": ${V2RAY_SERVER_PORT},
            "users": [
              {
                "id": "${UUID_VALUES_1}"
              }
            ]
          }
        ]
      }
    }
  ]
}
EOF
# 使用示例
echo "${V2RAY_HOME_PATH}/v2ray test -d ${V2RAY_CLIENT_CONF_PATH}"
echo "${V2RAY_HOME_PATH}/v2ray run -d ${V2RAY_CLIENT_CONF_PATH}"
}

_server() {
if [[ ! -d "${V2RAY_SERVER_CONF_PATH}" ]];then
    mkdir -p "${V2RAY_SERVER_CONF_PATH}"
fi
# log字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/log.json"
{
  "log": {
    "access": "${V2RAY_LOG_PATH}/access.log",
    "error": "${V2RAY_LOG_PATH}/error.log",
    "loglevel": "info"
  }
}
EOF
# api字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/api.json"
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
# dns 字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/dns.json"
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
# inbounds字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/inbounds.json"
{
  "inbounds": [
    {
      "port": ${V2RAY_SERVER_PORT},
      "protocol": "vmess",
      "listen": "${V2RAY_SERVER_IP}",
      "settings": {
        "clients": [
          {
            "id": "${UUID_VALUES_1}",
            "alterId": 0
          },
          {
            "id": "${UUID_VALUES_2}",
            "alterId": 0
          },
          {
            "id": "${UUID_VALUES_3}",
            "altrId": 0
          }
        ]
      }
    }
  ]
}
EOF
# outbounds字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/outbounds.json"
{
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
EOF
# routing字段配置
cat <<EOF >"${V2RAY_SERVER_CONF_PATH}/routing.json"
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
# 使用示例
echo "${V2RAY_HOME_PATH}/v2ray test -d ${V2RAY_SERVER_CONF_PATH}"
echo "${V2RAY_HOME_PATH}/v2ray run -d ${V2RAY_SERVER_CONF_PATH}"
}

_help() {
if [[ -z $1 ]];then
    echo "Usage: $0 server|client"
    echo "  server  生成服务端配置"
    echo "  client  生成客户端配置"
    exit
fi
}

if [[ $1 == "server" ]];then
    _server
    exit
fi

if [[ $1 == "client" ]];then
    _client
    exit
fi

_help
```