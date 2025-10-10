### v2ray 部署

- **服务端配置**
```json
{
    "log": {
        "access": "/var/log/v2ray/access.log",
        "error": "/var/log/v2ray/error.log",
        "loglevel": "info"
    },
    "api": {
        "tag": "server-endpoint",
        "services": [
            "HandlerService",
            "LoggerService",
            "StatsService"
        ]
    },
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
    },
    "inbounds": [
        {
            "port": 6686,
            "protocol": "vmess",
            "listen": "ip address",
            "settings": {
                "clients": [
                    {
                        "id": "cd8b8eb8-0949-420a-8c66-4d84f938cb2x",
                        "alterId": 0
                    },
                    {
                        "id": "a8c97892-d2ac-95c5-0bec-cae7d01e3e51",
                        "alterId": 0
                    },
                    {
                        "id": "b0e35abb-abd3-8438-805b-36c8e7fd0956",
                        "altrId": 0
                    }
                ]
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        },
    ],
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
```

- **客户端配置**
```json
{
  "inbounds": [
    {
      "port": 8080,
      "protocol": "http",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "v2ray service IP",
            "port": 6686,
            "users": [
              {
                "id": "a8c97892-d1ac-05c5-9bec-aae7d01e3e51"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

- **部署**
1. 分别在服务端和客户端部署v2ray,从官网下载已经编译好的文件
2. 修改上面的服务端和客户端配置，分别在服务端和客户端启动v2ray