---
prev: false
next: false
---

### compose配置
```yaml
# Use postgres/example user/password credentials

services:

  db:
    image: postgres
    restart: always
    # set shared memory limit when using docker compose
    shm_size: 128mb
    # or set shared memory limit when deploy via swarm stack
    #volumes:
    #  - type: tmpfs
    #    target: /dev/shm
    #    tmpfs:
    #      size: 134217728 # 128*2^20 bytes = 128Mb
    ports:
      - "5432:5432"
    volumes:
      - ./pg-data:/var/lib/postgresql
    environment:
      POSTGRES_PASSWORD: abc123456
```
---

### 操作命令
```bash
# 启动实例: 
sudo docker compose up -d
# 停止实例: 
sudo docker compose down -v
# 删除数据卷: 
sudo docker volume rm pg-data
# 端口查看: 
sudo docker ps --format "table {{.Names}}\t{{.Ports}}"
```