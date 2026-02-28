---
prev: false
next:
  text: 回到v2ray
  link: ./v2ray
---

- **routing**
```json
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
```