##### 

- **清单资源**
```python
## inventory.py

# web组
web = [
    ("192.168.165.83", {"env": "prod"})
]

# api组
api = [
    ("192.168.165.84", {"env": "dev"}),
    ("192.168.165.85", {"env": "dev"}),
]

# 查看资产清单: pyinfra inventory.py debug-inventory
```
