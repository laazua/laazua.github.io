---
title: 编译优化
prev:
    text: Golang
    link:  /posts/language/golang/index
next:
    text: 项目代码组织
    link: /posts/language/golang/project
---

##### 编译

```shell
# 设置静态编译及平台架构
CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# trivy fs .
# trivy config .

# 优化编译目标体积
go build -mod=readonly -trimpath -ldflags "-s -w" -o app
upx --lzma --best app
```