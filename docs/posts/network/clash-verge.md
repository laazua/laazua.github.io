---
prev: false
next: false
---

### clash verge (version: 2.5.2)


---
##### 分流配置过程(国内直连,国外代理)
- 右键订阅 -> 编辑规则 -> 高级
```yaml
prepend:
  - 'IP-CIDR,127.0.0.0/8,DIRECT,no-resolve'
  - 'IP-CIDR,10.0.0.0/8,DIRECT,no-resolve'
  - 'IP-CIDR,172.16.0.0/12,DIRECT,no-resolve'
  - 'IP-CIDR,192.168.0.0/16,DIRECT,no-resolve'
  - 'IP-CIDR6,::1/128,DIRECT,no-resolve'
  - 'IP-CIDR6,fc00::/7,DIRECT,no-resolve'
  - 'IP-CIDR6,fe80::/10,DIRECT,no-resolve'
  - 'DOMAIN-SUFFIX,bilibili.com,DIRECT'
  - 'DOMAIN-SUFFIX,biliapi.net,DIRECT'
  - 'DOMAIN-SUFFIX,bilivideo.com,DIRECT'
  - 'DOMAIN-SUFFIX,bilivideo.cn,DIRECT'
  - 'GEOSITE,CN,DIRECT'
  - 'GEOIP,CN,DIRECT,no-resolve'
  - 'MATCH,♻️ 自动选择' # 这里的自带选择要在【编辑代理组】配置
append: []
delete: []

```

---
##### 自带选择延迟低的节点
- 右键订阅 -> 编辑代理组 -> 高级
```yaml
prepend:
  - name: '♻️ 自动选择' # 用于上面的编辑规则
    type: 'url-test'
    include-all: true
    url: 'https://www.gstatic.com/generate_204'
    interval: 300
    tolerance: 50
    lazy: true
append: []
delete: []
```

---
##### 两个可用的订阅链接
```text
https://raw.githubusercontent.com/cbusifabcap/daily_free_vpn/refs/heads/main/sub/Clash.yml
https://gh-proxy.org/https://raw.githubusercontent.com/cbusifabcap/daily_free_vpn/refs/heads/main/sub/Clash.yml
```
