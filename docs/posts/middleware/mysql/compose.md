---
prev: false
next: false
---

### compose配置
```yaml
---
services:
  mysql:
    # 官方推荐使用指定版本，避免latest意外升级
    image: mysql:8.0
    container_name: mysql8
    restart: unless-stopped
    ports:
      - "3306:3306"
    volumes:
      # 数据持久化
      - mysql_data:/var/lib/mysql
      # 初始化脚本目录（可选，放置.sql文件）
      #- ./init:/docker-entrypoint-initdb.d
      # 配置文件挂载（可选）
      # - ./my.cnf:/etc/mysql/conf.d/my.cnf
    environment:
      # 必须设置root密码
      MYSQL_ROOT_PASSWORD: abc123456
      # 可选：创建数据库
      #MYSQL_DATABASE: myapp
      # 可选：创建用户（会授予MYSQL_DATABASE的所有权限）
      #MYSQL_USER: myuser
      #MYSQL_PASSWORD: userpassword
      # 时区设置
      TZ: Asia/Shanghai
    command:
      # 启动参数配置
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --max_connections=1000
      - --default-time-zone=+8:00
    networks:
      - mysql-network

# 这里定义的数据卷默认位置:
# /var/lib/docker/volumes/
volumes:
  mysql_data:
    driver: local

networks:
  mysql-network:
    driver: bridge
```