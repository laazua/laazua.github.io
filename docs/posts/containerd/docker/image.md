##### 生产用的轻量级基础镜像


* **scratch 空镜像**
```dockerfile
FROM scratch
# 添加你的文件
COPY myapp /
CMD ["/myapp"]
```

* **google distroless 镜像**
```dockerfile
# 基础镜像（仅 glibc）
FROM gcr.io/distroless/static-debian11

# Java 应用
FROM gcr.io/distroless/java17-debian11

# Python 应用
FROM gcr.io/distroless/python3-debian11

# Node.js 应用
FROM gcr.io/distroless/nodejs18-debian11

# Go 应用（完全静态）
FROM gcr.io/distroless/static-debian11

# .NET Core 应用
FROM gcr.io/distroless/dotnet
```