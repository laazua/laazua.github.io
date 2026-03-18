---
prev: false
next: false
---

### compose配置
```yaml
services:
  mongodb:
    # 使用官方推荐的 MongoDB 7.0 版本 (当前最新稳定版)
    image: mongo:7.0
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      # 数据持久化
      - mongo_data:/data/db
      # 配置文件挂载目录（可选）
      # - ./mongod.conf:/etc/mongo/mongod.conf
      # 初始化脚本目录（可选，放置.js或.sh文件）
      # - ./init:/docker-entrypoint-initdb.d
    environment:
      # 默认不需要用户名密码，如果开启认证需要设置以下环境变量
      # MongoDB 默认没有用户，需要手动创建管理员用户
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: abc123456
      # 可选：初始化数据库名称（与管理员用户分开）
      # MONGO_INITDB_DATABASE: myapp
      # 时区设置
      TZ: Asia/Shanghai
    command:
      # 启动参数配置
      - --auth  # 开启认证（如果设置了root账号需要开启）
      - --bind_ip_all  # 允许所有IP连接
      - --port=27017
      # - --config=/etc/mongo/mongod.conf  # 如果挂载了配置文件可以启用
      # - --maxConns=1000  # 最大连接数设置
    # 健康检查（可选）
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 40s
    networks:
      - mongo-network

# 定义数据卷
volumes:
  mongo_data:
    driver: local
    # 可以指定存储驱动选项（可选）
    # driver_opts:
    #   type: none
    #   device: /data/mongo
    #   o: bind

networks:
  mongo-network:
    driver: bridge
```