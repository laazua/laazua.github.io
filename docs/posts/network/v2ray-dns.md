---
prev: false
next:
  text: 回到v2ray
  link: ./v2ray
---

- **dns**
```json
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
```