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