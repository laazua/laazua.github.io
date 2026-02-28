---
prev: false
next:
  text: 回到v2ray
  link: ./v2ray
---

- **inbounds**
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
  ]
}
```