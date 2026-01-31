---
title: Dockerfile
prev:
    text: Docker 语法指令
    link:  /posts/containerd/docker/base
next:
    text: Kubernetes
    link: /posts/containerd/k8s/index
---

##### [Dockerfile](https://docs.docker.com/reference/dockerfile/)

- **示例**
```Dockerfile
# ===== 构建阶段 =====
FROM python:3.10-slim AS builder
LABEL stage=builder
WORKDIR /build

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --user -r requirements.txt

# ===== 运行阶段 =====
FROM gcr.io/distroless/python3-debian12
LABEL maintainer="ops@example.com"
ENV TZ=Asia/Shanghai \
    APP_HOME=/app \
    PYTHONUNBUFFERED=1

WORKDIR $APP_HOME
COPY --from=builder /root/.local /root/.local
COPY . .

USER nobody
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

ENTRYPOINT ["/root/.local/bin/python", "main.py"]

```