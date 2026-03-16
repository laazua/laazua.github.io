---
prev: false
next: false
---
### 容器安全加固

---
##### 构建阶段
> **选择最小化基础镜像**: `Alpine`, `Distroless`, `Scratch`  
>> Alpine: 小巧且完整,非常适合静态编译的应用.  
>> Distroless: 由Google出品,仅包含应用及其运行时依赖,不包含shell,包管理器等.  
>> Scratch: 一个空的镜像,用于完全自定义构建,极度精简.  

> **采用多阶段构建**  
>> 将构建环境与运行环境分离.你可以在一个包含完整编译工具链的镜像中编译应用,然后将编译好的二进制文件复制到一个小得多的运行镜像中.这样,最终的运行镜像就不会包含任何构建工具和中间文件,体积和风险都大幅降低.

> **避免安装不必要的软件包**  
>> 镜像中只应包含运行应用所绝对必需的软件包.任何多余的包,比如编辑器、调试工具或未使用的库,都会无谓地扩大攻击面.

> **使用非root用户运行**  
>> 默认情况下,容器内的进程以root身份运行,这会带来巨大风险.务必在Dockerfile中创建一个普通用户,并通过USER指令切换到该用户.

> **清理缓存和临时文件**  
>> 在同一个RUN指令中,完成包安装和缓存清理,确保它们不会成为镜像的一部分.

> **锁定基础镜像版本**
>> 避免使用latest标签,因为它会变化,可能导致不可预测的构建结果.请指定确切的镜像版本,甚至更进一步,通过将镜像锁定到一个不可变的版本,确保构建的完整性和可复现性.

> **使用.dockerignore文件**
>> 排除所有与构建无关的本地文件(如.git、node_modules、本地配置文件等),防止它们意外地被打包进镜像.

---
##### 镜像部署阶段
> **集成漏洞扫描**
>> 在CI/CD流水线中集成像Trivy、Clair、HarborGuard这样的漏洞扫描工具.一旦发现高危漏洞,应立即中断流程,阻止镜像发布.

> **实施镜像签名与验证**
>> 使用Cosign或Docker Content Trust (DCT) 对镜像进行数字签名.部署时验证签名,可以确保镜像的来源可信且内容未被篡改.

---
##### 镜像运行阶段
> **应用最小权限原则**
>> 通过docker run命令的参数来限制容器的权限:
>> --cap-drop=all: 移除容器所有内核能力,然后按需添加(例如--cap-add=NET_BIND_SERVICE),这是防止权限滥用的关键一步.
>> --read-only: 将容器的根文件系统挂载为只读模式,防止恶意写入.
>> --no-new-privileges: 防止容器内的进程获得比其父进程更多的权限.

> **加强访问控制**
>> 利用Linux内核的安全模块来强化隔离.
>> 启用 AppArmor 或 SELinux 的强制访问控制(MAC)策略.
>> 使用 seccomp 配置文件来限制容器可以执行的系统调用,有效防御内核漏洞利用.

> **实施网络隔离**
>> 为不同敏感度的服务创建独立的Docker网络,避免不必要的通信.
>> 在主机层面配置防火墙规则,限制容器对外的网络访问.

---
##### 各个阶段加固示例
::: code-group
```dockerfile [选择最小化基础镜像 & 锁定版本]
# 不推荐
FROM ubuntu:latest

# 推荐：使用 Alpine 并锁定版本和 SHA
FROM alpine:3.21@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c

# 或者对于编译型语言，使用 Distroless
# FROM gcr.io/distroless/base-debian12
```

```dockerfile [多阶段构建 & 使用非 root 用户]
# ---- 第一阶段：构建阶段 ----
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# 编译一个静态链接的二进制文件
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp .

# ---- 第二阶段：运行阶段 ----
# 使用一个最小的镜像，甚至可以是 scratch
FROM alpine:3.21

# 创建非 root 用户 (UID 通常设为 1001 或 65534)
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# 从构建阶段复制二进制文件
COPY --from=builder --chown=appuser:appgroup /app/myapp /app/myapp

# 切换到非 root 用户
USER 1001

# 声明服务端口
EXPOSE 8080

# 运行应用
CMD ["/app/myapp"]
```

```dockerfile [清理缓存]
# 对于 apt (Debian/Ubuntu)
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl=7.88.1-10+deb12u8 && \
    rm -rf /var/lib/apt/lists/*

# 对于 apk (Alpine)
RUN apk add --no-cache curl=8.5.0-r0
# --no-cache 参数会自动清理临时文件，是最简单的方式
```

```text [使用 .dockerignore]
# 文件内容 .dockerignore
.git
node_modules
Dockerfile
README.md
.env
.gitignore
# 排除本地编辑器的临时文件
*.swp
*.swo
*~
```

```bash [漏洞扫描&&镜像签名&&镜像运行]
# 安装 Trivy (在 CI 环境)
# curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# 构建镜像
docker build -t myapp:latest .

# 执行扫描
# 如果存在 CRITICAL 漏洞，退出码非 0，导致 CI 失败
trivy image --severity CRITICAL --exit-code 1 --no-progress myapp:latest

# 或者生成 JSON 报告
trivy image -f json -o trivy-report.json myapp:latest

#######################################################
# 安装 Cosign
# 从 GitHub Releases 下载对应平台的二进制文件

# 生成密钥对
cosign generate-key-pair

# 使用私钥对镜像进行签名
cosign sign --key cosign.key myregistry.com/myapp:latest

# 验证镜像签名
cosign verify --key cosign.pub myregistry.com/myapp:latest

#######################################################
#@@@@@@@@@@ 移除所有 Capability 并按需添加 @@@@@@@@@
# 错误的做法：给予过多权限
# docker run -d --cap-add=ALL myapp

# 正确的做法：先全部禁止，再添加必要的权限
# 例如，如果你的应用需要监听 80 端口 (privileged port)
docker run -d \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  myapp

# 如果应用完全不需要任何 capability，则只使用 --cap-drop=ALL
docker run -d --cap-drop=ALL myapp

#@@@@@@@@@@@ 只读文件系统 & 禁止权限提升 @@@@@@@@@@@@
# 设置根文件系统只读，并防止权限提升
# 如果应用需要写入临时文件，可以挂载一个 tmpfs 卷
docker run -d \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=65536k \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  myapp

#@@@@@@@ 使用 seccomp 和 AppArmor 配置文件 @@@@@@@@
# 使用 Docker 默认的 seccomp 配置文件 (已经默认开启)
# docker run -d --security-opt seccomp=default.json myapp

# 使用 AppArmor
# 1. 加载配置文件 (在宿主机上)
# apparmor_parser -r -W myapp-profile
# 2. 运行容器时指定
docker run -d --security-opt apparmor=myapp-profile myapp

#@@@@@@@@@@@@@@@@@@@ 网络隔离 @@@@@@@@@@@@@@@@@@@@
# 创建网络
docker network create --driver bridge --internal backend-net # --internal 禁止访问外网

# 运行数据库，只接入 backend-net
docker run -d --network backend-net --name mysql mysql

# 运行应用，接入 backend-net 以便连接 DB，同时也接入 frontend-net 以便接受流量
docker network create frontend-net
docker run -d \
  --network frontend-net \
  --network backend-net \
  --name app \
  myapp

# 前端 nginx 只接入 frontend-net
docker run -d --network frontend-net -p 80:80 nginx
```
:::

---
##### k8s中安全加固

1. **基础安全上下文配置**

::: code-group
```bash [对应的Docker命令]
--user 1001
--cap-drop=ALL
--cap-add=NET_BIND_SERVICE
--read-only
--tmpfs /tmp
--security-opt=no-new-privileges:true
```

```yaml [k8s配置]
apiVersion: v1
kind: Pod
metadata:
  name: secure-app
spec:
  securityContext:                    # Pod级别的安全上下文
    runAsNonRoot: true                # 确保不以root运行
    runAsUser: 1001                   # 指定用户ID
    runAsGroup: 1001                   # 指定组ID
    fsGroup: 1001                      # 挂载卷的组ID
    
  containers:
  - name: myapp
    image: myapp:latest
    
    securityContext:                   # 容器级别的安全上下文
      allowPrivilegeEscalation: false  # 对应 --security-opt=no-new-privileges
      readOnlyRootFilesystem: true     # 对应 --read-only
      capabilities:
        drop: ["ALL"]                   # 对应 --cap-drop=ALL
        add: ["NET_BIND_SERVICE"]       # 对应 --cap-add=NET_BIND_SERVICE
    
    volumeMounts:
    - name: tmp                         # 对应 --tmpfs /tmp
      mountPath: /tmp
    
    ports:
    - containerPort: 8080
    
  volumes:
  - name: tmp
    emptyDir: {}                         # 可写的临时存储
```
:::

2. **完整的加固Pod配置示例**
::: code-group
```yaml [web应用示例]
apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web
spec:
  # Pod级别的安全策略
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    fsGroup: 10001
    
  containers:
  - name: nginx
    image: nginx:alpine
    
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
        add: ["NET_BIND_SERVICE"]  # Nginx需要绑定80端口
    
    # 环境变量（避免敏感信息硬编码）
    env:
    - name: NGINX_HOST
      value: "example.com"
    
    ports:
    - containerPort: 80
    
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: nginx-cache
      mountPath: /var/cache/nginx
    - name: nginx-run
      mountPath: /var/run
    - name: config
      mountPath: /etc/nginx/conf.d
      readOnly: true
    
    resources:
      limits:
        memory: "256Mi"
        cpu: "500m"
      requests:
        memory: "128Mi"
        cpu: "250m"
    
  volumes:
  - name: tmp
    emptyDir: {}
  - name: nginx-cache
    emptyDir: {}
  - name: nginx-run
    emptyDir: {}
  - name: config
    configMap:
      name: nginx-config
```

```yaml [需要写入持久化数据的应用示例]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-storage
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
        
      containers:
      - name: app
        image: myapp:latest
        
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: data
          mountPath: /app/data  # 数据写入这个目录
        - name: config
          mountPath: /app/config
          readOnly: true
        
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        
      volumes:
      - name: tmp
        emptyDir: {}
      - name: data
        persistentVolumeClaim:
          claimName: app-data-pvc
      - name: config
        configMap:
          name: app-config
```
:::

3. **使用Pod Security Standards**
```yaml
# 在命名空间级别强制实施
apiVersion: v1
kind: Namespace
metadata:
  name: secure-namespace
  labels:
    pod-security.kubernetes.io/enforce: restricted  # 强制使用restricted级别
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: baseline
---
# 或者使用Pod Security Admission配置
apiVersion: pod-security.admission.config.k8s.io/v1
kind: PodSecurityConfiguration
defaults:
  enforce: "restricted"
  enforce-version: "latest"
  audit: "restricted"
  warn: "baseline"
exemptions:
  usernames: []
  runtimeClasses: []
  namespaces: ["kube-system"]
```

4. **使用NetworkPolicy实现网络隔离**
::: code-group
```bash [对应的Docker网络隔离命令]
docker network create --internal backend-net
docker network create frontend-net
```

```yaml [Kubernetes NetworkPolicy配置]
# 后端服务 - 只允许从前端访问
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
---
# 数据库服务 - 只允许后端访问，禁止访问外网
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: database-network-policy
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: backend
    ports:
    - protocol: TCP
      port: 5432
  egress: []  # 禁止所有出站流量
```
:::

5. **使用PodDisruptionBudget保证服务可用性**
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2  # 或使用 maxUnavailable: 1
  selector:
    matchLabels:
      app: myapp
```

6. **完整的加固Deployment示例**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-deployment
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      # 节点选择（可选）
      nodeSelector:
        kubernetes.io/os: linux
      
      # Pod安全上下文
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:                  # seccomp配置
          type: RuntimeDefault            # 使用容器运行时的默认配置
      
      containers:
      - name: app
        image: myapp:latest
        imagePullPolicy: Always
        
        # 容器安全上下文
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
          privileged: false
          runAsNonRoot: true
        
        # 资源限制
        resources:
          limits:
            memory: "512Mi"
            cpu: "1000m"
          requests:
            memory: "256Mi"
            cpu: "500m"
        
        # 探针配置
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        
        # 挂载点
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: data
          mountPath: /app/data
        - name: config
          mountPath: /app/config
          readOnly: true
        
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
      
      # 卷定义
      volumes:
      - name: tmp
        emptyDir: {}
      - name: data
        persistentVolumeClaim:
          claimName: app-data-pvc
      - name: config
        configMap:
          name: app-config
      
      # 镜像拉取密钥
      imagePullSecrets:
      - name: registry-secret
      
      # 重启策略
      restartPolicy: Always
      
      # 终止宽限期
      terminationGracePeriodSeconds: 60
# 对应的服务
apiVersion: v1
kind: Service
metadata:
  name: secure-app-service
spec:
  selector:
    app: secure-app
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

7. **使用PodSecurityPolicy（旧版本）或Kyverno（推荐）**
```yaml
# Kyverno策略示例 - 强制使用安全配置
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-pod-security
spec:
  validationFailureAction: enforce
  rules:
  - name: check-containers
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Pod必须遵循安全最佳实践"
      pattern:
        spec:
          securityContext:
            runAsNonRoot: true
          containers:
          - securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities:
                drop: ["ALL"]
```