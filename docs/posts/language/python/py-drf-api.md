---
title: Python DRF
prev:
    text: Python FastAPI
    link:  /posts/language/python/fastapi
next:
    text: Python 标准库 asyncio
    link: ./asyncio
---

##### 接口访问示例

```shell
# 注册
curl -X POST http://127.0.0.1:8886/api/users/register/ -H "Content-Type: application/json" -d '{"username":"zhangsan","password":"123456"}'
# 登录
curl -X POST http://127.0.0.1:8886/api/users/login/ -H "Content-Type: application/json"      -d '{"username":"zhangsan","password":"123456"}'
# 查询(登录登录接口返回的token,进行查询)
curl -X GET http://127.0.0.1:8886/api/users/ -H "Authorization: Token eyJ1c2VyX2lkIjoxfQ.aO2wog.tZxCADvii2KiBbOyx1IvLy-VYr8"
 ```