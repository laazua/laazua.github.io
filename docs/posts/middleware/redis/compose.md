---
prev: false
next: false
---

### compose配置
```yaml
---
services:
  redis:
    # 官方推荐使用alpine版本，镜像更小
    image: redis:7.2-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      # 映射到主机端口，如果仅内部使用可以删除这行
      - "6379:6379"
    volumes:
      # 持久化数据存储
      - ./data:/data
      # 如果需要自定义配置，可以挂载配置文件
      # - ./redis.conf:/usr/local/etc/redis/redis.conf
    #command: >
      #redis-server 
      # 如果挂载了配置文件，则使用下面这行
      # redis-server /usr/local/etc/redis/redis.conf
      # --appendonly yes
      # --requirepass yourpassword  # 生产环境建议设置密码
    environment:
      - TZ=Asia/Shanghai  # 设置时区
```